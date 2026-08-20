import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { DashboardFiltros } from '@/features/dashboard/DashboardFiltros'
import {
  listSetores,
  listUnidades,
  type Setor,
  type Unidade,
} from '@/services/organizacao'
import { listInspetores, type Inspetor } from '@/services/profiles'
import {
  ExportacaoVaziaError,
  exportAvmsCsv,
  exportDiagnosticosCsv,
  exportEquipamentosCsv,
  exportEvidenciasCsv,
  exportInfraestruturaCsv,
  exportLevantamentosCsv,
  exportOcorrenciasCsv,
  exportRecursosCsv,
  exportServicosCsv,
  exportValidacoesCsv,
  exportVegetacaoCsv,
} from '@/services/relatorios'
import type { DashboardFiltros as Filtros } from '@/types/dashboard'

const FILTROS_INICIAIS: Filtros = {
  unidadeId: null,
  setorId: null,
  classeFuncional: null,
  inspetorId: null,
  status: null,
  condicaoMedia: null,
  vegetacaoTipo: null,
}

interface ItemExportacao {
  chave: string
  titulo: string
  exportar: (filtros: Filtros) => Promise<void>
}

const ITENS_EXPORTACAO: ItemExportacao[] = [
  { chave: 'avms', titulo: 'AVMs', exportar: exportAvmsCsv },
  {
    chave: 'levantamentos',
    titulo: 'Levantamentos',
    exportar: exportLevantamentosCsv,
  },
  {
    chave: 'diagnosticos',
    titulo: 'Diagnósticos',
    exportar: exportDiagnosticosCsv,
  },
  { chave: 'vegetacao', titulo: 'Vegetação', exportar: exportVegetacaoCsv },
  {
    chave: 'infraestrutura',
    titulo: 'Infraestrutura',
    exportar: exportInfraestruturaCsv,
  },
  {
    chave: 'ocorrencias',
    titulo: 'Ocorrências',
    exportar: exportOcorrenciasCsv,
  },
  {
    chave: 'equipamentos',
    titulo: 'Equipamentos',
    exportar: exportEquipamentosCsv,
  },
  { chave: 'servicos', titulo: 'Serviços', exportar: exportServicosCsv },
  { chave: 'recursos', titulo: 'Recursos', exportar: exportRecursosCsv },
  {
    chave: 'evidencias',
    titulo: 'Evidências',
    exportar: exportEvidenciasCsv,
  },
  {
    chave: 'validacoes',
    titulo: 'Validações',
    exportar: exportValidacoesCsv,
  },
]

export function RelatoriosPage() {
  const [filtros, setFiltros] = useState<Filtros>(FILTROS_INICIAIS)
  const [unidades, setUnidades] = useState<Unidade[]>([])
  const [setores, setSetores] = useState<Setor[]>([])
  const [inspetores, setInspetores] = useState<Inspetor[]>([])
  const [exportando, setExportando] = useState<string | null>(null)
  const [erros, setErros] = useState<Record<string, string>>({})

  useEffect(() => {
    listUnidades().then(setUnidades)
    listInspetores().then(setInspetores)
  }, [])

  useEffect(() => {
    listSetores(filtros.unidadeId ?? undefined).then(setSetores)
  }, [filtros.unidadeId])

  async function handleExportar(item: ItemExportacao) {
    setExportando(item.chave)
    setErros((atual) => ({ ...atual, [item.chave]: '' }))
    try {
      await item.exportar(filtros)
    } catch (error) {
      const mensagem =
        error instanceof ExportacaoVaziaError
          ? error.message
          : error instanceof Error
            ? error.message
            : 'Erro ao exportar.'
      setErros((atual) => ({ ...atual, [item.chave]: mensagem }))
    } finally {
      setExportando(null)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-bold text-neutral-900">Relatórios</h1>
        <p className="text-sm text-neutral-500">
          Exportação em CSV, filtrada pelas mesmas opções do dashboard. Toda
          exportação mantém o ID_AVM como chave de relacionamento.
        </p>
      </div>

      <div className="rounded-xl bg-white p-4 shadow-sm">
        <DashboardFiltros
          filtros={filtros}
          unidades={unidades}
          setores={setores}
          inspetores={inspetores}
          onFiltrosChange={setFiltros}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {ITENS_EXPORTACAO.map((item) => (
          <div
            key={item.chave}
            className="flex flex-col gap-2 rounded-xl bg-white p-4 shadow-sm"
          >
            <p className="text-sm font-semibold text-neutral-800">
              {item.titulo}
            </p>
            <Button
              variant="outline"
              disabled={exportando === item.chave}
              onClick={() => handleExportar(item)}
            >
              {exportando === item.chave ? 'Exportando…' : 'Exportar CSV'}
            </Button>
            {erros[item.chave] && (
              <p className="text-xs text-red-600">{erros[item.chave]}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
