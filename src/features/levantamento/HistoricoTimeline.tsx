import { descreverTransicao } from '@/constants/validacao'
import type { HistoricoStatusComUsuario } from '@/services/historicoStatus'

const PONTO_CLASSES: Record<string, string> = {
  APROVADA: 'bg-vale-green border-vale-green',
  REPROVADA: 'bg-red-600 border-red-600',
  NECESSITA_COMPLEMENTACAO: 'bg-orange-500 border-orange-500',
}

interface HistoricoTimelineProps {
  historico: HistoricoStatusComUsuario[]
}

// Timeline vertical (Enviado → Complementação solicitada → Reenviado →
// Aprovado, ...): cada linha do histórico é gravada por gatilho (nunca por
// UPDATE direto do frontend) e nunca é sobrescrita — a ordenação
// cronológica aqui é só de exibição.
export function HistoricoTimeline({ historico }: HistoricoTimelineProps) {
  if (historico.length === 0) return null

  const ordemCronologica = [...historico].sort(
    (a, b) => new Date(a.criado_em).getTime() - new Date(b.criado_em).getTime(),
  )

  return (
    <div className="flex flex-col gap-2 rounded-xl bg-white p-5 shadow-sm">
      <h2 className="text-sm font-bold text-neutral-900">Histórico</h2>
      <ol className="flex flex-col">
        {ordemCronologica.map((item, index) => (
          <li key={item.id} className="relative flex gap-3 pb-4 last:pb-0">
            {index < ordemCronologica.length - 1 && (
              <span className="absolute top-3 left-[5px] h-full w-px bg-neutral-200" />
            )}
            <span
              className={`z-10 mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full border-2 ${
                PONTO_CLASSES[item.status_novo] ??
                'bg-vale-green-light border-vale-green'
              }`}
            />
            <div className="flex flex-col">
              <p className="text-sm font-semibold text-neutral-800">
                {descreverTransicao(item.status_anterior, item.status_novo)}
              </p>
              <p className="text-xs text-neutral-500">
                {new Date(item.criado_em).toLocaleString('pt-BR')}
                {item.usuario &&
                  ` — ${item.usuario.nome_completo || item.usuario.email}`}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
