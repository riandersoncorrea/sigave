import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { YesNoToggle } from '@/components/ui/YesNoToggle'
import { ACESSO_CONDICAO_VIA_OPTIONS } from '@/constants/levantamento'
import { WizardNav } from '@/features/levantamento/WizardNav'
import { WizardProgress } from '@/features/levantamento/WizardProgress'
import { useDraftStep } from '@/features/levantamento/useDraftStep'
import { useLevantamentoContext } from '@/features/levantamento/useLevantamentoContext'
import {
  getOrCreateDiagnostico,
  updateDiagnostico,
} from '@/services/diagnosticos'

interface AcessoValues {
  veicular: boolean | null
  pedestre: boolean | null
  condicaoVia: string
  restricoes: string
  observacoes: string
}

const VAZIO: AcessoValues = {
  veicular: null,
  pedestre: null,
  condicaoVia: '',
  restricoes: '',
  observacoes: '',
}

export function AcessoStep() {
  const { levantamento, avm } = useLevantamentoContext()

  const { values, setValues, status, saveNow } = useDraftStep<AcessoValues>({
    storageKey: `levantamento:${levantamento.id}:acesso`,
    emptyValue: VAZIO,
    load: async () => {
      const d = await getOrCreateDiagnostico(levantamento.id)
      return {
        veicular: d.acesso_veicular,
        pedestre: d.acesso_pedestre,
        condicaoVia: d.acesso_condicao_via ?? '',
        restricoes: d.acesso_restricoes ?? '',
        observacoes: d.acesso_observacoes ?? '',
      }
    },
    save: async (v) => {
      await updateDiagnostico(levantamento.id, {
        acesso_veicular: v.veicular,
        acesso_pedestre: v.pedestre,
        acesso_condicao_via: v.condicaoVia || null,
        acesso_restricoes: v.restricoes || null,
        acesso_observacoes: v.observacoes || null,
      })
    },
  })

  return (
    <div className="flex flex-col gap-4">
      <WizardProgress currentSlug="acesso" />

      <div className="flex flex-col gap-4 rounded-xl bg-white p-5 shadow-sm">
        <YesNoToggle
          label="Acesso veicular disponível?"
          value={values.veicular}
          onChange={(veicular) => setValues({ ...values, veicular })}
        />
        <YesNoToggle
          label="Acesso de pedestres disponível?"
          value={values.pedestre}
          onChange={(pedestre) => setValues({ ...values, pedestre })}
        />

        <Select
          id="condicaoVia"
          label="Condição da via de acesso"
          value={values.condicaoVia}
          onChange={(event) =>
            setValues({ ...values, condicaoVia: event.target.value })
          }
        >
          <option value="">Selecione</option>
          {ACESSO_CONDICAO_VIA_OPTIONS.map((opcao) => (
            <option key={opcao.value} value={opcao.value}>
              {opcao.label}
            </option>
          ))}
        </Select>

        <Textarea
          id="restricoes"
          label="Restrições de acesso"
          value={values.restricoes}
          onChange={(event) =>
            setValues({ ...values, restricoes: event.target.value })
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
        currentSlug="acesso"
        saveStatus={status}
        onContinuar={saveNow}
      />
    </div>
  )
}
