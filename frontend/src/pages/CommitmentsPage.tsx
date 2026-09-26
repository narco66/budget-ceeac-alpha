import { useQuery } from '@tanstack/react-query'
import { api, ApiError } from '../api/client'
import type { ApiSuccess } from '../api/types'
import { EmptyState, ErrorState, ForbiddenState, LoadingState } from '../components/States'
import { formatXaf } from '../lib/money'

type Commitment = {
  id: string
  reference: string
  status: string
  object: string
  amount_xaf: string
  reserved_xaf: string
  committed_xaf: string
  eb_remainder_xaf: string
  need_request: { reference: string } | null
  liquidation: { reference: string; status: string } | null
  banner: { current_step: string | null; expected_role: string | null }
}

const statusLabels: Record<string, string> = {
  in_instruction: 'en instruction',
  at_n1: 'chez le chef de service budget',
  at_director: 'chez le directeur du budget',
  reserved: 'crédit réservé',
  vised: 'visé',
  visa_refused: 'visa refusé',
  returned: 'retourné',
}

export function CommitmentsPage() {
  const query = useQuery({
    queryKey: ['commitments'],
    retry: false,
    queryFn: () => api<ApiSuccess<Commitment[]>>('/api/v1/commitments'),
  })

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-serif text-3xl text-navy-900">Engagements</h1>
        <p className="mt-1 text-sm text-slate-600">
          L’engagement hérite de l’expression de besoin validée. Le directeur du budget réserve le crédit. Le contrôleur financier le transforme en engagement ferme et ouvre la liquidation.
        </p>
      </header>
      {query.isLoading && <LoadingState label="Chargement des engagements…" />}
      {query.error instanceof ApiError && query.error.status === 403 && <ForbiddenState />}
      {query.error instanceof ApiError && query.error.status !== 403 && (
        <ErrorState message={query.error.message} onRetry={() => void query.refetch()} />
      )}
      {query.data && query.data.data.length === 0 && (
        <EmptyState
          title="Aucun engagement"
          description="Aucun dossier n’est en instruction. La réservation et l’engagement ferme apparaîtront ici à partir d’expressions de besoin validées. Aucun montant n’est simulé."
        />
      )}
      {query.data && query.data.data.length > 0 && (
        <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Engagements</caption>
            <thead className="bg-slate-50 text-xs tracking-wide text-slate-500 uppercase">
              <tr>
                <th className="px-4 py-3">Référence</th>
                <th className="px-4 py-3">Objet</th>
                <th className="px-4 py-3">Étape</th>
                <th className="px-4 py-3">Montant</th>
                <th className="px-4 py-3">Réservé</th>
                <th className="px-4 py-3">Engagé</th>
              </tr>
            </thead>
            <tbody>
              {query.data.data.map((commitment) => (
                <tr key={commitment.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium">{commitment.reference}</td>
                  <td className="px-4 py-3">{commitment.object}</td>
                  <td className="px-4 py-3">{commitment.banner.current_step ?? statusLabels[commitment.status] ?? commitment.status}</td>
                  <td className="px-4 py-3">{formatXaf(commitment.amount_xaf)}</td>
                  <td className="px-4 py-3">{formatXaf(commitment.reserved_xaf)}</td>
                  <td className="px-4 py-3">{formatXaf(commitment.committed_xaf)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
