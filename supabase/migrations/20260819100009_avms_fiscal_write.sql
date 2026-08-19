-- Sprint 2 amplia a permissão de avms: a especificação da Sprint 2 define
-- que ADMINISTRADOR e FISCAL_VALE podem cadastrar, editar e atribuir
-- inspetor em AVMs (a Sprint 1 havia deixado fiscal como somente leitura,
-- já que nenhuma dessas ações fazia parte do escopo até aqui). DELETE
-- continua restrito a ADMINISTRADOR — não foi mencionado como permissão do
-- fiscal.

alter policy avms_insert on public.avms
  with check (public.is_admin() or public.user_perfil() = 'FISCAL_VALE');

alter policy avms_update on public.avms
  using (public.is_admin() or public.user_perfil() = 'FISCAL_VALE')
  with check (public.is_admin() or public.user_perfil() = 'FISCAL_VALE');
