import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import {
  atualizarOpcao,
  CATEGORIA_LABELS,
  criarOpcao,
  listCategorias,
  listOpcoesPorCategoria,
  type OpcaoLista,
} from '@/services/admin/listas'

function NovaOpcaoForm({
  categoria,
  proximaOrdem,
  onCriada,
}: {
  categoria: string
  proximaOrdem: number
  onCriada: (opcao: OpcaoLista) => void
}) {
  const [valor, setValor] = useState('')
  const [rotulo, setRotulo] = useState('')
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  async function salvar() {
    if (!valor.trim() || !rotulo.trim()) {
      setErro('Preencha valor e rótulo.')
      return
    }
    setSalvando(true)
    setErro(null)
    try {
      const opcao = await criarOpcao({
        categoria,
        valor: valor.trim().toUpperCase().replace(/\s+/g, '_'),
        rotulo: rotulo.trim(),
        ordem: proximaOrdem,
      })
      onCriada(opcao)
      setValor('')
      setRotulo('')
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Erro ao criar opção.')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div className="flex flex-col gap-2 rounded-xl bg-white p-4 shadow-sm">
      <p className="text-sm font-semibold text-neutral-800">Nova opção</p>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <input
          type="text"
          placeholder="Valor interno (ex: GRAMINEA)"
          value={valor}
          onChange={(event) => setValor(event.target.value)}
          className="focus:border-vale-green focus:ring-vale-green min-h-12 w-full rounded-lg border border-neutral-300 px-4 text-base focus:ring-2 focus:outline-none"
        />
        <input
          type="text"
          placeholder="Rótulo exibido (ex: Gramínea)"
          value={rotulo}
          onChange={(event) => setRotulo(event.target.value)}
          className="focus:border-vale-green focus:ring-vale-green min-h-12 w-full rounded-lg border border-neutral-300 px-4 text-base focus:ring-2 focus:outline-none"
        />
      </div>
      {erro && <p className="text-sm text-red-600">{erro}</p>}
      <Button
        fullWidth={false}
        className="self-start px-4"
        onClick={salvar}
        disabled={salvando}
      >
        {salvando ? 'Adicionando…' : 'Adicionar'}
      </Button>
    </div>
  )
}

export function AdminListasPage() {
  const [categorias, setCategorias] = useState<string[]>([])
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('')
  const [opcoes, setOpcoes] = useState<OpcaoLista[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    listCategorias()
      .then((lista) => {
        setCategorias(lista)
        if (lista.length > 0) setCategoriaSelecionada(lista[0])
      })
      .catch((error) => setErro(error.message ?? 'Erro ao carregar listas.'))
  }, [])

  useEffect(() => {
    if (!categoriaSelecionada) return
    setLoading(true)
    listOpcoesPorCategoria(categoriaSelecionada)
      .then(setOpcoes)
      .catch((error) => setErro(error.message ?? 'Erro ao carregar opções.'))
      .finally(() => setLoading(false))
  }, [categoriaSelecionada])

  async function toggleAtivo(opcao: OpcaoLista) {
    try {
      const atualizada = await atualizarOpcao(opcao.id, {
        ativo: !opcao.ativo,
      })
      setOpcoes((atual) =>
        atual.map((o) => (o.id === atualizada.id ? atualizada : o)),
      )
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Erro ao atualizar.')
    }
  }

  const proximaOrdem =
    opcoes.length === 0 ? 1 : Math.max(...opcoes.map((o) => o.ordem)) + 1

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-bold text-neutral-900">
          Listas administráveis
        </h1>
        <p className="text-sm text-neutral-500">
          Catálogos de opção usados nos formulários de levantamento.
        </p>
      </div>

      <Select
        label="Categoria"
        value={categoriaSelecionada}
        onChange={(event) => setCategoriaSelecionada(event.target.value)}
      >
        {categorias.map((categoria) => (
          <option key={categoria} value={categoria}>
            {CATEGORIA_LABELS[categoria] ?? categoria}
          </option>
        ))}
      </Select>

      {erro && <p className="text-sm text-red-600">{erro}</p>}

      {loading ? (
        <p className="text-sm text-neutral-500">Carregando…</p>
      ) : (
        <>
          <div className="flex flex-col gap-2 rounded-xl bg-white p-4 shadow-sm">
            {opcoes.length === 0 ? (
              <p className="text-sm text-neutral-500">
                Nenhuma opção nesta categoria ainda.
              </p>
            ) : (
              opcoes.map((opcao) => (
                <div
                  key={opcao.id}
                  className="flex items-center justify-between gap-2 border-b border-neutral-100 py-2 last:border-b-0"
                >
                  <div>
                    <p className="text-sm font-medium text-neutral-800">
                      {opcao.rotulo}
                    </p>
                    <p className="text-xs text-neutral-400">
                      {opcao.valor} · ordem {opcao.ordem}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      className={
                        opcao.ativo
                          ? 'bg-vale-green-light text-vale-green-dark'
                          : 'bg-neutral-100 text-neutral-500'
                      }
                    >
                      {opcao.ativo ? 'Ativa' : 'Inativa'}
                    </Badge>
                    <Button
                      variant="outline"
                      fullWidth={false}
                      className="px-3 py-1.5 text-sm"
                      onClick={() => toggleAtivo(opcao)}
                    >
                      {opcao.ativo ? 'Desativar' : 'Ativar'}
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

          {categoriaSelecionada && (
            <NovaOpcaoForm
              categoria={categoriaSelecionada}
              proximaOrdem={proximaOrdem}
              onCriada={(opcao) => setOpcoes((atual) => [...atual, opcao])}
            />
          )}
        </>
      )}
    </div>
  )
}
