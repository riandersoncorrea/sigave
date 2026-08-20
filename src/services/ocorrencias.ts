import { supabase } from '@/services/supabase'
import type { Database } from '@/types/database'

export type Ocorrencia = Database['public']['Tables']['ocorrencias']['Row']
export type OcorrenciaInsert =
  Database['public']['Tables']['ocorrencias']['Insert']
export type OcorrenciaUpdate =
  Database['public']['Tables']['ocorrencias']['Update']

export async function listOcorrencias(
  levantamentoId: string,
): Promise<Ocorrencia[]> {
  const { data, error } = await supabase
    .from('ocorrencias')
    .select('*')
    .eq('levantamento_id', levantamentoId)
    .order('created_at')

  if (error) throw error
  return data
}

export async function insertOcorrencia(
  values: OcorrenciaInsert,
): Promise<Ocorrencia> {
  const { data, error } = await supabase
    .from('ocorrencias')
    .insert(values)
    .select('*')
    .single()

  if (error) throw error
  return data
}

export async function updateOcorrencia(
  id: string,
  patch: OcorrenciaUpdate,
): Promise<Ocorrencia> {
  const { data, error } = await supabase
    .from('ocorrencias')
    .update(patch)
    .eq('id', id)
    .select('*')
    .single()

  if (error) throw error
  return data
}

export async function deleteOcorrencia(id: string): Promise<void> {
  const { error } = await supabase.from('ocorrencias').delete().eq('id', id)
  if (error) throw error
}
