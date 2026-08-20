-- RLS para as 3 tabelas novas, no mesmo padrão já usado para
-- vegetacao/infraestrutura/ocorrencias (migration 0008): visibilidade via
-- join em levantamentos (admin vê tudo, fiscal lê tudo, inspetor só o seu),
-- escrita restrita ao inspetor dono do levantamento enquanto ele está em
-- EM_ANDAMENTO/NECESSITA_COMPLEMENTACAO (ou admin, sempre).

grant select, insert, update on public.interferencias to authenticated;
grant select, insert, update on public.equipamentos to authenticated;
grant select, insert, update on public.servicos to authenticated;

create policy interferencias_select on public.interferencias
  for select
  using (
    exists (
      select 1
      from public.levantamentos l
      where l.id = interferencias.levantamento_id
        and (
          public.is_admin()
          or public.user_perfil() = 'FISCAL_VALE'
          or (public.user_perfil() = 'INSPETOR_SAPORE' and l.inspetor_id = auth.uid())
        )
    )
  );

create policy interferencias_insert on public.interferencias
  for insert
  with check (
    public.is_admin()
    or exists (
      select 1
      from public.levantamentos l
      where l.id = interferencias.levantamento_id
        and l.inspetor_id = auth.uid()
        and l.status in ('EM_ANDAMENTO', 'NECESSITA_COMPLEMENTACAO')
    )
  );

create policy interferencias_update on public.interferencias
  for update
  using (
    public.is_admin()
    or exists (
      select 1
      from public.levantamentos l
      where l.id = interferencias.levantamento_id
        and l.inspetor_id = auth.uid()
        and l.status in ('EM_ANDAMENTO', 'NECESSITA_COMPLEMENTACAO')
    )
  )
  with check (
    public.is_admin()
    or exists (
      select 1
      from public.levantamentos l
      where l.id = interferencias.levantamento_id
        and l.inspetor_id = auth.uid()
        and l.status in ('EM_ANDAMENTO', 'NECESSITA_COMPLEMENTACAO')
    )
  );

create policy equipamentos_select on public.equipamentos
  for select
  using (
    exists (
      select 1
      from public.levantamentos l
      where l.id = equipamentos.levantamento_id
        and (
          public.is_admin()
          or public.user_perfil() = 'FISCAL_VALE'
          or (public.user_perfil() = 'INSPETOR_SAPORE' and l.inspetor_id = auth.uid())
        )
    )
  );

create policy equipamentos_insert on public.equipamentos
  for insert
  with check (
    public.is_admin()
    or exists (
      select 1
      from public.levantamentos l
      where l.id = equipamentos.levantamento_id
        and l.inspetor_id = auth.uid()
        and l.status in ('EM_ANDAMENTO', 'NECESSITA_COMPLEMENTACAO')
    )
  );

create policy equipamentos_update on public.equipamentos
  for update
  using (
    public.is_admin()
    or exists (
      select 1
      from public.levantamentos l
      where l.id = equipamentos.levantamento_id
        and l.inspetor_id = auth.uid()
        and l.status in ('EM_ANDAMENTO', 'NECESSITA_COMPLEMENTACAO')
    )
  )
  with check (
    public.is_admin()
    or exists (
      select 1
      from public.levantamentos l
      where l.id = equipamentos.levantamento_id
        and l.inspetor_id = auth.uid()
        and l.status in ('EM_ANDAMENTO', 'NECESSITA_COMPLEMENTACAO')
    )
  );

create policy servicos_select on public.servicos
  for select
  using (
    exists (
      select 1
      from public.levantamentos l
      where l.id = servicos.levantamento_id
        and (
          public.is_admin()
          or public.user_perfil() = 'FISCAL_VALE'
          or (public.user_perfil() = 'INSPETOR_SAPORE' and l.inspetor_id = auth.uid())
        )
    )
  );

create policy servicos_insert on public.servicos
  for insert
  with check (
    public.is_admin()
    or exists (
      select 1
      from public.levantamentos l
      where l.id = servicos.levantamento_id
        and l.inspetor_id = auth.uid()
        and l.status in ('EM_ANDAMENTO', 'NECESSITA_COMPLEMENTACAO')
    )
  );

create policy servicos_update on public.servicos
  for update
  using (
    public.is_admin()
    or exists (
      select 1
      from public.levantamentos l
      where l.id = servicos.levantamento_id
        and l.inspetor_id = auth.uid()
        and l.status in ('EM_ANDAMENTO', 'NECESSITA_COMPLEMENTACAO')
    )
  )
  with check (
    public.is_admin()
    or exists (
      select 1
      from public.levantamentos l
      where l.id = servicos.levantamento_id
        and l.inspetor_id = auth.uid()
        and l.status in ('EM_ANDAMENTO', 'NECESSITA_COMPLEMENTACAO')
    )
  );
