import { useState, useMemo } from 'react'
import {
  Search, Filter, Download, X, ChevronDown, ChevronUp, AlertTriangle,
  Shield, Clock, Activity, Users, Database, TrendingUp, ChevronRight,
  FileText, RefreshCw, Lock, Eye, BarChart2,
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'
import type { Page } from '../types'
import { AUDIT_EVENTS, ACTION_CONFIG, RESULTAT_CONFIG } from '../data/audit-mock'
import type { AuditEvent, ActionType, ModuleType, ResultatType, NiveauType } from '../data/audit-mock'

const fmt = (n: number) => new Intl.NumberFormat('fr-FR').format(n)

const PAGE_SIZE = 15

const ALL_MODULES: ModuleType[] = [
  'Authentification', 'Expression de Besoin', 'Engagement', 'Liquidation',
  'Ordonnancement', 'Paiement', 'Budget', 'PAP', 'Suivi-Évaluation',
  'Reporting', 'GED', 'Contrôle interne', 'Audit', 'Administration', 'Workflow',
]

const ALL_ACTIONS: ActionType[] = [
  'CONNEXION', 'DECONNEXION', 'ECHEC_CONNEXION', 'CREATION', 'MODIFICATION', 'VALIDATION',
  'REJET', 'RETOUR', 'SOUMISSION', 'APPROBATION', 'VISA', 'SIGNATURE', 'TRANSMISSION',
  'ANNULATION', 'SUPPRESSION', 'EXPORT', 'GENERATION_PDF', 'ERREUR',
  'CHANGEMENT_ROLE', 'CHANGEMENT_PERMISSION', 'DESACTIVATION_COMPTE',
]

const MODULE_PIE_COLORS = [
  '#0B1C3E', '#1A6B3A', '#D4A017', '#2563EB', '#7C3AED', '#DC2626',
  '#059669', '#D97706', '#0E7490', '#BE185D', '#374151', '#1D4ED8',
]

interface Props {
  onNavigate: (page: Page, id?: string) => void
}

function NiveauDot({ niveau }: { niveau: NiveauType }) {
  const colors = { INFO: '#94A3B8', WARN: '#F59E0B', CRITIQUE: '#EF4444' }
  return <span className="inline-block w-2 h-2 rounded-full flex-shrink-0" style={{ background: colors[niveau] }} />
}

function ActionBadge({ action }: { action: ActionType }) {
  const cfg = ACTION_CONFIG[action]
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10.5px] font-semibold"
      style={{ background: cfg.bg, color: cfg.color }}>
      {cfg.label}
    </span>
  )
}

function ResultatBadge({ resultat }: { resultat: ResultatType }) {
  const cfg = RESULTAT_CONFIG[resultat]
  return (
    <span className="inline-flex px-2 py-0.5 rounded-md text-[10.5px] font-semibold"
      style={{ background: cfg.bg, color: cfg.color }}>
      {cfg.label}
    </span>
  )
}

