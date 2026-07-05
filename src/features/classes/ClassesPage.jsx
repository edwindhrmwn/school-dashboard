import { useEffect } from 'react'
import { useClasses } from '../../hooks/useClasses'
import { ClassesView } from './ClassesView'

export default function ClassesPage() {
  const { classes, loading, fetchAll, create, update, remove } = useClasses()

  useEffect(() => {
    const ctrl = new AbortController()
    fetchAll(ctrl.signal)
    return () => ctrl.abort()
  }, [fetchAll])

  return (
    <ClassesView
      classes={classes}
      loading={loading}
      onCreate={create}
      onUpdate={update}
      onDelete={remove}
    />
  )
}
