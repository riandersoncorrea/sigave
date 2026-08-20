import type { ReactNode } from 'react'

interface DrawerProps {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
}

// Bottom sheet simples para mobile (filtros do dashboard, Sprint 7) — sem
// lib nova, mesmo padrão do resto do projeto (componentes de UI próprios
// em cima de Tailwind).
export function Drawer({ open, title, onClose, children }: DrawerProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      <button
        type="button"
        aria-label="Fechar"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />
      <div className="relative flex max-h-[85vh] w-full flex-col gap-4 rounded-t-2xl bg-white p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-neutral-900">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="min-h-10 min-w-10 rounded-full text-lg text-neutral-500 hover:bg-neutral-100"
          >
            ✕
          </button>
        </div>
        <div className="overflow-y-auto">{children}</div>
      </div>
    </div>
  )
}
