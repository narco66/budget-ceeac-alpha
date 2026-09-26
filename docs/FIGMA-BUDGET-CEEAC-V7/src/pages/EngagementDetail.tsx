import { useState } from 'react'
import {
  FileText, Download, CheckCircle, XCircle, RotateCcw, MessageSquare,
  Paperclip, Clock, ArrowRight, AlertTriangle, Building2, ChevronLeft,
  ChevronRight, Send, Eye, Printer, History, GitBranch, Target,
  DollarSign, Shield, TrendingUp, User, Check, RefreshCw, Lock,
} from 'lucide-react'
import type { Page } from '../types'
import { ENG_LIST } from '../data/mock'
import StatusBadge from '../components/StatusBadge'
import PDFPreviewModal from '../components/PDFPreviewModal'
import CertificatEngagement from '../components/pdf/CertificatEngagement'

const fmt = (n: number) =>
  new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(n) + ' XAF'

interface Props {
  id: string
  onNavigate: (page: Page, id?: string) => void
}

const TABS = [
  { id: 'synthese',    label: 'Synthèse',              icon: Eye },
  { id: 'eb',          label: 'Expression de Besoin',  icon: FileText },
  { id: 'budget',      label: 'Budget & Imputations',  icon: DollarSign },
  { id: 'detail',      label: 'Détail',                icon: Building2 },
  { id: 'beneficiaire',label: 'Bénéficiaire',          icon: User },
  { id: 'marche',      label: 'Marché / Contrat',      icon: TrendingUp },
  { id: 'pap',         label: 'PAP',                   icon: Target },
  { id: 'pieces',      label: 'Pièces jointes',        icon: Paperclip },
  { id: 'controles',   label: 'Contrôles',             icon: Shield },
  { id: 'workflow',    label: 'Workflow',               icon: GitBranch },
  { id: 'historique',  label: 'Historique',            icon: History },
  { id: 'documents',   label: 'Documents générés',     icon: Printer },
  { id: 'commentaires',label: 'Commentaires',          icon: MessageSquare },
]

const WF_STEPS = [
  { label: 'Génération auto', status: 'done' as const, acteur: 'Système BUDGET-CEEAC', date: '15/09/2026 08:42', auto: true },
  { label: 'Expert Budget', status: 'done' as const, acteur: 'M. Pascal ONDO', date: '15/09/2026 09:15' },
  { label: 'Chef Service Budget', status: 'done' as const, acteur: 'Mme. Rose NKANE', date: '15/09/2026 11:25' },
  { label: 'Directeur Budget', status: 'current' as const, acteur: 'M. Henri BONGO', date: undefined },
  { label: 'Contrôleur Financier', status: 'pending' as const, acteur: undefined, date: undefined },
  { label: 'Visa CF', status: 'pending' as const, acteur: undefined, date: undefined },
]

const HISTORY = [
  { date: '15/09/2026 11:25', action: "Contrôle budgétaire effectué — transmis au Directeur Budget", acteur: 'Mme. Rose NKANE', role: 'Chef Service Budget', type: 'VALIDATION' },
  { date: '15/09/2026 09:20', action: "Prise en charge du dossier — vérification en cours", acteur: 'M. Pascal ONDO', role: 'Expert Budget', type: 'ACTION' },
  { date: '15/09/2026 08:42', action: "Engagement généré automatiquement depuis EB-2026-004521", acteur: 'Système', role: 'BUDGET-CEEAC', type: 'AUTOMATIQUE' },
]

const SUB_LINES = [
  { designation: 'Ordinateurs portables Dell Latitude 5540 (i7/16Go/512SSD)', qte: 10, unite: 'unité', pu: 5_250_000, montant: 52_500_000 },
  { designation: 'Ordinateurs portables HP EliteBook 840 G10', qte: 5, unite: 'unité', pu: 4_800_000, montant: 24_000_000 },
  { designation: 'Sacoches et accessoires', qte: 15, unite: 'lot', pu: 150_000, montant: 2_250_000 },
  { designation: "Licences Microsoft 365", qte: 15, unite: 'licence', pu: 350_000, montant: 5_250_000 },
  { designation: 'Frais de livraison et installation', qte: 1, unite: 'forfait', pu: 1_000_000, montant: 1_000_000 },
]

const IMPUTATIONS = [
  { code: '310101', libelle: 'Équipements bureautiques et informatiques', budgetRevise: 380_000_000, engage: 82_000_000, montantENG: 85_000_000, disponible: 272_000_000, disponibleApres: 187_000_000 },
  { code: '310102', libelle: 'Accessoires et logiciels informatiques', budgetRevise: 95_000_000, engage: 15_000_000, montantENG: 40_000_000, disponible: 80_000_000, disponibleApres: 40_000_000 },
]

const DOCS_PIECES = [
  { nom: 'EB-2026-004521 — approuvée', taille: '112 Ko', type: 'EB', date: '02/09/2026', source: 'Hérité EB', statut: 'OK' },
  { nom: 'Devis DELL Technologies.pdf', taille: '342 Ko', type: 'DEVIS', date: '12/08/2026', source: 'Hérité EB', statut: 'OK' },
  { nom: 'Devis HP Inc Cameroun.pdf', taille: '289 Ko', type: 'DEVIS', date: '12/08/2026', source: 'Hérité EB', statut: 'OK' },
  { nom: 'Note de justification.docx', taille: '124 Ko', type: 'JUSTIFICATION', date: '12/08/2026', source: 'Hérité EB', statut: 'OK' },
  { nom: 'Bon de commande BC-2026-0821.pdf', taille: '98 Ko', type: 'BON DE COMMANDE', date: '15/09/2026', source: 'Ajouté ENG', statut: 'OK' },
  { nom: 'Attestation fiscale fournisseur', taille: '—', type: 'FISCAL', date: '—', source: 'Requis', statut: 'MANQUANT' },
]

const DOCS_GENERES = [
  { nom: 'Fiche Engagement ENG-2026-000457.pdf', type: 'PDF', date: '15/09/2026 11:30', taille: '92 Ko', statut: 'Disponible' },
  { nom: 'Certificat de disponibilité des crédits.pdf', type: 'PDF', date: '15/09/2026 11:30', taille: '45 Ko', statut: 'Disponible' },
  { nom: 'Bordereau de transmission CF.pdf', type: 'PDF', date: '—', taille: '—', statut: 'En attente de visa' },
  { nom: 'Visa du Contrôleur Financier', type: 'PDF', date: '—', taille: '—', statut: 'En attente de visa' },
]

