import { CONDICAO_DIMENSOES } from '@/constants/levantamento'
import type { Diagnostico } from '@/services/diagnosticos'
import type { Equipamento } from '@/services/equipamentos'
import type { Evidencia } from '@/services/evidencias'
import type { Infraestrutura } from '@/services/infraestrutura'
import type { Interferencia } from '@/services/interferencias'
import type { Levantamento } from '@/services/levantamentos'
import type { Servico } from '@/services/servicos'
import type { Vegetacao } from '@/services/vegetacao'
import type { AvmComRelacoes } from '@/types/avm'
import type { SegurancaPergunta } from '@/constants/levantamento'
import { EVIDENCIA_TIPO_OBRIGATORIOS_OPTIONS } from '@/constants/levantamento'

export type ChecklistEstado = 'OK' | 'PENDENTE' | 'ERRO'

export interface ChecklistItem {
  label: string
  estado: ChecklistEstado
  mensagem?: string
}

export interface ChecklistSecao {
  titulo: string
  slugEtapa: string | null
  estado: ChecklistEstado
  itens: ChecklistItem[]
}

function piorEstado(itens: ChecklistItem[]): ChecklistEstado {
  if (itens.some((i) => i.estado === 'ERRO')) return 'ERRO'
  if (itens.some((i) => i.estado === 'PENDENTE')) return 'PENDENTE'
  return 'OK'
}

function secao(
  titulo: string,
  slugEtapa: string | null,
  itens: ChecklistItem[],
): ChecklistSecao {
  return { titulo, slugEtapa, estado: piorEstado(itens), itens }
}

function ok(label: string): ChecklistItem {
  return { label, estado: 'OK' }
}

function pendente(label: string, mensagem: string): ChecklistItem {
  return { label, estado: 'PENDENTE', mensagem }
}

function erro(label: string, mensagem: string): ChecklistItem {
  return { label, estado: 'ERRO', mensagem }
}

interface DadosChecklist {
  avm: AvmComRelacoes
  levantamento: Levantamento
  diagnostico: Diagnostico
  vegetacao: Vegetacao
  infraestrutura: Infraestrutura
  interferencias: Interferencia[]
  equipamentos: Equipamento[]
  servicos: Servico[]
  evidencias: Evidencia[]
}

