import { DASHBOARD_STATUS_CARDS } from '@/constants/dashboard'
import type { DashboardCardsData } from '@/services/dashboard'

function Card({
  label,
  valor,
  destaque = false,
}: {
  label: string
  valor: number
  destaque?: boolean
}) {
  return (
    <div className="flex flex-col gap-1 rounded-xl bg-white p-4 shadow-sm">
      <p className="text-xs font-medium text-neutral-500">{label}</p>
      <p
        className={`text-2xl font-bold ${destaque ? 'text-vale-green-dark' : 'text-neutral-900'}`}
      >
        {valor}
      </p>
    </div>
  )
}

export function DashboardCards({ dados }: { dados: DashboardCardsData }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      <Card label="Total de AVMs" valor={dados.total} destaque />
      {DASHBOARD_STATUS_CARDS.map((card) => (
        <Card
          key={card.status}
          label={card.label}
          valor={dados.porStatus[card.status] ?? 0}
        />
      ))}
    </div>
  )
}
