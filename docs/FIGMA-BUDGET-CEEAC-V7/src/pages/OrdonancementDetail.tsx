import { useState } from 'react'
import {
  ChevronLeft, Eye, Download, Printer, FileText, CheckCircle, XCircle,
  RotateCcw, Paperclip, Clock, Send, Shield, ShieldCheck, Building2,
  TrendingUp, Target, User, GitBranch, History, MessageSquare,
  AlertTriangle, Lock, RefreshCw, PackageCheck, DollarSign,
  ChevronRight, BadgeCheck, Banknote,
} from 'lucide-react'
import type { Page } from '../types'
import { ORD_LIST } from '../data/mock'
import StatusBadge from '../components/StatusBadge'
import PDFPreviewModal from '../components/PDFPreviewModal'
import OrdonnancementDoc from '../components/pdf/OrdonnancementDoc'

const fmt = (n: number) =>
  new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(n) + ' XAF'

function numberToWords(n: number): string {
  const unites = ['', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf',
    'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf']
  const dizaines = ['', '', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'soixante-dix', 'quatre-vingt', 'quatre-vingt-dix']

  if (n === 0) return 'zéro'

  function convert(num: number): string {
    if (num < 20) return unites[num]
    if (num < 100) {
      const d = Math.floor(num / 10), u = num % 10
      if (d === 7) return 'soixante-' + convert(10 + u)
      if (d === 9) return 'quatre-vingt-' + convert(10 + u)
      return dizaines[d] + (u > 0 ? (d === 8 ? '' : '-') + convert(u) : (d === 8 ? 's' : ''))
    }
    if (num < 1000) {
      const h = Math.floor(num / 100), r = num % 100
      return (h === 1 ? 'cent' : convert(h) + ' cent') + (r > 0 ? ' ' + convert(r) : (h > 1 ? 's' : ''))
    }
    if (num < 1_000_000) {
      const k = Math.floor(num / 1000), r = num % 1000
      return (k === 1 ? 'mille' : convert(k) + ' mille') + (r > 0 ? ' ' + convert(r) : '')
    }
    const m = Math.floor(num / 1_000_000), r = num % 1_000_000
    return convert(m) + ' million' + (m > 1 ? 's' : '') + (r > 0 ? ' ' + convert(r) : '')
  }

  const words = convert(n)
  return words.charAt(0).toUpperCase() + words.slice(1) + ' francs CFA'
}

interface Props {
  id: string
  onNavigate: (page: Page, id?: string) => void
}

const TABS = [
  { id: 'synthese',       label: 'Synthèse',              icon: Eye },
  { id: 'liquidation',    label: 'Liquidation source',    icon: FileText },
  { id: 'budget',         label: 'Budget & Imputations',  icon: TrendingUp },
  { id: 'beneficiaire',   label: 'Bénéficiaire',          icon: User },
  { id: 'factures',       label: 'Factures',              icon: DollarSign },
  { id: 'retenues',       label: 'Retenues',              icon: Banknote },
  { id: 'pap',            label: 'PAP',                   icon: Target },
  { id: 'marche',         label: 'Marché / Contrat',      icon: Building2 },
  { id: 'pieces',         label: 'Pièces justificatives', icon: Paperclip },
  { id: 'controles',      label: 'Contrôles',             icon: Shield },
  { id: 'workflow',       label: 'Workflow',              icon: GitBranch },
  { id: 'historique',     label: 'Historique',            icon: History },
  { id: 'documents',      label: 'Documents générés',     icon: Printer },
  { id: 'transmission',   label: 'Transmission comptable',icon: Send },
]

const WF_STEPS = [
  { label: 'Génération auto',        status: 'done'    as const, acteur: 'Système BUDGET-CEEAC', date: '15/09/2026 10:31', auto: true },
  { label: 'Contrôles préalables',   status: 'done'    as const, acteur: 'Système BUDGET-CEEAC', date: '15/09/2026 10:31', auto: true },
  { label: 'Détermination Ordonnateur', status: 'done' as const, acteur: 'Système BUDGET-CEEAC', date: '15/09/2026 10:32', auto: true },
  { label: 'Signature Ordonnateur',  status: 'current' as const, acteur: 'Ordonnateur compétent' },
  { label: 'Génération PDF / GED',   status: 'pending' as const },
  { label: 'Transmission Agence Comptable', status: 'pending' as const },
  { label: 'Paiement',               status: 'pending' as const },
]

const CONTROLES = [
  { check: 'Liquidation visée par le Contrôleur Financier', ok: true },
  { check: 'Service fait certifié conforme', ok: true },
  { check: 'Engagement valide et non expiré', ok: true },
  { check: 'Bénéficiaire actif dans le référentiel', ok: true },
  { check: 'Coordonnées bancaires disponibles et validées', ok: true },
  { check: 'Facture enregistrée et non dupliquée', ok: true },
  { check: 'Imputation budgétaire valide', ok: true },
  { check: 'Retenues calculées et cohérentes', ok: true },
  { check: 'Exercice budgétaire ouvert', ok: true },
  { check: 'Ordonnateur compétent identifié', ok: true },
  { check: 'Pièces obligatoires présentes', ok: true },
  { check: 'Absence de doublon Ordre de Paiement', ok: true },
]

const PIECES = [
  { nom: 'Fiche de Liquidation LIQ visée', source: 'Hérité LIQ', statut: 'OK', type: 'Liquidation' },
  { nom: 'Facture originale fournisseur', source: 'Hérité LIQ', statut: 'OK', type: 'Facture' },
  { nom: 'Certificat de service fait', source: 'Hérité LIQ', statut: 'OK', type: 'SF' },
  { nom: 'Visa CF sur la Liquidation', source: 'Hérité LIQ', statut: 'OK', type: 'Visa' },
  { nom: 'Engagement visé ENG', source: 'Hérité ENG', statut: 'OK', type: 'Engagement' },
  { nom: 'Contrat / Bon de commande', source: 'Hérité ENG', statut: 'OK', type: 'Contrat' },
  { nom: 'PV de réception provisoire', source: 'Hérité LIQ', statut: 'OK', type: 'PV' },
  { nom: 'Fiche de contrôle CF', source: 'Généré ORD', statut: 'PENDING', type: 'Contrôle' },
  { nom: 'Attestation bancaire BGFI', source: 'Ajouté ORD', statut: 'OK', type: 'Bancaire' },
]

const DOCS_GENERES = [
  { nom: 'Ordre de Paiement OP-2026-001823.pdf', date: '—', statut: 'En attente de signature', taille: '—' },
  { nom: 'Fiche d\'Ordonnancement ORD-2026-001823.pdf', date: '—', statut: 'En attente de signature', taille: '—' },
  { nom: 'Bordereau de transmission AC', date: '—', statut: 'En attente de signature', taille: '—' },
  { nom: 'Fiche de contrôle pré-ordonnancement', date: '15/09/2026 10:32', statut: 'Disponible', taille: '28 Ko' },
]

