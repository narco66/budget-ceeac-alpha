import { useState } from 'react'
import {
  ChevronLeft, Building2, CreditCard, FileText, Activity, Shield,
  CheckCircle, AlertTriangle, XCircle, Clock, Eye, Download, Plus,
  ChevronRight, Edit3, Lock, RefreshCw, Upload, Banknote, User,
  GitBranch, History, Phone, Mail, MapPin, Hash, Globe,
} from 'lucide-react'
import type { Page } from '../types'

interface Props {
  id: string
  onNavigate: (page: Page, id?: string) => void
}

const fmt = (n: number) =>
  new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(n) + ' XAF'

type StatutDoc = 'Conforme' | 'En attente' | 'Expiré'

const TIERS_DATA: Record<string, {
  id: string; reference: string; raisonSociale: string; type: string
  formeJuridique: string; pays: string; ville: string; adresse: string
  telephone: string; email: string; siteWeb: string
  registre: string; nif: string; cnps: string
  statut: StatutDoc; risque: string
  banque: string; iban: string; swift: string; devise: string; titulaire: string
  coordsBancairesValidees: boolean; dateValidationBancaire: string
  derniereActivite: string
  engCount: number; liqCount: number; ordCount: number; payCount: number
  totalEngage: number; totalLiquide: number; totalOrdonnance: number; totalPaye: number
  documents: { nom: string; reference: string; expiry: string; statut: StatutDoc; obligatoire: boolean }[]
  alertes: string[]
  chaine: {
    type: string; reference: string; date: string; objet: string; montant: number; statut: string
  }[]
}> = {
  'T001': {
    id: 'T001', reference: 'TRS-2024-001',
    raisonSociale: 'ACME Informatique SARL', type: 'Fournisseur',
    formeJuridique: 'Société à Responsabilité Limitée (SARL)',
    pays: 'Cameroun', ville: 'Douala',
    adresse: 'Rue de la Réunification, Akwa, BP 12345, Douala',
    telephone: '+237 233 123 456', email: 'contact@acme-informatique.cm',
    siteWeb: 'www.acme-informatique.cm',
    registre: 'RC/DLA/2018/B/12345', nif: 'M012345678901A', cnps: 'CNPS-DLA-2018-00456',
    statut: 'Conforme', risque: 'Faible',
    banque: 'BGFI Bank Cameroun', iban: 'CM21 1000 1234 5678 9012 3456 789',
    swift: 'BGFICMCX', devise: 'XAF', titulaire: 'ACME Informatique SARL',
    coordsBancairesValidees: true, dateValidationBancaire: '12/09/2026',
    derniereActivite: '2026-08-15',
    engCount: 5, liqCount: 4, ordCount: 3, payCount: 4,
    totalEngage: 72_000_000, totalLiquide: 64_000_000, totalOrdonnance: 48_500_000, totalPaye: 48_500_000,
    documents: [
      { nom: 'Statuts sociaux', reference: 'DOC-2024-001', expiry: '2027-12-31', statut: 'Conforme', obligatoire: true },
      { nom: 'RC RCCM', reference: 'DOC-2024-002', expiry: '2026-12-31', statut: 'Conforme', obligatoire: true },
      { nom: 'Attestation fiscale', reference: 'DOC-2024-003', expiry: '2026-03-31', statut: 'Expiré', obligatoire: true },
      { nom: 'Attestation CNPS', reference: 'DOC-2024-004', expiry: '2026-09-30', statut: 'Conforme', obligatoire: true },
      { nom: 'Agrément technique', reference: 'DOC-2024-005', expiry: '2027-06-30', statut: 'Conforme', obligatoire: false },
      { nom: 'Attestation domiciliation bancaire', reference: 'DOC-2024-006', expiry: '2027-01-31', statut: 'Conforme', obligatoire: true },
    ],
    alertes: ['Attestation fiscale expirée — renouvellement requis avant prochain ordonnancement'],
    chaine: [
      { type: 'ENG', reference: 'ENG-2026-002341', date: '2026-04-10', objet: 'Acquisition matériel informatique lot 1', montant: 28_500_000, statut: 'Visé CF' },
      { type: 'LIQ', reference: 'LIQ-2026-002756', date: '2026-08-12', objet: 'Acquisition matériel informatique lot 1 — livraison complète', montant: 27_000_000, statut: 'Visée CF' },
      { type: 'ORD', reference: 'ORD-2026-001823', date: '2026-08-12', objet: 'Acquisition matériel informatique lot 1', montant: 24_300_000, statut: 'Signé' },
      { type: 'PAY', reference: 'PAY-2026-001067', date: '2026-08-15', objet: 'Virement bancaire — BGFI Cameroun', montant: 24_300_000, statut: 'Exécuté' },
      { type: 'ENG', reference: 'ENG-2026-001534', date: '2026-02-15', objet: 'Infogérance système SI — exercice 2026', montant: 43_500_000, statut: 'Visé CF' },
      { type: 'LIQ', reference: 'LIQ-2026-002134', date: '2026-06-20', objet: 'Infogérance — tranche T1 et T2', montant: 37_000_000, statut: 'Visée CF' },
    ],
  },
  'T002': {
    id: 'T002', reference: 'TRS-2024-002',
    raisonSociale: "Cabinet DIALLO & Associés", type: 'Consultant',
    formeJuridique: 'Cabinet libéral',
    pays: 'Sénégal', ville: 'Dakar',
    adresse: 'Avenue Léopold Sédar Senghor, Plateau, BP 9876, Dakar',
    telephone: '+221 33 820 1234', email: 'cabinet@diallo-associes.sn',
    siteWeb: 'www.diallo-associes.sn',
    registre: 'RC/DKR/2015/A/9876', nif: 'SN20150034567', cnps: 'IPRES-2015-00678',
    statut: 'Conforme', risque: 'Faible',
    banque: 'Ecobank Sénégal', iban: 'SN08 1000 5555 6666 7777 8888 999',
    swift: 'ECOBSNDA', devise: 'XOF', titulaire: 'Cabinet DIALLO & Associés',
    coordsBancairesValidees: true, dateValidationBancaire: '05/09/2026',
    derniereActivite: '2026-07-22',
    engCount: 3, liqCount: 3, ordCount: 2, payCount: 2,
    totalEngage: 30_000_000, totalLiquide: 28_000_000, totalOrdonnance: 22_000_000, totalPaye: 22_000_000,
    documents: [
      { nom: 'Statuts sociaux', reference: 'DOC-2024-007', expiry: '2028-06-30', statut: 'Conforme', obligatoire: true },
      { nom: 'RC RCCM', reference: 'DOC-2024-008', expiry: '2026-10-31', statut: 'Conforme', obligatoire: true },
      { nom: 'Attestation fiscale', reference: 'DOC-2024-009', expiry: '2026-12-31', statut: 'Conforme', obligatoire: true },
      { nom: 'Attestation CNPS / IPRES', reference: 'DOC-2024-010', expiry: '2026-11-30', statut: 'Conforme', obligatoire: true },
    ],
    alertes: [],
    chaine: [
      { type: 'ENG', reference: 'ENG-2026-002167', date: '2026-05-15', objet: 'Formation gouvernance et management public', montant: 68_000_000, statut: 'Visé CF' },
      { type: 'LIQ', reference: 'LIQ-2026-002589', date: '2026-07-29', objet: 'Formation — session réalisée 300 participants', montant: 65_000_000, statut: 'Visée CF' },
      { type: 'ORD', reference: 'ORD-2026-001756', date: '2026-07-30', objet: 'Formation gouvernance — OP à signer', montant: 60_750_000, statut: 'À signer' },
    ],
  },
}

