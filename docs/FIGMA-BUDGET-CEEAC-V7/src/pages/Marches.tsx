import React, { useState } from 'react'
import {
  FileText, ShoppingCart, Award, CheckSquare, X, ChevronDown, ChevronRight,
  Plus, Eye, Download, Search, CheckCircle
} from 'lucide-react'
import type { Page } from '../types'

interface Props {
  onNavigate: (page: Page, id?: string) => void
}

const fmt = (n: number) =>
  new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(n) + ' XAF'

const fmtDate = (s: string) =>
  new Date(s).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })

// ─── Mock data ───────────────────────────────────────────────────────────────

type MarcheStatut = 'Planifié' | 'Consultation' | 'En évaluation' | 'Attribué' | 'En cours' | 'Clôturé'
type MarcheType = 'Fournitures' | 'Services' | 'Travaux'

interface Marche {
  id: string
  reference: string
  objet: string
  type: MarcheType
  montantEstime: number
  structure: string
  sourceFinancement: string
  statut: MarcheStatut
}

interface Avenant {
  num: number
  objet: string
  montant: number
  date: string
}

interface Contrat {
  id: string
  reference: string
  objet: string
  attributaire: string
  montant: number
  debut: string
  fin: string
  avancement: number
  statut: 'Actif' | 'Suspendu' | 'Clôturé' | 'Résilié'
  lignesBudgetaires: string[]
  avenants: Avenant[]
  garantie: string
  receptions: string[]
}

interface Consultation {
  id: string
  reference: string
  objet: string
  dateOuverture: string
  nombreOffres: number
  statut: 'Dépouillement' | 'Évaluation' | 'Attribué' | 'Infructueux'
  attributaire?: string
  scoreGagnant?: number
  montantRetenu?: number
}

interface Reception {
  id: string
  reference: string
  contratRef: string
  objet: string
  type: 'Partielle' | 'Définitive'
  date: string
  livrables: string
  reserves: string
  garantie: string
  statut: 'Provisoire' | 'Définitive validée' | 'Avec réserves' | 'Rejetée'
}

const MARCHES: Marche[] = [
  { id: 'm1', reference: 'MRC-2026-001', objet: 'Fourniture de matériel informatique (postes, serveurs)', type: 'Fournitures', montantEstime: 85000000, structure: 'DSI', sourceFinancement: 'Budget CEEAC', statut: 'En cours' },
  { id: 'm2', reference: 'MRC-2026-002', objet: 'Mission de conseil en gestion des finances publiques', type: 'Services', montantEstime: 120000000, structure: 'DAF', sourceFinancement: 'Fonds UE', statut: 'Attribué' },
  { id: 'm3', reference: 'MRC-2026-003', objet: 'Réhabilitation des locaux du Secrétariat Général', type: 'Travaux', montantEstime: 250000000, structure: 'DAG', sourceFinancement: 'Budget CEEAC', statut: 'Consultation' },
  { id: 'm4', reference: 'MRC-2026-004', objet: 'Abonnements logiciels comptables et ERP', type: 'Fournitures', montantEstime: 45000000, structure: 'DAF', sourceFinancement: 'Budget CEEAC', statut: 'Planifié' },
  { id: 'm5', reference: 'MRC-2026-005', objet: 'Audit externe des comptes 2025', type: 'Services', montantEstime: 60000000, structure: 'DAI', sourceFinancement: 'Fonds BAD', statut: 'En évaluation' },
  { id: 'm6', reference: 'MRC-2026-006', objet: 'Fournitures de bureau et consommables', type: 'Fournitures', montantEstime: 18000000, structure: 'DAG', sourceFinancement: 'Budget CEEAC', statut: 'Clôturé' },
]

