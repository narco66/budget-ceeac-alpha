import { useState } from 'react'
import {
  ChevronLeft, FileText, CheckCircle, AlertTriangle, Shield, CreditCard,
  Upload, Clock, ArrowLeftRight, Send, XCircle, PauseCircle, RotateCcw,
  Building2, Banknote, Download, Eye, Lock, RefreshCw, PackageCheck, GitBranch,
  History, MessageSquare, BarChart2, BookOpen, Paperclip,
} from 'lucide-react'
import type { Page, PAYStatus } from '../types'
import { PAY_LIST } from '../data/mock'
import PDFPreviewModal from '../components/PDFPreviewModal'
import QuittancePaiement from '../components/pdf/QuittancePaiement'

const fmt = (n: number) => new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(n) + ' XAF'
const fmtN = (n: number) => new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(n)

const STATUS_CONFIG: Record<PAYStatus, { label: string; bg: string; color: string; dot: string }> = {
  GENERE:           { label: 'Généré', bg: '#F1F5F9', color: '#64748B', dot: '#94A3B8' },
  TRANSMIS_AC:      { label: 'Transmis AC', bg: '#EFF6FF', color: '#1D4ED8', dot: '#3B82F6' },
  PRIS_EN_CHARGE:   { label: 'Pris en charge', bg: '#EEF2FF', color: '#4338CA', dot: '#6366F1' },
  A_PREPARER:       { label: 'À préparer', bg: '#FFF7ED', color: '#C2410C', dot: '#F97316' },
  EN_PREPARATION:   { label: 'En préparation', bg: '#FFFBEB', color: '#B45309', dot: '#F59E0B' },
  CONTROLE_COMPTABLE:{ label: 'Contrôle comptable', bg: '#F5F3FF', color: '#6D28D9', dot: '#8B5CF6' },
  EN_VALIDATION:    { label: 'En validation', bg: '#EEF2FF', color: '#4338CA', dot: '#6366F1' },
  VALIDE:           { label: 'Validé', bg: '#ECFDF5', color: '#065F46', dot: '#10B981' },
  A_EXECUTER:       { label: 'À exécuter', bg: '#FEF3C7', color: '#92400E', dot: '#D97706' },
  AUTORISE:         { label: 'Autorisé au paiement', bg: '#D1FAE5', color: '#065F46', dot: '#059669' },
  EN_COURS_BANCAIRE:{ label: 'En cours bancaire', bg: '#DBEAFE', color: '#1E40AF', dot: '#2563EB' },
  EXECUTE:          { label: 'Exécuté', bg: '#D1FAE5', color: '#065F46', dot: '#059669' },
  PARTIELLEMENT_PAYE:{ label: 'Partiellement payé', bg: '#FEF9C3', color: '#854D0E', dot: '#CA8A04' },
  RAPPROCHE:        { label: 'Rapproché', bg: '#ECFDF5', color: '#166534', dot: '#22C55E' },
  CLOTURE:          { label: 'Clôturé', bg: '#F0FDF4', color: '#166534', dot: '#4ADE80' },
  SUSPENDU:         { label: 'Suspendu', bg: '#FEF3C7', color: '#92400E', dot: '#F59E0B' },
  RETOURNE:         { label: 'Retourné', bg: '#FFF7ED', color: '#C2410C', dot: '#F97316' },
  REJETE:           { label: 'Rejeté', bg: '#FEF2F2', color: '#991B1B', dot: '#EF4444' },
  REJETE_BANQUE:    { label: 'Rejet bancaire', bg: '#FEF2F2', color: '#991B1B', dot: '#DC2626' },
  ANNULE:           { label: 'Annulé', bg: '#F1F5F9', color: '#475569', dot: '#94A3B8' },
}

const CONTROLES = [
  { label: 'Ordre de Paiement signé et valide', ok: true },
  { label: 'Liquidation visée et valide', ok: true },
  { label: 'Bénéficiaire actif et identifié', ok: true },
  { label: 'Coordonnées bancaires vérifiées', ok: true },
  { label: "Montant cohérent avec l'OP", ok: true },
  { label: 'Aucun doublon de paiement détecté', ok: true },
  { label: 'Pièces justificatives complètes', ok: true },
  { label: 'Exercice ouvert', ok: true },
  { label: 'Compte CEEAC actif et autorisé', ok: true },
  { label: 'Mode de paiement autorisé', ok: true },
  { label: 'Séparation des fonctions respectée', ok: true },
  { label: 'Coordonnées bancaires non modifiées récemment', ok: false, warning: true },
]

interface Props {
  id: string
  onNavigate: (page: Page, id?: string) => void
}

type TabId = 'synthese' | 'ordonnancement' | 'beneficiaire' | 'coordonnees' | 'montants' | 'mode' | 'pieces' | 'controles' | 'pap' | 'marche' | 'workflow' | 'historique' | 'documents' | 'rapprochement' | 'commentaires'

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: 'synthese', label: 'Synthèse', icon: <PackageCheck size={12} /> },
  { id: 'ordonnancement', label: 'Ordonnancement source', icon: <BookOpen size={12} /> },
  { id: 'beneficiaire', label: 'Bénéficiaire', icon: <Building2 size={12} /> },
  { id: 'coordonnees', label: 'Coordonnées de paiement', icon: <CreditCard size={12} /> },
  { id: 'montants', label: 'Montants', icon: <Banknote size={12} /> },
  { id: 'mode', label: 'Mode de paiement', icon: <Send size={12} /> },
  { id: 'pieces', label: 'Pièces justificatives', icon: <Paperclip size={12} /> },
  { id: 'controles', label: 'Contrôles comptables', icon: <Shield size={12} /> },
  { id: 'pap', label: 'PAP', icon: <BarChart2 size={12} /> },
  { id: 'marche', label: 'Marché / Contrat', icon: <FileText size={12} /> },
  { id: 'workflow', label: 'Workflow', icon: <GitBranch size={12} /> },
  { id: 'historique', label: 'Historique', icon: <History size={12} /> },
  { id: 'documents', label: 'Documents générés', icon: <Download size={12} /> },
  { id: 'rapprochement', label: 'Rapprochement', icon: <ArrowLeftRight size={12} /> },
  { id: 'commentaires', label: 'Commentaires', icon: <MessageSquare size={12} /> },
]

