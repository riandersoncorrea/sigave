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
