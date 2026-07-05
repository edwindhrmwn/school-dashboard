import { useEffect } from 'react'
import { useExtracurriculars } from '../../hooks/useExtracurriculars'
import { ExtracurricularsView } from './ExtracurricularsView'

export default function ExtracurricularsPage() {
  const { extracurriculars, loading, fetchAll, create, update, remove } = useExtracurriculars()

  useEffect(() => {
    const ctrl = new AbortController()
    fetchAll(ctrl.signal)
    return () => ctrl.abort()
  }, [fetchAll])

  return (
    <ExtracurricularsView
      extracurriculars={extracurriculars}
      loading={loading}
      onCreate={create}
      onUpdate={update}
      onDelete={remove}
    />
  )
}