const TABS = [
  { id: 'identite', label: "Fiche d'identité", icon: Building2 },
  { id: 'bancaire', label: 'Coordonnées bancaires', icon: CreditCard },
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'chaine', label: 'Chaîne de dépense', icon: GitBranch },
  { id: 'historique', label: 'Historique', icon: History },
]

const STATUT_COLOR: Record<StatutDoc, { bg: string; text: string; icon: typeof CheckCircle }> = {
  Conforme:    { bg: '#F0FDF4', text: '#166534', icon: CheckCircle },
  'En attente': { bg: '#FFFBEB', text: '#92400E', icon: Clock },
  Expiré:      { bg: '#FEF2F2', text: '#991B1B', icon: XCircle },
}

const TYPE_COLOR: Record<string, { bg: string; text: string }> = {
  ENG: { bg: '#DBEAFE', text: '#1E40AF' },
  LIQ: { bg: '#D1FAE5', text: '#065F46' },
  ORD: { bg: '#EDE9FE', text: '#5B21B6' },
  PAY: { bg: '#FEF3C7', text: '#92400E' },
}

export default function TiersDetail({ id, onNavigate }: Props) {
  const [activeTab, setActiveTab] = useState('identite')
  const [showBancaireModal, setShowBancaireModal] = useState(false)
  const [showDocModal, setShowDocModal] = useState(false)
  const [editBancaire, setEditBancaire] = useState(false)
  const [editIdentite, setEditIdentite] = useState(false)
  const [identiteEdit, setIdentiteEdit] = useState<Record<string, string>>({})
  const [viewDoc, setViewDoc] = useState<{ nom: string; reference: string; expiry: string } | null>(null)

  const tiers = TIERS_DATA[id] ?? TIERS_DATA['T001']

  const nbDocsExpires = tiers.documents.filter(d => d.statut === 'Expiré').length
  const nbDocsManquants = tiers.documents.filter(d => d.obligatoire && d.statut !== 'Conforme').length

  return (
    <div className="min-h-screen" style={{ background: '#F0F4FA' }}>

      {/* Bandeau navy */}
      <div className="px-6 py-5" style={{ background: '#0B1C3E' }}>
        <div className="max-w-[1200px] mx-auto">
          <button onClick={() => onNavigate('tiers')} className="text-xs text-white/40 hover:text-white mb-3 flex items-center gap-1">
            <ChevronLeft size={12} /> Retour au référentiel Tiers
          </button>

          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap mb-2">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <Building2 size={18} className="text-white/70" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">{tiers.raisonSociale}</h1>
                  <p className="text-xs text-white/40 font-mono">{tiers.reference} · {tiers.type}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ml-1 ${tiers.statut === 'Conforme' ? 'bg-green-500/20 text-green-300' : tiers.statut === 'Expiré' ? 'bg-red-500/20 text-red-300' : 'bg-amber-500/20 text-amber-300'}`}>
                  {tiers.statut}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${tiers.risque === 'Faible' ? 'bg-green-500/20 text-green-300' : tiers.risque === 'Élevé' ? 'bg-red-500/20 text-red-300' : 'bg-amber-500/20 text-amber-300'}`}>
                  Risque {tiers.risque}
                </span>
              </div>
              <p className="text-sm text-white/60">{tiers.formeJuridique} · {tiers.ville}, {tiers.pays}</p>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-4 gap-3 shrink-0">
              {[
                { label: 'Engagé', value: tiers.totalEngage, color: '#93C5FD' },
                { label: 'Liquidé', value: tiers.totalLiquide, color: '#6EE7B7' },
                { label: 'Ordonnancé', value: tiers.totalOrdonnance, color: '#A78BFA' },
                { label: 'Payé', value: tiers.totalPaye, color: '#FCD34D' },
              ].map(k => (
                <div key={k.label} className="text-center p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.07)' }}>
                  <p className="text-[9px] font-bold uppercase tracking-wide" style={{ color: k.color }}>{k.label}</p>
                  <p className="text-[11px] font-mono font-bold text-white mt-0.5">
                    {(k.value / 1_000_000).toFixed(1)} M
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Alertes */}
          {(tiers.alertes.length > 0 || nbDocsExpires > 0) && (
            <div className="mt-3 p-3 rounded-xl bg-orange-500/15 border border-orange-400/20 flex items-start gap-2">
              <AlertTriangle size={13} className="text-orange-300 mt-0.5 flex-shrink-0" />
              <div className="space-y-0.5">
                {tiers.alertes.map((a, i) => <p key={i} className="text-[11px] text-orange-200">{a}</p>)}
                {nbDocsExpires > 0 && (
                  <p className="text-[11px] text-orange-200">{nbDocsExpires} document(s) expiré(s) — opérations pouvant être bloquées</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Onglets */}
      <div className="px-6 bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-[1200px] mx-auto overflow-x-auto">
          <div className="flex gap-0 min-w-max">
            {TABS.map(tab => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex items-center gap-1.5 px-4 py-3 text-[12px] font-semibold border-b-2 transition-colors whitespace-nowrap"
                  style={activeTab === tab.id
                    ? { borderBottomColor: '#0B1C3E', color: '#0B1C3E' }
                    : { borderBottomColor: 'transparent', color: '#94A3B8' }}
                >
                  <Icon size={12} />
                  {tab.label}
                  {tab.id === 'documents' && nbDocsManquants > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-red-100 text-red-600">{nbDocsManquants}</span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div className="px-6 py-5 max-w-[1200px] mx-auto space-y-4">

        {/* IDENTITÉ */}
        {activeTab === 'identite' && (
          <div className="space-y-4">
            <div className="card p-5">
              <div className="flex items-center justify-between mb-5">
                <h3 className="section-title">Informations d'identité</h3>
                {!editIdentite ? (
                  <button className="btn btn-outline btn-sm gap-1" onClick={() => {
                    setIdentiteEdit({
                      raisonSociale: tiers.raisonSociale, type: tiers.type,
                      formeJuridique: tiers.formeJuridique, pays: tiers.pays,
                      adresse: tiers.adresse, telephone: tiers.telephone,
                      email: tiers.email, siteWeb: tiers.siteWeb,
                      registre: tiers.registre, nif: tiers.nif, cnps: tiers.cnps,
                    })
                    setEditIdentite(true)
                  }}>
                    <Edit3 size={12} /> Modifier
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button className="btn btn-outline btn-sm" onClick={() => setEditIdentite(false)}>Annuler</button>
                    <button className="btn btn-primary btn-sm gap-1" onClick={() => setEditIdentite(false)}>
                      <CheckCircle size={12} /> Enregistrer
                    </button>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                {[
                  { icon: Building2, label: 'Raison sociale', key: 'raisonSociale', value: tiers.raisonSociale },
                  { icon: Hash, label: 'Référence système', key: null, value: tiers.reference },
                  { icon: User, label: 'Type', key: 'type', value: tiers.type },
                  { icon: FileText, label: 'Forme juridique', key: 'formeJuridique', value: tiers.formeJuridique },
                  { icon: Globe, label: 'Pays', key: 'pays', value: tiers.pays },
                  { icon: MapPin, label: 'Ville / Adresse', key: 'adresse', value: tiers.adresse },
                  { icon: Phone, label: 'Téléphone', key: 'telephone', value: tiers.telephone },
                  { icon: Mail, label: 'Email', key: 'email', value: tiers.email },
                  { icon: Globe, label: 'Site web', key: 'siteWeb', value: tiers.siteWeb },
                  { icon: Hash, label: 'Registre du commerce (RCCM)', key: 'registre', value: tiers.registre },
                  { icon: Hash, label: 'NIF / Identifiant fiscal', key: 'nif', value: tiers.nif },
                  { icon: Hash, label: 'N° CNPS / IPRES', key: 'cnps', value: tiers.cnps },
                ].map(f => {
                  const Icon = f.icon
                  const displayVal = editIdentite && f.key ? (identiteEdit[f.key] ?? f.value) : f.value
                  return (
                    <div key={f.label}>
                      <div className="flex items-center gap-1 mb-0.5">
                        <Icon size={10} className="text-slate-400" />
                        <p className="text-[10px] text-slate-400 uppercase tracking-wide">{f.label}</p>
                      </div>
                      {editIdentite && f.key ? (
                        <input
                          className="form-input text-[13px] py-1"
                          value={identiteEdit[f.key] ?? f.value}
                          onChange={e => setIdentiteEdit(prev => ({ ...prev, [f.key!]: e.target.value }))}
                        />
                      ) : (
                        <p className="text-[13px] font-medium text-slate-800">{displayVal}</p>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Conformité globale */}
            <div className="card p-5">
              <h3 className="section-title mb-4">Conformité et éligibilité aux opérations</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className={`p-4 rounded-xl ${tiers.statut === 'Conforme' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <p className="text-[10px] font-bold uppercase text-slate-500 mb-1">Statut global</p>
                  <p className={`text-lg font-bold ${tiers.statut === 'Conforme' ? 'text-green-700' : 'text-red-700'}`}>{tiers.statut}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Vérifié le {tiers.dateValidationBancaire}</p>
                </div>
                <div className={`p-4 rounded-xl ${tiers.risque === 'Faible' ? 'bg-green-50 border border-green-200' : tiers.risque === 'Élevé' ? 'bg-red-50 border border-red-200' : 'bg-amber-50 border border-amber-200'}`}>
                  <p className="text-[10px] font-bold uppercase text-slate-500 mb-1">Niveau de risque</p>
                  <p className={`text-lg font-bold ${tiers.risque === 'Faible' ? 'text-green-700' : tiers.risque === 'Élevé' ? 'text-red-700' : 'text-amber-700'}`}>{tiers.risque}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Évaluation automatique</p>
                </div>
                <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                  <p className="text-[10px] font-bold uppercase text-slate-500 mb-1">Dossiers traités</p>
                  <p className="text-lg font-bold text-blue-700">{tiers.engCount + tiers.liqCount + tiers.ordCount + tiers.payCount}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Toute la chaîne de dépense</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* COORDONNÉES BANCAIRES */}
        {activeTab === 'bancaire' && (
          <div className="space-y-4">
            <div className="card p-5">
              <div className="flex items-center justify-between mb-5">
                <h3 className="section-title">Coordonnées bancaires</h3>
                <div className="flex gap-2">
                  <button onClick={() => setEditBancaire(true)} className="btn btn-outline btn-sm gap-1">
                    <Edit3 size={12} /> Modifier
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                      <Banknote size={16} className="text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{tiers.banque}</p>
                      <p className="text-xs text-slate-400">Banque domiciliataire principale</p>
                    </div>
                  </div>
                  <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${tiers.coordsBancairesValidees ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                    {tiers.coordsBancairesValidees ? <><CheckCircle size={11} /> Validées le {tiers.dateValidationBancaire}</> : <><AlertTriangle size={11} /> À revalider</>}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { label: 'Titulaire du compte', value: tiers.titulaire },
                    { label: 'IBAN / Compte bancaire', value: tiers.iban },
                    { label: 'Code SWIFT / BIC', value: tiers.swift },
                    { label: 'Devise', value: tiers.devise },
                    { label: 'Dernière validation', value: tiers.dateValidationBancaire },
                    { label: 'Statut', value: tiers.coordsBancairesValidees ? 'Validé ✓' : 'À revalider' },
                  ].map(f => (
                    <div key={f.label}>
                      <p className="text-[10px] text-slate-400 mb-0.5 uppercase">{f.label}</p>
                      <p className="text-[13px] font-medium font-mono text-slate-800">{f.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Règle de sécurité */}
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                <div className="flex items-start gap-3">
                  <Shield size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-amber-800">Règle de sécurité — Modification des coordonnées bancaires</p>
                    <ul className="text-xs text-amber-700 mt-1.5 space-y-0.5 list-disc list-inside">
                      <li>Toute modification déclenche une nouvelle vérification obligatoire</li>
                      <li>Les opérations en cours restent sur l'ancien compte jusqu'à validation</li>
                      <li>Une attestation bancaire originale doit être fournie</li>
                      <li>La modification est tracée et auditée</li>
                      <li>Validation requise par le Directeur du Budget avant activation</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Historique des modifications bancaires */}
            <div className="card p-5">
              <h3 className="section-title mb-4">Historique des modifications bancaires</h3>
              <div className="space-y-3">
                {[
                  { date: '12/09/2026', acteur: 'Direction du Budget — M. Sylvain OBIANG', action: 'Revalidation annuelle des coordonnées — Attestation BGFI #2026-09-4521 jointe', type: 'validation' },
                  { date: '15/01/2026', acteur: 'Agent DEPIEC — Mme. Claire BONGO', action: 'Enregistrement initial des coordonnées bancaires lors de la création du tiers', type: 'creation' },
                ].map((h, i) => (
                  <div key={i} className="flex gap-3 p-3 rounded-lg border border-slate-100">
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${h.type === 'validation' ? 'bg-green-500' : 'bg-blue-500'}`} />
                    <div>
                      <p className="text-[12px] font-mono text-slate-400">{h.date}</p>
                      <p className="text-[13px] font-medium text-slate-800">{h.action}</p>
                      <p className="text-[11px] text-slate-500">{h.acteur}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* DOCUMENTS */}
        {activeTab === 'documents' && (
          <div className="space-y-4">
            <div className="card p-5">
              <div className="flex items-center justify-between mb-5">
                <h3 className="section-title">Documents de conformité</h3>
                <button onClick={() => setShowDocModal(true)} className="btn btn-primary btn-sm gap-1">
                  <Upload size={12} /> Ajouter un document
                </button>
              </div>

              <div className="space-y-2">
                {tiers.documents.map((d, i) => {
                  const sc = STATUT_COLOR[d.statut]
                  const Icon = sc.icon
                  return (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: sc.bg }}>
                          <Icon size={13} style={{ color: sc.text }} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-[13px] font-medium text-slate-800">{d.nom}</p>
                            {d.obligatoire && <span className="text-[9px] px-1 py-0.5 rounded bg-red-100 text-red-600 font-bold">OBLIGATOIRE</span>}
                          </div>
                          <p className="text-[10px] text-slate-400">{d.reference} · Expiration : {d.expiry}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ background: sc.bg, color: sc.text }}>
                          {d.statut}
                        </span>
                        <button className="btn btn-sm btn-outline gap-1" onClick={() => setViewDoc({ nom: d.nom, reference: d.reference, expiry: d.expiry })}><Eye size={11} /> Voir</button>
                        <button className="btn btn-sm btn-outline gap-1"><Download size={11} /></button>
                      </div>
                    </div>
                  )
                })}
              </div>

              {nbDocsManquants > 0 && (
                <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2">
                  <AlertTriangle size={14} className="text-red-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-red-800">{nbDocsManquants} document(s) obligatoire(s) non conforme(s)</p>
                    <p className="text-xs text-red-600 mt-0.5">Les ordonnancements peuvent être bloqués jusqu'à régularisation</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* CHAÎNE DE DÉPENSE */}
        {activeTab === 'chaine' && (
          <div className="space-y-4">
            {/* Stats globales */}
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'Engagements', count: tiers.engCount, total: tiers.totalEngage, type: 'ENG' },
                { label: 'Liquidations', count: tiers.liqCount, total: tiers.totalLiquide, type: 'LIQ' },
                { label: 'Ordonnancements', count: tiers.ordCount, total: tiers.totalOrdonnance, type: 'ORD' },
                { label: 'Paiements', count: tiers.payCount, total: tiers.totalPaye, type: 'PAY' },
              ].map(s => {
                const tc = TYPE_COLOR[s.type] ?? { bg: '#F1F5F9', text: '#64748B' }
                return (
                  <div key={s.label} className="card p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color: tc.text }}>{s.label}</span>
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold" style={{ background: tc.bg, color: tc.text }}>{s.type}</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-800">{s.count}</p>
                    <p className="text-[11px] font-mono text-slate-500 mt-0.5">{fmt(s.total)}</p>
                  </div>
                )
              })}
            </div>

            {/* Timeline dossiers */}
            <div className="card p-5">
              <h3 className="section-title mb-4">Dossiers de la chaîne de dépense</h3>
              <div className="space-y-2">
                {tiers.chaine.map((c, i) => {
                  const tc = TYPE_COLOR[c.type] ?? { bg: '#F1F5F9', text: '#64748B' }
                  const pageMap: Record<string, Page> = {
                    ENG: 'eng-detail', LIQ: 'liq-detail', ORD: 'ord-detail', PAY: 'pay-detail',
                  }
                  return (
                    <div key={i} className="flex items-center gap-4 p-3 rounded-xl border border-slate-100 hover:bg-blue-50/30 transition-colors">
                      <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold shrink-0" style={{ background: tc.bg, color: tc.text }}>
                        {c.type}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-mono font-bold text-[12px] text-slate-700">{c.reference}</p>
                        <p className="text-[12px] text-slate-600 truncate">{c.objet}</p>
                        <p className="text-[10px] text-slate-400">{c.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono font-bold text-[13px] text-slate-800">{fmt(c.montant)}</p>
                        <p className="text-[10px] text-slate-400">{c.statut}</p>
                      </div>
                      <button
                        onClick={() => onNavigate(pageMap[c.type] as Page, c.reference)}
                        className="btn btn-sm btn-outline gap-1 shrink-0"
                      >
                        <Eye size={11} /> Voir
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Progression cumulative */}
            <div className="card p-5">
              <h3 className="section-title mb-4">Progression cumulative des montants</h3>
              <div className="space-y-3">
                {[
                  { label: 'Total engagé', value: tiers.totalEngage, pct: 100 },
                  { label: 'Total liquidé', value: tiers.totalLiquide, pct: Math.round(tiers.totalLiquide / tiers.totalEngage * 100) },
                  { label: 'Total ordonnancé', value: tiers.totalOrdonnance, pct: Math.round(tiers.totalOrdonnance / tiers.totalEngage * 100) },
                  { label: 'Total payé', value: tiers.totalPaye, pct: Math.round(tiers.totalPaye / tiers.totalEngage * 100) },
                ].map(r => (
                  <div key={r.label} className="flex items-center gap-3">
                    <p className="text-[12px] text-slate-600 w-36 shrink-0">{r.label}</p>
                    <div className="flex-1 bg-slate-100 rounded-full h-2">
                      <div className="h-2 rounded-full bg-blue-500" style={{ width: `${r.pct}%` }} />
                    </div>
                    <p className="text-[11px] text-slate-500 w-10 text-right">{r.pct}%</p>
                    <p className="text-[11px] font-mono font-semibold text-slate-700 w-36 text-right">{fmt(r.value)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* HISTORIQUE */}
        {activeTab === 'historique' && (
          <div className="card p-5">
            <h3 className="section-title mb-5">Journal des événements</h3>
            <div className="space-y-4">
              {[
                { date: '12/09/2026 09:15', acteur: 'Direction du Budget — M. Sylvain OBIANG', action: 'Revalidation des coordonnées bancaires — Attestation BGFI jointe', icon: CheckCircle, color: '#16A34A' },
                { date: '15/08/2026 14:30', acteur: 'Système BUDGET-CEEAC', action: 'Ordonnancement ORD-2026-001823 créé — bénéficiaire sélectionné', icon: GitBranch, color: '#7C3AED' },
                { date: '12/08/2026 11:00', acteur: 'Contrôleur Financier', action: 'Liquidation LIQ-2026-002756 visée — coordonnées bancaires vérifiées', icon: Shield, color: '#2563EB' },
                { date: '15/01/2026 08:30', acteur: 'Agent DEPIEC — Mme. Claire BONGO', action: 'Création du tiers TRS-2024-001 dans le référentiel', icon: Plus, color: '#0B1C3E' },
              ].map((h, i) => {
                const Icon = h.icon
                return (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: h.color + '15' }}>
                        <Icon size={13} style={{ color: h.color }} />
                      </div>
                      {i < 3 && <div className="w-px flex-1 mt-1 bg-slate-200" style={{ minHeight: 20 }} />}
                    </div>
                    <div className="flex-1 pb-2">
                      <p className="text-[11px] font-mono text-slate-400">{h.date}</p>
                      <p className="text-[13px] font-medium text-slate-800">{h.action}</p>
                      <p className="text-[12px] text-slate-500">{h.acteur}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

      </div>

      {/* Modal modification bancaire */}
      {editBancaire && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(11,28,62,0.6)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="px-6 py-4 border-b border-amber-100 bg-amber-50 flex items-center gap-2">
              <AlertTriangle size={16} className="text-amber-600" />
              <h3 className="font-bold text-amber-800">Modification des coordonnées bancaires</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800">
                <p className="font-bold mb-0.5">⚠ Attention — modification sensible</p>
                <p>Toute modification déclenche une validation obligatoire par le Directeur du Budget et une nouvelle vérification des coordonnées avant activation.</p>
              </div>
              {[
                { label: 'Nouvelle banque domiciliataire', placeholder: tiers.banque },
                { label: 'Nouvel IBAN / N° de compte', placeholder: tiers.iban },
                { label: 'Code SWIFT / BIC', placeholder: tiers.swift },
                { label: 'Titulaire du compte', placeholder: tiers.titulaire },
              ].map(f => (
                <div key={f.label}>
                  <label className="form-label">{f.label}</label>
                  <input className="form-input font-mono text-[13px]" placeholder={f.placeholder} />
                </div>
              ))}
              <div>
                <label className="form-label">Motif de la modification *</label>
                <textarea className="form-input resize-none text-[13px]" rows={3} placeholder="Expliquez la raison de la modification des coordonnées bancaires…" />
              </div>
              <div>
                <label className="form-label">Attestation bancaire (document justificatif) *</label>
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center text-slate-400 text-[12px] hover:border-blue-300 cursor-pointer transition-colors">
                  <Upload size={20} className="mx-auto mb-1 opacity-40" />
                  <p>Déposer l'attestation bancaire originale (PDF)</p>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex gap-2 justify-end">
              <button onClick={() => setEditBancaire(false)} className="btn btn-outline">Annuler</button>
              <button onClick={() => setEditBancaire(false)} className="btn btn-sm gap-1.5" style={{ background: '#D97706', color: 'white', border: 'none' }}>
                <RefreshCw size={12} /> Soumettre pour validation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal ajout document */}
      {showDocModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(11,28,62,0.6)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
              <FileText size={16} className="text-blue-600" />
              <h3 className="font-bold text-slate-800">Ajouter un document</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="form-label">Type de document *</label>
                <select className="form-input text-[13px]">
                  <option>Attestation fiscale</option>
                  <option>Attestation CNPS</option>
                  <option>RC RCCM</option>
                  <option>Statuts sociaux</option>
                  <option>Attestation bancaire</option>
                  <option>Autre</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Date d'émission</label>
                  <input type="date" className="form-input text-[13px]" />
                </div>
                <div>
                  <label className="form-label">Date d'expiration</label>
                  <input type="date" className="form-input text-[13px]" />
                </div>
              </div>
              <div>
                <label className="form-label">Fichier (PDF) *</label>
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center text-slate-400 text-[12px] hover:border-blue-300 cursor-pointer transition-colors">
                  <Upload size={24} className="mx-auto mb-2 opacity-40" />
                  <p>Cliquer ou déposer le fichier</p>
                  <p className="text-[10px] mt-0.5">PDF · max 10 Mo</p>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex gap-2 justify-end">
              <button onClick={() => setShowDocModal(false)} className="btn btn-outline">Annuler</button>
              <button onClick={() => setShowDocModal(false)} className="btn btn-primary gap-1">
                <Upload size={12} /> Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: Aperçu document ── */}
      {viewDoc && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h2 className="font-semibold text-slate-800 text-base flex items-center gap-2"><FileText size={15} /> Aperçu du document</h2>
              <button className="text-gray-400 hover:text-gray-600" onClick={() => setViewDoc(null)}><ChevronRight size={18} className="rotate-180" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-[13px]">
                <div>
                  <p className="text-[10px] uppercase text-slate-400 mb-0.5">Document</p>
                  <p className="font-medium text-slate-800">{viewDoc.nom}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-slate-400 mb-0.5">Référence</p>
                  <p className="font-mono text-slate-700">{viewDoc.reference}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-slate-400 mb-0.5">Date d'expiration</p>
                  <p className="font-medium text-slate-800">{viewDoc.expiry}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-slate-400 mb-0.5">Type</p>
                  <p className="text-slate-700">PDF</p>
                </div>
              </div>
              <div className="rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center h-48 bg-slate-50">
                <div className="text-center text-slate-400">
                  <FileText size={36} className="mx-auto mb-2 opacity-40" />
                  <p className="text-[13px]">{viewDoc.nom}</p>
                  <p className="text-[11px] mt-0.5">Aperçu PDF — {viewDoc.reference}</p>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 p-5 border-t border-slate-100">
              <button className="btn btn-outline btn-sm gap-1" onClick={() => setViewDoc(null)}>Fermer</button>
              <button className="btn btn-primary btn-sm gap-1"><Download size={12} /> Télécharger</button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
