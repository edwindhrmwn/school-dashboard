import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 text-center p-8">
      <div className="text-6xl">404</div>
      <h1 className="text-2xl font-bold text-gray-700">Halaman tidak ditemukan</h1>
      <Link to="/students" className="text-primary-600 hover:underline text-sm">Kembali ke beranda</Link>
    </div>
  )
}
