-- Log de auditoria genérico, populado por gatilho (não por inserts da
-- aplicação): um gatilho dispara não importa qual cliente fez a escrita
-- (frontend, SQL Editor, script futuro), então não pode ser esquecido —
-- o mesmo princípio de "nunca confiar somente no frontend", aplicado à
-- auditoria em vez do controle de acesso.

create table public.audit_log (
  id uuid primary key default gen_random_uuid(),
  tabela text not null,
  registro_id uuid not null,
  operacao text not null check (operacao in ('INSERT', 'UPDATE', 'DELETE')),
  dados_antigos jsonb,
  dados_novos jsonb,
  usuario_id uuid references public.profiles (id) on delete set null,
  criado_em timestamptz not null default now()
);

alter table public.audit_log enable row level security;
create index idx_audit_log_tabela_registro on public.audit_log (tabela, registro_id);

-- security definer é obrigatório: audit_log não terá policy de INSERT para
-- ninguém (0008), então um gatilho sem definer falharia em toda escrita
-- feita por um usuário não-admin.
create or replace function public.audit_trigger_fn()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.audit_log (tabela, registro_id, operacao, dados_antigos, dados_novos, usuario_id)
  values (
    TG_TABLE_NAME,
    coalesce((new).id, (old).id),
    TG_OP,
    case when TG_OP <> 'INSERT' then to_jsonb(old) end,
    case when TG_OP <> 'DELETE' then to_jsonb(new) end,
    auth.uid()
  );
  return coalesce(new, old);
end;
$$;

create trigger trg_audit_avms
  after insert or update or delete on public.avms
  for each row
  execute function public.audit_trigger_fn();

create trigger trg_audit_levantamentos
  after insert or update or delete on public.levantamentos
  for each row
  execute function public.audit_trigger_fn();

create trigger trg_audit_validacoes
  after insert or update or delete on public.validacoes
  for each row
  execute function public.audit_trigger_fn();

-- Alterações de perfil/ativo são sensíveis a escalonamento de privilégio, e
-- todo o modelo de segurança desta sprint depende de "quem mudou o papel de
-- quem e quando" — por isso profiles entra na auditoria mesmo não estando
-- na lista literal do documento (avms, levantamentos, validacoes).
create trigger trg_audit_profiles
  after update on public.profiles
  for each row
  execute function public.audit_trigger_fn();
