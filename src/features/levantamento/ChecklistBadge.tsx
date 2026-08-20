import { Badge } from '@/components/ui/Badge'
import type { ChecklistEstado } from '@/features/levantamento/checklist'

const LABELS: Record<ChecklistEstado, string> = {
  OK: 'OK',
  PENDENTE: 'Pendente',
  ERRO: 'Erro',
}

const CLASSES: Record<ChecklistEstado, string> = {
  OK: 'bg-vale-green-light text-vale-green-dark',
  PENDENTE: 'bg-neutral-100 text-neutral-600',
  ERRO: 'bg-red-100 text-red-700',
}

export function ChecklistBadge({ estado }: { estado: ChecklistEstado }) {
  return <Badge className={CLASSES[estado]}>{LABELS[estado]}</Badge>
}
