interface YesNoToggleProps {
  label: string
  value: boolean | null
  onChange: (value: boolean) => void
}

export function YesNoToggle({ label, value, onChange }: YesNoToggleProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-neutral-700">{label}</span>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onChange(true)}
          className={`min-h-12 flex-1 rounded-lg border-2 text-base font-semibold transition-colors ${
            value === true
              ? 'border-vale-green bg-vale-green text-white'
              : 'border-neutral-300 bg-white text-neutral-700'
          }`}
        >
          Sim
        </button>
        <button
          type="button"
          onClick={() => onChange(false)}
          className={`min-h-12 flex-1 rounded-lg border-2 text-base font-semibold transition-colors ${
            value === false
              ? 'border-vale-green bg-vale-green text-white'
              : 'border-neutral-300 bg-white text-neutral-700'
          }`}
        >
          Não
        </button>
      </div>
    </div>
  )
}
