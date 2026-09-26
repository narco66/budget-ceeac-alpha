import { useState, useMemo } from 'react'
import {
  Plus, Filter, Download, Search, Eye, ChevronRight, ChevronLeft,
  ChevronDown, AlertTriangle, RefreshCw, Clock, CheckCircle, XCircle,
  RotateCcw, TrendingUp, Shield, Send, LayoutList, FileDown,
} from 'lucide-react'
import type { Page } from '../types'
import { ENG_LIST } from '../data/mock'
import StatusBadge from '../components/StatusBadge'

const fmt = (n: number) =>
  new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(n) + ' XAF'

const STATUS_META: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  GENERE:          { label: 'Généré',           color: '#2563EB', bg: '#EFF6FF', icon: <RefreshCw size={11} /> },
  EN_PREPARATION:  { label: 'En préparation',   color: '#0891B2', bg: '#ECFEFF', icon: <Clock size={11} /> },
  A_COMPLETER:     { label: 'À compléter',      color: '#EA580C', bg: '#FFF7ED', icon: <AlertTriangle size={11} /> },
  EN_VALIDATION_BUDGET: { label: 'Validation Budget', color: '#D97706', bg: '#FFFBEB', icon: <RefreshCw size={11} /> },
  CONTROLE_FINANCIER:   { label: 'Contrôle CF', color: '#7C3AED', bg: '#F5F3FF', icon: <Shield size={11} /> },
  RETOURNE:        { label: 'Retourné',          color: '#EA580C', bg: '#FFF7ED', icon: <RotateCcw size={11} /> },
  REJETE:          { label: 'Rejeté',            color: '#DC2626', bg: '#FEF2F2', icon: <XCircle size={11} /> },
  VISE:            { label: 'Visé',              color: '#16A34A', bg: '#F0FDF4', icon: <CheckCircle size={11} /> },
  TRANSFORME:      { label: 'Transformé Liq.',  color: '#6D28D9', bg: '#EDE9FE', icon: <TrendingUp size={11} /> },
  ANNULE:          { label: 'Annulé',            color: '#94A3B8', bg: '#F8FAFC', icon: <XCircle size={11} /> },
}

const KPI_TABS = [
  { id: 'ALL',           label: 'Tous',              statuses: null },
  { id: 'A_TRAITER',     label: 'À traiter',         statuses: ['GENERE', 'EN_PREPARATION'] },
  { id: 'VALIDATION',    label: 'Validation Budget', statuses: ['EN_VALIDATION_BUDGET'] },
  { id: 'CF',            label: 'Contrôle CF',       statuses: ['CONTROLE_FINANCIER'] },
  { id: 'RETOURNE',      label: 'Retournés',         statuses: ['RETOURNE'] },
  { id: 'REJETE',        label: 'Rejetés',           statuses: ['REJETE'] },
  { id: 'VISE',          label: 'Visés',             statuses: ['VISE'] },
  { id: 'TRANSFORME',    label: 'Transformés',       statuses: ['TRANSFORME'] },
]

const PAGE_SIZE = 8
type SortField = 'reference' | 'dateCreation' | 'montant' | null
type SortDir = 'asc' | 'desc'

interface Props {
  onNavigate: (page: Page, id?: string) => void
}

