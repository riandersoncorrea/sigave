import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'outline'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  children: ReactNode
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    'bg-vale-green text-white hover:bg-vale-green-dark active:bg-vale-green-dark',
  secondary: 'bg-vale-yellow text-neutral-900 hover:brightness-95',
  outline:
    'border-2 border-vale-green text-vale-green bg-transparent hover:bg-vale-green-light',
}

export function Button({
  variant = 'primary',
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex min-h-12 w-full items-center justify-center rounded-lg px-6 py-3 text-base font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${VARIANT_CLASSES[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
