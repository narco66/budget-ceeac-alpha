import { useState } from 'react'
import {
  Lock, AlertTriangle, CheckCircle, XCircle, AlertCircle,
  Clock, ChevronRight, Download, Search, FileText, Shield,
  ArrowRight, RefreshCw, Archive, BarChart2, Layers,
  X, CheckSquare,
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts'
import type { Page } from '../types'

// ── Types ─────────────────────────────────────────────────────────────────────
type CampagneClotureStatus =
  | 'PREPARATION' | 'OUVERTE' | 'CONTROLES' | 'CORRECTIONS'
  | 'VALIDATION' | 'PROV_CLOTUREE' | 'DEF_CLOTUREE' | 'ARCHIVEE'

type AnomalieCriticite = 'CRITIQUE' | 'MAJEURE' | 'MINEURE' | 'INFO'

type DossierEtape =
  | 'EB_NON_VALIDEE' | 'ENGAGEMENT_EN_COURS' | 'ENG_NON_LIQUIDE'
  | 'LIQ_NON_ORD' | 'ORD_NON_PAYE' | 'PAIEMENT_NON_RAPPROCHE'

interface CampagneCloture {
  id: string
  exercice: number
  statut: CampagneClotureStatus
  responsable: string
  dateOuverture: string
  dateLimiteSaisie: string
  dateClotureProv: string
  dateClotureDefi: string
  nbControles: number
  nbControlesOK: number
  nbAnomalies: number
  nbAnomaliesCritiques: number
}

interface Anomalie {
  id: string
  regle: string
  criticite: AnomalieCriticite
  dossier: string
  reference: string
  structure: string
  acteur: string
  echeance: string
  statut: 'OUVERTE' | 'EN_COURS' | 'RESOLUE' | 'DEROGATION'
  description: string
}

interface DossierEnCours {
  reference: string
  objet: string
  structure: string
  etape: DossierEtape
  montant: number
  financement: 'CEEAC' | 'PTF' | 'MIXTE'
  acteurResponsable: string
  dernierEvenement: string
  jourInactivite: number
  actionAttendues: string
}

interface ReportCredit {
  id: string
  ligneBudgetaire: string
  objet: string
  montant: number
  exerciceCible: number
  motif: string
  statut: 'PROPOSE' | 'VALIDE' | 'APPROUVE' | 'REJETE'
  dossierLie?: string
}

// ── Mock data ──────────────────────────────────────────────────────────────────
const CAMPAGNE_ACTIVE: CampagneCloture = {
  id: 'CLOT-2026',
  exercice: 2026,
  statut: 'CONTROLES',
  responsable: 'Direction du Budget — M. OSSOMBA',
  dateOuverture: '2026-10-01',
  dateLimiteSaisie: '2026-11-30',
  dateClotureProv: '2026-12-15',
  dateClotureDefi: '2026-12-31',
  nbControles: 28,
  nbControlesOK: 22,
  nbAnomalies: 14,
  nbAnomaliesCritiques: 3,
}

const ANOMALIES: Anomalie[] = [
  {
    id: 'ANO-001', regle: 'RM-02', criticite: 'CRITIQUE',
    dossier: 'Engagement', reference: 'ENG-2026-000087',
    structure: 'Direction des Affaires Politiques',
    acteur: 'Jean-Marie OKORO', echeance: '2026-11-20', statut: 'OUVERTE',
    description: 'Engagement validé sans liquidation depuis 45 jours — montant bloqué de 78 MXAF',
  },
  {
    id: 'ANO-002', regle: 'RM-05', criticite: 'CRITIQUE',
    dossier: 'Paiement', reference: 'PAY-2026-000045',
    structure: 'Agence Comptable',
    acteur: 'Sophie MBEKA', echeance: '2026-11-15', statut: 'EN_COURS',
    description: 'Paiement déclaré exécuté sans référence bancaire ni pièce de rapprochement',
  },
  {
    id: 'ANO-003', regle: 'RM-07', criticite: 'CRITIQUE',
    dossier: 'Workflow', reference: 'EB-2026-000123',
    structure: 'Département RH',
    acteur: 'Alice NZINGA', echeance: '2026-11-25', statut: 'OUVERTE',
    description: 'Transition de validation réalisée par un acteur non habilité — contournement du workflow',
  },
  {
    id: 'ANO-004', regle: 'RGI-03', criticite: 'MAJEURE',
    dossier: 'GED', reference: 'LIQ-2026-000034',
    structure: 'Direction Intégration Économique',
    acteur: 'Paul NGUEMBE', echeance: '2026-11-30', statut: 'EN_COURS',
    description: 'Liquidation sans pièce justificative de service fait dans la GED',
  },
  {
    id: 'ANO-005', regle: 'RB-12', criticite: 'MAJEURE',
    dossier: 'Budget', reference: 'LB-2026-04-110-01',
    structure: 'Direction du Budget',
    acteur: 'Dir. Budget', echeance: '2026-12-01', statut: 'RESOLUE',
    description: 'Crédit consommé à 102% du disponible — dépassement détecté',
  },
  {
    id: 'ANO-006', regle: 'PAP-01', criticite: 'MINEURE',
    dossier: 'PAP', reference: 'ACT-2026-P2-A3',
    structure: 'Direction S&E',
    acteur: 'Marc DIALLO', echeance: '2026-12-05', statut: 'EN_COURS',
    description: 'Activité PAP sans réalisation physique enregistrée au 30/09',
  },
  {
    id: 'ANO-007', regle: 'INF-01', criticite: 'INFO',
    dossier: 'Ordonnancement', reference: 'ORD-2026-000089',
    structure: 'Direction des Finances',
    acteur: 'Claire EYINGA', echeance: '', statut: 'OUVERTE',
    description: 'Ordonnancement transmis à l\'AC depuis 12 jours sans accusé de réception',
  },
]

const DOSSIERS_EN_COURS: DossierEnCours[] = [
  {
    reference: 'ENG-2026-000087', objet: 'Mission régionale de médiation',
    structure: 'Aff. Politiques', etape: 'ENG_NON_LIQUIDE',
    montant: 78_000_000, financement: 'MIXTE',
    acteurResponsable: 'J.-M. OKORO', dernierEvenement: '2026-10-08',
    jourInactivite: 45, actionAttendues: 'Soumettre la liquidation avant le 30/11',
  },
  {
    reference: 'LIQ-2026-000034', objet: 'Atelier harmonisation fiscale',
    structure: 'Intég. Écon.', etape: 'LIQ_NON_ORD',
    montant: 85_000_000, financement: 'PTF',
    acteurResponsable: 'P. NGUEMBE', dernierEvenement: '2026-10-22',
    jourInactivite: 31, actionAttendues: 'Compléter GED puis ordonnancer',
  },
  {
    reference: 'ORD-2026-000089', objet: 'Formation personnel juridique',
    structure: 'Aff. Juridiques', etape: 'ORD_NON_PAYE',
    montant: 45_000_000, financement: 'CEEAC',
    acteurResponsable: 'C. EYINGA', dernierEvenement: '2026-11-01',
    jourInactivite: 12, actionAttendues: 'Prise en charge Agence Comptable',
  },
  {
    reference: 'PAY-2026-000045', objet: 'Loyer bureaux Q4 2026',
    structure: 'Admin. Générale', etape: 'PAIEMENT_NON_RAPPROCHE',
    montant: 105_000_000, financement: 'CEEAC',
    acteurResponsable: 'S. MBEKA', dernierEvenement: '2026-11-05',
    jourInactivite: 8, actionAttendues: 'Rapprochement bancaire + pièces',
  },
]

const REPORTS: ReportCredit[] = [
  {
    id: 'REP-001', ligneBudgetaire: 'LB-2026-04-210-02',
    objet: 'Mission régionale de médiation (reliquat)',
    montant: 24_000_000, exerciceCible: 2027,
    motif: 'Mission reportée au T1 2027 — accord partenaires techniques',
    statut: 'VALIDE', dossierLie: 'ENG-2026-000087',
  },
  {
    id: 'REP-002', ligneBudgetaire: 'LB-2026-04-310-01',
    objet: 'Développement système BI — phase 2',
    montant: 180_000_000, exerciceCible: 2027,
    motif: 'Contrat pluriannuel — engagement à reporter conformément aux règles PTF',
    statut: 'PROPOSE',
  },
  {
    id: 'REP-003', ligneBudgetaire: 'LB-2026-05-120-03',
    objet: 'Équipements réseau salle serveur',
    montant: 35_000_000, exerciceCible: 2027,
    motif: 'Délais de livraison fournisseur reportés à janvier 2027',
    statut: 'APPROUVE',
  },
]

const CONTROLES_CHECKLIST = [
  { categorie: 'Crédits', label: 'Lignes orphelines détectées', ok: true, valeur: '0' },
  { categorie: 'Crédits', label: 'Montants négatifs non autorisés', ok: true, valeur: '0' },
  { categorie: 'Crédits', label: 'Crédits consommés au-delà du disponible', ok: false, valeur: '1' },
  { categorie: 'Workflow', label: 'Dossiers sans validation complète', ok: false, valeur: '3' },
  { categorie: 'Workflow', label: 'Transitions hors habilitations', ok: false, valeur: '1' },
  { categorie: 'PAP', label: 'Activités sans réalisation physique', ok: false, valeur: '4' },
  { categorie: 'PAP', label: 'Divergences Budget/PAP', ok: true, valeur: '0' },
  { categorie: 'GED', label: 'Dossiers avec GED incomplète', ok: false, valeur: '5' },
  { categorie: 'GED', label: 'Documents figés manquants', ok: true, valeur: '0' },
  { categorie: 'Paiement', label: 'Paiements sans référence bancaire', ok: false, valeur: '2' },
  { categorie: 'Paiement', label: 'Rapprochements en attente', ok: false, valeur: '4' },
  { categorie: 'Engagement', label: 'Engagements non liquidés (>30j)', ok: false, valeur: '2' },
  { categorie: 'Dates', label: 'Opérations antidatées détectées', ok: true, valeur: '0' },
  { categorie: 'Intégrité', label: 'Doublons référentiels', ok: true, valeur: '0' },
]

const SITUATION_CREDITS = [
  { name: 'Engagé', value: 6_840 },
  { name: 'Liquidé', value: 5_920 },
  { name: 'Ordonné', value: 5_450 },
  { name: 'Payé', value: 5_120 },
]

// ── Helpers ────────────────────────────────────────────────────────────────────
const fmt = (n: number) => new Intl.NumberFormat('fr-FR').format(n)
const fmtM = (n: number) => `${fmt(Math.round(n / 1_000_000))} M XAF`

const CAMP_STATUS_CFG: Record<CampagneClotureStatus, { label: string; color: string; bg: string }> = {
  PREPARATION:    { label: 'Préparation',       color: '#6B7280', bg: '#F1F5F9' },
  OUVERTE:        { label: 'Ouverte',           color: '#2563EB', bg: '#DBEAFE' },
  CONTROLES:      { label: 'Contrôles',         color: '#D97706', bg: '#FEF3C7' },
  CORRECTIONS:    { label: 'Corrections',       color: '#92400E', bg: '#FEF3C7' },
  VALIDATION:     { label: 'Validation',        color: '#7C3AED', bg: '#F3E8FF' },
  PROV_CLOTUREE:  { label: 'Prov. clôturée',   color: '#0E7490', bg: '#CFFAFE' },
  DEF_CLOTUREE:   { label: 'Déf. clôturée',    color: '#065F46', bg: '#D1FAE5' },
  ARCHIVEE:       { label: 'Archivée',          color: '#374151', bg: '#E5E7EB' },
}

const CRIT_CFG: Record<AnomalieCriticite, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  CRITIQUE: { label: 'Critique', color: '#991B1B', bg: '#FEE2E2', icon: <XCircle size={13} /> },
  MAJEURE:  { label: 'Majeure',  color: '#92400E', bg: '#FEF3C7', icon: <AlertTriangle size={13} /> },
  MINEURE:  { label: 'Mineure',  color: '#1D4ED8', bg: '#DBEAFE', icon: <AlertCircle size={13} /> },
  INFO:     { label: 'Info',     color: '#374151', bg: '#F1F5F9', icon: <AlertCircle size={13} /> },
}

