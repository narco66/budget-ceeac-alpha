import { useState } from 'react'
import { Search, Bell, ChevronDown, HelpCircle, AlertCircle, CheckCheck, LogOut, User, Settings } from 'lucide-react'
import type { Page } from '../types'

interface BreadcrumbSegment {
  label: string
  page?: Page
}

interface CurrentUser {
  nom: string
  role: string
  structure: string
  email: string
}

interface Props {
  breadcrumb: BreadcrumbSegment[]
  onNavigate: (page: Page) => void
  currentUser?: CurrentUser
  onLogout?: () => void
}

const PAGE_LABELS: Partial<Record<Page, string>> = {
  dashboard: 'Tableau de bord',
  planification: 'Planification stratégique',
  budget: 'Budget',
  pap: 'PAP',
  'eb-list': 'Expressions de Besoin',
  'eng-list': 'Engagements',
  'liq-list': 'Liquidations',
  'ord-list': 'Ordonnancements',
  'pay-list': 'Paiements',
  se: 'Suivi-Évaluation',
  reporting: 'Reporting',
  ged: 'GED',
  controle: 'Contrôle interne',
  audit: 'Audit',
  administration: 'Administration',
  'mes-taches': 'Mes tâches',
  dossier: 'Dossier numérique',
}

const SEARCH_PAGES: { keywords: string[]; page: Page; label: string }[] = [
  { keywords: ['eb', 'expression', 'besoin'], page: 'eb-list', label: 'Expressions de Besoin' },
  { keywords: ['eng', 'engagement'], page: 'eng-list', label: 'Engagements' },
  { keywords: ['liq', 'liquidation'], page: 'liq-list', label: 'Liquidations' },
  { keywords: ['ord', 'ordonnancement'], page: 'ord-list', label: 'Ordonnancements' },
  { keywords: ['pay', 'paiement'], page: 'pay-list', label: 'Paiements' },
  { keywords: ['budget'], page: 'budget', label: 'Budget' },
  { keywords: ['pap'], page: 'pap', label: 'PAP' },
  { keywords: ['rapport', 'reporting'], page: 'reporting', label: 'Reporting' },
  { keywords: ['ged', 'document'], page: 'ged', label: 'GED Documents' },
  { keywords: ['audit'], page: 'audit', label: 'Audit' },
  { keywords: ['contrôle', 'controle', 'risque'], page: 'controle', label: 'Contrôle interne' },
  { keywords: ['workflow'], page: 'workflow-list', label: 'Workflows' },
  { keywords: ['dossier'], page: 'dossier', label: 'Dossier numérique' },
  { keywords: ['tâche', 'tache', 'mes tâches'], page: 'mes-taches', label: 'Mes tâches' },
]

function getInitials(nom: string): string {
  return nom.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase()
}

