import { createContext } from 'react'
import type { Session } from '@supabase/supabase-js'
import type { Profile } from '@/services/auth'

export interface AuthContextValue {
  session: Session | null
  profile: Profile | null
  loading: boolean
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
)
