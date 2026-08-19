import { supabase } from '@/services/supabase'
import { AVM_PAGE_SIZE } from '@/constants/avm'
import type {
  AvmComRelacoes,
  AvmFiltros,
  AvmInsert,
  AvmOrdenacao,
  AvmUpdate,
} from '@/types/avm'

const SELECT_COM_RELACOES = `
  *,
  unidade:unidades!avms_unidade_id_fkey(id, nome),
  setor:setores!avms_setor_id_fkey(id, nome),
  inspetor:profiles!avms_inspetor_id_fkey(id, nome_completo, email)
`

export interface ListAvmsResult {
  data: AvmComRelacoes[]
  count: number
}

export async function listAvms(
  filtros: AvmFiltros,
  ordenacao: AvmOrdenacao,
  page: number,
): Promise<ListAvmsResult> {
  let query = supabase
    .from('avms')
    .select(SELECT_COM_RELACOES, { count: 'exact' })

  if (filtros.busca.trim()) {
    const termo = filtros.busca.trim().replace(/[%,]/g, '')
    query = query.or(`nome.ilike.%${termo}%,id_avm.ilike.%${termo}%`)
  }
  if (filtros.unidadeId) query = query.eq('unidade_id', filtros.unidadeId)
  if (filtros.setorId) query = query.eq('setor_id', filtros.setorId)
  if (filtros.classeFuncional)
    query = query.eq('classe_funcional', filtros.classeFuncional)
  if (filtros.status) query = query.eq('status', filtros.status)
  if (filtros.inspetorId) query = query.eq('inspetor_id', filtros.inspetorId)

  const from = (page - 1) * AVM_PAGE_SIZE
  const to = from + AVM_PAGE_SIZE - 1

  const { data, error, count } = await query
    .order(ordenacao.campo, { ascending: ordenacao.direcao === 'asc' })
    .range(from, to)

  if (error) throw error
  return { data: data as unknown as AvmComRelacoes[], count: count ?? 0 }
}

export async function getAvm(id: string): Promise<AvmComRelacoes | null> {
  const { data, error } = await supabase
    .from('avms')
    .select(SELECT_COM_RELACOES)
    .eq('id', id)
    .maybeSingle()

  if (error) throw error
  return data as unknown as AvmComRelacoes | null
}

export async function checkIdAvmDisponivel(
  idAvm: string,
  excludeId?: string,
): Promise<boolean> {
  let query = supabase
    .from('avms')
    .select('id', { count: 'exact', head: true })
    .eq('id_avm', idAvm)

  if (excludeId) query = query.neq('id', excludeId)

  const { count, error } = await query
  if (error) throw error
  return (count ?? 0) === 0
}

function traduzErroSupabase(error: { code?: string; message: string }): Error {
  if (error.code === '23505') {
    return new Error('Já existe uma AVM cadastrada com esse ID.')
  }
  return new Error(error.message)
}

export async function createAvm(values: AvmInsert): Promise<AvmComRelacoes> {
  const { data, error } = await supabase
    .from('avms')
    .insert(values)
    .select(SELECT_COM_RELACOES)
    .single()

  if (error) throw traduzErroSupabase(error)
  return data as unknown as AvmComRelacoes
}

export async function updateAvm(
  id: string,
  values: AvmUpdate,
): Promise<AvmComRelacoes> {
  const { data, error } = await supabase
    .from('avms')
    .update(values)
    .eq('id', id)
    .select(SELECT_COM_RELACOES)
    .single()

  if (error) throw traduzErroSupabase(error)
  return data as unknown as AvmComRelacoes
}

export async function assignInspetor(
  avmId: string,
  inspetorId: string | null,
): Promise<AvmComRelacoes> {
  return updateAvm(avmId, { inspetor_id: inspetorId })
}
