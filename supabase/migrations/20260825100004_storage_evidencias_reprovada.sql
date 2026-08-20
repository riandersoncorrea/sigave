-- Sprint 8, revisão de segurança: encontrado durante a checagem de
-- "arquivos possuem política adequada" — a Sprint 5 estendeu
-- levantamento_editavel() para incluir REPROVADA (inspetor pode editar e
-- reenviar após reprovação), e todas as tabelas do levantamento foram
-- atualizadas para usar essa função, mas as policies de
-- storage.objects do bucket evidencias (Sprint 4) ficaram com a
-- condição antiga embutida (só EM_ANDAMENTO/NECESSITA_COMPLEMENTACAO) —
-- um inspetor corrigindo um levantamento reprovado conseguia editar
-- diagnóstico/vegetação/etc. mas não conseguia enviar ou remover fotos.
alter policy evidencias_storage_insert on storage.objects
  with check (
    bucket_id = 'evidencias'
    and exists (
      select 1
      from public.levantamentos l
      where l.id = (storage.foldername(name)) [3]::uuid
        and (
          public.is_admin()
          or (
            l.inspetor_id = auth.uid()
            and public.levantamento_editavel(l.status)
          )
        )
    )
  );

alter policy evidencias_storage_delete on storage.objects
  using (
    bucket_id = 'evidencias'
    and exists (
      select 1
      from public.levantamentos l
      where l.id = (storage.foldername(name)) [3]::uuid
        and (
          public.is_admin()
          or (
            l.inspetor_id = auth.uid()
            and public.levantamento_editavel(l.status)
          )
        )
    )
  );
