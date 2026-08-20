import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Drawer } from '@/components/ui/Drawer'
import { PERFIL_LABELS } from '@/constants/perfil'
import { useAuth } from '@/features/auth/useAuth'
import type { Profile } from '@/services/auth'
import { signOut } from '@/services/auth'

interface NavLink {
  to: string
  label: string
  visivel: (profile: Profile | null) => boolean
}

// Lista única para os links de navegação: o menu mobile (Drawer) e os
// links inline do desktop (sm:inline) renderizam a partir da mesma fonte,
// em vez de duplicar a marcação — sem isso o header não tinha NENHUMA
// forma de navegar entre as seções no mobile (só "Ver AVMs" na Home).
const NAV_LINKS: NavLink[] = [
  { to: '/dashboard', label: 'Dashboard', visivel: (p) => !!p },
  { to: '/avms', label: 'AVMs', visivel: (p) => !!p },
  { to: '/relatorios', label: 'Relatórios', visivel: (p) => !!p },
  {
    to: '/validacoes',
    label: 'Validações',
    visivel: (p) =>
      p?.perfil === 'ADMINISTRADOR' || p?.perfil === 'FISCAL_VALE',
  },
  {
    to: '/admin',
    label: 'Admin',
    visivel: (p) => p?.perfil === 'ADMINISTRADOR',
  },
]

export function Header() {
  const navigate = useNavigate()
  const { profile } = useAuth()
  const [menuAberto, setMenuAberto] = useState(false)

  async function handleLogout() {
    await signOut()
    navigate('/login', { replace: true })
  }

  const linksVisiveis = NAV_LINKS.filter((link) => link.visivel(profile))

  return (
    <header className="bg-vale-green sticky top-0 z-10 shadow-md">
      <div className="border-vale-yellow flex h-14 items-center justify-between border-b-4 px-4">
        <div className="flex items-center gap-6">
          {profile && (
            <button
              type="button"
              aria-label="Abrir menu"
              onClick={() => setMenuAberto(true)}
              className="-ml-1 flex min-h-10 min-w-10 items-center justify-center text-xl text-white sm:hidden"
            >
              ☰
            </button>
          )}
          <Link to="/" className="text-lg font-bold tracking-tight text-white">
            SIGAVE <span className="text-vale-yellow">CAMPO</span>
          </Link>
          {linksVisiveis.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="hidden text-sm font-medium text-white/90 hover:text-white sm:inline"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {profile && (
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-white/90 sm:inline">
              {profile.nomeCompleto || profile.email}
              {profile.perfil && (
                <span className="ml-1 text-white/70">
                  · {PERFIL_LABELS[profile.perfil]}
                </span>
              )}
            </span>
            <Button
              type="button"
              variant="outline"
              fullWidth={false}
              className="min-h-9 border-white px-3 py-1.5 text-sm text-white hover:bg-white/10"
              onClick={handleLogout}
            >
              Sair
            </Button>
          </div>
        )}
      </div>

      <Drawer
        open={menuAberto}
        title="Menu"
        onClose={() => setMenuAberto(false)}
      >
        <nav className="flex flex-col gap-1">
          {linksVisiveis.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuAberto(false)}
              className="min-h-12 rounded-lg px-3 py-3 text-base font-medium text-neutral-800 hover:bg-neutral-100"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </Drawer>
    </header>
  )
}
