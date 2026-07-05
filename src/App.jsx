import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import { AuthGate } from './components/AuthGate'
import { Layout } from './components/Layout'
import { LoginPage } from './pages/LoginPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { LoadingSpinner } from './components/LoadingSpinner'

const StudentsPage = lazy(() => import('./features/students/StudentsPage'))
const ClassesPage = lazy(() => import('./features/classes/ClassesPage'))
const ExtracurricularsPage = lazy(() => import('./features/extracurriculars/ExtracurricularsPage'))
const PointsPage = lazy(() => import('./features/points/PointsPage'))
const PromotionPage = lazy(() => import('./features/promotion/PromotionPage'))

export default function App() {
  const { isAuthenticated, initializing, user, signIn, signOut } = useAuth()

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={
          isAuthenticated && !initializing
            ? <Navigate to="/students" replace />
            : <LoginPage onSignIn={signIn} />
        } />

        <Route element={<AuthGate isAuthenticated={isAuthenticated} initializing={initializing} />}>
          <Route element={<Layout user={user} onSignOut={signOut} />}>
            <Route index element={<Navigate to="/students" replace />} />
            <Route path="/students" element={
              <Suspense fallback={<LoadingSpinner />}><StudentsPage /></Suspense>
            } />
            <Route path="/classes" element={
              <Suspense fallback={<LoadingSpinner />}><ClassesPage /></Suspense>
            } />
            <Route path="/extracurriculars" element={
              <Suspense fallback={<LoadingSpinner />}><ExtracurricularsPage /></Suspense>
            } />
            <Route path="/points" element={
              <Suspense fallback={<LoadingSpinner />}><PointsPage /></Suspense>
            } />
            <Route path="/promotion" element={
              <Suspense fallback={<LoadingSpinner />}><PromotionPage /></Suspense>
            } />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}
