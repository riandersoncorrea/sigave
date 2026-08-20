-- Sprint 3: campos de negócio de ocorrencias (etapa "Ocorrências", 1:N por
-- levantamento). Também pode ser criada a partir de uma resposta "sim" na
-- etapa Segurança ("permitir ocorrência") — origem_modulo/origem_referencia
-- registram essa proveniência quando aplicável.

alter table public.ocorrencias
  add column tipo text,
  add column descricao text,
  add column origem_modulo text,
  add column origem_referencia text;
