import { useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import { sheetsClient } from '../lib/sheetsClient'
import { SHEETS, rowToNilai, nilaiToRow } from '../config/sheets'
import { auditStampCreate, auditStampUpdate, auditStampDelete, isActiveRecord } from '../lib/audit'

export function usePoints() {
  const [points, setPoints] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchAll = useCallback(async (signal) => {
    setLoading(true)
    setError(null)
    try {
      const rows = await sheetsClient.get(SHEETS.NILAI)
      if (signal?.aborted) return
      setPoints(rows.slice(1).map((r, i) => rowToNilai(r, i + 2)).filter(isActiveRecord))
    } catch (e) {
      if (!signal?.aborted) setError(e.message)
    } finally {
      if (!signal?.aborted) setLoading(false)
    }
  }, [])

  const create = useCallback(async (data) => {
    await sheetsClient.append(SHEETS.NILAI, [nilaiToRow({ ...data, ...auditStampCreate() })])
    toast.success('Nilai berhasil ditambahkan.')
    await fetchAll()
  }, [fetchAll])

  const update = useCallback(async (rowIndex, data) => {
    const existing = points.find((p) => p._rowIndex === rowIndex)
    await sheetsClient.update(SHEETS.NILAI, rowIndex, [nilaiToRow({ ...data, ...auditStampUpdate(existing) })])
    toast.success('Nilai berhasil diperbarui.')
    await fetchAll()
  }, [fetchAll, points])

  const remove = useCallback(async (rowIndex) => {
    const existing = points.find((p) => p._rowIndex === rowIndex)
    await sheetsClient.update(SHEETS.NILAI, rowIndex, [nilaiToRow({ ...existing, ...auditStampDelete(existing) })])
    toast.success('Nilai berhasil dihapus.')
    await fetchAll()
  }, [fetchAll, points])

  return { points, loading, error, fetchAll, create, update, remove }
}
