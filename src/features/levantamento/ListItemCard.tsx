import type { ReactNode } from 'react'

interface ListItemCardProps {
  onRemove: () => void
  children: ReactNode
}

export function ListItemCard({ onRemove, children }: ListItemCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-neutral-200 p-4">
      <div className="flex flex-col gap-3">{children}</div>
      <button
        type="button"
        onClick={onRemove}
        className="w-fit text-sm font-medium text-red-600 underline"
      >
        Remover
      </button>
    </div>
  )
}
