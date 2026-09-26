import { useState, useMemo } from 'react'
import {
  Target, Calendar, FileText, BarChart2, CheckCircle, AlertTriangle,
  Clock, ChevronRight, Download, Plus, Search, Filter, X,
  Users, TrendingUp, Layers, ArrowRight, RefreshCw,
  CheckSquare, XCircle, AlertCircle, Lock,
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts'
import type { Page } from '../types'

// ── Types ─────────────────────────────────────────────────────────────────────
type CampagneStatus =
  | 'BROUILLON' | 'PLANIFIEE' | 'OUVERTE' | 'COLLECTE'
  | 'CONSOLIDATION' | 'ARBITRAGE' | 'VALIDATION' | 'APPROUVEE' | 'CLOTUREE'

type PropositionStatus =
  | 'BROUILLON' | 'SOUMIS' | 'VALIDATION_N' | 'VALIDATION_N1'
  | 'CONSOLIDATION' | 'ARBITRAGE' | 'RETENU' | 'RETOURNE' | 'REJETE'

type Priorite = 'CRITIQUE' | 'TRES_HAUTE' | 'HAUTE' | 'MOYENNE' | 'FAIBLE'

interface Campagne {
  id: string
  code: string
  libelle: string
  exercice: number
  status: CampagneStatus
  dateOuverture: string
  dateLimiteSaisie: string
  dateLimiteSubmission: string
  dateApprobationPrevue: string
  responsable: string
  montantDemande: number
  montantArbitre: number
  montantRetenu: number
  ressources: number
  nbPropositions: number
  nbValidees: number
  nbRetournees: number
}

interface Proposition {
  id: string
  reference: string
  campagneId: string
  exercice: number
  structure: string
  initiateur: string
  objet: string
  description: string
  justification: string
  nature: 'FONCTIONNEMENT' | 'PAP'
  priorite: Priorite
  status: PropositionStatus
  montantEstime: number
  montantArbitre?: number
  montantRetenu?: number
  partCEEAC: number
  partPTF: number
  pilier?: string
  axe?: string
  produit?: string
  activite?: string
  dateCreation: string
  scorePriorite: number
}

interface Arbitrage {
  propositionRef: string
  objet: string
  structure: string
  montantDemande: number
  plafond: number
  propositionBudget: number
  montantArbitre: number
  montantRetenu: number
  ecart: number
  niveau: 'TECHNIQUE' | 'ADMINISTRATIF' | 'INSTITUTIONNEL'
  arbitre: string
  date: string
  motif: string
}

// ── Mock data ──────────────────────────────────────────────────────────────────
const CAMPAGNES: Campagne[] = [
  {
    id: 'C-2027', code: 'CAMP-2027', libelle: 'Préparation Budget 2027',
    exercice: 2027, status: 'COLLECTE',
    dateOuverture: '2026-07-01', dateLimiteSaisie: '2026-09-15',
    dateLimiteSubmission: '2026-09-30', dateApprobationPrevue: '2026-11-30',
    responsable: 'Direction des Finances et du Budget',
    montantDemande: 12_450_000_000, montantArbitre: 10_200_000_000, montantRetenu: 9_800_000_000,
    ressources: 10_500_000_000, nbPropositions: 87, nbValidees: 54, nbRetournees: 8,
  },
  {
    id: 'C-2026', code: 'CAMP-2026', libelle: 'Préparation Budget 2026',
    exercice: 2026, status: 'APPROUVEE',
    dateOuverture: '2025-07-01', dateLimiteSaisie: '2025-09-15',
    dateLimiteSubmission: '2025-09-30', dateApprobationPrevue: '2025-11-30',
    responsable: 'Direction des Finances et du Budget',
    montantDemande: 11_900_000_000, montantArbitre: 10_100_000_000, montantRetenu: 9_600_000_000,
    ressources: 10_200_000_000, nbPropositions: 79, nbValidees: 79, nbRetournees: 5,
  },
  {
    id: 'C-2025', code: 'CAMP-2025', libelle: 'Préparation Budget 2025',
    exercice: 2025, status: 'CLOTUREE',
    dateOuverture: '2024-07-01', dateLimiteSaisie: '2024-09-15',
    dateLimiteSubmission: '2024-09-30', dateApprobationPrevue: '2024-11-30',
    responsable: 'Direction des Finances et du Budget',
    montantDemande: 11_200_000_000, montantArbitre: 9_800_000_000, montantRetenu: 9_400_000_000,
    ressources: 9_800_000_000, nbPropositions: 73, nbValidees: 73, nbRetournees: 3,
  },
]

const PROPOSITIONS: Proposition[] = [
  {
    id: 'P001', reference: 'PROP-2027-001', campagneId: 'C-2027', exercice: 2027,
    structure: 'Direction des Affaires Politiques', initiateur: 'Jean-Marie OKORO',
    objet: 'Mission régionale de médiation — Bassin du Congo',
    description: 'Organisation de 3 missions de médiation dans les États membres',
    justification: 'Renforcement de la paix régionale — Pilier I PREF-CEEAC',
    nature: 'PAP', priorite: 'CRITIQUE', status: 'VALIDATION_N1',
    montantEstime: 180_000_000, partCEEAC: 108_000_000, partPTF: 72_000_000,
    pilier: 'Paix et Sécurité', axe: 'Prévention des conflits',
    produit: 'Mécanisme de médiation opérationnel',
    activite: 'Missions de médiation régionale', dateCreation: '2026-08-10', scorePriorite: 92,
  },
  {
    id: 'P002', reference: 'PROP-2027-002', campagneId: 'C-2027', exercice: 2027,
    structure: 'Département des Ressources Humaines', initiateur: 'Sophie MBEKA',
    objet: 'Renouvellement des équipements informatiques — 2027',
    description: 'Acquisition de 45 postes de travail et 12 serveurs',
    justification: 'Obsolescence du parc matériel — durée de vie dépassée',
    nature: 'FONCTIONNEMENT', priorite: 'HAUTE', status: 'SOUMIS',
    montantEstime: 75_000_000, partCEEAC: 75_000_000, partPTF: 0,
    dateCreation: '2026-08-15', scorePriorite: 74,
  },
  {
    id: 'P003', reference: 'PROP-2027-003', campagneId: 'C-2027', exercice: 2027,
    structure: 'Direction de l\'Intégration Économique', initiateur: 'Paul NGUEMBE',
    objet: 'Atelier régional harmonisation fiscale',
    description: 'Organisation d\'un atelier de 5 jours réunissant les 11 États membres',
    justification: 'Mise en œuvre de la feuille de route fiscale CEEAC 2025-2030',
    nature: 'PAP', priorite: 'HAUTE', status: 'RETENU',
    montantEstime: 95_000_000, montantArbitre: 88_000_000, montantRetenu: 85_000_000,
    partCEEAC: 57_000_000, partPTF: 38_000_000,
    pilier: 'Intégration économique', axe: 'Facilitation des échanges',
    produit: 'Cadre fiscal harmonisé', activite: 'Ateliers techniques régionaux',
    dateCreation: '2026-08-12', scorePriorite: 85,
  },
  {
    id: 'P004', reference: 'PROP-2027-004', campagneId: 'C-2027', exercice: 2027,
    structure: 'Département Administration Générale', initiateur: 'Alice NZINGA',
    objet: 'Location bureaux — exercice 2027',
    description: 'Renouvellement bail immobilier siège CEEAC',
    justification: 'Dépense récurrente obligatoire',
    nature: 'FONCTIONNEMENT', priorite: 'CRITIQUE', status: 'ARBITRAGE',
    montantEstime: 420_000_000, montantArbitre: 420_000_000,
    partCEEAC: 420_000_000, partPTF: 0,
    dateCreation: '2026-08-05', scorePriorite: 95,
  },
  {
    id: 'P005', reference: 'PROP-2027-005', campagneId: 'C-2027', exercice: 2027,
    structure: 'Direction Suivi-Évaluation', initiateur: 'Marc DIALLO',
    objet: 'Développement système de reporting BI',
    description: 'Acquisition et déploiement d\'une solution BI régionale',
    justification: 'Modernisation du dispositif de suivi de performance',
    nature: 'PAP', priorite: 'MOYENNE', status: 'RETOURNE',
    montantEstime: 250_000_000, partCEEAC: 125_000_000, partPTF: 125_000_000,
    pilier: 'Gouvernance', axe: 'Modernisation institutionnelle',
    produit: 'Système d\'information intégré', activite: 'Déploiement BI régionale',
    dateCreation: '2026-08-18', scorePriorite: 62,
  },
  {
    id: 'P006', reference: 'PROP-2027-006', campagneId: 'C-2027', exercice: 2027,
    structure: 'Direction des Affaires Juridiques', initiateur: 'Claire EYINGA',
    objet: 'Formation personnel — droit international',
    description: '3 sessions de formation spécialisée',
    justification: 'Renforcement des capacités juridiques institutionnelles',
    nature: 'FONCTIONNEMENT', priorite: 'MOYENNE', status: 'BROUILLON',
    montantEstime: 45_000_000, partCEEAC: 45_000_000, partPTF: 0,
    dateCreation: '2026-09-01', scorePriorite: 58,
  },
]

const ARBITRAGES: Arbitrage[] = [
  {
    propositionRef: 'PROP-2027-003', objet: 'Atelier régional harmonisation fiscale',
    structure: 'Direction de l\'Intégration Économique',
    montantDemande: 95_000_000, plafond: 90_000_000, propositionBudget: 90_000_000,
    montantArbitre: 88_000_000, montantRetenu: 85_000_000,
    ecart: -10_000_000, niveau: 'TECHNIQUE',
    arbitre: 'Dir. Budget — M. OSSOMBA', date: '2026-09-05',
    motif: 'Coûts de logistique réduits suite à la négociation hôtelière — enveloppe réduite de 10 MXF',
  },
  {
    propositionRef: 'PROP-2027-004', objet: 'Location bureaux — exercice 2027',
    structure: 'Département Administration Générale',
    montantDemande: 420_000_000, plafond: 450_000_000, propositionBudget: 420_000_000,
    montantArbitre: 420_000_000, montantRetenu: 420_000_000,
    ecart: 0, niveau: 'ADMINISTRATIF',
    arbitre: 'SG — Mme OKONKWO', date: '2026-09-06',
    motif: 'Montant retenu conforme au bail signé — dépense incompressible',
  },
]

const BY_STRUCTURE = [
  { name: 'Aff. Politiques', demande: 180, retenu: 180 },
  { name: 'Admin. Générale', demande: 420, retenu: 420 },
  { name: 'Intég. Écon.', demande: 95, retenu: 85 },
  { name: 'RH', demande: 75, retenu: 65 },
  { name: 'S&E', demande: 250, retenu: 0 },
  { name: 'Aff. Juridiques', demande: 45, retenu: 0 },
]

const PAP_VS_FONCT = [{ name: 'PAP', value: 6_800_000_000 }, { name: 'Fonctionnement', value: 5_650_000_000 }]
const CEEAC_PTF = [{ name: 'CEEAC', value: 7_200_000_000 }, { name: 'PTF', value: 5_250_000_000 }]

// ── Helpers ────────────────────────────────────────────────────────────────────
const fmt = (n: number) => new Intl.NumberFormat('fr-FR').format(n)
const fmtM = (n: number) => `${fmt(Math.round(n / 1_000_000))} M XAF`

const CAMP_STATUS_CFG: Record<CampagneStatus, { label: string; color: string; bg: string }> = {
  BROUILLON:      { label: 'Brouillon',      color: '#6B7280', bg: '#F1F5F9' },
  PLANIFIEE:      { label: 'Planifiée',      color: '#2563EB', bg: '#DBEAFE' },
  OUVERTE:        { label: 'Ouverte',        color: '#16A34A', bg: '#DCFCE7' },
  COLLECTE:       { label: 'Collecte',       color: '#D97706', bg: '#FEF3C7' },
  CONSOLIDATION:  { label: 'Consolidation',  color: '#7C3AED', bg: '#F3E8FF' },
  ARBITRAGE:      { label: 'Arbitrage',      color: '#0E7490', bg: '#CFFAFE' },
  VALIDATION:     { label: 'Validation',     color: '#1A6B3A', bg: '#BBF7D0' },
  APPROUVEE:      { label: 'Approuvée',      color: '#065F46', bg: '#6EE7B7' },
  CLOTUREE:       { label: 'Clôturée',       color: '#374151', bg: '#E5E7EB' },
}

const PROP_STATUS_CFG: Record<PropositionStatus, { label: string; color: string; bg: string }> = {
  BROUILLON:      { label: 'Brouillon',    color: '#6B7280', bg: '#F1F5F9' },
  SOUMIS:         { label: 'Soumis',       color: '#2563EB', bg: '#DBEAFE' },
  VALIDATION_N:   { label: 'Valid. N',     color: '#D97706', bg: '#FEF3C7' },
  VALIDATION_N1:  { label: 'Valid. N+1',   color: '#7C3AED', bg: '#F3E8FF' },
  CONSOLIDATION:  { label: 'Consol.',      color: '#0E7490', bg: '#CFFAFE' },
  ARBITRAGE:      { label: 'Arbitrage',    color: '#0E7490', bg: '#E0F2FE' },
  RETENU:         { label: 'Retenu',       color: '#065F46', bg: '#D1FAE5' },
  RETOURNE:       { label: 'Retourné',     color: '#92400E', bg: '#FEF3C7' },
  REJETE:         { label: 'Rejeté',       color: '#991B1B', bg: '#FEE2E2' },
}

const PRIORITE_CFG: Record<Priorite, { label: string; color: string; bg: string }> = {
  CRITIQUE:   { label: 'Critique',   color: '#991B1B', bg: '#FEE2E2' },
  TRES_HAUTE: { label: 'Très haute', color: '#92400E', bg: '#FEF3C7' },
  HAUTE:      { label: 'Haute',      color: '#1D4ED8', bg: '#DBEAFE' },
  MOYENNE:    { label: 'Moyenne',    color: '#374151', bg: '#F1F5F9' },
  FAIBLE:     { label: 'Faible',     color: '#6B7280', bg: '#F9FAFB' },
}

const WORKFLOW_STEPS: { label: string; statuses: PropositionStatus[] }[] = [
  { label: 'Brouillon', statuses: ['BROUILLON'] },
  { label: 'Soumis', statuses: ['SOUMIS'] },
  { label: 'Valid. N', statuses: ['VALIDATION_N'] },
  { label: 'Valid. N+1', statuses: ['VALIDATION_N1'] },
  { label: 'Consolidation', statuses: ['CONSOLIDATION'] },
  { label: 'Arbitrage', statuses: ['ARBITRAGE'] },
  { label: 'Retenu', statuses: ['RETENU'] },
]

function StatusBadge({ status }: { status: CampagneStatus }) {
  const cfg = CAMP_STATUS_CFG[status]
  return <span className="badge text-[11px] px-2.5 py-0.5 font-semibold" style={{ background: cfg.bg, color: cfg.color }}>{cfg.label}</span>
}

function PropStatusBadge({ status }: { status: PropositionStatus }) {
  const cfg = PROP_STATUS_CFG[status]
  return <span className="badge text-[11px] px-2 py-0.5 font-semibold" style={{ background: cfg.bg, color: cfg.color }}>{cfg.label}</span>
}

function PrioriteBadge({ priorite }: { priorite: Priorite }) {
  const cfg = PRIORITE_CFG[priorite]
  return <span className="badge text-[11px] px-2 py-0.5" style={{ background: cfg.bg, color: cfg.color }}>{cfg.label}</span>
}

function WorkflowBar({ status }: { status: PropositionStatus }) {
  const currentIdx = WORKFLOW_STEPS.findIndex(s => s.statuses.includes(status))
  return (
    <div className="flex items-center gap-0">
      {WORKFLOW_STEPS.map((step, i) => {
        const done = i < currentIdx
        const active = i === currentIdx
        return (
          <div key={i} className="flex items-center">
            <div className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-semibold
              ${active ? 'text-white' : done ? 'text-green-700' : 'text-gray-400'}`}
              style={{ background: active ? '#0B1C3E' : done ? '#DCFCE7' : '#F1F5F9' }}>
              {done && <CheckCircle size={10} />}
              {step.label}
            </div>
            {i < WORKFLOW_STEPS.length - 1 && (
              <div className={`w-4 h-0.5 ${done || active ? 'bg-green-400' : 'bg-gray-200'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

interface Props {
  onNavigate: (page: Page, id?: string) => void
}

export default function PreparationBudgetaire({ onNavigate: _onNavigate }: Props) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'campagnes' | 'propositions' | 'consolidation' | 'arbitrage' | 'budget'>('dashboard')
  const [selectedProp, setSelectedProp] = useState<Proposition | null>(null)
  const [filterStatus, setFilterStatus] = useState<PropositionStatus | ''>('')
  const [filterNature, setFilterNature] = useState<'PAP' | 'FONCTIONNEMENT' | ''>('')
  const [filterPriorite, setFilterPriorite] = useState<Priorite | ''>('')
  const [search, setSearch] = useState('')
  const [showNewProp, setShowNewProp] = useState(false)
  const [showNewCamp, setShowNewCamp] = useState(false)
  const [newPropSaved, setNewPropSaved] = useState(false)
  const [newCampSaved, setNewCampSaved] = useState(false)
  const [showPdfModal, setShowPdfModal] = useState(false)
  const [pdfOptions, setPdfOptions] = useState({ couverture: true, details: true, annexes: false })
  const [pdfGenerating, setPdfGenerating] = useState(false)
  const [pdfGenerated, setPdfGenerated] = useState(false)

  const activeCampagne = CAMPAGNES[0]

  const filteredProps = useMemo(() => PROPOSITIONS.filter(p => {
    if (filterStatus && p.status !== filterStatus) return false
    if (filterNature && p.nature !== filterNature) return false
    if (filterPriorite && p.priorite !== filterPriorite) return false
    if (search && !p.objet.toLowerCase().includes(search.toLowerCase()) && !p.reference.toLowerCase().includes(search.toLowerCase())) return false
    return true
  }), [filterStatus, filterNature, filterPriorite, search])

  const exportCSV = () => {
    const h = ['Référence', 'Objet', 'Structure', 'Nature', 'Priorité', 'Statut', 'Montant estimé', 'Part CEEAC', 'Part PTF'].join(';')
    const rows = filteredProps.map(p => [p.reference, `"${p.objet}"`, p.structure, p.nature, p.priorite, p.status, p.montantEstime, p.partCEEAC, p.partPTF].join(';'))
    const blob = new Blob([[h, ...rows].join('\n')], { type: 'text/csv;charset=utf-8' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'propositions-2027.csv'; a.click()
  }

  const tabs = [
    { id: 'dashboard', label: 'Tableau de bord', icon: <BarChart2 size={14} /> },
    { id: 'campagnes', label: 'Campagnes', icon: <Calendar size={14} /> },
    { id: 'propositions', label: `Propositions (${PROPOSITIONS.length})`, icon: <FileText size={14} /> },
    { id: 'consolidation', label: 'Consolidation', icon: <Layers size={14} /> },
    { id: 'arbitrage', label: 'Arbitrage', icon: <Target size={14} /> },
    { id: 'budget', label: 'Projet de Budget', icon: <CheckSquare size={14} /> },
  ] as const

  return (
    <div className="flex h-full overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 space-y-5">

          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="section-title text-2xl flex items-center gap-2">
                <Target size={20} style={{ color: '#0B1C3E' }} />
                Préparation et Programmation Budgétaire
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Module 2 — Cycle budgétaire CEEAC · Campagne en cours: <strong>{activeCampagne.libelle}</strong>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={activeCampagne.status} />
              <button className="btn btn-outline btn-sm" onClick={exportCSV}>
                <Download size={13} /> Exporter
              </button>
              <button className="btn btn-primary btn-sm" onClick={() => setShowNewProp(true)}>
                <Plus size={13} /> Nouvelle proposition
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 gap-0 -mt-2">
            {tabs.map(t => (
              <button key={t.id} className={`tab-item flex items-center gap-1.5 ${activeTab === t.id ? 'active' : ''}`}
                onClick={() => setActiveTab(t.id as typeof activeTab)}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          {/* ── DASHBOARD ── */}
          {activeTab === 'dashboard' && (
            <div className="space-y-5">
              {/* Campaign status banner */}
              <div className="card p-4" style={{ background: 'linear-gradient(135deg, #0B1C3E 0%, #1A3A6B 100%)', border: 'none' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-bold text-[15px]">{activeCampagne.libelle}</div>
                    <div className="text-blue-200 text-[12px] mt-0.5">
                      Saisie ouverte jusqu&apos;au <strong className="text-white">{activeCampagne.dateLimiteSaisie}</strong> ·
                      Soumission jusqu&apos;au <strong className="text-white">{activeCampagne.dateLimiteSubmission}</strong>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-[22px] font-bold text-white">{activeCampagne.nbValidees}/{activeCampagne.nbPropositions}</div>
                      <div className="text-[11px] text-blue-200">Propositions validées</div>
                    </div>
                    <div className="text-center">
                      <div className="text-[22px] font-bold text-amber-300">{activeCampagne.nbRetournees}</div>
                      <div className="text-[11px] text-blue-200">Retournées</div>
                    </div>
                    <StatusBadge status={activeCampagne.status} />
                  </div>
                </div>
              </div>

              {/* KPI */}
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: 'Montant demandé', value: fmtM(activeCampagne.montantDemande), color: '#1D4ED8', bg: '#EFF6FF' },
                  { label: 'Montant arbitré', value: fmtM(activeCampagne.montantArbitre), color: '#0E7490', bg: '#ECFEFF' },
                  { label: 'Montant retenu', value: fmtM(activeCampagne.montantRetenu), color: '#065F46', bg: '#ECFDF5' },
                  { label: 'Ressources prévisionnelles', value: fmtM(activeCampagne.ressources), color: '#1A6B3A', bg: '#DCFCE7' },
                ].map((k, i) => (
                  <div key={i} className="card p-4" style={{ borderLeft: `3px solid ${k.color}` }}>
                    <div className="text-[10px] uppercase font-semibold tracking-wider text-gray-400">{k.label}</div>
                    <div className="text-[18px] font-bold mt-1" style={{ color: k.color }}>{k.value}</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: 'Solde prévisionnel', value: fmtM(activeCampagne.ressources - activeCampagne.montantRetenu), color: '#059669' },
                  { label: 'Part CEEAC', value: '58%', color: '#0B1C3E' },
                  { label: 'Part PTF', value: '42%', color: '#7C3AED' },
                  { label: 'Taux programmation PAP', value: '55%', color: '#D97706' },
                ].map((k, i) => (
                  <div key={i} className="card p-3 flex items-center justify-between">
                    <span className="text-[12px] text-gray-500">{k.label}</span>
                    <span className="text-[20px] font-bold" style={{ color: k.color }}>{k.value}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-5">
                {/* Besoins par structure */}
                <div className="card p-4 col-span-2">
                  <div className="text-[12px] font-semibold text-gray-700 mb-3">Demandé vs Retenu par structure (M XAF)</div>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={BY_STRUCTURE} barSize={12}>
                      <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} formatter={(v) => [`${v} M XAF`]} />
                      <Bar dataKey="demande" fill="#BFDBFE" name="Demandé" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="retenu" fill="#0B1C3E" name="Retenu" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* PAP vs Fonct */}
                <div className="card p-4 space-y-4">
                  <div>
                    <div className="text-[12px] font-semibold text-gray-700 mb-2">PAP / Fonctionnement</div>
                    <ResponsiveContainer width="100%" height={100}>
                      <PieChart>
                        <Pie data={PAP_VS_FONCT} dataKey="value" cx="50%" cy="50%" outerRadius={45} innerRadius={25}>
                          <Cell fill="#0B1C3E" />
                          <Cell fill="#1A6B3A" />
                        </Pie>
                        <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} formatter={(v) => [fmtM(v as number)]} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex gap-2 justify-center text-[10.5px]">
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full inline-block" style={{ background: '#0B1C3E' }} />PAP</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full inline-block" style={{ background: '#1A6B3A' }} />Fonct.</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-[12px] font-semibold text-gray-700 mb-2">CEEAC / PTF</div>
                    <ResponsiveContainer width="100%" height={90}>
                      <PieChart>
                        <Pie data={CEEAC_PTF} dataKey="value" cx="50%" cy="50%" outerRadius={40} innerRadius={22}>
                          <Cell fill="#1A6B3A" />
                          <Cell fill="#7C3AED" />
                        </Pie>
                        <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} formatter={(v) => [fmtM(v as number)]} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Calendrier budgétaire */}
              <div className="card overflow-hidden">
                <div className="px-5 py-3 border-b border-gray-100">
                  <span className="font-semibold text-[14px] text-gray-800 flex items-center gap-2">
                    <Calendar size={14} className="text-gray-400" /> Calendrier de la campagne 2027
                  </span>
                </div>
                <div className="grid grid-cols-5 divide-x divide-gray-100">
                  {[
                    { etape: 'Ouverture campagne', date: '01/07/2026', done: true },
                    { etape: 'Collecte propositions', date: '01/07 – 15/09', done: false, current: true },
                    { etape: 'Consolidation', date: '16/09 – 30/09', done: false },
                    { etape: 'Arbitrage', date: '01/10 – 31/10', done: false },
                    { etape: 'Approbation', date: '30/11/2026', done: false },
                  ].map((e, i) => (
                    <div key={i} className={`p-4 ${e.current ? 'bg-amber-50' : ''}`}>
                      <div className={`flex items-center gap-1.5 mb-1 ${e.done ? 'text-green-600' : e.current ? 'text-amber-700 font-semibold' : 'text-gray-400'}`}>
                        {e.done ? <CheckCircle size={13} /> : e.current ? <Clock size={13} /> : <div className="w-3 h-3 rounded-full border-2 border-gray-300" />}
                        <span className="text-[11px] font-semibold">{e.etape}</span>
                      </div>
                      <div className="text-[11px] text-gray-500">{e.date}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── CAMPAGNES ── */}
          {activeTab === 'campagnes' && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button className="btn btn-primary btn-sm" onClick={() => setShowNewCamp(true)}>
                  <Plus size={13} /> Nouvelle campagne
                </button>
              </div>
              <div className="card overflow-hidden">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>Campagne</th>
                      <th>Exercice</th>
                      <th>Statut</th>
                      <th>Propositions</th>
                      <th>Montant demandé</th>
                      <th>Montant retenu</th>
                      <th>Limite saisie</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {CAMPAGNES.map(c => (
                      <tr key={c.id} className="cursor-pointer hover:bg-gray-50" onClick={() => setActiveTab('propositions')}>
                        <td><span className="font-mono text-[12px] font-semibold">{c.code}</span></td>
                        <td><div className="font-medium text-[13px] text-gray-800">{c.libelle}</div></td>
                        <td><span className="font-bold text-[14px]" style={{ color: '#0B1C3E' }}>{c.exercice}</span></td>
                        <td><StatusBadge status={c.status} /></td>
                        <td>
                          <div className="text-[13px]">{c.nbPropositions} propositions</div>
                          <div className="text-[11px] text-green-600">{c.nbValidees} validées</div>
                        </td>
                        <td><span className="amount text-[12.5px]">{fmtM(c.montantDemande)}</span></td>
                        <td><span className="amount text-[12.5px] text-green-700">{fmtM(c.montantRetenu)}</span></td>
                        <td><span className="font-mono text-[12px] text-gray-500">{c.dateLimiteSaisie}</span></td>
                        <td>
                          <ChevronRight size={14} className="text-gray-400" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Orientations stratégiques */}
              <div className="card overflow-hidden">
                <div className="px-5 py-3 border-b border-gray-100">
                  <span className="font-semibold text-[14px] text-gray-800">Orientations stratégiques — PREF-CEEAC 2025-2030</span>
                </div>
                {[
                  { code: 'P1', pilier: 'Paix et Sécurité régionale', budget: 2_800_000_000, pap: true },
                  { code: 'P2', pilier: 'Intégration économique et financière', budget: 3_200_000_000, pap: true },
                  { code: 'P3', pilier: 'Développement humain et social', budget: 1_900_000_000, pap: true },
                  { code: 'P4', pilier: 'Gouvernance et État de droit', budget: 1_450_000_000, pap: true },
                  { code: 'HOF', pilier: 'Fonctionnement institutionnel', budget: 5_650_000_000, pap: false },
                ].map((o, i) => (
                  <div key={i} className="flex items-center px-5 py-3 border-b border-gray-50 hover:bg-gray-50">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[11px] font-bold mr-4 flex-shrink-0"
                      style={{ background: o.pap ? '#EDF2FB' : '#F1F5F9', color: o.pap ? '#0B1C3E' : '#374151' }}>{o.code}</div>
                    <div className="flex-1">
                      <div className="font-medium text-[13px] text-gray-800">{o.pilier}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-[13px]" style={{ color: '#0B1C3E' }}>{fmtM(o.budget)}</div>
                      {o.pap && <div className="text-[10.5px] text-green-600 font-semibold">PAP</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── PROPOSITIONS ── */}
          {activeTab === 'propositions' && (
            <div className="space-y-4">
              {/* Filters toolbar */}
              <div className="flex items-center gap-3 flex-wrap">
                <div className="relative flex-1 max-w-sm">
                  <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input className="form-input pl-9 py-2 text-[13px] w-full" placeholder="Référence, objet…"
                    value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <select className="form-input text-[12.5px] w-auto" value={filterStatus} onChange={e => setFilterStatus(e.target.value as PropositionStatus | '')}>
                  <option value="">Tous statuts</option>
                  {Object.entries(PROP_STATUS_CFG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
                <select className="form-input text-[12.5px] w-auto" value={filterNature} onChange={e => setFilterNature(e.target.value as 'PAP' | 'FONCTIONNEMENT' | '')}>
                  <option value="">PAP + Fonct.</option>
                  <option value="PAP">PAP uniquement</option>
                  <option value="FONCTIONNEMENT">Fonctionnement</option>
                </select>
                <select className="form-input text-[12.5px] w-auto" value={filterPriorite} onChange={e => setFilterPriorite(e.target.value as Priorite | '')}>
                  <option value="">Toutes priorités</option>
                  {Object.entries(PRIORITE_CFG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
                {(filterStatus || filterNature || filterPriorite || search) && (
                  <button className="btn btn-outline btn-sm text-red-500" onClick={() => { setFilterStatus(''); setFilterNature(''); setFilterPriorite(''); setSearch('') }}>
                    <RefreshCw size={11} /> Réinitialiser
                  </button>
                )}
                <div className="ml-auto text-[12px] text-gray-400">{filteredProps.length} résultat(s)</div>
              </div>

              <div className="card overflow-hidden">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Référence</th>
                      <th>Objet</th>
                      <th>Structure</th>
                      <th>Nature</th>
                      <th>Priorité</th>
                      <th>Statut</th>
                      <th>Montant estimé</th>
                      <th>Score</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProps.map(p => (
                      <tr key={p.id} className="cursor-pointer" onClick={() => setSelectedProp(p)}>
                        <td><span className="font-mono text-[12px] font-semibold">{p.reference}</span></td>
                        <td>
                          <div className="font-medium text-[12.5px] text-gray-800 max-w-[220px] truncate">{p.objet}</div>
                          {p.nature === 'PAP' && p.pilier && <div className="text-[11px] text-gray-400 truncate">{p.pilier} → {p.axe}</div>}
                        </td>
                        <td><span className="text-[12px] text-gray-600">{p.structure}</span></td>
                        <td>
                          <span className="badge text-[10.5px] px-2 py-0.5" style={p.nature === 'PAP'
                            ? { background: '#DCFCE7', color: '#166534' }
                            : { background: '#EFF6FF', color: '#1D4ED8' }}>
                            {p.nature === 'PAP' ? 'PAP' : 'Fonct.'}
                          </span>
                        </td>
                        <td><PrioriteBadge priorite={p.priorite} /></td>
                        <td><PropStatusBadge status={p.status} /></td>
                        <td><span className="amount text-[12.5px]">{fmtM(p.montantEstime)}</span></td>
                        <td>
                          <div className="flex items-center gap-1.5">
                            <div className="w-16 h-1.5 rounded-full bg-gray-100">
                              <div className="h-1.5 rounded-full" style={{ width: `${p.scorePriorite}%`, background: p.scorePriorite >= 80 ? '#1A6B3A' : p.scorePriorite >= 60 ? '#D97706' : '#9CA3AF' }} />
                            </div>
                            <span className="text-[11px] text-gray-500 font-mono">{p.scorePriorite}</span>
                          </div>
                        </td>
                        <td><ChevronRight size={13} className="text-gray-400" /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredProps.length === 0 && (
                  <div className="flex flex-col items-center py-12 text-gray-400">
                    <Search size={32} className="mb-2 text-gray-200" />
                    <div className="text-[14px]">Aucune proposition trouvée</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── CONSOLIDATION ── */}
          {activeTab === 'consolidation' && (
            <div className="space-y-4">
              <div className="card p-4" style={{ background: '#FEF3C7', border: '1.5px solid #FDE68A' }}>
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle size={15} className="text-amber-600" />
                  <span className="font-semibold text-amber-800 text-[13.5px]">Phase de consolidation — campagne 2027</span>
                </div>
                <p className="text-[12.5px] text-amber-700">
                  La consolidation regroupe l&apos;ensemble des propositions validées et vérifie leur cohérence avant arbitrage.
                  <strong> 8 propositions</strong> restent en attente de validation.
                </p>
              </div>

              {/* Contrôles automatiques */}
              <div className="card overflow-hidden">
                <div className="px-5 py-3 border-b border-gray-100 font-semibold text-[14px] text-gray-800">Contrôles automatiques de consolidation</div>
                {[
                  { label: 'Propositions sans rattachement RBM (PAP)', value: 2, status: 'WARN' },
                  { label: 'Dépassements de plafonds détectés', value: 0, status: 'OK' },
                  { label: 'Doublons potentiels', value: 1, status: 'WARN' },
                  { label: 'Financements incomplets', value: 3, status: 'WARN' },
                  { label: 'Propositions sans responsable renseigné', value: 0, status: 'OK' },
                  { label: 'Totaux budget équilibrés', value: null, status: 'OK' },
                  { label: 'Ressources vs Dépenses retenues', value: null, status: 'OK' },
                ].map((ctrl, i) => (
                  <div key={i} className="flex items-center justify-between px-5 py-3 border-b border-gray-50">
                    <div className="flex items-center gap-3">
                      {ctrl.status === 'OK'
                        ? <CheckCircle size={15} className="text-green-500" />
                        : <AlertCircle size={15} className="text-amber-500" />}
                      <span className="text-[13px] text-gray-700">{ctrl.label}</span>
                    </div>
                    <div>
                      {ctrl.value !== null
                        ? <span className={`font-bold text-[14px] ${ctrl.value > 0 ? 'text-amber-600' : 'text-green-600'}`}>{ctrl.value}</span>
                        : <span className="text-[12px] font-semibold text-green-600">OK</span>}
                    </div>
                  </div>
                ))}
              </div>

              {/* Synthèse consolidée */}
              <div className="card overflow-hidden">
                <div className="px-5 py-3 border-b border-gray-100 font-semibold text-[14px] text-gray-800">Synthèse consolidée par structure</div>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Structure</th>
                      <th>Propositions</th>
                      <th>PAP</th>
                      <th>Fonctionnement</th>
                      <th>Plafond alloué</th>
                      <th>Montant demandé</th>
                      <th>Écart</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { structure: 'Direction des Affaires Politiques', nb: 3, pap: 325_000_000, fonct: 42_000_000, plafond: 400_000_000, demande: 367_000_000 },
                      { structure: 'Département Administration Générale', nb: 5, pap: 0, fonct: 520_000_000, plafond: 560_000_000, demande: 520_000_000 },
                      { structure: 'Direction de l\'Intég. Économique', nb: 4, pap: 210_000_000, fonct: 35_000_000, plafond: 280_000_000, demande: 245_000_000 },
                      { structure: 'Département Ressources Humaines', nb: 2, pap: 0, fonct: 95_000_000, plafond: 100_000_000, demande: 95_000_000 },
                    ].map((row, i) => {
                      const total = row.pap + row.fonct
                      const ecart = row.demande - row.plafond
                      return (
                        <tr key={i}>
                          <td className="font-medium text-[12.5px] text-gray-800">{row.structure}</td>
                          <td className="text-center font-bold">{row.nb}</td>
                          <td><span className="amount text-[12px]">{fmtM(row.pap)}</span></td>
                          <td><span className="amount text-[12px]">{fmtM(row.fonct)}</span></td>
                          <td><span className="amount font-bold text-[12px]">{fmtM(row.plafond)}</span></td>
                          <td><span className="amount text-[12px]">{fmtM(total)}</span></td>
                          <td>
                            <span className={`font-mono text-[12px] font-semibold ${ecart > 0 ? 'text-red-600' : 'text-green-600'}`}>
                              {ecart > 0 ? '+' : ''}{fmtM(ecart)}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── ARBITRAGE ── */}
          {activeTab === 'arbitrage' && (
            <div className="space-y-4">
              <div className="card p-3" style={{ background: '#ECFEFF', border: '1.5px solid #A5F3FC' }}>
                <div className="text-[12.5px] text-cyan-800 flex items-center gap-2">
                  <Target size={14} className="text-cyan-600" />
                  <span>Centre d&apos;arbitrage — Niveau technique (Direction du Budget). <strong>2 arbitrages réalisés</strong> · Arbitrages institutionnels en attente.</span>
                </div>
              </div>

              {ARBITRAGES.map((arb, i) => (
                <div key={i} className="card overflow-hidden">
                  <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[12px] text-gray-500">{arb.propositionRef}</span>
                      <span className="font-semibold text-[14px] text-gray-800">{arb.objet}</span>
                      <span className="badge text-[10.5px] px-2 py-0.5" style={{ background: '#DBEAFE', color: '#1D4ED8' }}>{arb.niveau}</span>
                    </div>
                    <div className="text-[12px] text-gray-500">{arb.arbitre} · {arb.date}</div>
                  </div>
                  <div className="p-5">
                    <div className="grid grid-cols-6 gap-4 text-center mb-4">
                      {[
                        { label: 'Demandé', value: arb.montantDemande, color: '#374151' },
                        { label: 'Plafond', value: arb.plafond, color: '#D97706' },
                        { label: 'Prop. Budget', value: arb.propositionBudget, color: '#0E7490' },
                        { label: 'Arbitré', value: arb.montantArbitre, color: '#1D4ED8' },
                        { label: 'Retenu', value: arb.montantRetenu, color: '#065F46' },
                        { label: 'Écart', value: arb.ecart, color: arb.ecart < 0 ? '#991B1B' : '#065F46' },
                      ].map((col, j) => (
                        <div key={j} className="p-3 rounded-lg" style={{ background: '#F8FAFC' }}>
                          <div className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">{col.label}</div>
                          <div className="font-mono font-bold text-[13px]" style={{ color: col.color }}>
                            {col.value < 0 ? '-' : ''}{fmtM(Math.abs(col.value))}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg" style={{ background: '#FFFBEB', border: '1px solid #FDE68A' }}>
                      <FileText size={13} className="text-amber-500 flex-shrink-0 mt-0.5" />
                      <div className="text-[12.5px] text-amber-800"><strong>Motif :</strong> {arb.motif}</div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Tableau comparatif */}
              <div className="card overflow-hidden">
                <div className="px-5 py-3 border-b border-gray-100 font-semibold text-[14px] text-gray-800">
                  Tableau comparatif — Demandé → Arbitré → Retenu
                </div>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Structure</th>
                      <th>Demandé</th>
                      <th>Arbitré</th>
                      <th>Retenu</th>
                      <th>Réduction</th>
                      <th>Taux retenu</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { s: 'Aff. Politiques', d: 1_800_000_000, a: 1_650_000_000, r: 1_600_000_000 },
                      { s: 'Admin. Générale', d: 2_400_000_000, a: 2_400_000_000, r: 2_400_000_000 },
                      { s: 'Intég. Économique', d: 950_000_000, a: 880_000_000, r: 850_000_000 },
                      { s: 'Ressources Humaines', d: 600_000_000, a: 520_000_000, r: 500_000_000 },
                    ].map((row, i) => {
                      const reduction = row.d - row.r
                      const taux = Math.round((row.r / row.d) * 100)
                      return (
                        <tr key={i}>
                          <td className="font-medium text-[12.5px]">{row.s}</td>
                          <td><span className="amount text-[12px]">{fmtM(row.d)}</span></td>
                          <td><span className="amount text-[12px] text-blue-700">{fmtM(row.a)}</span></td>
                          <td><span className="amount text-[12px] text-green-700">{fmtM(row.r)}</span></td>
                          <td><span className="font-mono text-[12px] text-red-600">-{fmtM(reduction)}</span></td>
                          <td>
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-1.5 rounded-full bg-gray-100">
                                <div className="h-1.5 rounded-full bg-green-500" style={{ width: `${taux}%` }} />
                              </div>
                              <span className="text-[12px] font-semibold text-green-700">{taux}%</span>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── PROJET DE BUDGET ── */}
          {activeTab === 'budget' && (
            <div className="space-y-4">
              <div className="card p-4" style={{ background: '#F0FDF4', border: '1.5px solid #BBF7D0' }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-600" />
                    <span className="font-semibold text-green-800 text-[13.5px]">Projet de Budget 2027 — Version consolidée après arbitrage</span>
                  </div>
                  <button className="btn btn-outline btn-sm flex items-center gap-1.5" onClick={() => { setShowPdfModal(true); setPdfGenerated(false) }}>
                    <Download size={13} /> Générer PDF
                  </button>
                </div>
              </div>

              {/* Contrôles avant génération */}
              <div className="card overflow-hidden">
                <div className="px-5 py-3 border-b border-gray-100 font-semibold text-[14px] text-gray-800">Contrôles avant basculement vers Gestion du Budget</div>
                {[
                  { check: 'Campagne validée', ok: true },
                  { check: 'Arbitrages terminés', ok: false },
                  { check: 'Lignes budgétaires cohérentes', ok: true },
                  { check: 'PAP complet', ok: true },
                  { check: 'Financements CEEAC/PTF renseignés', ok: false },
                  { check: 'Totaux équilibrés', ok: true },
                  { check: 'Anomalies bloquantes résolues', ok: false },
                ].map((ctrl, i) => (
                  <div key={i} className="flex items-center gap-3 px-5 py-2.5 border-b border-gray-50">
                    {ctrl.ok
                      ? <CheckCircle size={15} className="text-green-500 flex-shrink-0" />
                      : <XCircle size={15} className="text-red-400 flex-shrink-0" />}
                    <span className={`text-[13px] ${ctrl.ok ? 'text-gray-700' : 'text-red-700 font-medium'}`}>{ctrl.check}</span>
                  </div>
                ))}
                <div className="px-5 py-3">
                  <button className="btn btn-primary btn-sm opacity-50 cursor-not-allowed" disabled>
                    <ArrowRight size={13} /> Transférer vers Module Budget
                  </button>
                  <span className="ml-3 text-[12px] text-gray-500">En attente de résolution de 3 points bloquants</span>
                </div>
              </div>

              {/* Synthèse projet budget */}
              <div className="card overflow-hidden">
                <div className="px-5 py-3 border-b border-gray-100 font-semibold text-[14px] text-gray-800">Synthèse — Projet de Budget 2027</div>
                <table className="data-table">
                  <thead>
                    <tr><th>Rubrique</th><th>Nature</th><th>Part CEEAC</th><th>Part PTF</th><th>Total</th></tr>
                  </thead>
                  <tbody>
                    {[
                      { rubrique: 'Paix et Sécurité (PAP)', nature: 'PAP', ceeac: 1_600_000_000, ptf: 1_200_000_000 },
                      { rubrique: 'Intégration économique (PAP)', nature: 'PAP', ceeac: 1_800_000_000, ptf: 1_400_000_000 },
                      { rubrique: 'Développement humain (PAP)', nature: 'PAP', ceeac: 950_000_000, ptf: 950_000_000 },
                      { rubrique: 'Gouvernance (PAP)', nature: 'PAP', ceeac: 800_000_000, ptf: 650_000_000 },
                      { rubrique: 'Fonctionnement institutionnel', nature: 'FONCT', ceeac: 3_050_000_000, ptf: 0 },
                    ].map((row, i) => (
                      <tr key={i} style={i === 4 ? { borderTop: '2px solid #E5E7EB' } : undefined}>
                        <td className="font-medium text-[12.5px]">{row.rubrique}</td>
                        <td>
                          <span className="badge text-[10.5px] px-2" style={row.nature === 'PAP'
                            ? { background: '#DCFCE7', color: '#166534' }
                            : { background: '#EFF6FF', color: '#1D4ED8' }}>
                            {row.nature}
                          </span>
                        </td>
                        <td><span className="amount text-[12px]">{fmtM(row.ceeac)}</span></td>
                        <td><span className="amount text-[12px] text-purple-700">{fmtM(row.ptf)}</span></td>
                        <td><span className="amount font-bold text-[12.5px]">{fmtM(row.ceeac + row.ptf)}</span></td>
                      </tr>
                    ))}
                    <tr className="font-bold" style={{ background: '#0B1C3E' }}>
                      <td style={{ color: 'white' }} colSpan={2}>TOTAL BUDGET 2027</td>
                      <td><span className="amount text-white">8,2 Mrd XAF</span></td>
                      <td><span className="amount text-blue-200">4,2 Mrd XAF</span></td>
                      <td><span className="amount text-white font-bold">12,4 Mrd XAF</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Proposition detail panel ── */}
      {selectedProp && (
        <div className="w-[380px] flex-shrink-0 flex flex-col border-l border-gray-200 bg-white overflow-y-auto">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div>
              <div className="font-bold text-[14px] text-gray-900">Détail proposition</div>
              <div className="font-mono text-[11px] text-gray-400 mt-0.5">{selectedProp.reference}</div>
            </div>
            <button className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-gray-100" onClick={() => setSelectedProp(null)}>
              <X size={14} className="text-gray-400" />
            </button>
          </div>
          <div className="p-5 space-y-5">
            <WorkflowBar status={selectedProp.status} />

            <div className="space-y-3">
              <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Identité</div>
              {[
                { l: 'Structure', v: selectedProp.structure },
                { l: 'Initiateur', v: selectedProp.initiateur },
                { l: 'Exercice', v: selectedProp.exercice.toString() },
                { l: 'Nature', v: selectedProp.nature },
                { l: 'Priorité', v: <PrioriteBadge priorite={selectedProp.priorite} /> },
                { l: 'Statut', v: <PropStatusBadge status={selectedProp.status} /> },
              ].map((r, i) => (
                <div key={i} className="flex justify-between items-start py-1.5 border-b border-gray-50">
                  <span className="text-[12px] text-gray-400 w-24">{r.l}</span>
                  <span className="text-[12px] font-medium text-gray-800 text-right">{r.v}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Objet / Justification</div>
              <div className="text-[12.5px] font-semibold text-gray-800">{selectedProp.objet}</div>
              <div className="text-[12px] text-gray-600">{selectedProp.description}</div>
              <div className="text-[12px] text-gray-500 italic">{selectedProp.justification}</div>
            </div>

            {selectedProp.nature === 'PAP' && selectedProp.pilier && (
              <div className="space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Chaîne RBM/GAR</div>
                {[
                  ['Pilier', selectedProp.pilier],
                  ['Axe', selectedProp.axe],
                  ['Produit', selectedProp.produit],
                  ['Activité', selectedProp.activite],
                ].filter(([, v]) => v).map(([l, v], i) => (
                  <div key={i} className="flex items-start gap-1.5">
                    <span className="text-gray-300 mt-0.5">{'→'.repeat(i)}</span>
                    <span className="text-[11px] text-gray-500 w-14">{l}</span>
                    <span className="text-[12px] font-medium text-gray-700">{v}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Budget</div>
              {[
                { l: 'Montant estimé', v: fmtM(selectedProp.montantEstime), bold: true },
                { l: 'Part CEEAC', v: fmtM(selectedProp.partCEEAC), bold: false },
                { l: 'Part PTF', v: fmtM(selectedProp.partPTF), bold: false },
                ...(selectedProp.montantRetenu ? [{ l: 'Montant retenu', v: fmtM(selectedProp.montantRetenu), bold: true }] : []),
              ].map((r, i) => (
                <div key={i} className="flex justify-between py-1.5 border-b border-gray-50">
                  <span className="text-[12px] text-gray-400">{r.l}</span>
                  <span className={`font-mono text-[12.5px] ${r.bold ? 'font-bold text-gray-800' : 'text-gray-600'}`}>{r.v}</span>
                </div>
              ))}
            </div>

            <div className="space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Score de priorité</div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 rounded-full bg-gray-100">
                  <div className="h-2 rounded-full transition-all" style={{
                    width: `${selectedProp.scorePriorite}%`,
                    background: selectedProp.scorePriorite >= 80 ? '#1A6B3A' : selectedProp.scorePriorite >= 60 ? '#D97706' : '#9CA3AF'
                  }} />
                </div>
                <span className="font-bold text-[16px]" style={{ color: '#0B1C3E' }}>{selectedProp.scorePriorite}/100</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── New Proposition Modal ── */}
      {showNewProp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.4)' }}>
          <div className="bg-white rounded-xl p-6 w-[520px] shadow-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-[16px] text-gray-900">Nouvelle proposition budgétaire</h3>
              <button className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-gray-100" onClick={() => { setShowNewProp(false); setNewPropSaved(false) }}>
                <X size={14} className="text-gray-400" />
              </button>
            </div>
            {newPropSaved ? (
              <div className="flex flex-col items-center gap-3 py-8">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: '#DCFCE7' }}>
                  <CheckCircle size={22} className="text-green-600" />
                </div>
                <div className="font-semibold text-[15px] text-gray-800">Proposition créée</div>
                <div className="text-[13px] text-gray-500 text-center">La proposition a été enregistrée en brouillon. Soumettez-la pour démarrer le circuit de validation.</div>
                <button className="btn btn-outline btn-sm mt-2" onClick={() => { setShowNewProp(false); setNewPropSaved(false) }}>Fermer</button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="form-label">Campagne *</label>
                    <select className="form-input text-[13px]"><option>Préparation Budget 2027</option></select>
                  </div>
                  <div>
                    <label className="form-label">Nature *</label>
                    <select className="form-input text-[13px]">
                      <option value="FONCTIONNEMENT">Fonctionnement</option>
                      <option value="PAP">PAP</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="form-label">Objet *</label>
                  <input className="form-input text-[13px]" placeholder="Intitulé de la proposition…" />
                </div>
                <div>
                  <label className="form-label">Description</label>
                  <textarea className="form-input text-[13px] h-20" placeholder="Description détaillée…" />
                </div>
                <div>
                  <label className="form-label">Justification *</label>
                  <textarea className="form-input text-[13px] h-16" placeholder="Pourquoi cette dépense est-elle nécessaire ?" />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="form-label">Montant estimé (XAF) *</label>
                    <input type="number" className="form-input text-[13px]" placeholder="0" />
                  </div>
                  <div>
                    <label className="form-label">Part CEEAC</label>
                    <input type="number" className="form-input text-[13px]" placeholder="0" />
                  </div>
                  <div>
                    <label className="form-label">Part PTF</label>
                    <input type="number" className="form-input text-[13px]" placeholder="0" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="form-label">Priorité</label>
                    <select className="form-input text-[13px]">
                      <option value="HAUTE">Haute</option>
                      <option value="CRITIQUE">Critique</option>
                      <option value="TRES_HAUTE">Très haute</option>
                      <option value="MOYENNE">Moyenne</option>
                      <option value="FAIBLE">Faible</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Structure</label>
                    <input className="form-input text-[13px]" placeholder="Direction / Département…" />
                  </div>
                </div>
                <div className="flex gap-2 justify-end pt-2">
                  <button className="btn btn-outline btn-sm" onClick={() => setShowNewProp(false)}>Annuler</button>
                  <button className="btn btn-primary btn-sm" onClick={() => setNewPropSaved(true)}>
                    <Plus size={13} /> Créer en brouillon
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── New Campagne Modal ── */}
      {showNewCamp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.4)' }}>
          <div className="bg-white rounded-xl p-6 w-[480px] shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-[16px] text-gray-900">Nouvelle campagne budgétaire</h3>
              <button className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-gray-100" onClick={() => { setShowNewCamp(false); setNewCampSaved(false) }}>
                <X size={14} className="text-gray-400" />
              </button>
            </div>
            {newCampSaved ? (
              <div className="flex flex-col items-center gap-3 py-8">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: '#DCFCE7' }}>
                  <CheckCircle size={22} className="text-green-600" />
                </div>
                <div className="font-semibold text-[15px]">Campagne créée en brouillon</div>
                <button className="btn btn-outline btn-sm mt-2" onClick={() => { setShowNewCamp(false); setNewCampSaved(false) }}>Fermer</button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="form-label">Exercice *</label>
                    <input type="number" className="form-input text-[13px]" defaultValue="2028" />
                  </div>
                  <div>
                    <label className="form-label">Code *</label>
                    <input className="form-input text-[13px]" placeholder="CAMP-2028" />
                  </div>
                </div>
                <div>
                  <label className="form-label">Libellé *</label>
                  <input className="form-input text-[13px]" placeholder="Préparation Budget 2028" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="form-label">Date d&apos;ouverture</label>
                    <input type="date" className="form-input text-[13px]" />
                  </div>
                  <div>
                    <label className="form-label">Limite de saisie</label>
                    <input type="date" className="form-input text-[13px]" />
                  </div>
                  <div>
                    <label className="form-label">Limite de soumission</label>
                    <input type="date" className="form-input text-[13px]" />
                  </div>
                  <div>
                    <label className="form-label">Date d&apos;approbation prévue</label>
                    <input type="date" className="form-input text-[13px]" />
                  </div>
                </div>
                <div>
                  <label className="form-label">Responsable</label>
                  <input className="form-input text-[13px]" defaultValue="Direction des Finances et du Budget" />
                </div>
                <div className="flex gap-2 justify-end pt-2">
                  <button className="btn btn-outline btn-sm" onClick={() => setShowNewCamp(false)}>Annuler</button>
                  <button className="btn btn-primary btn-sm" onClick={() => setNewCampSaved(true)}>
                    <Plus size={13} /> Créer campagne
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Modal: Générer PDF ── */}
      {showPdfModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="font-semibold text-[#0B1C3E] text-base flex items-center gap-2"><Download size={15} /> Générer le PDF</h2>
              <button className="text-gray-400 hover:text-gray-600" onClick={() => setShowPdfModal(false)}><X size={18} /></button>
            </div>
            <div className="p-5 space-y-4">
              <p className="text-[13px] text-gray-600">Sélectionnez les sections à inclure dans le document PDF du Projet de Budget 2027.</p>
              <div className="space-y-2">
                {([
                  { key: 'couverture', label: 'Page de couverture', desc: 'Titre, exercice, date, autorités' },
                  { key: 'details', label: 'Détails par programme', desc: 'Ventilation par pilier, axe et produit' },
                  { key: 'annexes', label: 'Annexes', desc: 'Tableaux de financement PTF et récapitulatifs' },
                ] as const).map(opt => (
                  <label key={opt.key} className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      className="mt-0.5"
                      checked={pdfOptions[opt.key]}
                      onChange={e => setPdfOptions(p => ({ ...p, [opt.key]: e.target.checked }))}
                    />
                    <div>
                      <p className="text-[13px] font-medium text-gray-800">{opt.label}</p>
                      <p className="text-[11px] text-gray-400">{opt.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
              {pdfGenerated && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 border border-green-200">
                  <CheckCircle size={14} className="text-green-600" />
                  <span className="text-[13px] text-green-700 font-medium">PDF généré — Budget_2027_v3.pdf (2,4 Mo)</span>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2 p-5 border-t border-gray-100">
              <button className="btn btn-outline btn-sm" onClick={() => setShowPdfModal(false)}>Fermer</button>
              <button
                className="btn btn-primary btn-sm flex items-center gap-1.5"
                disabled={pdfGenerating}
                onClick={() => {
                  setPdfGenerating(true)
                  setTimeout(() => { setPdfGenerating(false); setPdfGenerated(true) }, 1200)
                }}
              >
                <Download size={13} /> {pdfGenerating ? 'Génération…' : 'Générer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
