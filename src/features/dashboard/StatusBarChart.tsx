import { DASHBOARD_STATUS_CARDS } from '@/constants/dashboard'
import type { StatusCiclo } from '@/types/avm'
import type { DashboardCardsData } from '@/services/dashboard'

const BARRA_CLASSES: Record<StatusCiclo, string> = {
  NAO_INICIADA: 'bg-neutral-400',
  EM_ANDAMENTO: 'bg-vale-yellow',
  ENVIADA_VALIDACAO: 'bg-blue-500',
  APROVADA: 'bg-vale-green',
  REPROVADA: 'bg-red-500',
  NECESSITA_COMPLEMENTACAO: 'bg-orange-500',
}

// Gráfico de barras horizontal, sem lib externa — cada barra é uma div com
// largura proporcional ao total, mesmo padrão já usado na barra de
// progresso do wizard (WizardProgress).
export function StatusBarChart({ dados }: { dados: DashboardCardsData }) {
  return (
    <div className="flex flex-col gap-3 rounded-xl bg-white p-5 shadow-sm">
      <h2 className="text-sm font-bold text-neutral-900">
        Status dos levantamentos
      </h2>
      <div className="flex flex-col gap-2">
        {DASHBOARD_STATUS_CARDS.map((card) => {
          const valor = dados.porStatus[card.status] ?? 0
          const percentual = dados.total === 0 ? 0 : (valor / dados.total) * 100
          return (
            <div key={card.status} className="flex items-center gap-3">
              <span className="w-32 shrink-0 text-xs text-neutral-600 sm:w-36">
                {card.label}
              </span>
              <div className="h-3 flex-1 overflow-hidden rounded-full bg-neutral-100">
                <div
                  className={`h-full rounded-full transition-all ${BARRA_CLASSES[card.status]}`}
                  style={{ width: `${percentual}%` }}
                />
              </div>
              <span className="w-6 shrink-0 text-right text-xs font-semibold text-neutral-700">
                {valor}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
