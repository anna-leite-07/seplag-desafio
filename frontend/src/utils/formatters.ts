const FALLBACK_PADRAO = 'Informação não disponível';

export function formatarMoeda(valor: string | number | null | undefined): string {
  if (valor === null || valor === undefined || valor === '') return FALLBACK_PADRAO;
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(valor));
}

export function formatarData(valor: string | null | undefined): string {
  if (!valor) return FALLBACK_PADRAO;
  return new Date(valor).toLocaleString('pt-BR');
}

export function formatarPercentual(valor: number | null | undefined): string {
  if (valor === null || valor === undefined) return FALLBACK_PADRAO;
  return `${valor}%`;
}

export function formatarValorExibicao(
  valor: string | number | null | undefined,
  tipo: 'texto' | 'moeda' = 'texto'
): string {
  if (valor === null || valor === undefined || valor === '') return FALLBACK_PADRAO;
  if (tipo === 'moeda') return formatarMoeda(valor);
  return String(valor);
}

export function limitarPercentual(valor: number): number {
  return Math.min(Math.max(valor, 0), 100);
}