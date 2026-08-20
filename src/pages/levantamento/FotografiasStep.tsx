import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import {
  EVIDENCIA_TIPO_OBRIGATORIOS_OPTIONS,
  EVIDENCIA_TIPO_OPTIONS,
} from '@/constants/levantamento'
import { useAuth } from '@/features/auth/useAuth'
import { WizardNav } from '@/features/levantamento/WizardNav'
import { WizardProgress } from '@/features/levantamento/WizardProgress'
import { useLevantamentoContext } from '@/features/levantamento/useLevantamentoContext'
import {
  deleteEvidencia,
  getEvidenciaUrl,
  listEvidencias,
  updateEvidenciaDescricao,
  uploadEvidencia,
  type Evidencia,
  type EvidenciaTipo,
} from '@/services/evidencias'

interface Pendente {
  file: File
  previewUrl: string
  tipo: EvidenciaTipo
}

export function FotografiasStep() {
  const { levantamento, avm } = useLevantamentoContext()
  const { profile } = useAuth()

  const [evidencias, setEvidencias] = useState<Evidencia[]>([])
  const [urls, setUrls] = useState<Record<string, string>>({})
  const [tipoEscolhido, setTipoEscolhido] = useState<EvidenciaTipo | ''>('')
  const [pendente, setPendente] = useState<Pendente | null>(null)
  const [descricaoPendente, setDescricaoPendente] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const inputCamera = useRef<HTMLInputElement>(null)
  const inputGaleria = useRef<HTMLInputElement>(null)

  async function carregarEvidencias() {
    const lista = await listEvidencias(levantamento.id)
    setEvidencias(lista)
    const entradas = await Promise.all(
      lista
        .filter((item) => item.path_storage)
        .map(async (item) => [
          item.id,
          await getEvidenciaUrl(item.path_storage as string),
        ]),
    )
    setUrls(Object.fromEntries(entradas))
  }

  useEffect(() => {
    carregarEvidencias()
  }, [levantamento.id])

  function handleArquivoSelecionado(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file || !tipoEscolhido) return
    setPendente({
      file,
      previewUrl: URL.createObjectURL(file),
      tipo: tipoEscolhido,
    })
    setDescricaoPendente('')
  }

  function cancelarPendente() {
    if (pendente) URL.revokeObjectURL(pendente.previewUrl)
    setPendente(null)
    setDescricaoPendente('')
  }

  async function confirmarEnvio() {
    if (!pendente || !profile) return
    setEnviando(true)
    setErro(null)
    try {
      await uploadEvidencia({
        file: pendente.file,
        avmId: avm.id,
        idAvmCodigo: avm.id_avm,
        levantamentoId: levantamento.id,
        usuarioId: profile.id,
        tipo: pendente.tipo,
        descricao: descricaoPendente,
      })
      URL.revokeObjectURL(pendente.previewUrl)
      setPendente(null)
      setDescricaoPendente('')
      await carregarEvidencias()
    } catch (error) {
      setErro(
        error instanceof Error ? error.message : 'Erro ao enviar fotografia.',
      )
    } finally {
      setEnviando(false)
    }
  }

  async function handleExcluir(evidencia: Evidencia) {
    try {
      await deleteEvidencia(evidencia)
      await carregarEvidencias()
    } catch (error) {
      setErro(
        error instanceof Error ? error.message : 'Erro ao excluir fotografia.',
      )
    }
  }

  async function handleAtualizarDescricao(id: string, descricao: string) {
    setEvidencias((atual) =>
      atual.map((item) => (item.id === id ? { ...item, descricao } : item)),
    )
    try {
      await updateEvidenciaDescricao(id, descricao)
    } catch {
      setErro('Erro ao salvar a descrição.')
    }
  }

  const tiposPresentes = new Set<string>(
    evidencias.map((item) => item.tipo ?? ''),
  )

  return (
    <div className="flex flex-col gap-4">
      <WizardProgress currentSlug="fotografias" />

      <div className="flex flex-col gap-3 rounded-xl bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-neutral-900">
          Fotografias obrigatórias
        </h2>
        <ul className="flex flex-col gap-1 text-sm">
          {EVIDENCIA_TIPO_OBRIGATORIOS_OPTIONS.map((opcao) => (
            <li key={opcao.value} className="flex items-center gap-2">
              <span
                className={
                  tiposPresentes.has(opcao.value)
                    ? 'text-vale-green-dark'
                    : 'text-neutral-400'
                }
              >
                {tiposPresentes.has(opcao.value) ? '✓' : '○'}
              </span>
              {opcao.label}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-4 rounded-xl bg-white p-5 shadow-sm">
        <Select
          label="Tipo da fotografia"
          value={tipoEscolhido}
          onChange={(event) =>
            setTipoEscolhido(event.target.value as EvidenciaTipo)
          }
        >
          <option value="">Selecione antes de capturar</option>
          {EVIDENCIA_TIPO_OPTIONS.map((opcao) => (
            <option key={opcao.value} value={opcao.value}>
              {opcao.label}
            </option>
          ))}
        </Select>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            disabled={!tipoEscolhido}
            onClick={() => inputCamera.current?.click()}
          >
            Tirar foto
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={!tipoEscolhido}
            onClick={() => inputGaleria.current?.click()}
          >
            Escolher da galeria
          </Button>
        </div>
        <input
          ref={inputCamera}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleArquivoSelecionado}
        />
        <input
          ref={inputGaleria}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleArquivoSelecionado}
        />

        {pendente && (
          <div className="flex flex-col gap-3 rounded-lg border border-neutral-200 p-4">
            <img
              src={pendente.previewUrl}
              alt="Pré-visualização"
              className="max-h-64 w-full rounded-lg object-cover"
            />
            <Textarea
              label="Descrição (opcional)"
              value={descricaoPendente}
              onChange={(event) => setDescricaoPendente(event.target.value)}
            />
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={cancelarPendente}
                disabled={enviando}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                className="flex-1"
                onClick={confirmarEnvio}
                disabled={enviando}
              >
                {enviando ? 'Enviando…' : 'Confirmar envio'}
              </Button>
            </div>
          </div>
        )}

        {erro && <p className="text-sm text-red-600">{erro}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {evidencias.map((evidencia) => (
          <div
            key={evidencia.id}
            className="flex flex-col gap-2 rounded-lg border border-neutral-200 p-2"
          >
            {urls[evidencia.id] && (
              <img
                src={urls[evidencia.id]}
                alt={evidencia.tipo ?? 'Evidência'}
                className="aspect-square w-full rounded-md object-cover"
              />
            )}
            <p className="text-xs font-medium text-neutral-700">
              {
                EVIDENCIA_TIPO_OPTIONS.find((o) => o.value === evidencia.tipo)
                  ?.label
              }
            </p>
            <textarea
              value={evidencia.descricao ?? ''}
              onChange={(event) =>
                handleAtualizarDescricao(evidencia.id, event.target.value)
              }
              placeholder="Descrição"
              rows={2}
              className="focus:border-vale-green w-full rounded border border-neutral-200 p-1.5 text-xs focus:outline-none"
            />
            <button
              type="button"
              onClick={() => handleExcluir(evidencia)}
              className="text-xs font-medium text-red-600 underline"
            >
              Excluir
            </button>
          </div>
        ))}
      </div>

      <WizardNav
        levantamentoId={levantamento.id}
        avmId={avm.id}
        currentSlug="fotografias"
        saveStatus="idle"
        onContinuar={async () => true}
      />
    </div>
  )
}
