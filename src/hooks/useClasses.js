import { useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import { sheetsClient } from '../lib/sheetsClient'
import { SHEETS, rowToKelas, kelasToRow } from '../config/sheets'
import { auditStampCreate, auditStampUpdate, auditStampDelete, isActiveRecord } from '../lib/audit'

export function useClasses() {
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchAll = useCallback(async (signal) => {
    setLoading(true)
    setError(null)
    try {
      const rows = await sheetsClient.get(SHEETS.KELAS)
      if (signal?.aborted) return
      setClasses(rows.slice(1).map((r, i) => rowToKelas(r, i + 2)).filter(isActiveRecord))
    } catch (e) {
      if (!signal?.aborted) setError(e.message)
    } finally {
      if (!signal?.aborted) setLoading(false)
    }
  }, [])

  const create = useCallback(async (data) => {
    const nextId = classes.reduce((max, c) => Math.max(max, Number(c.id) || 0), 0) + 1
    await sheetsClient.append(SHEETS.KELAS, [kelasToRow({ ...data, id: nextId, ...auditStampCreate() })])
    toast.success('Kelas berhasil ditambahkan.')
    await fetchAll()
  }, [fetchAll, classes])

  const update = useCallback(async (rowIndex, data) => {
    const existing = classes.find((c) => c._rowIndex === rowIndex)
    await sheetsClient.update(SHEETS.KELAS, rowIndex, [kelasToRow({ ...data, ...auditStampUpdate(existing) })])
    toast.success('Kelas berhasil diperbarui.')
    await fetchAll()
  }, [fetchAll, classes])

  const remove = useCallback(async (rowIndex) => {
    const existing = classes.find((c) => c._rowIndex === rowIndex)
    await sheetsClient.update(SHEETS.KELAS, rowIndex, [kelasToRow({ ...existing, ...auditStampDelete(existing) })])
    toast.success('Kelas berhasil dihapus.')
    await fetchAll()
  }, [fetchAll, classes])

  return { classes, loading, error, fetchAll, create, update, remove }
}
