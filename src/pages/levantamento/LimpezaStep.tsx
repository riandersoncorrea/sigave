import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { YesNoToggle } from '@/components/ui/YesNoToggle'
import { LIMPEZA_NIVEL_OPTIONS } from '@/constants/levantamento'
import { WizardNav } from '@/features/levantamento/WizardNav'
import { WizardProgress } from '@/features/levantamento/WizardProgress'
import { useDraftStep } from '@/features/levantamento/useDraftStep'
import { useLevantamentoContext } from '@/features/levantamento/useLevantamentoContext'
import {
  getOrCreateDiagnostico,
  updateDiagnostico,
} from '@/services/diagnosticos'

interface LimpezaValues {
  nivel: string
  presencaResiduos: boolean | null
  tipoResiduos: string
  acumuloEntulho: boolean | null
  necessitaCapina: boolean | null
  observacoes: string
}

const VAZIO: LimpezaValues = {
  nivel: '',
  presencaResiduos: null,
  tipoResiduos: '',
  acumuloEntulho: null,
  necessitaCapina: null,
  observacoes: '',
}

export function LimpezaStep() {
  const { levantamento, avm } = useLevantamentoContext()

  const { values, setValues, status, saveNow } = useDraftStep<LimpezaValues>({
    storageKey: `levantamento:${levantamento.id}:limpeza`,
    emptyValue: VAZIO,
    load: async () => {
      const d = await getOrCreateDiagnostico(levantamento.id)
      return {
        nivel: d.limpeza_nivel ?? '',
        presencaResiduos: d.limpeza_presenca_residuos,
        tipoResiduos: d.limpeza_tipo_residuos ?? '',
        acumuloEntulho: d.limpeza_acumulo_entulho,
        necessitaCapina: d.limpeza_necessita_capina,
        observacoes: d.limpeza_observacoes ?? '',
      }
    },
    save: async (v) => {
      await updateDiagnostico(levantamento.id, {
        limpeza_nivel: v.nivel || null,
        limpeza_presenca_residuos: v.presencaResiduos,
        limpeza_tipo_residuos: v.presencaResiduos
          ? v.tipoResiduos || null
          : null,
        limpeza_acumulo_entulho: v.acumuloEntulho,
        limpeza_necessita_capina: v.necessitaCapina,
        limpeza_observacoes: v.observacoes || null,
      })
    },
  })

  return (
    <div className="flex flex-col gap-4">
      <WizardProgress currentSlug="limpeza" />

      <div className="flex flex-col gap-4 rounded-xl bg-white p-5 shadow-sm">
        <Select
          id="nivel"
          label="Nível de limpeza"
          value={values.nivel}
          onChange={(event) =>
            setValues({ ...values, nivel: event.target.value })
          }
        >
          <option value="">Selecione</option>
          {LIMPEZA_NIVEL_OPTIONS.map((opcao) => (
            <option key={opcao.value} value={opcao.value}>
              {opcao.label}
            </option>
          ))}
        </Select>

        <YesNoToggle
          label="Presença de resíduos?"
          value={values.presencaResiduos}
          onChange={(presencaResiduos) =>
            setValues({ ...values, presencaResiduos })
          }
        />
        {values.presencaResiduos && (
          <Input
            id="tipoResiduos"
            label="Tipo de resíduo"
            value={values.tipoResiduos}
            onChange={(event) =>
              setValues({ ...values, tipoResiduos: event.target.value })
            }
          />
        )}

        <YesNoToggle
          label="Acúmulo de entulho?"
          value={values.acumuloEntulho}
          onChange={(acumuloEntulho) =>
            setValues({ ...values, acumuloEntulho })
          }
        />

        <YesNoToggle
          label="Necessita capina?"
          value={values.necessitaCapina}
          onChange={(necessitaCapina) =>
            setValues({ ...values, necessitaCapina })
          }
        />

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
        currentSlug="limpeza"
        saveStatus={status}
        onContinuar={saveNow}
      />
    </div>
  )
}
