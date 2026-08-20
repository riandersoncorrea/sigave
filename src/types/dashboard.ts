import type { Database } from '@/types/database'
import type { ClasseFuncional, StatusCiclo } from '@/types/avm'

export type AvmStatusAtual =
  Database['public']['Views']['avm_status_atual']['Row']

export interface DashboardFiltros {
  unidadeId: string | null
  setorId: string | null
  classeFuncional: ClasseFuncional | null
  inspetorId: string | null
  status: StatusCiclo | null
  condicaoMedia: number | null
  vegetacaoTipo: string | null
}
