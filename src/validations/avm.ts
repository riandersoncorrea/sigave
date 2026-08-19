import type { AvmFormValues } from '@/types/avm'

export type AvmFormErrors = Partial<Record<keyof AvmFormValues, string>>

function isNumericValido(valor: string) {
  if (valor.trim() === '') return true
  const numero = Number(valor.replace(',', '.'))
  return Number.isFinite(numero) && numero >= 0
}

export function validateAvmForm(values: AvmFormValues): AvmFormErrors {
  const errors: AvmFormErrors = {}

  if (!values.idAvm.trim()) {
    errors.idAvm = 'ID da AVM é obrigatório.'
  }

  if (!values.nome.trim()) {
    errors.nome = 'Nome da AVM é obrigatório.'
  }

  if (!values.unidadeId) {
    errors.unidadeId = 'Unidade é obrigatória.'
  }

  if (!values.setorId) {
    errors.setorId = 'Setor é obrigatório.'
  }

  if (!values.classeFuncional) {
    errors.classeFuncional = 'Classe funcional é obrigatória.'
  }

  if (!isNumericValido(values.areaM2)) {
    errors.areaM2 = 'Área deve ser um número válido.'
  }

  if (!isNumericValido(values.perimetro)) {
    errors.perimetro = 'Perímetro deve ser um número válido.'
  }

  return errors
}

export function parseNumeroOuNull(valor: string): number | null {
  if (valor.trim() === '') return null
  const numero = Number(valor.replace(',', '.'))
  return Number.isFinite(numero) ? numero : null
}
