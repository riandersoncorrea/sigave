import type { TextareaHTMLAttributes } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
}

export function Textarea({
  label,
  id,
  className = '',
  rows = 3,
  ...props
}: TextareaProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-neutral-700">
        {label}
      </label>
      <textarea
        id={id}
        rows={rows}
        className={`focus:border-vale-green focus:ring-vale-green w-full rounded-lg border border-neutral-300 px-4 py-3 text-base focus:ring-2 focus:outline-none ${className}`}
        {...props}
      />
    </div>
  )
}
