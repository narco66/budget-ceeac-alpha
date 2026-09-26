import { useQuery } from '@tanstack/react-query'
import { api, ApiError } from '../api/client'
import type { ApiSuccess, AuditEvent, PaginationMeta } from '../api/types'
import { EmptyState, ErrorState, ForbiddenState, LoadingState } from '../components/States'

export function AuditPage() {
  const query = useQuery({
    queryKey: ['audit-events'],
    retry: false,
    queryFn: () => api<ApiSuccess<AuditEvent[]> & { meta: PaginationMeta }>('/api/v1/audit-events'),
  })

  return (
    <div className="space-y-4">
      <header>
        <h1 className="font-serif text-3xl text-navy-900">Journal d’audit</h1>
        <p className="mt-1 text-sm text-slate-600">Lecture seule. Les événements ne peuvent pas être modifiés depuis cette interface.</p>
      </header>
      {query.isLoading && <LoadingState />}
      {query.error instanceof ApiError && query.error.status === 403 && <ForbiddenState />}
      {query.error instanceof ApiError && query.error.status !== 403 && (
        <ErrorState message={query.error.message} onRetry={() => void query.refetch()} />
      )}
      {query.data && query.data.data.length === 0 && (
        <EmptyState title="Journal vide" description="Aucune action significative n’a encore été enregistrée." />
      )}
      {query.data && query.data.data.length > 0 && (
        <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Événements d’audit</caption>
            <thead className="bg-slate-50 text-xs tracking-wide text-slate-500 uppercase">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Acteur</th>
              </tr>
            </thead>
            <tbody>
              {query.data.data.map((event) => (
                <tr key={event.id} className="border-t border-slate-100">
                  <td className="px-4 py-3">{event.created_at ? new Date(event.created_at).toLocaleString('fr-FR') : '—'}</td>
                  <td className="px-4 py-3 font-medium">{event.action}</td>
                  <td className="px-4 py-3">{event.actor_id ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
