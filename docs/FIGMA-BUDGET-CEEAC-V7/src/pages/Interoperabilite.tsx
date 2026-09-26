import React, { useState, useMemo } from 'react'
import type { Page } from '../types'
import {
  Upload, Download, Link2, Activity, AlertTriangle, CheckCircle,
  XCircle, Clock, RefreshCw, Search, Filter, Plus, X,
  ChevronRight, ChevronDown, FileText, Wifi, WifiOff,
  Database, Shield, Zap, Eye, Play, Pause, RotateCcw,
  Code, Globe, Server, BarChart2, Inbox, Send,
  ArrowRight, ArrowLeft, Check, AlertCircle, Info,
  ExternalLink, Copy, MoreVertical, Settings,
} from 'lucide-react'

interface Props { onNavigate: (page: Page, id?: string) => void }

type TabId = 'dashboard' | 'imports' | 'exports' | 'api' | 'integrations' | 'supervision'
type ImportStatus =
  | 'BROUILLON' | 'CHARGE' | 'ANALYSE' | 'ERREURS' | 'A_CORRIGER'
  | 'PRET' | 'EN_VALIDATION' | 'VALIDE' | 'EN_COURS' | 'IMPORTE'
  | 'IMPORTE_AVT' | 'ECHEC' | 'ANNULE'
type ExportStatus = 'DEMANDE' | 'EN_ATTENTE' | 'EN_GENERATION' | 'DISPONIBLE' | 'EXPIRE' | 'ERREUR'
type IntegStatus = 'OPERATIONNEL' | 'DEGRADE' | 'ERREUR' | 'DESACTIVE' | 'MAINTENANCE'
type WizardStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
type MappingStatus = 'AUTO' | 'A_VERIFIER' | 'OBLIGATOIRE' | 'IGNORE' | 'INCOMPATIBLE'

const IMP_CFG: Record<ImportStatus, { label: string; color: string; bg: string }> = {
  BROUILLON:    { label: 'Brouillon',            color: '#6B7280', bg: '#F3F4F6' },
  CHARGE:       { label: 'Fichier chargé',        color: '#1D4ED8', bg: '#EFF6FF' },
  ANALYSE:      { label: 'Analyse',               color: '#7C3AED', bg: '#F5F3FF' },
  ERREURS:      { label: 'Erreurs détectées',     color: '#B91C1C', bg: '#FEF2F2' },
  A_CORRIGER:   { label: 'À corriger',            color: '#D97706', bg: '#FFFBEB' },
  PRET:         { label: 'Prêt',                  color: '#0369A1', bg: '#E0F2FE' },
  EN_VALIDATION:{ label: 'En validation',         color: '#1D4ED8', bg: '#EFF6FF' },
  VALIDE:       { label: 'Validé',                color: '#15803D', bg: '#F0FDF4' },
  EN_COURS:     { label: 'Import en cours',       color: '#7C3AED', bg: '#F5F3FF' },
  IMPORTE:      { label: 'Importé',               color: '#15803D', bg: '#F0FDF4' },
  IMPORTE_AVT:  { label: 'Importé (avertiss.)',   color: '#D97706', bg: '#FFFBEB' },
  ECHEC:        { label: 'Échec',                 color: '#B91C1C', bg: '#FEF2F2' },
  ANNULE:       { label: 'Annulé',                color: '#374151', bg: '#F9FAFB' },
}

const EXP_CFG: Record<ExportStatus, { label: string; color: string; bg: string }> = {
  DEMANDE:       { label: 'Demandé',        color: '#6B7280', bg: '#F3F4F6' },
  EN_ATTENTE:    { label: 'En attente',     color: '#D97706', bg: '#FFFBEB' },
  EN_GENERATION: { label: 'En génération', color: '#7C3AED', bg: '#F5F3FF' },
  DISPONIBLE:    { label: 'Disponible',     color: '#15803D', bg: '#F0FDF4' },
  EXPIRE:        { label: 'Expiré',         color: '#92400E', bg: '#FFF7ED' },
  ERREUR:        { label: 'Erreur',         color: '#B91C1C', bg: '#FEF2F2' },
}

const INTG_CFG: Record<IntegStatus, { label: string; color: string; bg: string; dot: string }> = {
  OPERATIONNEL: { label: 'Opérationnel', color: '#15803D', bg: '#F0FDF4', dot: '#22C55E' },
  DEGRADE:      { label: 'Dégradé',      color: '#D97706', bg: '#FFFBEB', dot: '#F59E0B' },
  ERREUR:       { label: 'En erreur',    color: '#B91C1C', bg: '#FEF2F2', dot: '#EF4444' },
  DESACTIVE:    { label: 'Désactivé',    color: '#6B7280', bg: '#F3F4F6', dot: '#9CA3AF' },
  MAINTENANCE:  { label: 'Maintenance',  color: '#7C3AED', bg: '#F5F3FF', dot: '#A78BFA' },
}

interface ImportItem {
  id: string; ref: string; type: string; module: string; fichier: string
  utilisateur: string; date: string; lignes: number; valides: number
  erreurs: number; avertissements: number; status: ImportStatus; duree: string
}

interface ExportItem {
  id: string; ref: string; type: string; utilisateur: string; date: string
  format: string; volume: string; status: ExportStatus; duree: string
}

interface Integration {
  id: string; nom: string; type: string; sens: '→' | '←' | '↔'
  protocole: string; frequence: string; dernierSync: string
  status: IntegStatus; latence: string; disponibilite: number
}

interface ApiEndpoint {
  path: string; methode: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  version: string; description: string; status: 'ACTIF' | 'DEPRECIE' | 'BETA'
  consommation: number; derniereUtil: string
}

const IMPORTS: ImportItem[] = [
  { id: 'i1', ref: 'IMP-2026-0042', type: 'Budget initial', module: 'Budget', fichier: 'Budget_CEEAC_2026_v3.xlsx', utilisateur: 'A. MBONGO', date: '2026-01-15', lignes: 847, valides: 841, erreurs: 0, avertissements: 6, status: 'IMPORTE_AVT', duree: '2m 18s' },
  { id: 'i2', ref: 'IMP-2026-0063', type: 'PAP 2026', module: 'PAP', fichier: 'PAP_CEEAC_2026.xlsx', utilisateur: 'R. FOTSO', date: '2026-02-03', lignes: 312, valides: 312, erreurs: 0, avertissements: 0, status: 'IMPORTE', duree: '45s' },
  { id: 'i3', ref: 'IMP-2026-0091', type: 'Tiers', module: 'Tiers', fichier: 'fournisseurs_Q2.csv', utilisateur: 'C. ABENA', date: '2026-07-01', lignes: 145, valides: 138, erreurs: 7, avertissements: 2, status: 'ERREURS', duree: '12s' },
  { id: 'i4', ref: 'IMP-2026-0108', type: 'Relevé bancaire', module: 'Paiements', fichier: 'releve_BEAC_aout2026.csv', utilisateur: 'P. MOUKALA', date: '2026-09-01', lignes: 523, valides: 0, erreurs: 0, avertissements: 0, status: 'ANALYSE', duree: '—' },
  { id: 'i5', ref: 'IMP-2026-0115', type: 'Indicateurs S&E', module: 'Suivi-Évaluation', fichier: 'indicateurs_T3.xlsx', utilisateur: 'M. BELLO', date: '2026-09-08', lignes: 89, valides: 0, erreurs: 0, avertissements: 0, status: 'EN_VALIDATION', duree: '—' },
  { id: 'i6', ref: 'IMP-2026-0118', type: 'Budget révisé', module: 'Budget', fichier: 'DRA_2026_R1.xlsx', utilisateur: 'A. MBONGO', date: '2026-09-09', lignes: 0, valides: 0, erreurs: 0, avertissements: 0, status: 'BROUILLON', duree: '—' },
]

const EXPORTS: ExportItem[] = [
  { id: 'e1', ref: 'EXP-2026-0321', type: 'Exécution budgétaire', utilisateur: 'A. MBONGO', date: '2026-09-09', format: 'XLSX', volume: '2.4 MB', status: 'DISPONIBLE', duree: '18s' },
  { id: 'e2', ref: 'EXP-2026-0318', type: 'PAP — Performance T2', utilisateur: 'R. FOTSO', date: '2026-07-05', format: 'PDF', volume: '1.1 MB', status: 'DISPONIBLE', duree: '32s' },
  { id: 'e3', ref: 'EXP-2026-0315', type: 'Liste des engagements', utilisateur: 'C. ABENA', date: '2026-07-01', format: 'CSV', volume: '458 KB', status: 'EXPIRE', duree: '8s' },
  { id: 'e4', ref: 'EXP-2026-0319', type: 'Export BI — Taux exécution', utilisateur: 'D. NKOSI', date: '2026-09-08', format: 'JSON', volume: '—', status: 'EN_GENERATION', duree: '—' },
]

