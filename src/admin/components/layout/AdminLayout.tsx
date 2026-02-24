import { type ReactNode, useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useRequireAuth } from '../../hooks/useRequireAuth.ts'
import { supabase } from '../../lib/supabase.ts'
import { startBackgroundSync, stopBackgroundSync } from '../../lib/sync.ts'
import { SyncStatusIndicator } from './SyncStatusIndicator.tsx'

interface AdminLayoutProps {
  children: ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { session, loading } = useRequireAuth()
  const navigate = useNavigate()

  // Start/stop background sync with component lifecycle
  useEffect(() => {
    startBackgroundSync()
    return () => {
      stopBackgroundSync()
    }
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-900 text-stone-200">
        <p className="text-lg">Betoltese...</p>
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/admin/login" replace />
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/admin/login')
  }

  return (
    <div className="flex min-h-screen flex-col bg-stone-900 text-stone-200">
      <header className="sticky top-0 z-50 border-b border-stone-700 bg-stone-800/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <h1 className="text-xl font-semibold text-amber-400">Inspekcio</h1>
          <div className="flex items-center gap-4">
            <SyncStatusIndicator />
          <button
            onClick={handleLogout}
            className="rounded-lg border border-stone-600 px-4 py-2 text-sm text-stone-300 transition-colors hover:border-stone-500 hover:bg-stone-700 hover:text-stone-100"
          >
            Kijelentkezes
          </button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 py-6">
          {children}
        </div>
      </main>
    </div>
  )
}
