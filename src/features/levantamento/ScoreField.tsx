import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { CONDICAO_NOTA_OPTIONS } from '@/constants/levantamento'

interface ScoreFieldProps {
  label: string
  nota: number | null
  observacao: string
  onNotaChange: (nota: number | null) => void
  onObservacaoChange: (observacao: string) => void
  erro?: string
}

// Nota 3, 4 ou 5 exige observação (regra da Sprint 3). A exigência de foto
// para nota 4/5 fica para quando o módulo de fotos existir (Sprint 4).
export function ScoreField({
  label,
  nota,
  observacao,
  onNotaChange,
  onObservacaoChange,
  erro,
}: ScoreFieldProps) {
  const exigeObservacao = nota != null && nota >= 3

  return (
    <div className="flex flex-col gap-2 border-b border-neutral-100 pb-4 last:border-b-0 last:pb-0">
      <Select
        label={label}
        value={nota ?? ''}
        onChange={(event) =>
          onNotaChange(
            event.target.value === '' ? null : Number(event.target.value),
          )
        }
      >
        <option value="">Selecione</option>
        {CONDICAO_NOTA_OPTIONS.map((opcao) => (
          <option key={opcao.value} value={opcao.value}>
            {opcao.label}
          </option>
        ))}
      </Select>

      {exigeObservacao && (
        <Textarea
          label="Observação (obrigatória para nota 3, 4 ou 5)"
          value={observacao}
          onChange={(event) => onObservacaoChange(event.target.value)}
        />
      )}

      {erro && <p className="text-sm text-red-600">{erro}</p>}
    </div>
  )
}
