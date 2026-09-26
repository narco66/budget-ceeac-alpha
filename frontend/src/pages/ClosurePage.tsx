import { useQuery } from '@tanstack/react-query'
import { api, ApiError } from '../api/client'
import type { ApiSuccess } from '../api/types'
import { EmptyState, ErrorState, ForbiddenState, LoadingState } from '../components/States'

type FiscalYear = {
  id: string
  year: number
  status: string
  status_label: string
}

export function ClosurePage() {
  const query = useQuery({
    queryKey: ['fiscal-years'],
    retry: false,
    queryFn: () => api<ApiSuccess<FiscalYear[]>>('/api/v1/fiscal-years'),
  })

  const current = query.data?.data.find((year) => year.year === 2026) ?? query.data?.data[0]
  const inClosure = current?.status === 'closed'

  return (
    <div className="space-y-4">
      <h1 className="font-serif text-3xl text-navy-900">Clôture budgétaire</h1>
      {query.isLoading && <LoadingState label="Chargement de l’exercice…" />}
      {query.error instanceof ApiError && query.error.status === 403 && <ForbiddenState />}
      {query.error instanceof ApiError && query.error.status !== 403 && (
        <ErrorState message={query.error.message} onRetry={() => void query.refetch()} />
      )}
      {current && !inClosure && (
        <EmptyState
          title="La clôture n’est pas ouverte"
          description={`L’exercice ${current.year} est en ${current.status_label}. Aucun rapprochement bancaire ni solde de trésorerie n’est chargé.`}
        />
      )}
      {current && inClosure && (
        <EmptyState
          title={`Exercice ${current.year} en clôture`}
          description="Aucun rapprochement bancaire n’est chargé. Les écritures de clôture ne sont pas simulées."
        />
      )}
    </div>
  )
}