const INTEGRATIONS: Integration[] = [
  { id: 'int-1', nom: 'SIRH — Direction RH', type: 'SIRH', sens: '←', protocole: 'REST/OAuth2', frequence: 'Quotidienne', dernierSync: '2026-09-09 06:00', status: 'OPERATIONNEL', latence: '142 ms', disponibilite: 99.8 },
  { id: 'int-2', nom: 'Système Paie', type: 'Paie', sens: '↔', protocole: 'SFTP', frequence: 'Mensuelle', dernierSync: '2026-09-01 02:00', status: 'OPERATIONNEL', latence: '—', disponibilite: 98.5 },
  { id: 'int-3', nom: 'Logiciel Comptable', type: 'Comptabilité', sens: '→', protocole: 'REST/API Key', frequence: 'Temps réel', dernierSync: '2026-09-09 14:22', status: 'DEGRADE', latence: '2 400 ms', disponibilite: 87.2 },
  { id: 'int-4', nom: 'BEAC — Banque centrale', type: 'Banque', sens: '↔', protocole: 'SFTP/PGP', frequence: 'Quotidienne', dernierSync: '2026-09-08 18:00', status: 'OPERATIONNEL', latence: '—', disponibilite: 99.9 },
  { id: 'int-5', nom: 'Power BI institutionnel', type: 'BI', sens: '→', protocole: 'REST/OAuth2', frequence: 'Toutes les 4h', dernierSync: '2026-09-09 12:00', status: 'OPERATIONNEL', latence: '312 ms', disponibilite: 99.1 },
  { id: 'int-6', nom: 'GED — Archives CEEAC', type: 'GED', sens: '↔', protocole: 'REST/JWT', frequence: 'Temps réel', dernierSync: '2026-09-09 14:15', status: 'ERREUR', latence: '—', disponibilite: 41.0 },
  { id: 'int-7', nom: 'EU Delegation EDF', type: 'Partenaire', sens: '←', protocole: 'SFTP', frequence: 'Mensuelle', dernierSync: '2026-08-31', status: 'DESACTIVE', latence: '—', disponibilite: 0 },
]

const API_ENDPOINTS: ApiEndpoint[] = [
  { path: '/api/v1/budgets', methode: 'GET', version: 'v1', description: 'Liste des budgets par exercice', status: 'ACTIF', consommation: 2847, derniereUtil: 'il y a 2 min' },
  { path: '/api/v1/lignes-budgetaires', methode: 'GET', version: 'v1', description: 'Lignes budgétaires filtrables', status: 'ACTIF', consommation: 1523, derniereUtil: 'il y a 5 min' },
  { path: '/api/v1/eb', methode: 'GET', version: 'v1', description: 'Expressions de Besoin', status: 'ACTIF', consommation: 892, derniereUtil: 'il y a 18 min' },
  { path: '/api/v1/engagements', methode: 'GET', version: 'v1', description: 'Engagements budgétaires', status: 'ACTIF', consommation: 741, derniereUtil: 'il y a 1h' },
  { path: '/api/v1/paiements', methode: 'GET', version: 'v1', description: 'Paiements exécutés', status: 'ACTIF', consommation: 1102, derniereUtil: 'il y a 34 min' },
  { path: '/api/v1/indicateurs', methode: 'GET', version: 'v1', description: 'Indicateurs de performance PAP', status: 'ACTIF', consommation: 438, derniereUtil: 'il y a 2h' },
  { path: '/api/v1/tiers', methode: 'GET', version: 'v1', description: 'Référentiel tiers/fournisseurs', status: 'ACTIF', consommation: 215, derniereUtil: 'hier' },
  { path: '/api/v1/pap', methode: 'GET', version: 'v1', description: 'Plan Annuel de Performance', status: 'ACTIF', consommation: 567, derniereUtil: 'il y a 3h' },
  { path: '/api/v2/budgets', methode: 'POST', version: 'v2', description: 'Création/mise à jour Budget (v2)', status: 'BETA', consommation: 12, derniereUtil: 'il y a 3j' },
  { path: '/api/v0/exports', methode: 'GET', version: 'v0', description: 'Export legacy (déprécié)', status: 'DEPRECIE', consommation: 3, derniereUtil: 'il y a 14j' },
]

const IMPORT_TYPES = [
  { id: 'budget', icon: '📊', label: 'Budget initial / révisé', format: 'XLSX, CSV', desc: 'Lignes budgétaires, chapitres, articles, sources de financement', taille: '50 MB max' },
  { id: 'pap', icon: '🎯', label: 'PAP / RBM', format: 'XLSX, CSV', desc: 'Piliers, axes, produits, activités, indicateurs, cibles', taille: '20 MB max' },
  { id: 'tiers', icon: '👥', label: 'Tiers & Fournisseurs', format: 'XLSX, CSV, JSON', desc: 'Fournisseurs, consultants, bénéficiaires, IBAN', taille: '10 MB max' },
  { id: 'indicateurs', icon: '📈', label: 'Indicateurs S&E', format: 'XLSX, CSV', desc: 'Valeurs de réalisation, cibles, sources', taille: '5 MB max' },
  { id: 'releve', icon: '🏦', label: 'Relevés bancaires', format: 'CSV, MT940, OFX', desc: 'Mouvements bancaires pour rapprochement', taille: '10 MB max' },
  { id: 'contrats', icon: '📋', label: 'Contrats & Marchés', format: 'XLSX, CSV', desc: 'Marchés, contrats, avenants', taille: '15 MB max' },
  { id: 'nomenclature', icon: '🗂️', label: 'Nomenclature budgétaire', format: 'XLSX, CSV', desc: 'Chapitres, articles, paragraphes, nature économique', taille: '5 MB max' },
  { id: 'autre', icon: '📁', label: 'Autre (paramétrable)', format: 'XLSX, CSV, JSON, XML', desc: 'Type personnalisé selon modèle défini', taille: '20 MB max' },
]

const MAPPING_ROWS = [
  { source: 'CODE_LIGNE', cible: 'ligne_budgetaire.code', statut: 'AUTO' as MappingStatus, obligatoire: true },
  { source: 'LIBELLE', cible: 'ligne_budgetaire.libelle', statut: 'AUTO' as MappingStatus, obligatoire: true },
  { source: 'DOTATION_INIT', cible: 'dotation_initiale', statut: 'A_VERIFIER' as MappingStatus, obligatoire: true },
  { source: 'SOURCE_FIN', cible: 'source_financement.code', statut: 'AUTO' as MappingStatus, obligatoire: false },
  { source: 'STRUCTURE', cible: 'structure.code', statut: 'A_VERIFIER' as MappingStatus, obligatoire: true },
  { source: 'CHAP', cible: 'chapitre.code', statut: 'AUTO' as MappingStatus, obligatoire: true },
  { source: 'NATURE_ECO', cible: 'nature_economique', statut: 'AUTO' as MappingStatus, obligatoire: false },
  { source: 'COMMENTAIRE', cible: '—', statut: 'IGNORE' as MappingStatus, obligatoire: false },
  { source: 'COL_INCONNUE', cible: '—', statut: 'INCOMPATIBLE' as MappingStatus, obligatoire: false },
]

const MAP_CFG: Record<MappingStatus, { label: string; color: string; bg: string }> = {
  AUTO:        { label: 'Reconnu auto',  color: '#15803D', bg: '#F0FDF4' },
  A_VERIFIER:  { label: 'À confirmer',   color: '#D97706', bg: '#FFFBEB' },
  OBLIGATOIRE: { label: 'Obligatoire',   color: '#B91C1C', bg: '#FEF2F2' },
  IGNORE:      { label: 'Ignoré',        color: '#6B7280', bg: '#F3F4F6' },
  INCOMPATIBLE:{ label: 'Incompatible',  color: '#7C3AED', bg: '#F5F3FF' },
}

const ERRORS_LIST = [
  { ligne: 45, col: 'CODE_LIGNE', valeur: '60201', niveau: 'ERREUR', msg: 'Le code budgétaire 60201 existe déjà pour cet exercice.', correction: 'Vérifier le code ligne' },
  { ligne: 78, col: 'STRUCTURE', valeur: 'DIR-09', niveau: 'ERREUR', msg: 'La structure DIR-09 est inconnue dans le référentiel organisationnel.', correction: 'Créer ou corriger la structure' },
  { ligne: 112, col: 'SOURCE_FIN', valeur: 'PTF-X', niveau: 'AVERTISSEMENT', msg: 'La source de financement PTF-X n\'est pas active pour cet exercice.', correction: 'Vérifier la source de financement' },
  { ligne: 203, col: 'DOTATION_INIT', valeur: '-50000', niveau: 'ERREUR', msg: 'Les montants négatifs ne sont pas autorisés pour la dotation initiale.', correction: 'Corriger le montant' },
  { ligne: 445, col: 'LIBELLE', valeur: '', niveau: 'AVERTISSEMENT', msg: 'Le libellé est vide. Un libellé par défaut sera appliqué.', correction: 'Optionnel' },
]

const JOURNAL_ECHANGES = [
  { ts: '2026-09-09 14:22:15', source: 'BUDGET-CEEAC', cible: 'Comptabilité', interface: 'PAY-OUT', ref: 'PAY-2026-0891', op: 'TransmettrePaiement', vol: '1 ordre', duree: '1.2s', status: 'SUCCES' },
  { ts: '2026-09-09 14:18:03', source: 'SIRH', cible: 'BUDGET-CEEAC', interface: 'SIRH-IN', ref: 'SYNC-20260909-RH', op: 'SynchroniserAgents', vol: '12 agents', duree: '3.8s', status: 'SUCCES' },
  { ts: '2026-09-09 13:55:41', source: 'BUDGET-CEEAC', cible: 'GED', interface: 'GED-OUT', ref: 'ORD-2026-0412', op: 'ArchiverOrdonnancement', vol: '1 fichier', duree: '—', status: 'ECHEC' },
  { ts: '2026-09-09 12:00:00', source: 'BUDGET-CEEAC', cible: 'Power BI', interface: 'BI-OUT', ref: 'SYNC-20260909-BI', op: 'ExporterDonnees', vol: '45 290 lignes', duree: '28s', status: 'SUCCES' },
  { ts: '2026-09-09 10:44:12', source: 'BUDGET-CEEAC', cible: 'Comptabilité', interface: 'PAY-OUT', ref: 'PAY-2026-0887', op: 'TransmettrePaiement', vol: '3 ordres', duree: '2.1s', status: 'SUCCES' },
  { ts: '2026-09-09 06:00:00', source: 'SIRH', cible: 'BUDGET-CEEAC', interface: 'SIRH-IN', ref: 'SYNC-20260909-RH2', op: 'SynchroniserStructures', vol: '2 structures', duree: '1.4s', status: 'SUCCES' },
]

