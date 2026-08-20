-- Sprint 3 introduz "remover item" nas etapas repetíveis (Interferências,
-- Equipamentos, Serviços, Ocorrências) — nenhuma delete policy existia
-- ainda para essas tabelas (a Sprint 1 só previu select/insert/update).
-- Mesmo padrão de escrita das demais: admin sempre, ou o inspetor dono
-- enquanto o levantamento está em EM_ANDAMENTO/NECESSITA_COMPLEMENTACAO.

grant delete on public.ocorrencias to authenticated;
grant delete on public.interferencias to authenticated;
grant delete on public.equipamentos to authenticated;
grant delete on public.servicos to authenticated;

create policy ocorrencias_delete on public.ocorrencias
  for delete
  using (
    public.is_admin()
    or exists (
      select 1
      from public.levantamentos l
      where l.id = ocorrencias.levantamento_id
        and l.inspetor_id = auth.uid()
        and l.status in ('EM_ANDAMENTO', 'NECESSITA_COMPLEMENTACAO')
    )
  );

create policy interferencias_delete on public.interferencias
  for delete
  using (
    public.is_admin()
    or exists (
      select 1
      from public.levantamentos l
      where l.id = interferencias.levantamento_id
        and l.inspetor_id = auth.uid()
        and l.status in ('EM_ANDAMENTO', 'NECESSITA_COMPLEMENTACAO')
    )
  );

create policy equipamentos_delete on public.equipamentos
  for delete
  using (
    public.is_admin()
    or exists (
      select 1
      from public.levantamentos l
      where l.id = equipamentos.levantamento_id
        and l.inspetor_id = auth.uid()
        and l.status in ('EM_ANDAMENTO', 'NECESSITA_COMPLEMENTACAO')
    )
  );

create policy servicos_delete on public.servicos
  for delete
  using (
    public.is_admin()
    or exists (
      select 1
      from public.levantamentos l
      where l.id = servicos.levantamento_id
        and l.inspetor_id = auth.uid()
        and l.status in ('EM_ANDAMENTO', 'NECESSITA_COMPLEMENTACAO')
    )
  );
