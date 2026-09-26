import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'
import {
  ShoppingCart, FileText, Award, Package, Shield, LayoutDashboard,
  Plus, X, ChevronRight, AlertTriangle, CheckCircle, Clock, Ban,
} from 'lucide-react'

import type { Page } from '../types'
interface Props { onNavigate: (page: Page, id?: string) => void }

const fmt = (n: number) =>
  new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(n) + ' XAF'
const fmtM = (n: number) =>
  new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 1 }).format(n / 1_000_000) + ' M XAF'

// ─── Mock data ────────────────────────────────────────────────────────────────
const MARCHES = [
  { id: 'CTR-0001', ref: 'CTR-0001', objet: 'Fourniture équipements informatiques', mode: 'Appel d\'offres ouvert', titulaire: 'Tech Solutions SARL', montant: 185_000_000, dateSignature: '2026-01-15', dateFin: '2026-07-15', avancement: 72, statut: 'En exécution', ligne: 'BUD-IT-001', trimestre: 'T1' },
  { id: 'CTR-0002', ref: 'CTR-0002', objet: 'Maintenance véhicules de service', mode: 'Gré à gré', titulaire: 'Garage Central AUTO', montant: 42_500_000, dateSignature: '2026-02-01', dateFin: '2026-12-31', avancement: 38, statut: 'En exécution', ligne: 'BUD-LOG-003', trimestre: 'T1' },
  { id: 'CTR-0003', ref: 'CTR-0003', objet: 'Services conseil juridique', mode: 'Entente directe', titulaire: 'Cabinet Mbaye & Associés', montant: 95_000_000, dateSignature: '2026-01-20', dateFin: '2026-06-30', avancement: 100, statut: 'Clôturé', ligne: 'BUD-JUR-002', trimestre: 'T1' },
  { id: 'CTR-0004', ref: 'CTR-0004', objet: 'Travaux réhabilitation bâtiment siège', mode: 'Appel d\'offres ouvert', titulaire: 'BTP Constructions SA', montant: 520_000_000, dateSignature: '2026-03-05', dateFin: '2026-12-05', avancement: 15, statut: 'En exécution', ligne: 'BUD-INF-001', trimestre: 'T1' },
  { id: 'CTR-0005', ref: 'CTR-0005', objet: 'Fourniture mobilier de bureau', mode: 'Appel d\'offres restreint', titulaire: 'Meubles Pro Afrique', montant: 68_000_000, dateSignature: '2026-02-20', dateFin: '2026-05-20', avancement: 100, statut: 'Clôturé', ligne: 'BUD-MAT-002', trimestre: 'T2' },
  { id: 'CTR-0006', ref: 'CTR-0006', objet: 'Prestation nettoyage et gardiennage', mode: 'Gré à gré', titulaire: 'SecuNet Cameroun', montant: 36_000_000, dateSignature: '2026-01-02', dateFin: '2026-12-31', avancement: 58, statut: 'En exécution', ligne: 'BUD-ADM-004', trimestre: 'T1' },
  { id: 'CTR-0007', ref: 'CTR-0007', objet: 'Formation personnel sur progiciels', mode: 'Entente directe', titulaire: 'INFOSYS Training', montant: 28_500_000, dateSignature: '2026-04-01', dateFin: '2026-06-30', avancement: 0, statut: 'Attribué', ligne: 'BUD-RH-005', trimestre: 'T2' },
  { id: 'CTR-0008', ref: 'CTR-0008', objet: 'Acquisition logiciels comptables', mode: 'Appel d\'offres restreint', titulaire: '', montant: 112_000_000, dateSignature: '', dateFin: '', avancement: 0, statut: 'En consultation', ligne: 'BUD-IT-002', trimestre: 'T2' },
  { id: 'CTR-0009', ref: 'CTR-0009', objet: 'Audit financier externe 2026', mode: 'Appel d\'offres ouvert', titulaire: '', montant: 75_000_000, dateSignature: '', dateFin: '', avancement: 0, statut: 'En consultation', ligne: 'BUD-FIN-003', trimestre: 'T2' },
  { id: 'CTR-0010', ref: 'CTR-0010', objet: 'Impression et reprographie documents', mode: 'Gré à gré', titulaire: 'Imprimerie Centrale', montant: 18_000_000, dateSignature: '2026-01-10', dateFin: '2026-12-31', avancement: 45, statut: 'En exécution', ligne: 'BUD-ADM-001', trimestre: 'T1' },
  { id: 'CTR-0011', ref: 'CTR-0011', objet: 'Connexion internet haut débit', mode: 'Entente directe', titulaire: '', montant: 24_000_000, dateSignature: '', dateFin: '', avancement: 0, statut: 'Planifié', ligne: 'BUD-IT-003', trimestre: 'T3' },
  { id: 'CTR-0012', ref: 'CTR-0012', objet: 'Fourniture carburant et lubrifiants', mode: 'Gré à gré', titulaire: 'PétroServ RCA', montant: 54_000_000, dateSignature: '2026-01-05', dateFin: '2026-12-31', avancement: 62, statut: 'En exécution', ligne: 'BUD-LOG-001', trimestre: 'T1' },
]

