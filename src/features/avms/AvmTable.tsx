import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/Badge'
import {
  CLASSE_FUNCIONAL_LABELS,
  STATUS_BADGE_CLASSES,
  STATUS_LABELS,
} from '@/constants/avm'
import type { AvmComRelacoes } from '@/types/avm'

interface AvmTableProps {
  avms: AvmComRelacoes[]
}

export function AvmTable({ avms }: AvmTableProps) {
  return (
    <table className="hidden w-full overflow-hidden rounded-xl bg-white text-left text-sm shadow-sm md:table">
      <thead className="bg-vale-gray-light text-xs font-semibold tracking-wide text-neutral-600 uppercase">
        <tr>
          <th className="px-4 py-3">ID</th>
          <th className="px-4 py-3">Nome</th>
          <th className="px-4 py-3">Unidade / Setor</th>
          <th className="px-4 py-3">Classe</th>
          <th className="px-4 py-3">Status</th>
          <th className="px-4 py-3">Inspetor</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-neutral-100">
        {avms.map((avm) => (
          <tr key={avm.id} className="hover:bg-vale-gray-light/50">
            <td className="px-4 py-3">
              <Link
                to={`/avms/${avm.id}`}
                className="text-vale-green font-medium hover:underline"
              >
                {avm.id_avm}
              </Link>
            </td>
            <td className="px-4 py-3 text-neutral-800">{avm.nome}</td>
            <td className="px-4 py-3 text-neutral-600">
              {avm.unidade?.nome ?? '—'} / {avm.setor?.nome ?? '—'}
            </td>
            <td className="px-4 py-3 text-neutral-600">
              {CLASSE_FUNCIONAL_LABELS[avm.classe_funcional]}
            </td>
            <td className="px-4 py-3">
              <Badge className={STATUS_BADGE_CLASSES[avm.status]}>
                {STATUS_LABELS[avm.status]}
              </Badge>
            </td>
            <td className="px-4 py-3 text-neutral-600">
              {avm.inspetor?.nome_completo || avm.inspetor?.email || '—'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
