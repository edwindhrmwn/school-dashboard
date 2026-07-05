import { useEffect } from 'react'
import { useTeachers } from '../../hooks/useTeachers'
import { useClasses } from '../../hooks/useClasses'
import { TeachersView } from './TeachersView'

export default function TeachersPage() {
  const { teachers, loading, fetchAll, create, update, remove } = useTeachers()
  const { classes, fetchAll: fetchClasses } = useClasses()

  useEffect(() => {
    const ctrl = new AbortController()
    fetchAll(ctrl.signal)
    fetchClasses(ctrl.signal)
    return () => ctrl.abort()
  }, [fetchAll, fetchClasses])

  return (
    <TeachersView
      teachers={teachers}
      loading={loading}
      classes={classes}
      onCreate={create}
      onUpdate={update}
      onDelete={remove}
    />
  )
}