const ETAPE_CFG: Record<DossierEtape, { label: string; color: string; bg: string }> = {
  EB_NON_VALIDEE:           { label: 'EB non validée',          color: '#374151', bg: '#F1F5F9' },
  ENGAGEMENT_EN_COURS:      { label: 'Engagement en cours',     color: '#2563EB', bg: '#DBEAFE' },
  ENG_NON_LIQUIDE:          { label: 'Eng. non liquidé',        color: '#D97706', bg: '#FEF3C7' },
  LIQ_NON_ORD:              { label: 'Liq. non ordonnancée',    color: '#7C3AED', bg: '#F3E8FF' },
  ORD_NON_PAYE:             { label: 'Ord. non payé',           color: '#92400E', bg: '#FEF3C7' },
  PAIEMENT_NON_RAPPROCHE:   { label: 'Paiement non rapproché', color: '#991B1B', bg: '#FEE2E2' },
}

const REPORT_STATUS_CFG: Record<string, { label: string; color: string; bg: string }> = {
  PROPOSE:  { label: 'Proposé',  color: '#2563EB', bg: '#DBEAFE' },
  VALIDE:   { label: 'Validé',   color: '#D97706', bg: '#FEF3C7' },
  APPROUVE: { label: 'Approuvé', color: '#065F46', bg: '#D1FAE5' },
  REJETE:   { label: 'Rejeté',   color: '#991B1B', bg: '#FEE2E2' },
}

