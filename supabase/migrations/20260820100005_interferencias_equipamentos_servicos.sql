-- Sprint 3: três novas tabelas 1:N por levantamento, para as etapas que a
-- especificação descreve explicitamente como "múltiplas"/"permitir
-- múltiplos": Interferências, Equipamentos e Serviços. O "nome"/"tipo" de
-- cada item é texto livre — não existe (e não foi fornecido) um catálogo
-- fechado de tipos de interferência, equipamento ou serviço, e inventar um
-- seria simplificar/adivinhar exatamente o que a sprint pediu para evitar.
-- A estrutura de cada item (adequado/possível/não recomendado + justificativa
-- para equipamento; necessidade + observação para serviço) essa sim veio
-- explícita da especificação.

create table public.interferencias (
  id uuid primary key default gen_random_uuid(),
  levantamento_id uuid not null references public.levantamentos (id) on delete cascade,
  tipo text not null,
  descricao text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.profiles (id) on delete set null,
  updated_by uuid references public.profiles (id) on delete set null
);

create trigger trg_interferencias_updated_at
  before update on public.interferencias
  for each row
  execute function public.set_updated_at();

alter table public.interferencias enable row level security;
create index idx_interferencias_levantamento_id on public.interferencias (levantamento_id);

create table public.equipamentos (
  id uuid primary key default gen_random_uuid(),
  levantamento_id uuid not null references public.levantamentos (id) on delete cascade,
  nome text not null,
  avaliacao text not null check (avaliacao in ('ADEQUADO', 'POSSIVEL', 'NAO_RECOMENDADO')),
  justificativa text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.profiles (id) on delete set null,
  updated_by uuid references public.profiles (id) on delete set null
);

create trigger trg_equipamentos_updated_at
  before update on public.equipamentos
  for each row
  execute function public.set_updated_at();

alter table public.equipamentos enable row level security;
create index idx_equipamentos_levantamento_id on public.equipamentos (levantamento_id);

create table public.servicos (
  id uuid primary key default gen_random_uuid(),
  levantamento_id uuid not null references public.levantamentos (id) on delete cascade,
  nome text not null,
  necessidade text not null check (necessidade in ('NECESSARIO', 'NAO_NECESSARIO', 'A_AVALIAR')),
  observacao text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.profiles (id) on delete set null,
  updated_by uuid references public.profiles (id) on delete set null
);

create trigger trg_servicos_updated_at
  before update on public.servicos
  for each row
  execute function public.set_updated_at();

alter table public.servicos enable row level security;
create index idx_servicos_levantamento_id on public.servicos (levantamento_id);
