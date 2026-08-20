import { useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation, useParams } from 'react-router-dom'
import { getAvm } from '@/services/avms'
import type { Diagnostico } from '@/services/diagnosticos'
import { getOrCreateDiagnostico } from '@/services/diagnosticos'
import {
  getLevantamento,
  statusEhEditavel,
  type Levantamento,
} from '@/services/levantamentos'
import type { AvmComRelacoes } from '@/types/avm'

export interface LevantamentoOutletContext {
  levantamento: Levantamento
  avm: AvmComRelacoes
  diagnostico: Diagnostico
  recarregarLevantamento: () => Promise<void>
}

export function LevantamentoWizardRoute() {
  const { id } = useParams<{ id: string }>()
  const location = useLocation()
  const [levantamento, setLevantamento] = useState<
    Levantamento | null | undefined
  >(undefined)
  const [avm, setAvm] = useState<AvmComRelacoes | null>(null)
  const [diagnostico, setDiagnostico] = useState<Diagnostico | null>(null)

  async function carregar() {
    if (!id) return
    const lev = await getLevantamento(id)
    setLevantamento(lev)
    if (lev) {
      const [avmData, diagnosticoData] = await Promise.all([
        getAvm(lev.avm_id),
        getOrCreateDiagnostico(lev.id),
      ])
      setAvm(avmData)
      setDiagnostico(diagnosticoData)
    }
  }

  useEffect(() => {
    carregar()
  }, [id])

  if (levantamento === undefined) {
    return <p className="text-sm text-neutral-500">Carregando…</p>
  }

  if (levantamento === null || !avm || !diagnostico) {
    return (
      <p className="rounded-xl bg-white p-6 text-center text-sm text-neutral-500 shadow-sm">
        Levantamento não encontrado ou você não tem acesso a ele.
      </p>
    )
  }

  // "Após envio, não permitir edição normal" — em vez de deixar o usuário
  // entrar numa etapa de edição e só descobrir que a gravação falha (RLS
  // bloqueando por trás), redireciona direto para o Resumo, que já mostra
  // o estado somente-leitura com clareza.
  const etapaAtual = location.pathname.split('/').pop()
  if (etapaAtual !== 'resumo' && !statusEhEditavel(levantamento.status)) {
    return <Navigate to={`/levantamentos/${levantamento.id}/resumo`} replace />
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4">
      <p className="text-xs font-medium text-neutral-500">
        {avm.id_avm} · {avm.nome}
      </p>
      <Outlet
        context={
          {
            levantamento,
            avm,
            diagnostico,
            recarregarLevantamento: carregar,
          } satisfies LevantamentoOutletContext
        }
      />
    </div>
  )
}
