import { useState } from 'react'
import type { Page } from '../types'
import {
  LayoutDashboard, Map, Wallet, BarChart3, Link2,
  FileText, CheckSquare, Send, CreditCard,
  TrendingUp, BookOpen, Folder, Shield, Search, Settings,
  ChevronDown, ChevronRight, PanelLeftClose, PanelLeftOpen,
  ClipboardList, GitBranch, ScrollText, Target, Lock,
  Users, ShoppingCart, TrendingDown, Briefcase, GanttChart, ArrowLeftRight, Database, Telescope,
} from 'lucide-react'
import logoUrl from '../imports/LOGO-CEEAC-CERTO_.jpg'

type NavLeaf = { id: Page; label: string; badge?: string | number }
type NavItem = {
  id: Page
  label: string
  icon: React.ReactNode
  children?: NavLeaf[]
}
type NavSection = {
  category: string
  items: NavItem[]
}

const SECTIONS: NavSection[] = [
  {
    category: 'ACCUEIL',
    items: [
      { id: 'dashboard', label: 'Tableau de bord', icon: <LayoutDashboard size={15} /> },
      { id: 'mes-taches', label: 'Mes tâches', icon: <ClipboardList size={15} /> },
    ],
  },
  {
    category: 'PILOTAGE EXÉCUTIF',
    items: [
      { id: 'executive', label: 'Tableau de bord exécutif', icon: <Telescope size={15} /> },
    ],
  },
  {
    category: 'RÉFÉRENTIELS OFFICIELS',
    items: [
      { id: 'referentiel', label: 'Org. & Budget CEEAC', icon: <Database size={15} /> },
    ],
  },
  {
    category: 'PLANIFICATION & BUDGET',
    items: [
      { id: 'planification', label: 'Planification stratégique', icon: <Map size={15} /> },
      { id: 'preparation', label: 'Préparation budgétaire', icon: <Target size={15} /> },
      { id: 'budget', label: 'Gestion du Budget', icon: <Wallet size={15} /> },
      { id: 'pap', label: 'PAP / GAR / RBM', icon: <BarChart3 size={15} /> },
    ],
  },
  {
    category: 'CHAÎNE DE DÉPENSE',
    items: [
      {
        id: 'eb-list',
        label: 'Dépenses',
        icon: <Link2 size={15} />,
        children: [
          { id: 'eb-list', label: 'Expressions de Besoin' },
          { id: 'eng-list', label: 'Engagements' },
          { id: 'liq-list', label: 'Liquidations' },
          { id: 'ord-list', label: 'Ordonnancements' },
          { id: 'pay-list', label: 'Paiements' },
        ],
      },
      { id: 'tiers', label: 'Tiers & Fournisseurs', icon: <Users size={15} /> },
      { id: 'marches', label: 'Achats & Marchés', icon: <ShoppingCart size={15} /> },
      { id: 'recettes', label: 'Recettes', icon: <TrendingDown size={15} /> },
    ],
  },
  {
    category: 'PROJETS & PERFORMANCE',
    items: [
      { id: 'projets', label: 'Projets & Investissements', icon: <Briefcase size={15} /> },
      { id: 'gantt', label: 'Gantt d\'exécution', icon: <GanttChart size={15} /> },
      { id: 'se', label: 'Suivi-Évaluation', icon: <TrendingUp size={15} /> },
      { id: 'reporting', label: 'Reporting & BI', icon: <BookOpen size={15} /> },
      { id: 'cloture', label: 'Clôture budgétaire', icon: <Lock size={15} /> },
    ],
  },
  {
    category: 'DOCUMENTS',
    items: [
      { id: 'ged', label: 'GED & Documents', icon: <Folder size={15} /> },
      { id: 'dossier', label: 'Dossier numérique', icon: <GitBranch size={15} /> },
    ],
  },
  {
    category: 'INTEROPÉRABILITÉ',
    items: [
      { id: 'interop', label: 'Import / Export / API', icon: <ArrowLeftRight size={15} /> },
    ],
  },
  {
    category: 'CONTRÔLE & AUDIT',
    items: [
      { id: 'controle', label: 'Contrôle interne', icon: <Shield size={15} /> },
      { id: 'audit', label: 'Audit & Risques', icon: <Search size={15} /> },
      { id: 'journal', label: 'Journal des Événements', icon: <ScrollText size={15} /> },
    ],
  },
  {
    category: 'ADMINISTRATION',
    items: [
      {
        id: 'administration',
        label: 'Administration',
        icon: <Settings size={15} />,
        children: [
          { id: 'administration', label: 'Utilisateurs & Rôles' },
          { id: 'workflow-list', label: 'Workflows' },
        ],
      },
    ],
  },
]

const CHAIN_PAGES: Page[] = ['eb-list', 'eb-detail', 'eb-form', 'eng-list', 'eng-detail', 'liq-list', 'liq-detail', 'ord-list', 'ord-detail', 'pay-list', 'pay-detail']
const ADMIN_PAGES: Page[] = ['administration', 'workflow-list', 'workflow-detail']

