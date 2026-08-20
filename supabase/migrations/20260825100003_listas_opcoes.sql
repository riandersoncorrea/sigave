-- Sprint 8: "não deixar valores hardcoded quando puderem ser
-- administráveis". Os catálogos de opção hoje vivem como constantes TS em
-- src/constants/levantamento.ts (ver o comentário no topo daquele
-- arquivo: campos marcados "(proposto)" foram inventados pelo time na
-- ausência de especificação oficial — candidatos naturais a virar
-- administráveis). categoria é o discriminador: uma tabela genérica só,
-- em vez de uma tabela por catálogo, para caber num único painel de admin.
--
-- Deliberadamente fora do escopo desta migration: os catálogos com lastro
-- em enum do Postgres (ocorrencia_tipo, ocorrencia_criticidade,
-- ocorrencia_status, evidencia_tipo) e as perguntas de segurança (formato
-- estruturado, não um catálogo valor/rótulo simples) — ficam como estão.
create table public.listas_opcoes (
  id uuid primary key default gen_random_uuid(),
  categoria text not null,
  valor text not null,
  rotulo text not null,
  ordem integer not null default 0,
  ativo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.profiles (id) on delete set null,
  updated_by uuid references public.profiles (id) on delete set null,
  unique (categoria, valor)
);

create trigger trg_listas_opcoes_updated_at
  before update on public.listas_opcoes
  for each row
  execute function public.set_updated_at();

alter table public.listas_opcoes enable row level security;
create index idx_listas_opcoes_categoria on public.listas_opcoes (categoria, ordem);

create trigger trg_audit_listas_opcoes
  after insert or update or delete on public.listas_opcoes
  for each row
  execute function public.audit_trigger_fn();

grant select on public.listas_opcoes to authenticated;
grant insert, update, delete on public.listas_opcoes to authenticated;

-- Qualquer usuário autenticado lê as opções ativas (é isso que os
-- formulários do wizard vão consumir); admin também vê as inativas, para
-- poder reativá-las.
create policy listas_opcoes_select on public.listas_opcoes
  for select
  using (ativo = true or public.is_admin());

create policy listas_opcoes_write on public.listas_opcoes
  for all
  using (public.is_admin())
  with check (public.is_admin());

