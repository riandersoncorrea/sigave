import { buildCsv, downloadCsv, jsonParaCsv } from '@/services/csv'
import { listAvmStatusAtual } from '@/services/dashboard'
import { supabase } from '@/services/supabase'
import type { DashboardFiltros } from '@/types/dashboard'

interface AvmEscopo {
  id: string
  id_avm: string
}

interface LevantamentoEscopo {
  id: string
  avm_id: string
  id_avm: string
}

interface Escopo {
  avms: AvmEscopo[]
  levantamentos: LevantamentoEscopo[]
}

export class ExportacaoVaziaError extends Error {
  constructor() {
    super('Nenhum registro encontrado para os filtros atuais.')
  }
}

// Os filtros do dashboard descrevem o estado ATUAL de cada AVM (status,
// condição, tipo de vegetação do levantamento mais recente); a exportação
// reaproveita esses mesmos filtros só para decidir QUAIS AVMs entram no
// relatório. Uma vez que uma AVM está no escopo, o relatório traz todo o
// histórico de levantamentos dela (não só o mais recente) — é dado de
// rastreabilidade, não um retrato do momento.
async function resolverEscopo(filtros: DashboardFiltros): Promise<Escopo> {
  const statusAtual = await listAvmStatusAtual(filtros)
  const avms: AvmEscopo[] = statusAtual
    .filter((l): l is typeof l & { avm_id: string; id_avm: string } =>
      Boolean(l.avm_id && l.id_avm),
    )
    .map((l) => ({ id: l.avm_id, id_avm: l.id_avm }))

  if (avms.length === 0) return { avms, levantamentos: [] }

  const idAvmPorAvmId = new Map(avms.map((a) => [a.id, a.id_avm]))
  const { data, error } = await supabase
    .from('levantamentos')
    .select('id, avm_id')
    .in(
      'avm_id',
      avms.map((a) => a.id),
    )
  if (error) throw error

  const levantamentos: LevantamentoEscopo[] = (data ?? []).map((l) => ({
    id: l.id,
    avm_id: l.avm_id,
    id_avm: idAvmPorAvmId.get(l.avm_id) ?? '',
  }))

  return { avms, levantamentos }
}

function exigirNaoVazio<T>(itens: T[]): T[] {
  if (itens.length === 0) throw new ExportacaoVaziaError()
  return itens
}

export async function exportAvmsCsv(filtros: DashboardFiltros): Promise<void> {
  const { avms } = await resolverEscopo(filtros)
  exigirNaoVazio(avms)

  const { data, error } = await supabase
    .from('avms')
    .select(
      '*, unidade:unidades!avms_unidade_id_fkey(nome), setor:setores!avms_setor_id_fkey(nome), inspetor:profiles!avms_inspetor_id_fkey(nome_completo, email)',
    )
    .in(
      'id',
      avms.map((a) => a.id),
    )
  if (error) throw error

  const headers = [
    'ID_AVM',
    'id',
    'nome',
    'unidade',
    'setor',
    'subsetor',
    'classe_funcional',
    'localizacao_descritiva',
    'area_m2',
    'perimetro',
    'responsavel',
    'inspetor',
    'status',
    'created_at',
    'updated_at',
  ]
  type AvmExportRow = {
    id_avm: string
    id: string
    nome: string
    unidade: { nome: string } | null
    setor: { nome: string } | null
    subsetor: string | null
    classe_funcional: string
    localizacao_descritiva: string | null
    area_m2: number | null
    perimetro: number | null
    responsavel: string | null
    inspetor: { nome_completo: string; email: string } | null
    status: string
    created_at: string
    updated_at: string
  }
  const rows = ((data ?? []) as unknown as AvmExportRow[]).map((a) => [
    a.id_avm,
    a.id,
    a.nome,
    a.unidade?.nome ?? '',
    a.setor?.nome ?? '',
    a.subsetor,
    a.classe_funcional,
    a.localizacao_descritiva,
    a.area_m2,
    a.perimetro,
    a.responsavel,
    a.inspetor?.nome_completo || a.inspetor?.email || '',
    a.status,
    a.created_at,
    a.updated_at,
  ])
  downloadCsv('avms.csv', buildCsv(headers, rows))
}

export async function exportLevantamentosCsv(
  filtros: DashboardFiltros,
): Promise<void> {
  const { levantamentos } = await resolverEscopo(filtros)
  exigirNaoVazio(levantamentos)

  const { data, error } = await supabase
    .from('levantamentos')
    .select(
      '*, inspetor:profiles!levantamentos_inspetor_id_fkey(nome_completo, email)',
    )
    .in(
      'id',
      levantamentos.map((l) => l.id),
    )
  if (error) throw error

  const idAvmPorId = new Map(levantamentos.map((l) => [l.id, l.id_avm]))
  const headers = [
    'ID_AVM',
    'id',
    'avm_id',
    'inspetor',
    'status',
    'created_at',
    'updated_at',
  ]
  type LevantamentoExportRow = {
    id: string
    avm_id: string
    inspetor: { nome_completo: string; email: string } | null
    status: string
    created_at: string
    updated_at: string
  }
  const rows = ((data ?? []) as unknown as LevantamentoExportRow[]).map((l) => [
    idAvmPorId.get(l.id) ?? '',
    l.id,
    l.avm_id,
    l.inspetor?.nome_completo || l.inspetor?.email || '',
    l.status,
    l.created_at,
    l.updated_at,
  ])
  downloadCsv('levantamentos.csv', buildCsv(headers, rows))
}

