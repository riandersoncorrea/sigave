-- Sprint 8: /admin/usuarios precisa alterar perfil/ativo de um usuário e,
-- quando o admin informar, registrar o motivo no audit_log. audit_log é
-- populado por gatilho (não por insert da aplicação — ver 0007), então o
-- único jeito de "passar" um motivo até o gatilho é por uma variável de
-- sessão (set_config local, válida só na transação atual): funciona
-- porque esta função faz o set_config e o UPDATE na mesma chamada, logo
-- na mesma transação — duas chamadas PostgREST separadas não
-- funcionariam, cada uma abre sua própria transação.
create or replace function public.audit_trigger_fn()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.audit_log (tabela, registro_id, operacao, dados_antigos, dados_novos, usuario_id, motivo)
  values (
    TG_TABLE_NAME,
    coalesce((new).id, (old).id),
    TG_OP,
    case when TG_OP <> 'INSERT' then to_jsonb(old) end,
    case when TG_OP <> 'DELETE' then to_jsonb(new) end,
    auth.uid(),
    nullif(current_setting('app.audit_motivo', true), '')
  );
  return coalesce(new, old);
end;
$$;

-- language plpgsql (não sql) e sem security definer de propósito: a
-- checagem is_admin() aqui é só uma mensagem de erro mais clara — quem
-- realmente impede um não-admin de alterar perfil/ativo é a RLS
-- (profiles_update) e o gatilho trg_prevent_self_role_escalation, que já
-- existem desde a Sprint 1 e continuam valendo (a função roda como
-- invoker, então a escrita abaixo passa pelos dois mesmo assim).
create or replace function public.atualizar_perfil_usuario(
  p_usuario_id uuid,
  p_perfil public.perfil_usuario,
  p_ativo boolean,
  p_motivo text default null
)
returns public.profiles
language plpgsql
as $$
declare
  v_perfil public.profiles;
begin
  if not public.is_admin() then
    raise exception 'Apenas administradores podem alterar perfil de usuário.';
  end if;

  perform set_config('app.audit_motivo', coalesce(p_motivo, ''), true);

  update public.profiles
  set perfil = p_perfil, ativo = p_ativo
  where id = p_usuario_id
  returning * into v_perfil;

  perform set_config('app.audit_motivo', '', true);

  if v_perfil.id is null then
    raise exception 'Usuário não encontrado.';
  end if;

  return v_perfil;
end;
$$;

grant execute on function public.atualizar_perfil_usuario(uuid, public.perfil_usuario, boolean, text) to authenticated;
