import { useState, useEffect } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase.ts'

const isOfflineMode = !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY

interface AuthState {
  session: Session | null
  user: User | null
  loading: boolean
}

/**
 * Hook that checks Supabase auth session on mount and subscribes to changes.
 * If VITE_SUPABASE_URL is not set, returns a mock session (offline dev mode).
 */
export function useRequireAuth(): AuthState {
  const [state, setState] = useState<AuthState>({
    session: null,
    user: null,
    loading: true,
  })

  useEffect(() => {
    // Offline mock mode: auto-authenticate
    if (isOfflineMode) {
      setState({
        session: { access_token: 'mock', user: { id: 'mock-user', email: 'dev@local' } } as unknown as Session,
        user: { id: 'mock-user', email: 'dev@local' } as unknown as User,
        loading: false,
      })
      return
    }

    // Real Supabase auth
    supabase.auth.getSession().then(({ data: { session } }) => {
      setState({
        session,
        user: session?.user ?? null,
        loading: false,
      })
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setState({
          session,
          user: session?.user ?? null,
          loading: false,
        })
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  return state
}
