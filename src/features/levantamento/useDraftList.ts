import { useEffect, useRef, useState } from 'react'
import type { SaveStatus } from '@/features/levantamento/useDraftStep'

interface ComId {
  id: string
}

interface UseDraftListOptions<T extends ComId, TNovo> {
  storageKey: string
  list: () => Promise<T[]>
  insert: (item: TNovo) => Promise<T>
  update: (id: string, patch: Partial<T>) => Promise<T>
  remove: (id: string) => Promise<void>
}

// Rascunho de uma etapa "repetível" (N registros por levantamento). Cada
// item só existe no estado depois de já ter sido inserido no banco (id
// real desde o início — sem ids temporários para trocar depois). Edições em
// um item já existente são gravadas com debounce e, enquanto isso, ficam
// também em localStorage por item; se a aba fechar antes do debounce
// disparar, a próxima visita recupera e reenvia essa edição pendente.
export function useDraftList<T extends ComId, TNovo>({
  storageKey,
  list,
  insert,
  update,
  remove,
}: UseDraftListOptions<T, TNovo>) {
  const [itens, setItens] = useState<T[]>([])
  const [status, setStatus] = useState<SaveStatus>('carregando')
  const timeoutsRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({})
  const pendentesRef = useRef<Record<string, Partial<T>>>({})
  const listRef = useRef(list)
  const updateRef = useRef(update)
  useEffect(() => {
    listRef.current = list
    updateRef.current = update
  })

  useEffect(() => {
    let ativo = true
    setStatus('carregando')

    async function inicializar() {
      const remoto = await listRef.current()
      if (!ativo) return

      const recuperados = remoto.map((item) => {
        const pendente = localStorage.getItem(`${storageKey}:${item.id}`)
        if (!pendente) return item
        try {
          return { ...item, ...(JSON.parse(pendente) as Partial<T>) }
        } catch {
          return item
        }
      })

      setItens(recuperados)
      setStatus('idle')

      // Reenvia qualquer edição recuperada do localStorage que não tinha
      // sido confirmada no banco.
      for (const item of recuperados) {
        const key = `${storageKey}:${item.id}`
        if (localStorage.getItem(key)) {
          updateRef
            .current(item.id, item)
            .then(() => localStorage.removeItem(key))
            .catch(() => {})
        }
      }
    }

    inicializar()
    return () => {
      ativo = false
    }
  }, [storageKey])

  async function addItem(defaults: TNovo) {
    const criado = await insert(defaults)
    setItens((atual) => [...atual, criado])
    return criado
  }

  function updateItem(id: string, patch: Partial<T>) {
    setItens((atual) =>
      atual.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    )

    // Acumula patches sucessivos do mesmo item — sem isso, editar dois
    // campos em rápida sucessão faria o debounce mais recente sobrescrever
    // (e perder) o patch pendente do campo anterior.
    const acumulado = { ...pendentesRef.current[id], ...patch }
    pendentesRef.current[id] = acumulado

    const key = `${storageKey}:${id}`
    localStorage.setItem(key, JSON.stringify(acumulado))
    setStatus('salvando')

    if (timeoutsRef.current[id]) clearTimeout(timeoutsRef.current[id])
    timeoutsRef.current[id] = setTimeout(async () => {
      const paraEnviar = pendentesRef.current[id]
      try {
        await updateRef.current(id, paraEnviar)
        delete pendentesRef.current[id]
        localStorage.removeItem(key)
        setStatus('salvo')
      } catch {
        setStatus('erro')
      }
    }, 800)
  }

  async function removeItem(id: string) {
    await remove(id)
    localStorage.removeItem(`${storageKey}:${id}`)
    if (timeoutsRef.current[id]) clearTimeout(timeoutsRef.current[id])
    delete pendentesRef.current[id]
    setItens((atual) => atual.filter((item) => item.id !== id))
  }

  return { itens, status, addItem, updateItem, removeItem }
}
