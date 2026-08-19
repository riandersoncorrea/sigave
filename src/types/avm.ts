import type { Database } from '@/types/database'

export type Avm = Database['public']['Tables']['avms']['Row']
export type AvmInsert = Database['public']['Tables']['avms']['Insert']
export type AvmUpdate = Database['public']['Tables']['avms']['Update']

export type ClasseFuncional =
  Database['public']['Enums']['avm_classe_funcional']
export type StatusCiclo = Database['public']['Enums']['status_ciclo']

export interface AvmComRelacoes extends Avm {
  unidade: { id: string; nome: string } | null
  setor: { id: string; nome: string } | null
  inspetor: { id: string; nome_completo: string; email: string } | null
}

export interface AvmFiltros {
  busca: string
  unidadeId: string | null
  setorId: string | null
  classeFuncional: ClasseFuncional | null
  status: StatusCiclo | null
  inspetorId: string | null
}

export type AvmOrdenacaoCampo =
  'id_avm' | 'nome' | 'classe_funcional' | 'status'

export interface AvmOrdenacao {
  campo: AvmOrdenacaoCampo
  direcao: 'asc' | 'desc'
}

export interface AvmFormValues {
  idAvm: string
  nome: string
  unidadeId: string
  setorId: string
  subsetor: string
  localizacaoDescritiva: string
  classeFuncional: ClasseFuncional | ''
  areaM2: string
  perimetro: string
  responsavel: string
  status: StatusCiclo
}
