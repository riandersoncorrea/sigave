import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
}

export function Input({ label, id, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-neutral-700">
        {label}
      </label>
      <input
        id={id}
        className={`focus:border-vale-green focus:ring-vale-green min-h-12 w-full rounded-lg border border-neutral-300 px-4 text-base focus:ring-2 focus:outline-none ${className}`}
        {...props}
      />
    </div>
  )
}
