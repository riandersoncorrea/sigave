import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { EQUIPAMENTO_AVALIACAO_OPTIONS } from '@/constants/levantamento'
import { ListItemCard } from '@/features/levantamento/ListItemCard'
import { WizardNav } from '@/features/levantamento/WizardNav'
import { WizardProgress } from '@/features/levantamento/WizardProgress'
import { useDraftList } from '@/features/levantamento/useDraftList'
import { useLevantamentoContext } from '@/features/levantamento/useLevantamentoContext'
import {
  deleteEquipamento,
  insertEquipamento,
  listEquipamentos,
  updateEquipamento,
} from '@/services/equipamentos'

export function EquipamentosStep() {
  const { levantamento, avm } = useLevantamentoContext()

  const { itens, status, addItem, updateItem, removeItem } = useDraftList({
    storageKey: `levantamento:${levantamento.id}:equipamentos`,
    list: () => listEquipamentos(levantamento.id),
    insert: insertEquipamento,
    update: updateEquipamento,
    remove: deleteEquipamento,
  })

  return (
    <div className="flex flex-col gap-4">
      <WizardProgress currentSlug="equipamentos" />

      <div className="flex flex-col gap-4 rounded-xl bg-white p-5 shadow-sm">
        {itens.length === 0 && (
          <p className="text-sm text-neutral-500">
            Nenhum equipamento registrado.
          </p>
        )}

        {itens.map((item) => (
          <ListItemCard key={item.id} onRemove={() => removeItem(item.id)}>
            <Input
              label="Equipamento"
              value={item.nome}
              onChange={(event) =>
                updateItem(item.id, { nome: event.target.value })
              }
            />
            <Select
              label="Avaliação"
              value={item.avaliacao}
              onChange={(event) =>
                updateItem(item.id, {
                  avaliacao: event.target.value as typeof item.avaliacao,
                })
              }
            >
              {EQUIPAMENTO_AVALIACAO_OPTIONS.map((opcao) => (
                <option key={opcao.value} value={opcao.value}>
                  {opcao.label}
                </option>
              ))}
            </Select>
            <Textarea
              label="Justificativa"
              value={item.justificativa ?? ''}
              onChange={(event) =>
                updateItem(item.id, { justificativa: event.target.value })
              }
            />
          </ListItemCard>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={() =>
            addItem({
              levantamento_id: levantamento.id,
              nome: '',
              avaliacao: 'ADEQUADO',
            })
          }
        >
          + Adicionar equipamento
        </Button>
      </div>

      <WizardNav
        levantamentoId={levantamento.id}
        avmId={avm.id}
        currentSlug="equipamentos"
        saveStatus={status}
        onContinuar={async () => true}
      />
    </div>
  )
}
