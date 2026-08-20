export interface WizardStepConfig {
  slug: string
  label: string
}

// Fluxo definido pela Sprint 3. Fotografias fica fora (fora do escopo desta
// sprint: "Não implementar fotos ainda").
export const WIZARD_STEPS: WizardStepConfig[] = [
  { slug: 'caracterizacao', label: 'Caracterização' },
  { slug: 'vegetacao', label: 'Vegetação' },
  { slug: 'terreno', label: 'Terreno' },
  { slug: 'condicao', label: 'Condição' },
  { slug: 'limpeza', label: 'Limpeza' },
  { slug: 'infraestrutura', label: 'Infraestrutura' },
  { slug: 'seguranca', label: 'Segurança' },
  { slug: 'meio-ambiente', label: 'Meio ambiente' },
  { slug: 'acesso', label: 'Acesso' },
  { slug: 'interferencias', label: 'Interferências' },
  { slug: 'equipamentos', label: 'Equipamentos' },
  { slug: 'servicos', label: 'Serviços' },
  { slug: 'recursos', label: 'Recursos' },
  { slug: 'ocorrencias', label: 'Ocorrências' },
  { slug: 'resumo', label: 'Resumo' },
]

export function stepIndex(slug: string): number {
  return WIZARD_STEPS.findIndex((step) => step.slug === slug)
}

export function stepPath(levantamentoId: string, slug: string): string {
  return `/levantamentos/${levantamentoId}/${slug}`
}
