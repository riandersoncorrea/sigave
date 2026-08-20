-- Sprint 3: campos de negócio de diagnosticos. Esta tabela é o "hub" 1:1 por
-- levantamento (unique em levantamento_id desde a Sprint 1) e concentra as
-- etapas do wizard que não têm cardinalidade própria: Caracterização,
-- Terreno, Condição, Limpeza, Segurança, Meio Ambiente, Acesso e Recursos.
-- Vegetação e Infraestrutura ganham suas próprias migrations por já terem
-- tabela dedicada; Interferências/Equipamentos/Serviços/Ocorrências são
-- 1:N e vivem em tabelas próprias.
--
-- Não há documento-fonte disponível para esta sprint (confirmado com o
-- usuário) para Caracterização, Terreno, Limpeza, Segurança e Acesso — os
-- catálogos de opção usados aqui (ver src/constants/levantamento.ts) são
-- uma proposta razoável do time de desenvolvimento, não uma transcrição de
-- especificação, e devem ser revisados quando houver documento oficial.
--
-- Regras condicionais (nota 3/4/5 exige observação; nota 4/5 exigirá foto
-- quando o módulo de fotos existir) são validadas na aplicação, não via
-- CHECK: os campos ficam graváveis a qualquer momento para não travar o
-- autosave de um rascunho incompleto.

alter table public.diagnosticos
  -- Caracterização
  add column condicoes_climaticas text,
  add column caracterizacao_observacoes text,
  -- Terreno
  add column topografia text,
  add column inclinacao text,
  add column superficie text,
  add column obstaculos jsonb not null default '[]'::jsonb,
  add column grau_obstaculos text,
  -- Condição (7 dimensões fixas, nota 1-5 + observação cada)
  add column condicao_vegetacao_nota smallint check (condicao_vegetacao_nota between 1 and 5),
  add column condicao_vegetacao_obs text,
  add column condicao_limpeza_nota smallint check (condicao_limpeza_nota between 1 and 5),
  add column condicao_limpeza_obs text,
  add column condicao_seguranca_nota smallint check (condicao_seguranca_nota between 1 and 5),
  add column condicao_seguranca_obs text,
  add column condicao_infraestrutura_nota smallint check (condicao_infraestrutura_nota between 1 and 5),
  add column condicao_infraestrutura_obs text,
  add column condicao_meio_ambiente_nota smallint check (condicao_meio_ambiente_nota between 1 and 5),
  add column condicao_meio_ambiente_obs text,
  add column condicao_acesso_nota smallint check (condicao_acesso_nota between 1 and 5),
  add column condicao_acesso_obs text,
  add column condicao_interferencia_operacional_nota smallint check (condicao_interferencia_operacional_nota between 1 and 5),
  add column condicao_interferencia_operacional_obs text,
  -- Limpeza
  add column limpeza_nivel text,
  add column limpeza_presenca_residuos boolean,
  add column limpeza_tipo_residuos text,
  add column limpeza_acumulo_entulho boolean,
  add column limpeza_necessita_capina boolean,
  add column limpeza_observacoes text,
  -- Segurança: catálogo de perguntas ainda não definido pelo documento
  -- oficial, por isso fica em jsonb (lista extensível de
  -- {id, pergunta, resposta, descricao}) em vez de colunas fixas.
  add column seguranca_perguntas jsonb not null default '[]'::jsonb,
  add column seguranca_observacoes text,
  -- Meio ambiente
  add column meio_ambiente_gate boolean,
  add column meio_ambiente_categorias text[] not null default '{}',
  add column meio_ambiente_observacoes text,
  -- Acesso
  add column acesso_veicular boolean,
  add column acesso_pedestre boolean,
  add column acesso_condicao_via text,
  add column acesso_restricoes text,
  add column acesso_observacoes text,
  -- Recursos
  add column recursos_operadores smallint,
  add column recursos_auxiliares smallint,
  add column recursos_jardineiros smallint,
  add column recursos_equipe_especializada text,
  add column recursos_apoio_operacional text,
  add column recursos_composicao_sugerida text,
  add column recursos_observacoes text;