export default function PaiementDetail({ id, onNavigate }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>('synthese')
  const [showPDF, setShowPDF] = useState(false)
  const [showValidModal, setShowValidModal] = useState(false)
  const [showSuspendModal, setShowSuspendModal] = useState(false)
  const [showRetourModal, setShowRetourModal] = useState(false)
  const [showRejetModal, setShowRejetModal] = useState(false)
  const [showExecModal, setShowExecModal] = useState(false)
  const [pinConfirm, setPinConfirm] = useState('')
  const [motif, setMotif] = useState('')
  const [preuveUploaded, setPreuveUploaded] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [validated, setValidated] = useState(false)
  const [showPriseEnChargeModal, setShowPriseEnChargeModal] = useState(false)
  const [isPrisEnCharge, setIsPrisEnCharge] = useState(false)
  const [docToast, setDocToast] = useState(false)
  const [uploadedPieces, setUploadedPieces] = useState<Set<number>>(new Set())
  const [payComments, setPayComments] = useState<string[]>([])

  const payBase = PAY_LIST.find(p => p.id === id) ?? PAY_LIST[1]
  const [modePaiement, setModePaiement] = useState<string>(payBase.modePaiement)
  const pay = { ...payBase, modePaiement }
  const sc = STATUS_CONFIG[pay.status] ?? STATUS_CONFIG['GENERE']
  const montantCourant = pay.montantOrdonnance - pay.montantPaye
  const tauxPaiement = pay.montantOrdonnance > 0 ? Math.round((pay.montantPaye / pay.montantOrdonnance) * 100) : 0

  const isSuspendu = pay.status === 'SUSPENDU'
  const isRetourne = pay.status === 'RETOURNE'
  const isExecute = ['EXECUTE', 'RAPPROCHE', 'CLOTURE'].includes(pay.status)

  return (
    <div className="flex flex-col min-h-full">
      {/* En-tête navy */}
      <div className="px-7 pt-5 pb-4" style={{ background: '#0B1C3E' }}>
        <button className="flex items-center gap-1 text-white/40 hover:text-white text-[12px] mb-3 transition-colors" onClick={() => onNavigate('pay-list')}>
          <ChevronLeft size={14} /> Retour à la liste des Paiements
        </button>

        {/* Breadcrumb chaîne */}
        <div className="flex items-center gap-1 text-[10px] text-white/30 font-mono mb-3">
          {[
            { ref: pay.ebReference, page: 'eb-detail' as const },
            { ref: pay.engReference, page: 'eng-detail' as const },
            { ref: pay.liqReference, page: 'liq-detail' as const },
            { ref: pay.ordReference, page: 'ord-detail' as const },
          ].map((item, i) => (
            <span key={item.ref} className="flex items-center gap-1">
              {i > 0 && <ChevronLeft size={9} className="rotate-180 text-white/20" />}
              <button className="hover:text-white/70 transition-colors" onClick={() => onNavigate(item.page, item.ref)}>{item.ref}</button>
            </span>
          ))}
          <ChevronLeft size={9} className="rotate-180 text-white/20" />
          <span className="text-white/60">{pay.reference}</span>
        </div>

        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap mb-1">
              <h1 className="text-xl font-bold text-white font-mono tracking-tight">{pay.reference}</h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold" style={{ background: sc.bg, color: sc.color }}>
                <span className="w-2 h-2 rounded-full" style={{ background: sc.dot }} />
                {sc.label}
              </span>
              {pay.isPAP && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-500 text-white">PAP</span>}
            </div>
            <p className="text-white/60 text-[13px] mb-3">{pay.objet}</p>

            {/* Carte financière */}
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'Net ordonnancé', value: fmt(pay.montantOrdonnance), color: '#93C5FD' },
                { label: 'Déjà payé', value: fmt(pay.montantPaye), color: '#6EE7B7' },
                { label: 'Paiement en cours', value: fmt(montantCourant), color: '#FCD34D' },
                { label: 'Reste après paiement', value: fmt(pay.reliquat), color: pay.reliquat === 0 ? '#6EE7B7' : '#FCA5A5' },
              ].map(f => (
                <div key={f.label} className="rounded-lg px-3 py-2" style={{ background: 'rgba(255,255,255,0.07)' }}>
                  <div className="text-[9px] uppercase tracking-wider text-white/40">{f.label}</div>
                  <div className="font-mono font-bold text-[14px] mt-0.5" style={{ color: f.color }}>{f.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 flex-shrink-0">
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-semibold text-white/70 hover:text-white hover:bg-white/10 transition-colors" onClick={() => setShowPDF(true)}>
              <FileText size={13} /> Aperçu PDF
            </button>
            {['TRANSMIS_AC', 'GENERE'].includes(pay.status) && !isPrisEnCharge && (
              <button onClick={() => setShowPriseEnChargeModal(true)} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-semibold bg-amber-500 text-white hover:bg-amber-600 transition-colors">
                <PackageCheck size={13} /> Prendre en charge
              </button>
            )}
            {isPrisEnCharge && (
              <span className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-semibold bg-emerald-100 text-emerald-800">
                <CheckCircle size={13} /> Pris en charge
              </span>
            )}
            {!validated && !isExecute && pay.status === 'AUTORISE' && (
              <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-semibold bg-emerald-500 text-white hover:bg-emerald-600 transition-colors" onClick={() => setShowExecModal(true)}>
                <Send size={13} /> Exécuter le paiement
              </button>
            )}
            {pay.status === 'CONTROLE_COMPTABLE' && !validated && (
              <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-semibold bg-green-500 text-white hover:bg-green-600 transition-colors" onClick={() => setShowValidModal(true)}>
                <CheckCircle size={13} /> Valider le contrôle
              </button>
            )}
            {!isExecute && !isSuspendu && (
              <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-semibold text-amber-300 hover:bg-amber-500/20 transition-colors" onClick={() => setShowSuspendModal(true)}>
                <PauseCircle size={13} /> Suspendre
              </button>
            )}
            {!isExecute && (
              <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-semibold text-orange-300 hover:bg-orange-500/20 transition-colors" onClick={() => setShowRetourModal(true)}>
                <RotateCcw size={13} /> Retourner
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bandeau workflow */}
      <div className="grid grid-cols-4 divide-x border-b" style={{ background: '#0F2347', borderColor: 'rgba(255,255,255,0.08)' }}>
        {[
          { label: 'ÉTAPE ACTUELLE', value: 'Contrôle et préparation' },
          { label: 'DERNIÈRE ACTION', value: 'Dossier pris en charge par le Comptable' },
          { label: 'ACTEUR ATTENDU', value: pay.acteurAttendu },
          { label: 'PROCHAINE ÉTAPE', value: 'Validation Chef Comptable → Signature AC' },
        ].map(f => (
          <div key={f.label} className="px-5 py-3">
            <div className="text-[9px] uppercase tracking-wider text-white/30 mb-1">{f.label}</div>
            <div className="text-[12px] font-semibold text-white/80 leading-tight">{f.value}</div>
          </div>
        ))}
      </div>

      {/* Alertes */}
      {isSuspendu && pay.motifSuspension && (
        <div className="px-6 py-3 flex items-start gap-2 text-[12.5px]" style={{ background: '#FFFBEB', borderBottom: '1px solid #FDE68A' }}>
          <PauseCircle size={15} className="text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <span className="font-bold text-amber-900 mr-2">PAIEMENT SUSPENDU</span>
            <span className="text-amber-800">{pay.motifSuspension}</span>
          </div>
        </div>
      )}
      {isRetourne && pay.motifRetour && (
        <div className="px-6 py-3 flex items-start gap-2 text-[12.5px]" style={{ background: '#FFF7ED', borderBottom: '1px solid #FDBA74' }}>
          <RotateCcw size={15} className="text-orange-600 mt-0.5 flex-shrink-0" />
          <div>
            <span className="font-bold text-orange-900 mr-2">DOSSIER RETOURNÉ</span>
            <span className="text-orange-800">{pay.motifRetour}</span>
          </div>
        </div>
      )}
      {pay.status === 'AUTORISE' && (
        <div className="px-6 py-3 flex items-center gap-4 text-[12.5px]" style={{ background: '#ECFDF5', borderBottom: '2px solid #6EE7B7' }}>
          <CheckCircle size={18} className="text-emerald-600 flex-shrink-0" />
          <div className="flex-1">
            <span className="font-bold text-emerald-900 text-[13px]">PAIEMENT AUTORISÉ</span>
            <span className="text-emerald-700 ml-3">Agent Comptable : Mme. Marie-Josée BOUNDJI · {pay.dateCreation} · {fmt(pay.montantOrdonnance)} · Mode : {pay.modePaiement} · Compte : {pay.compteCEEAC.split('-').slice(-1)[0]}</span>
          </div>
          <button className="px-4 py-1.5 rounded-lg text-[12px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors" onClick={() => setShowExecModal(true)}>
            Exécuter maintenant
          </button>
        </div>
      )}
      {isExecute && (
        <div className="px-6 py-3 flex items-center gap-4 text-[12.5px]" style={{ background: '#F0FDF4', borderBottom: '1px solid #BBF7D0' }}>
          <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
            <CheckCircle size={16} className="text-white" />
          </div>
          <div>
            <span className="font-bold text-emerald-900">PAIEMENT EXÉCUTÉ</span>
            <span className="text-emerald-700 ml-2">Bénéficiaire : <strong>{pay.tiers}</strong> · Montant : <strong>{fmt(pay.montantPaye)}</strong> · Mode : {pay.modePaiement} · Réf. : {pay.refBancaire ?? '—'} · Date : {pay.dateValeur ?? pay.dateCreation}</span>
          </div>
          {pay.status !== 'CLOTURE' && (
            <span className="ml-auto px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">À rapprocher</span>
          )}
          {pay.status === 'CLOTURE' && (
            <span className="ml-auto px-3 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">CLÔTURÉ</span>
          )}
        </div>
      )}

      {/* Body */}
      <div className="flex-1 p-6 space-y-5" style={{ background: '#F0F4FA' }}>
        {/* Tabs */}
        <div className="flex border-b border-slate-200 gap-0 overflow-x-auto bg-white rounded-t-xl -mb-0 px-2 pt-1">
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`flex items-center gap-1.5 px-3 py-2.5 text-[11.5px] font-semibold border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-slate-800 text-slate-800'
                  : 'border-transparent text-slate-400 hover:text-slate-700 hover:border-slate-300'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* SYNTHÈSE */}
        {activeTab === 'synthese' && (
          <div className="grid grid-cols-3 gap-5">
            <div className="col-span-2 space-y-4">
              <div className="bg-white rounded-xl p-5 border border-slate-100">
                <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-4">Informations générales</div>
                <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                  {[
                    { label: 'Référence PAY', value: pay.reference },
                    { label: 'Statut', value: sc.label },
                    { label: 'Bénéficiaire', value: pay.tiers, bold: true },
                    { label: 'Mode de paiement', value: pay.modePaiement },
                    { label: 'Objet', value: pay.objet },
                    { label: 'Structure initiatrice', value: pay.structure },
                    { label: 'Ordonnateur', value: pay.ordonnateurNom },
                    { label: 'Classification', value: pay.isPAP ? 'PAP' : 'Hors PAP' },
                    { label: 'Date de création', value: pay.dateCreation },
                    { label: 'Date valeur', value: pay.dateValeur ?? '—' },
                    { label: 'Réf. bancaire', value: pay.refBancaire ?? '—' },
                    { label: 'Compte CEEAC débité', value: pay.compteCEEAC },
                  ].map(f => (
                    <div key={f.label} className="flex gap-2">
                      <span className="text-[11.5px] text-slate-400 w-36 flex-shrink-0">{f.label}</span>
                      <span className={`text-[12.5px] ${f.bold ? 'font-bold text-slate-800' : 'text-slate-700'}`}>{f.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chaîne de dépense */}
              <div className="bg-white rounded-xl p-5 border border-slate-100">
                <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-4">Chaîne de dépense complète</div>
                <div className="flex items-center gap-0">
                  {[
                    { label: 'EB', ref: pay.ebReference, page: 'eb-detail' as const, color: '#6366F1' },
                    { label: 'ENG', ref: pay.engReference, page: 'eng-detail' as const, color: '#0369A1' },
                    { label: 'LIQ', ref: pay.liqReference, page: 'liq-detail' as const, color: '#7C3AED' },
                    { label: 'ORD', ref: pay.ordReference, page: 'ord-detail' as const, color: '#059669' },
                    { label: 'PAY', ref: pay.reference, page: 'pay-detail' as const, color: '#0B1C3E' },
                  ].map((item, i) => (
                    <div key={item.label} className="flex items-center gap-0">
                      {i > 0 && <ChevronLeft size={14} className="rotate-180 text-slate-300 mx-1" />}
                      <button
                        className="flex flex-col items-center gap-1 p-3 rounded-xl text-center transition-all hover:shadow-md"
                        style={{ background: item.label === 'PAY' ? '#0B1C3E' : '#F8FAFC', border: `1.5px solid ${item.color}30` }}
                        onClick={() => item.page !== 'pay-detail' && onNavigate(item.page, item.ref)}
                      >
                        <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: item.label === 'PAY' ? 'rgba(255,255,255,0.5)' : item.color }}>{item.label}</span>
                        <span className="font-mono text-[10px]" style={{ color: item.label === 'PAY' ? 'white' : '#334155' }}>{item.ref.split('-').slice(-1)[0]}</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Panneau droit */}
            <div className="space-y-4">
              {/* Carte financière */}
              <div className="bg-white rounded-xl p-5 border border-slate-100">
                <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-3">Situation financière</div>
                <div className="space-y-3">
                  {[
                    { label: 'Montant brut', value: pay.montantBrut, color: '#0B1C3E' },
                    { label: 'Retenues', value: -pay.retenues, color: '#DC2626' },
                    { label: 'Net ordonnancé', value: pay.montantOrdonnance, color: '#059669', bold: true },
                    { label: 'Déjà payé', value: pay.montantPaye, color: '#16A34A' },
                    { label: 'Solde restant', value: pay.reliquat, color: pay.reliquat > 0 ? '#D97706' : '#94A3B8', bold: true },
                  ].map(f => (
                    <div key={f.label} className={`flex justify-between items-center ${f.bold ? 'border-t border-slate-100 pt-2' : ''}`}>
                      <span className="text-[12px] text-slate-500">{f.label}</span>
                      <span className={`font-mono text-[13px] ${f.bold ? 'font-bold' : ''}`} style={{ color: f.color }}>
                        {f.value < 0 ? '-' : ''}{fmtN(Math.abs(f.value))} XAF
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${tauxPaiement}%` }} />
                </div>
                <div className="text-[10px] text-slate-400 text-center mt-1">{tauxPaiement}% payé</div>
              </div>

              {/* Acteur attendu */}
              <div className="bg-white rounded-xl p-4 border border-slate-100">
                <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-2">Acteur attendu</div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-[12px]">
                    {pay.acteurAttendu.charAt(0)}
                  </div>
                  <div className="text-[12px] font-semibold text-slate-800 leading-tight">{pay.acteurAttendu}</div>
                </div>
              </div>

              {/* Contrôle rapide */}
              <div className="bg-white rounded-xl p-4 border border-slate-100">
                <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-3">Contrôles ({CONTROLES.filter(c => c.ok).length}/{CONTROLES.length})</div>
                <div className="space-y-1.5">
                  {CONTROLES.slice(0, 5).map((c, i) => (
                    <div key={i} className="flex items-center gap-2 text-[11.5px]">
                      {c.ok && !c.warning ? <CheckCircle size={12} className="text-emerald-600 flex-shrink-0" /> :
                       c.warning ? <AlertTriangle size={12} className="text-amber-500 flex-shrink-0" /> :
                       <XCircle size={12} className="text-red-500 flex-shrink-0" />}
                      <span className="text-slate-600">{c.label}</span>
                    </div>
                  ))}
                </div>
                <button className="mt-2 text-[11px] text-indigo-600 hover:underline" onClick={() => setActiveTab('controles')}>
                  Voir tous les contrôles →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ORDONNANCEMENT SOURCE */}
        {activeTab === 'ordonnancement' && (
          <div className="bg-white rounded-xl p-6 border border-slate-100">
            <div className="flex items-center justify-between mb-5">
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Ordonnancement source — {pay.ordReference}</div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200" onClick={() => onNavigate('ord-detail', pay.ordReference)}>
                <Eye size={12} /> Ouvrir le dossier ORD
              </button>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="text-[12px] font-bold text-slate-700 mb-2">Identité du dossier</h3>
                {[
                  { label: 'Référence OP', value: pay.ordReference },
                  { label: 'Référence LIQ source', value: pay.liqReference },
                  { label: 'Référence ENG source', value: pay.engReference },
                  { label: 'Référence EB', value: pay.ebReference },
                  { label: 'Objet de la dépense', value: pay.objet },
                  { label: 'Structure initiatrice', value: pay.structure },
                ].map(f => (
                  <div key={f.label} className="flex gap-3">
                    <span className="text-[11.5px] text-slate-400 w-40 flex-shrink-0">{f.label}</span>
                    <span className="font-mono text-[12px] text-slate-800">{f.value}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                <h3 className="text-[12px] font-bold text-slate-700 mb-2">Données financières héritées</h3>
                {[
                  { label: 'Montant brut (LIQ)', value: fmt(pay.montantBrut) },
                  { label: 'Retenues appliquées', value: fmt(pay.retenues) },
                  { label: 'Net ordonnancé', value: fmt(pay.montantOrdonnance), bold: true },
                  { label: 'Ordonnateur', value: pay.ordonnateurNom },
                  { label: 'Date de signature OP', value: pay.dateCreation },
                ].map(f => (
                  <div key={f.label} className="flex gap-3">
                    <span className="text-[11.5px] text-slate-400 w-40 flex-shrink-0">{f.label}</span>
                    <span className={`text-[12px] ${f.bold ? 'font-bold text-slate-900' : 'text-slate-700'}`}>{f.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-5 p-3 rounded-xl flex items-center gap-2 text-[12px]" style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
              <Lock size={12} className="text-emerald-600 flex-shrink-0" />
              <span className="text-emerald-700">Données héritées automatiquement de l'Ordonnancement — non modifiables à ce stade</span>
            </div>
          </div>
        )}

        {/* BÉNÉFICIAIRE */}
        {activeTab === 'beneficiaire' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-6 border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Fiche bénéficiaire — {pay.tiers}</div>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200" onClick={() => onNavigate('tiers-detail', 'T001')}>
                  <Eye size={12} /> Voir fiche complète
                </button>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  {[
                    { label: 'Raison sociale', value: pay.tiers, bold: true },
                    { label: 'Type', value: 'Personne morale — Société commerciale' },
                    { label: 'NIF', value: '1234567890123' },
                    { label: 'RCCM', value: 'GA-LBV-2019-B-00234' },
                    { label: 'Adresse', value: 'Av. du Colonel Parant, BP 1234, Libreville' },
                    { label: 'Téléphone', value: '+241 01 234 567' },
                    { label: 'Email', value: 'comptabilite@entreprise.ga' },
                  ].map(f => (
                    <div key={f.label} className="flex gap-3">
                      <span className="text-[11.5px] text-slate-400 w-36 flex-shrink-0">{f.label}</span>
                      <span className={`text-[12px] ${f.bold ? 'font-bold text-slate-900' : 'text-slate-700'}`}>{f.value}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <div className="p-4 rounded-xl mb-3" style={{ background: '#F0FDF4', border: '1.5px solid #86EFAC' }}>
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle size={14} className="text-emerald-600" />
                      <span className="font-bold text-emerald-800 text-[13px]">Bénéficiaire actif et conforme</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-emerald-700">
                      <div>Dossier fiscal : <strong>OK</strong></div>
                      <div>RCCM : <strong>Valide</strong></div>
                      <div>CNPS : <strong>À jour</strong></div>
                      <div>Risque : <strong>Faible</strong></div>
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-2">Source : Référentiel Tiers — mis à jour le 10/09/2026</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* COORDONNÉES DE PAIEMENT */}
        {activeTab === 'coordonnees' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-6 border border-slate-100">
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-4">Coordonnées bancaires du bénéficiaire</div>
              <div className="p-4 rounded-xl mb-4 flex items-start gap-2" style={{ background: '#FFFBEB', border: '1px solid #FDE68A' }}>
                <AlertTriangle size={14} className="text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-bold text-amber-800 text-[12.5px] mb-0.5">Alerte sécurité — Vérification obligatoire</div>
                  <div className="text-[12px] text-amber-700">Toujours vérifier indépendamment les coordonnées bancaires avant exécution. Appeler directement le bénéficiaire pour confirmer en cas de doute.</div>
                </div>
              </div>
              <div className="p-5 rounded-xl border" style={{ background: '#F8FAFC', border: '1.5px solid #E2E8F0' }}>
                <div className="flex items-center gap-2 mb-3">
                  <CreditCard size={16} className="text-slate-600" />
                  <span className="font-bold text-slate-800 text-[14px]">{pay.banque}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">Compte principal</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">✓ Vérifié</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-[12.5px]">
                  <div><span className="text-slate-400">Numéro de compte</span><div className="font-mono font-bold text-slate-800 mt-0.5">{pay.compteBancaire}</div></div>
                  <div><span className="text-slate-400">Titulaire du compte</span><div className="font-semibold text-slate-800 mt-0.5">{pay.tiers}</div></div>
                  <div><span className="text-slate-400">Dernière vérification</span><div className="text-slate-700 mt-0.5">01/09/2026 — Mme. Agnes ENGONE</div></div>
                  <div><span className="text-slate-400">Document justificatif</span><div className="text-slate-700 mt-0.5">RIB signé — banque.pdf</div></div>
                </div>
              </div>
              <div className="mt-4">
                <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-3">Compte CEEAC débité</div>
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 size={14} className="text-slate-600" />
                    <span className="font-bold text-slate-800 text-[13px]">{pay.compteCEEAC}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700">✓ Compte actif</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">XAF</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-500">
                    <div>Mode autorisé : <strong>Virement</strong></div>
                    <div>Devise : <strong>XAF</strong></div>
                    <div>Signataire habilité : <strong>Agent Comptable</strong></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MONTANTS */}
        {activeTab === 'montants' && (
          <div className="bg-white rounded-xl p-6 border border-slate-100">
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-5">Détail des montants — Chaîne financière</div>
            <div className="grid grid-cols-3 gap-6">
              <div className="space-y-4">
                <h3 className="text-[12px] font-bold text-slate-700">Montants hérités</h3>
                {[
                  { label: 'Montant engagé', value: pay.montantBrut + 500_000 },
                  { label: 'Montant liquidé (brut)', value: pay.montantBrut },
                  { label: 'Retenues légales', value: pay.retenues },
                  { label: 'Net ordonnancé', value: pay.montantOrdonnance, highlight: true },
                ].map(f => (
                  <div key={f.label} className={`flex justify-between items-center py-2 ${f.highlight ? 'border-t-2 border-slate-200 pt-3 mt-1' : 'border-b border-slate-50'}`}>
                    <span className="text-[12px] text-slate-500">{f.label}</span>
                    <span className={`font-mono text-[13px] ${f.highlight ? 'font-bold text-slate-900' : ''}`}>{fmtN(f.value)} XAF</span>
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                <h3 className="text-[12px] font-bold text-slate-700">Exécution des paiements</h3>
                {pay.montantPaye > 0 ? (
                  <div className="rounded-xl overflow-hidden border border-slate-200">
                    <table className="w-full text-[11.5px]">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-3 py-2 text-left text-slate-400 font-semibold">Versement</th>
                          <th className="px-3 py-2 text-right text-slate-400 font-semibold">Montant</th>
                          <th className="px-3 py-2 text-left text-slate-400 font-semibold">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-t border-slate-100">
                          <td className="px-3 py-2">Versement 1</td>
                          <td className="px-3 py-2 text-right font-mono font-bold text-emerald-700">{fmtN(pay.montantPaye)} XAF</td>
                          <td className="px-3 py-2 text-slate-500">{pay.dateValeur ?? '—'}</td>
                        </tr>
                      </tbody>
                    </table>
                    <div className="px-3 py-2 bg-slate-50 flex justify-between text-[12px]">
                      <span className="text-slate-400">Total payé</span>
                      <span className="font-bold text-emerald-700">{fmtN(pay.montantPaye)} XAF</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-[12px] text-slate-400 italic">Aucun versement effectué</div>
                )}
              </div>
              <div className="space-y-4">
                <h3 className="text-[12px] font-bold text-slate-700">Situation</h3>
                <div className="p-4 rounded-xl text-center" style={{ background: pay.reliquat === 0 ? '#F0FDF4' : '#FFF7ED', border: `1.5px solid ${pay.reliquat === 0 ? '#86EFAC' : '#FDBA74'}` }}>
                  <div className="text-[11px] text-slate-400 mb-1">Solde restant</div>
                  <div className="text-2xl font-mono font-bold" style={{ color: pay.reliquat === 0 ? '#059669' : '#D97706' }}>
                    {fmtN(pay.reliquat)} XAF
                  </div>
                  <div className="mt-2 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full inline-block" style={{ background: pay.reliquat === 0 ? '#DCFCE7' : '#FEF3C7', color: pay.reliquat === 0 ? '#166534' : '#92400E' }}>
                    {pay.reliquat === 0 ? 'PAIEMENT TOTAL' : 'PAIEMENT PARTIEL'}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-[11.5px] text-red-700">
                  <Shield size={12} className="inline mr-1" />
                  Cumul des paiements ne peut pas dépasser {fmtN(pay.montantOrdonnance)} XAF
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODE DE PAIEMENT */}
        {activeTab === 'mode' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-6 border border-slate-100">
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-5">Mode de règlement sélectionné</div>
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { label: 'Virement bancaire', key: 'VIREMENT', icon: <Send size={20} />, desc: 'Virement SEPA ou Swift' },
                  { label: 'Chèque', key: 'CHEQUE', icon: <FileText size={20} />, desc: 'Chèque de banque' },
                  { label: 'Caisse', key: 'CAISSE', icon: <Banknote size={20} />, desc: 'Règlement en espèces' },
                ].map(m => (
                  <div key={m.key} onClick={() => setModePaiement(m.key)} className={`p-4 rounded-xl text-center border-2 transition-all cursor-pointer ${pay.modePaiement === m.key ? 'border-slate-800 bg-slate-50' : 'border-slate-200 opacity-50 hover:opacity-80 hover:border-slate-400'}`}>
                    <div className="flex justify-center mb-2" style={{ color: pay.modePaiement === m.key ? '#0B1C3E' : '#94A3B8' }}>{m.icon}</div>
                    <div className="font-bold text-[13px] text-slate-800">{m.label}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{m.desc}</div>
                    {pay.modePaiement === m.key && <div className="mt-2 text-[10px] font-bold text-slate-800 uppercase tracking-wider">● Sélectionné</div>}
                  </div>
                ))}
              </div>
              {pay.modePaiement === 'VIREMENT' && (
                <div className="space-y-4">
                  <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Détails du virement</div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="form-label">Compte CEEAC débité</label><div className="form-input bg-slate-50 text-[12px] font-mono">{pay.compteCEEAC}</div></div>
                    <div><label className="form-label">Banque bénéficiaire</label><div className="form-input bg-slate-50 text-[12px]">{pay.banque}</div></div>
                    <div><label className="form-label">Compte bénéficiaire (IBAN)</label><div className="form-input bg-slate-50 text-[12px] font-mono">{pay.compteBancaire}</div></div>
                    <div><label className="form-label">Titulaire</label><div className="form-input bg-slate-50 text-[12px]">{pay.tiers}</div></div>
                    <div><label className="form-label">Montant à virer</label><input className="form-input text-[13px] font-mono" defaultValue={fmtN(montantCourant)} /></div>
                    <div><label className="form-label">Date d'exécution souhaitée</label><input type="date" className="form-input text-[13px]" defaultValue={pay.dateValeur ?? '2026-09-18'} /></div>
                    <div><label className="form-label">Motif du virement</label><input className="form-input text-[12px]" defaultValue={`Règlement ${pay.objet} — ${pay.ordReference}`} /></div>
                    <div><label className="form-label">Référence virement</label><input className="form-input text-[12px] font-mono" defaultValue={`VIR-${pay.reference}`} /></div>
                  </div>
                </div>
              )}
              {pay.modePaiement === 'CHEQUE' && (
                <div className="space-y-4">
                  <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Détails du chèque</div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="form-label">Bénéficiaire</label><div className="form-input bg-slate-50 text-[12px]">{pay.tiers}</div></div>
                    <div><label className="form-label">Montant</label><input className="form-input text-[13px] font-mono" defaultValue={fmtN(montantCourant)} /></div>
                    <div><label className="form-label">Numéro de chèque</label><input className="form-input text-[12px] font-mono" placeholder="Ex : 0012345678" /></div>
                    <div><label className="form-label">Date d'émission</label><input type="date" className="form-input text-[13px]" defaultValue="2026-09-15" /></div>
                    <div><label className="form-label">Banque émettrice</label><input className="form-input text-[12px]" placeholder="Ex : BGFI Bank" /></div>
                    <div><label className="form-label">Motif</label><input className="form-input text-[12px]" defaultValue={`Règlement ${pay.objet} — ${pay.ordReference}`} /></div>
                  </div>
                </div>
              )}
              {pay.modePaiement === 'CAISSE' && (
                <div className="space-y-4">
                  <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Détails du règlement en caisse</div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="form-label">Bénéficiaire</label><div className="form-input bg-slate-50 text-[12px]">{pay.tiers}</div></div>
                    <div><label className="form-label">Montant en espèces</label><input className="form-input text-[13px] font-mono" defaultValue={fmtN(montantCourant)} /></div>
                    <div><label className="form-label">Date de remise</label><input type="date" className="form-input text-[13px]" defaultValue="2026-09-15" /></div>
                    <div><label className="form-label">Référence reçu caisse</label><input className="form-input text-[12px] font-mono" placeholder="Ex : REC-2026-001" /></div>
                    <div><label className="form-label">Caissier responsable</label><input className="form-input text-[12px]" placeholder="Nom du caissier" /></div>
                    <div><label className="form-label">Motif</label><input className="form-input text-[12px]" defaultValue={`Règlement ${pay.objet} — ${pay.ordReference}`} /></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* PIÈCES JUSTIFICATIVES */}
        {activeTab === 'pieces' && (
          <div className="bg-white rounded-xl p-6 border border-slate-100">
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-4">Pièces justificatives — héritées + ajoutées</div>
            <table className="data-table mb-4">
              <thead>
                <tr>
                  <th>Document</th>
                  <th>Origine</th>
                  <th>Date</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { doc: "Ordre de Paiement signé", origine: "Ordonnancement", date: pay.dateCreation, ok: true, heritage: true },
                  { doc: "Liquidation visée", origine: "Liquidation", date: "2026-09-10", ok: true, heritage: true },
                  { doc: "Facture fournisseur", origine: "Liquidation", date: "2026-09-08", ok: true, heritage: true },
                  { doc: "Bon de commande", origine: "Engagement", date: "2026-08-20", ok: true, heritage: true },
                  { doc: "RIB bénéficiaire", origine: "Tiers", date: "2026-01-15", ok: true, heritage: false },
                  { doc: "Attestation de service fait", origine: "Liquidation", date: "2026-09-07", ok: true, heritage: true },
                  { doc: "Preuve de paiement", origine: "Comptable", date: "—", ok: false, heritage: false },
                ].map((p, i) => (
                  <tr key={i}>
                    <td>
                      <div className="flex items-center gap-2">
                        <FileText size={13} className={p.ok ? 'text-emerald-600' : 'text-slate-300'} />
                        <span className="text-[12.5px] font-medium text-slate-800">{p.doc}</span>
                        {p.heritage && <span className="px-1.5 py-0 rounded text-[9px] bg-blue-100 text-blue-700 font-semibold">HÉRITÉ</span>}
                      </div>
                    </td>
                    <td className="text-[12px] text-slate-500">{p.origine}</td>
                    <td className="text-[12px] text-slate-500">{p.date}</td>
                    <td>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${p.ok ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                        {p.ok ? '✓ Disponible' : '— En attente'}
                      </span>
                    </td>
                    <td>
                      {p.ok ? (
                        <div className="flex gap-1">
                          <button onClick={() => setShowPDF(true)} className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-700"><Eye size={12} /></button>
                          <button onClick={() => { setDocToast(true); setTimeout(() => setDocToast(false), 3000) }} className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-700"><Download size={12} /></button>
                        </div>
                      ) : uploadedPieces.has(i) ? (
                        <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1"><CheckCircle size={11} /> Jointée</span>
                      ) : (
                        <button onClick={() => setUploadedPieces(prev => new Set([...prev, i]))} className="flex items-center gap-1 text-[11px] text-indigo-600 hover:underline"><Upload size={11} /> Joindre</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="border-2 border-dashed rounded-xl p-5 text-center cursor-pointer hover:bg-slate-50 transition-colors" style={{ borderColor: '#CBD5E1' }}>
              <Upload size={20} className="mx-auto text-slate-400 mb-1" />
              <div className="text-[12px] font-semibold text-slate-600">Ajouter une pièce</div>
              <div className="text-[11px] text-slate-400">PDF, PNG, JPG — max 10 Mo</div>
            </div>
          </div>
        )}

        {/* CONTRÔLES COMPTABLES */}
        {activeTab === 'controles' && (
          <div className="bg-white rounded-xl p-6 border border-slate-100">
            <div className="flex items-center justify-between mb-5">
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Contrôles avant paiement ({CONTROLES.filter(c => c.ok && !c.warning).length}/{CONTROLES.length} conformes)</div>
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px] font-bold ${CONTROLES.every(c => c.ok) ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                <Shield size={13} />
                {CONTROLES.every(c => c.ok) ? 'Paiement autorisé' : 'Vérifications requises'}
              </div>
            </div>
            <div className="space-y-2 mb-5">
              {CONTROLES.map((c, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: c.warning ? '#FFFBEB' : c.ok ? '#F0FDF4' : '#FEF2F2', border: `1px solid ${c.warning ? '#FDE68A' : c.ok ? '#BBF7D0' : '#FECACA'}` }}>
                  {c.ok && !c.warning ? <CheckCircle size={15} className="text-emerald-600 flex-shrink-0" /> :
                   c.warning ? <AlertTriangle size={15} className="text-amber-500 flex-shrink-0" /> :
                   <XCircle size={15} className="text-red-500 flex-shrink-0" />}
                  <span className="text-[12.5px] text-slate-700 flex-1">{c.label}</span>
                  <span className={`text-[10.5px] font-bold ${c.warning ? 'text-amber-600' : c.ok ? 'text-emerald-700' : 'text-red-600'}`}>
                    {c.warning ? '⚠ ALERTE' : c.ok ? 'CONFORME' : 'BLOQUANT'}
                  </span>
                </div>
              ))}
            </div>
            <div className="p-4 rounded-xl flex items-center justify-between" style={{ background: '#ECFDF5', border: '1.5px solid #6EE7B7' }}>
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-emerald-700" />
                <span className="font-bold text-emerald-800 text-[13px]">{CONTROLES.filter(c => c.ok).length}/{CONTROLES.length} contrôles réussis</span>
              </div>
              <span className="text-[11px] text-emerald-600">Validé par Mme. Agnes ENGONE — 15/09/2026 09:30</span>
            </div>
          </div>
        )}

        {/* PAP */}
        {activeTab === 'pap' && (
          <div className="bg-white rounded-xl p-6 border border-slate-100">
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-5">Plan Annuel de Performance — Imputation</div>
            {pay.isPAP ? (
              <div className="space-y-5">
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: 'Pilier stratégique', value: 'Pilier I — Paix et sécurité' },
                    { label: 'Axe programmatique', value: 'Axe 2 — Renforcement institutionnel' },
                    { label: 'Objectif stratégique', value: 'OS-2.1 Modernisation systèmes gestion' },
                    { label: 'Produit attendu', value: 'PRD-2.1.3 Outils numériques déployés' },
                    { label: 'Activité', value: 'ACT-2.1.3.1 Acquisition équipements' },
                    { label: 'Indicateur', value: '% équipements acquis / prévu' },
                  ].map(f => (
                    <div key={f.label} className="p-3 rounded-xl bg-violet-50 border border-violet-100">
                      <div className="text-[10px] text-violet-400 mb-1">{f.label}</div>
                      <div className="text-[12px] font-semibold text-violet-900">{f.value}</div>
                    </div>
                  ))}
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-3">Chaîne financière PAP</div>
                  <div className="grid grid-cols-5 gap-2">
                    {[
                      { label: 'Budget', pct: 100, value: fmt(pay.montantBrut * 4) },
                      { label: 'Engagé', pct: 72, value: fmt(pay.montantBrut * 2.9) },
                      { label: 'Liquidé', pct: 55, value: fmt(pay.montantBrut * 2.2) },
                      { label: 'Ordonnancé', pct: 48, value: fmt(pay.montantOrdonnance * 2) },
                      { label: 'Payé', pct: tauxPaiement, value: fmt(pay.montantPaye) },
                    ].map((s, i) => (
                      <div key={s.label} className="text-center">
                        <div className="text-[9px] text-slate-400 mb-1">{s.label}</div>
                        <div className="relative mx-auto w-12 h-12">
                          <svg viewBox="0 0 36 36" className="w-12 h-12 -rotate-90">
                            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#E2E8F0" strokeWidth="3" />
                            <circle cx="18" cy="18" r="15.9" fill="none" stroke={i < 4 ? '#6366F1' : '#059669'} strokeWidth="3"
                              strokeDasharray={`${s.pct} ${100 - s.pct}`} strokeLinecap="round" />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-slate-700">{s.pct}%</div>
                        </div>
                        <div className="text-[9px] text-slate-400 mt-1 leading-tight">{s.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 text-slate-400">
                <BarChart2 size={32} className="mx-auto mb-2 text-slate-300" />
                <p className="text-[13px]">Ce dossier est classifié <strong>Hors PAP</strong></p>
                <p className="text-[11px] mt-1">Les données PAP ne s'appliquent pas à cette dépense</p>
              </div>
            )}
          </div>
        )}

        {/* MARCHÉ / CONTRAT */}
        {activeTab === 'marche' && (
          <div className="bg-white rounded-xl p-6 border border-slate-100">
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-5">Marché ou Contrat associé</div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                {[
                  { label: 'Référence marché', value: 'MRC-2026-00089' },
                  { label: 'Titulaire', value: pay.tiers },
                  { label: 'Nature', value: 'Marché de fournitures' },
                  { label: 'Montant marché', value: fmt(pay.montantBrut * 2) },
                  { label: 'Date signature', value: '2026-01-20' },
                  { label: 'Échéance', value: '2026-12-31' },
                ].map(f => (
                  <div key={f.label} className="flex gap-3">
                    <span className="text-[11.5px] text-slate-400 w-36 flex-shrink-0">{f.label}</span>
                    <span className="text-[12px] text-slate-800">{f.value}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                <div className="text-[11px] font-semibold text-slate-500 mb-2">Exécution financière du marché</div>
                {[
                  { label: 'Montant marché', value: pay.montantBrut * 2, color: '#0B1C3E' },
                  { label: 'Montant ordonnancé', value: pay.montantOrdonnance, color: '#4338CA' },
                  { label: 'Montant payé', value: pay.montantPaye, color: '#059669' },
                  { label: 'Solde restant', value: pay.montantBrut * 2 - pay.montantPaye, color: '#D97706' },
                ].map(f => (
                  <div key={f.label} className="flex justify-between items-center border-b border-slate-50 pb-2">
                    <span className="text-[12px] text-slate-500">{f.label}</span>
                    <span className="font-mono text-[12px] font-bold" style={{ color: f.color }}>{fmtN(f.value)} XAF</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* WORKFLOW */}
        {activeTab === 'workflow' && (
          <div className="bg-white rounded-xl p-6 border border-slate-100">
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-6">Workflow de validation du paiement</div>
            <div className="relative">
              <div className="absolute left-[18px] top-6 bottom-0 w-0.5 bg-slate-200" />
              {[
                { step: 'OP signé', actor: pay.ordonnateurNom, date: pay.dateCreation, done: true, icon: <CheckCircle size={14} className="text-white" /> },
                { step: 'Transmission Agence Comptable', actor: 'Système BUDGET-CEEAC', date: pay.dateCreation, done: true, icon: <Send size={14} className="text-white" /> },
                { step: 'Prise en charge Comptable', actor: 'Mme. Agnes ENGONE', date: pay.dateCreation, done: ['PRIS_EN_CHARGE', 'CONTROLE_COMPTABLE', 'EN_VALIDATION', 'VALIDE', 'AUTORISE', 'EXECUTE', 'RAPPROCHE', 'CLOTURE'].includes(pay.status), icon: <PackageCheck size={14} className="text-white" /> },
                { step: 'Contrôle comptable', actor: 'Mme. Agnes ENGONE — Comptable', date: '—', done: pay.status === 'CONTROLE_COMPTABLE', current: pay.status === 'CONTROLE_COMPTABLE', icon: <Shield size={14} className="text-white" /> },
                { step: 'Validation Chef Comptable', actor: 'M. Patrick NGUEMA', date: '—', done: false, icon: <CheckCircle size={14} className="text-white" /> },
                { step: 'Autorisation Agent Comptable', actor: 'Mme. Marie-Josée BOUNDJI', date: '—', done: false, icon: <Shield size={14} className="text-white" /> },
                { step: 'Exécution du règlement', actor: 'Système / Banque', date: '—', done: isExecute, icon: <Banknote size={14} className="text-white" /> },
                { step: 'Preuve de paiement', actor: 'Comptable', date: '—', done: isExecute, icon: <Paperclip size={14} className="text-white" /> },
                { step: 'Rapprochement bancaire', actor: 'Comptable', date: '—', done: ['RAPPROCHE', 'CLOTURE'].includes(pay.status), icon: <ArrowLeftRight size={14} className="text-white" /> },
                { step: 'Clôture du dossier', actor: 'Système', date: '—', done: pay.status === 'CLOTURE', icon: <CheckCircle size={14} className="text-white" /> },
              ].map((s, i) => (
                <div key={i} className="flex gap-4 pb-5 relative">
                  <div className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${s.done ? 'bg-emerald-500' : s.current ? 'bg-indigo-600 ring-4 ring-indigo-200' : 'bg-slate-200'}`}>
                    {s.icon}
                  </div>
                  <div className="pt-1.5">
                    <div className={`text-[13px] font-semibold ${s.current ? 'text-indigo-700' : s.done ? 'text-slate-800' : 'text-slate-400'}`}>{s.step}</div>
                    <div className="text-[11px] text-slate-400">{s.actor} · {s.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* HISTORIQUE */}
        {activeTab === 'historique' && (
          <div className="bg-white rounded-xl p-6 border border-slate-100">
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-5">Journal des événements</div>
            <div className="space-y-0">
              {[
                { date: '17/09/2026', heure: '14:22', action: 'Paiement créé automatiquement après signature OP', actor: 'Système BUDGET-CEEAC', type: 'auto', icon: <RefreshCw size={13} /> },
                { date: '17/09/2026', heure: '14:24', action: 'Dossier transmis à l\'Agence Comptable', actor: 'Système', type: 'auto', icon: <Send size={13} /> },
                { date: '17/09/2026', heure: '15:10', action: 'Dossier pris en charge par le Comptable', actor: 'Mme. Agnes ENGONE', type: 'action', icon: <PackageCheck size={13} /> },
                { date: '18/09/2026', heure: '09:40', action: 'Démarrage du contrôle comptable', actor: 'Mme. Agnes ENGONE', type: 'action', icon: <Shield size={13} /> },
              ].map((e, i) => (
                <div key={i} className="flex gap-3 py-3 border-b border-slate-50">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${e.type === 'auto' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'}`}>
                    {e.icon}
                  </div>
                  <div>
                    <div className="text-[12.5px] font-medium text-slate-800">{e.action}</div>
                    <div className="text-[11px] text-slate-400">{e.date} à {e.heure} — {e.actor}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DOCUMENTS GÉNÉRÉS */}
        {activeTab === 'documents' && (
          <div className="bg-white rounded-xl p-6 border border-slate-100">
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-5">Documents disponibles</div>
            <div className="space-y-3">
              {[
                { label: 'Fiche de Paiement', code: 'RPT-PAY-001', desc: 'Récapitulatif complet du paiement', dispo: true },
                { label: 'Ordre de virement', code: 'RPT-VIR-001', desc: 'Instruction de virement bancaire', dispo: true },
                { label: 'Bordereau de paiement', code: 'RPT-BDR-001', desc: 'Bordereau récapitulatif', dispo: true },
                { label: 'Fiche de contrôle comptable', code: 'RPT-CTR-001', desc: 'Résultat des contrôles', dispo: true },
                { label: 'Avis de paiement bénéficiaire', code: 'RPT-AVS-001', desc: 'Notification au créancier', dispo: isExecute },
                { label: 'Fiche de rapprochement', code: 'RPT-RPC-001', desc: 'Rapport de rapprochement', dispo: ['RAPPROCHE', 'CLOTURE'].includes(pay.status) },
                { label: 'Preuve de paiement (avis de débit)', code: 'PRV-PAY-001', desc: 'Document bancaire de confirmation', dispo: isExecute },
              ].map(doc => (
                <div key={doc.code} className="flex items-center justify-between p-4 rounded-xl" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                  <div className="flex items-center gap-3">
                    <FileText size={16} className={doc.dispo ? 'text-indigo-600' : 'text-slate-300'} />
                    <div>
                      <div className="text-[13px] font-semibold text-slate-800">{doc.label}</div>
                      <div className="text-[11px] text-slate-400">{doc.desc} · {doc.code}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {doc.dispo ? (
                      <>
                        <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[12px] font-semibold bg-white border border-slate-200 text-slate-700 hover:border-slate-400 transition-colors" onClick={() => setShowPDF(true)}>
                          <Eye size={12} /> Aperçu
                        </button>
                        <button onClick={() => { setDocToast(true); setTimeout(() => setDocToast(false), 3000) }} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[12px] font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">
                          <Download size={12} /> Télécharger
                        </button>
                      </>
                    ) : (
                      <span className="text-[11px] text-slate-400 italic">Disponible après exécution</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RAPPROCHEMENT */}
        {activeTab === 'rapprochement' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-6 border border-slate-100">
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-5">Rapprochement comptable</div>
              <div className="grid grid-cols-3 gap-4 mb-5">
                {[
                  { label: 'Paiement BUDGET-CEEAC', value: pay.montantOrdonnance, color: '#0B1C3E', bg: '#EDF2FB', ref: pay.reference },
                  { label: 'Montant banque', value: pay.montantPaye || pay.montantOrdonnance, color: '#1A6B3A', bg: '#F0FDF4', ref: pay.refBancaire ?? 'En attente' },
                  { label: 'Écart', value: 0, color: '#059669', bg: '#ECFDF5', ref: 'Aucun écart détecté' },
                ].map((col, i) => (
                  <div key={i} className="rounded-xl p-4 text-center" style={{ background: col.bg, border: `2px solid ${col.color}20` }}>
                    <div className="text-[10px] uppercase font-semibold tracking-wider mb-2" style={{ color: col.color }}>{col.label}</div>
                    <div className="text-[20px] font-bold font-mono" style={{ color: col.color }}>{fmtN(col.value)}</div>
                    <div className="text-[9px] text-slate-400 mt-0.5">XAF</div>
                    <div className="text-[11px] mt-1" style={{ color: col.color }}>{col.ref}</div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center gap-2 text-[12px] mb-5">
                <ArrowLeftRight size={14} className="text-slate-400" />
                <span className="text-slate-500">Écart total :</span>
                <span className="font-bold text-emerald-700">0 XAF — Rapprochement parfait</span>
              </div>
              <div className="p-4 rounded-xl flex items-center gap-3" style={{ background: isExecute ? '#DCFCE7' : '#F1F5F9', border: `2px solid ${isExecute ? '#BBF7D0' : '#E2E8F0'}` }}>
                {isExecute ? <CheckCircle size={20} className="text-emerald-700" /> : <Clock size={20} className="text-slate-400" />}
                <div>
                  <div className={`text-[13px] font-bold ${isExecute ? 'text-emerald-800' : 'text-slate-500'}`}>
                    {isExecute ? 'RAPPROCHÉ — Paiement confirmé' : 'EN ATTENTE — Rapprochement à effectuer après exécution'}
                  </div>
                  {isExecute && <div className="text-[11px] text-emerald-600">Rapproché le {pay.dateValeur} — Mme. Agnes ENGONE</div>}
                </div>
              </div>
            </div>

            {/* Preuve de paiement */}
            <div className="bg-white rounded-xl p-6 border border-slate-100">
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-4">Preuve de paiement</div>
              {!preuveUploaded ? (
                <div className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:bg-slate-50 transition-colors" style={{ borderColor: '#CBD5E1' }} onClick={() => setPreuveUploaded(true)}>
                  <Upload size={24} className="mx-auto text-slate-400 mb-2" />
                  <div className="text-[13px] font-semibold text-slate-600">Avis de débit / Preuve de virement</div>
                  <div className="text-[12px] text-slate-400 mt-1">PDF, PNG — max 10 Mo</div>
                  <button className="btn btn-outline btn-sm mt-3">Parcourir…</button>
                </div>
              ) : (
                <div className="p-4 rounded-xl flex items-center gap-3" style={{ background: '#F0FDF4', border: '1.5px solid #86EFAC' }}>
                  <CheckCircle size={20} className="text-emerald-600" />
                  <div>
                    <div className="font-bold text-emerald-800 text-[13px]">Avis de débit joint</div>
                    <div className="text-[11px] text-emerald-600">avis-debit-{pay.reference}.pdf · 245 Ko · 15/09/2026</div>
                  </div>
                  <button className="ml-auto text-[11px] text-slate-500 hover:underline" onClick={() => setPreuveUploaded(false)}>Remplacer</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* COMMENTAIRES */}
        {activeTab === 'commentaires' && (
          <div className="bg-white rounded-xl p-6 border border-slate-100">
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-5">Commentaires et observations</div>
            <div className="space-y-3 mb-5">
              {[
                { author: 'Mme. Agnes ENGONE — Comptable', date: '17/09/2026 15:10', text: 'Dossier complet reçu. Contrôle en cours.', type: 'info' },
              ].map((c, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-700">{c.author.charAt(0)}</div>
                    <span className="text-[12px] font-semibold text-slate-800">{c.author}</span>
                    <span className="text-[11px] text-slate-400">{c.date}</span>
                  </div>
                  <p className="text-[12.5px] text-slate-700 ml-8">{c.text}</p>
                </div>
              ))}
              {payComments.map((c, i) => (
                <div key={`user-${i}`} className="p-4 rounded-xl bg-indigo-50 border border-indigo-100">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-[10px] font-bold text-white">V</div>
                    <span className="text-[12px] font-semibold text-slate-800">Vous</span>
                    <span className="text-[11px] text-slate-400">maintenant</span>
                  </div>
                  <p className="text-[12.5px] text-slate-700 ml-8">{c}</p>
                </div>
              ))}
            </div>
            <textarea
              className="form-input resize-none text-[13px] w-full"
              rows={3}
              placeholder="Ajouter un commentaire ou une observation…"
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
            />
            <button
              className="btn btn-primary btn-sm mt-2 disabled:opacity-40"
              disabled={!commentText.trim()}
              onClick={() => { setPayComments(prev => [...prev, commentText]); setCommentText('') }}
            >
              <MessageSquare size={13} /> Ajouter le commentaire
            </button>
          </div>
        )}
      </div>

      {/* TOAST Téléchargement */}
      {docToast && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-[13px] font-semibold text-white" style={{ background: '#0B1C3E' }}>
          <Download size={15} /> Téléchargement en cours…
        </div>
      )}

      {/* MODAL — Prise en charge */}
      {showPriseEnChargeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(11,28,62,0.6)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="px-6 py-4 rounded-t-2xl flex items-center gap-2" style={{ background: '#D97706' }}>
              <PackageCheck size={16} className="text-white" />
              <h3 className="font-bold text-white">Prise en charge du paiement</h3>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-[13px] text-slate-600">Confirmez-vous la prise en charge de ce dossier de paiement ?</p>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-[12.5px]">
                {[
                  { label: 'Référence', value: pay.reference },
                  { label: 'Bénéficiaire', value: pay.tiers },
                  { label: 'Montant', value: fmt(pay.montantOrdonnance) },
                  { label: 'Mode', value: pay.modePaiement },
                ].map(f => (
                  <div key={f.label} className="flex justify-between">
                    <span className="text-slate-400">{f.label}</span>
                    <span className="font-semibold text-slate-800">{f.value}</span>
                  </div>
                ))}
              </div>
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[12px] text-amber-800">
                En prenant ce dossier en charge, vous devenez le comptable responsable de ce paiement.
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex gap-2 justify-end">
              <button onClick={() => setShowPriseEnChargeModal(false)} className="btn btn-outline btn-sm">Annuler</button>
              <button onClick={() => { setIsPrisEnCharge(true); setShowPriseEnChargeModal(false) }} className="btn btn-sm gap-1.5 text-white" style={{ background: '#D97706', border: 'none' }}>
                <PackageCheck size={13} /> Confirmer la prise en charge
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL — Validation contrôle */}
      {showValidModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(11,28,62,0.6)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
              <CheckCircle size={16} className="text-emerald-600" />
              <h3 className="font-bold text-slate-800">Valider le contrôle comptable</h3>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-[13px] text-slate-600">Confirmez-vous que les <strong>{CONTROLES.length} points de contrôle</strong> ont été vérifiés et que ce paiement est conforme ?</p>
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-[12px] text-emerald-700">
                <CheckCircle size={12} className="inline mr-1" />
                Le dossier sera transmis au Chef Comptable pour validation.
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex gap-2 justify-end">
              <button onClick={() => setShowValidModal(false)} className="btn btn-outline btn-sm">Annuler</button>
              <button onClick={() => { setValidated(true); setShowValidModal(false) }} className="btn btn-sm gap-1.5" style={{ background: '#059669', color: 'white', border: 'none' }}>
                <CheckCircle size={13} /> Valider le contrôle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL — Exécution paiement */}
      {showExecModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(11,28,62,0.65)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="px-6 py-4 rounded-t-2xl flex items-center gap-2" style={{ background: '#0B1C3E' }}>
              <Banknote size={16} className="text-white" />
              <h3 className="font-bold text-white">Exécuter le paiement</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-[12.5px]">
                {[
                  { label: 'Bénéficiaire', value: pay.tiers },
                  { label: 'Montant', value: fmt(montantCourant) },
                  { label: 'Mode', value: pay.modePaiement },
                  { label: 'Compte débité', value: pay.compteCEEAC },
                  { label: 'Référence', value: `VIR-${pay.reference}` },
                ].map(f => (
                  <div key={f.label} className="flex justify-between">
                    <span className="text-slate-400">{f.label}</span>
                    <span className="font-semibold text-slate-800">{f.value}</span>
                  </div>
                ))}
              </div>
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[12px] text-amber-800 flex items-center gap-2">
                <AlertTriangle size={12} /> Cette action est <strong>irréversible</strong>. Les fonds seront transférés.
              </div>
              <div>
                <label className="form-label">Code PIN Agent Comptable *</label>
                <input type="password" className="form-input font-mono tracking-widest text-center text-xl" placeholder="• • • • • •" maxLength={6} value={pinConfirm} onChange={e => setPinConfirm(e.target.value.replace(/\D/g, ''))} />
                <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1"><Lock size={10} /> Code PIN institutionnel à 6 chiffres</p>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex gap-2 justify-end">
              <button onClick={() => { setShowExecModal(false); setPinConfirm('') }} className="btn btn-outline btn-sm">Annuler</button>
              <button disabled={pinConfirm.length < 6} onClick={() => { setShowExecModal(false); setPinConfirm('') }} className="btn btn-sm gap-1.5 disabled:opacity-40" style={{ background: '#059669', color: 'white', border: 'none' }}>
                <Banknote size={13} /> Exécuter le paiement
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL — Suspension */}
      {showSuspendModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(11,28,62,0.6)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-amber-200 flex items-center gap-2 bg-amber-50 rounded-t-2xl">
              <PauseCircle size={16} className="text-amber-600" />
              <h3 className="font-bold text-amber-900">Suspendre le paiement</h3>
            </div>
            <div className="p-6 space-y-4">
              <div><label className="form-label">Motif de suspension *</label>
                <textarea className="form-input resize-none" rows={3} placeholder="Ex: Coordonnées bancaires à vérifier…" value={motif} onChange={e => setMotif(e.target.value)} /></div>
              <div><label className="form-label">Éléments bloquants</label>
                <input className="form-input" placeholder="Ex: Compte modifié le 12/09/2026" /></div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex gap-2 justify-end">
              <button onClick={() => { setShowSuspendModal(false); setMotif('') }} className="btn btn-outline btn-sm">Annuler</button>
              <button disabled={!motif.trim()} onClick={() => { setShowSuspendModal(false); setMotif('') }} className="btn btn-sm gap-1.5 disabled:opacity-40 bg-amber-500 text-white hover:bg-amber-600">
                <PauseCircle size={13} /> Confirmer la suspension
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL — Retour */}
      {showRetourModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(11,28,62,0.6)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-orange-200 flex items-center gap-2 bg-orange-50 rounded-t-2xl">
              <RotateCcw size={16} className="text-orange-600" />
              <h3 className="font-bold text-orange-900">Retourner le dossier</h3>
            </div>
            <div className="p-6 space-y-4">
              <div><label className="form-label">Destinataire *</label>
                <select className="form-input text-[13px]">
                  <option>Comptable — correction dossier</option>
                  <option>Chef Comptable — re-vérification</option>
                  <option>Ordonnancement — anomalie OP</option>
                </select></div>
              <div><label className="form-label">Motif du retour *</label>
                <textarea className="form-input resize-none" rows={3} placeholder="Expliquez les corrections requises…" value={motif} onChange={e => setMotif(e.target.value)} /></div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex gap-2 justify-end">
              <button onClick={() => { setShowRetourModal(false); setMotif('') }} className="btn btn-outline btn-sm">Annuler</button>
              <button disabled={!motif.trim()} onClick={() => { setShowRetourModal(false); setMotif('') }} className="btn btn-sm gap-1.5 disabled:opacity-40 bg-orange-500 text-white hover:bg-orange-600">
                <RotateCcw size={13} /> Retourner le dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL — Rejet */}
      {showRejetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(11,28,62,0.6)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-red-200 flex items-center gap-2 bg-red-50 rounded-t-2xl">
              <XCircle size={16} className="text-red-600" />
              <h3 className="font-bold text-red-900">Rejeter le paiement</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-[12px] text-red-700">
                <strong>Attention :</strong> Le rejet est définitif. Le dossier ne pourra plus être traité dans ce cycle.
              </div>
              <div><label className="form-label">Motif de rejet *</label>
                <textarea className="form-input resize-none" rows={3} placeholder="Motif officiel du rejet…" value={motif} onChange={e => setMotif(e.target.value)} /></div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex gap-2 justify-end">
              <button onClick={() => { setShowRejetModal(false); setMotif('') }} className="btn btn-outline btn-sm">Annuler</button>
              <button disabled={!motif.trim()} onClick={() => { setShowRejetModal(false); setMotif('') }} className="btn btn-sm gap-1.5 disabled:opacity-40 bg-red-600 text-white hover:bg-red-700">
                <XCircle size={13} /> Confirmer le rejet
              </button>
            </div>
          </div>
        </div>
      )}

      {showPDF && (
        <PDFPreviewModal title="Quittance de Paiement" reference={pay.reference} docCode="RPT-QUIT-PAY-001" onClose={() => setShowPDF(false)}>
          <QuittancePaiement item={{ ...pay, modePaiement: pay.modePaiement as 'VIREMENT' | 'CHEQUE' | 'CAISSE' }} />
        </PDFPreviewModal>
      )}
    </div>
  )
}
