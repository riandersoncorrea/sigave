import { redirect } from 'react-router-dom'
import { supabase } from '@/services/supabase'
import type { Perfil } from '@/types/perfil'

// Este loader é uma conveniência de UX (evita mostrar conteúdo protegido
// antes de redirecionar, trata links diretos). NÃO é a fronteira de
// segurança — essa é a Row Level Security no Postgres (ver
// supabase/migrations). Mesmo que este redirect falhe ou seja
// contornado, as consultas ao Supabase continuam retornando vazio para
// quem não tem permissão.
export async function requireSession() {
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    throw redirect('/login')
  }

  return { session }
}

// Não utilizado ainda nesta sprint (não há rotas restritas por perfil) —
// disponível para a Sprint 2+ reaproveitar. Mesma ressalva acima: apoio de
// UX, não substitui a RLS.
export async function requireRole(perfisPermitidos: Perfil[]) {
  const { session } = await requireSession()

  const { data: profile } = await supabase
    .from('profiles')
    .select('perfil')
    .eq('id', session.user.id)
    .single()

  if (!profile?.perfil || !perfisPermitidos.includes(profile.perfil)) {
    throw redirect('/')
  }

  return { session, perfil: profile.perfil }
}
