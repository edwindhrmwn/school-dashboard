import { useEffect } from 'react'
import { useExtracurriculars } from '../../hooks/useExtracurriculars'
import { useTeachers } from '../../hooks/useTeachers'
import { ExtracurricularsView } from './ExtracurricularsView'

export default function ExtracurricularsPage() {
  const { extracurriculars, loading, fetchAll, create, update, remove } = useExtracurriculars()
  const { teachers, fetchAll: fetchTeachers } = useTeachers()

  useEffect(() => {
    const ctrl = new AbortController()
    fetchAll(ctrl.signal)
    fetchTeachers(ctrl.signal)
    return () => ctrl.abort()
  }, [fetchAll, fetchTeachers])

  return (
    <ExtracurricularsView
      extracurriculars={extracurriculars}
      loading={loading}
      teachers={teachers}
      onCreate={create}
      onUpdate={update}
      onDelete={remove}
    />
  )
}
