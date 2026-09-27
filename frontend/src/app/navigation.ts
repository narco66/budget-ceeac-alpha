import type { LucideIcon } from 'lucide-react'
import {
  BarChart3,
  BookOpen,
  ClipboardList,
  Database,
  Folder,
  GitBranch,
  LayoutDashboard,
  Lock,
  Map,
  ScrollText,
  Search,
  Settings,
  Shield,
  ShoppingCart,
  Target,
  Telescope,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-react'

export type NavItem = {
  to: string
  label: string
  icon?: LucideIcon
  end?: boolean
  permission?: string
  children?: { to: string; label: string; permission?: string }[]
}

export type NavSection = {
  category: string
  items: NavItem[]
}

export const NAV: NavSection[] = [
  {
    category: 'Accueil',
    items: [
      { to: '/app', label: 'Tableau de bord', icon: LayoutDashboard, end: true },
      { to: '/app/taches', label: 'Mes tâches', icon: ClipboardList },
    ],
  },
  {
    category: 'Pilotage exécutif',
    items: [{ to: '/app/executif', label: 'Tableau de bord exécutif', icon: Telescope }],
  },
  {
    category: 'Référentiels officiels',
    items: [
      { to: '/app/referentiel', label: 'Organisation CEEAC', icon: Database, permission: 'organization.view' },
      { to: '/app/exercice', label: 'Exercice et circuits', icon: ScrollText, permission: 'referentials.view' },
    ],
  },
  {
    category: 'Planification et budget',
    items: [
      { to: '/app/planification', label: 'Planification stratégique', icon: Map },
      { to: '/app/preparation', label: 'Préparation budgétaire', icon: Target },
      { to: '/app/budget', label: 'Gestion du budget', icon: Wallet, permission: 'budget.view' },
      { to: '/app/pap', label: 'PAP / GAR / RBM', icon: BarChart3 },
    ],
  },
  {
    category: 'Chaîne de dépense',
    items: [
      {
        to: '/app/depenses',
        label: 'Dépenses',
        icon: GitBranch,
        children: [
          { to: '/app/expressions-besoin', label: 'Expressions de besoin', permission: 'need_requests.view' },
          { to: '/app/engagements', label: 'Engagements', permission: 'commitments.view' },
          { to: '/app/liquidations', label: 'Liquidations', permission: 'liquidations.view' },
          { to: '/app/ordonnancements', label: 'Ordonnancements', permission: 'payment_orders.view' },
          { to: '/app/paiements', label: 'Paiements', permission: 'payments.view' },
        ],
      },
      { to: '/app/tiers', label: 'Tiers et fournisseurs', icon: Users, permission: 'parties.view' },
      { to: '/app/marches', label: 'Achats et marchés', icon: ShoppingCart, permission: 'contracts.view' },
    ],
  },
  {
    category: 'Projets et performance',
    items: [
      { to: '/app/gantt', label: 'Gantt d’exécution', icon: TrendingUp },
      { to: '/app/suivi-evaluation', label: 'Suivi-évaluation', icon: TrendingUp },
      { to: '/app/reporting', label: 'Reporting', icon: BookOpen },
      { to: '/app/cloture', label: 'Clôture budgétaire', icon: Lock },
    ],
  },
  {
    category: 'Documents',
    items: [
      { to: '/app/ged', label: 'GED et documents', icon: Folder, permission: 'documents.view' },
      { to: '/app/dossier', label: 'Dossier numérique', icon: GitBranch, permission: 'need_requests.view' },
    ],
  },
  {
    category: 'Contrôle et audit',
    items: [
      { to: '/app/controle', label: 'Contrôle interne', icon: Shield, permission: 'findings.view' },
      { to: '/app/audit', label: 'Journal d’audit', icon: Search, permission: 'audit.view' },
      { to: '/app/journal', label: 'Journal des événements', icon: ScrollText },
    ],
  },
  {
    category: 'Administration',
    items: [
      { to: '/app/utilisateurs', label: 'Utilisateurs et rôles', icon: Settings, permission: 'users.view' },
    ],
  },
]

export const MODULE_TITLES: Record<string, string> = {
  executif: 'Tableau de bord exécutif',
  planification: 'Planification stratégique',
  preparation: 'Préparation budgétaire',
  budget: 'Gestion du budget',
  pap: 'PAP / GAR / RBM',
  depenses: 'Dépenses',
  'expressions-besoin': 'Expressions de besoin',
  engagements: 'Engagements',
  liquidations: 'Liquidations',
  ordonnancements: 'Ordonnancements',
  paiements: 'Paiements',
  tiers: 'Tiers et fournisseurs',
  marches: 'Achats et marchés',
  gantt: 'Gantt d’exécution',
  'suivi-evaluation': 'Suivi-évaluation',
  reporting: 'Reporting',
  cloture: 'Clôture budgétaire',
  ged: 'GED et documents',
  dossier: 'Dossier numérique',
  controle: 'Contrôle interne',
  journal: 'Journal des événements',
}
