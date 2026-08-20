// Opções de campo do wizard de levantamento (Sprint 3).
//
// IMPORTANTE: não existe documento-fonte para esta sprint (confirmado com
// o usuário). Os campos e opções marcados "(especificado)" vieram
// literalmente da mensagem da Sprint 3. Os marcados "(proposto)" são uma
// taxonomia razoável criada pelo time de desenvolvimento na ausência de
// especificação — revisar e ajustar aqui assim que houver um documento
// oficial; nenhum outro arquivo precisa mudar.

export interface Opcao<T extends string = string> {
  value: T
  label: string
}

// ---------------------------------------------------------------------
// Caracterização (proposto — nenhum campo foi especificado além da
// captura automática de data/hora/usuário, já feita por outras colunas)
// ---------------------------------------------------------------------
export const CLIMA_OPTIONS: Opcao[] = [
  { value: 'ENSOLARADO', label: 'Ensolarado' },
  { value: 'NUBLADO', label: 'Nublado' },
  { value: 'CHUVOSO', label: 'Chuvoso' },
  { value: 'OUTRO', label: 'Outro' },
]

// ---------------------------------------------------------------------
// Vegetação (especificado)
// ---------------------------------------------------------------------
export const VEGETACAO_TIPO_OPTIONS: Opcao[] = [
  { value: 'GRAMINEA', label: 'Gramínea' },
  { value: 'HERBACEA', label: 'Herbácea' },
  { value: 'ARBUSTIVA', label: 'Arbustiva' },
  { value: 'ARBOREA', label: 'Arbórea' },
  { value: 'NATIVA', label: 'Vegetação nativa' },
  { value: 'ORNAMENTAL', label: 'Vegetação ornamental' },
  { value: 'ESPONTANEA', label: 'Vegetação espontânea' },
  { value: 'INVASORA', label: 'Vegetação invasora' },
  { value: 'MISTA', label: 'Vegetação mista' },
  { value: 'SOLO_EXPOSTO', label: 'Solo exposto' },
  { value: 'OUTRO', label: 'Outro' },
]

export const VEGETACAO_COBERTURA_OPTIONS: Opcao[] = [
  { value: 'ATE_25', label: '0–25%' },
  { value: 'DE_26_A_50', label: '26–50%' },
  { value: 'DE_51_A_75', label: '51–75%' },
  { value: 'DE_76_A_90', label: '76–90%' },
  { value: 'ACIMA_90', label: '>90%' },
]

export const VEGETACAO_ALTURA_OPTIONS: Opcao[] = [
  { value: 'ATE_10CM', label: '<10 cm' },
  { value: 'DE_10_A_20CM', label: '10–20 cm' },
  { value: 'DE_20_A_40CM', label: '20–40 cm' },
  { value: 'DE_40_A_60CM', label: '40–60 cm' },
  { value: 'ACIMA_60CM', label: '>60 cm' },
]

export const NIVEL_BAIXA_MEDIA_ALTA_MUITO_ALTA_OPTIONS: Opcao[] = [
  { value: 'BAIXA', label: 'Baixa' },
  { value: 'MEDIA', label: 'Média' },
  { value: 'ALTA', label: 'Alta' },
  { value: 'MUITO_ALTA', label: 'Muito alta' },
]

export const VEGETACAO_UNIFORMIDADE_OPTIONS: Opcao[] = [
  { value: 'UNIFORME', label: 'Uniforme' },
  { value: 'PARCIALMENTE_UNIFORME', label: 'Parcialmente uniforme' },
  { value: 'IRREGULAR', label: 'Irregular' },
  { value: 'MUITO_IRREGULAR', label: 'Muito irregular' },
]

export const VEGETACAO_INVASORAS_OPTIONS: Opcao[] = [
  { value: 'NAO', label: 'Não' },
  { value: 'BAIXA', label: 'Baixa' },
  { value: 'MEDIA', label: 'Média' },
  { value: 'ALTA', label: 'Alta' },
  { value: 'CRITICA', label: 'Crítica' },
]

