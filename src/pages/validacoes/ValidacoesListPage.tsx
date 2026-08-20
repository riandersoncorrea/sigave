import { useEffect, useState } from 'react'
import { Pagination } from '@/components/ui/Pagination'
import { VALIDACAO_PAGE_SIZE } from '@/constants/validacao'
import { ValidacaoCard } from '@/features/validacoes/ValidacaoCard'
import { ValidacaoFiltros } from '@/features/validacoes/ValidacaoFiltros'
import { ValidacaoTable } from '@/features/validacoes/ValidacaoTable'
import {
  listSetores,
  listUnidades,
  type Setor,
  type Unidade,
} from '@/services/organizacao'
import { listInspetores, type Inspetor } from '@/services/profiles'
import { listLevantamentosParaValidacao } from '@/services/validacoes'
import type {
  LevantamentoParaValidacao,
  ValidacaoFiltros as Filtros,
  ValidacaoOrdenacao,
} from '@/types/validacao'

const FILTROS_INICIAIS: Filtros = {
  unidadeId: null,
  setorId: null,
  inspetorId: null,
  status: null,
  classeFuncional: null,
  periodoInicio: null,
  periodoFim: null,
}

const ORDENACAO: ValidacaoOrdenacao = { campo: 'updated_at', direcao: 'desc' }

export function ValidacoesListPage() {
  const [filtros, setFiltros] = useState<Filtros>(FILTROS_INICIAIS)
  const [page, setPage] = useState(1)

  const [itens, setItens] = useState<LevantamentoParaValidacao[]>([])
  const [total, setTotal] = useState(0)
  const [unidades, setUnidades] = useState<Unidade[]>([])
  const [setores, setSetores] = useState<Setor[]>([])
  const [inspetores, setInspetores] = useState<Inspetor[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

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
    listLevantamentosParaValidacao(filtros, ORDENACAO, page)
      .then(({ data, count }) => {
        if (!ativo) return
        setItens(data)
        setTotal(count)
      })
      .catch((error) => {
        if (ativo) setErro(error.message ?? 'Erro ao carregar levantamentos.')
      })
      .finally(() => {
        if (ativo) setLoading(false)
      })
    return () => {
      ativo = false
    }
  }, [filtros, page])

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-bold text-neutral-900">
        Validação de levantamentos
      </h1>

      <ValidacaoFiltros
        filtros={filtros}
        unidades={unidades}
        setores={setores}
        inspetores={inspetores}
        onFiltrosChange={(novosFiltros) => {
          setFiltros(novosFiltros)
          setPage(1)
        }}
      />

      {erro && <p className="text-sm text-red-600">{erro}</p>}

      {loading ? (
        <p className="text-sm text-neutral-500">Carregando…</p>
      ) : itens.length === 0 ? (
        <p className="rounded-xl bg-white p-6 text-center text-sm text-neutral-500 shadow-sm">
          Nenhum levantamento encontrado.
        </p>
      ) : (
        <>
          <ValidacaoTable itens={itens} />
          <div className="flex flex-col gap-3 md:hidden">
            {itens.map((item) => (
              <ValidacaoCard key={item.id} item={item} />
            ))}
          </div>
        </>
      )}

      <Pagination
        page={page}
        pageSize={VALIDACAO_PAGE_SIZE}
        total={total}
        onPageChange={setPage}
      />
    </div>
  )
}
