import { useState, useMemo } from 'react'
import { DataTable } from '../../components/DataTable'
import { Modal } from '../../components/Modal'
import { StudentFormView } from './StudentFormView'
import { StudentDetailView } from './StudentDetailView'

const STATUS_COLORS = {
  Aktif: 'bg-green-100 text-green-700',
  'Tidak Aktif': 'bg-gray-100 text-gray-600',
  Pindah: 'bg-yellow-100 text-yellow-700',
  Lulus: 'bg-blue-100 text-blue-700',
}

const COLUMNS = [
  { key: 'nis', label: 'NIS' },
  { key: 'nisn', label: 'NISN' },
  { key: 'namaSiswa', label: 'Nama Lengkap' },
  { key: 'kelas', label: 'Kelas' },
  { key: 'guru1', label: 'Guru 1', render: (v) => v || '—' },
  { key: 'guru2', label: 'Guru 2', render: (v) => v || '—' },
  { key: 'tglLahir', label: 'Tgl Lahir' },
  { key: 'usia', label: 'Usia', render: (v) => v ? `${v} thn` : '—' },
  {
    key: 'status',
    label: 'Status',
    render: (v) => (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[v] ?? 'bg-gray-100 text-gray-600'}`}>{v}</span>
    ),
  },
]

export function StudentsView({ students, loading, classes, extracurriculars, points, onCreate, onUpdate, onDelete }) {
  const [modal, setModal] = useState(null)
  const [selected, setSelected] = useState(null)

  // Inner join: student.kelas → Kelas.className, ambil PIC_1/PIC_2 sebagai Guru 1/2
  const classMap = useMemo(() => {
    const m = {}
    classes.forEach((c) => { m[c.className] = c })
    return m
  }, [classes])

  const enrichedStudents = useMemo(
    () =>
      students.map((s) => ({
        ...s,
        guru1: classMap[s.kelas]?.pic1 ?? '',
        guru2: classMap[s.kelas]?.pic2 ?? '',
      })),
    [students, classMap],
  )

  function openDetail(row) { setSelected(row); setModal('detail') }
  function openCreate() { setSelected(null); setModal('create') }
  function openEdit(row) { setSelected(row); setModal('edit') }
  function closeModal() { setModal(null); setSelected(null) }

  async function handleSubmit(data) {
    // Simpan juga guru dari kelas terpilih ke kolom WALI KELAS di sheet siswa
    const cls = classMap[data.kelas]
    const enriched = { ...data, waliKelas1: cls?.pic1 ?? '', waliKelas2: cls?.pic2 ?? '' }
    if (modal === 'create') await onCreate(enriched)
    else await onUpdate(selected._rowIndex, enriched)
    closeModal()
  }

  const columnsWithClick = COLUMNS.map((col) =>
    col.key === 'namaSiswa'
      ? {
          ...col,
          render: (v, row) => (
            <button
              onClick={() => openDetail(row)}
              className="text-primary-600 hover:underline text-left"
            >
              {v}
            </button>
          ),
        }
      : col,
  )

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Data Siswa</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {students.length} siswa terdaftar
          </p>
        </div>
        <button
          onClick={openCreate}
          className="px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 font-medium"
        >
          + Tambah Siswa
        </button>
      </div>

      <DataTable
        columns={columnsWithClick}
        rows={enrichedStudents}
        loading={loading}
        onEdit={openEdit}
        onDelete={(row) => onDelete(row._rowIndex)}
      />

      {modal === 'detail' && (
        <Modal title="Detail Siswa" onClose={closeModal} size="lg">
          <StudentDetailView
            student={selected}
            points={points}
            onEdit={() => setModal('edit')}
            onClose={closeModal}
          />
        </Modal>
      )}

      {(modal === 'create' || modal === 'edit') && (
        <Modal
          title={modal === 'create' ? 'Tambah Siswa' : 'Edit Data Siswa'}
          onClose={closeModal}
          size="lg"
        >
          <StudentFormView
            initialValues={modal === 'edit' ? selected : null}
            classes={classes}
            extracurriculars={extracurriculars}
            onSubmit={handleSubmit}
            onCancel={closeModal}
          />
        </Modal>
      )}
    </div>
  )
}
