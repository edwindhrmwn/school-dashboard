import { useState } from 'react'
import { DataTable } from '../../components/DataTable'
import { Modal } from '../../components/Modal'
import { ClassFormView } from './ClassFormView'

const COLUMNS = [
  { key: 'id', label: 'ID' },
  { key: 'className', label: 'Nama Kelas' },
  { key: 'pic1', label: 'Guru 1 (PIC 1)' },
  { key: 'pic2', label: 'Guru 2 (PIC 2)' },
]

export function ClassesView({ classes, loading, teachers, onCreate, onUpdate, onDelete }) {
  const [modal, setModal] = useState(null)
  const [selected, setSelected] = useState(null)

  function openEdit(row) { setSelected(row); setModal('edit') }
  function openCreate() { setSelected(null); setModal('create') }
  function closeModal() { setModal(null); setSelected(null) }

  async function handleSubmit(data) {
    if (modal === 'create') await onCreate(data)
    else await onUpdate(selected._rowIndex, { ...data, id: selected.id })
    closeModal()
  }

  return (
    <div className="p-6 h-full flex flex-col min-h-0">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kelas</h1>
          <p className="text-sm text-gray-500 mt-0.5">Kelola level dan nama kelas</p>
        </div>
        <button onClick={openCreate}
          className="px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 font-medium">
          + Tambah Kelas
        </button>
      </div>
      <div className="flex-1 min-h-0">
        <DataTable
          columns={COLUMNS}
          rows={classes}
          loading={loading}
          hideIndex
          onEdit={openEdit}
          onDelete={(row) => onDelete(row._rowIndex)}
        />
      </div>
      {modal && (
        <Modal title={modal === 'create' ? 'Tambah Kelas' : 'Edit Kelas'} onClose={closeModal}>
          <ClassFormView initialValues={selected} teachers={teachers} onSubmit={handleSubmit} onCancel={closeModal} />
        </Modal>
      )}
    </div>
  )
}
