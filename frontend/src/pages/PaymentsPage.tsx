import { useQuery } from '@tanstack/react-query'
import { api, ApiError } from '../api/client'
import type { ApiSuccess } from '../api/types'
import { EmptyState, ErrorState, ForbiddenState, LoadingState } from '../components/States'
import { formatXaf } from '../lib/money'

type Payment = {
  id: string
  reference: string
  status: string
  amount_xaf: string
  mode: string | null
  payment_order: { reference: string } | null
  banner: { current_step: string | null }
}

const modes: Record<string, string> = {
  virement: 'virement',
  cheque: 'chèque',
  caisse: 'caisse',
}

export function PaymentsPage() {
  const query = useQuery({
    queryKey: ['payments'],
    retry: false,
    queryFn: () => api<ApiSuccess<Payment[]>>('/api/v1/payments'),
  })

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-serif text-3xl text-navy-900">Paiements</h1>
        <p className="mt-1 text-sm text-slate-600">
          Le paiement suit la prise en charge de l’ordre. Le comptable prépare le virement, le chèque ou la caisse. Le chef comptable contrôle. L’agent comptable autorise et exécute, preuve à l’appui.
        </p>
      </header>
      {query.isLoading && <LoadingState label="Chargement des paiements…" />}
      {query.error instanceof ApiError && query.error.status === 403 && <ForbiddenState />}
      {query.error instanceof ApiError && query.error.status !== 403 && (
        <ErrorState message={query.error.message} onRetry={() => void query.refetch()} />
      )}
      {query.data && query.data.data.length === 0 && (
        <EmptyState
          title="Aucun paiement"
          description="Aucun ordonnancement pris en charge n’a ouvert de décaissement. L’avis de paiement est archivé à l’exécution. Aucun montant n’est simulé."
        />
      )}
      {query.data && query.data.data.length > 0 && (
        <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Paiements</caption>
            <thead className="bg-slate-50 text-xs tracking-wide text-slate-500 uppercase">
              <tr>
                <th className="px-4 py-3">Référence</th>
                <th className="px-4 py-3">Ordre</th>
                <th className="px-4 py-3">Mode</th>
                <th className="px-4 py-3">Étape</th>
                <th className="px-4 py-3">Montant</th>
              </tr>
            </thead>
            <tbody>
              {query.data.data.map((payment) => (
                <tr key={payment.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium">{payment.reference}</td>
                  <td className="px-4 py-3">{payment.payment_order?.reference ?? '—'}</td>
                  <td className="px-4 py-3">{payment.mode ? (modes[payment.mode] ?? payment.mode) : '—'}</td>
                  <td className="px-4 py-3">{payment.banner.current_step ?? payment.status}</td>
                  <td className="px-4 py-3">{formatXaf(payment.amount_xaf)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
