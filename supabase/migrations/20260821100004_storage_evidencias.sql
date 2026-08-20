-- Bucket privado para as fotografias do levantamento. Estrutura de path:
-- avm/{id_avm}/{id_levantamento}/{arquivo} — id_levantamento é o 3º
-- segmento de pasta (storage.foldername(name)[3]) e é o que a RLS usa para
-- decidir acesso, pelo mesmo padrão já usado nas tabelas do levantamento
-- (join em levantamentos, admin sempre, fiscal só leitura, inspetor dono
-- enquanto o levantamento está em EM_ANDAMENTO/NECESSITA_COMPLEMENTACAO).

insert into storage.buckets (id, name, public)
values ('evidencias', 'evidencias', false)
on conflict (id) do nothing;

create policy evidencias_storage_select on storage.objects
  for select
  using (
    bucket_id = 'evidencias'
    and exists (
      select 1
      from public.levantamentos l
      where l.id = (storage.foldername(name)) [3]::uuid
        and (
          public.is_admin()
          or public.user_perfil() = 'FISCAL_VALE'
          or l.inspetor_id = auth.uid()
        )
    )
  );

create policy evidencias_storage_insert on storage.objects
  for insert
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
            and l.status in ('EM_ANDAMENTO', 'NECESSITA_COMPLEMENTACAO')
          )
        )
    )
  );

create policy evidencias_storage_delete on storage.objects
  for delete
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
            and l.status in ('EM_ANDAMENTO', 'NECESSITA_COMPLEMENTACAO')
          )
        )
    )
  );
