import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
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
import { WizardNav } from '@/features/levantamento/WizardNav'
import { WizardProgress } from '@/features/levantamento/WizardProgress'
import { useLevantamentoContext } from '@/features/levantamento/useLevantamentoContext'
import {
  getOrCreateDiagnostico,
  type Diagnostico,
} from '@/services/diagnosticos'
import { listEquipamentos, type Equipamento } from '@/services/equipamentos'
import { listEvidencias, type Evidencia } from '@/services/evidencias'
import {
  listInterferencias,
  type Interferencia,
} from '@/services/interferencias'
import { listOcorrencias, type Ocorrencia } from '@/services/ocorrencias'
import { listServicos, type Servico } from '@/services/servicos'
import {
  getOrCreateInfraestrutura,
  type Infraestrutura,
} from '@/services/infraestrutura'
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

function Secao({
  titulo,
  children,
}: {
  titulo: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2 rounded-xl bg-white p-5 shadow-sm">
      <h2 className="text-sm font-bold text-neutral-900">{titulo}</h2>
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
}

export function ResumoStep() {
  const { levantamento, avm } = useLevantamentoContext()
  const [dados, setDados] = useState<Dados | null>(null)

  useEffect(() => {
    Promise.all([
      getOrCreateDiagnostico(levantamento.id),
      getOrCreateVegetacao(levantamento.id),
      getOrCreateInfraestrutura(levantamento.id),
      listInterferencias(levantamento.id),
      listEquipamentos(levantamento.id),
      listServicos(levantamento.id),
      listOcorrencias(levantamento.id),
      listEvidencias(levantamento.id),
    ]).then(
      ([
        diagnostico,
        vegetacao,
        infraestrutura,
        interferencias,
        equipamentos,
        servicos,
        ocorrencias,
        evidencias,
      ]) => {
        setDados({
          diagnostico,
          vegetacao,
          infraestrutura,
          interferencias,
          equipamentos,
          servicos,
          ocorrencias,
          evidencias,
        })
      },
    )
  }, [levantamento.id])

  if (!dados) {
    return <p className="text-sm text-neutral-500">Carregando…</p>
  }

  const { diagnostico: d, vegetacao: v, infraestrutura: i } = dados
  const perguntasSeguranca = Array.isArray(d.seguranca_perguntas)
    ? (d.seguranca_perguntas as unknown as SegurancaPergunta[])
    : []

  return (
    <div className="flex flex-col gap-4">
      <WizardProgress currentSlug="resumo" />

      <p className="text-xs text-neutral-500">
        Recapitulação do que foi preenchido até aqui. O envio para validação do
        fiscal faz parte de uma etapa futura do sistema.
      </p>

      <Secao titulo="Caracterização">
        <Linha
          label="Clima"
          valor={rotulo(CLIMA_OPTIONS, d.condicoes_climaticas)}
        />
        <Linha label="Observações" valor={d.caracterizacao_observacoes ?? ''} />
      </Secao>

      <Secao titulo="Vegetação">
        <Linha label="Tipo" valor={rotulo(VEGETACAO_TIPO_OPTIONS, v.tipo)} />
        <Linha
          label="Predominante"
          valor={rotulo(VEGETACAO_TIPO_OPTIONS, v.vegetacao_predominante)}
        />
        <Linha label="Espécie" valor={v.especie ?? ''} />
        <Linha label="Observações" valor={v.observacoes ?? ''} />
      </Secao>

      <Secao titulo="Terreno">
        <Linha label="Topografia" valor={d.topografia ?? '—'} />
        <Linha label="Inclinação" valor={d.inclinacao ?? '—'} />
        <Linha label="Superfície" valor={d.superficie ?? '—'} />
        <Linha label="Grau de obstáculos" valor={d.grau_obstaculos ?? '—'} />
      </Secao>

      <Secao titulo="Condição">
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

      <Secao titulo="Limpeza">
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

      <Secao titulo="Infraestrutura">
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

      <Secao titulo="Segurança">
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

      <Secao titulo="Meio ambiente">
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

      <Secao titulo="Acesso">
        <Linha label="Veicular" valor={simNao(d.acesso_veicular)} />
        <Linha label="Pedestre" valor={simNao(d.acesso_pedestre)} />
        <Linha
          label="Condição da via"
          valor={rotulo(ACESSO_CONDICAO_VIA_OPTIONS, d.acesso_condicao_via)}
        />
      </Secao>

      <Secao titulo={`Interferências (${dados.interferencias.length})`}>
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

      <Secao titulo={`Equipamentos (${dados.equipamentos.length})`}>
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

      <Secao titulo={`Serviços (${dados.servicos.length})`}>
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

      <Secao titulo="Recursos">
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

      <Secao titulo={`Ocorrências (${dados.ocorrencias.length})`}>
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

      <Secao titulo={`Fotografias (${dados.evidencias.length})`}>
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

      <Link to={`/avms/${avm.id}`}>
        <Button>Ir para a AVM</Button>
      </Link>

      <WizardNav
        levantamentoId={levantamento.id}
        avmId={avm.id}
        currentSlug="resumo"
        saveStatus="idle"
        onContinuar={async () => true}
      />
    </div>
  )
}
