-- Áreas Verdes de Manutenção. Todos os campos mínimos do documento de
-- especificação, sem simplificação, mais inspetor_id (mecanismo de
-- atribuição) e created_by/updated_by (auditoria).

create table public.avms (
  id uuid primary key default gen_random_uuid(),
  id_avm text not null unique,
  nome text not null,
  unidade_id uuid not null references public.unidades (id) on delete restrict,
  setor_id uuid not null references public.setores (id) on delete restrict,
  subsetor text,
  localizacao_descritiva text,
  classe_funcional avm_classe_funcional not null,
  area_m2 numeric(12, 2) check (area_m2 is null or area_m2 >= 0),
  perimetro numeric(12, 2) check (perimetro is null or perimetro >= 0),
  responsavel text,
  status status_ciclo not null default 'NAO_INICIADA',
  -- Mecanismo de atribuição inspetor <-> AVM (decisão: coluna FK única, não
  -- tabela de junção). "responsavel" acima é texto livre (ex.: responsável
  -- do lado Vale); inspetor_id é a referência real a um usuário do sistema,
  -- usada pela RLS para restringir visibilidade.
  inspetor_id uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.profiles (id) on delete set null,
  updated_by uuid references public.profiles (id) on delete set null
);

create trigger trg_avms_updated_at
  before update on public.avms
  for each row
  execute function public.set_updated_at();

alter table public.avms enable row level security;

create index idx_avms_inspetor_id on public.avms (inspetor_id);
create index idx_avms_unidade_id on public.avms (unidade_id);
create index idx_avms_setor_id on public.avms (setor_id);

-- Definida aqui (não em 0003) porque depende de avms já existir: funções
-- "language sql" têm o corpo validado contra o catálogo na criação.
create or replace function public.is_inspetor_do_avm(p_avm_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.avms
    where id = p_avm_id
      and inspetor_id = auth.uid()
  )
$$;
