import axios from 'axios'
import toast from 'react-hot-toast'
import { SPREADSHEET_ID, sheetIds } from '../config/sheets'

const BASE = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}`

const api = axios.create({ baseURL: BASE })

// Inject Bearer token from localStorage on every request
api.interceptors.request.use((config) => {
  const raw = localStorage.getItem('goog_token')
  if (!raw) {
    const err = new Error('NOT_AUTHENTICATED')
    err.code = 'NOT_AUTHENTICATED'
    return Promise.reject(err)
  }
  const token = JSON.parse(raw)
  if (Date.now() > token.expires_at) {
    const err = new Error('TOKEN_EXPIRED')
    err.code = 'TOKEN_EXPIRED'
    window.dispatchEvent(new Event('TOKEN_EXPIRED'))
    return Promise.reject(err)
  }
  config.headers.Authorization = `Bearer ${token.access_token}`
  return config
})

// Surface Sheets API errors as readable messages
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg = err.response?.data?.error?.message ?? err.message
    if (err.code !== 'NOT_AUTHENTICATED' && err.code !== 'TOKEN_EXPIRED') {
      toast.error(`Sheets API: ${msg}`)
    }
    return Promise.reject(err)
  },
)

// Fetch sheetId integers from spreadsheet metadata (needed for deleteRow)
export async function initSheetIds() {
  const res = await api.get('', { params: { fields: 'sheets(properties(sheetId,title))' } })
  res.data.sheets.forEach(({ properties: { sheetId, title } }) => {
    if (title in sheetIds) sheetIds[title] = sheetId
  })
}

export const sheetsClient = {
  async get(sheet) {
    const res = await api.get(`/values/${encodeURIComponent(sheet.tab)}!A:${sheet.lastCol}`)
    return res.data.values ?? []
  },

  async append(sheet, rows) {
    await api.post(
      `/values/${encodeURIComponent(sheet.tab)}!A1:append`,
      { values: rows },
      { params: { valueInputOption: 'USER_ENTERED', insertDataOption: 'INSERT_ROWS' } },
    )
  },

  async update(sheet, rowIndex, rows) {
    const range = `${sheet.tab}!A${rowIndex}:${sheet.lastCol}${rowIndex}`
    await api.put(
      `/values/${encodeURIComponent(range)}`,
      { values: rows },
      { params: { valueInputOption: 'USER_ENTERED' } },
    )
  },

  // Update many rows in a single request. updates: [{ rowIndex, values: [...] }]
  async batchUpdate(sheet, updates) {
    if (!updates.length) return
    const data = updates.map((u) => ({
      range: `${sheet.tab}!A${u.rowIndex}:${sheet.lastCol}${u.rowIndex}`,
      values: [u.values],
    }))
    await api.post('/values:batchUpdate', { valueInputOption: 'USER_ENTERED', data })
  },

  async deleteRow(sheet, rowIndex) {
    const sheetId = sheetIds[sheet.tab]
    if (sheetId === null) throw new Error(`sheetId not loaded for tab "${sheet.tab}"`)
    await api.post('/:batchUpdate', {
      requests: [
        {
          deleteDimension: {
            range: {
              sheetId,
              dimension: 'ROWS',
              startIndex: rowIndex - 1,
              endIndex: rowIndex,
            },
          },
        },
      ],
    })
  },
}
