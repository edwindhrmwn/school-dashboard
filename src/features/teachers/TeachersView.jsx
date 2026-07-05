import { useState } from 'react'
import { DataTable } from '../../components/DataTable'
import { Modal } from '../../components/Modal'
import { TeacherFormView } from './TeacherFormView'

const COLUMNS = [
  { key: 'noInduk', label: 'No. Induk' },
  {
    key: 'name',
    label: 'Nama',
    render: (v, row) => [row.titleBeforeName, v, row.titleAfterName].filter(Boolean).join(' '),
  },
  { key: 'className', label: 'Kelas', render: (v) => v || '—' },
  { key: 'pic', label: 'PIC', render: (v) => v || '—' },
]

export function TeachersView({ teachers, loading, classes, onCreate, onUpdate, onDelete }) {
  const [modal, setModal] = useState(null)
  const [selected, setSelected] = useState(null)

  function openEdit(row) { setSelected(row); setModal('edit') }
  function openCreate() { setSelected(null); setModal('create') }
  function closeModal() { setModal(null); setSelected(null) }

  async function handleSubmit(data) {
    if (modal === 'create') await onCreate(data)
    else await onUpdate(selected._rowIndex, data)
    closeModal()
  }

  return (
    <div className="p-6 h-full flex flex-col min-h-0">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Guru</h1>
          <p className="text-sm text-gray-500 mt-0.5">Kelola data guru</p>
        </div>
        <button onClick={openCreate}
          className="px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 font-medium">
          + Tambah Guru
        </button>
      </div>
      <div className="flex-1 min-h-0">
        <DataTable
          columns={COLUMNS}
          rows={teachers}
          loading={loading}
          hideIndex
          onEdit={openEdit}
          onDelete={(row) => onDelete(row._rowIndex)}
        />
      </div>
      {modal && (
        <Modal title={modal === 'create' ? 'Tambah Guru' : 'Edit Guru'} onClose={closeModal}>
          <TeacherFormView
            initialValues={selected}
            classes={classes}
            onSubmit={handleSubmit}
            onCancel={closeModal}
          />
        </Modal>
      )}
    </div>
  )
}
