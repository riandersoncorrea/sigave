import { supabase } from '@/services/supabase'
import type { Database } from '@/types/database'

export type Levantamento = Database['public']['Tables']['levantamentos']['Row']

const STATUS_EM_ABERTO = ['EM_ANDAMENTO', 'NECESSITA_COMPLEMENTACAO'] as const

// Reaproveita um levantamento em aberto do inspetor para esta AVM, se
// existir; caso contrário cria um novo. O formulário completo do
// levantamento é escopo da Sprint 3 — aqui só garantimos que o registro
// exista e fique rastreável.
export async function startLevantamento(
  avmId: string,
  inspetorId: string,
): Promise<Levantamento> {
  const { data: existente, error: errorBusca } = await supabase
    .from('levantamentos')
    .select('*')
    .eq('avm_id', avmId)
    .eq('inspetor_id', inspetorId)
    .in('status', STATUS_EM_ABERTO)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (errorBusca) throw errorBusca
  if (existente) return existente

  const { data, error } = await supabase
    .from('levantamentos')
    .insert({ avm_id: avmId, inspetor_id: inspetorId })
    .select('*')
    .single()

  if (error) throw error
  return data
}

export async function getLevantamentoEmAberto(
  avmId: string,
  inspetorId: string,
): Promise<Levantamento | null> {
  const { data, error } = await supabase
    .from('levantamentos')
    .select('*')
    .eq('avm_id', avmId)
    .eq('inspetor_id', inspetorId)
    .in('status', STATUS_EM_ABERTO)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) throw error
  return data
}
