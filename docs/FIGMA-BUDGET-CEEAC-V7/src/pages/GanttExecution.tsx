import { useState, useMemo, useRef } from 'react'
import type { Page } from '../types'
import {
  Filter, Search, Download, Maximize2, ChevronDown, ChevronRight,
  AlertTriangle, Clock, CheckCircle, XCircle, Pause, X,
  ZoomIn, ZoomOut, Calendar, LayoutGrid, List,
  TrendingUp, DollarSign, Activity, BarChart2, Flag,
} from 'lucide-react'

interface Props { onNavigate: (page: Page, id?: string) => void }

type GanttMode = 'hors-pap' | 'pap' | 'combined'
type Scale = 'month' | 'quarter' | 'week'
type TabId = 'synthese' | 'execution' | 'gantt' | 'ecarts' | 'alertes' | 'historique'

type ItemStatus = 'planifie' | 'en-cours' | 'realise' | 'en-retard' | 'bloque' | 'suspendu' | 'annule'
type ItemType = 'structure' | 'ligne' | 'eb' | 'eng' | 'liq' | 'ord' | 'pay' | 'pilier' | 'axe' | 'produit' | 'activite' | 'tache'

interface GanttItem {
  id: string
  label: string
  ref?: string
  type: ItemType
  responsable: string
  budget: number
  engage: number
  liquide: number
  ordonne: number
  paye: number
  physique: number
  financier: number
  status: ItemStatus
  planStart: Date
  planEnd: Date
  realStart?: Date
  realEnd?: Date
  isPAP: boolean
  pilier?: string
  children?: GanttItem[]
  isCritical?: boolean
}

const d = (y: number, m: number, day: number) => new Date(y, m - 1, day)
const today = new Date(2026, 8, 9)

// ── Mock data ──────────────────────────────────────────────────────────────────
const HORS_PAP: GanttItem[] = [
  {
    id: 'str-1', label: 'Direction des Finances', type: 'structure', responsable: 'D. NKOSI', isPAP: false,
    budget: 450000000, engage: 312000000, liquide: 280000000, ordonne: 240000000, paye: 198000000,
    physique: 72, financier: 69,
    status: 'en-cours', planStart: d(2026, 1, 1), planEnd: d(2026, 12, 31),
    children: [
      {
        id: 'lg-101', label: '60.01 — Frais de personnel', type: 'ligne', responsable: 'D. NKOSI', isPAP: false,
        budget: 180000000, engage: 160000000, liquide: 155000000, ordonne: 150000000, paye: 145000000,
        physique: 81, financier: 89, status: 'en-cours', planStart: d(2026, 1, 1), planEnd: d(2026, 12, 31),
        children: [
          {
            id: 'eb-001', ref: 'EB-2026-0042', label: 'Salaires T3 2026', type: 'eb', responsable: 'A. MBONGO', isPAP: false,
            budget: 45000000, engage: 45000000, liquide: 45000000, ordonne: 45000000, paye: 45000000,
            physique: 100, financier: 100, status: 'realise', planStart: d(2026, 7, 1), planEnd: d(2026, 9, 5), realStart: d(2026, 7, 1), realEnd: d(2026, 9, 3),
          },
          {
            id: 'eb-002', ref: 'EB-2026-0087', label: 'Salaires T4 2026', type: 'eb', responsable: 'A. MBONGO', isPAP: false,
            budget: 45000000, engage: 45000000, liquide: 0, ordonne: 0, paye: 0,
            physique: 0, financier: 0, status: 'planifie', planStart: d(2026, 10, 1), planEnd: d(2026, 12, 31),
          },
        ],
      },
      {
        id: 'lg-102', label: '60.05 — Frais de mission', type: 'ligne', responsable: 'C. ABENA', isPAP: false,
        budget: 85000000, engage: 52000000, liquide: 40000000, ordonne: 35000000, paye: 28000000,
        physique: 58, financier: 61, status: 'en-cours', planStart: d(2026, 1, 15), planEnd: d(2026, 12, 15),
        children: [
          {
            id: 'eb-003', ref: 'EB-2026-0031', label: 'Mission Bruxelles — Réunion CE', type: 'eb', responsable: 'C. ABENA', isPAP: false,
            budget: 12000000, engage: 12000000, liquide: 12000000, ordonne: 11500000, paye: 11500000,
            physique: 100, financier: 96, status: 'realise', planStart: d(2026, 3, 1), planEnd: d(2026, 3, 20), realStart: d(2026, 3, 5), realEnd: d(2026, 3, 22),
          },
          {
            id: 'eb-004', ref: 'EB-2026-0063', label: 'Missions réseau PTF Q3', type: 'eb', responsable: 'C. ABENA', isPAP: false,
            budget: 18000000, engage: 18000000, liquide: 14000000, ordonne: 10000000, paye: 0,
            physique: 60, financier: 78, status: 'en-retard', planStart: d(2026, 7, 1), planEnd: d(2026, 8, 31), realStart: d(2026, 7, 10),
          },
        ],
      },
    ],
  },
  {
    id: 'str-2', label: 'Direction des Affaires Générales', type: 'structure', responsable: 'P. MOUKALA', isPAP: false,
    budget: 220000000, engage: 98000000, liquide: 72000000, ordonne: 60000000, paye: 55000000,
    physique: 42, financier: 45, status: 'en-cours', planStart: d(2026, 1, 1), planEnd: d(2026, 12, 31),
    children: [
      {
        id: 'lg-201', label: '61.02 — Fournitures bureau', type: 'ligne', responsable: 'P. MOUKALA', isPAP: false,
        budget: 35000000, engage: 28000000, liquide: 22000000, ordonne: 18000000, paye: 15000000,
        physique: 55, financier: 80, status: 'en-cours', planStart: d(2026, 2, 1), planEnd: d(2026, 11, 30),
        children: [
          {
            id: 'eb-005', ref: 'EB-2026-0015', label: 'Achat papeterie S1', type: 'eb', responsable: 'P. MOUKALA', isPAP: false,
            budget: 8000000, engage: 8000000, liquide: 8000000, ordonne: 8000000, paye: 8000000,
            physique: 100, financier: 100, status: 'realise', planStart: d(2026, 2, 1), planEnd: d(2026, 3, 15), realStart: d(2026, 2, 3), realEnd: d(2026, 3, 18),
          },
          {
            id: 'eb-006', ref: 'EB-2026-0078', label: 'Achat papeterie S2', type: 'eb', responsable: 'P. MOUKALA', isPAP: false,
            budget: 8000000, engage: 8000000, liquide: 0, ordonne: 0, paye: 0,
            physique: 0, financier: 0, status: 'bloque', planStart: d(2026, 7, 1), planEnd: d(2026, 8, 31), realStart: d(2026, 7, 15), isCritical: true,
          },
        ],
      },
    ],
  },
]