const fmt = (n: number) => n.toLocaleString('fr-FR')

export default function Interoperabilite({ onNavigate }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard')
  const [showWizard, setShowWizard] = useState(false)
  const [wizardStep, setWizardStep] = useState<WizardStep>(1)
  const [selectedImportType, setSelectedImportType] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [selectedApi, setSelectedApi] = useState<ApiEndpoint | null>(null)
  const [selectedInteg, setSelectedInteg] = useState<Integration | null>(null)
  const [errorFilter, setErrorFilter] = useState<'ALL' | 'ERREUR' | 'AVERTISSEMENT'>('ALL')
  const [progress, setProgress] = useState(0)
  const [showExportForm, setShowExportForm] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [showIncidentModal, setShowIncidentModal] = useState(false)
  const [showOpenApiModal, setShowOpenApiModal] = useState(false)
  const [copiedUrl, setCopiedUrl] = useState(false)
  const [showJournalExportModal, setShowJournalExportModal] = useState(false)
  const [showErreurDetailModal, setShowErreurDetailModal] = useState(false)
  const [showConnSettings, setShowConnSettings] = useState(false)
  const [testingConn, setTestingConn] = useState(false)
  const [testConnResult, setTestConnResult] = useState<'success' | 'failure' | null>(null)
  const [syncing, setSyncing] = useState(false)
  const [syncResult, setSyncResult] = useState<string | null>(null)
  const [autoMappingLoading, setAutoMappingLoading] = useState(false)
  const [showAutoMappingResult, setShowAutoMappingResult] = useState(false)
  const [incidentStatus, setIncidentStatus] = useState<'open' | 'treated'>('open')
  const [replayingError, setReplayingError] = useState(false)
  const [replayResult, setReplayResult] = useState<string | null>(null)
  const [incidentTitre, setIncidentTitre] = useState('')
  const [incidentPriorite, setIncidentPriorite] = useState('HAUTE')
  const [incidentDesc, setIncidentDesc] = useState('')

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3500) }

  const handleTestConn = () => {
    setTestingConn(true); setTestConnResult(null)
    setTimeout(() => { setTestingConn(false); setTestConnResult(Math.random() > 0.3 ? 'success' : 'failure') }, 1500)
  }
  const handleSync = () => {
    setSyncing(true); setSyncResult(null)
    const n = Math.floor(Math.random() * 500) + 50
    setTimeout(() => { setSyncing(false); setSyncResult(`Synchronisation terminée : ${n} enregistrements traités.`) }, 2000)
  }
  const handleAutoMapping = () => {
    setAutoMappingLoading(true); setShowAutoMappingResult(false)
    setTimeout(() => { setAutoMappingLoading(false); setShowAutoMappingResult(true) }, 1800)
  }
  const handleReplay = () => {
    setReplayingError(true); setReplayResult(null)
    setTimeout(() => { setReplayingError(false); setReplayResult('Transaction rejouée avec succès — référence : TRX-2026-' + Math.floor(Math.random() * 9000 + 1000)) }, 1500)
  }

  const filteredImports = useMemo(() => {
    return IMPORTS.filter(i => {
      const q = search.toLowerCase()
      const matchSearch = !q || i.ref.toLowerCase().includes(q) || i.type.toLowerCase().includes(q) || i.fichier.toLowerCase().includes(q)
      const matchStatus = !filterStatus || i.status === filterStatus
      return matchSearch && matchStatus
    })
  }, [search, filterStatus])

  const TABS = [
    { id: 'dashboard' as TabId, label: 'Tableau de bord', icon: <Activity size={13} /> },
    { id: 'imports' as TabId, label: 'Imports', icon: <Upload size={13} /> },
    { id: 'exports' as TabId, label: 'Exports', icon: <Download size={13} /> },
    { id: 'api' as TabId, label: 'API', icon: <Code size={13} /> },
    { id: 'integrations' as TabId, label: 'Intégrations', icon: <Link2 size={13} /> },
    { id: 'supervision' as TabId, label: 'Supervision & Journal', icon: <BarChart2 size={13} /> },
  ]

  const startImport = () => { setShowWizard(true); setWizardStep(1); setSelectedImportType(null); setProgress(0) }
  const closeWizard = () => { setShowWizard(false); setWizardStep(1) }
  const nextStep = () => { if (wizardStep < 10) { setWizardStep(s => (s + 1) as WizardStep); if (wizardStep === 8) { let p = 0; const t = setInterval(() => { p += 15; setProgress(Math.min(p, 100)); if (p >= 100) clearInterval(t) }, 200) } } }
  const prevStep = () => { if (wizardStep > 1) setWizardStep(s => (s - 1) as WizardStep) }

  const STEP_LABELS = ['Type', 'Fichier', 'Analyse', 'Mapping', 'Contrôles', 'Simulation', 'Prévisualisation', 'Validation', 'Exécution', 'Résultat']
  const errActive = ERRORS_LIST.filter(e => errorFilter === 'ALL' || e.niveau === errorFilter)

  const opColor = (s: string) => s === 'SUCCES' ? '#15803D' : s === 'ECHEC' ? '#B91C1C' : '#D97706'
  const opBg = (s: string) => s === 'SUCCES' ? '#F0FDF4' : s === 'ECHEC' ? '#FEF2F2' : '#FFFBEB'

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: '#F0F4FA' }}>
      {/* Header */}
      <div className="px-6 pt-5 pb-0 bg-white border-b" style={{ borderColor: '#E5E9F0' }}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-[17px] font-bold" style={{ color: '#0B1C3E' }}>Import, Export & Interopérabilité</h1>
            <p className="text-[12px] text-gray-500 mt-0.5">Module IEX — Couche d'échange de données de BUDGET-CEEAC</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn btn-outline btn-sm flex items-center gap-1.5" onClick={() => setShowExportForm(true)}>
              <Download size={13} /> Nouvel export
            </button>
            <button className="btn btn-primary btn-sm flex items-center gap-1.5" onClick={startImport}>
              <Upload size={13} /> Nouvel import
            </button>
          </div>
        </div>
        <div className="flex gap-0.5 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {TABS.map(t => (
            <button
              key={t.id}
              className={`tab-item flex items-center gap-1.5 whitespace-nowrap ${activeTab === t.id ? 'active' : ''}`}
              onClick={() => setActiveTab(t.id)}
            >
              {t.icon}{t.label}
              {t.id === 'integrations' && INTEGRATIONS.filter(i => i.status === 'ERREUR').length > 0 && (
                <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-full bg-red-500 text-white ml-1">
                  {INTEGRATIONS.filter(i => i.status === 'ERREUR').length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-6 py-4">

        {/* ── DASHBOARD ────────────────────────────────────────────── */}
        {activeTab === 'dashboard' && (
          <div className="space-y-4">
            {/* KPI row */}
            <div className="grid grid-cols-4 lg:grid-cols-6 gap-3">
              {[
                { label: 'Imports aujourd\'hui', value: '4', sub: '+2 vs hier', icon: <Upload size={14} />, c: '#0B1C3E' },
                { label: 'Imports réussis', value: '3', sub: '75% taux succès', icon: <CheckCircle size={14} />, c: '#15803D' },
                { label: 'Imports en erreur', value: '1', sub: 'Action requise', icon: <AlertTriangle size={14} />, c: '#B91C1C' },
                { label: 'Exports disponibles', value: '2', sub: 'Prêts au téléch.', icon: <Download size={14} />, c: '#1D4ED8' },
                { label: 'Intégrations actives', value: `${INTEGRATIONS.filter(i => i.status === 'OPERATIONNEL').length}`, sub: `/${INTEGRATIONS.length} total`, icon: <Wifi size={14} />, c: '#15803D' },
                { label: 'Incidents ouverts', value: '1', sub: 'GED indisponible', icon: <AlertCircle size={14} />, c: '#B91C1C' },
              ].map((k, i) => (
                <div key={i} className="kpi-card" style={{ padding: '10px 12px', cursor: 'pointer' }} onClick={() => setActiveTab(i < 3 ? 'imports' : i < 4 ? 'exports' : 'integrations')}>
                  <div className="flex items-center gap-1.5 mb-1" style={{ color: k.c }}>{k.icon}<span className="text-[10px] text-gray-500">{k.label}</span></div>
                  <div className="text-[16px] font-bold" style={{ color: k.c }}>{k.value}</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">{k.sub}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4">
              {/* Derniers imports */}
              <div className="card col-span-2">
                <div className="flex items-center justify-between mb-3">
                  <span className="section-title">Derniers imports</span>
                  <button className="text-[11px] text-blue-600 hover:underline" onClick={() => setActiveTab('imports')}>Voir tout</button>
                </div>
                <table className="data-table w-full">
                  <thead><tr><th>Référence</th><th>Type</th><th>Fichier</th><th className="text-center">Lignes</th><th>Statut</th></tr></thead>
                  <tbody>
                    {IMPORTS.slice(0, 5).map(i => {
                      const cfg = IMP_CFG[i.status]
                      return (
                        <tr key={i.id} className="cursor-pointer" onClick={() => setActiveTab('imports')}>
                          <td className="font-mono text-[11px] text-blue-600">{i.ref}</td>
                          <td className="text-[11px]">{i.type}</td>
                          <td className="text-[11px] text-gray-500 max-w-[140px] truncate">{i.fichier}</td>
                          <td className="text-center text-[11px]">{i.lignes || '—'}</td>
                          <td><span className="badge text-[9px]" style={{ background: cfg.bg, color: cfg.color }}>{cfg.label}</span></td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Intégrations status */}
              <div className="card">
                <div className="section-title mb-3">État des intégrations</div>
                <div className="space-y-2">
                  {INTEGRATIONS.map(int => {
                    const cfg = INTG_CFG[int.status]
                    return (
                      <div key={int.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer" onClick={() => { setSelectedInteg(int); setActiveTab('integrations') }}>
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: cfg.dot }} />
                        <div className="flex-1 min-w-0">
                          <div className="text-[11px] font-semibold text-gray-700 truncate">{int.nom}</div>
                          <div className="text-[9px] text-gray-400">{int.dernierSync}</div>
                        </div>
                        <span className="text-[9px] font-semibold flex-shrink-0" style={{ color: cfg.color }}>{cfg.label}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Journal récent */}
            <div className="card">
              <div className="flex items-center justify-between mb-3">
                <span className="section-title">Journal des échanges — Aujourd'hui</span>
                <button className="text-[11px] text-blue-600 hover:underline" onClick={() => setActiveTab('supervision')}>Voir tout</button>
              </div>
              <table className="data-table w-full">
                <thead><tr><th>Horodatage</th><th>Source</th><th>Cible</th><th>Interface</th><th>Opération</th><th>Volume</th><th>Durée</th><th>Statut</th></tr></thead>
                <tbody>
                  {JOURNAL_ECHANGES.slice(0, 4).map((j, i) => (
                    <tr key={i}>
                      <td className="font-mono text-[10px] text-gray-500">{j.ts}</td>
                      <td className="text-[11px]">{j.source}</td>
                      <td className="text-[11px]">{j.cible}</td>
                      <td><span className="badge text-[9px] bg-gray-100 text-gray-600">{j.interface}</span></td>
                      <td className="text-[11px] text-gray-600">{j.op}</td>
                      <td className="text-[11px] text-gray-500">{j.vol}</td>
                      <td className="text-[11px] font-mono text-gray-500">{j.duree}</td>
                      <td><span className="badge text-[9px]" style={{ background: opBg(j.status), color: opColor(j.status) }}>{j.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── IMPORTS ──────────────────────────────────────────────── */}
        {activeTab === 'imports' && (
          <div className="space-y-3">
            {/* Toolbar */}
            <div className="flex items-center gap-3">
              <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-white rounded-lg border" style={{ borderColor: '#D1D5DB', maxWidth: 360 }}>
                <Search size={13} className="text-gray-400" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Référence, type, fichier..." className="flex-1 text-[12px] outline-none bg-transparent" />
              </div>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="form-input text-[11px] py-1.5 pl-2.5 pr-6 w-44">
                <option value="">Tous les statuts</option>
                {Object.entries(IMP_CFG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
              <button className="btn btn-primary btn-sm flex items-center gap-1.5 ml-auto" onClick={startImport}>
                <Plus size={13} /> Nouvel import
              </button>
            </div>

            <div className="card overflow-hidden">
              <table className="data-table w-full">
                <thead>
                  <tr>
                    <th>Référence</th><th>Type</th><th>Module</th><th>Fichier</th>
                    <th>Utilisateur</th><th>Date</th><th className="text-right">Lignes</th>
                    <th className="text-center">Erreurs</th><th>Statut</th><th>Durée</th><th></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredImports.map(i => {
                    const cfg = IMP_CFG[i.status]
                    return (
                      <tr key={i.id} className="hover:bg-blue-50/40 cursor-pointer">
                        <td className="font-mono text-[11px] text-blue-600">{i.ref}</td>
                        <td className="text-[11px] font-medium">{i.type}</td>
                        <td className="text-[11px] text-gray-500">{i.module}</td>
                        <td className="text-[11px] text-gray-500 max-w-[150px] truncate">{i.fichier}</td>
                        <td className="text-[11px] text-gray-500">{i.utilisateur}</td>
                        <td className="text-[11px] text-gray-500">{i.date}</td>
                        <td className="text-right text-[11px]">{i.lignes || '—'}</td>
                        <td className="text-center">
                          {i.erreurs > 0 ? <span className="text-[10px] font-bold text-red-600">{i.erreurs}</span> : <span className="text-gray-300">—</span>}
                        </td>
                        <td><span className="badge text-[9px]" style={{ background: cfg.bg, color: cfg.color }}>{cfg.label}</span></td>
                        <td className="text-[10px] font-mono text-gray-400">{i.duree}</td>
                        <td>
                          <button className="text-gray-400 hover:text-gray-600"><Eye size={13} /></button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── EXPORTS ──────────────────────────────────────────────── */}
        {activeTab === 'exports' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-[13px] font-semibold text-gray-700">{EXPORTS.length} exports</div>
              <button className="btn btn-primary btn-sm flex items-center gap-1.5" onClick={() => setShowExportForm(true)}>
                <Plus size={13} /> Nouvel export
              </button>
            </div>

            {showExportForm && (
              <div className="card border-l-4" style={{ borderColor: '#0B1C3E' }}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[13px] font-bold" style={{ color: '#0B1C3E' }}>Nouvel export</span>
                  <button onClick={() => setShowExportForm(false)} className="text-gray-400 hover:text-gray-600"><X size={15} /></button>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {[['Module', ['Budget', 'PAP', 'Engagements', 'Liquidations', 'Paiements', 'Indicateurs', 'Tiers']], ['Exercice', ['2026', '2025', '2024']], ['Format', ['XLSX', 'CSV', 'PDF', 'JSON', 'XML']]].map(([label, opts]) => (
                    <div key={label as string}>
                      <label className="form-label">{label as string}</label>
                      <select className="form-input text-[12px]">
                        {(opts as string[]).map(o => <option key={o}>{o}</option>)}
                      </select>
                    </div>
                  ))}
                  <div>
                    <label className="form-label">Période</label>
                    <select className="form-input text-[12px]"><option>Exercice complet</option><option>T1 2026</option><option>T2 2026</option><option>T3 2026</option></select>
                  </div>
                  <div>
                    <label className="form-label">Structure (optionnel)</label>
                    <select className="form-input text-[12px]"><option>Toutes</option><option>Direction des Finances</option></select>
                  </div>
                  <div>
                    <label className="form-label">Statut</label>
                    <select className="form-input text-[12px]"><option>Tous</option><option>Validés uniquement</option></select>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <button className="btn btn-primary btn-sm flex items-center gap-1.5" onClick={() => setShowExportForm(false)}><Send size={13} />Générer l'export</button>
                  <button className="btn btn-outline btn-sm" onClick={() => setShowExportForm(false)}>Annuler</button>
                  <span className="ml-auto text-[11px] text-gray-500">Estimation : ~1 200 lignes · durée ~15s</span>
                </div>
              </div>
            )}

            <div className="card">
              <table className="data-table w-full">
                <thead><tr><th>Référence</th><th>Type</th><th>Utilisateur</th><th>Date</th><th>Format</th><th>Volume</th><th>Statut</th><th>Durée</th><th>Actions</th></tr></thead>
                <tbody>
                  {EXPORTS.map(e => {
                    const cfg = EXP_CFG[e.status]
                    return (
                      <tr key={e.id} className="hover:bg-blue-50/40">
                        <td className="font-mono text-[11px] text-blue-600">{e.ref}</td>
                        <td className="text-[11px] font-medium">{e.type}</td>
                        <td className="text-[11px] text-gray-500">{e.utilisateur}</td>
                        <td className="text-[11px] text-gray-500">{e.date}</td>
                        <td><span className="badge bg-gray-100 text-gray-600 text-[9px]">{e.format}</span></td>
                        <td className="text-[11px] text-gray-500">{e.volume}</td>
                        <td><span className="badge text-[9px]" style={{ background: cfg.bg, color: cfg.color }}>{cfg.label}</span></td>
                        <td className="text-[10px] font-mono text-gray-400">{e.duree}</td>
                        <td>
                          {e.status === 'DISPONIBLE' && (
                            <button className="btn btn-outline btn-sm py-0.5 px-2 text-[10px] flex items-center gap-1" onClick={() => showToast(`Téléchargement de ${e.type} (${e.ref}) en cours...`)}><Download size={11} />Télécharger</button>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── API ──────────────────────────────────────────────────── */}
        {activeTab === 'api' && (
          <div className="flex gap-4 min-h-0">
            <div className={`card flex-1 overflow-hidden ${selectedApi ? 'max-w-[60%]' : 'w-full'}`}>
              <div className="flex items-center justify-between mb-3">
                <span className="section-title">Catalogue d'API — BUDGET-CEEAC v1</span>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-green-100 text-green-700">API v1 · Actif</span>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-blue-100 text-blue-700">OpenAPI 3.0</span>
                </div>
              </div>
              <table className="data-table w-full">
                <thead><tr><th>Méthode</th><th>Endpoint</th><th>Description</th><th>Version</th><th className="text-right">Appels</th><th>Dernière util.</th><th>Statut</th></tr></thead>
                <tbody>
                  {API_ENDPOINTS.map((ep, i) => {
                    const methColor: Record<string, string> = { GET: '#15803D', POST: '#1D4ED8', PUT: '#D97706', DELETE: '#B91C1C', PATCH: '#7C3AED' }
                    const methBg: Record<string, string> = { GET: '#F0FDF4', POST: '#EFF6FF', PUT: '#FFFBEB', DELETE: '#FEF2F2', PATCH: '#F5F3FF' }
                    const stCfg: Record<string, { c: string; bg: string; l: string }> = {
                      ACTIF: { c: '#15803D', bg: '#F0FDF4', l: 'Actif' },
                      BETA:  { c: '#7C3AED', bg: '#F5F3FF', l: 'Beta' },
                      DEPRECIE: { c: '#B91C1C', bg: '#FEF2F2', l: 'Déprécié' },
                    }
                    const sc = stCfg[ep.status]
                    return (
                      <tr key={i} className="hover:bg-blue-50/40 cursor-pointer" onClick={() => setSelectedApi(ep)}>
                        <td><span className="px-1.5 py-0.5 rounded text-[10px] font-bold font-mono" style={{ background: methBg[ep.methode], color: methColor[ep.methode] }}>{ep.methode}</span></td>
                        <td className="font-mono text-[11px] text-blue-700">{ep.path}</td>
                        <td className="text-[11px] text-gray-600">{ep.description}</td>
                        <td><span className="badge bg-gray-100 text-gray-500 text-[9px]">{ep.version}</span></td>
                        <td className="text-right text-[11px] font-mono">{fmt(ep.consommation)}</td>
                        <td className="text-[11px] text-gray-400">{ep.derniereUtil}</td>
                        <td><span className="badge text-[9px]" style={{ background: sc.bg, color: sc.c }}>{sc.l}</span></td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {selectedApi && (
              <div className="flex-shrink-0 w-80 card overflow-y-auto">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[12px] font-bold text-gray-800">Documentation</span>
                  <button onClick={() => setSelectedApi(null)} className="text-gray-400 hover:text-gray-600"><X size={13} /></button>
                </div>
                <div className="font-mono text-[11px] text-blue-700 mb-1">{selectedApi.path}</div>
                <div className="text-[11px] text-gray-600 mb-3">{selectedApi.description}</div>
                <div className="section-title mb-2">Paramètres</div>
                {['exercice', 'structure', 'page', 'per_page'].map(p => (
                  <div key={p} className="flex items-center gap-2 mb-1.5 text-[11px]">
                    <code className="px-1 py-0.5 bg-gray-100 rounded text-[10px] text-gray-700">{p}</code>
                    <span className="text-gray-500">string · facultatif</span>
                  </div>
                ))}
                <div className="section-title mt-3 mb-2">Réponse exemple</div>
                <div className="p-2 rounded bg-gray-50 font-mono text-[10px] text-gray-600 border" style={{ borderColor: '#E5E9F0' }}>
                  {`{\n  "data": [...],\n  "meta": {\n    "total": 847,\n    "page": 1\n  }\n}`}
                </div>
                <div className="section-title mt-3 mb-2">Authentification</div>
                <div className="text-[11px] text-gray-600">OAuth 2.0 · Bearer token</div>
                <div className="section-title mt-3 mb-2">Limites</div>
                <div className="text-[11px] text-gray-600">500 req/min · 10 000 req/jour</div>
                <div className="mt-4 flex gap-2">
                  <button className="btn btn-outline btn-sm flex items-center gap-1 text-[10px]" onClick={() => setShowOpenApiModal(true)}><ExternalLink size={10} />OpenAPI</button>
                  <button className="btn btn-outline btn-sm flex items-center gap-1 text-[10px]" onClick={() => { navigator.clipboard.writeText(`https://api.budget-ceeac.org${selectedApi.path}`); setCopiedUrl(true); setTimeout(() => setCopiedUrl(false), 2000) }}>
                    <Copy size={10} />{copiedUrl ? 'Copié !' : 'Copier URL'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── INTÉGRATIONS ─────────────────────────────────────────── */}
        {activeTab === 'integrations' && (
          <div className="flex gap-4 min-h-0">
            <div className="flex-1 space-y-3">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {Object.entries(INTG_CFG).map(([k, v]) => (
                  <div key={k} className="kpi-card" style={{ padding: '10px 12px' }}>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 rounded-full" style={{ background: v.dot }} />
                      <span className="text-[10px] text-gray-500">{v.label}</span>
                    </div>
                    <div className="text-[16px] font-bold" style={{ color: v.color }}>
                      {INTEGRATIONS.filter(i => i.status === k).length}
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 gap-3">
                {INTEGRATIONS.map(int => {
                  const cfg = INTG_CFG[int.status]
                  const isSelected = selectedInteg?.id === int.id
                  return (
                    <div
                      key={int.id}
                      className={`card cursor-pointer transition-all ${isSelected ? 'ring-2' : 'hover:shadow-sm'}`}
                      style={isSelected ? { outline: '2px solid #0B1C3E' } : {}}
                      onClick={() => setSelectedInteg(isSelected ? null : int)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-lg" style={{ background: cfg.bg }}>
                          {int.type === 'SIRH' ? '👥' : int.type === 'Paie' ? '💰' : int.type === 'Comptabilité' ? '📒' : int.type === 'Banque' ? '🏦' : int.type === 'BI' ? '📊' : int.type === 'GED' ? '📁' : '🌐'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[13px] font-bold text-gray-800">{int.nom}</span>
                            <span className="text-[11px] text-gray-500 font-mono">{int.sens}</span>
                            <span className="badge bg-gray-100 text-gray-500 text-[9px] ml-1">{int.protocole}</span>
                          </div>
                          <div className="text-[11px] text-gray-500 mt-0.5">
                            {int.frequence} · Dernière sync : {int.dernierSync}
                            {int.latence !== '—' && <span className="ml-2 text-gray-400">Latence : {int.latence}</span>}
                          </div>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          {int.disponibilite > 0 && (
                            <div className="text-right">
                              <div className="text-[11px] font-bold" style={{ color: int.disponibilite > 95 ? '#15803D' : int.disponibilite > 70 ? '#D97706' : '#B91C1C' }}>{int.disponibilite}%</div>
                              <div className="text-[9px] text-gray-400">disponibilité</div>
                            </div>
                          )}
                          <span className="badge text-[9px]" style={{ background: cfg.bg, color: cfg.color }}>{cfg.label}</span>
                          <div className="w-2 h-2 rounded-full" style={{ background: cfg.dot }} />
                        </div>
                      </div>
                      {int.status === 'ERREUR' && (
                        <div className="mt-2 flex items-center gap-2 p-2 rounded-lg text-[11px]" style={{ background: '#FEF2F2' }}>
                          <AlertTriangle size={12} className="text-red-500 flex-shrink-0" />
                          <span className="text-red-700">Intégration indisponible — dernier contact : {int.dernierSync}. Vérifier la connectivité ou ouvrir un incident.</span>
                          <button className="ml-auto btn btn-danger btn-sm text-[10px] py-0.5 px-2 flex-shrink-0" onClick={() => setShowIncidentModal(true)}>Ouvrir incident</button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {selectedInteg && (
              <div className="flex-shrink-0 w-72 card overflow-y-auto">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[12px] font-bold text-gray-800">{selectedInteg.nom}</span>
                  <button onClick={() => setSelectedInteg(null)} className="text-gray-400 hover:text-gray-600"><X size={13} /></button>
                </div>
                <div className="space-y-1 text-[11px] mb-3">
                  {[['Type', selectedInteg.type], ['Sens', selectedInteg.sens], ['Protocole', selectedInteg.protocole], ['Fréquence', selectedInteg.frequence], ['Dernière sync', selectedInteg.dernierSync], ['Disponibilité', `${selectedInteg.disponibilite}%`], ['Latence', selectedInteg.latence]].map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <span className="text-gray-500">{k}</span>
                      <span className="font-semibold text-gray-800">{v}</span>
                    </div>
                  ))}
                </div>
                <div className="section-title mb-2">Authentification</div>
                <div className="text-[11px] text-gray-600 mb-1">OAuth 2.0 · Token JWT</div>
                <div className="text-[11px] text-gray-400">Expiration : 2027-01-01 · <span className="text-green-600">Valide</span></div>
                <div className="mt-4 space-y-1.5">
                  <button className="btn btn-outline btn-sm w-full text-[11px] flex items-center gap-1.5 justify-center" onClick={handleTestConn} disabled={testingConn}>
                    {testingConn ? <RefreshCw size={11} className="animate-spin" /> : <Play size={11} />}
                    {testingConn ? 'Test en cours...' : 'Tester la connexion'}
                  </button>
                  {testConnResult && (
                    <div className="text-[11px] text-center font-semibold px-2 py-1.5 rounded" style={{ background: testConnResult === 'success' ? '#F0FDF4' : '#FEF2F2', color: testConnResult === 'success' ? '#15803D' : '#B91C1C' }}>
                      {testConnResult === 'success' ? '✓ Connexion établie avec succès' : '✗ Échec de connexion — vérifier les paramètres'}
                    </div>
                  )}
                  <button className="btn btn-outline btn-sm w-full text-[11px] flex items-center gap-1.5 justify-center" onClick={handleSync} disabled={syncing}>
                    <RefreshCw size={11} className={syncing ? 'animate-spin' : ''} />{syncing ? 'Synchronisation...' : 'Synchroniser maintenant'}
                  </button>
                  {syncResult && <div className="text-[11px] text-green-700 font-semibold px-2 py-1.5 rounded bg-green-50">{syncResult}</div>}
                  <button className="btn btn-outline btn-sm w-full text-[11px] flex items-center gap-1.5 justify-center" onClick={() => setShowConnSettings(true)}><Settings size={11} />Paramètres</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── SUPERVISION ──────────────────────────────────────────── */}
        {activeTab === 'supervision' && (
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'Disponibilité globale', value: '97.4%', c: '#15803D' },
                { label: 'Taux de succès échanges', value: '98.1%', c: '#15803D' },
                { label: 'Flux en erreur', value: '2', c: '#B91C1C' },
                { label: 'DLQ (messages)', value: '0', c: '#15803D' },
              ].map((k, i) => (
                <div key={i} className="kpi-card text-center" style={{ padding: '12px' }}>
                  <div className="text-[19px] font-bold" style={{ color: k.c }}>{k.value}</div>
                  <div className="text-[10px] text-gray-500 mt-1">{k.label}</div>
                </div>
              ))}
            </div>

            {/* Journal des échanges */}
            <div className="card">
              <div className="flex items-center justify-between mb-3">
                <span className="section-title">Journal des échanges</span>
                <div className="flex items-center gap-2">
                  <select className="form-input text-[11px] py-1 px-2 w-32"><option>Tous les sys.</option></select>
                  <select className="form-input text-[11px] py-1 px-2 w-28"><option>Aujourd'hui</option><option>7 derniers jours</option></select>
                  <button className="btn btn-outline btn-sm text-[10px] flex items-center gap-1" onClick={() => setShowJournalExportModal(true)}><Download size={10} />Exporter</button>
                </div>
              </div>
              <table className="data-table w-full">
                <thead><tr><th>Timestamp</th><th>Source</th><th>Cible</th><th>Interface</th><th>Référence</th><th>Opération</th><th>Volume</th><th>Durée</th><th>Statut</th></tr></thead>
                <tbody>
                  {JOURNAL_ECHANGES.map((j, i) => (
                    <tr key={i} className="hover:bg-blue-50/40 cursor-pointer">
                      <td className="font-mono text-[10px] text-gray-500">{j.ts}</td>
                      <td className="text-[11px]">{j.source}</td>
                      <td className="text-[11px]">{j.cible}</td>
                      <td><span className="badge bg-gray-100 text-gray-500 text-[9px]">{j.interface}</span></td>
                      <td className="font-mono text-[10px] text-blue-600">{j.ref}</td>
                      <td className="text-[11px] text-gray-600">{j.op}</td>
                      <td className="text-[11px] text-gray-500">{j.vol}</td>
                      <td className="font-mono text-[10px] text-gray-400">{j.duree}</td>
                      <td><span className="badge text-[9px]" style={{ background: opBg(j.status), color: opColor(j.status) }}>{j.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Incidents */}
            <div className="card border-l-4 border-red-500">
              <div className="section-title mb-3">Incidents ouverts</div>
              <div className="flex items-start gap-3 p-3 rounded-lg" style={{ background: '#FEF2F2' }}>
                <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={16} />
                <div className="flex-1">
                  <div className="text-[12px] font-bold text-red-800">GED-OUT — GED Archives CEEAC indisponible</div>
                  <div className="text-[11px] text-red-600 mt-0.5">Depuis 2026-09-09 13:55 · 3 opérations en erreur · 0 tentatives de retry restantes</div>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    <button className="btn btn-sm text-[10px] py-0.5 px-2 flex items-center gap-1" style={{ background: '#B91C1C', color: 'white' }} disabled={replayingError || incidentStatus === 'treated'} onClick={handleReplay}>
                      <RotateCcw size={10} className={replayingError ? 'animate-spin' : ''} />{replayingError ? 'Rejeu...' : 'Rejouer'}
                    </button>
                    <button className="btn btn-outline btn-sm text-[10px] py-0.5 px-2" disabled={incidentStatus === 'treated'} onClick={() => { setIncidentStatus('treated'); showToast("Incident marqué comme traité.") }}>
                      {incidentStatus === 'treated' ? '✓ Traité' : 'Marquer traité'}
                    </button>
                    <button className="btn btn-outline btn-sm text-[10px] py-0.5 px-2" onClick={() => setShowErreurDetailModal(true)}>Voir détails</button>
                  </div>
                  {replayResult && <div className="mt-1.5 text-[11px] text-green-700 font-semibold">{replayResult}</div>}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── WIZARD IMPORT ─────────────────────────────────────────── */}
      {showWizard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(11,28,62,0.55)' }}>
          <div className="bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden" style={{ width: '820px', maxHeight: '90vh' }}>
            {/* Wizard header */}
            <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: '#E5E9F0', background: '#0B1C3E' }}>
              <div>
                <div className="text-[14px] font-bold text-white">Assistant d'import</div>
                <div className="text-[11px] text-white/50 mt-0.5">Étape {wizardStep} / 10 — {STEP_LABELS[wizardStep - 1]}</div>
              </div>
              <button onClick={closeWizard} className="text-white/40 hover:text-white"><X size={18} /></button>
            </div>
            {/* Stepper */}
            <div className="flex px-6 py-3 border-b overflow-x-auto" style={{ borderColor: '#E5E9F0', scrollbarWidth: 'none' }}>
              {STEP_LABELS.map((label, i) => {
                const step = i + 1
                const done = step < wizardStep
                const active = step === wizardStep
                return (
                  <React.Fragment key={step}>
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-all ${done ? 'bg-green-500 text-white' : active ? 'text-white' : 'bg-gray-200 text-gray-500'}`}
                        style={active ? { background: '#0B1C3E' } : {}}>
                        {done ? <Check size={12} /> : step}
                      </div>
                      <div className={`text-[9px] mt-1 font-medium whitespace-nowrap ${active ? 'text-blue-700' : done ? 'text-green-600' : 'text-gray-400'}`}>{label}</div>
                    </div>
                    {i < 9 && <div className="flex-1 h-px mt-3.5 mx-1" style={{ background: done ? '#22C55E' : '#E5E9F0', minWidth: 12 }} />}
                  </React.Fragment>
                )
              })}
            </div>

            {/* Wizard body */}
            <div className="flex-1 overflow-y-auto px-6 py-5" style={{ minHeight: 320 }}>
              {wizardStep === 1 && (
                <div>
                  <div className="text-[13px] font-bold text-gray-800 mb-1">Sélectionnez le type d'import</div>
                  <p className="text-[12px] text-gray-500 mb-4">Chaque type de données possède un format et des règles spécifiques.</p>
                  <div className="grid grid-cols-2 gap-3">
                    {IMPORT_TYPES.map(t => (
                      <div key={t.id}
                        className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${selectedImportType === t.id ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
                        onClick={() => setSelectedImportType(t.id)}>
                        <div className="flex items-start gap-2">
                          <span className="text-xl flex-shrink-0">{t.icon}</span>
                          <div>
                            <div className="text-[12px] font-bold text-gray-800">{t.label}</div>
                            <div className="text-[10px] text-gray-500 mt-0.5">{t.desc}</div>
                            <div className="flex gap-2 mt-1.5">
                              <span className="badge bg-gray-100 text-gray-500 text-[9px]">{t.format}</span>
                              <span className="badge bg-gray-100 text-gray-500 text-[9px]">{t.taille}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {wizardStep === 2 && (
                <div>
                  <div className="text-[13px] font-bold text-gray-800 mb-4">Chargement du fichier</div>
                  <div className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:bg-blue-50 transition-colors" style={{ borderColor: '#93C5FD', background: '#F8FBFF' }}>
                    <Upload size={28} className="mx-auto mb-3 text-blue-400" />
                    <div className="text-[13px] font-semibold text-gray-700 mb-1">Glissez votre fichier ici</div>
                    <div className="text-[11px] text-gray-500 mb-3">ou cliquez pour parcourir</div>
                    <div className="flex items-center justify-center gap-2">
                      {['XLSX', 'CSV', 'JSON', 'XML'].map(f => <span key={f} className="badge bg-blue-100 text-blue-600 text-[9px]">{f}</span>)}
                    </div>
                    <div className="text-[10px] text-gray-400 mt-2">Taille max : 50 MB · Contrôle antivirus automatique</div>
                  </div>
                  <div className="mt-3 p-3 rounded-lg bg-gray-50 border flex items-center gap-3" style={{ borderColor: '#E5E9F0' }}>
                    <FileText size={18} className="text-green-600 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="text-[12px] font-semibold text-gray-700">Budget_CEEAC_2026_v3.xlsx</div>
                      <div className="text-[10px] text-gray-400 mt-0.5">2.4 MB · SHA-256 : 3f4a9b... · Contrôle antivirus : <span className="text-green-600 font-semibold">OK</span></div>
                    </div>
                    <CheckCircle size={16} className="text-green-500" />
                  </div>
                </div>
              )}

              {wizardStep === 3 && (
                <div>
                  <div className="text-[13px] font-bold text-gray-800 mb-4">Analyse de la structure</div>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {[['Lignes détectées', '847'], ['Colonnes', '9'], ['Feuilles', '1 (Budget2026)'], ['Format', 'XLSX · UTF-8'], ['Doublons suspectés', '2'], ['Cellules vides', '14']].map(([l, v]) => (
                      <div key={l} className="p-3 rounded-lg bg-gray-50 border" style={{ borderColor: '#E5E9F0' }}>
                        <div className="text-[10px] text-gray-500">{l}</div>
                        <div className="text-[14px] font-bold text-gray-800 mt-0.5">{v}</div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 rounded-lg border" style={{ background: '#F0FDF4', borderColor: '#86EFAC' }}>
                    <div className="flex items-center gap-2 text-[12px] text-green-700 font-semibold"><CheckCircle size={14} />Structure compatible avec le modèle IMPORT-BUDGET-2026-V1</div>
                  </div>
                </div>
              )}

              {wizardStep === 4 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-[13px] font-bold text-gray-800">Mapping des colonnes</div>
                    <button className="btn btn-outline btn-sm text-[11px] flex items-center gap-1" onClick={handleAutoMapping} disabled={autoMappingLoading}>
                      <Zap size={11} className={autoMappingLoading ? 'animate-pulse' : ''} />{autoMappingLoading ? 'Analyse...' : 'Auto-mapping'}
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-2 px-2">
                    <span>Colonne du fichier</span><span>Champ BUDGET-CEEAC</span>
                  </div>
                  {showAutoMappingResult && (
                    <div className="mb-3 p-3 rounded-lg border" style={{ background: '#F0FDF4', borderColor: '#86EFAC' }}>
                      <div className="text-[12px] font-bold text-green-700 mb-1">Auto-mapping terminé — 7 correspondances détectées sur 9 colonnes</div>
                      <div className="text-[11px] text-green-600">CODE_LIGNE, LIBELLE, SOURCE_FIN, CHAP, NATURE_ECO reconnus automatiquement. DOTATION_INIT et STRUCTURE nécessitent confirmation.</div>
                    </div>
                  )}
                  <div className="space-y-1.5">
                    {MAPPING_ROWS.map((row, i) => {
                      const cfg = MAP_CFG[row.statut]
                      return (
                        <div key={i} className="grid grid-cols-2 gap-2 items-center p-2 rounded-lg border" style={{ borderColor: '#E5E9F0', background: row.statut === 'INCOMPATIBLE' ? '#FEF2F2' : 'white' }}>
                          <div className="flex items-center gap-2">
                            <code className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px] font-mono text-gray-700">{row.source}</code>
                            {row.obligatoire && <span className="text-[9px] text-red-500 font-bold">REQ</span>}
                          </div>
                          <div className="flex items-center gap-2">
                            <ArrowRight size={12} className="text-gray-300 flex-shrink-0" />
                            {row.statut !== 'IGNORE' && row.statut !== 'INCOMPATIBLE' ? (
                              <select className="form-input text-[10px] py-0.5 flex-1">
                                <option>{row.cible}</option>
                              </select>
                            ) : (
                              <span className="text-[11px] text-gray-400 italic">{row.statut === 'IGNORE' ? 'Non mappé' : 'Incompatible'}</span>
                            )}
                            <span className="badge text-[9px] flex-shrink-0" style={{ background: cfg.bg, color: cfg.color }}>{cfg.label}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {wizardStep === 5 && (
                <div>
                  <div className="text-[13px] font-bold text-gray-800 mb-4">Contrôles de validation</div>
                  <div className="flex gap-2 mb-3">
                    {(['ALL', 'ERREUR', 'AVERTISSEMENT'] as const).map(f => (
                      <button key={f} className={`btn btn-sm text-[11px] ${errorFilter === f ? 'btn-primary' : 'btn-outline'}`} onClick={() => setErrorFilter(f)}>
                        {f === 'ALL' ? `Tout (${ERRORS_LIST.length})` : f === 'ERREUR' ? `Erreurs (${ERRORS_LIST.filter(e => e.niveau === 'ERREUR').length})` : `Avertissements (${ERRORS_LIST.filter(e => e.niveau === 'AVERTISSEMENT').length})`}
                      </button>
                    ))}
                  </div>
                  <table className="data-table w-full">
                    <thead><tr><th className="text-center">Ligne</th><th>Colonne</th><th>Valeur</th><th>Niveau</th><th>Message</th><th>Action suggérée</th></tr></thead>
                    <tbody>
                      {errActive.map((e, i) => (
                        <tr key={i}>
                          <td className="text-center font-mono text-[11px]">{e.ligne}</td>
                          <td className="font-mono text-[10px] text-gray-600">{e.col}</td>
                          <td className="font-mono text-[10px] text-red-600">{e.valeur || '(vide)'}</td>
                          <td>
                            <span className="badge text-[9px]" style={{ background: e.niveau === 'ERREUR' ? '#FEF2F2' : '#FFFBEB', color: e.niveau === 'ERREUR' ? '#B91C1C' : '#D97706' }}>
                              {e.niveau}
                            </span>
                          </td>
                          <td className="text-[11px] text-gray-700">{e.msg}</td>
                          <td className="text-[11px] text-gray-500 italic">{e.correction}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {wizardStep === 6 && (
                <div>
                  <div className="text-[13px] font-bold text-gray-800 mb-4">Simulation — Aucune donnée n'est encore modifiée</div>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {[['Total lignes', '847', '#374151'], ['Lignes valides', '841', '#15803D'], ['Lignes rejetées', '4', '#B91C1C'], ['Avec avertissements', '6', '#D97706'], ['Créations prévues', '823', '#1D4ED8'], ['Mises à jour', '18', '#7C3AED']].map(([l, v, c]) => (
                      <div key={l} className="p-3 rounded-lg border text-center" style={{ borderColor: '#E5E9F0' }}>
                        <div className="text-[20px] font-bold" style={{ color: c as string }}>{v}</div>
                        <div className="text-[10px] text-gray-500 mt-0.5">{l}</div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 rounded-lg border" style={{ background: '#FFFBEB', borderColor: '#FCD34D' }}>
                    <div className="flex items-center gap-2 text-[12px] text-amber-700 font-semibold"><AlertTriangle size={14} />4 lignes seront ignorées en raison d'erreurs bloquantes.</div>
                  </div>
                </div>
              )}

              {wizardStep === 7 && (
                <div>
                  <div className="text-[13px] font-bold text-gray-800 mb-3">Prévisualisation des données</div>
                  <div className="flex gap-2 mb-3">
                    {['Toutes', 'Valides', 'En erreur', 'Avertissements'].map(f => (
                      <button key={f} className="btn btn-outline btn-sm text-[10px]">{f}</button>
                    ))}
                  </div>
                  <div className="overflow-x-auto rounded-lg border" style={{ borderColor: '#E5E9F0' }}>
                    <table className="data-table w-full">
                      <thead><tr><th>#</th><th>CODE_LIGNE</th><th>LIBELLE</th><th>DOTATION_INIT</th><th>SOURCE_FIN</th><th>STRUCTURE</th><th>Statut</th></tr></thead>
                      <tbody>
                        {[['1', '60-01-01', 'Rémunérations principales', '145 000 000', 'FONDS_PROPRES', 'SG/CEEAC', 'VALIDE'], ['2', '60-01-02', 'Indemnités et avantages', '82 000 000', 'FONDS_PROPRES', 'SG/CEEAC', 'VALIDE'], ['45', '60201', 'Frais de bureau', '8 500 000', 'FONDS_PROPRES', 'DIR-FIN', 'ERREUR']].map(([n, code, lib, dot, src, str, st]) => (
                          <tr key={n} style={{ background: st === 'ERREUR' ? '#FEF9F9' : 'white' }}>
                            <td className="text-gray-400 text-[10px]">{n}</td>
                            <td className="font-mono text-[10px]">{code}</td>
                            <td className="text-[11px]">{lib}</td>
                            <td className="text-right font-mono text-[11px]">{dot}</td>
                            <td className="text-[10px] text-gray-500">{src}</td>
                            <td className="text-[10px] text-gray-500">{str}</td>
                            <td><span className="badge text-[9px]" style={{ background: st === 'VALIDE' ? '#F0FDF4' : '#FEF2F2', color: st === 'VALIDE' ? '#15803D' : '#B91C1C' }}>{st}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {wizardStep === 8 && (
                <div>
                  <div className="text-[13px] font-bold text-gray-800 mb-4">Validation — Récapitulatif avant import</div>
                  <div className="grid grid-cols-2 gap-2 text-[12px] mb-4">
                    {[['Type', 'Budget initial'], ['Exercice', '2026'], ['Fichier', 'Budget_CEEAC_2026_v3.xlsx'], ['Utilisateur', 'A. MBONGO'], ['Modèle', 'IMPORT-BUDGET-2026-V1'], ['Enregistrements', '847'], ['À créer', '823'], ['À mettre à jour', '18'], ['Rejetés', '4'], ['Avertissements', '6']].map(([k, v]) => (
                      <div key={k} className="flex justify-between p-2 rounded border" style={{ borderColor: '#E5E9F0' }}>
                        <span className="text-gray-500">{k}</span>
                        <span className="font-semibold text-gray-800">{v}</span>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 rounded-lg border" style={{ background: '#EFF6FF', borderColor: '#93C5FD' }}>
                    <div className="flex items-center gap-2 text-[12px] text-blue-800 font-semibold"><Info size={14} />Cet import sera soumis à validation du Directeur Budget avant intégration définitive.</div>
                  </div>
                </div>
              )}

              {wizardStep === 9 && (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="text-[13px] font-bold text-gray-800 mb-6">Import en cours...</div>
                  <div className="w-full max-w-md mb-3">
                    <div className="flex justify-between text-[11px] text-gray-500 mb-1"><span>Traitement des données</span><span>{progress}%</span></div>
                    <div className="h-3 rounded-full bg-gray-200 overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, background: '#1A6B3A' }} />
                    </div>
                  </div>
                  <div className="text-[11px] text-gray-500">{Math.round(847 * progress / 100)} / 847 lignes traitées</div>
                  {progress < 100 && <div className="flex items-center gap-2 mt-4 text-[11px] text-gray-400"><RefreshCw size={12} className="animate-spin" />Traitement en arrière-plan...</div>}
                </div>
              )}

              {wizardStep === 10 && (
                <div className="text-center py-6">
                  <CheckCircle size={40} className="mx-auto mb-3 text-green-500" />
                  <div className="text-[15px] font-bold text-green-700 mb-1">Import réussi avec avertissements</div>
                  <div className="text-[12px] text-gray-500 mb-5">Référence : IMP-2026-0119 · Durée : 2m 18s</div>
                  <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto mb-5">
                    {[['Créés', '823', '#15803D'], ['Mis à jour', '18', '#1D4ED8'], ['Rejetés', '4', '#B91C1C']].map(([l, v, c]) => (
                      <div key={l} className="p-3 rounded-lg border text-center" style={{ borderColor: '#E5E9F0' }}>
                        <div className="text-[18px] font-bold" style={{ color: c as string }}>{v}</div>
                        <div className="text-[10px] text-gray-500">{l}</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <button className="btn btn-outline btn-sm flex items-center gap-1.5" onClick={() => showToast("Téléchargement du rapport détaillé en cours...")}><FileText size={12} />Rapport détaillé</button>
                    <button className="btn btn-primary btn-sm" onClick={closeWizard}>Terminer</button>
                  </div>
                </div>
              )}
            </div>

            {/* Wizard footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50" style={{ borderColor: '#E5E9F0' }}>
              <button onClick={prevStep} disabled={wizardStep === 1} className="btn btn-outline btn-sm flex items-center gap-1.5 disabled:opacity-40">
                <ArrowLeft size={13} />Précédent
              </button>
              <div className="flex items-center gap-3">
                <button onClick={closeWizard} className="btn btn-outline btn-sm">Annuler</button>
                {wizardStep < 10 && (
                  <button
                    onClick={nextStep}
                    disabled={wizardStep === 1 && !selectedImportType}
                    className="btn btn-primary btn-sm flex items-center gap-1.5 disabled:opacity-40"
                  >
                    {wizardStep === 8 ? 'Soumettre à validation' : wizardStep === 9 ? 'Voir le résultat' : 'Suivant'}
                    {wizardStep !== 8 && wizardStep !== 9 && <ArrowRight size={13} />}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-white text-[13px] font-medium" style={{ background: '#0B1C3E', minWidth: 300, maxWidth: 480 }}>
          <CheckCircle size={15} className="flex-shrink-0 text-green-400" />{toast}
        </div>
      )}

      {/* Incident modal */}
      {showIncidentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(11,28,62,0.6)' }}>
          <div className="bg-white rounded-xl shadow-2xl p-6 w-[440px]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[14px] font-bold text-red-700">Créer un incident</span>
              <button onClick={() => setShowIncidentModal(false)} className="text-gray-400 hover:text-gray-600"><X size={15} /></button>
            </div>
            <div className="space-y-3">
              <div><label className="form-label">Titre de l'incident *</label><input className="form-input text-[13px]" placeholder="Ex : GED indisponible depuis 13h55" value={incidentTitre} onChange={e => setIncidentTitre(e.target.value)} /></div>
              <div><label className="form-label">Priorité</label><select className="form-input text-[12px]" value={incidentPriorite} onChange={e => setIncidentPriorite(e.target.value)}><option>CRITIQUE</option><option>HAUTE</option><option>MOYENNE</option><option>BASSE</option></select></div>
              <div><label className="form-label">Description</label><textarea className="form-input text-[12px] resize-none" rows={4} placeholder="Décrivez le problème, les impacts et les actions déjà tentées..." value={incidentDesc} onChange={e => setIncidentDesc(e.target.value)} /></div>
            </div>
            <div className="flex gap-2 mt-4">
              <button className="btn btn-sm flex-1 flex items-center justify-center gap-1.5" style={{ background: '#B91C1C', color: 'white' }} disabled={!incidentTitre} onClick={() => { setShowIncidentModal(false); showToast(`Incident "${incidentTitre}" créé avec priorité ${incidentPriorite}.`) }}>Ouvrir l'incident</button>
              <button className="btn btn-outline btn-sm" onClick={() => setShowIncidentModal(false)}>Annuler</button>
            </div>
          </div>
        </div>
      )}

      {/* OpenAPI spec modal */}
      {showOpenApiModal && selectedApi && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(11,28,62,0.6)' }}>
          <div className="bg-white rounded-xl shadow-2xl p-6 w-[560px] max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[13px] font-bold" style={{ color: '#0B1C3E' }}>Spécification OpenAPI — {selectedApi.path}</span>
              <button onClick={() => setShowOpenApiModal(false)} className="text-gray-400 hover:text-gray-600"><X size={15} /></button>
            </div>
            <div className="flex-1 overflow-auto rounded-lg border bg-gray-50 p-4 font-mono text-[11px] text-gray-700" style={{ borderColor: '#E5E9F0' }}>
              <pre>{`openapi: "3.0.3"
info:
  title: BUDGET-CEEAC API
  version: "${selectedApi.version}"
paths:
  ${selectedApi.path}:
    ${selectedApi.methode.toLowerCase()}:
      summary: "${selectedApi.description}"
      tags: [budget]
      security:
        - bearerAuth: []
      parameters:
        - in: query
          name: exercice
          schema: { type: string }
        - in: query
          name: page
          schema: { type: integer, default: 1 }
        - in: query
          name: per_page
          schema: { type: integer, default: 50 }
      responses:
        "200":
          description: Succès
          content:
            application/json:
              schema:
                type: object
                properties:
                  data: { type: array }
                  meta:
                    type: object
                    properties:
                      total: { type: integer }
                      page: { type: integer }
        "401":
          description: Non autorisé
        "403":
          description: Accès refusé
components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT`}</pre>
            </div>
            <div className="flex gap-2 mt-3 justify-end">
              <button className="btn btn-outline btn-sm text-[11px]" onClick={() => { navigator.clipboard.writeText(`https://api.budget-ceeac.org/openapi.yaml`); showToast("URL de la spec copiée !") }}>Copier URL spec</button>
              <button className="btn btn-primary btn-sm text-[11px]" onClick={() => setShowOpenApiModal(false)}>Fermer</button>
            </div>
          </div>
        </div>
      )}

      {/* Journal export modal */}
      {showJournalExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(11,28,62,0.6)' }}>
          <div className="bg-white rounded-xl shadow-2xl p-6 w-80">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[14px] font-bold" style={{ color: '#0B1C3E' }}>Exporter le journal</span>
              <button onClick={() => setShowJournalExportModal(false)} className="text-gray-400 hover:text-gray-600"><X size={15} /></button>
            </div>
            <div className="space-y-2 mb-4">
              {['CSV', 'JSON', 'XML'].map(f => (
                <label key={f} className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-blue-50 transition-colors" style={{ borderColor: '#E5E9F0' }}>
                  <input type="radio" name="journalFormat" defaultChecked={f === 'CSV'} className="accent-blue-600" />
                  <span className="text-[13px] font-medium text-gray-700">{f}</span>
                </label>
              ))}
            </div>
            <div className="flex gap-2">
              <button className="btn btn-primary btn-sm flex-1 flex items-center justify-center gap-1.5" onClick={() => { setShowJournalExportModal(false); showToast("Export du journal en cours de génération...") }}><Download size={13} />Télécharger</button>
              <button className="btn btn-outline btn-sm" onClick={() => setShowJournalExportModal(false)}>Annuler</button>
            </div>
          </div>
        </div>
      )}

      {/* Erreur détail modal */}
      {showErreurDetailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(11,28,62,0.6)' }}>
          <div className="bg-white rounded-xl shadow-2xl p-6 w-[560px] max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[13px] font-bold text-red-700">Détail de l'erreur — GED-OUT</span>
              <button onClick={() => setShowErreurDetailModal(false)} className="text-gray-400 hover:text-gray-600"><X size={15} /></button>
            </div>
            <div className="space-y-3 overflow-auto flex-1">
              <div>
                <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">Payload envoyé</div>
                <div className="rounded-lg bg-gray-50 border p-3 font-mono text-[10px] text-gray-700" style={{ borderColor: '#E5E9F0' }}>
                  <pre>{`{\n  "operation": "ArchiverOrdonnancement",\n  "ref": "ORD-2026-0412",\n  "fichier": "ord_0412.pdf",\n  "taille": 245678,\n  "timestamp": "2026-09-09T13:55:41Z"\n}`}</pre>
                </div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">Stack trace</div>
                <div className="rounded-lg bg-red-50 border border-red-200 p-3 font-mono text-[10px] text-red-700">
                  <pre>{`Error: ConnectionRefused — GED endpoint unreachable\n  at GEDConnector.send (ged-connector.js:142)\n  at IntegrationBus.dispatch (bus.js:88)\n  at ExchangeWorker.process (worker.js:34)\nCause: ECONNREFUSED 10.0.1.45:8443\nRetries: 3/3 exhausted`}</pre>
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-3">
              <button className="btn btn-outline btn-sm" onClick={() => setShowErreurDetailModal(false)}>Fermer</button>
            </div>
          </div>
        </div>
      )}

      {/* Paramètres connexion modal */}
      {showConnSettings && selectedInteg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(11,28,62,0.6)' }}>
          <div className="bg-white rounded-xl shadow-2xl p-6 w-[440px]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[14px] font-bold" style={{ color: '#0B1C3E' }}>Paramètres — {selectedInteg.nom}</span>
              <button onClick={() => setShowConnSettings(false)} className="text-gray-400 hover:text-gray-600"><X size={15} /></button>
            </div>
            <div className="space-y-3">
              <div><label className="form-label">URL du endpoint</label><input className="form-input text-[12px] font-mono" defaultValue={`https://api.${selectedInteg.nom.toLowerCase().replace(/\s+/g, '-')}.org/v1`} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="form-label">Timeout (ms)</label><input className="form-input text-[12px]" type="number" defaultValue="5000" /></div>
                <div><label className="form-label">Fréquence</label><select className="form-input text-[12px]"><option>{selectedInteg.frequence}</option><option>Temps réel</option><option>Toutes les 4h</option><option>Quotidienne</option><option>Mensuelle</option></select></div>
              </div>
              <div><label className="form-label">Authentification</label><select className="form-input text-[12px]"><option>{selectedInteg.protocole}</option></select></div>
              <div><label className="form-label">Token / Clé API</label><input className="form-input text-[12px] font-mono" type="password" defaultValue="••••••••••••••••••••" /></div>
            </div>
            <div className="flex gap-2 mt-4">
              <button className="btn btn-primary btn-sm flex-1" onClick={() => { setShowConnSettings(false); showToast("Paramètres enregistrés avec succès.") }}>Enregistrer</button>
              <button className="btn btn-outline btn-sm" onClick={() => setShowConnSettings(false)}>Annuler</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
