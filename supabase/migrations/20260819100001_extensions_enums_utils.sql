-- Extensões, enums e utilitário de trigger compartilhados por todo o schema.

create extension if not exists pgcrypto;

create type perfil_usuario as enum (
  'ADMINISTRADOR',
  'INSPETOR_SAPORE',
  'FISCAL_VALE'
);

create type avm_classe_funcional as enum (
  'A', -- Operacional crítica
  'B', -- Operacional
  'C', -- Paisagística
  'D'  -- Ambiental
);

-- Compartilhado por avms.status e levantamentos.status: um único lugar para
-- adicionar um novo status no futuro.
create type status_ciclo as enum (
  'NAO_INICIADA',
  'EM_ANDAMENTO',
  'ENVIADA_VALIDACAO',
  'REPROVADA',
  'APROVADA',
  'NECESSITA_COMPLEMENTACAO'
);

create type validacao_acao as enum (
  'APROVADO',
  'REPROVADO',
  'SOLICITADA_COMPLEMENTACAO'
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