// Regras da Sprint 5. Cada seção corresponde a um item da lista de
// verificação do documento; Caracterização, Recursos e Ocorrências
// aparecem no Resumo mas não têm regra de bloqueio aqui — não estão na
// lista de checklist da especificação (são complementares, não
// obrigatórias para o envio).
export function construirChecklist(dados: DadosChecklist): ChecklistSecao[] {
  const {
    avm,
    levantamento,
    diagnostico: d,
    vegetacao: v,
    infraestrutura: i,
  } = dados

  const identificacao = secao('Identificação', null, [
    avm.id_avm ? ok('ID_AVM') : erro('ID_AVM', 'Falta preencher: ID_AVM'),
    avm && levantamento.avm_id
      ? ok('Identificação')
      : erro('Identificação', 'Falta preencher: Identificação'),
    levantamento.created_at
      ? ok('Data')
      : pendente('Data', 'Falta preencher: Data'),
    levantamento.inspetor_id
      ? ok('Inspetor')
      : pendente('Inspetor', 'Falta preencher: Inspetor'),
  ])

  const vegetacaoSecao = secao('Vegetação', 'vegetacao', [
    v.tipo
      ? ok('Tipo de vegetação')
      : pendente('Tipo de vegetação', 'Falta preencher: Tipo de vegetação'),
  ])

  const condicaoItens: ChecklistItem[] = CONDICAO_DIMENSOES.map((dim) => {
    const nota = d[`condicao_${dim.chave}_nota` as keyof Diagnostico] as
      number | null
    const obs = d[`condicao_${dim.chave}_obs` as keyof Diagnostico] as
      string | null
    if (nota == null) {
      return pendente(
        `Condição — ${dim.label}`,
        `Falta preencher: Condição da ${dim.label.toLowerCase()}`,
      )
    }
    if (nota >= 3 && !obs?.trim()) {
      return erro(
        `Condição — ${dim.label}`,
        `Falta preencher: Observação da condição de ${dim.label.toLowerCase()}`,
      )
    }
    return ok(`Condição — ${dim.label}`)
  })
  const condicaoSecao = secao('Condição', 'condicao', condicaoItens)

  const limpezaSecao = secao('Limpeza', 'limpeza', [
    d.limpeza_nivel
      ? ok('Nível de limpeza')
      : pendente('Nível de limpeza', 'Falta preencher: Nível de limpeza'),
  ])

  const perguntasSeguranca = Array.isArray(d.seguranca_perguntas)
    ? (d.seguranca_perguntas as unknown as SegurancaPergunta[])
    : []
  const segurancaItens: ChecklistItem[] =
    perguntasSeguranca.length === 0
      ? [pendente('Perguntas de segurança', 'Falta preencher: Segurança')]
      : perguntasSeguranca.map((p) =>
          p.resposta === null
            ? pendente(p.pergunta, `Falta preencher: ${p.pergunta}`)
            : ok(p.pergunta),
        )
  const segurancaSecao = secao('Segurança', 'seguranca', segurancaItens)

  const infraestruturaSecao = secao('Infraestrutura', 'infraestrutura', [
    i.existente == null
      ? pendente(
          'Infraestrutura existente',
          'Falta preencher: Infraestrutura existente',
        )
      : ok('Infraestrutura existente'),
  ])

  const meioAmbienteSecao = secao('Meio ambiente', 'meio-ambiente', [
    d.meio_ambiente_gate == null
      ? pendente('Avaliação ambiental', 'Falta preencher: Avaliação ambiental')
      : ok('Avaliação ambiental'),
  ])

  const acessoSecao = secao('Acesso', 'acesso', [
    d.acesso_veicular == null
      ? pendente('Acesso veicular', 'Falta preencher: Acesso veicular')
      : ok('Acesso veicular'),
    d.acesso_pedestre == null
      ? pendente('Acesso de pedestres', 'Falta preencher: Acesso de pedestres')
      : ok('Acesso de pedestres'),
  ])

  const interferenciasSecao = secao(
    'Interferências',
    'interferencias',
    dados.interferencias.length === 0
      ? [ok('Nenhuma interferência registrada')]
      : dados.interferencias.map((item, index) =>
          item.tipo?.trim()
            ? ok(`Interferência #${index + 1}`)
            : erro(
                `Interferência #${index + 1}`,
                `Falta preencher: Tipo da interferência #${index + 1}`,
              ),
        ),
  )

  const equipamentosSecao = secao(
    'Equipamentos',
    'equipamentos',
    dados.equipamentos.length === 0
      ? [ok('Nenhum equipamento registrado')]
      : dados.equipamentos.map((item, index) =>
          item.nome?.trim()
            ? ok(`Equipamento #${index + 1}`)
            : erro(
                `Equipamento #${index + 1}`,
                `Falta preencher: Nome do equipamento #${index + 1}`,
              ),
        ),
  )

  const servicosSecao = secao(
    'Serviços potenciais',
    'servicos',
    dados.servicos.length === 0
      ? [ok('Nenhum serviço registrado')]
      : dados.servicos.map((item, index) =>
          item.nome?.trim()
            ? ok(`Serviço #${index + 1}`)
            : erro(
                `Serviço #${index + 1}`,
                `Falta preencher: Nome do serviço #${index + 1}`,
              ),
        ),
  )

  const tiposPresentes = new Set<string>(
    dados.evidencias.map((item) => item.tipo ?? '').filter(Boolean),
  )
  const fotografiasSecao = secao(
    'Fotografias mínimas',
    'fotografias',
    EVIDENCIA_TIPO_OBRIGATORIOS_OPTIONS.map((opcao) =>
      tiposPresentes.has(opcao.value)
        ? ok(opcao.label)
        : erro(opcao.label, `Falta fotografia: ${opcao.label} da AVM`),
    ),
  )

  const observacaoGeralSecao = secao('Observação geral', 'resumo', [
    d.observacao_geral?.trim()
      ? ok('Observação geral')
      : pendente('Observação geral', 'Falta preencher: Observação geral'),
  ])

  return [
    identificacao,
    vegetacaoSecao,
    condicaoSecao,
    limpezaSecao,
    segurancaSecao,
    infraestruturaSecao,
    meioAmbienteSecao,
    acessoSecao,
    interferenciasSecao,
    equipamentosSecao,
    servicosSecao,
    fotografiasSecao,
    observacaoGeralSecao,
  ]
}

export function checklistEstaCompleto(secoes: ChecklistSecao[]): boolean {
  return secoes.every((s) => s.estado === 'OK')
}

export function primeiraMensagemPendente(
  secoes: ChecklistSecao[],
): string | null {
  for (const s of secoes) {
    const item = s.itens.find((i) => i.estado !== 'OK')
    if (item?.mensagem) return item.mensagem
  }
  return null
}
