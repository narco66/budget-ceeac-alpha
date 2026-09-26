import { useState } from 'react'
import {
  FileText, Download, CheckCircle, XCircle, RotateCcw, MessageSquare,
  Paperclip, Clock, ArrowRight, AlertTriangle, Building2, ChevronLeft,
  ChevronRight, Send, Eye, Printer, History, GitBranch, Target,
  DollarSign, Shield, TrendingUp, User, RefreshCw, ShieldCheck,
  PackageCheck, Truck, Ban, Lock,
} from 'lucide-react'
import type { Page } from '../types'
import { LIQ_LIST } from '../data/mock'
import StatusBadge from '../components/StatusBadge'
import PDFPreviewModal from '../components/PDFPreviewModal'
import FicheLiquidation from '../components/pdf/FicheLiquidation'

const fmt = (n: number) =>
  new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(n) + ' XAF'
const fmtN = (n: number) =>
  new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(n)

interface Props {
  id: string
  onNavigate: (page: Page, id?: string) => void
}

const TABS = [
  { id: 'synthese',       label: 'Synthèse',              icon: Eye },
  { id: 'engagement',     label: 'Engagement source',     icon: FileText },
  { id: 'service-fait',   label: 'Service fait',          icon: PackageCheck },
  { id: 'factures',       label: 'Factures',              icon: DollarSign },
  { id: 'detail',         label: 'Détail liquidation',    icon: Building2 },
  { id: 'budget',         label: 'Budget & Imputations',  icon: TrendingUp },
  { id: 'pap',            label: 'PAP',                   icon: Target },
  { id: 'marche',         label: 'Marché / Contrat',      icon: ShieldCheck },
  { id: 'beneficiaire',   label: 'Bénéficiaire',          icon: User },
  { id: 'pieces',         label: 'Pièces justificatives', icon: Paperclip },
  { id: 'controles',      label: 'Contrôles',             icon: Shield },
  { id: 'workflow',       label: 'Workflow',               icon: GitBranch },
  { id: 'historique',     label: 'Historique',            icon: History },
  { id: 'documents',      label: 'Documents générés',     icon: Printer },
  { id: 'commentaires',   label: 'Commentaires',          icon: MessageSquare },
]

const WF_STEPS = [
  { label: 'Génération auto',    status: 'done'    as const, acteur: 'Système BUDGET-CEEAC', date: '25/08/2026', auto: true },
  { label: 'Constatation SF',    status: 'done'    as const, acteur: 'Mme. Claire BONGO', date: '27/08/2026' },
  { label: 'Certification SF',   status: 'done'    as const, acteur: 'Dir. DEPIEC — M. Paul BEYEME', date: '28/08/2026' },
  { label: 'Contrôle CF',        status: 'current' as const, acteur: 'M. Alain MBONGO — CF' },
  { label: 'Ordonnancement',     status: 'pending' as const },
]

const SF_OPTIONS = [
  { id: 'CONFORME',      label: 'Conforme',        icon: CheckCircle,  color: '#16A34A', bg: '#F0FDF4' },
  { id: 'PARTIEL',       label: 'Partiel',          icon: AlertTriangle,color: '#D97706', bg: '#FFFBEB' },
  { id: 'AVEC_RESERVES', label: 'Avec réserves',   icon: AlertTriangle,color: '#EA580C', bg: '#FFF7ED' },
  { id: 'NON_CONFORME',  label: 'Non conforme',    icon: XCircle,      color: '#DC2626', bg: '#FEF2F2' },
  { id: 'NON_FAIT',      label: 'Non réalisé',     icon: Ban,          color: '#7C3AED', bg: '#F5F3FF' },
]

const SUB_LINES = [
  { designation: 'Location salle principale — 3 jours', qteCmd: 3, qteLiv: 3, qteAcc: 3, pu: 8_500_000, montantEngage: 25_500_000, dejaLiquide: 0, cetteliq: 25_500_000, reste: 0 },
  { designation: 'Restauration participants (300 pax × 3 j)', qteCmd: 900, qteLiv: 900, qteAcc: 900, pu: 45_000, montantEngage: 40_500_000, dejaLiquide: 0, cetteliq: 40_500_000, reste: 0 },
  { designation: 'Location équipement audiovisuel', qteCmd: 1, qteLiv: 1, qteAcc: 1, pu: 12_000_000, montantEngage: 12_000_000, dejaLiquide: 0, cetteliq: 12_000_000, reste: 0 },
  { designation: 'Frais de communication et impression', qteCmd: 1, qteLiv: 1, qteAcc: 1, pu: 8_000_000, montantEngage: 8_000_000, dejaLiquide: 0, cetteliq: 8_000_000, reste: 0 },
]

const CONTROLES = [
  { check: 'Engagement visé et actif', ok: true },
  { check: 'Solde de l\'Engagement suffisant', ok: true },
  { check: 'Service fait certifié', ok: true },
  { check: 'Facture enregistrée et non dupliquée', ok: true },
  { check: 'Bénéficiaire conforme au référentiel tiers', ok: true },
  { check: 'Contrat valide et non expiré', ok: true },
  { check: 'Pièces obligatoires présentes', ok: true },
  { check: 'Calcul financier cohérent (brut → retenues → net)', ok: true },
  { check: 'Montant liquidé ≤ Montant engagé', ok: true },
  { check: 'Écart physique / financier acceptable', ok: false, warn: true },
]

const DOCS_PIECES = [
  { nom: 'Facture originale PCL-2026/08/0234', source: 'Ajouté LIQ', statut: 'OK', type: 'Facture' },
  { nom: 'PV de réception provisoire', source: 'Ajouté LIQ', statut: 'OK', type: 'PV' },
  { nom: 'Bon de commande BC-2026-003891', source: 'Hérité ENG', statut: 'OK', type: 'BC' },
  { nom: 'Contrat signé MAR-2026-003891', source: 'Hérité ENG', statut: 'OK', type: 'Contrat' },
  { nom: 'Attestation de service fait', source: 'Ajouté LIQ', statut: 'OK', type: 'Attestation' },
  { nom: 'Visa CF de l\'Engagement', source: 'Hérité ENG', statut: 'OK', type: 'Visa' },
  { nom: 'Rapport technique post-événement', source: 'Requis LIQ', statut: 'MANQUANT', type: 'Rapport' },
]

const DOCS_GENERES = [
  { nom: 'Fiche de Liquidation LIQ-2026-002934.pdf', type: 'PDF', date: '15/09/2026 10:45', taille: '78 Ko', statut: 'Disponible' },
  { nom: 'Certificat de service fait.pdf', type: 'PDF', date: '15/09/2026 10:45', taille: '34 Ko', statut: 'Disponible' },
  { nom: 'Fiche de contrôle CF', type: 'PDF', date: '—', taille: '—', statut: 'En attente de visa' },
  { nom: 'Bordereau de transmission Ordonnancement', type: 'PDF', date: '—', taille: '—', statut: 'En attente de visa' },
]

const HISTORIQUE = [
  { date: '15/09/2026', heure: '08:42', auteur: 'Système BUDGET-CEEAC', action: 'Liquidation générée automatiquement depuis ENG-2026-003891 (visé)', icon: RefreshCw, color: '#2563EB' },
  { date: '15/09/2026', heure: '14:20', auteur: 'Mme. Claire BONGO — Agent DEPIEC', action: 'Facture PCL-2026/08/0234 enregistrée (456 000 000 XAF)', icon: FileText, color: '#D97706' },
  { date: '16/09/2026', heure: '09:00', auteur: 'Mme. Claire BONGO — Agent DEPIEC', action: 'Service fait constaté — prestation réalisée conformément aux spécifications', icon: PackageCheck, color: '#D97706' },
  { date: '16/09/2026', heure: '11:45', auteur: 'M. Paul BEYEME — Directeur DEPIEC', action: 'Service fait certifié CONFORME — PV de réception signé', icon: CheckCircle, color: '#16A34A' },
  { date: '16/09/2026', heure: '11:46', auteur: 'Système BUDGET-CEEAC', action: 'Transmis automatiquement au Contrôleur Financier (M. Alain MBONGO)', icon: Send, color: '#7C3AED' },
]

