import { useState } from 'react'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { Briefcase, TrendingUp, Clock, AlertTriangle, X, ChevronRight } from 'lucide-react'
import type { Page } from '../types'

interface Props {
  onNavigate: (page: Page, id?: string) => void
}

const fmt = (n: number) =>
  new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 0 }).format(n) + ' USD'

type ProjetStatut = 'En cours' | 'Planifié' | 'Suspendu' | 'Clôturé'
type JalonStatut = 'Atteint' | 'En cours' | 'Retard' | 'Non démarré'

interface Projet {
  ref: string
  intitule: string
  pilier: string
  total: number
  ceeac: number
  ptf: number
  avancement: number
  statut: ProjetStatut
  description: string
  jalons: string[]
  ptfDetails: { nom: string; montant: number }[]
}

const projets: Projet[] = [
  {
    ref: 'PRJ-2026-001',
    intitule: 'Programme Intégration Économique Régionale CEEAC',
    pilier: 'Intégration économique',
    total: 8500000,
    ceeac: 3400000,
    ptf: 5100000,
    avancement: 62,
    statut: 'En cours',
    description: 'Programme visant à harmoniser les politiques douanières et commerciales entre les États membres de la CEEAC pour faciliter les échanges intra-régionaux.',
    jalons: ['Étude diagnostique', 'Atelier régional', 'Adoption protocole', 'Mise en œuvre pilote'],
    ptfDetails: [{ nom: 'Union Européenne', montant: 3100000 }, { nom: 'BAD', montant: 2000000 }],
  },
  {
    ref: 'PRJ-2026-002',
    intitule: 'Force Multinationale de l\'Afrique Centrale (FOMAC)',
    pilier: 'Paix & sécurité',
    total: 12000000,
    ceeac: 6000000,
    ptf: 6000000,
    avancement: 45,
    statut: 'En cours',
    description: 'Renforcement des capacités opérationnelles de la FOMAC pour les missions de maintien de la paix en Afrique centrale.',
    jalons: ['Recrutement personnel', 'Formation militaire', 'Équipements déployés', 'Exercice conjoint'],
    ptfDetails: [{ nom: 'Union Africaine', montant: 3500000 }, { nom: 'ONU-PNUD', montant: 2500000 }],
  },
  {
    ref: 'PRJ-2026-003',
    intitule: 'Développement du Couloir Économique Brazzaville–Kinshasa',
    pilier: 'Infrastructures',
    total: 15000000,
    ceeac: 4500000,
    ptf: 10500000,
    avancement: 28,
    statut: 'En cours',
    description: 'Développement d\'infrastructures routières et logistiques reliant Brazzaville et Kinshasa pour stimuler les échanges commerciaux.',
    jalons: ['Études de faisabilité', 'Appel d\'offres', 'Construction phase 1', 'Réception travaux'],
    ptfDetails: [{ nom: 'Banque Mondiale', montant: 6000000 }, { nom: 'BAD', montant: 4500000 }],
  },
  {
    ref: 'PRJ-2026-004',
    intitule: 'Programme Régional de Sécurité Alimentaire',
    pilier: 'Développement durable',
    total: 5200000,
    ceeac: 2600000,
    ptf: 2600000,
    avancement: 78,
    statut: 'En cours',
    description: 'Amélioration de la sécurité alimentaire dans les zones rurales des États membres via des programmes agricoles intégrés.',
    jalons: ['Cartographie zones vulnérables', 'Distribution semences', 'Formation agriculteurs', 'Évaluation impact'],
    ptfDetails: [{ nom: 'FAO', montant: 1600000 }, { nom: 'FIDA', montant: 1000000 }],
  },
  {
    ref: 'PRJ-2026-005',
    intitule: 'Interconnexion Électrique sous-régionale',
    pilier: 'Énergie',
    total: 22000000,
    ceeac: 8800000,
    ptf: 13200000,
    avancement: 15,
    statut: 'Planifié',
    description: 'Création d\'un réseau d\'interconnexion électrique reliant les États membres pour optimiser l\'utilisation des ressources hydroélectriques.',
    jalons: ['Études techniques', 'Accord inter-États', 'Financement bouclé', 'Travaux réseau'],
    ptfDetails: [{ nom: 'BAD', montant: 8200000 }, { nom: 'BEI', montant: 5000000 }],
  },
  {
    ref: 'PRJ-2026-006',
    intitule: 'Renforcement Système de Surveillance Épidémiologique',
    pilier: 'Santé',
    total: 3800000,
    ceeac: 1900000,
    ptf: 1900000,
    avancement: 55,
    statut: 'En cours',
    description: 'Mise en place d\'un système régional de surveillance et de réponse aux épidémies pour les pays membres.',
    jalons: ['Plateforme numérique', 'Formation épidémiologistes', 'Réseau laboratoires', 'Exercice simulation'],
    ptfDetails: [{ nom: 'OMS', montant: 1200000 }, { nom: 'CDC Afrique', montant: 700000 }],
  },
  {
    ref: 'PRJ-2026-007',
    intitule: 'Programme Gouvernance et État de Droit',
    pilier: 'Gouvernance',
    total: 4100000,
    ceeac: 2050000,
    ptf: 2050000,
    avancement: 0,
    statut: 'Suspendu',
    description: 'Appui institutionnel aux réformes judiciaires et administratives dans les États membres en situation post-conflit.',
    jalons: ['Diagnostic institutionnel', 'Plan d\'action', 'Formation magistrats', 'Évaluation réformes'],
    ptfDetails: [{ nom: 'PNUD', montant: 1500000 }, { nom: 'UE', montant: 550000 }],
  },
]

