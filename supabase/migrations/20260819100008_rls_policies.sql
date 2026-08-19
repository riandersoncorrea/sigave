-- Políticas de RLS de todo o schema, consolidadas em um único arquivo para
-- permitir revisão completa do modelo de permissões em um só lugar. Postgres
-- verifica GRANTs antes de avaliar RLS — tabelas criadas via SQL puro não
-- recebem privilégios para authenticated/anon automaticamente, por isso os
-- GRANTs abaixo são obrigatórios. anon não recebe nenhum grant: a aplicação
-- não tem dado público.

grant usage on schema public to authenticated;

grant select, update on public.profiles to authenticated;
grant select, insert, update, delete on public.unidades to authenticated;
grant select, insert, update, delete on public.setores to authenticated;
grant select, insert, update, delete on public.avms to authenticated;
grant select, insert, update on public.levantamentos to authenticated;
grant select, insert, update on public.diagnosticos to authenticated;
grant select, insert, update on public.vegetacao to authenticated;
grant select, insert, update on public.infraestrutura to authenticated;
grant select, insert, update on public.ocorrencias to authenticated;
grant select, insert, update on public.evidencias to authenticated;
grant select, insert on public.validacoes to authenticated;
grant select on public.audit_log to authenticated;

-- ============================================================
-- profiles
-- ============================================================

create policy profiles_select on public.profiles
  for select
  using (id = auth.uid() or public.is_admin());

create policy profiles_update on public.profiles
  for update
  using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());
-- Sem policy de insert/delete: linhas só nascem via trg_on_auth_user_created
-- (0002). Colunas perfil/ativo são protegidas por
-- trg_prevent_self_role_escalation (0002), não por esta policy.

-- ============================================================
-- unidades / setores
-- ============================================================

create policy unidades_select on public.unidades
  for select
  using (public.user_perfil() is not null);

create policy unidades_write on public.unidades
  for all
  using (public.is_admin())
  with check (public.is_admin());

create policy setores_select on public.setores
  for select
  using (public.user_perfil() is not null);

create policy setores_write on public.setores
  for all
  using (public.is_admin())
  with check (public.is_admin());

-- ============================================================
-- avms
-- ============================================================

create policy avms_select on public.avms
  for select
  using (
    public.is_admin()
    or public.user_perfil() = 'FISCAL_VALE'
    or (public.user_perfil() = 'INSPETOR_SAPORE' and inspetor_id = auth.uid())
  );

create policy avms_insert on public.avms
  for insert
  with check (public.is_admin());

create policy avms_update on public.avms
  for update
  using (public.is_admin())
  with check (public.is_admin());

create policy avms_delete on public.avms
  for delete
  using (public.is_admin());

-- ============================================================
-- levantamentos
-- ============================================================

create policy levantamentos_select on public.levantamentos
  for select
  using (
    public.is_admin()
    or public.user_perfil() = 'FISCAL_VALE'
    or (public.user_perfil() = 'INSPETOR_SAPORE' and inspetor_id = auth.uid())
  );

create policy levantamentos_insert on public.levantamentos
  for insert
  with check (
    public.is_admin()
    or (
      public.user_perfil() = 'INSPETOR_SAPORE'
      and inspetor_id = auth.uid()
      and public.is_inspetor_do_avm(avm_id)
    )
  );

-- Único mecanismo de "trilho de segurança" de fluxo desta sprint: o
-- inspetor não pode se auto-aprovar/reprovar. Não é uma máquina de estados
-- completa (isso é Sprint 5/6) — apenas impede o caso mais óbvio de abuso.
create policy levantamentos_update on public.levantamentos
  for update
  using (
    public.is_admin()
    or (public.user_perfil() = 'INSPETOR_SAPORE' and inspetor_id = auth.uid())
  )
  with check (
    public.is_admin()
    or (
      public.user_perfil() = 'INSPETOR_SAPORE'
      and inspetor_id = auth.uid()
      and status not in ('APROVADA', 'REPROVADA')
    )
  );
-- Sem policy de delete: histórico de levantamento não é apagável, nem por
-- admin, nesta sprint. Sem policy de update para FISCAL_VALE: a única
-- superfície de escrita do fiscal é validacoes (abaixo).

-- ============================================================
-- diagnosticos / vegetacao / infraestrutura / ocorrencias
-- (mesmo padrão: visibilidade e escrita passam por levantamentos)
-- ============================================================

