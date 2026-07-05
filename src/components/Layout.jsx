import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'

const TITLES = {
  '/students': 'Data Siswa',
  '/classes': 'Kelas',
  '/teachers': 'Guru',
  '/extracurriculars': 'Ekstrakulikuler',
  '/points': 'Nilai Ekstra',
  '/promotion': 'Naik Kelas',
}

export function Layout({ user, onSignOut }) {
  const { pathname } = useLocation()
  const title = TITLES[pathname] ?? 'School Dashboard'

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar user={user} onSignOut={onSignOut} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="shrink-0 h-14 border-b border-gray-200 bg-white flex items-center px-6">
          <h2 className="text-sm font-semibold text-gray-700">{title}</h2>
        </header>
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
        <footer className="shrink-0 h-9 border-t border-gray-200 bg-white flex items-center px-6">
          <p className="text-xs text-gray-400">© 2026 School Dashboard</p>
        </footer>
      </div>
    </div>
  )
}
