-- Sprint 4: ocorrencias ganha criticidade preliminar, vínculo opcional com
-- uma evidência, responsável e status de acompanhamento. A lista de tipos
-- desta sprint é explícita e substitui a proposta provisória da Sprint 3
-- (ESTRUTURAL vira INFRAESTRUTURA); como só existe um registro de teste no
-- banco, a migração já normaliza esse valor antes de trocar para enum.

update public.ocorrencias set tipo = 'INFRAESTRUTURA' where tipo = 'ESTRUTURAL';

create type ocorrencia_tipo as enum (
  'VEGETACAO',
  'LIMPEZA',
  'SEGURANCA',
  'INFRAESTRUTURA',
  'AMBIENTAL',
  'ACESSO',
  'INTERFERENCIA',
  'EQUIPAMENTO',
  'OUTRO'
);

create type ocorrencia_criticidade as enum ('BAIXA', 'MEDIA', 'ALTA', 'CRITICA');

create type ocorrencia_status as enum (
  'ABERTA',
  'EM_ANALISE',
  'RESOLVIDA',
  'NAO_APLICAVEL'
);

alter table public.ocorrencias
  alter column tipo type ocorrencia_tipo using tipo::ocorrencia_tipo;

alter table public.ocorrencias
  add column criticidade ocorrencia_criticidade,
  add column evidencia_id uuid references public.evidencias (id) on delete set null,
  add column responsavel text,
  add column status ocorrencia_status not null default 'ABERTA';
