import type { Opcao } from '@/constants/levantamento'

interface CheckboxGroupProps {
  label: string
  options: Opcao[]
  value: string[]
  onChange: (value: string[]) => void
}

export function CheckboxGroup({
  label,
  options,
  value,
  onChange,
}: CheckboxGroupProps) {
  function toggle(optionValue: string) {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue))
    } else {
      onChange([...value, optionValue])
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-neutral-700">{label}</span>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {options.map((option) => {
          const checked = value.includes(option.value)
          return (
            <label
              key={option.value}
              className={`flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border-2 px-3 text-sm transition-colors ${
                checked
                  ? 'border-vale-green bg-vale-green-light'
                  : 'border-neutral-300 bg-white'
              }`}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggle(option.value)}
                className="accent-vale-green h-4 w-4"
              />
              {option.label}
            </label>
          )
        })}
      </div>
    </div>
  )
}
