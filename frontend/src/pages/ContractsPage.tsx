import { useQuery } from '@tanstack/react-query'
import { api, ApiError } from '../api/client'
import type { ApiSuccess } from '../api/types'
import { EmptyState, ErrorState, ForbiddenState, LoadingState } from '../components/States'
import { formatXaf } from '../lib/money'

type Contract = {
  id: string
  reference: string
  object: string
  revised_xaf: string
  linked_spend: null
  party: { legal_name: string | null }
}

type Threshold = {
  procedure_code: string
  amount_xaf: string
}

export function ContractsPage() {
  const contracts = useQuery({
    queryKey: ['contracts'],
    retry: false,
    queryFn: () => api<ApiSuccess<Contract[]>>('/api/v1/contracts'),
  })
  const thresholds = useQuery({
    queryKey: ['procurement-thresholds'],
    retry: false,
    queryFn: () => api<ApiSuccess<Threshold[]>>('/api/v1/procurement-thresholds'),
  })

  const blocked = contracts.error instanceof ApiError && contracts.error.status === 403

  return (
    <div className="space-y-4">
      <h1 className="font-serif text-3xl text-navy-900">Achats et marchés</h1>
      {thresholds.data && thresholds.data.data.length === 0 && (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          {thresholds.data.message}
        </p>
      )}
      {contracts.isLoading && <LoadingState label="Chargement des contrats…" />}
      {blocked && <ForbiddenState />}
      {contracts.error instanceof ApiError && contracts.error.status !== 403 && (
        <ErrorState message={contracts.error.message} onRetry={() => void contracts.refetch()} />
      )}
      {contracts.data && contracts.data.data.length === 0 && (
        <EmptyState
          title="Aucun contrat"
          description="Un marché, un contrat, un bon de commande ou une convention se rattache à un tiers actif. Aucune dépense n’y est encore liée, et aucun barème de procédure n’est chargé."
        />
      )}
      {contracts.data && contracts.data.data.length > 0 && (
        <ul className="space-y-2">
          {contracts.data.data.map((contract) => (
            <li key={contract.id} className="rounded-xl bg-white px-4 py-3 shadow-sm">
              <p className="font-medium text-navy-900">{contract.reference}</p>
              <p className="text-sm text-slate-700">{contract.object}</p>
              <p className="text-xs text-slate-500">
                {contract.party.legal_name ?? 'Tiers'} · révisé {formatXaf(contract.revised_xaf)} · dépense rattachée : aucune
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
