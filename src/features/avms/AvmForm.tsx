import { useEffect, useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { CLASSE_FUNCIONAL_OPTIONS, STATUS_OPTIONS } from '@/constants/avm'
import { checkIdAvmDisponivel, createAvm, updateAvm } from '@/services/avms'
import { listSetores, type Setor, type Unidade } from '@/services/organizacao'
import type {
  AvmComRelacoes,
  AvmFormValues,
  ClasseFuncional,
} from '@/types/avm'
import {
  parseNumeroOuNull,
  validateAvmForm,
  type AvmFormErrors,
} from '@/validations/avm'

const VALORES_VAZIOS: AvmFormValues = {
  idAvm: '',
  nome: '',
  unidadeId: '',
  setorId: '',
  subsetor: '',
  localizacaoDescritiva: '',
  classeFuncional: '',
  areaM2: '',
  perimetro: '',
  responsavel: '',
  status: 'NAO_INICIADA',
}

interface AvmFormProps {
  mode: 'create' | 'edit'
  avmId?: string
  initialValues?: AvmFormValues
  unidades: Unidade[]
  onSuccess: (avm: AvmComRelacoes) => void
  onCancel: () => void
}

export function AvmForm({
  mode,
  avmId,
  initialValues,
  unidades,
  onSuccess,
  onCancel,
}: AvmFormProps) {
  const [values, setValues] = useState<AvmFormValues>(
    initialValues ?? VALORES_VAZIOS,
  )
  const [setores, setSetores] = useState<Setor[]>([])
  const [errors, setErrors] = useState<AvmFormErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [erroGeral, setErroGeral] = useState<string | null>(null)

  useEffect(() => {
    if (!values.unidadeId) return
    let ativo = true
    listSetores(values.unidadeId).then((lista) => {
      if (ativo) setSetores(lista)
    })
    return () => {
      ativo = false
    }
  }, [values.unidadeId])

  function setCampo<K extends keyof AvmFormValues>(
    campo: K,
    valor: AvmFormValues[K],
  ) {
    setValues((atual) => ({ ...atual, [campo]: valor }))
  }

  async function handleIdAvmBlur() {
    if (!values.idAvm.trim()) return
    const disponivel = await checkIdAvmDisponivel(
      values.idAvm.trim(),
      mode === 'edit' ? avmId : undefined,
    )
    if (!disponivel) {
      setErrors((atual) => ({
        ...atual,
        idAvm: 'Já existe uma AVM cadastrada com esse ID.',
      }))
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setErroGeral(null)

    const validationErrors = validateAvmForm(values)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setSubmitting(true)
    try {
      const disponivel = await checkIdAvmDisponivel(
        values.idAvm.trim(),
        mode === 'edit' ? avmId : undefined,
      )
      if (!disponivel) {
        setErrors({ idAvm: 'Já existe uma AVM cadastrada com esse ID.' })
        return
      }

      const payload = {
        id_avm: values.idAvm.trim(),
        nome: values.nome.trim(),
        unidade_id: values.unidadeId,
        setor_id: values.setorId,
        subsetor: values.subsetor.trim() || null,
        localizacao_descritiva: values.localizacaoDescritiva.trim() || null,
        // validateAvmForm já garante que classeFuncional não está vazio
        // neste ponto.
        classe_funcional: values.classeFuncional as ClasseFuncional,
        area_m2: parseNumeroOuNull(values.areaM2),
        perimetro: parseNumeroOuNull(values.perimetro),
        responsavel: values.responsavel.trim() || null,
        status: values.status,
      }

      const avm =
        mode === 'create'
          ? await createAvm(payload)
          : await updateAvm(avmId as string, payload)

      onSuccess(avm)
    } catch (error) {
      setErroGeral(
        error instanceof Error ? error.message : 'Erro ao salvar a AVM.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        id="idAvm"
        label="ID da AVM"
        required
        value={values.idAvm}
        onChange={(event) => setCampo('idAvm', event.target.value)}
        onBlur={handleIdAvmBlur}
      />
      {errors.idAvm && <p className="text-sm text-red-600">{errors.idAvm}</p>}

      <Input
        id="nome"
        label="Nome da AVM"
        required
        value={values.nome}
        onChange={(event) => setCampo('nome', event.target.value)}
      />
      {errors.nome && <p className="text-sm text-red-600">{errors.nome}</p>}

      <Select
        id="unidadeId"
        label="Unidade"
        required
        value={values.unidadeId}
        onChange={(event) => {
          setCampo('unidadeId', event.target.value)
          setCampo('setorId', '')
          setSetores([])
        }}
      >
        <option value="">Selecione</option>
        {unidades.map((unidade) => (
          <option key={unidade.id} value={unidade.id}>
            {unidade.nome}
          </option>
        ))}
      </Select>
      {errors.unidadeId && (
        <p className="text-sm text-red-600">{errors.unidadeId}</p>
      )}

      <Select
        id="setorId"
        label="Setor"
        required
        value={values.setorId}
        disabled={!values.unidadeId}
        onChange={(event) => setCampo('setorId', event.target.value)}
      >
        <option value="">Selecione</option>
        {setores.map((setor) => (
          <option key={setor.id} value={setor.id}>
            {setor.nome}
          </option>
        ))}
      </Select>
      {errors.setorId && (
        <p className="text-sm text-red-600">{errors.setorId}</p>
      )}

      <Input
        id="subsetor"
        label="Subsetor"
        value={values.subsetor}
        onChange={(event) => setCampo('subsetor', event.target.value)}
      />

      <Input
        id="localizacaoDescritiva"
        label="Localização descritiva"
        value={values.localizacaoDescritiva}
        onChange={(event) =>
          setCampo('localizacaoDescritiva', event.target.value)
        }
      />

      <Select
        id="classeFuncional"
        label="Classe funcional"
        required
        value={values.classeFuncional}
        onChange={(event) =>
          setCampo(
            'classeFuncional',
            event.target.value as AvmFormValues['classeFuncional'],
          )
        }
      >
        <option value="">Selecione</option>
        {CLASSE_FUNCIONAL_OPTIONS.map((opcao) => (
          <option key={opcao.value} value={opcao.value}>
            {opcao.label}
          </option>
        ))}
      </Select>
      {errors.classeFuncional && (
        <p className="text-sm text-red-600">{errors.classeFuncional}</p>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Input
            id="areaM2"
            label="Área (m²)"
            inputMode="decimal"
            value={values.areaM2}
            onChange={(event) => setCampo('areaM2', event.target.value)}
          />
          {errors.areaM2 && (
            <p className="mt-1 text-sm text-red-600">{errors.areaM2}</p>
          )}
        </div>
        <div>
          <Input
            id="perimetro"
            label="Perímetro (m)"
            inputMode="decimal"
            value={values.perimetro}
            onChange={(event) => setCampo('perimetro', event.target.value)}
          />
          {errors.perimetro && (
            <p className="mt-1 text-sm text-red-600">{errors.perimetro}</p>
          )}
        </div>
      </div>

      <Input
        id="responsavel"
        label="Responsável"
        value={values.responsavel}
        onChange={(event) => setCampo('responsavel', event.target.value)}
      />

      <Select
        id="status"
        label="Status"
        value={values.status}
        onChange={(event) =>
          setCampo('status', event.target.value as AvmFormValues['status'])
        }
      >
        {STATUS_OPTIONS.map((opcao) => (
          <option key={opcao.value} value={opcao.value}>
            {opcao.label}
          </option>
        ))}
      </Select>

      {erroGeral && <p className="text-sm text-red-600">{erroGeral}</p>}

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancelar
        </Button>
        <Button type="submit" className="flex-1" disabled={submitting}>
          {submitting ? 'Salvando…' : 'Salvar'}
        </Button>
      </div>
    </form>
  )
}
