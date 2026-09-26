import { useQuery } from '@tanstack/react-query'
import { api, ApiError } from '../api/client'
import type { ApiSuccess } from '../api/types'
import { EmptyState, ErrorState, ForbiddenState, LoadingState } from '../components/States'

type Party = {
  id: string
  legal_name: string
  party_type: string
  status: string
  country: string | null
}

const TYPE_LABEL: Record<string, string> = {
  enterprise: 'Entreprise',
  supplier: 'Fournisseur',
  consultant: 'Consultant',
  beneficiary: 'Bénéficiaire',
}

export function PartiesPage() {
  const query = useQuery({
    queryKey: ['parties'],
    retry: false,
    queryFn: () => api<ApiSuccess<Party[]>>('/api/v1/parties'),
  })

  return (
    <div className="space-y-4">
      <h1 className="font-serif text-3xl text-navy-900">Tiers et fournisseurs</h1>
      {query.isLoading && <LoadingState label="Chargement des tiers…" />}
      {query.error instanceof ApiError && query.error.status === 403 && <ForbiddenState />}
      {query.error instanceof ApiError && query.error.status !== 403 && (
        <ErrorState message={query.error.message} onRetry={() => void query.refetch()} />
      )}
      {query.data && query.data.data.length === 0 && (
        <EmptyState
          title="Aucun tiers enregistré"
          description="La fiche unique reçoit la raison sociale, le type et, plus tard, les comptes bancaires versionnés. Aucun fournisseur n’est inventé."
        />
      )}
      {query.data && query.data.data.length > 0 && (
        <ul className="space-y-2">
          {query.data.data.map((party) => (
            <li key={party.id} className="rounded-xl bg-white px-4 py-3 shadow-sm">
              <p className="font-medium text-navy-900">{party.legal_name}</p>
              <p className="text-xs text-slate-500">
                {TYPE_LABEL[party.party_type] ?? party.party_type} · {party.status}
                {party.country ? ` · ${party.country}` : ''}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
