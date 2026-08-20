import { supabase } from '@/services/supabase'
import { DASHBOARD_STATUS_CARDS } from '@/constants/dashboard'
import type { StatusCiclo } from '@/types/avm'
import type { AvmStatusAtual, DashboardFiltros } from '@/types/dashboard'

// Fonte única do dashboard: a view avm_status_atual já resolve o status
// real (derivado de levantamentos, não do avms.status manual) e a RLS de
// avms/levantamentos/diagnosticos/vegetacao/ocorrencias continua se
// aplicando por baixo (security_invoker=true na view) — um inspetor só
// recebe as próprias AVMs, sem filtro adicional aqui.
export async function listAvmStatusAtual(
  filtros: DashboardFiltros,
): Promise<AvmStatusAtual[]> {
  let query = supabase.from('avm_status_atual').select('*')

  if (filtros.unidadeId) query = query.eq('unidade_id', filtros.unidadeId)
  if (filtros.setorId) query = query.eq('setor_id', filtros.setorId)
  if (filtros.classeFuncional)
    query = query.eq('classe_funcional', filtros.classeFuncional)
  if (filtros.inspetorId) query = query.eq('inspetor_id', filtros.inspetorId)
  if (filtros.status) query = query.eq('status_atual', filtros.status)
  if (filtros.condicaoMedia)
    query = query.eq('condicao_media_atual', filtros.condicaoMedia)
  if (filtros.vegetacaoTipo)
    query = query.eq('vegetacao_tipo_atual', filtros.vegetacaoTipo)

  const { data, error } = await query
  if (error) throw error
  return data
}

export interface DashboardCardsData {
  total: number
  porStatus: Record<StatusCiclo, number>
}

// Função pura (sem I/O) para poder ser conferida diretamente contra
// `select status_atual, count(*) from avm_status_atual group by 1` no QA.
export function calcularCards(linhas: AvmStatusAtual[]): DashboardCardsData {
  const porStatus = Object.fromEntries(
    DASHBOARD_STATUS_CARDS.map((card) => [card.status, 0]),
  ) as Record<StatusCiclo, number>

  for (const linha of linhas) {
    const status = linha.status_atual ?? 'NAO_INICIADA'
    porStatus[status] = (porStatus[status] ?? 0) + 1
  }

  return { total: linhas.length, porStatus }
}

export interface DashboardIndicadoresData {
  percentualDiagnosticadas: number
  percentualAprovadas: number
  percentualComPendencia: number
  ocorrenciasCriticas: number
  pendenciasAmbientais: number
}

function percentual(parte: number, total: number): number {
  if (total === 0) return 0
  return Math.round((parte / total) * 100)
}

export function calcularIndicadores(
  linhas: AvmStatusAtual[],
): DashboardIndicadoresData {
  const total = linhas.length
  const diagnosticadas = linhas.filter(
    (l) => l.levantamento_id_atual != null,
  ).length
  const aprovadas = linhas.filter((l) => l.status_atual === 'APROVADA').length
  const comPendencia = linhas.filter(
    (l) => l.status_atual === 'NECESSITA_COMPLEMENTACAO',
  ).length
  const ocorrenciasCriticas = linhas.reduce(
    (soma, l) => soma + (l.ocorrencias_criticas_count ?? 0),
    0,
  )
  const pendenciasAmbientais = linhas.filter(
    (l) => l.meio_ambiente_gate_atual === true,
  ).length

  return {
    percentualDiagnosticadas: percentual(diagnosticadas, total),
    percentualAprovadas: percentual(aprovadas, total),
    percentualComPendencia: percentual(comPendencia, total),
    ocorrenciasCriticas,
    pendenciasAmbientais,
  }
}
