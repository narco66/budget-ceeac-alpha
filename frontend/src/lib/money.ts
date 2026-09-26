export function formatXaf(amount: string): string {
  const digits = amount.replace(/\D/g, '').replace(/^0+(?=\d)/, '')
  const grouped = (digits === '' ? '0' : digits).replace(/\B(?=(\d{3})+(?!\d))/g, '\u202f')
  return `${grouped} XAF`
}