function UserMenu({ currentUser, onNavigate, onLogout }: { currentUser?: CurrentUser; onNavigate: (p: Page) => void; onLogout?: () => void }) {
  const [open, setOpen] = useState(false)
  const nom = currentUser?.nom ?? 'Alain MBONGO'
  const role = currentUser?.role ?? 'Contrôleur Financier'
  const email = currentUser?.email ?? ''
  const initials = getInitials(nom)

  return (
    <div className="relative flex-shrink-0">
      <button
        className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-gray-100 transition-colors"
        onClick={() => setOpen(o => !o)}
      >
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #1A6B3A, #2B50A8)' }}>
          {initials}
        </div>
        <div className="hidden lg:block text-left">
          <div className="text-[12px] font-semibold text-gray-800 leading-tight">{nom}</div>
          <div className="text-[10px] text-gray-400 leading-tight">{role}</div>
        </div>
        <ChevronDown size={12} className="text-gray-400" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            className="absolute right-0 top-11 w-64 rounded-xl shadow-xl border border-gray-100 bg-white z-50 overflow-hidden"
            style={{ boxShadow: '0 20px 40px rgba(0,0,0,0.12)' }}
          >
            {/* User info header */}
            <div className="px-4 py-3 border-b border-gray-100" style={{ background: '#F8FAFD' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #1A6B3A, #2B50A8)' }}>
                  {initials}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-gray-800 truncate">{nom}</div>
                  <div className="text-[11px] text-gray-500 truncate">{email}</div>
                </div>
              </div>
              <div className="mt-2">
                <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full text-white" style={{ background: '#0B1C3E' }}>
                  {role}
                </span>
              </div>
            </div>

            {/* Menu items */}
            <div className="py-1">
              <button
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-[13px] text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => { onNavigate('administration'); setOpen(false) }}
              >
                <User size={14} className="text-gray-400" />
                Mon profil
              </button>
              <button
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-[13px] text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => { onNavigate('administration'); setOpen(false) }}
              >
                <Settings size={14} className="text-gray-400" />
                Paramètres du compte
              </button>
            </div>

            <div className="border-t border-gray-100 py-1">
              <button
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-[13px] font-medium hover:bg-red-50 transition-colors"
                style={{ color: '#DC2626' }}
                onClick={() => { setOpen(false); onLogout?.() }}
              >
                <LogOut size={14} />
                Se déconnecter
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default function TopBar({ breadcrumb, onNavigate, currentUser, onLogout }: Props) {
  const [searchVal, setSearchVal] = useState('')
  const [notifOpen, setNotifOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const [notifRead, setNotifRead] = useState(false)

  const searchResults = searchVal.trim().length > 1
    ? SEARCH_PAGES.filter(p => p.keywords.some(k => k.includes(searchVal.toLowerCase()) || searchVal.toLowerCase().includes(k))).slice(0, 5)
    : []

  return (
    <div
      className="flex items-center gap-4 px-6 h-[60px] flex-shrink-0"
      style={{
        background: 'white',
        borderBottom: '1px solid #E2E8F0',
        zIndex: 10,
      }}
    >
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm flex-1 min-w-0">
        <button
          className="text-gray-400 hover:text-navy-900 transition-colors text-sm"
          onClick={() => onNavigate('dashboard')}
        >
          Accueil
        </button>
        {breadcrumb.map((seg, i) => (
          <span key={i} className="flex items-center gap-1.5">
            <span className="text-gray-300">/</span>
            {seg.page ? (
              <button
                className="text-gray-500 hover:text-navy-900 transition-colors truncate max-w-[180px]"
                onClick={() => seg.page && onNavigate(seg.page)}
              >
                {seg.label}
              </button>
            ) : (
              <span className="font-semibold text-gray-800 truncate max-w-[200px]">{seg.label}</span>
            )}
          </span>
        ))}
      </div>

      {/* Search */}
      <div className="relative w-64 flex-shrink-0">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher un module, dossier…"
          value={searchVal}
          onChange={e => setSearchVal(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && searchResults.length > 0) {
              onNavigate(searchResults[0].page)
              setSearchVal('')
            }
            if (e.key === 'Escape') setSearchVal('')
          }}
          className="w-full pl-9 pr-3 py-2 text-[13px] border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:border-ceeac-700 focus:outline-none focus:ring-2 focus:ring-ceeac-700/15 transition-all"
          style={{ color: '#1E2A42' }}
        />
        {searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-gray-200 shadow-lg z-50 overflow-hidden">
            {searchResults.map((r, i) => (
              <button
                key={i}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-left hover:bg-gray-50 transition-colors"
                onClick={() => { onNavigate(r.page); setSearchVal('') }}
              >
                <Search size={12} className="text-gray-400 flex-shrink-0" />
                <span className="text-gray-700">{r.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Exercice */}
      <div
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold flex-shrink-0"
        style={{ background: '#EDF2FB', color: '#1B3269', border: '1px solid #B8CFF0' }}
      >
        <div className="w-1.5 h-1.5 rounded-full bg-navy-500" />
        Exercice 2026
      </div>

      {/* Help */}
      <div className="relative flex-shrink-0">
        <button
          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-all"
          onClick={() => setHelpOpen(v => !v)}
        >
          <HelpCircle size={17} />
        </button>
        {helpOpen && (
          <div className="absolute right-0 top-10 w-72 rounded-xl shadow-xl border border-gray-100 bg-white z-50"
            style={{ boxShadow: '0 20px 40px rgba(0,0,0,0.12)' }}>
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="text-sm font-semibold text-gray-800">Aide BUDGET-CEEAC</div>
              <div className="text-[11px] text-gray-400 mt-0.5">GESBUDEP v2.0 — Exercice 2026</div>
            </div>
            {[
              { label: 'Guide de la chaîne de dépense', action: () => onNavigate('eb-list') },
              { label: 'Manuel utilisateur (PDF)', action: () => {} },
              { label: 'Procédures de validation', action: () => onNavigate('workflow-list') },
              { label: 'Contacter le support', action: () => {} },
            ].map((item, i) => (
              <button key={i} className="w-full px-4 py-2.5 text-left text-[13px] text-gray-700 hover:bg-gray-50 border-b border-gray-50 last:border-0"
                onClick={() => { item.action(); setHelpOpen(false) }}>
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Notifs */}
      <div className="relative flex-shrink-0">
        <button
          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-all relative"
          onClick={() => setNotifOpen(!notifOpen)}
        >
          <Bell size={17} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-amber-500" />
        </button>
        {notifOpen && (
          <div
            className="absolute right-0 top-10 w-80 rounded-xl shadow-xl border border-gray-100 bg-white z-50"
            style={{ boxShadow: '0 20px 40px rgba(0,0,0,0.12)' }}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <span className="text-sm font-semibold text-gray-800">Notifications</span>
              <button className="text-xs text-ceeac-700 hover:underline flex items-center gap-1"
                onClick={() => setNotifRead(true)}>
                <CheckCheck size={12} /> Tout lire
              </button>
            </div>
            {[
              { icon: <AlertCircle size={14} className="text-amber-500" />, msg: 'ENG-2026-003756 en attente de votre visa', time: 'Il y a 2h', page: 'eng-detail' as Page },
              { icon: <AlertCircle size={14} className="text-red-500" />, msg: 'ORD-2026-001756 — délai de signature dépassé', time: 'Il y a 5h', page: 'ord-detail' as Page },
              { icon: <Bell size={14} className="text-blue-500" />, msg: 'EB-2026-004523 soumis pour validation', time: 'Hier', page: 'eb-detail' as Page },
            ].map((n, i) => (
              <div key={i}
                className={`flex items-start gap-3 px-4 py-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors ${notifRead ? 'opacity-50' : ''}`}
                onClick={() => { onNavigate(n.page); setNotifOpen(false) }}>
                <div className="mt-0.5 flex-shrink-0">{n.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-[12.5px] text-gray-700 leading-snug">{n.msg}</div>
                  <div className="text-[11px] text-gray-400 mt-0.5">{n.time}</div>
                </div>
              </div>
            ))}
            <div className="px-4 py-2 text-center">
              <button className="text-xs text-ceeac-700 hover:underline"
                onClick={() => { onNavigate('mes-taches'); setNotifOpen(false) }}>
                Voir toutes les notifications
              </button>
            </div>
          </div>
        )}
      </div>

      {/* User */}
      <UserMenu currentUser={currentUser} onNavigate={onNavigate} onLogout={onLogout} />
    </div>
  )
}
