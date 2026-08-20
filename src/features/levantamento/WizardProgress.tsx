import { WIZARD_STEPS, stepIndex } from '@/features/levantamento/steps'

export function WizardProgress({ currentSlug }: { currentSlug: string }) {
  const index = stepIndex(currentSlug)
  const total = WIZARD_STEPS.length
  const percentual = ((index + 1) / total) * 100

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-baseline justify-between">
        <h1 className="text-lg font-bold text-neutral-900">
          {WIZARD_STEPS[index]?.label}
        </h1>
        <span className="text-xs text-neutral-500">
          Etapa {index + 1} de {total}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-200">
        <div
          className="bg-vale-green h-full rounded-full transition-all"
          style={{ width: `${percentual}%` }}
        />
      </div>
    </div>
  )
}
