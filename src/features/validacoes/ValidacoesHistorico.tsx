import { Badge } from '@/components/ui/Badge'
import { VALIDACAO_ACAO_LABELS } from '@/constants/validacao'
import type { ValidacaoComFiscal } from '@/types/validacao'

const ACAO_BADGE_CLASSES: Record<string, string> = {
  APROVADO: 'bg-vale-green-light text-vale-green-dark',
  REPROVADO: 'bg-red-100 text-red-700',
  SOLICITADA_COMPLEMENTACAO: 'bg-orange-100 text-orange-700',
}

interface ValidacoesHistoricoProps {
  validacoes: ValidacaoComFiscal[]
}

// Registro imutável de cada decisão do fiscal: usuário, data, hora, ação e
// motivo — pode ter mais de uma linha se o levantamento já passou por mais
// de um ciclo de envio/decisão.
export function ValidacoesHistorico({ validacoes }: ValidacoesHistoricoProps) {
  if (validacoes.length === 0) return null

  return (
    <div className="flex flex-col gap-3 rounded-xl bg-white p-5 shadow-sm">
      <h2 className="text-sm font-bold text-neutral-900">
        Decisões de validação
      </h2>
      {validacoes.map((v) => (
        <div
          key={v.id}
          className="border-b border-neutral-100 pb-3 last:border-b-0 last:pb-0"
        >
          <div className="flex items-center justify-between gap-2">
            <Badge className={ACAO_BADGE_CLASSES[v.acao]}>
              {VALIDACAO_ACAO_LABELS[v.acao]}
            </Badge>
            <span className="text-xs text-neutral-500">
              {new Date(v.created_at).toLocaleString('pt-BR')}
            </span>
          </div>
          <p className="mt-1 text-xs text-neutral-500">
            {v.fiscal?.nome_completo || v.fiscal?.email || '—'}
          </p>
          {v.comentario && (
            <p className="mt-1 text-sm text-neutral-700">{v.comentario}</p>
          )}
        </div>
      ))}
    </div>
  )
}