const CONTRATS: Contrat[] = [
  {
    id: 'c1', reference: 'CTR-2026-001', objet: 'Mission de conseil en gestion des finances publiques',
    attributaire: 'Cabinet Deloitte Afrique Centrale', montant: 118500000, debut: '2026-02-01', fin: '2026-12-31',
    avancement: 45, statut: 'Actif',
    lignesBudgetaires: ['5111 — Études et consultances', '5112 — Assistance technique'],
    avenants: [{ num: 1, objet: 'Extension délai de 2 mois', montant: 0, date: '2026-05-10' }],
    garantie: 'Caution bancaire BNI Congo — 5 % — expire 2027-02-01',
    receptions: ['Livraison rapport diagnostic — 2026-03-15 (partielle)'],
  },
  {
    id: 'c2', reference: 'CTR-2026-002', objet: 'Fourniture de matériel informatique (postes, serveurs)',
    attributaire: 'CEVA Tech Kinshasa', montant: 84200000, debut: '2026-03-01', fin: '2026-07-31',
    avancement: 100, statut: 'Clôturé',
    lignesBudgetaires: ['6210 — Équipements informatiques'],
    avenants: [],
    garantie: 'Garantie fabricant 3 ans — expire 2029-03-01',
    receptions: ['Livraison partielle lot 1 — 2026-04-10', 'Réception définitive — 2026-07-20'],
  },
  {
    id: 'c3', reference: 'CTR-2026-003', objet: 'Audit externe des comptes 2025',
    attributaire: 'Ernst & Young Cameroun', montant: 59800000, debut: '2026-04-01', fin: '2026-09-30',
    avancement: 70, statut: 'Actif',
    lignesBudgetaires: ['5113 — Audit et contrôle'],
    avenants: [],
    garantie: 'Assurance professionnelle souscrite',
    receptions: ['Remise rapport préliminaire — 2026-07-15 (partielle)'],
  },
  {
    id: 'c4', reference: 'CTR-2025-015', objet: 'Fournitures de bureau et consommables 2025',
    attributaire: 'Papeterie Centrale Brazzaville', montant: 17500000, debut: '2025-01-15', fin: '2025-12-31',
    avancement: 100, statut: 'Clôturé',
    lignesBudgetaires: ['6310 — Fournitures de bureau'],
    avenants: [{ num: 1, objet: 'Ajout fournitures sanitaires', montant: 1200000, date: '2025-06-01' }],
    garantie: 'Aucune garantie requise',
    receptions: ['Réception définitive — 2025-12-20'],
  },
  {
    id: 'c5', reference: 'CTR-2026-004', objet: 'Abonnements logiciels comptables et ERP',
    attributaire: 'Oracle EMEA / Distributeur Afrique', montant: 44500000, debut: '2026-01-01', fin: '2026-12-31',
    avancement: 60, statut: 'Actif',
    lignesBudgetaires: ['6211 — Licences et abonnements logiciels'],
    avenants: [],
    garantie: 'Contrat de maintenance inclus',
    receptions: ['Activation licences — 2026-01-05 (partielle)'],
  },
]

const CONSULTATIONS: Consultation[] = [
  { id: 'e1', reference: 'CONS-2026-001', objet: 'Mission de conseil finances publiques', dateOuverture: '2026-01-10', nombreOffres: 5, statut: 'Attribué', attributaire: 'Cabinet Deloitte Afrique Centrale', scoreGagnant: 87.4, montantRetenu: 118500000 },
  { id: 'e2', reference: 'CONS-2026-002', objet: 'Matériel informatique (postes, serveurs)', dateOuverture: '2026-02-05', nombreOffres: 8, statut: 'Attribué', attributaire: 'CEVA Tech Kinshasa', scoreGagnant: 91.2, montantRetenu: 84200000 },
  { id: 'e3', reference: 'CONS-2026-003', objet: 'Réhabilitation locaux Secrétariat Général', dateOuverture: '2026-06-15', nombreOffres: 3, statut: 'Évaluation' },
  { id: 'e4', reference: 'CONS-2026-004', objet: 'Audit externe des comptes 2025', dateOuverture: '2026-03-20', nombreOffres: 4, statut: 'Attribué', attributaire: 'Ernst & Young Cameroun', scoreGagnant: 83.0, montantRetenu: 59800000 },
]

