import { useState, useMemo } from 'react'
import {
  AreaChart, Area, BarChart, Bar, ScatterChart, Scatter,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  ReferenceLine, Cell, Legend,
} from 'recharts'
import {
  TrendingUp, TrendingDown, AlertTriangle, AlertCircle, Info,
  ChevronRight, Download, RefreshCw, Filter, Shield,
  Activity, Target, Zap, CheckCircle, Clock, XCircle,
  Building2, BarChart3, Users, Layers, ArrowRight,
  FileText, DollarSign, Eye, Bell,
} from 'lucide-react'
import type { Page } from '../types'
import {
  BUDGET_SUMMARY, MONTHLY_EXECUTION, PILIER_PERFORMANCE,
  SOURCE_FINANCEMENT, MES_TACHES, ALERTES,
  EB_LIST, ENG_LIST, LIQ_LIST, ORD_LIST, PAY_LIST,
} from '../data/mock'

// ── Palette institutionnelle ───────────────────────────────────────────────
const C = {
  navy: '#0B1C3E',
  green: '#1A6B3A',
  orange: '#D97706',
  red: '#DC2626',
  blue: '#1D4ED8',
  teal: '#0D9488',
  purple: '#7C3AED',
}

// ── Données officielles CEEAC (source: BUDGET_EXERCICE_2026_Final.pdf) ─────
const BUDGET_OFFICIEL = {
  total: 40_305_795_803,
  fonctionnement: 13_677_514_803,
  investissement: 25_887_281_000,
  pap: 22_365_281_000,
  assises: 1_525_000_000,
  dotations: 1_997_000_000,
  equipements: 741_000_000,
  recettesInternes: 26_275_514_803,
}

// ── Profils disponibles ────────────────────────────────────────────────────
type Profil = 'presidence' | 'sg' | 'commissaire'
const PROFILS: { id: Profil; label: string; icon: React.ReactNode; color: string }[] = [
  { id: 'presidence', label: 'Présidence', icon: <Shield size={13} />, color: C.navy },
  { id: 'sg', label: 'Secrétaire Général', icon: <Building2 size={13} />, color: C.green },
  { id: 'commissaire', label: 'Commissaire', icon: <Users size={13} />, color: C.teal },
]

// ── Données chaîne de dépense ─────────────────────────────────────────────
const CHAINE = [
  {
    etape: 'Expression de Besoin',
    code: 'EB',
    page: 'eb-list' as Page,
    icon: <FileText size={14} />,
    total: EB_LIST.length,
    montant: EB_LIST.reduce((s, e) => s + e.montant, 0),
    enCours: EB_LIST.filter(e => e.status === 'EN_VALIDATION' || e.status === 'SOUMIS').length,
    valides: EB_LIST.filter(e => e.status === 'APPROUVE' || e.status === 'TRANSFORME').length,
    retournes: EB_LIST.filter(e => e.status === 'RETOURNE').length,
    rejetes: EB_LIST.filter(e => e.status === 'REJETE').length,
    enRetard: 3,
    delaiMoyen: 2.4,
    color: '#3B82F6',
  },
  {
    etape: 'Engagement',
    code: 'ENG',
    page: 'eng-list' as Page,
    icon: <DollarSign size={14} />,
    total: ENG_LIST.length,
    montant: ENG_LIST.reduce((s, e) => s + e.montant, 0),
    enCours: ENG_LIST.filter(e => e.status === 'EN_VALIDATION_BUDGET' || e.status === 'CONTROLE_FINANCIER').length,
    valides: ENG_LIST.filter(e => e.status === 'VISE' || e.status === 'TRANSFORME').length,
    retournes: ENG_LIST.filter(e => e.status === 'RETOURNE').length,
    rejetes: ENG_LIST.filter(e => e.status === 'REJETE').length,
    enRetard: 2,
    delaiMoyen: 3.1,
    color: '#10B981',
  },
  {
    etape: 'Liquidation',
    code: 'LIQ',
    page: 'liq-list' as Page,
    icon: <CheckCircle size={14} />,
    total: LIQ_LIST.length,
    montant: LIQ_LIST.reduce((s, e) => s + e.montantNet, 0),
    enCours: LIQ_LIST.filter(e => e.status === 'EN_CONTROLE' || e.status === 'EN_CERTIFICATION').length,
    valides: LIQ_LIST.filter(e => e.status === 'VISEE' || e.status === 'TRANSFORMEE').length,
    retournes: LIQ_LIST.filter(e => e.status === 'RETOURNEE').length,
    rejetes: LIQ_LIST.filter(e => e.status === 'REJETEE').length,
    enRetard: 5,
    delaiMoyen: 4.7,
    color: '#8B5CF6',
  },
  {
    etape: 'Ordonnancement',
    code: 'ORD',
    page: 'ord-list' as Page,
    icon: <Activity size={14} />,
    total: ORD_LIST.length,
    montant: ORD_LIST.reduce((s, e) => s + e.montant, 0),
    enCours: ORD_LIST.filter(e => e.status === 'A_SIGNER' || e.status === 'A_PREPARER').length,
    valides: ORD_LIST.filter(e => e.status === 'SIGNE' || e.status === 'TRANSMIS_AC' || e.status === 'TRANSFORME').length,
    retournes: ORD_LIST.filter(e => e.status === 'RETOURNE').length,
    rejetes: ORD_LIST.filter(e => e.status === 'REJETE').length,
    enRetard: 3,
    delaiMoyen: 2.8,
    color: '#F59E0B',
  },
  {
    etape: 'Paiement',
    code: 'PAY',
    page: 'pay-list' as Page,
    icon: <Zap size={14} />,
    total: PAY_LIST.length,
    montant: PAY_LIST.reduce((s, e) => s + e.montantPaye, 0),
    enCours: PAY_LIST.filter(e => e.status === 'EN_VALIDATION' || e.status === 'CONTROLE_COMPTABLE').length,
    valides: PAY_LIST.filter(e => e.status === 'EXECUTE' || e.status === 'RAPPROCHE').length,
    retournes: PAY_LIST.filter(e => e.status === 'RETOURNE').length,
    rejetes: PAY_LIST.filter(e => e.status === 'REJETE' || e.status === 'REJETE_BANQUE').length,
    enRetard: 1,
    delaiMoyen: 5.2,
    color: '#EF4444',
  },
]

