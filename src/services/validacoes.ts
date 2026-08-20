import { supabase } from '@/services/supabase'
import { VALIDACAO_PAGE_SIZE } from '@/constants/validacao'
import { STATUS_VALIDACAO_FILTRAVEIS } from '@/types/validacao'
import type {
  LevantamentoParaValidacao,
  ValidacaoAcao,
  ValidacaoComFiscal,
  ValidacaoFiltros,
  ValidacaoOrdenacao,
} from '@/types/validacao'

const SELECT_FILA = `
  id, status, created_at, updated_at,
  avm:avms!levantamentos_avm_id_fkey!inner(
    id, id_avm, nome, classe_funcional,
    unidade:unidades!avms_unidade_id_fkey(id, nome),
    setor:setores!avms_setor_id_fkey(id, nome)
  ),
  inspetor:profiles!levantamentos_inspetor_id_fkey(id, nome_completo, email)
`

export interface ListValidacoesFilaResult {
  data: LevantamentoParaValidacao[]
  count: number
}

// Fila de validação: por padrão só os status que já passaram por envio
// (nunca rascunho em andamento); o filtro de Status permite restringir a um
// deles específico. "Período" usa updated_at — a única coisa que atualiza a
// linha de levantamentos é uma mudança de status (envio/decisão/reenvio),
// então funciona como proxy fiel da data da última transição sem precisar
// de coluna dedicada.
export async function listLevantamentosParaValidacao(
  filtros: ValidacaoFiltros,
  ordenacao: ValidacaoOrdenacao,
  page: number,
): Promise<ListValidacoesFilaResult> {
  let query = supabase
    .from('levantamentos')
    .select(SELECT_FILA, { count: 'exact' })

  if (filtros.status) {
    query = query.eq('status', filtros.status)
  } else {
    query = query.in('status', STATUS_VALIDACAO_FILTRAVEIS)
  }
  if (filtros.inspetorId) query = query.eq('inspetor_id', filtros.inspetorId)
  if (filtros.unidadeId) query = query.eq('avm.unidade_id', filtros.unidadeId)
  if (filtros.setorId) query = query.eq('avm.setor_id', filtros.setorId)
  if (filtros.classeFuncional)
    query = query.eq('avm.classe_funcional', filtros.classeFuncional)
  if (filtros.periodoInicio)
    query = query.gte('updated_at', filtros.periodoInicio)
  if (filtros.periodoFim)
    query = query.lte('updated_at', `${filtros.periodoFim}T23:59:59`)

  const from = (page - 1) * VALIDACAO_PAGE_SIZE
  const to = from + VALIDACAO_PAGE_SIZE - 1

  const { data, error, count } = await query
    .order(ordenacao.campo, { ascending: ordenacao.direcao === 'asc' })
    .range(from, to)

  if (error) throw error
  return {
    data: data as unknown as LevantamentoParaValidacao[],
    count: count ?? 0,
  }
}

export async function listValidacoes(
  levantamentoId: string,
): Promise<ValidacaoComFiscal[]> {
  const { data, error } = await supabase
    .from('validacoes')
    .select(
      '*, fiscal:profiles!validacoes_fiscal_id_fkey(id, nome_completo, email)',
    )
    .eq('levantamento_id', levantamentoId)
    .order('created_at')

  if (error) throw error
  return data as unknown as ValidacaoComFiscal[]
}

interface RegistrarValidacaoParams {
  levantamentoId: string
  fiscalId: string
  acao: ValidacaoAcao
  comentario: string
}

// A RLS (validacoes_insert) só aceita esta gravação quando o levantamento
// está ENVIADA_VALIDACAO, e o gatilho aplicar_decisao_validacao (Sprint 6)
// aplica a consequência em levantamentos.status sozinho — esta função só
// registra a decisão em si.
export async function registrarValidacao({
  levantamentoId,
  fiscalId,
  acao,
  comentario,
}: RegistrarValidacaoParams): Promise<void> {
  const { error } = await supabase.from('validacoes').insert({
    levantamento_id: levantamentoId,
    fiscal_id: fiscalId,
    acao,
    comentario: comentario.trim() || null,
  })

  if (error) throw error
}
