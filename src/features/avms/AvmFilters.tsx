import { Select } from '@/components/ui/Select'
import { CLASSE_FUNCIONAL_OPTIONS, STATUS_OPTIONS } from '@/constants/avm'
import type { Unidade, Setor } from '@/services/organizacao'
import type { Inspetor } from '@/services/profiles'
import type { AvmFiltros, AvmOrdenacao, AvmOrdenacaoCampo } from '@/types/avm'

const ORDENACAO_OPTIONS: { value: AvmOrdenacaoCampo; label: string }[] = [
  { value: 'id_avm', label: 'ID da AVM' },
  { value: 'nome', label: 'Nome' },
  { value: 'classe_funcional', label: 'Classe funcional' },
  { value: 'status', label: 'Status' },
]

interface AvmFiltersProps {
  filtros: AvmFiltros
  ordenacao: AvmOrdenacao
  unidades: Unidade[]
  setores: Setor[]
  inspetores: Inspetor[]
  mostrarFiltroInspetor: boolean
  onFiltrosChange: (filtros: AvmFiltros) => void
  onOrdenacaoChange: (ordenacao: AvmOrdenacao) => void
}

export function AvmFilters({
  filtros,
  ordenacao,
  unidades,
  setores,
  inspetores,
  mostrarFiltroInspetor,
  onFiltrosChange,
  onOrdenacaoChange,
}: AvmFiltersProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl bg-white p-4 shadow-sm">
      <input
        type="search"
        placeholder="Buscar por nome ou ID da AVM"
        value={filtros.busca}
        onChange={(event) =>
          onFiltrosChange({ ...filtros, busca: event.target.value })
        }
        className="focus:border-vale-green focus:ring-vale-green min-h-12 w-full rounded-lg border border-neutral-300 px-4 text-base focus:ring-2 focus:outline-none"
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <Select
          aria-label="Filtrar por unidade"
          value={filtros.unidadeId ?? ''}
          onChange={(event) =>
            onFiltrosChange({
              ...filtros,
              unidadeId: event.target.value || null,
              setorId: null,
            })
          }
        >
          <option value="">Unidade</option>
          {unidades.map((unidade) => (
            <option key={unidade.id} value={unidade.id}>
              {unidade.nome}
            </option>
          ))}
        </Select>

        <Select
          aria-label="Filtrar por setor"
          value={filtros.setorId ?? ''}
          onChange={(event) =>
            onFiltrosChange({
              ...filtros,
              setorId: event.target.value || null,
            })
          }
        >
          <option value="">Setor</option>
          {setores.map((setor) => (
            <option key={setor.id} value={setor.id}>
              {setor.nome}
            </option>
          ))}
        </Select>

        <Select
          aria-label="Filtrar por classe funcional"
          value={filtros.classeFuncional ?? ''}
          onChange={(event) =>
            onFiltrosChange({
              ...filtros,
              classeFuncional:
                (event.target.value as AvmFiltros['classeFuncional']) || null,
            })
          }
        >
          <option value="">Classe</option>
          {CLASSE_FUNCIONAL_OPTIONS.map((opcao) => (
            <option key={opcao.value} value={opcao.value}>
              {opcao.label}
            </option>
          ))}
        </Select>

        <Select
          aria-label="Filtrar por status"
          value={filtros.status ?? ''}
          onChange={(event) =>
            onFiltrosChange({
              ...filtros,
              status: (event.target.value as AvmFiltros['status']) || null,
            })
          }
        >
          <option value="">Status</option>
          {STATUS_OPTIONS.map((opcao) => (
            <option key={opcao.value} value={opcao.value}>
              {opcao.label}
            </option>
          ))}
        </Select>

        {mostrarFiltroInspetor && (
          <Select
            aria-label="Filtrar por inspetor"
            value={filtros.inspetorId ?? ''}
            onChange={(event) =>
              onFiltrosChange({
                ...filtros,
                inspetorId: event.target.value || null,
              })
            }
          >
            <option value="">Inspetor</option>
            {inspetores.map((inspetor) => (
              <option key={inspetor.id} value={inspetor.id}>
                {inspetor.nome_completo || inspetor.email}
              </option>
            ))}
          </Select>
        )}

        <Select
          aria-label="Ordenar por"
          value={ordenacao.campo}
          onChange={(event) =>
            onOrdenacaoChange({
              ...ordenacao,
              campo: event.target.value as AvmOrdenacaoCampo,
            })
          }
        >
          {ORDENACAO_OPTIONS.map((opcao) => (
            <option key={opcao.value} value={opcao.value}>
              Ordenar: {opcao.label}
            </option>
          ))}
        </Select>
      </div>
    </div>
  )
}
