import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { CLIMA_OPTIONS } from '@/constants/levantamento'
import { useAuth } from '@/features/auth/useAuth'
import { WizardNav } from '@/features/levantamento/WizardNav'
import { WizardProgress } from '@/features/levantamento/WizardProgress'
import { useDraftStep } from '@/features/levantamento/useDraftStep'
import { useLevantamentoContext } from '@/features/levantamento/useLevantamentoContext'
import {
  getOrCreateDiagnostico,
  updateDiagnostico,
} from '@/services/diagnosticos'

interface CaracterizacaoValues {
  condicoesClimaticas: string
  observacoesGerais: string
}

export function CaracterizacaoStep() {
  const { levantamento, avm } = useLevantamentoContext()
  const { profile } = useAuth()

  const { values, setValues, status, saveNow } =
    useDraftStep<CaracterizacaoValues>({
      storageKey: `levantamento:${levantamento.id}:caracterizacao`,
      emptyValue: { condicoesClimaticas: '', observacoesGerais: '' },
      load: async () => {
        const d = await getOrCreateDiagnostico(levantamento.id)
        return {
          condicoesClimaticas: d.condicoes_climaticas ?? '',
          observacoesGerais: d.caracterizacao_observacoes ?? '',
        }
      },
      save: async (v) => {
        await updateDiagnostico(levantamento.id, {
          condicoes_climaticas: v.condicoesClimaticas || null,
          caracterizacao_observacoes: v.observacoesGerais || null,
        })
      },
    })

  return (
    <div className="flex flex-col gap-4">
      <WizardProgress currentSlug="caracterizacao" />

      <div className="flex flex-col gap-4 rounded-xl bg-white p-5 shadow-sm">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs font-medium tracking-wide text-neutral-500 uppercase">
              Data e hora de início
            </p>
            <p className="text-neutral-900">
              {new Date(levantamento.created_at).toLocaleString('pt-BR')}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium tracking-wide text-neutral-500 uppercase">
              Usuário
            </p>
            <p className="text-neutral-900">
              {profile?.nomeCompleto || profile?.email}
            </p>
          </div>
        </div>

        <Select
          id="condicoesClimaticas"
          label="Condições climáticas"
          value={values.condicoesClimaticas}
          onChange={(event) =>
            setValues({ ...values, condicoesClimaticas: event.target.value })
          }
        >
          <option value="">Selecione</option>
          {CLIMA_OPTIONS.map((opcao) => (
            <option key={opcao.value} value={opcao.value}>
              {opcao.label}
            </option>
          ))}
        </Select>

        <Textarea
          id="observacoesGerais"
          label="Observações gerais"
          value={values.observacoesGerais}
          onChange={(event) =>
            setValues({ ...values, observacoesGerais: event.target.value })
          }
        />
      </div>

      <WizardNav
        levantamentoId={levantamento.id}
        avmId={avm.id}
        currentSlug="caracterizacao"
        saveStatus={status}
        onContinuar={saveNow}
      />
    </div>
  )
}
