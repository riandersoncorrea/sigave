import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Drawer } from '@/components/ui/Drawer'
import { DashboardCards } from '@/features/dashboard/DashboardCards'
import { DashboardFiltros } from '@/features/dashboard/DashboardFiltros'
import { DashboardIndicadores } from '@/features/dashboard/DashboardIndicadores'
import { StatusBarChart } from '@/features/dashboard/StatusBarChart'
import {
  calcularCards,
  calcularIndicadores,
  listAvmStatusAtual,
} from '@/services/dashboard'
import {
  listSetores,
  listUnidades,
  type Setor,
  type Unidade,
} from '@/services/organizacao'
import { listInspetores, type Inspetor } from '@/services/profiles'
import type {
  AvmStatusAtual,
  DashboardFiltros as Filtros,
} from '@/types/dashboard'

const FILTROS_INICIAIS: Filtros = {
  unidadeId: null,
  setorId: null,
  classeFuncional: null,
  inspetorId: null,
  status: null,
  condicaoMedia: null,
  vegetacaoTipo: null,
}

export function DashboardPage() {
  const [filtros, setFiltros] = useState<Filtros>(FILTROS_INICIAIS)
  const [linhas, setLinhas] = useState<AvmStatusAtual[]>([])
  const [unidades, setUnidades] = useState<Unidade[]>([])
  const [setores, setSetores] = useState<Setor[]>([])
  const [inspetores, setInspetores] = useState<Inspetor[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [filtrosAbertos, setFiltrosAbertos] = useState(false)

  useEffect(() => {
    listUnidades().then(setUnidades)
    listInspetores().then(setInspetores)
  }, [])

  useEffect(() => {
    listSetores(filtros.unidadeId ?? undefined).then(setSetores)
  }, [filtros.unidadeId])

  useEffect(() => {
    let ativo = true
    setLoading(true)
    setErro(null)
    listAvmStatusAtual(filtros)
      .then((data) => {
        if (ativo) setLinhas(data)
      })
      .catch((error) => {
        if (ativo) setErro(error.message ?? 'Erro ao carregar o dashboard.')
      })
      .finally(() => {
        if (ativo) setLoading(false)
      })
    return () => {
      ativo = false
    }
  }, [filtros])

  const cards = calcularCards(linhas)
  const indicadores = calcularIndicadores(linhas)

  const filtrosProps = {
    filtros,
    unidades,
    setores,
    inspetores,
    onFiltrosChange: setFiltros,
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-neutral-900">Dashboard</h1>
        <Button
          fullWidth={false}
          variant="outline"
          className="px-4 md:hidden"
          onClick={() => setFiltrosAbertos(true)}
        >
          Filtros
        </Button>
      </div>

      <div className="hidden rounded-xl bg-white p-4 shadow-sm md:block">
        <DashboardFiltros {...filtrosProps} />
      </div>

      <Drawer
        open={filtrosAbertos}
        title="Filtros"
        onClose={() => setFiltrosAbertos(false)}
      >
        <DashboardFiltros {...filtrosProps} />
      </Drawer>

      {erro && <p className="text-sm text-red-600">{erro}</p>}

      {loading ? (
        <p className="text-sm text-neutral-500">Carregando…</p>
      ) : (
        <>
          <DashboardCards dados={cards} />
          <DashboardIndicadores dados={indicadores} />
          <StatusBarChart dados={cards} />
        </>
      )}
    </div>
  )
}
