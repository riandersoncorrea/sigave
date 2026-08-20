import { supabase } from '@/services/supabase'
import type { Database } from '@/types/database'

export type OpcaoLista = Database['public']['Tables']['listas_opcoes']['Row']

// Rótulos amigáveis das categorias, só para o painel de admin — o valor
// salvo no banco (coluna categoria) é o identificador técnico usado pelo
// resto do sistema.
export const CATEGORIA_LABELS: Record<string, string> = {
  clima: 'Clima',
  vegetacao_tipo: 'Vegetação — Tipo',
  vegetacao_cobertura: 'Vegetação — Cobertura',
  vegetacao_altura: 'Vegetação — Altura',
  nivel_baixa_media_alta_muito_alta: 'Nível (baixa/média/alta/muito alta)',
  vegetacao_uniformidade: 'Vegetação — Uniformidade',
  vegetacao_invasoras: 'Vegetação — Invasoras',
  vegetacao_arvores: 'Vegetação — Árvores',
  terreno_topografia: 'Terreno — Topografia',
  terreno_inclinacao: 'Terreno — Inclinação',
  terreno_superficie: 'Terreno — Superfície',
  terreno_obstaculos: 'Terreno — Obstáculos',
  terreno_grau_obstaculos: 'Terreno — Grau de obstáculos',
  limpeza_nivel: 'Limpeza — Nível',
  infraestrutura_tipo: 'Infraestrutura — Tipo',
  infraestrutura_necessidade: 'Infraestrutura — Necessidade',
  meio_ambiente_categorias: 'Meio ambiente — Categorias',
  acesso_condicao_via: 'Acesso — Condição da via',
  equipamento_avaliacao: 'Equipamento — Avaliação',
  servico_necessidade: 'Serviço — Necessidade',
}

export async function listCategorias(): Promise<string[]> {
  const { data, error } = await supabase
    .from('listas_opcoes')
    .select('categoria')
    .order('categoria')

  if (error) throw error
  return Array.from(new Set(data.map((d) => d.categoria)))
}

// Usado pelo admin: inclui opções inativas (RLS já garante isso — ver
// listas_opcoes_select). Formulários do wizard usariam uma versão futura
// filtrando só ativo = true.
export async function listOpcoesPorCategoria(
  categoria: string,
): Promise<OpcaoLista[]> {
  const { data, error } = await supabase
    .from('listas_opcoes')
    .select('*')
    .eq('categoria', categoria)
    .order('ordem')

  if (error) throw error
  return data
}

interface SalvarOpcaoParams {
  categoria: string
  valor: string
  rotulo: string
  ordem: number
}

export async function criarOpcao(
  params: SalvarOpcaoParams,
): Promise<OpcaoLista> {
  const { data, error } = await supabase
    .from('listas_opcoes')
    .insert(params)
    .select('*')
    .single()

  if (error) throw error
  return data
}

export async function atualizarOpcao(
  id: string,
  patch: Partial<Pick<OpcaoLista, 'rotulo' | 'ordem' | 'ativo'>>,
): Promise<OpcaoLista> {
  const { data, error } = await supabase
    .from('listas_opcoes')
    .update(patch)
    .eq('id', id)
    .select('*')
    .single()

  if (error) throw error
  return data
}
