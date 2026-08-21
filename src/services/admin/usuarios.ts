import { supabase } from '@/services/supabase'
import type { Database } from '@/types/database'

export type Usuario = Database['public']['Tables']['profiles']['Row']
export type Perfil = Database['public']['Enums']['perfil_usuario']

export async function listUsuarios(): Promise<Usuario[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('nome_completo')

  if (error) throw error
  return data
}

interface AtualizarPerfilParams {
  usuarioId: string
  perfil: Perfil
  ativo: boolean
  motivo: string
}

// O motivo é opcional para o admin, mas sempre passado à RPC: quando
// vazio, a função não grava nada em audit_log.motivo (ver migration da
// Sprint 8) — não é obrigatório para toda alteração, só fica registrado
// quando o admin quis explicar o porquê.
export async function atualizarPerfilUsuario({
  usuarioId,
  perfil,
  ativo,
  motivo,
}: AtualizarPerfilParams): Promise<Usuario> {
  const { data, error } = await supabase.rpc('atualizar_perfil_usuario', {
    p_usuario_id: usuarioId,
    p_perfil: perfil,
    p_ativo: ativo,
    p_motivo: motivo.trim() || undefined,
  })

  if (error) throw error
  return data
}

interface CriarUsuarioParams {
  email: string
  password: string
  nomeCompleto: string
  perfil: Perfil
  motivo: string
}

interface CriarUsuarioResultado {
  id: string
  email: string
}

// Cria o usuário em auth.users e já o promove ao perfil escolhido, numa
// chamada só — implementado como Edge Function porque criar um usuário
// exige a service role key, que nunca pode chegar ao navegador (ver
// supabase/functions/admin-criar-usuario).
export async function criarUsuario(
  params: CriarUsuarioParams,
): Promise<CriarUsuarioResultado> {
  const { data, error } = await supabase.functions.invoke(
    'admin-criar-usuario',
    {
      body: {
        email: params.email.trim(),
        password: params.password,
        nomeCompleto: params.nomeCompleto.trim(),
        perfil: params.perfil,
        motivo: params.motivo.trim() || undefined,
      },
    },
  )

  if (error) {
    const mensagem =
      (data as { error?: string } | null)?.error ??
      error.message ??
      'Erro ao cadastrar usuário.'
    throw new Error(mensagem)
  }

  return data as CriarUsuarioResultado
}