const CONSULTATIONS = [
  { id: 'CONS-0001', ref: 'CONS-0001', objet: 'Acquisition logiciels comptables', mode: 'Appel d\'offres restreint', dateLancement: '2026-03-01', dateCloture: '2026-04-01', offres: 4, statut: 'Évaluation' },
  { id: 'CONS-0002', ref: 'CONS-0002', objet: 'Audit financier externe 2026', mode: 'Appel d\'offres ouvert', dateLancement: '2026-03-15', dateCloture: '2026-04-30', offres: 6, statut: 'Ouvert' },
  { id: 'CONS-0003', ref: 'CONS-0003', objet: 'Connexion internet haut débit', mode: 'Entente directe', dateLancement: '2026-05-01', dateCloture: '2026-05-15', offres: 0, statut: 'Annulé' },
]

const OFFRES = [
  { cons: 'CONS-0001', soumissionnaire: 'SAP Africa Ltd', montant: 98_000_000, scoreTech: 82, scoreTotal: 85, statut: 'Retenu' },
  { cons: 'CONS-0001', soumissionnaire: 'Oracle West Africa', montant: 125_000_000, scoreTech: 78, scoreTotal: 76, statut: 'Non retenu' },
  { cons: 'CONS-0001', soumissionnaire: 'Sage Africa', montant: 88_000_000, scoreTech: 71, scoreTotal: 74, statut: 'Non retenu' },
  { cons: 'CONS-0001', soumissionnaire: 'Odoo Partners CI', montant: 62_000_000, scoreTech: 65, scoreTotal: 69, statut: 'Non retenu' },
  { cons: 'CONS-0002', soumissionnaire: 'PwC Afrique Centrale', montant: 72_000_000, scoreTech: 91, scoreTotal: 90, statut: 'En évaluation' },
  { cons: 'CONS-0002', soumissionnaire: 'Deloitte Cameroun', montant: 68_000_000, scoreTech: 88, scoreTotal: 87, statut: 'En évaluation' },
]

