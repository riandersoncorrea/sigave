-- Tabela de perfis (1:1 com auth.users) e o gatilho que a popula no signup.
-- Perfil nasce SEM papel e SEM acesso (perfil = null, ativo = false): mesmo
-- o privilégio mais baixo precisa ser concedido deliberadamente por um
-- ADMINISTRADOR — nunca é herdado automaticamente do cadastro.

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  nome_completo text not null default '',
  perfil perfil_usuario,
  ativo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, nome_completo)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'nome_completo', '')
  );
  return new;
end;
$$;

create trigger trg_on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Impede autopromoção: qualquer usuário pode ter policy de UPDATE na sua
-- própria linha (ex.: editar nome), mas somente um ADMINISTRADOR pode
-- alterar perfil/ativo. A policy (0008) decide "qual linha"; este gatilho
-- decide "quais colunas".
create or replace function public.prevent_self_role_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if public.is_admin() then
    return new;
  end if;

  if new.perfil is distinct from old.perfil or new.ativo is distinct from old.ativo then
    raise exception 'Apenas um administrador pode alterar perfil ou status de ativação.';
  end if;

  return new;
end;
$$;

-- A função referencia public.is_admin(), criada na migration seguinte
-- (0003). Corpos plpgsql não são validados contra o catálogo na criação,
-- apenas na execução, então a ordem é segura: este gatilho só dispara em
-- UPDATEs futuros, bem depois de is_admin() já existir.
create trigger trg_prevent_self_role_escalation
  before update on public.profiles
  for each row
  execute function public.prevent_self_role_escalation();
