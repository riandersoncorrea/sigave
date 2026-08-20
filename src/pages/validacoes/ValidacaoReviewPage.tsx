import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Badge } from '@/components/ui/Badge'
import { STATUS_BADGE_CLASSES, STATUS_LABELS } from '@/constants/avm'
import { useAuth } from '@/features/auth/useAuth'
import { HistoricoTimeline } from '@/features/levantamento/HistoricoTimeline'
import { LevantamentoDetalhes } from '@/features/levantamento/LevantamentoDetalhes'
import { SecaoNav } from '@/features/levantamento/SecaoNav'
import {
  SECOES_LEVANTAMENTO,
  type SecaoNavItem,
} from '@/features/levantamento/secoes'
import { AlertasAmbientais } from '@/features/validacoes/AlertasAmbientais'
import { DecisaoForm } from '@/features/validacoes/DecisaoForm'
import { ValidacoesHistorico } from '@/features/validacoes/ValidacoesHistorico'
import { getAvm } from '@/services/avms'
import {
  getOrCreateDiagnostico,
  type Diagnostico,
} from '@/services/diagnosticos'
import { listEquipamentos, type Equipamento } from '@/services/equipamentos'
import { listEvidencias, type Evidencia } from '@/services/evidencias'
import {
  listHistoricoStatus,
  type HistoricoStatusComUsuario,
} from '@/services/historicoStatus'
import {
  listInterferencias,
  type Interferencia,
} from '@/services/interferencias'
import {
  getOrCreateInfraestrutura,
  type Infraestrutura,
} from '@/services/infraestrutura'
import { getLevantamento, type Levantamento } from '@/services/levantamentos'
import { listOcorrencias, type Ocorrencia } from '@/services/ocorrencias'
import { listServicos, type Servico } from '@/services/servicos'
import { listValidacoes } from '@/services/validacoes'
import { getOrCreateVegetacao, type Vegetacao } from '@/services/vegetacao'
import type { AvmComRelacoes } from '@/types/avm'
import type { ValidacaoComFiscal } from '@/types/validacao'

const SECOES_REVISAO: SecaoNavItem[] = [
  { id: 'alertas', label: 'Alertas' },
  ...SECOES_LEVANTAMENTO,
  { id: 'historico', label: 'Histórico' },
  { id: 'decisao', label: 'Decisão' },
]

interface Dados {
  diagnostico: Diagnostico
  vegetacao: Vegetacao
  infraestrutura: Infraestrutura
  interferencias: Interferencia[]
  equipamentos: Equipamento[]
  servicos: Servico[]
  ocorrencias: Ocorrencia[]
  evidencias: Evidencia[]
  historico: HistoricoStatusComUsuario[]
  validacoes: ValidacaoComFiscal[]
}

export function ValidacaoReviewPage() {
  const { id } = useParams<{ id: string }>()
  const { profile } = useAuth()
  const [levantamento, setLevantamento] = useState<
    Levantamento | null | undefined
  >(undefined)
  const [avm, setAvm] = useState<AvmComRelacoes | null>(null)
  const [dados, setDados] = useState<Dados | null>(null)

  async function carregar() {
    if (!id) return
    const lev = await getLevantamento(id)
    setLevantamento(lev)
    if (!lev) return

    const [
      avmData,
      diagnostico,
      vegetacao,
      infraestrutura,
      interferencias,
      equipamentos,
      servicos,
      ocorrencias,
      evidencias,
      historico,
      validacoes,
    ] = await Promise.all([
      getAvm(lev.avm_id),
      getOrCreateDiagnostico(lev.id),
      getOrCreateVegetacao(lev.id),
      getOrCreateInfraestrutura(lev.id),
      listInterferencias(lev.id),
      listEquipamentos(lev.id),
      listServicos(lev.id),
      listOcorrencias(lev.id),
      listEvidencias(lev.id),
      listHistoricoStatus(lev.id),
      listValidacoes(lev.id),
    ])
    setAvm(avmData)
    setDados({
      diagnostico,
      vegetacao,
      infraestrutura,
      interferencias,
      equipamentos,
      servicos,
      ocorrencias,
      evidencias,
      historico,
      validacoes,
    })
  }

  useEffect(() => {
    carregar()
  }, [id])

  if (levantamento === undefined) {
    return <p className="text-sm text-neutral-500">Carregando…</p>
  }

  if (levantamento === null || !avm || !dados) {
    return (
      <p className="rounded-xl bg-white p-6 text-center text-sm text-neutral-500 shadow-sm">
        Levantamento não encontrado ou você não tem acesso a ele.
      </p>
    )
  }

  const podeDecidir = levantamento.status === 'ENVIADA_VALIDACAO'

  return (
    <div className="flex flex-col gap-4">
      <Link to="/validacoes" className="text-vale-green text-sm font-semibold">
        ← Voltar para validações
      </Link>

      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-xs font-medium text-neutral-500">
            {avm.id_avm} · {avm.nome}
          </p>
          <h1 className="text-xl font-bold text-neutral-900">
            Revisão do levantamento
          </h1>
        </div>
        <Badge className={STATUS_BADGE_CLASSES[levantamento.status]}>
          {STATUS_LABELS[levantamento.status]}
        </Badge>
      </div>

      <SecaoNav itens={SECOES_REVISAO} />

      <AlertasAmbientais
        diagnostico={dados.diagnostico}
        ocorrencias={dados.ocorrencias}
      />

      <LevantamentoDetalhes
        avm={avm}
        levantamento={levantamento}
        dados={dados}
        editavel={false}
      />

      <div id="historico" className="flex scroll-mt-24 flex-col gap-4">
        <HistoricoTimeline historico={dados.historico} />
        <ValidacoesHistorico validacoes={dados.validacoes} />
      </div>

      <div id="decisao" className="scroll-mt-24">
        {podeDecidir && profile ? (
          <DecisaoForm
            levantamentoId={levantamento.id}
            fiscalId={profile.id}
            onDecidido={carregar}
          />
        ) : (
          <p className="text-center text-xs text-neutral-400">
            Este levantamento não está aguardando decisão no momento.
          </p>
        )}
      </div>
    </div>
  )
}
