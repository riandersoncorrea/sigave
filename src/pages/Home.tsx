const FLUXO = [
  'Cadastrar',
  'Inspecionar',
  'Diagnosticar',
  'Fotografar',
  'Validar',
]

export function Home() {
  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-xl bg-white p-5 shadow-sm">
        <span className="bg-vale-green-light text-vale-green-dark inline-block rounded-full px-3 py-1 text-xs font-semibold">
          Fundação do projeto
        </span>
        <h1 className="mt-3 text-xl font-bold text-neutral-900">
          Levantamento e Diagnóstico de Áreas Verdes
        </h1>
        <p className="mt-2 text-sm text-neutral-600">
          Coleta e organização padronizada de dados de campo das Áreas Verdes de
          Manutenção (AVM).
        </p>
      </div>

      <div className="rounded-xl bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-neutral-900">Fluxo</h2>
        <ol className="mt-3 flex flex-col gap-2">
          {FLUXO.map((etapa, index) => (
            <li key={etapa} className="flex items-center gap-3 text-sm">
              <span className="bg-vale-green flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white">
                {index + 1}
              </span>
              <span className="text-neutral-700">{etapa}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