-- Seed: valor atual de cada catálogo "(proposto)" ou "(especificado, mas
-- em coluna texto livre)" de constants/levantamento.ts, preservando a
-- ordem de exibição original via "ordem".
insert into public.listas_opcoes (categoria, valor, rotulo, ordem) values
  ('clima', 'ENSOLARADO', 'Ensolarado', 1),
  ('clima', 'NUBLADO', 'Nublado', 2),
  ('clima', 'CHUVOSO', 'Chuvoso', 3),
  ('clima', 'OUTRO', 'Outro', 4),

  ('vegetacao_tipo', 'GRAMINEA', 'Gramínea', 1),
  ('vegetacao_tipo', 'HERBACEA', 'Herbácea', 2),
  ('vegetacao_tipo', 'ARBUSTIVA', 'Arbustiva', 3),
  ('vegetacao_tipo', 'ARBOREA', 'Arbórea', 4),
  ('vegetacao_tipo', 'NATIVA', 'Vegetação nativa', 5),
  ('vegetacao_tipo', 'ORNAMENTAL', 'Vegetação ornamental', 6),
  ('vegetacao_tipo', 'ESPONTANEA', 'Vegetação espontânea', 7),
  ('vegetacao_tipo', 'INVASORA', 'Vegetação invasora', 8),
  ('vegetacao_tipo', 'MISTA', 'Vegetação mista', 9),
  ('vegetacao_tipo', 'SOLO_EXPOSTO', 'Solo exposto', 10),
  ('vegetacao_tipo', 'OUTRO', 'Outro', 11),

  ('vegetacao_cobertura', 'ATE_25', '0–25%', 1),
  ('vegetacao_cobertura', 'DE_26_A_50', '26–50%', 2),
  ('vegetacao_cobertura', 'DE_51_A_75', '51–75%', 3),
  ('vegetacao_cobertura', 'DE_76_A_90', '76–90%', 4),
  ('vegetacao_cobertura', 'ACIMA_90', '>90%', 5),

  ('vegetacao_altura', 'ATE_10CM', '<10 cm', 1),
  ('vegetacao_altura', 'DE_10_A_20CM', '10–20 cm', 2),
  ('vegetacao_altura', 'DE_20_A_40CM', '20–40 cm', 3),
  ('vegetacao_altura', 'DE_40_A_60CM', '40–60 cm', 4),
  ('vegetacao_altura', 'ACIMA_60CM', '>60 cm', 5),

  ('nivel_baixa_media_alta_muito_alta', 'BAIXA', 'Baixa', 1),
  ('nivel_baixa_media_alta_muito_alta', 'MEDIA', 'Média', 2),
  ('nivel_baixa_media_alta_muito_alta', 'ALTA', 'Alta', 3),
  ('nivel_baixa_media_alta_muito_alta', 'MUITO_ALTA', 'Muito alta', 4),

  ('vegetacao_uniformidade', 'UNIFORME', 'Uniforme', 1),
  ('vegetacao_uniformidade', 'PARCIALMENTE_UNIFORME', 'Parcialmente uniforme', 2),
  ('vegetacao_uniformidade', 'IRREGULAR', 'Irregular', 3),
  ('vegetacao_uniformidade', 'MUITO_IRREGULAR', 'Muito irregular', 4),

  ('vegetacao_invasoras', 'NAO', 'Não', 1),
  ('vegetacao_invasoras', 'BAIXA', 'Baixa', 2),
  ('vegetacao_invasoras', 'MEDIA', 'Média', 3),
  ('vegetacao_invasoras', 'ALTA', 'Alta', 4),
  ('vegetacao_invasoras', 'CRITICA', 'Crítica', 5),

  ('vegetacao_arvores', 'NAO', 'Não', 1),
  ('vegetacao_arvores', 'ISOLADAS', 'Isoladas', 2),
  ('vegetacao_arvores', 'DISPERSAS', 'Dispersas', 3),
  ('vegetacao_arvores', 'ALTA_CONCENTRACAO', 'Alta concentração', 4),
  ('vegetacao_arvores', 'BOSQUE', 'Bosque', 5),

  ('terreno_topografia', 'PLANA', 'Plana', 1),
  ('terreno_topografia', 'ONDULADA', 'Ondulada', 2),
  ('terreno_topografia', 'INGREME', 'Íngreme', 3),
  ('terreno_topografia', 'IRREGULAR', 'Irregular', 4),

  ('terreno_inclinacao', 'NENHUMA', 'Nenhuma', 1),
  ('terreno_inclinacao', 'LEVE', 'Leve', 2),
  ('terreno_inclinacao', 'MODERADA', 'Moderada', 3),
  ('terreno_inclinacao', 'ACENTUADA', 'Acentuada', 4),

  ('terreno_superficie', 'GRAMADA', 'Gramada', 1),
  ('terreno_superficie', 'TERRA', 'Terra', 2),
  ('terreno_superficie', 'PAVIMENTADA', 'Pavimentada', 3),
  ('terreno_superficie', 'CASCALHO', 'Cascalho', 4),
  ('terreno_superficie', 'MISTA', 'Mista', 5),

  ('terreno_obstaculos', 'PEDRAS', 'Pedras', 1),
  ('terreno_obstaculos', 'RAIZES_EXPOSTAS', 'Raízes expostas', 2),
  ('terreno_obstaculos', 'LIXO_ENTULHO', 'Lixo / entulho', 3),
  ('terreno_obstaculos', 'BURACOS', 'Buracos', 4),
  ('terreno_obstaculos', 'POSTES_ESTRUTURAS', 'Postes / estruturas', 5),
  ('terreno_obstaculos', 'OUTROS', 'Outros', 6),

  ('terreno_grau_obstaculos', 'NENHUM', 'Nenhum', 1),
  ('terreno_grau_obstaculos', 'BAIXO', 'Baixo', 2),
  ('terreno_grau_obstaculos', 'MEDIO', 'Médio', 3),
  ('terreno_grau_obstaculos', 'ALTO', 'Alto', 4),

  ('limpeza_nivel', 'BOA', 'Boa', 1),
  ('limpeza_nivel', 'REGULAR', 'Regular', 2),
  ('limpeza_nivel', 'RUIM', 'Ruim', 3),
  ('limpeza_nivel', 'CRITICA', 'Crítica', 4),

  ('infraestrutura_tipo', 'ILUMINACAO', 'Iluminação', 1),
  ('infraestrutura_tipo', 'IRRIGACAO', 'Irrigação', 2),
  ('infraestrutura_tipo', 'CERCAMENTO', 'Cercamento', 3),
  ('infraestrutura_tipo', 'MOBILIARIO_URBANO', 'Mobiliário urbano', 4),
  ('infraestrutura_tipo', 'SINALIZACAO', 'Sinalização', 5),
  ('infraestrutura_tipo', 'DRENAGEM', 'Drenagem', 6),
  ('infraestrutura_tipo', 'OUTRO', 'Outro', 7),

  ('infraestrutura_necessidade', 'SIM', 'Sim', 1),
  ('infraestrutura_necessidade', 'NAO', 'Não', 2),
  ('infraestrutura_necessidade', 'PARCIAL', 'Parcial', 3),

  ('meio_ambiente_categorias', 'APP', 'Área de Preservação Permanente (APP)', 1),
  ('meio_ambiente_categorias', 'ESPECIE_PROTEGIDA', 'Espécie protegida ou ameaçada', 2),
  ('meio_ambiente_categorias', 'NASCENTE_CURSO_DAGUA', 'Nascente ou curso d''água', 3),
  ('meio_ambiente_categorias', 'FAUNA_SILVESTRE', 'Fauna silvestre', 4),
  ('meio_ambiente_categorias', 'SOLO_CONTAMINADO', 'Solo potencialmente contaminado', 5),
  ('meio_ambiente_categorias', 'OUTRO', 'Outro', 6),

  ('acesso_condicao_via', 'BOA', 'Boa', 1),
  ('acesso_condicao_via', 'REGULAR', 'Regular', 2),
  ('acesso_condicao_via', 'RUIM', 'Ruim', 3),

  ('equipamento_avaliacao', 'ADEQUADO', 'Adequado', 1),
  ('equipamento_avaliacao', 'POSSIVEL', 'Possível', 2),
  ('equipamento_avaliacao', 'NAO_RECOMENDADO', 'Não recomendado', 3),

  ('servico_necessidade', 'NECESSARIO', 'Necessário', 1),
  ('servico_necessidade', 'NAO_NECESSARIO', 'Não necessário', 2),
  ('servico_necessidade', 'A_AVALIAR', 'A avaliar', 3);
