import { useEffect, useState } from 'react'
import {
  EVENTO_RASCUNHO_ALTERADO,
  contarRascunhosPendentes,
} from '@/features/levantamento/rascunhoLocal'
import { useOnlineStatus } from '@/features/levantamento/useOnlineStatus'

// Indicador global de "modo campo": mostra quando o navegador está offline
// e quantos rascunhos (etapas do wizard ainda não confirmadas no banco)
// estão pendentes. Nunca bloqueia o uso do app — é só um aviso.
export function SyncStatusBanner() {
  const online = useOnlineStatus()
  const [pendentes, setPendentes] = useState(0)

  useEffect(() => {
    function atualizar() {
      setPendentes(contarRascunhosPendentes())
    }
    atualizar()
    window.addEventListener(EVENTO_RASCUNHO_ALTERADO, atualizar)
    window.addEventListener('online', atualizar)
    window.addEventListener('offline', atualizar)
    const intervalo = setInterval(atualizar, 5000)
    return () => {
      window.removeEventListener(EVENTO_RASCUNHO_ALTERADO, atualizar)
      window.removeEventListener('online', atualizar)
      window.removeEventListener('offline', atualizar)
      clearInterval(intervalo)
    }
  }, [])

  if (online && pendentes === 0) return null

  return (
    <div
      className={`px-4 py-1.5 text-center text-xs font-medium text-white ${
        online ? 'bg-vale-yellow text-neutral-900' : 'bg-neutral-700'
      }`}
    >
      {!online && 'Você está offline. '}
      {pendentes > 0 &&
        `${pendentes} ${pendentes === 1 ? 'alteração não sincronizada' : 'alterações não sincronizadas'}.`}
    </div>
  )
}