const RECEPTIONS: Reception[] = [
  { id: 'r1', reference: 'REC-2026-001', contratRef: 'CTR-2026-001', objet: 'Rapport diagnostic — Mission conseil GFP', type: 'Partielle', date: '2026-03-15', livrables: 'Rapport diagnostic Phase 1 (120 p.)', reserves: 'Manque annexes statistiques', garantie: 'Caution bancaire active', statut: 'Avec réserves' },
  { id: 'r2', reference: 'REC-2026-002', contratRef: 'CTR-2026-002', objet: 'Livraison lot 1 matériel informatique', type: 'Partielle', date: '2026-04-10', livrables: '15 postes de travail, 2 serveurs rack', reserves: 'Aucune', garantie: 'Garantie fabricant', statut: 'Provisoire' },
  { id: 'r3', reference: 'REC-2026-003', contratRef: 'CTR-2026-002', objet: 'Réception définitive matériel informatique', type: 'Définitive', date: '2026-07-20', livrables: 'Lot complet (25 postes, 3 serveurs, switches)', reserves: 'Aucune', garantie: 'Garantie fabricant 3 ans', statut: 'Définitive validée' },
  { id: 'r4', reference: 'REC-2026-004', contratRef: 'CTR-2026-003', objet: 'Rapport préliminaire audit 2025', type: 'Partielle', date: '2026-07-15', livrables: 'Rapport préliminaire d\'audit (85 p.)', reserves: 'Points complémentaires sur avances de fonds à clarifier', garantie: 'Assurance professionnelle', statut: 'Avec réserves' },
]

// ─── Badge helpers ────────────────────────────────────────────────────────────

const STATUT_MARCHE_STYLE: Record<MarcheStatut, string> = {
  'Planifié': 'bg-slate-100 text-slate-700',
  'Consultation': 'bg-blue-100 text-blue-700',
  'En évaluation': 'bg-amber-100 text-amber-700',
  'Attribué': 'bg-purple-100 text-purple-700',
  'En cours': 'bg-emerald-100 text-emerald-700',
  'Clôturé': 'bg-gray-200 text-gray-600',
}

const STATUT_CONTRAT_STYLE: Record<string, string> = {
  'Actif': 'bg-emerald-100 text-emerald-700',
  'Suspendu': 'bg-amber-100 text-amber-700',
  'Clôturé': 'bg-gray-200 text-gray-600',
  'Résilié': 'bg-red-100 text-red-700',
}

const STATUT_CONSULT_STYLE: Record<string, string> = {
  'Dépouillement': 'bg-blue-100 text-blue-700',
  'Évaluation': 'bg-amber-100 text-amber-700',
  'Attribué': 'bg-emerald-100 text-emerald-700',
  'Infructueux': 'bg-red-100 text-red-700',
}

const STATUT_REC_STYLE: Record<string, string> = {
  'Provisoire': 'bg-blue-100 text-blue-700',
  'Définitive validée': 'bg-emerald-100 text-emerald-700',
  'Avec réserves': 'bg-amber-100 text-amber-700',
  'Rejetée': 'bg-red-100 text-red-700',
}

