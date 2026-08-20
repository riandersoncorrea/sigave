import type { Database } from '@/types/database'
import type { ClasseFuncional, StatusCiclo } from '@/types/avm'

export type Validacao = Database['public']['Tables']['validacoes']['Row']
export type ValidacaoAcao = Database['public']['Enums']['validacao_acao']

export interface ValidacaoComFiscal extends Validacao {
  fiscal: { id: string; nome_completo: string; email: string } | null
}

// Status relevantes para a fila de validação — NAO_INICIADA/EM_ANDAMENTO
// nunca chegam ao fiscal (levantamento ainda em rascunho).
export const STATUS_VALIDACAO_FILTRAVEIS = [
  'ENVIADA_VALIDACAO',
  'NECESSITA_COMPLEMENTACAO',
  'REPROVADA',
  'APROVADA',
] as const satisfies readonly StatusCiclo[]

export interface LevantamentoParaValidacao {
  id: string
  status: StatusCiclo
  created_at: string
  updated_at: string
  avm: {
    id: string
    id_avm: string
    nome: string
    classe_funcional: ClasseFuncional
    unidade: { id: string; nome: string } | null
    setor: { id: string; nome: string } | null
  }
  inspetor: { id: string; nome_completo: string; email: string } | null
}

export interface ValidacaoFiltros {
  unidadeId: string | null
  setorId: string | null
  inspetorId: string | null
  status: StatusCiclo | null
  classeFuncional: ClasseFuncional | null
  periodoInicio: string | null
  periodoFim: string | null
}

export type ValidacaoOrdenacaoCampo = 'updated_at' | 'created_at'

export interface ValidacaoOrdenacao {
  campo: ValidacaoOrdenacaoCampo
  direcao: 'asc' | 'desc'
}
