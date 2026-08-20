import { useOutletContext } from 'react-router-dom'
import type { LevantamentoOutletContext } from '@/pages/levantamento/LevantamentoWizardRoute'

export function useLevantamentoContext() {
  return useOutletContext<LevantamentoOutletContext>()
}
