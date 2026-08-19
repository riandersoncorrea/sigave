import { supabase } from '@/services/supabase'

export interface Inspetor {
  id: string
  nome_completo: string
  email: string
}

export async function listInspetores(): Promise<Inspetor[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, nome_completo, email')
    .eq('perfil', 'INSPETOR_SAPORE')
    .eq('ativo', true)
    .order('nome_completo')

  if (error) throw error
  return data
}
