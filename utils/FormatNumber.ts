export function formatNumber(num?: number | string): string {
  if (num === null || num === undefined || num === '') return '-';

  const parts = num.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}