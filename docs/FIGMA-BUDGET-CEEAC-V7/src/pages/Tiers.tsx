import { useState } from 'react'
import {
  Search, Plus, AlertTriangle, CheckCircle, Clock, XCircle,
  ChevronRight, Building2, CreditCard, FileText, Activity,
  X, Eye, GitMerge, ShieldAlert, Users
} from 'lucide-react'
import type { Page } from '../types'

interface Props {
  onNavigate: (page: Page, id?: string) => void
}

type ConformityStatus = 'Conforme' | 'En attente' | 'Expiré'
type RiskLevel = 'Faible' | 'Moyen' | 'Élevé'
type TierType = 'Fournisseur' | 'Prestataire' | 'Consultant' | 'Bailleur/PTF'

interface Tiers {
  id: string
  reference: string
  raisonSociale: string
  type: TierType
  pays: string
  statut: ConformityStatus
  risque: RiskLevel
  formeJuridique: string
  registre: string
  identifiantFiscal: string
  banque: string
  iban: string
  swift: string
  devise: string
  derniereActivite: string
  engCount: number
  liqCount: number
  payCount: number
  totalMontant: number
  documents: { nom: string; expiry: string; statut: ConformityStatus }[]
  alertes: string[]
}

const TIERS: Tiers[] = [
  {
    id: 'T001', reference: 'TRS-2024-001', raisonSociale: 'ACME Informatique SARL', type: 'Fournisseur',
    pays: 'Cameroun', statut: 'Conforme', risque: 'Faible', formeJuridique: 'SARL',
    registre: 'RC/DLA/2018/B/12345', identifiantFiscal: 'M012345678901A',
    banque: 'BGFI Bank Cameroun', iban: 'CM21 1000 1234 5678 9012 3456 789', swift: 'BGFICMCX', devise: 'XAF',
    derniereActivite: '2026-08-15', engCount: 5, liqCount: 4, payCount: 4, totalMontant: 48500000,
    documents: [
      { nom: 'Statuts sociaux', expiry: '2027-12-31', statut: 'Conforme' },
      { nom: 'RC RCCM', expiry: '2026-12-31', statut: 'Conforme' },
      { nom: 'Attestation fiscale', expiry: '2026-03-31', statut: 'Expiré' },
      { nom: 'Attestation CNPS', expiry: '2026-09-30', statut: 'Conforme' },
    ],
    alertes: [],
  },
  {
    id: 'T002', reference: 'TRS-2024-002', raisonSociale: 'Cabinet DIALLO & Associés', type: 'Consultant',
    pays: 'Sénégal', statut: 'Conforme', risque: 'Faible', formeJuridique: 'Cabinet libéral',
    registre: 'RC/DKR/2015/A/9876', identifiantFiscal: 'SN20150034567',
    banque: 'Ecobank Sénégal', iban: 'SN08 1000 5555 6666 7777 8888 999', swift: 'ECOBSNDA', devise: 'XOF',
    derniereActivite: '2026-07-22', engCount: 3, liqCount: 3, payCount: 2, totalMontant: 22000000,
    documents: [
      { nom: 'Statuts sociaux', expiry: '2028-06-30', statut: 'Conforme' },
      { nom: 'RC RCCM', expiry: '2026-10-31', statut: 'Conforme' },
      { nom: 'Attestation fiscale', expiry: '2026-12-31', statut: 'Conforme' },
      { nom: 'Attestation CNPS', expiry: '2026-11-30', statut: 'Conforme' },
    ],
    alertes: [],
  },
  {
    id: 'T003', reference: 'TRS-2024-003', raisonSociale: 'BTP Afrique Centrale SA', type: 'Fournisseur',
    pays: 'Congo', statut: 'En attente', risque: 'Moyen', formeJuridique: 'SA',
    registre: 'RC/BZV/2019/B/4421', identifiantFiscal: 'CG201900445',
    banque: 'Banque Postale du Congo', iban: 'CG39 3000 1111 2222 3333 4444 555', swift: 'BPCOCGCG', devise: 'XAF',
    derniereActivite: '2026-06-10', engCount: 2, liqCount: 1, payCount: 1, totalMontant: 95000000,
    documents: [
      { nom: 'Statuts sociaux', expiry: '2027-05-31', statut: 'Conforme' },
      { nom: 'RC RCCM', expiry: '2026-08-31', statut: 'Expiré' },
      { nom: 'Attestation fiscale', expiry: '2026-11-30', statut: 'En attente' },
      { nom: 'Caution bancaire', expiry: '2026-12-31', statut: 'En attente' },
    ],
    alertes: ['Compte bancaire modifié le 2026-05-20 — vérification requise'],
  },
  {
    id: 'T004', reference: 'TRS-2024-004', raisonSociale: 'Union Européenne – Délégation', type: 'Bailleur/PTF',
    pays: 'International', statut: 'Conforme', risque: 'Faible', formeJuridique: 'Organisation internationale',
    registre: 'N/A', identifiantFiscal: 'EXEMPT',
    banque: 'Banque Centrale Européenne', iban: 'DE89 3704 0044 0532 0130 00', swift: 'COBADEFFXXX', devise: 'EUR',
    derniereActivite: '2026-09-01', engCount: 1, liqCount: 0, payCount: 0, totalMontant: 500000000,
    documents: [
      { nom: 'Convention de financement', expiry: '2028-12-31', statut: 'Conforme' },
      { nom: 'Accord de siège', expiry: '2030-06-30', statut: 'Conforme' },
    ],
    alertes: [],
  },
  {
    id: 'T005', reference: 'TRS-2024-005', raisonSociale: 'Imprimerie Nationale du Gabon', type: 'Fournisseur',
    pays: 'Gabon', statut: 'Expiré', risque: 'Élevé', formeJuridique: 'Établissement public',
    registre: 'EP/LBV/2010/001', identifiantFiscal: 'GA201000123',
    banque: 'BGFI Bank Gabon', iban: 'GA21 4000 9988 7766 5544 3322 111', swift: 'BGFIGAGX', devise: 'XAF',
    derniereActivite: '2026-04-30', engCount: 7, liqCount: 6, payCount: 6, totalMontant: 18750000,
    documents: [
      { nom: 'Statuts sociaux', expiry: '2025-12-31', statut: 'Expiré' },
      { nom: 'RC RCCM', expiry: '2025-06-30', statut: 'Expiré' },
      { nom: 'Attestation fiscale', expiry: '2025-09-30', statut: 'Expiré' },
      { nom: 'Attestation CNPS', expiry: '2026-03-31', statut: 'Expiré' },
    ],
    alertes: ['Documents de conformité expirés — opérations bloquées'],
  },
  {
    id: 'T006', reference: 'TRS-2024-006', raisonSociale: 'KPMG Afrique Centrale', type: 'Prestataire',
    pays: 'Cameroun', statut: 'Conforme', risque: 'Faible', formeJuridique: 'SAS',
    registre: 'RC/DLA/2005/B/00789', identifiantFiscal: 'M005678901234A',
    banque: 'Standard Chartered Cameroun', iban: 'CM21 6000 1234 0000 9999 8888 777', swift: 'SCBLCMCX', devise: 'XAF',
    derniereActivite: '2026-08-30', engCount: 4, liqCount: 4, payCount: 4, totalMontant: 36000000,
    documents: [
      { nom: 'Statuts sociaux', expiry: '2029-12-31', statut: 'Conforme' },
      { nom: 'RC RCCM', expiry: '2027-06-30', statut: 'Conforme' },
      { nom: 'Attestation fiscale', expiry: '2026-12-31', statut: 'Conforme' },
      { nom: 'Agrément professionnel', expiry: '2027-03-31', statut: 'Conforme' },
    ],
    alertes: [],
  },
  {
    id: 'T007', reference: 'TRS-2024-007', raisonSociale: 'Dr. Jean-Pierre MOUKALA', type: 'Consultant',
    pays: 'RDC', statut: 'En attente', risque: 'Moyen', formeJuridique: 'Personne physique',
    registre: 'N/A', identifiantFiscal: 'CD2019PP004567',
    banque: 'Rawbank RDC', iban: 'CD56 0001 0100 1000 4000 1500 1234', swift: 'RAWBCDKI', devise: 'USD',
    derniereActivite: '2026-07-15', engCount: 2, liqCount: 2, payCount: 1, totalMontant: 12500000,
    documents: [
      { nom: 'Pièce identité', expiry: '2027-08-31', statut: 'Conforme' },
      { nom: 'CV certifié', expiry: '2026-12-31', statut: 'Conforme' },
      { nom: 'Attestation fiscale', expiry: '2026-10-31', statut: 'En attente' },
    ],
    alertes: [],
  },
  {
    id: 'T008', reference: 'TRS-2024-008', raisonSociale: 'Acme Informatique & Services', type: 'Fournisseur',
    pays: 'Cameroun', statut: 'En attente', risque: 'Élevé', formeJuridique: 'SARL',
    registre: 'RC/DLA/2020/B/55123', identifiantFiscal: 'M020555123456A',
    banque: 'BGFI Bank Cameroun', iban: 'CM21 1000 1234 5678 9012 3456 789', swift: 'BGFICMCX', devise: 'XAF',
    derniereActivite: '2026-05-20', engCount: 1, liqCount: 0, payCount: 0, totalMontant: 5000000,
    documents: [
      { nom: 'Statuts sociaux', expiry: '2026-12-31', statut: 'Conforme' },
      { nom: 'RC RCCM', expiry: '2026-11-30', statut: 'En attente' },
      { nom: 'Attestation fiscale', expiry: '2026-09-30', statut: 'En attente' },
    ],
    alertes: ['Nom similaire à TRS-2024-001 (ACME Informatique SARL) — doublon potentiel'],
  },
]

