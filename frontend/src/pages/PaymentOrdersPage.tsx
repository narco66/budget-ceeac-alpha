import { useQuery } from '@tanstack/react-query'
import { api, ApiError } from '../api/client'
import type { ApiSuccess } from '../api/types'
import { EmptyState, ErrorState, ForbiddenState, LoadingState } from '../components/States'
import { formatXaf } from '../lib/money'

type PaymentOrder = {
  id: string
  reference: string
  status: string
  amount_xaf: string
  authorizer_role_code: string | null
  beneficiary_label: string | null
  liquidation: { reference: string } | null
  banner: { current_step: string | null }
}

const authorizers: Record<string, string> = {
  secretaire_general: 'Secrétaire général',
  president: 'Président',
}

export function PaymentOrdersPage() {
  const query = useQuery({
    queryKey: ['payment-orders'],
    retry: false,
    queryFn: () => api<ApiSuccess<PaymentOrder[]>>('/api/v1/payment-orders'),
  })

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-serif text-3xl text-navy-900">Ordonnancements</h1>
        <p className="mt-1 text-sm text-slate-600">
          L’ordonnateur est choisi selon le seuil copié sur l’acte : le Secrétaire général jusqu’à 5&nbsp;000&nbsp;000 XAF inclus, le Président au-delà. La signature transmet l’ordre à l’Agence comptable.
        </p>
      </header>
      {query.isLoading && <LoadingState label="Chargement des ordonnancements…" />}
      {query.error instanceof ApiError && query.error.status === 403 && <ForbiddenState />}
      {query.error instanceof ApiError && query.error.status !== 403 && (
        <ErrorState message={query.error.message} onRetry={() => void query.refetch()} />
      )}
      {query.data && query.data.data.length === 0 && (
        <EmptyState
          title="Aucun ordonnancement"
          description="Aucune liquidation visée n’a ouvert d’ordre. Le seuil, l’ordonnateur et la transmission apparaîtront ici. Aucun montant n’est simulé."
        />
      )}
      {query.data && query.data.data.length > 0 && (
        <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Ordonnancements</caption>
            <thead className="bg-slate-50 text-xs tracking-wide text-slate-500 uppercase">
              <tr>
                <th className="px-4 py-3">Référence</th>
                <th className="px-4 py-3">Liquidation</th>
                <th className="px-4 py-3">Ordonnateur</th>
                <th className="px-4 py-3">Étape</th>
                <th className="px-4 py-3">Montant</th>
              </tr>
            </thead>
            <tbody>
              {query.data.data.map((order) => (
                <tr key={order.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium">{order.reference}</td>
                  <td className="px-4 py-3">{order.liquidation?.reference ?? '—'}</td>
                  <td className="px-4 py-3">{order.authorizer_role_code ? (authorizers[order.authorizer_role_code] ?? order.authorizer_role_code) : '—'}</td>
                  <td className="px-4 py-3">{order.banner.current_step ?? order.status}</td>
                  <td className="px-4 py-3">{formatXaf(order.amount_xaf)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
