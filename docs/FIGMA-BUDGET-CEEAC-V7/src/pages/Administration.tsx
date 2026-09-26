import { useState, useMemo } from 'react'
import {
  Plus, Search, Users, Shield, Settings, CheckCircle, KeyRound, RefreshCw,
  Smartphone, Mail, Lock, AlertTriangle, Eye, EyeOff, X, ChevronRight,
  MoreVertical, UserCheck, UserX, Unlock, RotateCcw, Archive, FileText,
  Building2, Layers, Briefcase, Clock, Activity, History, Grid,
  Filter, Download, Edit, Trash2, CheckSquare, Ban, LogOut,
} from 'lucide-react'
import type { Page } from '../types'

// ── Données ───────────────────────────────────────────────────────────────

type StatutCompte = 'ACTIF' | 'INACTIF' | 'SUSPENDU' | 'VERROUILLE' | 'EN_ATTENTE' | 'EXPIRE' | 'ARCHIVE'
type Profil = 'PRES' | 'SG' | 'COMM' | 'DIR-BUDGET' | 'CF' | 'EXPERT-BUD' | 'COMPTABLE' | 'CHEF-COMPT' | 'AC' | 'EXPERT-SE' | 'AUDIT' | 'ADMIN'

interface Utilisateur {
  id: string; matricule: string; civilite: 'M.' | 'Mme' | 'Dr' | 'S.E.'
  nom: string; prenom: string; email: string; telephone: string
  structure: string; departement: string; direction: string; service: string
  fonction: string; poste: string; superieur: string
  role: Profil; perimetre: string; statut: StatutCompte
  derniereConnexion: string; dateCreation: string; datePriseFonction: string
  changementMdpObligatoire: boolean; tentativesEchouees: number; dateExpiration: string
  typeUtilisateur: 'INTERNE' | 'CONSULTANT' | 'AUDITEUR' | 'EXTERNE' | 'TECHNIQUE'
}

const USERS: Utilisateur[] = [
  { id: 'U001', matricule: 'CEEAC-2019-001', civilite: 'M.', nom: 'MBONGO', prenom: 'Alain', email: 'a.mbongo@ceeac.int', telephone: '+241 66 001 001', structure: 'DCF', departement: 'DSG', direction: 'DCF', service: 'Contrôle des engagements', fonction: 'Contrôleur Financier', poste: 'CF Principal', superieur: 'SG', role: 'CF', perimetre: 'Commission', statut: 'ACTIF', derniereConnexion: '16/09/2026 08:12', dateCreation: '2019-03-15', datePriseFonction: '2019-03-15', changementMdpObligatoire: false, tentativesEchouees: 0, dateExpiration: '2027-03-15', typeUtilisateur: 'INTERNE' },
  { id: 'U002', matricule: 'CEEAC-2018-004', civilite: 'Mme', nom: 'NKOGHE', prenom: 'Marie-Claire', email: 'mc.nkoghe@ceeac.int', telephone: '+241 66 002 002', structure: 'DPPB', departement: 'DSG', direction: 'DPPB', service: 'Programmation budgétaire', fonction: 'Expert Budget Senior', poste: 'Expert Budget P3', superieur: 'Dir. Budget', role: 'EXPERT-BUD', perimetre: 'DSG', statut: 'ACTIF', derniereConnexion: '15/09/2026 17:34', dateCreation: '2018-09-01', datePriseFonction: '2020-01-10', changementMdpObligatoire: false, tentativesEchouees: 0, dateExpiration: '2027-09-01', typeUtilisateur: 'INTERNE' },
  { id: 'U003', matricule: 'CEEAC-2016-002', civilite: 'M.', nom: 'BONGO', prenom: 'Henri', email: 'h.bongo@ceeac.int', telephone: '+241 66 003 003', structure: 'DPPB', departement: 'DSG', direction: 'DPPB', service: '', fonction: 'Directeur', poste: 'Directeur DPPB', superieur: 'SG', role: 'DIR-BUDGET', perimetre: 'Commission', statut: 'ACTIF', derniereConnexion: '16/09/2026 08:45', dateCreation: '2016-06-01', datePriseFonction: '2022-03-01', changementMdpObligatoire: false, tentativesEchouees: 0, dateExpiration: '2027-06-01', typeUtilisateur: 'INTERNE' },
  { id: 'U004', matricule: 'CEEAC-2020-007', civilite: 'Mme', nom: 'NKOMO ESSAMA', prenom: 'Sylvie', email: 's.nkomo@ceeac.int', telephone: '+237 67 004 004', structure: 'DAPPS', departement: 'DAPPS', direction: 'DAP', service: 'Gouvernance politique', fonction: 'Expert', poste: 'Expert S&E PAP', superieur: 'Dir. DAPPS', role: 'EXPERT-SE', perimetre: 'DAPPS', statut: 'ACTIF', derniereConnexion: '15/09/2026 14:22', dateCreation: '2020-02-01', datePriseFonction: '2020-02-01', changementMdpObligatoire: false, tentativesEchouees: 0, dateExpiration: '2027-02-01', typeUtilisateur: 'INTERNE' },
  { id: 'U005', matricule: 'CEEAC-2017-009', civilite: 'Mme', nom: 'ENGONE', prenom: 'Agnès', email: 'a.engone@ceeac.int', telephone: '+241 66 005 005', structure: 'AC', departement: 'DSG', direction: 'AC', service: '', fonction: 'Comptable', poste: 'Comptable Principal', superieur: 'Agent Comptable', role: 'COMPTABLE', perimetre: 'Commission', statut: 'ACTIF', derniereConnexion: '16/09/2026 07:58', dateCreation: '2017-10-15', datePriseFonction: '2017-10-15', changementMdpObligatoire: false, tentativesEchouees: 0, dateExpiration: '2027-10-15', typeUtilisateur: 'INTERNE' },
  { id: 'U006', matricule: 'CEEAC-2021-012', civilite: 'M.', nom: 'BIYOGHE', prenom: 'Emmanuel', email: 'e.biyoghe@ceeac.int', telephone: '+241 66 006 006', structure: 'DAPPS', departement: 'DAPPS', direction: 'DMARAC', service: '', fonction: 'Expert', poste: 'Expert MARAC', superieur: 'Dir. DAPPS', role: 'EXPERT-SE', perimetre: 'DAPPS', statut: 'INACTIF', derniereConnexion: '01/08/2026 09:00', dateCreation: '2021-04-01', datePriseFonction: '2021-04-01', changementMdpObligatoire: true, tentativesEchouees: 0, dateExpiration: '2027-04-01', typeUtilisateur: 'INTERNE' },
  { id: 'U007', matricule: 'CEEAC-2023-015', civilite: 'M.', nom: 'KOUMBA', prenom: 'Patrick', email: 'p.koumba@ceeac.int', telephone: '+241 66 007 007', structure: 'DRHMG', departement: 'DSG', direction: 'DRHMG', service: '', fonction: 'Expert RH', poste: 'Expert RH Senior', superieur: 'Dir. DRHMG', role: 'EXPERT-BUD', perimetre: 'DSG', statut: 'EN_ATTENTE', derniereConnexion: '—', dateCreation: '2023-09-01', datePriseFonction: '2023-09-01', changementMdpObligatoire: true, tentativesEchouees: 0, dateExpiration: '2027-09-01', typeUtilisateur: 'INTERNE' },
  { id: 'U008', matricule: 'CEEAC-2024-020', civilite: 'Mme', nom: 'ASSEKO', prenom: 'Laure', email: 'l.asseko@ceeac.int', telephone: '+241 66 008 008', structure: 'DATI', departement: 'DATI', direction: 'DATT', service: '', fonction: 'Auditeur', poste: 'Auditeur Interne', superieur: 'Dir. Audit', role: 'AUDIT', perimetre: 'Commission', statut: 'SUSPENDU', derniereConnexion: '10/07/2026 11:30', dateCreation: '2024-01-15', datePriseFonction: '2024-01-15', changementMdpObligatoire: false, tentativesEchouees: 3, dateExpiration: '2027-01-15', typeUtilisateur: 'AUDITEUR' },
]

const ROLES_DATA = [
  { code: 'PRES', libelle: 'Président de la Commission', niveau: 1, type: 'Institutionnel', perimetre: 'Commission', description: 'Ordonnateur principal — signature de tous les OP sans seuil', modules: 'Tous', utilisateurs: 1, statut: 'ACTIF' },
  { code: 'SG', libelle: 'Secrétaire Général', niveau: 2, type: 'Institutionnel', perimetre: 'Commission', description: 'Ordonnateur délégué — OP < 5 M FCFA', modules: 'Tous sauf Admin technique', utilisateurs: 1, statut: 'ACTIF' },
  { code: 'COMM', libelle: 'Commissaire', niveau: 3, type: 'Institutionnel', perimetre: 'Département', description: 'Validation N+1 PAP pour son Département', modules: 'EB, ENG, S&E, Reporting', utilisateurs: 4, statut: 'ACTIF' },
  { code: 'DIR-BUDGET', libelle: 'Directeur du Budget', niveau: 4, type: 'Fonctionnel', perimetre: 'Commission', description: 'Validation budgétaire et contrôle des crédits', modules: 'ENG, Budget, Reporting, PAP', utilisateurs: 1, statut: 'ACTIF' },
  { code: 'CF', libelle: 'Contrôleur Financier', niveau: 4, type: 'Fonctionnel', perimetre: 'Commission', description: 'Visa CF sur engagements et liquidations', modules: 'ENG, LIQ, Budget, Reporting', utilisateurs: 1, statut: 'ACTIF' },
  { code: 'EXPERT-BUD', libelle: 'Expert Budget', niveau: 5, type: 'Opérationnel', perimetre: 'Structure', description: 'Préparation et suivi des engagements', modules: 'EB, ENG, Budget', utilisateurs: 4, statut: 'ACTIF' },
  { code: 'COMPTABLE', libelle: 'Comptable', niveau: 5, type: 'Opérationnel', perimetre: 'Commission', description: 'Préparation des ordres de paiement', modules: 'PAY, ORD', utilisateurs: 3, statut: 'ACTIF' },
  { code: 'CHEF-COMPT', libelle: 'Chef Comptable', niveau: 4, type: 'Fonctionnel', perimetre: 'Commission', description: 'Supervision de la comptabilité', modules: 'PAY, ORD, Reporting', utilisateurs: 1, statut: 'ACTIF' },
  { code: 'AC', libelle: 'Agent Comptable', niveau: 3, type: 'Institutionnel', perimetre: 'Commission', description: 'Validation des paiements', modules: 'PAY, Reporting', utilisateurs: 1, statut: 'ACTIF' },
  { code: 'EXPERT-SE', libelle: 'Expert S&E', niveau: 5, type: 'Opérationnel', perimetre: 'Structure', description: 'Collecte et saisie des indicateurs de performance', modules: 'S&E, PAP, Reporting', utilisateurs: 3, statut: 'ACTIF' },
  { code: 'AUDIT', libelle: 'Auditeur interne', niveau: 4, type: 'Contrôle', perimetre: 'Commission', description: 'Lecture probante — accès en lecture seule à tous les modules', modules: 'Tous (lecture seule)', utilisateurs: 2, statut: 'ACTIF' },
  { code: 'ADMIN', libelle: 'Administrateur fonctionnel', niveau: 1, type: 'Technique', perimetre: 'Commission', description: 'Administration du système et des référentiels', modules: 'Admin, Référentiels', utilisateurs: 1, statut: 'ACTIF' },
]

