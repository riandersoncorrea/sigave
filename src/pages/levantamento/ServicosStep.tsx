import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { SERVICO_NECESSIDADE_OPTIONS } from '@/constants/levantamento'
import { ListItemCard } from '@/features/levantamento/ListItemCard'
import { WizardNav } from '@/features/levantamento/WizardNav'
import { WizardProgress } from '@/features/levantamento/WizardProgress'
import { useDraftList } from '@/features/levantamento/useDraftList'
import { useLevantamentoContext } from '@/features/levantamento/useLevantamentoContext'
import {
  deleteServico,
  insertServico,
  listServicos,
  updateServico,
} from '@/services/servicos'

// "Não calcular frequência" — este passo registra apenas necessidade e
// observação por serviço, nunca uma frequência sugerida.
export function ServicosStep() {
  const { levantamento, avm } = useLevantamentoContext()

  const { itens, status, addItem, updateItem, removeItem } = useDraftList({
    storageKey: `levantamento:${levantamento.id}:servicos`,
    list: () => listServicos(levantamento.id),
    insert: insertServico,
    update: updateServico,
    remove: deleteServico,
  })

  return (
    <div className="flex flex-col gap-4">
      <WizardProgress currentSlug="servicos" />

      <div className="flex flex-col gap-4 rounded-xl bg-white p-5 shadow-sm">
        {itens.length === 0 && (
          <p className="text-sm text-neutral-500">Nenhum serviço registrado.</p>
        )}

        {itens.map((item) => (
          <ListItemCard key={item.id} onRemove={() => removeItem(item.id)}>
            <Input
              label="Serviço"
              value={item.nome}
              onChange={(event) =>
                updateItem(item.id, { nome: event.target.value })
              }
            />
            <Select
              label="Necessidade"
              value={item.necessidade}
              onChange={(event) =>
                updateItem(item.id, {
                  necessidade: event.target.value as typeof item.necessidade,
                })
              }
            >
              {SERVICO_NECESSIDADE_OPTIONS.map((opcao) => (
                <option key={opcao.value} value={opcao.value}>
                  {opcao.label}
                </option>
              ))}
            </Select>
            <Textarea
              label="Observação"
              value={item.observacao ?? ''}
              onChange={(event) =>
                updateItem(item.id, { observacao: event.target.value })
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
              necessidade: 'A_AVALIAR',
            })
          }
        >
          + Adicionar serviço
        </Button>
      </div>

      <WizardNav
        levantamentoId={levantamento.id}
        avmId={avm.id}
        currentSlug="servicos"
        saveStatus={status}
        onContinuar={async () => true}
      />
    </div>
  )
}
