import { useState } from 'react'
import { Textarea } from '@/components/ui/Textarea'
import { YesNoToggle } from '@/components/ui/YesNoToggle'
import {
  SEGURANCA_PERGUNTAS_PADRAO,
  type SegurancaPergunta,
} from '@/constants/levantamento'
import { WizardNav } from '@/features/levantamento/WizardNav'
import { WizardProgress } from '@/features/levantamento/WizardProgress'
import { useDraftStep } from '@/features/levantamento/useDraftStep'
import { useLevantamentoContext } from '@/features/levantamento/useLevantamentoContext'
import {
  getOrCreateDiagnostico,
  updateDiagnostico,
} from '@/services/diagnosticos'
import { insertOcorrencia } from '@/services/ocorrencias'
import type { Json } from '@/types/database'

interface SegurancaValues {
  perguntas: SegurancaPergunta[]
  observacoes: string
}

function perguntasIniciais(): SegurancaPergunta[] {
  return SEGURANCA_PERGUNTAS_PADRAO.map((p) => ({
    ...p,
    resposta: null,
    descricao: '',
  }))
}

export function SegurancaStep() {
  const { levantamento, avm } = useLevantamentoContext()
  const [erros, setErros] = useState<Record<string, string>>({})
  const [registradas, setRegistradas] = useState<Record<string, boolean>>({})

  const { values, setValues, status, saveNow } = useDraftStep<SegurancaValues>({
    storageKey: `levantamento:${levantamento.id}:seguranca`,
    emptyValue: { perguntas: perguntasIniciais(), observacoes: '' },
    load: async () => {
      const d = await getOrCreateDiagnostico(levantamento.id)
      const salvas = Array.isArray(d.seguranca_perguntas)
        ? (d.seguranca_perguntas as unknown as SegurancaPergunta[])
        : []
      return {
        perguntas: salvas.length > 0 ? salvas : perguntasIniciais(),
        observacoes: d.seguranca_observacoes ?? '',
      }
    },
    save: async (v) => {
      await updateDiagnostico(levantamento.id, {
        seguranca_perguntas: v.perguntas as unknown as Json,
        seguranca_observacoes: v.observacoes || null,
      })
    },
  })

  function setPergunta(id: string, patch: Partial<SegurancaPergunta>) {
    setValues({
      ...values,
      perguntas: values.perguntas.map((p) =>
        p.id === id ? { ...p, ...patch } : p,
      ),
    })
    setErros((atual) => ({ ...atual, [id]: '' }))
  }

  async function handleRegistrarOcorrencia(pergunta: SegurancaPergunta) {
    await insertOcorrencia({
      levantamento_id: levantamento.id,
      tipo: 'SEGURANCA',
      descricao: pergunta.descricao,
      origem_modulo: 'seguranca',
      origem_referencia: pergunta.id,
    })
    setRegistradas((atual) => ({ ...atual, [pergunta.id]: true }))
  }

  async function handleContinuar() {
    const novosErros: Record<string, string> = {}
    for (const p of values.perguntas) {
      if (p.resposta === true && !p.descricao.trim()) {
        novosErros[p.id] = 'Descrição obrigatória quando a resposta é sim.'
      }
    }
    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros)
      return false
    }
    return saveNow()
  }

  return (
    <div className="flex flex-col gap-4">
      <WizardProgress currentSlug="seguranca" />

      <div className="flex flex-col gap-4 rounded-xl bg-white p-5 shadow-sm">
        {values.perguntas.map((pergunta) => (
          <div
            key={pergunta.id}
            className="flex flex-col gap-2 border-b border-neutral-100 pb-4 last:border-b-0 last:pb-0"
          >
            <YesNoToggle
              label={pergunta.pergunta}
              value={pergunta.resposta}
              onChange={(resposta) => setPergunta(pergunta.id, { resposta })}
            />

            {pergunta.resposta === true && (
              <>
                <Textarea
                  label="Descrição"
                  value={pergunta.descricao}
                  onChange={(event) =>
                    setPergunta(pergunta.id, {
                      descricao: event.target.value,
                    })
                  }
                />
                <p className="text-xs text-neutral-500">
                  Fotografia será exigida quando o módulo de fotos estiver
                  disponível.
                </p>
                <button
                  type="button"
                  disabled={
                    !pergunta.descricao.trim() || registradas[pergunta.id]
                  }
                  onClick={() => handleRegistrarOcorrencia(pergunta)}
                  className="text-vale-green w-fit text-sm font-semibold underline disabled:cursor-not-allowed disabled:text-neutral-400 disabled:no-underline"
                >
                  {registradas[pergunta.id]
                    ? 'Ocorrência registrada'
                    : 'Registrar como ocorrência'}
                </button>
              </>
            )}

            {erros[pergunta.id] && (
              <p className="text-sm text-red-600">{erros[pergunta.id]}</p>
            )}
          </div>
        ))}

        <Textarea
          id="observacoes"
          label="Observações gerais"
          value={values.observacoes}
          onChange={(event) =>
            setValues({ ...values, observacoes: event.target.value })
          }
        />
      </div>

      <WizardNav
        levantamentoId={levantamento.id}
        avmId={avm.id}
        currentSlug="seguranca"
        saveStatus={status}
        onContinuar={handleContinuar}
      />
    </div>
  )
}
