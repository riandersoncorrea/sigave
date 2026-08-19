import { createBrowserRouter } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { Home } from '@/pages/Home'
import { Login } from '@/pages/Login'
import { requireSession } from '@/features/auth/guards'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <AppLayout />,
    loader: requireSession,
    children: [{ index: true, element: <Home /> }],
  },
])