// ── Alertes exécutives enrichies ───────────────────────────────────────────
type NiveauAlerte = 'CRITIQUE' | 'IMPORTANT' | 'ATTENTION' | 'INFO'
interface AlerteExecutive {
  id: string
  niveau: NiveauAlerte
  structure: string
  type: string
  message: string
  montant?: number
  dossier?: string
  anciennete: number
  responsable: string
  action: string
  page?: Page
}
const ALERTES_EXEC: AlerteExecutive[] = [
  { id: 'A1', niveau: 'CRITIQUE', structure: 'DAP — Affaires politiques', type: 'Dossier bloqué', message: '3 ordres de paiement en attente de signature depuis 7 jours', montant: 485_000_000, dossier: 'ORD-2026-0089', anciennete: 7, responsable: 'Ordonnateur délégué', action: 'Signer les ordres', page: 'ord-list' },
  { id: 'A2', niveau: 'CRITIQUE', structure: 'DPGDHS — Genre & Développement humain', type: 'Sous-exécution', message: 'Taux d\'exécution physique à 23 % — seuil critique 50 % dépassé', montant: 1_956_100_000, dossier: 'PAP-P5', anciennete: 14, responsable: 'Commissaire DPGDHS', action: 'Plan d\'accélération requis', page: 'se' },
  { id: 'A3', niveau: 'IMPORTANT', structure: 'DATI — Aménagement du territoire', type: 'Écart phys/fin', message: 'Consommation financière 68 % mais réalisation physique 31 % — écart critique', montant: 11_172_061_000, dossier: 'PAP-P3', anciennete: 5, responsable: 'Commissaire DATI', action: 'Revue de projet urgente', page: 'projets' },
  { id: 'A4', niveau: 'IMPORTANT', structure: 'DRHMG — Ressources humaines', type: 'Crédits', message: 'Ligne personnel (ch. 66) consommée à 91 % — risque de dépassement', montant: 11_586_264_803, dossier: 'LB-66', anciennete: 3, responsable: 'SG / DRHMG', action: 'Mesures conservatoires', page: 'budget' },
  { id: 'A5', niveau: 'ATTENTION', structure: 'DCMR — Communication', type: 'Délai', message: '5 liquidations dépassent le délai réglementaire de 30 jours', montant: 78_500_000, dossier: 'LIQ-2026-mult', anciennete: 8, responsable: 'CF / DCMR', action: 'Traitement prioritaire', page: 'liq-list' },
  { id: 'A6', niveau: 'ATTENTION', structure: 'DCRPP — Planification', type: 'Données', message: 'Indicateurs PAP Q3 non renseignés — rapport trimestriel en attente', montant: undefined, dossier: 'SE-Q3-2026', anciennete: 12, responsable: 'DCRPP', action: 'Saisie requise', page: 'se' },
  { id: 'A7', niveau: 'INFO', structure: 'Commission', type: 'Révision budgétaire', message: 'Révision budgétaire mi-parcours soumise — en attente d\'approbation', montant: undefined, dossier: 'BUD-REV-2026', anciennete: 2, responsable: 'Conseil des Ministres', action: 'Suivi en cours', page: 'budget' },
]

// ── Exécution par structure ────────────────────────────────────────────────
const STRUCTURES_EXEC = [
  { code: 'DPRES', libelle: 'Présidence', budget: 2_890_000_000, engage: 1_980_000_000, paye: 1_340_000_000, txFin: 46.4, txPhys: 52.1, alertes: 0 },
  { code: 'DSG', libelle: 'Secrétariat Général', budget: 3_450_000_000, engage: 2_670_000_000, paye: 1_890_000_000, txFin: 54.8, txPhys: 61.3, alertes: 1 },
  { code: 'DAPPS', libelle: 'Affaires politiques & Paix', budget: 5_210_000_000, engage: 3_540_000_000, paye: 2_120_000_000, txFin: 40.7, txPhys: 38.9, alertes: 2 },
  { code: 'DMCAEMF', libelle: 'Marché commun & Écon.', budget: 6_780_000_000, engage: 4_230_000_000, paye: 2_870_000_000, txFin: 42.3, txPhys: 45.7, alertes: 1 },
  { code: 'DENRADR', libelle: 'Environnement & Ressources', budget: 7_120_000_000, engage: 4_890_000_000, paye: 3_120_000_000, txFin: 43.8, txPhys: 40.2, alertes: 1 },
  { code: 'DATI', libelle: 'Aménagement du territoire', budget: 11_172_061_000, engage: 7_590_000_000, paye: 3_780_000_000, txFin: 33.8, txPhys: 24.1, alertes: 3 },
  { code: 'DPGDHS', libelle: 'Genre & Développement humain', budget: 3_683_734_803, engage: 1_890_000_000, paye: 870_000_000, txFin: 23.6, txPhys: 18.4, alertes: 2 },
]

// ── Matrice physique / financière ─────────────────────────────────────────
const MATRIX_DATA = STRUCTURES_EXEC.map(s => ({
  x: s.txFin,
  y: s.txPhys,
  name: s.code,
  budget: s.budget,
  alertes: s.alertes,
}))

// ── Données mensuelles (réel Jan-Sep + projection Oct-Déc) ─────────────────
const MONTHLY_FULL = [
  ...MONTHLY_EXECUTION,
  { mois: 'Oct', engage: null, liquide: null, paye: null, projEngage: 4100, projPaye: 2890 },
  { mois: 'Nov', engage: null, liquide: null, paye: null, projEngage: 4560, projPaye: 3210 },
  { mois: 'Déc', engage: null, liquide: null, paye: null, projEngage: 5100, projPaye: 3680 },
]

