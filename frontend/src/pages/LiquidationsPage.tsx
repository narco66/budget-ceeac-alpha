import { useQuery } from '@tanstack/react-query'
import { api, ApiError } from '../api/client'
import type { ApiSuccess } from '../api/types'
import { EmptyState, ErrorState, ForbiddenState, LoadingState } from '../components/States'
import { formatXaf } from '../lib/money'

type Liquidation = {
  id: string
  reference: string
  status: string
  amount_xaf: string
  invoice_number: string | null
  supplier_label: string | null
  commitment: { reference: string; object: string } | null
  payment_order: { reference: string; status: string } | null
  banner: { current_step: string | null }
}

export function LiquidationsPage() {
  const query = useQuery({
    queryKey: ['liquidations'],
    retry: false,
    queryFn: () => api<ApiSuccess<Liquidation[]>>('/api/v1/liquidations'),
  })

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-serif text-3xl text-navy-900">Liquidations</h1>
        <p className="mt-1 text-sm text-slate-600">
          La liquidation constate la dette après service fait. Le cumul visé ne dépasse pas l’engagement net. Le visa du contrôleur financier ouvre l’ordonnancement.
        </p>
      </header>
      {query.isLoading && <LoadingState label="Chargement des liquidations…" />}
      {query.error instanceof ApiError && query.error.status === 403 && <ForbiddenState />}
      {query.error instanceof ApiError && query.error.status !== 403 && (
        <ErrorState message={query.error.message} onRetry={() => void query.refetch()} />
      )}
      {query.data && query.data.data.length === 0 && (
        <EmptyState
          title="Aucune liquidation"
          description="Aucun engagement visé n’a ouvert de dossier. Les factures, retenues et certifications apparaîtront ici. Aucun montant n’est simulé."
        />
      )}
      {query.data && query.data.data.length > 0 && (
        <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Liquidations</caption>
            <thead className="bg-slate-50 text-xs tracking-wide text-slate-500 uppercase">
              <tr>
                <th className="px-4 py-3">Référence</th>
                <th className="px-4 py-3">Engagement</th>
                <th className="px-4 py-3">Facture</th>
                <th className="px-4 py-3">Étape</th>
                <th className="px-4 py-3">Net</th>
              </tr>
            </thead>
            <tbody>
              {query.data.data.map((liquidation) => (
                <tr key={liquidation.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium">{liquidation.reference}</td>
                  <td className="px-4 py-3">{liquidation.commitment?.reference ?? '—'}</td>
                  <td className="px-4 py-3">{liquidation.invoice_number ?? '—'}</td>
                  <td className="px-4 py-3">{liquidation.banner.current_step ?? liquidation.status}</td>
                  <td className="px-4 py-3">{formatXaf(liquidation.amount_xaf)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
