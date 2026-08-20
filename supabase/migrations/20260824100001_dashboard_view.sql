-- Sprint 7: dashboard e relatórios. avms.status é preenchido manualmente
-- pelo admin/fiscal no formulário (Sprint 2) e nunca é sincronizado por
-- nenhum gatilho — é dado decorativo, desacoplado do progresso real do
-- levantamento. Os cards/indicadores do dashboard precisam do estado real
-- do ciclo, que vive em levantamentos.status (a mesma fonte que já
-- alimenta o histórico da Sprint 5 e a decisão do fiscal da Sprint 6).
--
-- Esta view expõe, por AVM, o status do levantamento mais recente
-- (NAO_INICIADA quando não existe nenhum ainda) e os campos usados pelos
-- filtros/indicadores do dashboard, evitando N+1 consultas no frontend.
-- security_invoker=true é obrigatório: sem isso, uma view em Postgres não
-- reaplica a RLS das tabelas de origem para quem a consulta — um inspetor
-- veria AVMs de todo mundo em vez de só as suas.
create view public.avm_status_atual
with (security_invoker = true) as
select
  a.id as avm_id,
  a.id_avm,
  a.unidade_id,
  a.setor_id,
  a.classe_funcional,
  a.inspetor_id,
  coalesce(l.status, 'NAO_INICIADA'::status_ciclo) as status_atual,
  l.id as levantamento_id_atual,
  v.tipo as vegetacao_tipo_atual,
  d.meio_ambiente_gate as meio_ambiente_gate_atual,
  (
    select round(avg(nota))::smallint
    from unnest(array[
      d.condicao_vegetacao_nota,
      d.condicao_limpeza_nota,
      d.condicao_seguranca_nota,
      d.condicao_infraestrutura_nota,
      d.condicao_meio_ambiente_nota,
      d.condicao_acesso_nota,
      d.condicao_interferencia_operacional_nota
    ]) as nota
    where nota is not null
  ) as condicao_media_atual,
  (
    select count(*)
    from public.ocorrencias o
    where o.levantamento_id = l.id
      and o.criticidade in ('ALTA', 'CRITICA')
  ) as ocorrencias_criticas_count
from public.avms a
left join lateral (
  select id, status
  from public.levantamentos
  where avm_id = a.id
  order by created_at desc
  limit 1
) l on true
left join public.vegetacao v on v.levantamento_id = l.id
left join public.diagnosticos d on d.levantamento_id = l.id;

grant select on public.avm_status_atual to authenticated;
