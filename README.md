# SIGAVE CAMPO

Sistema de Levantamento e Diagnóstico de Áreas Verdes.

Utilizado pela Sapore para realizar o levantamento e diagnóstico técnico das
Áreas Verdes de Manutenção (AVM) da Vale, criando uma base de dados de campo
estruturada, padronizada e rastreável.

Fluxo do sistema: **Cadastrar → Inspecionar → Diagnosticar → Fotografar → Validar**.

## Escopo

Este sistema coleta e organiza fatos observados em campo e permite sua
validação. Ele **não** cria o Plano de Manutenção, **não** define frequência
ou criticidade definitiva, **não** gera ordem de manutenção, **não** cria
códigos SAP e **não** possui módulo GIS ou mapa.

## Stack

- **Frontend:** React + TypeScript + Vite
- **UI:** Tailwind CSS, mobile-first
- **Backend:** Supabase (PostgreSQL, Auth, Storage, Row Level Security)

## Perfis de acesso

- `ADMINISTRADOR`
- `INSPETOR_SAPORE`
- `FISCAL_VALE`

O controle de acesso é aplicado no backend via Row Level Security, não apenas
no frontend.

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
  constants/    constantes globais (ex.: tokens de tema)
  routes/       definição de rotas
```

## Desenvolvimento

```bash
npm install
cp .env.example .env   # preencha VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY
npm run dev
```

### Scripts

| Comando                | Descrição                            |
| ---------------------- | ------------------------------------ |
| `npm run dev`          | Inicia o servidor de desenvolvimento |
| `npm run build`        | Type-check + build de produção       |
| `npm run lint`         | Executa o oxlint                     |
| `npm run format`       | Formata o código com Prettier        |
| `npm run format:check` | Verifica formatação sem alterar      |
| `npm run preview`      | Preview local do build de produção   |

## Sprints

O desenvolvimento é feito em sprints incrementais. Cada sprint é executada
somente sob demanda, sem antecipar funcionalidades de sprints futuras.

- **Sprint 0** — Fundação do projeto ✅
- **Sprint 1** — Banco de dados + autenticação + perfis
- **Sprint 2** — Cadastro e gestão de AVMs
- **Sprint 3** — Formulário completo de levantamento
- **Sprint 4** — Fotografias + ocorrências + modo campo
- **Sprint 5** — Checklist + resumo + envio
- **Sprint 6** — Validação do Fiscal
- **Sprint 7** — Dashboard + relatórios + exportação
- **Sprint 8** — Administração + auditoria + dados de teste + homologação