const PERMISSIONS_BY_MODULE = [
  { module: 'Utilisateurs', code: 'users', permissions: ['view', 'create', 'update', 'disable', 'delete', 'admin'] },
  { module: 'Budget', code: 'budget', permissions: ['view', 'create', 'update', 'validate', 'revise', 'close'] },
  { module: 'Expression de Besoin', code: 'eb', permissions: ['view', 'create', 'update', 'validate', 'reject', 'delete'] },
  { module: 'Engagement', code: 'eng', permissions: ['view', 'create', 'update', 'validate', 'visa', 'reject'] },
  { module: 'Liquidation', code: 'liq', permissions: ['view', 'create', 'update', 'certify', 'validate', 'reject'] },
  { module: 'Ordonnancement', code: 'ord', permissions: ['view', 'create', 'update', 'sign', 'transmit', 'reject'] },
  { module: 'Paiement', code: 'pay', permissions: ['view', 'create', 'validate', 'execute', 'reject'] },
  { module: 'PAP / S&E', code: 'pap', permissions: ['view', 'create', 'update', 'validate', 'report'] },
  { module: 'Reporting', code: 'rpt', permissions: ['view', 'export', 'create', 'admin'] },
  { module: 'Marchés', code: 'mrc', permissions: ['view', 'create', 'update', 'validate', 'sign'] },
  { module: 'Administration', code: 'adm', permissions: ['view', 'config', 'admin'] },
]

const FONCTIONS_DATA = [
  { code: 'F001', libelle: 'Président de la Commission', niveau: 1, statut: 'ACTIF' },
  { code: 'F002', libelle: 'Vice-Président de la Commission', niveau: 1, statut: 'ACTIF' },
  { code: 'F003', libelle: 'Secrétaire Général', niveau: 2, statut: 'ACTIF' },
  { code: 'F004', libelle: 'Commissaire', niveau: 2, statut: 'ACTIF' },
  { code: 'F005', libelle: 'Directeur', niveau: 3, statut: 'ACTIF' },
  { code: 'F006', libelle: 'Chef de Service', niveau: 4, statut: 'ACTIF' },
  { code: 'F007', libelle: 'Expert Senior', niveau: 5, statut: 'ACTIF' },
  { code: 'F008', libelle: 'Expert', niveau: 5, statut: 'ACTIF' },
  { code: 'F009', libelle: 'Contrôleur Financier', niveau: 3, statut: 'ACTIF' },
  { code: 'F010', libelle: 'Agent Comptable', niveau: 3, statut: 'ACTIF' },
  { code: 'F011', libelle: 'Comptable', niveau: 5, statut: 'ACTIF' },
  { code: 'F012', libelle: 'Auditeur Interne', niveau: 4, statut: 'ACTIF' },
]

const AUDIT_LOG = [
  { id: 'AL001', date: '16/09/2026 08:05', acteur: 'Admin CEEAC', cible: 'U001 — Alain MBONGO', action: 'REINITIALISATION_MDP', details: 'Mot de passe réinitialisé — changement obligatoire à la prochaine connexion', ancienneValeur: '****', nouvelleValeur: '(temporaire)', justification: 'Demande utilisateur' },
  { id: 'AL002', date: '14/09/2026 16:40', acteur: 'Admin CEEAC', cible: 'U008 — Laure ASSEKO', action: 'SUSPENSION', details: 'Compte suspendu — 3 tentatives de connexion échouées', ancienneValeur: 'ACTIF', nouvelleValeur: 'SUSPENDU', justification: 'Politique sécurité automatique' },
  { id: 'AL003', date: '10/09/2026 10:22', acteur: 'Admin CEEAC', cible: 'U007 — Patrick KOUMBA', action: 'CREATION', details: 'Nouveau compte créé — activation en attente', ancienneValeur: '—', nouvelleValeur: 'EN_ATTENTE', justification: 'Recrutement DRHMG' },
  { id: 'AL004', date: '01/09/2026 09:00', acteur: 'Admin CEEAC', cible: 'U006 — Emmanuel BIYOGHE', action: 'DESACTIVATION', details: 'Compte désactivé — fin de contrat', ancienneValeur: 'ACTIF', nouvelleValeur: 'INACTIF', justification: 'Fin de mission' },
  { id: 'AL005', date: '15/08/2026 14:15', acteur: 'Admin CEEAC', cible: 'U003 — Henri BONGO', action: 'MODIFICATION_ROLE', details: 'Rôle mis à jour', ancienneValeur: 'EXPERT-BUD', nouvelleValeur: 'DIR-BUDGET', justification: 'Promotion interne — décision SG du 10/08/2026' },
]

const STATUT_META: Record<StatutCompte, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  ACTIF:      { label: 'Actif',              color: '#166534', bg: '#DCFCE7', icon: <CheckCircle size={11} /> },
  INACTIF:    { label: 'Inactif',            color: '#374151', bg: '#F3F4F6', icon: <Ban size={11} /> },
  SUSPENDU:   { label: 'Suspendu',           color: '#92400E', bg: '#FEF3C7', icon: <AlertTriangle size={11} /> },
  VERROUILLE: { label: 'Verrouillé',         color: '#991B1B', bg: '#FEE2E2', icon: <Lock size={11} /> },
  EN_ATTENTE: { label: 'En attente',         color: '#1D4ED8', bg: '#DBEAFE', icon: <Clock size={11} /> },
  EXPIRE:     { label: 'Expiré',             color: '#6B21A8', bg: '#F3E8FF', icon: <Clock size={11} /> },
  ARCHIVE:    { label: 'Archivé',            color: '#6B7280', bg: '#F9FAFB', icon: <Archive size={11} /> },
}

function StatutBadge({ statut }: { statut: StatutCompte }) {
  const m = STATUT_META[statut]
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-semibold" style={{ color: m.color, background: m.bg }}>
      {m.icon}{m.label}
    </span>
  )
}

function Avatar({ u }: { u: Pick<Utilisateur, 'nom' | 'prenom'> }) {
  const initials = `${u.prenom[0]}${u.nom[0]}`
  return (
    <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0"
      style={{ background: 'linear-gradient(135deg,#1A6B3A,#0B1C3E)' }}>
      {initials}
    </div>
  )
}

// ── Composant principal ────────────────────────────────────────────────────

interface Props { onNavigate: (page: Page, id?: string) => void }

