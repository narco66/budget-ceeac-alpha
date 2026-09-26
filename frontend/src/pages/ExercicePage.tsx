import { useQuery } from '@tanstack/react-query'
import { api, ApiError } from '../api/client'
import type {
  ApiSuccess,
  FiscalYear,
  NomenclatureVersion,
  NumberSequence,
  SystemParameter,
  WorkflowDefinition,
} from '../api/types'
import { ErrorState, ForbiddenState, LoadingState } from '../components/States'
import { formatXaf } from '../lib/money'

const actorLabels: Record<string, string> = {
  role: 'Fonction',
  system: 'Système',
  threshold: 'Selon le seuil',
  pending_assignment: 'Affectation à préciser',
}

export function ExercicePage() {
  const years = useQuery({
    queryKey: ['fiscal-years'],
    retry: false,
    queryFn: () => api<ApiSuccess<FiscalYear[]>>('/api/v1/fiscal-years'),
  })
  const current = years.data?.data.find((year) => year.is_current) ?? years.data?.data[0]
  const detail = useQuery({
    queryKey: ['fiscal-year', current?.id],
    enabled: current !== undefined,
    retry: false,
    queryFn: () => api<ApiSuccess<FiscalYear>>(`/api/v1/fiscal-years/${current?.id}`),
  })
  const parameters = useQuery({
    queryKey: ['system-parameters'],
    retry: false,
    queryFn: () => api<ApiSuccess<SystemParameter[]>>('/api/v1/system-parameters'),
  })
  const sequences = useQuery({
    queryKey: ['number-sequences'],
    retry: false,
    queryFn: () => api<ApiSuccess<NumberSequence[]>>('/api/v1/number-sequences'),
  })
  const nomenclature = useQuery({
    queryKey: ['nomenclature-versions'],
    retry: false,
    queryFn: () => api<ApiSuccess<NomenclatureVersion[]>>('/api/v1/nomenclature-versions'),
  })
  const workflows = useQuery({
    queryKey: ['workflows'],
    retry: false,
    queryFn: () => api<ApiSuccess<WorkflowDefinition[]>>('/api/v1/workflows'),
  })

  const error = [years.error, detail.error, parameters.error, sequences.error, nomenclature.error, workflows.error]
    .find((item) => item instanceof ApiError)

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-serif text-3xl text-navy-900">Exercice et circuits</h1>
        <p className="mt-1 text-sm text-slate-600">
          Référentiels de travail. Les montants du Budget 2026 ne sont pas chargés.
        </p>
      </header>
      {(years.isLoading || detail.isLoading) && <LoadingState label="Chargement de l’exercice…" />}
      {error instanceof ApiError && error.status === 403 && <ForbiddenState />}
      {error instanceof ApiError && error.status !== 403 && (
        <ErrorState message={error.message} onRetry={() => void years.refetch()} />
      )}
      {detail.data && (
        <section className="rounded-xl bg-white p-5 shadow-sm">
          <h2 className="font-serif text-xl text-navy-900">{detail.data.data.label}</h2>
          <p className="mt-1 text-sm text-slate-600">
            Statut : {detail.data.data.status_label}. Devise {detail.data.data.currency?.code}. Du {detail.data.data.starts_on} au {detail.data.data.ends_on}.
          </p>
          {detail.data.data.note && <p className="mt-2 text-sm text-slate-500">{detail.data.data.note}</p>}
          <ol className="mt-4 grid gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {detail.data.data.periods?.map((period) => (
              <li key={period.id} className="rounded-lg border border-slate-100 px-3 py-2 text-sm">
                <span className="font-medium text-navy-900">{period.label}</span>
                <span className="mt-1 block text-xs text-slate-500">{period.status_label}</span>
              </li>
            ))}
          </ol>
        </section>
      )}
      {parameters.data && (
        <section className="rounded-xl bg-white p-5 shadow-sm">
          <h2 className="font-serif text-xl text-navy-900">Seuil d’ordonnancement</h2>
          <ul className="mt-3 space-y-3">
            {parameters.data.data.map((parameter) => (
              <li key={parameter.id} className="text-sm text-slate-700">
                <p className="font-medium text-navy-900">
                  Version {parameter.version}
                  {parameter.amount_xaf ? ` — ${formatXaf(parameter.amount_xaf)}` : ''}
                  {parameter.status === 'active' ? ' — en vigueur' : ` — ${parameter.status}`}
                </p>
                {parameter.note && <p className="mt-1 text-slate-500">{parameter.note}</p>}
              </li>
            ))}
          </ul>
        </section>
      )}
      {sequences.data && sequences.data.data.length > 0 && (
        <section className="overflow-x-auto rounded-xl bg-white shadow-sm">
          <h2 className="px-4 pt-4 font-serif text-xl text-navy-900">Numérotation</h2>
          <table className="mt-2 w-full text-left text-sm">
            <caption className="sr-only">Prochaines références métier</caption>
            <thead className="bg-slate-50 text-xs tracking-wide text-slate-500 uppercase">
              <tr>
                <th className="px-4 py-3">Domaine</th>
                <th className="px-4 py-3">Dernière valeur</th>
                <th className="px-4 py-3">Prochaine référence</th>
              </tr>
            </thead>
            <tbody>
              {sequences.data.data.map((sequence) => (
                <tr key={sequence.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium">{sequence.domain}</td>
                  <td className="px-4 py-3">{sequence.last_value}</td>
                  <td className="px-4 py-3">{sequence.next_reference}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
      {nomenclature.data && (
        <section className="rounded-xl bg-white p-5 shadow-sm">
          <h2 className="font-serif text-xl text-navy-900">Nomenclature</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {nomenclature.data.data.map((version) => (
              <li key={version.id}>
                <p className="font-medium text-navy-900">{version.label}</p>
                <p className="text-slate-500">
                  {(version.items_count ?? 0) === 0
                    ? 'Aucun compte chargé.'
                    : `${version.items_count} ${(version.items_count ?? 0) > 1 ? 'comptes' : 'compte'}.`}
                  {' '}{version.note}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}
      {workflows.data && (
        <section className="space-y-3">
          <h2 className="font-serif text-xl text-navy-900">Circuits</h2>
          {workflows.data.data.map((workflow) => (
            <article key={workflow.id} className="rounded-xl bg-white p-5 shadow-sm">
              <h3 className="font-medium text-navy-900">{workflow.label}</h3>
              <p className="text-xs text-slate-500">{workflow.code} — version {workflow.version}</p>
              <ol className="mt-3 space-y-1 text-sm text-slate-700">
                {workflow.steps?.map((step) => (
                  <li key={step.id}>
                    {step.position}. {step.label}
                    <span className="text-slate-500">
                      {' '}— {actorLabels[step.actor_kind] ?? step.actor_kind}
                      {step.actor_role_code ? ` (${step.actor_role_code})` : ''}
                    </span>
                  </li>
                ))}
              </ol>
            </article>
          ))}
        </section>
      )}
    </div>
  )
}
