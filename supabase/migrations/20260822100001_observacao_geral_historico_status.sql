-- Sprint 5: campo de observação geral (checklist final antes do envio) e
-- histórico de status do levantamento. O histórico é populado por gatilho
-- (não por insert da aplicação) para nunca poder ser esquecido e para
-- capturar automaticamente qualquer transição futura — inclusive as que a
-- Sprint 6 (validação do fiscal) vai introduzir mais adiante. "Não apagar
-- dados antigos": cada transição vira uma linha nova, nunca sobrescrita.

alter table public.diagnosticos
  add column observacao_geral text;

create table public.levantamento_historico_status (
  id uuid primary key default gen_random_uuid(),
  levantamento_id uuid not null references public.levantamentos (id) on delete cascade,
  usuario_id uuid references public.profiles (id) on delete set null,
  status_anterior status_ciclo,
  status_novo status_ciclo not null,
  criado_em timestamptz not null default now()
);

alter table public.levantamento_historico_status enable row level security;
create index idx_historico_status_levantamento_id
  on public.levantamento_historico_status (levantamento_id);

create or replace function public.registrar_historico_status_levantamento()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if TG_OP = 'UPDATE' and old.status is distinct from new.status then
    insert into public.levantamento_historico_status
      (levantamento_id, usuario_id, status_anterior, status_novo)
    values (new.id, auth.uid(), old.status, new.status);
  end if;
  return new;
end;
$$;

create trigger trg_levantamento_historico_status
  after update on public.levantamentos
  for each row
  execute function public.registrar_historico_status_levantamento();

grant select on public.levantamento_historico_status to authenticated;

create policy levantamento_historico_status_select
  on public.levantamento_historico_status
  for select
  using (
    exists (
      select 1
      from public.levantamentos l
      where l.id = levantamento_historico_status.levantamento_id
        and (
          public.is_admin()
          or public.user_perfil() = 'FISCAL_VALE'
          or l.inspetor_id = auth.uid()
        )
    )
  );
-- Sem policy de insert/update/delete: só o gatilho security definer escreve
-- aqui, e o histórico é imutável.
