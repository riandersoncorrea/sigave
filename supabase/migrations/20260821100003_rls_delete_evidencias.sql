-- evidencias nunca ganhou policy de DELETE (a Sprint 1 previu
-- select/insert/update; a Sprint 3 corrigiu esse mesmo esquecimento para
-- ocorrencias/interferencias/equipamentos/servicos, mas evidencias ainda
-- não existia como funcionalidade). A Sprint 4 pede explicitamente
-- "excluir antes do envio".

grant delete on public.evidencias to authenticated;

create policy evidencias_delete on public.evidencias
  for delete
  using (
    public.is_admin()
    or exists (
      select 1
      from public.levantamentos l
      where l.id = evidencias.levantamento_id
        and l.inspetor_id = auth.uid()
        and l.status in ('EM_ANDAMENTO', 'NECESSITA_COMPLEMENTACAO')
    )
  );
