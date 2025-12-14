export function fmtCurrency(v) {
  return Number(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}
export function fmtDate(iso) {
  const d = new Date(iso)
  return d.toLocaleDateString('pt-BR')
}
export function monthTicks() {
  const now = new Date()
  const months = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    months.push(d.toLocaleString('pt-BR', { month: 'short' }))
  }
  return months
}
export function sum(arr) { return arr.reduce((a, b) => a + b, 0) }
export function clamp(n, min, max) { return Math.max(min, Math.min(max, n)) }
