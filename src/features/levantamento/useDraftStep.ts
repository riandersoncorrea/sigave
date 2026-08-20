import { useEffect, useRef, useState } from 'react'

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
// existe se uma gravação anterior não chegou a ser confirmada.
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
  useEffect(() => {
    loadRef.current = load
    saveRef.current = save
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
    setStatus('salvando')

    const timeout = setTimeout(async () => {
      try {
        await saveRef.current(values)
        localStorage.removeItem(storageKey)
        setStatus('salvo')
      } catch {
        setStatus('erro')
      }
    }, 800)

    return () => clearTimeout(timeout)
  }, [values, storageKey])

  async function saveNow(): Promise<boolean> {
    try {
      await saveRef.current(values)
      localStorage.removeItem(storageKey)
      setStatus('salvo')
      return true
    } catch {
      setStatus('erro')
      return false
    }
  }

  return { values, setValues, status, saveNow }
}
