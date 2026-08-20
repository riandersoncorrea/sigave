import { supabase } from '@/services/supabase'
import type { Database } from '@/types/database'

export type Levantamento = Database['public']['Tables']['levantamentos']['Row']

const STATUS_EM_ABERTO = ['EM_ANDAMENTO', 'NECESSITA_COMPLEMENTACAO'] as const

// Espelha public.levantamento_editavel() no banco (fonte da verdade — a
// RLS é quem realmente impede a escrita fora desses status). Repetido aqui
// só para a UI decidir o que mostrar sem precisar de um round-trip.
const STATUS_EDITAVEL = [
  'EM_ANDAMENTO',
  'NECESSITA_COMPLEMENTACAO',
  'REPROVADA',
] as const

export function statusEhEditavel(status: Levantamento['status']): boolean {
  return (STATUS_EDITAVEL as readonly string[]).includes(status)
}

// Reaproveita um levantamento em aberto do inspetor para esta AVM, se
// existir; caso contrário cria um novo.
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

export async function getLevantamento(
  id: string,
): Promise<Levantamento | null> {
  const { data, error } = await supabase
    .from('levantamentos')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error) throw error
  return data
}

// A regra "não permitir edição normal após o envio" é imposta pela RLS
// (levantamentos_update + policies das tabelas filhas exigem
// levantamento_editavel(status)); esta função só executa a transição em
// si. O histórico (data/hora/usuário) é gravado automaticamente por
// gatilho no banco, não aqui.
export async function enviarParaValidacao(id: string): Promise<Levantamento> {
  const { data, error } = await supabase
    .from('levantamentos')
    .update({ status: 'ENVIADA_VALIDACAO' })
    .eq('id', id)
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
