import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { PERFIL_LABELS, PERFIL_OPTIONS } from '@/constants/perfil'
import { useAuth } from '@/features/auth/useAuth'
import {
  atualizarPerfilUsuario,
  listUsuarios,
  type Perfil,
  type Usuario,
} from '@/services/admin/usuarios'

function EditarUsuario({
  usuario,
  onSalvo,
  onCancelar,
}: {
  usuario: Usuario
  onSalvo: (usuario: Usuario) => void
  onCancelar: () => void
}) {
  const [perfil, setPerfil] = useState<Perfil>(
    usuario.perfil ?? 'INSPETOR_SAPORE',
  )
  const [ativo, setAtivo] = useState(usuario.ativo)
  const [motivo, setMotivo] = useState('')
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  async function salvar() {
    setSalvando(true)
    setErro(null)
    try {
      const atualizado = await atualizarPerfilUsuario({
        usuarioId: usuario.id,
        perfil,
        ativo,
        motivo,
      })
      onSalvo(atualizado)
    } catch (error) {
      setErro(
        error instanceof Error ? error.message : 'Erro ao salvar usuário.',
      )
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div className="flex flex-col gap-3 border-t border-neutral-100 bg-neutral-50 p-4">
      <Select
        label="Perfil"
        value={perfil}
        onChange={(event) => setPerfil(event.target.value as Perfil)}
      >
        {PERFIL_OPTIONS.map((opcao) => (
          <option key={opcao.value} value={opcao.value}>
            {opcao.label}
          </option>
        ))}
      </Select>

      <label className="flex items-center gap-2 text-sm font-medium text-neutral-700">
        <input
          type="checkbox"
          checked={ativo}
          onChange={(event) => setAtivo(event.target.checked)}
          className="h-5 w-5"
        />
        Usuário ativo
      </label>

      <Textarea
        label="Motivo (opcional)"
        value={motivo}
        onChange={(event) => setMotivo(event.target.value)}
        placeholder="Por que essa mudança está sendo feita?"
      />

      {erro && <p className="text-sm text-red-600">{erro}</p>}

      <div className="flex gap-2">
        <Button variant="outline" onClick={onCancelar} disabled={salvando}>
          Cancelar
        </Button>
        <Button onClick={salvar} disabled={salvando}>
          {salvando ? 'Salvando…' : 'Salvar'}
        </Button>
      </div>
    </div>
  )
}

export function AdminUsuariosPage() {
  const { profile } = useAuth()
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [editandoId, setEditandoId] = useState<string | null>(null)

  useEffect(() => {
    listUsuarios()
      .then(setUsuarios)
      .catch((error) => setErro(error.message ?? 'Erro ao carregar usuários.'))
      .finally(() => setLoading(false))
  }, [])

  function handleSalvo(atualizado: Usuario) {
    setUsuarios((atual) =>
      atual.map((u) => (u.id === atualizado.id ? atualizado : u)),
    )
    setEditandoId(null)
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-bold text-neutral-900">Usuários</h1>
        <p className="text-sm text-neutral-500">
          Visualizar perfil, alterar perfil e ativar/desativar usuários.
        </p>
      </div>

      {erro && <p className="text-sm text-red-600">{erro}</p>}

      {loading ? (
        <p className="text-sm text-neutral-500">Carregando…</p>
      ) : usuarios.length === 0 ? (
        <p className="rounded-xl bg-white p-6 text-center text-sm text-neutral-500 shadow-sm">
          Nenhum usuário encontrado.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {usuarios.map((usuario) => (
            <div
              key={usuario.id}
              className="overflow-hidden rounded-xl bg-white shadow-sm"
            >
              <div className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium text-neutral-900">
                    {usuario.nome_completo || '(sem nome)'}
                  </p>
                  <p className="text-sm text-neutral-500">{usuario.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  {usuario.perfil ? (
                    <Badge className="bg-vale-gray-light text-neutral-700">
                      {PERFIL_LABELS[usuario.perfil]}
                    </Badge>
                  ) : (
                    <Badge className="bg-neutral-100 text-neutral-500">
                      Sem perfil
                    </Badge>
                  )}
                  <Badge
                    className={
                      usuario.ativo
                        ? 'bg-vale-green-light text-vale-green-dark'
                        : 'bg-red-100 text-red-700'
                    }
                  >
                    {usuario.ativo ? 'Ativo' : 'Inativo'}
                  </Badge>
                  <Button
                    variant="outline"
                    fullWidth={false}
                    className="px-3 py-1.5 text-sm"
                    onClick={() =>
                      setEditandoId(
                        editandoId === usuario.id ? null : usuario.id,
                      )
                    }
                  >
                    {editandoId === usuario.id ? 'Fechar' : 'Editar'}
                  </Button>
                </div>
              </div>

              {editandoId === usuario.id && (
                <EditarUsuario
                  usuario={usuario}
                  onSalvo={handleSalvo}
                  onCancelar={() => setEditandoId(null)}
                />
              )}

              {usuario.id === profile?.id && (
                <p className="border-t border-neutral-100 bg-neutral-50 px-4 py-2 text-xs text-neutral-400">
                  Este é o seu próprio usuário.
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
