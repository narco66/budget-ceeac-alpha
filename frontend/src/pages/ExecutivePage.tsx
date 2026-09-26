import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { api, ApiError } from '../api/client'
import type { ApiSuccess } from '../api/types'
import { EmptyState, ErrorState, LoadingState } from '../components/States'
import { formatXaf } from '../lib/money'
import { SCOPE_LABEL, type Dashboard } from './dashboard'

function rate(percent: string | null): string {
  return percent === null ? 'Non calculé' : `${percent} %`
}

export function ExecutivePage() {
  const query = useQuery({
    queryKey: ['dashboard'],
    retry: false,
    queryFn: () => api<ApiSuccess<Dashboard>>('/api/v1/dashboard'),
  })
  const board = query.data?.data

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-serif text-3xl text-navy-900">Tableau de bord exécutif</h1>
        {board && (
          <p className="mt-1 text-sm text-slate-600">
            {SCOPE_LABEL[board.scope.mode]} Calcul au {new Date(board.as_of).toLocaleString('fr-FR')}.
          </p>
        )}
      </header>
      {query.isLoading && <LoadingState label="Calcul des indicateurs…" />}
      {query.error instanceof ApiError && (
        <ErrorState message={query.error.message} onRetry={() => void query.refetch()} />
      )}
      {board && !board.budget.has_executable && (
        <EmptyState
          title="Aucun crédit exécutoire"
          description="Les montants sont la somme des écritures du périmètre. Le Budget 2026 n’est pas ouvert et n’est pas recopié ici. Le taux d’exécution n’est pas calculé tant que le révisé est nul."
        />
      )}
      {board && (
        <>
          <div className="grid gap-3 md:grid-cols-3">
            <Figure label="Révisé" amount={board.budget.revised_xaf} hint={board.formulas.revised} to="/app/budget" />
            <Figure label="Engagé ferme" amount={board.budget.committed_xaf} hint="Engagements fermes du journal budgétaire." to="/app/engagements" />
            <Figure label="Disponible" amount={board.budget.available_xaf} hint={board.formulas.available} to="/app/budget" />
            <Figure label="Liquidé visé" amount={board.budget.liquidated_xaf} hint={board.formulas.liquidated} to="/app/liquidations" />
            <Figure label="Ordonnancé" amount={board.budget.ordered_xaf} hint={board.formulas.ordered} to="/app/ordonnancements" />
            <Figure label="Payé" amount={board.budget.paid_xaf} hint={board.formulas.paid} to="/app/paiements" />
          </div>
          <p className="text-sm text-navy-900">
            Taux d’exécution : {rate(board.budget.execution_percent)}. {board.formulas.execution_percent}
          </p>
          <div className="grid gap-3 md:grid-cols-3">
            <Figure label="Reste à liquider" amount={board.remainders.to_liquidate_xaf} hint="Engagé ferme − liquidé visé." />
            <Figure label="Reste à ordonnancer" amount={board.remainders.to_order_xaf} hint="Liquidé visé − ordonnancé actif." />
            <Figure label="Reste à payer" amount={board.remainders.to_pay_xaf} hint="Ordonnancé actif − payé." />
          </div>
          <section className="space-y-2">
            <h2 className="font-serif text-2xl text-navy-900">PAP et hors PAP</h2>
            {board.segments.length === 0 && (
              <EmptyState title="Aucun segment exécutoire" description="Fonctionnement, investissement et équipement apparaîtront lorsqu’une ligne exécutoire existera." />
            )}
            {board.segments.length > 0 && (
              <ul className="space-y-2">
                {board.segments.map((segment) => (
                  <li key={segment.code} className="rounded-xl bg-white px-4 py-3 shadow-sm">
                    <p className="font-medium text-navy-900">{segment.label}</p>
                    <p className="text-xs text-slate-500">
                      Révisé {formatXaf(segment.revised_xaf)} · payé {formatXaf(segment.paid_xaf)} · {rate(segment.execution_percent)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
          <section className="space-y-2">
            <h2 className="font-serif text-2xl text-navy-900">Par structure</h2>
            {board.structures.length === 0 && (
              <EmptyState title="Aucune structure dotée" description="Le taux par département se calcule sur les lignes exécutoires rattachées." />
            )}
            {board.structures.length > 0 && (
              <ul className="space-y-2">
                {board.structures.map((structure) => (
                  <li key={structure.name} className="rounded-xl bg-white px-4 py-3 shadow-sm">
                    <p className="font-medium text-navy-900">{structure.name}</p>
                    <p className="text-xs text-slate-500">
                      Révisé {formatXaf(structure.revised_xaf)} · payé {formatXaf(structure.paid_xaf)} · {rate(structure.execution_percent)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
          <section className="space-y-2">
            <h2 className="font-serif text-2xl text-navy-900">Alertes</h2>
            {board.alerts.length === 0 && (
              <EmptyState title="Aucune alerte de crédit épuisé" description={board.formulas.alert} />
            )}
            {board.alerts.length > 0 && (
              <ul className="space-y-2">
                {board.alerts.map((alert) => (
                  <li key={alert.line_code} className="rounded-xl bg-white px-4 py-3 text-sm text-navy-900 shadow-sm">
                    {alert.line_code} — {alert.label}
                  </li>
                ))}
              </ul>
            )}
          </section>
          <section className="space-y-2">
            <h2 className="font-serif text-2xl text-navy-900">Dossiers en attente</h2>
            <p className="text-sm text-slate-700">
              {board.waiting.open_tasks === 0
                ? 'Aucune tâche ouverte.'
                : `${board.waiting.open_tasks} tâche${board.waiting.open_tasks > 1 ? 's' : ''} ouverte${board.waiting.open_tasks > 1 ? 's' : ''}.`}
              {board.waiting.oldest_age_days !== null ? ` La plus ancienne a ${board.waiting.oldest_age_days} jour(s).` : ''}
            </p>
            <Link to="/app/taches" className="text-sm font-semibold text-navy-900 underline">
              Ouvrir la corbeille
            </Link>
          </section>
          <EmptyState title="Avancement physique non calculé" description={board.formulas.physical} />
        </>
      )}
    </div>
  )
}

function Figure({ label, amount, hint, to }: { label: string; amount: string; hint: string; to?: string }) {
  const body = (
    <>
      <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">{label}</p>
      <p className="mt-2 text-lg font-semibold text-navy-900">{formatXaf(amount)}</p>
      <p className="mt-1 text-xs text-slate-500">{hint}</p>
    </>
  )

  if (!to) {
    return <div className="rounded-xl bg-white p-4 shadow-sm">{body}</div>
  }

  return (
    <Link to={to} className="rounded-xl bg-white p-4 shadow-sm">
      {body}
    </Link>
  )
}
