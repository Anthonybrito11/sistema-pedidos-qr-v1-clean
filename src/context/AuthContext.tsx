import { useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabaseClient'
import { AuthContext } from './authStateContext'

export interface AuthContextValue {
  user: User | null
  session: Session | null
  loading: boolean
  configError: string
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const configError = supabase ? '' : 'Supabase no esta configurado. Revisa el archivo .env.'

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setLoading(false)
    })

    return () => data.subscription.unsubscribe()
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      session,
      loading,
      configError,
      async signIn(email: string, password: string) {
        if (!supabase) {
          throw new Error(configError)
        }

        const { error } = await supabase.auth.signInWithPassword({ email, password })

        if (error) {
          throw error
        }
      },
      async signOut() {
        if (!supabase) {
          return
        }

        await supabase.auth.signOut()
      },
    }),
    [configError, loading, session],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
