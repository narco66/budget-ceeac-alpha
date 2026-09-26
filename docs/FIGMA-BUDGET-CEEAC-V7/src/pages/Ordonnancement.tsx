import { useState } from 'react'
import {
  Search, Download, Filter, ChevronLeft, ChevronRight, X, ChevronDown,
  PenLine, Send, AlertTriangle, TrendingUp, BarChart3,
} from 'lucide-react'
import type { Page } from '../types'
import { ORD_LIST } from '../data/mock'

interface Props {
  onNavigate: (page: Page, id?: string) => void
}

const fmt = (n: number) =>
  new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(n) + ' XAF'
const fmtShort = (n: number) => {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + ' Md'
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + ' M'
  return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(n)
}

const PAGE_SIZE = 10

const STATUS_LABELS: Record<string, string> = {
  GENERE: 'Généré',
  A_PREPARER: 'En préparation',
  A_SIGNER: 'À signer',
  SIGNE: 'Signé',
  TRANSMIS_AC: 'Transmis AC',
  TRANSFORME: 'Transformé en Paiement',
  RETOURNE: 'Retourné',
  REJETE: 'Rejeté',
}

const STATUS_STYLE: Record<string, { bg: string; text: string; dot: string }> = {
  GENERE:      { bg: '#EFF6FF', text: '#1D4ED8', dot: '#3B82F6' },
  A_PREPARER:  { bg: '#F0FDF4', text: '#166534', dot: '#22C55E' },
  A_SIGNER:    { bg: '#FFFBEB', text: '#92400E', dot: '#F59E0B' },
  SIGNE:       { bg: '#F0FDF4', text: '#166534', dot: '#16A34A' },
  TRANSMIS_AC: { bg: '#EDE9FE', text: '#5B21B6', dot: '#7C3AED' },
  TRANSFORME:  { bg: '#F0F9FF', text: '#0369A1', dot: '#0EA5E9' },
  RETOURNE:    { bg: '#FFF7ED', text: '#C2410C', dot: '#EA580C' },
  REJETE:      { bg: '#FEF2F2', text: '#991B1B', dot: '#EF4444' },
}

function StatusChip({ status }: { status: string }) {
  const c = STATUS_STYLE[status] ?? { bg: '#F1F5F9', text: '#475569', dot: '#94A3B8' }
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap" style={{ background: c.bg, color: c.text }}>
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: c.dot }} />
      {STATUS_LABELS[status] ?? status}
    </span>
  )
}

const KPI_STATUTS = ['TOUS', 'A_SIGNER', 'SIGNE', 'TRANSMIS_AC', 'RETOURNE', 'REJETE'] as const

