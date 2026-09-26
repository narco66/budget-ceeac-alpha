import { useState, useMemo } from 'react'
import {
  Plus, Filter, Download, Search, Eye, ChevronRight, ChevronLeft,
  ChevronDown, FileDown, Send, AlertTriangle, LayoutList, RefreshCw,
  Clock, CheckCircle, XCircle, RotateCcw, TrendingUp,
} from 'lucide-react'
import type { Page } from '../types'
import { EB_LIST } from '../data/mock'
import StatusBadge, { PriorityBadge } from '../components/StatusBadge'

const fmt = (n: number) =>
  new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(n) + ' XAF'

const STATUS_META: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  BROUILLON:       { label: 'Brouillon',          color: '#64748B', bg: '#F1F5F9', icon: <Clock size={12} /> },
  SOUMIS:          { label: 'Soumis',             color: '#2563EB', bg: '#EFF6FF', icon: <Send size={12} /> },
  EN_VALIDATION:   { label: 'En validation',      color: '#D97706', bg: '#FFFBEB', icon: <RefreshCw size={12} /> },
  A_COMPLETER:     { label: 'À compléter',        color: '#EA580C', bg: '#FFF7ED', icon: <AlertTriangle size={12} /> },
  EN_ATTENTE_INFO: { label: 'En attente info',    color: '#9333EA', bg: '#FAF5FF', icon: <Clock size={12} /> },
  RETOURNE:        { label: 'Retourné',           color: '#EA580C', bg: '#FFF7ED', icon: <RotateCcw size={12} /> },
  REJETE:          { label: 'Rejeté',             color: '#DC2626', bg: '#FEF2F2', icon: <XCircle size={12} /> },
  APPROUVE:        { label: 'Approuvé',           color: '#16A34A', bg: '#F0FDF4', icon: <CheckCircle size={12} /> },
  TRANSFORME:      { label: 'Transformé',         color: '#7C3AED', bg: '#F5F3FF', icon: <TrendingUp size={12} /> },
  ANNULE:          { label: 'Annulé',             color: '#94A3B8', bg: '#F8FAFC', icon: <XCircle size={12} /> },
}

const KPI_TABS = [
  { id: 'ALL',          label: 'Tous',           statuses: null },
  { id: 'BROUILLON',    label: 'Brouillon',      statuses: ['BROUILLON'] },
  { id: 'EN_COURS',     label: 'En cours',       statuses: ['SOUMIS', 'EN_VALIDATION'] },
  { id: 'RETOURNE',     label: 'Retourné',       statuses: ['RETOURNE'] },
  { id: 'APPROUVE',     label: 'Approuvé',       statuses: ['APPROUVE'] },
  { id: 'REJETE',       label: 'Rejeté',         statuses: ['REJETE'] },
  { id: 'TRANSFORME',   label: 'Transformé',     statuses: ['TRANSFORME'] },
]

const STRUCTURES = [
  'Toutes les structures',
  "Direction des Technologies de l'Information",
  'Département Intégration Économique',
  'Département Paix et Sécurité',
  'Direction des Affaires Juridiques',
  'Direction des Ressources Humaines',
  'Direction du Patrimoine et de la Logistique',
]

type SortField = 'reference' | 'dateCreation' | 'montant' | null
type SortDir = 'asc' | 'desc'
const PAGE_SIZE = 8

interface Props {
  onNavigate: (page: Page, id?: string) => void
}

