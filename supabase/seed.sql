-- Sprint 8: dados de teste — DADOS DE TESTE, claramente marcados como tal
-- em nome e responsavel (prefixo "[DADOS DE TESTE]"). 10 AVMs fictícias
-- distribuídas entre os setores PDM, Pelotização, Oficina e CCO, cobrindo
-- os cenários pedidos (gramínea, arbustiva, arborizada, operacional,
-- paisagística, drenagem, interferência, condição ambiental) e os 6
-- status do ciclo (não iniciada, andamento, enviada, aprovada, reprovada,
-- complementação). Roda contra o projeto Supabase linkado via
-- `supabase db query --linked --file supabase/seed.sql` — este projeto
-- usa um projeto remoto, não Docker local, então `db reset` não é o fluxo
-- normal aqui; este arquivo também documenta a massa de dados para quem
-- rodar um reset local no futuro.
--
-- Usuários administrador/inspetor/fiscal já existem desde a Sprint 1
-- (ver docs/sprint-1-usuarios-teste.md) — não recriados aqui.
--
-- IMPORTANTE sobre WITH (CTEs): todos os sub-statements de um único WITH
-- compartilham o mesmo snapshot do início da consulta — uma linha inserida
-- por uma CTE (ex.: "lev") ainda não é "vista" por um UPDATE/INSERT no
-- final do MESMO statement que dependa de localizá-la na tabela de novo.
-- Por isso cada transição de status (ENVIADA_VALIDACAO, e a decisão do
-- fiscal via validacoes) é sempre um statement SEPARADO, depois do bloco
-- que cria o levantamento — statements separados, mesmo dentro da mesma
-- transação, enxergam normalmente a escrita anterior.

insert into public.setores (unidade_id, nome, codigo)
select id, nome, codigo from (
  select
    (select id from public.unidades limit 1) as id,
    v.nome,
    v.codigo
  from (values
    ('PDM', 'PDM'),
    ('Pelotização', 'PLT'),
    ('Oficina', 'OFC'),
    ('CCO', 'CCO')
  ) as v(nome, codigo)
) as novos
on conflict (unidade_id, nome) do nothing;

-- ID_AVM 01 — PDM — Gramínea — NAO_INICIADA (levantamento nunca aberto)
insert into public.avms
  (id_avm, nome, unidade_id, setor_id, localizacao_descritiva, classe_funcional, area_m2, perimetro, responsavel, inspetor_id, status)
values (
  'TESTE-01', '[DADOS DE TESTE] Faixa gramada — PDM',
  (select id from public.unidades limit 1),
  (select id from public.setores where nome = 'PDM' limit 1),
  'Faixa gramada ao longo do acesso principal do PDM.',
  'B', 1200, 220, '[DADOS DE TESTE] Equipe Sapore',
  '5e8f75c1-2777-4174-95a9-4f56828bbe5b', 'NAO_INICIADA'
)
on conflict (id_avm) do nothing;

-- ID_AVM 02 — PDM — Arbustiva / paisagística — EM_ANDAMENTO
with avm as (
  insert into public.avms
    (id_avm, nome, unidade_id, setor_id, localizacao_descritiva, classe_funcional, area_m2, perimetro, responsavel, inspetor_id, status)
  values (
    'TESTE-02', '[DADOS DE TESTE] Canteiro paisagístico — PDM',
    (select id from public.unidades limit 1),
    (select id from public.setores where nome = 'PDM' limit 1),
    'Canteiro ornamental em frente à portaria do PDM.',
    'C', 350, 90, '[DADOS DE TESTE] Equipe Sapore',
    '5e8f75c1-2777-4174-95a9-4f56828bbe5b', 'EM_ANDAMENTO'
  )
  on conflict (id_avm) do update set nome = excluded.nome
  returning id
),
lev as (
  insert into public.levantamentos (avm_id, inspetor_id, status)
  select id, '5e8f75c1-2777-4174-95a9-4f56828bbe5b', 'EM_ANDAMENTO' from avm
  returning id
),
diag as (
  insert into public.diagnosticos (levantamento_id, condicoes_climaticas, limpeza_nivel)
  select id, 'ENSOLARADO', 'REGULAR' from lev
  returning id
)
insert into public.vegetacao (levantamento_id, tipo, vegetacao_predominante, observacoes)
select id, 'ARBUSTIVA', 'ARBUSTIVA', '[DADOS DE TESTE] Canteiro paisagístico em bom estado geral.' from lev;

