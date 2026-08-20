import type { SaveStatus } from '@/features/levantamento/useDraftStep'

const LABELS: Record<SaveStatus, string> = {
  carregando: 'Carregando…',
  idle: '',
  salvando: 'Salvando…',
  salvo: 'Rascunho salvo',
  erro: 'Falha ao salvar — tentando novamente',
}

const CLASSES: Record<SaveStatus, string> = {
  carregando: 'text-neutral-500',
  idle: 'text-neutral-500',
  salvando: 'text-neutral-500',
  salvo: 'text-vale-green-dark',
  erro: 'text-red-600',
}

export function SaveIndicator({ status }: { status: SaveStatus }) {
  const texto = LABELS[status]
  if (!texto) return null
  return <p className={`text-xs font-medium ${CLASSES[status]}`}>{texto}</p>
}
