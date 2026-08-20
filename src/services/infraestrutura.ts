import { supabase } from '@/services/supabase'
import type { Database } from '@/types/database'

export type Infraestrutura =
  Database['public']['Tables']['infraestrutura']['Row']
export type InfraestruturaUpdate =
  Database['public']['Tables']['infraestrutura']['Update']

export async function getOrCreateInfraestrutura(
  levantamentoId: string,
): Promise<Infraestrutura> {
  const { data: existente, error: errorBusca } = await supabase
    .from('infraestrutura')
    .select('*')
    .eq('levantamento_id', levantamentoId)
    .maybeSingle()

  if (errorBusca) throw errorBusca
  if (existente) return existente

  const { data, error } = await supabase
    .from('infraestrutura')
    .insert({ levantamento_id: levantamentoId })
    .select('*')
    .single()

  if (error) throw error
  return data
}

export async function updateInfraestrutura(
  levantamentoId: string,
  patch: InfraestruturaUpdate,
): Promise<void> {
  const { error } = await supabase
    .from('infraestrutura')
    .update(patch)
    .eq('levantamento_id', levantamentoId)

  if (error) throw error
}