const HISTORIQUE = [
  { date: '15/09/2026', heure: '10:30', acteur: 'Contrôleur Financier — M. Alain MBONGO', action: 'Liquidation LIQ-2026-002756 visée définitivement', icon: ShieldCheck, color: '#16A34A' },
  { date: '15/09/2026', heure: '10:31', acteur: 'Système BUDGET-CEEAC', action: 'Ordonnancement ORD-2026-001823 créé automatiquement depuis LIQ visée', icon: RefreshCw, color: '#2563EB' },
  { date: '15/09/2026', heure: '10:31', acteur: 'Système BUDGET-CEEAC', action: 'Contrôles préalables effectués — 12/12 conformes', icon: CheckCircle, color: '#16A34A' },
  { date: '15/09/2026', heure: '10:32', acteur: 'Système BUDGET-CEEAC', action: 'Ordonnateur déterminé : M. Jean MBIDA — Secrétaire Général (montant ≤ 5 000 000 XAF)', icon: User, color: '#7C3AED' },
  { date: '15/09/2026', heure: '10:32', acteur: 'Système BUDGET-CEEAC', action: 'Dossier affecté à la file de signature du Secrétaire Général', icon: Send, color: '#2563EB' },
  { date: '15/09/2026', heure: '10:33', acteur: 'Système BUDGET-CEEAC', action: 'Notification envoyée au Secrétaire Général : signature requise', icon: Clock, color: '#D97706' },
]

