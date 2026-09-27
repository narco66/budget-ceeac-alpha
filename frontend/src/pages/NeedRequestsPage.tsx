import { useQuery } from '@tanstack/react-query'
import { api, ApiError } from '../api/client'
import type { ApiSuccess } from '../api/types'
import { EmptyState, ErrorState, ForbiddenState, LoadingState } from '../components/States'
import { formatXaf } from '../lib/money'

type Readiness = {
  can_open: boolean
  reasons: string[]
}

type NeedRequest = {
  id: string
  reference: string
  circuit_code: string
  object: string
  status: string
  amount_xaf: string
  banner: {
    current_step: string | null
    expected_role: string | null
    last_action: string | null
  }
  commitment: { reference: string; status: string } | null
}

const statusLabels: Record<string, string> = {
  draft: 'brouillon',
  in_validation: 'en validation',
  returned: 'retournée',
  rejected: 'rejetée',
  validated: 'validée',
  replaced: 'remplacée',
}

export function NeedRequestsPage() {
  const readiness = useQuery({
    queryKey: ['need-readiness'],
    retry: false,
    queryFn: () => api<ApiSuccess<Readiness>>('/api/v1/need-requests/readiness'),
  })
  const requests = useQuery({
    queryKey: ['need-requests'],
    retry: false,
    queryFn: () => api<ApiSuccess<NeedRequest[]>>('/api/v1/need-requests'),
  })
  const error = [readiness.error, requests.error].find((item) => item instanceof ApiError)

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-serif text-3xl text-navy-900">Expressions de besoin</h1>
        <p className="mt-1 text-sm text-slate-600">
          Le circuit et le classement hors PAP ou PAP viennent de la ligne budgétaire. Le total des sous-lignes est le montant de l’activité.
        </p>
      </header>
      {(readiness.isLoading || requests.isLoading) && <LoadingState label="Chargement des expressions de besoin…" />}
      {error instanceof ApiError && error.status === 403 && <ForbiddenState />}
      {error instanceof ApiError && error.status !== 403 && (
        <ErrorState message={error.message} onRetry={() => void requests.refetch()} />
      )}
      {readiness.data && !readiness.data.data.can_open && (
        <section className="rounded-xl bg-white p-5 shadow-sm">
          <h2 className="font-serif text-xl text-navy-900">Ouverture impossible pour le moment</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
            {readiness.data.data.reasons.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
        </section>
      )}
      {requests.data && requests.data.data.length === 0 && (
        <EmptyState
          title="Aucune expression de besoin"
          description="Aucun dossier n’est en circulation. La fiche officielle est archivée dans la GED au moment de la validation. Aucun montant n’est simulé."
        />
      )}
      {requests.data && requests.data.data.length > 0 && (
        <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Expressions de besoin</caption>
            <thead className="bg-slate-50 text-xs tracking-wide text-slate-500 uppercase">
              <tr>
                <th className="px-4 py-3">Référence</th>
                <th className="px-4 py-3">Objet</th>
                <th className="px-4 py-3">Circuit</th>
                <th className="px-4 py-3">Étape</th>
                <th className="px-4 py-3">Montant</th>
              </tr>
            </thead>
            <tbody>
              {requests.data.data.map((need) => (
                <tr key={need.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium">{need.reference}</td>
                  <td className="px-4 py-3">{need.object}</td>
                  <td className="px-4 py-3">{need.circuit_code}</td>
                  <td className="px-4 py-3">{need.banner.current_step ?? statusLabels[need.status] ?? need.status}</td>
                  <td className="px-4 py-3">{formatXaf(need.amount_xaf)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
