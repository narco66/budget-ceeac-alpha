import { useQuery } from '@tanstack/react-query'
import { api, ApiError } from '../api/client'
import type { ApiSuccess } from '../api/types'
import { EmptyState, ErrorState, ForbiddenState, LoadingState } from '../components/States'

type Finding = {
  id: string
  title: string
  observation: string
  status: string
}

export function FindingsPage() {
  const query = useQuery({
    queryKey: ['findings'],
    retry: false,
    queryFn: () => api<ApiSuccess<Finding[]>>('/api/v1/findings'),
  })

  return (
    <div className="space-y-4">
      <h1 className="font-serif text-3xl text-navy-900">Contrôle interne</h1>
      <p className="text-sm text-slate-600">
        Les contrôles de crédit, de séparation des tâches et de plafond sont déjà bloquants dans la chaîne de dépense.
        Cette liste ne contient que les observations enregistrées.
      </p>
      {query.isLoading && <LoadingState label="Chargement des observations…" />}
      {query.error instanceof ApiError && query.error.status === 403 && <ForbiddenState />}
      {query.error instanceof ApiError && query.error.status !== 403 && (
        <ErrorState message={query.error.message} onRetry={() => void query.refetch()} />
      )}
      {query.data && query.data.data.length === 0 && (
        <EmptyState
          title="Aucune observation"
          description="Aucune recommandation n’est ouverte. Aucun plan d’action fictif n’est affiché."
        />
      )}
      {query.data && query.data.data.length > 0 && (
        <ul className="space-y-2">
          {query.data.data.map((finding) => (
            <li key={finding.id} className="rounded-xl bg-white px-4 py-3 shadow-sm">
              <p className="font-medium text-navy-900">{finding.title}</p>
              <p className="text-sm text-slate-700">{finding.observation}</p>
              <p className="text-xs text-slate-500">{finding.status}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
