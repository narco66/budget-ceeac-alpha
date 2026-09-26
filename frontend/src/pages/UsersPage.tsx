import { useQuery } from '@tanstack/react-query'
import { api, ApiError } from '../api/client'
import type { ApiSuccess, PaginationMeta, SessionUser } from '../api/types'
import { EmptyState, ErrorState, ForbiddenState, LoadingState } from '../components/States'

export function UsersPage() {
  const query = useQuery({
    queryKey: ['users'],
    retry: false,
    queryFn: () => api<ApiSuccess<SessionUser[]> & { meta: PaginationMeta }>('/api/v1/users'),
  })

  return (
    <div className="space-y-4">
      <h1 className="font-serif text-3xl text-navy-900">Utilisateurs et rôles</h1>
      {query.isLoading && <LoadingState />}
      {query.error instanceof ApiError && query.error.status === 403 && <ForbiddenState />}
      {query.error instanceof ApiError && query.error.status !== 403 && (
        <ErrorState message={query.error.message} onRetry={() => void query.refetch()} />
      )}
      {query.data && query.data.data.length === 0 && (
        <EmptyState title="Aucun utilisateur" description="Le référentiel des comptes est vide." />
      )}
      {query.data && query.data.data.length > 0 && (
        <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Comptes habilités</caption>
            <thead className="bg-slate-50 text-xs tracking-wide text-slate-500 uppercase">
              <tr>
                <th className="px-4 py-3">Nom</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Rôles</th>
              </tr>
            </thead>
            <tbody>
              {query.data.data.map((account) => (
                <tr key={account.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium">{account.name}</td>
                  <td className="px-4 py-3">{account.email}</td>
                  <td className="px-4 py-3">{account.roles?.map((role) => role.name).join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
