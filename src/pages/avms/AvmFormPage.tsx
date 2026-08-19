import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AvmForm } from '@/features/avms/AvmForm'
import { getAvm } from '@/services/avms'
import { listUnidades, type Unidade } from '@/services/organizacao'
import type { AvmFormValues } from '@/types/avm'

function paraFormValues(
  avm: NonNullable<Awaited<ReturnType<typeof getAvm>>>,
): AvmFormValues {
  return {
    idAvm: avm.id_avm,
    nome: avm.nome,
    unidadeId: avm.unidade_id,
    setorId: avm.setor_id,
    subsetor: avm.subsetor ?? '',
    localizacaoDescritiva: avm.localizacao_descritiva ?? '',
    classeFuncional: avm.classe_funcional,
    areaM2: avm.area_m2 != null ? String(avm.area_m2) : '',
    perimetro: avm.perimetro != null ? String(avm.perimetro) : '',
    responsavel: avm.responsavel ?? '',
    status: avm.status,
  }
}

export function AvmFormPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const mode = id ? 'edit' : 'create'

  const [unidades, setUnidades] = useState<Unidade[]>([])
  const [initialValues, setInitialValues] = useState<AvmFormValues | undefined>(
    undefined,
  )
  const [carregando, setCarregando] = useState(mode === 'edit')
  const [naoEncontrada, setNaoEncontrada] = useState(false)

  useEffect(() => {
    listUnidades().then(setUnidades)
  }, [])

  useEffect(() => {
    if (mode !== 'edit' || !id) return
    getAvm(id)
      .then((avm) => {
        if (!avm) {
          setNaoEncontrada(true)
          return
        }
        setInitialValues(paraFormValues(avm))
      })
      .finally(() => setCarregando(false))
  }, [mode, id])

  if (carregando) {
    return <p className="text-sm text-neutral-500">Carregando…</p>
  }

  if (naoEncontrada) {
    return (
      <p className="rounded-xl bg-white p-6 text-center text-sm text-neutral-500 shadow-sm">
        AVM não encontrada ou você não tem acesso a ela.
      </p>
    )
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4">
      <h1 className="text-xl font-bold text-neutral-900">
        {mode === 'create' ? 'Nova AVM' : 'Editar AVM'}
      </h1>
      <div className="rounded-xl bg-white p-5 shadow-sm">
        <AvmForm
          mode={mode}
          avmId={id}
          initialValues={initialValues}
          unidades={unidades}
          onSuccess={(avm) => navigate(`/avms/${avm.id}`)}
          onCancel={() => navigate(-1)}
        />
      </div>
    </div>
  )
}
