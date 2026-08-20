import { useEffect, useState } from 'react'
import { Pagination } from '@/components/ui/Pagination'
import { Select } from '@/components/ui/Select'
import {
  AUDITORIA_PAGE_SIZE,
  listAuditoriaCampos,
  TABELAS_AUDITADAS,
  type AuditLogCampo,
  type AuditoriaFiltros,
} from '@/services/admin/auditoria'
import { listUsuarios, type Usuario } from '@/services/admin/usuarios'

const FILTROS_INICIAIS: AuditoriaFiltros = {
  tabela: null,
  usuarioId: null,
  periodoInicio: null,
  periodoFim: null,
}

function formatarValor(valor: unknown): string {
  if (valor === null || valor === undefined) return '—'
  if (typeof valor === 'object') return JSON.stringify(valor)
  return String(valor)
}

export function AdminAuditoriaPage() {
  const [filtros, setFiltros] = useState<AuditoriaFiltros>(FILTROS_INICIAIS)
  const [page, setPage] = useState(1)
  const [registros, setRegistros] = useState<AuditLogCampo[]>([])
  const [total, setTotal] = useState(0)
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    listUsuarios().then(setUsuarios)
  }, [])

  useEffect(() => {
    let ativo = true
    setLoading(true)
    setErro(null)
    listAuditoriaCampos(filtros, page)
      .then(({ data, count }) => {
        if (!ativo) return
        setRegistros(data)
        setTotal(count)
      })
      .catch((error) => {
        if (ativo) setErro(error.message ?? 'Erro ao carregar auditoria.')
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
      <div>
        <h1 className="text-xl font-bold text-neutral-900">Auditoria</h1>
        <p className="text-sm text-neutral-500">
          Usuário, data/hora, campo alterado, valor anterior/novo e motivo,
          quando informado.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 rounded-xl bg-white p-4 shadow-sm sm:grid-cols-4">
        <Select
          aria-label="Filtrar por tabela"
          value={filtros.tabela ?? ''}
          onChange={(event) => {
            setFiltros({ ...filtros, tabela: event.target.value || null })
            setPage(1)
          }}
        >
          <option value="">Tabela</option>
          {TABELAS_AUDITADAS.map((tabela) => (
            <option key={tabela} value={tabela}>
              {tabela}
            </option>
          ))}
        </Select>

        <Select
          aria-label="Filtrar por usuário"
          value={filtros.usuarioId ?? ''}
          onChange={(event) => {
            setFiltros({ ...filtros, usuarioId: event.target.value || null })
            setPage(1)
          }}
        >
          <option value="">Usuário</option>
          {usuarios.map((usuario) => (
            <option key={usuario.id} value={usuario.id}>
              {usuario.nome_completo || usuario.email}
            </option>
          ))}
        </Select>

        <input
          type="date"
          aria-label="Período — de"
          value={filtros.periodoInicio ?? ''}
          onChange={(event) => {
            setFiltros({
              ...filtros,
              periodoInicio: event.target.value || null,
            })
            setPage(1)
          }}
          className="focus:border-vale-green focus:ring-vale-green min-h-12 w-full rounded-lg border border-neutral-300 px-4 text-base focus:ring-2 focus:outline-none"
        />
        <input
          type="date"
          aria-label="Período — até"
          value={filtros.periodoFim ?? ''}
          onChange={(event) => {
            setFiltros({ ...filtros, periodoFim: event.target.value || null })
            setPage(1)
          }}
          className="focus:border-vale-green focus:ring-vale-green min-h-12 w-full rounded-lg border border-neutral-300 px-4 text-base focus:ring-2 focus:outline-none"
        />
      </div>

      {erro && <p className="text-sm text-red-600">{erro}</p>}

      {loading ? (
        <p className="text-sm text-neutral-500">Carregando…</p>
      ) : registros.length === 0 ? (
        <p className="rounded-xl bg-white p-6 text-center text-sm text-neutral-500 shadow-sm">
          Nenhum registro de auditoria encontrado.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {registros.map((registro, index) => (
            <div
              key={`${registro.audit_log_id}-${registro.campo}-${index}`}
              className="rounded-xl bg-white p-4 shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold text-neutral-800">
                  {registro.tabela} · {registro.campo}
                </p>
                <span className="text-xs text-neutral-400">
                  {registro.criado_em &&
                    new Date(registro.criado_em).toLocaleString('pt-BR')}
                </span>
              </div>
              <p className="mt-1 text-xs text-neutral-500">
                {registro.usuario?.nome_completo ||
                  registro.usuario?.email ||
                  'Sistema'}{' '}
                · {registro.operacao}
              </p>
              <p className="mt-2 text-sm text-neutral-700">
                <span className="text-neutral-400">
                  {formatarValor(registro.valor_anterior)}
                </span>{' '}
                →{' '}
                <span className="font-medium">
                  {formatarValor(registro.valor_novo)}
                </span>
              </p>
              {registro.motivo && (
                <p className="mt-1 text-sm text-neutral-600 italic">
                  “{registro.motivo}”
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      <Pagination
        page={page}
        pageSize={AUDITORIA_PAGE_SIZE}
        total={total}
        onPageChange={setPage}
      />
    </div>
  )
}
