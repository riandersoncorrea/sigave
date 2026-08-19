import { useEffect, useState, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '@/services/supabase'
import { getProfile, type Profile } from '@/services/auth'
import { AuthContext } from '@/features/auth/context'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function loadProfile(currentSession: Session | null) {
      if (!currentSession) {
        if (active) setProfile(null)
        return
      }
      const nextProfile = await getProfile(currentSession.user.id)
      if (active) setProfile(nextProfile)
    }

    supabase.auth.getSession().then(({ data: { session: initial } }) => {
      if (!active) return
      setSession(initial)
      loadProfile(initial).finally(() => {
        if (active) setLoading(false)
      })
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!active) return
      setSession(nextSession)
      loadProfile(nextSession)
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider value={{ session, profile, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
