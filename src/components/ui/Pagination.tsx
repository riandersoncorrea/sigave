interface PaginationProps {
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
}

export function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-between gap-3 text-sm text-neutral-600">
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="min-h-10 rounded-lg border border-neutral-300 px-4 font-medium text-neutral-700 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Anterior
      </button>
      <span>
        Página {page} de {totalPages}
      </span>
      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="min-h-10 rounded-lg border border-neutral-300 px-4 font-medium text-neutral-700 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Próxima
      </button>
    </div>
  )
}
