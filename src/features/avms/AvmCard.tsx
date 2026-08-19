import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/Badge'
import {
  CLASSE_FUNCIONAL_LABELS,
  STATUS_BADGE_CLASSES,
  STATUS_LABELS,
} from '@/constants/avm'
import type { AvmComRelacoes } from '@/types/avm'

interface AvmCardProps {
  avm: AvmComRelacoes
}

export function AvmCard({ avm }: AvmCardProps) {
  return (
    <Link
      to={`/avms/${avm.id}`}
      className="active:bg-vale-gray-light/50 flex flex-col gap-2 rounded-xl bg-white p-4 shadow-sm"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-vale-green text-xs font-semibold">{avm.id_avm}</p>
          <p className="font-medium text-neutral-900">{avm.nome}</p>
        </div>
        <Badge className={STATUS_BADGE_CLASSES[avm.status]}>
          {STATUS_LABELS[avm.status]}
        </Badge>
      </div>

      <p className="text-sm text-neutral-600">
        {avm.unidade?.nome ?? '—'} / {avm.setor?.nome ?? '—'}
      </p>
      <p className="text-sm text-neutral-600">
        {CLASSE_FUNCIONAL_LABELS[avm.classe_funcional]}
      </p>
      <p className="text-sm text-neutral-500">
        Inspetor: {avm.inspetor?.nome_completo || avm.inspetor?.email || '—'}
      </p>
    </Link>
  )
}
