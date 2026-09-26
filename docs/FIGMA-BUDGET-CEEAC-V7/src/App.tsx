import { useState } from 'react'
import type { Page } from './types'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import Welcome from './pages/Welcome'
import Dashboard from './pages/Dashboard'
import ExpressionBesoin from './pages/ExpressionBesoin'
import EBDetail from './pages/EBDetail'
import EBForm from './pages/EBForm'
import Engagement from './pages/Engagement'
import EngagementDetail from './pages/EngagementDetail'
import Liquidation from './pages/Liquidation'
import LiquidationDetail from './pages/LiquidationDetail'
import Ordonnancement from './pages/Ordonnancement'
import OrdonancementDetail from './pages/OrdonancementDetail'
import Paiement from './pages/Paiement'
import PaiementDetail from './pages/PaiementDetail'
import SuiviEvaluation from './pages/SuiviEvaluation'
import Budget from './pages/Budget'
import Reporting from './pages/Reporting'
import Administration from './pages/Administration'
import MesTaches from './pages/MesTaches'
import Planification from './pages/Planification'
import GED from './pages/GED'
import ControleInterne from './pages/ControleInterne'
import Audit from './pages/Audit'
import JournalEvenements from './pages/JournalEvenements'
import PreparationBudgetaire from './pages/PreparationBudgetaire'
import ClotureBudgetaire from './pages/ClotureBudgetaire'
import PAP from './pages/PAP'
import Dossier from './pages/Dossier'
import WorkflowAdmin from './pages/WorkflowAdmin'
import Tiers from './pages/Tiers'
import TiersDetail from './pages/TiersDetail'
import Marches from './pages/Marches'
import Recettes from './pages/Recettes'
import Projets from './pages/Projets'
import GanttExecution from './pages/GanttExecution'
import Interoperabilite from './pages/Interoperabilite'
import Referentiel from './pages/Referentiel'
import ExecutiveDashboard from './pages/ExecutiveDashboard'

const PAGE_LABELS: Partial<Record<Page, string>> = {
  dashboard: 'Tableau de bord',
  'eb-list': 'Expressions de Besoin',
  'eb-detail': 'Détail EB',
  'eb-form': 'Nouvelle Expression de Besoin',
  'eng-list': 'Engagements',
  'eng-detail': 'Détail Engagement',
  'liq-list': 'Liquidations',
  'liq-detail': 'Détail Liquidation',
  'ord-list': 'Ordonnancements',
  'ord-detail': 'Détail Ordonnancement',
  'pay-list': 'Paiements',
  'pay-detail': 'Détail Paiement',
  se: 'Suivi-Évaluation',
  budget: 'Budget',
  pap: 'PAP',
  planification: 'Planification stratégique',
  reporting: 'Reporting',
  ged: 'GED',
  controle: 'Contrôle interne',
  audit: 'Audit',
  journal: 'Journal des Événements',
  preparation: 'Préparation et Programmation Budgétaire',
  cloture: 'Clôture Budgétaire',
  tiers: 'Tiers, Entreprises & Bénéficiaires',
  marches: 'Marchés & Contrats',
  recettes: 'Recettes',
  projets: 'Projets & Investissements',
  administration: 'Administration',
  'mes-taches': 'Mes tâches',
  dossier: 'Dossier numérique',
  'workflow-list': 'Gestion des Workflows',
  'workflow-detail': 'Détail Workflow',
  gantt: 'Gantt d\'exécution budgétaire',
  interop: 'Import, Export & Interopérabilité',
  referentiel: 'Référentiels officiels CEEAC',
  executive: 'Tableau de bord exécutif',
}

const CHAIN_PAGES: Page[] = ['eb-list', 'eb-detail', 'eb-form', 'eng-list', 'eng-detail', 'liq-list', 'liq-detail', 'ord-list', 'ord-detail', 'pay-list', 'pay-detail']

function getBreadcrumb(page: Page, itemId?: string): { label: string; page?: Page }[] {
  if (page === 'dashboard') return []
  if (page === 'eb-list') return [{ label: 'Chaîne de dépense' }, { label: 'Expressions de Besoin' }]
  if (page === 'eb-detail') return [{ label: 'Chaîne de dépense' }, { label: 'Expressions de Besoin', page: 'eb-list' }, { label: itemId ?? 'EB' }]
  if (page === 'eb-form') return [{ label: 'Chaîne de dépense' }, { label: 'Expressions de Besoin', page: 'eb-list' }, { label: 'Nouvelle EB' }]
  if (page === 'eng-list') return [{ label: 'Chaîne de dépense' }, { label: 'Engagements' }]
  if (page === 'eng-detail') return [{ label: 'Chaîne de dépense' }, { label: 'Engagements', page: 'eng-list' }, { label: itemId ?? 'ENG' }]
  if (page === 'liq-list') return [{ label: 'Chaîne de dépense' }, { label: 'Liquidations' }]
  if (page === 'liq-detail') return [{ label: 'Chaîne de dépense' }, { label: 'Liquidations', page: 'liq-list' }, { label: itemId ?? 'LIQ' }]
  if (page === 'ord-list') return [{ label: 'Chaîne de dépense' }, { label: 'Ordonnancements' }]
  if (page === 'ord-detail') return [{ label: 'Chaîne de dépense' }, { label: 'Ordonnancements', page: 'ord-list' }, { label: itemId ?? 'ORD' }]
  if (page === 'pay-list') return [{ label: 'Chaîne de dépense' }, { label: 'Paiements' }]
  if (page === 'pay-detail') return [{ label: 'Chaîne de dépense' }, { label: 'Paiements', page: 'pay-list' }, { label: itemId ?? 'PAY' }]
  if (page === 'se') return [{ label: 'Suivi-Évaluation' }]
  if (page === 'budget') return [{ label: 'Budget 2026' }]
  if (page === 'pap') return [{ label: 'Plan Annuel de Performance 2026' }]
  if (page === 'referentiel') return [{ label: 'Référentiels officiels CEEAC' }]
  if (page === 'executive') return [{ label: 'Tableau de bord exécutif' }]
  if (page === 'planification') return [{ label: 'Planification stratégique' }]
  if (page === 'reporting') return [{ label: 'Reporting institutionnel' }]
  if (page === 'administration') return [{ label: 'Administration' }]
  if (page === 'mes-taches') return [{ label: 'Mes tâches' }]
  if (page === 'workflow-list') return [{ label: 'Administration', page: 'administration' }, { label: 'Workflows' }]
  if (page === 'workflow-detail') return [{ label: 'Administration', page: 'administration' }, { label: 'Workflows', page: 'workflow-list' }, { label: itemId ?? 'Workflow' }]
  return [{ label: PAGE_LABELS[page] ?? page }]
}


