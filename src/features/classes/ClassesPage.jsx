import { useEffect } from 'react'
import { useClasses } from '../../hooks/useClasses'
import { useTeachers } from '../../hooks/useTeachers'
import { ClassesView } from './ClassesView'

export default function ClassesPage() {
  const { classes, loading, fetchAll, create, update, remove } = useClasses()
  const { teachers, fetchAll: fetchTeachers } = useTeachers()

  useEffect(() => {
    const ctrl = new AbortController()
    fetchAll(ctrl.signal)
    fetchTeachers(ctrl.signal)
    return () => ctrl.abort()
  }, [fetchAll, fetchTeachers])

  return (
    <ClassesView
      classes={classes}
      loading={loading}
      teachers={teachers}
      onCreate={create}
      onUpdate={update}
      onDelete={remove}
    />
  )
}
