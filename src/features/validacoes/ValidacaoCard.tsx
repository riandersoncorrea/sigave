import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/Badge'
import {
  CLASSE_FUNCIONAL_LABELS,
  STATUS_BADGE_CLASSES,
  STATUS_LABELS,
} from '@/constants/avm'
import type { LevantamentoParaValidacao } from '@/types/validacao'

interface ValidacaoCardProps {
  item: LevantamentoParaValidacao
}

export function ValidacaoCard({ item }: ValidacaoCardProps) {
  return (
    <Link
      to={`/validacoes/${item.id}`}
      className="active:bg-vale-gray-light/50 flex flex-col gap-2 rounded-xl bg-white p-4 shadow-sm"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-vale-green text-xs font-semibold">
            {item.avm.id_avm}
          </p>
          <p className="font-medium text-neutral-900">{item.avm.nome}</p>
        </div>
        <Badge className={STATUS_BADGE_CLASSES[item.status]}>
          {STATUS_LABELS[item.status]}
        </Badge>
      </div>

      <p className="text-sm text-neutral-600">
        {item.avm.unidade?.nome ?? '—'} / {item.avm.setor?.nome ?? '—'}
      </p>
      <p className="text-sm text-neutral-600">
        {CLASSE_FUNCIONAL_LABELS[item.avm.classe_funcional]}
      </p>
      <p className="text-sm text-neutral-500">
        Inspetor: {item.inspetor?.nome_completo || item.inspetor?.email || '—'}
      </p>
      <p className="text-xs text-neutral-400">
        Atualizado em {new Date(item.updated_at).toLocaleString('pt-BR')}
      </p>
    </Link>
  )
}