const LIVRABLES = [
  { id: 1, livrable: 'Lot 1 – Serveurs (×4)', contrat: 'CTR-0001', titulaire: 'Tech Solutions SARL', datePrevue: '2026-03-15', dateReception: '2026-03-18', pv: 'Oui', conformite: 'Conforme' },
  { id: 2, livrable: 'Lot 2 – Postes de travail (×20)', contrat: 'CTR-0001', titulaire: 'Tech Solutions SARL', datePrevue: '2026-04-01', dateReception: '2026-04-03', pv: 'Oui', conformite: 'Conforme' },
  { id: 3, livrable: 'Lot 3 – Imprimantes (×8)', contrat: 'CTR-0001', titulaire: 'Tech Solutions SARL', datePrevue: '2026-05-15', dateReception: '', pv: 'Non', conformite: '-' },
  { id: 4, livrable: 'Révision périodique Q1', contrat: 'CTR-0002', titulaire: 'Garage Central AUTO', datePrevue: '2026-02-28', dateReception: '2026-03-02', pv: 'Oui', conformite: 'Partiel' },
  { id: 5, livrable: 'Rapport conseil juridique – mars', contrat: 'CTR-0003', titulaire: 'Cabinet Mbaye & Associés', datePrevue: '2026-03-31', dateReception: '2026-03-31', pv: 'Oui', conformite: 'Conforme' },
  { id: 6, livrable: 'Gros œuvre – phase 1', contrat: 'CTR-0004', titulaire: 'BTP Constructions SA', datePrevue: '2026-05-30', dateReception: '', pv: 'Non', conformite: '-' },
]

const GARANTIES = [
  { id: 1, type: 'Caution provisoire', contrat: 'CTR-0004', montant: 10_400_000, dateEmission: '2026-01-20', dateExpiration: '2026-04-20', statut: 'Expirée' },
  { id: 2, type: 'Caution définitive', contrat: 'CTR-0004', montant: 26_000_000, dateEmission: '2026-03-10', dateExpiration: '2026-12-10', statut: 'Active' },
  { id: 3, type: 'Retenue de garantie', contrat: 'CTR-0001', montant: 9_250_000, dateEmission: '2026-01-15', dateExpiration: '2026-07-15', statut: 'Active' },
  { id: 4, type: 'Caution définitive', contrat: 'CTR-0001', montant: 18_500_000, dateEmission: '2026-01-15', dateExpiration: '2026-09-15', statut: 'Active' },
  { id: 5, type: 'Retenue de garantie', contrat: 'CTR-0003', montant: 4_750_000, dateEmission: '2026-01-20', dateExpiration: '2026-07-20', statut: 'Libérée' },
  { id: 6, type: 'Caution provisoire', contrat: 'CTR-0005', montant: 3_400_000, dateEmission: '2026-01-10', dateExpiration: '2026-03-10', statut: 'Expirée' },
  { id: 7, type: 'Caution définitive', contrat: 'CTR-0002', montant: 4_250_000, dateEmission: '2026-02-01', dateExpiration: '2026-09-20', statut: 'Active' },
]

const PLAN_ACHATS = [
  { ref: 'PA-2026-001', objet: 'Fourniture équipements informatiques', mode: 'Appel d\'offres ouvert', ligne: 'BUD-IT-001', montant: 185_000_000, trimestre: 'T1', statut: 'Attribué' },
  { ref: 'PA-2026-002', objet: 'Maintenance véhicules', mode: 'Gré à gré', ligne: 'BUD-LOG-003', montant: 42_500_000, trimestre: 'T1', statut: 'Attribué' },
  { ref: 'PA-2026-003', objet: 'Acquisition logiciels comptables', mode: 'Appel d\'offres restreint', ligne: 'BUD-IT-002', montant: 112_000_000, trimestre: 'T2', statut: 'Lancé' },
  { ref: 'PA-2026-004', objet: 'Audit financier externe', mode: 'Appel d\'offres ouvert', ligne: 'BUD-FIN-003', montant: 75_000_000, trimestre: 'T2', statut: 'Lancé' },
  { ref: 'PA-2026-005', objet: 'Connexion internet haut débit', mode: 'Entente directe', ligne: 'BUD-IT-003', montant: 24_000_000, trimestre: 'T3', statut: 'Planifié' },
  { ref: 'PA-2026-006', objet: 'Formation personnel – progiciels', mode: 'Entente directe', ligne: 'BUD-RH-005', montant: 28_500_000, trimestre: 'T2', statut: 'Attribué' },
]

