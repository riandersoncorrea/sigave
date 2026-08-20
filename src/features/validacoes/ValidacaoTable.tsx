import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/Badge'
import {
  CLASSE_FUNCIONAL_LABELS,
  STATUS_BADGE_CLASSES,
  STATUS_LABELS,
} from '@/constants/avm'
import type { LevantamentoParaValidacao } from '@/types/validacao'

interface ValidacaoTableProps {
  itens: LevantamentoParaValidacao[]
}

export function ValidacaoTable({ itens }: ValidacaoTableProps) {
  return (
    <table className="hidden w-full overflow-hidden rounded-xl bg-white text-left text-sm shadow-sm md:table">
      <thead className="bg-vale-gray-light text-xs font-semibold tracking-wide text-neutral-600 uppercase">
        <tr>
          <th className="px-4 py-3">ID</th>
          <th className="px-4 py-3">AVM</th>
          <th className="px-4 py-3">Unidade / Setor</th>
          <th className="px-4 py-3">Classe</th>
          <th className="px-4 py-3">Inspetor</th>
          <th className="px-4 py-3">Status</th>
          <th className="px-4 py-3">Atualizado em</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-neutral-100">
        {itens.map((item) => (
          <tr key={item.id} className="hover:bg-vale-gray-light/50">
            <td className="px-4 py-3">
              <Link
                to={`/validacoes/${item.id}`}
                className="text-vale-green font-medium hover:underline"
              >
                {item.avm.id_avm}
              </Link>
            </td>
            <td className="px-4 py-3 text-neutral-800">{item.avm.nome}</td>
            <td className="px-4 py-3 text-neutral-600">
              {item.avm.unidade?.nome ?? '—'} / {item.avm.setor?.nome ?? '—'}
            </td>
            <td className="px-4 py-3 text-neutral-600">
              {CLASSE_FUNCIONAL_LABELS[item.avm.classe_funcional]}
            </td>
            <td className="px-4 py-3 text-neutral-600">
              {item.inspetor?.nome_completo || item.inspetor?.email || '—'}
            </td>
            <td className="px-4 py-3">
              <Badge className={STATUS_BADGE_CLASSES[item.status]}>
                {STATUS_LABELS[item.status]}
              </Badge>
            </td>
            <td className="px-4 py-3 text-neutral-500">
              {new Date(item.updated_at).toLocaleString('pt-BR')}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
