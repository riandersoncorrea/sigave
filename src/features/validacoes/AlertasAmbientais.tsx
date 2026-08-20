import { MEIO_AMBIENTE_CATEGORIAS_OPTIONS } from '@/constants/levantamento'
import type { Diagnostico } from '@/services/diagnosticos'
import type { Ocorrencia } from '@/services/ocorrencias'

interface AlertasAmbientaisProps {
  diagnostico: Diagnostico
  ocorrencias: Ocorrencia[]
}

// Painel de destaque para o fiscal bater o olho antes de descer pela
// revisão inteira — não é uma seção de dados nova, só ressalta o que já
// está em Ambiental/Ocorrências e é crítico o suficiente para chamar
// atenção antes da decisão.
export function AlertasAmbientais({
  diagnostico,
  ocorrencias,
}: AlertasAmbientaisProps) {
  const categorias = diagnostico.meio_ambiente_gate
    ? diagnostico.meio_ambiente_categorias.map(
        (c) =>
          MEIO_AMBIENTE_CATEGORIAS_OPTIONS.find((o) => o.value === c)?.label ??
          c,
      )
    : []
  const ocorrenciasCriticas = ocorrencias.filter(
    (o) => o.criticidade === 'ALTA' || o.criticidade === 'CRITICA',
  )

  const temAlerta = categorias.length > 0 || ocorrenciasCriticas.length > 0

  return (
    <div
      id="alertas"
      className={`flex scroll-mt-24 flex-col gap-2 rounded-xl border-2 p-5 shadow-sm ${
        temAlerta ? 'border-red-300 bg-red-50' : 'border-neutral-200 bg-white'
      }`}
    >
      <h2
        className={`text-sm font-bold ${temAlerta ? 'text-red-800' : 'text-neutral-900'}`}
      >
        Alertas ambientais
      </h2>
      {!temAlerta && (
        <p className="text-sm text-neutral-500">Nenhum alerta identificado.</p>
      )}
      {categorias.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-red-800">
            Avaliação ambiental necessária
          </p>
          <p className="text-sm text-red-700">{categorias.join(', ')}</p>
        </div>
      )}
      {ocorrenciasCriticas.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-red-800">
            Ocorrências de alta criticidade ({ocorrenciasCriticas.length})
          </p>
          {ocorrenciasCriticas.map((o) => (
            <p key={o.id} className="text-sm text-red-700">
              {o.tipo || 'Ocorrência'} — {o.descricao || 'sem descrição'}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}
