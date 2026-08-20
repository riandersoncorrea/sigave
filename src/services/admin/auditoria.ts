import { supabase } from '@/services/supabase'

export interface AuditLogCampo {
  audit_log_id: string | null
  tabela: string | null
  registro_id: string | null
  operacao: string | null
  usuario_id: string | null
  motivo: string | null
  criado_em: string | null
  campo: string | null
  valor_anterior: unknown
  valor_novo: unknown
  usuario: { nome_completo: string; email: string } | null
}

export interface AuditoriaFiltros {
  tabela: string | null
  usuarioId: string | null
  periodoInicio: string | null
  periodoFim: string | null
}

export const AUDITORIA_PAGE_SIZE = 30

// Tabelas auditadas desde a Sprint 8 (ver migration
// 20260825100001_auditoria_estendida.sql) — lista fixa porque é a fonte
// da verdade dos gatilhos criados, mais estável que consultar distinct
// toda vez.
export const TABELAS_AUDITADAS = [
  'avms',
  'levantamentos',
  'diagnosticos',
  'vegetacao',
  'infraestrutura',
  'ocorrencias',
  'interferencias',
  'equipamentos',
  'servicos',
  'evidencias',
  'validacoes',
  'profiles',
  'listas_opcoes',
] as const

export interface ListAuditoriaResult {
  data: AuditLogCampo[]
  count: number
}

export async function listAuditoriaCampos(
  filtros: AuditoriaFiltros,
  page: number,
): Promise<ListAuditoriaResult> {
  let query = supabase
    .from('audit_log_campos')
    .select(
      '*, usuario:profiles!audit_log_usuario_id_fkey(nome_completo, email)',
      { count: 'exact' },
    )

  if (filtros.tabela) query = query.eq('tabela', filtros.tabela)
  if (filtros.usuarioId) query = query.eq('usuario_id', filtros.usuarioId)
  if (filtros.periodoInicio)
    query = query.gte('criado_em', filtros.periodoInicio)
  if (filtros.periodoFim)
    query = query.lte('criado_em', `${filtros.periodoFim}T23:59:59`)

  const from = (page - 1) * AUDITORIA_PAGE_SIZE
  const to = from + AUDITORIA_PAGE_SIZE - 1

  const { data, error, count } = await query
    .order('criado_em', { ascending: false })
    .range(from, to)

  if (error) throw error
  return { data: data as unknown as AuditLogCampo[], count: count ?? 0 }
}