export const VEGETACAO_ARVORES_OPTIONS: Opcao[] = [
  { value: 'NAO', label: 'Não' },
  { value: 'ISOLADAS', label: 'Isoladas' },
  { value: 'DISPERSAS', label: 'Dispersas' },
  { value: 'ALTA_CONCENTRACAO', label: 'Alta concentração' },
  { value: 'BOSQUE', label: 'Bosque' },
]

// ---------------------------------------------------------------------
// Terreno (proposto — só os nomes dos campos foram especificados)
// ---------------------------------------------------------------------
export const TERRENO_TOPOGRAFIA_OPTIONS: Opcao[] = [
  { value: 'PLANA', label: 'Plana' },
  { value: 'ONDULADA', label: 'Ondulada' },
  { value: 'INGREME', label: 'Íngreme' },
  { value: 'IRREGULAR', label: 'Irregular' },
]

export const TERRENO_INCLINACAO_OPTIONS: Opcao[] = [
  { value: 'NENHUMA', label: 'Nenhuma' },
  { value: 'LEVE', label: 'Leve' },
  { value: 'MODERADA', label: 'Moderada' },
  { value: 'ACENTUADA', label: 'Acentuada' },
]

export const TERRENO_SUPERFICIE_OPTIONS: Opcao[] = [
  { value: 'GRAMADA', label: 'Gramada' },
  { value: 'TERRA', label: 'Terra' },
  { value: 'PAVIMENTADA', label: 'Pavimentada' },
  { value: 'CASCALHO', label: 'Cascalho' },
  { value: 'MISTA', label: 'Mista' },
]

export const TERRENO_OBSTACULOS_OPTIONS: Opcao[] = [
  { value: 'PEDRAS', label: 'Pedras' },
  { value: 'RAIZES_EXPOSTAS', label: 'Raízes expostas' },
  { value: 'LIXO_ENTULHO', label: 'Lixo / entulho' },
  { value: 'BURACOS', label: 'Buracos' },
  { value: 'POSTES_ESTRUTURAS', label: 'Postes / estruturas' },
  { value: 'OUTROS', label: 'Outros' },
]

export const TERRENO_GRAU_OBSTACULOS_OPTIONS: Opcao[] = [
  { value: 'NENHUM', label: 'Nenhum' },
  { value: 'BAIXO', label: 'Baixo' },
  { value: 'MEDIO', label: 'Médio' },
  { value: 'ALTO', label: 'Alto' },
]

// ---------------------------------------------------------------------
// Condição (especificado)
// ---------------------------------------------------------------------
export const CONDICAO_DIMENSOES = [
  { chave: 'vegetacao', label: 'Vegetação' },
  { chave: 'limpeza', label: 'Limpeza' },
  { chave: 'seguranca', label: 'Segurança' },
  { chave: 'infraestrutura', label: 'Infraestrutura' },
  { chave: 'meio_ambiente', label: 'Meio ambiente' },
  { chave: 'acesso', label: 'Acesso' },
  { chave: 'interferencia_operacional', label: 'Interferência operacional' },
] as const

export type CondicaoDimensaoChave = (typeof CONDICAO_DIMENSOES)[number]['chave']

export const CONDICAO_NOTA_OPTIONS: { value: number; label: string }[] = [
  { value: 1, label: '1 — Excelente' },
  { value: 2, label: '2 — Boa' },
  { value: 3, label: '3 — Regular' },
  { value: 4, label: '4 — Ruim' },
  { value: 5, label: '5 — Crítica' },
]

// ---------------------------------------------------------------------
// Limpeza (proposto — nenhum campo foi especificado)
// ---------------------------------------------------------------------
export const LIMPEZA_NIVEL_OPTIONS: Opcao[] = [
  { value: 'BOA', label: 'Boa' },
  { value: 'REGULAR', label: 'Regular' },
  { value: 'RUIM', label: 'Ruim' },
  { value: 'CRITICA', label: 'Crítica' },
]

