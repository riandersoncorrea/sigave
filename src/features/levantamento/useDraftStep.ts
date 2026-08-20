import { useEffect, useRef, useState } from 'react'
import { notificarRascunhoAlterado } from '@/features/levantamento/rascunhoLocal'

export type SaveStatus = 'carregando' | 'idle' | 'salvando' | 'salvo' | 'erro'

interface UseDraftStepOptions<T> {
  storageKey: string
  load: () => Promise<T>
  save: (values: T) => Promise<void>
  emptyValue: T
}

// Rascunho de uma etapa "singleton" (1 registro por levantamento). Toda
// mudança grava imediatamente no localStorage (nunca perde o que foi
// digitado ao trocar de etapa) e agenda uma gravação remota com debounce.
// Ao montar, um rascunho local tem prioridade sobre o valor remoto — ele só
// existe se uma gravação anterior não chegou a ser confirmada. Se a
// gravação falhar (ex.: sem conexão), o rascunho local permanece e é
// reenviado automaticamente assim que o navegador voltar a ficar online
// ("retomada" — Sprint 4, Modo Campo).
//
// load/save ficam em refs (não entram nos arrays de dependência dos
// efeitos): só storageKey deve reiniciar o carregamento, e sempre a versão
// mais recente de save deve ser usada no timeout de debounce, sem precisar
// recriá-lo a cada re-render.
export function useDraftStep<T>({
  storageKey,
  load,
  save,
  emptyValue,
}: UseDraftStepOptions<T>) {
  const [values, setValues] = useState<T>(emptyValue)
  const [status, setStatus] = useState<SaveStatus>('carregando')
  const prontoRef = useRef(false)
  const loadRef = useRef(load)
  const saveRef = useRef(save)
  const valuesRef = useRef(values)
  useEffect(() => {
    loadRef.current = load
    saveRef.current = save
    valuesRef.current = values
  })

  useEffect(() => {
    prontoRef.current = false
    setStatus('carregando')
    let ativo = true

    async function inicializar() {
      const remoto = await loadRef.current()
      if (!ativo) return

      const local = localStorage.getItem(storageKey)
      if (local) {
        try {
          setValues(JSON.parse(local) as T)
        } catch {
          setValues(remoto)
        }
      } else {
        setValues(remoto)
      }
      prontoRef.current = true
      setStatus('idle')
    }

    inicializar()
    return () => {
      ativo = false
    }
  }, [storageKey])

  useEffect(() => {
    if (!prontoRef.current) return

    localStorage.setItem(storageKey, JSON.stringify(values))
    notificarRascunhoAlterado()
    setStatus('salvando')

    const timeout = setTimeout(async () => {
      try {
        await saveRef.current(values)
        localStorage.removeItem(storageKey)
        notificarRascunhoAlterado()
        setStatus('salvo')
      } catch {
        setStatus('erro')
      }
    }, 800)

    return () => clearTimeout(timeout)
  }, [values, storageKey])

  async function saveNow(): Promise<boolean> {
    try {
      await saveRef.current(valuesRef.current)
      localStorage.removeItem(storageKey)
      notificarRascunhoAlterado()
      setStatus('salvo')
      return true
    } catch {
      setStatus('erro')
      return false
    }
  }

  // Retomada: ao reconectar, tenta reenviar o rascunho pendente desta
  // etapa. saveNow() é idempotente (reenviar valores já salvos não causa
  // dano) e usa valuesRef para sempre pegar o estado mais recente.
  useEffect(() => {
    function handleOnline() {
      if (prontoRef.current) saveNow()
    }
    window.addEventListener('online', handleOnline)
    return () => window.removeEventListener('online', handleOnline)
  }, [])

  return { values, setValues, status, saveNow }
}
