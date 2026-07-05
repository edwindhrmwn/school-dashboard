import { useEffect } from 'react'
import { usePoints } from '../../hooks/usePoints'
import { useClasses } from '../../hooks/useClasses'
import { useExtracurriculars } from '../../hooks/useExtracurriculars'
import { useStudents } from '../../hooks/useStudents'
import { PointsView } from './PointsView'

export default function PointsPage() {
  const { points, loading, fetchAll, create, update, remove } = usePoints()
  const { classes, fetchAll: fetchClasses } = useClasses()
  const { extracurriculars, fetchAll: fetchExtras } = useExtracurriculars()
  const { students, fetchAll: fetchStudents } = useStudents()

  useEffect(() => {
    const ctrl = new AbortController()
    fetchAll(ctrl.signal)
    fetchClasses(ctrl.signal)
    fetchExtras(ctrl.signal)
    fetchStudents(ctrl.signal)
    return () => ctrl.abort()
  }, [fetchAll, fetchClasses, fetchExtras, fetchStudents])

  return (
    <PointsView
      points={points}
      loading={loading}
      extracurriculars={extracurriculars}
      classes={classes}
      students={students}
      onCreate={create}
      onUpdate={update}
      onDelete={remove}
    />
  )
}
