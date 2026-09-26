import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { api, can, ApiError } from '../api/client'
import type { ApiSuccess, PaginationMeta } from '../api/types'
import { useAuth } from '../auth/AuthProvider'
import { EmptyState, ErrorState, LoadingState } from '../components/States'
import { SCOPE_LABEL, type Dashboard } from './dashboard'

export function DashboardPage() {
  const { user } = useAuth()
  const organization = useQuery({
    queryKey: ['organization-units', 'count'],
    enabled: can(user, 'organization.view'),
    queryFn: () => api<ApiSuccess<unknown[]> & { meta: PaginationMeta }>('/api/v1/organization-units?per_page=1'),
  })
  const board = useQuery({
    queryKey: ['dashboard'],
    retry: false,
    queryFn: () => api<ApiSuccess<Dashboard>>('/api/v1/dashboard'),
  })
  const figures = board.data?.data

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-serif text-3xl text-navy-900">Bonjour {user?.name}</h1>
        <p className="mt-1 text-sm text-slate-600">
          {user?.roles?.map((role) => role.name).join(', ') || 'Aucune fonction active.'}
        </p>
      </header>
      <div className="grid gap-4 md:grid-cols-3">
        <Link to="/app/taches" className="rounded-xl bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">Mes tâches</p>
          <p className="mt-2 text-sm text-navy-900">Ouvrir la corbeille de travail</p>
        </Link>
        {can(user, 'organization.view') && (
          <Link to="/app/referentiel" className="rounded-xl bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">Organisation</p>
            <p className="mt-2 text-2xl font-semibold text-navy-900">
              {organization.data?.meta.total ?? '…'}
            </p>
            <p className="text-xs text-slate-500">structures du référentiel de travail</p>
          </Link>
        )}
        {can(user, 'audit.view') && (
          <Link to="/app/audit" className="rounded-xl bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">Audit</p>
            <p className="mt-2 text-sm text-navy-900">Consulter le journal</p>
          </Link>
        )}
      </div>
      {board.isLoading && <LoadingState label="Lecture des écritures…" />}
      {board.error instanceof ApiError && (
        <ErrorState message={board.error.message} onRetry={() => void board.refetch()} />
      )}
      {figures && (
        <p className="text-sm text-slate-600">{SCOPE_LABEL[figures.scope.mode]}</p>
      )}
      {figures && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <Count to="/app/expressions-besoin" label="Expressions de besoin" value={figures.pipeline.need_requests} />
          <Count to="/app/engagements" label="Engagements" value={figures.pipeline.commitments} />
          <Count to="/app/liquidations" label="Liquidations" value={figures.pipeline.liquidations} />
          <Count to="/app/ordonnancements" label="Ordonnancements" value={figures.pipeline.payment_orders} />
          <Count to="/app/paiements" label="Paiements" value={figures.pipeline.payments} />
        </div>
      )}
      {figures && !figures.budget.has_executable && (
        <EmptyState
          title="Aucun crédit exécutoire"
          description="Le taux et les montants consolidés se calculent sur la version exécutoire. Le Budget 2026 n’est pas recopié sur cet écran."
        />
      )}
      <Link to="/app/executif" className="inline-block text-sm font-semibold text-navy-900 underline">
        Ouvrir le tableau exécutif
      </Link>
    </div>
  )
}

function Count({ to, label, value }: { to: string; label: string; value: number }) {
  return (
    <Link to={to} className="rounded-xl bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-navy-900">{value}</p>
    </Link>
  )
}
