import { supabase } from '@/services/supabase'
import type { Database } from '@/types/database'

export type Evidencia = Database['public']['Tables']['evidencias']['Row']
export type EvidenciaTipo = Database['public']['Enums']['evidencia_tipo']

const BUCKET = 'evidencias'
const URL_EXPIRACAO_SEGUNDOS = 60 * 60 // 1 hora, suficiente para uma sessão de revisão

function extensaoArquivo(nome: string): string {
  const partes = nome.split('.')
  return partes.length > 1 ? partes[partes.length - 1].toLowerCase() : 'jpg'
}

function gerarNomeArquivo(file: File): string {
  const aleatorio = Math.random().toString(36).slice(2, 10)
  return `${Date.now()}-${aleatorio}.${extensaoArquivo(file.name)}`
}

export async function listEvidencias(
  levantamentoId: string,
): Promise<Evidencia[]> {
  const { data, error } = await supabase
    .from('evidencias')
    .select('*')
    .eq('levantamento_id', levantamentoId)
    .order('sequencia')

  if (error) throw error
  return data
}

export async function getEvidenciaUrl(pathStorage: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(pathStorage, URL_EXPIRACAO_SEGUNDOS)

  if (error) throw error
  return data.signedUrl
}

interface UploadEvidenciaParams {
  file: File
  avmId: string
  idAvmCodigo: string
  levantamentoId: string
  usuarioId: string
  tipo: EvidenciaTipo
  descricao: string
}

// Faz upload do arquivo para o Storage e cria o registro da evidência numa
// única operação — o path segue avm/{id_avm}/{id_levantamento}/{arquivo}
// (RLS do bucket usa o 3º segmento como levantamento_id). A sequência é a
// contagem atual de evidências do levantamento + 1: nenhum metadado
// obrigatório é digitado pelo usuário além do tipo.
export async function uploadEvidencia({
  file,
  avmId,
  idAvmCodigo,
  levantamentoId,
  usuarioId,
  tipo,
  descricao,
}: UploadEvidenciaParams): Promise<Evidencia> {
  const nomeArquivo = gerarNomeArquivo(file)
  const path = `avm/${idAvmCodigo}/${levantamentoId}/${nomeArquivo}`

  const { error: erroUpload } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { contentType: file.type })

  if (erroUpload) throw erroUpload

  const { count, error: erroContagem } = await supabase
    .from('evidencias')
    .select('id', { count: 'exact', head: true })
    .eq('levantamento_id', levantamentoId)

  if (erroContagem) {
    await supabase.storage.from(BUCKET).remove([path])
    throw erroContagem
  }

  const { data, error } = await supabase
    .from('evidencias')
    .insert({
      avm_id: avmId,
      levantamento_id: levantamentoId,
      usuario_id: usuarioId,
      tipo,
      descricao: descricao || null,
      path_storage: path,
      sequencia: (count ?? 0) + 1,
    })
    .select('*')
    .single()

  if (error) {
    await supabase.storage.from(BUCKET).remove([path])
    throw error
  }

  return data
}

export async function updateEvidenciaDescricao(
  id: string,
  descricao: string,
): Promise<void> {
  const { error } = await supabase
    .from('evidencias')
    .update({ descricao: descricao || null })
    .eq('id', id)

  if (error) throw error
}

export async function deleteEvidencia(evidencia: Evidencia): Promise<void> {
  const { error: erroTabela } = await supabase
    .from('evidencias')
    .delete()
    .eq('id', evidencia.id)

  if (erroTabela) throw erroTabela

  if (evidencia.path_storage) {
    await supabase.storage.from(BUCKET).remove([evidencia.path_storage])
  }
}
