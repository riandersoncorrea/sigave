import { CheckboxGroup } from '@/components/ui/CheckboxGroup'
import { Textarea } from '@/components/ui/Textarea'
import { YesNoToggle } from '@/components/ui/YesNoToggle'
import { MEIO_AMBIENTE_CATEGORIAS_OPTIONS } from '@/constants/levantamento'
import { WizardNav } from '@/features/levantamento/WizardNav'
import { WizardProgress } from '@/features/levantamento/WizardProgress'
import { useDraftStep } from '@/features/levantamento/useDraftStep'
import { useLevantamentoContext } from '@/features/levantamento/useLevantamentoContext'
import {
  getOrCreateDiagnostico,
  updateDiagnostico,
} from '@/services/diagnosticos'

interface MeioAmbienteValues {
  gate: boolean | null
  categorias: string[]
  observacoes: string
}

const VAZIO: MeioAmbienteValues = {
  gate: null,
  categorias: [],
  observacoes: '',
}

// Este módulo só registra um alerta e as categorias observadas — ele nunca
// autoriza intervenção nem substitui a avaliação/autorização ambiental
// formal (ver alerta abaixo).
export function MeioAmbienteStep() {
  const { levantamento, avm } = useLevantamentoContext()

  const { values, setValues, status, saveNow } =
    useDraftStep<MeioAmbienteValues>({
      storageKey: `levantamento:${levantamento.id}:meio-ambiente`,
      emptyValue: VAZIO,
      load: async () => {
        const d = await getOrCreateDiagnostico(levantamento.id)
        return {
          gate: d.meio_ambiente_gate,
          categorias: d.meio_ambiente_categorias ?? [],
          observacoes: d.meio_ambiente_observacoes ?? '',
        }
      },
      save: async (v) => {
        await updateDiagnostico(levantamento.id, {
          meio_ambiente_gate: v.gate,
          meio_ambiente_categorias: v.categorias,
          meio_ambiente_observacoes: v.observacoes || null,
        })
      },
    })

  return (
    <div className="flex flex-col gap-4">
      <WizardProgress currentSlug="meio-ambiente" />

      <div className="flex flex-col gap-4 rounded-xl bg-white p-5 shadow-sm">
        <YesNoToggle
          label="Há indícios que exigem avaliação ambiental?"
          value={values.gate}
          onChange={(gate) => setValues({ ...values, gate })}
        />

        {values.gate && (
          <>
            <div className="rounded-lg border-2 border-orange-400 bg-orange-50 p-4">
              <p className="text-sm font-bold text-orange-800">
                ATENÇÃO: NECESSITA AVALIAÇÃO/AUTORIZAÇÃO AMBIENTAL.
              </p>
              <p className="mt-1 text-xs text-orange-700">
                Este registro não autoriza qualquer intervenção — é apenas um
                alerta para acompanhamento posterior.
              </p>
            </div>

            <CheckboxGroup
              label="Categorias ambientais identificadas"
              options={MEIO_AMBIENTE_CATEGORIAS_OPTIONS}
              value={values.categorias}
              onChange={(categorias) => setValues({ ...values, categorias })}
            />
          </>
        )}

        <Textarea
          id="observacoes"
          label="Observações"
          value={values.observacoes}
          onChange={(event) =>
            setValues({ ...values, observacoes: event.target.value })
          }
        />
      </div>

      <WizardNav
        levantamentoId={levantamento.id}
        avmId={avm.id}
        currentSlug="meio-ambiente"
        saveStatus={status}
        onContinuar={saveNow}
      />
    </div>
  )
}
