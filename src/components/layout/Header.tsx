import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/features/auth/useAuth'
import { signOut } from '@/services/auth'

const PERFIL_LABELS: Record<string, string> = {
  ADMINISTRADOR: 'Administrador',
  INSPETOR_SAPORE: 'Inspetor Sapore',
  FISCAL_VALE: 'Fiscal Vale',
}

export function Header() {
  const navigate = useNavigate()
  const { profile } = useAuth()

  async function handleLogout() {
    await signOut()
    navigate('/login', { replace: true })
  }

  return (
    <header className="bg-vale-green sticky top-0 z-10 shadow-md">
      <div className="border-vale-yellow flex h-14 items-center justify-between border-b-4 px-4">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-lg font-bold tracking-tight text-white">
            SIGAVE <span className="text-vale-yellow">CAMPO</span>
          </Link>
          {profile && (
            <Link
              to="/dashboard"
              className="hidden text-sm font-medium text-white/90 hover:text-white sm:inline"
            >
              Dashboard
            </Link>
          )}
          {profile && (
            <Link
              to="/avms"
              className="hidden text-sm font-medium text-white/90 hover:text-white sm:inline"
            >
              AVMs
            </Link>
          )}
          {profile && (
            <Link
              to="/relatorios"
              className="hidden text-sm font-medium text-white/90 hover:text-white sm:inline"
            >
              Relatórios
            </Link>
          )}
          {(profile?.perfil === 'ADMINISTRADOR' ||
            profile?.perfil === 'FISCAL_VALE') && (
            <Link
              to="/validacoes"
              className="hidden text-sm font-medium text-white/90 hover:text-white sm:inline"
            >
              Validações
            </Link>
          )}
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
    </header>
  )
}
