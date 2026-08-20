import type { StatusCiclo } from '@/types/avm'

export interface DashboardStatusCard {
  status: StatusCiclo
  label: string
}

// Ordem e rótulos exatos da especificação da Sprint 7. O card "Total de
// AVMs" não tem status associado — é a contagem de todas as linhas.
export const DASHBOARD_STATUS_CARDS: DashboardStatusCard[] = [
  { status: 'NAO_INICIADA', label: 'Não iniciadas' },
  { status: 'EM_ANDAMENTO', label: 'Em levantamento' },
  { status: 'ENVIADA_VALIDACAO', label: 'Enviadas' },
  { status: 'APROVADA', label: 'Aprovadas' },
  { status: 'REPROVADA', label: 'Reprovadas' },
  { status: 'NECESSITA_COMPLEMENTACAO', label: 'Pendentes' },
]