export default function Ordonnancement({ onNavigate }: Props) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('TOUS')
  const [ordonnateurFilter, setOrdonnateurFilter] = useState<'TOUS' | 'SG' | 'PRESIDENT'>('TOUS')
  const [papFilter, setPapFilter] = useState<'TOUS' | 'PAP' | 'HORS_PAP'>('TOUS')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [montantMin, setMontantMin] = useState('')
  const [montantMax, setMontantMax] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [page, setPage] = useState(1)
  const [activeKpi, setActiveKpi] = useState<string | null>(null)

  const nbASign = ORD_LIST.filter(o => o.status === 'A_SIGNER').length
  const montantASign = ORD_LIST.filter(o => o.status === 'A_SIGNER').reduce((s, o) => s + o.montant, 0)
  const nbTransmis = ORD_LIST.filter(o => o.status === 'TRANSMIS_AC' || o.status === 'TRANSFORME').length
  const montantTransmis = ORD_LIST.filter(o => o.status === 'TRANSMIS_AC' || o.status === 'TRANSFORME').reduce((s, o) => s + o.montant, 0)
  const nbRetournes = ORD_LIST.filter(o => o.status === 'RETOURNE' || o.status === 'REJETE').length
  const montantSigne = ORD_LIST.filter(o => ['SIGNE', 'TRANSMIS_AC', 'TRANSFORME'].includes(o.status)).reduce((s, o) => s + o.montant, 0)
  const montantLiquide = ORD_LIST.reduce((s, o) => s + o.montantBrut, 0) * 1.04
  const tauxOrd = Math.round(montantSigne / montantLiquide * 100)

  const filtered = ORD_LIST.filter(o => {
    if (search) {
      const q = search.toLowerCase()
      if (!o.reference.toLowerCase().includes(q) && !o.objet.toLowerCase().includes(q) && !o.tiers.toLowerCase().includes(q)) return false
    }
    const ef = activeKpi ?? (statusFilter !== 'TOUS' ? statusFilter : null)
    if (ef && o.status !== ef) return false
    if (ordonnateurFilter === 'SG' && o.ordonnateurRole !== 'SG') return false
    if (ordonnateurFilter === 'PRESIDENT' && o.ordonnateurRole !== 'PRESIDENT') return false
    if (papFilter === 'PAP' && !o.isPAP) return false
    if (papFilter === 'HORS_PAP' && o.isPAP) return false
    if (montantMin && o.montant < Number(montantMin)) return false
    if (montantMax && o.montant > Number(montantMax)) return false
    if (dateFrom && o.dateCreation < dateFrom) return false
    if (dateTo && o.dateCreation > dateTo) return false
    return true
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const hasFilters = statusFilter !== 'TOUS' || ordonnateurFilter !== 'TOUS' || papFilter !== 'TOUS' || !!montantMin || !!montantMax || !!dateFrom || !!dateTo || !!activeKpi

  function resetFilters() {
    setSearch(''); setStatusFilter('TOUS'); setOrdonnateurFilter('TOUS'); setPapFilter('TOUS')
    setMontantMin(''); setMontantMax(''); setDateFrom(''); setDateTo(''); setPage(1); setActiveKpi(null)
  }

  function toggleKpi(key: string) {
    setActiveKpi(prev => prev === key ? null : key)
    setStatusFilter('TOUS')
    setPage(1)
  }

  return (
    <div className="min-h-screen" style={{ background: '#F0F4FA' }}>
      {/* Bandeau navy */}
      <div className="px-6 pt-6 pb-5" style={{ background: '#0B1C3E' }}>
        <div className="max-w-[1280px] mx-auto">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <p className="text-xs text-white/40 uppercase tracking-widest mb-1 font-mono">Chaîne de dépense · Exercice 2026</p>
              <h1 className="text-2xl font-bold text-white">Ordonnancements</h1>
              <p className="text-sm text-white/60 mt-1">
                {ORD_LIST.length} dossiers · Génération automatique après visa Contrôleur Financier
              </p>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <button className="btn btn-sm gap-1.5 border-0" style={{ background: 'rgba(255,255,255,0.1)', color: 'white' }}>
                <Download size={13} /> Exporter
              </button>
              <button className="btn btn-sm gap-1.5 border-0" style={{ background: 'rgba(255,255,255,0.1)', color: 'white' }}>
                <BarChart3 size={13} /> Reporting
              </button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              onClick={() => toggleKpi('A_SIGNER')}
              className={`text-left p-4 rounded-xl border transition-all ${activeKpi === 'A_SIGNER' ? 'border-amber-400' : 'border-white/10 hover:bg-white/5'}`}
              style={{ background: activeKpi === 'A_SIGNER' ? 'rgba(251,191,36,0.18)' : 'rgba(255,255,255,0.06)' }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wide">À signer</span>
                <PenLine size={13} className="text-amber-300" />
              </div>
              <p className="text-2xl font-bold text-white">{nbASign}</p>
              <p className="text-[11px] text-white/40 mt-0.5 font-mono">{fmtShort(montantASign)} XAF</p>
            </button>

            <button
              onClick={() => toggleKpi('TRANSMIS_AC')}
              className={`text-left p-4 rounded-xl border transition-all ${activeKpi === 'TRANSMIS_AC' ? 'border-violet-400' : 'border-white/10 hover:bg-white/5'}`}
              style={{ background: activeKpi === 'TRANSMIS_AC' ? 'rgba(167,139,250,0.18)' : 'rgba(255,255,255,0.06)' }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-violet-300 uppercase tracking-wide">Transmis AC</span>
                <Send size={13} className="text-violet-300" />
              </div>
              <p className="text-2xl font-bold text-white">{nbTransmis}</p>
              <p className="text-[11px] text-white/40 mt-0.5 font-mono">{fmtShort(montantTransmis)} XAF</p>
            </button>

            <div className="p-4 rounded-xl border border-white/10" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wide">Taux ord.</span>
                <TrendingUp size={13} className="text-emerald-300" />
              </div>
              <p className="text-2xl font-bold text-white">{tauxOrd} %</p>
              <p className="text-[11px] text-white/40 mt-0.5">Ordonnancé / Liquidé</p>
            </div>

            <button
              onClick={() => toggleKpi('RETOURNE')}
              className={`text-left p-4 rounded-xl border transition-all ${activeKpi === 'RETOURNE' ? 'border-orange-400' : 'border-white/10 hover:bg-white/5'}`}
              style={{ background: activeKpi === 'RETOURNE' ? 'rgba(251,146,60,0.18)' : 'rgba(255,255,255,0.06)' }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-orange-300 uppercase tracking-wide">Retours / Rejets</span>
                <AlertTriangle size={13} className="text-orange-300" />
              </div>
              <p className="text-2xl font-bold text-white">{nbRetournes}</p>
              <p className="text-[11px] text-white/40 mt-0.5">Nécessitent une action</p>
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 py-5 max-w-[1280px] mx-auto space-y-4">

        {/* Filtres */}
        <div className="card p-4 space-y-3">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                className="form-input pl-9 py-2 text-[13px] w-full"
                placeholder="Référence ORD, objet, bénéficiaire…"
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1) }}
              />
            </div>

            <div className="flex items-center gap-1">
              {KPI_STATUTS.map(s => (
                <button
                  key={s}
                  onClick={() => { setStatusFilter(s); setActiveKpi(null); setPage(1) }}
                  className="px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all"
                  style={statusFilter === s && !activeKpi
                    ? { background: '#0B1C3E', color: 'white' }
                    : { background: '#F1F5F9', color: '#64748B' }}
                >
                  {s === 'TOUS' ? 'Tous' : STATUS_LABELS[s] ?? s}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowAdvanced(v => !v)}
              className={`btn btn-outline btn-sm gap-1 ${showAdvanced ? 'border-navy-900 text-navy-900' : ''}`}
            >
              <Filter size={12} /> Filtres
              <ChevronDown size={11} className={`transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
            </button>

            {hasFilters && (
              <button onClick={resetFilters} className="btn btn-sm text-[12px] text-slate-400 hover:text-red-500 gap-1">
                <X size={12} /> Réinitialiser
              </button>
            )}
          </div>

          {showAdvanced && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-slate-100">
              <div>
                <label className="form-label text-[11px]">Ordonnateur</label>
                <select className="form-input text-[13px]" value={ordonnateurFilter} onChange={e => { setOrdonnateurFilter(e.target.value as typeof ordonnateurFilter); setPage(1) }}>
                  <option value="TOUS">Tous</option>
                  <option value="SG">Secrétaire Général</option>
                  <option value="PRESIDENT">Président de la Commission</option>
                </select>
              </div>
              <div>
                <label className="form-label text-[11px]">PAP / Hors PAP</label>
                <select className="form-input text-[13px]" value={papFilter} onChange={e => { setPapFilter(e.target.value as typeof papFilter); setPage(1) }}>
                  <option value="TOUS">Tous</option>
                  <option value="PAP">PAP uniquement</option>
                  <option value="HORS_PAP">Hors PAP</option>
                </select>
              </div>
              <div>
                <label className="form-label text-[11px]">Montant min (XAF)</label>
                <input className="form-input text-[13px]" placeholder="0" value={montantMin} onChange={e => { setMontantMin(e.target.value); setPage(1) }} />
              </div>
              <div>
                <label className="form-label text-[11px]">Montant max (XAF)</label>
                <input className="form-input text-[13px]" placeholder="Illimité" value={montantMax} onChange={e => { setMontantMax(e.target.value); setPage(1) }} />
              </div>
              <div>
                <label className="form-label text-[11px]">Date de création — Du</label>
                <input type="date" className="form-input text-[13px]" value={dateFrom} onChange={e => { setDateFrom(e.target.value); setPage(1) }} />
              </div>
              <div>
                <label className="form-label text-[11px]">Au</label>
                <input type="date" className="form-input text-[13px]" value={dateTo} onChange={e => { setDateTo(e.target.value); setPage(1) }} />
              </div>
            </div>
          )}
        </div>

        {/* Filtre KPI actif */}
        {activeKpi && (
          <div className="flex items-center gap-2 text-[12px] text-slate-500">
            <span>Vue filtrée :</span>
            <StatusChip status={activeKpi} />
            <button onClick={() => setActiveKpi(null)} className="text-slate-400 hover:text-red-500 ml-0.5"><X size={11} /></button>
          </div>
        )}

        {/* Table */}
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
            <p className="text-[13px] font-semibold text-slate-700">
              {filtered.length} ordonnancement{filtered.length > 1 ? 's' : ''}
            </p>
            <p className="text-[12px] text-slate-400 font-mono">
              Total net : {fmt(filtered.reduce((s, o) => s + o.montant, 0))}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {['Référence / OP', 'Liquidation', 'Objet / Bénéficiaire', 'Structure', 'Ordonnateur', 'Net à ordonnancer', 'Statut', 'Date'].map(h => (
                    <th key={h} className="text-left px-4 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-10 text-center text-slate-400 text-[13px]">
                      Aucun ordonnancement ne correspond aux critères sélectionnés.
                    </td>
                  </tr>
                )}
                {paginated.map(o => (
                  <tr
                    key={o.id}
                    onClick={() => onNavigate('ord-detail', o.id)}
                    className="border-b border-slate-50 hover:bg-blue-50/40 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <p className="font-mono font-bold text-[12px]" style={{ color: '#0B1C3E' }}>{o.reference}</p>
                        {o.isPAP && <span className="px-1.5 py-0.5 rounded text-[9px] font-bold text-white" style={{ background: '#1D4ED8' }}>PAP</span>}
                      </div>
                      <p className="text-slate-400 text-[10px] mt-0.5 font-mono">{o.opReference}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-mono text-slate-600 text-[11px]">{o.liqReference}</p>
                      <p className="text-slate-400 text-[10px]">{o.engReference}</p>
                    </td>
                    <td className="px-4 py-3 max-w-[220px]">
                      <p className="text-slate-800 font-medium leading-tight line-clamp-2">{o.objet}</p>
                      <p className="text-slate-400 text-[10px] truncate">{o.tiers}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-slate-600 text-[11px] max-w-[130px] truncate">{o.structure}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold"
                        style={o.ordonnateurRole === 'SG'
                          ? { background: '#DBEAFE', color: '#1D4ED8' }
                          : { background: '#FEF3C7', color: '#92400E' }}
                      >
                        {o.ordonnateurRole === 'SG' ? 'SG' : 'Président'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <p className="font-mono font-bold text-slate-800 text-[13px]">{fmt(o.montant)}</p>
                      <p className="text-slate-400 text-[10px]">Ret. : {fmt(o.retenues)}</p>
                    </td>
                    <td className="px-4 py-3">
                      <StatusChip status={o.status} />
                    </td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap text-[11px]">
                      {o.dateSIgnature
                        ? <><span className="text-slate-400 text-[10px] block">Signé</span>{o.dateSIgnature}</>
                        : o.dateCreation}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100">
              <p className="text-[12px] text-slate-400">Page {page} / {totalPages}</p>
              <div className="flex items-center gap-1">
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="btn btn-sm btn-outline px-2 py-1 disabled:opacity-30"><ChevronLeft size={13} /></button>
                <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="btn btn-sm btn-outline px-2 py-1 disabled:opacity-30"><ChevronRight size={13} /></button>
              </div>
            </div>
          )}
        </div>

        {/* Progression budgétaire */}
        <div className="card p-5">
          <h3 className="section-title mb-5">Progression de l'exécution — Exercice 2026</h3>
          <div className="flex items-end gap-1 h-[120px] max-w-[500px]">
            {[
              { label: 'Budget', pct: 100, color: '#CBD5E1', text: '#64748B' },
              { label: 'Engagé', pct: 72, color: '#93C5FD', text: '#1D4ED8' },
              { label: 'Liquidé', pct: 55, color: '#6EE7B7', text: '#065F46' },
              { label: 'Ordonnancé', pct: 48, color: '#34D399', text: '#047857' },
              { label: 'Payé', pct: 35, color: '#10B981', text: '#064E3B' },
            ].map(s => (
              <div key={s.label} className="flex-1 flex flex-col items-center gap-1">
                <p className="text-[11px] font-bold" style={{ color: s.text }}>{s.pct} %</p>
                <div className="w-full rounded-t" style={{ height: `${s.pct}%`, background: s.color }} />
                <p className="text-[9px] text-slate-400 text-center leading-tight mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
