import { useState, useMemo } from 'react'
import { LoadingSpinner } from '../../components/LoadingSpinner'
import { defaultTarget } from './promotionUtils'

export function PromotionView({ students, classes, loading, onProcess }) {
  const [sourceClass, setSourceClass] = useState('')
  // _rowIndex → { action: 'promote'|'stay'|'graduate', target: className }
  const [decisions, setDecisions] = useState({})
  const [processing, setProcessing] = useState(false)

  const roster = useMemo(
    () => students.filter((s) => s.kelas === sourceClass),
    [students, sourceClass],
  )

  function selectSource(className) {
    setSourceClass(className)
    const def = defaultTarget(className, classes)
    const init = {}
    students
      .filter((s) => s.kelas === className)
      .forEach((s) => { init[s._rowIndex] = { action: def ? 'promote' : 'graduate', target: def } })
    setDecisions(init)
  }

  function setAction(rowIndex, action) {
    setDecisions((d) => ({ ...d, [rowIndex]: { ...d[rowIndex], action } }))
  }

  function setTarget(rowIndex, target) {
    setDecisions((d) => ({ ...d, [rowIndex]: { ...d[rowIndex], target } }))
  }

  function setAllAction(action) {
    const def = defaultTarget(sourceClass, classes)
    setDecisions((d) => {
      const next = { ...d }
      roster.forEach((s) => {
        next[s._rowIndex] = {
          action,
          target: action === 'promote' ? (d[s._rowIndex]?.target || def) : d[s._rowIndex]?.target,
        }
      })
      return next
    })
  }

  async function handleProcess() {
    const changes = []
    let invalid = 0
    roster.forEach((s) => {
      const d = decisions[s._rowIndex]
      if (!d) return
      if (d.action === 'promote') {
        if (d.target) changes.push({ student: s, kelas: d.target })
        else invalid += 1
      } else if (d.action === 'graduate') {
        changes.push({ student: s, status: 'Lulus' })
      }
      // 'stay' → no change
    })
    if (invalid > 0) {
      window.alert(`${invalid} siswa berstatus "Naik" belum punya kelas tujuan. Pilih dulu kelasnya.`)
      return
    }
    if (changes.length === 0) return
    if (!window.confirm(`${changes.length} siswa akan diproses dari "${sourceClass}". Lanjutkan?`)) return
    setProcessing(true)
    try {
      await onProcess(changes)
      selectSource(sourceClass)
    } finally {
      setProcessing(false)
    }
  }

  const counts = useMemo(() => {
    const c = { promote: 0, stay: 0, graduate: 0 }
    roster.forEach((s) => {
      const a = decisions[s._rowIndex]?.action ?? 'stay'
      c[a] = (c[a] ?? 0) + 1
    })
    return c
  }, [roster, decisions])

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Naik Kelas</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Proses kenaikan kelas massal. Kelas tujuan dapat dipilih bebas per siswa. Nilai lama tetap tersimpan per kelas.
        </p>
      </div>

      <div className="flex flex-col gap-1 mb-5 max-w-xs">
        <label className="text-sm font-medium text-gray-700">Kelas Asal</label>
        <select
          value={sourceClass}
          onChange={(e) => selectSource(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">Pilih kelas...</option>
          {classes.map((c) => (
            <option key={c._rowIndex} value={c.className}>{c.className}</option>
          ))}
        </select>
      </div>

      {!sourceClass ? (
        <p className="text-sm text-gray-400 bg-gray-50 rounded-xl px-4 py-8 text-center">
          Pilih kelas asal untuk mulai.
        </p>
      ) : loading ? (
        <LoadingSpinner />
      ) : roster.length === 0 ? (
        <p className="text-sm text-gray-400 bg-gray-50 rounded-xl px-4 py-8 text-center">
          Tidak ada siswa aktif di kelas ini.
        </p>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-xs text-gray-500 mr-1">Set semua:</span>
            <button onClick={() => setAllAction('promote')}
              className="px-3 py-1 text-xs rounded-lg bg-primary-50 text-primary-700 hover:bg-primary-100 font-medium">
              Naik
            </button>
            <button onClick={() => setAllAction('stay')}
              className="px-3 py-1 text-xs rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 font-medium">
              Tinggal
            </button>
            <button onClick={() => setAllAction('graduate')}
              className="px-3 py-1 text-xs rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-medium">
              Lulus
            </button>
            <span className="ml-auto text-xs text-gray-500">
              Naik {counts.promote} · Tinggal {counts.stay} · Lulus {counts.graduate}
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase w-8">#</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">NISN</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Nama</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Aksi</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Kelas Tujuan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {roster.map((s, i) => {
                  const d = decisions[s._rowIndex] ?? { action: 'stay', target: '' }
                  return (
                    <tr key={s._rowIndex} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-gray-400">{i + 1}</td>
                      <td className="px-4 py-2 text-gray-700">{s.nisn}</td>
                      <td className="px-4 py-2 text-gray-800">{s.namaSiswa}</td>
                      <td className="px-4 py-2">
                        <select
                          value={d.action}
                          onChange={(e) => setAction(s._rowIndex, e.target.value)}
                          className="rounded-lg border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          <option value="promote">Naik</option>
                          <option value="stay">Tinggal</option>
                          <option value="graduate">Lulus</option>
                        </select>
                      </td>
                      <td className="px-4 py-2">
                        {d.action === 'promote' ? (
                          <select
                            value={d.target || ''}
                            onChange={(e) => setTarget(s._rowIndex, e.target.value)}
                            className={`rounded-lg border px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${d.target ? 'border-gray-300' : 'border-red-300'}`}
                          >
                            <option value="">Pilih kelas tujuan...</option>
                            {classes
                              .filter((c) => c.className !== sourceClass)
                              .map((c) => (
                                <option key={c._rowIndex} value={c.className}>{c.className}</option>
                              ))}
                          </select>
                        ) : (
                          <span className="text-gray-300 text-sm">—</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end mt-4">
            <button
              onClick={handleProcess}
              disabled={processing}
              className="px-5 py-2 text-sm rounded-lg bg-primary-600 text-white hover:bg-primary-700 font-medium disabled:opacity-60"
            >
              {processing ? 'Memproses...' : 'Proses Naik Kelas'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
