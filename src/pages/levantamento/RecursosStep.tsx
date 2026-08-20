import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { WizardNav } from '@/features/levantamento/WizardNav'
import { WizardProgress } from '@/features/levantamento/WizardProgress'
import { useDraftStep } from '@/features/levantamento/useDraftStep'
import { useLevantamentoContext } from '@/features/levantamento/useLevantamentoContext'
import {
  getOrCreateDiagnostico,
  updateDiagnostico,
} from '@/services/diagnosticos'

interface RecursosValues {
  operadores: string
  auxiliares: string
  jardineiros: string
  equipeEspecializada: string
  apoioOperacional: string
  composicaoSugerida: string
  observacoes: string
}

const VAZIO: RecursosValues = {
  operadores: '',
  auxiliares: '',
  jardineiros: '',
  equipeEspecializada: '',
  apoioOperacional: '',
  composicaoSugerida: '',
  observacoes: '',
}

function paraInteiroOuNull(valor: string): number | null {
  if (valor.trim() === '') return null
  const numero = Number(valor)
  return Number.isFinite(numero) ? Math.trunc(numero) : null
}

export function RecursosStep() {
  const { levantamento, avm } = useLevantamentoContext()

  const { values, setValues, status, saveNow } = useDraftStep<RecursosValues>({
    storageKey: `levantamento:${levantamento.id}:recursos`,
    emptyValue: VAZIO,
    load: async () => {
      const d = await getOrCreateDiagnostico(levantamento.id)
      return {
        operadores: d.recursos_operadores?.toString() ?? '',
        auxiliares: d.recursos_auxiliares?.toString() ?? '',
        jardineiros: d.recursos_jardineiros?.toString() ?? '',
        equipeEspecializada: d.recursos_equipe_especializada ?? '',
        apoioOperacional: d.recursos_apoio_operacional ?? '',
        composicaoSugerida: d.recursos_composicao_sugerida ?? '',
        observacoes: d.recursos_observacoes ?? '',
      }
    },
    save: async (v) => {
      await updateDiagnostico(levantamento.id, {
        recursos_operadores: paraInteiroOuNull(v.operadores),
        recursos_auxiliares: paraInteiroOuNull(v.auxiliares),
        recursos_jardineiros: paraInteiroOuNull(v.jardineiros),
        recursos_equipe_especializada: v.equipeEspecializada || null,
        recursos_apoio_operacional: v.apoioOperacional || null,
        recursos_composicao_sugerida: v.composicaoSugerida || null,
        recursos_observacoes: v.observacoes || null,
      })
    },
  })

  return (
    <div className="flex flex-col gap-4">
      <WizardProgress currentSlug="recursos" />

      <div className="flex flex-col gap-4 rounded-xl bg-white p-5 shadow-sm">
        <div className="grid grid-cols-3 gap-3">
          <Input
            id="operadores"
            label="Operadores"
            type="number"
            inputMode="numeric"
            min={0}
            value={values.operadores}
            onChange={(event) =>
              setValues({ ...values, operadores: event.target.value })
            }
          />
          <Input
            id="auxiliares"
            label="Auxiliares"
            type="number"
            inputMode="numeric"
            min={0}
            value={values.auxiliares}
            onChange={(event) =>
              setValues({ ...values, auxiliares: event.target.value })
            }
          />
          <Input
            id="jardineiros"
            label="Jardineiros"
            type="number"
            inputMode="numeric"
            min={0}
            value={values.jardineiros}
            onChange={(event) =>
              setValues({ ...values, jardineiros: event.target.value })
            }
          />
        </div>

        <Input
          id="equipeEspecializada"
          label="Equipe especializada"
          value={values.equipeEspecializada}
          onChange={(event) =>
            setValues({ ...values, equipeEspecializada: event.target.value })
          }
        />

        <Input
          id="apoioOperacional"
          label="Apoio operacional"
          value={values.apoioOperacional}
          onChange={(event) =>
            setValues({ ...values, apoioOperacional: event.target.value })
          }
        />

        <Textarea
          id="composicaoSugerida"
          label="Composição sugerida"
          value={values.composicaoSugerida}
          onChange={(event) =>
            setValues({ ...values, composicaoSugerida: event.target.value })
          }
        />

        <Textarea
          id="observacoes"
          label="Observação"
          value={values.observacoes}
          onChange={(event) =>
            setValues({ ...values, observacoes: event.target.value })
          }
        />
      </div>

      <WizardNav
        levantamentoId={levantamento.id}
        avmId={avm.id}
        currentSlug="recursos"
        saveStatus={status}
        onContinuar={saveNow}
      />
    </div>
  )
}