-- ID_AVM 03 — Pelotização — Arbórea / operacional crítica — ENVIADA_VALIDACAO
with avm as (
  insert into public.avms
    (id_avm, nome, unidade_id, setor_id, localizacao_descritiva, classe_funcional, area_m2, perimetro, responsavel, inspetor_id, status)
  values (
    'TESTE-03', '[DADOS DE TESTE] Área arborizada — Pelotização',
    (select id from public.unidades limit 1),
    (select id from public.setores where nome = 'Pelotização' limit 1),
    'Faixa arborizada ao redor do pátio de pelotização.',
    'A', 2400, 340, '[DADOS DE TESTE] Equipe Sapore',
    '5e8f75c1-2777-4174-95a9-4f56828bbe5b', 'EM_ANDAMENTO'
  )
  on conflict (id_avm) do update set nome = excluded.nome
  returning id
),
lev as (
  insert into public.levantamentos (avm_id, inspetor_id, status)
  select id, '5e8f75c1-2777-4174-95a9-4f56828bbe5b', 'EM_ANDAMENTO' from avm
  returning id
),
diag as (
  insert into public.diagnosticos (
    levantamento_id, condicoes_climaticas, limpeza_nivel,
    condicao_vegetacao_nota, condicao_limpeza_nota, condicao_seguranca_nota,
    condicao_infraestrutura_nota, condicao_meio_ambiente_nota, condicao_acesso_nota,
    condicao_interferencia_operacional_nota, observacao_geral
  )
  select id, 'NUBLADO', 'BOA', 2, 2, 1, 2, 1, 1, 1,
    '[DADOS DE TESTE] Levantamento completo, aguardando validação do fiscal.'
  from lev
)
insert into public.vegetacao (levantamento_id, tipo, vegetacao_predominante, observacoes)
select id, 'ARBOREA', 'ARBOREA', '[DADOS DE TESTE] Arborização consolidada, boa cobertura.' from lev;

update public.levantamentos set status = 'ENVIADA_VALIDACAO'
where avm_id = (select id from public.avms where id_avm = 'TESTE-03');

-- ID_AVM 04 — Pelotização — Drenagem / operacional — APROVADA
with avm as (
  insert into public.avms
    (id_avm, nome, unidade_id, setor_id, localizacao_descritiva, classe_funcional, area_m2, perimetro, responsavel, inspetor_id, status)
  values (
    'TESTE-04', '[DADOS DE TESTE] Sistema de drenagem — Pelotização',
    (select id from public.unidades limit 1),
    (select id from public.setores where nome = 'Pelotização' limit 1),
    'Canaleta de drenagem lateral ao pátio de estocagem.',
    'B', 800, 160, '[DADOS DE TESTE] Equipe Sapore',
    '5e8f75c1-2777-4174-95a9-4f56828bbe5b', 'EM_ANDAMENTO'
  )
  on conflict (id_avm) do update set nome = excluded.nome
  returning id
),
lev as (
  insert into public.levantamentos (avm_id, inspetor_id, status)
  select id, '5e8f75c1-2777-4174-95a9-4f56828bbe5b', 'EM_ANDAMENTO' from avm
  returning id
)
insert into public.infraestrutura (levantamento_id, existente, tipo, necessidade_intervencao, descricao)
select id, true, 'DRENAGEM', 'SIM', '[DADOS DE TESTE] Canaleta parcialmente obstruída por sedimentos.' from lev;

update public.levantamentos set status = 'ENVIADA_VALIDACAO'
where avm_id = (select id from public.avms where id_avm = 'TESTE-04');

insert into public.validacoes (levantamento_id, fiscal_id, acao, comentario)
select l.id, 'f980fa53-399b-4137-bdd9-5d62d0565c3d', 'APROVADO',
  '[DADOS DE TESTE] Levantamento completo, drenagem registrada corretamente.'
from public.levantamentos l
join public.avms a on a.id = l.avm_id
where a.id_avm = 'TESTE-04';

