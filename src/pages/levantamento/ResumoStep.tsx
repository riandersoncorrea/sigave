import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import {
  ACESSO_CONDICAO_VIA_OPTIONS,
  CLIMA_OPTIONS,
  CONDICAO_DIMENSOES,
  EQUIPAMENTO_AVALIACAO_OPTIONS,
  EVIDENCIA_TIPO_OBRIGATORIOS_OPTIONS,
  INFRAESTRUTURA_NECESSIDADE_OPTIONS,
  INFRAESTRUTURA_TIPO_OPTIONS,
  LIMPEZA_NIVEL_OPTIONS,
  MEIO_AMBIENTE_CATEGORIAS_OPTIONS,
  OCORRENCIA_CRITICIDADE_OPTIONS,
  OCORRENCIA_STATUS_OPTIONS,
  SERVICO_NECESSIDADE_OPTIONS,
  VEGETACAO_TIPO_OPTIONS,
  type Opcao,
  type SegurancaPergunta,
} from '@/constants/levantamento'
import { ChecklistBadge } from '@/features/levantamento/ChecklistBadge'
import {
  checklistEstaCompleto,
  construirChecklist,
  primeiraMensagemPendente,
  type ChecklistSecao,
} from '@/features/levantamento/checklist'
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
  type HistoricoStatus,
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
import { getOrCreateVegetacao, type Vegetacao } from '@/services/vegetacao'

function rotulo(opcoes: Opcao[], valor: string | null): string {
  if (!valor) return '—'
  return opcoes.find((o) => o.value === valor)?.label ?? valor
}

// null aqui significa "não respondido" — precisa ficar visualmente
// diferente de uma resposta explícita "Não".
function simNao(valor: boolean | null): string {
  if (valor === null) return '—'
  return valor ? 'Sim' : 'Não'
}

const STATUS_LABELS: Record<string, string> = {
  NAO_INICIADA: 'Não iniciada',
  EM_ANDAMENTO: 'Em andamento',
  ENVIADA_VALIDACAO: 'Enviada para validação',
  REPROVADA: 'Reprovada',
  APROVADA: 'Aprovada',
  NECESSITA_COMPLEMENTACAO: 'Necessita complementação',
}

function Secao({
  titulo,
  slugEtapa,
  levantamentoId,
  editavel,
  children,
}: {
  titulo: string
  slugEtapa?: string
  levantamentoId: string
  editavel: boolean
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2 rounded-xl bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-neutral-900">{titulo}</h2>
        {slugEtapa && editavel && (
          <Link
            to={`/levantamentos/${levantamentoId}/${slugEtapa}`}
            className="text-vale-green text-xs font-semibold underline"
          >
            Editar
          </Link>
        )}
      </div>
      <div className="flex flex-col gap-1 text-sm text-neutral-700">
        {children}
      </div>
    </div>
  )
}