const CONTROLES = [
  { label: 'EB définitivement approuvée', ok: true, detail: 'EB-2026-004521 — Approuvée le 02/09/2026' },
  { label: 'Exercice budgétaire ouvert', ok: true, detail: 'Exercice 2026 — En cours' },
  { label: 'Ligne budgétaire valide et active', ok: true, detail: 'Lignes 310101 et 310102 actives' },
  { label: 'Crédit disponible suffisant', ok: true, detail: 'Disponible : 272M + 80M > 125M demandé' },
  { label: 'Imputation équilibrée', ok: true, detail: 'Total imputé : 125 000 000 = montant ENG' },
  { label: 'Bénéficiaire valide et conforme', ok: true, detail: 'SARL TechEquip Congo — Actif, conforme' },
  { label: 'Pièces obligatoires présentes', ok: false, warn: true, detail: 'Attestation fiscale manquante' },
  { label: 'Absence de doublon', ok: true, detail: 'Aucun doublon détecté' },
  { label: 'Cohérence PAP', ok: false, warn: false, detail: 'Ligne Hors PAP — non applicable' },
]

const OBSERVATIONS = [
  {
    date: '15/09/2026 11:28', acteur: 'Mme. Rose NKANE', role: 'Chef Service Budget', type: 'VALIDATION',
    texte: "Dossier contrôlé. Crédit disponible confirmé sur les deux lignes. Transmis au Directeur Budget pour validation finale.",
  },
  {
    date: '15/09/2026 09:40', acteur: 'M. Pascal ONDO', role: 'Expert Budget', type: 'INFO',
    texte: "Imputation vérifiée et répartie sur 2 lignes budgétaires conformément au devis. Bon de commande joint. Attestation fiscale à compléter avant transmission CF.",
  },
]

const TYPE_COLORS: Record<string, string> = {
  VALIDATION: 'text-green-600 bg-green-50 border-green-100',
  ACTION:     'text-blue-600 bg-blue-50 border-blue-100',
  AUTOMATIQUE:'text-purple-600 bg-purple-50 border-purple-100',
  INFO:       'text-slate-600 bg-slate-50 border-slate-100',
  RETOUR:     'text-orange-600 bg-orange-50 border-orange-100',
  REJET:      'text-red-600 bg-red-50 border-red-100',
}

