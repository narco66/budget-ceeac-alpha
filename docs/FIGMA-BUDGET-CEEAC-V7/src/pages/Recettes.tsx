import { useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { TrendingUp, DollarSign, Percent, AlertCircle, Plus, RefreshCw } from 'lucide-react'
import type { Page } from '../types'

interface Props {
  onNavigate: (page: Page, id?: string) => void
}

const fmt = (n: number) =>
  new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 0 }).format(n) + ' USD'

const pct = (a: number, b: number) => (b === 0 ? '0%' : ((a / b) * 100).toFixed(1) + '%')

const chartData = [
  { nature: 'Contrib. statutaires', prevision: 12400000, realisation: 9850000 },
  { nature: 'Subventions', prevision: 4200000, realisation: 3910000 },
  { nature: 'PTF', prevision: 8600000, realisation: 7200000 },
  { nature: 'Ressources propres', prevision: 1800000, realisation: 1540000 },
]

const previsions = [
  { nature: 'Contributions statutaires', prevision: 12400000, encaisse: 9850000, statut: 'En cours' },
  { nature: 'Subventions UE', prevision: 3200000, encaisse: 3200000, statut: 'Soldé' },
  { nature: 'Subventions UA', prevision: 1000000, encaisse: 710000, statut: 'Partiel' },
  { nature: 'Financement BAD', prevision: 5100000, encaisse: 4800000, statut: 'En cours' },
  { nature: 'Financement BM', prevision: 3500000, encaisse: 2400000, statut: 'Retard' },
  { nature: 'Ressources propres', prevision: 1800000, encaisse: 1540000, statut: 'En cours' },
]

type ContribStatut = 'Payé' | 'Partiel' | 'En retard' | 'Non payé'

const contributions: {
  etat: string
  due: number
  paye: number
  statut: ContribStatut
  echeance: string
}[] = [
  { etat: 'Angola', due: 1820000, paye: 1820000, statut: 'Payé', echeance: '31/03/2026' },
  { etat: 'Burundi', due: 420000, paye: 210000, statut: 'Partiel', echeance: '30/06/2026' },
  { etat: 'Cameroun', due: 1540000, paye: 1540000, statut: 'Payé', echeance: '28/02/2026' },
  { etat: 'Centrafrique', due: 280000, paye: 0, statut: 'Non payé', echeance: '31/03/2026' },
  { etat: 'Congo', due: 680000, paye: 340000, statut: 'En retard', echeance: '31/01/2026' },
  { etat: 'Gabon', due: 1120000, paye: 1120000, statut: 'Payé', echeance: '28/02/2026' },
  { etat: 'Guinée Équatoriale', due: 960000, paye: 480000, statut: 'Partiel', echeance: '30/04/2026' },
  { etat: 'RDC', due: 2100000, paye: 1050000, statut: 'En retard', echeance: '31/01/2026' },
  { etat: 'Rwanda', due: 560000, paye: 560000, statut: 'Payé', echeance: '31/03/2026' },
  { etat: 'São Tomé', due: 180000, paye: 90000, statut: 'Partiel', echeance: '30/06/2026' },
  { etat: 'Tchad', due: 740000, paye: 0, statut: 'Non payé', echeance: '31/03/2026' },
]

type RaprStatut = 'Rapproché' | 'En attente' | 'Écart'

