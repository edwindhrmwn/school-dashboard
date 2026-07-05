import { useState } from 'react'
import { LoadingSpinner } from './LoadingSpinner'

export function DataTable({ columns, rows, loading, onEdit, onDelete, searchable = true, hideIndex = false }) {
  const [query, setQuery] = useState('')
  const [sortKey, setSortKey] = useState(null)
  const [sortDir, setSortDir] = useState('asc')

  const filtered = rows.filter((row) =>
    !query || columns.some((col) =>
      String(row[col.key] ?? '').toLowerCase().includes(query.toLowerCase()),
    ),
  )

  const sorted = sortKey
    ? [...filtered].sort((a, b) => {
        const va = String(a[sortKey] ?? '').toLowerCase()
        const vb = String(b[sortKey] ?? '').toLowerCase()
        return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va)
      })
    : filtered

  function toggleSort(key) {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortKey(key); setSortDir('asc') }
  }

  const thBase = 'px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50'

  return (
    <div className="flex flex-col gap-3 h-full min-h-0">
      {searchable && (
        <input
          type="text"
          placeholder="Cari..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full max-w-sm shrink-0 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      )}
      <div className="flex-1 min-h-0 flex flex-col rounded-xl border border-gray-200 bg-white overflow-hidden">
        <div className="flex-1 min-h-0 overflow-auto">
        <table className="min-w-full text-sm">
          <thead className="border-b border-gray-200 sticky top-0 z-10">
            <tr>
              {!hideIndex && (
                <th className={`${thBase} w-8`}>#</th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => toggleSort(col.key)}
                  className={`${thBase} cursor-pointer select-none hover:bg-gray-100`}
                >
                  {col.label}
                  {sortKey === col.key && (
                    <span className="ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
              ))}
              <th className={`${thBase} text-right`}>Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={columns.length + (hideIndex ? 1 : 2)}><LoadingSpinner /></td></tr>
            ) : sorted.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (hideIndex ? 1 : 2)} className="px-4 py-8 text-center text-gray-400">
                  Tidak ada data.
                </td>
              </tr>
            ) : (
              sorted.map((row, i) => (
                <tr key={row._rowIndex ?? i} className="hover:bg-gray-50">
                  {!hideIndex && <td className="px-4 py-3 text-gray-400">{i + 1}</td>}
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-gray-700">
                      {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '—')}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(row)}
                          className="px-3 py-1 text-xs rounded-lg bg-primary-50 text-primary-700 hover:bg-primary-100 font-medium"
                        >
                          Edit
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => {
                            if (window.confirm('Yakin ingin menghapus data ini?')) onDelete(row)
                          }}
                          className="px-3 py-1 text-xs rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-medium"
                        >
                          Hapus
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
        {!loading && sorted.length > 0 && (
          <div className="shrink-0 px-4 py-2 border-t border-gray-100 text-xs text-gray-400 bg-white">
            Menampilkan {sorted.length} dari {rows.length} data
          </div>
        )}
      </div>
    </div>
  )
}