export default function Administration({ onNavigate }: Props) {
  const [activeTab, setActiveTab] = useState('utilisateurs')
  const [search, setSearch] = useState('')
  const [filterStatut, setFilterStatut] = useState<StatutCompte | 'TOUS'>('TOUS')
  const [filterDept, setFilterDept] = useState('TOUS')
  const [filterRole, setFilterRole] = useState('TOUS')

  // User detail
  const [selectedUser, setSelectedUser] = useState<Utilisateur | null>(null)
  const [userDetailTab, setUserDetailTab] = useState('identite')

  // New/Edit user modal
  const [showNewUser, setShowNewUser] = useState(false)
  const [editUser, setEditUser] = useState<Utilisateur | null>(null)
  const [wizardStep, setWizardStep] = useState(0)

  // Action menu
  const [actionMenuUser, setActionMenuUser] = useState<string | null>(null)

  // List view & pagination
  const [viewMode, setViewMode] = useState<'compact' | 'detail'>('detail')
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 6

  // Role modal
  const [showRoleModal, setShowRoleModal] = useState(false)
  const [editRole, setEditRole] = useState<typeof ROLES_DATA[0] | null>(null)

  // PIN (keep existing state)
  const [showPinSetup, setShowPinSetup] = useState(false)
  const [pinSetupStep, setPinSetupStep] = useState<'info' | 'otp' | 'pin' | 'confirm' | 'done'>('info')
  const [otpCode, setOtpCode] = useState('')
  const [newPin, setNewPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [showPin, setShowPin] = useState(false)
  const [otpResent, setOtpResent] = useState(false)

  // New user form
  const [newUserForm, setNewUserForm] = useState({
    civilite: 'M.' as 'M.' | 'Mme' | 'Dr' | 'S.E.',
    nom: '', prenom: '', email: '', telephone: '',
    departement: '', direction: '', service: '',
    fonction: '', poste: '', superieur: '',
    role: '' as Profil | '',
    perimetre: 'Structure',
    typeUtilisateur: 'INTERNE' as Utilisateur['typeUtilisateur'],
    datePriseFonction: '',
    username: '', motdepasse: '', confirmMotdepasse: '',
    genererMdpTemp: false,
    changementObligatoire: true,
    statut: 'EN_ATTENTE' as StatutCompte,
  })
  const [showMdp, setShowMdp] = useState(false)
  const [usersState, setUsersState] = useState(USERS)

  const filteredUsers = useMemo(() => {
    return usersState.filter(u => {
      const q = search.toLowerCase()
      const matchQ = !q || u.nom.toLowerCase().includes(q) || u.prenom.toLowerCase().includes(q) || u.email.includes(q) || u.matricule.includes(q) || u.role.toLowerCase().includes(q)
      const matchStatut = filterStatut === 'TOUS' || u.statut === filterStatut
      const matchDept = filterDept === 'TOUS' || u.departement === filterDept
      const matchRole = filterRole === 'TOUS' || u.role === filterRole
      return matchQ && matchStatut && matchDept && matchRole
    })
  }, [usersState, search, filterStatut, filterDept, filterRole])

  const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE)
  const pagedUsers = filteredUsers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function mdpStrength(p: string): { score: number; label: string; color: string } {
    let score = 0
    if (p.length >= 8) score++
    if (p.length >= 12) score++
    if (/[A-Z]/.test(p)) score++
    if (/[0-9]/.test(p)) score++
    if (/[^A-Za-z0-9]/.test(p)) score++
    const labels = ['', 'Très faible', 'Faible', 'Moyen', 'Fort', 'Très fort']
    const colors = ['', '#DC2626', '#F59E0B', '#F59E0B', '#16A34A', '#15803D']
    return { score, label: labels[score] || '', color: colors[score] || '#E5E7EB' }
  }

  const strength = mdpStrength(newUserForm.motdepasse)

  function handleAction(action: string, user: Utilisateur) {
    setActionMenuUser(null)
    setUsersState(prev => prev.map(u => {
      if (u.id !== user.id) return u
      if (action === 'activer') return { ...u, statut: 'ACTIF' as StatutCompte }
      if (action === 'desactiver') return { ...u, statut: 'INACTIF' as StatutCompte }
      if (action === 'suspendre') return { ...u, statut: 'SUSPENDU' as StatutCompte }
      if (action === 'deverrouiller') return { ...u, statut: 'ACTIF' as StatutCompte, tentativesEchouees: 0 }
      if (action === 'verrouiller') return { ...u, statut: 'VERROUILLE' as StatutCompte }
      if (action === 'archiver') return { ...u, statut: 'ARCHIVE' as StatutCompte }
      if (action === 'reinit-mdp') return { ...u, changementMdpObligatoire: true }
      if (action === 'forcer-mdp') return { ...u, changementMdpObligatoire: true }
      return u
    }))
  }

  const WIZARD_STEPS = ['Identité', 'Affectation', 'Compte & Sécurité', 'Rôles', 'Vérification']

  return (
    <div className="p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#0B1C3E]">Administration</h1>
          <p className="text-xs text-gray-500 mt-0.5">Gestion des utilisateurs, rôles, permissions, sécurité et audit</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-600 hover:bg-gray-50">
            <Download size={12} />Exporter
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 gap-0">
        {[
          { id: 'utilisateurs', label: 'Utilisateurs', icon: <Users size={13} />, badge: usersState.filter(u => u.statut === 'EN_ATTENTE').length || undefined },
          { id: 'roles', label: 'Rôles', icon: <Shield size={13} /> },
          { id: 'permissions', label: 'Permissions', icon: <Grid size={13} /> },
          { id: 'fonctions', label: 'Fonctions & Postes', icon: <Briefcase size={13} /> },
          { id: 'securite', label: 'Sécurité & PIN', icon: <KeyRound size={13} /> },
          { id: 'audit', label: 'Journal d\'audit', icon: <History size={13} /> },
          { id: 'workflows', label: 'Workflows', icon: <Settings size={13} />, navigate: 'workflow-list' as const },
          { id: 'parametres', label: 'Paramètres', icon: <Settings size={13} /> },
        ].map(tab => (
          <button key={tab.id}
            className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id ? 'border-[#0B1C3E] text-[#0B1C3E]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            onClick={() => 'navigate' in tab && tab.navigate ? onNavigate(tab.navigate) : setActiveTab(tab.id)}>
            {tab.icon}{tab.label}
            {'badge' in tab && tab.badge ? <span className="ml-1 bg-blue-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">{tab.badge}</span> : null}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* TAB — UTILISATEURS                                                */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'utilisateurs' && (
        <div className="space-y-3">
          {/* Filtres */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input className="pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg outline-none w-56 focus:border-blue-400"
                placeholder="Nom, email, matricule…" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 outline-none" value={filterStatut} onChange={e => setFilterStatut(e.target.value as StatutCompte | 'TOUS')}>
              <option value="TOUS">Tous les statuts</option>
              {(Object.keys(STATUT_META) as StatutCompte[]).map(s => <option key={s} value={s}>{STATUT_META[s].label}</option>)}
            </select>
            <select className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 outline-none" value={filterDept} onChange={e => setFilterDept(e.target.value)}>
              <option value="TOUS">Tous les départements</option>
              {['DSG', 'DAPPS', 'DMCAEMF', 'DENRADR', 'DATI', 'DPGDHS', 'DPRES'].map(d => <option key={d}>{d}</option>)}
            </select>
            <select className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 outline-none" value={filterRole} onChange={e => setFilterRole(e.target.value)}>
              <option value="TOUS">Tous les rôles</option>
              {ROLES_DATA.map(r => <option key={r.code} value={r.code}>{r.libelle}</option>)}
            </select>
            <div className="flex-1" />
            <span className="text-xs text-gray-400">{filteredUsers.length} utilisateur{filteredUsers.length > 1 ? 's' : ''}</span>
            <div className="flex border border-gray-200 rounded-lg overflow-hidden">
              <button onClick={() => setViewMode('compact')} className={`px-2.5 py-1.5 text-xs transition-colors ${viewMode === 'compact' ? 'bg-[#0B1C3E] text-white' : 'text-gray-500 hover:bg-gray-50'}`} title="Vue compacte"><Filter size={11} /></button>
              <button onClick={() => setViewMode('detail')} className={`px-2.5 py-1.5 text-xs transition-colors ${viewMode === 'detail' ? 'bg-[#0B1C3E] text-white' : 'text-gray-500 hover:bg-gray-50'}`} title="Vue détaillée"><Grid size={11} /></button>
            </div>
            <button onClick={() => { setShowNewUser(true); setWizardStep(0) }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
              style={{ background: '#0B1C3E' }}>
              <Plus size={12} />Nouvel utilisateur
            </button>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className={`w-full ${viewMode === 'compact' ? 'text-[10.5px]' : 'text-xs'}`}>
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-4 py-2.5 text-gray-400 font-medium">Utilisateur</th>
                  <th className="text-left px-3 py-2.5 text-gray-400 font-medium">Matricule</th>
                  <th className="text-left px-3 py-2.5 text-gray-400 font-medium">E-mail</th>
                  <th className="text-left px-3 py-2.5 text-gray-400 font-medium">Rôle</th>
                  <th className="text-left px-3 py-2.5 text-gray-400 font-medium">Structure</th>
                  <th className="text-center px-3 py-2.5 text-gray-400 font-medium">Statut</th>
                  <th className="text-left px-3 py-2.5 text-gray-400 font-medium">Dernière connexion</th>
                  <th className="px-3 py-2.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {pagedUsers.map(u => (
                  <tr key={u.id} className={`hover:bg-gray-50 transition-colors ${viewMode === 'compact' ? 'text-[10.5px]' : ''}`}>
                    <td className="px-4 py-3">
                      <button onClick={() => { setSelectedUser(u); setUserDetailTab('identite') }} className="flex items-center gap-2.5 hover:underline text-left">
                        <Avatar u={u} />
                        <div>
                          <div className="font-semibold text-gray-800">{u.civilite} {u.prenom} {u.nom}</div>
                          <div className="text-[10px] text-gray-400">{u.fonction}</div>
                        </div>
                      </button>
                    </td>
                    <td className="px-3 py-3 font-mono text-gray-500 text-[10.5px]">{u.matricule}</td>
                    <td className="px-3 py-3 text-gray-600">{u.email}</td>
                    <td className="px-3 py-3">
                      <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 text-[10.5px] font-medium">
                        {ROLES_DATA.find(r => r.code === u.role)?.libelle ?? u.role}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="text-[11px] text-gray-700">{u.direction || u.departement}</div>
                      {u.service && <div className="text-[10px] text-gray-400">{u.service}</div>}
                    </td>
                    <td className="px-3 py-3 text-center">
                      <StatutBadge statut={u.statut} />
                      {u.changementMdpObligatoire && <div className="text-[9px] text-orange-500 mt-0.5 flex items-center justify-center gap-0.5"><Lock size={8} />Mdp à changer</div>}
                      {u.tentativesEchouees >= 3 && <div className="text-[9px] text-red-500 mt-0.5 flex items-center justify-center gap-0.5"><AlertTriangle size={8} />{u.tentativesEchouees} tentatives</div>}
                    </td>
                    <td className="px-3 py-3 font-mono text-[11px] text-gray-400">{u.derniereConnexion}</td>
                    <td className="px-3 py-3 relative">
                      <button onClick={() => setActionMenuUser(actionMenuUser === u.id ? null : u.id)}
                        className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-700">
                        <MoreVertical size={14} />
                      </button>
                      {actionMenuUser === u.id && (
                        <div className="absolute right-8 top-2 z-20 bg-white border border-gray-200 rounded-xl shadow-xl py-1 w-52" onMouseLeave={() => setActionMenuUser(null)}>
                          <button onClick={() => { setSelectedUser(u); setUserDetailTab('identite'); setActionMenuUser(null) }} className="flex items-center gap-2 w-full px-3 py-2 text-xs text-gray-700 hover:bg-gray-50"><Eye size={12} />Consulter la fiche</button>
                          <button onClick={() => { setEditUser(u); setShowNewUser(true); setWizardStep(0); setActionMenuUser(null) }} className="flex items-center gap-2 w-full px-3 py-2 text-xs text-gray-700 hover:bg-gray-50"><Edit size={12} />Modifier</button>
                          <div className="my-1 border-t border-gray-100" />
                          {u.statut !== 'ACTIF' && <button onClick={() => handleAction('activer', u)} className="flex items-center gap-2 w-full px-3 py-2 text-xs text-green-700 hover:bg-green-50"><UserCheck size={12} />Activer</button>}
                          {u.statut === 'ACTIF' && <button onClick={() => handleAction('suspendre', u)} className="flex items-center gap-2 w-full px-3 py-2 text-xs text-amber-700 hover:bg-amber-50"><Ban size={12} />Suspendre</button>}
                          {u.statut === 'ACTIF' && <button onClick={() => handleAction('desactiver', u)} className="flex items-center gap-2 w-full px-3 py-2 text-xs text-gray-600 hover:bg-gray-50"><UserX size={12} />Désactiver</button>}
                          {u.statut !== 'VERROUILLE' && u.statut === 'ACTIF' && <button onClick={() => handleAction('verrouiller', u)} className="flex items-center gap-2 w-full px-3 py-2 text-xs text-red-600 hover:bg-red-50"><Lock size={12} />Verrouiller</button>}
                          {u.statut === 'VERROUILLE' && <button onClick={() => handleAction('deverrouiller', u)} className="flex items-center gap-2 w-full px-3 py-2 text-xs text-blue-700 hover:bg-blue-50"><Unlock size={12} />Déverrouiller</button>}
                          <button onClick={() => handleAction('reinit-mdp', u)} className="flex items-center gap-2 w-full px-3 py-2 text-xs text-purple-700 hover:bg-purple-50"><RotateCcw size={12} />Réinitialiser mot de passe</button>
                          <button onClick={() => handleAction('forcer-mdp', u)} className="flex items-center gap-2 w-full px-3 py-2 text-xs text-orange-600 hover:bg-orange-50"><KeyRound size={12} />Forcer changement mdp</button>
                          <div className="my-1 border-t border-gray-100" />
                          <button onClick={() => { setSelectedUser(u); setUserDetailTab('roles'); setActionMenuUser(null) }} className="flex items-center gap-2 w-full px-3 py-2 text-xs text-gray-700 hover:bg-gray-50"><Shield size={12} />Modifier les rôles</button>
                          <button onClick={() => { setSelectedUser(u); setUserDetailTab('historique'); setActionMenuUser(null) }} className="flex items-center gap-2 w-full px-3 py-2 text-xs text-gray-700 hover:bg-gray-50"><History size={12} />Consulter l'historique</button>
                          <div className="my-1 border-t border-gray-100" />
                          {u.statut !== 'ARCHIVE' && <button onClick={() => handleAction('archiver', u)} className="flex items-center gap-2 w-full px-3 py-2 text-xs text-gray-400 hover:bg-gray-50"><Archive size={12} />Archiver</button>}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <span>Page {page} / {totalPages} · {filteredUsers.length} résultat{filteredUsers.length > 1 ? 's' : ''}</span>
                <div className="flex gap-1">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                    className="px-2.5 py-1 rounded border border-gray-200 disabled:opacity-30 hover:bg-gray-50">←</button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                    <button key={n} onClick={() => setPage(n)}
                      className={`px-2.5 py-1 rounded border text-xs ${n === page ? 'bg-[#0B1C3E] text-white border-[#0B1C3E]' : 'border-gray-200 hover:bg-gray-50'}`}>
                      {n}
                    </button>
                  ))}
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                    className="px-2.5 py-1 rounded border border-gray-200 disabled:opacity-30 hover:bg-gray-50">→</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* TAB — RÔLES                                                       */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'roles' && (
        <div className="space-y-3">
          <div className="flex justify-end">
            <button onClick={() => { setEditRole(null); setShowRoleModal(true) }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white" style={{ background: '#0B1C3E' }}>
              <Plus size={12} />Nouveau rôle
            </button>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-4 py-2.5 text-gray-400 font-medium">Code</th>
                  <th className="text-left px-3 py-2.5 text-gray-400 font-medium">Libellé</th>
                  <th className="text-left px-3 py-2.5 text-gray-400 font-medium">Type</th>
                  <th className="text-left px-3 py-2.5 text-gray-400 font-medium">Périmètre</th>
                  <th className="text-left px-3 py-2.5 text-gray-400 font-medium">Niveau</th>
                  <th className="text-left px-3 py-2.5 text-gray-400 font-medium">Modules</th>
                  <th className="text-center px-3 py-2.5 text-gray-400 font-medium">Utilisateurs</th>
                  <th className="text-center px-3 py-2.5 text-gray-400 font-medium">Statut</th>
                  <th className="px-3 py-2.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {ROLES_DATA.map(r => (
                  <tr key={r.code} className="hover:bg-gray-50">
                    <td className="px-4 py-2.5 font-mono font-bold text-[#0B1C3E]">{r.code}</td>
                    <td className="px-3 py-2.5 font-semibold text-gray-800">{r.libelle}</td>
                    <td className="px-3 py-2.5">
                      <span className="px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 text-[10px] font-medium">{r.type}</span>
                    </td>
                    <td className="px-3 py-2.5 text-gray-600">{r.perimetre}</td>
                    <td className="px-3 py-2.5">
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold text-white" style={{ background: '#0B1C3E' }}>{r.niveau}</span>
                    </td>
                    <td className="px-3 py-2.5 text-gray-500 max-w-[180px] truncate">{r.modules}</td>
                    <td className="px-3 py-2.5 text-center font-mono font-bold text-gray-700">{r.utilisateurs}</td>
                    <td className="px-3 py-2.5 text-center">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-green-100 text-green-700">{r.statut}</span>
                    </td>
                    <td className="px-3 py-2.5">
                      <button onClick={() => { setEditRole(r); setShowRoleModal(true) }} className="text-xs text-blue-600 hover:underline">Configurer</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* TAB — PERMISSIONS (Matrice)                                       */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'permissions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-sm text-[#0B1C3E]">Matrice Rôles × Permissions</h3>
              <p className="text-xs text-gray-400 mt-0.5">Gestion des habilitations par module · ✓ autorisé · — non autorisé</p>
            </div>
            <div className="flex gap-2">
              <select className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 outline-none">
                <option>Tous les modules</option>
                {PERMISSIONS_BY_MODULE.map(m => <option key={m.code}>{m.module}</option>)}
              </select>
            </div>
          </div>
          {PERMISSIONS_BY_MODULE.map(mod => (
            <div key={mod.code} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
                <Layers size={13} className="text-[#0B1C3E]" />
                <span className="font-semibold text-sm text-[#0B1C3E]">{mod.module}</span>
                <span className="text-[10px] text-gray-400 font-mono ml-1">{mod.code}.*</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-[11px]">
                  <thead>
                    <tr className="border-b border-gray-50">
                      <th className="text-left px-4 py-2 text-gray-400 font-medium w-40">Permission</th>
                      {ROLES_DATA.slice(0, 8).map(r => (
                        <th key={r.code} className="text-center px-2 py-2 text-gray-400 font-medium whitespace-nowrap">{r.code}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {mod.permissions.map(perm => (
                      <tr key={perm} className="hover:bg-gray-50">
                        <td className="px-4 py-2 font-mono text-gray-600">{mod.code}.{perm}</td>
                        {ROLES_DATA.slice(0, 8).map(r => {
                          const hasAccess = (r.code === 'ADMIN') || (r.code === 'PRES' && ['view','create','validate','approve'].includes(perm)) || (r.code === 'CF' && mod.code !== 'adm') || (r.niveau <= 3 && ['view'].includes(perm)) || (r.niveau <= 4 && ['view', 'create', 'update'].includes(perm))
                          return (
                            <td key={r.code} className="px-2 py-2 text-center">
                              {hasAccess
                                ? <CheckCircle size={12} className="text-green-500 mx-auto" />
                                : <span className="text-gray-200 text-[10px]">—</span>
                              }
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* TAB — FONCTIONS & POSTES                                          */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'fonctions' && (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold text-sm text-[#0B1C3E]">Fonctions</h3>
              <button className="flex items-center gap-1 text-xs text-white px-2.5 py-1 rounded-lg" style={{ background: '#0B1C3E' }}><Plus size={11} />Ajouter</button>
            </div>
            <table className="w-full text-xs">
              <thead><tr className="bg-gray-50 border-b border-gray-100"><th className="text-left px-4 py-2 text-gray-400 font-medium">Code</th><th className="text-left px-3 py-2 text-gray-400 font-medium">Libellé</th><th className="text-center px-3 py-2 text-gray-400 font-medium">Niv.</th><th className="text-center px-3 py-2 text-gray-400 font-medium">Statut</th><th className="px-2" /></tr></thead>
              <tbody className="divide-y divide-gray-50">
                {FONCTIONS_DATA.map(f => (
                  <tr key={f.code} className="hover:bg-gray-50">
                    <td className="px-4 py-2 font-mono text-gray-500">{f.code}</td>
                    <td className="px-3 py-2 font-medium text-gray-700">{f.libelle}</td>
                    <td className="px-3 py-2 text-center"><span className="w-5 h-5 rounded-full bg-gray-100 text-gray-600 text-[10px] font-bold inline-flex items-center justify-center">{f.niveau}</span></td>
                    <td className="px-3 py-2 text-center"><span className="text-[10px] font-medium text-green-700 bg-green-50 px-1.5 py-0.5 rounded">{f.statut}</span></td>
                    <td className="px-2 py-2"><button className="text-gray-300 hover:text-blue-500"><Edit size={11} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold text-sm text-[#0B1C3E]">Postes budgétaires</h3>
              <button className="flex items-center gap-1 text-xs text-white px-2.5 py-1 rounded-lg" style={{ background: '#0B1C3E' }}><Plus size={11} />Ajouter</button>
            </div>
            <div className="p-6 text-center text-gray-300 text-xs">
              <Briefcase size={28} className="mx-auto mb-2 text-gray-200" />
              Les postes sont gérés via le référentiel organisationnel officiel.
              <button onClick={() => onNavigate('referentiel')} className="block mx-auto mt-2 text-blue-500 hover:underline">Voir le référentiel →</button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* TAB — SÉCURITÉ & PIN (conservé identique)                         */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'securite' && (
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-1">
              <KeyRound size={15} className="text-[#0B1C3E]" />
              <h3 className="font-bold text-gray-800">Code PIN de signature</h3>
            </div>
            <p className="text-xs text-gray-500 mb-5">Le code PIN de signature est l'authentification forte requise pour apposer une signature électronique sur les Ordres de Paiement.</p>
            <div className="grid grid-cols-3 gap-4 mb-5">
              {[
                { step: '1', title: 'Génération OTP', desc: "L'administrateur déclenche la procédure. Le système génère un code OTP à usage unique envoyé par SMS et email institutionnel.", color: '#2563EB', icon: RefreshCw },
                { step: '2', title: 'Définition du PIN', desc: "L'Ordonnateur saisit le code OTP reçu, puis définit son code PIN à 6 chiffres. Le PIN est haché et stocké chiffré.", color: '#7C3AED', icon: KeyRound },
                { step: '3', title: 'Utilisation', desc: "Lors de chaque signature d'OP, l'Ordonnateur saisit son PIN. Le système vérifie en temps réel avant d'apposer la signature.", color: '#16A34A', icon: Lock },
              ].map(s => {
                const Icon = s.icon
                return (
                  <div key={s.step} className="p-4 rounded-xl border border-gray-100 bg-gray-50">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold" style={{ background: s.color }}>{s.step}</div>
                      <Icon size={13} style={{ color: s.color }} />
                      <p className="text-xs font-bold text-gray-800">{s.title}</p>
                    </div>
                    <p className="text-[11px] text-gray-500 leading-relaxed">{s.desc}</p>
                  </div>
                )
              })}
            </div>
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 flex items-start gap-3">
              <Shield size={14} className="text-blue-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-bold text-blue-800">Règles de sécurité du PIN</p>
                <ul className="text-[11px] text-blue-700 mt-1 space-y-0.5 list-disc list-inside">
                  <li>Code à 6 chiffres, haché SHA-256 + sel — jamais stocké en clair</li>
                  <li>Valide 365 jours — renouvellement obligatoire à expiration</li>
                  <li>Bloqué après 3 tentatives incorrectes consécutives</li>
                  <li>Réinitialisation uniquement par administrateur avec OTP double canal (SMS + email)</li>
                  <li>Chaque utilisation journalisée avec horodatage, IP et empreinte documentaire</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800">Statut PIN par Ordonnateur</h3>
              <button onClick={() => { setShowPinSetup(true); setPinSetupStep('info') }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white" style={{ background: '#0B1C3E' }}>
                <RefreshCw size={11} />Initialiser / Réinitialiser
              </button>
            </div>
            <table className="w-full text-xs">
              <thead><tr className="bg-gray-50 border-b border-gray-100">{['Ordonnateur', 'Rôle', 'PIN configuré', 'Dernière utilisation', 'Expiration', 'Tentatives', 'Action'].map(h => <th key={h} className="text-left px-3 py-2 text-gray-400 font-medium">{h}</th>)}</tr></thead>
              <tbody>
                {[
                  { nom: 'S.E. Gilberto da Piedade Verissimo', role: 'Président', pinOk: true, dern: '15/09/2026 14:20', expir: '15/09/2027', fails: 0 },
                  { nom: 'M. Jean MBIDA', role: 'Secrétaire Général', pinOk: true, dern: '14/09/2026 10:05', expir: '14/09/2027', fails: 0 },
                  { nom: 'Mme. Angélique KOUMBA', role: 'SG par intérim', pinOk: false, dern: '—', expir: '—', fails: 0 },
                ].map((u, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    <td className="px-3 py-3 font-medium text-gray-800">{u.nom}</td>
                    <td className="px-3 py-3 text-gray-500">{u.role}</td>
                    <td className="px-3 py-3">{u.pinOk ? <span className="flex items-center gap-1 text-green-700"><CheckCircle size={11} />Configuré</span> : <span className="flex items-center gap-1 text-red-600"><AlertTriangle size={11} />Non configuré</span>}</td>
                    <td className="px-3 py-3 font-mono text-gray-400">{u.dern}</td>
                    <td className="px-3 py-3 text-gray-400">{u.expir}</td>
                    <td className="px-3 py-3"><span className={u.fails > 0 ? 'text-red-600 font-bold' : 'text-gray-300'}>{u.fails}</span></td>
                    <td className="px-3 py-3"><button onClick={() => { setShowPinSetup(true); setPinSetupStep('info') }} className="text-xs text-blue-600 hover:underline flex items-center gap-1"><RefreshCw size={10} />{u.pinOk ? 'Réinitialiser' : 'Initialiser'}</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paramètres de sécurité */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-bold text-gray-800 mb-4">Politique de mot de passe</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Longueur minimale', val: '10 caractères' },
                { label: 'Majuscule obligatoire', val: 'Oui' },
                { label: 'Chiffre obligatoire', val: 'Oui' },
                { label: 'Caractère spécial', val: 'Oui' },
                { label: 'Expiration du mot de passe', val: '90 jours' },
                { label: 'Historique (réutilisation)', val: 'Interdiction des 5 derniers' },
                { label: 'Verrouillage après échecs', val: '5 tentatives' },
                { label: 'Durée de verrouillage', val: '30 minutes' },
              ].map(p => (
                <div key={p.label} className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-xs text-gray-600">{p.label}</span>
                  <span className="text-xs font-semibold text-gray-800">{p.val}</span>
                </div>
              ))}
            </div>
            <button className="mt-3 text-xs text-blue-600 hover:underline">Modifier la politique →</button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* TAB — JOURNAL D'AUDIT                                             */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'audit' && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input className="pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg outline-none w-56" placeholder="Rechercher…" />
            </div>
            <select className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 outline-none">
              <option>Toutes les actions</option>
              <option>CREATION</option><option>MODIFICATION_ROLE</option><option>DESACTIVATION</option><option>SUSPENSION</option><option>REINITIALISATION_MDP</option>
            </select>
            <div className="flex-1" />
            <button className="flex items-center gap-1 text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-600 hover:bg-gray-50"><Download size={11} />Exporter</button>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-xs">
              <thead><tr className="bg-gray-50 border-b border-gray-100"><th className="text-left px-4 py-2.5 text-gray-400 font-medium">Date</th><th className="text-left px-3 py-2.5 text-gray-400 font-medium">Acteur</th><th className="text-left px-3 py-2.5 text-gray-400 font-medium">Utilisateur concerné</th><th className="text-left px-3 py-2.5 text-gray-400 font-medium">Action</th><th className="text-left px-3 py-2.5 text-gray-400 font-medium">Détails</th><th className="text-left px-3 py-2.5 text-gray-400 font-medium">Justification</th></tr></thead>
              <tbody className="divide-y divide-gray-50">
                {AUDIT_LOG.map(l => (
                  <tr key={l.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2.5 font-mono text-gray-400 whitespace-nowrap">{l.date}</td>
                    <td className="px-3 py-2.5 font-medium text-gray-700">{l.acteur}</td>
                    <td className="px-3 py-2.5 text-gray-600">{l.cible}</td>
                    <td className="px-3 py-2.5">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                        l.action.includes('CREATION') ? 'bg-green-100 text-green-700' :
                        l.action.includes('SUSPENSION') || l.action.includes('DESACTIVATION') ? 'bg-amber-100 text-amber-700' :
                        l.action.includes('MODIFICATION') ? 'bg-blue-100 text-blue-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>{l.action}</span>
                    </td>
                    <td className="px-3 py-2.5 text-gray-500 max-w-[240px] truncate">{l.details}</td>
                    <td className="px-3 py-2.5 text-gray-400 italic">{l.justification}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'parametres' && (
        <div className="space-y-4">
          {/* Sessions */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><LogOut size={14} className="text-[#0B1C3E]" />Sessions actives</h3>
            <div className="space-y-2">
              {[
                { user: 'Alain MBONGO', role: 'Contrôleur Financier', ip: '196.202.10.45', debut: '16/09/2026 08:12', device: 'Chrome / Windows' },
                { user: 'S.E. G. da Piedade Verissimo', role: 'Président', ip: '196.202.10.12', debut: '16/09/2026 09:05', device: 'Safari / macOS' },
                { user: 'Marie-Claire NZENGUE', role: 'Expert budgétaire', ip: '196.202.10.89', debut: '16/09/2026 10:30', device: 'Firefox / Ubuntu' },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 text-xs">
                  <div className="w-2 h-2 rounded-full bg-green-400 shrink-0" />
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800">{s.user}</div>
                    <div className="text-gray-400">{s.role} · {s.device} · IP {s.ip} · depuis {s.debut}</div>
                  </div>
                  <button className="flex items-center gap-1 text-red-500 hover:text-red-700 text-[11px] font-medium"><LogOut size={10} />Forcer déconnexion</button>
                </div>
              ))}
            </div>
          </div>

          {/* Notifications administratives */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Mail size={14} className="text-[#0B1C3E]" />Notifications administratives</h3>
            <div className="space-y-3">
              {[
                { label: 'Notifier l\'admin à la création d\'un compte', enabled: true },
                { label: 'Notifier l\'admin au verrouillage d\'un compte', enabled: true },
                { label: 'Notifier l\'utilisateur à l\'attribution d\'un rôle', enabled: true },
                { label: 'Notifier l\'utilisateur à la réinitialisation du mot de passe', enabled: true },
                { label: 'Alerter à l\'expiration prochaine d\'un compte (J-30)', enabled: false },
                { label: 'Rapport hebdomadaire des connexions échouées', enabled: false },
              ].map((n, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50">
                  <span className="text-xs text-gray-600">{n.label}</span>
                  <button className={`relative w-9 h-5 rounded-full transition-colors ${n.enabled ? 'bg-green-500' : 'bg-gray-200'}`}>
                    <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${n.enabled ? 'right-0.5' : 'left-0.5'}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Types d'utilisateurs */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800 flex items-center gap-2"><Users size={14} className="text-[#0B1C3E]" />Types d'utilisateurs</h3>
              <button className="flex items-center gap-1 text-xs text-white px-2.5 py-1 rounded-lg" style={{ background: '#0B1C3E' }}><Plus size={11} />Ajouter</button>
            </div>
            <table className="w-full text-xs">
              <thead><tr className="bg-gray-50 border-b border-gray-100"><th className="text-left px-4 py-2 text-gray-400 font-medium">Type</th><th className="text-left px-3 py-2 text-gray-400 font-medium">Description</th><th className="text-center px-3 py-2 text-gray-400 font-medium">Accès restreint</th><th className="text-center px-3 py-2 text-gray-400 font-medium">Statut</th></tr></thead>
              <tbody className="divide-y divide-gray-50">
                {[
                  { code: 'INTERNE', desc: 'Personnel de la Commission CEEAC', restreint: false },
                  { code: 'CONSULTANT', desc: 'Consultants et experts externes', restreint: true },
                  { code: 'AUDITEUR', desc: 'Auditeurs internes et externes', restreint: true },
                  { code: 'EXTERNE', desc: 'Partenaires et bailleurs de fonds', restreint: true },
                  { code: 'TECHNIQUE', desc: 'Comptes de service et systèmes', restreint: false },
                ].map(t => (
                  <tr key={t.code} className="hover:bg-gray-50">
                    <td className="px-4 py-2.5 font-mono font-bold text-[#0B1C3E]">{t.code}</td>
                    <td className="px-3 py-2.5 text-gray-600">{t.desc}</td>
                    <td className="px-3 py-2.5 text-center">{t.restreint ? <span className="text-amber-600 text-[10px] font-medium bg-amber-50 px-1.5 py-0.5 rounded">Oui</span> : <span className="text-gray-300 text-[10px]">—</span>}</td>
                    <td className="px-3 py-2.5 text-center"><span className="text-[10px] font-medium text-green-700 bg-green-50 px-1.5 py-0.5 rounded">ACTIF</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* FICHE UTILISATEUR (panneau latéral)                               */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/30 backdrop-blur-sm" onClick={() => setSelectedUser(null)} />
          <div className="w-[600px] bg-white h-full overflow-y-auto shadow-2xl flex flex-col">
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-4" style={{ background: '#0B1C3E' }}>
              <Avatar u={selectedUser} />
              <div className="flex-1">
                <div className="font-bold text-white text-base">{selectedUser.civilite} {selectedUser.prenom} {selectedUser.nom}</div>
                <div className="text-blue-300 text-xs">{selectedUser.fonction} · {selectedUser.direction || selectedUser.departement}</div>
                <div className="mt-1"><StatutBadge statut={selectedUser.statut} /></div>
              </div>
              <button onClick={() => setSelectedUser(null)} className="text-white/50 hover:text-white"><X size={18} /></button>
            </div>

            {/* Sub-tabs */}
            <div className="flex border-b border-gray-200 bg-gray-50">
              {[['identite', 'Identité'], ['organisation', 'Organisation'], ['roles', 'Rôles'], ['securite', 'Sécurité'], ['activite', 'Activité'], ['historique', 'Historique']].map(([id, label]) => (
                <button key={id} onClick={() => setUserDetailTab(id)}
                  className={`px-4 py-2.5 text-xs font-medium border-b-2 transition-colors ${userDetailTab === id ? 'border-[#0B1C3E] text-[#0B1C3E]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                  {label}
                </button>
              ))}
            </div>

            <div className="flex-1 p-6 space-y-4 text-sm">
              {userDetailTab === 'identite' && (
                <div className="space-y-3">
                  {[
                    ['Matricule', selectedUser.matricule],
                    ['Civilité', selectedUser.civilite],
                    ['Nom', selectedUser.nom],
                    ['Prénom', selectedUser.prenom],
                    ['E-mail professionnel', selectedUser.email],
                    ['Téléphone', selectedUser.telephone],
                    ['Type d\'utilisateur', selectedUser.typeUtilisateur],
                    ['Date de prise de fonction', selectedUser.datePriseFonction],
                    ['Création du compte', selectedUser.dateCreation],
                    ['Expiration du compte', selectedUser.dateExpiration],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between py-2 border-b border-gray-50">
                      <span className="text-gray-400 text-xs">{k}</span>
                      <span className="font-medium text-gray-800 text-xs text-right">{v}</span>
                    </div>
                  ))}
                </div>
              )}

              {userDetailTab === 'organisation' && (
                <div className="space-y-3">
                  {[
                    ['Département', selectedUser.departement],
                    ['Direction', selectedUser.direction || '—'],
                    ['Service', selectedUser.service || '—'],
                    ['Fonction', selectedUser.fonction],
                    ['Poste', selectedUser.poste],
                    ['Supérieur hiérarchique', selectedUser.superieur],
                    ['Périmètre d\'accès', selectedUser.perimetre],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between py-2 border-b border-gray-50">
                      <span className="text-gray-400 text-xs">{k}</span>
                      <span className="font-medium text-gray-800 text-xs">{v}</span>
                    </div>
                  ))}
                  <div className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-100 text-xs text-blue-700">
                    Rattachement conforme au Référentiel organisationnel officiel CEEAC 2026
                  </div>
                </div>
              )}

              {userDetailTab === 'roles' && (
                <div className="space-y-3">
                  <div className="p-4 rounded-xl border border-gray-200">
                    <div className="font-semibold text-gray-800 mb-1">{ROLES_DATA.find(r => r.code === selectedUser.role)?.libelle}</div>
                    <div className="text-xs text-gray-500">{ROLES_DATA.find(r => r.code === selectedUser.role)?.description}</div>
                    <div className="mt-2 flex gap-2">
                      <span className="px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 text-[10px]">{ROLES_DATA.find(r => r.code === selectedUser.role)?.type}</span>
                      <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px]">Périmètre : {selectedUser.perimetre}</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">Modules accessibles : {ROLES_DATA.find(r => r.code === selectedUser.role)?.modules}</div>
                </div>
              )}

              {userDetailTab === 'securite' && (
                <div className="space-y-3">
                  {[
                    ['Dernière connexion', selectedUser.derniereConnexion],
                    ['Tentatives échouées', String(selectedUser.tentativesEchouees)],
                    ['Changement mdp obligatoire', selectedUser.changementMdpObligatoire ? 'Oui' : 'Non'],
                    ['Expiration du compte', selectedUser.dateExpiration],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between py-2 border-b border-gray-50">
                      <span className="text-gray-400 text-xs">{k}</span>
                      <span className="font-medium text-gray-800 text-xs">{v}</span>
                    </div>
                  ))}
                  <div className="flex gap-2 mt-4 flex-wrap">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-purple-100 text-purple-700 hover:bg-purple-200"><RotateCcw size={11} />Réinitialiser mdp</button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-100 text-amber-700 hover:bg-amber-200"><Ban size={11} />Suspendre</button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-100 text-blue-700 hover:bg-blue-200"><LogOut size={11} />Forcer déconnexion</button>
                  </div>
                </div>
              )}

              {userDetailTab === 'activite' && (
                <div className="space-y-2">
                  {AUDIT_LOG.filter(l => l.cible.includes(selectedUser.nom)).length === 0
                    ? <div className="text-xs text-gray-400 py-6 text-center">Aucune action récente dans le journal</div>
                    : AUDIT_LOG.filter(l => l.cible.includes(selectedUser.nom)).map(l => (
                      <div key={l.id} className="p-3 rounded-lg border border-gray-100 text-xs">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-gray-400">{l.date}</span>
                          <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 text-[10px] font-semibold">{l.action}</span>
                        </div>
                        <div className="text-gray-600">{l.details}</div>
                        <div className="text-gray-400 italic mt-0.5">{l.justification}</div>
                      </div>
                    ))
                  }
                </div>
              )}

              {userDetailTab === 'historique' && (
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Historique des affectations</h4>
                  {[
                    { debut: selectedUser.datePriseFonction, fin: '—', structure: selectedUser.departement, direction: selectedUser.direction || '—', fonction: selectedUser.fonction, statut: 'En cours', motif: 'Affectation initiale' },
                    { debut: '2023-01-15', fin: selectedUser.datePriseFonction, structure: 'DSG', direction: 'DCRPP', fonction: 'Expert budgétaire', statut: 'Terminée', motif: 'Reclassement interne' },
                  ].map((aff, i) => (
                    <div key={i} className="p-3 rounded-xl border border-gray-100 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-700">{aff.fonction}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${aff.statut === 'En cours' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{aff.statut}</span>
                      </div>
                      <div className="text-gray-500">{aff.structure} · {aff.direction}</div>
                      <div className="flex gap-4 text-gray-400 font-mono text-[10px]">
                        <span>Du {aff.debut}</span>
                        <span>Au {aff.fin}</span>
                      </div>
                      <div className="text-gray-400 italic">{aff.motif}</div>
                    </div>
                  ))}
                  <div className="pt-2">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Modifications de rôle</h4>
                    <div className="p-3 rounded-xl border border-gray-100 text-xs text-gray-500 space-y-1">
                      <div className="flex gap-2"><span className="font-mono text-gray-400">2026-01-10</span><span>Rôle attribué : <b className="text-gray-700">{ROLES_DATA.find(r => r.code === selectedUser.role)?.libelle}</b></span></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer actions */}
            <div className="px-6 py-4 border-t border-gray-100 flex gap-2 bg-gray-50">
              <button onClick={() => { setEditUser(selectedUser); setShowNewUser(true); setSelectedUser(null); setWizardStep(0) }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-white" style={{ background: '#0B1C3E' }}>
                <Edit size={12} />Modifier
              </button>
              <button onClick={() => setSelectedUser(null)} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-gray-600 border border-gray-200 hover:bg-gray-50">Fermer</button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* MODAL — WIZARD CRÉATION / MODIFICATION UTILISATEUR (5 étapes)     */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {showNewUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(11,28,62,0.65)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            {/* Header wizard */}
            <div className="px-6 py-4 flex items-center gap-3 rounded-t-2xl" style={{ background: '#0B1C3E' }}>
              <Users size={15} className="text-white" />
              <div className="flex-1">
                <p className="font-bold text-white text-sm">{editUser ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}</p>
                <p className="text-[10px] text-white/50">{WIZARD_STEPS[wizardStep]}</p>
              </div>
              <div className="flex gap-1">
                {WIZARD_STEPS.map((_, i) => (
                  <div key={i} className={`rounded-full transition-all ${i === wizardStep ? 'w-5 h-2 bg-white' : i < wizardStep ? 'w-2 h-2 bg-white/60' : 'w-2 h-2 bg-white/20'}`} />
                ))}
              </div>
              <button onClick={() => { setShowNewUser(false); setEditUser(null) }} className="text-white/50 hover:text-white ml-2"><X size={16} /></button>
            </div>

            {/* Progress bar */}
            <div className="h-1 bg-gray-100">
              <div className="h-full bg-[#1A6B3A] transition-all" style={{ width: `${((wizardStep + 1) / WIZARD_STEPS.length) * 100}%` }} />
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {/* ÉTAPE 0 — IDENTITÉ */}
              {wizardStep === 0 && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-[#0B1C3E] mb-3">Informations personnelles</h3>
                  <div className="grid grid-cols-4 gap-3">
                    <div>
                      <label className="text-[11px] font-medium text-gray-500 block mb-1">Civilité *</label>
                      <select className="w-full text-xs border border-gray-200 rounded-lg px-2 py-2 outline-none"
                        value={newUserForm.civilite} onChange={e => setNewUserForm(f => ({ ...f, civilite: e.target.value as typeof f.civilite }))}>
                        {['M.', 'Mme', 'Dr', 'S.E.'].map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="text-[11px] font-medium text-gray-500 block mb-1">Nom *</label>
                      <input className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400"
                        placeholder="NOM (majuscules)" value={newUserForm.nom} onChange={e => setNewUserForm(f => ({ ...f, nom: e.target.value }))} />
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-gray-500 block mb-1">Prénom(s) *</label>
                      <input className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400"
                        value={newUserForm.prenom} onChange={e => setNewUserForm(f => ({ ...f, prenom: e.target.value }))} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-medium text-gray-500 block mb-1">E-mail professionnel *</label>
                      <input type="email" className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400"
                        placeholder="prenom.nom@ceeac.int" value={newUserForm.email} onChange={e => setNewUserForm(f => ({ ...f, email: e.target.value }))} />
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-gray-500 block mb-1">Téléphone professionnel</label>
                      <input className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400"
                        placeholder="+XXX XX XX XX XX" value={newUserForm.telephone} onChange={e => setNewUserForm(f => ({ ...f, telephone: e.target.value }))} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-medium text-gray-500 block mb-1">Type d'utilisateur *</label>
                      <select className="w-full text-xs border border-gray-200 rounded-lg px-2 py-2 outline-none"
                        value={newUserForm.typeUtilisateur} onChange={e => setNewUserForm(f => ({ ...f, typeUtilisateur: e.target.value as Utilisateur['typeUtilisateur'] }))}>
                        {['INTERNE', 'CONSULTANT', 'AUDITEUR', 'EXTERNE', 'TECHNIQUE'].map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-gray-500 block mb-1">Date de prise de fonction</label>
                      <input type="date" className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400"
                        value={newUserForm.datePriseFonction} onChange={e => setNewUserForm(f => ({ ...f, datePriseFonction: e.target.value }))} />
                    </div>
                  </div>
                </div>
              )}

              {/* ÉTAPE 1 — AFFECTATION */}
              {wizardStep === 1 && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-[#0B1C3E] mb-3">Rattachement organisationnel officiel</h3>
                  <div className="p-3 rounded-lg bg-blue-50 border border-blue-100 text-xs text-blue-700 flex items-center gap-2">
                    <Building2 size={12} />Les structures proviennent exclusivement du Référentiel organisationnel officiel CEEAC 2026.
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-medium text-gray-500 block mb-1">Département *</label>
                      <select className="w-full text-xs border border-gray-200 rounded-lg px-2 py-2 outline-none"
                        value={newUserForm.departement} onChange={e => setNewUserForm(f => ({ ...f, departement: e.target.value, direction: '', service: '' }))}>
                        <option value="">— Sélectionner —</option>
                        {['DPRES', 'DVPRES', 'DSG', 'DAPPS', 'DMCAEMF', 'DENRADR', 'DATI', 'DPGDHS'].map(d => <option key={d}>{d}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-gray-500 block mb-1">Direction</label>
                      <select className="w-full text-xs border border-gray-200 rounded-lg px-2 py-2 outline-none"
                        value={newUserForm.direction} onChange={e => setNewUserForm(f => ({ ...f, direction: e.target.value }))}>
                        <option value="">— Sélectionner —</option>
                        {(newUserForm.departement === 'DSG' ? ['DCRPP', 'DCMR', 'DPPB', 'DRHMG', 'DSI'] : ['DAP', 'DMARAC', 'EMR']).map((d: string) => <option key={d}>{d}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-gray-500 block mb-1">Service</label>
                      <select className="w-full text-xs border border-gray-200 rounded-lg px-2 py-2 outline-none"
                        value={newUserForm.service} onChange={e => setNewUserForm(f => ({ ...f, service: e.target.value }))}>
                        <option value="">— Optionnel —</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-gray-500 block mb-1">Fonction *</label>
                      <select className="w-full text-xs border border-gray-200 rounded-lg px-2 py-2 outline-none"
                        value={newUserForm.fonction} onChange={e => setNewUserForm(f => ({ ...f, fonction: e.target.value }))}>
                        <option value="">— Sélectionner —</option>
                        {FONCTIONS_DATA.map(f => <option key={f.code} value={f.libelle}>{f.libelle}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-gray-500 block mb-1">Supérieur hiérarchique</label>
                      <select className="w-full text-xs border border-gray-200 rounded-lg px-2 py-2 outline-none"
                        value={newUserForm.superieur} onChange={e => setNewUserForm(f => ({ ...f, superieur: e.target.value }))}>
                        <option value="">— Optionnel —</option>
                        {USERS.filter(u => u.statut === 'ACTIF').map(u => <option key={u.id} value={u.id}>{u.prenom} {u.nom} — {u.fonction}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-gray-500 block mb-1">Périmètre d'accès *</label>
                      <select className="w-full text-xs border border-gray-200 rounded-lg px-2 py-2 outline-none"
                        value={newUserForm.perimetre} onChange={e => setNewUserForm(f => ({ ...f, perimetre: e.target.value }))}>
                        {['Commission', 'Département', 'Direction', 'Service'].map(p => <option key={p}>{p}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* ÉTAPE 2 — COMPTE & SÉCURITÉ */}
              {wizardStep === 2 && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-[#0B1C3E] mb-3">Identifiants de connexion et sécurité</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-medium text-gray-500 block mb-1">Nom d'utilisateur *</label>
                      <input className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400"
                        placeholder="ex: a.mbongo" value={newUserForm.username} onChange={e => setNewUserForm(f => ({ ...f, username: e.target.value }))} />
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-gray-500 block mb-1">Statut initial *</label>
                      <select className="w-full text-xs border border-gray-200 rounded-lg px-2 py-2 outline-none"
                        value={newUserForm.statut} onChange={e => setNewUserForm(f => ({ ...f, statut: e.target.value as StatutCompte }))}>
                        <option value="EN_ATTENTE">En attente d'activation</option>
                        <option value="ACTIF">Actif (activation immédiate)</option>
                      </select>
                    </div>
                  </div>

                  {/* Mode mot de passe */}
                  <div className="flex gap-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="mdpmode" checked={!newUserForm.genererMdpTemp} onChange={() => setNewUserForm(f => ({ ...f, genererMdpTemp: false }))} />
                      <span className="text-xs text-gray-700">Définir le mot de passe</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="mdpmode" checked={newUserForm.genererMdpTemp} onChange={() => setNewUserForm(f => ({ ...f, genererMdpTemp: true, motdepasse: 'Temp@' + Math.random().toString(36).slice(2, 8).toUpperCase(), confirmMotdepasse: '' }))} />
                      <span className="text-xs text-gray-700">Générer un mot de passe temporaire</span>
                    </label>
                  </div>

                  {newUserForm.genererMdpTemp ? (
                    <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800">
                      <p className="font-semibold">Mot de passe temporaire généré :</p>
                      <p className="font-mono mt-1 text-base tracking-widest">{newUserForm.motdepasse}</p>
                      <p className="mt-1">L'utilisateur devra le changer obligatoirement à sa première connexion.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-medium text-gray-500 block mb-1">Mot de passe *</label>
                        <div className="relative">
                          <input type={showMdp ? 'text' : 'password'} className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 pr-8 outline-none focus:border-blue-400"
                            value={newUserForm.motdepasse} onChange={e => setNewUserForm(f => ({ ...f, motdepasse: e.target.value }))} />
                          <button type="button" onClick={() => setShowMdp(v => !v)} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">{showMdp ? <EyeOff size={12} /> : <Eye size={12} />}</button>
                        </div>
                        {newUserForm.motdepasse && (
                          <div className="mt-1.5 space-y-1">
                            <div className="flex gap-1">
                              {[1,2,3,4,5].map(i => <div key={i} className="flex-1 h-1 rounded-full" style={{ background: i <= strength.score ? strength.color : '#E5E7EB' }} />)}
                            </div>
                            <div className="text-[10px] font-medium" style={{ color: strength.color }}>{strength.label}</div>
                          </div>
                        )}
                        <div className="mt-1 text-[10px] text-gray-400 space-y-0.5">
                          {[['min 10 car.', newUserForm.motdepasse.length >= 10], ['Majuscule', /[A-Z]/.test(newUserForm.motdepasse)], ['Chiffre', /[0-9]/.test(newUserForm.motdepasse)], ['Spécial', /[^A-Za-z0-9]/.test(newUserForm.motdepasse)]].map(([label, ok]) => (
                            <span key={label as string} className={`mr-2 ${ok ? 'text-green-600' : 'text-gray-300'}`}>{ok ? '✓' : '○'} {label}</span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-[11px] font-medium text-gray-500 block mb-1">Confirmer le mot de passe *</label>
                        <input type="password" className={`w-full text-xs border rounded-lg px-3 py-2 outline-none focus:border-blue-400 ${newUserForm.confirmMotdepasse && newUserForm.confirmMotdepasse !== newUserForm.motdepasse ? 'border-red-300' : 'border-gray-200'}`}
                          value={newUserForm.confirmMotdepasse} onChange={e => setNewUserForm(f => ({ ...f, confirmMotdepasse: e.target.value }))} />
                        {newUserForm.confirmMotdepasse && newUserForm.confirmMotdepasse !== newUserForm.motdepasse && <p className="text-[10px] text-red-500 mt-1">Les mots de passe ne correspondent pas</p>}
                        {newUserForm.confirmMotdepasse && newUserForm.confirmMotdepasse === newUserForm.motdepasse && <p className="text-[10px] text-green-600 mt-1 flex items-center gap-1"><CheckCircle size={9} />Correspondance OK</p>}
                      </div>
                    </div>
                  )}

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={newUserForm.changementObligatoire} onChange={e => setNewUserForm(f => ({ ...f, changementObligatoire: e.target.checked }))} />
                    <span className="text-xs text-gray-700">Forcer le changement du mot de passe à la première connexion</span>
                  </label>
                </div>
              )}

              {/* ÉTAPE 3 — RÔLES & PERMISSIONS */}
              {wizardStep === 3 && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-[#0B1C3E] mb-3">Rôle et habilitations</h3>
                  <div>
                    <label className="text-[11px] font-medium text-gray-500 block mb-1">Rôle principal *</label>
                    <select className="w-full text-xs border border-gray-200 rounded-lg px-2 py-2 outline-none"
                      value={newUserForm.role} onChange={e => setNewUserForm(f => ({ ...f, role: e.target.value as Profil | '' }))}>
                      <option value="">— Sélectionner un rôle —</option>
                      {ROLES_DATA.map(r => <option key={r.code} value={r.code}>{r.libelle} ({r.type})</option>)}
                    </select>
                  </div>
                  {newUserForm.role && (
                    <div className="p-4 rounded-xl border border-gray-200 bg-gray-50">
                      {(() => { const r = ROLES_DATA.find(r => r.code === newUserForm.role); return r ? (
                        <>
                          <div className="font-semibold text-gray-800 text-sm mb-1">{r.libelle}</div>
                          <div className="text-xs text-gray-500 mb-2">{r.description}</div>
                          <div className="flex gap-2"><span className="px-2 py-0.5 rounded bg-purple-100 text-purple-700 text-[10px]">{r.type}</span><span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-[10px]">Niv. {r.niveau}</span></div>
                          <div className="mt-2 text-xs text-gray-400">Modules : {r.modules}</div>
                        </>
                      ) : null })()}
                    </div>
                  )}
                </div>
              )}

              {/* ÉTAPE 4 — VÉRIFICATION */}
              {wizardStep === 4 && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-[#0B1C3E] mb-3">Synthèse avant création</h3>
                  <div className="space-y-2 text-xs">
                    {[
                      ['Identité', `${newUserForm.civilite} ${newUserForm.prenom} ${newUserForm.nom}`],
                      ['E-mail', newUserForm.email || '—'],
                      ['Département', newUserForm.departement || '—'],
                      ['Direction', newUserForm.direction || '—'],
                      ['Fonction', newUserForm.fonction || '—'],
                      ['Rôle', ROLES_DATA.find(r => r.code === newUserForm.role)?.libelle || '—'],
                      ['Périmètre', newUserForm.perimetre],
                      ['Nom d\'utilisateur', newUserForm.username || '—'],
                      ['Mot de passe', newUserForm.genererMdpTemp ? 'Temporaire (généré)' : '●●●●●●●●'],
                      ['Changement mdp 1ère connexion', newUserForm.changementObligatoire ? 'Oui' : 'Non'],
                      ['Statut initial', newUserForm.statut],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between py-1.5 border-b border-gray-50">
                        <span className="text-gray-400">{k}</span>
                        <span className="font-medium text-gray-800">{v}</span>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
                    <AlertTriangle size={12} className="mt-0.5 shrink-0" />
                    La création sera journalisée dans le journal d'audit avec votre identité et la date/heure.
                  </div>
                </div>
              )}
            </div>

            {/* Footer navigation */}
            <div className="px-6 py-4 border-t border-gray-100 flex justify-between bg-gray-50 rounded-b-2xl">
              <button onClick={() => wizardStep > 0 ? setWizardStep(s => s - 1) : setShowNewUser(false)}
                className="px-4 py-2 rounded-lg text-xs border border-gray-200 text-gray-600 hover:bg-gray-50">
                {wizardStep === 0 ? 'Annuler' : '← Retour'}
              </button>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">Étape {wizardStep + 1} / {WIZARD_STEPS.length}</span>
                {wizardStep < WIZARD_STEPS.length - 1 ? (
                  <button onClick={() => setWizardStep(s => s + 1)}
                    className="px-4 py-2 rounded-lg text-xs font-semibold text-white" style={{ background: '#0B1C3E' }}>
                    Suivant →
                  </button>
                ) : (
                  <button onClick={() => {
                    setUsersState(prev => [...prev, {
                      id: `U${String(prev.length + 1).padStart(3, '0')}`,
                      matricule: `CEEAC-2026-${String(prev.length + 1).padStart(3, '0')}`,
                      civilite: newUserForm.civilite, nom: newUserForm.nom, prenom: newUserForm.prenom,
                      email: newUserForm.email, telephone: newUserForm.telephone,
                      structure: newUserForm.direction || newUserForm.departement,
                      departement: newUserForm.departement, direction: newUserForm.direction,
                      service: newUserForm.service, fonction: newUserForm.fonction, poste: '',
                      superieur: newUserForm.superieur, role: (newUserForm.role || 'EXPERT-BUD') as Profil,
                      perimetre: newUserForm.perimetre, statut: newUserForm.statut,
                      derniereConnexion: '—', dateCreation: new Date().toISOString().slice(0, 10),
                      datePriseFonction: newUserForm.datePriseFonction,
                      changementMdpObligatoire: newUserForm.changementObligatoire,
                      tentativesEchouees: 0, dateExpiration: '2027-12-31',
                      typeUtilisateur: newUserForm.typeUtilisateur,
                    }])
                    setShowNewUser(false)
                  }}
                    className="px-4 py-2 rounded-lg text-xs font-semibold text-white" style={{ background: '#1A6B3A' }}>
                    <CheckCircle size={12} className="inline mr-1" />Créer l'utilisateur
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* MODAL — CONFIGURATION RÔLE                                        */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {showRoleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(11,28,62,0.65)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="px-6 py-4 rounded-t-2xl flex items-center gap-3" style={{ background: '#0B1C3E' }}>
              <Shield size={14} className="text-white" />
              <p className="font-bold text-white text-sm">{editRole ? `Configurer : ${editRole.libelle}` : 'Nouveau rôle'}</p>
              <button onClick={() => { setShowRoleModal(false); setEditRole(null) }} className="ml-auto text-white/50 hover:text-white"><X size={15} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[['Code', editRole?.code ?? ''], ['Libellé', editRole?.libelle ?? ''], ['Type', editRole?.type ?? ''], ['Niveau', String(editRole?.niveau ?? '')], ['Périmètre', editRole?.perimetre ?? '']].map(([label, val]) => (
                  <div key={label}>
                    <label className="text-[11px] font-medium text-gray-500 block mb-1">{label}</label>
                    <input className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400" defaultValue={val} />
                  </div>
                ))}
              </div>
              <div>
                <label className="text-[11px] font-medium text-gray-500 block mb-1">Description</label>
                <textarea className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400 resize-none" rows={2} defaultValue={editRole?.description} />
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <button onClick={() => { setShowRoleModal(false); setEditRole(null) }} className="px-4 py-2 rounded-lg text-xs border border-gray-200 text-gray-600 hover:bg-gray-50">Annuler</button>
                <button onClick={() => { setShowRoleModal(false); setEditRole(null) }} className="px-4 py-2 rounded-lg text-xs font-semibold text-white" style={{ background: '#0B1C3E' }}>Enregistrer</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* MODAL PIN (conservé identique)                                    */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {showPinSetup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(11,28,62,0.65)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3" style={{ background: '#0B1C3E', borderRadius: '1rem 1rem 0 0' }}>
              <KeyRound size={15} className="text-white" />
              <div><p className="font-bold text-white text-sm">Initialisation / Réinitialisation du code PIN</p><p className="text-[10px] text-white/50">Procédure sécurisée à double canal</p></div>
              <div className="ml-auto flex gap-1">
                {(['info','otp','pin','confirm','done'] as const).map((s, i) => <div key={s} className={`w-2 h-2 rounded-full ${pinSetupStep === s ? 'bg-white' : i < (['info','otp','pin','confirm','done'] as const).indexOf(pinSetupStep) ? 'bg-white/50' : 'bg-white/20'}`} />)}
              </div>
            </div>
            <div className="p-6">
              {pinSetupStep === 'info' && (
                <div className="space-y-4">
                  <p className="font-bold text-slate-800 mb-1">Étape 1 — Identification de l'Ordonnateur</p>
                  <select className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none"><option>S.E. Gilberto da Piedade Verissimo — Président</option><option>M. Jean MBIDA — Secrétaire Général</option><option>Mme. Angélique KOUMBA — SG par intérim</option></select>
                  <select className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none"><option>Première configuration</option><option>PIN oublié / perdu</option><option>Blocage après 3 tentatives</option><option>Expiration</option></select>
                  <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-800"><p className="font-bold mb-0.5">Un code OTP sera envoyé :</p><div className="flex items-center gap-2 mt-1"><Smartphone size={10} /> +241 ** ** ** 34</div><div className="flex items-center gap-2 mt-0.5"><Mail size={10} /> g.v***@ceeac.int</div></div>
                  <div className="flex gap-2 justify-end"><button onClick={() => setShowPinSetup(false)} className="text-xs px-3 py-2 rounded-lg border border-gray-200 text-gray-600">Annuler</button><button onClick={() => setPinSetupStep('otp')} className="text-xs px-3 py-2 rounded-lg text-white font-medium" style={{ background: '#0B1C3E' }}><RefreshCw size={11} className="inline mr-1" />Envoyer OTP</button></div>
                </div>
              )}
              {pinSetupStep === 'otp' && (
                <div className="space-y-4">
                  <p className="font-bold text-slate-800">Étape 2 — Vérification OTP</p>
                  <div className="p-3 rounded-xl bg-green-50 border border-green-200 flex items-center gap-2 text-xs text-green-800"><CheckCircle size={12} className="text-green-600" /><div><p className="font-bold">Code OTP envoyé</p><p>Valide 10 minutes</p></div></div>
                  <input className="w-full text-center text-2xl font-mono tracking-[0.5em] border border-gray-200 rounded-lg py-3 outline-none" placeholder="• • • • • •" maxLength={6} value={otpCode} onChange={e => setOtpCode(e.target.value.replace(/\D/g,''))} />
                  <div className="flex gap-2 justify-between"><button onClick={() => setPinSetupStep('info')} className="text-xs px-3 py-2 rounded-lg border border-gray-200 text-gray-600">← Retour</button><div className="flex gap-2"><button onClick={() => setOtpResent(true)} className="text-xs px-3 py-2 rounded-lg border border-gray-200 text-gray-600">{otpResent ? '✓ Renvoyé' : 'Renvoyer'}</button><button disabled={otpCode.length < 6} onClick={() => setPinSetupStep('pin')} className="text-xs px-3 py-2 rounded-lg text-white font-medium disabled:opacity-40" style={{ background: '#0B1C3E' }}>Vérifier →</button></div></div>
                </div>
              )}
              {pinSetupStep === 'pin' && (
                <div className="space-y-4">
                  <p className="font-bold text-slate-800">Étape 3 — Nouveau PIN</p>
                  <div className="relative"><input type={showPin ? 'text' : 'password'} className="w-full text-center text-2xl font-mono tracking-[0.5em] border border-gray-200 rounded-lg py-3 pr-10 outline-none" placeholder="• • • • • •" maxLength={6} value={newPin} onChange={e => setNewPin(e.target.value.replace(/\D/g,''))} /><button onClick={() => setShowPin(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{showPin ? <EyeOff size={14} /> : <Eye size={14} />}</button></div>
                  <input type="password" className={`w-full text-center text-2xl font-mono tracking-[0.5em] border rounded-lg py-3 outline-none ${confirmPin && confirmPin !== newPin ? 'border-red-400' : 'border-gray-200'}`} placeholder="• • • • • •" maxLength={6} value={confirmPin} onChange={e => setConfirmPin(e.target.value.replace(/\D/g,''))} />
                  {confirmPin && confirmPin !== newPin && <p className="text-xs text-red-500">Les codes PIN ne correspondent pas</p>}
                  <div className="flex gap-2 justify-between"><button onClick={() => setPinSetupStep('otp')} className="text-xs px-3 py-2 rounded-lg border border-gray-200 text-gray-600">← Retour</button><button disabled={newPin.length < 6 || newPin !== confirmPin} onClick={() => setPinSetupStep('confirm')} className="text-xs px-3 py-2 rounded-lg text-white font-medium disabled:opacity-40" style={{ background: '#0B1C3E' }}>Valider →</button></div>
                </div>
              )}
              {pinSetupStep === 'confirm' && (
                <div className="space-y-4">
                  <p className="font-bold text-slate-800">Étape 4 — Confirmation administrative</p>
                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-sm space-y-2"><div className="flex justify-between"><span className="text-gray-400">Action</span><span className="font-semibold">Initialisation PIN</span></div><div className="flex justify-between"><span className="text-gray-400">Date</span><span className="font-mono">16/09/2026 {new Date().toTimeString().slice(0,5)}</span></div></div>
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2"><AlertTriangle size={11} className="mt-0.5" /><p>Cette opération sera enregistrée dans le journal d'audit.</p></div>
                  <div className="flex gap-2 justify-between"><button onClick={() => setPinSetupStep('pin')} className="text-xs px-3 py-2 rounded-lg border border-gray-200 text-gray-600">← Retour</button><button onClick={() => { setPinSetupStep('done'); setOtpCode(''); setNewPin(''); setConfirmPin('') }} className="text-xs px-3 py-2 rounded-lg text-white font-medium" style={{ background: '#16A34A' }}><CheckCircle size={11} className="inline mr-1" />Confirmer</button></div>
                </div>
              )}
              {pinSetupStep === 'done' && (
                <div className="text-center py-4 space-y-4">
                  <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto"><CheckCircle size={26} className="text-green-600" /></div>
                  <div><p className="font-bold text-lg text-slate-800">Code PIN initialisé</p><p className="text-sm text-slate-500 mt-1">L'Ordonnateur peut désormais signer les Ordres de Paiement.</p></div>
                  <button onClick={() => { setShowPinSetup(false); setPinSetupStep('info') }} className="px-5 py-2 rounded-lg text-sm font-medium text-white" style={{ background: '#0B1C3E' }}>Fermer</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