const rapprochements: {
  ref: string
  date: string
  mode: string
  montant: number
  source: string
  statut: RaprStatut
}[] = [
  { ref: 'ENC-2026-001', date: '05/01/2026', mode: 'Virement SWIFT', montant: 1820000, source: 'Angola / BNA', statut: 'Rapproché' },
  { ref: 'ENC-2026-002', date: '12/01/2026', mode: 'Virement SWIFT', montant: 1540000, source: 'Cameroun / BEAC', statut: 'Rapproché' },
  { ref: 'ENC-2026-003', date: '18/01/2026', mode: 'Virement SWIFT', montant: 1120000, source: 'Gabon / BGFI', statut: 'Rapproché' },
  { ref: 'ENC-2026-004', date: '25/01/2026', mode: 'Virement UE', montant: 1600000, source: 'Commission UE', statut: 'Rapproché' },
  { ref: 'ENC-2026-005', date: '02/02/2026', mode: 'Virement SWIFT', montant: 560000, source: 'Rwanda / BNR', statut: 'Rapproché' },
  { ref: 'ENC-2026-006', date: '14/02/2026', mode: 'Virement BAD', montant: 2400000, source: 'BAD Abidjan', statut: 'En attente' },
  { ref: 'ENC-2026-007', date: '20/02/2026', mode: 'Virement SWIFT', montant: 210000, source: 'Burundi / BRB', statut: 'En attente' },
  { ref: 'ENC-2026-008', date: '05/03/2026', mode: 'Virement BM', montant: 2400000, source: 'Banque Mondiale', statut: 'Écart' },
  { ref: 'ENC-2026-009', date: '15/03/2026', mode: 'Virement SWIFT', montant: 480000, source: 'Guinée Éq. / BGFI', statut: 'En attente' },
  { ref: 'ENC-2026-010', date: '22/03/2026', mode: 'Virement UE', montant: 1600000, source: 'Commission UE', statut: 'Rapproché' },
]

const statutBadge: Record<ContribStatut, string> = {
  'Payé': 'badge bg-green-100 text-green-800',
  'Partiel': 'badge bg-yellow-100 text-yellow-800',
  'En retard': 'badge bg-red-100 text-red-800',
  'Non payé': 'badge bg-gray-100 text-gray-600',
}

const raprBadge: Record<RaprStatut, string> = {
  'Rapproché': 'badge bg-green-100 text-green-800',
  'En attente': 'badge bg-yellow-100 text-yellow-800',
  'Écart': 'badge bg-red-100 text-red-800',
}

const prevStatutBadge: Record<string, string> = {
  'Soldé': 'badge bg-green-100 text-green-800',
  'En cours': 'badge bg-blue-100 text-blue-800',
  'Partiel': 'badge bg-yellow-100 text-yellow-800',
  'Retard': 'badge bg-red-100 text-red-800',
}

const totalDue = contributions.reduce((s, c) => s + c.due, 0)
const totalPaye = contributions.reduce((s, c) => s + c.paye, 0)
const totalPrevision = previsions.reduce((s, p) => s + p.prevision, 0)
const totalEncaisse = previsions.reduce((s, p) => s + p.encaisse, 0)
const arrieres = totalDue - totalPaye

