import type { Perfil } from '@/types/perfil'

export const PERFIL_LABELS: Record<Perfil, string> = {
  ADMINISTRADOR: 'Administrador',
  INSPETOR_SAPORE: 'Inspetor Sapore',
  FISCAL_VALE: 'Fiscal Vale',
}

export const PERFIL_OPTIONS = Object.entries(PERFIL_LABELS).map(
  ([value, label]) => ({ value: value as Perfil, label }),
)
