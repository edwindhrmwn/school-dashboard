import { useState, useEffect, useCallback } from 'react'
import { useGoogleLogin } from '@react-oauth/google'
import toast from 'react-hot-toast'
import { initSheetIds } from '../lib/sheetsClient'

const TOKEN_KEY = 'goog_token'

function loadToken() {
  try {
    const raw = localStorage.getItem(TOKEN_KEY)
    if (!raw) return null
    const token = JSON.parse(raw)
    if (Date.now() > token.expires_at) {
      localStorage.removeItem(TOKEN_KEY)
      return null
    }
    return token
  } catch {
    return null
  }
}

export function useAuth() {
  const [token, setToken] = useState(() => loadToken())
  const [user, setUser] = useState(null)
  const [initializing, setInitializing] = useState(true)

  // On mount: if valid token exists, fetch user profile and load sheetIds
  useEffect(() => {
    async function bootstrap() {
      if (!token) { setInitializing(false); return }
      try {
        const res = await fetch(
          `https://www.googleapis.com/oauth2/v3/userinfo`,
          { headers: { Authorization: `Bearer ${token.access_token}` } },
        )
        if (!res.ok) throw new Error('invalid token')
        const profile = await res.json()
        setUser({ name: profile.name, email: profile.email, picture: profile.picture })
        localStorage.setItem('goog_user', JSON.stringify({ name: profile.name, email: profile.email }))
        await initSheetIds()
      } catch {
        localStorage.removeItem(TOKEN_KEY)
        setToken(null)
      } finally {
        setInitializing(false)
      }
    }
    bootstrap()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Listen for token expiry dispatched by the Axios interceptor
  useEffect(() => {
    const handler = () => {
      localStorage.removeItem(TOKEN_KEY)
      setToken(null)
      setUser(null)
      toast.error('Sesi habis. Silakan masuk kembali.')
    }
    window.addEventListener('TOKEN_EXPIRED', handler)
    return () => window.removeEventListener('TOKEN_EXPIRED', handler)
  }, [])

  const googleLogin = useGoogleLogin({
    scope: import.meta.env.VITE_GOOGLE_SCOPE,
    onSuccess: async (tokenResponse) => {
      const stored = {
        access_token: tokenResponse.access_token,
        expires_at: Date.now() + tokenResponse.expires_in * 1000,
      }
      localStorage.setItem(TOKEN_KEY, JSON.stringify(stored))
      setToken(stored)
      try {
        const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        })
        const profile = await res.json()
        setUser({ name: profile.name, email: profile.email, picture: profile.picture })
        localStorage.setItem('goog_user', JSON.stringify({ name: profile.name, email: profile.email }))
        await initSheetIds()
        toast.success(`Selamat datang, ${profile.name}!`)
      } catch {
        toast.error('Gagal memuat profil.')
      }
    },
    onError: () => toast.error('Login gagal. Coba lagi.'),
  })

  const signOut = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem('goog_user')
    setToken(null)
    setUser(null)
    toast.success('Berhasil keluar.')
  }, [])

  return {
    isAuthenticated: !!token,
    user,
    initializing,
    signIn: googleLogin,
    signOut,
  }
}