// ── Décisions en attente par profil ──────────────────────────────────────
const DECISIONS_PRESIDENCE = [
  { ref: 'ORD-2026-0089', etape: 'Ordonnancement', objet: 'Services de sécurité périmétrique — DAPPS', montant: 485_000_000, structure: 'DAPPS', soumis: '2026-09-09', delai: 7, priorite: 'CRITIQUE', action: 'Signature requise', page: 'ord-list' as Page },
  { ref: 'ORD-2026-0092', etape: 'Ordonnancement', objet: 'Acquisition 2 véhicules — DENRADR', montant: 142_000_000, structure: 'DENRADR', soumis: '2026-09-10', delai: 6, priorite: 'IMPORTANT', action: 'Signature requise', page: 'ord-list' as Page },
  { ref: 'BUD-REV-2026', etape: 'Révision budgétaire', objet: 'Révision mi-parcours Budget 2026', montant: undefined, structure: 'Commission', soumis: '2026-09-14', delai: 2, priorite: 'INFO', action: 'Approbation attendue', page: 'budget' as Page },
]
const DECISIONS_SG = [
  { ref: 'EB-2026-004523', etape: 'EB', objet: 'Acquisition matériel informatique — DSI', montant: 125_000_000, structure: 'DSI', soumis: '2026-09-13', delai: 3, priorite: 'NORMAL', action: 'Validation requise', page: 'eb-list' as Page },
  { ref: 'EB-2026-004531', etape: 'EB', objet: 'Contrat prestation GED — DCMR', montant: 38_000_000, structure: 'DCMR', soumis: '2026-09-15', delai: 1, priorite: 'NORMAL', action: 'Arbitrage', page: 'eb-list' as Page },
  { ref: 'LIQ-2026-0112', etape: 'Liquidation', objet: 'Facture travaux Salle de conférence', montant: 78_500_000, structure: 'DCRPP', soumis: '2026-08-18', delai: 29, priorite: 'URGENT', action: 'Certification service fait', page: 'liq-list' as Page },
  { ref: 'ENG-2026-0067', etape: 'Engagement', objet: 'Formation sécurité régionale — EMR', montant: 54_000_000, structure: 'DAPPS', soumis: '2026-09-12', delai: 4, priorite: 'NORMAL', action: 'Visa CF', page: 'eng-list' as Page },
]
const DECISIONS_COMMISSAIRE = [
  { ref: 'EB-2026-004528', etape: 'EB', objet: 'Atelier régional environnement', montant: 22_000_000, structure: 'DENRADR', soumis: '2026-09-14', delai: 2, priorite: 'NORMAL', action: 'Validation', page: 'eb-list' as Page },
  { ref: 'SE-Q3-2026', etape: 'Suivi-Évaluation', objet: 'Saisie indicateurs Q3 PAP — Pilier 4', montant: undefined, structure: 'DENRADR', soumis: '2026-09-01', delai: 15, priorite: 'IMPORTANT', action: 'Saisie requise', page: 'se' as Page },
]

// ── Utilitaires ────────────────────────────────────────────────────────────
function fmt(n: number): string {
  if (n >= 1e9) return (n / 1e9).toFixed(1) + ' Mrd'
  if (n >= 1e6) return Math.round(n / 1e6) + ' M'
  return new Intl.NumberFormat('fr-FR').format(n)
}
function fmtFull(n: number): string {
  return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA'
}
function pct(v: number, total: number): number {
  return Math.round((v / total) * 100)
}

// ── Composants utilitaires ─────────────────────────────────────────────────
function NiveauBadge({ niveau }: { niveau: NiveauAlerte }) {
  const map: Record<NiveauAlerte, string> = {
    CRITIQUE: 'bg-red-100 text-red-700 border border-red-200',
    IMPORTANT: 'bg-orange-100 text-orange-700 border border-orange-200',
    ATTENTION: 'bg-amber-100 text-amber-700 border border-amber-200',
    INFO: 'bg-blue-100 text-blue-700 border border-blue-200',
  }
  return <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${map[niveau]}`}>{niveau}</span>
}

function NiveauIcon({ niveau }: { niveau: NiveauAlerte }) {
  if (niveau === 'CRITIQUE') return <XCircle size={14} className="text-red-500 shrink-0" />
  if (niveau === 'IMPORTANT') return <AlertTriangle size={14} className="text-orange-500 shrink-0" />
  if (niveau === 'ATTENTION') return <AlertCircle size={14} className="text-amber-500 shrink-0" />
  return <Info size={14} className="text-blue-400 shrink-0" />
}

function PrioriteColor(p: string): string {
  if (p === 'CRITIQUE' || p === 'URGENT') return 'text-red-600'
  if (p === 'IMPORTANT') return 'text-orange-600'
  return 'text-gray-500'
}

function TauxBar({ value, color = '#1A6B3A', bg = '#E5E7EB' }: { value: number; color?: string; bg?: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full" style={{ background: bg }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(value, 100)}%`, background: value >= 80 ? '#DC2626' : value >= 60 ? C.orange : color }} />
      </div>
      <span className="text-xs font-mono w-9 text-right" style={{ color: value >= 80 ? '#DC2626' : value >= 60 ? C.orange : C.green }}>
        {value.toFixed(0)}%
      </span>
    </div>
  )
}

// ── Score de santé budgétaire ──────────────────────────────────────────────
function SanteGauge({ score }: { score: number }) {
  const color = score >= 70 ? C.green : score >= 45 ? C.orange : C.red
  const label = score >= 70 ? 'Satisfaisante' : score >= 45 ? 'À surveiller' : 'Critique'
  const r = 42
  const circ = 2 * Math.PI * r
  const dash = (score / 100) * circ
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-28 h-28">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          <circle cx="50" cy="50" r={r} fill="none" stroke="#E5E7EB" strokeWidth="10" />
          <circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="10"
            strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold" style={{ color }}>{score}</span>
          <span className="text-[9px] text-gray-400 font-medium">/100</span>
        </div>
      </div>
      <div className="text-xs font-semibold mt-1" style={{ color }}>{label}</div>
      <div className="text-[10px] text-gray-400 text-center mt-0.5">Santé de l'exécution</div>
    </div>
  )
}

interface Props {
  onNavigate: (page: Page, id?: string) => void
}

