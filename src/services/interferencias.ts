import { supabase } from '@/services/supabase'
import type { Database } from '@/types/database'

export type Interferencia =
  Database['public']['Tables']['interferencias']['Row']
export type InterferenciaInsert =
  Database['public']['Tables']['interferencias']['Insert']
export type InterferenciaUpdate =
  Database['public']['Tables']['interferencias']['Update']

export async function listInterferencias(
  levantamentoId: string,
): Promise<Interferencia[]> {
  const { data, error } = await supabase
    .from('interferencias')
    .select('*')
    .eq('levantamento_id', levantamentoId)
    .order('created_at')

  if (error) throw error
  return data
}

export async function insertInterferencia(
  values: InterferenciaInsert,
): Promise<Interferencia> {
  const { data, error } = await supabase
    .from('interferencias')
    .insert(values)
    .select('*')
    .single()

  if (error) throw error
  return data
}

export async function updateInterferencia(
  id: string,
  patch: InterferenciaUpdate,
): Promise<Interferencia> {
  const { data, error } = await supabase
    .from('interferencias')
    .update(patch)
    .eq('id', id)
    .select('*')
    .single()

  if (error) throw error
  return data
}

export async function deleteInterferencia(id: string): Promise<void> {
  const { error } = await supabase.from('interferencias').delete().eq('id', id)
  if (error) throw error
}
