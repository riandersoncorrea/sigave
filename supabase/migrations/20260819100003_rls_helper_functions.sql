-- Funções auxiliares usadas pelas policies de RLS (migration 0008) e por
-- gatilhos. security definer é necessário para que funcionem dentro de
-- policies definidas na própria tabela profiles sem recursão de RLS, e para
-- que qualquer usuário autenticado consiga resolver o próprio papel mesmo
-- sem visibilidade direta sobre a linha de profiles de outra pessoa.

create or replace function public.user_perfil()
returns perfil_usuario
language sql
stable
security definer
set search_path = public
as $$
  select perfil
  from public.profiles
  where id = auth.uid()
    and ativo = true
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.user_perfil() = 'ADMINISTRADOR'
$$;

-- is_inspetor_do_avm() é criada na migration 0005, logo após a tabela avms
-- existir — funções "language sql" têm o corpo validado contra o catálogo
-- na criação, então não pode referenciar avms antes dela existir.
