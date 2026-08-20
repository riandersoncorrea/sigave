import { supabase } from '@/services/supabase'
import type { Database } from '@/types/database'

export type HistoricoStatus =
  Database['public']['Tables']['levantamento_historico_status']['Row']

export interface HistoricoStatusComUsuario extends HistoricoStatus {
  usuario: { id: string; nome_completo: string; email: string } | null
}

export async function listHistoricoStatus(
  levantamentoId: string,
): Promise<HistoricoStatusComUsuario[]> {
  const { data, error } = await supabase
    .from('levantamento_historico_status')
    .select(
      '*, usuario:profiles!levantamento_historico_status_usuario_id_fkey(id, nome_completo, email)',
    )
    .eq('levantamento_id', levantamentoId)
    .order('criado_em', { ascending: false })

  if (error) throw error
  return data as unknown as HistoricoStatusComUsuario[]
}
