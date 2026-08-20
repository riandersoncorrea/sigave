export type CsvValue = string | number | boolean | null | undefined

const BOM_UTF8 = '﻿'

function escapeCsvValue(value: CsvValue): string {
  if (value === null || value === undefined) return ''
  const str = String(value)
  if (/[",;\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

export function buildCsv(headers: string[], rows: CsvValue[][]): string {
  const linhas = [headers, ...rows].map((linha) =>
    linha.map(escapeCsvValue).join(','),
  )
  return linhas.join('\r\n')
}

// BOM UTF-8 no início: sem ele, o Excel abre acentos em português como
// caracteres corrompidos.
export function downloadCsv(filename: string, csvContent: string): void {
  const blob = new Blob([BOM_UTF8 + csvContent], {
    type: 'text/csv;charset=utf-8;',
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

function itemParaTexto(item: unknown): string {
  return typeof item === 'object' && item !== null
    ? JSON.stringify(item)
    : String(item)
}

export function jsonParaCsv(valor: unknown): string {
  if (valor === null || valor === undefined) return ''
  if (Array.isArray(valor)) return valor.map(itemParaTexto).join('; ')
  if (typeof valor === 'object') return JSON.stringify(valor)
  return String(valor)
}
