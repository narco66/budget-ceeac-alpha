import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { api, ApiError } from '../api/client'
import type { ApiSuccess } from '../api/types'
import { EmptyState, ErrorState, ForbiddenState, LoadingState } from '../components/States'
import { formatXaf } from '../lib/money'

type Hit = {
  kind: 'need_request' | 'contract'
  reference: string
  label: string
  amount_xaf: string
  linked_need: string | null
}

type Act = {
  reference: string
  status: string
  amount_xaf: string
}

type Dossier = {
  reference: string
  need_request: Act & {
    object: string
    budget_line: { code: string; label: string } | null
    structure: { code: string; name: string } | null
    official_documents: { kind: string; title: string }[]
  }
  commitments: Array<Act & {
    liquidations: Array<Act & {
      supplier_label: string | null
      invoice_number: string | null
      payment_orders: Array<Act & {
        beneficiary_label: string | null
        payments: Act[]
      }>
    }>
  }>
  events: { act: string; action: string; reason: string | null }[]
  findings_note: string
  monitoring: null
  monitoring_note: string
  contract_note: string
}

export function DossierPage() {
  const [draft, setDraft] = useState('')
  const [term, setTerm] = useState('')
  const [selected, setSelected] = useState<string | null>(null)

  const search = useQuery({
    queryKey: ['dossiers', term],
    enabled: term.length >= 2,
    retry: false,
    queryFn: () => api<ApiSuccess<Hit[]>>(`/api/v1/dossiers?q=${encodeURIComponent(term)}`),
  })
  const dossier = useQuery({
    queryKey: ['dossier', selected],
    enabled: selected !== null,
    retry: false,
    queryFn: () => api<ApiSuccess<Dossier>>(`/api/v1/dossiers/${selected}`),
  })

  return (
    <div className="space-y-4">
      <h1 className="font-serif text-3xl text-navy-900">Dossier numérique</h1>
      <p className="text-sm text-slate-600">
        Recherche par numéro EB, ENG, LIQ, ORD ou PAI, par objet, facture, fournisseur, ligne ou structure.
        Le suivi-évaluation n’est pas rattaché.
      </p>
      <form
        className="flex gap-2"
        onSubmit={(event) => {
          event.preventDefault()
          setSelected(null)
          setTerm(draft.trim())
        }}
      >
        <label className="sr-only" htmlFor="dossier-q">Recherche de dossier</label>
        <input
          id="dossier-q"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"
          placeholder="Référence, objet, facture…"
        />
        <button type="submit" className="rounded-xl bg-navy-900 px-4 text-sm font-semibold text-white">
          Chercher
        </button>
      </form>
      {search.isLoading && <LoadingState label="Recherche des dossiers…" />}
      {search.error instanceof ApiError && search.error.status === 403 && <ForbiddenState />}
      {search.error instanceof ApiError && search.error.status !== 403 && (
        <ErrorState message={search.error.message} onRetry={() => void search.refetch()} />
      )}
      {search.data && search.data.data.length === 0 && (
        <EmptyState title="Aucun dossier trouvé" description="Aucun acte ne correspond. Aucun montant n’est inventé." />
      )}
      {search.data && search.data.data.length > 0 && (
        <ul className="space-y-2">
          {search.data.data.map((hit) => (
            <li key={`${hit.kind}-${hit.reference}`}>
              {hit.kind === 'contract' ? (
                <div className="rounded-xl bg-white px-4 py-3 shadow-sm">
                  <p className="font-medium text-navy-900">{hit.reference}</p>
                  <p className="text-xs text-slate-500">
                    Contrat · {hit.label} · {formatXaf(hit.amount_xaf)}. Aucun acte de dépense n’y est rattaché.
                  </p>
                </div>
              ) : (
                <button
                  type="button"
                  className="w-full rounded-xl bg-white px-4 py-3 text-left shadow-sm"
                  onClick={() => setSelected(hit.linked_need)}
                >
                  <p className="font-medium text-navy-900">{hit.reference}</p>
                  <p className="text-xs text-slate-500">{hit.label} · {formatXaf(hit.amount_xaf)}</p>
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
      {dossier.isLoading && <LoadingState label="Ouverture du dossier…" />}
      {dossier.data && <DossierSheet dossier={dossier.data.data} />}
    </div>
  )
}

function DossierSheet({ dossier }: { dossier: Dossier }) {
  return (
    <article className="space-y-3 rounded-xl bg-white p-4 shadow-sm">
      <h2 className="font-serif text-2xl text-navy-900">{dossier.need_request.reference}</h2>
      <p className="text-sm text-slate-600">{dossier.need_request.object}</p>
      <p className="text-sm">
        {formatXaf(dossier.need_request.amount_xaf)}
        {dossier.need_request.budget_line ? ` · ${dossier.need_request.budget_line.code}` : ''}
        {dossier.need_request.structure ? ` · ${dossier.need_request.structure.name}` : ''}
      </p>
      {dossier.commitments.length === 0 && (
        <p className="text-sm text-slate-500">Aucun engagement n’est encore ouvert sur cette expression.</p>
      )}
      {dossier.commitments.map((commitment) => (
        <div key={commitment.reference} className="border-t border-slate-100 pt-3">
          <p className="text-sm font-medium">{commitment.reference} · {commitment.status} · {formatXaf(commitment.amount_xaf)}</p>
          {commitment.liquidations.map((liquidation) => (
            <div key={liquidation.reference} className="mt-2 pl-3 text-sm text-slate-600">
              <p>{liquidation.reference} · {liquidation.supplier_label ?? 'Fournisseur non saisi'} · {liquidation.invoice_number ?? 'sans facture'}</p>
              {liquidation.payment_orders.map((order) => (
                <p key={order.reference} className="pl-3">
                  {order.reference} · {formatXaf(order.amount_xaf)} · {order.payments.map((payment) => payment.reference).join(', ') || 'aucun paiement'}
                </p>
              ))}
            </div>
          ))}
        </div>
      ))}
      {dossier.events.length > 0 && (
        <ul className="text-xs text-slate-500">
          {dossier.events.map((event, index) => (
            <li key={`${event.act}-${event.action}-${index}`}>{event.act} · {event.action}{event.reason ? ` · ${event.reason}` : ''}</li>
          ))}
        </ul>
      )}
      <p className="text-xs text-slate-500">{dossier.findings_note}</p>
      <p className="text-xs text-slate-500">{dossier.monitoring_note}</p>
      <p className="text-xs text-slate-500">{dossier.contract_note}</p>
    </article>
  )
}
