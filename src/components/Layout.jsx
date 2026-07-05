import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'

export function Layout({ user, onSignOut }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar user={user} onSignOut={onSignOut} />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