export default function ExpressionBesoin({ onNavigate }: Props) {
  const [activeKpi, setActiveKpi] = useState('ALL')
  const [search, setSearch] = useState('')
  const [filterPAP, setFilterPAP] = useState<'ALL' | 'PAP' | 'HORS_PAP'>('ALL')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [filterDateDu, setFilterDateDu] = useState('')
  const [filterDateAu, setFilterDateAu] = useState('')
  const [filterStructure, setFilterStructure] = useState('Toutes les structures')
  const [filterMontantMin, setFilterMontantMin] = useState('')
  const [filterMontantMax, setFilterMontantMax] = useState('')
  const [sortField, setSortField] = useState<SortField>(null)
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [showExportModal, setShowExportModal] = useState(false)
  const [exportContext, setExportContext] = useState<'all' | 'selection'>('all')
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [showTransformModal, setShowTransformModal] = useState(false)
  const [transformTarget, setTransformTarget] = useState<typeof EB_LIST[0] | null>(null)

  const kpiCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: EB_LIST.length }
    KPI_TABS.forEach(t => {
      if (t.statuses) counts[t.id] = EB_LIST.filter(e => t.statuses!.includes(e.status)).length
    })
    return counts
  }, [])

  const kpiAmounts = useMemo(() => {
    const total = EB_LIST.reduce((s, e) => s + e.montant, 0)
    const approuve = EB_LIST.filter(e => e.status === 'APPROUVE').reduce((s, e) => s + e.montant, 0)
    const enCours = EB_LIST.filter(e => ['SOUMIS', 'EN_VALIDATION'].includes(e.status)).reduce((s, e) => s + e.montant, 0)
    return { total, approuve, enCours }
  }, [])

  const activeTab = KPI_TABS.find(t => t.id === activeKpi)!

  const filtered = useMemo(() => {
    let list = [...EB_LIST]
    if (activeTab.statuses) list = list.filter(e => activeTab.statuses!.includes(e.status))
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(e =>
        e.reference.toLowerCase().includes(q) ||
        e.objet.toLowerCase().includes(q) ||
        e.structure.toLowerCase().includes(q) ||
        e.initiateur.toLowerCase().includes(q) ||
        e.ligneBudgetaire.includes(q)
      )
    }
    if (filterPAP === 'PAP') list = list.filter(e => e.isPAP)
    if (filterPAP === 'HORS_PAP') list = list.filter(e => !e.isPAP)
    if (filterStructure !== 'Toutes les structures') list = list.filter(e => e.structure === filterStructure)
    if (filterMontantMin) list = list.filter(e => e.montant >= Number(filterMontantMin))
    if (filterMontantMax) list = list.filter(e => e.montant <= Number(filterMontantMax))
    if (sortField) {
      list.sort((a, b) => {
        let av: string | number, bv: string | number
        if (sortField === 'reference') { av = a.reference; bv = b.reference }
        else if (sortField === 'dateCreation') { av = a.dateCreation; bv = b.dateCreation }
        else { av = a.montant; bv = b.montant }
        if (av < bv) return sortDir === 'asc' ? -1 : 1
        if (av > bv) return sortDir === 'asc' ? 1 : -1
        return 0
      })
    }
    return list
  }, [activeKpi, search, filterPAP, filterStructure, filterMontantMin, filterMontantMax, sortField, sortDir, activeTab])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortDir('asc') }
    setPage(1)
  }

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      return next
    })
  }

  const toggleAll = () => {
    if (selected.size === paginated.length) setSelected(new Set())
    else setSelected(new Set(paginated.map(e => e.id)))
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
          <h1 className="text-xl font-bold text-[#0B1C3E]">Expressions de besoin</h1>
          <p className="text-xs text-slate-500 mt-0.5">Exercice 2026 · Chaîne de dépense — Étape 1</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setExportContext('all'); setShowExportModal(true) }}
            className="btn btn-outline btn-sm gap-1.5"
          >
            <Download size={13} /> Exporter
          </button>
          <button
            onClick={() => onNavigate('eb-form')}
            className="btn btn-primary btn-sm gap-1.5"
          >
            <Plus size={13} /> Nouvelle demande
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="card bg-gradient-to-br from-[#0B1C3E] to-[#1a3160] text-white">
          <p className="text-[10px] uppercase tracking-wider opacity-60 mb-1">Total demandes</p>
          <p className="text-3xl font-bold">{kpiCounts.ALL}</p>
          <p className="text-[11px] opacity-60 mt-1">{fmt(kpiAmounts.total)}</p>
        </div>
        <div className="card border-l-4 border-l-orange-400">
          <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">En cours</p>
          <p className="text-3xl font-bold text-orange-600">{kpiCounts.EN_COURS}</p>
          <p className="text-[11px] text-slate-400 mt-1">{fmt(kpiAmounts.enCours)}</p>
        </div>
        <div className="card border-l-4 border-l-green-500">
          <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">Approuvées</p>
          <p className="text-3xl font-bold text-green-600">{kpiCounts.APPROUVE}</p>
          <p className="text-[11px] text-slate-400 mt-1">{fmt(kpiAmounts.approuve)}</p>
        </div>
        <div className="card border-l-4 border-l-red-400">
          <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">Retournées / Rejetées</p>
          <p className="text-3xl font-bold text-red-600">{(kpiCounts.RETOURNE || 0) + (kpiCounts.REJETE || 0)}</p>
          <p className="text-[11px] text-slate-400 mt-1">Nécessitent une action</p>
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
              placeholder="Référence, objet, structure, initiateur, ligne budgétaire..."
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
            <Filter size={13} /> Filtres avancés
          </button>
        </div>
        {showAdvanced && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
            <div>
              <label className="form-label">Structure</label>
              <select className="form-input text-xs" value={filterStructure} onChange={e => { setFilterStructure(e.target.value); setPage(1) }}>
                {STRUCTURES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">Date du</label>
              <input type="date" className="form-input text-xs" value={filterDateDu} onChange={e => setFilterDateDu(e.target.value)} />
            </div>
            <div>
              <label className="form-label">Date au</label>
              <input type="date" className="form-input text-xs" value={filterDateAu} onChange={e => setFilterDateAu(e.target.value)} />
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="form-label">Montant min</label>
                <input type="number" className="form-input text-xs" placeholder="0" value={filterMontantMin} onChange={e => setFilterMontantMin(e.target.value)} />
              </div>
              <div className="flex-1">
                <label className="form-label">Max</label>
                <input type="number" className="form-input text-xs" value={filterMontantMax} onChange={e => setFilterMontantMax(e.target.value)} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bulk actions */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 px-4 py-2.5 bg-[#0B1C3E] text-white rounded-lg text-sm">
          <span>{selected.size} sélectionné{selected.size > 1 ? 's' : ''}</span>
          <div className="h-4 w-px bg-white/30" />
          <button
            onClick={() => { setExportContext('selection'); setShowExportModal(true) }}
            className="flex items-center gap-1.5 hover:text-blue-200 transition-colors"
          >
            <FileDown size={14} /> Exporter
          </button>
          <button
            onClick={() => setShowSubmitModal(true)}
            className="flex items-center gap-1.5 hover:text-green-200 transition-colors"
          >
            <Send size={14} /> Soumettre
          </button>
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
                  <input
                    type="checkbox"
                    className="accent-[#0B1C3E]"
                    checked={selected.size === paginated.length && paginated.length > 0}
                    onChange={toggleAll}
                  />
                </th>
                <th className="text-left cursor-pointer select-none" onClick={() => toggleSort('reference')}>
                  <span className="flex items-center gap-1">Référence <SortIcon field="reference" /></span>
                </th>
                <th className="text-left min-w-[180px]">Objet / Structure</th>
                <th className="text-left">Type</th>
                <th className="text-left">Ligne budgétaire</th>
                <th className="text-right cursor-pointer select-none" onClick={() => toggleSort('montant')}>
                  <span className="flex items-center justify-end gap-1">Montant <SortIcon field="montant" /></span>
                </th>
                <th className="text-left">Statut</th>
                <th className="text-left">Acteur attendu</th>
                <th className="text-center">Priorité</th>
                <th className="text-center w-20">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={10} className="text-center py-12 text-slate-400">
                    <LayoutList size={32} className="mx-auto mb-2 opacity-30" />
                    Aucune demande pour ces critères
                  </td>
                </tr>
              )}
              {paginated.map(eb => {
                const meta = STATUS_META[eb.status] || STATUS_META.BROUILLON
                return (
                  <tr key={eb.id} className={`hover:bg-slate-50 transition-colors ${selected.has(eb.id) ? 'bg-blue-50' : ''}`}>
                    <td className="px-4">
                      <input
                        type="checkbox"
                        className="accent-[#0B1C3E]"
                        checked={selected.has(eb.id)}
                        onChange={() => toggleSelect(eb.id)}
                      />
                    </td>
                    <td>
                      <button
                        onClick={() => onNavigate('eb-detail', eb.id)}
                        className="font-mono text-[#0B1C3E] hover:underline font-semibold text-[11px]"
                      >
                        {eb.reference}
                      </button>
                      <p className="text-[10px] text-slate-400 mt-0.5">{eb.dateCreation}</p>
                    </td>
                    <td>
                      <p className="font-medium text-slate-800 leading-snug max-w-[200px] truncate" title={eb.objet}>{eb.objet}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{eb.structure}</p>
                    </td>
                    <td>
                      <span className={`badge text-[10px] ${eb.isPAP ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'}`}>
                        {eb.isPAP ? 'PAP' : 'Hors PAP'}
                      </span>
                    </td>
                    <td>
                      <span className="font-mono text-[11px] text-slate-700">{eb.ligneBudgetaire}</span>
                    </td>
                    <td className="text-right font-mono font-semibold text-[#0B1C3E] amount">
                      {fmt(eb.montant)}
                    </td>
                    <td>
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                        style={{ color: meta.color, backgroundColor: meta.bg }}
                      >
                        {meta.icon} {meta.label}
                      </span>
                    </td>
                    <td>
                      {eb.acteurAttendu ? (
                        <p className="text-[11px] text-slate-600 max-w-[120px] truncate" title={eb.acteurAttendu}>{eb.acteurAttendu}</p>
                      ) : (
                        <span className="text-[10px] text-slate-300">—</span>
                      )}
                    </td>
                    <td className="text-center">
                      <PriorityBadge priority={eb.priorite} />
                    </td>
                    <td>
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => onNavigate('eb-detail', eb.id)}
                          title="Voir le dossier"
                          className="p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-[#0B1C3E] transition-colors"
                        >
                          <Eye size={13} />
                        </button>
                        {eb.status === 'APPROUVE' && (
                          <button
                            title="Transformer en engagement"
                            onClick={() => { setTransformTarget(eb); setShowTransformModal(true) }}
                            className="p-1.5 rounded hover:bg-purple-100 text-slate-400 hover:text-purple-600 transition-colors"
                          >
                            <ChevronRight size={13} />
                          </button>
                        )}
                        {eb.status === 'RETOURNE' && (
                          <button
                            title="À corriger"
                            onClick={() => onNavigate('eb-detail', eb.id)}
                            className="p-1.5 rounded hover:bg-orange-100 text-orange-400 hover:text-orange-600 transition-colors"
                          >
                            <AlertTriangle size={13} />
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
            <span>
              {filtered.length} résultat{filtered.length > 1 ? 's' : ''} ·
              Page {page} / {totalPages}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded hover:bg-slate-200 disabled:opacity-40 transition-colors"
              >
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const p = totalPages <= 5 ? i + 1 : Math.max(1, Math.min(page - 2, totalPages - 4)) + i
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-7 h-7 rounded text-xs font-medium transition-colors ${page === p ? 'bg-[#0B1C3E] text-white' : 'hover:bg-slate-200'}`}
                  >
                    {p}
                  </button>
                )
              })}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded hover:bg-slate-200 disabled:opacity-40 transition-colors"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
      {/* Modal Export */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[#0B1C3E]">Exporter les données</h3>
              <button onClick={() => setShowExportModal(false)} className="text-slate-400 hover:text-slate-700"><XCircle size={20} /></button>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600">
              {exportContext === 'selection'
                ? `${selected.size} expression${selected.size > 1 ? 's' : ''} sélectionnée${selected.size > 1 ? 's' : ''}`
                : `${filtered.length} expression${filtered.length > 1 ? 's' : ''} (vue actuelle)`}
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-600 mb-2">Format d'export</p>
              <div className="grid grid-cols-3 gap-2">
                {(['CSV', 'XLSX', 'PDF'] as const).map(fmt => (
                  <button
                    key={fmt}
                    onClick={() => setShowExportModal(false)}
                    className="py-2.5 px-3 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:border-[#0B1C3E] hover:bg-slate-50 transition-colors"
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={() => setShowExportModal(false)} className="w-full btn btn-outline btn-sm">Annuler</button>
          </div>
        </div>
      )}

      {/* Modal Soumission en lot */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[#0B1C3E]">Soumettre la sélection</h3>
              <button onClick={() => setShowSubmitModal(false)} className="text-slate-400 hover:text-slate-700"><XCircle size={20} /></button>
            </div>
            <div className="flex gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <Send size={15} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700">
                Les expressions de besoin sélectionnées seront soumises au circuit de validation. Cette action est irréversible.
              </p>
            </div>
            <div className="max-h-40 overflow-y-auto space-y-1">
              {[...selected].map(id => {
                const eb = EB_LIST.find(e => e.id === id)
                if (!eb) return null
                return (
                  <div key={id} className="flex items-center gap-2 p-2 bg-slate-50 rounded text-xs">
                    <CheckCircle size={12} className="text-green-500 flex-shrink-0" />
                    <span className="font-mono text-[#0B1C3E] font-semibold">{eb.reference}</span>
                    <span className="text-slate-500 truncate">{eb.objet}</span>
                  </div>
                )
              })}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowSubmitModal(false)} className="btn btn-outline flex-1">Annuler</button>
              <button
                onClick={() => { setShowSubmitModal(false); setSelected(new Set()) }}
                className="btn btn-primary flex-1 gap-1.5"
              >
                <Send size={14} /> Confirmer la soumission
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Transformer en engagement */}
      {showTransformModal && transformTarget && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[#0B1C3E]">Transformer en engagement</h3>
              <button onClick={() => setShowTransformModal(false)} className="text-slate-400 hover:text-slate-700"><XCircle size={20} /></button>
            </div>
            <div className="flex gap-2 p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <TrendingUp size={15} className="text-purple-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-purple-700">
                Un engagement budgétaire sera créé automatiquement depuis cette expression de besoin approuvée. Le montant sera réservé sur la ligne budgétaire correspondante.
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Référence EB</span>
                <span className="font-mono font-bold text-[#0B1C3E]">{transformTarget.reference}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Montant</span>
                <span className="font-semibold text-[#0B1C3E]">{fmt(transformTarget.montant)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Ligne budgétaire</span>
                <span className="font-mono text-slate-700">{transformTarget.ligneBudgetaire}</span>
              </div>
              <div className="pt-1 border-t border-slate-200">
                <p className="text-slate-500 truncate" title={transformTarget.objet}>{transformTarget.objet}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowTransformModal(false)} className="btn btn-outline flex-1">Annuler</button>
              <button
                onClick={() => { setShowTransformModal(false); onNavigate('eng-list') }}
                className="btn flex-1 gap-1.5 bg-purple-600 text-white hover:bg-purple-700"
              >
                <ChevronRight size={14} /> Confirmer la transformation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
