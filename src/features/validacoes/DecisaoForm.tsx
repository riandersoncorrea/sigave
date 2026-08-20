import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import { registrarValidacao } from '@/services/validacoes'
import type { ValidacaoAcao } from '@/types/validacao'

const ROTULO_BOTAO: Record<ValidacaoAcao, string> = {
  APROVADO: 'Aprovar',
  REPROVADO: 'Reprovar',
  SOLICITADA_COMPLEMENTACAO: 'Solicitar complementação',
}

const ROTULO_CAMPO: Record<ValidacaoAcao, string> = {
  APROVADO: 'Observação (opcional)',
  REPROVADO: 'Motivo da reprovação',
  SOLICITADA_COMPLEMENTACAO: 'O que precisa ser corrigido?',
}

interface DecisaoFormProps {
  levantamentoId: string
  fiscalId: string
  onDecidido: () => void
}

// APROVAR não exige motivo (a coluna comentario aceita null); REPROVAR e
// SOLICITAR COMPLEMENTAÇÃO exigem — a validação aqui é só de UX, a
// obrigatoriedade real é imposta pela constraint
// validacoes_comentario_obrigatorio no banco.
export function DecisaoForm({
  levantamentoId,
  fiscalId,
  onDecidido,
}: DecisaoFormProps) {
  const [acao, setAcao] = useState<ValidacaoAcao | null>(null)
  const [comentario, setComentario] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  function cancelar() {
    setAcao(null)
    setComentario('')
    setErro(null)
  }

  async function confirmar() {
    if (!acao) return
    if (acao !== 'APROVADO' && !comentario.trim()) {
      setErro(
        acao === 'REPROVADO'
          ? 'Informe o motivo da reprovação.'
          : 'Informe o que precisa ser corrigido.',
      )
      return
    }
    setEnviando(true)
    setErro(null)
    try {
      await registrarValidacao({ levantamentoId, fiscalId, acao, comentario })
      cancelar()
      onDecidido()
    } catch (error) {
      setErro(
        error instanceof Error ? error.message : 'Erro ao registrar decisão.',
      )
    } finally {
      setEnviando(false)
    }
  }

  if (!acao) {
    return (
      <div className="flex flex-col gap-3 rounded-xl bg-white p-5 shadow-sm">
        <h2 className="text-sm font-bold text-neutral-900">Decisão</h2>
        <div className="flex flex-col gap-2">
          <Button onClick={() => setAcao('APROVADO')}>Aprovar</Button>
          <Button
            variant="outline"
            className="border-red-600 text-red-600 hover:bg-red-50"
            onClick={() => setAcao('REPROVADO')}
          >
            Reprovar
          </Button>
          <Button
            variant="secondary"
            onClick={() => setAcao('SOLICITADA_COMPLEMENTACAO')}
          >
            Solicitar complementação
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl bg-white p-5 shadow-sm">
      <h2 className="text-sm font-bold text-neutral-900">
        {ROTULO_BOTAO[acao]}
      </h2>
      <Textarea
        label={ROTULO_CAMPO[acao]}
        value={comentario}
        onChange={(event) => setComentario(event.target.value)}
        autoFocus
      />
      {erro && <p className="text-sm text-red-600">{erro}</p>}
      <div className="flex gap-2">
        <Button variant="outline" onClick={cancelar} disabled={enviando}>
          Cancelar
        </Button>
        <Button onClick={confirmar} disabled={enviando}>
          {enviando ? 'Enviando…' : 'Confirmar'}
        </Button>
      </div>
    </div>
  )
}
