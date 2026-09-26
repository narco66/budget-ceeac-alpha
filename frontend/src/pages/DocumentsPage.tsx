import { useQuery } from '@tanstack/react-query'
import { api, ApiError } from '../api/client'
import type { ApiSuccess } from '../api/types'
import { EmptyState, ErrorState, ForbiddenState, LoadingState } from '../components/States'

type DocumentRow = {
  id: string
  title: string
  category: string
  sha256: string
  status: string
  official_pdf: null
}

export function DocumentsPage() {
  const query = useQuery({
    queryKey: ['documents'],
    retry: false,
    queryFn: () => api<ApiSuccess<DocumentRow[]>>('/api/v1/documents'),
  })

  return (
    <div className="space-y-4">
      <h1 className="font-serif text-3xl text-navy-900">GED et documents</h1>
      {query.isLoading && <LoadingState label="Chargement des documents…" />}
      {query.error instanceof ApiError && query.error.status === 403 && <ForbiddenState />}
      {query.error instanceof ApiError && query.error.status !== 403 && (
        <ErrorState message={query.error.message} onRetry={() => void query.refetch()} />
      )}
      {query.data && query.data.data.length === 0 && (
        <EmptyState
          title="Aucun document versé"
          description="Chaque pièce conserve son empreinte SHA-256. Un document scellé ne se remplace pas. Les PDF officiels de la chaîne y sont versés à la validation : aucun acte n’a encore été validé."
        />
      )}
      {query.data && query.data.data.length > 0 && (
        <ul className="space-y-2">
          {query.data.data.map((document) => (
            <li key={document.id} className="rounded-xl bg-white px-4 py-3 shadow-sm">
              <p className="font-medium text-navy-900">{document.title}</p>
              <p className="text-xs text-slate-500">
                {document.category} · {document.status} · {document.sha256.slice(0, 12)}…
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
