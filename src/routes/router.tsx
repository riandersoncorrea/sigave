import { createBrowserRouter } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { Home } from '@/pages/Home'
import { Login } from '@/pages/Login'
import { AvmListPage } from '@/pages/avms/AvmListPage'
import { AvmDetailPage } from '@/pages/avms/AvmDetailPage'
import { AvmFormPage } from '@/pages/avms/AvmFormPage'
import { LevantamentoWizardRoute } from '@/pages/levantamento/LevantamentoWizardRoute'
import { CaracterizacaoStep } from '@/pages/levantamento/CaracterizacaoStep'
import { VegetacaoStep } from '@/pages/levantamento/VegetacaoStep'
import { TerrenoStep } from '@/pages/levantamento/TerrenoStep'
import { CondicaoStep } from '@/pages/levantamento/CondicaoStep'
import { LimpezaStep } from '@/pages/levantamento/LimpezaStep'
import { InfraestruturaStep } from '@/pages/levantamento/InfraestruturaStep'
import { SegurancaStep } from '@/pages/levantamento/SegurancaStep'
import { MeioAmbienteStep } from '@/pages/levantamento/MeioAmbienteStep'
import { AcessoStep } from '@/pages/levantamento/AcessoStep'
import { InterferenciasStep } from '@/pages/levantamento/InterferenciasStep'
import { EquipamentosStep } from '@/pages/levantamento/EquipamentosStep'
import { ServicosStep } from '@/pages/levantamento/ServicosStep'
import { RecursosStep } from '@/pages/levantamento/RecursosStep'
import { OcorrenciasStep } from '@/pages/levantamento/OcorrenciasStep'
import { FotografiasStep } from '@/pages/levantamento/FotografiasStep'
import { ResumoStep } from '@/pages/levantamento/ResumoStep'
import { ValidacoesListPage } from '@/pages/validacoes/ValidacoesListPage'
import { ValidacaoReviewPage } from '@/pages/validacoes/ValidacaoReviewPage'
import { DashboardPage } from '@/pages/dashboard/DashboardPage'
import { RelatoriosPage } from '@/pages/relatorios/RelatoriosPage'
import { AdminPage } from '@/pages/admin/AdminPage'
import { AdminUsuariosPage } from '@/pages/admin/AdminUsuariosPage'
import { AdminListasPage } from '@/pages/admin/AdminListasPage'
import { AdminAuditoriaPage } from '@/pages/admin/AdminAuditoriaPage'
import { requireSession, requireRole } from '@/features/auth/guards'

const PERFIS_GESTAO_AVM = ['ADMINISTRADOR', 'FISCAL_VALE'] as const
const PERFIS_VALIDACAO = ['ADMINISTRADOR', 'FISCAL_VALE'] as const
const PERFIS_ADMIN = ['ADMINISTRADOR'] as const

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <AppLayout />,
    loader: requireSession,
    children: [
      { index: true, element: <Home /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'relatorios', element: <RelatoriosPage /> },
      { path: 'avms', element: <AvmListPage /> },
      {
        path: 'avms/novo',
        element: <AvmFormPage />,
        loader: () => requireRole([...PERFIS_GESTAO_AVM]),
      },
      { path: 'avms/:id', element: <AvmDetailPage /> },
      {
        path: 'avms/:id/editar',
        element: <AvmFormPage />,
        loader: () => requireRole([...PERFIS_GESTAO_AVM]),
      },
      {
        path: 'validacoes',
        element: <ValidacoesListPage />,
        loader: () => requireRole([...PERFIS_VALIDACAO]),
      },
      {
        path: 'validacoes/:id',
        element: <ValidacaoReviewPage />,
        loader: () => requireRole([...PERFIS_VALIDACAO]),
      },
      {
        path: 'admin',
        element: <AdminPage />,
        loader: () => requireRole([...PERFIS_ADMIN]),
      },
      {
        path: 'admin/usuarios',
        element: <AdminUsuariosPage />,
        loader: () => requireRole([...PERFIS_ADMIN]),
      },
      {
        path: 'admin/listas',
        element: <AdminListasPage />,
        loader: () => requireRole([...PERFIS_ADMIN]),
      },
      {
        path: 'admin/auditoria',
        element: <AdminAuditoriaPage />,
        loader: () => requireRole([...PERFIS_ADMIN]),
      },
      {
        path: 'levantamentos/:id',
        element: <LevantamentoWizardRoute />,
        children: [
          { path: 'caracterizacao', element: <CaracterizacaoStep /> },
          { path: 'vegetacao', element: <VegetacaoStep /> },
          { path: 'terreno', element: <TerrenoStep /> },
          { path: 'condicao', element: <CondicaoStep /> },
          { path: 'limpeza', element: <LimpezaStep /> },
          { path: 'infraestrutura', element: <InfraestruturaStep /> },
          { path: 'seguranca', element: <SegurancaStep /> },
          { path: 'meio-ambiente', element: <MeioAmbienteStep /> },
          { path: 'acesso', element: <AcessoStep /> },
          { path: 'interferencias', element: <InterferenciasStep /> },
          { path: 'equipamentos', element: <EquipamentosStep /> },
          { path: 'servicos', element: <ServicosStep /> },
          { path: 'recursos', element: <RecursosStep /> },
          { path: 'ocorrencias', element: <OcorrenciasStep /> },
          { path: 'fotografias', element: <FotografiasStep /> },
          { path: 'resumo', element: <ResumoStep /> },
        ],
      },
    ],
  },
])