export default function EngagementDetail({ id, onNavigate }: Props) {
  const eng = ENG_LIST.find(e => e.id === id) ?? ENG_LIST[0]
  const [activeTab, setActiveTab] = useState('synthese')
  const [showPDF, setShowPDF] = useState(false)
  const [showActionModal, setShowActionModal] = useState(false)
  const [actionType, setActionType] = useState<'VALIDER' | 'RETOURNER' | 'REJETER' | 'VISER' | null>(null)
  const [actionMotif, setActionMotif] = useState('')
  const [commentText, setCommentText] = useState('')
  const [docsPieces, setDocsPieces] = useState([...DOCS_PIECES])
  const [showDocModal, setShowDocModal] = useState(false)
  const [selectedDoc, setSelectedDoc] = useState<typeof DOCS_PIECES[0] | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [localComments, setLocalComments] = useState([...OBSERVATIONS])

  const totalSubLines = SUB_LINES.reduce((s, l) => s + l.montant, 0)
  const totalImputation = IMPUTATIONS.reduce((s, l) => s + l.montantENG, 0)

  const openAction = (type: typeof actionType) => { setActionType(type); setShowActionModal(true) }

  const handleLiquidationClick = () => {
    alert("La liquidation associée à cet engagement a été créée automatiquement.\nRéférence : LIQ-2026-000457\n\nVous serez redirigé vers le module Liquidation dès qu'il sera disponible.")
  }

  const handleAjouterPiece = () => {
    const now = new Date()
    setDocsPieces(prev => [...prev, {
      nom: `Pièce-jointe-${prev.length + 1}.pdf`,
      taille: '256 Ko',
      type: 'ANNEXE',
      date: now.toLocaleDateString('fr-FR'),
      source: 'Ajouté ENG',
      statut: 'OK',
    }])
  }

  const handleJoindrePiece = (index: number) => {
    const now = new Date()
    setDocsPieces(prev => prev.map((d, i) =>
      i === index ? { ...d, statut: 'OK', taille: '256 Ko', date: now.toLocaleDateString('fr-FR') } : d
    ))
  }

  const handlePublierCommentaire = () => {
    if (!commentText.trim()) return
    const now = new Date()
    setLocalComments(prev => [{
      date: now.toLocaleString('fr-FR'),
      acteur: 'Vous',
      role: 'Utilisateur courant',
      type: 'INFO',
      texte: commentText,
    }, ...prev])
    setCommentText('')
  }

  const budgetRevise = 475_000_000
  const dejaEngage = 82_000_000 + 15_000_000
  const montantENG = eng.montant
  const disponibleApres = budgetRevise - dejaEngage - montantENG

  return (
    <div className="flex flex-col min-h-screen bg-[#F4F7FC]">
      {/* Bandeau suivi */}
      <div className="bg-[#0B1C3E] text-white px-6 py-3">
        <div className="flex items-center justify-between max-w-[1200px] mx-auto">
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate('eng-list')} className="text-white/60 hover:text-white transition-colors">
              <ChevronLeft size={18} />
            </button>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="font-mono text-sm font-bold">{eng.reference}</span>
                <StatusBadge status={eng.status} />
                <span className={`badge text-[10px] ${eng.isPAP ? 'bg-purple-500/30 text-purple-200' : 'bg-white/20 text-white/80'}`}>
                  {eng.isPAP ? 'PAP' : 'Hors PAP'}
                </span>
              </div>
              <p className="text-white/60 text-xs truncate max-w-[300px]">{eng.objet}</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-6 text-xs">
            <div><p className="text-white/50">Étape actuelle</p><p className="font-semibold">Validation Directeur Budget</p></div>
            <div><p className="text-white/50">Acteur attendu</p><p className="font-semibold">{eng.acteurAttendu ?? 'M. Henri BONGO'}</p></div>
            <div><p className="text-white/50">Prochaine étape</p><p className="font-semibold">Transmission CF</p></div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowPDF(true)} className="btn btn-sm bg-white/10 hover:bg-white/20 text-white border-0 gap-1.5">
              <Printer size={13} /> PDF
            </button>
            {showPDF && (
              <PDFPreviewModal
                title="Certificat d'Engagement"
                subtitle={eng.objet}
                reference={eng.reference}
                docCode="RPT-CERT-ENG-001"
                onClose={() => setShowPDF(false)}
              >
                <CertificatEngagement item={eng} />
              </PDFPreviewModal>
            )}
            {eng.status === 'EN_VALIDATION_BUDGET' && (
              <>
                <button onClick={() => openAction('RETOURNER')} className="btn btn-sm bg-orange-500/80 hover:bg-orange-500 text-white border-0 gap-1.5">
                  <RotateCcw size={13} /> Retourner
                </button>
                <button onClick={() => openAction('REJETER')} className="btn btn-sm bg-red-500/80 hover:bg-red-500 text-white border-0 gap-1.5">
                  <XCircle size={13} /> Rejeter
                </button>
                <button onClick={() => openAction('VALIDER')} className="btn btn-sm bg-green-500/80 hover:bg-green-500 text-white border-0 gap-1.5">
                  <CheckCircle size={13} /> Valider
                </button>
              </>
            )}
            {eng.status === 'CONTROLE_FINANCIER' && (
              <>
                <button onClick={() => openAction('RETOURNER')} className="btn btn-sm bg-orange-500/80 hover:bg-orange-500 text-white border-0 gap-1.5">
                  <RotateCcw size={13} /> Retourner
                </button>
                <button onClick={() => openAction('VISER')} className="btn btn-sm bg-green-500/80 hover:bg-green-500 text-white border-0 gap-1.5">
                  <Shield size={13} /> Viser
                </button>
              </>
            )}
            {eng.status === 'VISE' && (
              <button
                onClick={handleLiquidationClick}
                className="btn btn-sm bg-purple-500/80 hover:bg-purple-500 text-white border-0 gap-1.5"
              >
                <ArrowRight size={13} /> Liquidation créée
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Workflow progress */}
      <div className="bg-white border-b border-slate-200 px-6 py-3">
        <div className="max-w-[1200px] mx-auto flex items-center gap-2 overflow-x-auto">
          {WF_STEPS.map((s, i) => (
            <div key={i} className="flex items-center flex-shrink-0">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
                s.status === 'done' ? 'bg-green-100 text-green-700' :
                s.status === 'current' ? 'bg-[#0B1C3E] text-white' :
                'bg-slate-100 text-slate-400'
              }`}>
                {s.status === 'done' && <CheckCircle size={11} />}
                {s.status === 'current' && <Clock size={11} />}
                {s.auto && <RefreshCw size={10} className="opacity-70" />}
                {s.label}
                {s.acteur && s.status !== 'done' && <span className="opacity-70">· {s.acteur.split(' ').slice(-1)[0]}</span>}
              </div>
              {i < WF_STEPS.length - 1 && (
                <ChevronRight size={13} className={`mx-1 flex-shrink-0 ${s.status === 'done' ? 'text-green-400' : 'text-slate-300'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* RETOURNE banner */}
      {eng.status === 'RETOURNE' && eng.motifRetour && (
        <div className="bg-orange-50 border-b border-orange-200 px-6 py-4">
          <div className="max-w-[1200px] mx-auto">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <RotateCcw size={15} className="text-orange-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-orange-800 text-sm">Engagement retourné pour correction</span>
                  <span className="text-xs text-orange-500">par {eng.acteurRetour} · le {eng.dateRetour}</span>
                </div>
                <p className="text-sm text-orange-700 leading-relaxed mb-3">{eng.motifRetour}</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="btn btn-sm gap-1.5 bg-orange-600 text-white border-0 hover:bg-orange-700"
                  >
                    <FileText size={13} /> Corriger et retransmettre
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REJETE banner */}
      {eng.status === 'REJETE' && eng.motifRejet && (
        <div className="bg-red-50 border-b border-red-200 px-6 py-4">
          <div className="max-w-[1200px] mx-auto">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <XCircle size={15} className="text-red-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-red-800 text-sm">Engagement rejeté définitivement</span>
                  <span className="text-xs text-red-500">par {eng.acteurRejet} · le {eng.dateRejet}</span>
                </div>
                <p className="text-sm text-red-700 leading-relaxed">{eng.motifRejet}</p>
                <p className="text-xs text-red-500 mt-2 font-medium">La réservation budgétaire a été libérée. Ce dossier ne peut plus être modifié ni resoumis.</p>
              </div>
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
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`tab-item flex items-center gap-1.5 whitespace-nowrap ${activeTab === tab.id ? 'active' : ''}`}
              >
                <Icon size={12} /> {tab.label}
                {tab.id === 'pieces' && DOCS_PIECES.some(d => d.statut === 'MANQUANT') && (
                  <span className="w-2 h-2 bg-orange-400 rounded-full" />
                )}
                {tab.id === 'controles' && CONTROLES.some(c => !c.ok && !c.warn) && (
                  <span className="w-2 h-2 bg-orange-400 rounded-full" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 max-w-[1200px] mx-auto w-full">

        {/* SYNTHÈSE */}
        {activeTab === 'synthese' && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="card sm:col-span-2 space-y-3">
                <h3 className="section-title">Identification de l'opération</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase mb-1">Référence Engagement</p>
                    <p className="font-mono font-bold text-[#0B1C3E]">{eng.reference}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase mb-1">EB source</p>
                    <button onClick={() => onNavigate('eb-detail', eng.ebReference)} className="font-mono text-blue-600 hover:underline font-semibold">
                      {eng.ebReference}
                    </button>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase mb-1">Structure</p>
                    <p className="text-slate-700">{eng.structure}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase mb-1">Date de génération</p>
                    <p className="text-slate-700">{eng.dateCreation}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase mb-1">Type</p>
                    <span className={`badge text-[10px] ${eng.isPAP ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'}`}>
                      {eng.isPAP ? 'PAP — Budget programme' : 'HORS PAP — Budget ordinaire'}
                    </span>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase mb-1">Bénéficiaire</p>
                    <p className="text-slate-700">{eng.tiers}</p>
                  </div>
                </div>
                <div className="pt-3 border-t border-slate-100">
                  <p className="text-[10px] text-slate-400 uppercase mb-1">Objet</p>
                  <p className="text-slate-800 font-medium">{eng.objet}</p>
                </div>
              </div>

              {/* Carte situation budgétaire */}
              <div className="card space-y-3">
                <h3 className="section-title">Situation budgétaire</h3>
                <div className="space-y-2">
                  {[
                    { label: 'Budget révisé', value: budgetRevise, color: '#0B1C3E' },
                    { label: 'Déjà engagé', value: dejaEngage, color: '#D97706' },
                    { label: "Présent engagement", value: montantENG, color: '#DC2626' },
                  ].map(item => (
                    <div key={item.label} className="flex justify-between items-center text-xs">
                      <span className="text-slate-500">{item.label}</span>
                      <span className="font-mono font-semibold" style={{ color: item.color }}>{fmt(item.value)}</span>
                    </div>
                  ))}
                  <div className="border-t border-slate-200 pt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-slate-700">Disponible après</span>
                      <span className={`text-base font-bold ${disponibleApres >= 0 ? 'text-[#1A6B3A]' : 'text-red-600'}`}>
                        {fmt(disponibleApres)}
                      </span>
                    </div>
                    <div className="mt-2 h-2 bg-slate-200 rounded-full overflow-hidden flex">
                      <div className="h-full bg-orange-400" style={{ width: `${(dejaEngage / budgetRevise) * 100}%` }} />
                      <div className="h-full bg-red-400" style={{ width: `${(montantENG / budgetRevise) * 100}%` }} />
                    </div>
                    <div className="flex gap-3 mt-1 text-[10px] text-slate-400">
                      <span className="flex items-center gap-1"><span className="w-2 h-2 bg-orange-400 rounded-full inline-block" />Déjà engagé</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 bg-red-400 rounded-full inline-block" />Présent ENG</span>
                    </div>
                  </div>
                </div>
                <div className={`p-2 rounded text-xs font-semibold text-center ${disponibleApres >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {disponibleApres >= 0 ? '✓ Crédit disponible' : '⛔ Crédit insuffisant'}
                </div>
              </div>
            </div>

            {/* Dernières observations */}
            <div className="card">
              <h3 className="section-title mb-3">Dernières observations</h3>
              <div className="space-y-3">
                {OBSERVATIONS.slice(0, 2).map((obs, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 text-xs font-bold text-slate-500">
                      {obs.acteur.split(' ').filter(w => w.match(/^[A-Z]/)).slice(0, 2).join('')}
                    </div>
                    <div className={`flex-1 rounded-lg p-3 border ${TYPE_COLORS[obs.type] ?? 'bg-slate-50 border-slate-100'}`}>
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs font-semibold">{obs.acteur} <span className="font-normal opacity-70">· {obs.role}</span></p>
                        <p className="text-[10px] opacity-60">{obs.date}</p>
                      </div>
                      <p className="text-xs">{obs.texte}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Délai */}
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="section-title">Suivi des délais</h3>
                  <p className="text-xs text-slate-500 mt-1">Au niveau Directeur Budget depuis <span className="font-semibold text-orange-600">1 j 4 h</span></p>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  {[
                    { label: 'Expert Budget', duree: '1 j', ok: true },
                    { label: 'Chef Service', duree: '2 h', ok: true },
                    { label: 'Dir. Budget', duree: '1 j 4 h', ok: false },
                    { label: 'CF', duree: '—', ok: null },
                  ].map((item, i) => (
                    <div key={i} className={`px-2.5 py-1.5 rounded-lg text-center ${item.ok === true ? 'bg-green-50' : item.ok === false ? 'bg-orange-50' : 'bg-slate-50'}`}>
                      <p className="text-[10px] text-slate-400">{item.label}</p>
                      <p className={`font-semibold text-sm ${item.ok === true ? 'text-green-700' : item.ok === false ? 'text-orange-600' : 'text-slate-400'}`}>{item.duree}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* EXPRESSION DE BESOIN */}
        {activeTab === 'eb' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="section-title">Expression de Besoin source</h3>
                <p className="text-xs text-slate-500 mt-0.5">Données héritées — lecture seule</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="badge bg-slate-100 text-slate-600 gap-1 text-[10px]"><Lock size={10} /> Verrouillé</span>
                <button onClick={() => onNavigate('eb-detail', eng.ebReference)} className="btn btn-outline btn-sm gap-1.5">
                  <Eye size={12} /> Voir l'EB complète
                </button>
              </div>
            </div>
            <div className="card bg-slate-50/50 border-l-4 border-l-blue-300 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                <div><p className="text-[10px] text-slate-400 uppercase mb-1">Référence EB</p><p className="font-mono font-bold text-blue-700">{eng.ebReference}</p></div>
                <div><p className="text-[10px] text-slate-400 uppercase mb-1">Date approbation</p><p className="text-slate-700">02/09/2026</p></div>
                <div><p className="text-[10px] text-slate-400 uppercase mb-1">Statut EB</p><span className="badge bg-green-100 text-green-700">Approuvée</span></div>
                <div><p className="text-[10px] text-slate-400 uppercase mb-1">Initiateur</p><p className="text-slate-700">M. Jean-Baptiste ONDO</p></div>
                <div><p className="text-[10px] text-slate-400 uppercase mb-1">Structure</p><p className="text-slate-700">{eng.structure}</p></div>
                <div><p className="text-[10px] text-slate-400 uppercase mb-1">Montant EB approuvé</p><p className="font-mono font-bold text-[#0B1C3E]">{fmt(eng.montant)}</p></div>
              </div>
              <div className="pt-3 border-t border-slate-200">
                <p className="text-[10px] text-slate-400 uppercase mb-1">Objet</p>
                <p className="text-slate-800 font-medium">{eng.objet}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase mb-1">Justification</p>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Le parc informatique de la Direction des Technologies de l'Information (DTIC) est composé en grande majorité d'équipements acquis entre 2016 et 2018, dont la durée de vie utile est largement dépassée.
                  Ce renouvellement partiel permettra de doter les agents-clés d'outils conformes aux standards actuels.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* BUDGET & IMPUTATIONS */}
        {activeTab === 'budget' && (
          <div className="space-y-5">
            {/* Situation globale */}
            <div className="card">
              <h3 className="section-title mb-4">Situation budgétaire globale</h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {[
                  { label: 'Budget initial', value: budgetRevise, color: '#0B1C3E' },
                  { label: 'Mouvements', value: 0, color: '#64748B' },
                  { label: 'Budget révisé', value: budgetRevise, color: '#0B1C3E' },
                  { label: 'Engagements antérieurs', value: dejaEngage, color: '#D97706' },
                  { label: 'Disponible avant ENG', value: budgetRevise - dejaEngage, color: '#1A6B3A' },
                ].map(item => (
                  <div key={item.label} className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                    <p className="text-[10px] uppercase tracking-wide text-slate-400 mb-1">{item.label}</p>
                    <p className="text-sm font-bold" style={{ color: item.color }}>{fmt(item.value)}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-4 bg-[#0B1C3E]/5 rounded-lg border border-[#0B1C3E]/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-[#0B1C3E]">Présent engagement</p>
                    <p className="text-xs text-slate-500">Impact sur le budget</p>
                  </div>
                  <p className="text-2xl font-bold text-[#0B1C3E]">{fmt(montantENG)}</p>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#0B1C3E]/10">
                  <p className="text-sm font-semibold text-[#1A6B3A]">Disponible après engagement</p>
                  <p className="text-xl font-bold text-[#1A6B3A]">{fmt(disponibleApres)}</p>
                </div>
              </div>
            </div>

            {/* Imputation multi-lignes */}
            <div className="card p-0 overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                <h3 className="section-title">Imputation budgétaire ({IMPUTATIONS.length} lignes)</h3>
                <div className={`badge text-xs ${totalImputation === montantENG ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                  {totalImputation === montantENG ? '✓ Équilibrée' : `Écart : ${fmt(Math.abs(totalImputation - montantENG))}`}
                </div>
              </div>
              <table className="data-table text-xs w-full">
                <thead>
                  <tr>
                    <th className="text-left">Ligne</th>
                    <th className="text-left">Libellé</th>
                    <th className="text-right">Budget révisé</th>
                    <th className="text-right">Disponible</th>
                    <th className="text-right">Montant ENG</th>
                    <th className="text-right">Disponible après</th>
                    <th className="text-center">État</th>
                  </tr>
                </thead>
                <tbody>
                  {IMPUTATIONS.map((imp, i) => (
                    <tr key={i}>
                      <td className="font-mono font-semibold text-[#0B1C3E]">{imp.code}</td>
                      <td>{imp.libelle}</td>
                      <td className="text-right font-mono">{fmt(imp.budgetRevise)}</td>
                      <td className="text-right font-mono text-[#1A6B3A]">{fmt(imp.disponible)}</td>
                      <td className="text-right font-mono font-bold text-[#0B1C3E]">{fmt(imp.montantENG)}</td>
                      <td className={`text-right font-mono font-bold ${imp.disponibleApres >= 0 ? 'text-[#1A6B3A]' : 'text-red-600'}`}>{fmt(imp.disponibleApres)}</td>
                      <td className="text-center">
                        <span className={`badge text-[10px] ${imp.disponibleApres >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {imp.disponibleApres >= 0 ? 'OK' : 'KO'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-[#0B1C3E]/5 font-bold">
                    <td colSpan={4} className="text-right text-sm pr-3 py-3">Total</td>
                    <td className="text-right font-mono text-sm text-[#0B1C3E] py-3">{fmt(totalImputation)}</td>
                    <td colSpan={2} />
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Réservation budgétaire */}
            <div className="card">
              <h3 className="section-title mb-3">Réservation budgétaire</h3>
              <div className="flex items-start gap-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <Lock size={14} className="text-green-700" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-green-700">Crédit réservé — {fmt(montantENG)}</p>
                  <p className="text-xs text-green-600 mt-0.5">
                    Réservé le 15/09/2026 à 09:20 · Lignes 310101 + 310102 · Réf. {eng.reference}
                  </p>
                  <p className="text-xs text-green-600 mt-0.5">
                    La réservation sera libérée uniquement en cas d'annulation formelle de l'engagement.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DÉTAIL */}
        {activeTab === 'detail' && (
          <div className="card p-0 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="section-title">Détail des prestations</h3>
                <p className="text-xs text-slate-400 mt-0.5">Hérité de l'EB approuvée — lecture seule</p>
              </div>
              <span className="badge bg-slate-100 text-slate-600 gap-1 text-[10px]"><Lock size={10} /> Hérité EB</span>
            </div>
            <table className="data-table text-xs w-full">
              <thead>
                <tr>
                  <th className="text-left">#</th>
                  <th className="text-left">Désignation</th>
                  <th className="text-center">Qté</th>
                  <th className="text-center">Unité</th>
                  <th className="text-right">Prix unitaire</th>
                  <th className="text-right">Montant XAF</th>
                </tr>
              </thead>
              <tbody>
                {SUB_LINES.map((line, idx) => (
                  <tr key={idx}>
                    <td className="text-slate-400">{idx + 1}</td>
                    <td className="font-medium text-slate-800">{line.designation}</td>
                    <td className="text-center">{line.qte}</td>
                    <td className="text-center text-slate-500">{line.unite}</td>
                    <td className="text-right font-mono">{new Intl.NumberFormat('fr-FR').format(line.pu)}</td>
                    <td className="text-right font-mono font-bold text-[#0B1C3E]">{new Intl.NumberFormat('fr-FR').format(line.montant)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-[#0B1C3E]/5 font-bold">
                  <td colSpan={5} className="text-right pr-3 py-3 text-sm">Total général</td>
                  <td className="text-right font-mono text-[#0B1C3E] font-bold py-3">{fmt(totalSubLines)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}

        {/* BÉNÉFICIAIRE */}
        {activeTab === 'beneficiaire' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="card sm:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="section-title">Fiche bénéficiaire</h3>
                  <button onClick={() => onNavigate('tiers')} className="btn btn-outline btn-sm gap-1.5">
                    <Eye size={12} /> Fiche complète
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><p className="text-[10px] text-slate-400 uppercase mb-1">Raison sociale</p><p className="font-semibold text-[#0B1C3E]">{eng.tiers}</p></div>
                  <div><p className="text-[10px] text-slate-400 uppercase mb-1">Type</p><span className="badge bg-blue-50 text-blue-700">Fournisseur</span></div>
                  <div><p className="text-[10px] text-slate-400 uppercase mb-1">RCCM</p><p className="font-mono text-slate-700">CG-BZV-2019-B-00341</p></div>
                  <div><p className="text-[10px] text-slate-400 uppercase mb-1">NIF</p><p className="font-mono text-slate-700">M20190001234C</p></div>
                  <div><p className="text-[10px] text-slate-400 uppercase mb-1">Adresse</p><p className="text-slate-700">Av. de l'Indépendance, Brazzaville, Congo</p></div>
                  <div><p className="text-[10px] text-slate-400 uppercase mb-1">Contact</p><p className="text-slate-700">+242 06 123 45 67</p></div>
                  <div><p className="text-[10px] text-slate-400 uppercase mb-1">Banque</p><p className="text-slate-700">BGFI Bank Congo</p></div>
                  <div><p className="text-[10px] text-slate-400 uppercase mb-1">N° de compte</p><p className="font-mono text-slate-700">CG00 4002 1234 5678 9012 345</p></div>
                </div>
              </div>
              <div className="card space-y-3">
                <h3 className="section-title">Conformité</h3>
                <div className="space-y-2">
                  {[
                    { label: 'Actif au référentiel', ok: true },
                    { label: 'Documents valides', ok: true },
                    { label: 'Informations fiscales', ok: true },
                    { label: 'Compte bancaire validé', ok: true },
                    { label: 'Attestation fiscale à jour', ok: false, warn: true, detail: 'Expire le 30/11/2026' },
                    { label: 'Pas suspendu', ok: true },
                  ].map((item, i) => (
                    <div key={i} className={`flex items-start gap-2 p-2 rounded text-xs ${item.ok ? 'bg-green-50' : item.warn ? 'bg-orange-50' : 'bg-red-50'}`}>
                      {item.ok
                        ? <Check size={12} className="text-green-600 mt-0.5 flex-shrink-0" />
                        : item.warn
                        ? <AlertTriangle size={12} className="text-orange-500 mt-0.5 flex-shrink-0" />
                        : <XCircle size={12} className="text-red-500 mt-0.5 flex-shrink-0" />}
                      <div>
                        <p className={`font-medium ${item.ok ? 'text-green-700' : item.warn ? 'text-orange-700' : 'text-red-700'}`}>{item.label}</p>
                        {'detail' in item && item.detail && <p className="text-[10px] mt-0.5 opacity-80">{item.detail}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MARCHÉ / CONTRAT */}
        {activeTab === 'marche' && (
          <div className="space-y-4">
            <div className="card p-5">
              <h3 className="section-title mb-4">Informations marché / contrat</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-400 text-xs mb-0.5">Référence marché</p>
                  <p className="font-medium text-slate-800">MAR-2026-{eng.id.replace('ENG-', '')}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs mb-0.5">Titulaire du marché</p>
                  <p className="font-medium text-slate-800">{eng.tiers}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs mb-0.5">Type de procédure</p>
                  <p className="font-medium text-slate-800">{eng.montant > 50_000_000 ? 'Appel d\'offres ouvert' : 'Demande de cotation'}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs mb-0.5">Montant contractuel</p>
                  <p className="font-bold text-[#0B1C3E]">{fmt(eng.montant)}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs mb-0.5">Date de signature</p>
                  <p className="font-medium text-slate-800">{eng.dateCreation}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs mb-0.5">Délai d'exécution</p>
                  <p className="font-medium text-slate-800">90 jours à compter de la notification</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs mb-0.5">Lot / Tranche</p>
                  <p className="font-medium text-slate-800">Lot unique — Tranche ferme</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs mb-0.5">Caution de bonne exécution</p>
                  <p className="font-medium text-slate-800">{fmt(Math.round(eng.montant * 0.05))} (5%)</p>
                </div>
              </div>
            </div>
            <div className="card p-5">
              <h3 className="section-title mb-4">Documents contractuels</h3>
              <table className="data-table text-xs w-full">
                <thead>
                  <tr>
                    <th className="text-left">Document</th>
                    <th className="text-left">Statut</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { nom: 'Contrat signé', statut: 'Disponible' },
                    { nom: 'Cahier des charges', statut: 'Disponible' },
                    { nom: 'Offre technique du titulaire', statut: 'Disponible' },
                    { nom: 'Offre financière du titulaire', statut: 'Disponible' },
                    { nom: 'Caution de bonne exécution', statut: eng.status === 'GENERE' || eng.status === 'EN_PREPARATION' ? 'En attente' : 'Disponible' },
                    { nom: 'Procès-verbal de démarrage', statut: 'En attente' },
                  ].map((doc, i) => (
                    <tr key={i}>
                      <td className="flex items-center gap-2">
                        <FileText size={13} className="text-slate-400" />
                        <span className="font-medium text-slate-800">{doc.nom}</span>
                      </td>
                      <td>
                        <span className={`badge text-[10px] ${doc.statut === 'Disponible' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                          {doc.statut}
                        </span>
                      </td>
                      <td className="text-center">
                        {doc.statut === 'Disponible' && (
                          <button className="btn btn-sm btn-outline gap-1"><Eye size={11} /> Voir</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PAP */}
        {activeTab === 'pap' && (
          <div className="space-y-4">
            {eng.isPAP ? (
              <div className="card space-y-4">
                <h3 className="section-title">Référentiel programmatique PAP</h3>
                <div className="space-y-2">
                  {[
                    { label: 'Pilier', value: 'Pilier 2 — Intégration Économique', color: '#0B1C3E' },
                    { label: 'Axe stratégique', value: 'Axe 2.1 — Commerce régional', color: '#1A6B3A' },
                    { label: 'Produit attendu', value: 'Prod. 2.1.3 — Promotion des exportations', color: '#2563EB' },
                    { label: 'Activité', value: 'Act. 2.1.3.2 — Missions de promotion', color: '#7C3AED' },
                  ].map(item => (
                    <div key={item.label} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                      <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: item.color }} />
                      <div>
                        <p className="text-[10px] uppercase tracking-wide text-slate-400">{item.label}</p>
                        <p className="text-sm font-medium mt-0.5" style={{ color: item.color }}>{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="card text-center py-12 text-slate-400">
                <Target size={32} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">Engagement Hors PAP — aucun référentiel programmatique applicable.</p>
              </div>
            )}
          </div>
        )}

        {/* PIÈCES JOINTES */}
        {activeTab === 'pieces' && (
          <div className="card p-0 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <h3 className="section-title">Pièces justificatives</h3>
              <button onClick={handleAjouterPiece} className="btn btn-outline btn-sm gap-1.5"><Paperclip size={12} /> Ajouter</button>
            </div>
            <table className="data-table text-xs w-full">
              <thead>
                <tr>
                  <th className="text-left">Document</th>
                  <th className="text-left">Type</th>
                  <th className="text-left">Source</th>
                  <th className="text-left">Date</th>
                  <th className="text-right">Taille</th>
                  <th className="text-center">Statut</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {docsPieces.map((doc, i) => (
                  <tr key={i} className={doc.statut === 'MANQUANT' ? 'bg-orange-50/50' : ''}>
                    <td className="flex items-center gap-2">
                      <FileText size={14} className={doc.statut === 'MANQUANT' ? 'text-orange-400' : 'text-slate-400'} />
                      <span className={`font-medium ${doc.statut === 'MANQUANT' ? 'text-orange-700' : 'text-slate-800'}`}>{doc.nom}</span>
                    </td>
                    <td><span className="badge bg-blue-50 text-blue-700">{doc.type}</span></td>
                    <td>
                      <span className={`badge text-[10px] ${doc.source === 'Hérité EB' ? 'bg-slate-100 text-slate-600' : doc.source === 'Requis' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                        {doc.source}
                      </span>
                    </td>
                    <td className="text-slate-500">{doc.date}</td>
                    <td className="text-right text-slate-500">{doc.taille}</td>
                    <td className="text-center">
                      <span className={`badge text-[10px] ${doc.statut === 'OK' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                        {doc.statut === 'OK' ? '✓ Présent' : '⚠ Manquant'}
                      </span>
                    </td>
                    <td className="text-center">
                      {doc.statut === 'OK'
                        ? <button
                            onClick={() => { setSelectedDoc(doc); setShowDocModal(true) }}
                            className="btn btn-sm btn-outline gap-1"
                          ><Eye size={11} /> Voir</button>
                        : <button
                            onClick={() => handleJoindrePiece(i)}
                            className="btn btn-sm bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100 gap-1"
                          ><Paperclip size={11} /> Joindre</button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* CONTRÔLES */}
        {activeTab === 'controles' && (
          <div className="space-y-4">
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="section-title">Contrôles automatiques</h3>
                <span className="text-xs text-slate-400">Dernière vérification : 15/09/2026 11:25</span>
              </div>
              <div className="space-y-2">
                {CONTROLES.map((ctrl, i) => (
                  <div key={i} className={`flex items-start gap-3 p-3 rounded-lg border ${
                    ctrl.ok ? 'bg-green-50 border-green-100' :
                    ctrl.warn ? 'bg-orange-50 border-orange-100' :
                    'bg-slate-50 border-slate-100'
                  }`}>
                    <div className="flex-shrink-0 mt-0.5">
                      {ctrl.ok
                        ? <CheckCircle size={15} className="text-green-600" />
                        : ctrl.warn
                        ? <AlertTriangle size={15} className="text-orange-500" />
                        : <RefreshCw size={15} className="text-slate-400" />}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${ctrl.ok ? 'text-green-700' : ctrl.warn ? 'text-orange-700' : 'text-slate-500'}`}>
                        {ctrl.label}
                      </p>
                      <p className={`text-xs mt-0.5 ${ctrl.ok ? 'text-green-600' : ctrl.warn ? 'text-orange-600' : 'text-slate-400'}`}>
                        {ctrl.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Espace Contrôleur Financier */}
            {eng.status === 'CONTROLE_FINANCIER' && (
              <div className="card border-l-4 border-l-purple-500">
                <h3 className="section-title mb-3">Espace Contrôleur Financier</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Vous avez reçu ce dossier pour contrôle et visa. Vérifiez chaque élément avant d'émettre votre décision.
                </p>
                <div className="flex gap-3 flex-wrap">
                  <button onClick={() => openAction('RETOURNER')} className="btn btn-outline gap-1.5 text-orange-600 border-orange-300 hover:bg-orange-50">
                    <RotateCcw size={14} /> Retourner pour correction
                  </button>
                  <button onClick={() => openAction('REJETER')} className="btn btn-outline gap-1.5 text-red-600 border-red-300 hover:bg-red-50">
                    <XCircle size={14} /> Rejeter
                  </button>
                  <button onClick={() => openAction('VISER')} className="btn btn-primary gap-1.5">
                    <Shield size={14} /> Viser l'engagement
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* WORKFLOW */}
        {activeTab === 'workflow' && (
          <div className="space-y-5">
            <div className="card">
              <h3 className="section-title mb-5">Progression du dossier</h3>
              <div className="relative pl-6">
                <div className="absolute left-[11px] top-0 bottom-0 w-px bg-slate-200" />
                {WF_STEPS.map((s, i) => (
                  <div key={i} className="relative flex items-start gap-4 mb-6 last:mb-0">
                    <div className={`relative z-10 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                      s.status === 'done' ? 'bg-green-500' :
                      s.status === 'current' ? 'bg-[#0B1C3E]' :
                      'bg-white border-2 border-slate-200'
                    }`}>
                      {s.status === 'done' && <CheckCircle size={12} className="text-white" />}
                      {s.status === 'current' && <Clock size={10} className="text-white" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className={`text-sm font-semibold ${s.status === 'pending' ? 'text-slate-400' : 'text-slate-800'}`}>{s.label}</p>
                        {s.date && <p className="text-xs text-slate-400">{s.date}</p>}
                        {s.status === 'current' && <span className="badge bg-orange-100 text-orange-700 text-[10px]">En attente</span>}
                      </div>
                      {s.acteur && <p className="text-xs text-slate-500 mt-0.5">{s.acteur}</p>}
                      {s.auto && <p className="text-[10px] text-purple-500 mt-0.5">Génération automatique par le système</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action panel for Directeur Budget */}
            {eng.status === 'EN_VALIDATION_BUDGET' && (
              <div className="card border-l-4 border-l-[#D4A017]">
                <h3 className="section-title mb-3">Action requise — Directeur Budget</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Ce dossier a été contrôlé par le Service Budget et attend votre validation pour être transmis automatiquement au Contrôleur Financier.
                </p>
                <div className="flex gap-3">
                  <button onClick={() => openAction('RETOURNER')} className="btn btn-outline gap-1.5 text-orange-600 border-orange-300 hover:bg-orange-50">
                    <RotateCcw size={14} /> Retourner
                  </button>
                  <button onClick={() => openAction('REJETER')} className="btn btn-outline gap-1.5 text-red-600 border-red-300 hover:bg-red-50">
                    <XCircle size={14} /> Rejeter
                  </button>
                  <button onClick={() => openAction('VALIDER')} className="btn btn-primary gap-1.5">
                    <CheckCircle size={14} /> Valider → Transmission CF auto
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 mt-3">
                  Après validation, l'engagement sera transmis automatiquement au Contrôleur Financier sans action supplémentaire.
                </p>
              </div>
            )}
          </div>
        )}

        {/* HISTORIQUE */}
        {activeTab === 'historique' && (
          <div className="card">
            <h3 className="section-title mb-4">Journal des événements</h3>
            <div className="space-y-3">
              {HISTORY.map((evt, i) => (
                <div key={i} className={`flex gap-3 p-3 rounded-lg border ${TYPE_COLORS[evt.type] ?? 'bg-slate-50 border-slate-100'}`}>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold opacity-70">
                    {evt.type === 'VALIDATION' && <CheckCircle size={13} />}
                    {evt.type === 'ACTION' && <Send size={13} />}
                    {evt.type === 'AUTOMATIQUE' && <RefreshCw size={13} />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{evt.action}</p>
                      <p className="text-[10px] opacity-60 flex-shrink-0 ml-2">{evt.date}</p>
                    </div>
                    <p className="text-xs opacity-70 mt-0.5">{evt.acteur} · {evt.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DOCUMENTS GÉNÉRÉS */}
        {activeTab === 'documents' && (
          <div className="card p-0 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <h3 className="section-title">Documents officiels</h3>
              <button onClick={() => setShowPDF(true)} className="btn btn-primary btn-sm gap-1.5"><Printer size={12} /> Générer</button>
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
                    <td><span className="badge bg-red-50 text-red-700">{doc.type}</span></td>
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
            <div className="card space-y-4">
              <h3 className="section-title">Observations et commentaires</h3>
              {localComments.map((obs, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 text-xs font-bold text-slate-500">
                    {obs.acteur.split(' ').filter(w => w.match(/^[A-Z]/)).slice(0, 2).join('')}
                  </div>
                  <div className={`flex-1 rounded-lg p-3 border ${TYPE_COLORS[obs.type] ?? 'bg-slate-50 border-slate-100'}`}>
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-xs font-semibold">
                        {obs.acteur} <span className="font-normal opacity-70">· {obs.role}</span>
                      </p>
                      <p className="text-[10px] opacity-60">{obs.date}</p>
                    </div>
                    <p className="text-xs">{obs.texte}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="card">
              <p className="text-sm font-semibold text-slate-700 mb-3">Ajouter un commentaire</p>
              <textarea
                className="form-input min-h-[80px] resize-none text-sm"
                placeholder="Votre observation ou remarque..."
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
              />
              <div className="flex justify-end mt-3">
                <button
                  disabled={!commentText.trim()}
                  onClick={handlePublierCommentaire}
                  className="btn btn-primary btn-sm gap-1.5 disabled:opacity-40"
                >
                  <Send size={13} /> Publier
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Document preview modal */}
      {showDocModal && selectedDoc && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="card max-w-lg w-full space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[#0B1C3E] text-sm">Aperçu du document</h3>
              <button onClick={() => setShowDocModal(false)} className="text-slate-400 hover:text-slate-700"><XCircle size={20} /></button>
            </div>
            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <FileText size={32} className="text-red-500 flex-shrink-0 mt-1" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-800 text-sm truncate">{selectedDoc.nom}</p>
                <div className="flex flex-wrap gap-3 mt-2 text-xs text-slate-500">
                  <span><span className="font-medium">Type :</span> {selectedDoc.type}</span>
                  <span><span className="font-medium">Taille :</span> {selectedDoc.taille}</span>
                  <span><span className="font-medium">Date :</span> {selectedDoc.date}</span>
                  <span><span className="font-medium">Source :</span> {selectedDoc.source}</span>
                </div>
              </div>
            </div>
            <div className="h-48 bg-slate-100 rounded-lg flex flex-col items-center justify-center text-slate-400 border border-dashed border-slate-300">
              <FileText size={40} className="mb-2 opacity-30" />
              <p className="text-sm font-medium">Aperçu non disponible en mode démo</p>
              <p className="text-xs mt-1">Le document serait affiché ici en production</p>
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowDocModal(false)} className="btn btn-outline btn-sm">Fermer</button>
              <button className="btn btn-primary btn-sm gap-1.5"><Download size={13} /> Télécharger</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Corriger et retransmettre */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="card max-w-md w-full space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[#0B1C3E]">Corriger et retransmettre</h3>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-slate-700"><XCircle size={20} /></button>
            </div>
            <div className="flex gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <AlertTriangle size={15} className="text-orange-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-orange-700">
                Veuillez apporter les corrections demandées avant de retransmettre le dossier au circuit de validation. Le motif de retour est rappelé ci-dessus.
              </p>
            </div>
            {eng.motifRetour && (
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700">
                <p className="font-semibold text-slate-500 mb-1">Motif du retour :</p>
                <p className="italic">{eng.motifRetour}</p>
              </div>
            )}
            <div>
              <label className="form-label">Commentaire de correction</label>
              <textarea
                className="form-input min-h-[80px] resize-none text-sm"
                placeholder="Décrivez les corrections apportées..."
              />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowEditModal(false)} className="btn btn-outline flex-1">Annuler</button>
              <button
                onClick={() => setShowEditModal(false)}
                className="btn flex-1 gap-1.5 bg-orange-600 text-white hover:bg-orange-700"
              >
                <Send size={14} /> Retransmettre
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action Modal */}
      {showActionModal && actionType && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="card max-w-md w-full space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[#0B1C3E]">
                {actionType === 'VALIDER' ? 'Valider et transmettre au CF' :
                 actionType === 'VISER' ? 'Émettre le visa CF' :
                 actionType === 'RETOURNER' ? 'Retourner pour correction' : 'Rejeter le dossier'}
              </h3>
              <button onClick={() => setShowActionModal(false)} className="text-slate-400 hover:text-slate-700"><XCircle size={20} /></button>
            </div>
            {actionType === 'VALIDER' && (
              <div className="flex gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <RefreshCw size={15} className="text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-700">
                  Après validation, l'engagement sera transmis <strong>automatiquement</strong> au Contrôleur Financier. Aucune action supplémentaire ne sera nécessaire.
                </p>
              </div>
            )}
            {actionType === 'VISER' && (
              <div className="flex gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <Shield size={15} className="text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-green-700">
                  Le visa sera enregistré avec horodatage. La Liquidation sera créée automatiquement et les documents archivés dans la GED.
                </p>
              </div>
            )}
            <div>
              <label className="form-label">
                {actionType === 'VALIDER' || actionType === 'VISER' ? 'Observation (optionnel)' : 'Motif *'}
              </label>
              <textarea
                className="form-input min-h-[80px] resize-none"
                placeholder={actionType === 'RETOURNER' ? 'Précisez les corrections attendues...' : actionType === 'REJETER' ? 'Motif détaillé du rejet...' : 'Observation éventuelle...'}
                value={actionMotif}
                onChange={e => setActionMotif(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowActionModal(false)} className="btn btn-outline flex-1">Annuler</button>
              <button
                onClick={() => setShowActionModal(false)}
                disabled={(actionType === 'RETOURNER' || actionType === 'REJETER') && !actionMotif.trim()}
                className={`btn flex-1 gap-1.5 disabled:opacity-40 ${
                  actionType === 'VALIDER' ? 'btn-primary' :
                  actionType === 'VISER' ? 'bg-green-600 text-white hover:bg-green-700' :
                  actionType === 'RETOURNER' ? 'bg-orange-500 text-white hover:bg-orange-600' :
                  'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                {actionType === 'VALIDER' && <><CheckCircle size={14} /> Valider</>}
                {actionType === 'VISER' && <><Shield size={14} /> Viser</>}
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
