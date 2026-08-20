import { Link } from 'react-router-dom'

const ATALHOS = [
  {
    to: '/admin/usuarios',
    titulo: 'Usuários',
    descricao: 'Listar, ver perfil, alterar perfil e ativar/desativar.',
  },
  {
    to: '/admin/listas',
    titulo: 'Listas administráveis',
    descricao: 'Catálogos de opção usados nos formulários de levantamento.',
  },
  {
    to: '/admin/auditoria',
    titulo: 'Auditoria',
    descricao: 'Quem alterou o quê, quando, e o motivo, quando informado.',
  },
]

export function AdminPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-bold text-neutral-900">Administração</h1>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {ATALHOS.map((atalho) => (
          <Link
            key={atalho.to}
            to={atalho.to}
            className="active:bg-vale-gray-light/50 flex flex-col gap-1 rounded-xl bg-white p-5 shadow-sm"
          >
            <p className="font-semibold text-neutral-900">{atalho.titulo}</p>
            <p className="text-sm text-neutral-500">{atalho.descricao}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
