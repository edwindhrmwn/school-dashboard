import { useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import { sheetsClient } from '../lib/sheetsClient'
import { SHEETS, rowToEkstra, ekstraToRow } from '../config/sheets'
import { auditStampCreate, auditStampUpdate, auditStampDelete, isActiveRecord } from '../lib/audit'

export function useExtracurriculars() {
  const [extracurriculars, setExtracurriculars] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchAll = useCallback(async (signal) => {
    setLoading(true)
    setError(null)
    try {
      const rows = await sheetsClient.get(SHEETS.EKSTRA)
      if (signal?.aborted) return
      setExtracurriculars(rows.slice(1).map((r, i) => rowToEkstra(r, i + 2)).filter(isActiveRecord))
    } catch (e) {
      if (!signal?.aborted) setError(e.message)
    } finally {
      if (!signal?.aborted) setLoading(false)
    }
  }, [])

  const create = useCallback(async (data) => {
    await sheetsClient.append(SHEETS.EKSTRA, [ekstraToRow({ ...data, ...auditStampCreate() })])
    toast.success('Ekstrakulikuler berhasil ditambahkan.')
    await fetchAll()
  }, [fetchAll])

  const update = useCallback(async (rowIndex, data) => {
    const existing = extracurriculars.find((e) => e._rowIndex === rowIndex)
    await sheetsClient.update(SHEETS.EKSTRA, rowIndex, [ekstraToRow({ ...data, ...auditStampUpdate(existing) })])
    toast.success('Ekstrakulikuler berhasil diperbarui.')
    await fetchAll()
  }, [fetchAll, extracurriculars])

  const remove = useCallback(async (rowIndex) => {
    const existing = extracurriculars.find((e) => e._rowIndex === rowIndex)
    await sheetsClient.update(SHEETS.EKSTRA, rowIndex, [ekstraToRow({ ...existing, ...auditStampDelete(existing) })])
    toast.success('Ekstrakulikuler berhasil dihapus.')
    await fetchAll()
  }, [fetchAll, extracurriculars])

  return { extracurriculars, loading, error, fetchAll, create, update, remove }
}
