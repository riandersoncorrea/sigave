import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import {
  NIVEL_BAIXA_MEDIA_ALTA_MUITO_ALTA_OPTIONS,
  VEGETACAO_ALTURA_OPTIONS,
  VEGETACAO_ARVORES_OPTIONS,
  VEGETACAO_COBERTURA_OPTIONS,
  VEGETACAO_INVASORAS_OPTIONS,
  VEGETACAO_TIPO_OPTIONS,
  VEGETACAO_UNIFORMIDADE_OPTIONS,
} from '@/constants/levantamento'
import { WizardNav } from '@/features/levantamento/WizardNav'
import { WizardProgress } from '@/features/levantamento/WizardProgress'
import { useDraftStep } from '@/features/levantamento/useDraftStep'
import { useLevantamentoContext } from '@/features/levantamento/useLevantamentoContext'
import { getOrCreateVegetacao, updateVegetacao } from '@/services/vegetacao'

interface VegetacaoValues {
  tipo: string
  vegetacaoPredominante: string
  especie: string
  cobertura: string
  altura: string
  densidade: string
  velocidadeCrescimento: string
  uniformidade: string
  invasoras: string
  arvores: string
  observacoes: string
}

const VAZIO: VegetacaoValues = {
  tipo: '',
  vegetacaoPredominante: '',
  especie: '',
  cobertura: '',
  altura: '',
  densidade: '',
  velocidadeCrescimento: '',
  uniformidade: '',
  invasoras: '',
  arvores: '',
  observacoes: '',
}

function CampoSelect({
  id,
  label,
  value,
  options,
  onChange,
}: {
  id: string
  label: string
  value: string
  options: { value: string; label: string }[]
  onChange: (value: string) => void
}) {
  return (
    <Select
      id={id}
      label={label}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    >
      <option value="">Selecione</option>
      {options.map((opcao) => (
        <option key={opcao.value} value={opcao.value}>
          {opcao.label}
        </option>
      ))}
    </Select>
  )
}

export function VegetacaoStep() {
  const { levantamento, avm } = useLevantamentoContext()

  const { values, setValues, status, saveNow } = useDraftStep<VegetacaoValues>({
    storageKey: `levantamento:${levantamento.id}:vegetacao`,
    emptyValue: VAZIO,
    load: async () => {
      const v = await getOrCreateVegetacao(levantamento.id)
      return {
        tipo: v.tipo ?? '',
        vegetacaoPredominante: v.vegetacao_predominante ?? '',
        especie: v.especie ?? '',
        cobertura: v.cobertura ?? '',
        altura: v.altura ?? '',
        densidade: v.densidade ?? '',
        velocidadeCrescimento: v.velocidade_crescimento ?? '',
        uniformidade: v.uniformidade ?? '',
        invasoras: v.invasoras ?? '',
        arvores: v.arvores ?? '',
        observacoes: v.observacoes ?? '',
      }
    },
    save: async (v) => {
      await updateVegetacao(levantamento.id, {
        tipo: v.tipo || null,
        vegetacao_predominante: v.vegetacaoPredominante || null,
        especie: v.especie || null,
        cobertura: v.cobertura || null,
        altura: v.altura || null,
        densidade: v.densidade || null,
        velocidade_crescimento: v.velocidadeCrescimento || null,
        uniformidade: v.uniformidade || null,
        invasoras: v.invasoras || null,
        arvores: v.arvores || null,
        observacoes: v.observacoes || null,
      })
    },
  })

  function set<K extends keyof VegetacaoValues>(campo: K, valor: string) {
    setValues({ ...values, [campo]: valor })
  }

  return (
    <div className="flex flex-col gap-4">
      <WizardProgress currentSlug="vegetacao" />

      <div className="flex flex-col gap-4 rounded-xl bg-white p-5 shadow-sm">
        <CampoSelect
          id="tipo"
          label="Tipo"
          value={values.tipo}
          options={VEGETACAO_TIPO_OPTIONS}
          onChange={(v) => set('tipo', v)}
        />
        <CampoSelect
          id="vegetacaoPredominante"
          label="Vegetação predominante"
          value={values.vegetacaoPredominante}
          options={VEGETACAO_TIPO_OPTIONS}
          onChange={(v) => set('vegetacaoPredominante', v)}
        />
        <Input
          id="especie"
          label="Espécie (opcional)"
          value={values.especie}
          onChange={(event) => set('especie', event.target.value)}
        />
        <CampoSelect
          id="cobertura"
          label="Cobertura"
          value={values.cobertura}
          options={VEGETACAO_COBERTURA_OPTIONS}
          onChange={(v) => set('cobertura', v)}
        />
        <CampoSelect
          id="altura"
          label="Altura"
          value={values.altura}
          options={VEGETACAO_ALTURA_OPTIONS}
          onChange={(v) => set('altura', v)}
        />
        <CampoSelect
          id="densidade"
          label="Densidade"
          value={values.densidade}
          options={NIVEL_BAIXA_MEDIA_ALTA_MUITO_ALTA_OPTIONS}
          onChange={(v) => set('densidade', v)}
        />
        <CampoSelect
          id="velocidadeCrescimento"
          label="Velocidade de crescimento"
          value={values.velocidadeCrescimento}
          options={NIVEL_BAIXA_MEDIA_ALTA_MUITO_ALTA_OPTIONS}
          onChange={(v) => set('velocidadeCrescimento', v)}
        />
        <CampoSelect
          id="uniformidade"
          label="Uniformidade"
          value={values.uniformidade}
          options={VEGETACAO_UNIFORMIDADE_OPTIONS}
          onChange={(v) => set('uniformidade', v)}
        />
        <CampoSelect
          id="invasoras"
          label="Invasoras"
          value={values.invasoras}
          options={VEGETACAO_INVASORAS_OPTIONS}
          onChange={(v) => set('invasoras', v)}
        />
        <CampoSelect
          id="arvores"
          label="Árvores"
          value={values.arvores}
          options={VEGETACAO_ARVORES_OPTIONS}
          onChange={(v) => set('arvores', v)}
        />
        <Textarea
          id="observacoes"
          label="Observações"
          value={values.observacoes}
          onChange={(event) => set('observacoes', event.target.value)}
        />
      </div>

      <WizardNav
        levantamentoId={levantamento.id}
        avmId={avm.id}
        currentSlug="vegetacao"
        saveStatus={status}
        onContinuar={saveNow}
      />
    </div>
  )
}