export default function LiquidationDetail({ id, onNavigate }: Props) {
  const [activeTab, setActiveTab] = useState('synthese')
  const [showPDF, setShowPDF] = useState(false)
  const [showActionModal, setShowActionModal] = useState(false)
  const [actionType, setActionType] = useState<'VISER' | 'RETOURNER' | 'REJETER' | 'CERTIFIER' | null>(null)
  const [actionMotif, setActionMotif] = useState('')
  const [commentText, setCommentText] = useState('')
  const [sfStatus, setSfStatus] = useState('CONFORME')
  const [penalitesPct, setPenalitesPct] = useState(0)
  const [retGarantiePct, setRetGarantiePct] = useState(5)
  const [showFactureModal, setShowFactureModal] = useState(false)
  const [factureForm, setFactureForm] = useState({ numero: '', date: '', montantHT: '', tva: '0', echeance: '30', objet: '' })
  const [editMode, setEditMode] = useState(false)
  const [showDocModal, setShowDocModal] = useState<string | null>(null)
  const [localPieces, setLocalPieces] = useState(DOCS_PIECES)
  const [comments, setComments] = useState<{ auteur: string; role: string; date: string; texte: string; initiales: string }[]>([
    { auteur: 'Mme. Claire BONGO', role: 'Agent DEPIEC', date: '16/09/2026 · 09:00', texte: "Service fait constaté sur site. Prestation conforme aux spécifications du marché. PV de réception signé par les deux parties. Aucune réserve formulée.", initiales: 'CB' },
    { auteur: 'M. Paul BEYEME', role: 'Directeur DEPIEC', date: '16/09/2026 · 11:45', texte: "Service fait certifié CONFORME. Dossier complet transmis automatiquement au Contrôleur Financier pour visa.", initiales: 'PB' },
  ])

  const liq = LIQ_LIST.find(l => l.id === id) ?? LIQ_LIST[0]

  const retGarantie   = Math.round(liq.montantBrut * retGarantiePct / 100)
  const penalites     = Math.round(liq.montantBrut * penalitesPct / 100)
  const netCalc       = liq.montantBrut - liq.retenues - retGarantie - penalites
  const resteTotal    = liq.montantEngage - liq.montantDejaLiquide - liq.montantNet
  const cumul         = liq.montantDejaLiquide + liq.montantNet
  const depassement   = cumul - liq.montantEngage

  const openAction = (type: typeof actionType) => { setActionType(type); setActionMotif(''); setShowActionModal(true) }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Dark navy bandeau */}
      <div className="px-6 py-5" style={{ background: '#0B1C3E' }}>
        <div className="max-w-[1200px] mx-auto">
          <button onClick={() => onNavigate('liq-list')} className="text-xs text-white/40 hover:text-white mb-3 flex items-center gap-1">
            <ChevronLeft size={12} /> Retour aux liquidations
          </button>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap mb-2">
                <h1 className="text-xl font-bold text-white font-mono">{liq.reference}</h1>
                <StatusBadge status={liq.status} />
                {liq.isPAP && (
                  <span className="badge text-[10px] px-2 py-0.5" style={{ background: '#1D4ED8', color: 'white' }}>PAP</span>
                )}
              </div>
              <p className="text-sm text-white/70 mb-3 leading-relaxed">{liq.objet}</p>
              <div className="grid grid-cols-4 gap-4 text-xs">
                <div>
                  <p className="text-white/40">Engagement source</p>
                  <button onClick={() => onNavigate('eng-detail', 'ENG-001')}
                    className="font-semibold text-white hover:text-blue-300 font-mono mt-0.5">{liq.engReference}</button>
                </div>
                <div><p className="text-white/40">Fournisseur</p><p className="font-semibold text-white mt-0.5">{liq.tiers}</p></div>
                <div><p className="text-white/40">Net liquidé</p><p className="font-bold text-white text-sm mt-0.5">{fmt(liq.montantNet)}</p></div>
                <div><p className="text-white/40">Acteur attendu</p><p className="font-semibold text-white mt-0.5">{liq.acteurAttendu ?? '—'}</p></div>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={() => setShowPDF(true)} className="btn btn-sm bg-white/10 hover:bg-white/20 text-white border-0 gap-1.5">
                <Printer size={13} /> PDF
              </button>
              {showPDF && (
                <PDFPreviewModal
                  title="Fiche de Liquidation"
                  subtitle={liq.objet}
                  reference={liq.reference}
                  docCode="RPT-FICHE-LIQ-001"
                  onClose={() => setShowPDF(false)}
                >
                  <FicheLiquidation item={liq} />
                </PDFPreviewModal>
              )}
              {liq.status === 'EN_CERTIFICATION' && (
                <button onClick={() => openAction('CERTIFIER')} className="btn btn-sm gap-1.5" style={{ background: '#16A34A', color: 'white', border: 'none' }}>
                  <CheckCircle size={13} /> Certifier SF
                </button>
              )}
              {liq.status === 'EN_CONTROLE' && (
                <>
                  <button onClick={() => openAction('RETOURNER')} className="btn btn-sm bg-orange-500/80 hover:bg-orange-500 text-white border-0 gap-1.5">
                    <RotateCcw size={13} /> Retourner
                  </button>
                  <button onClick={() => openAction('REJETER')} className="btn btn-sm bg-red-500/80 hover:bg-red-500 text-white border-0 gap-1.5">
                    <XCircle size={13} /> Rejeter
                  </button>
                  <button onClick={() => openAction('VISER')} className="btn btn-sm gap-1.5" style={{ background: '#16A34A', color: 'white', border: 'none' }}>
                    <CheckCircle size={13} /> Viser
                  </button>
                </>
              )}
              {liq.status === 'VISEE' && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: '#16A34A20' }}>
                  <Lock size={12} className="text-green-400" />
                  <span className="text-green-300 text-xs font-medium">Ordonnancement généré automatiquement</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Workflow progress bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-3">
        <div className="max-w-[1200px] mx-auto flex items-center gap-2 overflow-x-auto">
          {WF_STEPS.map((s, i) => (
            <div key={i} className="flex items-center flex-shrink-0">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
                s.status === 'done' ? 'bg-green-100 text-green-700' :
                s.status === 'current' ? 'text-white' : 'bg-slate-100 text-slate-400'
              }`} style={s.status === 'current' ? { background: '#0B1C3E' } : {}}>
                {s.status === 'done' && <CheckCircle size={11} />}
                {s.status === 'current' && <Clock size={11} />}
                {(s as any).auto && <RefreshCw size={10} className="opacity-70" />}
                {s.label}
                {s.acteur && s.status !== 'done' && <span className="opacity-60">· {s.acteur.split(' ').slice(-1)[0]}</span>}
              </div>
              {i < WF_STEPS.length - 1 && (
                <ChevronRight size={13} className={`mx-1 flex-shrink-0 ${s.status === 'done' ? 'text-green-400' : 'text-slate-300'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* RETOURNEE banner */}
      {liq.status === 'RETOURNEE' && liq.motifRetour && (
        <div className="bg-orange-50 border-b border-orange-200 px-6 py-4">
          <div className="max-w-[1200px] mx-auto flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <RotateCcw size={15} className="text-orange-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-orange-800 text-sm">Liquidation retournée pour correction</span>
                <span className="text-xs text-orange-500">par {liq.acteurRetour} · le {liq.dateRetour}</span>
              </div>
              <p className="text-sm text-orange-700 leading-relaxed mb-3">{liq.motifRetour}</p>
              <button onClick={() => setEditMode(true)} className="btn btn-sm gap-1.5 bg-orange-600 text-white border-0 hover:bg-orange-700">
                <FileText size={13} /> Corriger et retransmettre
              </button>
              {editMode && (
                <div className="mt-3 p-4 rounded-xl border border-orange-200 bg-white space-y-3">
                  <p className="text-xs font-semibold text-orange-700 uppercase tracking-wider">Mode correction</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="form-label">Objet de la liquidation</label>
                      <input className="form-input text-sm" defaultValue={liq.objet} />
                    </div>
                    <div>
                      <label className="form-label">Montant brut (XAF)</label>
                      <input className="form-input text-sm font-mono" defaultValue={liq.montantBrut} />
                    </div>
                  </div>
                  <div>
                    <label className="form-label">Commentaire de correction</label>
                    <textarea className="form-input resize-none text-sm" rows={2} placeholder="Décrivez les corrections apportées…" />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setEditMode(false)} className="btn btn-sm bg-orange-600 text-white border-0 hover:bg-orange-700 gap-1.5">
                      <Send size={12} /> Retransmettre
                    </button>
                    <button onClick={() => setEditMode(false)} className="btn btn-outline btn-sm">Annuler</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* REJETEE banner */}
      {liq.status === 'REJETEE' && liq.motifRejet && (
        <div className="bg-red-50 border-b border-red-200 px-6 py-4">
          <div className="max-w-[1200px] mx-auto flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <XCircle size={15} className="text-red-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-red-800 text-sm">Liquidation rejetée définitivement</span>
                <span className="text-xs text-red-500">par {liq.acteurRejet} · le {liq.dateRejet}</span>
              </div>
              <p className="text-sm text-red-700 leading-relaxed">{liq.motifRejet}</p>
              <p className="text-xs text-red-500 mt-2 font-medium">Cette liquidation ne peut plus être modifiée ni retransmise. Elle ne peut pas être transformée en Ordonnancement.</p>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200 px-6">
        <div className="max-w-[1200px] mx-auto flex gap-1 overflow-x-auto">
          {TABS.map(tab => {
            const Icon = tab.icon
            return (
              <button key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`tab-item flex items-center gap-1.5 flex-shrink-0 ${activeTab === tab.id ? 'active' : ''}`}>
                <Icon size={12} />{tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab content */}
      <div className="px-6 py-5 max-w-[1200px] mx-auto space-y-4">

        {/* SYNTHÈSE */}
        {activeTab === 'synthese' && (
          <div className="space-y-4">
            {/* Carte financière principale */}
            <div className="card p-5">
              <h3 className="section-title mb-4">Tableau de suivi du montant</h3>
              <div className="grid grid-cols-5 gap-4 mb-4">
                {[
                  { label: 'Montant engagé', value: liq.montantEngage, color: '#0B1C3E' },
                  { label: 'Déjà liquidé', value: liq.montantDejaLiquide, color: '#D97706' },
                  { label: 'Liquidation actuelle', value: liq.montantNet, color: '#2563EB' },
                  { label: 'Cumul après opération', value: cumul, color: depassement > 0 ? '#DC2626' : '#16A34A' },
                  { label: 'Reste à liquider', value: Math.max(0, resteTotal), color: resteTotal <= 0 ? '#16A34A' : '#D97706' },
                ].map((item, i) => (
                  <div key={i} className="text-center p-3 rounded-lg bg-slate-50">
                    <p className="text-xs text-slate-400 mb-1">{item.label}</p>
                    <p className="font-bold text-sm" style={{ color: item.color }}>{fmtN(item.value)}</p>
                    <p className="text-[10px] text-slate-400">XAF</p>
                  </div>
                ))}
              </div>
              {/* Stacked bar */}
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
                <div style={{ width: `${Math.min(100, (liq.montantDejaLiquide / liq.montantEngage) * 100)}%`, background: '#D97706' }} />
                <div style={{ width: `${Math.min(100 - (liq.montantDejaLiquide / liq.montantEngage) * 100, (liq.montantNet / liq.montantEngage) * 100)}%`, background: '#2563EB' }} />
              </div>
              <div className="flex items-center gap-4 mt-2 text-[10.5px] text-slate-500">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: '#D97706' }} /> Liquidations antérieures</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: '#2563EB' }} /> Liquidation actuelle</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm inline-block bg-slate-100" /> Disponible</span>
              </div>
              {depassement > 0 && (
                <div className="mt-3 p-3 rounded-lg flex items-center gap-2" style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}>
                  <XCircle size={14} className="text-red-600 flex-shrink-0" />
                  <p className="text-sm text-red-700 font-medium">Dépassement de {fmt(depassement)} — Liquidation impossible sans modification de l'Engagement.</p>
                </div>
              )}
            </div>
            {/* Identification */}
            <div className="card p-5">
              <h3 className="section-title mb-4">Identification</h3>
              <div className="grid grid-cols-3 gap-4 text-sm">
                {[
                  { label: 'Référence Liquidation', value: liq.reference },
                  { label: 'Référence Engagement', value: liq.engReference },
                  { label: 'Référence EB', value: liq.ebReference },
                  { label: 'Structure initiatrice', value: liq.structure },
                  { label: 'Fournisseur / Bénéficiaire', value: liq.tiers },
                  { label: 'Exercice budgétaire', value: '2026' },
                  { label: 'Date de création', value: liq.dateCreation },
                  { label: 'Date service fait', value: liq.dateServiceFait ?? '—' },
                  { label: 'N° de facture', value: liq.numFacture ?? '—' },
                ].map((f, i) => (
                  <div key={i}>
                    <p className="text-xs text-slate-400 mb-0.5">{f.label}</p>
                    <p className="font-medium text-slate-800">{f.value}</p>
                  </div>
                ))}
              </div>
            </div>
            {/* SF quick summary */}
            <div className="card p-5">
              <h3 className="section-title mb-3">Constatation du service fait</h3>
              <div className="flex items-center gap-3">
                {liq.serviceFait === 'CONFORME' && <CheckCircle size={20} className="text-green-600" />}
                {liq.serviceFait === 'AVEC_RESERVES' && <AlertTriangle size={20} className="text-orange-500" />}
                {liq.serviceFait === 'NON_FAIT' && <Ban size={20} className="text-purple-600" />}
                {liq.serviceFait === 'NON_CONFORME' && <XCircle size={20} className="text-red-600" />}
                <div>
                  <p className="font-semibold text-slate-800">
                    {liq.serviceFait === 'CONFORME' ? 'Prestation réalisée conformément' :
                     liq.serviceFait === 'AVEC_RESERVES' ? 'Prestation réalisée avec réserves' :
                     liq.serviceFait === 'NON_FAIT' ? 'Service fait non encore constaté' : 'Prestation non conforme'}
                  </p>
                  <p className="text-xs text-slate-400">Certifié le {liq.dateServiceFait ?? '—'}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ENGAGEMENT SOURCE */}
        {activeTab === 'engagement' && (
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Lock size={14} className="text-slate-400" />
              <h3 className="section-title">Engagement source — données héritées (lecture seule)</h3>
              <button onClick={() => onNavigate('eng-detail', 'ENG-001')}
                className="ml-auto text-xs px-2 py-1 rounded flex items-center gap-1 hover:bg-slate-100" style={{ color: '#1A6B3A' }}>
                <ArrowRight size={11} /> Voir l'engagement complet
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm mb-5">
              {[
                { label: 'Référence Engagement', value: liq.engReference },
                { label: 'Référence EB', value: liq.ebReference },
                { label: 'Structure initiatrice', value: liq.structure },
                { label: 'Fournisseur / Tiers', value: liq.tiers },
                { label: 'Montant engagé', value: fmt(liq.montantEngage) },
                { label: 'Visa CF Engagement', value: 'M. Alain MBONGO — 21/08/2026' },
                { label: 'Mode de passation', value: liq.montantEngage > 50_000_000 ? 'Appel d\'offres ouvert' : 'Demande de cotation' },
                { label: 'Ligne budgétaire', value: '410234 — Activités de promotion intégration économique' },
                { label: 'Nature PAP / HORS PAP', value: liq.isPAP ? 'PAP — Pilier 1 · Axe 2.4' : 'HORS PAP — Fonctionnement' },
              ].map((f, i) => (
                <div key={i}>
                  <p className="text-xs text-slate-400 mb-0.5">{f.label}</p>
                  <p className="font-medium text-slate-800">{f.value}</p>
                </div>
              ))}
            </div>
            <div className="p-3 rounded-lg text-xs text-slate-500 flex items-center gap-2" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
              <Lock size={12} className="text-slate-400" />
              Ces données sont héritées de l'Engagement validé. Elles ne peuvent pas être modifiées dans la Liquidation.
            </div>
          </div>
        )}

        {/* SERVICE FAIT */}
        {activeTab === 'service-fait' && (
          <div className="space-y-4">
            <div className="card p-5" style={{ border: '2px solid #1A6B3A' }}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <PackageCheck size={20} className="text-green-700" />
                </div>
                <div>
                  <p className="font-bold text-[15px] text-slate-900">CERTIFICATION DU SERVICE FAIT</p>
                  <p className="text-xs text-slate-400">Constatation de la réalité et de la conformité de la prestation</p>
                </div>
              </div>
              {/* SF status selector */}
              <div className="grid grid-cols-5 gap-3 mb-5">
                {SF_OPTIONS.map(opt => {
                  const Icon = opt.icon
                  const isActive = sfStatus === opt.id
                  return (
                    <div key={opt.id} onClick={() => setSfStatus(opt.id)}
                      className="py-4 px-3 rounded-xl border-2 cursor-pointer text-center transition-all"
                      style={{ borderColor: isActive ? opt.color : '#E2E8F0', background: isActive ? opt.bg : 'white' }}>
                      <Icon size={20} className="mx-auto mb-2" style={{ color: isActive ? opt.color : '#CBD5E1' }} />
                      <p className="text-[11px] font-bold" style={{ color: isActive ? opt.color : '#94A3B8' }}>{opt.label}</p>
                    </div>
                  )
                })}
              </div>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="form-label">Certificateur habilité</label>
                  <input className="form-input text-[13px] bg-slate-50" readOnly defaultValue="M. Paul BEYEME — Directeur DEPIEC" />
                </div>
                <div>
                  <label className="form-label">Date de constatation</label>
                  <input className="form-input text-[13px]" type="date" defaultValue={liq.dateServiceFait} />
                </div>
                <div>
                  <label className="form-label">Agent constatant</label>
                  <input className="form-input text-[13px]" defaultValue="Mme. Claire BONGO — Agent DEPIEC" />
                </div>
                <div>
                  <label className="form-label">Lieu de réception</label>
                  <input className="form-input text-[13px]" defaultValue="Palais des Congrès de Libreville" />
                </div>
                <div className="col-span-2">
                  <label className="form-label">Observations</label>
                  <textarea className="form-input text-[13px] resize-none" rows={2}
                    defaultValue="La prestation a été réalisée conformément aux spécifications. PV de réception signé par les deux parties." />
                </div>
              </div>
              {/* Rapprochement quantités */}
              <h4 className="text-[11px] uppercase font-semibold text-slate-400 tracking-wider mb-3">Rapprochement quantités</h4>
              <table className="data-table text-xs w-full mb-4">
                <thead>
                  <tr>
                    <th className="text-left">Article / Rubrique</th>
                    <th className="text-right">Commandé</th>
                    <th className="text-right">Livré</th>
                    <th className="text-right">Accepté</th>
                    <th className="text-right">Rejeté</th>
                    <th className="text-left">Écart</th>
                  </tr>
                </thead>
                <tbody>
                  {SUB_LINES.map((l, i) => (
                    <tr key={i}>
                      <td className="font-medium text-slate-800">{l.designation}</td>
                      <td className="text-right font-mono">{l.qteCmd}</td>
                      <td className="text-right font-mono">{l.qteLiv}</td>
                      <td className="text-right font-mono text-green-700 font-semibold">{l.qteAcc}</td>
                      <td className="text-right font-mono text-red-500">{l.qteCmd - l.qteAcc}</td>
                      <td>
                        <span className={`badge text-[10px] ${l.qteAcc === l.qteCmd ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                          {l.qteAcc === l.qteCmd ? '✓ Conforme' : `⚠ ${l.qteCmd - l.qteAcc} unité(s) non acceptée(s)`}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Pénalités */}
              <div className="flex items-center gap-4 p-3 rounded-lg" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                <span className="text-[13px] font-medium text-slate-700">Pénalités de retard</span>
                <div className="flex items-center gap-2">
                  <button onClick={() => setPenalitesPct(p => Math.max(0, p - 0.5))} className="w-6 h-6 rounded bg-slate-200 text-slate-600 text-xs">−</button>
                  <span className="font-mono text-sm font-semibold w-10 text-center">{penalitesPct}%</span>
                  <button onClick={() => setPenalitesPct(p => Math.min(10, p + 0.5))} className="w-6 h-6 rounded bg-slate-200 text-slate-600 text-xs">+</button>
                </div>
                {penalitesPct > 0 && <span className="font-mono text-red-600 font-semibold">− {fmt(penalites)}</span>}
              </div>
            </div>
          </div>
        )}

        {/* FACTURES */}
        {activeTab === 'factures' && (
          <div className="space-y-4">
            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="section-title">Factures enregistrées</h3>
                <button onClick={() => { setFactureForm({ numero: '', date: '', montantHT: '', tva: '0', echeance: '30', objet: '' }); setShowFactureModal(true) }} className="btn btn-primary btn-sm gap-1.5"><FileText size={12} /> Ajouter une facture</button>
              </div>
              <div className="p-4 rounded-xl mb-4" style={{ border: '1.5px solid #CBD5E1' }}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-bold text-slate-800">Facture {liq.numFacture ?? 'N/A'}</p>
                    <p className="text-xs text-slate-400">{liq.tiers} · {liq.dateFacture}</p>
                  </div>
                  <span className="badge text-[10px] bg-green-100 text-green-700">✓ Vérifiée — Non dupliquée</span>
                </div>
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div><p className="text-xs text-slate-400 mb-0.5">Montant HT</p><p className="font-medium">{fmt(liq.montantBrut)}</p></div>
                  <div><p className="text-xs text-slate-400 mb-0.5">TVA</p><p className="font-medium text-slate-400">Exonéré CEEAC</p></div>
                  <div><p className="text-xs text-slate-400 mb-0.5">Montant TTC</p><p className="font-medium">{fmt(liq.montantBrut)}</p></div>
                  <div><p className="text-xs text-slate-400 mb-0.5">Échéance</p><p className="font-medium">30 jours</p></div>
                </div>
              </div>
            </div>

            {/* Calcul brut → retenues → net */}
            <div className="card p-5">
              <h3 className="section-title mb-4">Calcul du montant net à liquider</h3>
              <div className="max-w-lg space-y-2">
                {[
                  { label: 'Montant brut de la facture', value: liq.montantBrut, plus: true, bold: true },
                  { label: 'TVA (exonéré CEEAC)', value: 0, plus: false },
                  { label: 'Retenues à la source (10%)', value: liq.retenues, plus: false, red: true },
                  { label: `Retenue de garantie (${retGarantiePct}%)`, value: retGarantie, plus: false, red: true, editable: true },
                  { label: `Pénalités de retard (${penalitesPct}%)`, value: penalites, plus: false, red: penalites > 0 },
                ].map((row, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-slate-100 text-[13px]">
                    <span className={`flex items-center gap-2 ${row.bold ? 'font-bold text-slate-800' : 'text-slate-600'}`}>
                      {row.label}
                      {row.editable && (
                        <span className="flex items-center gap-1">
                          <button onClick={() => setRetGarantiePct(p => Math.max(0, p - 1))} className="text-[10px] px-1 rounded bg-slate-100">−</button>
                          <span className="text-[11px] font-mono font-semibold">{retGarantiePct}%</span>
                          <button onClick={() => setRetGarantiePct(p => Math.min(20, p + 1))} className="text-[10px] px-1 rounded bg-slate-100">+</button>
                        </span>
                      )}
                    </span>
                    <span className={`font-mono ${row.red ? 'text-red-600' : 'text-slate-800'}`}>
                      {row.value === 0 ? '—' : (row.plus ? '' : '− ') + fmt(row.value)}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between items-center py-3 text-[15px] font-bold" style={{ borderTop: '2px solid #0B1C3E' }}>
                  <span style={{ color: '#0B1C3E' }}>NET À LIQUIDER</span>
                  <span className="font-mono" style={{ color: '#0B1C3E' }}>{fmt(netCalc)}</span>
                </div>
              </div>
            </div>

            {/* Retenues détail */}
            <div className="card p-5">
              <h3 className="section-title mb-4">Détail des retenues et déductions</h3>
              <table className="data-table text-xs w-full">
                <thead>
                  <tr>
                    <th className="text-left">Type de retenue</th>
                    <th className="text-right">Base</th>
                    <th className="text-right">Taux</th>
                    <th className="text-right">Montant</th>
                    <th className="text-left">Règle</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="font-medium">Retenue à la source</td>
                    <td className="text-right font-mono">{fmtN(liq.montantBrut)}</td>
                    <td className="text-right">10%</td>
                    <td className="text-right font-mono text-red-600">− {fmtN(liq.retenues)}</td>
                    <td className="text-slate-400">Art. 18 Règl. financier CEEAC</td>
                  </tr>
                  <tr>
                    <td className="font-medium">Retenue de garantie</td>
                    <td className="text-right font-mono">{fmtN(liq.montantBrut)}</td>
                    <td className="text-right">{retGarantiePct}%</td>
                    <td className="text-right font-mono text-red-600">− {fmtN(retGarantie)}</td>
                    <td className="text-slate-400">Contrat Art. 9 — libération à réception définitive</td>
                  </tr>
                  {penalites > 0 && (
                    <tr>
                      <td className="font-medium">Pénalités de retard</td>
                      <td className="text-right font-mono">{fmtN(liq.montantBrut)}</td>
                      <td className="text-right">{penalitesPct}%</td>
                      <td className="text-right font-mono text-red-600">− {fmtN(penalites)}</td>
                      <td className="text-slate-400">Calculé automatiquement</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* DÉTAIL LIQUIDATION */}
        {activeTab === 'detail' && (
          <div className="card p-0 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100">
              <h3 className="section-title">Liquidation par sous-lignes</h3>
              <p className="text-xs text-slate-400 mt-0.5">Contrôle ligne par ligne — Montant liquidé ≤ Montant engagé</p>
            </div>
            <table className="data-table text-xs w-full">
              <thead>
                <tr>
                  <th className="text-left">Rubrique / Désignation</th>
                  <th className="text-right">Engagé</th>
                  <th className="text-right">Déjà liquidé</th>
                  <th className="text-right">Cette liquidation</th>
                  <th className="text-right">Reste</th>
                  <th className="text-left">État</th>
                </tr>
              </thead>
              <tbody>
                {SUB_LINES.map((l, i) => (
                  <tr key={i}>
                    <td className="font-medium text-slate-800">{l.designation}</td>
                    <td className="text-right font-mono">{fmtN(l.montantEngage)}</td>
                    <td className="text-right font-mono text-amber-600">{fmtN(l.dejaLiquide)}</td>
                    <td className="text-right font-mono text-blue-700 font-semibold">{fmtN(l.cetteliq)}</td>
                    <td className="text-right font-mono" style={{ color: l.reste <= 0 ? '#16A34A' : '#D97706' }}>{fmtN(l.reste)}</td>
                    <td>
                      <span className={`badge text-[10px] ${l.reste <= 0 ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                        {l.reste <= 0 ? '✓ Soldée' : 'Partielle'}
                      </span>
                    </td>
                  </tr>
                ))}
                <tr className="font-bold bg-slate-50">
                  <td>TOTAL</td>
                  <td className="text-right font-mono">{fmtN(SUB_LINES.reduce((s, l) => s + l.montantEngage, 0))}</td>
                  <td className="text-right font-mono text-amber-600">{fmtN(SUB_LINES.reduce((s, l) => s + l.dejaLiquide, 0))}</td>
                  <td className="text-right font-mono text-blue-700">{fmtN(SUB_LINES.reduce((s, l) => s + l.cetteliq, 0))}</td>
                  <td className="text-right font-mono text-green-700">{fmtN(SUB_LINES.reduce((s, l) => s + l.reste, 0))}</td>
                  <td />
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* BUDGET & IMPUTATIONS */}
        {activeTab === 'budget' && (
          <div className="space-y-4">
            <div className="card p-5">
              <h3 className="section-title mb-4">Imputation budgétaire (héritée de l'Engagement)</h3>
              <div className="flex items-center gap-2 mb-4 p-2 rounded-lg text-xs" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                <Lock size={12} className="text-slate-400" />
                <span className="text-slate-500">Imputations verrouillées — toute modification requiert un retour à l'Engagement.</span>
              </div>
              <table className="data-table text-xs w-full">
                <thead>
                  <tr>
                    <th className="text-left">Ligne budgétaire</th>
                    <th className="text-right">Budget révisé</th>
                    <th className="text-right">Engagé cumulé</th>
                    <th className="text-right">Cette liquidation</th>
                    <th className="text-right">Disponible</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <p className="font-medium text-slate-800">410234 — Activités promotion intégration économique</p>
                      <p className="text-[10.5px] text-slate-400">Pilier 1 · Axe 2.4 · ACT-1.2.4</p>
                    </td>
                    <td className="text-right font-mono">{fmtN(2_340_000_000)}</td>
                    <td className="text-right font-mono text-amber-600">{fmtN(456_000_000)}</td>
                    <td className="text-right font-mono text-blue-700 font-semibold">{fmtN(liq.montantNet)}</td>
                    <td className="text-right font-mono text-green-700">{fmtN(2_340_000_000 - 456_000_000 - liq.montantNet)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PAP */}
        {activeTab === 'pap' && (
          <div className="card p-5">
            {liq.isPAP ? (
              <>
                <h3 className="section-title mb-4">Référentiel PAP — Exécution physique et financière</h3>
                <div className="grid grid-cols-2 gap-4 text-sm mb-5">
                  {[
                    { label: 'Pilier', value: 'Pilier 1 — Intégration économique' },
                    { label: 'Axe stratégique', value: 'Axe 2.4 — Promotion de l\'intégration' },
                    { label: 'Produit', value: 'PRD-1.2 — Forums et événements régionaux' },
                    { label: 'Activité', value: 'ACT-1.2.4 — Forums et concertations régionales' },
                    { label: 'Indicateur de résultat', value: 'Nombre de forums organisés / an' },
                    { label: 'Cible 2026', value: '2 forums régionaux' },
                  ].map((f, i) => (
                    <div key={i}>
                      <p className="text-xs text-slate-400 mb-0.5">{f.label}</p>
                      <p className="font-medium text-slate-800">{f.value}</p>
                    </div>
                  ))}
                </div>
                <div className="p-4 rounded-xl" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                  <p className="text-xs font-semibold text-slate-500 mb-3">Comparaison physique / financière</p>
                  <div className="flex items-center gap-8">
                    <div className="text-center">
                      <p className="text-3xl font-bold" style={{ color: '#1A6B3A' }}>100%</p>
                      <p className="text-xs text-slate-400 mt-1">Avancement physique</p>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between text-xs text-slate-400 mb-1">
                        <span>Physique</span><span>100%</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full mb-2"><div className="h-2 rounded-full" style={{ width: '100%', background: '#1A6B3A' }} /></div>
                      <div className="flex justify-between text-xs text-slate-400 mb-1">
                        <span>Financier</span><span>{Math.round((liq.montantNet / liq.montantEngage) * 100)}%</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full"><div className="h-2 rounded-full" style={{ width: `${Math.round((liq.montantNet / liq.montantEngage) * 100)}%`, background: '#2563EB' }} /></div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="py-8 text-center text-slate-400">
                <Target size={32} className="mx-auto mb-2 opacity-30" />
                <p className="font-medium">Opération HORS PAP</p>
                <p className="text-xs mt-1">Aucune référence programmatique associée</p>
              </div>
            )}
          </div>
        )}

        {/* MARCHÉ / CONTRAT */}
        {activeTab === 'marche' && (
          <div className="space-y-4">
            <div className="card p-5">
              <h3 className="section-title mb-4">Marché / Contrat</h3>
              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                {[
                  { label: 'Référence marché', value: `MAR-2026-${liq.engReference.replace('ENG-2026-','')}`},
                  { label: 'Titulaire', value: liq.tiers },
                  { label: 'Objet', value: liq.objet },
                  { label: 'Type de procédure', value: liq.montantEngage > 50_000_000 ? 'Appel d\'offres ouvert' : 'Demande de cotation' },
                  { label: 'Montant initial', value: fmt(liq.montantEngage) },
                  { label: 'Avenants', value: '—' },
                  { label: 'Montant actuel', value: fmt(liq.montantEngage) },
                  { label: 'Montant déjà exécuté', value: fmt(liq.montantDejaLiquide) },
                  { label: 'Solde contractuel', value: fmt(liq.montantEngage - liq.montantDejaLiquide) },
                  { label: 'Date de fin', value: '31/12/2026' },
                ].map((f, i) => (
                  <div key={i}>
                    <p className="text-xs text-slate-400 mb-0.5">{f.label}</p>
                    <p className="font-medium text-slate-800">{f.value}</p>
                  </div>
                ))}
              </div>
              {/* Contrôle marché */}
              <div className="space-y-1.5">
                {[
                  { label: 'Marché actif', ok: true },
                  { label: 'Montant disponible (solde suffisant)', ok: true },
                  { label: 'Délai contractuel valide', ok: true },
                  { label: 'Marché proche de l\'échéance', ok: false, warn: true },
                ].map((c, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    {c.ok
                      ? <CheckCircle size={14} className="text-green-600 flex-shrink-0" />
                      : c.warn
                        ? <AlertTriangle size={14} className="text-amber-500 flex-shrink-0" />
                        : <XCircle size={14} className="text-red-500 flex-shrink-0" />}
                    <span className={c.ok ? 'text-slate-700' : c.warn ? 'text-amber-700' : 'text-red-700'}>{c.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* BÉNÉFICIAIRE */}
        {activeTab === 'beneficiaire' && (
          <div className="card p-5">
            <h3 className="section-title mb-4">Fiche bénéficiaire / Fournisseur</h3>
            <div className="grid grid-cols-2 gap-4 text-sm mb-5">
              {[
                { label: 'Raison sociale', value: liq.tiers },
                { label: 'NIF', value: 'NIF-GAB-2019-00234' },
                { label: 'RCCM', value: 'RCCM LBV-2019-B-0456' },
                { label: 'Compte bancaire', value: 'GAB-10005-00001-00456789012-55' },
                { label: 'Banque domiciliataire', value: 'Union Gabonaise de Banque (UGB)' },
                { label: 'Contact', value: 'direction@palaisdescongreslbv.ga' },
              ].map((f, i) => (
                <div key={i}>
                  <p className="text-xs text-slate-400 mb-0.5">{f.label}</p>
                  <p className="font-medium text-slate-800">{f.value}</p>
                </div>
              ))}
            </div>
            <div className="space-y-1.5">
              {[
                { label: 'Fournisseur agréé CEEAC', ok: true },
                { label: 'NIF valide et conforme', ok: true },
                { label: 'Compte bancaire vérifié', ok: true },
                { label: 'Aucune suspension en cours', ok: true },
              ].map((c, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <CheckCircle size={13} className="text-green-600" />
                  <span className="text-slate-700">{c.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PIÈCES JUSTIFICATIVES */}
        {activeTab === 'pieces' && (
          <div className="card p-0 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <h3 className="section-title">Pièces justificatives</h3>
              <button
                onClick={() => {
                  const noms = ['Rapport de performance Q3', 'Note de service interne', 'Attestation de conformité']
                  const nom = noms[localPieces.length % noms.length] ?? 'Document supplémentaire'
                  setLocalPieces(prev => [...prev, { nom, source: 'Ajouté LIQ', statut: 'OK', type: 'Document' }])
                }}
                className="btn btn-primary btn-sm gap-1.5"
              >
                <Paperclip size={12} /> Ajouter une pièce
              </button>
            </div>
            <table className="data-table text-xs w-full">
              <thead>
                <tr>
                  <th className="text-left">Document</th>
                  <th className="text-left">Type</th>
                  <th className="text-left">Source</th>
                  <th className="text-left">Statut</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {localPieces.map((doc, i) => (
                  <tr key={i} className={doc.statut === 'MANQUANT' ? 'bg-orange-50/50' : ''}>
                    <td className="flex items-center gap-2">
                      <FileText size={13} className={doc.statut === 'MANQUANT' ? 'text-orange-400' : 'text-slate-400'} />
                      <span className={`font-medium ${doc.statut === 'MANQUANT' ? 'text-orange-700' : 'text-slate-800'}`}>{doc.nom}</span>
                    </td>
                    <td className="text-slate-500">{doc.type}</td>
                    <td>
                      <span className={`badge text-[10px] ${
                        doc.source.includes('Hérité') ? 'bg-blue-50 text-blue-700' :
                        doc.source.includes('Ajouté') ? 'bg-green-50 text-green-700' :
                        'bg-orange-50 text-orange-700'
                      }`}>{doc.source}</span>
                    </td>
                    <td>
                      <span className={`badge text-[10px] ${doc.statut === 'OK' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                        {doc.statut === 'OK' ? '✓ Présent' : '⚠ Manquant'}
                      </span>
                    </td>
                    <td className="text-center">
                      {doc.statut === 'OK'
                        ? <button onClick={() => setShowDocModal(doc.nom)} className="btn btn-sm btn-outline gap-1"><Eye size={11} /> Voir</button>
                        : <button onClick={() => setLocalPieces(prev => prev.map((d, j) => j === i ? { ...d, statut: 'OK', source: 'Ajouté LIQ' } : d))} className="btn btn-sm btn-outline gap-1 text-orange-600 border-orange-300"><Paperclip size={11} /> Joindre</button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Checklist documentaire */}
            <div className="p-4 border-t border-slate-100">
              <p className="text-[11px] uppercase font-semibold text-slate-400 tracking-wider mb-3">Checklist documentaire</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Engagement visé', ok: true },
                  { label: 'Facture originale', ok: true },
                  { label: 'Bon de livraison / Bon de commande', ok: true },
                  { label: 'PV de réception', ok: true },
                  { label: 'Attestation de service fait', ok: true },
                  { label: 'Rapport technique post-événement', ok: false },
                ].map((c, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    {c.ok
                      ? <CheckCircle size={13} className="text-green-600 flex-shrink-0" />
                      : <AlertTriangle size={13} className="text-orange-500 flex-shrink-0" />}
                    <span className={c.ok ? 'text-slate-700' : 'text-orange-700'}>{c.label}</span>
                    {!c.ok && <span className="text-[10px] text-orange-500 font-medium">Obligatoire</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CONTRÔLES */}
        {activeTab === 'controles' && (
          <div className="card p-5">
            <h3 className="section-title mb-4">Contrôles de conformité automatiques</h3>
            <div className="space-y-2">
              {CONTROLES.map((c, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg"
                  style={{ background: c.ok ? (c.warn ? '#FFFBEB' : '#F0FDF4') : '#FEF2F2', border: `1px solid ${c.ok ? (c.warn ? '#FDE68A' : '#BBF7D0') : '#FECACA'}` }}>
                  {c.ok
                    ? c.warn
                      ? <AlertTriangle size={14} className="text-amber-500 flex-shrink-0" />
                      : <CheckCircle size={14} className="text-green-600 flex-shrink-0" />
                    : <XCircle size={14} className="text-red-600 flex-shrink-0" />}
                  <span className={`text-sm ${c.ok ? (c.warn ? 'text-amber-800' : 'text-green-800') : 'text-red-800'}`}>{c.check}</span>
                  <span className={`ml-auto text-[10px] font-semibold ${c.ok ? (c.warn ? 'text-amber-600' : 'text-green-600') : 'text-red-600'}`}>
                    {c.ok ? (c.warn ? '⚠ Attention' : '✓ Conforme') : '✗ Non conforme'}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 rounded-lg flex items-center gap-2" style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
              <ShieldCheck size={16} className="text-green-600" />
              <p className="text-sm text-green-800 font-medium">9/10 contrôles conformes — Dossier globalement recevable. Écart physique/financier à analyser.</p>
            </div>
          </div>
        )}

        {/* WORKFLOW */}
        {activeTab === 'workflow' && (
          <div className="space-y-4">
            <div className="card p-5">
              <h3 className="section-title mb-4">Circuit de validation</h3>
              <div className="space-y-3 mb-6">
                {WF_STEPS.map((s, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      s.status === 'done' ? 'bg-green-100' : s.status === 'current' ? 'bg-[#0B1C3E]' : 'bg-slate-100'}`}>
                      {s.status === 'done' && <CheckCircle size={13} className="text-green-600" />}
                      {s.status === 'current' && <Clock size={13} className="text-white" />}
                      {s.status === 'pending' && <div className="w-2 h-2 rounded-full bg-slate-300" />}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-semibold ${s.status === 'done' ? 'text-green-700' : s.status === 'current' ? 'text-[#0B1C3E]' : 'text-slate-400'}`}>{s.label}</p>
                      {s.acteur && <p className="text-xs text-slate-400">{s.acteur}{(s as any).date ? ` · ${(s as any).date}` : ''}</p>}
                    </div>
                    {s.status === 'current' && <span className="badge text-[10px] bg-[#0B1C3E] text-white">En cours</span>}
                  </div>
                ))}
              </div>
              {/* Action panel CF */}
              {liq.status === 'EN_CONTROLE' && (
                <div className="border-t border-slate-100 pt-4">
                  <p className="text-sm font-semibold text-slate-700 mb-3">Actions disponibles — Contrôleur Financier</p>
                  <div className="flex gap-2 flex-wrap">
                    <button onClick={() => openAction('RETOURNER')} className="btn btn-outline gap-1.5 text-orange-600 border-orange-300 hover:bg-orange-50">
                      <RotateCcw size={13} /> Retourner pour correction
                    </button>
                    <button onClick={() => openAction('REJETER')} className="btn btn-outline gap-1.5 text-red-600 border-red-300 hover:bg-red-50">
                      <XCircle size={13} /> Rejeter
                    </button>
                    <button onClick={() => openAction('VISER')} className="btn btn-primary gap-1.5">
                      <CheckCircle size={13} /> Accorder le visa
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* HISTORIQUE */}
        {activeTab === 'historique' && (
          <div className="card p-5">
            <h3 className="section-title mb-4">Timeline métier</h3>
            <div className="relative">
              <div className="absolute left-3.5 top-0 bottom-0 w-0.5 bg-slate-100" />
              <div className="space-y-5">
                {HISTORIQUE.map((h, i) => {
                  const Icon = h.icon
                  return (
                    <div key={i} className="flex items-start gap-4 relative">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 z-10"
                        style={{ background: h.color + '20', border: `1.5px solid ${h.color}` }}>
                        <Icon size={12} style={{ color: h.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800">{h.action}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{h.auteur} · {h.date} à {h.heure}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* DOCUMENTS GÉNÉRÉS */}
        {activeTab === 'documents' && (
          <div className="card p-0 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <h3 className="section-title">Documents officiels</h3>
              <button onClick={() => setShowPDF(true)} className="btn btn-primary btn-sm gap-1.5"><Printer size={12} /> Générer PDF</button>
            </div>
            <table className="data-table text-xs w-full">
              <thead>
                <tr>
                  <th className="text-left">Document</th>
                  <th className="text-left">Format</th>
                  <th className="text-left">Date</th>
                  <th className="text-right">Taille</th>
                  <th className="text-left">Statut</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {DOCS_GENERES.map((doc, i) => (
                  <tr key={i} className={doc.statut !== 'Disponible' ? 'opacity-50' : ''}>
                    <td className="flex items-center gap-2">
                      <FileText size={14} className="text-red-500" />
                      <span className="font-medium text-slate-800">{doc.nom}</span>
                    </td>
                    <td><span className="badge text-[10px] bg-red-50 text-red-700">{doc.type}</span></td>
                    <td className="text-slate-500">{doc.date}</td>
                    <td className="text-right text-slate-500">{doc.taille}</td>
                    <td>
                      <span className={`badge text-[10px] ${doc.statut === 'Disponible' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                        {doc.statut}
                      </span>
                    </td>
                    <td className="text-center">
                      {doc.statut === 'Disponible' && (
                        <div className="flex items-center justify-center gap-1">
                          <button onClick={() => setShowPDF(true)} className="btn btn-sm btn-outline gap-1"><Eye size={11} /> Voir</button>
                          <button onClick={() => setShowPDF(true)} className="btn btn-sm btn-outline gap-1"><Download size={11} /></button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* COMMENTAIRES */}
        {activeTab === 'commentaires' && (
          <div className="space-y-4">
            <div className="card space-y-4 p-5">
              {comments.map((c, i) => (
                <div key={i} className="p-4 rounded-xl" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold" style={{ background: '#0B1C3E' }}>
                      {c.initiales}
                    </div>
                    <div>
                      <p className="text-[12.5px] font-semibold text-slate-800">{c.auteur}</p>
                      <p className="text-[11px] text-slate-400">{c.role} · {c.date}</p>
                    </div>
                  </div>
                  <p className="text-[13px] text-slate-700 leading-relaxed">{c.texte}</p>
                </div>
              ))}
            </div>
            <div className="card p-4">
              <textarea className="form-input resize-none text-[13px] w-full mb-2" rows={3}
                placeholder="Ajouter un commentaire…" value={commentText} onChange={e => setCommentText(e.target.value)} />
              <button
                className="btn btn-outline btn-sm gap-1.5"
                disabled={!commentText.trim()}
                onClick={() => {
                  if (!commentText.trim()) return
                  const now = new Date()
                  const dateStr = now.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }) + ' · ' + now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
                  setComments(prev => [...prev, { auteur: 'Vous', role: 'Utilisateur connecté', date: dateStr, texte: commentText.trim(), initiales: 'VC' }])
                  setCommentText('')
                }}
              >
                <Send size={12} /> Publier
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Ajouter une facture */}
      {showFactureModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(11,28,62,0.55)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-blue-600" />
                <h3 className="font-bold text-slate-800">Enregistrer une facture</h3>
              </div>
              <button onClick={() => setShowFactureModal(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">N° de facture *</label>
                  <input className="form-input" placeholder="ex : FACT-2026/001" value={factureForm.numero}
                    onChange={e => setFactureForm(f => ({ ...f, numero: e.target.value }))} />
                </div>
                <div>
                  <label className="form-label">Date de la facture *</label>
                  <input type="date" className="form-input" value={factureForm.date}
                    onChange={e => setFactureForm(f => ({ ...f, date: e.target.value }))} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Montant HT (XAF) *</label>
                  <input className="form-input font-mono" placeholder="0" value={factureForm.montantHT}
                    onChange={e => setFactureForm(f => ({ ...f, montantHT: e.target.value.replace(/\D/g, '') }))} />
                </div>
                <div>
                  <label className="form-label">TVA (%)</label>
                  <select className="form-input" value={factureForm.tva}
                    onChange={e => setFactureForm(f => ({ ...f, tva: e.target.value }))}>
                    <option value="0">Exonéré (0 %)</option>
                    <option value="18">18 %</option>
                    <option value="19.25">19,25 %</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="form-label">Échéance de paiement</label>
                <select className="form-input" value={factureForm.echeance}
                  onChange={e => setFactureForm(f => ({ ...f, echeance: e.target.value }))}>
                  <option value="30">30 jours</option>
                  <option value="45">45 jours</option>
                  <option value="60">60 jours</option>
                  <option value="90">90 jours</option>
                </select>
              </div>
              <div>
                <label className="form-label">Objet / désignation</label>
                <textarea className="form-input resize-none text-[13px]" rows={3}
                  placeholder="Description des prestations facturées…"
                  value={factureForm.objet}
                  onChange={e => setFactureForm(f => ({ ...f, objet: e.target.value }))} />
              </div>
              {factureForm.montantHT && (
                <div className="rounded-xl p-3 text-[12px] space-y-1" style={{ background: '#F0F9FF', border: '1px solid #BAE6FD' }}>
                  <div className="flex justify-between text-slate-600">
                    <span>Montant HT</span>
                    <span className="font-mono">{fmt(Number(factureForm.montantHT))}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>TVA ({factureForm.tva} %)</span>
                    <span className="font-mono">{factureForm.tva === '0' ? '—' : fmt(Math.round(Number(factureForm.montantHT) * Number(factureForm.tva) / 100))}</span>
                  </div>
                  <div className="flex justify-between font-bold text-slate-800 pt-1" style={{ borderTop: '1px solid #BAE6FD' }}>
                    <span>Montant TTC</span>
                    <span className="font-mono">{fmt(Math.round(Number(factureForm.montantHT) * (1 + Number(factureForm.tva) / 100)))}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex gap-2 justify-end">
              <button onClick={() => setShowFactureModal(false)} className="btn btn-outline">Annuler</button>
              <button
                disabled={!factureForm.numero.trim() || !factureForm.date || !factureForm.montantHT}
                onClick={() => setShowFactureModal(false)}
                className="btn btn-primary gap-1.5"
              >
                <CheckCircle size={14} /> Enregistrer la facture
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal aperçu document */}
      {showDocModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(11,28,62,0.55)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-slate-600" />
                <h3 className="font-bold text-slate-800 truncate max-w-[340px]">{showDocModal}</h3>
              </div>
              <button onClick={() => setShowDocModal(null)} className="text-slate-400 hover:text-slate-600">
                <XCircle size={18} />
              </button>
            </div>
            <div className="p-6">
              <div className="rounded-xl border border-slate-200 bg-slate-50 flex flex-col items-center justify-center py-16 gap-3">
                <FileText size={40} className="text-slate-300" />
                <p className="text-sm font-medium text-slate-500">Aperçu du document</p>
                <p className="text-xs text-slate-400 text-center px-8">{showDocModal}</p>
                <div className="mt-2 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">✓ Document valide</div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3 text-[12px]">
                <div className="rounded-lg p-3 bg-slate-50 border border-slate-100">
                  <p className="text-slate-400 mb-0.5">Format</p>
                  <p className="font-semibold text-slate-700">PDF</p>
                </div>
                <div className="rounded-lg p-3 bg-slate-50 border border-slate-100">
                  <p className="text-slate-400 mb-0.5">Taille</p>
                  <p className="font-semibold text-slate-700">245 Ko</p>
                </div>
                <div className="rounded-lg p-3 bg-slate-50 border border-slate-100">
                  <p className="text-slate-400 mb-0.5">Déposé le</p>
                  <p className="font-semibold text-slate-700">15/09/2026</p>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex gap-2 justify-end">
              <button onClick={() => setShowDocModal(null)} className="btn btn-outline">Fermer</button>
              <button className="btn btn-primary gap-1.5"><Download size={14} /> Télécharger</button>
            </div>
          </div>
        </div>
      )}

      {/* Action modal */}
      {showActionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="font-bold text-slate-900 mb-1">
              {actionType === 'VISER' ? 'Accorder le visa CF' :
               actionType === 'CERTIFIER' ? 'Certifier le service fait' :
               actionType === 'RETOURNER' ? 'Retourner pour correction' : 'Rejeter la liquidation'}
            </h3>
            <p className="text-xs text-slate-400 mb-4">{liq.reference} · {liq.objet}</p>
            {actionType === 'VISER' && (
              <div className="p-3 rounded-lg mb-4" style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
                <p className="text-sm text-green-800 font-medium">✓ 9/10 contrôles conformes</p>
                <p className="text-xs text-green-600 mt-0.5">Après visa, l'Ordonnancement sera créé automatiquement.</p>
              </div>
            )}
            <div className="mb-4">
              <label className="form-label">
                {actionType === 'VISER' || actionType === 'CERTIFIER' ? 'Observation (optionnel)' : 'Motif *'}
              </label>
              <textarea className="form-input resize-none text-[13px]" rows={4}
                placeholder={
                  actionType === 'RETOURNER' ? 'Précisez les corrections attendues et les pièces manquantes…' :
                  actionType === 'REJETER' ? 'Motif détaillé du rejet…' :
                  'Observation éventuelle…'
                }
                value={actionMotif} onChange={e => setActionMotif(e.target.value)} />
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowActionModal(false)} className="btn btn-outline">Annuler</button>
              <button
                onClick={() => setShowActionModal(false)}
                disabled={(actionType === 'RETOURNER' || actionType === 'REJETER') && !actionMotif.trim()}
                className="btn btn-primary gap-1.5"
                style={
                  actionType === 'RETOURNER' ? { background: '#EA580C', color: 'white' } :
                  actionType === 'REJETER' ? { background: '#DC2626', color: 'white' } :
                  { background: '#16A34A', color: 'white' }
                }
              >
                {actionType === 'VISER' && <><ShieldCheck size={14} /> Accorder le visa</>}
                {actionType === 'CERTIFIER' && <><CheckCircle size={14} /> Certifier</>}
                {actionType === 'RETOURNER' && <><RotateCcw size={14} /> Retourner</>}
                {actionType === 'REJETER' && <><XCircle size={14} /> Rejeter</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
