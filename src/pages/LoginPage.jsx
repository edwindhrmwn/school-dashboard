export function LoginPage({ onSignIn }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-900 to-primary-700">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-sm text-center">
        <div className="text-5xl mb-4">🏫</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">School Dashboard</h1>
        <p className="text-sm text-gray-500 mb-8">Manajemen data siswa & ekstrakulikuler</p>
        <button
          onClick={onSignIn}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className="w-5 h-5"
          />
          Masuk dengan Google
        </button>
        <p className="text-xs text-gray-400 mt-6">
          Akses hanya untuk administrator sekolah.
        </p>
      </div>
    </div>
  )
}