// ─── Chart data ───────────────────────────────────────────────────────────────
const BAR_DATA = [
  { name: 'Gré à gré', value: 5 },
  { name: 'AO ouvert', value: 3 },
  { name: 'AO restreint', value: 2 },
  { name: 'Entente directe', value: 3 },
]
const PIE_DATA = [
  { name: 'Planifié', value: 1 },
  { name: 'En consultation', value: 2 },
  { name: 'Attribué', value: 1 },
  { name: 'En exécution', value: 6 },
  { name: 'Clôturé', value: 2 },
]
const PIE_COLORS = ['#94A3B8', '#D4A017', '#3B82F6', '#1A6B3A', '#0B1C3E']

// ─── Helpers ──────────────────────────────────────────────────────────────────
const statutBadge = (s: string) => {
  const map: Record<string, string> = {
    'En exécution': 'bg-green-100 text-green-800',
    'Clôturé': 'bg-slate-100 text-slate-700',
    'Planifié': 'bg-blue-100 text-blue-800',
    'En consultation': 'bg-yellow-100 text-yellow-800',
    'Attribué': 'bg-purple-100 text-purple-800',
    'Ouvert': 'bg-green-100 text-green-800',
    'Clos': 'bg-slate-100 text-slate-700',
    'Évaluation': 'bg-orange-100 text-orange-800',
    'Annulé': 'bg-red-100 text-red-800',
    'Active': 'bg-green-100 text-green-800',
    'Expirée': 'bg-red-100 text-red-800',
    'Libérée': 'bg-slate-100 text-slate-700',
    'Lancé': 'bg-blue-100 text-blue-800',
    'Conforme': 'bg-green-100 text-green-800',
    'Non conforme': 'bg-red-100 text-red-800',
    'Partiel': 'bg-orange-100 text-orange-800',
    'Retenu': 'bg-green-100 text-green-800',
    'Non retenu': 'bg-red-100 text-red-800',
    'En évaluation': 'bg-yellow-100 text-yellow-800',
  }
  return `badge ${map[s] ?? 'bg-slate-100 text-slate-600'}`
}

const daysUntil = (dateStr: string) => {
  if (!dateStr) return 999
  const diff = new Date(dateStr).getTime() - Date.now()
  return Math.ceil(diff / 86_400_000)
}

// ─── Slide-in panel ───────────────────────────────────────────────────────────
function SlidePanel({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-full max-w-xl bg-white h-full shadow-2xl overflow-y-auto flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 sticky top-0 bg-white z-10">
          <h3 className="font-semibold text-slate-800">{title}</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-slate-100"><X size={18} /></button>
        </div>
        <div className="p-6 flex-1">{children}</div>
      </div>
    </div>
  )
}

