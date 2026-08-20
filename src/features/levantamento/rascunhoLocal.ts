// Utilitários compartilhados por useDraftStep/useDraftList e pelo indicador
// de sincronização: todo rascunho de levantamento usa localStorage com
// chaves prefixadas "levantamento:", e um evento customizado avisa a UI
// sempre que uma chave é gravada ou removida (localStorage não dispara
// "storage" na mesma aba que fez a escrita).

const PREFIXO = 'levantamento:'
export const EVENTO_RASCUNHO_ALTERADO = 'sigave:rascunho-alterado'

export function notificarRascunhoAlterado() {
  window.dispatchEvent(new Event(EVENTO_RASCUNHO_ALTERADO))
}

export function contarRascunhosPendentes(): number {
  let total = 0
  for (let i = 0; i < localStorage.length; i++) {
    if (localStorage.key(i)?.startsWith(PREFIXO)) total += 1
  }
  return total
}
