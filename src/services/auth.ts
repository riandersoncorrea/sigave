import { supabase } from '@/services/supabase'
import type { Perfil } from '@/types/perfil'

export interface Profile {
  id: string
  email: string
  nomeCompleto: string
  perfil: Perfil | null
  ativo: boolean
}

export async function signInWithPassword(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getSession() {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session
}

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, nome_completo, perfil, ativo')
    .eq('id', userId)
    .single()

  if (error) throw error
  if (!data) return null

  return {
    id: data.id,
    email: data.email,
    nomeCompleto: data.nome_completo,
    perfil: data.perfil,
    ativo: data.ativo,
  }
}