const PAP_ITEMS: GanttItem[] = [
  {
    id: 'pil-1', label: 'Pilier 1 — Intégration économique', type: 'pilier', responsable: 'SG/CEEAC', isPAP: true,
    budget: 850000000, engage: 520000000, liquide: 430000000, ordonne: 380000000, paye: 320000000,
    physique: 58, financier: 63, status: 'en-cours', planStart: d(2026, 1, 1), planEnd: d(2026, 12, 31),
    children: [
      {
        id: 'axe-1-1', label: 'Axe 1.1 — Commerce intra-régional', type: 'axe', responsable: 'DGCE', isPAP: true,
        budget: 320000000, engage: 185000000, liquide: 150000000, ordonne: 130000000, paye: 110000000,
        physique: 52, financier: 58, status: 'en-cours', planStart: d(2026, 1, 1), planEnd: d(2026, 12, 31),
        children: [
          {
            id: 'prod-1-1-1', label: 'Produit 1.1.1 — Réduction barrières tarifaires', type: 'produit', responsable: 'DGCE', isPAP: true,
            budget: 120000000, engage: 72000000, liquide: 60000000, ordonne: 55000000, paye: 45000000,
            physique: 60, financier: 60, status: 'en-cours', planStart: d(2026, 1, 15), planEnd: d(2026, 11, 30),
            children: [
              {
                id: 'act-1-1-1-1', label: 'Étude impact ZLE régionale', type: 'activite', responsable: 'R. FOTSO', isPAP: true,
                budget: 45000000, engage: 45000000, liquide: 38000000, ordonne: 35000000, paye: 30000000,
                physique: 80, financier: 84, status: 'en-cours', planStart: d(2026, 1, 15), planEnd: d(2026, 8, 31), realStart: d(2026, 1, 20),
                children: [
                  {
                    id: 'tac-1', label: 'Collecte données commerciales', type: 'tache', responsable: 'R. FOTSO', isPAP: true,
                    budget: 8000000, engage: 8000000, liquide: 8000000, ordonne: 8000000, paye: 8000000,
                    physique: 100, financier: 100, status: 'realise', planStart: d(2026, 1, 15), planEnd: d(2026, 3, 31), realStart: d(2026, 1, 20), realEnd: d(2026, 3, 28),
                  },
                  {
                    id: 'tac-2', label: 'Analyse et modélisation', type: 'tache', responsable: 'R. FOTSO', isPAP: true,
                    budget: 12000000, engage: 12000000, liquide: 10000000, ordonne: 8000000, paye: 6000000,
                    physique: 70, financier: 83, status: 'en-cours', planStart: d(2026, 4, 1), planEnd: d(2026, 7, 31), realStart: d(2026, 4, 5), isCritical: true,
                  },
                  {
                    id: 'tac-3', label: 'Rapport final et recommandations', type: 'tache', responsable: 'R. FOTSO', isPAP: true,
                    budget: 5000000, engage: 0, liquide: 0, ordonne: 0, paye: 0,
                    physique: 0, financier: 0, status: 'en-retard', planStart: d(2026, 8, 1), planEnd: d(2026, 8, 31), isCritical: true,
                  },
                ],
              },
              {
                id: 'act-1-1-1-2', label: 'Atelier harmonisation fiscale', type: 'activite', responsable: 'M. BELLO', isPAP: true,
                budget: 22000000, engage: 18000000, liquide: 12000000, ordonne: 10000000, paye: 8000000,
                physique: 40, financier: 82, status: 'en-retard', planStart: d(2026, 5, 1), planEnd: d(2026, 7, 31), realStart: d(2026, 5, 20), isCritical: true,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'pil-2', label: 'Pilier 2 — Paix et sécurité', type: 'pilier', responsable: 'SG/CEEAC', isPAP: true,
    budget: 420000000, engage: 180000000, liquide: 140000000, ordonne: 120000000, paye: 95000000,
    physique: 44, financier: 43, status: 'en-cours', planStart: d(2026, 1, 1), planEnd: d(2026, 12, 31),
    children: [
      {
        id: 'axe-2-1', label: 'Axe 2.1 — Prévention conflits', type: 'axe', responsable: 'DSSP', isPAP: true,
        budget: 280000000, engage: 120000000, liquide: 90000000, ordonne: 75000000, paye: 60000000,
        physique: 38, financier: 43, status: 'bloque', planStart: d(2026, 2, 1), planEnd: d(2026, 12, 15), isCritical: true,
      },
    ],
  },
]

// ── Config ─────────────────────────────────────────────────────────────────────
const STATUS_CFG: Record<ItemStatus, { label: string; color: string; bg: string; bar: string }> = {
  'planifie':  { label: 'Planifié',   color: '#6B7280', bg: '#F3F4F6', bar: '#93C5FD' },
  'en-cours':  { label: 'En cours',   color: '#1D4ED8', bg: '#EFF6FF', bar: '#3B82F6' },
  'realise':   { label: 'Réalisé',    color: '#15803D', bg: '#F0FDF4', bar: '#22C55E' },
  'en-retard': { label: 'En retard',  color: '#B91C1C', bg: '#FEF2F2', bar: '#EF4444' },
  'bloque':    { label: 'Bloqué',     color: '#92400E', bg: '#FFFBEB', bar: '#F59E0B' },
  'suspendu':  { label: 'Suspendu',   color: '#6D28D9', bg: '#F5F3FF', bar: '#A78BFA' },
  'annule':    { label: 'Annulé',     color: '#374151', bg: '#F9FAFB', bar: '#D1D5DB' },
}

const TYPE_INDENT: Record<ItemType, number> = {
  pilier: 0, structure: 0, axe: 1, ligne: 1, produit: 2, eb: 2,
  activite: 3, eng: 3, tache: 4, liq: 4, ord: 5, pay: 5,
}

const fmt = (n: number) => n >= 1e9 ? (n / 1e9).toFixed(2) + ' Md' : n >= 1e6 ? (n / 1e6).toFixed(1) + ' M' : (n / 1e3).toFixed(0) + ' K'

// ── Timeline helpers ───────────────────────────────────────────────────────────
const MONTHS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']
const VIEW_START = new Date(2026, 0, 1)
const VIEW_END = new Date(2026, 11, 31)
const TOTAL_DAYS = (VIEW_END.getTime() - VIEW_START.getTime()) / 86400000

const pct = (d: Date) => Math.max(0, Math.min(100, ((d.getTime() - VIEW_START.getTime()) / 86400000 / TOTAL_DAYS) * 100))
const todayPct = pct(today)

// ── Flatten tree ───────────────────────────────────────────────────────────────
type FlatItem = { item: GanttItem; depth: number; open: boolean; hasChildren: boolean }

function flatten(items: GanttItem[], openIds: Set<string>, depth = 0): FlatItem[] {
  const result: FlatItem[] = []
  for (const item of items) {
    const hasChildren = !!(item.children && item.children.length > 0)
    const isOpen = openIds.has(item.id)
    result.push({ item, depth, open: isOpen, hasChildren })
    if (hasChildren && isOpen) {
      result.push(...flatten(item.children!, openIds, depth + 1))
    }
  }
  return result
}

// ── Bar component ──────────────────────────────────────────────────────────────
function GanttBar({ item }: { item: GanttItem }) {
  const cfg = STATUS_CFG[item.status]
  const planL = pct(item.planStart)
  const planW = pct(item.planEnd) - planL
  const realL = item.realStart ? pct(item.realStart) : null
  const realW = item.realEnd ? pct(item.realEnd) - realL! : item.realStart ? todayPct - realL! : null

  return (
    <div className="absolute inset-y-1.5 left-0 right-0">
      {/* Planned bar (background) */}
      <div
        className="absolute h-3 rounded-sm opacity-30"
        style={{ left: `${planL}%`, width: `${planW}%`, background: cfg.bar, top: '50%', transform: 'translateY(-50%)' }}
      />
      {/* Real bar */}
      {realL !== null && realW !== null && (
        <div
          className="absolute h-3.5 rounded"
          style={{ left: `${realL}%`, width: `${Math.max(0.5, realW)}%`, background: cfg.bar, top: '50%', transform: 'translateY(-50%)', minWidth: 4 }}
        >
          {/* Progress fill */}
          <div className="absolute inset-0 rounded overflow-hidden">
            <div className="h-full rounded" style={{ width: `${item.financier}%`, background: cfg.bar, opacity: 0.6 }} />
          </div>
        </div>
      )}
      {/* No real yet, just show plan bar in color */}
      {realL === null && (
        <div
          className="absolute h-3.5 rounded"
          style={{ left: `${planL}%`, width: `${planW}%`, background: cfg.bar, top: '50%', transform: 'translateY(-50%)', opacity: item.status === 'planifie' ? 0.45 : 1 }}
        />
      )}
      {/* Critical marker */}
      {item.isCritical && (
        <div className="absolute top-0 right-0 w-1.5 h-1.5 rounded-full bg-red-500" style={{ top: '25%' }} />
      )}
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function GanttExecution({ onNavigate }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>('gantt')
  const [mode, setMode] = useState<GanttMode>('combined')
  const [openIds, setOpenIds] = useState<Set<string>>(new Set(['str-1', 'str-2', 'pil-1', 'axe-1-1', 'prod-1-1-1', 'act-1-1-1-1', 'pil-2']))
  const [selectedItem, setSelectedItem] = useState<GanttItem | null>(null)
  const [search, setSearch] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [scale, setScale] = useState<Scale>('month')
  const [zoom, setZoom] = useState(100)
  const [showExportModal, setShowExportModal] = useState(false)
  const [exportFormat, setExportFormat] = useState<'PDF' | 'PNG' | 'Excel'>('PDF')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const ganttScrollRef = useRef<HTMLDivElement>(null)

  const toggleOpen = (id: string) => {
    setOpenIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const sourceItems = useMemo(() => {
    if (mode === 'hors-pap') return HORS_PAP
    if (mode === 'pap') return PAP_ITEMS
    return [...PAP_ITEMS, ...HORS_PAP]
  }, [mode])

  const flatItems = useMemo(() => {
    const all = flatten(sourceItems, openIds)
    if (!search) return all
    const q = search.toLowerCase()
    return all.filter(f => f.item.label.toLowerCase().includes(q) || f.item.ref?.toLowerCase().includes(q) || f.item.responsable.toLowerCase().includes(q))
  }, [sourceItems, openIds, search])

  const totalBudget = sourceItems.reduce((s, i) => s + i.budget, 0)
  const totalEngage = sourceItems.reduce((s, i) => s + i.engage, 0)
  const totalPaye = sourceItems.reduce((s, i) => s + i.paye, 0)
  const tauxExec = totalBudget ? Math.round(totalPaye / totalBudget * 100) : 0

  const lateCount = flatItems.filter(f => f.item.status === 'en-retard').length
  const bloqueCount = flatItems.filter(f => f.item.status === 'bloque').length
  const critCount = flatItems.filter(f => f.item.isCritical).length

  const TABS = [
    { id: 'synthese' as TabId, label: 'Vue synthétique' },
    { id: 'execution' as TabId, label: 'Tableau exécution' },
    { id: 'gantt' as TabId, label: 'Gantt d\'exécution' },
    { id: 'ecarts' as TabId, label: 'Analyse des écarts' },
    { id: 'alertes' as TabId, label: 'Alertes' },
    { id: 'historique' as TabId, label: 'Historique' },
  ]

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: '#F0F4FA' }}>
      {/* Header */}
      <div className="px-6 pt-5 pb-3 border-b bg-white" style={{ borderColor: '#E5E9F0' }}>
        <div className="flex items-center justify-between mb-1">
          <div>
            <h1 className="text-[17px] font-bold" style={{ color: '#0B1C3E' }}>Suivi de l'exécution budgétaire</h1>
            <p className="text-[12px] text-gray-500 mt-0.5">Exercice 2026 · Diagramme de Gantt interactif · PAP et HORS PAP</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn btn-outline btn-sm flex items-center gap-1.5" onClick={() => setShowFilters(!showFilters)}>
              <Filter size={13} /> Filtres
            </button>
            <button className="btn btn-outline btn-sm flex items-center gap-1.5" onClick={() => setShowExportModal(true)}>
              <Download size={13} /> Exporter
            </button>
            <button className="btn btn-outline btn-sm flex items-center gap-1.5" onClick={() => { if (document.fullscreenElement) { document.exitFullscreen(); setIsFullscreen(false) } else { document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {}) } }}>
              <Maximize2 size={13} /> {isFullscreen ? 'Quitter' : 'Plein écran'}
            </button>
          </div>
        </div>
        {/* Tabs */}
        <div className="flex gap-1 mt-3 -mb-px overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {TABS.map(t => (
            <button
              key={t.id}
              className={`tab-item whitespace-nowrap ${activeTab === t.id ? 'active' : ''}`}
              onClick={() => setActiveTab(t.id)}
            >
              {t.label}
              {t.id === 'alertes' && lateCount + bloqueCount > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 text-[9px] font-bold rounded-full bg-red-500 text-white">{lateCount + bloqueCount}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* KPI row */}
      <div className="px-6 py-3 grid grid-cols-4 lg:grid-cols-8 gap-3">
        {[
          { label: 'Budget total', value: fmt(totalBudget), icon: <DollarSign size={14} />, color: '#0B1C3E' },
          { label: 'Engagé', value: fmt(totalEngage), icon: <BarChart2 size={14} />, color: '#1A6B3A' },
          { label: 'Payé', value: fmt(totalPaye), icon: <CheckCircle size={14} />, color: '#1D4ED8' },
          { label: 'Taux exécution', value: tauxExec + '%', icon: <Activity size={14} />, color: tauxExec >= 70 ? '#15803D' : '#B91C1C' },
          { label: 'En cours', value: String(flatItems.filter(f => f.item.status === 'en-cours').length), icon: <TrendingUp size={14} />, color: '#1D4ED8' },
          { label: 'Réalisées', value: String(flatItems.filter(f => f.item.status === 'realise').length), icon: <CheckCircle size={14} />, color: '#15803D' },
          { label: 'En retard', value: String(lateCount), icon: <AlertTriangle size={14} />, color: '#B91C1C' },
          { label: 'Bloquées', value: String(bloqueCount), icon: <XCircle size={14} />, color: '#92400E' },
        ].map((k, i) => (
          <div key={i} className="kpi-card" style={{ padding: '10px 12px' }}>
            <div className="flex items-center gap-1.5 mb-1" style={{ color: k.color }}>{k.icon}<span className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">{k.label}</span></div>
            <div className="text-[15px] font-bold" style={{ color: k.color }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Main content */}
      {activeTab === 'gantt' && (
        <div className="flex flex-1 overflow-hidden px-6 pb-4 gap-3 min-h-0">
          {/* Filters drawer */}
          {showFilters && (
            <div className="flex-shrink-0 w-56 card overflow-y-auto" style={{ maxHeight: '100%' }}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[12px] font-bold text-gray-700">Filtres</span>
                <button onClick={() => setShowFilters(false)} className="text-gray-400 hover:text-gray-600"><X size={13} /></button>
              </div>
              {['Exercice', 'Mode PAP', 'Structure', 'Pilier', 'Axe', 'Statut', 'Responsable', 'Source financement'].map(f => (
                <div key={f} className="mb-3">
                  <label className="form-label">{f}</label>
                  <select className="form-input text-[11px] py-1"><option>Tous</option></select>
                </div>
              ))}
            </div>
          )}

          {/* Gantt area */}
          <div className="flex-1 card overflow-hidden flex flex-col min-w-0">
            {/* Toolbar */}
            <div className="flex items-center gap-3 px-4 py-2.5 border-b" style={{ borderColor: '#E5E9F0' }}>
              {/* Mode toggle */}
              <div className="flex rounded-lg overflow-hidden border" style={{ borderColor: '#D1D5DB' }}>
                {[
                  { id: 'hors-pap' as GanttMode, label: 'HORS PAP' },
                  { id: 'combined' as GanttMode, label: 'Consolidé' },
                  { id: 'pap' as GanttMode, label: 'PAP' },
                ].map(m => (
                  <button
                    key={m.id}
                    onClick={() => setMode(m.id)}
                    className="px-3 py-1 text-[11px] font-semibold transition-all"
                    style={{
                      background: mode === m.id ? '#0B1C3E' : 'white',
                      color: mode === m.id ? 'white' : '#374151',
                    }}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="flex-1 flex items-center gap-2 px-2.5 py-1 rounded-lg border bg-white" style={{ borderColor: '#D1D5DB', maxWidth: 280 }}>
                <Search size={13} className="text-gray-400 flex-shrink-0" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher..." className="flex-1 text-[12px] outline-none bg-transparent text-gray-700 placeholder-gray-400" />
              </div>

              {/* Scale */}
              <div className="flex items-center gap-1 ml-auto">
                <span className="text-[11px] text-gray-500 mr-1">Échelle :</span>
                {(['week', 'month', 'quarter'] as Scale[]).map(s => (
                  <button key={s} className={`px-2 py-0.5 text-[10px] font-semibold rounded ${scale === s ? 'bg-navy text-white' : 'text-gray-500 border'}`}
                    style={{ background: scale === s ? '#0B1C3E' : undefined }}
                    onClick={() => setScale(s)}>
                    {s === 'week' ? 'Sem' : s === 'month' ? 'Mois' : 'Trim'}
                  </button>
                ))}
                <button className="ml-1 text-gray-400 hover:text-gray-600" title={`Zoom ${zoom}%`} onClick={() => setZoom(z => Math.min(200, z + 10))}><ZoomIn size={14} /></button>
                <button className="text-gray-400 hover:text-gray-600" title={`Zoom ${zoom}%`} onClick={() => setZoom(z => Math.max(50, z - 10))}><ZoomOut size={14} /></button>
                <button className="ml-1 btn btn-sm btn-outline text-[10px] py-0.5" style={{ fontSize: 10 }} onClick={() => { if (ganttScrollRef.current) { const el = ganttScrollRef.current; el.scrollLeft = Math.max(0, (todayPct / 100) * (el.scrollWidth - el.clientWidth)) } }}>
                  <Calendar size={11} className="inline mr-1" />Auj.
                </button>
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 px-4 py-1.5 border-b text-[10px]" style={{ borderColor: '#E5E9F0', background: '#FAFBFC' }}>
              {Object.entries(STATUS_CFG).map(([k, v]) => (
                <span key={k} className="flex items-center gap-1">
                  <span className="inline-block w-3 h-2 rounded-sm" style={{ background: v.bar }} />
                  <span style={{ color: v.color }}>{v.label}</span>
                </span>
              ))}
              <span className="flex items-center gap-1 ml-auto">
                <span className="inline-block w-2 h-2 rounded-full bg-red-500" />
                <span className="text-gray-500">Chemin critique</span>
              </span>
            </div>

            {/* Gantt body */}
            <div className="flex-1 overflow-auto min-h-0">
              <div className="flex min-w-[900px]">
                {/* Left panel */}
                <div className="flex-shrink-0 sticky left-0 z-10 bg-white" style={{ width: 460, borderRight: '2px solid #E5E9F0' }}>
                  {/* Column headers */}
                  <div className="flex items-center border-b px-2 py-2 bg-gray-50 text-[10px] font-bold uppercase tracking-wide text-gray-500" style={{ borderColor: '#E5E9F0', height: 48 }}>
                    <div className="flex-1 pl-2">Élément / Référence</div>
                    <div className="w-20 text-right pr-2">Budget</div>
                    <div className="w-16 text-right pr-2">Exécuté</div>
                    <div className="w-12 text-center">% Fin.</div>
                    <div className="w-16 text-center">Statut</div>
                  </div>
                  {/* Rows */}
                  {flatItems.map(({ item, depth, open, hasChildren }) => {
                    const cfg = STATUS_CFG[item.status]
                    return (
                      <div
                        key={item.id}
                        className="flex items-center border-b hover:bg-blue-50/50 cursor-pointer transition-colors"
                        style={{ borderColor: '#F0F2F5', height: 36, minHeight: 36 }}
                        onClick={() => setSelectedItem(selectedItem?.id === item.id ? null : item)}
                      >
                        <div className="flex items-center flex-1 min-w-0 px-2" style={{ paddingLeft: 8 + depth * 16 }}>
                          {hasChildren ? (
                            <button
                              className="flex-shrink-0 w-4 h-4 flex items-center justify-center text-gray-400 hover:text-gray-700 mr-1"
                              onClick={e => { e.stopPropagation(); toggleOpen(item.id) }}
                            >
                              {open ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
                            </button>
                          ) : (
                            <span className="flex-shrink-0 w-4 h-4 mr-1" />
                          )}
                          <span className={`truncate text-[11px] ${depth === 0 ? 'font-bold text-gray-800' : depth === 1 ? 'font-semibold text-gray-700' : 'text-gray-600'}`}>
                            {item.ref ? <span className="text-blue-600 mr-1">{item.ref}</span> : null}
                            {item.label}
                          </span>
                          {item.isCritical && <Flag size={9} className="ml-1 flex-shrink-0 text-red-500" />}
                        </div>
                        <div className="w-20 text-right pr-2 text-[10px] font-mono text-gray-600">{fmt(item.budget)}</div>
                        <div className="w-16 text-right pr-2 text-[10px] font-mono text-gray-600">{fmt(item.paye)}</div>
                        <div className="w-12 text-center text-[10px] font-bold" style={{ color: item.financier >= 80 ? '#15803D' : item.financier >= 50 ? '#D97706' : '#B91C1C' }}>
                          {item.financier}%
                        </div>
                        <div className="w-16 flex justify-center">
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold" style={{ background: cfg.bg, color: cfg.color }}>
                            {cfg.label}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Right timeline */}
                <div className="flex-1 overflow-x-auto min-w-0" ref={ganttScrollRef}>
                  <div style={{ minWidth: 600 }}>
                    {/* Month header */}
                    <div className="flex border-b bg-gray-50 relative" style={{ borderColor: '#E5E9F0', height: 48 }}>
                      {MONTHS.map((m, i) => (
                        <div
                          key={m}
                          className="flex-1 text-center text-[10px] font-bold uppercase tracking-wide text-gray-500 flex items-end justify-center pb-1"
                          style={{ borderRight: '1px solid #E5E9F0' }}
                        >
                          {m}
                          <span className="text-gray-400 ml-0.5 font-normal">26</span>
                        </div>
                      ))}
                    </div>

                    {/* Bar rows */}
                    {flatItems.map(({ item }) => (
                      <div
                        key={item.id}
                        className="relative border-b hover:bg-blue-50/30 cursor-pointer"
                        style={{ borderColor: '#F0F2F5', height: 36, minHeight: 36 }}
                        onClick={() => setSelectedItem(selectedItem?.id === item.id ? null : item)}
                      >
                        {/* Month grid lines */}
                        {MONTHS.map((_, i) => (
                          <div
                            key={i}
                            className="absolute inset-y-0"
                            style={{ left: `${(i / 12) * 100}%`, borderLeft: '1px solid #F0F2F5' }}
                          />
                        ))}
                        {/* Today line */}
                        <div
                          className="absolute inset-y-0 w-px z-10"
                          style={{ left: `${todayPct}%`, background: '#EF4444', opacity: 0.8 }}
                        />
                        <GanttBar item={item} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Detail drawer */}
          {selectedItem && (
            <div className="flex-shrink-0 w-72 card overflow-y-auto flex flex-col" style={{ maxHeight: '100%' }}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wide text-gray-500 mb-0.5">{selectedItem.type}</div>
                  <div className="text-[13px] font-bold text-gray-800 leading-tight">{selectedItem.label}</div>
                  {selectedItem.ref && <div className="text-[11px] text-blue-600 mt-0.5">{selectedItem.ref}</div>}
                </div>
                <button onClick={() => setSelectedItem(null)} className="text-gray-400 hover:text-gray-600 flex-shrink-0 mt-0.5"><X size={14} /></button>
              </div>

              {/* Status */}
              <div className="flex items-center gap-2 mb-3 p-2 rounded-lg" style={{ background: STATUS_CFG[selectedItem.status].bg }}>
                <span className="text-[11px] font-bold" style={{ color: STATUS_CFG[selectedItem.status].color }}>{STATUS_CFG[selectedItem.status].label}</span>
                {selectedItem.isCritical && <span className="ml-auto text-[10px] font-bold text-red-600 flex items-center gap-1"><Flag size={9} />Critique</span>}
              </div>

              {/* Identification */}
              <div className="section-title mb-2">Identification</div>
              {[
                ['Responsable', selectedItem.responsable],
                ['Type', selectedItem.isPAP ? 'PAP' : 'HORS PAP'],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between text-[11px] mb-1.5">
                  <span className="text-gray-500">{k}</span><span className="font-semibold text-gray-800">{v}</span>
                </div>
              ))}

              {/* Planning */}
              <div className="section-title mt-3 mb-2">Planning</div>
              {[
                ['Début prévu', selectedItem.planStart.toLocaleDateString('fr-FR')],
                ['Fin prévue', selectedItem.planEnd.toLocaleDateString('fr-FR')],
                ...(selectedItem.realStart ? [['Début réel', selectedItem.realStart.toLocaleDateString('fr-FR')]] : []),
                ...(selectedItem.realEnd ? [['Fin réelle', selectedItem.realEnd.toLocaleDateString('fr-FR')]] : []),
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between text-[11px] mb-1.5">
                  <span className="text-gray-500">{k}</span><span className="font-semibold text-gray-800">{v}</span>
                </div>
              ))}

              {/* Finances */}
              <div className="section-title mt-3 mb-2">Finances</div>
              {[
                ['Budget autorisé', fmt(selectedItem.budget)],
                ['Engagé', fmt(selectedItem.engage)],
                ['Liquidé', fmt(selectedItem.liquide)],
                ['Ordonnancé', fmt(selectedItem.ordonne)],
                ['Payé', fmt(selectedItem.paye)],
                ['Disponible', fmt(selectedItem.budget - selectedItem.engage)],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between text-[11px] mb-1.5">
                  <span className="text-gray-500">{k}</span><span className="font-mono font-semibold text-gray-800">{v} FCFA</span>
                </div>
              ))}

              {/* Physical vs Financial */}
              <div className="section-title mt-3 mb-2">Avancement</div>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-[10px] mb-1"><span className="text-gray-500">Physique</span><span className="font-bold text-gray-700">{selectedItem.physique}%</span></div>
                  <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div className="h-full rounded-full bg-green-500" style={{ width: `${selectedItem.physique}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] mb-1"><span className="text-gray-500">Financier</span><span className="font-bold text-gray-700">{selectedItem.financier}%</span></div>
                  <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div className="h-full rounded-full bg-blue-500" style={{ width: `${selectedItem.financier}%` }} />
                  </div>
                </div>
                {Math.abs(selectedItem.financier - selectedItem.physique) > 15 && (
                  <div className="p-2 rounded-lg text-[10px] font-semibold flex items-center gap-1.5" style={{ background: '#FEF2F2', color: '#B91C1C' }}>
                    <AlertTriangle size={11} />
                    Écart physique-financier : {selectedItem.financier - selectedItem.physique > 0 ? '+' : ''}{selectedItem.financier - selectedItem.physique} pts
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="mt-4 space-y-1.5">
                <button className="btn btn-primary btn-sm w-full text-[11px]" onClick={() => onNavigate('eb-list')}>Voir la chaîne de dépense</button>
                <button className="btn btn-outline btn-sm w-full text-[11px]" onClick={() => onNavigate('workflow-list')}>Voir le workflow</button>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'synthese' && (
        <div className="flex-1 overflow-auto px-6 py-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="card col-span-2">
              <div className="section-title mb-4">Vue d'ensemble — Exercice 2026</div>
              <div className="space-y-4">
                {[
                  { label: 'PAP', physique: 58, financier: 63, color: '#1A6B3A' },
                  { label: 'HORS PAP', physique: 65, financier: 72, color: '#0B1C3E' },
                  { label: 'Consolidé', physique: 61, financier: 67, color: '#D4A017' },
                ].map(r => (
                  <div key={r.label}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[12px] font-bold" style={{ color: r.color }}>{r.label}</span>
                      <span className="text-[11px] text-gray-500">Physique {r.physique}% · Financier {r.financier}%</span>
                    </div>
                    <div className="h-3 rounded-full bg-gray-100 overflow-hidden relative">
                      <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${r.physique}%`, background: r.color, opacity: 0.4 }} />
                      <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${r.financier}%`, background: r.color, opacity: 0.85 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="card">
              <div className="section-title mb-3">Répartition par statut</div>
              <div className="space-y-2">
                {Object.entries(STATUS_CFG).map(([k, v]) => {
                  const count = flatItems.filter(f => f.item.status === k).length
                  return (
                    <div key={k} className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: v.bar }} />
                      <span className="text-[11px] text-gray-600 flex-1">{v.label}</span>
                      <span className="text-[11px] font-bold text-gray-800">{count}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'alertes' && (
        <div className="flex-1 overflow-auto px-6 py-4 space-y-3">
          {lateCount > 0 && (
            <div className="card border-l-4 border-red-500">
              <div className="flex items-start gap-3">
                <AlertTriangle className="text-red-500 flex-shrink-0 mt-0.5" size={18} />
                <div>
                  <div className="text-[13px] font-bold text-red-700">Retard critique</div>
                  <div className="text-[12px] text-red-600 mt-0.5">{lateCount} opération(s) ont dépassé leur date prévue de fin.</div>
                  <div className="mt-2 space-y-1">
                    {flatItems.filter(f => f.item.status === 'en-retard').map(f => (
                      <div key={f.item.id} className="text-[11px] flex items-center gap-2">
                        <span className="text-red-400">—</span>
                        <button className="text-red-700 font-semibold hover:underline" onClick={() => { setSelectedItem(f.item); setActiveTab('gantt') }}>{f.item.label}</button>
                        <span className="text-gray-500">· {f.item.responsable}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          {bloqueCount > 0 && (
            <div className="card border-l-4 border-amber-500">
              <div className="flex items-start gap-3">
                <Pause className="text-amber-500 flex-shrink-0 mt-0.5" size={18} />
                <div>
                  <div className="text-[13px] font-bold text-amber-700">Blocage financier</div>
                  <div className="text-[12px] text-amber-600 mt-0.5">{bloqueCount} opération(s) sont bloquées et requièrent une action.</div>
                </div>
              </div>
            </div>
          )}
          {critCount > 0 && (
            <div className="card border-l-4 border-red-700">
              <div className="flex items-start gap-3">
                <Flag className="text-red-700 flex-shrink-0 mt-0.5" size={18} />
                <div>
                  <div className="text-[13px] font-bold text-red-800">Chemin critique</div>
                  <div className="text-[12px] text-red-700 mt-0.5">{critCount} élément(s) sur le chemin critique présentent des risques pour l'atteinte des résultats.</div>
                </div>
              </div>
            </div>
          )}
          {flatItems.filter(f => Math.abs(f.item.financier - f.item.physique) > 15).length > 0 && (
            <div className="card border-l-4 border-purple-500">
              <div className="flex items-start gap-3">
                <Activity className="text-purple-500 flex-shrink-0 mt-0.5" size={18} />
                <div>
                  <div className="text-[13px] font-bold text-purple-700">Écart physique-financier</div>
                  <div className="text-[12px] text-purple-600 mt-0.5">
                    {flatItems.filter(f => Math.abs(f.item.financier - f.item.physique) > 15).length} activité(s) présentent un écart supérieur à 15 points entre exécution financière et physique.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Export modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(11,28,62,0.55)' }}>
          <div className="bg-white rounded-xl shadow-2xl p-6 w-80">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[14px] font-bold" style={{ color: '#0B1C3E' }}>Exporter le Gantt</span>
              <button onClick={() => setShowExportModal(false)} className="text-gray-400 hover:text-gray-600"><X size={15} /></button>
            </div>
            <div className="space-y-2 mb-4">
              {(['PDF', 'PNG', 'Excel'] as const).map(f => (
                <label key={f} className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors hover:bg-blue-50"
                  style={{ borderColor: exportFormat === f ? '#1D4ED8' : '#E5E9F0', background: exportFormat === f ? '#EFF6FF' : 'white' }}>
                  <input type="radio" name="exportFormat" value={f} checked={exportFormat === f} onChange={() => setExportFormat(f)} className="accent-blue-600" />
                  <span className="text-[13px] font-medium text-gray-700">{f === 'PDF' ? 'PDF — Document imprimable' : f === 'PNG' ? 'PNG — Image haute résolution' : 'Excel — Données tabulaires'}</span>
                </label>
              ))}
            </div>
            <div className="flex gap-2">
              <button className="btn btn-primary btn-sm flex-1 flex items-center justify-center gap-1.5" onClick={() => setShowExportModal(false)}>
                <Download size={13} />Télécharger ({exportFormat})
              </button>
              <button className="btn btn-outline btn-sm" onClick={() => setShowExportModal(false)}>Annuler</button>
            </div>
          </div>
        </div>
      )}

      {(activeTab === 'execution' || activeTab === 'ecarts' || activeTab === 'historique') && (
        <div className="flex-1 overflow-auto px-6 py-4">
          <div className="card">
            <table className="data-table w-full">
              <thead>
                <tr>
                  <th>Élément</th>
                  <th>Responsable</th>
                  <th className="text-right">Budget</th>
                  <th className="text-right">Engagé</th>
                  <th className="text-right">Payé</th>
                  <th className="text-center">% Phys.</th>
                  <th className="text-center">% Fin.</th>
                  <th className="text-center">Écart</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {flatItems.filter(f => !f.item.children || f.item.children.length === 0).map(({ item }) => {
                  const ecart = item.financier - item.physique
                  const cfg = STATUS_CFG[item.status]
                  return (
                    <tr key={item.id}>
                      <td className="font-medium text-[11px]">{item.label}</td>
                      <td className="text-gray-500 text-[11px]">{item.responsable}</td>
                      <td className="text-right font-mono text-[11px]">{fmt(item.budget)}</td>
                      <td className="text-right font-mono text-[11px]">{fmt(item.engage)}</td>
                      <td className="text-right font-mono text-[11px]">{fmt(item.paye)}</td>
                      <td className="text-center text-[11px] font-bold" style={{ color: item.physique >= 70 ? '#15803D' : '#B91C1C' }}>{item.physique}%</td>
                      <td className="text-center text-[11px] font-bold" style={{ color: item.financier >= 70 ? '#15803D' : '#B91C1C' }}>{item.financier}%</td>
                      <td className="text-center text-[11px] font-bold" style={{ color: Math.abs(ecart) > 15 ? '#B91C1C' : '#374151' }}>
                        {ecart > 0 ? '+' : ''}{ecart}
                      </td>
                      <td><span className="badge text-[9px]" style={{ background: cfg.bg, color: cfg.color }}>{cfg.label}</span></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
