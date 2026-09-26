import { useState } from 'react'
import { Search, ChevronRight, CheckCircle, Clock, ArrowRight, FileText, Eye } from 'lucide-react'
import { EB_LIST, ENG_LIST, LIQ_LIST, ORD_LIST, PAY_LIST } from '../data/mock'
import type { Page } from '../types'

interface Props {
  onNavigate: (page: Page, id?: string) => void
}

const STEP_COLORS = {
  EB: '#0B1C3E',
  ENG: '#1A6B3A',
  LIQ: '#D97706',
  ORD: '#7E22CE',
  PAY: '#DC2626',
}

const LINKED: Record<string, { eng?: string; liq?: string; ord?: string; pay?: string }> = {
  'EB-2026-002': { eng: 'ENG-2026-002', liq: 'LIQ-2026-001', ord: 'ORD-2026-002', pay: 'PAY-2026-002' },
  'EB-2026-003': { eng: 'ENG-2026-003', liq: 'LIQ-2026-002', ord: 'ORD-2026-003' },
  'EB-2026-001': { eng: 'ENG-2026-001' },
  'EB-2026-004': {},
  'EB-2026-005': { eng: 'ENG-2026-004', liq: 'LIQ-2026-003' },
  'EB-2026-006': {},
  'EB-2026-007': {},
}

const fmtM = (n: number) =>
  new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(n) + ' XAF'

