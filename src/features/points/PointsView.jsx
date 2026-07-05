import { useState } from 'react'
import { DataTable } from '../../components/DataTable'
import { Modal } from '../../components/Modal'
import { PointFormView } from './PointFormView'

const COLUMNS = [
  { key: 'extracurricular', label: 'Ekstrakulikuler' },
  { key: 'levelClass', label: 'Level - Kelas' },
  { key: 'nisn', label: 'NISN' },
  { key: 'namaLengkap', label: 'Nama Lengkap' },
  {
    key: 'point',
    label: 'Poin',
    render: (v) => (
      <span className={`font-semibold ${Number(v) >= 75 ? 'text-green-600' : Number(v) >= 50 ? 'text-yellow-600' : 'text-red-500'}`}>
        {v}
      </span>
    ),
  },
]

export function PointsView({ points, loading, extracurriculars, classes, students, onCreate, onUpdate, onDelete }) {
  const [modal, setModal] = useState(null)
  const [selected, setSelected] = useState(null)
  const [filterClass, setFilterClass] = useState('')
  const [filterEkstra, setFilterEkstra] = useState('')

  function openEdit(row) { setSelected(row); setModal('edit') }
  function openCreate() { setSelected(null); setModal('create') }
  function closeModal() { setModal(null); setSelected(null) }

  async function handleSubmit(data) {
    if (modal === 'create') await onCreate(data)
    else await onUpdate(selected._rowIndex, data)
    closeModal()
  }

  const filtered = points.filter((p) => {
    const matchClass = !filterClass || p.levelClass === filterClass
    const matchEkstra = !filterEkstra || p.extracurricular === filterEkstra
    return matchClass && matchEkstra
  })

  return (
    <div className="p-6 h-full flex flex-col min-h-0">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nilai Ekstrakulikuler</h1>
          <p className="text-sm text-gray-500 mt-0.5">Poin per siswa per kegiatan</p>
        </div>
        <button onClick={openCreate}
          className="px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 font-medium">
          + Tambah Nilai
        </button>
      </div>

      <div className="flex gap-3 mb-4 flex-wrap shrink-0">
        <select
          value={filterClass}
          onChange={(e) => setFilterClass(e.target.value)}
          className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">Semua Kelas</option>
          {classes.map((c) => <option key={c._rowIndex} value={c.className}>{c.className}</option>)}
        </select>
        <select
          value={filterEkstra}
          onChange={(e) => setFilterEkstra(e.target.value)}
          className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">Semua Ekstra</option>
          {extracurriculars.map((e) => <option key={e._rowIndex} value={e.name}>{e.name}</option>)}
        </select>
        {(filterClass || filterEkstra) && (
          <button onClick={() => { setFilterClass(''); setFilterEkstra('') }}
            className="text-sm text-gray-500 hover:text-gray-700 px-2">
            × Reset filter
          </button>
        )}
      </div>

      <div className="flex-1 min-h-0">
        <DataTable
          columns={COLUMNS}
          rows={filtered}
          loading={loading}
          onEdit={openEdit}
          onDelete={(row) => onDelete(row._rowIndex)}
          searchable={false}
        />
      </div>

      {modal && (
        <Modal title={modal === 'create' ? 'Tambah Nilai' : 'Edit Nilai'} onClose={closeModal}>
          <PointFormView
            initialValues={selected}
            extracurriculars={extracurriculars}
            classes={classes}
            students={students}
            onSubmit={handleSubmit}
            onCancel={closeModal}
          />
        </Modal>
      )}
    </div>
  )
}