const jalons: {
  projet: string
  jalon: string
  datePrevue: string
  dateReelle: string
  statut: JalonStatut
}[] = [
  { projet: 'PRJ-2026-001', jalon: 'Étude diagnostique', datePrevue: '15/02/2026', dateReelle: '20/02/2026', statut: 'Atteint' },
  { projet: 'PRJ-2026-001', jalon: 'Atelier régional', datePrevue: '30/04/2026', dateReelle: '28/04/2026', statut: 'Atteint' },
  { projet: 'PRJ-2026-002', jalon: 'Recrutement personnel', datePrevue: '28/02/2026', dateReelle: '15/03/2026', statut: 'Atteint' },
  { projet: 'PRJ-2026-002', jalon: 'Formation militaire', datePrevue: '30/06/2026', dateReelle: '', statut: 'En cours' },
  { projet: 'PRJ-2026-003', jalon: 'Études de faisabilité', datePrevue: '31/01/2026', dateReelle: '28/01/2026', statut: 'Atteint' },
  { projet: 'PRJ-2026-003', jalon: "Appel d'offres", datePrevue: '31/03/2026', dateReelle: '', statut: 'Retard' },
  { projet: 'PRJ-2026-004', jalon: 'Cartographie zones vulnérables', datePrevue: '15/01/2026', dateReelle: '10/01/2026', statut: 'Atteint' },
  { projet: 'PRJ-2026-004', jalon: 'Distribution semences', datePrevue: '28/02/2026', dateReelle: '01/03/2026', statut: 'Atteint' },
  { projet: 'PRJ-2026-005', jalon: 'Études techniques', datePrevue: '30/06/2026', dateReelle: '', statut: 'En cours' },
  { projet: 'PRJ-2026-006', jalon: 'Plateforme numérique', datePrevue: '31/03/2026', dateReelle: '', statut: 'Retard' },
]

