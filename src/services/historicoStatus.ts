import { supabase } from '@/services/supabase'
import type { Database } from '@/types/database'

export type HistoricoStatus =
  Database['public']['Tables']['levantamento_historico_status']['Row']

export async function listHistoricoStatus(
  levantamentoId: string,
): Promise<HistoricoStatus[]> {
  const { data, error } = await supabase
    .from('levantamento_historico_status')
    .select('*')
    .eq('levantamento_id', levantamentoId)
    .order('criado_em', { ascending: false })

  if (error) throw error
  return data
}
