import { useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import { sheetsClient } from '../lib/sheetsClient'
import { SHEETS, rowToStudent, studentToRow } from '../config/sheets'
import { auditStampCreate, auditStampUpdate, auditStampDelete, isActiveRecord } from '../lib/audit'

export function useStudents() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchAll = useCallback(async (signal) => {
    setLoading(true)
    setError(null)
    try {
      const rows = await sheetsClient.get(SHEETS.SISWA)
      if (signal?.aborted) return
      setStudents(rows.slice(1).map((r, i) => rowToStudent(r, i + 2)).filter(isActiveRecord))
    } catch (e) {
      if (!signal?.aborted) setError(e.message)
    } finally {
      if (!signal?.aborted) setLoading(false)
    }
  }, [])

  const create = useCallback(async (data) => {
    await sheetsClient.append(SHEETS.SISWA, [studentToRow({ ...data, ...auditStampCreate() })])
    toast.success('Siswa berhasil ditambahkan.')
    await fetchAll()
  }, [fetchAll])

  const update = useCallback(async (rowIndex, data) => {
    const existing = students.find((s) => s._rowIndex === rowIndex)
    await sheetsClient.update(SHEETS.SISWA, rowIndex, [studentToRow({ ...data, ...auditStampUpdate(existing) })])
    toast.success('Data siswa berhasil diperbarui.')
    await fetchAll()
  }, [fetchAll, students])

  // Soft delete: set IS_ACTIVE=0, keep the row for the audit trail
  const remove = useCallback(async (rowIndex) => {
    const existing = students.find((s) => s._rowIndex === rowIndex)
    await sheetsClient.update(SHEETS.SISWA, rowIndex, [studentToRow({ ...existing, ...auditStampDelete(existing) })])
    toast.success('Siswa berhasil dihapus.')
    await fetchAll()
  }, [fetchAll, students])

  // Bulk grade promotion. changes: [{ student, kelas?, status? }]
  // Only students that actually change are passed (retained students are skipped by caller).
  const bulkPromote = useCallback(async (changes) => {
    if (!changes.length) return
    const updates = changes.map(({ student, kelas, status }) => ({
      rowIndex: student._rowIndex,
      values: studentToRow({
        ...student,
        ...(kelas != null ? { kelas } : {}),
        ...(status != null ? { status } : {}),
        ...auditStampUpdate(student),
      }),
    }))
    await sheetsClient.batchUpdate(SHEETS.SISWA, updates)
    toast.success(`${updates.length} siswa berhasil diproses.`)
    await fetchAll()
  }, [fetchAll])

  return { students, loading, error, fetchAll, create, update, remove, bulkPromote }
}