const financements = [
  {
    ref: 'PRJ-2026-001',
    intitule: 'Programme Intégration Économique Régionale',
    sources: [
      { ptf: 'Union Européenne', convention: 'CONV-UE-2025-042', montant: 3100000, verse: 2480000, solde: 620000, statut: 'Active' },
      { ptf: 'BAD', convention: 'CONV-BAD-2025-018', montant: 2000000, verse: 1000000, solde: 1000000, statut: 'Active' },
    ],
  },
  {
    ref: 'PRJ-2026-002',
    intitule: 'Force Multinationale FOMAC',
    sources: [
      { ptf: 'Union Africaine', convention: 'CONV-UA-2025-007', montant: 3500000, verse: 1750000, solde: 1750000, statut: 'Active' },
      { ptf: 'ONU-PNUD', convention: 'CONV-PNUD-2025-031', montant: 2500000, verse: 625000, solde: 1875000, statut: 'Active' },
    ],
  },
  {
    ref: 'PRJ-2026-003',
    intitule: 'Couloir Économique Brazzaville–Kinshasa',
    sources: [
      { ptf: 'Banque Mondiale', convention: 'CONV-BM-2025-009', montant: 6000000, verse: 1200000, solde: 4800000, statut: 'Active' },
      { ptf: 'BAD', convention: 'CONV-BAD-2025-022', montant: 4500000, verse: 900000, solde: 3600000, statut: 'En négociation' },
    ],
  },
  {
    ref: 'PRJ-2026-005',
    intitule: 'Interconnexion Électrique sous-régionale',
    sources: [
      { ptf: 'BAD', convention: 'CONV-BAD-2026-001', montant: 8200000, verse: 0, solde: 8200000, statut: 'En négociation' },
      { ptf: 'BEI', convention: 'CONV-BEI-2026-003', montant: 5000000, verse: 0, solde: 5000000, statut: 'En négociation' },
    ],
  },
  {
    ref: 'PRJ-2026-006',
    intitule: 'Surveillance Épidémiologique',
    sources: [
      { ptf: 'OMS', convention: 'CONV-OMS-2025-014', montant: 1200000, verse: 720000, solde: 480000, statut: 'Active' },
      { ptf: 'CDC Afrique', convention: 'CONV-CDC-2025-006', montant: 700000, verse: 350000, solde: 350000, statut: 'Active' },
    ],
  },
]

const statutColors: Record<ProjetStatut, string> = {
  'En cours': 'badge bg-blue-100 text-blue-800',
  'Planifié': 'badge bg-gray-100 text-gray-700',
  'Suspendu': 'badge bg-red-100 text-red-700',
  'Clôturé': 'badge bg-green-100 text-green-800',
}

const jalonColors: Record<JalonStatut, string> = {
  'Atteint': 'badge bg-green-100 text-green-800',
  'En cours': 'badge bg-blue-100 text-blue-800',
  'Retard': 'badge bg-red-100 text-red-800',
  'Non démarré': 'badge bg-gray-100 text-gray-600',
}

const pieData = [
  { name: 'En cours', value: 5, color: '#1A6B3A' },
  { name: 'Planifié', value: 1, color: '#0B1C3E' },
  { name: 'Suspendu', value: 1, color: '#ef4444' },
  { name: 'Clôturé', value: 0, color: '#6b7280' },
]

const totalBudget = projets.reduce((s, p) => s + p.total, 0)
const avgAvancement = Math.round(projets.reduce((s, p) => s + p.avancement, 0) / projets.length)
const enRetard = projets.filter(p => p.avancement < 30 && p.statut === 'En cours').length

