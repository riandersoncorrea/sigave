// Cadastro de usuário direto do painel de administração (Sprint 8+).
//
// Por que uma Edge Function e não uma RPC comum: criar um usuário em
// auth.users exige a service role key (bypassa toda RLS e concede acesso
// total à API de administração do Supabase Auth) — essa chave nunca pode
// chegar ao navegador. O padrão correto é isolar a única operação que
// realmente precisa dela (auth.admin.createUser) num ambiente servidor,
// que é exatamente o que uma Edge Function é.
//
// O restante (verificar que quem chamou é admin, promover o perfil,
// registrar motivo/auditoria) reaproveita a RPC atualizar_perfil_usuario
// já existente, autenticada como o admin que chamou — não como service
// role — para que o motivo e o audit_log fiquem corretamente atribuídos a
// essa pessoa, e não a "Sistema".
import { createClient } from 'jsr:@supabase/supabase-js@2'

// Chamado do navegador (localhost:5173 em dev, outro domínio em prod) para
// uma origem diferente (*.supabase.co) — sem os headers de CORS abaixo o
// navegador bloqueia a resposta antes mesmo do código da função rodar.
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function jsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  })
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Método não permitido.' }, 405)
  }

  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return jsonResponse({ error: 'Não autenticado.' }, 401)
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

  // Cliente autenticado como quem chamou — respeita RLS normalmente, é só
  // com ele que confirmamos "quem está pedindo isso" e que promovemos o
  // novo usuário depois (motivo/auditoria corretos).
  const callerClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } },
  })

  const {
    data: { user: caller },
    error: callerError,
  } = await callerClient.auth.getUser()

  if (callerError || !caller) {
    return jsonResponse({ error: 'Não autenticado.' }, 401)
  }

  const { data: callerProfile } = await callerClient
    .from('profiles')
    .select('perfil, ativo')
    .eq('id', caller.id)
    .single()

  if (callerProfile?.perfil !== 'ADMINISTRADOR' || !callerProfile.ativo) {
    return jsonResponse(
      { error: 'Apenas administradores podem cadastrar usuários.' },
      403,
    )
  }

  let body: {
    email?: string
    password?: string
    nomeCompleto?: string
    perfil?: string
    motivo?: string
  }
  try {
    body = await req.json()
  } catch {
    return jsonResponse({ error: 'Corpo da requisição inválido.' }, 400)
  }

  const { email, password, nomeCompleto, perfil, motivo } = body

  if (!email || !password || !perfil) {
    return jsonResponse(
      { error: 'E-mail, senha e perfil são obrigatórios.' },
      400,
    )
  }
  if (password.length < 6) {
    return jsonResponse(
      { error: 'A senha precisa ter pelo menos 6 caracteres.' },
      400,
    )
  }
  if (!['ADMINISTRADOR', 'INSPETOR_SAPORE', 'FISCAL_VALE'].includes(perfil)) {
    return jsonResponse({ error: 'Perfil inválido.' }, 400)
  }

  // Única operação que realmente precisa da service role.
  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const { data: created, error: createError } =
    await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: nomeCompleto ? { nome_completo: nomeCompleto } : {},
    })

  if (createError || !created.user) {
    return jsonResponse(
      { error: createError?.message ?? 'Erro ao criar usuário.' },
      400,
    )
  }

  const { error: promoteError } = await callerClient.rpc(
    'atualizar_perfil_usuario',
    {
      p_usuario_id: created.user.id,
      p_perfil: perfil,
      p_ativo: true,
      p_motivo: motivo || undefined,
    },
  )

  if (promoteError) {
    return jsonResponse({ error: promoteError.message }, 400)
  }

  return jsonResponse({ id: created.user.id, email: created.user.email }, 200)
})
