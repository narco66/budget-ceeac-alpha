import { useState } from 'react'
import {
  Download, Search, Filter, ChevronDown, ChevronRight, ChevronLeft, X,
  TrendingUp, Clock, CheckCircle, AlertTriangle, Banknote, RefreshCw,
  Layers, BarChart2, Users,
} from 'lucide-react'
import type { Page, PAYStatus } from '../types'
import { PAY_LIST } from '../data/mock'

interface Props {
  onNavigate: (page: Page, id?: string) => void
}

const fmt = (n: number) => new Intl.NumberFormat('fr-FR').format(n)

const STATUS_CONFIG: Record<PAYStatus, { label: string; bg: string; color: string; dot: string }> = {
  GENERE:           { label: 'Généré', bg: '#F1F5F9', color: '#64748B', dot: '#94A3B8' },
  TRANSMIS_AC:      { label: 'Transmis AC', bg: '#EFF6FF', color: '#1D4ED8', dot: '#3B82F6' },
  PRIS_EN_CHARGE:   { label: 'Pris en charge', bg: '#EEF2FF', color: '#4338CA', dot: '#6366F1' },
  A_PREPARER:       { label: 'À préparer', bg: '#FFF7ED', color: '#C2410C', dot: '#F97316' },
  EN_PREPARATION:   { label: 'En préparation', bg: '#FFFBEB', color: '#B45309', dot: '#F59E0B' },
  CONTROLE_COMPTABLE:{ label: 'Contrôle comptable', bg: '#F5F3FF', color: '#6D28D9', dot: '#8B5CF6' },
  EN_VALIDATION:    { label: 'En validation', bg: '#EEF2FF', color: '#4338CA', dot: '#6366F1' },
  VALIDE:           { label: 'Validé', bg: '#ECFDF5', color: '#065F46', dot: '#10B981' },
  A_EXECUTER:       { label: 'À exécuter', bg: '#FEF3C7', color: '#92400E', dot: '#D97706' },
  AUTORISE:         { label: 'Autorisé', bg: '#D1FAE5', color: '#065F46', dot: '#059669' },
  EN_COURS_BANCAIRE:{ label: 'En cours bancaire', bg: '#DBEAFE', color: '#1E40AF', dot: '#2563EB' },
  EXECUTE:          { label: 'Exécuté', bg: '#D1FAE5', color: '#065F46', dot: '#059669' },
  PARTIELLEMENT_PAYE:{ label: 'Partiel', bg: '#FEF9C3', color: '#854D0E', dot: '#CA8A04' },
  RAPPROCHE:        { label: 'Rapproché', bg: '#ECFDF5', color: '#166534', dot: '#22C55E' },
  CLOTURE:          { label: 'Clôturé', bg: '#F0FDF4', color: '#166534', dot: '#4ADE80' },
  SUSPENDU:         { label: 'Suspendu', bg: '#FEF3C7', color: '#92400E', dot: '#F59E0B' },
  RETOURNE:         { label: 'Retourné', bg: '#FFF7ED', color: '#C2410C', dot: '#F97316' },
  REJETE:           { label: 'Rejeté', bg: '#FEF2F2', color: '#991B1B', dot: '#EF4444' },
  REJETE_BANQUE:    { label: 'Rejet bancaire', bg: '#FEF2F2', color: '#991B1B', dot: '#DC2626' },
  ANNULE:           { label: 'Annulé', bg: '#F1F5F9', color: '#475569', dot: '#94A3B8' },
}

const MODE_CONFIG: Record<string, { label: string; bg: string; color: string }> = {
  VIREMENT: { label: 'Virement', bg: '#DBEAFE', color: '#1E40AF' },
  CHEQUE:   { label: 'Chèque', bg: '#F3E8FF', color: '#6D28D9' },
  CAISSE:   { label: 'Caisse', bg: '#FEF3C7', color: '#92400E' },
}

const PAGE_SIZE = 10

type StatusFilter = 'ALL' | 'A_TRAITER' | 'EN_COURS' | 'EXECUTE' | 'ANOMALIE'