create policy diagnosticos_select on public.diagnosticos
  for select
  using (
    exists (
      select 1
      from public.levantamentos l
      where l.id = diagnosticos.levantamento_id
        and (
          public.is_admin()
          or public.user_perfil() = 'FISCAL_VALE'
          or (public.user_perfil() = 'INSPETOR_SAPORE' and l.inspetor_id = auth.uid())
        )
    )
  );

create policy diagnosticos_insert on public.diagnosticos
  for insert
  with check (
    public.is_admin()
    or exists (
      select 1
      from public.levantamentos l
      where l.id = diagnosticos.levantamento_id
        and l.inspetor_id = auth.uid()
        and l.status in ('EM_ANDAMENTO', 'NECESSITA_COMPLEMENTACAO')
    )
  );

create policy diagnosticos_update on public.diagnosticos
  for update
  using (
    public.is_admin()
    or exists (
      select 1
      from public.levantamentos l
      where l.id = diagnosticos.levantamento_id
        and l.inspetor_id = auth.uid()
        and l.status in ('EM_ANDAMENTO', 'NECESSITA_COMPLEMENTACAO')
    )
  )
  with check (
    public.is_admin()
    or exists (
      select 1
      from public.levantamentos l
      where l.id = diagnosticos.levantamento_id
        and l.inspetor_id = auth.uid()
        and l.status in ('EM_ANDAMENTO', 'NECESSITA_COMPLEMENTACAO')
    )
  );

create policy vegetacao_select on public.vegetacao
  for select
  using (
    exists (
      select 1
      from public.levantamentos l
      where l.id = vegetacao.levantamento_id
        and (
          public.is_admin()
          or public.user_perfil() = 'FISCAL_VALE'
          or (public.user_perfil() = 'INSPETOR_SAPORE' and l.inspetor_id = auth.uid())
        )
    )
  );

create policy vegetacao_insert on public.vegetacao
  for insert
  with check (
    public.is_admin()
    or exists (
      select 1
      from public.levantamentos l
      where l.id = vegetacao.levantamento_id
        and l.inspetor_id = auth.uid()
        and l.status in ('EM_ANDAMENTO', 'NECESSITA_COMPLEMENTACAO')
    )
  );

create policy vegetacao_update on public.vegetacao
  for update
  using (
    public.is_admin()
    or exists (
      select 1
      from public.levantamentos l
      where l.id = vegetacao.levantamento_id
        and l.inspetor_id = auth.uid()
        and l.status in ('EM_ANDAMENTO', 'NECESSITA_COMPLEMENTACAO')
    )
  )
  with check (
    public.is_admin()
    or exists (
      select 1
      from public.levantamentos l
      where l.id = vegetacao.levantamento_id
        and l.inspetor_id = auth.uid()
        and l.status in ('EM_ANDAMENTO', 'NECESSITA_COMPLEMENTACAO')
    )
  );

create policy infraestrutura_select on public.infraestrutura
  for select
  using (
    exists (
      select 1
      from public.levantamentos l
      where l.id = infraestrutura.levantamento_id
        and (
          public.is_admin()
          or public.user_perfil() = 'FISCAL_VALE'
          or (public.user_perfil() = 'INSPETOR_SAPORE' and l.inspetor_id = auth.uid())
        )
    )
  );

create policy infraestrutura_insert on public.infraestrutura
  for insert
  with check (
    public.is_admin()
    or exists (
      select 1
      from public.levantamentos l
      where l.id = infraestrutura.levantamento_id
        and l.inspetor_id = auth.uid()
        and l.status in ('EM_ANDAMENTO', 'NECESSITA_COMPLEMENTACAO')
    )
  );

create policy infraestrutura_update on public.infraestrutura
  for update
  using (
    public.is_admin()
    or exists (
      select 1
      from public.levantamentos l
      where l.id = infraestrutura.levantamento_id
        and l.inspetor_id = auth.uid()
        and l.status in ('EM_ANDAMENTO', 'NECESSITA_COMPLEMENTACAO')
    )
  )
  with check (
    public.is_admin()
    or exists (
      select 1
      from public.levantamentos l
      where l.id = infraestrutura.levantamento_id
        and l.inspetor_id = auth.uid()
        and l.status in ('EM_ANDAMENTO', 'NECESSITA_COMPLEMENTACAO')
    )
  );

