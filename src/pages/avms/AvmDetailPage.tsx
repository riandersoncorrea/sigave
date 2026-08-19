import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import {
  CLASSE_FUNCIONAL_LABELS,
  STATUS_BADGE_CLASSES,
  STATUS_LABELS,
} from '@/constants/avm'
import { useAuth } from '@/features/auth/useAuth'
import { assignInspetor, getAvm } from '@/services/avms'
import {
  getLevantamentoEmAberto,
  startLevantamento,
  type Levantamento,
} from '@/services/levantamentos'
import { listInspetores, type Inspetor } from '@/services/profiles'
import type { AvmComRelacoes } from '@/types/avm'

function Campo({ label, valor }: { label: string; valor: string }) {
  return (
    <div>
      <p className="text-xs font-medium tracking-wide text-neutral-500 uppercase">
        {label}
      </p>
      <p className="text-sm text-neutral-900">{valor || '—'}</p>
    </div>
  )
}

export function AvmDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { profile } = useAuth()
  const podeGerenciar =
    profile?.perfil === 'ADMINISTRADOR' || profile?.perfil === 'FISCAL_VALE'
  const ehInspetor = profile?.perfil === 'INSPETOR_SAPORE'

  const [avm, setAvm] = useState<AvmComRelacoes | null | undefined>(undefined)
  const [inspetores, setInspetores] = useState<Inspetor[]>([])
  const [inspetorSelecionado, setInspetorSelecionado] = useState('')
  const [salvandoInspetor, setSalvandoInspetor] = useState(false)
  const [levantamento, setLevantamento] = useState<Levantamento | null>(null)
  const [iniciandoLevantamento, setIniciandoLevantamento] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    getAvm(id).then((data) => {
      setAvm(data)
      setInspetorSelecionado(data?.inspetor_id ?? '')
    })
  }, [id])

  useEffect(() => {
    if (podeGerenciar) listInspetores().then(setInspetores)
  }, [podeGerenciar])

  useEffect(() => {
    if (!ehInspetor || !avm || !profile) return
    getLevantamentoEmAberto(avm.id, profile.id).then(setLevantamento)
  }, [ehInspetor, avm, profile])

  async function handleSalvarInspetor() {
    if (!avm) return
    setSalvandoInspetor(true)
    setErro(null)
    try {
      const atualizado = await assignInspetor(
        avm.id,
        inspetorSelecionado || null,
      )
      setAvm(atualizado)
    } catch (error) {
      setErro(
        error instanceof Error ? error.message : 'Erro ao atribuir inspetor.',
      )
    } finally {
      setSalvandoInspetor(false)
    }
  }

  async function handleIniciarLevantamento() {
    if (!avm || !profile) return
    setIniciandoLevantamento(true)
    setErro(null)
    try {
      const resultado = await startLevantamento(avm.id, profile.id)
      setLevantamento(resultado)
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : 'Erro ao iniciar levantamento.',
      )
    } finally {
      setIniciandoLevantamento(false)
    }
  }

  if (avm === undefined) {
    return <p className="text-sm text-neutral-500">Carregando…</p>
  }

  if (avm === null) {
    return (
      <p className="rounded-xl bg-white p-6 text-center text-sm text-neutral-500 shadow-sm">
        AVM não encontrada ou você não tem acesso a ela.
      </p>
    )
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4">
      <div className="rounded-xl bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-vale-green text-xs font-semibold">
              {avm.id_avm}
            </p>
            <h1 className="text-xl font-bold text-neutral-900">{avm.nome}</h1>
          </div>
          <Badge className={STATUS_BADGE_CLASSES[avm.status]}>
            {STATUS_LABELS[avm.status]}
          </Badge>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <Campo label="Unidade" valor={avm.unidade?.nome ?? ''} />
          <Campo label="Setor" valor={avm.setor?.nome ?? ''} />
          <Campo label="Subsetor" valor={avm.subsetor ?? ''} />
          <Campo
            label="Classe funcional"
            valor={CLASSE_FUNCIONAL_LABELS[avm.classe_funcional]}
          />
          <Campo
            label="Área (m²)"
            valor={avm.area_m2 != null ? String(avm.area_m2) : ''}
          />
          <Campo
            label="Perímetro (m)"
            valor={avm.perimetro != null ? String(avm.perimetro) : ''}
          />
          <Campo label="Responsável" valor={avm.responsavel ?? ''} />
          <Campo
            label="Localização descritiva"
            valor={avm.localizacao_descritiva ?? ''}
          />
          <Campo
            label="Inspetor atribuído"
            valor={avm.inspetor?.nome_completo || avm.inspetor?.email || ''}
          />
        </div>

        {podeGerenciar && (
          <div className="mt-4">
            <Link to={`/avms/${avm.id}/editar`}>
              <Button variant="outline" fullWidth={false} className="px-4">
                Editar AVM
              </Button>
            </Link>
          </div>
        )}
      </div>

      {podeGerenciar && (
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-neutral-900">
            Atribuir inspetor
          </h2>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <Select
                aria-label="Inspetor"
                value={inspetorSelecionado}
                onChange={(event) => setInspetorSelecionado(event.target.value)}
              >
                <option value="">Nenhum</option>
                {inspetores.map((inspetor) => (
                  <option key={inspetor.id} value={inspetor.id}>
                    {inspetor.nome_completo || inspetor.email}
                  </option>
                ))}
              </Select>
            </div>
            <Button
              fullWidth={false}
              className="px-4"
              onClick={handleSalvarInspetor}
              disabled={salvandoInspetor}
            >
              {salvandoInspetor ? 'Salvando…' : 'Salvar atribuição'}
            </Button>
          </div>
        </div>
      )}

      {ehInspetor && (
        <div className="rounded-xl bg-white p-5 shadow-sm">
          {levantamento ? (
            <p className="text-sm text-neutral-700">
              Levantamento em andamento desde{' '}
              {new Date(levantamento.created_at).toLocaleDateString('pt-BR')}.
            </p>
          ) : (
            <Button
              onClick={handleIniciarLevantamento}
              disabled={iniciandoLevantamento}
            >
              {iniciandoLevantamento ? 'Iniciando…' : 'Iniciar levantamento'}
            </Button>
          )}
        </div>
      )}

      {erro && <p className="text-sm text-red-600">{erro}</p>}

      <Button
        variant="outline"
        fullWidth={false}
        className="px-4"
        onClick={() => navigate('/avms')}
      >
        Voltar
      </Button>
    </div>
  )
}
