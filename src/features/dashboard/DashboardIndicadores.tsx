import type { DashboardIndicadoresData } from '@/services/dashboard'

function Indicador({
  label,
  valor,
  alerta = false,
}: {
  label: string
  valor: string
  alerta?: boolean
}) {
  return (
    <div className="flex flex-col gap-1 rounded-xl bg-white p-4 shadow-sm">
      <p className="text-xs font-medium text-neutral-500">{label}</p>
      <p
        className={`text-xl font-bold ${alerta ? 'text-red-600' : 'text-neutral-900'}`}
      >
        {valor}
      </p>
    </div>
  )
}

export function DashboardIndicadores({
  dados,
}: {
  dados: DashboardIndicadoresData
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      <Indicador
        label="AVMs diagnosticadas"
        valor={`${dados.percentualDiagnosticadas}%`}
      />
      <Indicador
        label="Diagnósticos aprovados"
        valor={`${dados.percentualAprovadas}%`}
      />
      <Indicador
        label="Com pendência"
        valor={`${dados.percentualComPendencia}%`}
        alerta={dados.percentualComPendencia > 0}
      />
      <Indicador
        label="Ocorrências críticas"
        valor={String(dados.ocorrenciasCriticas)}
        alerta={dados.ocorrenciasCriticas > 0}
      />
      <Indicador
        label="Pendências ambientais"
        valor={String(dados.pendenciasAmbientais)}
        alerta={dados.pendenciasAmbientais > 0}
      />
    </div>
  )
}
