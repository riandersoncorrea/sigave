-- Cadeia de levantamento: tabelas "esqueleto" ligadas por levantamento_id,
-- com apenas os campos necessários agora (chaves, status, auditoria). Os
-- campos de negócio de diagnósticos/vegetação/infraestrutura/ocorrências
-- ficam para as Sprints 3 e 4. evidencias e validacoes recebem os campos
-- mínimos exigidos pela especificação mestre (ver comentários abaixo).

create table public.levantamentos (
  id uuid primary key default gen_random_uuid(),
  avm_id uuid not null references public.avms (id) on delete restrict,
  inspetor_id uuid not null references public.profiles (id) on delete restrict,
  -- Incluído agora (não adiado): a RLS precisa distinguir rascunho de
  -- enviado. Não existe máquina de estados completa nesta sprint (ver
  -- policies em 0008) — isso fica para as Sprints 5 e 6.
  status status_ciclo not null default 'EM_ANDAMENTO' check (status <> 'NAO_INICIADA'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.profiles (id) on delete set null,
  updated_by uuid references public.profiles (id) on delete set null
);

create trigger trg_levantamentos_updated_at
  before update on public.levantamentos
  for each row
  execute function public.set_updated_at();

alter table public.levantamentos enable row level security;

create index idx_levantamentos_avm_id on public.levantamentos (avm_id);
create index idx_levantamentos_inspetor_id on public.levantamentos (inspetor_id);

create table public.diagnosticos (
  id uuid primary key default gen_random_uuid(),
  levantamento_id uuid not null unique references public.levantamentos (id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.profiles (id) on delete set null,
  updated_by uuid references public.profiles (id) on delete set null
);

create trigger trg_diagnosticos_updated_at
  before update on public.diagnosticos
  for each row
  execute function public.set_updated_at();

alter table public.diagnosticos enable row level security;

create table public.vegetacao (
  id uuid primary key default gen_random_uuid(),
  levantamento_id uuid not null references public.levantamentos (id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.profiles (id) on delete set null,
  updated_by uuid references public.profiles (id) on delete set null
);

create trigger trg_vegetacao_updated_at
  before update on public.vegetacao
  for each row
  execute function public.set_updated_at();

alter table public.vegetacao enable row level security;
create index idx_vegetacao_levantamento_id on public.vegetacao (levantamento_id);

create table public.infraestrutura (
  id uuid primary key default gen_random_uuid(),
  levantamento_id uuid not null references public.levantamentos (id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.profiles (id) on delete set null,
  updated_by uuid references public.profiles (id) on delete set null
);

create trigger trg_infraestrutura_updated_at
  before update on public.infraestrutura
  for each row
  execute function public.set_updated_at();

alter table public.infraestrutura enable row level security;
create index idx_infraestrutura_levantamento_id on public.infraestrutura (levantamento_id);

create table public.ocorrencias (
  id uuid primary key default gen_random_uuid(),
  levantamento_id uuid not null references public.levantamentos (id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.profiles (id) on delete set null,
  updated_by uuid references public.profiles (id) on delete set null
);

create trigger trg_ocorrencias_updated_at
  before update on public.ocorrencias
  for each row
  execute function public.set_updated_at();

alter table public.ocorrencias enable row level security;
create index idx_ocorrencias_levantamento_id on public.ocorrencias (levantamento_id);

-- Campos exigidos explicitamente pela especificação mestre de fotografias:
-- identificação, AVM, levantamento, usuário, data, hora, tipo, sequência.
-- Bucket do Storage e o fluxo de upload ficam para a Sprint 4 — aqui só a
-- tabela de metadados.
create table public.evidencias (
  id uuid primary key default gen_random_uuid(), -- identificação
  avm_id uuid not null references public.avms (id) on delete restrict,
  levantamento_id uuid not null references public.levantamentos (id) on delete cascade,
  ocorrencia_id uuid references public.ocorrencias (id) on delete set null,
  usuario_id uuid not null references public.profiles (id) on delete restrict default auth.uid(),
  data_hora timestamptz not null default now(), -- data + hora
  tipo text,
  sequencia integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles (id) on delete set null
);

create trigger trg_evidencias_updated_at
  before update on public.evidencias
  for each row
  execute function public.set_updated_at();

alter table public.evidencias enable row level security;
create index idx_evidencias_avm_id on public.evidencias (avm_id);
create index idx_evidencias_levantamento_id on public.evidencias (levantamento_id);

-- Decisão do fiscal (aprovar/reprovar/solicitar complementação). O registro
-- da decisão está no escopo desta sprint; aplicar automaticamente a
-- consequência em levantamentos.status/avms.status NÃO está (Sprint 5/6).
-- Sem updated_at/updated_by: decisão de validação é histórico imutável.
create table public.validacoes (
  id uuid primary key default gen_random_uuid(),
  levantamento_id uuid not null references public.levantamentos (id) on delete cascade,
  fiscal_id uuid not null references public.profiles (id) on delete restrict default auth.uid(),
  acao validacao_acao not null,
  comentario text,
  created_at timestamptz not null default now()
);

alter table public.validacoes enable row level security;
create index idx_validacoes_levantamento_id on public.validacoes (levantamento_id);