const WORKFLOW_CLOTURE = [
  { label: 'Préparation', done: true },
  { label: 'Ouverture', done: true },
  { label: 'Inventaire', done: true },
  { label: 'Contrôles', done: false, current: true },
  { label: 'Corrections', done: false },
  { label: 'Clôture prov.', done: false },
  { label: 'Approbation', done: false },
  { label: 'Clôture déf.', done: false },
  { label: 'Archivage', done: false },
]

function CritBadge({ criticite }: { criticite: AnomalieCriticite }) {
  const cfg = CRIT_CFG[criticite]
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10.5px] font-semibold" style={{ background: cfg.bg, color: cfg.color }}>
      {cfg.icon} {cfg.label}
    </span>
  )
}

function AnoStatBadge({ statut }: { statut: Anomalie['statut'] }) {
  const map: Record<string, { label: string; color: string; bg: string }> = {
    OUVERTE:    { label: 'Ouverte',    color: '#991B1B', bg: '#FEE2E2' },
    EN_COURS:   { label: 'En cours',   color: '#D97706', bg: '#FEF3C7' },
    RESOLUE:    { label: 'Résolue',    color: '#065F46', bg: '#D1FAE5' },
    DEROGATION: { label: 'Dérogation', color: '#7C3AED', bg: '#F3E8FF' },
  }
  const cfg = map[statut]
  return <span className="badge text-[10.5px] px-2 py-0.5 font-semibold" style={{ background: cfg.bg, color: cfg.color }}>{cfg.label}</span>
}

interface Props {
  onNavigate: (page: Page, id?: string) => void
}