export default function ExecutiveDashboard({ onNavigate }: Props) {
  const [profil, setProfil] = useState<Profil>('presidence')
  const [alerteNiveau, setAlerteNiveau] = useState<NiveauAlerte | 'TOUS'>('TOUS')
  const [showFiltres, setShowFiltres] = useState(false)
  const [periode, setPeriode] = useState('jan-sep-2026')

  const b = BUDGET_SUMMARY

  // KPIs réels
  const budgetTotal = BUDGET_OFFICIEL.total
  const engage = b.engage
  const liquide = b.liquide
  const ordonnance = b.ordonnance
  const paye = b.paye
  const disponible = budgetTotal - engage
  const txEngagement = pct(engage, budgetTotal)
  const txPaiement = pct(paye, budgetTotal)
  const txPhysique = b.tauxRealisationPhysique

  // Score de santé (composite)
  const sante = Math.round((txEngagement * 0.3 + txPhysique * 0.4 + txPaiement * 0.3))

  // Alertes filtrées
  const alertesFiltrees = useMemo(() =>
    alerteNiveau === 'TOUS' ? ALERTES_EXEC : ALERTES_EXEC.filter(a => a.niveau === alerteNiveau),
    [alerteNiveau]
  )

  // Décisions selon profil
  const decisions = profil === 'presidence' ? DECISIONS_PRESIDENCE : profil === 'sg' ? DECISIONS_SG : DECISIONS_COMMISSAIRE

  const alertesCritiques = ALERTES_EXEC.filter(a => a.niveau === 'CRITIQUE').length

  return (
    <div className="min-h-full" style={{ background: '#F0F4FA' }}>

      {/* ── Header exécutif ─────────────────────────────────────────────── */}
      <div className="sticky top-0 z-20 border-b border-white/60 backdrop-blur-md"
        style={{ background: 'rgba(11,28,62,0.97)' }}>
        <div className="px-5 py-3 flex items-center gap-4">
          <div>
            <div className="text-white font-bold text-sm leading-tight">Tableau de bord exécutif</div>
            <div className="text-blue-300 text-[10px] mt-0.5">Commission de la CEEAC · Exercice 2026</div>
          </div>

          {/* Sélecteur profil */}
          <div className="flex gap-1 ml-4">
            {PROFILS.map(p => (
              <button key={p.id} onClick={() => setProfil(p.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${profil === p.id ? 'text-white' : 'text-white/40 hover:text-white/70'}`}
                style={{ background: profil === p.id ? p.color : 'transparent' }}>
                {p.icon}{p.label}
              </button>
            ))}
          </div>

          <div className="flex-1" />

          {/* Période */}
          <select value={periode} onChange={e => setPeriode(e.target.value)}
            className="text-xs bg-white/10 text-white border border-white/20 rounded px-2 py-1.5 outline-none">
            <option value="jan-sep-2026">Jan – Sep 2026</option>
            <option value="jan-jun-2026">Jan – Jun 2026</option>
            <option value="q3-2026">Q3 2026</option>
          </select>

          {/* Filtres */}
          <button onClick={() => setShowFiltres(!showFiltres)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs text-white/60 hover:text-white border transition-all ${showFiltres ? 'border-white/40 bg-white/10' : 'border-white/10'}`}>
            <Filter size={12} />Filtres
          </button>

          {/* Alertes badge */}
          {alertesCritiques > 0 && (
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-red-600/80 text-white text-xs font-medium">
              <Bell size={11} />{alertesCritiques} critique{alertesCritiques > 1 ? 's' : ''}
            </div>
          )}

          {/* Data freshness */}
          <div className="flex items-center gap-1.5 text-[10px] text-white/40">
            <RefreshCw size={10} />16/09/2026 · 08h00
          </div>

          {/* Export */}
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-white/10 text-white hover:bg-white/20 transition-all border border-white/10">
            <Download size={12} />Exporter
          </button>
        </div>

        {/* Barre de filtres avancés */}
        {showFiltres && (
          <div className="px-5 pb-3 flex gap-3 flex-wrap">
            {(['Département', 'Direction', 'PAP / Hors PAP', 'Source financement', 'Statut'] as const).map(f => (
              <select key={f} className="text-[11px] bg-white/10 text-white/70 border border-white/15 rounded px-2 py-1 outline-none">
                <option>{f}</option>
              </select>
            ))}
            <button className="text-[11px] text-white/40 hover:text-white/70 underline">Réinitialiser</button>
          </div>
        )}
      </div>

      <div className="p-5 space-y-5 max-w-[1600px] mx-auto">

        {/* ── Ligne 1 : Santé + KPIs principaux ─────────────────────────── */}
        <div className="grid grid-cols-[auto_1fr] gap-4">

          {/* Jauge de santé */}
          <div className="bg-white rounded-xl border border-gray-200 px-6 py-4 flex flex-col items-center justify-center min-w-[160px]">
            <SanteGauge score={sante} />
            <div className="mt-3 w-full space-y-1 text-[10px] text-gray-400">
              <div className="flex justify-between"><span>Exe. financière</span><span className="font-medium text-gray-600">{txEngagement}%</span></div>
              <div className="flex justify-between"><span>Exe. physique</span><span className="font-medium text-gray-600">{txPhysique}%</span></div>
              <div className="flex justify-between"><span>Taux paiement</span><span className="font-medium text-gray-600">{txPaiement}%</span></div>
            </div>
          </div>

          {/* KPI cards */}
          <div className="grid grid-cols-6 gap-3">
            {[
              { label: 'Budget voté', val: budgetTotal, sub: 'Budget officiel 2026', color: C.navy, bg: '#EDF2FB', icon: <Target size={14} /> },
              { label: 'Crédits engagés', val: engage, sub: `${txEngagement}% du budget`, color: C.green, bg: '#F0FDF6', icon: <TrendingUp size={14} /> },
              { label: 'Crédits liquidés', val: liquide, sub: `${pct(liquide, budgetTotal)}% du budget`, color: '#4338CA', bg: '#EEF2FF', icon: <CheckCircle size={14} /> },
              { label: 'Ordonnancés', val: ordonnance, sub: `${pct(ordonnance, budgetTotal)}% du budget`, color: '#7C3AED', bg: '#FDF4FF', icon: <Activity size={14} /> },
              { label: 'Crédits payés', val: paye, sub: `${txPaiement}% du budget`, color: '#B45309', bg: '#FFFBEB', icon: <Zap size={14} /> },
              { label: 'Crédits disponibles', val: disponible, sub: `${pct(disponible, budgetTotal)}% restant`, color: '#0F766E', bg: '#F0FDFA', icon: <DollarSign size={14} /> },
            ].map((k, i) => (
              <div key={i} className="rounded-xl border border-gray-200 bg-white p-4 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">{k.label}</span>
                  <span style={{ color: k.color }}>{k.icon}</span>
                </div>
                <div className="text-[22px] font-bold leading-tight" style={{ color: k.color }}>{fmt(k.val)}</div>
                <div className="text-[10px] text-gray-400">{k.sub}</div>
                <div className="h-0.5 rounded-full mt-auto" style={{ background: k.bg }}>
                  <div className="h-full rounded-full" style={{ width: `${Math.min(pct(k.val, budgetTotal), 100)}%`, background: k.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Ligne 2 : PAP vs Fonctionnement ───────────────────────────── */}
        <div className="grid grid-cols-3 gap-4">
          {/* Fonctionnement */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-xs font-bold text-[#0B1C3E]">Fonctionnement / Hors PAP</div>
                <div className="text-[10px] text-gray-400">Budget officiel · chap. 66, 60-61, 64, 67</div>
              </div>
              <span className="bg-blue-100 text-blue-700 text-[10px] font-semibold px-2 py-0.5 rounded">HORS PAP</span>
            </div>
            <div className="text-2xl font-bold text-[#0B1C3E]">{fmt(BUDGET_OFFICIEL.fonctionnement)}</div>
            <div className="text-[10px] text-gray-400 mb-3">{fmtFull(BUDGET_OFFICIEL.fonctionnement)} · {pct(BUDGET_OFFICIEL.fonctionnement, budgetTotal)}% du budget total</div>
            {[
              { label: 'Personnel', val: 11_586_264_803, color: '#3B82F6' },
              { label: 'Biens & Services', val: 1_871_250_000, color: '#6366F1' },
              { label: 'Transferts', val: 210_000_000, color: '#8B5CF6' },
              { label: 'Charges financières', val: 10_000_000, color: '#A78BFA' },
            ].map(l => (
              <div key={l.label} className="mb-1.5">
                <div className="flex justify-between text-[10px] mb-0.5">
                  <span className="text-gray-600">{l.label}</span>
                  <span className="font-mono text-gray-500">{fmt(l.val)}</span>
                </div>
                <div className="h-1 rounded-full bg-gray-100">
                  <div className="h-full rounded-full" style={{ width: `${pct(l.val, BUDGET_OFFICIEL.fonctionnement)}%`, background: l.color }} />
                </div>
              </div>
            ))}
          </div>

          {/* Investissement / PAP */}
          <div className="bg-white rounded-xl border border-[#1A6B3A]/30 p-4" style={{ boxShadow: '0 0 0 1px rgba(26,107,58,0.15)' }}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-xs font-bold text-[#1A6B3A]">Investissement / PAP</div>
                <div className="text-[10px] text-gray-400">PAP + Assises + Dotations institutions</div>
              </div>
              <span className="bg-green-100 text-green-700 text-[10px] font-semibold px-2 py-0.5 rounded">PAP</span>
            </div>
            <div className="text-2xl font-bold text-[#1A6B3A]">{fmt(BUDGET_OFFICIEL.investissement)}</div>
            <div className="text-[10px] text-gray-400 mb-3">{fmtFull(BUDGET_OFFICIEL.investissement)} · {pct(BUDGET_OFFICIEL.investissement, budgetTotal)}% du budget total</div>
            {[
              { label: 'PAP (6 piliers)', val: BUDGET_OFFICIEL.pap, color: C.green },
              { label: 'Assises statutaires', val: BUDGET_OFFICIEL.assises, color: '#0D9488' },
              { label: 'Dotations institutions spécialisées', val: BUDGET_OFFICIEL.dotations, color: '#7C3AED' },
            ].map(l => (
              <div key={l.label} className="mb-1.5">
                <div className="flex justify-between text-[10px] mb-0.5">
                  <span className="text-gray-600">{l.label}</span>
                  <span className="font-mono text-gray-500">{fmt(l.val)}</span>
                </div>
                <div className="h-1 rounded-full bg-gray-100">
                  <div className="h-full rounded-full" style={{ width: `${pct(l.val, BUDGET_OFFICIEL.investissement)}%`, background: l.color }} />
                </div>
              </div>
            ))}
            <div className="mt-3 pt-2 border-t border-green-100">
              <div className="text-[10px] text-gray-400 flex justify-between">
                <span>PAP engagé</span>
                <span className="font-medium text-green-700">{fmt(b.engagePAP)} · {pct(b.engagePAP, BUDGET_OFFICIEL.pap)}%</span>
              </div>
            </div>
          </div>

          {/* Équipements + Recettes */}
          <div className="space-y-3">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="text-xs font-bold text-gray-700 mb-1">Équipements</div>
              <div className="text-xl font-bold text-orange-600">{fmt(BUDGET_OFFICIEL.equipements)}</div>
              <div className="text-[10px] text-gray-400">{pct(BUDGET_OFFICIEL.equipements, budgetTotal)}% du budget total</div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="text-xs font-bold text-gray-700 mb-2">Recettes — Contributions États membres</div>
              <div className="text-xl font-bold text-blue-700">{fmt(BUDGET_OFFICIEL.recettesInternes)}</div>
              <div className="text-[10px] text-gray-400 mb-2">11 États membres · {pct(BUDGET_OFFICIEL.recettesInternes, budgetTotal)}% du budget</div>
              <div className="h-1.5 rounded-full bg-gray-100">
                <div className="h-full rounded-full bg-blue-500" style={{ width: `${pct(BUDGET_OFFICIEL.recettesInternes, budgetTotal)}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* ── Ligne 3 : Chaîne de la dépense ────────────────────────────── */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-[#0B1C3E]">Chaîne de la dépense — Vue consolidée</h3>
              <p className="text-[10px] text-gray-400 mt-0.5">EB → Engagement → Liquidation → Ordonnancement → Paiement · Exercice 2026</p>
            </div>
            <button onClick={() => onNavigate('eb-list')} className="text-xs text-blue-600 hover:underline flex items-center gap-1">
              Voir tout <ChevronRight size={11} />
            </button>
          </div>
          <div className="flex items-stretch gap-2">
            {CHAINE.map((c, i) => (
              <div key={c.code} className="flex items-center gap-2 flex-1">
                <button
                  onClick={() => onNavigate(c.page)}
                  className="flex-1 rounded-lg border p-3 hover:shadow-sm transition-all cursor-pointer text-left group"
                  style={{ borderColor: `${c.color}30`, background: `${c.color}08` }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5" style={{ color: c.color }}>{c.icon}
                      <span className="text-[10px] font-bold uppercase tracking-wide">{c.code}</span>
                    </div>
                    {c.enRetard > 0 && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-600">{c.enRetard} retard{c.enRetard > 1 ? 's' : ''}</span>
                    )}
                  </div>
                  <div className="text-[11px] font-semibold text-gray-700 mb-2">{c.etape}</div>
                  <div className="text-base font-bold" style={{ color: c.color }}>{fmt(c.montant)}</div>
                  <div className="text-[10px] text-gray-400">{c.total} dossiers · moy. {c.delaiMoyen}j</div>
                  <div className="mt-2 grid grid-cols-3 gap-1">
                    <div className="text-center">
                      <div className="text-[10px] font-semibold text-blue-600">{c.enCours}</div>
                      <div className="text-[9px] text-gray-400">En cours</div>
                    </div>
                    <div className="text-center">
                      <div className="text-[10px] font-semibold text-green-600">{c.valides}</div>
                      <div className="text-[9px] text-gray-400">Validés</div>
                    </div>
                    <div className="text-center">
                      <div className="text-[10px] font-semibold text-red-600">{c.retournes + c.rejetes}</div>
                      <div className="text-[9px] text-gray-400">Retours</div>
                    </div>
                  </div>
                </button>
                {i < CHAINE.length - 1 && (
                  <ArrowRight size={14} className="text-gray-300 shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Ligne 4 : Graphique mensuel + Alertes ─────────────────────── */}
        <div className="grid grid-cols-[1fr_380px] gap-4">
          {/* Tendance mensuelle */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-sm text-[#0B1C3E]">Tendance d'exécution mensuelle</h3>
                <p className="text-[10px] text-gray-400 mt-0.5">Réalisé Jan–Sep · Projection Oct–Déc (traits pointillés)</p>
              </div>
              <div className="flex gap-3 text-[10px] text-gray-500">
                <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-green-500 inline-block" />Engagé</span>
                <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-blue-500 inline-block" />Liquidé</span>
                <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-orange-400 inline-block" />Payé</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={MONTHLY_FULL} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="gEngage" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={C.green} stopOpacity={0.15} />
                    <stop offset="95%" stopColor={C.green} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gPaye" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={C.orange} stopOpacity={0.12} />
                    <stop offset="95%" stopColor={C.orange} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
                <XAxis dataKey="mois" tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}M`} />
                <Tooltip
                  contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #E5E7EB' }}
                  formatter={(v: number | null) => v ? [`${v} M FCFA`] : ['—']} />
                <Area type="monotone" dataKey="engage" stroke={C.green} fill="url(#gEngage)" strokeWidth={2} dot={false} connectNulls />
                <Area type="monotone" dataKey="liquide" stroke="#3B82F6" fill="none" strokeWidth={1.5} dot={false} connectNulls strokeDasharray="0" />
                <Area type="monotone" dataKey="paye" stroke={C.orange} fill="url(#gPaye)" strokeWidth={1.5} dot={false} connectNulls />
                <Area type="monotone" dataKey="projEngage" stroke={C.green} fill="none" strokeWidth={1.5} strokeDasharray="5 3" dot={false} />
                <Area type="monotone" dataKey="projPaye" stroke={C.orange} fill="none" strokeWidth={1.5} strokeDasharray="5 3" dot={false} />
                <ReferenceLine x="Sep" stroke="#9CA3AF" strokeDasharray="3 3" label={{ value: "Auj.", position: "top", fontSize: 9, fill: '#9CA3AF' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Alertes exécutives */}
          <div className="bg-white rounded-xl border border-gray-200 flex flex-col">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-sm text-[#0B1C3E]">Alertes exécutives</h3>
              <div className="flex gap-1">
                {(['TOUS', 'CRITIQUE', 'IMPORTANT', 'ATTENTION'] as const).map(n => (
                  <button key={n} onClick={() => setAlerteNiveau(n)}
                    className={`px-1.5 py-0.5 text-[9px] font-semibold rounded transition-all ${alerteNiveau === n ? 'bg-[#0B1C3E] text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                    {n === 'TOUS' ? 'Tous' : n}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-gray-50" style={{ maxHeight: 280 }}>
              {alertesFiltrees.map(a => (
                <div key={a.id} className="px-4 py-2.5 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-2">
                    <NiveauIcon niveau={a.niveau} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <NiveauBadge niveau={a.niveau} />
                        <span className="text-[10px] text-gray-400">{a.anciennete}j</span>
                      </div>
                      <div className="text-[11px] font-medium text-gray-800 leading-tight">{a.message}</div>
                      <div className="text-[10px] text-gray-400 mt-0.5">{a.structure} · {a.responsable}</div>
                      {a.montant && (
                        <div className="text-[10px] font-mono text-gray-500">{fmt(a.montant)} FCFA</div>
                      )}
                      {a.page && (
                        <button onClick={() => onNavigate(a.page!)}
                          className="text-[10px] text-blue-600 hover:underline flex items-center gap-0.5 mt-0.5">
                          {a.action} <ChevronRight size={9} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-4 py-2 border-t border-gray-100 text-center">
              <button className="text-[10px] text-blue-600 hover:underline">Voir toutes les alertes ({ALERTES_EXEC.length})</button>
            </div>
          </div>
        </div>

        {/* ── Ligne 5 : Piliers PAP + Matrice ───────────────────────────── */}
        <div className="grid grid-cols-[1fr_340px] gap-4">
          {/* Performance PAP par pilier */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-sm text-[#0B1C3E]">PAP — Performance par Pilier</h3>
                <p className="text-[10px] text-gray-400 mt-0.5">Source officielle : BUDGET_EXERCICE_2026_Final.pdf · 6 piliers stratégiques</p>
              </div>
              <button onClick={() => onNavigate('pap')} className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                Vue PAP <ChevronRight size={11} />
              </button>
            </div>
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50 rounded">
                  <th className="text-left px-3 py-2 text-gray-400 font-medium">Pilier</th>
                  <th className="text-right px-3 py-2 text-gray-400 font-medium">Budget FCFA</th>
                  <th className="text-right px-3 py-2 text-gray-400 font-medium">Engagé</th>
                  <th className="text-right px-3 py-2 text-gray-400 font-medium">Payé</th>
                  <th className="px-3 py-2 text-gray-400 font-medium w-28">Exe. fin.</th>
                  <th className="px-3 py-2 text-gray-400 font-medium w-28">Exe. phys.</th>
                  <th className="text-center px-3 py-2 text-gray-400 font-medium">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {PILIER_PERFORMANCE.map((p, i) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0"
                          style={{ background: [C.navy, C.green, C.red, C.teal, C.orange, C.purple][i] }}>
                          {i + 1}
                        </span>
                        <span className="text-[11px] font-medium text-gray-700 leading-tight">{p.libelle}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono text-gray-600">{fmt(p.budget)}</td>
                    <td className="px-3 py-2.5 text-right font-mono text-green-700">{fmt(p.engage)}</td>
                    <td className="px-3 py-2.5 text-right font-mono text-orange-600">{fmt(p.paye)}</td>
                    <td className="px-3 py-2.5"><TauxBar value={p.tauxFinancier} color={C.green} /></td>
                    <td className="px-3 py-2.5"><TauxBar value={p.tauxPhysique} color={C.teal} /></td>
                    <td className="px-3 py-2.5 text-center">
                      <span className={`w-2 h-2 rounded-full inline-block ${p.statut === 'VERT' ? 'bg-green-500' : p.statut === 'ORANGE' ? 'bg-orange-400' : 'bg-red-500'}`} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Matrice physique / financière */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="font-bold text-sm text-[#0B1C3E] mb-1">Matrice physique / financière</h3>
            <p className="text-[10px] text-gray-400 mb-3">Exe. financière (X) vs Exe. physique (Y) par structure</p>
            <ResponsiveContainer width="100%" height={220}>
              <ScatterChart margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
                <XAxis type="number" dataKey="x" name="Financier" domain={[0, 80]} tick={{ fontSize: 9 }} label={{ value: 'Exe. fin. (%)', position: 'insideBottom', dy: 12, fontSize: 9, fill: '#9CA3AF' }} />
                <YAxis type="number" dataKey="y" name="Physique" domain={[0, 80]} tick={{ fontSize: 9 }} label={{ value: 'Exe. phys. (%)', angle: -90, position: 'insideLeft', fontSize: 9, fill: '#9CA3AF' }} />
                <ReferenceLine x={50} stroke="#E5E7EB" strokeDasharray="3 3" />
                <ReferenceLine y={50} stroke="#E5E7EB" strokeDasharray="3 3" />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ payload }) => {
                    if (!payload?.length) return null
                    const d = payload[0].payload
                    return (
                      <div className="bg-white border border-gray-200 rounded-lg p-2.5 text-xs shadow-lg">
                        <div className="font-bold text-gray-800 mb-1">{d.name}</div>
                        <div className="text-gray-500">Financier : <span className="font-medium text-gray-700">{d.x}%</span></div>
                        <div className="text-gray-500">Physique : <span className="font-medium text-gray-700">{d.y}%</span></div>
                        {d.alertes > 0 && <div className="text-red-600 mt-0.5">{d.alertes} alerte{d.alertes > 1 ? 's' : ''}</div>}
                      </div>
                    )
                  }}
                />
                <Scatter data={MATRIX_DATA} fill={C.green}>
                  {MATRIX_DATA.map((d, i) => (
                    <Cell key={i} fill={d.alertes >= 2 ? C.red : d.alertes === 1 ? C.orange : C.green} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
            <div className="flex gap-3 text-[9px] text-gray-500 mt-1">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-600 inline-block" />Normal</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500 inline-block" />À surveiller</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-600 inline-block" />Critique</span>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-1 text-[9px] text-gray-400">
              <div className="bg-red-50 rounded p-1.5 text-red-600">↖ Sur-consommation financière</div>
              <div className="bg-green-50 rounded p-1.5 text-green-700 text-right">↗ Performance équilibrée</div>
              <div className="bg-gray-50 rounded p-1.5">↙ Sous-exécution</div>
              <div className="bg-amber-50 rounded p-1.5 text-amber-700 text-right">↘ Réalisation sans dépense</div>
            </div>
          </div>
        </div>

        {/* ── Ligne 6 : Exécution par structure ─────────────────────────── */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-[#0B1C3E]">Exécution budgétaire par structure</h3>
              <p className="text-[10px] text-gray-400 mt-0.5">Hiérarchie officielle CEEAC · source : Référentiel organisationnel 2026</p>
            </div>
            <button onClick={() => onNavigate('referentiel')} className="text-xs text-blue-600 hover:underline flex items-center gap-1">
              Référentiel org. <ChevronRight size={11} />
            </button>
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-3 py-2 text-gray-400 font-medium">Code</th>
                <th className="text-left px-3 py-2 text-gray-400 font-medium">Structure</th>
                <th className="text-right px-3 py-2 text-gray-400 font-medium">Budget FCFA</th>
                <th className="text-right px-3 py-2 text-gray-400 font-medium">Engagé</th>
                <th className="text-right px-3 py-2 text-gray-400 font-medium">Payé</th>
                <th className="px-3 py-2 text-gray-400 font-medium w-32">Exe. financière</th>
                <th className="px-3 py-2 text-gray-400 font-medium w-32">Exe. physique</th>
                <th className="text-center px-3 py-2 text-gray-400 font-medium">Alertes</th>
                <th className="px-3 py-2" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {STRUCTURES_EXEC.map(s => (
                <tr key={s.code} className="hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-2.5 font-mono text-gray-400 text-[10px]">{s.code}</td>
                  <td className="px-3 py-2.5 font-medium text-gray-800">{s.libelle}</td>
                  <td className="px-3 py-2.5 text-right font-mono">{fmt(s.budget)}</td>
                  <td className="px-3 py-2.5 text-right font-mono text-green-700">{fmt(s.engage)}</td>
                  <td className="px-3 py-2.5 text-right font-mono text-orange-600">{fmt(s.paye)}</td>
                  <td className="px-3 py-2.5"><TauxBar value={s.txFin} /></td>
                  <td className="px-3 py-2.5"><TauxBar value={s.txPhys} color={C.teal} /></td>
                  <td className="px-3 py-2.5 text-center">
                    {s.alertes > 0
                      ? <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold ${s.alertes >= 2 ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                          <AlertTriangle size={9} />{s.alertes}
                        </span>
                      : <CheckCircle size={12} className="text-green-400 mx-auto" />
                    }
                  </td>
                  <td className="px-3 py-2.5">
                    <button className="text-gray-300 hover:text-blue-500 transition-colors">
                      <Eye size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Ligne 7 : Décisions + Projection ──────────────────────────── */}
        <div className="grid grid-cols-[1fr_360px] gap-4">
          {/* Mes décisions à prendre */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: C.navy }}>
                <Bell size={13} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#0B1C3E]">Mes décisions à prendre</h3>
                <p className="text-[10px] text-gray-400">Vue {PROFILS.find(p => p.id === profil)?.label} · {decisions.length} dossier{decisions.length > 1 ? 's' : ''}</p>
              </div>
            </div>
            {decisions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-gray-300">
                <CheckCircle size={32} />
                <div className="text-sm mt-2 text-gray-400">Aucune décision en attente</div>
              </div>
            ) : (
              <div className="space-y-2">
                {decisions.map((d, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all">
                    <div className="shrink-0 w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                      <FileText size={13} className="text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] font-mono text-gray-400">{d.ref}</span>
                        <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">{d.etape}</span>
                        <span className={`text-[9px] font-semibold ${PrioriteColor(d.priorite)}`}>{d.priorite}</span>
                      </div>
                      <div className="text-[11px] font-medium text-gray-800 truncate">{d.objet}</div>
                      <div className="flex items-center gap-3 mt-0.5 text-[10px] text-gray-400">
                        <span>{d.structure}</span>
                        <span className="flex items-center gap-1"><Clock size={9} />{d.delai}j écoulé{d.delai > 1 ? 's' : ''}</span>
                        {d.montant && <span className="font-mono">{fmt(d.montant)}</span>}
                      </div>
                    </div>
                    <button onClick={() => onNavigate(d.page)}
                      className="shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors">
                      {d.action} <ChevronRight size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Projection fin d'exercice */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: C.teal }}>
                <TrendingUp size={13} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#0B1C3E]">Projection fin d'exercice</h3>
                <p className="text-[10px] text-gray-400">Basée sur le rythme Jan–Sep 2026</p>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Taux d\'engagement projeté', val: '74%', sub: 'vs. 100% attendu', alerte: true },
                { label: 'Taux de paiement projeté', val: '48%', sub: 'vs. 85% recommandé', alerte: true },
                { label: 'Rythme mensuel moyen', val: `${fmt(engage / 9)} / mois`, sub: 'Oct–Déc : accélération nécessaire', alerte: false },
                { label: 'Crédits à risque de non-consommation', val: fmt(budgetTotal * 0.26), sub: '26% du budget total', alerte: true },
              ].map((r, i) => (
                <div key={i} className="flex items-start justify-between gap-2 py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <div className="text-[11px] font-medium text-gray-700">{r.label}</div>
                    <div className="text-[10px] text-gray-400 mt-0.5">{r.sub}</div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-sm font-bold" style={{ color: r.alerte ? C.orange : C.green }}>{r.val}</span>
                    {r.alerte && <AlertTriangle size={11} className="text-orange-400" />}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-auto pt-3 border-t border-gray-100">
              <div className="text-[10px] text-gray-400 italic flex items-center gap-1">
                <Info size={10} />Les projections sont calculées mécaniquement — elles ne substituent pas à l'analyse opérationnelle.
              </div>
            </div>
          </div>
        </div>

        {/* ── Ligne 8 : Sources de financement + Qualité données ────────── */}
        <div className="grid grid-cols-[1fr_280px] gap-4">
          {/* Sources de financement */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="font-bold text-sm text-[#0B1C3E] mb-4">Sources de financement — Exécution</h3>
            <div className="space-y-2.5">
              {SOURCE_FINANCEMENT.map((s, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-gray-700">{s.source}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400 font-mono">{fmt(s.consomme)} / {fmt(s.budget)}</span>
                      <span className="font-semibold w-8 text-right" style={{ color: s.taux >= 70 ? C.green : s.taux >= 50 ? C.orange : C.red }}>{s.taux}%</span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100">
                    <div className="h-full rounded-full transition-all"
                      style={{ width: `${s.taux}%`, background: s.taux >= 70 ? C.green : s.taux >= 50 ? C.orange : C.red }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Qualité des données */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="font-bold text-sm text-[#0B1C3E] mb-3">Qualité des données</h3>
            <div className="space-y-2">
              {[
                { label: 'Données validées', val: 87, color: C.green },
                { label: 'Données provisoires', val: 10, color: C.orange },
                { label: 'Données manquantes', val: 3, color: C.red },
              ].map(q => (
                <div key={q.label} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: q.color }} />
                  <span className="text-[11px] text-gray-600 flex-1">{q.label}</span>
                  <span className="text-[11px] font-bold" style={{ color: q.color }}>{q.val}%</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 space-y-1 text-[10px] text-gray-400">
              <div className="flex justify-between"><span>Dernière actualisation</span><span className="font-medium text-gray-600">16/09/2026 08:00</span></div>
              <div className="flex justify-between"><span>Source budget</span><span className="font-medium text-gray-600">PDF officiel 2026</span></div>
              <div className="flex justify-between"><span>Source org.</span><span className="font-medium text-gray-600">Référentiel 2026</span></div>
              <div className="flex justify-between"><span>Indicateurs Q3</span><span className="font-semibold text-orange-600">En attente</span></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
