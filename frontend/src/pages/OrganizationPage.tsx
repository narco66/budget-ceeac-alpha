import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { api, ApiError } from '../api/client'
import type { ApiSuccess, OrganizationUnit, PaginationMeta } from '../api/types'
import { EmptyState, ErrorState, ForbiddenState, LoadingState } from '../components/States'

export function OrganizationPage() {
  const [search, setSearch] = useState('')
  const [applied, setApplied] = useState('')
  const query = useQuery({
    queryKey: ['organization-units', applied],
    queryFn: () => {
      const params = new URLSearchParams({ per_page: '50' })
      if (applied) params.set('search', applied)
      return api<ApiSuccess<OrganizationUnit[]> & { meta: PaginationMeta }>(`/api/v1/organization-units?${params}`)
    },
    retry: false,
  })

  return (
    <div className="space-y-4">
      <header>
        <h1 className="font-serif text-3xl text-navy-900">Organisation de la Commission</h1>
        <p className="mt-1 text-sm text-slate-600">
          Version de travail de juin 2026. Les codes applicatifs restent à valider par l’autorité compétente.
        </p>
      </header>
      <form
        className="flex gap-2"
        onSubmit={(event) => {
          event.preventDefault()
          setApplied(search.trim())
        }}
      >
        <label className="sr-only" htmlFor="org-search">Rechercher une structure</label>
        <input
          id="org-search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Code ou libellé"
          className="w-full max-w-md rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
        />
        <button type="submit" className="rounded-lg bg-navy-900 px-4 py-2 text-sm font-semibold text-white">Rechercher</button>
      </form>
      {query.isLoading && <LoadingState label="Chargement des structures…" />}
      {query.error instanceof ApiError && query.error.status === 403 && <ForbiddenState />}
      {query.error instanceof ApiError && query.error.status !== 403 && (
        <ErrorState message={query.error.message} onRetry={() => void query.refetch()} />
      )}
      {query.data && query.data.data.length === 0 && (
        <EmptyState title="Aucun résultat" description="Aucune structure ne correspond à cette recherche." />
      )}
      {query.data && query.data.data.length > 0 && (
        <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Structures de la Commission de la CEEAC</caption>
            <thead className="bg-slate-50 text-xs tracking-wide text-slate-500 uppercase">
              <tr>
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Libellé</th>
                <th className="px-4 py-3">Niveau</th>
                <th className="px-4 py-3">Type</th>
              </tr>
            </thead>
            <tbody>
              {query.data.data.map((unit) => (
                <tr key={unit.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium text-navy-900">{unit.code}</td>
                  <td className="px-4 py-3">{unit.name}</td>
                  <td className="px-4 py-3">{unit.level}</td>
                  <td className="px-4 py-3">{unit.unit_type}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="px-4 py-3 text-xs text-slate-500">
            {query.data.meta.total} {query.data.meta.total > 1 ? 'structures' : 'structure'}
          </p>
        </div>
      )}
    </div>
  )
}
