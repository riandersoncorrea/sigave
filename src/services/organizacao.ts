import { supabase } from '@/services/supabase'

export interface Unidade {
  id: string
  nome: string
}

export interface Setor {
  id: string
  nome: string
  unidade_id: string
}

export async function listUnidades(): Promise<Unidade[]> {
  const { data, error } = await supabase
    .from('unidades')
    .select('id, nome')
    .eq('ativo', true)
    .order('nome')

  if (error) throw error
  return data
}

export async function listSetores(unidadeId?: string): Promise<Setor[]> {
  let query = supabase
    .from('setores')
    .select('id, nome, unidade_id')
    .eq('ativo', true)
    .order('nome')

  if (unidadeId) {
    query = query.eq('unidade_id', unidadeId)
  }

  const { data, error } = await query
  if (error) throw error
  return data
}
