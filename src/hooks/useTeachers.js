import { useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import { sheetsClient } from '../lib/sheetsClient'
import { SHEETS, rowToGuru, guruToRow } from '../config/sheets'
import { auditStampCreate, auditStampUpdate, auditStampDelete, isActiveRecord } from '../lib/audit'

export function useTeachers() {
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchAll = useCallback(async (signal) => {
    setLoading(true)
    setError(null)
    try {
      const rows = await sheetsClient.get(SHEETS.GURU)
      if (signal?.aborted) return
      setTeachers(rows.slice(1).map((r, i) => rowToGuru(r, i + 2)).filter(isActiveRecord))
    } catch (e) {
      if (!signal?.aborted) setError(e.message)
    } finally {
      if (!signal?.aborted) setLoading(false)
    }
  }, [])

  const create = useCallback(async (data) => {
    await sheetsClient.append(SHEETS.GURU, [guruToRow({ ...data, ...auditStampCreate() })])
    toast.success('Guru berhasil ditambahkan.')
    await fetchAll()
  }, [fetchAll])

  const update = useCallback(async (rowIndex, data) => {
    const existing = teachers.find((t) => t._rowIndex === rowIndex)
    await sheetsClient.update(SHEETS.GURU, rowIndex, [guruToRow({ ...data, ...auditStampUpdate(existing) })])
    toast.success('Guru berhasil diperbarui.')
    await fetchAll()
  }, [fetchAll, teachers])

  const remove = useCallback(async (rowIndex) => {
    const existing = teachers.find((t) => t._rowIndex === rowIndex)
    await sheetsClient.update(SHEETS.GURU, rowIndex, [guruToRow({ ...existing, ...auditStampDelete(existing) })])
    toast.success('Guru berhasil dihapus.')
    await fetchAll()
  }, [fetchAll, teachers])

  return { teachers, loading, error, fetchAll, create, update, remove }
}
