-- Sprint 4: evidencias ganha path_storage (referência ao objeto no bucket
-- de Storage), descricao (opcional, preenchida pelo inspetor) e um enum
-- fechado de tipo — a lista de tipos é explícita e completa na
-- especificação da Sprint 4 (4 obrigatórios + 7 adicionais), diferente das
-- taxonomias propostas da Sprint 3, então aqui faz sentido um enum de
-- verdade em vez de texto livre.

create type evidencia_tipo as enum (
  'VISTA_GERAL',
  'VEGETACAO_PREDOMINANTE',
  'ACESSO',
  'INFRAESTRUTURA_INTERFERENCIA',
  'SEGURANCA',
  'AMBIENTAL',
  'OCORRENCIA',
  'DRENAGEM',
  'EQUIPAMENTO',
  'CONDICAO_CRITICA',
  'OUTRO'
);

alter table public.evidencias
  add column path_storage text,
  add column descricao text;

alter table public.evidencias
  alter column tipo type evidencia_tipo using tipo::evidencia_tipo;
