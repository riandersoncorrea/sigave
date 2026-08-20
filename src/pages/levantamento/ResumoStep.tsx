import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import { VALIDACAO_ACAO_LABELS } from '@/constants/validacao'
import { ChecklistBadge } from '@/features/levantamento/ChecklistBadge'
import {
  checklistEstaCompleto,
  construirChecklist,
  primeiraMensagemPendente,
  type ChecklistSecao,
} from '@/features/levantamento/checklist'
import { HistoricoTimeline } from '@/features/levantamento/HistoricoTimeline'
import { LevantamentoDetalhes } from '@/features/levantamento/LevantamentoDetalhes'
import { useDraftStep } from '@/features/levantamento/useDraftStep'
import { useLevantamentoContext } from '@/features/levantamento/useLevantamentoContext'
import { WizardNav } from '@/features/levantamento/WizardNav'
import { WizardProgress } from '@/features/levantamento/WizardProgress'
import {
  getOrCreateDiagnostico,
  updateDiagnostico,
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
import { enviarParaValidacao, statusEhEditavel } from '@/services/levantamentos'
import { listOcorrencias, type Ocorrencia } from '@/services/ocorrencias'
import { listServicos, type Servico } from '@/services/servicos'
import { listValidacoes } from '@/services/validacoes'
import type { ValidacaoComFiscal } from '@/types/validacao'
import { getOrCreateVegetacao, type Vegetacao } from '@/services/vegetacao'

const STATUS_LABELS: Record<string, string> = {
  NAO_INICIADA: 'Não iniciada',
  EM_ANDAMENTO: 'Em andamento',
  ENVIADA_VALIDACAO: 'Enviada para validação',
  REPROVADA: 'Reprovada',
  APROVADA: 'Aprovada',
  NECESSITA_COMPLEMENTACAO: 'Necessita complementação',
}

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

export function ResumoStep() {
  const { levantamento, avm } = useLevantamentoContext()
  const navigate = useNavigate()
  const [dados, setDados] = useState<Dados | null>(null)
  const [enviando, setEnviando] = useState(false)
  const [erroEnvio, setErroEnvio] = useState<string | null>(null)

  async function carregar() {
    const [
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
      getOrCreateDiagnostico(levantamento.id),
      getOrCreateVegetacao(levantamento.id),
      getOrCreateInfraestrutura(levantamento.id),
      listInterferencias(levantamento.id),
      listEquipamentos(levantamento.id),
      listServicos(levantamento.id),
      listOcorrencias(levantamento.id),
      listEvidencias(levantamento.id),
      listHistoricoStatus(levantamento.id),
      listValidacoes(levantamento.id),
    ])
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
  }, [levantamento.id])

  const {
    values: observacaoGeral,
    setValues: setObservacaoGeral,
    status,
  } = useDraftStep<string>({
    storageKey: `levantamento:${levantamento.id}:observacao-geral`,
    emptyValue: '',
    load: async () => {
      const d = await getOrCreateDiagnostico(levantamento.id)
      return d.observacao_geral ?? ''
    },
    save: async (valor) => {
      await updateDiagnostico(levantamento.id, {
        observacao_geral: valor || null,
      })
    },
  })

  const editavel = statusEhEditavel(levantamento.status)

  async function handleEnviar() {
    setEnviando(true)
    setErroEnvio(null)
    try {
      await enviarParaValidacao(levantamento.id)
      await carregar()
    } catch (error) {
      setErroEnvio(
        error instanceof Error
          ? error.message
          : 'Erro ao enviar para validação.',
      )
    } finally {
      setEnviando(false)
    }
  }

  if (!dados) {
    return <p className="text-sm text-neutral-500">Carregando…</p>
  }

  const checklist: ChecklistSecao[] = construirChecklist({
    avm,
    levantamento,
    diagnostico: {
      ...dados.diagnostico,
      observacao_geral: observacaoGeral || dados.diagnostico.observacao_geral,
    },
    vegetacao: dados.vegetacao,
    infraestrutura: dados.infraestrutura,
    interferencias: dados.interferencias,
    equipamentos: dados.equipamentos,
    servicos: dados.servicos,
    evidencias: dados.evidencias,
  })
  const completo = checklistEstaCompleto(checklist)
  const mensagemPendente = primeiraMensagemPendente(checklist)

  // "Quando houver complementação, o inspetor deve conseguir visualizar o
  // motivo": a última decisão do fiscal é sempre a mais recente da lista
  // (listValidacoes ordena por created_at crescente).
  const ultimaDecisao = dados.validacoes[dados.validacoes.length - 1]
  const precisaMostrarMotivo =
    ultimaDecisao &&
    (levantamento.status === 'NECESSITA_COMPLEMENTACAO' ||
      levantamento.status === 'REPROVADA')

  return (
    <div className="flex flex-col gap-4">
      <WizardProgress currentSlug="resumo" />

      {!editavel && (
        <div className="border-vale-green bg-vale-green-light rounded-xl border-2 p-4">
          <p className="text-vale-green-dark text-sm font-bold">
            {STATUS_LABELS[levantamento.status]}
          </p>
          <p className="mt-1 text-xs text-neutral-700">
            Este levantamento não pode mais ser editado normalmente. Só volta a
            ficar editável se o fiscal solicitar complementação ou reprovar.
          </p>
        </div>
      )}

      {precisaMostrarMotivo && (
        <div className="rounded-xl border-2 border-orange-400 bg-orange-50 p-4">
          <p className="text-sm font-bold text-orange-800">
            {VALIDACAO_ACAO_LABELS[ultimaDecisao.acao]} pelo fiscal
            {ultimaDecisao.fiscal &&
              ` (${ultimaDecisao.fiscal.nome_completo || ultimaDecisao.fiscal.email})`}
          </p>
          <p className="mt-1 text-sm text-neutral-800">
            {ultimaDecisao.comentario}
          </p>
        </div>
      )}

      <div className="flex flex-col gap-3 rounded-xl bg-white p-5 shadow-sm">
        <h2 className="text-sm font-bold text-neutral-900">
          Checklist antes do envio
        </h2>
        {checklist.map((secao) => (
          <div
            key={secao.titulo}
            className="border-b border-neutral-100 pb-3 last:border-b-0 last:pb-0"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-neutral-800">
                {secao.titulo}
              </p>
              <ChecklistBadge estado={secao.estado} />
            </div>
            {secao.itens
              .filter((item) => item.estado !== 'OK')
              .map((item, index) => (
                <p key={index} className="mt-1 text-xs text-red-600">
                  {item.mensagem}
                </p>
              ))}
          </div>
        ))}
      </div>

      <LevantamentoDetalhes
        avm={avm}
        levantamento={levantamento}
        dados={dados}
        editavel={editavel}
        mostrarObservacaoGeral={false}
      />

      <div className="flex flex-col gap-2 rounded-xl bg-white p-5 shadow-sm">
        <h2 className="text-sm font-bold text-neutral-900">Observação geral</h2>
        {editavel ? (
          <Textarea
            label=""
            value={observacaoGeral}
            onChange={(event) => setObservacaoGeral(event.target.value)}
          />
        ) : (
          <p className="text-sm text-neutral-700">
            {dados.diagnostico.observacao_geral || '—'}
          </p>
        )}
      </div>

      <HistoricoTimeline historico={dados.historico} />

      {editavel && (
        <div className="flex flex-col gap-2 rounded-xl bg-white p-5 shadow-sm">
          {!completo && mensagemPendente && (
            <p className="text-sm text-red-600">{mensagemPendente}</p>
          )}
          {erroEnvio && <p className="text-sm text-red-600">{erroEnvio}</p>}
          <Button
            onClick={handleEnviar}
            disabled={!completo || enviando || status === 'salvando'}
          >
            {enviando ? 'Enviando…' : 'Enviar para validação'}
          </Button>
        </div>
      )}

      <Button variant="outline" onClick={() => navigate(`/avms/${avm.id}`)}>
        Ir para a AVM
      </Button>

      {editavel ? (
        <WizardNav
          levantamentoId={levantamento.id}
          avmId={avm.id}
          currentSlug="resumo"
          saveStatus={status}
          onContinuar={async () => true}
        />
      ) : (
        <p className="text-xs text-neutral-400">
          Etapas de edição indisponíveis — levantamento não está mais em
          rascunho.
        </p>
      )}
    </div>
  )
}
