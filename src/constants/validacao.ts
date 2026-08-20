import { STATUS_LABELS } from '@/constants/avm'
import {
  STATUS_VALIDACAO_FILTRAVEIS,
  type ValidacaoAcao,
} from '@/types/validacao'
import type { StatusCiclo } from '@/types/avm'

export const VALIDACAO_PAGE_SIZE = 20

export const VALIDACAO_ACAO_LABELS: Record<ValidacaoAcao, string> = {
  APROVADO: 'Aprovado',
  REPROVADO: 'Reprovado',
  SOLICITADA_COMPLEMENTACAO: 'Complementação solicitada',
}

export const STATUS_VALIDACAO_OPTIONS = STATUS_VALIDACAO_FILTRAVEIS.map(
  (value) => ({ value, label: STATUS_LABELS[value] }),
)

// Rótulo da timeline para cada transição (status_anterior → status_novo).
// EM_ANDAMENTO/REPROVADA/NECESSITA_COMPLEMENTACAO → ENVIADA_VALIDACAO são
// distinguidos entre "Enviado" (primeira vez) e "Reenviado" (depois de uma
// decisão do fiscal), conforme a timeline pedida na especificação.
export function descreverTransicao(
  anterior: StatusCiclo | null,
  novo: StatusCiclo,
): string {
  if (novo === 'ENVIADA_VALIDACAO') {
    return anterior === 'EM_ANDAMENTO' || anterior === null
      ? 'Enviado para validação'
      : 'Reenviado para validação'
  }
  if (novo === 'NECESSITA_COMPLEMENTACAO') return 'Complementação solicitada'
  if (novo === 'REPROVADA') return 'Reprovado'
  if (novo === 'APROVADA') return 'Aprovado'
  return `${anterior ? STATUS_LABELS[anterior] : '—'} → ${STATUS_LABELS[novo]}`
}
