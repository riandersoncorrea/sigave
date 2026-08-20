import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
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
import type { Diagnostico } from '@/services/diagnosticos'
import type { Equipamento } from '@/services/equipamentos'
import type { Evidencia } from '@/services/evidencias'
import type { Infraestrutura } from '@/services/infraestrutura'
import type { Interferencia } from '@/services/interferencias'
import type { Levantamento } from '@/services/levantamentos'
import type { Ocorrencia } from '@/services/ocorrencias'
import type { Servico } from '@/services/servicos'
import type { Vegetacao } from '@/services/vegetacao'
import type { AvmComRelacoes } from '@/types/avm'

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
  id,
  titulo,
  slugEtapa,
  levantamentoId,
  editavel,
  children,
}: {
  id: string
  titulo: string
  slugEtapa?: string
  levantamentoId: string
  editavel: boolean
  children: ReactNode
}) {
  return (
    <div
      id={id}
      className="flex scroll-mt-24 flex-col gap-2 rounded-xl bg-white p-5 shadow-sm"
    >
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

export interface LevantamentoDetalhesDados {
  diagnostico: Diagnostico
  vegetacao: Vegetacao
  infraestrutura: Infraestrutura
  interferencias: Interferencia[]
  equipamentos: Equipamento[]
  servicos: Servico[]
  ocorrencias: Ocorrencia[]
  evidencias: Evidencia[]
}

interface LevantamentoDetalhesProps {
  avm: AvmComRelacoes
  levantamento: Levantamento
  dados: LevantamentoDetalhesDados
  editavel: boolean
  mostrarObservacaoGeral?: boolean
}

// Exibição completa e somente-leitura (à parte do botão Editar por seção,
// que só aparece quando editavel) de um levantamento — reaproveitada tanto
// pelo Resumo do inspetor (Sprint 5) quanto pela tela de revisão do fiscal
// (Sprint 6), para não duplicar ~500 linhas de marcação entre as duas.
export function LevantamentoDetalhes({
  avm,
  levantamento,
  dados,
  editavel,
  mostrarObservacaoGeral = true,
}: LevantamentoDetalhesProps) {
  const { diagnostico: d, vegetacao: v, infraestrutura: i } = dados
  const perguntasSeguranca = Array.isArray(d.seguranca_perguntas)
    ? (d.seguranca_perguntas as unknown as SegurancaPergunta[])
    : []

  return (
    <>
      <div
        id="identificacao"
        className="flex scroll-mt-24 flex-col gap-2 rounded-xl bg-white p-5 shadow-sm"
      >
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
        id="caracterizacao"
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
        id="vegetacao"
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
        id="terreno"
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
        id="condicao"
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
        id="limpeza"
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
        id="infraestrutura"
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
        id="seguranca"
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
        id="meio-ambiente"
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
        id="acesso"
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
        id="interferencias"
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
        id="equipamentos"
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
        id="servicos"
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
        id="recursos"
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
        id="ocorrencias"
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
        id="fotografias"
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

      {mostrarObservacaoGeral && (
        <div
          id="observacao-geral"
          className="flex scroll-mt-24 flex-col gap-2 rounded-xl bg-white p-5 shadow-sm"
        >
          <h2 className="text-sm font-bold text-neutral-900">
            Observação geral
          </h2>
          <p className="text-sm text-neutral-700">
            {d.observacao_geral || '—'}
          </p>
        </div>
      )}
    </>
  )
}
