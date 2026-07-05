import { useEffect } from 'react'
import { useStudents } from '../../hooks/useStudents'
import { useClasses } from '../../hooks/useClasses'
import { useExtracurriculars } from '../../hooks/useExtracurriculars'
import { usePoints } from '../../hooks/usePoints'
import { StudentsView } from './StudentsView'

export default function StudentsPage() {
  const { students, loading, fetchAll, create, update, remove } = useStudents()
  const { classes, fetchAll: fetchClasses } = useClasses()
  const { extracurriculars, fetchAll: fetchExtras } = useExtracurriculars()
  const { points, fetchAll: fetchPoints } = usePoints()

  useEffect(() => {
    const ctrl = new AbortController()
    fetchAll(ctrl.signal)
    fetchClasses(ctrl.signal)
    fetchExtras(ctrl.signal)
    fetchPoints(ctrl.signal)
    return () => ctrl.abort()
  }, [fetchAll, fetchClasses, fetchExtras, fetchPoints])

  return (
    <StudentsView
      students={students}
      loading={loading}
      classes={classes}
      extracurriculars={extracurriculars}
      points={points}
      onCreate={create}
      onUpdate={update}
      onDelete={remove}
    />
  )
}
