import { supabase } from '@/services/supabase'
import type { Database } from '@/types/database'

export type Diagnostico = Database['public']['Tables']['diagnosticos']['Row']
export type DiagnosticoUpdate =
  Database['public']['Tables']['diagnosticos']['Update']

// diagnosticos é 1:1 por levantamento (unique desde a Sprint 1) e concentra
// as etapas do wizard sem tabela própria — cada etapa grava só as colunas
// que lhe pertencem via update parcial.
export async function getOrCreateDiagnostico(
  levantamentoId: string,
): Promise<Diagnostico> {
  const { data: existente, error: errorBusca } = await supabase
    .from('diagnosticos')
    .select('*')
    .eq('levantamento_id', levantamentoId)
    .maybeSingle()

  if (errorBusca) throw errorBusca
  if (existente) return existente

  const { data, error } = await supabase
    .from('diagnosticos')
    .insert({ levantamento_id: levantamentoId })
    .select('*')
    .single()

  if (error) throw error
  return data
}

export async function updateDiagnostico(
  levantamentoId: string,
  patch: DiagnosticoUpdate,
): Promise<void> {
  const { error } = await supabase
    .from('diagnosticos')
    .update(patch)
    .eq('levantamento_id', levantamentoId)

  if (error) throw error
}
