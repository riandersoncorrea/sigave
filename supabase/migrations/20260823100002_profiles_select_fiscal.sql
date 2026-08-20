-- Corrige uma lacuna pré-existente (desde a Sprint 1): profiles_select só
-- permitia ver o próprio perfil ou, para admin, todos. Isso já quebrava a
-- coluna/filtro "Inspetor" da listagem de AVMs (Sprint 2) para o fiscal —
-- só ficou visível agora ao testar o filtro de Inspetor da fila de
-- validação (Sprint 6), que depende do mesmo join. Fiscal já enxerga
-- avms/levantamentos de qualquer inspetor (somente leitura); nome/e-mail
-- do inspetor não é informação mais sensível que isso.
alter policy profiles_select on public.profiles
  using (
    id = auth.uid()
    or public.is_admin()
    or public.user_perfil() = 'FISCAL_VALE'
  );
