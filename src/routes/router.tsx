import { createBrowserRouter } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { Home } from '@/pages/Home'
import { Login } from '@/pages/Login'
import { AvmListPage } from '@/pages/avms/AvmListPage'
import { AvmDetailPage } from '@/pages/avms/AvmDetailPage'
import { AvmFormPage } from '@/pages/avms/AvmFormPage'
import { requireSession, requireRole } from '@/features/auth/guards'

const PERFIS_GESTAO_AVM = ['ADMINISTRADOR', 'FISCAL_VALE'] as const

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
    ],
  },
])
