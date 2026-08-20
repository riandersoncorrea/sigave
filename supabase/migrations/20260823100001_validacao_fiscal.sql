-- Sprint 6: validação do fiscal. A tabela validacoes e a policy de insert
-- (status = ENVIADA_VALIDACAO) já existem desde a Sprint 1; faltava exigir
-- o motivo/complemento nas decisões que não são aprovação, e aplicar a
-- consequência da decisão em levantamentos.status — a Sprint 1 registrava
-- a decisão como histórico isolado de propósito (ver comentário da
-- migration 0006), deixando a automação para esta sprint.

-- "REPROVAR exige motivo" / "SOLICITAR COMPLEMENTAÇÃO exige 'o que precisa
-- ser corrigido?'": mesma coluna comentario, obrigatória sempre que a ação
-- não for aprovação.
alter table public.validacoes
  add constraint validacoes_comentario_obrigatorio
  check (
    acao = 'APROVADO'
    or (comentario is not null and length(trim(comentario)) > 0)
  );

-- Aplica a decisão do fiscal ao levantamento. security definer é
-- obrigatório: a policy levantamentos_update não dá ao fiscal nenhuma
-- forma de escrever em levantamentos (sua única superfície de escrita é
-- validacoes) — o gatilho roda com o dono da função (postgres), contorna a
-- RLS do mesmo jeito que registrar_historico_status_levantamento (Sprint
-- 5), e o UPDATE resultante já dispara trg_levantamento_historico_status
-- sozinho, sem duplicar a gravação de histórico aqui.
create or replace function public.aplicar_decisao_validacao()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.levantamentos
  set
    status = case new.acao
      when 'APROVADO' then 'APROVADA'
      when 'REPROVADO' then 'REPROVADA'
      when 'SOLICITADA_COMPLEMENTACAO' then 'NECESSITA_COMPLEMENTACAO'
    end::status_ciclo,
    updated_by = new.fiscal_id
  where id = new.levantamento_id;

  return new;
end;
$$;

create trigger trg_aplicar_decisao_validacao
  after insert on public.validacoes
  for each row
  execute function public.aplicar_decisao_validacao();
