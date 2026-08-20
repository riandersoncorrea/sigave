import { CheckboxGroup } from '@/components/ui/CheckboxGroup'
import { Select } from '@/components/ui/Select'
import {
  TERRENO_GRAU_OBSTACULOS_OPTIONS,
  TERRENO_INCLINACAO_OPTIONS,
  TERRENO_OBSTACULOS_OPTIONS,
  TERRENO_SUPERFICIE_OPTIONS,
  TERRENO_TOPOGRAFIA_OPTIONS,
} from '@/constants/levantamento'
import { WizardNav } from '@/features/levantamento/WizardNav'
import { WizardProgress } from '@/features/levantamento/WizardProgress'
import { useDraftStep } from '@/features/levantamento/useDraftStep'
import { useLevantamentoContext } from '@/features/levantamento/useLevantamentoContext'
import {
  getOrCreateDiagnostico,
  updateDiagnostico,
} from '@/services/diagnosticos'

interface TerrenoValues {
  topografia: string
  inclinacao: string
  superficie: string
  obstaculos: string[]
  grauObstaculos: string
}

const VAZIO: TerrenoValues = {
  topografia: '',
  inclinacao: '',
  superficie: '',
  obstaculos: [],
  grauObstaculos: '',
}

export function TerrenoStep() {
  const { levantamento, avm } = useLevantamentoContext()

  const { values, setValues, status, saveNow } = useDraftStep<TerrenoValues>({
    storageKey: `levantamento:${levantamento.id}:terreno`,
    emptyValue: VAZIO,
    load: async () => {
      const d = await getOrCreateDiagnostico(levantamento.id)
      return {
        topografia: d.topografia ?? '',
        inclinacao: d.inclinacao ?? '',
        superficie: d.superficie ?? '',
        obstaculos: Array.isArray(d.obstaculos)
          ? (d.obstaculos as string[])
          : [],
        grauObstaculos: d.grau_obstaculos ?? '',
      }
    },
    save: async (v) => {
      await updateDiagnostico(levantamento.id, {
        topografia: v.topografia || null,
        inclinacao: v.inclinacao || null,
        superficie: v.superficie || null,
        obstaculos: v.obstaculos,
        grau_obstaculos: v.grauObstaculos || null,
      })
    },
  })

  return (
    <div className="flex flex-col gap-4">
      <WizardProgress currentSlug="terreno" />

      <div className="flex flex-col gap-4 rounded-xl bg-white p-5 shadow-sm">
        <Select
          id="topografia"
          label="Topografia"
          value={values.topografia}
          onChange={(event) =>
            setValues({ ...values, topografia: event.target.value })
          }
        >
          <option value="">Selecione</option>
          {TERRENO_TOPOGRAFIA_OPTIONS.map((opcao) => (
            <option key={opcao.value} value={opcao.value}>
              {opcao.label}
            </option>
          ))}
        </Select>

        <Select
          id="inclinacao"
          label="Inclinação"
          value={values.inclinacao}
          onChange={(event) =>
            setValues({ ...values, inclinacao: event.target.value })
          }
        >
          <option value="">Selecione</option>
          {TERRENO_INCLINACAO_OPTIONS.map((opcao) => (
            <option key={opcao.value} value={opcao.value}>
              {opcao.label}
            </option>
          ))}
        </Select>

        <Select
          id="superficie"
          label="Superfície"
          value={values.superficie}
          onChange={(event) =>
            setValues({ ...values, superficie: event.target.value })
          }
        >
          <option value="">Selecione</option>
          {TERRENO_SUPERFICIE_OPTIONS.map((opcao) => (
            <option key={opcao.value} value={opcao.value}>
              {opcao.label}
            </option>
          ))}
        </Select>

        <CheckboxGroup
          label="Obstáculos (múltiplos)"
          options={TERRENO_OBSTACULOS_OPTIONS}
          value={values.obstaculos}
          onChange={(obstaculos) => setValues({ ...values, obstaculos })}
        />

        <Select
          id="grauObstaculos"
          label="Grau de obstáculos"
          value={values.grauObstaculos}
          onChange={(event) =>
            setValues({ ...values, grauObstaculos: event.target.value })
          }
        >
          <option value="">Selecione</option>
          {TERRENO_GRAU_OBSTACULOS_OPTIONS.map((opcao) => (
            <option key={opcao.value} value={opcao.value}>
              {opcao.label}
            </option>
          ))}
        </Select>
      </div>

      <WizardNav
        levantamentoId={levantamento.id}
        avmId={avm.id}
        currentSlug="terreno"
        saveStatus={status}
        onContinuar={saveNow}
      />
    </div>
  )
}