interface CurrentUser {
  nom: string
  role: string
  structure: string
  email: string
}

export default function App() {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)
  const [activePage, setActivePage] = useState<Page>('dashboard')
  const [activeItemId, setActiveItemId] = useState<string | undefined>(undefined)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  if (!currentUser) {
    return <Welcome onLogin={user => setCurrentUser(user)} />
  }

  const navigate = (page: Page, id?: string) => {
    setActivePage(page)
    setActiveItemId(id)
  }

  const breadcrumb = getBreadcrumb(activePage, activeItemId)

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <Dashboard onNavigate={navigate} />
      case 'eb-list': return <ExpressionBesoin onNavigate={navigate} />
      case 'eb-detail': return <EBDetail id={activeItemId ?? 'EB-001'} onNavigate={navigate} />
      case 'eb-form': return <EBForm onNavigate={navigate} />
      case 'eng-list': return <Engagement onNavigate={navigate} />
      case 'eng-detail': return <EngagementDetail id={activeItemId ?? 'ENG-002'} onNavigate={navigate} />
      case 'liq-list': return <Liquidation onNavigate={navigate} />
      case 'liq-detail': return <LiquidationDetail id={activeItemId ?? 'LIQ-001'} onNavigate={navigate} />
      case 'ord-list': return <Ordonnancement onNavigate={navigate} />
      case 'ord-detail': return <OrdonancementDetail id={activeItemId ?? 'ORD-002'} onNavigate={navigate} />
      case 'pay-list': return <Paiement onNavigate={navigate} />
      case 'pay-detail': return <PaiementDetail id={activeItemId ?? 'PAY-002'} onNavigate={navigate} />
      case 'se': return <SuiviEvaluation onNavigate={navigate} />
      case 'budget': return <Budget onNavigate={navigate} />
      case 'pap': return <PAP />
      case 'planification': return <Planification onNavigate={navigate} />
      case 'reporting': return <Reporting onNavigate={navigate} />
      case 'administration': return <Administration onNavigate={navigate} />
      case 'mes-taches': return <MesTaches onNavigate={navigate} />
      case 'ged': return <GED />
      case 'controle': return <ControleInterne />
      case 'audit': return <Audit />
      case 'journal': return <JournalEvenements onNavigate={navigate} />
      case 'preparation': return <PreparationBudgetaire onNavigate={navigate} />
      case 'cloture': return <ClotureBudgetaire onNavigate={navigate} />
      case 'tiers': return <Tiers onNavigate={navigate} />
      case 'tiers-detail': return <TiersDetail id={activeItemId ?? 'T001'} onNavigate={navigate} />
      case 'marches': return <Marches onNavigate={navigate} />
      case 'recettes': return <Recettes onNavigate={navigate} />
      case 'projets': return <Projets onNavigate={navigate} />
      case 'dossier': return <Dossier onNavigate={navigate} />
      case 'workflow-list': return <WorkflowAdmin onNavigate={navigate} />
      case 'workflow-detail': return <WorkflowAdmin onNavigate={navigate} />
      case 'tiers': return <Tiers onNavigate={navigate} />
      case 'marches': return <Marches onNavigate={navigate} />
      case 'recettes': return <Recettes onNavigate={navigate} />
      case 'projets': return <Projets onNavigate={navigate} />
      case 'gantt': return <GanttExecution onNavigate={navigate} />
      case 'interop': return <Interoperabilite onNavigate={navigate} />
      case 'referentiel': return <Referentiel onNavigate={navigate} />
      case 'executive': return <ExecutiveDashboard onNavigate={navigate} />
      default: return <Dashboard onNavigate={navigate} />
    }
  }

  return (
    <div className="flex h-full overflow-hidden">
      <Sidebar
        activePage={activePage}
        onNavigate={navigate}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <TopBar breadcrumb={breadcrumb} onNavigate={navigate} currentUser={currentUser} onLogout={() => setCurrentUser(null)} />
        <main className="flex-1 overflow-auto" style={{ background: '#F0F4FA' }}>
          {renderPage()}
        </main>
      </div>
    </div>
  )
}
