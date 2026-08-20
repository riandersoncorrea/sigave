import { Outlet } from 'react-router-dom'
import { SyncStatusBanner } from '@/features/levantamento/SyncStatusBanner'
import { Header } from './Header'

export function AppLayout() {
  return (
    <div className="bg-vale-gray-light flex min-h-svh flex-col">
      <Header />
      <SyncStatusBanner />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}
