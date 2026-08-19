import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Pagination } from '@/components/ui/Pagination'
import { AVM_PAGE_SIZE } from '@/constants/avm'
import { useAuth } from '@/features/auth/useAuth'
import { AvmCard } from '@/features/avms/AvmCard'
import { AvmFilters } from '@/features/avms/AvmFilters'
import { AvmTable } from '@/features/avms/AvmTable'
import { listAvms } from '@/services/avms'
import {
  listSetores,
  listUnidades,
  type Setor,
  type Unidade,
} from '@/services/organizacao'
import { listInspetores, type Inspetor } from '@/services/profiles'
import type { AvmComRelacoes, AvmFiltros, AvmOrdenacao } from '@/types/avm'

const FILTROS_INICIAIS: AvmFiltros = {
  busca: '',
  unidadeId: null,
  setorId: null,
  classeFuncional: null,
  status: null,
  inspetorId: null,
}

const ORDENACAO_INICIAL: AvmOrdenacao = { campo: 'nome', direcao: 'asc' }

export function AvmListPage() {
  const { profile } = useAuth()
  const podeCadastrar =
    profile?.perfil === 'ADMINISTRADOR' || profile?.perfil === 'FISCAL_VALE'

  const [filtros, setFiltros] = useState<AvmFiltros>(FILTROS_INICIAIS)
  const [ordenacao, setOrdenacao] = useState<AvmOrdenacao>(ORDENACAO_INICIAL)
  const [page, setPage] = useState(1)

  const [avms, setAvms] = useState<AvmComRelacoes[]>([])
  const [total, setTotal] = useState(0)
  const [unidades, setUnidades] = useState<Unidade[]>([])
  const [setores, setSetores] = useState<Setor[]>([])
  const [inspetores, setInspetores] = useState<Inspetor[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    listUnidades().then(setUnidades)
    if (podeCadastrar) listInspetores().then(setInspetores)
  }, [podeCadastrar])

  useEffect(() => {
    listSetores(filtros.unidadeId ?? undefined).then(setSetores)
  }, [filtros.unidadeId])

  useEffect(() => {
    let ativo = true
    setLoading(true)
    setErro(null)
    listAvms(filtros, ordenacao, page)
      .then(({ data, count }) => {
        if (!ativo) return
        setAvms(data)
        setTotal(count)
      })
      .catch((error) => {
        if (ativo) setErro(error.message ?? 'Erro ao carregar AVMs.')
      })
      .finally(() => {
        if (ativo) setLoading(false)
      })
    return () => {
      ativo = false
    }
  }, [filtros, ordenacao, page])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-neutral-900">
          Áreas Verdes de Manutenção
        </h1>
        {podeCadastrar && (
          <Link to="/avms/novo">
            <Button fullWidth={false} className="px-4">
              Nova AVM
            </Button>
          </Link>
        )}
      </div>

      <AvmFilters
        filtros={filtros}
        ordenacao={ordenacao}
        unidades={unidades}
        setores={setores}
        inspetores={inspetores}
        mostrarFiltroInspetor={podeCadastrar}
        onFiltrosChange={(novosFiltros) => {
          setFiltros(novosFiltros)
          setPage(1)
        }}
        onOrdenacaoChange={(novaOrdenacao) => {
          setOrdenacao(novaOrdenacao)
          setPage(1)
        }}
      />

      {erro && <p className="text-sm text-red-600">{erro}</p>}

      {loading ? (
        <p className="text-sm text-neutral-500">Carregando…</p>
      ) : avms.length === 0 ? (
        <p className="rounded-xl bg-white p-6 text-center text-sm text-neutral-500 shadow-sm">
          Nenhuma AVM encontrada.
        </p>
      ) : (
        <>
          <AvmTable avms={avms} />
          <div className="flex flex-col gap-3 md:hidden">
            {avms.map((avm) => (
              <AvmCard key={avm.id} avm={avm} />
            ))}
          </div>
        </>
      )}

      <Pagination
        page={page}
        pageSize={AVM_PAGE_SIZE}
        total={total}
        onPageChange={setPage}
      />
    </div>
  )
}
