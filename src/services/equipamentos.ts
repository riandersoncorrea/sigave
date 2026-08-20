import { supabase } from '@/services/supabase'
import type { Database } from '@/types/database'

export type Equipamento = Database['public']['Tables']['equipamentos']['Row']
export type EquipamentoInsert =
  Database['public']['Tables']['equipamentos']['Insert']
export type EquipamentoUpdate =
  Database['public']['Tables']['equipamentos']['Update']

export async function listEquipamentos(
  levantamentoId: string,
): Promise<Equipamento[]> {
  const { data, error } = await supabase
    .from('equipamentos')
    .select('*')
    .eq('levantamento_id', levantamentoId)
    .order('created_at')

  if (error) throw error
  return data
}

export async function insertEquipamento(
  values: EquipamentoInsert,
): Promise<Equipamento> {
  const { data, error } = await supabase
    .from('equipamentos')
    .insert(values)
    .select('*')
    .single()

  if (error) throw error
  return data
}

export async function updateEquipamento(
  id: string,
  patch: EquipamentoUpdate,
): Promise<Equipamento> {
  const { data, error } = await supabase
    .from('equipamentos')
    .update(patch)
    .eq('id', id)
    .select('*')
    .single()

  if (error) throw error
  return data
}

export async function deleteEquipamento(id: string): Promise<void> {
  const { error } = await supabase.from('equipamentos').delete().eq('id', id)
  if (error) throw error
}