export default function Projets({ onNavigate: _onNavigate }: Props) {
  const [tab, setTab] = useState(0)
  const [selectedProjet, setSelectedProjet] = useState<Projet | null>(null)

  const tabs = ['Dashboard', 'Portefeuille projets', 'Jalons et livrables', 'Financements']

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="section-title text-2xl font-bold" style={{ color: '#0B1C3E' }}>
            Projets et Investissements
          </h1>
          <p className="text-sm text-gray-500 mt-1">Module 16 · Portefeuille 2026</p>
        </div>
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
                <Briefcase size={16} style={{ color: '#1A6B3A' }} />
                <span className="text-xs text-gray-500 uppercase tracking-wide">Projets actifs</span>
              </div>
              <div className="amount text-2xl font-bold" style={{ color: '#0B1C3E' }}>5</div>
            </div>
            <div className="kpi-card">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp size={16} style={{ color: '#1A6B3A' }} />
                <span className="text-xs text-gray-500 uppercase tracking-wide">Budget total projets</span>
              </div>
              <div className="amount text-2xl font-bold" style={{ color: '#0B1C3E' }}>{fmt(totalBudget)}</div>
            </div>
            <div className="kpi-card">
              <div className="flex items-center gap-2 mb-1">
                <Clock size={16} style={{ color: '#D4A017' }} />
                <span className="text-xs text-gray-500 uppercase tracking-wide">Taux d'exécution moyen</span>
              </div>
              <div className="amount text-2xl font-bold" style={{ color: '#D4A017' }}>{avgAvancement}%</div>
            </div>
            <div className="kpi-card">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle size={16} className="text-red-500" />
                <span className="text-xs text-gray-500 uppercase tracking-wide">Projets en retard</span>
              </div>
              <div className="amount text-2xl font-bold text-red-600">{enRetard}</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="card">
              <h2 className="font-semibold mb-4" style={{ color: '#0B1C3E' }}>Répartition par statut</h2>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="card col-span-2">
              <h2 className="font-semibold mb-4" style={{ color: '#0B1C3E' }}>Top 5 projets — Avancement</h2>
              <div className="space-y-3">
                {projets.slice(0, 5).map((p, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium truncate max-w-xs" title={p.intitule}>{p.intitule}</span>
                      <span className="text-gray-500 ml-2">{p.avancement}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${p.avancement}%`,
                          backgroundColor: p.avancement >= 60 ? '#1A6B3A' : p.avancement >= 30 ? '#D4A017' : '#ef4444',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 1: Portefeuille projets */}
      {tab === 1 && (
        <div className="space-y-4">
          <h2 className="font-semibold" style={{ color: '#0B1C3E' }}>Portefeuille de projets — {projets.length} projets</h2>
          <div className="card p-0">
            <table className="data-table w-full">
              <thead>
                <tr>
                  <th>Référence</th>
                  <th>Intitulé</th>
                  <th>Pilier RBM</th>
                  <th className="text-right">Montant total</th>
                  <th className="text-right">CEEAC</th>
                  <th className="text-right">PTF</th>
                  <th className="text-right">Avancement</th>
                  <th>Statut</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {projets.map((p, i) => (
                  <tr key={i} className="cursor-pointer hover:bg-gray-50" onClick={() => setSelectedProjet(p)}>
                    <td className="font-mono text-sm">{p.ref}</td>
                    <td className="max-w-xs">
                      <span className="line-clamp-2 text-sm">{p.intitule}</span>
                    </td>
                    <td className="text-sm text-gray-600">{p.pilier}</td>
                    <td className="text-right amount">{fmt(p.total)}</td>
                    <td className="text-right amount text-sm">{fmt(p.ceeac)}</td>
                    <td className="text-right amount text-sm">{fmt(p.ptf)}</td>
                    <td className="text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <div className="w-16 bg-gray-100 rounded-full h-1.5">
                          <div
                            className="h-1.5 rounded-full"
                            style={{
                              width: `${p.avancement}%`,
                              backgroundColor: p.avancement >= 60 ? '#1A6B3A' : p.avancement >= 30 ? '#D4A017' : '#ef4444',
                            }}
                          />
                        </div>
                        <span className="text-sm">{p.avancement}%</span>
                      </div>
                    </td>
                    <td><span className={statutColors[p.statut]}>{p.statut}</span></td>
                    <td><ChevronRight size={14} className="text-gray-400" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Side Panel */}
          {selectedProjet && (
            <div className="fixed inset-0 z-50 flex">
              <div className="flex-1 bg-black/30" onClick={() => setSelectedProjet(null)} />
              <div className="w-[520px] bg-white h-full overflow-y-auto shadow-2xl">
                <div className="p-6 space-y-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-mono text-gray-400">{selectedProjet.ref}</p>
                      <h3 className="font-bold text-lg mt-1" style={{ color: '#0B1C3E' }}>{selectedProjet.intitule}</h3>
                      <span className={statutColors[selectedProjet.statut] + ' mt-2 inline-block'}>{selectedProjet.statut}</span>
                    </div>
                    <button onClick={() => setSelectedProjet(null)} className="p-1 hover:bg-gray-100 rounded">
                      <X size={18} />
                    </button>
                  </div>

                  <div>
                    <p className="form-label">Description</p>
                    <p className="text-sm text-gray-700">{selectedProjet.description}</p>
                  </div>

                  <div>
                    <p className="form-label">Financement</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Budget total</span>
                        <span className="amount font-semibold">{fmt(selectedProjet.total)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Contribution CEEAC</span>
                        <span className="amount">{fmt(selectedProjet.ceeac)}</span>
                      </div>
                      {selectedProjet.ptfDetails.map((d, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span>{d.nom}</span>
                          <span className="amount">{fmt(d.montant)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="form-label">Jalons</p>
                    <div className="space-y-2">
                      {selectedProjet.jalons.map((j, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <div
                            className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ backgroundColor: i < 2 ? '#1A6B3A' : '#D4A017' }}
                          />
                          {j}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="form-label">Avancement global</p>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-100 rounded-full h-3">
                        <div
                          className="h-3 rounded-full"
                          style={{
                            width: `${selectedProjet.avancement}%`,
                            backgroundColor: selectedProjet.avancement >= 60 ? '#1A6B3A' : selectedProjet.avancement >= 30 ? '#D4A017' : '#ef4444',
                          }}
                        />
                      </div>
                      <span className="font-bold">{selectedProjet.avancement}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Jalons et livrables */}
      {tab === 2 && (
        <div className="space-y-4">
          <h2 className="font-semibold" style={{ color: '#0B1C3E' }}>Jalons et livrables — Suivi d'exécution</h2>
          <div className="card p-0">
            <table className="data-table w-full">
              <thead>
                <tr>
                  <th>Projet</th>
                  <th>Jalon</th>
                  <th>Date prévue</th>
                  <th>Date réelle</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {jalons.map((j, i) => (
                  <tr key={i}>
                    <td className="font-mono text-sm">{j.projet}</td>
                    <td className="text-sm font-medium">{j.jalon}</td>
                    <td className="text-sm text-gray-600">{j.datePrevue}</td>
                    <td className="text-sm text-gray-600">{j.dateReelle || '—'}</td>
                    <td><span className={jalonColors[j.statut]}>{j.statut}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Financements */}
      {tab === 3 && (
        <div className="space-y-6">
          <h2 className="font-semibold" style={{ color: '#0B1C3E' }}>Financements PTF par projet</h2>
          {financements.map((f, fi) => (
            <div key={fi} className="card">
              <div className="mb-3">
                <p className="font-mono text-xs text-gray-400">{f.ref}</p>
                <p className="font-semibold" style={{ color: '#0B1C3E' }}>{f.intitule}</p>
              </div>
              <table className="data-table w-full">
                <thead>
                  <tr>
                    <th>PTF</th>
                    <th>Convention</th>
                    <th className="text-right">Montant</th>
                    <th className="text-right">Versements reçus</th>
                    <th className="text-right">Solde</th>
                    <th>Statut convention</th>
                  </tr>
                </thead>
                <tbody>
                  {f.sources.map((s, si) => (
                    <tr key={si}>
                      <td className="font-medium text-sm">{s.ptf}</td>
                      <td className="font-mono text-xs text-gray-500">{s.convention}</td>
                      <td className="text-right amount">{fmt(s.montant)}</td>
                      <td className="text-right amount">{fmt(s.verse)}</td>
                      <td className="text-right amount">{fmt(s.solde)}</td>
                      <td>
                        <span className={s.statut === 'Active' ? 'badge bg-green-100 text-green-800' : 'badge bg-yellow-100 text-yellow-800'}>
                          {s.statut}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
