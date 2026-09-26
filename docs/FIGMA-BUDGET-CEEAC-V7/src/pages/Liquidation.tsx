import { useState } from 'react'
import {
  Search, Filter, Download, ChevronDown, ChevronUp, X, Eye,
  CheckCircle, XCircle, RotateCcw, Clock, TrendingUp, AlertTriangle,
  ArrowRight, Printer, RefreshCw, Send, Ban, ShieldCheck, FileSpreadsheet,
} from 'lucide-react'
import type { Page } from '../types'
import { LIQ_LIST } from '../data/mock'

const fmt = (n: number) =>
  new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(n)

const STATUS_META: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  GENEREE:            { label: 'Générée',             color: '#2563EB', bg: '#EFF6FF', icon: <RefreshCw size={11} /> },
  EN_PREPARATION:     { label: 'En préparation',      color: '#0891B2', bg: '#ECFEFF', icon: <Clock size={11} /> },
  EN_CERTIFICATION:   { label: 'En certification',    color: '#D97706', bg: '#FFFBEB', icon: <ShieldCheck size={11} /> },
  SERVICE_FAIT:       { label: 'Service fait certifié', color: '#16A34A', bg: '#F0FDF4', icon: <CheckCircle size={11} /> },
  A_COMPLETER:        { label: 'À compléter',         color: '#EA580C', bg: '#FFF7ED', icon: <AlertTriangle size={11} /> },
  SOUMISE:            { label: 'Soumise',              color: '#7C3AED', bg: '#F5F3FF', icon: <Send size={11} /> },
  EN_CONTROLE:        { label: 'Contrôle CF',          color: '#6D28D9', bg: '#EDE9FE', icon: <ShieldCheck size={11} /> },
  RETOURNEE:          { label: 'Retournée',            color: '#EA580C', bg: '#FFF7ED', icon: <RotateCcw size={11} /> },
  COMPLEMENT_DEMANDE: { label: 'Complément demandé',  color: '#B45309', bg: '#FEF3C7', icon: <AlertTriangle size={11} /> },
  VISEE:              { label: 'Visée',                color: '#16A34A', bg: '#F0FDF4', icon: <CheckCircle size={11} /> },
  REJETEE:            { label: 'Rejetée',              color: '#DC2626', bg: '#FEF2F2', icon: <XCircle size={11} /> },
  ANNULEE:            { label: 'Annulée',              color: '#94A3B8', bg: '#F8FAFC', icon: <Ban size={11} /> },
  TRANSFORMEE:        { label: 'Transformée ORD',      color: '#7C3AED', bg: '#F5F3FF', icon: <TrendingUp size={11} /> },
  VALIDEE:            { label: 'Validée',              color: '#16A34A', bg: '#F0FDF4', icon: <CheckCircle size={11} /> },
}

const SF_META: Record<string, { label: string; color: string; bg: string }> = {
  CONFORME:       { label: 'Conforme',       color: '#166534', bg: '#DCFCE7' },
  PARTIEL:        { label: 'Partiel',        color: '#713F12', bg: '#FEF9C3' },
  AVEC_RESERVES:  { label: 'Avec réserves', color: '#9A3412', bg: '#FFEDD5' },
  NON_CONFORME:   { label: 'Non conforme',  color: '#991B1B', bg: '#FEE2E2' },
  NON_FAIT:       { label: 'Non fait',      color: '#6D28D9', bg: '#F5F3FF' },
}

const KPI_TABS = [
  { id: 'ALL',           label: 'Toutes',              statuses: null },
  { id: 'A_TRAITER',     label: 'À traiter',           statuses: ['GENEREE', 'EN_PREPARATION', 'EN_CERTIFICATION'] },
  { id: 'SF',            label: 'Service fait certifié', statuses: ['SERVICE_FAIT', 'SOUMISE'] },
  { id: 'CF',            label: 'Contrôle CF',         statuses: ['EN_CONTROLE', 'COMPLEMENT_DEMANDE'] },
  { id: 'RETOURNEE',     label: 'Retournées',          statuses: ['RETOURNEE', 'A_COMPLETER'] },
  { id: 'REJETEE',       label: 'Rejetées',            statuses: ['REJETEE'] },
  { id: 'VISEE',         label: 'Visées',              statuses: ['VISEE'] },
  { id: 'TRANSFORMEE',   label: 'Transformées',        statuses: ['TRANSFORMEE'] },
]

const PAGE_SIZE = 8