export default function OrdonancementDetail({ id, onNavigate }: Props) {
  const [activeTab, setActiveTab] = useState('synthese')
  const [showPDF, setShowPDF] = useState(false)
  const [showSignModal, setShowSignModal] = useState(false)
  const [signStep, setSignStep] = useState<'recap' | 'otp' | 'pin' | 'done'>('recap')
  const [showRetourModal, setShowRetourModal] = useState(false)
  const [showRejetModal, setShowRejetModal] = useState(false)
  const [signed, setSigned] = useState(false)
  const [pin, setPin] = useState('')
  const [otp, setOtp] = useState('')
  const [motif, setMotif] = useState('')
  const [commentText, setCommentText] = useState('')
  const [comments, setComments] = useState<string[]>([])
  const [showExportModal, setShowExportModal] = useState(false)
  const [exportFormat, setExportFormat] = useState<'PDF' | 'Excel'>('PDF')
  const [showDocModal, setShowDocModal] = useState(false)
  const [selectedDoc, setSelectedDoc] = useState('')
  const [downloadToast, setDownloadToast] = useState(false)
  const [otpResent, setOtpResent] = useState(false)

  const ord = ORD_LIST.find(o => o.id === id) ?? ORD_LIST[1]
  const isSigne = ord.status === 'SIGNE' || ord.status === 'TRANSMIS_AC' || ord.status === 'TRANSFORME' || signed
  const isASign = ord.status === 'A_SIGNER' && !signed
  const isRetourne = ord.status === 'RETOURNE'
  const isRejete = ord.status === 'REJETE'

  const retenues = [
    { type: 'Retenue fiscale (5 %)', base: ord.montantBrut, taux: 5, montant: Math.round(ord.montantBrut * 0.05) },
    { type: 'Retenue de garantie (1 %)', base: ord.montantBrut, taux: 1, montant: Math.round(ord.montantBrut * 0.01) },
  ]
  const totalRetenues = retenues.reduce((s, r) => s + r.montant, 0)
  const netAPayer = ord.montantBrut - totalRetenues

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Bandeau navy */}
      <div className="px-6 py-5" style={{ background: '#0B1C3E' }}>
        <div className="max-w-[1280px] mx-auto">
          <button onClick={() => onNavigate('ord-list')} className="text-xs text-white/40 hover:text-white mb-3 flex items-center gap-1">
            <ChevronLeft size={12} /> Retour aux ordonnancements
          </button>

          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap mb-2">
                <h1 className="text-xl font-bold text-white font-mono">{ord.reference}</h1>
                <StatusBadge status={ord.status} />
                {ord.isPAP && <span className="badge text-[10px] px-2 py-0.5" style={{ background: '#1D4ED8', color: 'white' }}>PAP</span>}
                {isSigne && <span className="badge text-[10px] px-2 py-0.5" style={{ background: '#16A34A', color: 'white' }}>✓ Signé</span>}
              </div>
              <p className="text-sm text-white/70 mb-3 leading-relaxed">{ord.objet}</p>

              {/* Chaîne de références */}
              <div className="flex items-center gap-2 text-[11px] text-white/40 font-mono flex-wrap">
                <button onClick={() => onNavigate('liq-detail', 'LIQ-001')} className="hover:text-blue-300 transition-colors">{ord.liqReference}</button>
                <ChevronRight size={10} />
                <button onClick={() => onNavigate('eng-detail', 'ENG-001')} className="hover:text-blue-300 transition-colors">{ord.engReference}</button>
                <ChevronRight size={10} />
                <span>{ord.ebReference}</span>
              </div>
            </div>

            {/* Carte financière */}
            <div className="shrink-0 rounded-xl p-4 min-w-[260px] text-right" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}>
              <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">NET À ORDONNANCER</p>
              <p className="text-3xl font-bold text-white font-mono">{fmt(ord.montant)}</p>
              <p className="text-[11px] text-white/30 mt-1 font-mono">{numberToWords(ord.montant)}</p>
              <div className="mt-3 pt-3 border-t border-white/10 grid grid-cols-3 gap-3 text-left">
                {[
                  { label: 'Engagé', value: ord.montantEngage },
                  { label: 'Brut', value: ord.montantBrut },
                  { label: 'Retenues', value: ord.retenues },
                ].map(f => (
                  <div key={f.label}>
                    <p className="text-[9px] text-white/30 uppercase">{f.label}</p>
                    <p className="text-[11px] font-mono text-white/70">{fmt(f.value)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Workflow banner */}
          <div className="mt-4 rounded-xl p-4 grid grid-cols-4 gap-4" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
            {[
              { label: 'Étape actuelle', value: isSigne ? 'Transmission Agence Comptable' : 'Signature Ordre de Paiement' },
              { label: 'Dernière action', value: 'Ordonnancement créé automatiquement' },
              { label: 'Acteur attendu', value: isSigne ? 'Agence Comptable' : ord.ordonnateur },
              { label: 'Prochaine étape', value: isSigne ? 'Création dossier Paiement' : 'Génération PDF officiel + GED' },
            ].map(w => (
              <div key={w.label}>
                <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mb-0.5">{w.label}</p>
                <p className="text-[11px] text-white/80">{w.value}</p>
              </div>
            ))}
          </div>

          {/* Actions principales */}
          <div className="mt-4 flex items-center gap-2 flex-wrap">
            <button onClick={() => setShowPDF(true)} className="btn btn-sm gap-1.5" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none' }}>
              <Printer size={12} /> Voir l'Ordre de Paiement
            </button>
            <button onClick={() => setShowExportModal(true)} className="btn btn-sm gap-1.5" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none' }}>
              <Download size={12} /> Exporter
            </button>
            {isASign && (
              <>
                <button onClick={() => { setShowSignModal(true); setSignStep('recap') }} className="btn btn-sm gap-1.5 ml-auto" style={{ background: '#16A34A', color: 'white', border: 'none' }}>
                  <ShieldCheck size={13} /> Signer l'Ordre de Paiement
                </button>
                <button onClick={() => setShowRetourModal(true)} className="btn btn-sm gap-1.5" style={{ background: '#EA580C', color: 'white', border: 'none' }}>
                  <RotateCcw size={12} /> Retourner
                </button>
                <button onClick={() => setShowRejetModal(true)} className="btn btn-sm gap-1.5" style={{ background: '#DC2626', color: 'white', border: 'none' }}>
                  <XCircle size={12} /> Rejeter
                </button>
              </>
            )}
            {isSigne && (
              <span className="ml-auto flex items-center gap-1.5 text-[12px] text-emerald-300">
                <BadgeCheck size={14} /> OP signé · Transmis à l'Agence Comptable
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Alerte retour / rejet */}
      {(isRetourne || isRejete) && (
        <div className={`px-6 py-3 ${isRetourne ? 'bg-orange-50 border-b border-orange-200' : 'bg-red-50 border-b border-red-200'}`}>
          <div className="max-w-[1280px] mx-auto flex items-start gap-3">
            <AlertTriangle size={16} className={isRetourne ? 'text-orange-600 mt-0.5' : 'text-red-600 mt-0.5'} />
            <div>
              <p className={`text-sm font-bold ${isRetourne ? 'text-orange-800' : 'text-red-800'}`}>
                {isRetourne ? 'Dossier retourné par l\'Ordonnateur' : 'Dossier rejeté par l\'Ordonnateur'}
              </p>
              <p className={`text-xs mt-0.5 ${isRetourne ? 'text-orange-700' : 'text-red-700'}`}>
                {ord.motifRetour ?? ord.motifRejet ?? 'Motif non renseigné'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Ordonnateur déterminé automatiquement */}
      <div className="px-6 py-3 bg-blue-50 border-b border-blue-100">
        <div className="max-w-[1280px] mx-auto flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: '#1D4ED8' }}>
            <User size={14} className="text-white" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold text-blue-900">Ordonnateur déterminé automatiquement</p>
            <p className="text-xs text-blue-700">{ord.ordonnateur} · Fondement : {ord.ordonnateurRole === 'SG' ? 'Délégation — montant ≤ 5 000 000 XAF' : 'Ordonnateur principal — montant > 5 000 000 XAF'}</p>
          </div>
          <span className="px-2 py-1 rounded text-[11px] font-bold" style={{ background: ord.ordonnateurRole === 'SG' ? '#DBEAFE' : '#FEF3C7', color: ord.ordonnateurRole === 'SG' ? '#1D4ED8' : '#92400E' }}>
            {ord.ordonnateurRole === 'SG' ? 'SG — Ordonnateur délégué' : 'Président — Ordonnateur principal'}
          </span>
        </div>
      </div>

      {/* Onglets */}
      <div className="px-6 bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-[1280px] mx-auto overflow-x-auto">
          <div className="flex gap-0 min-w-max">
            {TABS.map(tab => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-3 text-[11px] font-semibold border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id ? 'border-navy-900 text-navy-900' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                  style={activeTab === tab.id ? { borderBottomColor: '#0B1C3E', color: '#0B1C3E' } : {}}
                >
                  <Icon size={11} />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Contenu onglets */}
      <div className="px-6 py-5 max-w-[1280px] mx-auto space-y-4">

        {/* SYNTHÈSE */}
        {activeTab === 'synthese' && (
          <div className="space-y-4">
            {/* Carte décision ordonnateur */}
            <div className="card p-5 border-l-4" style={{ borderLeftColor: '#0B1C3E' }}>
              <h3 className="section-title mb-4">Vue décisionnelle — Ordonnateur</h3>
              <div className="grid grid-cols-3 gap-5">
                <div>
                  <p className="text-xs text-slate-400 mb-1 font-semibold uppercase">Dossier</p>
                  <p className="font-mono font-bold text-slate-800 text-sm">{ord.reference}</p>
                  <p className="text-xs text-slate-600 mt-1">{ord.objet}</p>
                  <p className="text-xs text-slate-400">{ord.structure}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1 font-semibold uppercase">Bénéficiaire</p>
                  <p className="font-semibold text-slate-800 text-sm">{ord.tiers}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{ord.banque}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${ord.coordsBancairesStatut === 'OK' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                      {ord.coordsBancairesStatut === 'OK' ? '✓ Coordonnées validées' : '⚠ À revalider'}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1 font-semibold uppercase">Situation financière</p>
                  {[
                    { label: 'Engagé', value: ord.montantEngage, color: 'text-slate-700' },
                    { label: 'Liquidé brut', value: ord.montantBrut, color: 'text-slate-700' },
                    { label: 'Retenues', value: ord.retenues, color: 'text-red-600' },
                    { label: 'NET À ORDONNANCER', value: ord.montant, color: 'text-navy-900 font-bold text-base' },
                  ].map(r => (
                    <div key={r.label} className="flex justify-between py-1 border-b border-slate-50 last:border-0">
                      <span className="text-xs text-slate-500">{r.label}</span>
                      <span className={`font-mono text-xs ${r.color}`}>{fmt(r.value)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Montant en lettres */}
              <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <p className="text-[10px] text-slate-400 mb-0.5 uppercase tracking-widest">Montant en lettres</p>
                <p className="text-sm font-semibold text-slate-800 italic">{numberToWords(ord.montant)}</p>
              </div>
            </div>

            {/* Contrôles rapides */}
            <div className="card p-5">
              <h3 className="section-title mb-4">Contrôles avant signature</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {CONTROLES.map((c, i) => (
                  <div key={i} className={`flex items-center gap-2 p-2.5 rounded-lg text-[12px] ${c.ok ? 'bg-green-50' : 'bg-red-50'}`}>
                    {c.ok
                      ? <CheckCircle size={13} className="text-green-600 flex-shrink-0" />
                      : <XCircle size={13} className="text-red-500 flex-shrink-0" />}
                    <span className={c.ok ? 'text-green-800' : 'text-red-700'}>{c.check}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 p-3 rounded-lg bg-green-50 border border-green-200 flex items-center gap-2">
                <CheckCircle size={14} className="text-green-600" />
                <p className="text-sm font-semibold text-green-800">12 / 12 contrôles conformes — Signature autorisée</p>
              </div>
            </div>

            {/* Progression budgétaire */}
            <div className="card p-5">
              <h3 className="section-title mb-4">Progression de l'exécution</h3>
              <div className="space-y-2">
                {[
                  { label: 'Montant engagé', value: ord.montantEngage, pct: 100, color: '#CBD5E1' },
                  { label: 'Montant liquidé brut', value: ord.montantBrut, pct: Math.round(ord.montantBrut / ord.montantEngage * 100), color: '#93C5FD' },
                  { label: 'Retenues', value: ord.retenues, pct: Math.round(ord.retenues / ord.montantEngage * 100), color: '#FCA5A5' },
                  { label: 'Net à ordonnancer', value: ord.montant, pct: Math.round(ord.montant / ord.montantEngage * 100), color: '#34D399' },
                ].map(r => (
                  <div key={r.label} className="flex items-center gap-3">
                    <p className="text-[12px] text-slate-600 w-48 flex-shrink-0">{r.label}</p>
                    <div className="flex-1 bg-slate-100 rounded-full h-2">
                      <div className="h-2 rounded-full" style={{ width: `${r.pct}%`, background: r.color }} />
                    </div>
                    <p className="text-[11px] font-mono text-slate-500 w-12 text-right">{r.pct} %</p>
                    <p className="text-[11px] font-mono font-semibold text-slate-700 w-36 text-right">{fmt(r.value)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* LIQUIDATION SOURCE */}
        {activeTab === 'liquidation' && (
          <div className="space-y-4">
            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="section-title">Liquidation source</h3>
                <button onClick={() => onNavigate('liq-detail', 'LIQ-001')} className="btn btn-sm btn-outline gap-1">
                  <Eye size={12} /> Ouvrir LIQ
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Référence LIQ', value: ord.liqReference },
                  { label: 'Référence ENG', value: ord.engReference },
                  { label: 'Référence EB', value: ord.ebReference },
                  { label: 'Structure', value: ord.structure },
                  { label: 'Bénéficiaire', value: ord.tiers },
                  { label: 'Objet', value: ord.objet },
                  { label: 'Statut LIQ', value: 'Visée CF ✓' },
                  { label: 'Date visa CF', value: '15/09/2026' },
                ].map(f => (
                  <div key={f.label}>
                    <p className="text-[10px] text-slate-400 mb-0.5 uppercase">{f.label}</p>
                    <p className="text-[13px] font-medium text-slate-800">{f.value}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="card p-5">
              <h3 className="section-title mb-4">Montants hérités de la Liquidation</h3>
              <div className="max-w-md space-y-2">
                {[
                  { label: 'Montant engagé', value: ord.montantEngage },
                  { label: 'Montant liquidé brut', value: ord.montantBrut },
                  { label: 'Retenues totales', value: ord.retenues, neg: true },
                  { label: 'Net à ordonnancer', value: ord.montant, bold: true },
                ].map((r, i) => (
                  <div key={i} className="flex justify-between py-2 border-b border-slate-100 last:border-0">
                    <span className={`text-[13px] ${r.bold ? 'font-bold text-slate-900' : 'text-slate-600'}`}>{r.label}</span>
                    <span className={`font-mono text-[13px] ${r.bold ? 'font-bold text-slate-900' : r.neg ? 'text-red-600' : 'text-slate-700'}`}>
                      {r.neg ? '− ' : ''}{fmt(r.value)}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-slate-400 mt-3 flex items-center gap-1"><Lock size={10} /> Données verrouillées — issues de la Liquidation visée</p>
            </div>
          </div>
        )}

        {/* BUDGET & IMPUTATIONS */}
        {activeTab === 'budget' && (
          <div className="space-y-4">
            <div className="card p-5">
              <h3 className="section-title mb-4">Imputations budgétaires</h3>
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="border-b border-slate-100">
                    {['Code ligne', 'Libellé', 'Montant liquidé', 'Montant ordonnancé'].map(h => (
                      <th key={h} className="text-left pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(ord.lignesBudgetaires ?? []).map((lb, i) => (
                    <tr key={i} className="border-b border-slate-50">
                      <td className="py-3 font-mono text-slate-600">{lb.code}</td>
                      <td className="py-3 text-slate-700">{lb.libelle}</td>
                      <td className="py-3 font-mono text-right">{fmt(lb.montant)}</td>
                      <td className="py-3 font-mono font-bold text-right" style={{ color: '#0B1C3E' }}>{fmt(lb.montant)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-[11px] text-slate-400 mt-3 flex items-center gap-1"><Lock size={10} /> Imputations reprises de la Liquidation — non modifiables</p>
            </div>
          </div>
        )}

        {/* BÉNÉFICIAIRE */}
        {activeTab === 'beneficiaire' && (
          <div className="space-y-4">
            <div className="card p-5">
              <h3 className="section-title mb-4">Fiche bénéficiaire</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                {[
                  { label: 'Raison sociale', value: ord.tiers },
                  { label: 'Type', value: 'Personne morale — Entreprise' },
                  { label: 'NIF / Identifiant fiscal', value: '2026-GAB-004423' },
                  { label: 'Statut référentiel', value: 'Actif ✓' },
                  { label: 'Banque domiciliataire', value: ord.banque },
                  { label: 'Numéro de compte', value: ord.compte },
                ].map(f => (
                  <div key={f.label}>
                    <p className="text-[10px] text-slate-400 mb-0.5 uppercase">{f.label}</p>
                    <p className="text-[13px] font-medium text-slate-800">{f.value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 rounded-xl flex items-center gap-3" style={{
                background: ord.coordsBancairesStatut === 'OK' ? '#F0FDF4' : '#FFF7ED',
                border: ord.coordsBancairesStatut === 'OK' ? '1.5px solid #86EFAC' : '1.5px solid #FCD34D',
              }}>
                {ord.coordsBancairesStatut === 'OK'
                  ? <CheckCircle size={15} className="text-green-600" />
                  : <AlertTriangle size={15} className="text-orange-500" />}
                <div>
                  <p className={`text-sm font-bold ${ord.coordsBancairesStatut === 'OK' ? 'text-green-800' : 'text-orange-800'}`}>
                    {ord.coordsBancairesStatut === 'OK' ? 'Coordonnées bancaires vérifiées et validées' : 'Coordonnées bancaires à revalider'}
                  </p>
                  <p className={`text-xs ${ord.coordsBancairesStatut === 'OK' ? 'text-green-600' : 'text-orange-600'}`}>
                    {ord.coordsBancairesStatut === 'OK' ? `Dernière validation : 12/09/2026 · ${ord.banque}` : 'Attestation bancaire requise avant transmission à l\'Agence Comptable'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FACTURES */}
        {activeTab === 'factures' && (
          <div className="card p-5">
            <h3 className="section-title mb-4">Facture(s) associée(s)</h3>
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-bold text-slate-800">Facture FACT-2026-08-0234</p>
                  <p className="text-xs text-slate-400 mt-0.5">{ord.tiers} · Émise le 01/08/2026</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="badge text-[10px] bg-green-100 text-green-700">✓ Vérifiée — Non dupliquée</span>
                  <button onClick={() => { setSelectedDoc('Facture FACT-2026-08-0234'); setShowDocModal(true) }} className="btn btn-sm btn-outline gap-1"><Eye size={11} /> Voir</button>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div><p className="text-xs text-slate-400 mb-0.5">Montant HT</p><p className="font-mono font-medium">{fmt(ord.montantBrut)}</p></div>
                <div><p className="text-xs text-slate-400 mb-0.5">TVA</p><p className="text-slate-400">Exonéré CEEAC</p></div>
                <div><p className="text-xs text-slate-400 mb-0.5">Montant TTC</p><p className="font-mono font-medium">{fmt(ord.montantBrut)}</p></div>
                <div><p className="text-xs text-slate-400 mb-0.5">Échéance</p><p>30 jours</p></div>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-3 flex items-center gap-1"><Lock size={10} /> Facture héritée de la Liquidation — non modifiable à ce stade</p>
          </div>
        )}

        {/* RETENUES */}
        {activeTab === 'retenues' && (
          <div className="space-y-4">
            <div className="card p-5">
              <h3 className="section-title mb-4">Tableau des retenues</h3>
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="border-b border-slate-100">
                    {['Type de retenue', 'Base de calcul', 'Taux', 'Montant'].map(h => (
                      <th key={h} className="text-left pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {retenues.map((r, i) => (
                    <tr key={i} className="border-b border-slate-50">
                      <td className="py-3 text-slate-700">{r.type}</td>
                      <td className="py-3 font-mono text-slate-600">{fmt(r.base)}</td>
                      <td className="py-3 text-slate-600">{r.taux} %</td>
                      <td className="py-3 font-mono font-semibold text-red-600">− {fmt(r.montant)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-3 pt-3 border-t-2 border-slate-800 flex justify-between">
                <span className="font-bold text-slate-800">Total retenues</span>
                <span className="font-mono font-bold text-red-600">− {fmt(totalRetenues)}</span>
              </div>
              <div className="mt-2 flex justify-between">
                <span className="font-bold text-lg" style={{ color: '#0B1C3E' }}>NET À PAYER</span>
                <span className="font-mono font-bold text-xl" style={{ color: '#0B1C3E' }}>{fmt(netAPayer)}</span>
              </div>
            </div>
          </div>
        )}

        {/* PAP */}
        {activeTab === 'pap' && (
          <div className="card p-5">
            <h3 className="section-title mb-4">Plan d'Action Prioritaire</h3>
            {ord.isPAP ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { label: 'Pilier', value: 'Pilier 1 — Gouvernance et Intégration' },
                    { label: 'Axe', value: 'Axe 2 — Renforcement institutionnel' },
                    { label: 'Objectif', value: 'OBJ-2026-012' },
                    { label: 'Activité', value: 'Formation des cadres budgétaires' },
                    { label: 'Avancement physique', value: '100 %' },
                    { label: 'Taux d\'exécution fin.', value: `${Math.round(ord.montant / ord.montantEngage * 100)} %` },
                  ].map(f => (
                    <div key={f.label}>
                      <p className="text-[10px] text-slate-400 mb-0.5 uppercase">{f.label}</p>
                      <p className="text-[13px] font-medium text-slate-800">{f.value}</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  {[
                    { label: 'Engagé', value: ord.montantEngage, pct: 100 },
                    { label: 'Liquidé', value: ord.montantBrut, pct: Math.round(ord.montantBrut / ord.montantEngage * 100) },
                    { label: 'Ordonnancé', value: ord.montant, pct: Math.round(ord.montant / ord.montantEngage * 100) },
                  ].map(s => (
                    <div key={s.label} className="flex items-center gap-3">
                      <p className="text-[12px] text-slate-500 w-28">{s.label}</p>
                      <div className="flex-1 bg-slate-100 rounded-full h-1.5">
                        <div className="h-1.5 rounded-full bg-blue-500" style={{ width: `${s.pct}%` }} />
                      </div>
                      <p className="text-[11px] font-mono text-slate-500 w-10 text-right">{s.pct}%</p>
                      <p className="text-[11px] font-mono text-slate-700 w-32 text-right">{fmt(s.value)}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-400 italic">Ce dossier n'est pas classifié PAP.</p>
            )}
          </div>
        )}

        {/* MARCHÉ / CONTRAT */}
        {activeTab === 'marche' && (
          <div className="card p-5">
            <h3 className="section-title mb-4">Marché / Contrat</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              {[
                { label: 'Référence marché', value: 'MAR-2026-003891' },
                { label: 'Titulaire', value: ord.tiers },
                { label: 'Montant marché', value: fmt(ord.montantEngage * 1.05) },
                { label: 'Déjà liquidé', value: fmt(ord.montantBrut) },
                { label: 'Déjà ordonnancé', value: fmt(ord.montant) },
                { label: 'Solde marché', value: fmt(ord.montantEngage * 1.05 - ord.montantBrut) },
                { label: 'Échéance', value: '31/12/2026' },
                { label: 'Statut contrat', value: 'Valide ✓' },
              ].map(f => (
                <div key={f.label}>
                  <p className="text-[10px] text-slate-400 mb-0.5 uppercase">{f.label}</p>
                  <p className="text-[13px] font-medium text-slate-800">{f.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PIÈCES JUSTIFICATIVES */}
        {activeTab === 'pieces' && (
          <div className="card p-5">
            <h3 className="section-title mb-4">Pièces justificatives</h3>
            <div className="space-y-2">
              {PIECES.map((p, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <FileText size={14} className="text-slate-400" />
                    <div>
                      <p className="text-[13px] font-medium text-slate-700">{p.nom}</p>
                      <p className="text-[10px] text-slate-400">{p.source} · {p.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`badge text-[10px] ${p.statut === 'OK' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-600'}`}>
                      {p.statut === 'OK' ? '✓ Présente' : '⏳ En attente'}
                    </span>
                    {p.statut === 'OK' && <button onClick={() => { setSelectedDoc(p.nom); setShowDocModal(true) }} className="btn btn-sm btn-outline gap-1"><Eye size={11} /> Voir</button>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CONTRÔLES */}
        {activeTab === 'controles' && (
          <div className="space-y-4">
            <div className="card p-5">
              <h3 className="section-title mb-4">Contrôles automatiques avant ordonnancement</h3>
              <div className="space-y-2">
                {CONTROLES.map((c, i) => (
                  <div key={i} className={`flex items-center gap-3 p-3 rounded-lg ${c.ok ? 'bg-green-50 border border-green-100' : 'bg-red-50 border border-red-100'}`}>
                    {c.ok ? <CheckCircle size={14} className="text-green-600 flex-shrink-0" /> : <XCircle size={14} className="text-red-500 flex-shrink-0" />}
                    <span className={`text-[13px] ${c.ok ? 'text-green-800' : 'text-red-700'}`}>{c.check}</span>
                    <span className={`ml-auto text-[11px] font-bold ${c.ok ? 'text-green-600' : 'text-red-600'}`}>{c.ok ? 'Conforme' : 'Anomalie'}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 rounded-xl bg-green-50 border border-green-200 flex items-center gap-2">
                <CheckCircle size={16} className="text-green-600" />
                <div>
                  <p className="text-sm font-bold text-green-800">12 / 12 contrôles conformes</p>
                  <p className="text-xs text-green-600">Signature autorisée · Contrôles effectués automatiquement le 15/09/2026 à 10:31</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* WORKFLOW */}
        {activeTab === 'workflow' && (
          <div className="card p-5">
            <h3 className="section-title mb-5">Progression du workflow</h3>
            <div className="relative">
              {WF_STEPS.map((step, i) => (
                <div key={i} className="flex gap-4 mb-6 last:mb-0">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      step.status === 'done' ? 'bg-green-500' :
                      step.status === 'current' ? 'border-2 border-navy-900 bg-white' : 'bg-slate-200'
                    }`} style={step.status === 'current' ? { borderColor: '#0B1C3E' } : {}}>
                      {step.status === 'done'
                        ? <CheckCircle size={14} className="text-white" />
                        : step.status === 'current'
                        ? <div className="w-3 h-3 rounded-full" style={{ background: '#0B1C3E' }} />
                        : <Clock size={12} className="text-slate-400" />}
                    </div>
                    {i < WF_STEPS.length - 1 && <div className={`w-0.5 flex-1 mt-1 ${step.status === 'done' ? 'bg-green-300' : 'bg-slate-200'}`} style={{ minHeight: 24 }} />}
                  </div>
                  <div className="flex-1 pb-2">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className={`text-[13px] font-semibold ${step.status === 'done' ? 'text-slate-700' : step.status === 'current' ? 'text-slate-900' : 'text-slate-400'}`}>
                        {step.label}
                      </p>
                      {step.auto && <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 font-bold">AUTO</span>}
                      {step.status === 'current' && <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 font-bold">EN COURS</span>}
                    </div>
                    {step.acteur && <p className="text-[12px] text-slate-500">{step.acteur}</p>}
                    {step.date && <p className="text-[11px] text-slate-400 font-mono">{step.date}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* HISTORIQUE */}
        {activeTab === 'historique' && (
          <div className="card p-5">
            <h3 className="section-title mb-5">Timeline complète</h3>
            <div className="space-y-4">
              {HISTORIQUE.map((h, i) => {
                const Icon = h.icon
                return (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: h.color + '20' }}>
                        <Icon size={13} style={{ color: h.color }} />
                      </div>
                      {i < HISTORIQUE.length - 1 && <div className="w-px flex-1 mt-1 bg-slate-200" style={{ minHeight: 20 }} />}
                    </div>
                    <div className="flex-1 pb-2">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-[12px] font-mono text-slate-400">{h.date} à {h.heure}</p>
                      </div>
                      <p className="text-[13px] font-medium text-slate-800">{h.action}</p>
                      <p className="text-[12px] text-slate-500">{h.acteur}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Commentaires */}
            <div className="mt-6 pt-5 border-t border-slate-100">
              <h4 className="font-semibold text-slate-700 mb-3 text-sm">Commentaires</h4>
              {comments.length > 0 && (
                <div className="space-y-2 mb-4">
                  {comments.map((c, i) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <p className="text-[11px] text-slate-400 mb-0.5">Vous · maintenant</p>
                      <p className="text-[13px] text-slate-700">{c}</p>
                    </div>
                  ))}
                </div>
              )}
              <textarea
                className="form-input resize-none text-[13px]"
                rows={3}
                placeholder="Commentaire sur ce dossier…"
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
              />
              <div className="flex justify-end mt-2">
                <button
                  disabled={!commentText.trim()}
                  onClick={() => { setComments(prev => [...prev, commentText]); setCommentText('') }}
                  className="btn btn-outline btn-sm gap-1 disabled:opacity-40"
                >
                  <MessageSquare size={12} /> Publier
                </button>
              </div>
            </div>
          </div>
        )}

        {/* DOCUMENTS GÉNÉRÉS */}
        {activeTab === 'documents' && (
          <div className="space-y-4">
            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="section-title">Documents officiels</h3>
                <button onClick={() => setShowPDF(true)} className="btn btn-primary btn-sm gap-1.5"><Printer size={12} /> Générer PDF</button>
              </div>
              <div className="space-y-2">
                {DOCS_GENERES.map((d, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <FileText size={14} className="text-slate-400" />
                      <div>
                        <p className="text-[13px] font-medium text-slate-700">{d.nom}</p>
                        <p className="text-[10px] text-slate-400">{d.date !== '—' ? d.date : 'Non généré'} · {d.taille !== '—' ? d.taille : '—'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`badge text-[10px] ${d.statut === 'Disponible' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>{d.statut}</span>
                      {d.statut === 'Disponible' && (
                        <><button onClick={() => { setSelectedDoc(d.nom); setShowDocModal(true) }} className="btn btn-sm btn-outline gap-1"><Eye size={11} /> Voir</button>
                        <button onClick={() => { setDownloadToast(true); setTimeout(() => setDownloadToast(false), 3000) }} className="btn btn-sm btn-outline gap-1"><Download size={11} /></button></>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TRANSMISSION COMPTABLE */}
        {activeTab === 'transmission' && (
          <div className="space-y-4">
            <div className="card p-5">
              <h3 className="section-title mb-4">Transmission à l'Agence Comptable</h3>
              {isSigne ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-violet-50 border border-violet-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center">
                        <Send size={13} className="text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-violet-900">Transmis automatiquement à l'Agence Comptable</p>
                        <p className="text-xs text-violet-600">Transmission automatique après signature — aucune action manuelle requise</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { label: 'Date d\'envoi', value: ord.dateSIgnature ?? '—' },
                        { label: 'Heure', value: '14:22' },
                        { label: 'Destinataire', value: 'Agence Comptable' },
                        { label: 'Statut', value: 'Réceptionné ✓' },
                      ].map(f => (
                        <div key={f.label}>
                          <p className="text-[10px] text-violet-500 mb-0.5 uppercase">{f.label}</p>
                          <p className="text-[13px] font-medium text-violet-900">{f.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-green-50 border border-green-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <PackageCheck size={16} className="text-green-600" />
                      <div>
                        <p className="font-bold text-green-800">Dossier Paiement créé automatiquement</p>
                        <p className="text-xs text-green-600">Référence : PAY-2026-001823 · Pris en charge par l'Agence Comptable</p>
                      </div>
                    </div>
                    <button onClick={() => onNavigate('pay-detail', 'PAY-001')} className="btn btn-sm btn-outline gap-1 text-green-700 border-green-300">
                      <Eye size={11} /> Voir le Paiement
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-slate-400">
                  <Clock size={32} className="mx-auto mb-3 opacity-30" />
                  <p className="text-sm font-medium">En attente de signature de l'Ordre de Paiement</p>
                  <p className="text-xs mt-1">La transmission s'effectuera automatiquement après signature par {ord.ordonnateur}</p>
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* PDF Preview */}
      {showPDF && (
        <PDFPreviewModal
          title="Ordre de Paiement"
          reference={ord.opReference}
          docCode="RPT-ORD-001"
          onClose={() => setShowPDF(false)}
        >
          <OrdonnancementDoc item={ord} />
        </PDFPreviewModal>
      )}

      {/* MODAL SIGNATURE — 3 étapes */}
      {showSignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(11,28,62,0.65)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            {/* Header avec indicateur d'étapes */}
            <div className="px-6 py-4 flex items-center gap-3 rounded-t-2xl" style={{ background: '#0B1C3E' }}>
              <ShieldCheck size={16} className="text-white" />
              <div className="flex-1">
                <p className="font-bold text-white text-sm">Signature électronique — Ordre de Paiement</p>
                <p className="text-[10px] text-white/50">
                  {signStep === 'recap' ? 'Étape 1/3 — Récapitulatif et déclaration' :
                   signStep === 'otp' ? 'Étape 2/3 — Vérification OTP' :
                   signStep === 'pin' ? 'Étape 3/3 — Code PIN de signature' : 'Signature effectuée'}
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                {(['recap', 'otp', 'pin'] as const).map((s, i) => {
                  const steps = ['recap', 'otp', 'pin'] as const
                  const currentIdx = steps.indexOf(signStep as 'recap' | 'otp' | 'pin')
                  return <div key={s} className={`h-1.5 rounded-full transition-all ${signStep === s ? 'w-8 bg-white' : i < currentIdx ? 'w-4 bg-white/50' : 'w-4 bg-white/20'}`} />
                })}
              </div>
            </div>

            <div className="p-6">
              {/* ÉTAPE 1 — RÉCAPITULATIF */}
              {signStep === 'recap' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-[13px]">
                    {[
                      { label: 'Référence OP', value: ord.opReference },
                      { label: 'Bénéficiaire', value: ord.tiers },
                      { label: 'Banque', value: `${ord.banque} · ${ord.compte}` },
                      { label: 'Objet', value: ord.objet },
                      { label: 'Net à payer', value: fmt(ord.montant) },
                      { label: 'En lettres', value: numberToWords(ord.montant) },
                      { label: 'Ordonnateur', value: ord.ordonnateur },
                      { label: 'Fondement', value: ord.ordonnateurRole === 'SG' ? 'Délégation — montant ≤ 5 000 000 XAF' : 'Ordonnateur principal — montant > 5 000 000 XAF' },
                    ].map(f => (
                      <div key={f.label} className="flex justify-between gap-3 py-1 border-b border-slate-100 last:border-0">
                        <span className="text-slate-400 shrink-0">{f.label}</span>
                        <span className="font-semibold text-slate-800 text-right">{f.value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-xs text-green-800">
                    <p className="font-bold mb-0.5">Déclaration de l'Ordonnateur</p>
                    <p className="italic">"Je confirme l'ordonnancement de cette dépense. J'autorise sa transmission automatique à l'Agence Comptable pour exécution du paiement. Je certifie que les contrôles préalables ont été effectués et que la dépense est régulière."</p>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => { setShowSignModal(false) }} className="btn btn-outline btn-sm">Annuler</button>
                    <button onClick={() => setSignStep('otp')} className="btn btn-primary btn-sm gap-1.5" style={{ background: '#0B1C3E', border: 'none' }}>
                      Continuer → OTP
                    </button>
                  </div>
                </div>
              )}

              {/* ÉTAPE 2 — OTP */}
              {signStep === 'otp' && (
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold text-slate-800 mb-1">Vérification par code OTP</p>
                    <p className="text-[12px] text-slate-500">Un code de confirmation à usage unique a été envoyé à l'Ordonnateur pour valider cette signature.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-800">
                      <p className="font-bold flex items-center gap-1 mb-1"><span>📱</span> SMS envoyé</p>
                      <p>+241 ** ** ** 34</p>
                      <p className="text-blue-500 mt-0.5">Valide 10 min</p>
                    </div>
                    <div className="p-3 rounded-xl bg-violet-50 border border-violet-200 text-xs text-violet-800">
                      <p className="font-bold flex items-center gap-1 mb-1"><span>📧</span> Email envoyé</p>
                      <p>j.mb***@ceeac.int</p>
                      <p className="text-violet-500 mt-0.5">Email institutionnel</p>
                    </div>
                  </div>
                  <div>
                    <label className="form-label">Code OTP reçu (6 chiffres) *</label>
                    <input
                      className="form-input font-mono text-center text-2xl tracking-[0.5em]"
                      placeholder="• • • • • •"
                      maxLength={6}
                      value={otp}
                      onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                    />
                    <div className="flex justify-between mt-1">
                      <p className="text-[10px] text-slate-400">Saisir le code reçu sur le canal de l'Ordonnateur</p>
                      {otpResent
                        ? <span className="text-[10px] text-green-600 font-semibold">Code renvoyé à votre email ✓</span>
                        : <button onClick={() => setOtpResent(true)} className="text-[10px] text-blue-600 hover:underline">Renvoyer le code</button>
                      }
                    </div>
                  </div>
                  <div className="flex gap-2 justify-between">
                    <button onClick={() => setSignStep('recap')} className="btn btn-outline btn-sm">← Retour</button>
                    <button disabled={otp.length < 6} onClick={() => setSignStep('pin')} className="btn btn-primary btn-sm gap-1.5 disabled:opacity-40" style={{ background: '#0B1C3E', border: 'none' }}>
                      Vérifier → PIN
                    </button>
                  </div>
                </div>
              )}

              {/* ÉTAPE 3 — PIN */}
              {signStep === 'pin' && (
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold text-slate-800 mb-1">Code PIN de signature</p>
                    <p className="text-[12px] text-slate-500">Saisissez votre code PIN confidentiel à 6 chiffres pour apposer votre signature électronique sur cet Ordre de Paiement.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-green-50 border border-green-200 flex items-center gap-2 text-xs text-green-700">
                    <CheckCircle size={12} /> Code OTP vérifié avec succès
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[12px]">
                    <div className="flex justify-between mb-1">
                      <span className="text-slate-400">Ordonnateur</span>
                      <span className="font-bold text-slate-800">{ord.ordonnateur.split('—')[0].trim()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Montant signé</span>
                      <span className="font-mono font-bold text-slate-800">{fmt(ord.montant)}</span>
                    </div>
                  </div>
                  <div>
                    <label className="form-label">Code PIN de signature *</label>
                    <input
                      type="password"
                      className="form-input font-mono tracking-[0.5em] text-center text-2xl"
                      placeholder="• • • • • •"
                      maxLength={6}
                      value={pin}
                      onChange={e => setPin(e.target.value.replace(/\D/g, ''))}
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                      Code PIN à 6 chiffres — confidentiel — configuré dans Administration › Sécurité &amp; PIN
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
                    <Lock size={11} /> 3 tentatives incorrectes bloqueront le PIN et nécessiteront une réinitialisation par l'administrateur
                  </div>
                  <div className="flex gap-2 justify-between">
                    <button onClick={() => { setSignStep('otp'); setPin('') }} className="btn btn-outline btn-sm">← Retour</button>
                    <button
                      disabled={pin.length < 6}
                      onClick={() => { setSigned(true); setShowSignModal(false); setSignStep('recap'); setPin(''); setOtp('') }}
                      className="btn btn-sm gap-1.5 disabled:opacity-40"
                      style={{ background: '#16A34A', color: 'white', border: 'none' }}
                    >
                      <ShieldCheck size={14} /> Signer l'Ordre de Paiement
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL RETOUR */}
      {showRetourModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(11,28,62,0.6)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
              <RotateCcw size={16} className="text-orange-500" />
              <h3 className="font-bold text-slate-800">Retourner le dossier</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="form-label">Motif du retour *</label>
                <textarea className="form-input resize-none text-[13px]" rows={4}
                  placeholder="Précisez les corrections attendues, les pièces manquantes ou les vérifications nécessaires…"
                  value={motif} onChange={e => setMotif(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Étape de renvoi</label>
                <select className="form-input text-[13px]">
                  <option>Liquidation (corrections financières)</option>
                  <option>Direction du Budget (coordonnées bancaires)</option>
                  <option>Service initiateur (pièces manquantes)</option>
                </select>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex gap-2 justify-end">
              <button onClick={() => { setShowRetourModal(false); setMotif('') }} className="btn btn-outline">Annuler</button>
              <button disabled={!motif.trim()} onClick={() => { setShowRetourModal(false); setMotif('') }} className="btn btn-sm gap-1.5 disabled:opacity-40" style={{ background: '#EA580C', color: 'white', border: 'none' }}>
                <RotateCcw size={13} /> Confirmer le retour
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST Téléchargement */}
      {downloadToast && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-[13px] font-semibold text-white" style={{ background: '#0B1C3E' }}>
          <Download size={15} /> Téléchargement en cours…
        </div>
      )}

      {/* MODAL EXPORT */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(11,28,62,0.6)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
              <Download size={15} className="text-slate-600" />
              <h3 className="font-bold text-slate-800">Exporter l'ordonnancement</h3>
            </div>
            <div className="p-6 space-y-3">
              <p className="text-[13px] text-slate-600">Choisissez le format d'export :</p>
              {(['PDF', 'Excel'] as const).map(fmt => (
                <label key={fmt} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${exportFormat === fmt ? 'border-navy-900 bg-slate-50' : 'border-slate-200 hover:border-slate-300'}`} style={exportFormat === fmt ? { borderColor: '#0B1C3E' } : {}}>
                  <input type="radio" name="exportFmt" checked={exportFormat === fmt} onChange={() => setExportFormat(fmt)} className="accent-slate-800" />
                  <span className="font-semibold text-slate-700">{fmt === 'PDF' ? 'PDF — Fiche d\'ordonnancement' : 'Excel — Données tabulaires'}</span>
                </label>
              ))}
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex gap-2 justify-end">
              <button onClick={() => setShowExportModal(false)} className="btn btn-outline btn-sm">Annuler</button>
              <button onClick={() => { setShowExportModal(false); setDownloadToast(true); setTimeout(() => setDownloadToast(false), 3000) }} className="btn btn-sm gap-1.5" style={{ background: '#0B1C3E', color: 'white', border: 'none' }}>
                <Download size={13} /> Exporter en {exportFormat}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL APERÇU DOCUMENT */}
      {showDocModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(11,28,62,0.6)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText size={15} className="text-slate-500" />
                <h3 className="font-bold text-slate-800 text-sm truncate max-w-[340px]">{selectedDoc}</h3>
              </div>
              <button onClick={() => setShowDocModal(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>
            <div className="p-6">
              <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 h-56 flex flex-col items-center justify-center gap-3 text-slate-400">
                <FileText size={32} className="opacity-40" />
                <p className="text-sm font-semibold">Aperçu du document</p>
                <p className="text-xs text-center max-w-[260px]">{selectedDoc}</p>
                <span className="text-[10px] px-3 py-1 rounded-full bg-slate-200 text-slate-500">PDF · Aperçu non disponible en démo</span>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button onClick={() => setShowDocModal(false)} className="btn btn-outline btn-sm">Fermer</button>
                <button onClick={() => { setShowDocModal(false); setDownloadToast(true); setTimeout(() => setDownloadToast(false), 3000) }} className="btn btn-sm gap-1.5" style={{ background: '#0B1C3E', color: 'white', border: 'none' }}>
                  <Download size={12} /> Télécharger
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL REJET */}
      {showRejetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(11,28,62,0.6)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-red-100 flex items-center gap-2" style={{ background: '#FEF2F2' }}>
              <XCircle size={16} className="text-red-600" />
              <h3 className="font-bold text-red-800">Rejeter l'ordonnancement</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800">
                <p className="font-bold mb-0.5">⚠ Action irréversible</p>
                <p>Le rejet est définitif et différent d'un retour pour correction. Il doit être motivé précisément.</p>
              </div>
              <div>
                <label className="form-label">Motif du rejet *</label>
                <textarea className="form-input resize-none text-[13px]" rows={4}
                  placeholder="Motif détaillé et référence réglementaire justifiant le rejet…"
                  value={motif} onChange={e => setMotif(e.target.value)} />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex gap-2 justify-end">
              <button onClick={() => { setShowRejetModal(false); setMotif('') }} className="btn btn-outline">Annuler</button>
              <button disabled={!motif.trim()} onClick={() => { setShowRejetModal(false); setMotif('') }} className="btn btn-sm gap-1.5 disabled:opacity-40" style={{ background: '#DC2626', color: 'white', border: 'none' }}>
                <XCircle size={13} /> Confirmer le rejet
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