type TabelaPorLevantamento =
  | 'diagnosticos'
  | 'vegetacao'
  | 'infraestrutura'
  | 'ocorrencias'
  | 'equipamentos'
  | 'servicos'
  | 'evidencias'
  | 'validacoes'

async function exportPorLevantamento(
  filtros: DashboardFiltros,
  tabela: TabelaPorLevantamento,
  colunas: string[],
  filename: string,
): Promise<void> {
  const { levantamentos } = await resolverEscopo(filtros)
  exigirNaoVazio(levantamentos)

  const { data, error } = await supabase
    .from(tabela)
    .select('*')
    .in(
      'levantamento_id',
      levantamentos.map((l) => l.id),
    )
  if (error) throw error
  exigirNaoVazio(data ?? [])

  const idAvmPorLevantamento = new Map(
    levantamentos.map((l) => [l.id, l.id_avm]),
  )
  const headers = ['ID_AVM', ...colunas]
  const rows = (data ?? []).map((registro) => {
    const linha = registro as Record<string, unknown>
    return [
      idAvmPorLevantamento.get(linha.levantamento_id as string) ?? '',
      ...colunas.map((coluna) => jsonParaCsv(linha[coluna])),
    ]
  })
  downloadCsv(filename, buildCsv(headers, rows))
}

export function exportDiagnosticosCsv(filtros: DashboardFiltros) {
  return exportPorLevantamento(
    filtros,
    'diagnosticos',
    [
      'id',
      'levantamento_id',
      'condicoes_climaticas',
      'caracterizacao_observacoes',
      'topografia',
      'inclinacao',
      'superficie',
      'grau_obstaculos',
      'condicao_vegetacao_nota',
      'condicao_vegetacao_obs',
      'condicao_limpeza_nota',
      'condicao_limpeza_obs',
      'condicao_seguranca_nota',
      'condicao_seguranca_obs',
      'condicao_infraestrutura_nota',
      'condicao_infraestrutura_obs',
      'condicao_meio_ambiente_nota',
      'condicao_meio_ambiente_obs',
      'condicao_acesso_nota',
      'condicao_acesso_obs',
      'condicao_interferencia_operacional_nota',
      'condicao_interferencia_operacional_obs',
      'limpeza_nivel',
      'limpeza_presenca_residuos',
      'limpeza_tipo_residuos',
      'limpeza_necessita_capina',
      'limpeza_acumulo_entulho',
      'limpeza_observacoes',
      'seguranca_perguntas',
      'seguranca_observacoes',
      'meio_ambiente_gate',
      'meio_ambiente_categorias',
      'meio_ambiente_observacoes',
      'acesso_veicular',
      'acesso_pedestre',
      'acesso_condicao_via',
      'acesso_restricoes',
      'acesso_observacoes',
      'observacao_geral',
    ],
    'diagnosticos.csv',
  )
}

export function exportVegetacaoCsv(filtros: DashboardFiltros) {
  return exportPorLevantamento(
    filtros,
    'vegetacao',
    [
      'id',
      'levantamento_id',
      'tipo',
      'vegetacao_predominante',
      'especie',
      'densidade',
      'altura',
      'cobertura',
      'uniformidade',
      'velocidade_crescimento',
      'arvores',
      'invasoras',
      'observacoes',
    ],
    'vegetacao.csv',
  )
}

export function exportInfraestruturaCsv(filtros: DashboardFiltros) {
  return exportPorLevantamento(
    filtros,
    'infraestrutura',
    [
      'id',
      'levantamento_id',
      'existente',
      'tipo',
      'necessidade_intervencao',
      'interferencia',
      'descricao',
    ],
    'infraestrutura.csv',
  )
}

export function exportOcorrenciasCsv(filtros: DashboardFiltros) {
  return exportPorLevantamento(
    filtros,
    'ocorrencias',
    [
      'id',
      'levantamento_id',
      'tipo',
      'descricao',
      'criticidade',
      'status',
      'responsavel',
      'evidencia_id',
      'origem_modulo',
      'origem_referencia',
      'created_at',
    ],
    'ocorrencias.csv',
  )
}

export function exportEquipamentosCsv(filtros: DashboardFiltros) {
  return exportPorLevantamento(
    filtros,
    'equipamentos',
    ['id', 'levantamento_id', 'nome', 'avaliacao', 'justificativa'],
    'equipamentos.csv',
  )
}

export function exportServicosCsv(filtros: DashboardFiltros) {
  return exportPorLevantamento(
    filtros,
    'servicos',
    ['id', 'levantamento_id', 'nome', 'necessidade', 'observacao'],
    'servicos.csv',
  )
}

export function exportRecursosCsv(filtros: DashboardFiltros) {
  return exportPorLevantamento(
    filtros,
    'diagnosticos',
    [
      'id',
      'levantamento_id',
      'recursos_operadores',
      'recursos_auxiliares',
      'recursos_jardineiros',
      'recursos_composicao_sugerida',
      'recursos_equipe_especializada',
      'recursos_apoio_operacional',
      'recursos_observacoes',
    ],
    'recursos.csv',
  )
}

export function exportEvidenciasCsv(filtros: DashboardFiltros) {
  return exportPorLevantamento(
    filtros,
    'evidencias',
    [
      'id',
      'levantamento_id',
      'tipo',
      'descricao',
      'sequencia',
      'data_hora',
      'usuario_id',
      'ocorrencia_id',
      'path_storage',
    ],
    'evidencias.csv',
  )
}

export function exportValidacoesCsv(filtros: DashboardFiltros) {
  return exportPorLevantamento(
    filtros,
    'validacoes',
    ['id', 'levantamento_id', 'fiscal_id', 'acao', 'comentario', 'created_at'],
    'validacoes.csv',
  )
}