// ---------------------------------------------------------------------
// Infraestrutura (proposto — catálogo de "tipo" não foi especificado)
// ---------------------------------------------------------------------
export const INFRAESTRUTURA_TIPO_OPTIONS: Opcao[] = [
  { value: 'ILUMINACAO', label: 'Iluminação' },
  { value: 'IRRIGACAO', label: 'Irrigação' },
  { value: 'CERCAMENTO', label: 'Cercamento' },
  { value: 'MOBILIARIO_URBANO', label: 'Mobiliário urbano' },
  { value: 'SINALIZACAO', label: 'Sinalização' },
  { value: 'DRENAGEM', label: 'Drenagem' },
  { value: 'OUTRO', label: 'Outro' },
]

export const INFRAESTRUTURA_NECESSIDADE_OPTIONS: Opcao[] = [
  { value: 'SIM', label: 'Sim' },
  { value: 'NAO', label: 'Não' },
  { value: 'PARCIAL', label: 'Parcial' },
]

// ---------------------------------------------------------------------
// Segurança (proposto — nenhuma pergunta foi especificada; catálogo
// inicial de perguntas sim/não usado para popular o jsonb da etapa)
// ---------------------------------------------------------------------
export interface SegurancaPergunta {
  id: string
  pergunta: string
  resposta: boolean | null
  descricao: string
}

export const SEGURANCA_PERGUNTAS_PADRAO: Omit<
  SegurancaPergunta,
  'resposta' | 'descricao'
>[] = [
  { id: 'risco_queda_arvore', pergunta: 'Há risco de queda de árvore/galho?' },
  {
    id: 'risco_eletrico',
    pergunta: 'Há risco elétrico (rede/fiação próxima)?',
  },
  {
    id: 'risco_desnivel_buraco',
    pergunta: 'Há buracos, desníveis ou valas com risco de queda?',
  },
  {
    id: 'risco_animais_peconhentos',
    pergunta: 'Há indícios de animais peçonhentos ou vetores?',
  },
  {
    id: 'historico_acidentes',
    pergunta: 'Há histórico de acidentes registrados na área?',
  },
]

// ---------------------------------------------------------------------
// Meio ambiente (gate especificado; categorias propostas)
// ---------------------------------------------------------------------
export const MEIO_AMBIENTE_CATEGORIAS_OPTIONS: Opcao[] = [
  { value: 'APP', label: 'Área de Preservação Permanente (APP)' },
  { value: 'ESPECIE_PROTEGIDA', label: 'Espécie protegida ou ameaçada' },
  { value: 'NASCENTE_CURSO_DAGUA', label: 'Nascente ou curso d’água' },
  { value: 'FAUNA_SILVESTRE', label: 'Fauna silvestre' },
  { value: 'SOLO_CONTAMINADO', label: 'Solo potencialmente contaminado' },
  { value: 'OUTRO', label: 'Outro' },
]

// ---------------------------------------------------------------------
// Acesso (proposto — nenhum campo foi especificado)
// ---------------------------------------------------------------------
export const ACESSO_CONDICAO_VIA_OPTIONS: Opcao[] = [
  { value: 'BOA', label: 'Boa' },
  { value: 'REGULAR', label: 'Regular' },
  { value: 'RUIM', label: 'Ruim' },
]

// ---------------------------------------------------------------------
// Equipamentos (avaliação especificada) / Serviços (necessidade proposta)
// ---------------------------------------------------------------------
export const EQUIPAMENTO_AVALIACAO_OPTIONS: Opcao[] = [
  { value: 'ADEQUADO', label: 'Adequado' },
  { value: 'POSSIVEL', label: 'Possível' },
  { value: 'NAO_RECOMENDADO', label: 'Não recomendado' },
]

export const SERVICO_NECESSIDADE_OPTIONS: Opcao[] = [
  { value: 'NECESSARIO', label: 'Necessário' },
  { value: 'NAO_NECESSARIO', label: 'Não necessário' },
  { value: 'A_AVALIAR', label: 'A avaliar' },
]

// ---------------------------------------------------------------------
// Ocorrências (proposto)
// ---------------------------------------------------------------------
export const OCORRENCIA_TIPO_OPTIONS: Opcao[] = [
  { value: 'SEGURANCA', label: 'Segurança' },
  { value: 'AMBIENTAL', label: 'Ambiental' },
  { value: 'ESTRUTURAL', label: 'Estrutural' },
  { value: 'OUTRO', label: 'Outro' },
]
