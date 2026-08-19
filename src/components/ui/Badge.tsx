import type { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  className?: string
}

export function Badge({ children, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${className}`}
    >
      {children}
    </span>
  )
}
