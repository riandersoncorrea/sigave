import { useState } from 'react'
import {
  CONDICAO_DIMENSOES,
  type CondicaoDimensaoChave,
} from '@/constants/levantamento'
import { ScoreField } from '@/features/levantamento/ScoreField'
import { WizardNav } from '@/features/levantamento/WizardNav'
import { WizardProgress } from '@/features/levantamento/WizardProgress'
import { useDraftStep } from '@/features/levantamento/useDraftStep'
import { useLevantamentoContext } from '@/features/levantamento/useLevantamentoContext'
import {
  getOrCreateDiagnostico,
  updateDiagnostico,
} from '@/services/diagnosticos'

type CondicaoValues = Record<
  CondicaoDimensaoChave,
  { nota: number | null; obs: string }
>

function valoresVazios(): CondicaoValues {
  return CONDICAO_DIMENSOES.reduce((acc, dim) => {
    acc[dim.chave] = { nota: null, obs: '' }
    return acc
  }, {} as CondicaoValues)
}

export function CondicaoStep() {
  const { levantamento, avm } = useLevantamentoContext()
  const [erros, setErros] = useState<
    Partial<Record<CondicaoDimensaoChave, string>>
  >({})

  const { values, setValues, status, saveNow } = useDraftStep<CondicaoValues>({
    storageKey: `levantamento:${levantamento.id}:condicao`,
    emptyValue: valoresVazios(),
    load: async () => {
      const d = await getOrCreateDiagnostico(levantamento.id)
      const resultado = valoresVazios()
      for (const dim of CONDICAO_DIMENSOES) {
        const notaCol = `condicao_${dim.chave}_nota` as keyof typeof d
        const obsCol = `condicao_${dim.chave}_obs` as keyof typeof d
        resultado[dim.chave] = {
          nota: (d[notaCol] as number | null) ?? null,
          obs: (d[obsCol] as string | null) ?? '',
        }
      }
      return resultado
    },
    save: async (v) => {
      const patch: Record<string, number | string | null> = {}
      for (const dim of CONDICAO_DIMENSOES) {
        patch[`condicao_${dim.chave}_nota`] = v[dim.chave].nota
        patch[`condicao_${dim.chave}_obs`] = v[dim.chave].obs || null
      }
      await updateDiagnostico(levantamento.id, patch)
    },
  })

  function setDimensao(
    chave: CondicaoDimensaoChave,
    patch: Partial<{ nota: number | null; obs: string }>,
  ) {
    setValues({ ...values, [chave]: { ...values[chave], ...patch } })
    setErros((atual) => ({ ...atual, [chave]: undefined }))
  }

  async function handleContinuar() {
    const novosErros: Partial<Record<CondicaoDimensaoChave, string>> = {}
    for (const dim of CONDICAO_DIMENSOES) {
      const { nota, obs } = values[dim.chave]
      if (nota != null && nota >= 3 && !obs.trim()) {
        novosErros[dim.chave] = 'Observação obrigatória para essa nota.'
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
      <WizardProgress currentSlug="condicao" />

      <div className="flex flex-col gap-4 rounded-xl bg-white p-5 shadow-sm">
        {CONDICAO_DIMENSOES.map((dim) => (
          <ScoreField
            key={dim.chave}
            label={dim.label}
            nota={values[dim.chave].nota}
            observacao={values[dim.chave].obs}
            onNotaChange={(nota) => setDimensao(dim.chave, { nota })}
            onObservacaoChange={(obs) => setDimensao(dim.chave, { obs })}
            erro={erros[dim.chave]}
          />
        ))}
      </div>

      <WizardNav
        levantamentoId={levantamento.id}
        avmId={avm.id}
        currentSlug="condicao"
        saveStatus={status}
        onContinuar={handleContinuar}
      />
    </div>
  )
}