export default function Recettes({ onNavigate: _onNavigate }: Props) {
  const [tab, setTab] = useState(0)
  const [showTitreModal, setShowTitreModal] = useState(false)
  const [newTitre, setNewTitre] = useState({ reference: '', nature: '', debiteur: '', montant: '', exercice: '2026', description: '' })
  const [refreshing, setRefreshing] = useState(false)
  const [lastRefresh, setLastRefresh] = useState<string | null>(null)

  const handleActualiser = () => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
      const now = new Date()
      setLastRefresh(`${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`)
    }, 1000)
  }

  const tabs = ['Dashboard', 'Prévisions & Titres', 'Contributions statutaires', 'Rapprochement']

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="section-title text-2xl font-bold" style={{ color: '#0B1C3E' }}>
            Gestion des Recettes
          </h1>
          <p className="text-sm text-gray-500 mt-1">Module 7 · Exercice 2026</p>
        </div>
        <button className="btn btn-primary btn-sm flex items-center gap-2" onClick={() => setShowTitreModal(true)}>
          <Plus size={14} />
          Nouveau titre
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200">
        {tabs.map((t, i) => (
          <button
            key={i}
            className={`tab-item${tab === i ? ' active' : ''}`}
            onClick={() => setTab(i)}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Tab 0: Dashboard */}
      {tab === 0 && (
        <div className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <div className="kpi-card">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign size={16} style={{ color: '#1A6B3A' }} />
                <span className="text-xs text-gray-500 uppercase tracking-wide">Prévisions totales</span>
              </div>
              <div className="amount text-2xl font-bold" style={{ color: '#0B1C3E' }}>{fmt(totalPrevision)}</div>
            </div>
            <div className="kpi-card">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp size={16} style={{ color: '#1A6B3A' }} />
                <span className="text-xs text-gray-500 uppercase tracking-wide">Encaissements réalisés</span>
              </div>
              <div className="amount text-2xl font-bold" style={{ color: '#1A6B3A' }}>{fmt(totalEncaisse)}</div>
            </div>
            <div className="kpi-card">
              <div className="flex items-center gap-2 mb-1">
                <Percent size={16} style={{ color: '#D4A017' }} />
                <span className="text-xs text-gray-500 uppercase tracking-wide">Taux de recouvrement</span>
              </div>
              <div className="amount text-2xl font-bold" style={{ color: '#D4A017' }}>{pct(totalEncaisse, totalPrevision)}</div>
            </div>
            <div className="kpi-card">
              <div className="flex items-center gap-2 mb-1">
                <AlertCircle size={16} className="text-red-500" />
                <span className="text-xs text-gray-500 uppercase tracking-wide">Arriérés</span>
              </div>
              <div className="amount text-2xl font-bold text-red-600">{fmt(arrieres)}</div>
            </div>
          </div>

          <div className="card">
            <h2 className="font-semibold mb-4" style={{ color: '#0B1C3E' }}>
              Prévisions vs Réalisations par nature (USD)
            </h2>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData} margin={{ top: 4, right: 16, left: 16, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="nature" tick={{ fontSize: 11 }} />
                <YAxis tickFormatter={(v: number) => (v / 1000000).toFixed(1) + 'M'} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => [fmt(Number(v)), '']} />
                <Legend />
                <Bar dataKey="prevision" name="Prévision" fill="#0B1C3E" radius={[3, 3, 0, 0]} />
                <Bar dataKey="realisation" name="Réalisation" fill="#1A6B3A" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Tab 1: Prévisions & Titres */}
      {tab === 1 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold" style={{ color: '#0B1C3E' }}>Prévisions budgétaires et titres de recettes</h2>
            <button className="btn btn-primary btn-sm flex items-center gap-2" onClick={() => setShowTitreModal(true)}>
              <Plus size={14} /> Émettre un titre
            </button>
          </div>
          <div className="card p-0">
            <table className="data-table w-full">
              <thead>
                <tr>
                  <th>Nature de recette</th>
                  <th className="text-right">Prévision</th>
                  <th className="text-right">Encaissé</th>
                  <th className="text-right">Taux</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {previsions.map((p, i) => (
                  <tr key={i}>
                    <td className="font-medium">{p.nature}</td>
                    <td className="text-right amount">{fmt(p.prevision)}</td>
                    <td className="text-right amount">{fmt(p.encaisse)}</td>
                    <td className="text-right">{pct(p.encaisse, p.prevision)}</td>
                    <td><span className={prevStatutBadge[p.statut] ?? 'badge'}>{p.statut}</span></td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="font-bold bg-gray-50">
                  <td>Total</td>
                  <td className="text-right amount">{fmt(totalPrevision)}</td>
                  <td className="text-right amount">{fmt(totalEncaisse)}</td>
                  <td className="text-right">{pct(totalEncaisse, totalPrevision)}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Contributions statutaires */}
      {tab === 2 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-semibold" style={{ color: '#0B1C3E' }}>Contributions des États membres — Exercice 2026</h2>
              {lastRefresh && <p className="text-[11px] text-gray-400 mt-0.5">Mis à jour à {lastRefresh}</p>}
            </div>
            <button className="btn btn-outline btn-sm flex items-center gap-2" onClick={handleActualiser} disabled={refreshing}>
              <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} /> {refreshing ? 'Actualisation…' : 'Actualiser'}
            </button>
          </div>
          <div className="card p-0">
            <table className="data-table w-full">
              <thead>
                <tr>
                  <th>État membre</th>
                  <th className="text-right">Contribution due</th>
                  <th className="text-right">Payé</th>
                  <th className="text-right">Solde</th>
                  <th>Statut</th>
                  <th>Dernière échéance</th>
                </tr>
              </thead>
              <tbody>
                {contributions.map((c, i) => (
                  <tr key={i}>
                    <td className="font-medium">{c.etat}</td>
                    <td className="text-right amount">{fmt(c.due)}</td>
                    <td className="text-right amount">{fmt(c.paye)}</td>
                    <td className="text-right amount">{fmt(c.due - c.paye)}</td>
                    <td><span className={statutBadge[c.statut]}>{c.statut}</span></td>
                    <td className="text-sm text-gray-500">{c.echeance}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="font-bold bg-gray-50">
                  <td>Total</td>
                  <td className="text-right amount">{fmt(totalDue)}</td>
                  <td className="text-right amount">{fmt(totalPaye)}</td>
                  <td className="text-right amount">{fmt(arrieres)}</td>
                  <td></td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Nouveau titre de recettes */}
      {showTitreModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="font-semibold text-[#0B1C3E] text-base">Nouveau titre de recettes</h2>
              <button className="text-gray-400 hover:text-gray-600" onClick={() => setShowTitreModal(false)}><Plus size={18} className="rotate-45" /></button>
            </div>
            <div className="p-5 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Référence *</label>
                  <input className="form-input font-mono" placeholder="TR-2026-XXX" value={newTitre.reference} onChange={e => setNewTitre(p => ({ ...p, reference: e.target.value }))} />
                </div>
                <div>
                  <label className="form-label">Exercice</label>
                  <input className="form-input" value={newTitre.exercice} onChange={e => setNewTitre(p => ({ ...p, exercice: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="form-label">Nature de recette *</label>
                <select className="form-input" value={newTitre.nature} onChange={e => setNewTitre(p => ({ ...p, nature: e.target.value }))}>
                  <option value="">— Sélectionner —</option>
                  <option>Contributions statutaires</option>
                  <option>Subventions UE</option>
                  <option>Subventions UA</option>
                  <option>Financement BAD</option>
                  <option>Financement BM</option>
                  <option>Ressources propres</option>
                </select>
              </div>
              <div>
                <label className="form-label">Débiteur *</label>
                <input className="form-input" placeholder="Ex. République du Cameroun" value={newTitre.debiteur} onChange={e => setNewTitre(p => ({ ...p, debiteur: e.target.value }))} />
              </div>
              <div>
                <label className="form-label">Montant (USD) *</label>
                <input type="number" className="form-input" placeholder="Ex. 1500000" value={newTitre.montant} onChange={e => setNewTitre(p => ({ ...p, montant: e.target.value }))} />
              </div>
              <div>
                <label className="form-label">Description</label>
                <textarea className="form-input" rows={2} placeholder="Objet du titre de recettes…" value={newTitre.description} onChange={e => setNewTitre(p => ({ ...p, description: e.target.value }))} />
              </div>
            </div>
            <div className="flex justify-end gap-2 p-5 border-t border-gray-100">
              <button className="btn btn-outline btn-sm" onClick={() => setShowTitreModal(false)}>Annuler</button>
              <button className="btn btn-primary btn-sm" onClick={() => setShowTitreModal(false)}>Émettre le titre</button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Rapprochement */}
      {tab === 3 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold" style={{ color: '#0B1C3E' }}>Rapprochement des encaissements</h2>
            <button className="btn btn-outline btn-sm flex items-center gap-2">
              <RefreshCw size={14} /> Lancer le rapprochement
            </button>
          </div>
          <div className="card p-0">
            <table className="data-table w-full">
              <thead>
                <tr>
                  <th>Référence</th>
                  <th>Date</th>
                  <th>Mode</th>
                  <th className="text-right">Montant</th>
                  <th>Source</th>
                  <th>Statut rapprochement</th>
                </tr>
              </thead>
              <tbody>
                {rapprochements.map((r, i) => (
                  <tr key={i}>
                    <td className="font-mono text-sm">{r.ref}</td>
                    <td className="text-sm text-gray-600">{r.date}</td>
                    <td className="text-sm">{r.mode}</td>
                    <td className="text-right amount">{fmt(r.montant)}</td>
                    <td className="text-sm">{r.source}</td>
                    <td><span className={raprBadge[r.statut]}>{r.statut}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
