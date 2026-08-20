import { Select } from '@/components/ui/Select'
import { CLASSE_FUNCIONAL_OPTIONS, STATUS_OPTIONS } from '@/constants/avm'
import {
  CONDICAO_NOTA_OPTIONS,
  VEGETACAO_TIPO_OPTIONS,
} from '@/constants/levantamento'
import type { Unidade, Setor } from '@/services/organizacao'
import type { Inspetor } from '@/services/profiles'
import type { DashboardFiltros as Filtros } from '@/types/dashboard'

interface DashboardFiltrosProps {
  filtros: Filtros
  unidades: Unidade[]
  setores: Setor[]
  inspetores: Inspetor[]
  onFiltrosChange: (filtros: Filtros) => void
}

export function DashboardFiltros({
  filtros,
  unidades,
  setores,
  inspetores,
  onFiltrosChange,
}: DashboardFiltrosProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
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
        {STATUS_OPTIONS.map((opcao) => (
          <option key={opcao.value} value={opcao.value}>
            {opcao.label}
          </option>
        ))}
      </Select>

      <Select
        aria-label="Filtrar por condição"
        value={filtros.condicaoMedia ?? ''}
        onChange={(event) =>
          onFiltrosChange({
            ...filtros,
            condicaoMedia: event.target.value
              ? Number(event.target.value)
              : null,
          })
        }
      >
        <option value="">Condição</option>
        {CONDICAO_NOTA_OPTIONS.map((opcao) => (
          <option key={opcao.value} value={opcao.value}>
            {opcao.label}
          </option>
        ))}
      </Select>

      <Select
        aria-label="Filtrar por tipo de vegetação"
        value={filtros.vegetacaoTipo ?? ''}
        onChange={(event) =>
          onFiltrosChange({
            ...filtros,
            vegetacaoTipo: event.target.value || null,
          })
        }
      >
        <option value="">Tipo de vegetação</option>
        {VEGETACAO_TIPO_OPTIONS.map((opcao) => (
          <option key={opcao.value} value={opcao.value}>
            {opcao.label}
          </option>
        ))}
      </Select>
    </div>
  )
}