const REQUIRED_DOCS = ['Statuts sociaux', 'RC RCCM', 'Attestation fiscale', 'Attestation CNPS']

const DUPLICATES = [
  {
    id: 'DUP-001', type: 'iban' as const,
    tiers1: 'TRS-2024-001 – ACME Informatique SARL',
    tiers2: 'TRS-2024-008 – Acme Informatique & Services',
    detail: 'IBAN identique: CM21 1000 1234 5678 9012 3456 789',
    risque: 'Élevé' as RiskLevel,
  },
  {
    id: 'DUP-002', type: 'name' as const,
    tiers1: 'TRS-2024-001 – ACME Informatique SARL',
    tiers2: 'TRS-2024-008 – Acme Informatique & Services',
    detail: 'Noms très similaires (distance Levenshtein < 5)',
    risque: 'Moyen' as RiskLevel,
  },
]

const conformityColor: Record<ConformityStatus, string> = {
  Conforme: 'badge-success',
  'En attente': 'badge-warning',
  Expiré: 'badge-danger',
}

const riskColor: Record<RiskLevel, string> = {
  Faible: 'badge-success',
  Moyen: 'badge-warning',
  Élevé: 'badge-danger',
}

const ConformityIcon = ({ s }: { s: ConformityStatus }) =>
  s === 'Conforme' ? <CheckCircle size={13} className="text-green-600" />
  : s === 'En attente' ? <Clock size={13} className="text-amber-500" />
  : <XCircle size={13} className="text-red-500" />