-- ID_AVM 05 — Oficina — Interferência / operacional — REPROVADA
with avm as (
  insert into public.avms
    (id_avm, nome, unidade_id, setor_id, localizacao_descritiva, classe_funcional, area_m2, perimetro, responsavel, inspetor_id, status)
  values (
    'TESTE-05', '[DADOS DE TESTE] Área com interferência — Oficina',
    (select id from public.unidades limit 1),
    (select id from public.setores where nome = 'Oficina' limit 1),
    'Faixa lateral à oficina de manutenção, próxima a rede elétrica.',
    'B', 600, 140, '[DADOS DE TESTE] Equipe Sapore',
    '5e8f75c1-2777-4174-95a9-4f56828bbe5b', 'EM_ANDAMENTO'
  )
  on conflict (id_avm) do update set nome = excluded.nome
  returning id
),
lev as (
  insert into public.levantamentos (avm_id, inspetor_id, status)
  select id, '5e8f75c1-2777-4174-95a9-4f56828bbe5b', 'EM_ANDAMENTO' from avm
  returning id
)
insert into public.ocorrencias (levantamento_id, tipo, descricao, criticidade, status)
select id, 'INTERFERENCIA', '[DADOS DE TESTE] Vegetação próxima de rede elétrica aérea.', 'ALTA', 'ABERTA' from lev;

update public.levantamentos set status = 'ENVIADA_VALIDACAO'
where avm_id = (select id from public.avms where id_avm = 'TESTE-05');

insert into public.validacoes (levantamento_id, fiscal_id, acao, comentario)
select l.id, 'f980fa53-399b-4137-bdd9-5d62d0565c3d', 'REPROVADO',
  '[DADOS DE TESTE] Interferência com rede elétrica precisa ser tratada antes da aprovação.'
from public.levantamentos l
join public.avms a on a.id = l.avm_id
where a.id_avm = 'TESTE-05';

-- ID_AVM 06 — Oficina — Condição ambiental — NECESSITA_COMPLEMENTACAO
with avm as (
  insert into public.avms
    (id_avm, nome, unidade_id, setor_id, localizacao_descritiva, classe_funcional, area_m2, perimetro, responsavel, inspetor_id, status)
  values (
    'TESTE-06', '[DADOS DE TESTE] Área de preservação — Oficina',
    (select id from public.unidades limit 1),
    (select id from public.setores where nome = 'Oficina' limit 1),
    'Faixa de vegetação nativa nos fundos da oficina.',
    'D', 1800, 260, '[DADOS DE TESTE] Equipe Sapore',
    '5e8f75c1-2777-4174-95a9-4f56828bbe5b', 'EM_ANDAMENTO'
  )
  on conflict (id_avm) do update set nome = excluded.nome
  returning id
),
lev as (
  insert into public.levantamentos (avm_id, inspetor_id, status)
  select id, '5e8f75c1-2777-4174-95a9-4f56828bbe5b', 'EM_ANDAMENTO' from avm
  returning id
)
insert into public.diagnosticos (levantamento_id, meio_ambiente_gate, meio_ambiente_categorias, meio_ambiente_observacoes)
select id, true, array['APP'], '[DADOS DE TESTE] Possível Área de Preservação Permanente não confirmada.' from lev;

update public.levantamentos set status = 'ENVIADA_VALIDACAO'
where avm_id = (select id from public.avms where id_avm = 'TESTE-06');

insert into public.validacoes (levantamento_id, fiscal_id, acao, comentario)
select l.id, 'f980fa53-399b-4137-bdd9-5d62d0565c3d', 'SOLICITADA_COMPLEMENTACAO',
  '[DADOS DE TESTE] Anexar laudo ambiental confirmando ou descartando a APP antes da aprovação.'
from public.levantamentos l
join public.avms a on a.id = l.avm_id
where a.id_avm = 'TESTE-06';

-- ID_AVM 07 — CCO — Interferência operacional crítica — EM_ANDAMENTO
with avm as (
  insert into public.avms
    (id_avm, nome, unidade_id, setor_id, localizacao_descritiva, classe_funcional, area_m2, perimetro, responsavel, inspetor_id, status)
  values (
    'TESTE-07', '[DADOS DE TESTE] Perímetro do CCO',
    (select id from public.unidades limit 1),
    (select id from public.setores where nome = 'CCO' limit 1),
    'Faixa de segurança ao redor do Centro de Controle Operacional.',
    'A', 950, 180, '[DADOS DE TESTE] Equipe Sapore',
    '5e8f75c1-2777-4174-95a9-4f56828bbe5b', 'EM_ANDAMENTO'
  )
  on conflict (id_avm) do update set nome = excluded.nome
  returning id
),
lev as (
  insert into public.levantamentos (avm_id, inspetor_id, status)
  select id, '5e8f75c1-2777-4174-95a9-4f56828bbe5b', 'EM_ANDAMENTO' from avm
  returning id
)
insert into public.ocorrencias (levantamento_id, tipo, descricao, criticidade, status)
select id, 'INTERFERENCIA', '[DADOS DE TESTE] Vegetação obstruindo câmera de monitoramento do CCO.', 'CRITICA', 'ABERTA'
from lev;