const TYPE_MARCHE_STYLE: Record<MarcheType, string> = {
  'Fournitures': 'bg-cyan-100 text-cyan-700',
  'Services': 'bg-indigo-100 text-indigo-700',
  'Travaux': 'bg-orange-100 text-orange-700',
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function KpiStrip({ items }: { items: { label: string; value: string | number; sub?: string }[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {items.map((k, i) => (
        <div key={i} className="kpi-card">
          <div className="text-2xl font-bold" style={{ color: '#0B1C3E' }}>{k.value}</div>
          <div className="text-xs text-gray-500 mt-1">{k.label}</div>
          {k.sub && <div className="text-xs font-medium mt-1" style={{ color: '#1A6B3A' }}>{k.sub}</div>}
        </div>
      ))}
    </div>
  )
}

function ProgressBar({ value }: { value: number }) {
  const color = value === 100 ? '#1A6B3A' : value >= 60 ? '#D4A017' : '#0B1C3E'
  return (
    <div className="flex items-center gap-2">
      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-2 rounded-full transition-all" style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs font-medium" style={{ color }}>{value}%</span>
    </div>
  )
}

// ─── Modal ────────────────────────────────────────────────────────────────────

interface ModalProps { onClose: () => void }

function NouveauContratModal({ onClose }: ModalProps) {
  const [form, setForm] = useState({
    objet: '', attributaire: '', montant: '', ligneBudgetaire: '',
    debut: '', fin: '', type: 'Services' as MarcheType,
  })

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ backgroundColor: '#0B1C3E' }}>
          <h2 className="text-white font-semibold text-base">Nouveau contrat</h2>
          <button onClick={onClose} className="text-white/70 hover:text-white"><X size={18} /></button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="form-label">Objet du contrat</label>
            <input className="form-input" placeholder="Intitulé de la prestation" value={form.objet} onChange={set('objet')} />
          </div>
          <div>
            <label className="form-label">Type</label>
            <select className="form-input" value={form.type} onChange={set('type')}>
              <option>Fournitures</option><option>Services</option><option>Travaux</option>
            </select>
          </div>
          <div>
            <label className="form-label">Attributaire</label>
            <input className="form-input" placeholder="Nom du titulaire / fournisseur" value={form.attributaire} onChange={set('attributaire')} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="form-label">Montant (XAF)</label>
              <input className="form-input" type="number" placeholder="0" value={form.montant} onChange={set('montant')} />
            </div>
            <div>
              <label className="form-label">Ligne budgétaire</label>
              <input className="form-input" placeholder="ex. 5111" value={form.ligneBudgetaire} onChange={set('ligneBudgetaire')} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="form-label">Date de début</label>
              <input className="form-input" type="date" value={form.debut} onChange={set('debut')} />
            </div>
            <div>
              <label className="form-label">Date de fin</label>
              <input className="form-input" type="date" value={form.fin} onChange={set('fin')} />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
          <button className="btn btn-outline btn-sm" onClick={onClose}>Annuler</button>
          <button className="btn btn-primary btn-sm" onClick={onClose}>Enregistrer</button>
        </div>
      </div>
    </div>
  )
}

// ─── Contrat detail panel ─────────────────────────────────────────────────────

