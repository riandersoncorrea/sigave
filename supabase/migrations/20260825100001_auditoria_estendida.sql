-- Sprint 8: auditoria. audit_trigger_fn() (Sprint 1) já registra
-- usuário/data/hora e o snapshot completo do registro antes/depois em
-- avms/levantamentos/validacoes/profiles — reaproveitado aqui sem
-- alterações, só estendido para as tabelas onde o conteúdo do
-- levantamento (diagnóstico, vegetação, infraestrutura, ocorrências,
-- interferências, equipamentos, serviços, evidências) é de fato editado
-- ou apagado, o que ainda não gerava histórico. "Não apagar dados
-- críticos sem manter histórico" vale sobretudo para essas tabelas — são
-- as únicas com policy de DELETE (Sprint 4).

alter table public.audit_log
  add column motivo text;

create trigger trg_audit_diagnosticos
  after insert or update or delete on public.diagnosticos
  for each row
  execute function public.audit_trigger_fn();

create trigger trg_audit_vegetacao
  after insert or update or delete on public.vegetacao
  for each row
  execute function public.audit_trigger_fn();

create trigger trg_audit_infraestrutura
  after insert or update or delete on public.infraestrutura
  for each row
  execute function public.audit_trigger_fn();

create trigger trg_audit_ocorrencias
  after insert or update or delete on public.ocorrencias
  for each row
  execute function public.audit_trigger_fn();

create trigger trg_audit_interferencias
  after insert or update or delete on public.interferencias
  for each row
  execute function public.audit_trigger_fn();

create trigger trg_audit_equipamentos
  after insert or update or delete on public.equipamentos
  for each row
  execute function public.audit_trigger_fn();

create trigger trg_audit_servicos
  after insert or update or delete on public.servicos
  for each row
  execute function public.audit_trigger_fn();

create trigger trg_audit_evidencias
  after insert or update or delete on public.evidencias
  for each row
  execute function public.audit_trigger_fn();

-- "Registrar: usuário, data, hora, campo alterado, valor anterior, novo
-- valor, motivo": dados_antigos/dados_novos guardam o registro inteiro
-- (snapshot), não um diff por campo. Esta view expande cada linha de
-- audit_log em uma linha por campo que de fato mudou, comparando as duas
-- chaves via IS DISTINCT FROM (trata NULL corretamente e cobre INSERT —
-- dados_antigos nulo vira {} — e DELETE — dados_novos nulo vira {}).
-- updated_at é excluído de propósito: muda em toda escrita e não
-- representa uma mudança de negócio, só ruído.
create view public.audit_log_campos
with (security_invoker = true) as
select
  a.id as audit_log_id,
  a.tabela,
  a.registro_id,
  a.operacao,
  a.usuario_id,
  a.motivo,
  a.criado_em,
  chave.campo,
  a.dados_antigos -> chave.campo as valor_anterior,
  a.dados_novos -> chave.campo as valor_novo
from public.audit_log a
cross join lateral (
  select k as campo from jsonb_object_keys(coalesce(a.dados_antigos, '{}'::jsonb)) as k
  union
  select k from jsonb_object_keys(coalesce(a.dados_novos, '{}'::jsonb)) as k
) chave
where chave.campo <> 'updated_at'
  and (a.dados_antigos -> chave.campo) is distinct from (a.dados_novos -> chave.campo);

grant select on public.audit_log_campos to authenticated;