function EventDetailPanel({ event, onClose }: { event: AuditEvent; onClose: () => void }) {
  return (
    <div className="w-[400px] flex-shrink-0 flex flex-col border-l border-gray-200 bg-white overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div>
          <div className="font-bold text-[14px] text-gray-900">Détail de l&apos;événement</div>
          <div className="font-mono text-[11px] text-gray-400 mt-0.5">{event.id}</div>
        </div>
        <button className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-gray-100 text-gray-400" onClick={onClose}>
          <X size={14} />
        </button>
      </div>

      <div className="flex-1 p-5 space-y-5">
        {/* Niveau banner */}
        {event.niveau === 'CRITIQUE' && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: '#FEE2E2', border: '1px solid #FECACA' }}>
            <AlertTriangle size={14} className="text-red-600 flex-shrink-0" />
            <span className="text-[12px] font-semibold text-red-700">Événement critique — Traçabilité renforcée</span>
          </div>
        )}

        {/* Général */}
        <Section title="Informations générales">
          <Row label="Action" value={<ActionBadge action={event.action} />} />
          <Row label="Résultat" value={<ResultatBadge resultat={event.resultat} />} />
          <Row label="Module" value={event.module} />
          <Row label="Date" value={event.date} />
          <Row label="Heure" value={<span className="font-mono font-semibold">{event.heure}</span>} />
          <Row label="Utilisateur" value={event.utilisateur} />
          <Row label="Rôle" value={event.role} />
          <Row label="Service" value={event.service} />
          <Row label="ID utilisateur" value={<span className="font-mono text-[11.5px]">{event.utilisateurId}</span>} />
        </Section>

        {/* Contexte */}
        <Section title="Contexte métier">
          <Row label="Objet" value={event.objet} />
          <Row label="Référence" value={<span className="font-mono font-semibold text-navy-900">{event.reference}</span>} />
          {event.statutAvant && <Row label="Statut avant" value={<span className="px-2 py-0.5 rounded text-[11px] font-semibold" style={{ background: '#F1F5F9', color: '#374151' }}>{event.statutAvant}</span>} />}
          {event.statutApres && <Row label="Statut après" value={<span className="px-2 py-0.5 rounded text-[11px] font-semibold" style={{ background: '#DCFCE7', color: '#166534' }}>{event.statutApres}</span>} />}
        </Section>

        {/* Données modifiées */}
        {(event.valeurAvant || event.valeurApres) && (
          <Section title="Données modifiées">
            {event.valeurAvant && (
              <div className="rounded-lg p-3 text-[12px]" style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}>
                <div className="text-[10px] font-bold text-red-600 uppercase tracking-wider mb-1">Avant</div>
                <div className="text-red-800 font-mono">{event.valeurAvant}</div>
              </div>
            )}
            {event.valeurApres && (
              <div className="rounded-lg p-3 text-[12px]" style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
                <div className="text-[10px] font-bold text-green-600 uppercase tracking-wider mb-1">Après</div>
                <div className="text-green-800 font-mono">{event.valeurApres}</div>
              </div>
            )}
          </Section>
        )}

        {/* Traçabilité technique */}
        <Section title="Traçabilité technique">
          <Row label="Adresse IP" value={<span className="font-mono text-[11.5px]">{event.ip}</span>} />
          <Row label="Navigateur" value={event.navigateur} />
          <Row label="Session" value={<span className="font-mono text-[11px] text-gray-500">{event.session}</span>} />
          <Row label="Horodatage" value={<span className="font-mono text-[11px]">{event.timestamp}</span>} />
        </Section>

        {/* Commentaire */}
        {event.commentaire && (
          <Section title="Commentaire / Motif">
            <div className="text-[13px] text-gray-700 leading-relaxed px-3 py-2.5 rounded-lg"
              style={{ background: '#FFFBEB', border: '1px solid #FDE68A' }}>
              {event.commentaire}
            </div>
          </Section>
        )}

        {/* Immutabilité */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-[11.5px]" style={{ background: '#F1F5F9' }}>
          <Lock size={12} className="text-gray-500" />
          <span className="text-gray-500">Événement immuable — non modifiable</span>
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">{title}</div>
      <div className="space-y-2">{children}</div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3 py-1.5 border-b border-gray-50">
      <span className="text-[12px] text-gray-500 flex-shrink-0 w-28">{label}</span>
      <span className="text-[12px] text-gray-800 font-medium text-right">{value}</span>
    </div>
  )
}

