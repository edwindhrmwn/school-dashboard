import { NavLink } from 'react-router-dom'

const NAV = [
  { to: '/students', label: 'Data Siswa', icon: '👤' },
  { to: '/classes', label: 'Kelas', icon: '🏫' },
  { to: '/extracurriculars', label: 'Ekstrakulikuler', icon: '⚽' },
  { to: '/points', label: 'Nilai Ekstra', icon: '🏆' },
  { to: '/promotion', label: 'Naik Kelas', icon: '⬆️' },
]

export function Sidebar({ user, onSignOut }) {
  return (
    <aside className="w-60 shrink-0 bg-primary-900 text-white flex flex-col min-h-screen">
      <div className="px-6 py-5 border-b border-primary-700">
        <h1 className="text-lg font-bold leading-tight">School<br />Dashboard</h1>
      </div>
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {NAV.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary-700 text-white'
                  : 'text-primary-200 hover:bg-primary-800 hover:text-white'
              }`
            }
          >
            <span>{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>
      {user && (
        <div className="px-4 py-4 border-t border-primary-700">
          <div className="flex items-center gap-3 mb-3">
            {user.picture && (
              <img src={user.picture} alt="" className="w-8 h-8 rounded-full" />
            )}
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-primary-300 truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={onSignOut}
            className="w-full text-xs text-primary-300 hover:text-white py-1 text-left"
          >
            Keluar
          </button>
        </div>
      )}
    </aside>
  )
}
