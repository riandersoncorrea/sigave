-- Sprint 3: campos de negócio de vegetacao (etapa "Vegetação" do wizard).
-- Campos e opções vieram explicitamente da especificação da Sprint 3 — não
-- são invenção. 1:1 por levantamento (a etapa não foi descrita como
-- "múltipla" como Interferências/Equipamentos/Serviços).

alter table public.vegetacao
  add column tipo text,
  add column vegetacao_predominante text,
  add column especie text,
  add column cobertura text,
  add column altura text,
  add column densidade text,
  add column velocidade_crescimento text,
  add column uniformidade text,
  add column invasoras text,
  add column arvores text,
  add column observacoes text;

alter table public.vegetacao
  add constraint vegetacao_levantamento_id_key unique (levantamento_id);
