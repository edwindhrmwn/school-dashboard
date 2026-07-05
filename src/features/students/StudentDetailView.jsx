import { useMemo } from 'react'

function PivotNilai({ points, nisn }) {
  const { rows, cols, cell } = useMemo(() => {
    const mine = (points || []).filter((p) => p.nisn === nisn)
    const rows = [...new Set(mine.map((p) => p.levelClass).filter(Boolean))].sort()
    const cols = [...new Set(mine.map((p) => p.extracurricular).filter(Boolean))].sort()
    const map = {}
    mine.forEach((p) => { map[`${p.levelClass}||${p.extracurricular}`] = p.point })
    const cell = (r, c) => map[`${r}||${c}`] ?? '-'
    return { rows, cols, cell }
  }, [points, nisn])

  if (rows.length === 0) {
    return (
      <div className="mb-6">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Riwayat Nilai Ekstrakulikuler</h3>
        <p className="text-sm text-gray-400 bg-gray-50 rounded-lg px-4 py-3">Belum ada nilai tercatat.</p>
      </div>
    )
  }

  return (
    <div className="mb-6">
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Riwayat Nilai Ekstrakulikuler</h3>
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Kelas</th>
              {cols.map((c) => (
                <th key={c} className="px-4 py-2 text-center text-xs font-semibold text-gray-500 uppercase">{c}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((r) => (
              <tr key={r} className="hover:bg-gray-50">
                <td className="px-4 py-2 font-medium text-gray-700">{r}</td>
                {cols.map((c) => {
                  const v = cell(r, c)
                  return (
                    <td key={c} className="px-4 py-2 text-center">
                      {v === '-' ? (
                        <span className="text-gray-300">-</span>
                      ) : (
                        <span className={`font-semibold ${Number(v) >= 75 ? 'text-green-600' : Number(v) >= 50 ? 'text-yellow-600' : 'text-red-500'}`}>{v}</span>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="grid grid-cols-5 gap-2 py-2 border-b border-gray-50 last:border-0">
      <dt className="col-span-2 text-xs font-medium text-gray-500">{label}</dt>
      <dd className="col-span-3 text-sm text-gray-800">{value || '—'}</dd>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div className="mb-6">
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">{title}</h3>
      <dl className="bg-gray-50 rounded-lg px-4">{children}</dl>
    </div>
  )
}

const STATUS_COLORS = {
  Aktif: 'bg-green-100 text-green-700',
  'Tidak Aktif': 'bg-gray-100 text-gray-600',
  Pindah: 'bg-yellow-100 text-yellow-700',
  Lulus: 'bg-blue-100 text-blue-700',
}

export function StudentDetailView({ student, points, onEdit, onClose }) {
  if (!student) return null
  return (
    <div className="max-h-[75vh] overflow-y-auto pr-1">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-900">{student.namaSiswa}</h2>
          <p className="text-sm text-gray-500">{student.panggilan && `"${student.panggilan}" · `}NIS {student.nis} · NISN {student.nisn}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[student.status] ?? 'bg-gray-100 text-gray-600'}`}>
          {student.status}
        </span>
      </div>

      <Section title="Data Pokok">
        <Row label="Kelas" value={student.kelas} />
        <Row label="Jenis Kelamin" value={student.jenisKelamin} />
        <Row label="Tempat, Tgl Lahir" value={`${student.tempat}, ${student.tglLahir}`} />
        <Row label="Usia" value={student.usia ? `${student.usia} tahun` : ''} />
        <Row label="Ekstrakulikuler" value={student.ekstrakulikuler} />
        <Row label="Guru 1 (Wali Kelas)" value={student.guru1 ?? student.waliKelas1} />
        <Row label="Guru 2 (Wali Kelas)" value={student.guru2 ?? student.waliKelas2} />
      </Section>

      <Section title="Data Orang Tua">
        <Row label="Nama Ayah" value={student.namaAyah} />
        <Row label="TTL Ayah" value={student.ttlAyah} />
        <Row label="Pekerjaan Ayah" value={student.pekerjaanAyah} />
        <Row label="No. HP Ayah" value={student.noAyah} />
        <Row label="Email Ayah" value={student.emailAyah} />
        <Row label="Nama Bunda" value={student.namaBunda} />
        <Row label="TTL Bunda" value={student.ttlBunda} />
        <Row label="Pekerjaan Bunda" value={student.pekerjaanBunda} />
        <Row label="No. HP Bunda" value={student.noBunda} />
        <Row label="Email Bunda" value={student.emailBunda} />
      </Section>

      <Section title="Lain-lain">
        <Row label="Asal Sekolah" value={student.asalSekolah} />
        <Row label="Saudara" value={student.saudara} />
        <Row label="Alamat" value={student.alamat} />
        <Row label="Keterangan" value={student.keterangan} />
      </Section>

      <PivotNilai points={points} nisn={student.nisn} />

      <div className="flex justify-end gap-2 pt-2 sticky bottom-0 bg-white pb-1">
        <button onClick={onClose}
          className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50">
          Tutup
        </button>
        <button onClick={onEdit}
          className="px-4 py-2 text-sm rounded-lg bg-primary-600 text-white hover:bg-primary-700">
          Edit Data
        </button>
      </div>
    </div>
  )
}
