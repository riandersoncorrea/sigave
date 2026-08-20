import { supabase } from '@/services/supabase'
import type { Database } from '@/types/database'

export type Vegetacao = Database['public']['Tables']['vegetacao']['Row']
export type VegetacaoUpdate =
  Database['public']['Tables']['vegetacao']['Update']

export async function getOrCreateVegetacao(
  levantamentoId: string,
): Promise<Vegetacao> {
  const { data: existente, error: errorBusca } = await supabase
    .from('vegetacao')
    .select('*')
    .eq('levantamento_id', levantamentoId)
    .maybeSingle()

  if (errorBusca) throw errorBusca
  if (existente) return existente

  const { data, error } = await supabase
    .from('vegetacao')
    .insert({ levantamento_id: levantamentoId })
    .select('*')
    .single()

  if (error) throw error
  return data
}

export async function updateVegetacao(
  levantamentoId: string,
  patch: VegetacaoUpdate,
): Promise<void> {
  const { error } = await supabase
    .from('vegetacao')
    .update(patch)
    .eq('levantamento_id', levantamentoId)

  if (error) throw error
}
