-- Sprint 5: "após envio, não permitir edição normal; só permitir editar de
-- novo se o fiscal solicitar complementação ou reprovar". As policies desde
-- a Sprint 1/3/4 já restringiam a escrita a EM_ANDAMENTO/
-- NECESSITA_COMPLEMENTACAO — faltava REPROVADA (que ainda não é alcançável
-- até a Sprint 6 automatizar a decisão do fiscal, mas a regra já fica
-- pronta). Centraliza a lista de "status editável" numa função, para não
-- precisar caçar N policies numa mudança futura.

create or replace function public.levantamento_editavel(p_status public.status_ciclo)
returns boolean
language sql
immutable
as $$
  select p_status in ('EM_ANDAMENTO', 'NECESSITA_COMPLEMENTACAO', 'REPROVADA')
$$;

-- levantamentos: agora também exige que o status ATUAL (não só o novo) já
-- esteja em um estado editável — sem isso, nada impedia reenviar um
-- levantamento já ENVIADA_VALIDACAO/APROVADA de volta para
-- ENVIADA_VALIDACAO via chamada direta à API.
alter policy levantamentos_update on public.levantamentos
  using (
    public.is_admin()
    or (
      public.user_perfil() = 'INSPETOR_SAPORE'
      and inspetor_id = auth.uid()
      and public.levantamento_editavel(status)
    )
  )
  with check (
    public.is_admin()
    or (
      public.user_perfil() = 'INSPETOR_SAPORE'
      and inspetor_id = auth.uid()
      and status not in ('APROVADA', 'REPROVADA')
    )
  );

-- diagnosticos
alter policy diagnosticos_insert on public.diagnosticos
  with check (
    public.is_admin()
    or exists (
      select 1 from public.levantamentos l
      where l.id = diagnosticos.levantamento_id
        and l.inspetor_id = auth.uid()
        and public.levantamento_editavel(l.status)
    )
  );

alter policy diagnosticos_update on public.diagnosticos
  using (
    public.is_admin()
    or exists (
      select 1 from public.levantamentos l
      where l.id = diagnosticos.levantamento_id
        and l.inspetor_id = auth.uid()
        and public.levantamento_editavel(l.status)
    )
  )
  with check (
    public.is_admin()
    or exists (
      select 1 from public.levantamentos l
      where l.id = diagnosticos.levantamento_id
        and l.inspetor_id = auth.uid()
        and public.levantamento_editavel(l.status)
    )
  );

-- vegetacao
alter policy vegetacao_insert on public.vegetacao
  with check (
    public.is_admin()
    or exists (
      select 1 from public.levantamentos l
      where l.id = vegetacao.levantamento_id
        and l.inspetor_id = auth.uid()
        and public.levantamento_editavel(l.status)
    )
  );

alter policy vegetacao_update on public.vegetacao
  using (
    public.is_admin()
    or exists (
      select 1 from public.levantamentos l
      where l.id = vegetacao.levantamento_id
        and l.inspetor_id = auth.uid()
        and public.levantamento_editavel(l.status)
    )
  )
  with check (
    public.is_admin()
    or exists (
      select 1 from public.levantamentos l
      where l.id = vegetacao.levantamento_id
        and l.inspetor_id = auth.uid()
        and public.levantamento_editavel(l.status)
    )
  );

-- infraestrutura
alter policy infraestrutura_insert on public.infraestrutura
  with check (
    public.is_admin()
    or exists (
      select 1 from public.levantamentos l
      where l.id = infraestrutura.levantamento_id
        and l.inspetor_id = auth.uid()
        and public.levantamento_editavel(l.status)
    )
  );

alter policy infraestrutura_update on public.infraestrutura
  using (
    public.is_admin()
    or exists (
      select 1 from public.levantamentos l
      where l.id = infraestrutura.levantamento_id
        and l.inspetor_id = auth.uid()
        and public.levantamento_editavel(l.status)
    )
  )
  with check (
    public.is_admin()
    or exists (
      select 1 from public.levantamentos l
      where l.id = infraestrutura.levantamento_id
        and l.inspetor_id = auth.uid()
        and public.levantamento_editavel(l.status)
    )
  );

-- ocorrencias
alter policy ocorrencias_insert on public.ocorrencias
  with check (
    public.is_admin()
    or exists (
      select 1 from public.levantamentos l
      where l.id = ocorrencias.levantamento_id
        and l.inspetor_id = auth.uid()
        and public.levantamento_editavel(l.status)
    )
  );

alter policy ocorrencias_update on public.ocorrencias
  using (
    public.is_admin()
    or exists (
      select 1 from public.levantamentos l
      where l.id = ocorrencias.levantamento_id
        and l.inspetor_id = auth.uid()
        and public.levantamento_editavel(l.status)
    )
  )
  with check (
    public.is_admin()
    or exists (
      select 1 from public.levantamentos l
      where l.id = ocorrencias.levantamento_id
        and l.inspetor_id = auth.uid()
        and public.levantamento_editavel(l.status)
    )
  );

