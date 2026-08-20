-- Sprint 3: campos de negócio de infraestrutura. Nomes de campo vieram da
-- especificação da Sprint 3; o catálogo de "tipo" não veio de documento
-- algum (não existe) e é uma proposta do time de desenvolvimento — ver
-- src/constants/levantamento.ts. 1:1 por levantamento (não descrita como
-- "múltipla" no documento da sprint).

alter table public.infraestrutura
  add column existente boolean,
  add column interferencia boolean,
  add column descricao text,
  add column tipo text,
  add column necessidade_intervencao text;

alter table public.infraestrutura
  add constraint infraestrutura_levantamento_id_key unique (levantamento_id);
