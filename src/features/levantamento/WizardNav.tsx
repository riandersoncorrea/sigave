import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { SaveIndicator } from '@/features/levantamento/SaveIndicator'
import type { SaveStatus } from '@/features/levantamento/useDraftStep'
import {
  WIZARD_STEPS,
  stepIndex,
  stepPath,
} from '@/features/levantamento/steps'

interface WizardNavProps {
  levantamentoId: string
  avmId: string
  currentSlug: string
  saveStatus: SaveStatus
  onContinuar: () => Promise<boolean>
}

// Voltar nunca é bloqueado (o rascunho já está seguro no localStorage a
// cada alteração — ver useDraftStep/useDraftList). Continuar valida e
// salva a etapa atual antes de avançar.
export function WizardNav({
  levantamentoId,
  avmId,
  currentSlug,
  saveStatus,
  onContinuar,
}: WizardNavProps) {
  const navigate = useNavigate()
  const [avancando, setAvancando] = useState(false)
  const index = stepIndex(currentSlug)
  const anterior = WIZARD_STEPS[index - 1]
  const proximo = WIZARD_STEPS[index + 1]

  function handleVoltar() {
    if (anterior) {
      navigate(stepPath(levantamentoId, anterior.slug))
    } else {
      navigate(`/avms/${avmId}`)
    }
  }

  async function handleContinuar() {
    setAvancando(true)
    try {
      const ok = await onContinuar()
      if (ok && proximo) {
        navigate(stepPath(levantamentoId, proximo.slug))
      }
    } finally {
      setAvancando(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <SaveIndicator status={saveStatus} />
      <div className="flex gap-3">
        <Button variant="outline" className="flex-1" onClick={handleVoltar}>
          Voltar
        </Button>
        {proximo && (
          <Button
            className="flex-1"
            onClick={handleContinuar}
            disabled={avancando}
          >
            {avancando ? 'Salvando…' : 'Continuar'}
          </Button>
        )}
      </div>
    </div>
  )
}
