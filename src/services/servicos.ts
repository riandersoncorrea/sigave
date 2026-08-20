import { supabase } from '@/services/supabase'
import type { Database } from '@/types/database'

export type Servico = Database['public']['Tables']['servicos']['Row']
export type ServicoInsert = Database['public']['Tables']['servicos']['Insert']
export type ServicoUpdate = Database['public']['Tables']['servicos']['Update']

export async function listServicos(levantamentoId: string): Promise<Servico[]> {
  const { data, error } = await supabase
    .from('servicos')
    .select('*')
    .eq('levantamento_id', levantamentoId)
    .order('created_at')

  if (error) throw error
  return data
}

export async function insertServico(values: ServicoInsert): Promise<Servico> {
  const { data, error } = await supabase
    .from('servicos')
    .insert(values)
    .select('*')
    .single()

  if (error) throw error
  return data
}

export async function updateServico(
  id: string,
  patch: ServicoUpdate,
): Promise<Servico> {
  const { data, error } = await supabase
    .from('servicos')
    .update(patch)
    .eq('id', id)
    .select('*')
    .single()

  if (error) throw error
  return data
}

export async function deleteServico(id: string): Promise<void> {
  const { error } = await supabase.from('servicos').delete().eq('id', id)
  if (error) throw error
}
