import { useEffect } from 'react'
import { useStudents } from '../../hooks/useStudents'
import { useClasses } from '../../hooks/useClasses'
import { PromotionView } from './PromotionView'

export default function PromotionPage() {
  const { students, loading, fetchAll, bulkPromote } = useStudents()
  const { classes, fetchAll: fetchClasses } = useClasses()

  useEffect(() => {
    const ctrl = new AbortController()
    fetchAll(ctrl.signal)
    fetchClasses(ctrl.signal)
    return () => ctrl.abort()
  }, [fetchAll, fetchClasses])

  return (
    <PromotionView
      students={students}
      classes={classes}
      loading={loading}
      onProcess={bulkPromote}
    />
  )
}