export default function ClotureBudgetaire({ onNavigate: _onNavigate }: Props) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'inventaire' | 'controles' | 'anomalies' | 'reports' | 'cloture'>('dashboard')
  const [selectedAnomalie, setSelectedAnomalie] = useState<Anomalie | null>(null)
  const [filterCrit, setFilterCrit] = useState<AnomalieCriticite | ''>('')
  const [filterAnoStatut, setFilterAnoStatut] = useState<string>('')
  const [showReouverture, setShowReouverture] = useState(false)
  const [showClotureModal, setShowClotureModal] = useState(false)
  const [clotureStep, setClotureStep] = useState<'confirm' | 'done'>('confirm')
  const [anomaliesState, setAnomaliesState] = useState<Anomalie[]>(ANOMALIES)
  const [relancerLoading, setRelancerLoading] = useState(false)
  const [relancerDone, setRelancerDone] = useState(false)
  const [pdfToast, setPdfToast] = useState('')
  const [showDerogationModal, setShowDerogationModal] = useState(false)
  const [derogationForm, setDerogationForm] = useState({ motif: '', justification: '', autorite: '' })

  const pct = Math.round((CAMPAGNE_ACTIVE.nbControlesOK / CAMPAGNE_ACTIVE.nbControles) * 100)
  const anoFiltered = anomaliesState.filter(a =>
    (!filterCrit || a.criticite === filterCrit) &&
    (!filterAnoStatut || a.statut === filterAnoStatut)
  )

  const tabs = [
    { id: 'dashboard',  label: 'Tableau de bord',    icon: <BarChart2 size={14} /> },
    { id: 'inventaire', label: 'Inventaire',          icon: <Search size={14} /> },
    { id: 'controles',  label: `Contrôles (${pct}%)`, icon: <CheckSquare size={14} /> },
    { id: 'anomalies',  label: `Anomalies (${CAMPAGNE_ACTIVE.nbAnomalies})`, icon: <AlertTriangle size={14} />, warn: true },
    { id: 'reports',    label: 'Reports / Annulations', icon: <ArrowRight size={14} /> },
    { id: 'cloture',    label: 'Clôture',             icon: <Lock size={14} /> },
  ] as const

  const exportCSV = () => {
    const h = ['ID', 'Règle', 'Criticité', 'Dossier', 'Référence', 'Structure', 'Statut', 'Description'].join(';')
    const rows = anomaliesState.map(a => [a.id, a.regle, a.criticite, a.dossier, a.reference, a.structure, a.statut, `"${a.description}"`].join(';'))
    const blob = new Blob([[h, ...rows].join('\n')], { type: 'text/csv;charset=utf-8' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'anomalies-cloture-2026.csv'; a.click()
  }

  return (
    <div className="flex h-full overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 space-y-5">

          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="section-title text-2xl flex items-center gap-2">
                <Lock size={20} style={{ color: '#0B1C3E' }} />
                Clôture Budgétaire
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Module 17 — Exercice <strong>2026</strong> · {CAMPAGNE_ACTIVE.responsable}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="badge text-[11px] px-2.5 py-0.5 font-semibold"
                style={{ background: CAMP_STATUS_CFG[CAMPAGNE_ACTIVE.statut].bg, color: CAMP_STATUS_CFG[CAMPAGNE_ACTIVE.statut].color }}>
                {CAMP_STATUS_CFG[CAMPAGNE_ACTIVE.statut].label}
              </span>
              <button className="btn btn-outline btn-sm" onClick={exportCSV}>
                <Download size={13} /> Exporter
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 -mt-2">
            {tabs.map(t => (
              <button key={t.id}
                className={`tab-item flex items-center gap-1.5 ${activeTab === t.id ? 'active' : ''}`}
                style={t.id === 'anomalies' && activeTab !== t.id ? { color: '#DC2626' } : undefined}
                onClick={() => setActiveTab(t.id as typeof activeTab)}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          {/* ── DASHBOARD ── */}
          {activeTab === 'dashboard' && (
            <div className="space-y-5">
              {/* Alert banner if critiques */}
              {CAMPAGNE_ACTIVE.nbAnomaliesCritiques > 0 && (
                <div className="card p-3 flex items-center gap-3" style={{ background: '#FEE2E2', border: '1.5px solid #FCA5A5' }}>
                  <AlertTriangle size={16} className="text-red-600 flex-shrink-0" />
                  <div className="text-[12.5px] text-red-800">
                    <strong>{CAMPAGNE_ACTIVE.nbAnomaliesCritiques} anomalie(s) critique(s)</strong> bloquent la clôture définitive.
                    Elles doivent être résolues ou faire l&apos;objet d&apos;une dérogation formelle.
                  </div>
                  <button className="btn btn-sm ml-auto flex-shrink-0" style={{ background: '#DC2626', color: 'white', border: 'none' }}
                    onClick={() => setActiveTab('anomalies')}>
                    Voir les anomalies
                  </button>
                </div>
              )}

              {/* Workflow bar */}
              <div className="card p-4">
                <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Progression de la clôture 2026</div>
                <div className="flex items-center gap-0">
                  {WORKFLOW_CLOTURE.map((step, i) => (
                    <div key={i} className="flex items-center">
                      <div className={`px-2.5 py-1.5 rounded text-[10px] font-semibold flex items-center gap-1
                        ${step.current ? 'text-white' : step.done ? 'text-green-700' : 'text-gray-400'}`}
                        style={{ background: step.current ? '#0B1C3E' : step.done ? '#DCFCE7' : '#F1F5F9' }}>
                        {step.done && <CheckCircle size={10} />}
                        {step.label}
                      </div>
                      {i < WORKFLOW_CLOTURE.length - 1 && (
                        <div className={`w-3 h-0.5 ${step.done ? 'bg-green-400' : 'bg-gray-200'}`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* KPI strip */}
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: 'Contrôles réussis', value: `${CAMPAGNE_ACTIVE.nbControlesOK}/${CAMPAGNE_ACTIVE.nbControles}`, sub: `${pct}%`, color: pct >= 90 ? '#065F46' : '#D97706', bg: pct >= 90 ? '#D1FAE5' : '#FEF3C7' },
                  { label: 'Anomalies ouvertes', value: CAMPAGNE_ACTIVE.nbAnomalies, sub: `${CAMPAGNE_ACTIVE.nbAnomaliesCritiques} critiques`, color: '#991B1B', bg: '#FEE2E2' },
                  { label: 'Dossiers en cours', value: DOSSIERS_EN_COURS.length, sub: 'Non finalisés', color: '#D97706', bg: '#FEF3C7' },
                  { label: 'Reports proposés', value: REPORTS.length, sub: `${fmtM(REPORTS.reduce((s, r) => s + r.montant, 0))}`, color: '#7C3AED', bg: '#F3E8FF' },
                ].map((k, i) => (
                  <div key={i} className="card p-4" style={{ borderLeft: `3px solid ${k.color}` }}>
                    <div className="text-[10px] uppercase font-semibold tracking-wider text-gray-400">{k.label}</div>
                    <div className="text-[28px] font-bold mt-0.5" style={{ color: k.color }}>{k.value}</div>
                    <div className="text-[11px] text-gray-400 mt-0.5">{k.sub}</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-5">
                {/* Situation crédits */}
                <div className="card p-4">
                  <div className="text-[12px] font-semibold text-gray-700 mb-3">Situation d&apos;exécution 2026 (M XAF)</div>
                  <div className="space-y-2">
                    {[
                      { label: 'Crédits votés', value: 9_600_000_000, color: '#0B1C3E', max: 9_600_000_000 },
                      { label: 'Crédits révisés', value: 9_800_000_000, color: '#2563EB', max: 9_800_000_000 },
                      { label: 'Engagés', value: 6_840_000_000, color: '#7C3AED', max: 9_800_000_000 },
                      { label: 'Liquidés', value: 5_920_000_000, color: '#D97706', max: 9_800_000_000 },
                      { label: 'Ordonnancements', value: 5_450_000_000, color: '#0E7490', max: 9_800_000_000 },
                      { label: 'Payés', value: 5_120_000_000, color: '#1A6B3A', max: 9_800_000_000 },
                    ].map((row, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-28 text-[11px] text-gray-500 flex-shrink-0">{row.label}</div>
                        <div className="flex-1 h-1.5 rounded-full bg-gray-100">
                          <div className="h-1.5 rounded-full transition-all" style={{ width: `${(row.value / row.max) * 100}%`, background: row.color }} />
                        </div>
                        <div className="w-24 text-right font-mono text-[11px] font-semibold" style={{ color: row.color }}>{fmtM(row.value)}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Situation par étape */}
                <div className="card p-4">
                  <div className="text-[12px] font-semibold text-gray-700 mb-3">Exécution par phase — M XAF</div>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={SITUATION_CREDITS} barSize={28}>
                      <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} formatter={(v) => [`${v} M XAF`]} />
                      <Bar dataKey="value" fill="#0B1C3E" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Calendrier clôture */}
              <div className="card overflow-hidden">
                <div className="px-5 py-3 border-b border-gray-100 font-semibold text-[14px] text-gray-800">Calendrier de clôture 2026</div>
                <div className="grid grid-cols-5 divide-x divide-gray-100">
                  {[
                    { etape: 'Limite engagement', date: '30/10/2026', past: true },
                    { etape: 'Limite liquidation', date: '30/11/2026', current: true },
                    { etape: 'Limite ordonnancement', date: '15/12/2026', past: false },
                    { etape: 'Clôture provisoire', date: '15/12/2026', past: false },
                    { etape: 'Clôture définitive', date: '31/12/2026', past: false },
                  ].map((e, i) => (
                    <div key={i} className={`p-4 ${e.current ? 'bg-amber-50' : ''}`}>
                      <div className={`flex items-center gap-1.5 mb-1 ${e.past ? 'text-green-600' : e.current ? 'text-amber-700 font-semibold' : 'text-gray-400'}`}>
                        {e.past ? <CheckCircle size={12} /> : e.current ? <Clock size={12} /> : <div className="w-3 h-3 rounded-full border-2 border-gray-300" />}
                        <span className="text-[11px] font-semibold">{e.etape}</span>
                      </div>
                      <div className="text-[11px] text-gray-500">{e.date}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── INVENTAIRE ── */}
          {activeTab === 'inventaire' && (
            <div className="space-y-4">
              <div className="card p-3" style={{ background: '#EFF6FF', border: '1.5px solid #BFDBFE' }}>
                <div className="text-[12.5px] text-blue-800 flex items-center gap-2">
                  <Search size={14} className="text-blue-600" />
                  <span>Inventaire automatique des opérations non terminées au <strong>09/11/2026</strong>. <strong>{DOSSIERS_EN_COURS.length} dossiers</strong> nécessitent une action avant clôture.</span>
                </div>
              </div>

              <div className="card overflow-hidden">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Référence</th>
                      <th>Objet</th>
                      <th>Structure</th>
                      <th>Étape bloquante</th>
                      <th>Montant</th>
                      <th>Financement</th>
                      <th>Inactivité</th>
                      <th>Action attendue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DOSSIERS_EN_COURS.map((d, i) => {
                      const ec = ETAPE_CFG[d.etape]
                      return (
                        <tr key={i}>
                          <td><span className="font-mono text-[12px] font-semibold">{d.reference}</span></td>
                          <td><div className="text-[12.5px] font-medium text-gray-800 max-w-[180px] truncate">{d.objet}</div></td>
                          <td><span className="text-[12px] text-gray-600">{d.structure}</span></td>
                          <td>
                            <span className="badge text-[10.5px] px-2 py-0.5 font-semibold" style={{ background: ec.bg, color: ec.color }}>{ec.label}</span>
                          </td>
                          <td><span className="amount text-[12px]">{fmtM(d.montant)}</span></td>
                          <td>
                            <span className="badge text-[10.5px] px-2 py-0.5" style={
                              d.financement === 'PTF' ? { background: '#F3E8FF', color: '#7C3AED' } :
                              d.financement === 'MIXTE' ? { background: '#FEF3C7', color: '#92400E' } :
                              { background: '#DCFCE7', color: '#166534' }
                            }>{d.financement}</span>
                          </td>
                          <td>
                            <span className={`font-mono text-[12px] font-bold ${d.jourInactivite > 30 ? 'text-red-600' : d.jourInactivite > 10 ? 'text-amber-600' : 'text-gray-500'}`}>
                              {d.jourInactivite}j
                            </span>
                          </td>
                          <td><span className="text-[11.5px] text-gray-600">{d.actionAttendues}</span></td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Synthèse par source de financement */}
              <div className="card overflow-hidden">
                <div className="px-5 py-3 border-b border-gray-100 font-semibold text-[14px] text-gray-800">Situation par source de financement</div>
                <table className="data-table">
                  <thead>
                    <tr><th>Source</th><th>Crédits révisés</th><th>Engagés</th><th>Liquidés</th><th>Payés</th><th>Reste à payer</th><th>Reports</th><th>Annulations</th></tr>
                  </thead>
                  <tbody>
                    {[
                      { src: 'CEEAC', cred: 5_800_000_000, eng: 4_200_000_000, liq: 3_680_000_000, pay: 3_420_000_000 },
                      { src: 'PTF', cred: 4_000_000_000, eng: 2_640_000_000, liq: 2_240_000_000, pay: 1_700_000_000 },
                    ].map((row, i) => {
                      const rap = row.liq - row.pay
                      const ann = row.cred - row.eng
                      return (
                        <tr key={i}>
                          <td className="font-bold">{row.src}</td>
                          <td><span className="amount text-[12px]">{fmtM(row.cred)}</span></td>
                          <td><span className="amount text-[12px] text-blue-700">{fmtM(row.eng)}</span></td>
                          <td><span className="amount text-[12px] text-purple-700">{fmtM(row.liq)}</span></td>
                          <td><span className="amount text-[12px] text-green-700">{fmtM(row.pay)}</span></td>
                          <td><span className="amount text-[12px] text-amber-600">{fmtM(rap)}</span></td>
                          <td><span className="amount text-[12px] text-cyan-700">{fmtM(59_000_000 * (i + 1))}</span></td>
                          <td><span className="amount text-[12px] text-red-600">{fmtM(ann - 59_000_000 * (i + 1))}</span></td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── CONTRÔLES ── */}
          {activeTab === 'controles' && (
            <div className="space-y-4">
              <div className="card p-3 flex items-center justify-between" style={{ background: '#F0FDF4', border: '1.5px solid #BBF7D0' }}>
                <div className="flex items-center gap-2">
                  <Shield size={14} className="text-green-600" />
                  <span className="text-[12.5px] text-green-800">
                    <strong>{CAMPAGNE_ACTIVE.nbControlesOK}/{CAMPAGNE_ACTIVE.nbControles}</strong> contrôles réussis ({pct}%)
                  </span>
                </div>
                <button
                  className="btn btn-outline btn-sm gap-1"
                  disabled={relancerLoading}
                  onClick={() => {
                    setRelancerLoading(true)
                    setRelancerDone(false)
                    setTimeout(() => { setRelancerLoading(false); setRelancerDone(true) }, 1800)
                  }}
                  style={relancerDone ? { color: '#16A34A', borderColor: '#16A34A' } : {}}
                >
                  <RefreshCw size={12} className={relancerLoading ? 'animate-spin' : ''} />
                  {relancerLoading ? 'Contrôles en cours…' : relancerDone ? 'Contrôles relancés ✓' : 'Relancer les contrôles'}
                </button>
              </div>

              {['Crédits', 'Workflow', 'PAP', 'GED', 'Paiement', 'Engagement', 'Dates', 'Intégrité'].map(cat => {
                const items = CONTROLES_CHECKLIST.filter(c => c.categorie === cat)
                if (!items.length) return null
                return (
                  <div key={cat} className="card overflow-hidden">
                    <div className="px-5 py-2.5 border-b border-gray-100 flex items-center gap-2"
                      style={{ background: '#F8FAFC' }}>
                      <Layers size={13} className="text-gray-400" />
                      <span className="font-semibold text-[13px] text-gray-700">{cat}</span>
                      <span className="ml-auto text-[11px] text-gray-400">
                        {items.filter(i => i.ok).length}/{items.length} OK
                      </span>
                    </div>
                    {items.map((ctrl, i) => (
                      <div key={i} className={`flex items-center justify-between px-5 py-2.5 border-b border-gray-50 ${!ctrl.ok ? 'bg-red-50/30' : ''}`}>
                        <div className="flex items-center gap-3">
                          {ctrl.ok
                            ? <CheckCircle size={14} className="text-green-500 flex-shrink-0" />
                            : <XCircle size={14} className="text-red-500 flex-shrink-0" />}
                          <span className={`text-[13px] ${ctrl.ok ? 'text-gray-700' : 'text-red-700 font-medium'}`}>{ctrl.label}</span>
                        </div>
                        {!ctrl.ok && (
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[14px] text-red-600">{ctrl.valeur}</span>
                            <button className="btn btn-outline btn-sm text-[11px]" onClick={() => setActiveTab('anomalies')}>Voir</button>
                          </div>
                        )}
                        {ctrl.ok && <span className="text-[12px] font-semibold text-green-600">✓</span>}
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
          )}

          {/* ── ANOMALIES ── */}
          {activeTab === 'anomalies' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <select className="form-input text-[12.5px] w-auto" value={filterCrit} onChange={e => setFilterCrit(e.target.value as AnomalieCriticite | '')}>
                  <option value="">Toutes criticités</option>
                  <option value="CRITIQUE">Critique</option>
                  <option value="MAJEURE">Majeure</option>
                  <option value="MINEURE">Mineure</option>
                  <option value="INFO">Info</option>
                </select>
                <select className="form-input text-[12.5px] w-auto" value={filterAnoStatut} onChange={e => setFilterAnoStatut(e.target.value)}>
                  <option value="">Tous statuts</option>
                  <option value="OUVERTE">Ouverte</option>
                  <option value="EN_COURS">En cours</option>
                  <option value="RESOLUE">Résolue</option>
                  <option value="DEROGATION">Dérogation</option>
                </select>
                <div className="ml-auto text-[12px] text-gray-400">{anoFiltered.length} anomalie(s)</div>
                <button className="btn btn-outline btn-sm" onClick={exportCSV}>
                  <Download size={13} /> Exporter
                </button>
              </div>

              <div className="card overflow-hidden">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Criticité</th>
                      <th>Règle</th>
                      <th>Dossier / Référence</th>
                      <th>Structure</th>
                      <th>Échéance</th>
                      <th>Statut</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {anoFiltered.map(a => (
                      <tr key={a.id} className="cursor-pointer" style={a.criticite === 'CRITIQUE' && a.statut !== 'RESOLUE' ? { background: '#FFF5F5' } : undefined}
                        onClick={() => setSelectedAnomalie(selectedAnomalie?.id === a.id ? null : a)}>
                        <td><span className="font-mono text-[12px] font-bold">{a.id}</span></td>
                        <td><CritBadge criticite={a.criticite} /></td>
                        <td><span className="font-mono text-[11px] px-1.5 py-0.5 rounded" style={{ background: '#F1F5F9' }}>{a.regle}</span></td>
                        <td>
                          <div className="text-[12px] font-semibold text-gray-700">{a.dossier}</div>
                          <div className="font-mono text-[11px] text-gray-400">{a.reference}</div>
                        </td>
                        <td><span className="text-[12px] text-gray-600">{a.structure}</span></td>
                        <td><span className="font-mono text-[12px] text-gray-500">{a.echeance || '—'}</span></td>
                        <td><AnoStatBadge statut={a.statut} /></td>
                        <td><ChevronRight size={13} className="text-gray-300" /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center gap-2 text-[11.5px] text-gray-400">
                <Lock size={11} />
                <span>Les anomalies critiques doivent être résolues avant la clôture définitive.
                  Une dérogation formelle est possible avec approbation de l&apos;autorité compétente.</span>
              </div>
            </div>
          )}

          {/* ── REPORTS / ANNULATIONS ── */}
          {activeTab === 'reports' && (
            <div className="space-y-4">
              <div className="card p-3" style={{ background: '#F5F3FF', border: '1.5px solid #DDD6FE' }}>
                <div className="text-[12.5px] text-purple-800 flex items-center gap-2">
                  <ArrowRight size={14} className="text-purple-600" />
                  <span>Gestion des reports de crédits vers l&apos;exercice 2027. Tout report doit préciser la source N et la destination N+1.</span>
                </div>
              </div>

              {/* Reports */}
              <div className="card overflow-hidden">
                <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
                  <span className="font-semibold text-[14px] text-gray-800">Reports de crédits — Exercice 2026 → 2027</span>
                  <div className="font-mono font-bold text-[13px]" style={{ color: '#7C3AED' }}>
                    Total: {fmtM(REPORTS.reduce((s, r) => s + r.montant, 0))}
                  </div>
                </div>
                <table className="data-table">
                  <thead>
                    <tr><th>Ligne budgétaire</th><th>Objet</th><th>Montant</th><th>Exercice cible</th><th>Dossier lié</th><th>Statut</th></tr>
                  </thead>
                  <tbody>
                    {REPORTS.map((r, i) => {
                      const sc = REPORT_STATUS_CFG[r.statut]
                      return (
                        <tr key={i}>
                          <td><span className="font-mono text-[12px]">{r.ligneBudgetaire}</span></td>
                          <td>
                            <div className="text-[12.5px] font-medium text-gray-800 max-w-[200px] truncate">{r.objet}</div>
                            <div className="text-[11px] text-gray-400 italic">{r.motif}</div>
                          </td>
                          <td><span className="amount text-[12.5px] text-purple-700">{fmtM(r.montant)}</span></td>
                          <td><span className="font-bold text-[13px]" style={{ color: '#0B1C3E' }}>{r.exerciceCible}</span></td>
                          <td><span className="font-mono text-[11px] text-gray-400">{r.dossierLie ?? '—'}</span></td>
                          <td>
                            <span className="badge text-[10.5px] px-2 py-0.5 font-semibold" style={{ background: sc.bg, color: sc.color }}>{sc.label}</span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Crédits à annuler */}
              <div className="card overflow-hidden">
                <div className="px-5 py-3 border-b border-gray-100 font-semibold text-[14px] text-gray-800">
                  Crédits disponibles non reportés — Annulations en fin d&apos;exercice
                </div>
                {[
                  { ligne: 'LB-2026-03-410-02', libelle: 'Fournitures bureau', disponible: 12_400_000, action: 'ANNULATION' },
                  { ligne: 'LB-2026-03-520-01', libelle: 'Frais de télécommunications', disponible: 8_200_000, action: 'ANNULATION' },
                  { ligne: 'LB-2026-04-310-04', libelle: 'Publication institutionnelle', disponible: 5_600_000, action: 'ANNULATION' },
                ].map((row, i) => (
                  <div key={i} className="flex items-center justify-between px-5 py-3 border-b border-gray-50">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11.5px] text-gray-400">{row.ligne}</span>
                        <span className="text-[13px] font-medium text-gray-700">{row.libelle}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="amount text-[12.5px] text-red-600">-{fmtM(row.disponible)}</span>
                      <span className="badge text-[10.5px] px-2 py-0.5" style={{ background: '#FEE2E2', color: '#991B1B' }}>Annulation</span>
                    </div>
                  </div>
                ))}
                <div className="px-5 py-3 flex items-center justify-between" style={{ background: '#FFF1F2' }}>
                  <span className="text-[12px] font-semibold text-gray-700">Total annulations prévues</span>
                  <span className="amount font-bold text-[14px] text-red-600">-{fmtM(26_200_000)}</span>
                </div>
              </div>
            </div>
          )}

          {/* ── CLÔTURE ── */}
          {activeTab === 'cloture' && (
            <div className="space-y-4">
              {CAMPAGNE_ACTIVE.nbAnomaliesCritiques > 0 && (
                <div className="card p-4" style={{ background: '#FEE2E2', border: '1.5px solid #FCA5A5' }}>
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle size={15} className="text-red-600" />
                    <span className="font-semibold text-red-800 text-[13.5px]">Clôture définitive bloquée</span>
                  </div>
                  <p className="text-[12.5px] text-red-700">
                    <strong>{CAMPAGNE_ACTIVE.nbAnomaliesCritiques} anomalie(s) critique(s)</strong> non résolues empêchent la clôture définitive.
                    La clôture provisoire reste possible afin de geler les nouvelles opérations.
                  </p>
                </div>
              )}

              {/* Actions de clôture */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  {
                    titre: 'Clôture provisoire',
                    desc: 'Gel des nouvelles opérations. Régularisations limitées autorisées.',
                    action: 'Lancer clôture provisoire',
                    enabled: true,
                    color: '#0E7490', bg: '#ECFEFF',
                    icon: <Lock size={18} />,
                  },
                  {
                    titre: 'Clôture définitive',
                    desc: 'Verrouillage officiel de l\'exercice après validation institutionnelle.',
                    action: 'Lancer clôture définitive',
                    enabled: false,
                    color: '#374151', bg: '#F1F5F9',
                    icon: <Shield size={18} />,
                  },
                  {
                    titre: 'Réouverture exceptionnelle',
                    desc: 'Réouverture temporaire sur périmètre limité avec approbation renforcée.',
                    action: 'Demander réouverture',
                    enabled: false,
                    color: '#92400E', bg: '#FEF3C7',
                    icon: <RefreshCw size={18} />,
                  },
                ].map((card, i) => (
                  <div key={i} className="card p-5 flex flex-col gap-3" style={{ border: `1.5px solid ${card.enabled ? card.color + '40' : '#E5E7EB'}` }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: card.bg, color: card.color }}>
                      {card.icon}
                    </div>
                    <div>
                      <div className="font-bold text-[14px] text-gray-800 mb-1">{card.titre}</div>
                      <div className="text-[12px] text-gray-500">{card.desc}</div>
                    </div>
                    <button
                      className="btn btn-sm mt-auto"
                      disabled={!card.enabled}
                      style={card.enabled ? { background: card.color, color: 'white', border: 'none' } : { opacity: 0.4 }}
                      onClick={() => { if (card.enabled) setShowClotureModal(true) }}
                    >
                      {card.action}
                    </button>
                  </div>
                ))}
              </div>

              {/* Documents officiels */}
              <div className="card overflow-hidden">
                <div className="px-5 py-3 border-b border-gray-100 font-semibold text-[14px] text-gray-800">Documents officiels de clôture</div>
                {[
                  { nom: 'Rapport de pré-clôture', ref: 'RPT-PRECLOT-2026', statut: 'DISPONIBLE' },
                  { nom: 'État des engagements restant à liquider', ref: 'ENG-RAL-2026', statut: 'DISPONIBLE' },
                  { nom: 'État des ordonnancements restant à payer', ref: 'ORD-RAP-2026', statut: 'EN_GENERATION' },
                  { nom: 'État des reports de crédits', ref: 'REP-CRED-2026', statut: 'DISPONIBLE' },
                  { nom: 'État des annulations', ref: 'ANN-CRED-2026', statut: 'BROUILLON' },
                  { nom: 'Procès-verbal de clôture', ref: 'PV-CLOT-2026', statut: 'BROUILLON' },
                  { nom: 'Rapport final de clôture', ref: 'RPT-FINAL-2026', statut: 'BROUILLON' },
                ].map((doc, i) => (
                  <div key={i} className="flex items-center justify-between px-5 py-3 border-b border-gray-50 hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <FileText size={14} className="text-gray-400 flex-shrink-0" />
                      <div>
                        <div className="text-[13px] font-medium text-gray-800">{doc.nom}</div>
                        <div className="font-mono text-[11px] text-gray-400">{doc.ref}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="badge text-[10.5px] px-2 py-0.5" style={
                        doc.statut === 'DISPONIBLE' ? { background: '#DCFCE7', color: '#166534' } :
                        doc.statut === 'EN_GENERATION' ? { background: '#FEF3C7', color: '#92400E' } :
                        { background: '#F1F5F9', color: '#6B7280' }
                      }>
                        {doc.statut === 'DISPONIBLE' ? 'Disponible' : doc.statut === 'EN_GENERATION' ? 'En génération' : 'Brouillon'}
                      </span>
                      {doc.statut === 'DISPONIBLE' && (
                        <button
                          className="btn btn-outline btn-sm text-[11px]"
                          onClick={() => { setPdfToast(doc.nom); setTimeout(() => setPdfToast(''), 3000) }}
                        >
                          <Download size={11} /> PDF
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Génération N+1 */}
              <div className="card p-5" style={{ border: '1.5px solid #A5F3FC', background: '#F0FDFA' }}>
                <div className="flex items-center gap-3 mb-3">
                  <Archive size={18} className="text-teal-600" />
                  <div>
                    <div className="font-bold text-[14px] text-teal-800">Génération des données d&apos;ouverture — Exercice 2027</div>
                    <div className="text-[12px] text-teal-600">Disponible après clôture définitive de l&apos;exercice 2026</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {['Référentiels & nomenclature', 'Engagements reportés', 'Programmes pluriannuels PAP', 'Financements PTF reconduits', 'Lignes budgétaires reconduites', 'Paramètres système'].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-[12px] text-teal-700">
                      <CheckCircle size={12} className="text-teal-500" />{item}
                    </div>
                  ))}
                </div>
                <button disabled className="btn btn-sm mt-4 opacity-50 cursor-not-allowed" style={{ background: '#0E7490', color: 'white', border: 'none' }}>
                  <ArrowRight size={13} /> Générer données d&apos;ouverture 2027
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Anomalie detail panel ── */}
      {selectedAnomalie && (
        <div className="w-[360px] flex-shrink-0 flex flex-col border-l border-gray-200 bg-white overflow-y-auto">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div>
              <div className="font-bold text-[14px] text-gray-900">Détail anomalie</div>
              <div className="font-mono text-[11px] text-gray-400 mt-0.5">{selectedAnomalie.id}</div>
            </div>
            <button className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-gray-100" onClick={() => setSelectedAnomalie(null)}>
              <X size={14} className="text-gray-400" />
            </button>
          </div>
          <div className="p-5 space-y-5">
            <CritBadge criticite={selectedAnomalie.criticite} />

            <div className="space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Description</div>
              <div className="text-[12.5px] text-gray-800 leading-relaxed p-3 rounded-lg"
                style={{ background: '#FFF5F5', border: '1px solid #FECACA' }}>
                {selectedAnomalie.description}
              </div>
            </div>

            {[
              { l: 'Règle déclenchée', v: <span className="font-mono text-[12px] px-1.5 py-0.5 rounded" style={{ background: '#F1F5F9' }}>{selectedAnomalie.regle}</span> },
              { l: 'Module', v: selectedAnomalie.dossier },
              { l: 'Référence', v: <span className="font-mono font-semibold">{selectedAnomalie.reference}</span> },
              { l: 'Structure', v: selectedAnomalie.structure },
              { l: 'Acteur responsable', v: selectedAnomalie.acteur },
              { l: 'Échéance', v: selectedAnomalie.echeance || '—' },
              { l: 'Statut', v: <AnoStatBadge statut={selectedAnomalie.statut} /> },
            ].map((r, i) => (
              <div key={i} className="flex justify-between items-start py-1.5 border-b border-gray-50">
                <span className="text-[12px] text-gray-400 w-28">{r.l}</span>
                <span className="text-[12px] font-medium text-gray-800 text-right">{r.v}</span>
              </div>
            ))}

            <div className="space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Actions</div>
              <button
                className="btn btn-primary btn-sm w-full justify-center"
                disabled={selectedAnomalie.statut === 'RESOLUE'}
                style={selectedAnomalie.statut === 'RESOLUE' ? { opacity: 0.5 } : { background: '#16A34A', border: 'none', color: 'white' }}
                onClick={() => {
                  setAnomaliesState(prev => prev.map(a => a.id === selectedAnomalie.id ? { ...a, statut: 'RESOLUE' } : a))
                  setSelectedAnomalie(prev => prev ? { ...prev, statut: 'RESOLUE' } : null)
                }}
              >
                <CheckCircle size={12} /> {selectedAnomalie.statut === 'RESOLUE' ? 'Déjà résolue' : 'Marquer résolue'}
              </button>
              <button
                className="btn btn-outline btn-sm w-full justify-center"
                onClick={() => setShowDerogationModal(true)}
              >
                <FileText size={12} /> Demander dérogation
              </button>
            </div>

            <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-[11.5px]" style={{ background: '#F1F5F9' }}>
              <Lock size={11} className="text-gray-400" />
              <span className="text-gray-500">Anomalie immuable — résolution tracée dans le journal</span>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast PDF ── */}
      {pdfToast && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-[13px] font-semibold text-white" style={{ background: '#0B1C3E' }}>
          <Download size={15} /> Téléchargement en cours — {pdfToast}
          <button onClick={() => setPdfToast('')} className="ml-2 opacity-70 hover:opacity-100"><X size={14} /></button>
        </div>
      )}

      {/* ── Modal demande de dérogation ── */}
      {showDerogationModal && selectedAnomalie && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(11,28,62,0.65)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between" style={{ background: '#0B1C3E', borderRadius: '1rem 1rem 0 0' }}>
              <div className="flex items-center gap-2">
                <FileText size={15} className="text-white" />
                <div>
                  <div className="font-bold text-white text-sm">Demande de dérogation</div>
                  <div className="text-[10px] text-white/50">{selectedAnomalie.id} — {selectedAnomalie.regle}</div>
                </div>
              </div>
              <button className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/10" onClick={() => setShowDerogationModal(false)}>
                <X size={14} className="text-white" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="p-3 rounded-xl text-[12px]" style={{ background: '#FEF3C7', border: '1px solid #FDE68A' }}>
                <p className="text-amber-800 font-semibold mb-0.5">Anomalie concernée</p>
                <p className="text-amber-700">{selectedAnomalie.description}</p>
              </div>
              <div>
                <label className="form-label">Motif de la dérogation *</label>
                <input className="form-input text-[13px]" placeholder="Ex: Contrainte opérationnelle, accord partenaire…" value={derogationForm.motif} onChange={e => setDerogationForm(f => ({ ...f, motif: e.target.value }))} />
              </div>
              <div>
                <label className="form-label">Justification détaillée *</label>
                <textarea className="form-input text-[13px] h-24" placeholder="Exposez les circonstances justifiant cette dérogation…" value={derogationForm.justification} onChange={e => setDerogationForm(f => ({ ...f, justification: e.target.value }))} />
              </div>
              <div>
                <label className="form-label">Autorité compétente *</label>
                <select className="form-input text-[13px]" value={derogationForm.autorite} onChange={e => setDerogationForm(f => ({ ...f, autorite: e.target.value }))}>
                  <option value="">— Sélectionner —</option>
                  <option>Secrétaire Général — CEEAC</option>
                  <option>Président de la Commission</option>
                  <option>Directeur du Budget</option>
                  <option>Contrôleur Financier</option>
                </select>
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <button className="btn btn-outline btn-sm" onClick={() => setShowDerogationModal(false)}>Annuler</button>
                <button
                  className="btn btn-sm"
                  style={{ background: '#7C3AED', color: 'white', border: 'none' }}
                  disabled={!derogationForm.motif || !derogationForm.justification || !derogationForm.autorite}
                  onClick={() => {
                    setAnomaliesState(prev => prev.map(a => a.id === selectedAnomalie.id ? { ...a, statut: 'DEROGATION' } : a))
                    setSelectedAnomalie(prev => prev ? { ...prev, statut: 'DEROGATION' } : null)
                    setShowDerogationModal(false)
                    setDerogationForm({ motif: '', justification: '', autorite: '' })
                  }}
                >
                  <FileText size={13} /> Soumettre la demande
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Clôture provisoire modal ── */}
      {showClotureModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-xl p-6 w-[460px] shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-[16px] text-gray-900">Clôture provisoire — Exercice 2026</h3>
              <button className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-gray-100" onClick={() => { setShowClotureModal(false); setClotureStep('confirm') }}>
                <X size={14} className="text-gray-400" />
              </button>
            </div>
            {clotureStep === 'confirm' ? (
              <div className="space-y-4">
                <div className="p-4 rounded-lg" style={{ background: '#FEF3C7', border: '1.5px solid #FDE68A' }}>
                  <div className="flex items-start gap-2">
                    <AlertTriangle size={15} className="text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="text-[12.5px] text-amber-800">
                      Cette action va <strong>geler</strong> l&apos;exercice 2026 et interdire toute nouvelle opération ordinaire.
                      Les régularisations limitées resteront possibles jusqu&apos;à la clôture définitive.
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="form-label">Motif / Décision *</label>
                    <textarea className="form-input text-[13px] h-20" placeholder="Justification institutionnelle…" />
                  </div>
                  <div>
                    <label className="form-label">Autorité habilitée</label>
                    <input className="form-input text-[13px]" defaultValue="Secrétaire Général — CEEAC" />
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <button className="btn btn-outline btn-sm" onClick={() => setShowClotureModal(false)}>Annuler</button>
                  <button className="btn btn-sm" style={{ background: '#0E7490', color: 'white', border: 'none' }}
                    onClick={() => setClotureStep('done')}>
                    <Lock size={13} /> Confirmer clôture provisoire
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 py-6">
                <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: '#CFFAFE' }}>
                  <Lock size={24} className="text-cyan-600" />
                </div>
                <div className="font-bold text-[16px] text-gray-800">Clôture provisoire lancée</div>
                <div className="text-[13px] text-gray-500 text-center">
                  L&apos;exercice 2026 est provisoirement clôturé. Les nouvelles opérations ordinaires sont désormais bloquées.
                  Un événement a été enregistré dans le journal d&apos;audit.
                </div>
                <button className="btn btn-outline btn-sm" onClick={() => { setShowClotureModal(false); setClotureStep('confirm') }}>Fermer</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