export default function Dossier({ onNavigate }: Props) {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<string | null>(null)

  const filtered = EB_LIST.filter(eb =>
    !search ||
    eb.reference.toLowerCase().includes(search.toLowerCase()) ||
    eb.objet.toLowerCase().includes(search.toLowerCase())
  )

  const sel = selected ? EB_LIST.find(e => e.reference === selected) : null
  const links = selected ? LINKED[selected] ?? {} : {}

  const eng = links.eng ? ENG_LIST.find(e => e.reference === links.eng) : null
  const liq = links.liq ? LIQ_LIST.find(l => l.reference === links.liq) : null
  const ord = links.ord ? ORD_LIST.find(o => o.reference === links.ord) : null
  const pay = links.pay ? PAY_LIST.find(p => p.reference === links.pay) : null

  const getEBStatus = (eb: typeof EB_LIST[0]) => {
    const lnk = LINKED[eb.reference] ?? {}
    if (lnk.pay) return { label: 'Payé', bg: '#DCFCE7', text: '#166534', step: 5 }
    if (lnk.ord) return { label: 'Ordonnancé', bg: '#EDE9FE', text: '#5B21B6', step: 4 }
    if (lnk.liq) return { label: 'Liquidé', bg: '#FEF3C7', text: '#92400E', step: 3 }
    if (lnk.eng) return { label: 'Engagé', bg: '#DCFCE7', text: '#166534', step: 2 }
    return { label: 'EB seul', bg: '#EDF2FB', text: '#1B3269', step: 1 }
  }

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="section-title text-2xl">Dossier numérique unique</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Vue consolidée de la chaîne EB → ENG → LIQ → ORD → PAY par dossier de dépense
          </p>
        </div>
      </div>

      {/* Chain legend */}
      <div className="card px-5 py-4">
        <div className="flex items-center gap-1 flex-wrap">
          {[
            { label: 'Expression de Besoin', code: 'EB', color: STEP_COLORS.EB },
            { label: 'Engagement', code: 'ENG', color: STEP_COLORS.ENG },
            { label: 'Liquidation', code: 'LIQ', color: STEP_COLORS.LIQ },
            { label: 'Ordonnancement', code: 'ORD', color: STEP_COLORS.ORD },
            { label: 'Paiement', code: 'PAY', color: STEP_COLORS.PAY },
          ].map((step, i, arr) => (
            <div key={step.code} className="flex items-center gap-1">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: step.color + '15' }}>
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: step.color }} />
                <span className="text-[12px] font-semibold" style={{ color: step.color }}>{step.code}</span>
                <span className="text-[11.5px] text-gray-500">{step.label}</span>
              </div>
              {i < arr.length - 1 && <ArrowRight size={13} className="text-gray-300" />}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4">
        {[
          { label: 'EB initiales', value: EB_LIST.length, color: STEP_COLORS.EB },
          { label: 'Engagements liés', value: EB_LIST.filter(e => LINKED[e.reference]?.eng).length, color: STEP_COLORS.ENG },
          { label: 'Liquidations', value: EB_LIST.filter(e => LINKED[e.reference]?.liq).length, color: STEP_COLORS.LIQ },
          { label: 'Ordonnancements', value: EB_LIST.filter(e => LINKED[e.reference]?.ord).length, color: STEP_COLORS.ORD },
          { label: 'Paiements', value: EB_LIST.filter(e => LINKED[e.reference]?.pay).length, color: STEP_COLORS.PAY },
        ].map((k, i) => (
          <div key={i} className="kpi-card py-3 text-center" style={{ borderTop: `3px solid ${k.color}` }}>
            <div className="text-[10px] uppercase font-semibold tracking-wider text-gray-400">{k.label}</div>
            <div className="amount text-2xl font-bold mt-0.5" style={{ color: k.color }}>{k.value}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-5">
        {/* List */}
        <div className="flex-1 space-y-3">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="form-input pl-9 py-2 text-[13px] w-full"
              placeholder="Référence, objet du dossier…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="card divide-y divide-gray-50">
            {filtered.map(eb => {
              const st = getEBStatus(eb)
              const lnk = LINKED[eb.reference] ?? {}
              const isSelected = selected === eb.reference
              return (
                <div
                  key={eb.reference}
                  className={`px-5 py-4 cursor-pointer transition-colors ${isSelected ? '' : 'hover:bg-gray-50'}`}
                  style={isSelected ? { background: '#F0F4FA' } : {}}
                  onClick={() => setSelected(isSelected ? null : eb.reference)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-[12px] font-bold text-navy-900">{eb.reference}</span>
                        <span className="badge text-[10px] px-1.5 py-0.5" style={{ background: st.bg, color: st.text }}>{st.label}</span>
                      </div>
                      <div className="text-[13px] font-medium text-gray-800 mb-2">{eb.objet}</div>
                      {/* Mini pipeline */}
                      <div className="flex items-center gap-1">
                        {(['EB', 'ENG', 'LIQ', 'ORD', 'PAY'] as const).map((code, idx) => {
                          const done = idx === 0 || (idx === 1 && lnk.eng) || (idx === 2 && lnk.liq) || (idx === 3 && lnk.ord) || (idx === 4 && lnk.pay)
                          return (
                            <div key={code} className="flex items-center gap-1">
                              <div
                                className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold"
                                style={done
                                  ? { background: STEP_COLORS[code] + '20', color: STEP_COLORS[code] }
                                  : { background: '#F1F5F9', color: '#CBD5E1' }}
                              >
                                {done && idx < st.step - 1 ? <CheckCircle size={8} /> : idx === st.step - 1 ? <Clock size={8} /> : null}
                                {code}
                              </div>
                              {idx < 4 && <ArrowRight size={9} className={done ? 'text-gray-400' : 'text-gray-200'} />}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <div className="amount text-[13px] font-bold text-gray-700">{fmtM(eb.montant)}</div>
                      <div className="text-[10.5px] text-gray-400">{eb.structure}</div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Detail panel */}
        {sel && (
          <div className="w-80 flex-shrink-0 space-y-3">
            <div className="card p-4">
              <div className="font-bold text-[14px] text-navy-900 mb-0.5">{sel.reference}</div>
              <div className="text-[12.5px] text-gray-600 mb-3">{sel.objet}</div>
              <div className="amount text-lg font-bold text-gray-800">{fmtM(sel.montant)}</div>
              <div className="text-[11px] text-gray-400 mt-0.5">{sel.structure} — {sel.ligneBudgetaire}</div>
            </div>

            {/* Steps detail */}
            {([
              { code: 'EB', label: 'Expression de Besoin', ref: sel.reference, page: 'eb-detail' as Page, data: sel, exists: true },
              { code: 'ENG', label: 'Engagement', ref: links.eng, page: 'eng-detail' as Page, data: eng, exists: !!eng },
              { code: 'LIQ', label: 'Liquidation', ref: links.liq, page: 'liq-detail' as Page, data: liq, exists: !!liq },
              { code: 'ORD', label: 'Ordonnancement', ref: links.ord, page: 'ord-detail' as Page, data: ord, exists: !!ord },
              { code: 'PAY', label: 'Paiement', ref: links.pay, page: 'pay-detail' as Page, data: pay, exists: !!pay },
            ] as const).map((step, idx) => {
              const color = STEP_COLORS[step.code as keyof typeof STEP_COLORS]
              return (
                <div key={step.code} className={`card p-4 ${!step.exists ? 'opacity-40' : ''}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold" style={{ background: step.exists ? color : '#CBD5E1' }}>
                        {idx + 1}
                      </div>
                      <div>
                        <div className="text-[10px] uppercase font-semibold tracking-wider text-gray-400">{step.label}</div>
                        {step.exists && <div className="font-mono text-[11.5px] font-bold text-gray-700">{step.ref}</div>}
                      </div>
                    </div>
                    {step.exists && (
                      <button
                        className="btn btn-outline btn-sm gap-1 text-[11px]"
                        onClick={() => onNavigate(step.page, step.ref ?? undefined)}
                      >
                        <Eye size={10} /> Voir
                      </button>
                    )}
                  </div>
                  {!step.exists && (
                    <div className="flex items-center gap-1.5 text-[11.5px] text-gray-400">
                      <Clock size={11} />
                      <span>
                        {idx === 1 ? 'EB pas encore transformée en engagement' :
                          idx === 2 ? 'Liquidation non créée' :
                          idx === 3 ? 'Ordonnancement non émis' :
                          'Paiement non exécuté'}
                      </span>
                    </div>
                  )}
                  {step.exists && step.data && (
                    <div className="mt-1.5 flex items-center justify-between">
                      <span className="text-[11.5px] text-gray-600">
                        {(step.data as unknown as { status?: string }).status ?? ''}
                      </span>
                      {'montant' in step.data && (
                        <span className="font-mono text-[12px] font-bold text-gray-700">{fmtM((step.data as unknown as { montant: number }).montant)}</span>
                      )}
                    </div>
                  )}
                </div>
              )
            })}

            {/* Documents liés */}
            <div className="card p-4">
              <div className="text-[10px] uppercase font-semibold tracking-wider text-gray-400 mb-3">Documents du dossier</div>
              <div className="space-y-2">
                {[
                  { nom: 'Décision d\'approbation EB', type: 'PDF' },
                  { nom: 'Contrat / Bon de commande', type: 'PDF' },
                  { nom: 'Facture fournisseur', type: 'PDF' },
                  { nom: 'Bordereau de livraison', type: 'PDF' },
                  { nom: 'Ordre de paiement signé', type: 'PDF' },
                ].slice(0, getEBStatus(sel).step).map((doc, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <FileText size={12} className="text-gray-400 flex-shrink-0" />
                    <span className="text-[12px] text-gray-700 flex-1">{doc.nom}</span>
                    <button className="text-[11px] text-ceeac-700 hover:underline">Voir</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