export default function Engagement({ onNavigate }: Props) {
  const [activeKpi, setActiveKpi] = useState('ALL')
  const [search, setSearch] = useState('')
  const [filterPAP, setFilterPAP] = useState<'ALL' | 'PAP' | 'HORS_PAP'>('ALL')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [filterStructure, setFilterStructure] = useState('')
  const [sortField, setSortField] = useState<SortField>(null)
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [engToast, setEngToast] = useState(false)

  const exportEngagements = (list: typeof ENG_LIST) => {
    const rows = [
      'Référence,EB Source,Objet,Structure,Montant (XAF),Statut,PAP,Date création',
      ...list.map(e => `${e.reference},${e.ebReference},"${e.objet}",${e.structure},${e.montant},${e.status},${e.isPAP ? 'Oui' : 'Non'},${e.dateCreation}`)
    ]
    const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Engagements_CEEAC_${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
    setEngToast(true)
    setTimeout(() => setEngToast(false), 3000)
  }

  const kpiCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: ENG_LIST.length }
    KPI_TABS.forEach(t => {
      if (t.statuses) counts[t.id] = ENG_LIST.filter(e => t.statuses!.includes(e.status)).length
    })
    return counts
  }, [])

  const montantTotal = useMemo(() => ENG_LIST.reduce((s, e) => s + e.montant, 0), [])
  const montantVise = useMemo(() => ENG_LIST.filter(e => e.status === 'VISE' || e.status === 'TRANSFORME').reduce((s, e) => s + e.montant, 0), [])
  const montantEnCours = useMemo(() => ENG_LIST.filter(e => ['EN_VALIDATION_BUDGET', 'CONTROLE_FINANCIER'].includes(e.status)).reduce((s, e) => s + e.montant, 0), [])
  const txEngagement = Math.round((montantVise / (800_000_000)) * 100)

  const activeTab = KPI_TABS.find(t => t.id === activeKpi)!

  const filtered = useMemo(() => {
    let list = [...ENG_LIST]
    if (activeTab.statuses) list = list.filter(e => activeTab.statuses!.includes(e.status))
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(e =>
        e.reference.toLowerCase().includes(q) ||
        e.ebReference.toLowerCase().includes(q) ||
        e.objet.toLowerCase().includes(q) ||
        e.structure.toLowerCase().includes(q) ||
        e.tiers.toLowerCase().includes(q)
      )
    }
    if (filterPAP === 'PAP') list = list.filter(e => e.isPAP)
    if (filterPAP === 'HORS_PAP') list = list.filter(e => !e.isPAP)
    if (filterStructure) list = list.filter(e => e.structure.toLowerCase().includes(filterStructure.toLowerCase()))
    if (sortField) {
      list.sort((a, b) => {
        const av = sortField === 'montant' ? a.montant : sortField === 'dateCreation' ? a.dateCreation : a.reference
        const bv = sortField === 'montant' ? b.montant : sortField === 'dateCreation' ? b.dateCreation : b.reference
        if (av < bv) return sortDir === 'asc' ? -1 : 1
        if (av > bv) return sortDir === 'asc' ? 1 : -1
        return 0
      })
    }
    return list
  }, [activeKpi, search, filterPAP, filterStructure, sortField, sortDir, activeTab])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortDir('asc') }
    setPage(1)
  }

  const toggleSelect = (id: string) => {
    setSelected(prev => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next })
  }

  const SortIcon = ({ field }: { field: SortField }) =>
    sortField === field
      ? <ChevronDown size={12} className={sortDir === 'desc' ? 'rotate-180 transition-transform' : 'transition-transform'} />
      : <ChevronDown size={12} className="opacity-20" />

  return (
    <div className="p-6 space-y-5 max-w-[1400px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#0B1C3E]">Engagements budgétaires</h1>
          <p className="text-xs text-slate-500 mt-0.5">Exercice 2026 · Chaîne de dépense — Étape 2</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-outline btn-sm gap-1.5" onClick={() => exportEngagements(filtered)}><Download size={13} /> Exporter</button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="card bg-gradient-to-br from-[#0B1C3E] to-[#1a3160] text-white">
          <p className="text-[10px] uppercase tracking-wider opacity-60 mb-1">Total engagements</p>
          <p className="text-3xl font-bold">{kpiCounts.ALL}</p>
          <p className="text-[11px] opacity-60 mt-1">{fmt(montantTotal)}</p>
        </div>
        <div className="card border-l-4 border-l-purple-500">
          <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">Contrôle CF</p>
          <p className="text-3xl font-bold text-purple-700">{kpiCounts.CF ?? 0}</p>
          <p className="text-[11px] text-slate-400 mt-1">{fmt(montantEnCours)}</p>
        </div>
        <div className="card border-l-4 border-l-green-500">
          <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">Visés / Transformés</p>
          <p className="text-3xl font-bold text-green-600">{(kpiCounts.VISE ?? 0) + (kpiCounts.TRANSFORME ?? 0)}</p>
          <p className="text-[11px] text-slate-400 mt-1">{fmt(montantVise)}</p>
        </div>
        <div className="card border-l-4 border-l-[#D4A017]">
          <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">Taux d'engagement</p>
          <p className="text-3xl font-bold text-[#0B1C3E]">{txEngagement}%</p>
          <div className="mt-2 h-1.5 bg-slate-200 rounded-full">
            <div className="h-1.5 bg-[#D4A017] rounded-full" style={{ width: `${txEngagement}%` }} />
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 bg-white border border-slate-200 rounded-lg p-1 overflow-x-auto">
        {KPI_TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveKpi(tab.id); setPage(1) }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
              activeKpi === tab.id ? 'bg-[#0B1C3E] text-white' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab.label}
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
              activeKpi === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
            }`}>
              {kpiCounts[tab.id] ?? 0}
            </span>
          </button>
        ))}
      </div>

      {/* Search + Filters */}
      <div className="card space-y-3">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              className="form-input pl-9 text-sm"
              placeholder="Référence ENG, EB source, objet, structure, bénéficiaire..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
            />
          </div>
          <div className="flex gap-1 p-1 bg-slate-100 rounded-lg text-xs">
            {(['ALL', 'PAP', 'HORS_PAP'] as const).map(v => (
              <button
                key={v}
                onClick={() => { setFilterPAP(v); setPage(1) }}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${filterPAP === v ? 'bg-white shadow-sm text-[#0B1C3E]' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {v === 'ALL' ? 'Tous' : v === 'PAP' ? 'PAP' : 'Hors PAP'}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowAdvanced(v => !v)}
            className={`btn btn-outline btn-sm gap-1.5 ${showAdvanced ? 'bg-slate-100' : ''}`}
          >
            <Filter size={13} /> Filtres
          </button>
        </div>
        {showAdvanced && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
            <div>
              <label className="form-label">Structure</label>
              <input className="form-input text-xs" placeholder="Nom de la structure..." value={filterStructure} onChange={e => setFilterStructure(e.target.value)} />
            </div>
            <div>
              <label className="form-label">Date du</label>
              <input type="date" className="form-input text-xs" />
            </div>
            <div>
              <label className="form-label">Date au</label>
              <input type="date" className="form-input text-xs" />
            </div>
            <div>
              <label className="form-label">Bénéficiaire</label>
              <input className="form-input text-xs" placeholder="Raison sociale..." />
            </div>
          </div>
        )}
      </div>

      {/* Bulk actions */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 px-4 py-2.5 bg-[#0B1C3E] text-white rounded-lg text-sm">
          <span>{selected.size} sélectionné{selected.size > 1 ? 's' : ''}</span>
          <div className="h-4 w-px bg-white/30" />
          <button className="flex items-center gap-1.5 hover:text-blue-200" onClick={() => exportEngagements(selected.size > 0 ? ENG_LIST.filter(e => selected.has(e.id)) : filtered)}><FileDown size={14} /> Exporter {selected.size > 0 ? `(${selected.size} sélect.)` : ''}</button>
          <button className="ml-auto text-white/60 hover:text-white" onClick={() => setSelected(new Set())}>
            <XCircle size={16} />
          </button>
        </div>
      )}

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table w-full text-xs">
            <thead>
              <tr>
                <th className="w-8 px-4">
                  <input type="checkbox" className="accent-[#0B1C3E]" checked={selected.size === paginated.length && paginated.length > 0} onChange={() => selected.size === paginated.length ? setSelected(new Set()) : setSelected(new Set(paginated.map(e => e.id)))} />
                </th>
                <th className="text-left cursor-pointer" onClick={() => toggleSort('reference')}>
                  <span className="flex items-center gap-1">Référence ENG <SortIcon field="reference" /></span>
                </th>
                <th className="text-left">EB source</th>
                <th className="text-left min-w-[160px]">Objet / Structure</th>
                <th className="text-left">Type</th>
                <th className="text-left">Bénéficiaire</th>
                <th className="text-left">Ligne budg.</th>
                <th className="text-right cursor-pointer" onClick={() => toggleSort('montant')}>
                  <span className="flex items-center justify-end gap-1">Montant <SortIcon field="montant" /></span>
                </th>
                <th className="text-left">Statut</th>
                <th className="text-left">Acteur attendu</th>
                <th className="text-center w-16">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={11} className="text-center py-12 text-slate-400">
                    <LayoutList size={32} className="mx-auto mb-2 opacity-30" />
                    Aucun engagement pour ces critères
                  </td>
                </tr>
              )}
              {paginated.map(eng => {
                const meta = STATUS_META[eng.status] || STATUS_META.GENERE
                return (
                  <tr key={eng.id} className={`hover:bg-slate-50 transition-colors ${selected.has(eng.id) ? 'bg-blue-50' : ''}`}>
                    <td className="px-4">
                      <input type="checkbox" className="accent-[#0B1C3E]" checked={selected.has(eng.id)} onChange={() => toggleSelect(eng.id)} />
                    </td>
                    <td>
                      <button onClick={() => onNavigate('eng-detail', eng.id)} className="font-mono text-[#0B1C3E] hover:underline font-semibold text-[11px]">
                        {eng.reference}
                      </button>
                      <p className="text-[10px] text-slate-400 mt-0.5">{eng.dateCreation}</p>
                    </td>
                    <td>
                      <button onClick={() => onNavigate('eb-detail', eng.ebReference)} className="font-mono text-blue-600 hover:underline text-[11px]">
                        {eng.ebReference}
                      </button>
                    </td>
                    <td>
                      <p className="font-medium text-slate-800 leading-snug max-w-[180px] truncate" title={eng.objet}>{eng.objet}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{eng.structure}</p>
                    </td>
                    <td>
                      <span className={`badge text-[10px] ${eng.isPAP ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'}`}>
                        {eng.isPAP ? 'PAP' : 'Hors PAP'}
                      </span>
                    </td>
                    <td className="text-slate-700 max-w-[100px] truncate text-[11px]" title={eng.tiers}>{eng.tiers}</td>
                    <td className="font-mono text-[11px] text-slate-600">{eng.creditAvant > 0 ? '310101' : '410234'}</td>
                    <td className="text-right font-mono font-semibold text-[#0B1C3E] amount">{fmt(eng.montant)}</td>
                    <td>
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                        style={{ color: meta.color, backgroundColor: meta.bg }}
                      >
                        {meta.icon} {meta.label}
                      </span>
                    </td>
                    <td>
                      {eng.acteurAttendu
                        ? <p className="text-[11px] text-slate-600 max-w-[100px] truncate" title={eng.acteurAttendu}>{eng.acteurAttendu}</p>
                        : <span className="text-[10px] text-slate-300">—</span>}
                    </td>
                    <td>
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => onNavigate('eng-detail', eng.id)}
                          className="p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-[#0B1C3E] transition-colors"
                        >
                          <Eye size={13} />
                        </button>
                        {eng.status === 'RETOURNE' && (
                          <span className="text-orange-400"><AlertTriangle size={13} /></span>
                        )}
                        {eng.status === 'VISE' && (
                          <button className="p-1.5 rounded hover:bg-purple-50 text-slate-400 hover:text-purple-600 transition-colors">
                            <ChevronRight size={13} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filtered.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-slate-50/50 text-xs text-slate-500">
            <span>{filtered.length} résultat{filtered.length > 1 ? 's' : ''} · Page {page} / {totalPages}</span>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-1.5 rounded hover:bg-slate-200 disabled:opacity-40">
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const p = totalPages <= 5 ? i + 1 : Math.max(1, Math.min(page - 2, totalPages - 4)) + i
                return (
                  <button key={p} onClick={() => setPage(p)} className={`w-7 h-7 rounded text-xs font-medium transition-colors ${page === p ? 'bg-[#0B1C3E] text-white' : 'hover:bg-slate-200'}`}>{p}</button>
                )
              })}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-1.5 rounded hover:bg-slate-200 disabled:opacity-40">
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
      {engToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-xl text-[13px] font-medium flex items-center gap-2.5">
          <CheckCircle size={15} className="text-green-400" />Engagements exportés en CSV ✓
        </div>
      )}
    </div>
  )
}
