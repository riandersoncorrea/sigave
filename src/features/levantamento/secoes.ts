export interface SecaoNavItem {
  id: string
  label: string
}

export const SECOES_LEVANTAMENTO: SecaoNavItem[] = [
  { id: 'identificacao', label: 'Identificação' },
  { id: 'caracterizacao', label: 'Caracterização' },
  { id: 'vegetacao', label: 'Vegetação' },
  { id: 'terreno', label: 'Terreno' },
  { id: 'condicao', label: 'Condição' },
  { id: 'limpeza', label: 'Limpeza' },
  { id: 'infraestrutura', label: 'Infraestrutura' },
  { id: 'seguranca', label: 'Segurança' },
  { id: 'meio-ambiente', label: 'Ambiental' },
  { id: 'acesso', label: 'Acesso' },
  { id: 'interferencias', label: 'Interferências' },
  { id: 'equipamentos', label: 'Equipamentos' },
  { id: 'servicos', label: 'Serviços' },
  { id: 'recursos', label: 'Recursos' },
  { id: 'ocorrencias', label: 'Ocorrências' },
  { id: 'fotografias', label: 'Fotografias' },
  { id: 'observacao-geral', label: 'Observação geral' },
]