// ─── Progress bar ─────────────────────────────────────────────────────────────
function ProgressBar({ value }: { value: number }) {
  const color = value === 100 ? '#1A6B3A' : value > 50 ? '#3B82F6' : '#D4A017'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-slate-100 rounded-full h-2">
        <div className="h-2 rounded-full" style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs text-slate-600 w-8 text-right">{value}%</span>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function MarchesContrats({ onNavigate }: Props) {
  const [tab, setTab] = useState(0)
  const [slidePanel, setSlidePanel] = useState<null | { type: string; id: string }>(null)
  const [showAddAchat, setShowAddAchat] = useState(false)

  const tabs = [
    { label: 'Tableau de bord', icon: <LayoutDashboard size={15} /> },
    { label: 'Plan d\'achats', icon: <ShoppingCart size={15} /> },
    { label: 'Consultations', icon: <FileText size={15} /> },
    { label: 'Attributions & Contrats', icon: <Award size={15} /> },
    { label: 'Réceptions & Livrables', icon: <Package size={15} /> },
    { label: 'Garanties & Cautions', icon: <Shield size={15} /> },
  ]

  const totalEngagé = MARCHES.reduce((s, m) => s + m.montant, 0)
  const enCours = MARCHES.filter(m => m.statut === 'En exécution').length
  const avgExec = Math.round(MARCHES.filter(m => m.avancement > 0).reduce((s, m) => s + m.avancement, 0) / MARCHES.filter(m => m.avancement > 0).length)
  const alertes = MARCHES.filter(m => m.dateFin && daysUntil(m.dateFin) < 30 && m.statut === 'En exécution').length

  const top5 = [...MARCHES].sort((a, b) => b.montant - a.montant).slice(0, 5)

  const selCons = slidePanel?.type === 'cons' ? CONSULTATIONS.find(c => c.id === slidePanel.id) : null
  const selCtr = slidePanel?.type === 'ctr' ? MARCHES.find(m => m.id === slidePanel.id) : null

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title">Achats, Marchés & Contrats</h1>
          <p className="text-sm text-slate-500 mt-0.5">Module M06 – Gestion des marchés publics CEEAC</p>
        </div>
        <button className="btn btn-primary flex items-center gap-1.5" onClick={() => setShowAddAchat(true)}>
          <Plus size={15} /> Nouveau marché
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto border-b border-slate-200 pb-0">
        {tabs.map((t, i) => (
          <button
            key={i}
            onClick={() => setTab(i)}
            className={`tab-item flex items-center gap-1.5 whitespace-nowrap ${tab === i ? 'active' : ''}`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* ── Tab 0 – Tableau de bord ── */}
      {tab === 0 && (
        <div className="flex flex-col gap-4">
          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Marchés en cours', value: enCours, icon: <Clock size={18} />, color: '#1A6B3A' },
              { label: 'Montant total engagé', value: fmtM(totalEngagé), icon: <Award size={18} />, color: '#0B1C3E' },
              { label: 'Taux exécution moyen', value: `${avgExec}%`, icon: <CheckCircle size={18} />, color: '#3B82F6' },
              { label: 'Alertes délai', value: alertes, icon: <AlertTriangle size={18} />, color: '#D97706' },
            ].map((k, i) => (
              <div key={i} className="kpi-card">
                <div className="flex items-center gap-2 mb-2" style={{ color: k.color }}>{k.icon}<span className="text-xs text-slate-500 font-medium">{k.label}</span></div>
                <div className="text-2xl font-bold text-slate-800">{k.value}</div>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="card">
              <p className="text-sm font-semibold text-slate-700 mb-3">Marchés par mode de passation</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={BAR_DATA} barSize={32}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="value" name="Marchés" fill="#1A6B3A" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="card">
              <p className="text-sm font-semibold text-slate-700 mb-3">Répartition par statut</p>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={2}>
                    {PIE_DATA.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                  </Pie>
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top 5 */}
          <div className="card">
            <p className="text-sm font-semibold text-slate-700 mb-3">Top 5 marchés par valeur</p>
            <table className="data-table w-full">
              <thead><tr><th>Réf</th><th>Objet</th><th>Titulaire</th><th>Montant</th><th>Statut</th></tr></thead>
              <tbody>
                {top5.map(m => (
                  <tr key={m.id} className="cursor-pointer hover:bg-slate-50" onClick={() => { setTab(3); setSlidePanel({ type: 'ctr', id: m.id }) }}>
                    <td className="font-mono text-xs text-[#0B1C3E]">{m.ref}</td>
                    <td className="max-w-[200px] truncate">{m.objet}</td>
                    <td className="text-slate-600 text-xs">{m.titulaire || '—'}</td>
                    <td className="amount">{fmtM(m.montant)}</td>
                    <td><span className={statutBadge(m.statut)}>{m.statut}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Tab 1 – Plan d'achats ── */}
      {tab === 1 && (
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-slate-700">Plan d'achats 2026</p>
            <button className="btn btn-primary btn-sm flex items-center gap-1" onClick={() => setShowAddAchat(true)}><Plus size={13} /> Ajouter achat</button>
          </div>
          <table className="data-table w-full">
            <thead><tr><th>Réf</th><th>Objet</th><th>Mode passation</th><th>Ligne budgétaire</th><th>Montant prévisionnel</th><th>Trimestre</th><th>Statut</th></tr></thead>
            <tbody>
              {PLAN_ACHATS.map(p => (
                <tr key={p.ref}>
                  <td className="font-mono text-xs text-[#0B1C3E]">{p.ref}</td>
                  <td>{p.objet}</td>
                  <td className="text-xs text-slate-600">{p.mode}</td>
                  <td className="font-mono text-xs">{p.ligne}</td>
                  <td className="amount">{fmtM(p.montant)}</td>
                  <td className="text-center">{p.trimestre}</td>
                  <td><span className={statutBadge(p.statut)}>{p.statut}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Tab 2 – Consultations ── */}
      {tab === 2 && (
        <div className="card">
          <p className="text-sm font-semibold text-slate-700 mb-3">Consultations en cours et passées</p>
          <table className="data-table w-full">
            <thead><tr><th>Réf consultation</th><th>Objet</th><th>Mode</th><th>Date lancement</th><th>Date clôture</th><th>Offres reçues</th><th>Statut</th><th></th></tr></thead>
            <tbody>
              {CONSULTATIONS.map(c => (
                <tr key={c.id} className="cursor-pointer hover:bg-slate-50" onClick={() => setSlidePanel({ type: 'cons', id: c.id })}>
                  <td className="font-mono text-xs text-[#0B1C3E]">{c.ref}</td>
                  <td>{c.objet}</td>
                  <td className="text-xs text-slate-600">{c.mode}</td>
                  <td className="text-xs">{c.dateLancement}</td>
                  <td className="text-xs">{c.dateCloture}</td>
                  <td className="text-center font-semibold">{c.offres}</td>
                  <td><span className={statutBadge(c.statut)}>{c.statut}</span></td>
                  <td><ChevronRight size={14} className="text-slate-400" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Tab 3 – Attributions & Contrats ── */}
      {tab === 3 && (
        <div className="card">
          <p className="text-sm font-semibold text-slate-700 mb-3">Contrats attribués et en cours</p>
          <table className="data-table w-full">
            <thead><tr><th>Réf contrat</th><th>Objet</th><th>Titulaire</th><th>Montant signé</th><th>Date signature</th><th>Date fin</th><th>Avancement</th><th>Statut</th><th></th></tr></thead>
            <tbody>
              {MARCHES.filter(m => m.statut !== 'Planifié' && m.statut !== 'En consultation').map(m => (
                <tr key={m.id} className="cursor-pointer hover:bg-slate-50" onClick={() => setSlidePanel({ type: 'ctr', id: m.id })}>
                  <td className="font-mono text-xs text-[#0B1C3E]">{m.ref}</td>
                  <td className="max-w-[160px] truncate">{m.objet}</td>
                  <td className="text-xs text-slate-600">{m.titulaire || '—'}</td>
                  <td className="amount">{fmtM(m.montant)}</td>
                  <td className="text-xs">{m.dateSignature || '—'}</td>
                  <td className="text-xs">{m.dateFin || '—'}</td>
                  <td className="w-28"><ProgressBar value={m.avancement} /></td>
                  <td><span className={statutBadge(m.statut)}>{m.statut}</span></td>
                  <td><ChevronRight size={14} className="text-slate-400" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Tab 4 – Réceptions & Livrables ── */}
      {tab === 4 && (
        <div className="card">
          <p className="text-sm font-semibold text-slate-700 mb-3">Livrables et réceptions</p>
          <table className="data-table w-full">
            <thead><tr><th>Livrable</th><th>Contrat</th><th>Titulaire</th><th>Date prévue</th><th>Date réception</th><th>PV Réception</th><th>Conformité</th></tr></thead>
            <tbody>
              {LIVRABLES.map(l => (
                <tr key={l.id}>
                  <td>{l.livrable}</td>
                  <td className="font-mono text-xs text-[#0B1C3E]">{l.contrat}</td>
                  <td className="text-xs text-slate-600">{l.titulaire}</td>
                  <td className="text-xs">{l.datePrevue}</td>
                  <td className="text-xs">{l.dateReception || <span className="text-slate-400 italic">En attente</span>}</td>
                  <td>
                    {l.pv === 'Oui'
                      ? <span className="flex items-center gap-1 text-green-700"><CheckCircle size={13} /> Oui</span>
                      : <span className="flex items-center gap-1 text-slate-400"><Ban size={13} /> Non</span>}
                  </td>
                  <td>{l.conformite === '-' ? <span className="text-slate-400">—</span> : <span className={statutBadge(l.conformite)}>{l.conformite}</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Tab 5 – Garanties & Cautions ── */}
      {tab === 5 && (
        <div className="card">
          <p className="text-sm font-semibold text-slate-700 mb-3">Garanties et cautions</p>
          <table className="data-table w-full">
            <thead><tr><th>Type garantie</th><th>Contrat</th><th>Montant</th><th>Date émission</th><th>Date expiration</th><th>Statut</th></tr></thead>
            <tbody>
              {GARANTIES.map(g => {
                const days = daysUntil(g.dateExpiration)
                const expiringSoon = g.statut === 'Active' && days < 30
                return (
                  <tr key={g.id} className={expiringSoon ? 'bg-amber-50' : ''}>
                    <td>
                      <div className="flex items-center gap-1.5">
                        {expiringSoon && <AlertTriangle size={13} className="text-amber-500 flex-shrink-0" />}
                        {g.type}
                      </div>
                    </td>
                    <td className="font-mono text-xs text-[#0B1C3E]">{g.contrat}</td>
                    <td className="amount">{fmt(g.montant)}</td>
                    <td className="text-xs">{g.dateEmission}</td>
                    <td className="text-xs">
                      <span className={expiringSoon ? 'text-amber-700 font-semibold' : ''}>
                        {g.dateExpiration}
                        {expiringSoon && ` (J-${days})`}
                      </span>
                    </td>
                    <td><span className={statutBadge(g.statut)}>{g.statut}</span></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Slide panel – Consultation detail ── */}
      {slidePanel?.type === 'cons' && selCons && (
        <SlidePanel title={`Consultation – ${selCons.ref}`} onClose={() => setSlidePanel(null)}>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                ['Objet', selCons.objet],
                ['Mode de passation', selCons.mode],
                ['Date lancement', selCons.dateLancement],
                ['Date clôture', selCons.dateCloture],
                ['Offres reçues', selCons.offres],
                ['Statut', selCons.statut],
              ].map(([k, v]) => (
                <div key={String(k)}>
                  <p className="form-label">{k}</p>
                  <p className="text-sm text-slate-800 font-medium">{v}</p>
                </div>
              ))}
            </div>
            <hr className="border-slate-200" />
            <p className="text-sm font-semibold text-slate-700">Offres reçues</p>
            {OFFRES.filter(o => o.cons === selCons.id).length === 0
              ? <p className="text-sm text-slate-400 italic">Aucune offre enregistrée.</p>
              : (
                <table className="data-table w-full text-xs">
                  <thead><tr><th>Soumissionnaire</th><th>Montant offert</th><th>Score tech.</th><th>Score total</th><th>Statut offre</th></tr></thead>
                  <tbody>
                    {OFFRES.filter(o => o.cons === selCons.id).map((o, i) => (
                      <tr key={i}>
                        <td>{o.soumissionnaire}</td>
                        <td className="amount">{fmtM(o.montant)}</td>
                        <td className="text-center">{o.scoreTech}/100</td>
                        <td className="text-center font-semibold">{o.scoreTotal}/100</td>
                        <td><span className={statutBadge(o.statut)}>{o.statut}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
          </div>
        </SlidePanel>
      )}

      {/* ── Slide panel – Contrat detail ── */}
      {slidePanel?.type === 'ctr' && selCtr && (
        <SlidePanel title={`Contrat – ${selCtr.ref}`} onClose={() => setSlidePanel(null)}>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                ['Objet', selCtr.objet],
                ['Mode de passation', selCtr.mode],
                ['Titulaire', selCtr.titulaire || '—'],
                ['Montant signé', selCtr.montant ? fmtM(selCtr.montant) : '—'],
                ['Date signature', selCtr.dateSignature || '—'],
                ['Date fin', selCtr.dateFin || '—'],
                ['Ligne budgétaire', selCtr.ligne],
                ['Statut', selCtr.statut],
              ].map(([k, v]) => (
                <div key={String(k)}>
                  <p className="form-label">{k}</p>
                  <p className="text-sm text-slate-800 font-medium">{v}</p>
                </div>
              ))}
            </div>
            {selCtr.avancement > 0 && (
              <div>
                <p className="form-label mb-1">Taux d'avancement</p>
                <ProgressBar value={selCtr.avancement} />
              </div>
            )}
            <hr className="border-slate-200" />
            <div>
              <p className="text-sm font-semibold text-slate-700 mb-2">Cautions & garanties associées</p>
              {GARANTIES.filter(g => g.contrat === selCtr.id).length === 0
                ? <p className="text-sm text-slate-400 italic">Aucune garantie enregistrée.</p>
                : (
                  <table className="data-table w-full text-xs">
                    <thead><tr><th>Type</th><th>Montant</th><th>Expiration</th><th>Statut</th></tr></thead>
                    <tbody>
                      {GARANTIES.filter(g => g.contrat === selCtr.id).map(g => (
                        <tr key={g.id}>
                          <td>{g.type}</td>
                          <td className="amount">{fmt(g.montant)}</td>
                          <td>{g.dateExpiration}</td>
                          <td><span className={statutBadge(g.statut)}>{g.statut}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
            </div>
            <hr className="border-slate-200" />
            <div>
              <p className="text-sm font-semibold text-slate-700 mb-2">Avenants</p>
              <p className="text-sm text-slate-400 italic">Aucun avenant enregistré.</p>
            </div>
          </div>
        </SlidePanel>
      )}

      {/* ── Slide panel – Ajouter achat ── */}
      {showAddAchat && (
        <SlidePanel title="Ajouter un achat au plan" onClose={() => setShowAddAchat(false)}>
          <form className="flex flex-col gap-4" onSubmit={e => { e.preventDefault(); setShowAddAchat(false) }}>
            <div>
              <label className="form-label">Objet de l'achat *</label>
              <input className="form-input" placeholder="Ex: Fourniture de matériel informatique" required />
            </div>
            <div>
              <label className="form-label">Mode de passation *</label>
              <select className="form-input" required>
                <option value="">Sélectionner…</option>
                <option>Appel d'offres ouvert</option>
                <option>Appel d'offres restreint</option>
                <option>Gré à gré</option>
                <option>Entente directe</option>
              </select>
            </div>
            <div>
              <label className="form-label">Ligne budgétaire</label>
              <input className="form-input" placeholder="Ex: BUD-IT-004" />
            </div>
            <div>
              <label className="form-label">Montant prévisionnel (XAF)</label>
              <input className="form-input" type="number" placeholder="0" />
            </div>
            <div>
              <label className="form-label">Trimestre prévisionnel</label>
              <select className="form-input">
                <option>T1</option><option>T2</option><option>T3</option><option>T4</option>
              </select>
            </div>
            <div className="flex gap-2 pt-2">
              <button type="submit" className="btn btn-primary flex-1">Enregistrer</button>
              <button type="button" className="btn btn-outline flex-1" onClick={() => setShowAddAchat(false)}>Annuler</button>
            </div>
          </form>
        </SlidePanel>
      )}
    </div>
  )
}
