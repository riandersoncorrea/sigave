import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { ListItemCard } from '@/features/levantamento/ListItemCard'
import { WizardNav } from '@/features/levantamento/WizardNav'
import { WizardProgress } from '@/features/levantamento/WizardProgress'
import { useDraftList } from '@/features/levantamento/useDraftList'
import { useLevantamentoContext } from '@/features/levantamento/useLevantamentoContext'
import {
  deleteInterferencia,
  insertInterferencia,
  listInterferencias,
  updateInterferencia,
} from '@/services/interferencias'

export function InterferenciasStep() {
  const { levantamento, avm } = useLevantamentoContext()

  const { itens, status, addItem, updateItem, removeItem } = useDraftList({
    storageKey: `levantamento:${levantamento.id}:interferencias`,
    list: () => listInterferencias(levantamento.id),
    insert: insertInterferencia,
    update: updateInterferencia,
    remove: deleteInterferencia,
  })

  return (
    <div className="flex flex-col gap-4">
      <WizardProgress currentSlug="interferencias" />

      <div className="flex flex-col gap-4 rounded-xl bg-white p-5 shadow-sm">
        {itens.length === 0 && (
          <p className="text-sm text-neutral-500">
            Nenhuma interferência registrada.
          </p>
        )}

        {itens.map((item) => (
          <ListItemCard key={item.id} onRemove={() => removeItem(item.id)}>
            <Input
              label="Tipo de interferência"
              value={item.tipo}
              onChange={(event) =>
                updateItem(item.id, { tipo: event.target.value })
              }
            />
            <Textarea
              label="Descrição"
              value={item.descricao ?? ''}
              onChange={(event) =>
                updateItem(item.id, { descricao: event.target.value })
              }
            />
          </ListItemCard>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={() =>
            addItem({ levantamento_id: levantamento.id, tipo: '' })
          }
        >
          + Adicionar interferência
        </Button>
      </div>

      <WizardNav
        levantamentoId={levantamento.id}
        avmId={avm.id}
        currentSlug="interferencias"
        saveStatus={status}
        onContinuar={async () => true}
      />
    </div>
  )
}
