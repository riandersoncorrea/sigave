import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import {
  EVIDENCIA_TIPO_OPTIONS,
  OCORRENCIA_CRITICIDADE_OPTIONS,
  OCORRENCIA_STATUS_OPTIONS,
  OCORRENCIA_TIPO_OPTIONS,
} from '@/constants/levantamento'
import { ListItemCard } from '@/features/levantamento/ListItemCard'
import { WizardNav } from '@/features/levantamento/WizardNav'
import { WizardProgress } from '@/features/levantamento/WizardProgress'
import { useDraftList } from '@/features/levantamento/useDraftList'
import { useLevantamentoContext } from '@/features/levantamento/useLevantamentoContext'
import { listEvidencias, type Evidencia } from '@/services/evidencias'
import {
  deleteOcorrencia,
  insertOcorrencia,
  listOcorrencias,
  updateOcorrencia,
} from '@/services/ocorrencias'

function rotuloEvidencia(evidencia: Evidencia, indice: number): string {
  const tipo = EVIDENCIA_TIPO_OPTIONS.find(
    (o) => o.value === evidencia.tipo,
  )?.label
  return `#${indice + 1}${tipo ? ` — ${tipo}` : ''}`
}

export function OcorrenciasStep() {
  const { levantamento, avm } = useLevantamentoContext()
  const [evidencias, setEvidencias] = useState<Evidencia[]>([])

  useEffect(() => {
    listEvidencias(levantamento.id).then(setEvidencias)
  }, [levantamento.id])

  const { itens, status, addItem, updateItem, removeItem } = useDraftList({
    storageKey: `levantamento:${levantamento.id}:ocorrencias`,
    list: () => listOcorrencias(levantamento.id),
    insert: insertOcorrencia,
    update: updateOcorrencia,
    remove: deleteOcorrencia,
  })

  return (
    <div className="flex flex-col gap-4">
      <WizardProgress currentSlug="ocorrencias" />

      <div className="flex flex-col gap-4 rounded-xl bg-white p-5 shadow-sm">
        {itens.length === 0 && (
          <p className="text-sm text-neutral-500">
            Nenhuma ocorrência registrada.
          </p>
        )}

        {itens.map((item) => (
          <ListItemCard key={item.id} onRemove={() => removeItem(item.id)}>
            {item.origem_modulo && (
              <p className="text-xs text-neutral-400">
                Originada da etapa Segurança
              </p>
            )}
            <Select
              label="Tipo"
              value={item.tipo ?? ''}
              onChange={(event) =>
                updateItem(item.id, {
                  tipo: event.target.value as typeof item.tipo,
                })
              }
            >
              <option value="">Selecione</option>
              {OCORRENCIA_TIPO_OPTIONS.map((opcao) => (
                <option key={opcao.value} value={opcao.value}>
                  {opcao.label}
                </option>
              ))}
            </Select>

            <Textarea
              label="Descrição"
              value={item.descricao ?? ''}
              onChange={(event) =>
                updateItem(item.id, { descricao: event.target.value })
              }
            />

            <Select
              label="Criticidade preliminar"
              value={item.criticidade ?? ''}
              onChange={(event) =>
                updateItem(item.id, {
                  criticidade: event.target.value as typeof item.criticidade,
                })
              }
            >
              <option value="">Selecione</option>
              {OCORRENCIA_CRITICIDADE_OPTIONS.map((opcao) => (
                <option key={opcao.value} value={opcao.value}>
                  {opcao.label}
                </option>
              ))}
            </Select>

            <Select
              label="Evidência (foto)"
              value={item.evidencia_id ?? ''}
              onChange={(event) =>
                updateItem(item.id, {
                  evidencia_id: event.target.value || null,
                })
              }
            >
              <option value="">Nenhuma</option>
              {evidencias.map((evidencia, indice) => (
                <option key={evidencia.id} value={evidencia.id}>
                  {rotuloEvidencia(evidencia, indice)}
                </option>
              ))}
            </Select>

            <Input
              label="Responsável"
              value={item.responsavel ?? ''}
              onChange={(event) =>
                updateItem(item.id, { responsavel: event.target.value })
              }
            />

            <Select
              label="Status"
              value={item.status}
              onChange={(event) =>
                updateItem(item.id, {
                  status: event.target.value as typeof item.status,
                })
              }
            >
              {OCORRENCIA_STATUS_OPTIONS.map((opcao) => (
                <option key={opcao.value} value={opcao.value}>
                  {opcao.label}
                </option>
              ))}
            </Select>
          </ListItemCard>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={() =>
            addItem({ levantamento_id: levantamento.id, tipo: 'OUTRO' })
          }
        >
          + Adicionar ocorrência
        </Button>
      </div>

      <WizardNav
        levantamentoId={levantamento.id}
        avmId={avm.id}
        currentSlug="ocorrencias"
        saveStatus={status}
        onContinuar={async () => true}
      />
    </div>
  )
}