alter policy ocorrencias_delete on public.ocorrencias
  using (
    public.is_admin()
    or exists (
      select 1 from public.levantamentos l
      where l.id = ocorrencias.levantamento_id
        and l.inspetor_id = auth.uid()
        and public.levantamento_editavel(l.status)
    )
  );

-- interferencias
alter policy interferencias_insert on public.interferencias
  with check (
    public.is_admin()
    or exists (
      select 1 from public.levantamentos l
      where l.id = interferencias.levantamento_id
        and l.inspetor_id = auth.uid()
        and public.levantamento_editavel(l.status)
    )
  );

alter policy interferencias_update on public.interferencias
  using (
    public.is_admin()
    or exists (
      select 1 from public.levantamentos l
      where l.id = interferencias.levantamento_id
        and l.inspetor_id = auth.uid()
        and public.levantamento_editavel(l.status)
    )
  )
  with check (
    public.is_admin()
    or exists (
      select 1 from public.levantamentos l
      where l.id = interferencias.levantamento_id
        and l.inspetor_id = auth.uid()
        and public.levantamento_editavel(l.status)
    )
  );

alter policy interferencias_delete on public.interferencias
  using (
    public.is_admin()
    or exists (
      select 1 from public.levantamentos l
      where l.id = interferencias.levantamento_id
        and l.inspetor_id = auth.uid()
        and public.levantamento_editavel(l.status)
    )
  );

-- equipamentos
alter policy equipamentos_insert on public.equipamentos
  with check (
    public.is_admin()
    or exists (
      select 1 from public.levantamentos l
      where l.id = equipamentos.levantamento_id
        and l.inspetor_id = auth.uid()
        and public.levantamento_editavel(l.status)
    )
  );

alter policy equipamentos_update on public.equipamentos
  using (
    public.is_admin()
    or exists (
      select 1 from public.levantamentos l
      where l.id = equipamentos.levantamento_id
        and l.inspetor_id = auth.uid()
        and public.levantamento_editavel(l.status)
    )
  )
  with check (
    public.is_admin()
    or exists (
      select 1 from public.levantamentos l
      where l.id = equipamentos.levantamento_id
        and l.inspetor_id = auth.uid()
        and public.levantamento_editavel(l.status)
    )
  );

alter policy equipamentos_delete on public.equipamentos
  using (
    public.is_admin()
    or exists (
      select 1 from public.levantamentos l
      where l.id = equipamentos.levantamento_id
        and l.inspetor_id = auth.uid()
        and public.levantamento_editavel(l.status)
    )
  );

-- servicos
alter policy servicos_insert on public.servicos
  with check (
    public.is_admin()
    or exists (
      select 1 from public.levantamentos l
      where l.id = servicos.levantamento_id
        and l.inspetor_id = auth.uid()
        and public.levantamento_editavel(l.status)
    )
  );

alter policy servicos_update on public.servicos
  using (
    public.is_admin()
    or exists (
      select 1 from public.levantamentos l
      where l.id = servicos.levantamento_id
        and l.inspetor_id = auth.uid()
        and public.levantamento_editavel(l.status)
    )
  )
  with check (
    public.is_admin()
    or exists (
      select 1 from public.levantamentos l
      where l.id = servicos.levantamento_id
        and l.inspetor_id = auth.uid()
        and public.levantamento_editavel(l.status)
    )
  );

alter policy servicos_delete on public.servicos
  using (
    public.is_admin()
    or exists (
      select 1 from public.levantamentos l
      where l.id = servicos.levantamento_id
        and l.inspetor_id = auth.uid()
        and public.levantamento_editavel(l.status)
    )
  );

-- evidencias (mantém a exigência de usuario_id = auth.uid() no insert/update)
alter policy evidencias_insert on public.evidencias
  with check (
    usuario_id = auth.uid()
    and (
      public.is_admin()
      or exists (
        select 1 from public.levantamentos l
        where l.id = evidencias.levantamento_id
          and l.inspetor_id = auth.uid()
          and public.levantamento_editavel(l.status)
      )
    )
  );

alter policy evidencias_update on public.evidencias
  using (
    public.is_admin()
    or exists (
      select 1 from public.levantamentos l
      where l.id = evidencias.levantamento_id
        and l.inspetor_id = auth.uid()
        and public.levantamento_editavel(l.status)
    )
  )
  with check (
    usuario_id = auth.uid()
    and (
      public.is_admin()
      or exists (
        select 1 from public.levantamentos l
        where l.id = evidencias.levantamento_id
          and l.inspetor_id = auth.uid()
          and public.levantamento_editavel(l.status)
      )
    )
  );

alter policy evidencias_delete on public.evidencias
  using (
    public.is_admin()
    or exists (
      select 1 from public.levantamentos l
      where l.id = evidencias.levantamento_id
        and l.inspetor_id = auth.uid()
        and public.levantamento_editavel(l.status)
    )
  );