export default function JournalEvenements({ onNavigate: _onNavigate }: Props) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'liste' | 'critiques'>('dashboard')
  const [search, setSearch] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [filterModule, setFilterModule] = useState<ModuleType | ''>('')
  const [filterAction, setFilterAction] = useState<ActionType | ''>('')
  const [filterResultat, setFilterResultat] = useState<ResultatType | ''>('')
  const [filterNiveau, setFilterNiveau] = useState<NiveauType | ''>('')
  const [filterUtilisateur, setFilterUtilisateur] = useState('')
  const [filterDateDu, setFilterDateDu] = useState('')
  const [filterDateAu, setFilterDateAu] = useState('')
  const [filterIP, setFilterIP] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedEvent, setSelectedEvent] = useState<AuditEvent | null>(null)
  const [exporting, setExporting] = useState(false)

  // ── Derived stats ──
  const today = '2026-09-09'
  const todayEvents = AUDIT_EVENTS.filter(e => e.date === today)
  const critiques = AUDIT_EVENTS.filter(e => e.niveau === 'CRITIQUE')
  const errors = AUDIT_EVENTS.filter(e => e.resultat === 'ECHEC')

  // ── Module chart data ──
  const byModule = useMemo(() => {
    const counts: Record<string, number> = {}
    AUDIT_EVENTS.forEach(e => { counts[e.module] = (counts[e.module] ?? 0) + 1 })
    return Object.entries(counts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value)
  }, [])

  // ── Action chart data ──
  const byAction = useMemo(() => {
    const counts: Record<string, number> = {}
    AUDIT_EVENTS.forEach(e => { counts[e.action] = (counts[e.action] ?? 0) + 1 })
    return Object.entries(counts).map(([name, value]) => ({ name: ACTION_CONFIG[name as ActionType]?.label ?? name, value })).sort((a, b) => b.value - a.value).slice(0, 8)
  }, [])

  // ── Daily chart data ──
  const byDay = useMemo(() => {
    const counts: Record<string, number> = {}
    AUDIT_EVENTS.forEach(e => { counts[e.date] = (counts[e.date] ?? 0) + 1 })
    return Object.entries(counts).sort().map(([date, value]) => ({ date: date.slice(5), value }))
  }, [])

  // ── Filter ──
  const filtered = useMemo(() => {
    const tab = activeTab === 'critiques' ? AUDIT_EVENTS.filter(e => e.niveau === 'CRITIQUE') : AUDIT_EVENTS
    return tab.filter(e => {
      if (search && !e.id.toLowerCase().includes(search.toLowerCase()) &&
          !e.reference.toLowerCase().includes(search.toLowerCase()) &&
          !e.utilisateur.toLowerCase().includes(search.toLowerCase()) &&
          !e.objet.toLowerCase().includes(search.toLowerCase())) return false
      if (filterModule && e.module !== filterModule) return false
      if (filterAction && e.action !== filterAction) return false
      if (filterResultat && e.resultat !== filterResultat) return false
      if (filterNiveau && e.niveau !== filterNiveau) return false
      if (filterUtilisateur && !e.utilisateur.toLowerCase().includes(filterUtilisateur.toLowerCase())) return false
      if (filterDateDu && e.date < filterDateDu) return false
      if (filterDateAu && e.date > filterDateAu) return false
      if (filterIP && !e.ip.includes(filterIP)) return false
      return true
    })
  }, [search, filterModule, filterAction, filterResultat, filterNiveau, filterUtilisateur, filterDateDu, filterDateAu, filterIP, activeTab])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const hasFilters = !!(filterModule || filterAction || filterResultat || filterNiveau || filterUtilisateur || filterDateDu || filterDateAu || filterIP)

  const resetFilters = () => {
    setFilterModule(''); setFilterAction(''); setFilterResultat(''); setFilterNiveau('')
    setFilterUtilisateur(''); setFilterDateDu(''); setFilterDateAu(''); setFilterIP('')
    setCurrentPage(1)
  }

  const exportCSV = () => {
    setExporting(true)
    const header = ['ID', 'Date', 'Heure', 'Utilisateur', 'Rôle', 'Service', 'Module', 'Action', 'Objet', 'Référence', 'Statut avant', 'Statut après', 'Résultat', 'Niveau', 'IP', 'Navigateur', 'Commentaire'].join(';')
    const rows = filtered.map(e => [
      e.id, e.date, e.heure, e.utilisateur, e.role, e.service, e.module, e.action,
      `"${e.objet}"`, e.reference, e.statutAvant ?? '', e.statutApres ?? '',
      e.resultat, e.niveau, e.ip, e.navigateur, e.commentaire ?? '',
    ].join(';'))
    const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = `journal-evenements-${today}.csv`; a.click()
    URL.revokeObjectURL(url)
    setTimeout(() => setExporting(false), 600)
  }

  return (
    <div className="flex h-full overflow-hidden">
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 space-y-5">

          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="section-title text-2xl flex items-center gap-2">
                <Shield size={20} style={{ color: '#0B1C3E' }} />
                Journal des Événements
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Audit trail — Traçabilité complète BUDGET-CEEAC · {fmt(AUDIT_EVENTS.length)} événements enregistrés
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold"
                style={{ background: '#FEE2E2', color: '#991B1B', border: '1px solid #FECACA' }}>
                <Lock size={11} /> Journal immuable
              </div>
              <button
                className="btn btn-outline btn-sm"
                onClick={exportCSV}
                disabled={exporting}
              >
                <Download size={13} /> {exporting ? 'Export…' : 'Exporter CSV'}
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 gap-0 -mt-2">
            {([
              { id: 'dashboard', label: 'Tableau de bord', icon: <BarChart2 size={14} /> },
              { id: 'liste', label: `Liste (${fmt(AUDIT_EVENTS.length)})`, icon: <Database size={14} /> },
              { id: 'critiques', label: `Événements critiques (${critiques.length})`, icon: <AlertTriangle size={14} /> },
            ] as const).map(t => (
              <button
                key={t.id}
                className={`tab-item flex items-center gap-1.5 ${activeTab === t.id ? 'active' : ''}`}
                style={t.id === 'critiques' && activeTab !== t.id ? { color: '#DC2626' } : undefined}
                onClick={() => { setActiveTab(t.id); setCurrentPage(1) }}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          {/* ── DASHBOARD ── */}
          {activeTab === 'dashboard' && (
            <div className="space-y-5">
              {/* KPI strip */}
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: 'Total événements', value: AUDIT_EVENTS.length, icon: <Activity size={18} />, color: '#0B1C3E', bg: '#EDF2FB' },
                  { label: "Aujourd'hui", value: todayEvents.length, icon: <Clock size={18} />, color: '#1A6B3A', bg: '#DCFCE7' },
                  { label: 'Événements critiques', value: critiques.length, icon: <AlertTriangle size={18} />, color: '#991B1B', bg: '#FEE2E2' },
                  { label: 'Échecs / Erreurs', value: errors.length, icon: <Shield size={18} />, color: '#92400E', bg: '#FEF3C7' },
                ].map((k, i) => (
                  <div key={i} className="card p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: k.bg, color: k.color }}>
                      {k.icon}
                    </div>
                    <div>
                      <div className="text-[22px] font-bold" style={{ color: k.color }}>{fmt(k.value)}</div>
                      <div className="text-[11px] text-gray-500">{k.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Second KPI row */}
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: 'Connexions', value: AUDIT_EVENTS.filter(e => e.action === 'CONNEXION').length, color: '#374151' },
                  { label: 'Validations', value: AUDIT_EVENTS.filter(e => ['VALIDATION', 'APPROBATION', 'VISA', 'SIGNATURE'].includes(e.action)).length, color: '#166534' },
                  { label: 'Rejets / Retours', value: AUDIT_EVENTS.filter(e => ['REJET', 'RETOUR'].includes(e.action)).length, color: '#991B1B' },
                  { label: 'Modifications budget', value: AUDIT_EVENTS.filter(e => e.module === 'Budget' && e.action === 'MODIFICATION').length, color: '#92400E' },
                ].map((k, i) => (
                  <div key={i} className="card p-3 flex items-center justify-between">
                    <span className="text-[12px] text-gray-500">{k.label}</span>
                    <span className="text-[20px] font-bold" style={{ color: k.color }}>{k.value}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-5">
                {/* Events by day */}
                <div className="card p-4 col-span-2">
                  <div className="text-[12px] font-semibold text-gray-700 mb-3">Événements par jour</div>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={byDay} barSize={20}>
                      <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                      <Tooltip
                        contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #E5E7EB' }}
                        formatter={(v) => [v, 'Événements']}
                      />
                      <Bar dataKey="value" fill="#0B1C3E" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* By module pie */}
                <div className="card p-4">
                  <div className="text-[12px] font-semibold text-gray-700 mb-3">Par module</div>
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie data={byModule} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} innerRadius={35}>
                        {byModule.map((_, i) => (
                          <Cell key={i} fill={MODULE_PIE_COLORS[i % MODULE_PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} formatter={(v) => [v, 'événements']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* By action */}
              <div className="card p-4">
                <div className="text-[12px] font-semibold text-gray-700 mb-3">Répartition par type d&apos;action (top 8)</div>
                <ResponsiveContainer width="100%" height={150}>
                  <BarChart data={byAction} layout="vertical" barSize={14}>
                    <XAxis type="number" tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#6B7280' }} axisLine={false} tickLine={false} width={130} />
                    <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                    <Bar dataKey="value" fill="#1A6B3A" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Recent critiques */}
              <div className="card overflow-hidden">
                <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-2">
                  <AlertTriangle size={14} className="text-red-500" />
                  <span className="font-semibold text-[14px] text-gray-800">Derniers événements critiques</span>
                </div>
                {critiques.slice(0, 5).map((e, i) => (
                  <div key={i} className="flex items-center gap-3 px-5 py-3 border-b border-gray-50 hover:bg-red-50/30 cursor-pointer transition-colors"
                    onClick={() => { setSelectedEvent(e); setActiveTab('liste') }}>
                    <NiveauDot niveau="CRITIQUE" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] text-gray-400">{e.id}</span>
                        <ActionBadge action={e.action} />
                        <span className="text-[12.5px] font-medium text-gray-700 truncate">{e.objet}</span>
                      </div>
                      <div className="text-[11px] text-gray-400 mt-0.5">{e.date} {e.heure} · {e.utilisateur} · {e.module}</div>
                    </div>
                    <ChevronRight size={13} className="text-gray-300 flex-shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── LIST / CRITIQUES ── */}
          {(activeTab === 'liste' || activeTab === 'critiques') && (
            <div className="space-y-4">
              {/* Toolbar */}
              <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-sm">
                  <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    className="form-input pl-9 py-2 text-[13px] w-full"
                    placeholder="ID, référence, utilisateur, objet…"
                    value={search}
                    onChange={e => { setSearch(e.target.value); setCurrentPage(1) }}
                  />
                </div>
                <button
                  className={`btn btn-outline btn-sm ${showAdvanced ? 'ring-2 ring-navy-300' : ''}`}
                  onClick={() => setShowAdvanced(v => !v)}
                >
                  <Filter size={13} /> Filtres avancés
                  {showAdvanced ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                  {hasFilters && <span className="ml-1 w-1.5 h-1.5 rounded-full bg-navy-700 inline-block" />}
                </button>
                {hasFilters && (
                  <button className="btn btn-outline btn-sm text-red-500" onClick={resetFilters}>
                    <RefreshCw size={12} /> Réinitialiser
                  </button>
                )}
                <button className="btn btn-outline btn-sm" onClick={exportCSV} disabled={exporting}>
                  <Download size={13} /> {exporting ? 'Export…' : 'Exporter'}
                </button>
                <div className="ml-auto text-[12px] text-gray-400">
                  {fmt(filtered.length)} résultat{filtered.length > 1 ? 's' : ''}
                </div>
              </div>

              {/* Advanced filters */}
              {showAdvanced && (
                <div className="card p-4 space-y-3" style={{ border: '1.5px solid #CBD5E1' }}>
                  <div className="text-[10.5px] uppercase font-semibold tracking-wider text-gray-400 mb-1">Filtres avancés</div>
                  <div className="grid grid-cols-4 gap-3">
                    <div>
                      <label className="form-label">Module</label>
                      <select className="form-input text-[12.5px]" value={filterModule} onChange={e => { setFilterModule(e.target.value as ModuleType | ''); setCurrentPage(1) }}>
                        <option value="">Tous</option>
                        {ALL_MODULES.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="form-label">Type d&apos;action</label>
                      <select className="form-input text-[12.5px]" value={filterAction} onChange={e => { setFilterAction(e.target.value as ActionType | ''); setCurrentPage(1) }}>
                        <option value="">Toutes</option>
                        {ALL_ACTIONS.map(a => <option key={a} value={a}>{ACTION_CONFIG[a].label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="form-label">Résultat</label>
                      <select className="form-input text-[12.5px]" value={filterResultat} onChange={e => { setFilterResultat(e.target.value as ResultatType | ''); setCurrentPage(1) }}>
                        <option value="">Tous</option>
                        <option value="SUCCES">Succès</option>
                        <option value="ECHEC">Échec</option>
                        <option value="AVERTISSEMENT">Avertissement</option>
                      </select>
                    </div>
                    <div>
                      <label className="form-label">Niveau</label>
                      <select className="form-input text-[12.5px]" value={filterNiveau} onChange={e => { setFilterNiveau(e.target.value as NiveauType | ''); setCurrentPage(1) }}>
                        <option value="">Tous</option>
                        <option value="INFO">Info</option>
                        <option value="WARN">Avertissement</option>
                        <option value="CRITIQUE">Critique</option>
                      </select>
                    </div>
                    <div>
                      <label className="form-label">Utilisateur</label>
                      <input className="form-input text-[12.5px]" placeholder="Nom…" value={filterUtilisateur} onChange={e => { setFilterUtilisateur(e.target.value); setCurrentPage(1) }} />
                    </div>
                    <div>
                      <label className="form-label">Date du</label>
                      <input type="date" className="form-input text-[12.5px]" value={filterDateDu} onChange={e => { setFilterDateDu(e.target.value); setCurrentPage(1) }} />
                    </div>
                    <div>
                      <label className="form-label">Date au</label>
                      <input type="date" className="form-input text-[12.5px]" value={filterDateAu} onChange={e => { setFilterDateAu(e.target.value); setCurrentPage(1) }} />
                    </div>
                    <div>
                      <label className="form-label">Adresse IP</label>
                      <input className="form-input text-[12.5px]" placeholder="196.207…" value={filterIP} onChange={e => { setFilterIP(e.target.value); setCurrentPage(1) }} />
                    </div>
                  </div>
                </div>
              )}

              {/* Table */}
              <div className="card overflow-hidden">
                {filtered.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <Search size={36} className="text-gray-200 mb-3" />
                    <div className="text-[15px] font-semibold text-gray-400">Aucun événement trouvé</div>
                    <div className="text-[13px] text-gray-400 mt-1">Ajustez vos filtres ou votre recherche.</div>
                    {hasFilters && <button className="btn btn-outline btn-sm mt-4" onClick={resetFilters}><RefreshCw size={12} /> Réinitialiser les filtres</button>}
                  </div>
                ) : (
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th className="w-5"></th>
                        <th>Date / Heure</th>
                        <th>Utilisateur</th>
                        <th>Module</th>
                        <th>Action</th>
                        <th>Objet / Référence</th>
                        <th>Résultat</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginated.map(e => (
                        <tr
                          key={e.id}
                          className="cursor-pointer"
                          style={e.niveau === 'CRITIQUE' ? { background: '#FFF5F5' } : selectedEvent?.id === e.id ? { background: '#EDF2FB' } : undefined}
                          onClick={() => setSelectedEvent(selectedEvent?.id === e.id ? null : e)}
                        >
                          <td className="pr-0">
                            <NiveauDot niveau={e.niveau} />
                          </td>
                          <td>
                            <div className="font-mono text-[12px] font-semibold text-gray-700">{e.date}</div>
                            <div className="font-mono text-[11px] text-gray-400">{e.heure}</div>
                          </td>
                          <td>
                            <div className="font-semibold text-[12.5px] text-gray-800 truncate max-w-[140px]">{e.utilisateur}</div>
                            <div className="text-[11px] text-gray-400 truncate">{e.role}</div>
                          </td>
                          <td>
                            <span className="text-[12px] text-gray-600">{e.module}</span>
                          </td>
                          <td>
                            <ActionBadge action={e.action} />
                          </td>
                          <td>
                            <div className="text-[12.5px] font-medium text-gray-700 truncate max-w-[200px]">{e.objet}</div>
                            <div className="font-mono text-[11px] text-gray-400">{e.reference}</div>
                          </td>
                          <td>
                            <ResultatBadge resultat={e.resultat} />
                          </td>
                          <td>
                            <button
                              className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-gray-100 text-gray-400"
                              onClick={ev => { ev.stopPropagation(); setSelectedEvent(selectedEvent?.id === e.id ? null : e) }}
                            >
                              <Eye size={13} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {/* Pagination */}
                {filtered.length > 0 && (
                  <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between">
                    <div className="text-[12px] text-gray-400">
                      Résultats {fmt((currentPage - 1) * PAGE_SIZE + 1)}–{fmt(Math.min(currentPage * PAGE_SIZE, filtered.length))} sur {fmt(filtered.length)}
                    </div>
                    <div className="flex items-center gap-1">
                      <button className="btn btn-outline btn-sm px-2" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>← Préc</button>
                      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
                        <button key={p} className={`w-7 h-7 rounded text-[12px] font-medium ${p === currentPage ? 'text-white' : 'text-gray-500 hover:bg-gray-100'}`}
                          style={p === currentPage ? { background: '#0B1C3E' } : undefined}
                          onClick={() => setCurrentPage(p)}>
                          {p}
                        </button>
                      ))}
                      <button className="btn btn-outline btn-sm px-2" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>Suiv →</button>
                    </div>
                  </div>
                )}
              </div>

              {/* Permissions notice */}
              <div className="flex items-center gap-2 text-[11.5px] text-gray-400">
                <Lock size={11} />
                <span>Accès requis : <code className="bg-gray-100 px-1 rounded">journal.view</code> · Export : <code className="bg-gray-100 px-1 rounded">journal.export</code> · Administration : <code className="bg-gray-100 px-1 rounded">journal.admin</code></span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Event detail side panel ── */}
      {selectedEvent && (
        <EventDetailPanel event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </div>
  )
}