create policy ocorrencias_select on public.ocorrencias
  for select
  using (
    exists (
      select 1
      from public.levantamentos l
      where l.id = ocorrencias.levantamento_id
        and (
          public.is_admin()
          or public.user_perfil() = 'FISCAL_VALE'
          or (public.user_perfil() = 'INSPETOR_SAPORE' and l.inspetor_id = auth.uid())
        )
    )
  );

create policy ocorrencias_insert on public.ocorrencias
  for insert
  with check (
    public.is_admin()
    or exists (
      select 1
      from public.levantamentos l
      where l.id = ocorrencias.levantamento_id
        and l.inspetor_id = auth.uid()
        and l.status in ('EM_ANDAMENTO', 'NECESSITA_COMPLEMENTACAO')
    )
  );

create policy ocorrencias_update on public.ocorrencias
  for update
  using (
    public.is_admin()
    or exists (
      select 1
      from public.levantamentos l
      where l.id = ocorrencias.levantamento_id
        and l.inspetor_id = auth.uid()
        and l.status in ('EM_ANDAMENTO', 'NECESSITA_COMPLEMENTACAO')
    )
  )
  with check (
    public.is_admin()
    or exists (
      select 1
      from public.levantamentos l
      where l.id = ocorrencias.levantamento_id
        and l.inspetor_id = auth.uid()
        and l.status in ('EM_ANDAMENTO', 'NECESSITA_COMPLEMENTACAO')
    )
  );

-- ============================================================
-- evidencias (mesmo padrão de visibilidade; escrita também exige
-- usuario_id = auth.uid(), para que ninguém atribua uma foto a outra
-- pessoa)
-- ============================================================

create policy evidencias_select on public.evidencias
  for select
  using (
    exists (
      select 1
      from public.levantamentos l
      where l.id = evidencias.levantamento_id
        and (
          public.is_admin()
          or public.user_perfil() = 'FISCAL_VALE'
          or (public.user_perfil() = 'INSPETOR_SAPORE' and l.inspetor_id = auth.uid())
        )
    )
  );

create policy evidencias_insert on public.evidencias
  for insert
  with check (
    usuario_id = auth.uid()
    and (
      public.is_admin()
      or exists (
        select 1
        from public.levantamentos l
        where l.id = evidencias.levantamento_id
          and l.inspetor_id = auth.uid()
          and l.status in ('EM_ANDAMENTO', 'NECESSITA_COMPLEMENTACAO')
      )
    )
  );

create policy evidencias_update on public.evidencias
  for update
  using (
    public.is_admin()
    or exists (
      select 1
      from public.levantamentos l
      where l.id = evidencias.levantamento_id
        and l.inspetor_id = auth.uid()
        and l.status in ('EM_ANDAMENTO', 'NECESSITA_COMPLEMENTACAO')
    )
  )
  with check (
    usuario_id = auth.uid()
    and (
      public.is_admin()
      or exists (
        select 1
        from public.levantamentos l
        where l.id = evidencias.levantamento_id
          and l.inspetor_id = auth.uid()
          and l.status in ('EM_ANDAMENTO', 'NECESSITA_COMPLEMENTACAO')
      )
    )
  );

-- ============================================================
-- validacoes
-- ============================================================

create policy validacoes_select on public.validacoes
  for select
  using (
    public.is_admin()
    or public.user_perfil() = 'FISCAL_VALE'
    or exists (
      select 1
      from public.levantamentos l
      where l.id = validacoes.levantamento_id
        and l.inspetor_id = auth.uid()
    )
  );

create policy validacoes_insert on public.validacoes
  for insert
  with check (
    public.is_admin()
    or (
      public.user_perfil() = 'FISCAL_VALE'
      and fiscal_id = auth.uid()
      and exists (
        select 1
        from public.levantamentos l
        where l.id = validacoes.levantamento_id
          and l.status = 'ENVIADA_VALIDACAO'
      )
    )
  );
-- Sem policy de update/delete: decisão de validação é histórico imutável.

-- ============================================================
-- audit_log
-- ============================================================

create policy audit_log_select on public.audit_log
  for select
  using (public.is_admin());
-- Sem policy de insert/update/delete para ninguém: só o gatilho
-- security definer (0007) escreve aqui.
