import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { api, ApiError } from '../api/client'
import type { ApiSuccess } from '../api/types'
import { EmptyState, ErrorState, ForbiddenState, LoadingState } from '../components/States'
import { formatXaf } from '../lib/money'

type Controls = {
  year: number
  role: string
  official_import_promoted: boolean
  amounts_xaf: {
    revenue: string
    expenditure: string
    fonctionnement: string
    investissement: string
    equipement: string
  }
}

type BudgetVersion = {
  id: string
  code: string
  label: string
  status: string
  fiscal_year: number | null
  lines_count: number
  note: string | null
}

type BudgetLineRow = {
  id: string
  code: string
  label: string
  nature: string
  segment: string
  funding_source: string
  initial_amount_xaf: string
}

type BudgetVersionDetail = BudgetVersion & {
  lines?: BudgetLineRow[]
}

const segmentLabels: Record<string, string> = {
  fonctionnement: 'Fonctionnement',
  investissement: 'Investissement',
  equipement: 'Équipement',
  recette: 'Recette',
}

const statusLabels: Record<string, string> = {
  draft: 'brouillon',
  arbitrated: 'arbitrée',
  published: 'publiée',
  executable: 'exécutoire',
}

export function BudgetPage() {
  const controls = useQuery({
    queryKey: ['budget-controls'],
    retry: false,
    queryFn: () => api<ApiSuccess<Controls>>('/api/v1/budget-control-totals'),
  })
  const versions = useQuery({
    queryKey: ['budget-versions'],
    retry: false,
    queryFn: () => api<ApiSuccess<BudgetVersion[]>>('/api/v1/budget-versions'),
  })
  const versionId = versions.data?.data[0]?.id
  const detail = useQuery({
    queryKey: ['budget-version', versionId],
    enabled: Boolean(versionId),
    retry: false,
    queryFn: () => api<ApiSuccess<BudgetVersionDetail>>(`/api/v1/budget-versions/${versionId}`),
  })
  const [filter, setFilter] = useState('')
  const error = [controls.error, versions.error, detail.error].find((item) => item instanceof ApiError)
  const lines = (detail.data?.data.lines ?? []).filter((line) => {
    const haystack = `${line.code} ${line.label}`.toLowerCase()
    return haystack.includes(filter.trim().toLowerCase())
  })

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-serif text-3xl text-navy-900">Gestion du budget</h1>
        <p className="mt-1 text-sm text-slate-600">
          Versions, mouvements et soldes calculés depuis le journal. Le budget initial publié ne se réécrit pas.
        </p>
      </header>
      {(controls.isLoading || versions.isLoading) && <LoadingState label="Chargement du budget…" />}
      {error instanceof ApiError && error.status === 403 && <ForbiddenState />}
      {error instanceof ApiError && error.status !== 403 && (
        <ErrorState message={error.message} onRetry={() => void controls.refetch()} />
      )}
      {versions.data && versions.data.data.length === 0 && (
        <EmptyState
          title="Aucune version budgétaire"
          description="L’import du Budget 2026 n’a pas été promu. Les crédits ne sont pas ouverts, et aucun montant n’est disponible à l’engagement."
        />
      )}
      {versions.data && versions.data.data.length > 0 && (
        <section className="overflow-x-auto rounded-xl bg-white shadow-sm">
          <p className="px-4 pt-4 text-sm text-slate-600">
            {detail.data?.data.note
              ?? 'Les lignes promues restent un brouillon. Elles ne sont pas des crédits ouverts.'}
          </p>
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Versions budgétaires</caption>
            <thead className="bg-slate-50 text-xs tracking-wide text-slate-500 uppercase">
              <tr>
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Libellé</th>
                <th className="px-4 py-3">Exercice</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3">Lignes</th>
              </tr>
            </thead>
            <tbody>
              {versions.data.data.map((version) => (
                <tr key={version.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium">{version.code}</td>
                  <td className="px-4 py-3">{version.label}</td>
                  <td className="px-4 py-3">{version.fiscal_year ?? '—'}</td>
                  <td className="px-4 py-3">{statusLabels[version.status] ?? version.status}</td>
                  <td className="px-4 py-3">{version.lines_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
      {detail.data?.data.lines && (
        <section className="rounded-xl bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 className="font-serif text-xl text-navy-900">Lignes de l’annexe</h2>
            <label className="text-sm text-slate-600">
              Filtrer
              <input
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
                className="mt-1 block rounded-lg border border-slate-200 px-3 py-2"
                placeholder="Code ou libellé"
              />
            </label>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <caption className="sr-only">Lignes budgétaires de la version en brouillon</caption>
              <thead className="bg-slate-50 text-xs tracking-wide text-slate-500 uppercase">
                <tr>
                  <th className="px-3 py-3">Code</th>
                  <th className="px-3 py-3">Libellé</th>
                  <th className="px-3 py-3">Segment</th>
                  <th className="px-3 py-3">Source</th>
                  <th className="px-3 py-3 text-right">Montant initial</th>
                </tr>
              </thead>
              <tbody>
                {lines.map((line) => (
                  <tr key={line.id} className="border-t border-slate-100">
                    <td className="px-3 py-2 font-medium">{line.code}</td>
                    <td className="px-3 py-2">{line.label}</td>
                    <td className="px-3 py-2">{segmentLabels[line.segment] ?? line.segment}</td>
                    <td className="px-3 py-2">{line.funding_source === 'ptf' ? 'PTF' : 'CEEAC'}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{formatXaf(line.initial_amount_xaf)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {lines.length === 0 && <p className="mt-3 text-sm text-slate-500">Aucune ligne ne correspond à ce filtre.</p>}
        </section>
      )}
      {controls.data && (
        <section className="rounded-xl bg-white p-5 shadow-sm">
          <h2 className="font-serif text-xl text-navy-900">Totaux de contrôle {controls.data.data.year}</h2>
          <p className="mt-1 text-sm text-slate-600">
            Barrière de chargement de l’annexe officielle. Ces montants ne sont pas des crédits ouverts.
            {controls.data.data.official_import_promoted
              ? ' Un lot officiel a été promu en brouillon.'
              : ' Aucun lot officiel n’a été promu.'}
          </p>
          <dl className="mt-4 grid gap-3 sm:grid-cols-2">
            <Checkpoint label="Recettes" amount={controls.data.data.amounts_xaf.revenue} />
            <Checkpoint label="Dépenses" amount={controls.data.data.amounts_xaf.expenditure} />
            <Checkpoint label="Fonctionnement" amount={controls.data.data.amounts_xaf.fonctionnement} />
            <Checkpoint label="Investissement, dont PAP" amount={controls.data.data.amounts_xaf.investissement} />
            <Checkpoint label="Équipement" amount={controls.data.data.amounts_xaf.equipement} />
          </dl>
        </section>
      )}
    </div>
  )
}

function Checkpoint({ label, amount }: { label: string; amount: string }) {
  return (
    <div className="rounded-lg border border-slate-100 px-3 py-2">
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="font-medium text-navy-900">{formatXaf(amount)}</dd>
    </div>
  )
}