function ContratDetail({ contrat, onClose }: { contrat: Contrat; onClose: () => void }) {
  return (
    <div className="mt-2 border rounded-lg bg-slate-50 p-4 space-y-4 text-sm">
      <div className="flex justify-between items-start">
        <span className="font-semibold text-gray-700">Détail — {contrat.reference}</span>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={15} /></button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gray-500 mb-1">Parties contractantes</p>
          <p className="font-medium" style={{ color: '#0B1C3E' }}>CEEAC (Secrétariat Général)</p>
          <p className="text-gray-600">{contrat.attributaire}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Garantie</p>
          <p className="text-gray-700">{contrat.garantie}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Lignes budgétaires associées</p>
          {contrat.lignesBudgetaires.map((l, i) => (
            <span key={i} className="inline-block badge mr-1 mb-1">{l}</span>
          ))}
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Réceptions enregistrées</p>
          {contrat.receptions.length === 0
            ? <span className="text-gray-400">Aucune</span>
            : contrat.receptions.map((r, i) => <p key={i} className="text-gray-700">• {r}</p>)}
        </div>
      </div>
      {contrat.avenants.length > 0 && (
        <div>
          <p className="text-xs text-gray-500 mb-2">Avenants</p>
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-gray-100 text-gray-600">
              <th className="text-left px-2 py-1 rounded-tl">Avenant</th>
              <th className="text-left px-2 py-1">Objet</th>
              <th className="text-right px-2 py-1">Montant</th>
              <th className="text-left px-2 py-1 rounded-tr">Date</th>
            </tr></thead>
            <tbody>{contrat.avenants.map(a => (
              <tr key={a.num} className="border-t border-gray-200">
                <td className="px-2 py-1 text-gray-500">Av. {a.num}</td>
                <td className="px-2 py-1">{a.objet}</td>
                <td className="px-2 py-1 text-right">{a.montant === 0 ? '—' : fmt(a.montant)}</td>
                <td className="px-2 py-1 text-gray-500">{fmtDate(a.date)}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────

type Tab = 'plan' | 'contrats' | 'evaluations' | 'receptions'

function PlanAchats() {
  const [search, setSearch] = useState('')
  const [showExportModal, setShowExportModal] = useState(false)
  const [exportFormat, setExportFormat] = useState<'csv' | 'xlsx' | 'pdf'>('csv')
  const [exportStatut, setExportStatut] = useState<MarcheStatut | ''>('')
  const filtered = MARCHES.filter(m =>
    !search || m.objet.toLowerCase().includes(search.toLowerCase()) || m.reference.includes(search)
  )
  const planifies = MARCHES.filter(m => m.statut !== 'Clôturé').length
  const total = MARCHES.reduce((s, m) => s + m.montantEstime, 0)
  const attribues = MARCHES.filter(m => ['Attribué', 'En cours', 'Clôturé'].includes(m.statut)).length
  const enCours = MARCHES.filter(m => m.statut === 'En cours').length
  const exportCount = exportStatut ? filtered.filter(m => m.statut === exportStatut).length : filtered.length
  const [marchesToast, setMarchesToast] = useState(false)

  const doExport = () => {
    const list = exportStatut ? filtered.filter(m => m.statut === exportStatut) : filtered
    if (exportFormat === 'pdf') {
      const win = window.open('', '_blank')
      if (!win) return
      const rows = list.map(m => `<tr><td>${m.reference}</td><td>${m.objet}</td><td>${m.type}</td><td>${m.structure}</td><td>${m.statut}</td><td>${fmt(m.montantEstime)}</td></tr>`).join('')
      win.document.write(`<!DOCTYPE html><html><head><title>Marchés CEEAC</title><style>body{font-family:Arial;font-size:11px;padding:24px}table{border-collapse:collapse;width:100%}th,td{border:1px solid #CBD5E1;padding:6px 8px;text-align:left}th{background:#0B1C3E;color:white}tr:nth-child(even){background:#F8FAFC}h2{color:#0B1C3E}</style></head><body><h2>Plan de passation de marchés — CEEAC 2026</h2><p>Export : ${new Date().toLocaleDateString('fr-FR')} · ${list.length} marché(s)</p><table><thead><tr><th>Référence</th><th>Objet</th><th>Type</th><th>Structure</th><th>Statut</th><th>Montant estimé</th></tr></thead><tbody>${rows}</tbody></table></body></html>`)
      win.document.close()
      win.print()
    } else {
      const rows = ['Référence,Objet,Type,Structure,Statut,Montant estimé,Source financement', ...list.map(m => `${m.reference},"${m.objet}",${m.type},"${m.structure}",${m.statut},${m.montantEstime},"${m.sourceFinancement}"`)]
      const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Marches_CEEAC_${new Date().toISOString().slice(0, 10)}.csv`
      a.click()
      URL.revokeObjectURL(url)
    }
    setShowExportModal(false)
    setMarchesToast(true)
    setTimeout(() => setMarchesToast(false), 3000)
  }

  return (
    <div>
      <KpiStrip items={[
        { label: 'Marchés planifiés', value: planifies },
        { label: 'Montant total estimé', value: fmt(total) },
        { label: 'Marchés attribués', value: attribues },
        { label: 'En cours d\'exécution', value: enCours },
      ]} />
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="form-input pl-8 text-sm" placeholder="Rechercher un marché…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <button onClick={() => setShowExportModal(true)} className="btn btn-outline btn-sm flex items-center gap-1"><Download size={13} />Exporter</button>
      </div>
      <div className="overflow-x-auto">
        <table className="data-table w-full">
          <thead><tr>
            <th>Référence</th><th>Objet</th><th>Type</th><th>Montant estimé</th>
            <th>Structure</th><th>Financement</th><th>Statut</th>
          </tr></thead>
          <tbody>{filtered.map(m => (
            <tr key={m.id}>
              <td className="font-mono text-xs">{m.reference}</td>
              <td className="max-w-[260px]"><span className="line-clamp-2">{m.objet}</span></td>
              <td><span className={`badge ${TYPE_MARCHE_STYLE[m.type]}`}>{m.type}</span></td>
              <td className="amount text-right">{fmt(m.montantEstime)}</td>
              <td className="text-gray-600">{m.structure}</td>
              <td className="text-gray-600 text-xs">{m.sourceFinancement}</td>
              <td><span className={`badge ${STATUT_MARCHE_STYLE[m.statut]}`}>{m.statut}</span></td>
            </tr>
          ))}</tbody>
        </table>
      </div>

      {/* Modal Export */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(11,28,62,0.55)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Download size={16} className="text-blue-600" />
                <h3 className="font-bold text-gray-800">Exporter les marchés</h3>
              </div>
              <button onClick={() => setShowExportModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="form-label mb-2 block">Format d&apos;export</label>
                <div className="flex gap-2">
                  {([
                    { id: 'csv', label: 'CSV' },
                    { id: 'xlsx', label: 'Excel (XLSX)' },
                    { id: 'pdf', label: 'PDF' },
                  ] as const).map(opt => (
                    <button key={opt.id}
                      onClick={() => setExportFormat(opt.id)}
                      className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${exportFormat === opt.id ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="form-label mb-1 block">Filtrer par statut</label>
                <select className="form-input text-sm" value={exportStatut} onChange={e => setExportStatut(e.target.value as MarcheStatut | '')}>
                  <option value="">Tous les statuts</option>
                  {(['Planifié', 'Consultation', 'En évaluation', 'Attribué', 'En cours', 'Clôturé'] as MarcheStatut[]).map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="rounded-xl p-3 text-[12px]" style={{ background: '#F0F9FF', border: '1px solid #BAE6FD' }}>
                <p className="text-slate-600"><strong className="text-slate-800">{exportCount} marché{exportCount > 1 ? 's' : ''}</strong> seront inclus dans l&apos;export.</p>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex gap-2 justify-end">
              <button onClick={() => setShowExportModal(false)} className="btn btn-outline">Annuler</button>
              <button onClick={doExport} className="btn btn-primary gap-1.5">
                <Download size={14} /> Confirmer l&apos;export ({exportFormat.toUpperCase()})
              </button>
            </div>
          </div>
        </div>
      )}
      {marchesToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-xl text-[13px] font-medium flex items-center gap-2.5">
          <CheckCircle size={15} className="text-green-400" />Export marchés généré avec succès ✓
        </div>
      )}
    </div>
  )
}

function Contrats({ onNewContrat }: { onNewContrat: () => void }) {
  const [expanded, setExpanded] = useState<string | null>(null)

  const toggle = (id: string) => setExpanded(e => e === id ? null : id)

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-gray-500">{CONTRATS.length} contrats enregistrés</div>
        <button className="btn btn-primary btn-sm flex items-center gap-1" onClick={onNewContrat}>
          <Plus size={13} />Nouveau contrat
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="data-table w-full">
          <thead><tr>
            <th className="w-8"></th>
            <th>Référence</th><th>Objet</th><th>Attributaire</th>
            <th>Montant</th><th>Début</th><th>Fin</th><th>Avancement</th><th>Statut</th>
          </tr></thead>
          <tbody>{CONTRATS.map(c => (
            <React.Fragment key={c.id}>
              <tr className="cursor-pointer hover:bg-blue-50/40" onClick={() => toggle(c.id)}>
                <td className="text-gray-400">
                  {expanded === c.id ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </td>
                <td className="font-mono text-xs">{c.reference}</td>
                <td className="max-w-[200px]"><span className="line-clamp-2">{c.objet}</span></td>
                <td className="text-gray-600 text-xs">{c.attributaire}</td>
                <td className="amount text-right">{fmt(c.montant)}</td>
                <td className="text-xs">{fmtDate(c.debut)}</td>
                <td className="text-xs">{fmtDate(c.fin)}</td>
                <td><ProgressBar value={c.avancement} /></td>
                <td><span className={`badge ${STATUT_CONTRAT_STYLE[c.statut]}`}>{c.statut}</span></td>
              </tr>
              {expanded === c.id && (
                <tr>
                  <td colSpan={9} className="p-0 pb-2">
                    <ContratDetail contrat={c} onClose={() => setExpanded(null)} />
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}</tbody>
        </table>
      </div>
    </div>
  )
}

function Evaluations() {
  return (
    <div>
      <div className="text-sm text-gray-500 mb-4">{CONSULTATIONS.length} consultations</div>
      <div className="overflow-x-auto">
        <table className="data-table w-full">
          <thead><tr>
            <th>Référence</th><th>Objet</th><th>Ouverture</th><th>Nb offres</th>
            <th>Statut</th><th>Attributaire</th><th>Score</th><th>Montant retenu</th>
          </tr></thead>
          <tbody>{CONSULTATIONS.map(c => (
            <tr key={c.id}>
              <td className="font-mono text-xs">{c.reference}</td>
              <td className="max-w-[220px]"><span className="line-clamp-2">{c.objet}</span></td>
              <td className="text-xs">{fmtDate(c.dateOuverture)}</td>
              <td className="text-center">{c.nombreOffres}</td>
              <td><span className={`badge ${STATUT_CONSULT_STYLE[c.statut]}`}>{c.statut}</span></td>
              <td className="text-gray-600 text-xs">{c.attributaire ?? <span className="text-gray-300">—</span>}</td>
              <td className="text-center font-medium" style={{ color: '#1A6B3A' }}>
                {c.scoreGagnant != null ? `${c.scoreGagnant}/100` : <span className="text-gray-300">—</span>}
              </td>
              <td className="amount text-right">
                {c.montantRetenu != null ? fmt(c.montantRetenu) : <span className="text-gray-300">—</span>}
              </td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  )
}

function Receptions() {
  return (
    <div>
      <div className="text-sm text-gray-500 mb-4">{RECEPTIONS.length} événements de réception</div>
      <div className="overflow-x-auto">
        <table className="data-table w-full">
          <thead><tr>
            <th>Référence</th><th>Contrat</th><th>Objet</th><th>Type</th>
            <th>Date</th><th>Livrables</th><th>Réserves</th><th>Garantie</th><th>Statut</th>
          </tr></thead>
          <tbody>{RECEPTIONS.map(r => (
            <tr key={r.id}>
              <td className="font-mono text-xs">{r.reference}</td>
              <td className="font-mono text-xs text-blue-700">{r.contratRef}</td>
              <td className="max-w-[180px]"><span className="line-clamp-2">{r.objet}</span></td>
              <td>
                <span className={`badge ${r.type === 'Définitive' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                  {r.type}
                </span>
              </td>
              <td className="text-xs">{fmtDate(r.date)}</td>
              <td className="text-xs text-gray-600 max-w-[140px]"><span className="line-clamp-2">{r.livrables}</span></td>
              <td className="text-xs text-gray-600 max-w-[130px]">
                {r.reserves === 'Aucune'
                  ? <span className="text-gray-300">—</span>
                  : <span className="line-clamp-2">{r.reserves}</span>}
              </td>
              <td className="text-xs text-gray-600 max-w-[140px]"><span className="line-clamp-2">{r.garantie}</span></td>
              <td><span className={`badge ${STATUT_REC_STYLE[r.statut]}`}>{r.statut}</span></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: 'plan', label: "Plan d'achats", icon: <ShoppingCart size={15} /> },
  { key: 'contrats', label: 'Contrats', icon: <FileText size={15} /> },
  { key: 'evaluations', label: 'Évaluations et attributions', icon: <Award size={15} /> },
  { key: 'receptions', label: 'Réceptions et garanties', icon: <CheckSquare size={15} /> },
]

export default function Marches({ onNavigate: _onNavigate }: Props) {
  const [tab, setTab] = useState<Tab>('plan')
  const [showModal, setShowModal] = useState(false)

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      {showModal && <NouveauContratModal onClose={() => setShowModal(false)} />}

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded" style={{ backgroundColor: '#0B1C3E', color: '#D4A017' }}>M06</span>
            <h1 className="section-title mb-0">Achats, Marchés et Contrats</h1>
          </div>
          <p className="text-sm text-gray-500">Gestion du cycle complet des marchés publics et contrats — CEEAC 2026</p>
        </div>
        <button className="btn btn-navy btn-sm flex items-center gap-1" onClick={() => setShowModal(true)}>
          <Plus size={14} />Nouveau contrat
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b mb-6 overflow-x-auto">
        {TABS.map(t => (
          <button
            key={t.key}
            className={`tab-item flex items-center gap-1.5 whitespace-nowrap${tab === t.key ? ' active' : ''}`}
            onClick={() => setTab(t.key)}
          >
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="card">
        {tab === 'plan' && <PlanAchats />}
        {tab === 'contrats' && <Contrats onNewContrat={() => setShowModal(true)} />}
        {tab === 'evaluations' && <Evaluations />}
        {tab === 'receptions' && <Receptions />}
      </div>
    </div>
  )
}
