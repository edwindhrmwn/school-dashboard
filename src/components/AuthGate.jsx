import { Navigate, Outlet } from 'react-router-dom'
import { LoadingSpinner } from './LoadingSpinner'

export function AuthGate({ isAuthenticated, initializing }) {
  if (initializing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    )
  }
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}