interface Props {
  activePage: Page
  onNavigate: (page: Page) => void
  collapsed: boolean
  onToggle: () => void
}

export default function Sidebar({ activePage, onNavigate, collapsed, onToggle }: Props) {
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set(['eb-list']))

  const toggleGroup = (id: string) => {
    setOpenGroups(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const isChainActive = CHAIN_PAGES.includes(activePage)
  const isAdminActive = ADMIN_PAGES.includes(activePage)

  const isGroupActive = (item: NavItem) => {
    if (item.id === 'eb-list') return isChainActive
    if (item.id === 'administration') return isAdminActive
    return false
  }

  return (
    <div
      className="flex flex-col h-full flex-shrink-0 transition-all duration-300"
      style={{
        width: collapsed ? 72 : 252,
        background: '#0B1C3E',
        borderRight: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Header */}
      <div className="flex items-center px-3 py-4 gap-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
        <div className="flex-shrink-0 w-9 h-9 rounded-lg overflow-hidden bg-white/10 flex items-center justify-center">
          <img src={logoUrl} alt="CEEAC" className="w-8 h-8 object-contain" />
        </div>
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <div className="text-[11px] font-bold text-white/90 leading-tight tracking-wide">BUDGET-CEEAC</div>
            <div className="text-[9.5px] text-white/40 leading-tight mt-0.5">Commission de la CEEAC</div>
          </div>
        )}
        <button
          onClick={onToggle}
          className="flex-shrink-0 w-7 h-7 rounded-md flex items-center justify-center text-white/30 hover:text-white/70 hover:bg-white/10 transition-all"
        >
          {collapsed ? <PanelLeftOpen size={14} /> : <PanelLeftClose size={14} />}
        </button>
      </div>

      {/* Exercise badge */}
      {!collapsed && (
        <div className="mx-3 my-2.5 px-3 py-1.5 rounded-lg flex items-center gap-2" style={{ background: 'rgba(26,107,58,0.25)', border: '1px solid rgba(26,107,58,0.35)' }}>
          <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
          <span className="text-[11px] font-semibold text-green-300">Exercice 2026</span>
          <span className="ml-auto text-[10px] text-green-400/70 font-medium">Exécutoire</span>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-1" style={{ scrollbarWidth: 'none' }}>
        {SECTIONS.map((section) => (
          <div key={section.category}>
            {/* Category header */}
            {!collapsed && (
              <div className="px-4 pt-3 pb-1">
                <span className="text-[9px] font-bold tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.25)' }}>
                  {section.category}
                </span>
              </div>
            )}
            {collapsed && <div className="my-1 mx-3 h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />}

            <div className="px-2 space-y-0.5">
              {section.items.map(item => {
                if (item.children) {
                  const groupActive = isGroupActive(item)
                  const isOpen = openGroups.has(item.id) || groupActive
                  return (
                    <div key={item.id}>
                      <div
                        className={`sidebar-item ${groupActive ? 'active' : ''}`}
                        onClick={() => {
                          toggleGroup(item.id)
                          if (item.id === 'eb-list') onNavigate('eb-list')
                          else if (item.id === 'administration') onNavigate('administration')
                        }}
                      >
                        <span className="flex-shrink-0">{item.icon}</span>
                        {!collapsed && (
                          <>
                            <span className="flex-1 truncate">{item.label}</span>
                            <span className="flex-shrink-0 text-white/30">
                              {isOpen ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
                            </span>
                          </>
                        )}
                      </div>
                      {!collapsed && isOpen && (
                        <div className="mt-0.5 space-y-0.5">
                          {item.children.map(child => (
                            <div
                              key={child.id}
                              className={`sidebar-item sub ${activePage === child.id ? 'active' : ''}`}
                              onClick={() => onNavigate(child.id)}
                            >
                              {child.label}
                              {'badge' in child && child.badge && (
                                <span className="ml-auto px-1.5 py-0.5 text-[9px] font-bold rounded bg-amber-500 text-white">{child.badge}</span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                }

                const isActive = activePage === item.id
                return (
                  <div
                    key={item.id}
                    className={`sidebar-item ${isActive ? 'active' : ''}`}
                    onClick={() => onNavigate(item.id)}
                  >
                    <span className="flex-shrink-0">{item.icon}</span>
                    {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
                    {!collapsed && item.id === 'mes-taches' && (
                      <span className="ml-auto px-1.5 py-0.5 text-[9px] font-bold rounded bg-amber-500 text-white">5</span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer user */}
      <div className="px-3 py-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #1A6B3A, #2B50A8)' }}>
            AM
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <div className="text-[12px] font-semibold text-white/85 leading-tight truncate">Alain MBONGO</div>
              <div className="text-[10px] text-white/40 leading-tight truncate">Contrôleur Financier</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
