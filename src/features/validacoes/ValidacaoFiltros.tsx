import { Select } from '@/components/ui/Select'
import { CLASSE_FUNCIONAL_OPTIONS } from '@/constants/avm'
import { STATUS_VALIDACAO_OPTIONS } from '@/constants/validacao'
import type { Unidade, Setor } from '@/services/organizacao'
import type { Inspetor } from '@/services/profiles'
import type { ValidacaoFiltros as Filtros } from '@/types/validacao'

interface ValidacaoFiltrosProps {
  filtros: Filtros
  unidades: Unidade[]
  setores: Setor[]
  inspetores: Inspetor[]
  onFiltrosChange: (filtros: Filtros) => void
}

export function ValidacaoFiltros({
  filtros,
  unidades,
  setores,
  inspetores,
  onFiltrosChange,
}: ValidacaoFiltrosProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl bg-white p-4 shadow-sm">
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
            onFiltrosChange({ ...filtros, setorId: event.target.value || null })
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

        <Select
          aria-label="Filtrar por status"
          value={filtros.status ?? ''}
          onChange={(event) =>
            onFiltrosChange({
              ...filtros,
              status: (event.target.value as Filtros['status']) || null,
            })
          }
        >
          <option value="">Status</option>
          {STATUS_VALIDACAO_OPTIONS.map((opcao) => (
            <option key={opcao.value} value={opcao.value}>
              {opcao.label}
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
                (event.target.value as Filtros['classeFuncional']) || null,
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
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-neutral-700">
            Período — de
          </span>
          <input
            type="date"
            value={filtros.periodoInicio ?? ''}
            onChange={(event) =>
              onFiltrosChange({
                ...filtros,
                periodoInicio: event.target.value || null,
              })
            }
            className="focus:border-vale-green focus:ring-vale-green min-h-12 w-full rounded-lg border border-neutral-300 px-4 text-base focus:ring-2 focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-neutral-700">até</span>
          <input
            type="date"
            value={filtros.periodoFim ?? ''}
            onChange={(event) =>
              onFiltrosChange({
                ...filtros,
                periodoFim: event.target.value || null,
              })
            }
            className="focus:border-vale-green focus:ring-vale-green min-h-12 w-full rounded-lg border border-neutral-300 px-4 text-base focus:ring-2 focus:outline-none"
          />
        </label>
      </div>
    </div>
  )
}