export default function Paiement({ onNavigate }: Props) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL')
  const [modeFilter, setModeFilter] = useState<string>('ALL')
  const [isPAPFilter, setIsPAPFilter] = useState<string>('ALL')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [page, setPage] = useState(1)
  const [showExportModal, setShowExportModal] = useState(false)
  const [exportFmt, setExportFmt] = useState<'CSV' | 'Excel'>('Excel')
  const [showLotModal, setShowLotModal] = useState(false)
  const [showValidLotModal, setShowValidLotModal] = useState(false)
  const [showNouveauLotModal, setShowNouveauLotModal] = useState(false)
  const [lotPin, setLotPin] = useState('')
  const [lotRef, setLotRef] = useState('LOT-PAY-2026-019')
  const [downloadToast, setDownloadToast] = useState(false)

  const filtered = PAY_LIST.filter(p => {
    const searchLower = search.toLowerCase()
    if (search && !p.reference.toLowerCase().includes(searchLower) &&
        !p.tiers.toLowerCase().includes(searchLower) &&
        !p.objet.toLowerCase().includes(searchLower) &&
        !p.ordReference.toLowerCase().includes(searchLower)) return false
    if (modeFilter !== 'ALL' && p.modePaiement !== modeFilter) return false
    if (isPAPFilter === 'PAP' && !p.isPAP) return false
    if (isPAPFilter === 'HORS_PAP' && p.isPAP) return false
    if (statusFilter === 'A_TRAITER') {
      if (!['TRANSMIS_AC', 'PRIS_EN_CHARGE', 'A_PREPARER', 'CONTROLE_COMPTABLE', 'EN_VALIDATION'].includes(p.status)) return false
    }
    if (statusFilter === 'EN_COURS') {
      if (!['EN_PREPARATION', 'VALIDE', 'A_EXECUTER', 'AUTORISE', 'EN_COURS_BANCAIRE'].includes(p.status)) return false
    }
    if (statusFilter === 'EXECUTE') {
      if (!['EXECUTE', 'PARTIELLEMENT_PAYE', 'RAPPROCHE', 'CLOTURE'].includes(p.status)) return false
    }
    if (statusFilter === 'ANOMALIE') {
      if (!['SUSPENDU', 'RETOURNE', 'REJETE', 'REJETE_BANQUE', 'ANNULE'].includes(p.status)) return false
    }
    return true
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  // KPI aggregations
  const aTraiter = PAY_LIST.filter(p => ['TRANSMIS_AC', 'PRIS_EN_CHARGE', 'A_PREPARER', 'CONTROLE_COMPTABLE', 'EN_VALIDATION'].includes(p.status))
  const autorises = PAY_LIST.filter(p => ['AUTORISE', 'EN_COURS_BANCAIRE'].includes(p.status))
  const executes = PAY_LIST.filter(p => ['EXECUTE', 'RAPPROCHE', 'CLOTURE', 'PARTIELLEMENT_PAYE'].includes(p.status))
  const anomalies = PAY_LIST.filter(p => ['SUSPENDU', 'RETOURNE', 'REJETE', 'REJETE_BANQUE'].includes(p.status))
  const totalOrd = PAY_LIST.reduce((s, p) => s + p.montantOrdonnance, 0)
  const totalPaye = PAY_LIST.reduce((s, p) => s + p.montantPaye, 0)
  const tauxPaiement = totalOrd > 0 ? Math.round((totalPaye / totalOrd) * 100) : 0

  const hasFilters = statusFilter !== 'ALL' || modeFilter !== 'ALL' || isPAPFilter !== 'ALL' || search !== ''

  return (
    <div className="space-y-0">
      {/* En-tête navy */}
      <div className="px-7 py-5" style={{ background: '#0B1C3E' }}>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">MODULE PAIEMENT</h1>
            <p className="text-white/50 text-[12px] mt-0.5">Agence Comptable · Exercice 2026 · Chaîne&nbsp;ORD&nbsp;→&nbsp;PAY&nbsp;→&nbsp;Rapprochement&nbsp;→&nbsp;Clôture</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowExportModal(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold text-white/70 hover:text-white hover:bg-white/10 transition-colors">
              <Download size={13} /> Exporter
            </button>
          </div>
        </div>

        {/* Workflow chain */}
        <div className="mt-4 flex items-center gap-0 text-[10px] text-white/40 font-semibold tracking-wider">
          {['OP signé', 'Transmission AC', 'Prise en charge', 'Contrôle', 'Validation CC', 'Autorisation AC', 'Exécution', 'Preuve', 'Rapprochement', 'Clôture'].map((s, i, arr) => (
            <span key={s} className="flex items-center gap-0">
              <span className="px-2 py-0.5 rounded text-white/50">{s}</span>
              {i < arr.length - 1 && <ChevronRight size={9} className="text-white/20" />}
            </span>
          ))}
        </div>
      </div>

      <div className="p-6 space-y-5" style={{ background: '#F0F4FA' }}>
        {/* KPI Cards */}
        <div className="grid grid-cols-5 gap-3">
          {[
            {
              label: 'À traiter', value: aTraiter.length, sub: 'Dossiers en attente', color: '#D97706',
              bg: 'white', icon: <Clock size={16} className="text-amber-600" />, filter: 'A_TRAITER' as StatusFilter,
            },
            {
              label: 'Autorisés', value: autorises.length, sub: 'En attente d\'exécution', color: '#7C3AED',
              bg: 'white', icon: <CheckCircle size={16} className="text-violet-600" />, filter: 'EN_COURS' as StatusFilter,
            },
            {
              label: 'Taux de paiement', value: `${tauxPaiement}%`, sub: `${fmt(totalPaye)} / ${fmt(totalOrd)} XAF`, color: '#059669',
              bg: 'white', icon: <TrendingUp size={16} className="text-emerald-600" />, filter: 'EXECUTE' as StatusFilter,
            },
            {
              label: 'Exécutés', value: executes.length, sub: `${fmt(executes.reduce((s, p) => s + p.montantPaye, 0))} XAF`, color: '#2563EB',
              bg: 'white', icon: <Banknote size={16} className="text-blue-600" />, filter: 'EXECUTE' as StatusFilter,
            },
            {
              label: 'Anomalies', value: anomalies.length, sub: 'Suspendus / Retournés / Rejetés', color: '#DC2626',
              bg: 'white', icon: <AlertTriangle size={16} className="text-red-600" />, filter: 'ANOMALIE' as StatusFilter,
            },
          ].map(kpi => (
            <button
              key={kpi.label}
              onClick={() => { setStatusFilter(kpi.filter); setPage(1) }}
              className="rounded-xl p-4 text-left shadow-sm border border-transparent hover:border-slate-200 transition-all"
              style={{ background: kpi.bg, borderLeft: `3px solid ${kpi.color}` }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">{kpi.label}</span>
                {kpi.icon}
              </div>
              <div className="text-2xl font-bold" style={{ color: kpi.color }}>{kpi.value}</div>
              <div className="text-[10px] text-slate-400 mt-0.5 leading-tight">{kpi.sub}</div>
            </button>
          ))}
        </div>

        {/* ANALYSES VISUELLES */}
        <div className="grid grid-cols-3 gap-4">
          {/* Paiements par mode */}
          <div className="bg-white rounded-xl p-5 border border-slate-100">
            <div className="flex items-center gap-2 mb-4">
              <BarChart2 size={13} className="text-slate-400" />
              <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">Paiements par mode</span>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Virement bancaire', count: PAY_LIST.filter(p => p.modePaiement === 'VIREMENT').length, montant: PAY_LIST.filter(p => p.modePaiement === 'VIREMENT').reduce((s, p) => s + p.montantOrdonnance, 0), color: '#2563EB', pct: 71 },
                { label: 'Chèque', count: PAY_LIST.filter(p => p.modePaiement === 'CHEQUE').length, montant: PAY_LIST.filter(p => p.modePaiement === 'CHEQUE').reduce((s, p) => s + p.montantOrdonnance, 0), color: '#7C3AED', pct: 14 },
                { label: 'Caisse', count: PAY_LIST.filter(p => p.modePaiement === 'CAISSE').length, montant: PAY_LIST.filter(p => p.modePaiement === 'CAISSE').reduce((s, p) => s + p.montantOrdonnance, 0), color: '#D97706', pct: 15 },
              ].map(m => (
                <div key={m.label}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[11.5px] text-slate-600 font-medium">{m.label}</span>
                    <span className="text-[10px] text-slate-400">{m.count} dossier{m.count !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="relative h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="absolute left-0 top-0 h-full rounded-full" style={{ width: `${m.pct}%`, background: m.color }} />
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{fmt(m.montant)} XAF</div>
                </div>
              ))}
            </div>
          </div>

          {/* PAP / Hors PAP */}
          <div className="bg-white rounded-xl p-5 border border-slate-100">
            <div className="flex items-center gap-2 mb-4">
              <Layers size={13} className="text-slate-400" />
              <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">PAP vs Hors PAP</span>
            </div>
            <div className="flex items-center justify-center gap-8">
              {/* Donut SVG */}
              <div className="relative w-24 h-24">
                <svg viewBox="0 0 36 36" className="w-24 h-24 -rotate-90">
                  <circle cx="18" cy="18" r="13" fill="none" stroke="#E2E8F0" strokeWidth="5" />
                  <circle cx="18" cy="18" r="13" fill="none" stroke="#6366F1" strokeWidth="5"
                    strokeDasharray={`${Math.round((PAY_LIST.filter(p => p.isPAP).length / PAY_LIST.length) * 82)} 82`}
                    strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-lg font-bold text-slate-800">{Math.round((PAY_LIST.filter(p => p.isPAP).length / PAY_LIST.length) * 100)}%</span>
                  <span className="text-[9px] text-slate-400">PAP</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-indigo-500" />
                  <div>
                    <div className="text-[11px] font-semibold text-slate-700">PAP</div>
                    <div className="text-[10px] text-slate-400">{PAY_LIST.filter(p => p.isPAP).length} dossiers · {fmt(PAY_LIST.filter(p => p.isPAP).reduce((s, p) => s + p.montantOrdonnance, 0))} XAF</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-slate-200" />
                  <div>
                    <div className="text-[11px] font-semibold text-slate-700">Hors PAP</div>
                    <div className="text-[10px] text-slate-400">{PAY_LIST.filter(p => !p.isPAP).length} dossiers · {fmt(PAY_LIST.filter(p => !p.isPAP).reduce((s, p) => s + p.montantOrdonnance, 0))} XAF</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-center">
              <div className="p-2 rounded-lg bg-slate-50">
                <div className="text-[10px] text-slate-400">Délai moyen</div>
                <div className="font-bold text-slate-700 text-[13px]">4,2 j</div>
              </div>
              <div className="p-2 rounded-lg bg-slate-50">
                <div className="text-[10px] text-slate-400">Taux rapprochement</div>
                <div className="font-bold text-slate-700 text-[13px]">14%</div>
              </div>
            </div>
          </div>

          {/* Paiements par bénéficiaire (top) + LOT */}
          <div className="bg-white rounded-xl p-5 border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users size={13} className="text-slate-400" />
                <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">Lot paiements actif</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-100 text-amber-700">EN PRÉPARATION</span>
            </div>
            <div className="p-4 rounded-xl border border-slate-200" style={{ background: '#F8FAFC' }}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono font-bold text-[13px] text-slate-800">LOT-PAY-2026-018</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 mb-3">
                <div>Dossiers : <strong>5 paiements</strong></div>
                <div>Banque : <strong>BGFI Bank</strong></div>
                <div>Montant : <strong>{fmt(55_300_000)} XAF</strong></div>
                <div>Date prévue : <strong>20/09/2026</strong></div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setShowLotModal(true)} className="flex-1 px-2 py-1.5 rounded-lg text-[11px] font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors">
                  Voir le lot
                </button>
                <button onClick={() => setShowValidLotModal(true)} className="flex-1 px-2 py-1.5 rounded-lg text-[11px] font-semibold text-white transition-colors" style={{ background: '#0B1C3E' }}>
                  Valider
                </button>
              </div>
            </div>
            <div className="mt-3 text-[10px] text-slate-400 text-center">
              + <button onClick={() => setShowNouveauLotModal(true)} className="text-indigo-600 hover:underline">Créer un nouveau lot</button>
            </div>
          </div>
        </div>

        {/* MES DOSSIERS À TRAITER */}
        {aTraiter.length > 0 && (
          <div className="bg-white rounded-xl border border-amber-200 overflow-hidden">
            <div className="px-5 py-3 flex items-center justify-between" style={{ background: '#FFFBEB' }}>
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-amber-600" />
                <span className="font-bold text-amber-900 text-[13px]">Mes dossiers à traiter — {aTraiter.length} en attente</span>
              </div>
              <button onClick={() => { setStatusFilter('A_TRAITER'); setPage(1) }} className="text-[11px] text-amber-700 hover:underline font-semibold">Voir tous</button>
            </div>
            <div className="divide-y divide-amber-100">
              {aTraiter.slice(0, 3).map(p => (
                <div key={p.id} className="flex items-center gap-4 px-5 py-3 hover:bg-amber-50 cursor-pointer transition-colors" onClick={() => setStatusFilter('A_TRAITER')}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[12.5px] text-slate-800">{p.reference}</span>
                      <span className="text-[10px] font-semibold px-1.5 py-0 rounded bg-amber-100 text-amber-700">
                        {STATUS_CONFIG[p.status]?.label ?? p.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 truncate mt-0.5">{p.tiers} · {p.objet}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="font-mono font-bold text-[13px] text-slate-800">{fmt(p.montantOrdonnance)} XAF</div>
                    <div className="text-[10px] text-slate-400">{p.modePaiement}</div>
                  </div>
                  <button
                    className="flex-shrink-0 px-3 py-1.5 rounded-lg text-[11px] font-bold text-white transition-colors"
                    style={{ background: '#D97706' }}
                    onClick={e => { e.stopPropagation(); onNavigate('pay-detail', p.id) }}
                  >
                    Traiter →
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filtres statut */}
        <div className="flex items-center gap-2 flex-wrap">
          {[
            { key: 'ALL', label: 'Tous les dossiers' },
            { key: 'A_TRAITER', label: 'À traiter' },
            { key: 'EN_COURS', label: 'En cours' },
            { key: 'EXECUTE', label: 'Exécutés' },
            { key: 'ANOMALIE', label: 'Anomalies' },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => { setStatusFilter(f.key as StatusFilter); setPage(1) }}
              className={`px-3 py-1.5 rounded-full text-[12px] font-semibold transition-colors ${
                statusFilter === f.key
                  ? 'text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
              style={statusFilter === f.key ? { background: '#0B1C3E' } : {}}
            >
              {f.label}
            </button>
          ))}

          <div className="ml-auto flex items-center gap-2">
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                className="pl-9 pr-4 py-1.5 rounded-lg text-[13px] border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-navy-400"
                placeholder="Référence, tiers, objet…"
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1) }}
              />
            </div>
            <button
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold border transition-colors ${showAdvanced ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'}`}
              onClick={() => setShowAdvanced(s => !s)}
            >
              <Filter size={12} /> Filtres avancés <ChevronDown size={11} className={`transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
            </button>
            {hasFilters && (
              <button className="flex items-center gap-1 text-[12px] text-slate-400 hover:text-red-600 px-2 py-1.5 rounded-lg hover:bg-red-50"
                onClick={() => { setStatusFilter('ALL'); setModeFilter('ALL'); setIsPAPFilter('ALL'); setSearch(''); setPage(1) }}>
                <X size={12} /> Réinitialiser
              </button>
            )}
          </div>
        </div>

        {/* Filtres avancés */}
        {showAdvanced && (
          <div className="bg-white rounded-xl border border-slate-200 p-4 grid grid-cols-3 gap-4">
            <div>
              <label className="form-label">Mode de paiement</label>
              <select className="form-input text-[13px]" value={modeFilter} onChange={e => { setModeFilter(e.target.value); setPage(1) }}>
                <option value="ALL">Tous les modes</option>
                <option value="VIREMENT">Virement bancaire</option>
                <option value="CHEQUE">Chèque</option>
                <option value="CAISSE">Caisse</option>
              </select>
            </div>
            <div>
              <label className="form-label">Classification budgétaire</label>
              <select className="form-input text-[13px]" value={isPAPFilter} onChange={e => { setIsPAPFilter(e.target.value); setPage(1) }}>
                <option value="ALL">Tout</option>
                <option value="PAP">PAP uniquement</option>
                <option value="HORS_PAP">Hors PAP uniquement</option>
              </select>
            </div>
            <div>
              <label className="form-label">Exercice</label>
              <select className="form-input text-[13px]">
                <option>2026</option>
                <option>2025</option>
              </select>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-100">
          <table className="data-table">
            <thead>
              <tr>
                <th>Référence PAY</th>
                <th>Chaîne</th>
                <th>Objet / Bénéficiaire</th>
                <th>Structure</th>
                <th>Mode</th>
                <th className="text-right">Ordonnancé</th>
                <th className="text-right">Payé</th>
                <th className="text-right">Solde</th>
                <th>Acteur attendu</th>
                <th>Statut</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={11} className="text-center text-slate-400 py-10 text-[13px]">
                    <RefreshCw size={20} className="mx-auto mb-2 text-slate-300" />
                    Aucun paiement correspondant aux filtres
                  </td>
                </tr>
              )}
              {paginated.map(pay => {
                const sc = STATUS_CONFIG[pay.status] ?? STATUS_CONFIG['GENERE']
                const mc = MODE_CONFIG[pay.modePaiement] ?? MODE_CONFIG['VIREMENT']
                const ageJours = Math.floor((new Date().getTime() - new Date(pay.dateCreation).getTime()) / 86400000)
                return (
                  <tr key={pay.id} className="cursor-pointer" onClick={() => onNavigate('pay-detail', pay.id)}>
                    <td>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-mono text-[12px] font-bold text-slate-800">{pay.reference}</span>
                        <span className="font-mono text-[10px] text-indigo-500">{pay.ordReference}</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex flex-col gap-0.5 text-[10px] text-slate-400 font-mono">
                        <span>{pay.liqReference}</span>
                        <span>{pay.engReference}</span>
                      </div>
                    </td>
                    <td>
                      <div className="max-w-[200px]">
                        <div className="font-semibold text-[12.5px] text-slate-800 truncate">{pay.tiers}</div>
                        <div className="text-[11px] text-slate-400 truncate">{pay.objet}</div>
                      </div>
                    </td>
                    <td>
                      <div className="text-[11px] text-slate-500 max-w-[120px] leading-tight">{pay.structure.split('—')[0].trim()}</div>
                      {pay.isPAP && <span className="inline-block mt-0.5 px-1.5 py-0 rounded text-[9px] font-bold bg-violet-100 text-violet-700">PAP</span>}
                    </td>
                    <td>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-semibold" style={{ background: mc.bg, color: mc.color }}>
                        {mc.label}
                      </span>
                    </td>
                    <td className="text-right font-mono text-[12.5px] text-slate-700">{fmt(pay.montantOrdonnance)}</td>
                    <td className="text-right font-mono text-[12.5px] font-bold text-emerald-700">{fmt(pay.montantPaye)}</td>
                    <td className="text-right font-mono text-[12.5px]" style={{ color: pay.reliquat > 0 ? '#D97706' : '#94A3B8' }}>
                      {fmt(pay.reliquat)}
                    </td>
                    <td>
                      <div className="text-[11px] text-slate-500 max-w-[130px] leading-tight">{pay.acteurAttendu.split('—')[0].trim()}</div>
                      {ageJours > 5 && ['TRANSMIS_AC', 'A_PREPARER', 'PRIS_EN_CHARGE'].includes(pay.status) && (
                        <span className="text-[9px] text-red-500 font-semibold">⚠ {ageJours}j</span>
                      )}
                    </td>
                    <td>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-semibold" style={{ background: sc.bg, color: sc.color }}>
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: sc.dot }} />
                        {sc.label}
                      </span>
                    </td>
                    <td>
                      <button onClick={e => { e.stopPropagation(); onNavigate('pay-detail', pay.id) }} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-slate-100 text-slate-400">
                        <ChevronRight size={14} />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between">
            <div className="text-[12px] text-slate-400">{filtered.length} dossier{filtered.length !== 1 ? 's' : ''} · {fmt(filtered.reduce((s, p) => s + p.montantOrdonnance, 0))} XAF ordonnancés</div>
            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                <button className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-slate-100 text-slate-500 disabled:opacity-30" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                  <ChevronLeft size={14} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button key={p} className={`w-7 h-7 rounded-lg text-[12px] font-semibold ${p === page ? 'bg-slate-800 text-white' : 'hover:bg-slate-100 text-slate-600'}`} onClick={() => setPage(p)}>{p}</button>
                ))}
                <button className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-slate-100 text-slate-500 disabled:opacity-30" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
                  <ChevronRight size={14} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Barre de synthèse financière */}
        <div className="bg-white rounded-xl border border-slate-100 p-5">
          <div className="text-[11px] uppercase font-semibold tracking-wider text-slate-400 mb-4">Synthèse financière — Exercice 2026</div>
          <div className="grid grid-cols-4 gap-4 mb-4">
            {[
              { label: 'Total ordonnancé', value: totalOrd, color: '#0B1C3E' },
              { label: 'Total payé', value: totalPaye, color: '#059669' },
              { label: 'Reste à payer', value: totalOrd - totalPaye, color: '#D97706' },
              { label: 'En anomalie', value: anomalies.reduce((s, p) => s + p.montantOrdonnance, 0), color: '#DC2626' },
            ].map(f => (
              <div key={f.label}>
                <div className="text-[10px] text-slate-400 mb-1">{f.label}</div>
                <div className="font-mono font-bold text-[14px]" style={{ color: f.color }}>{fmt(f.value)} XAF</div>
              </div>
            ))}
          </div>
          <div className="relative h-3 rounded-full overflow-hidden bg-slate-100">
            <div className="absolute left-0 top-0 h-full rounded-full transition-all" style={{ width: `${tauxPaiement}%`, background: 'linear-gradient(90deg, #059669, #34D399)' }} />
          </div>
          <div className="flex justify-between mt-1 text-[10px] text-slate-400">
            <span>0%</span>
            <span className="font-bold text-emerald-700">{tauxPaiement}% payé</span>
            <span>100%</span>
          </div>
        </div>
      </div>

      {/* TOAST */}
      {downloadToast && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-[13px] font-semibold text-white" style={{ background: '#0B1C3E' }}>
          <Download size={15} /> Téléchargement en cours…
        </div>
      )}

      {/* MODAL EXPORT */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(11,28,62,0.6)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
              <Download size={15} className="text-slate-600" />
              <h3 className="font-bold text-slate-800">Exporter les paiements</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="form-label">Format</label>
                <div className="flex gap-3 mt-1">
                  {(['CSV', 'Excel'] as const).map(f => (
                    <label key={f} className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 cursor-pointer text-[13px] font-medium transition-all ${exportFmt === f ? 'border-slate-800 bg-slate-50 text-slate-800' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                      <input type="radio" name="payFmt" checked={exportFmt === f} onChange={() => setExportFmt(f)} /> {f}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="form-label">Filtre statut</label>
                <select className="form-input text-[13px]">
                  <option>Tous les statuts</option>
                  <option>À traiter seulement</option>
                  <option>Exécutés seulement</option>
                  <option>Anomalies seulement</option>
                </select>
              </div>
              <div>
                <label className="form-label">Période</label>
                <div className="flex gap-2">
                  <input type="date" className="form-input text-[13px] flex-1" defaultValue="2026-01-01" />
                  <input type="date" className="form-input text-[13px] flex-1" defaultValue="2026-09-30" />
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex gap-2 justify-end">
              <button onClick={() => setShowExportModal(false)} className="btn btn-outline btn-sm">Annuler</button>
              <button onClick={() => { setShowExportModal(false); setDownloadToast(true); setTimeout(() => setDownloadToast(false), 3000) }} className="btn btn-sm gap-1.5 text-white" style={{ background: '#0B1C3E', border: 'none' }}>
                <Download size={13} /> Exporter en {exportFmt}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL VOIR LOT */}
      {showLotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(11,28,62,0.6)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-800">Lot de paiements — LOT-PAY-2026-018</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">BGFI Bank · Date prévue : 20/09/2026</p>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700">EN PRÉPARATION</span>
            </div>
            <div className="p-6">
              <table className="w-full text-[12px] mb-4">
                <thead>
                  <tr className="border-b border-slate-100">
                    {['Référence', 'Bénéficiaire', 'Banque', 'Montant'].map(h => (
                      <th key={h} className="text-left pb-2 text-[10px] font-bold text-slate-400 uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { ref: 'PAY-2026-001812', ben: 'FOURNISSEUR A', banque: 'BGFI', mt: 12_500_000 },
                    { ref: 'PAY-2026-001813', ben: 'FOURNISSEUR B', banque: 'BGFI', mt: 8_750_000 },
                    { ref: 'PAY-2026-001815', ben: 'FOURNISSEUR C', banque: 'BGFI', mt: 14_200_000 },
                    { ref: 'PAY-2026-001817', ben: 'FOURNISSEUR D', banque: 'BGFI', mt: 11_350_000 },
                    { ref: 'PAY-2026-001820', ben: 'FOURNISSEUR E', banque: 'BGFI', mt: 8_500_000 },
                  ].map(r => (
                    <tr key={r.ref} className="border-b border-slate-50">
                      <td className="py-2 font-mono text-slate-700">{r.ref}</td>
                      <td className="py-2 text-slate-600">{r.ben}</td>
                      <td className="py-2 text-slate-500">{r.banque}</td>
                      <td className="py-2 font-mono font-semibold text-slate-800 text-right">{fmt(r.mt)} XAF</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-between font-bold text-[13px] border-t border-slate-200 pt-3">
                <span className="text-slate-700">Total lot</span>
                <span className="font-mono text-slate-900">{fmt(55_300_000)} XAF</span>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex gap-2 justify-end">
              <button onClick={() => setShowLotModal(false)} className="btn btn-outline btn-sm">Fermer</button>
              <button onClick={() => { setShowLotModal(false); setShowValidLotModal(true) }} className="btn btn-sm gap-1.5 text-white" style={{ background: '#0B1C3E', border: 'none' }}>
                Valider ce lot →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL VALIDER LOT */}
      {showValidLotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(11,28,62,0.6)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="px-6 py-4 rounded-t-2xl flex items-center gap-2" style={{ background: '#0B1C3E' }}>
              <CheckCircle size={16} className="text-white" />
              <h3 className="font-bold text-white">Valider le lot LOT-PAY-2026-018</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[12.5px] space-y-1">
                <div className="flex justify-between"><span className="text-slate-400">Lot</span><span className="font-semibold">LOT-PAY-2026-018</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Paiements</span><span className="font-semibold">5 virements</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Montant total</span><span className="font-mono font-bold">{fmt(55_300_000)} XAF</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Banque</span><span className="font-semibold">BGFI Bank</span></div>
              </div>
              <div>
                <label className="form-label">Code PIN de validation *</label>
                <input type="password" className="form-input font-mono tracking-widest text-center text-xl" placeholder="• • • • • •" maxLength={6} value={lotPin} onChange={e => setLotPin(e.target.value.replace(/\D/g, ''))} />
              </div>
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[12px] text-amber-800 flex items-center gap-2">
                <AlertTriangle size={12} /> La validation du lot est irréversible.
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex gap-2 justify-end">
              <button onClick={() => { setShowValidLotModal(false); setLotPin('') }} className="btn btn-outline btn-sm">Annuler</button>
              <button disabled={lotPin.length < 4} onClick={() => { setShowValidLotModal(false); setLotPin('') }} className="btn btn-sm gap-1.5 disabled:opacity-40 text-white" style={{ background: '#059669', border: 'none' }}>
                <CheckCircle size={13} /> Confirmer la validation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CRÉER NOUVEAU LOT */}
      {showNouveauLotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(11,28,62,0.6)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
              <Layers size={15} className="text-slate-600" />
              <h3 className="font-bold text-slate-800">Créer un nouveau lot de paiements</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="form-label">Référence du lot</label>
                <input className="form-input text-[13px] font-mono" value={lotRef} onChange={e => setLotRef(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Banque de règlement</label>
                <select className="form-input text-[13px]">
                  <option>BGFI Bank</option>
                  <option>UBA Gabon</option>
                  <option>Ecobank</option>
                  <option>BICIG</option>
                </select>
              </div>
              <div>
                <label className="form-label">Sélectionner les paiements à inclure</label>
                <div className="border border-slate-200 rounded-xl overflow-hidden max-h-44 overflow-y-auto">
                  {PAY_LIST.filter(p => ['A_PREPARER', 'TRANSMIS_AC', 'PRIS_EN_CHARGE'].includes(p.status)).slice(0, 6).map(p => (
                    <label key={p.id} className="flex items-center gap-3 px-4 py-2.5 border-b border-slate-50 last:border-0 hover:bg-slate-50 cursor-pointer text-[12px]">
                      <input type="checkbox" className="accent-slate-800" />
                      <span className="font-mono text-slate-700 w-36 flex-shrink-0">{p.reference}</span>
                      <span className="text-slate-500 truncate">{p.tiers}</span>
                      <span className="ml-auto font-mono text-slate-600 flex-shrink-0">{fmt(p.montantOrdonnance)} XAF</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex gap-2 justify-end">
              <button onClick={() => setShowNouveauLotModal(false)} className="btn btn-outline btn-sm">Annuler</button>
              <button onClick={() => setShowNouveauLotModal(false)} className="btn btn-sm gap-1.5 text-white" style={{ background: '#0B1C3E', border: 'none' }}>
                <Layers size={13} /> Créer le lot
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
