import {
  SECOES_LEVANTAMENTO,
  type SecaoNavItem,
} from '@/features/levantamento/secoes'

interface SecaoNavProps {
  itens?: SecaoNavItem[]
}

// Navegação rápida por âncora — a tela de revisão do fiscal é uma página
// longa e única (sem wizard paginado), então em vez de paginar a
// especificação pede "navegação por seções": aqui, pular direto pra
// seção via #id em vez de rolar manualmente.
export function SecaoNav({ itens = SECOES_LEVANTAMENTO }: SecaoNavProps) {
  return (
    <nav className="sticky top-14 z-[5] -mx-4 overflow-x-auto bg-white/95 px-4 py-2 shadow-sm backdrop-blur">
      <ul className="flex gap-2 whitespace-nowrap">
        {itens.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="bg-vale-gray-light text-vale-green-dark hover:bg-vale-green-light inline-block rounded-full px-3 py-1.5 text-xs font-medium"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
