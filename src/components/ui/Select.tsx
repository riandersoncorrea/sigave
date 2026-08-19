import type { ReactNode, SelectHTMLAttributes } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  children: ReactNode
}

export function Select({
  label,
  id,
  className = '',
  children,
  ...props
}: SelectProps) {
  const select = (
    <select
      id={id}
      className={`focus:border-vale-green focus:ring-vale-green min-h-12 w-full rounded-lg border border-neutral-300 bg-white px-4 text-base focus:ring-2 focus:outline-none ${className}`}
      {...props}
    >
      {children}
    </select>
  )

  if (!label) return select

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-neutral-700">
        {label}
      </label>
      {select}
    </div>
  )
}