interface Props {
  onNavigate: (page: Page, id?: string) => void
}

export default function Liquidation({ onNavigate }: Props) {
  const [activeKpi, setActiveKpi] = useState('ALL')
  const [search, setSearch] = useState('')
  const [papFilter, setPapFilter] = useState<'ALL' | 'PAP' | 'HORS_PAP'>('ALL')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [filterStructure, setFilterStructure] = useState('')
  const [filterMontantMin, setFilterMontantMin] = useState('')
  const [filterMontantMax, setFilterMontantMax] = useState('')
  const [filterDateFrom, setFilterDateFrom] = useState('')
  const [filterDateTo, setFilterDateTo] = useState('')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [showRapportModal, setShowRapportModal] = useState(false)
  const [rapportFormat, setRapportFormat] = useState<'pdf-synthese' | 'pdf-detail' | 'excel'>('pdf-synthese')
  const [rapportPeriodeFrom, setRapportPeriodeFrom] = useState('')
  const [rapportPeriodeTo, setRapportPeriodeTo] = useState('')

  const kpiTab = KPI_TABS.find(t => t.id === activeKpi)

  const filtered = LIQ_LIST.filter(l => {
    if (kpiTab?.statuses && !kpiTab.statuses.includes(l.status)) return false
    if (search) {
      const q = search.toLowerCase()
      if (!l.reference.toLowerCase().includes(q) &&
          !l.objet.toLowerCase().includes(q) &&
          !l.tiers.toLowerCase().includes(q) &&
          !l.engReference.toLowerCase().includes(q)) return false
    }
    if (papFilter === 'PAP' && !l.isPAP) return false
    if (papFilter === 'HORS_PAP' && l.isPAP) return false
    if (filterStructure && !l.structure.toLowerCase().includes(filterStructure.toLowerCase())) return false
    if (filterMontantMin && l.montantNet < Number(filterMontantMin)) return false
    if (filterMontantMax && l.montantNet > Number(filterMontantMax)) return false
    if (filterDateFrom && l.dateCreation < filterDateFrom) return false
    if (filterDateTo && l.dateCreation > filterDateTo) return false
    return true
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const kpiCounts = Object.fromEntries(
    KPI_TABS.map(t => [t.id, t.statuses ? LIQ_LIST.filter(l => t.statuses!.includes(l.status)).length : LIQ_LIST.length])
  )

  const totalEngage  = LIQ_LIST.reduce((s, l) => s + l.montantEngage, 0)
  const totalLiquide = LIQ_LIST.reduce((s, l) => s + l.montantNet, 0)
  const tauxLiq = Math.round((totalLiquide / totalEngage) * 100)

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const n = new Set(prev)
      n.has(id) ? n.delete(id) : n.add(id)
      return n
    })
  }
  const allSelected = pageData.length > 0 && pageData.every(l => selected.has(l.id))
  const toggleAll = () => {
    if (allSelected) setSelected(prev => { const n = new Set(prev); pageData.forEach(l => n.delete(l.id)); return n })
    else setSelected(prev => { const n = new Set(prev); pageData.forEach(l => n.add(l.id)); return n })
  }

  const exportCSV = () => {
    const rows = [
      ['Référence','ENG','EB','Objet','Structure','Fournisseur','PAP','Montant engagé','Montant net','Statut','Service fait','Date'].join(';'),
      ...filtered.map(l => [l.reference,l.engReference,l.ebReference,l.objet,l.structure,l.tiers,l.isPAP?'PAP':'HORS PAP',l.montantEngage,l.montantNet,l.status,l.serviceFait,l.dateCreation].join(';')),
    ]
    const blob = new Blob([rows.join('\n')], { type: 'text/csv' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'liquidations.csv'; a.click()
  }

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#0B1C3E' }}>Liquidations</h1>
          <p className="text-sm text-slate-500 mt-0.5">Exercice 2026 · Chaîne de dépense · Étape 3/5</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportCSV} className="btn btn-outline btn-sm gap-1.5"><Download size={13} /> Exporter CSV</button>
          <button onClick={() => setShowRapportModal(true)} className="btn btn-outline btn-sm gap-1.5"><Printer size={13} /> Rapport</button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="card p-4" style={{ background: 'linear-gradient(135deg,#0B1C3E 0%,#1e3a6e 100%)' }}>
          <p className="text-xs text-white/50 mb-1">Total Liquidations</p>
          <p className="text-3xl font-bold text-white">{LIQ_LIST.length}</p>
          <p className="text-xs text-white/40 mt-1">Exercice 2026</p>
        </div>
        <div className="card p-4 border-l-4" style={{ borderLeftColor: '#D97706' }}>
          <p className="text-xs text-slate-400 mb-1">En cours de traitement</p>
          <p className="text-3xl font-bold text-amber-600">
            {LIQ_LIST.filter(l => ['GENEREE','EN_PREPARATION','EN_CERTIFICATION','SERVICE_FAIT','SOUMISE','EN_CONTROLE','COMPLEMENT_DEMANDE'].includes(l.status)).length}
          </p>
          <p className="text-xs text-slate-400 mt-1">À certifier / Contrôle CF</p>
        </div>
        <div className="card p-4 border-l-4" style={{ borderLeftColor: '#16A34A' }}>
          <p className="text-xs text-slate-400 mb-1">Visées / Transformées</p>
          <p className="text-3xl font-bold text-green-700">
            {LIQ_LIST.filter(l => ['VISEE','TRANSFORMEE','VALIDEE'].includes(l.status)).length}
          </p>
          <p className="text-xs text-slate-400 mt-1">Validées par le CF</p>
        </div>
        <div className="card p-4 border-l-4" style={{ borderLeftColor: '#2563EB' }}>
          <p className="text-xs text-slate-400 mb-1">Taux de liquidation</p>
          <p className="text-3xl font-bold" style={{ color: '#2563EB' }}>{tauxLiq}%</p>
          <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2">
            <div className="h-1.5 rounded-full" style={{ width: `${tauxLiq}%`, background: '#2563EB' }} />
          </div>
        </div>
      </div>

      {/* Financial KPI bar */}
      <div className="card p-4">
        <div className="grid grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-xs text-slate-400 mb-0.5">Montant total engagé</p>
            <p className="font-bold text-lg" style={{ color: '#0B1C3E' }}>{fmt(totalEngage)} <span className="text-xs font-normal text-slate-400">XAF</span></p>
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-0.5">Montant total liquidé</p>
            <p className="font-bold text-lg text-green-700">{fmt(totalLiquide)} <span className="text-xs font-normal text-slate-400">XAF</span></p>
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-0.5">Reste à liquider</p>
            <p className="font-bold text-lg text-amber-600">{fmt(totalEngage - totalLiquide)} <span className="text-xs font-normal text-slate-400">XAF</span></p>
          </div>
        </div>
      </div>

      {/* KPI filter tabs */}
      <div className="flex gap-1 flex-wrap">
        {KPI_TABS.map(tab => {
          const isActive = activeKpi === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => { setActiveKpi(tab.id); setPage(1) }}
              className="px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all border"
              style={isActive
                ? { background: '#0B1C3E', color: 'white', borderColor: '#0B1C3E' }
                : { background: 'white', color: '#6B7280', borderColor: '#E5E7EB' }}
            >
              {tab.label}
              <span className="ml-1.5 text-[10px] opacity-70">({kpiCounts[tab.id]})</span>
            </button>
          )
        })}
      </div>

      {/* Search + PAP toggle + filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="form-input pl-9 py-2 text-[13px]"
            placeholder="Référence, objet, fournisseur, ENG…"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
          />
        </div>
        <div className="flex rounded-lg border border-slate-200 overflow-hidden text-[12px] font-medium">
          {(['ALL','PAP','HORS_PAP'] as const).map(v => (
            <button key={v}
              onClick={() => { setPapFilter(v); setPage(1) }}
              className="px-3 py-2 transition-colors"
              style={papFilter === v ? { background: '#0B1C3E', color: 'white' } : { background: 'white', color: '#6B7280' }}
            >{v === 'ALL' ? 'Tous' : v === 'PAP' ? 'PAP' : 'Hors PAP'}</button>
          ))}
        </div>
        <button
          onClick={() => setShowAdvanced(v => !v)}
          className="btn btn-outline btn-sm gap-1"
        >
          <Filter size={13} /> Filtres avancés {showAdvanced ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>
      </div>

      {/* Advanced filters */}
      {showAdvanced && (
        <div className="card p-4" style={{ border: '1.5px solid #CBD5E1' }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] uppercase font-semibold tracking-wider text-slate-500">Filtres avancés</span>
            <button onClick={() => { setFilterStructure(''); setFilterMontantMin(''); setFilterMontantMax(''); setFilterDateFrom(''); setFilterDateTo('') }}
              className="text-[12px] text-slate-400 hover:text-red-500 flex items-center gap-1">
              <X size={11} /> Réinitialiser
            </button>
          </div>
          <div className="grid grid-cols-4 gap-3">
            <div>
              <label className="form-label">Structure</label>
              <input className="form-input text-[13px]" placeholder="Direction, département…" value={filterStructure} onChange={e => { setFilterStructure(e.target.value); setPage(1) }} />
            </div>
            <div>
              <label className="form-label">Montant net min (XAF)</label>
              <input className="form-input text-[13px]" type="number" placeholder="0" value={filterMontantMin} onChange={e => { setFilterMontantMin(e.target.value); setPage(1) }} />
            </div>
            <div>
              <label className="form-label">Montant net max (XAF)</label>
              <input className="form-input text-[13px]" type="number" placeholder="Illimité" value={filterMontantMax} onChange={e => { setFilterMontantMax(e.target.value); setPage(1) }} />
            </div>
            <div>
              <label className="form-label">Date de création (depuis)</label>
              <input className="form-input text-[13px]" type="date" value={filterDateFrom} onChange={e => { setFilterDateFrom(e.target.value); setPage(1) }} />
            </div>
          </div>
        </div>
      )}

      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div className="rounded-xl px-5 py-3 flex items-center gap-4" style={{ background: '#0B1C3E' }}>
          <span className="text-white text-sm font-medium">{selected.size} dossier(s) sélectionné(s)</span>
          <div className="flex gap-2 ml-auto">
            <button className="btn btn-sm bg-white/10 text-white border-0 gap-1"><Download size={12} /> Exporter</button>
            <button onClick={() => setSelected(new Set())} className="btn btn-sm bg-white/10 text-white border-0"><X size={12} /></button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="card overflow-hidden">
        <table className="data-table text-xs w-full">
          <thead>
            <tr>
              <th className="w-8">
                <input type="checkbox" checked={allSelected} onChange={toggleAll} className="w-3.5 h-3.5 rounded" />
              </th>
              <th className="text-left">Référence / Date</th>
              <th className="text-left">Objet / Structure</th>
              <th className="text-left">ENG source</th>
              <th className="text-left">Fournisseur</th>
              <th className="text-right">Montant engagé</th>
              <th className="text-right">Net liquidé</th>
              <th className="text-right">Reste à liquider</th>
              <th className="text-left">Service fait</th>
              <th className="text-left">Statut</th>
              <th className="text-left">Acteur attendu</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {pageData.map(liq => {
              const meta = STATUS_META[liq.status] || STATUS_META.GENEREE
              const sfMeta = SF_META[liq.serviceFait] || SF_META.NON_FAIT
              const reste = liq.montantEngage - liq.montantDejaLiquide - liq.montantNet
              const isSelected = selected.has(liq.id)
              return (
                <tr key={liq.id} className={isSelected ? 'bg-blue-50/50' : ''}>
                  <td onClick={e => e.stopPropagation()}>
                    <input type="checkbox" checked={isSelected} onChange={() => toggleSelect(liq.id)} className="w-3.5 h-3.5 rounded" />
                  </td>
                  <td>
                    <button onClick={() => onNavigate('liq-detail', liq.id)} className="font-mono text-[12px] font-semibold hover:underline" style={{ color: '#0B1C3E' }}>
                      {liq.reference}
                    </button>
                    <div className="text-[10.5px] text-slate-400">{liq.dateCreation}</div>
                    {liq.isPAP && <span className="badge text-[9px] px-1.5 py-0.5 mt-0.5 inline-flex" style={{ background: '#EFF6FF', color: '#1D4ED8' }}>PAP</span>}
                  </td>
                  <td>
                    <button onClick={() => onNavigate('liq-detail', liq.id)} className="font-medium text-slate-800 hover:text-[#0B1C3E] text-left max-w-[200px] truncate block leading-snug">
                      {liq.objet}
                    </button>
                    <div className="text-[10.5px] text-slate-400 truncate max-w-[200px]">{liq.structure}</div>
                  </td>
                  <td>
                    <button onClick={() => onNavigate('eng-detail', liq.engReference.replace('ENG-2026-','ENG-00'))} className="font-mono text-[11px] hover:underline" style={{ color: '#1A6B3A' }}>
                      {liq.engReference}
                    </button>
                  </td>
                  <td className="text-slate-600 max-w-[140px] truncate">{liq.tiers}</td>
                  <td className="text-right font-mono text-slate-600">{fmt(liq.montantEngage)}</td>
                  <td className="text-right font-mono font-semibold" style={{ color: '#0B1C3E' }}>
                    {fmt(liq.montantNet)}
                    <div className="text-[9px] text-slate-400 font-normal">XAF</div>
                  </td>
                  <td className="text-right font-mono" style={{ color: reste <= 0 ? '#16A34A' : '#D97706' }}>
                    {reste <= 0 ? '0' : fmt(reste)}
                  </td>
                  <td>
                    <span className="badge text-[10px] px-1.5 py-0.5" style={{ background: sfMeta.bg, color: sfMeta.color }}>
                      {sfMeta.label}
                    </span>
                  </td>
                  <td>
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-medium"
                      style={{ background: meta.bg, color: meta.color }}>
                      {meta.icon}{meta.label}
                    </span>
                  </td>
                  <td className="text-[10.5px] text-slate-500 max-w-[120px] truncate">
                    {liq.acteurAttendu ?? '—'}
                  </td>
                  <td>
                    <button onClick={() => onNavigate('liq-detail', liq.id)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-slate-100 text-slate-400">
                      <Eye size={13} />
                    </button>
                  </td>
                </tr>
              )
            })}
            {pageData.length === 0 && (
              <tr><td colSpan={12} className="py-10 text-center text-slate-400">Aucune liquidation ne correspond aux critères</td></tr>
            )}
          </tbody>
        </table>

        <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between">
          <div className="text-[12px] text-slate-400">{filtered.length} résultat(s) · Page {page}/{totalPages}</div>
          <div className="flex items-center gap-1">
            <button className="btn btn-outline btn-sm px-2" disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Préc</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)}
                className="w-7 h-7 rounded text-[12px] font-medium transition-colors"
                style={p === page ? { background: '#0B1C3E', color: 'white' } : { color: '#64748B' }}>
                {p}
              </button>
            ))}
            <button className="btn btn-outline btn-sm px-2" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Suiv →</button>
          </div>
        </div>
      </div>

      {/* Modal Rapport */}
      {showRapportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(11,28,62,0.55)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Printer size={16} className="text-blue-600" />
                <h3 className="font-bold text-slate-800">Générer un rapport</h3>
              </div>
              <button onClick={() => setShowRapportModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="form-label mb-2 block">Format du rapport</label>
                <div className="space-y-2">
                  {([
                    { id: 'pdf-synthese', label: 'PDF Synthèse', desc: 'Vue condensée avec KPI et tableau récapitulatif', icon: <Printer size={14} className="text-red-500" /> },
                    { id: 'pdf-detail', label: 'PDF Détaillé', desc: 'Toutes les liquidations avec détail des retenues et calculs', icon: <Printer size={14} className="text-red-500" /> },
                    { id: 'excel', label: 'Excel', desc: 'Fichier Excel avec feuilles par statut et formules de calcul', icon: <FileSpreadsheet size={14} className="text-green-600" /> },
                  ] as const).map(opt => (
                    <label key={opt.id} className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${rapportFormat === opt.id ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300'}`}>
                      <input type="radio" className="mt-0.5" name="rapportFormat" value={opt.id}
                        checked={rapportFormat === opt.id} onChange={() => setRapportFormat(opt.id)} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {opt.icon}
                          <span className="font-medium text-sm text-slate-800">{opt.label}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{opt.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="form-label mb-2 block">Filtrer par période (optionnel)</label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-500 mb-1 block">Du</label>
                    <input type="date" className="form-input text-sm" value={rapportPeriodeFrom} onChange={e => setRapportPeriodeFrom(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 mb-1 block">Au</label>
                    <input type="date" className="form-input text-sm" value={rapportPeriodeTo} onChange={e => setRapportPeriodeTo(e.target.value)} />
                  </div>
                </div>
              </div>
              <div className="rounded-xl p-3 text-[12px]" style={{ background: '#F0F9FF', border: '1px solid #BAE6FD' }}>
                <p className="text-slate-600">Le rapport portera sur <strong className="text-slate-800">{filtered.length} liquidations</strong> correspondant aux filtres actifs.</p>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex gap-2 justify-end">
              <button onClick={() => setShowRapportModal(false)} className="btn btn-outline">Annuler</button>
              <button
                onClick={() => setShowRapportModal(false)}
                className="btn btn-primary gap-1.5"
              >
                <Download size={14} /> Générer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