const fmt = (n: number) => new Intl.NumberFormat('fr-FR').format(n) + ' XAF'

export default function Tiers({ onNavigate }: Props) {
  const [activeTab, setActiveTab] = useState('liste')
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [statutFilter, setStatutFilter] = useState<string>('all')
  const [selectedTiers, setSelectedTiers] = useState<Tiers | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [alertTiers, setAlertTiers] = useState<Tiers | null>(null)
  const [fusionDup, setFusionDup] = useState<typeof DUPLICATES[number] | null>(null)
  const [fusionChoice, setFusionChoice] = useState<'tiers1' | 'tiers2'>('tiers1')
  const [investigateDup, setInvestigateDup] = useState<typeof DUPLICATES[number] | null>(null)
  const [investigateNote, setInvestigateNote] = useState('')
  const [duplicates, setDuplicates] = useState(DUPLICATES)
  const [ignoreConfirm, setIgnoreConfirm] = useState<string | null>(null)

  const filtered = TIERS.filter(t => {
    const q = search.toLowerCase()
    const matchSearch = !q || t.raisonSociale.toLowerCase().includes(q) || t.reference.toLowerCase().includes(q) || t.pays.toLowerCase().includes(q)
    const matchType = typeFilter === 'all' || t.type === typeFilter
    const matchStatut = statutFilter === 'all' || t.statut === statutFilter
    return matchSearch && matchType && matchStatut
  })

  const tabs = [
    { id: 'liste', label: 'Liste des tiers', icon: <Users size={14} /> },
    { id: 'fiche', label: 'Fiche tiers', icon: <Building2 size={14} /> },
    { id: 'conformite', label: 'Conformité', icon: <ShieldAlert size={14} /> },
    { id: 'doublons', label: 'Doublons/Alertes', icon: <AlertTriangle size={14} /> },
  ]

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="section-title text-2xl">Tiers — Fournisseurs & Bénéficiaires</h1>
          <p className="text-sm text-gray-500 mt-0.5">Référentiel des tiers — conformité, risques et historique d'activité</p>
        </div>
        <div className="flex gap-2">
          <span className="kpi-card py-2 px-3 text-xs font-medium text-green-700">{TIERS.filter(t => t.statut === 'Conforme').length} Conformes</span>
          <span className="kpi-card py-2 px-3 text-xs font-medium text-amber-600">{TIERS.filter(t => t.statut === 'En attente').length} En attente</span>
          <span className="kpi-card py-2 px-3 text-xs font-medium text-red-600">{TIERS.filter(t => t.statut === 'Expiré').length} Expirés</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 gap-0 -mt-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-item flex items-center gap-1.5 ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => { setActiveTab(tab.id); if (tab.id !== 'fiche') setSelectedTiers(null) }}
          >
            {tab.icon} {tab.label}
            {tab.id === 'doublons' && <span className="ml-1 bg-red-100 text-red-700 text-[10px] px-1.5 py-0.5 rounded-full font-semibold">{DUPLICATES.length}</span>}
          </button>
        ))}
      </div>

      {/* ── TAB 1: Liste ── */}
      {activeTab === 'liste' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-48 max-w-xs">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input className="form-input pl-9 py-2 text-[13px]" placeholder="Raison sociale, référence, pays…" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="form-input py-2 text-[13px] w-40" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
              <option value="all">Tous types</option>
              <option>Fournisseur</option><option>Prestataire</option><option>Consultant</option><option>Bailleur/PTF</option>
            </select>
            <select className="form-input py-2 text-[13px] w-40" value={statutFilter} onChange={e => setStatutFilter(e.target.value)}>
              <option value="all">Tous statuts</option>
              <option>Conforme</option><option>En attente</option><option>Expiré</option>
            </select>
            <button className="btn btn-primary btn-sm ml-auto" onClick={() => setShowModal(true)}><Plus size={13} /> Nouveau tiers</button>
          </div>
          <div className="card overflow-hidden">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Référence</th><th>Raison sociale</th><th>Type/Rôle</th><th>Pays</th><th>Conformité</th><th>Risque</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(t => (
                  <tr key={t.id} className="cursor-pointer" onClick={() => onNavigate('tiers-detail', t.id)}>
                    <td><code className="text-[11px] text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">{t.reference}</code></td>
                    <td className="font-medium text-gray-900">{t.raisonSociale}</td>
                    <td><span className="badge badge-info">{t.type}</span></td>
                    <td className="text-gray-600 text-[13px]">{t.pays}</td>
                    <td>
                      <span className={`badge ${conformityColor[t.statut]} flex items-center gap-1 w-fit`}>
                        <ConformityIcon s={t.statut} /> {t.statut}
                      </span>
                    </td>
                    <td><span className={`badge ${riskColor[t.risque]}`}>{t.risque}</span></td>
                    <td onClick={e => e.stopPropagation()}>
                      <div className="flex gap-1">
                        <button className="btn btn-outline btn-sm" onClick={() => onNavigate('tiers-detail', t.id)}><Eye size={12} /></button>
                        {t.alertes.length > 0 && <button className="btn btn-sm bg-amber-50 text-amber-700 border border-amber-200" onClick={() => setAlertTiers(t)}><AlertTriangle size={12} /></button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && <p className="text-center text-gray-400 text-sm py-8">Aucun tiers trouvé.</p>}
          </div>
          <p className="text-xs text-gray-400">{filtered.length} tiers affichés sur {TIERS.length}</p>
        </div>
      )}

      {/* ── TAB 2: Fiche tiers ── */}
      {activeTab === 'fiche' && (
        <div className="space-y-4">
          {!selectedTiers ? (
            <div className="card text-center py-16 text-gray-400">
              <Building2 size={40} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">Sélectionnez un tiers dans la liste pour afficher sa fiche.</p>
              <button className="btn btn-outline btn-sm mt-4" onClick={() => setActiveTab('liste')}><ChevronRight size={13} /> Aller à la liste</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Identity */}
              <div className="lg:col-span-2 space-y-4">
                <div className="card space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-[#0B1C3E] flex items-center gap-2"><Building2 size={16} /> Identité juridique</h2>
                    <span className={`badge ${conformityColor[selectedTiers.statut]}`}>{selectedTiers.statut}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-[13px]">
                    {[
                      ['Raison sociale', selectedTiers.raisonSociale],
                      ['Forme juridique', selectedTiers.formeJuridique],
                      ['Pays', selectedTiers.pays],
                      ['Type', selectedTiers.type],
                      ['N° RCCM', selectedTiers.registre],
                      ['Identifiant fiscal', selectedTiers.identifiantFiscal],
                    ].map(([label, val]) => (
                      <div key={label}>
                        <p className="form-label text-[11px] mb-0.5">{label}</p>
                        <p className="text-gray-900 font-medium">{val}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bank account */}
                <div className="card space-y-3">
                  <h2 className="font-semibold text-[#0B1C3E] flex items-center gap-2"><CreditCard size={16} /> Compte bancaire</h2>
                  <div className="grid grid-cols-2 gap-3 text-[13px]">
                    {[
                      ['Banque', selectedTiers.banque],
                      ['Devise', selectedTiers.devise],
                      ['IBAN', selectedTiers.iban],
                      ['SWIFT/BIC', selectedTiers.swift],
                    ].map(([label, val]) => (
                      <div key={label}>
                        <p className="form-label text-[11px] mb-0.5">{label}</p>
                        <p className="text-gray-900 font-mono text-[12px]">{val}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-1">
                    <span className="badge badge-success">Vérifié</span>
                    <span className="text-[11px] text-gray-400">Version 1 — depuis le 2024-01-15</span>
                  </div>
                </div>

                {/* Activity history */}
                <div className="card space-y-3">
                  <h2 className="font-semibold text-[#0B1C3E] flex items-center gap-2"><Activity size={16} /> Historique d'activité</h2>
                  <table className="data-table">
                    <thead><tr><th>Type</th><th>Nb opérations</th><th>Total engagé</th><th>Dernière activité</th></tr></thead>
                    <tbody>
                      <tr><td>Engagements</td><td>{selectedTiers.engCount}</td><td className="amount">{fmt(selectedTiers.totalMontant)}</td><td>{selectedTiers.derniereActivite}</td></tr>
                      <tr><td>Liquidations</td><td>{selectedTiers.liqCount}</td><td className="amount">{fmt(Math.round(selectedTiers.totalMontant * 0.8))}</td><td>{selectedTiers.derniereActivite}</td></tr>
                      <tr><td>Paiements</td><td>{selectedTiers.payCount}</td><td className="amount">{fmt(Math.round(selectedTiers.totalMontant * 0.75))}</td><td>{selectedTiers.derniereActivite}</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right panel */}
              <div className="space-y-4">
                {/* Alerts */}
                {selectedTiers.alertes.length > 0 && (
                  <div className="card border-l-4 border-amber-400 bg-amber-50 space-y-2">
                    <h2 className="font-semibold text-amber-800 flex items-center gap-2 text-[13px]"><AlertTriangle size={14} /> Alertes</h2>
                    {selectedTiers.alertes.map((a, i) => (
                      <p key={i} className="text-[12px] text-amber-700">{a}</p>
                    ))}
                  </div>
                )}

                {/* Documents */}
                <div className="card space-y-2">
                  <h2 className="font-semibold text-[#0B1C3E] flex items-center gap-2 text-[13px]"><FileText size={14} /> Documents de conformité</h2>
                  {selectedTiers.documents.map((doc, i) => (
                    <div key={i} className="flex items-center justify-between py-1.5 border-b border-gray-100 last:border-0">
                      <div>
                        <p className="text-[12px] font-medium text-gray-800">{doc.nom}</p>
                        <p className="text-[11px] text-gray-400">Exp. {doc.expiry}</p>
                      </div>
                      <span className={`badge ${conformityColor[doc.statut]} text-[10px]`}>{doc.statut}</span>
                    </div>
                  ))}
                </div>

                <div className="card text-center space-y-1">
                  <p className="text-[11px] text-gray-400 uppercase tracking-wide">Risque global</p>
                  <span className={`badge ${riskColor[selectedTiers.risque]} text-sm px-3 py-1`}>{selectedTiers.risque}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── TAB 3: Conformité ── */}
      {activeTab === 'conformite' && (
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: 'Tiers conformes', val: TIERS.filter(t => t.statut === 'Conforme').length, color: 'text-green-700' },
              { label: 'En attente', val: TIERS.filter(t => t.statut === 'En attente').length, color: 'text-amber-600' },
              { label: 'Expirés', val: TIERS.filter(t => t.statut === 'Expiré').length, color: 'text-red-600' },
              { label: 'Taux global', val: `${Math.round((TIERS.filter(t => t.statut === 'Conforme').length / TIERS.length) * 100)}%`, color: 'text-blue-700' },
            ].map(kpi => (
              <div key={kpi.label} className="kpi-card text-center">
                <p className={`text-2xl font-bold ${kpi.color}`}>{kpi.val}</p>
                <p className="text-[11px] text-gray-500 mt-0.5">{kpi.label}</p>
              </div>
            ))}
          </div>

          <div className="card overflow-hidden">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Tiers</th>
                  {REQUIRED_DOCS.map(d => <th key={d} className="text-center max-w-20">{d.split(' ')[0]}<br /><span className="font-normal text-[10px] text-gray-400">{d.split(' ').slice(1).join(' ')}</span></th>)}
                  <th>Complétion</th>
                </tr>
              </thead>
              <tbody>
                {TIERS.map(t => {
                  const score = REQUIRED_DOCS.filter(d => t.documents.some(doc => doc.nom.toLowerCase().includes(d.split(' ')[0].toLowerCase()) && doc.statut === 'Conforme')).length
                  const pct = Math.round((score / REQUIRED_DOCS.length) * 100)
                  return (
                    <tr key={t.id}>
                      <td>
                        <p className="font-medium text-[13px] text-gray-900">{t.raisonSociale}</p>
                        <p className="text-[11px] text-gray-400">{t.reference}</p>
                      </td>
                      {REQUIRED_DOCS.map(d => {
                        const doc = t.documents.find(doc => doc.nom.toLowerCase().includes(d.split(' ')[0].toLowerCase()))
                        return (
                          <td key={d} className="text-center">
                            {doc ? <ConformityIcon s={doc.statut} /> : <span className="text-gray-300 text-xs">—</span>}
                          </td>
                        )
                      })}
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                            <div className={`h-1.5 rounded-full ${pct === 100 ? 'bg-green-500' : pct >= 50 ? 'bg-amber-400' : 'bg-red-400'}`} style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-[11px] font-medium text-gray-600 w-8">{pct}%</span>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── TAB 4: Doublons/Alertes ── */}
      {activeTab === 'doublons' && (
        <div className="space-y-4">
          <div className="card border-l-4 border-red-400 bg-red-50">
            <p className="text-[13px] text-red-700 font-medium flex items-center gap-2"><AlertTriangle size={14} /> {DUPLICATES.length} doublon(s) potentiel(s) détecté(s) — action requise</p>
          </div>
          {duplicates.length === 0 && (
            <div className="card text-center py-10 text-gray-400">
              <CheckCircle size={32} className="mx-auto mb-2 text-green-400" />
              <p className="text-sm">Aucun doublon détecté.</p>
            </div>
          )}
          {duplicates.map(dup => (
            <div key={dup.id} className="card space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className={`badge ${dup.type === 'iban' ? 'badge-danger' : 'badge-warning'}`}>
                    {dup.type === 'iban' ? 'IBAN identique' : 'Nom similaire'}
                  </span>
                  <span className={`badge ${riskColor[dup.risque]}`}>Risque {dup.risque}</span>
                </div>
                <code className="text-[11px] text-gray-400">{dup.id}</code>
              </div>
              <div className="grid grid-cols-2 gap-3 text-[13px]">
                <div className="bg-gray-50 rounded p-3">
                  <p className="form-label text-[10px]">Tiers 1</p>
                  <p className="font-medium text-gray-800">{dup.tiers1}</p>
                </div>
                <div className="bg-gray-50 rounded p-3">
                  <p className="form-label text-[10px]">Tiers 2</p>
                  <p className="font-medium text-gray-800">{dup.tiers2}</p>
                </div>
              </div>
              <p className="text-[12px] text-gray-500 italic">{dup.detail}</p>
              <div className="flex gap-2 pt-1">
                <button className="btn btn-navy btn-sm flex items-center gap-1.5" onClick={() => { setFusionDup(dup); setFusionChoice('tiers1') }}><GitMerge size={13} /> Fusionner</button>
                <button className="btn btn-outline btn-sm flex items-center gap-1.5" onClick={() => { setInvestigateDup(dup); setInvestigateNote('') }}><Eye size={13} /> Investiguer</button>
                <button className="btn btn-sm text-gray-500 border border-gray-200 hover:bg-gray-50" onClick={() => setIgnoreConfirm(dup.id)}><X size={13} /> Ignorer</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Modal: Alertes du tiers ── */}
      {alertTiers && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="font-semibold text-amber-700 text-base flex items-center gap-2"><AlertTriangle size={15} /> Alertes — {alertTiers.raisonSociale}</h2>
              <button className="text-gray-400 hover:text-gray-600" onClick={() => setAlertTiers(null)}><X size={18} /></button>
            </div>
            <div className="p-5 space-y-3">
              {alertTiers.alertes.length === 0 ? (
                <p className="text-[13px] text-gray-400">Aucune alerte active.</p>
              ) : alertTiers.alertes.map((a, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 border border-amber-200">
                  <AlertTriangle size={14} className="text-amber-600 mt-0.5 flex-shrink-0" />
                  <p className="text-[13px] text-amber-800">{a}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-end p-5 border-t border-gray-100">
              <button className="btn btn-outline btn-sm" onClick={() => setAlertTiers(null)}>Fermer</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: Fusion ── */}
      {fusionDup && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="font-semibold text-[#0B1C3E] text-base flex items-center gap-2"><GitMerge size={15} /> Assistant de fusion</h2>
              <button className="text-gray-400 hover:text-gray-600" onClick={() => setFusionDup(null)}><X size={18} /></button>
            </div>
            <div className="p-5 space-y-4">
              <p className="text-[13px] text-gray-600">Choisissez la fiche à conserver. Les données de l'autre fiche seront archivées.</p>
              <div className="grid grid-cols-2 gap-4">
                {([['tiers1', fusionDup.tiers1], ['tiers2', fusionDup.tiers2]] as const).map(([key, label]) => (
                  <label key={key} className={`p-4 rounded-xl border-2 cursor-pointer transition-colors ${fusionChoice === key ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <input type="radio" name="fusion" checked={fusionChoice === key} onChange={() => setFusionChoice(key)} />
                      <span className="text-[11px] font-bold uppercase text-gray-400">{key === 'tiers1' ? 'Fiche A' : 'Fiche B'}</span>
                    </div>
                    <p className="text-[13px] font-medium text-gray-800">{label}</p>
                    {fusionChoice === key && <p className="text-[11px] text-blue-600 mt-1 font-medium">Fiche conservée</p>}
                  </label>
                ))}
              </div>
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-[12px] text-amber-700">
                Cette action est irréversible. La fiche non conservée sera archivée avec mention de fusion.
              </div>
            </div>
            <div className="flex justify-end gap-2 p-5 border-t border-gray-100">
              <button className="btn btn-outline btn-sm" onClick={() => setFusionDup(null)}>Annuler</button>
              <button className="btn btn-primary btn-sm flex items-center gap-1.5" onClick={() => { setDuplicates(d => d.filter(x => x.id !== fusionDup.id)); setFusionDup(null) }}><GitMerge size={13} /> Confirmer la fusion</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: Investigation ── */}
      {investigateDup && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="font-semibold text-[#0B1C3E] text-base flex items-center gap-2"><Eye size={15} /> Investigation — {investigateDup.id}</h2>
              <button className="text-gray-400 hover:text-gray-600" onClick={() => setInvestigateDup(null)}><X size={18} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="space-y-2">
                <p className="text-[11px] uppercase font-semibold tracking-wide text-gray-400">Transactions suspectes associées</p>
                {[
                  { date: '2026-05-20', type: 'Modification IBAN', montant: '95 000 000 XAF', ref: 'ENG-2026-043' },
                  { date: '2026-03-15', type: 'Paiement effectué', montant: '18 750 000 XAF', ref: 'PAY-2026-021' },
                ].map((tx, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 text-[12.5px]">
                    <div className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0" />
                    <span className="text-gray-400 font-mono">{tx.date}</span>
                    <span className="flex-1 text-gray-700">{tx.type}</span>
                    <span className="font-medium text-gray-800">{tx.montant}</span>
                    <code className="text-blue-600 text-[11px]">{tx.ref}</code>
                  </div>
                ))}
              </div>
              <div>
                <label className="form-label">Notes d'investigation</label>
                <textarea className="form-input" rows={3} placeholder="Observations, conclusions, actions…" value={investigateNote} onChange={e => setInvestigateNote(e.target.value)} />
              </div>
            </div>
            <div className="flex justify-end gap-2 p-5 border-t border-gray-100">
              <button className="btn btn-outline btn-sm" onClick={() => setInvestigateDup(null)}>Fermer</button>
              <button className="btn btn-primary btn-sm" onClick={() => setInvestigateDup(null)}>Enregistrer les notes</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: Confirmer ignorer ── */}
      {ignoreConfirm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 space-y-4">
            <p className="text-[14px] font-semibold text-gray-800">Ignorer cette alerte ?</p>
            <p className="text-[13px] text-gray-500">L'alerte {ignoreConfirm} sera retirée de la liste. Cette action est réversible depuis l'historique des alertes.</p>
            <div className="flex justify-end gap-2">
              <button className="btn btn-outline btn-sm" onClick={() => setIgnoreConfirm(null)}>Annuler</button>
              <button className="btn btn-sm bg-gray-100 text-gray-700 hover:bg-gray-200" onClick={() => { setDuplicates(d => d.filter(x => x.id !== ignoreConfirm)); setIgnoreConfirm(null) }}>
                Alerte ignorée
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: Nouveau tiers ── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="font-semibold text-[#0B1C3E] text-base">Nouveau tiers</h2>
              <button className="text-gray-400 hover:text-gray-600" onClick={() => setShowModal(false)}><X size={18} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Raison sociale *</label>
                  <input className="form-input" placeholder="Ex. ACME SARL" />
                </div>
                <div>
                  <label className="form-label">Type *</label>
                  <select className="form-input">
                    <option>Fournisseur</option><option>Prestataire</option><option>Consultant</option><option>Bailleur/PTF</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Pays *</label>
                  <input className="form-input" placeholder="Ex. Cameroun" />
                </div>
                <div>
                  <label className="form-label">Forme juridique</label>
                  <input className="form-input" placeholder="SARL, SA, …" />
                </div>
                <div className="col-span-2">
                  <label className="form-label">Identifiant fiscal</label>
                  <input className="form-input" placeholder="N° fiscal" />
                </div>
                <div className="col-span-2">
                  <label className="form-label">IBAN</label>
                  <input className="form-input font-mono" placeholder="CM21 …" />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 p-5 border-t border-gray-100">
              <button className="btn btn-outline btn-sm" onClick={() => setShowModal(false)}>Annuler</button>
              <button className="btn btn-primary btn-sm" onClick={() => setShowModal(false)}>Créer le tiers</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
