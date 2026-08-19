-- Estrutura organizacional: unidades e setores, referenciados por avms.

create table public.unidades (
  id uuid primary key default gen_random_uuid(),
  nome text not null unique,
  codigo text unique,
  ativo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.profiles (id) on delete set null,
  updated_by uuid references public.profiles (id) on delete set null
);

create trigger trg_unidades_updated_at
  before update on public.unidades
  for each row
  execute function public.set_updated_at();

create table public.setores (
  id uuid primary key default gen_random_uuid(),
  unidade_id uuid not null references public.unidades (id) on delete restrict,
  nome text not null,
  codigo text,
  ativo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.profiles (id) on delete set null,
  updated_by uuid references public.profiles (id) on delete set null,
  unique (unidade_id, nome)
);

create trigger trg_setores_updated_at
  before update on public.setores
  for each row
  execute function public.set_updated_at();

alter table public.unidades enable row level security;
alter table public.setores enable row level security;
