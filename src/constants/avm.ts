import type { Database } from '@/types/database'

type ClasseFuncional = Database['public']['Enums']['avm_classe_funcional']
type StatusCiclo = Database['public']['Enums']['status_ciclo']

export const CLASSE_FUNCIONAL_LABELS: Record<ClasseFuncional, string> = {
  A: 'A — Operacional crítica',
  B: 'B — Operacional',
  C: 'C — Paisagística',
  D: 'D — Ambiental',
}

export const CLASSE_FUNCIONAL_OPTIONS = Object.entries(
  CLASSE_FUNCIONAL_LABELS,
).map(([value, label]) => ({ value: value as ClasseFuncional, label }))

export const STATUS_LABELS: Record<StatusCiclo, string> = {
  NAO_INICIADA: 'Não iniciada',
  EM_ANDAMENTO: 'Em andamento',
  ENVIADA_VALIDACAO: 'Enviada para validação',
  REPROVADA: 'Reprovada',
  APROVADA: 'Aprovada',
  NECESSITA_COMPLEMENTACAO: 'Necessita complementação',
}

export const STATUS_OPTIONS = Object.entries(STATUS_LABELS).map(
  ([value, label]) => ({ value: value as StatusCiclo, label }),
)

export const STATUS_BADGE_CLASSES: Record<StatusCiclo, string> = {
  NAO_INICIADA: 'bg-neutral-100 text-neutral-700',
  EM_ANDAMENTO: 'bg-vale-yellow/20 text-vale-green-dark',
  ENVIADA_VALIDACAO: 'bg-blue-100 text-blue-700',
  REPROVADA: 'bg-red-100 text-red-700',
  APROVADA: 'bg-vale-green-light text-vale-green-dark',
  NECESSITA_COMPLEMENTACAO: 'bg-orange-100 text-orange-700',
}

export const AVM_PAGE_SIZE = 20