-- ID_AVM 08 — CCO — Ornamental / paisagística — NAO_INICIADA
insert into public.avms
  (id_avm, nome, unidade_id, setor_id, localizacao_descritiva, classe_funcional, area_m2, perimetro, responsavel, inspetor_id, status)
values (
  'TESTE-08', '[DADOS DE TESTE] Jardim ornamental — CCO',
  (select id from public.unidades limit 1),
  (select id from public.setores where nome = 'CCO' limit 1),
  'Jardim ornamental na entrada do CCO.',
  'C', 200, 60, '[DADOS DE TESTE] Equipe Sapore',
  '5e8f75c1-2777-4174-95a9-4f56828bbe5b', 'NAO_INICIADA'
)
on conflict (id_avm) do nothing;

-- ID_AVM 09 — PDM — atribuída a OUTRO inspetor (não o inspetor de teste
-- padrão) — usado na revisão de segurança para provar isolamento entre
-- inspetores (RLS: inspetor_id = auth.uid()).
insert into public.avms
  (id_avm, nome, unidade_id, setor_id, localizacao_descritiva, classe_funcional, area_m2, perimetro, responsavel, inspetor_id, status)
values (
  'TESTE-09', '[DADOS DE TESTE] Talude gramado — PDM (outro inspetor)',
  (select id from public.unidades limit 1),
  (select id from public.setores where nome = 'PDM' limit 1),
  'Talude gramado no acesso secundário do PDM.',
  'B', 700, 130, '[DADOS DE TESTE] Equipe Sapore',
  '1a1b70f9-3ebc-495c-a479-c8145ca57d23', 'EM_ANDAMENTO'
)
on conflict (id_avm) do nothing;

with lev as (
  insert into public.levantamentos (avm_id, inspetor_id, status)
  select a.id, '1a1b70f9-3ebc-495c-a479-c8145ca57d23', 'EM_ANDAMENTO'
  from public.avms a
  where a.id_avm = 'TESTE-09'
    and not exists (select 1 from public.levantamentos l where l.avm_id = a.id)
  returning id
)
insert into public.vegetacao (levantamento_id, tipo, vegetacao_predominante)
select id, 'GRAMINEA', 'GRAMINEA' from lev;

-- ID_AVM 10 — Pelotização — Drenagem + condição ambiental combinadas — ENVIADA_VALIDACAO
with avm as (
  insert into public.avms
    (id_avm, nome, unidade_id, setor_id, localizacao_descritiva, classe_funcional, area_m2, perimetro, responsavel, inspetor_id, status)
  values (
    'TESTE-10', '[DADOS DE TESTE] Bacia de contenção — Pelotização',
    (select id from public.unidades limit 1),
    (select id from public.setores where nome = 'Pelotização' limit 1),
    'Bacia de contenção próxima ao curso d''água do pátio de pelotização.',
    'D', 1600, 240, '[DADOS DE TESTE] Equipe Sapore',
    '5e8f75c1-2777-4174-95a9-4f56828bbe5b', 'EM_ANDAMENTO'
  )
  on conflict (id_avm) do update set nome = excluded.nome
  returning id
),
lev as (
  insert into public.levantamentos (avm_id, inspetor_id, status)
  select id, '5e8f75c1-2777-4174-95a9-4f56828bbe5b', 'EM_ANDAMENTO' from avm
  returning id
),
diag as (
  insert into public.diagnosticos (levantamento_id, meio_ambiente_gate, meio_ambiente_categorias, meio_ambiente_observacoes)
  select id, true, array['NASCENTE_CURSO_DAGUA'], '[DADOS DE TESTE] Bacia próxima a curso d''água mapeado.' from lev
),
infra as (
  insert into public.infraestrutura (levantamento_id, existente, tipo, necessidade_intervencao, descricao)
  select id, true, 'DRENAGEM', 'PARCIAL', '[DADOS DE TESTE] Bacia com capacidade reduzida por assoreamento.' from lev
)
insert into public.vegetacao (levantamento_id, tipo, vegetacao_predominante, invasoras)
select id, 'INVASORA', 'INVASORA', 'ALTA' from lev;

update public.levantamentos set status = 'ENVIADA_VALIDACAO'
where avm_id = (select id from public.avms where id_avm = 'TESTE-10');
