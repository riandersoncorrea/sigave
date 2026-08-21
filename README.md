# SIGAVE CAMPO

**Sistema de Levantamento e Diagnóstico de Áreas Verdes**

Aplicação web mobile-first usada pela **Sapore** para inspecionar e
diagnosticar em campo as Áreas Verdes de Manutenção (AVM) da **Vale**,
transformando uma vistoria feita a pé em dados estruturados, padronizados e
rastreáveis — desde o primeiro registro até a aprovação final.

🔗 **Demo:** https://riandersoncorrea.github.io/sigave/

## O problema que resolve

Levantamentos de áreas verdes tradicionalmente viram planilhas soltas,
fotos sem contexto e diagnósticos que não se conversam entre si. O SIGAVE
CAMPO padroniza esse processo em um fluxo único, usável do celular no meio
do campo, com preenchimento salvo automaticamente (mesmo offline) e uma
trilha de auditoria completa de quem alterou o quê.

## Fluxo

```
Cadastrar → Inspecionar → Diagnosticar → Fotografar → Validar
```

1. **Cadastrar** — a AVM é registrada (localização, classe funcional, área)
   e atribuída a um inspetor.
2. **Inspecionar** — o inspetor abre um levantamento em campo e percorre um
   formulário guiado por etapas (vegetação, condição, limpeza, segurança,
   infraestrutura, meio ambiente, acesso, interferências, equipamentos,
   serviços, recursos, ocorrências).
3. **Diagnosticar** — cada dimensão recebe uma nota de condição (1–5), com
   observação obrigatória quando o cenário exige atenção.
4. **Fotografar** — evidências fotográficas obrigatórias e adicionais,
   sempre com identificação, data/hora, usuário e sequência.
5. **Validar** — antes do envio, um checklist mostra exatamente o que falta
   preencher; o fiscal da Vale então aprova, reprova ou solicita
   complementação — com motivo registrado e histórico nunca sobrescrito.

## Principais funcionalidades

- **Formulário de campo mobile-first**, com autosave local e sincronização
  automática ao voltar a ficar online.
- **Checklist inteligente** antes do envio, com mensagens específicas (não
  um genérico "formulário inválido").
- **Ciclo de validação** do fiscal com histórico completo (enviado →
  reprovado/complementação → reenviado → aprovado).
- **Dashboard** com indicadores (% diagnosticadas, % aprovadas, ocorrências
  críticas, pendências ambientais) e filtros cruzados.
- **Exportação em CSV** de todas as entidades, sempre com o ID da AVM como
  chave de relacionamento.
- **Administração**: gestão de usuários e perfis, catálogos de opção
  administráveis, e auditoria em nível de campo (quem mudou o quê, quando,
  de que valor para qual, e por quê).
- **Controle de acesso por perfil** (`ADMINISTRADOR`, `INSPETOR_SAPORE`,
  `FISCAL_VALE`), aplicado no banco via Row Level Security — nunca apenas
  escondido na interface.

## Escopo

O sistema coleta, padroniza e valida fatos observados em campo. Ele
**não** substitui um Plano de Manutenção, **não** define frequência ou
criticidade definitiva de manutenção, **não** gera ordens de serviço ou
códigos SAP, e **não** é um sistema de mapas/GIS — o modelo de dados foi
desenhado para se relacionar com esses conceitos no futuro, sem
implementá-los agora.

## Stack técnica

| Camada          | Tecnologia                                              |
| --------------- | -------------------------------------------------------- |
| Frontend        | React 19 + TypeScript + Vite, Tailwind CSS               |
| Backend          | Supabase (PostgreSQL, Auth, Storage, Row Level Security) |
| Automação de fundo | Postgres triggers (auditoria, histórico de status)      |
| Deploy           | GitHub Actions → GitHub Pages                            |

## Rodando localmente

```bash
npm install
cp .env.example .env   # preencha VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY
npm run dev
```

| Comando                | Descrição                            |
| ----------------------- | ------------------------------------- |
| `npm run dev`           | Servidor de desenvolvimento           |
| `npm run build`         | Type-check + build de produção        |
| `npm run lint`          | Lint (oxlint)                         |
| `npm run format`        | Formata o código com Prettier         |
| `npm run preview`       | Preview local do build de produção    |

As migrations do banco (schema + Row Level Security) ficam em
`supabase/migrations/`, aplicadas via Supabase CLI:

```bash
npx supabase link --project-ref <project-ref>
npx supabase db push
```

## Estrutura do projeto

```
src/
  pages/        páginas roteáveis
  features/     funcionalidades de negócio, organizadas por domínio
  components/   componentes reutilizáveis (ui/, layout/)
  services/     integrações externas (ex.: cliente Supabase)
  hooks/        hooks React reutilizáveis
  validations/  esquemas e regras de validação
  types/        tipos e contratos compartilhados
  constants/    constantes globais
  routes/       definição de rotas
supabase/
  migrations/   schema do banco + Row Level Security
  functions/    Edge Functions (operações que exigem privilégio elevado)
```