function Linha({ label, valor }: { label: string; valor: string }) {
  return (
    <p>
      <span className="text-neutral-500">{label}: </span>
      {valor || '—'}
    </p>
  )
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
  historico: HistoricoStatus[]
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

  const { diagnostico: d, vegetacao: v, infraestrutura: i } = dados
  const perguntasSeguranca = Array.isArray(d.seguranca_perguntas)
    ? (d.seguranca_perguntas as unknown as SegurancaPergunta[])
    : []

  const checklist: ChecklistSecao[] = construirChecklist({
    avm,
    levantamento,
    diagnostico: {
      ...d,
      observacao_geral: observacaoGeral || d.observacao_geral,
    },
    vegetacao: v,
    infraestrutura: i,
    interferencias: dados.interferencias,
    equipamentos: dados.equipamentos,
    servicos: dados.servicos,
    evidencias: dados.evidencias,
  })
  const completo = checklistEstaCompleto(checklist)
  const mensagemPendente = primeiraMensagemPendente(checklist)

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

      <div className="flex flex-col gap-2 rounded-xl bg-white p-5 shadow-sm">
        <h2 className="text-sm font-bold text-neutral-900">Identificação</h2>
        <div className="flex flex-col gap-1 text-sm text-neutral-700">
          <Linha label="ID_AVM" valor={avm.id_avm} />
          <Linha label="AVM" valor={avm.nome} />
          <Linha
            label="Data"
            valor={new Date(levantamento.created_at).toLocaleString('pt-BR')}
          />
          <Linha
            label="Inspetor"
            valor={avm.inspetor?.nome_completo || avm.inspetor?.email || ''}
          />
        </div>
      </div>

      <Secao
        titulo="Caracterização"
        slugEtapa="caracterizacao"
        levantamentoId={levantamento.id}
        editavel={editavel}
      >
        <Linha
          label="Clima"
          valor={rotulo(CLIMA_OPTIONS, d.condicoes_climaticas)}
        />
        <Linha label="Observações" valor={d.caracterizacao_observacoes ?? ''} />
      </Secao>

      <Secao
        titulo="Vegetação"
        slugEtapa="vegetacao"
        levantamentoId={levantamento.id}
        editavel={editavel}
      >
        <Linha label="Tipo" valor={rotulo(VEGETACAO_TIPO_OPTIONS, v.tipo)} />
        <Linha
          label="Predominante"
          valor={rotulo(VEGETACAO_TIPO_OPTIONS, v.vegetacao_predominante)}
        />
        <Linha label="Espécie" valor={v.especie ?? ''} />
        <Linha label="Observações" valor={v.observacoes ?? ''} />
      </Secao>

      <Secao
        titulo="Terreno"
        slugEtapa="terreno"
        levantamentoId={levantamento.id}
        editavel={editavel}
      >
        <Linha label="Topografia" valor={d.topografia ?? '—'} />
        <Linha label="Inclinação" valor={d.inclinacao ?? '—'} />
        <Linha label="Superfície" valor={d.superficie ?? '—'} />
        <Linha label="Grau de obstáculos" valor={d.grau_obstaculos ?? '—'} />
      </Secao>

      <Secao
        titulo="Condição"
        slugEtapa="condicao"
        levantamentoId={levantamento.id}
        editavel={editavel}
      >
        {CONDICAO_DIMENSOES.map((dim) => {
          const nota = d[`condicao_${dim.chave}_nota` as keyof Diagnostico]
          return (
            <Linha
              key={dim.chave}
              label={dim.label}
              valor={nota != null ? String(nota) : '—'}
            />
          )
        })}
      </Secao>

      <Secao
        titulo="Limpeza"
        slugEtapa="limpeza"
        levantamentoId={levantamento.id}
        editavel={editavel}
      >
        <Linha
          label="Nível"
          valor={rotulo(LIMPEZA_NIVEL_OPTIONS, d.limpeza_nivel)}
        />
        <Linha
          label="Presença de resíduos"
          valor={simNao(d.limpeza_presenca_residuos)}
        />
        <Linha
          label="Necessita capina"
          valor={simNao(d.limpeza_necessita_capina)}
        />
      </Secao>

      <Secao
        titulo="Infraestrutura"
        slugEtapa="infraestrutura"
        levantamentoId={levantamento.id}
        editavel={editavel}
      >
        <Linha label="Existente" valor={simNao(i.existente)} />
        <Linha
          label="Tipo"
          valor={rotulo(INFRAESTRUTURA_TIPO_OPTIONS, i.tipo)}
        />
        <Linha
          label="Necessidade de intervenção"
          valor={rotulo(
            INFRAESTRUTURA_NECESSIDADE_OPTIONS,
            i.necessidade_intervencao,
          )}
        />
      </Secao>

      <Secao
        titulo="Segurança"
        slugEtapa="seguranca"
        levantamentoId={levantamento.id}
        editavel={editavel}
      >
        {perguntasSeguranca.filter((p) => p.resposta === true).length === 0 ? (
          <p>Nenhum risco identificado.</p>
        ) : (
          perguntasSeguranca
            .filter((p) => p.resposta === true)
            .map((p) => (
              <Linha key={p.id} label={p.pergunta} valor={p.descricao} />
            ))
        )}
      </Secao>

      <Secao
        titulo="Ambiental"
        slugEtapa="meio-ambiente"
        levantamentoId={levantamento.id}
        editavel={editavel}
      >
        <Linha
          label="Necessita avaliação ambiental"
          valor={simNao(d.meio_ambiente_gate)}
        />
        {d.meio_ambiente_gate && (
          <Linha
            label="Categorias"
            valor={d.meio_ambiente_categorias
              .map((c) => rotulo(MEIO_AMBIENTE_CATEGORIAS_OPTIONS, c))
              .join(', ')}
          />
        )}
      </Secao>

      <Secao
        titulo="Acesso"
        slugEtapa="acesso"
        levantamentoId={levantamento.id}
        editavel={editavel}
      >
        <Linha label="Veicular" valor={simNao(d.acesso_veicular)} />
        <Linha label="Pedestre" valor={simNao(d.acesso_pedestre)} />
        <Linha
          label="Condição da via"
          valor={rotulo(ACESSO_CONDICAO_VIA_OPTIONS, d.acesso_condicao_via)}
        />
      </Secao>

      <Secao
        titulo={`Interferências (${dados.interferencias.length})`}
        slugEtapa="interferencias"
        levantamentoId={levantamento.id}
        editavel={editavel}
      >
        {dados.interferencias.length === 0 ? (
          <p>Nenhuma registrada.</p>
        ) : (
          dados.interferencias.map((item) => (
            <Linha
              key={item.id}
              label={item.tipo || 'Item'}
              valor={item.descricao ?? ''}
            />
          ))
        )}
      </Secao>

      <Secao
        titulo={`Equipamentos (${dados.equipamentos.length})`}
        slugEtapa="equipamentos"
        levantamentoId={levantamento.id}
        editavel={editavel}
      >
        {dados.equipamentos.length === 0 ? (
          <p>Nenhum registrado.</p>
        ) : (
          dados.equipamentos.map((item) => (
            <Linha
              key={item.id}
              label={item.nome || 'Item'}
              valor={rotulo(EQUIPAMENTO_AVALIACAO_OPTIONS, item.avaliacao)}
            />
          ))
        )}
      </Secao>

      <Secao
        titulo={`Serviços (${dados.servicos.length})`}
        slugEtapa="servicos"
        levantamentoId={levantamento.id}
        editavel={editavel}
      >
        {dados.servicos.length === 0 ? (
          <p>Nenhum registrado.</p>
        ) : (
          dados.servicos.map((item) => (
            <Linha
              key={item.id}
              label={item.nome || 'Item'}
              valor={rotulo(SERVICO_NECESSIDADE_OPTIONS, item.necessidade)}
            />
          ))
        )}
      </Secao>

      <Secao
        titulo="Recursos"
        slugEtapa="recursos"
        levantamentoId={levantamento.id}
        editavel={editavel}
      >
        <Linha
          label="Operadores"
          valor={String(d.recursos_operadores ?? '—')}
        />
        <Linha
          label="Auxiliares"
          valor={String(d.recursos_auxiliares ?? '—')}
        />
        <Linha
          label="Jardineiros"
          valor={String(d.recursos_jardineiros ?? '—')}
        />
      </Secao>

      <Secao
        titulo={`Ocorrências (${dados.ocorrencias.length})`}
        slugEtapa="ocorrencias"
        levantamentoId={levantamento.id}
        editavel={editavel}
      >
        {dados.ocorrencias.length === 0 ? (
          <p>Nenhuma registrada.</p>
        ) : (
          dados.ocorrencias.map((item) => (
            <div
              key={item.id}
              className="border-b border-neutral-100 pb-2 last:border-b-0 last:pb-0"
            >
              <Linha label={item.tipo || 'Item'} valor={item.descricao ?? ''} />
              <Linha
                label="Criticidade"
                valor={rotulo(OCORRENCIA_CRITICIDADE_OPTIONS, item.criticidade)}
              />
              <Linha
                label="Status"
                valor={rotulo(OCORRENCIA_STATUS_OPTIONS, item.status)}
              />
            </div>
          ))
        )}
      </Secao>

      <Secao
        titulo={`Fotografias (${dados.evidencias.length})`}
        slugEtapa="fotografias"
        levantamentoId={levantamento.id}
        editavel={editavel}
      >
        {EVIDENCIA_TIPO_OBRIGATORIOS_OPTIONS.map((opcao) => {
          const presente = dados.evidencias.some(
            (item) => item.tipo === opcao.value,
          )
          return (
            <p key={opcao.value}>
              <span
                className={presente ? 'text-vale-green-dark' : 'text-red-600'}
              >
                {presente ? '✓' : '✗'}
              </span>{' '}
              {opcao.label}
            </p>
          )
        })}
      </Secao>

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
            {d.observacao_geral || '—'}
          </p>
        )}
      </div>

      {dados.historico.length > 0 && (
        <div className="flex flex-col gap-2 rounded-xl bg-white p-5 shadow-sm">
          <h2 className="text-sm font-bold text-neutral-900">
            Histórico de status
          </h2>
          {dados.historico.map((item) => (
            <p key={item.id} className="text-xs text-neutral-600">
              {new Date(item.criado_em).toLocaleString('pt-BR')} —{' '}
              {STATUS_LABELS[item.status_anterior ?? ''] ?? '—'} →{' '}
              {STATUS_LABELS[item.status_novo]}
            </p>
          ))}
        </div>
      )}

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
