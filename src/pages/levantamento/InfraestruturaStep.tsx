import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { YesNoToggle } from '@/components/ui/YesNoToggle'
import {
  INFRAESTRUTURA_NECESSIDADE_OPTIONS,
  INFRAESTRUTURA_TIPO_OPTIONS,
} from '@/constants/levantamento'
import { WizardNav } from '@/features/levantamento/WizardNav'
import { WizardProgress } from '@/features/levantamento/WizardProgress'
import { useDraftStep } from '@/features/levantamento/useDraftStep'
import { useLevantamentoContext } from '@/features/levantamento/useLevantamentoContext'
import {
  getOrCreateInfraestrutura,
  updateInfraestrutura,
} from '@/services/infraestrutura'

interface InfraestruturaValues {
  existente: boolean | null
  interferencia: boolean | null
  descricao: string
  tipo: string
  necessidadeIntervencao: string
}

const VAZIO: InfraestruturaValues = {
  existente: null,
  interferencia: null,
  descricao: '',
  tipo: '',
  necessidadeIntervencao: '',
}

export function InfraestruturaStep() {
  const { levantamento, avm } = useLevantamentoContext()

  const { values, setValues, status, saveNow } =
    useDraftStep<InfraestruturaValues>({
      storageKey: `levantamento:${levantamento.id}:infraestrutura`,
      emptyValue: VAZIO,
      load: async () => {
        const i = await getOrCreateInfraestrutura(levantamento.id)
        return {
          existente: i.existente,
          interferencia: i.interferencia,
          descricao: i.descricao ?? '',
          tipo: i.tipo ?? '',
          necessidadeIntervencao: i.necessidade_intervencao ?? '',
        }
      },
      save: async (v) => {
        await updateInfraestrutura(levantamento.id, {
          existente: v.existente,
          interferencia: v.interferencia,
          descricao: v.descricao || null,
          tipo: v.tipo || null,
          necessidade_intervencao: v.necessidadeIntervencao || null,
        })
      },
    })

  return (
    <div className="flex flex-col gap-4">
      <WizardProgress currentSlug="infraestrutura" />

      <div className="flex flex-col gap-4 rounded-xl bg-white p-5 shadow-sm">
        <YesNoToggle
          label="Infraestrutura existente na área?"
          value={values.existente}
          onChange={(existente) => setValues({ ...values, existente })}
        />

        {values.existente && (
          <Select
            id="tipo"
            label="Tipo de infraestrutura"
            value={values.tipo}
            onChange={(event) =>
              setValues({ ...values, tipo: event.target.value })
            }
          >
            <option value="">Selecione</option>
            {INFRAESTRUTURA_TIPO_OPTIONS.map((opcao) => (
              <option key={opcao.value} value={opcao.value}>
                {opcao.label}
              </option>
            ))}
          </Select>
        )}

        <YesNoToggle
          label="Há interferência com a infraestrutura?"
          value={values.interferencia}
          onChange={(interferencia) => setValues({ ...values, interferencia })}
        />

        {values.interferencia && (
          <Textarea
            id="descricao"
            label="Descrição da interferência"
            value={values.descricao}
            onChange={(event) =>
              setValues({ ...values, descricao: event.target.value })
            }
          />
        )}

        <Select
          id="necessidadeIntervencao"
          label="Necessidade de intervenção"
          value={values.necessidadeIntervencao}
          onChange={(event) =>
            setValues({
              ...values,
              necessidadeIntervencao: event.target.value,
            })
          }
        >
          <option value="">Selecione</option>
          {INFRAESTRUTURA_NECESSIDADE_OPTIONS.map((opcao) => (
            <option key={opcao.value} value={opcao.value}>
              {opcao.label}
            </option>
          ))}
        </Select>
      </div>

      <WizardNav
        levantamentoId={levantamento.id}
        avmId={avm.id}
        currentSlug="infraestrutura"
        saveStatus={status}
        onContinuar={saveNow}
      />
    </div>
  )
}
