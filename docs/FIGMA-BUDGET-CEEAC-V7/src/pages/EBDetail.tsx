import { useState } from 'react'
import {
  FileText, Download, CheckCircle, XCircle, RotateCcw, MessageSquare,
  Paperclip, Clock, User, ArrowRight, AlertTriangle, Building2,
  ChevronLeft, ChevronRight, Send, Eye, Printer, History, GitBranch,
  Target, DollarSign, Shield, TrendingUp,
} from 'lucide-react'
import type { Page } from '../types'
import { EB_LIST } from '../data/mock'
import StatusBadge, { PriorityBadge } from '../components/StatusBadge'
import PDFPreviewModal from '../components/PDFPreviewModal'
import FicheEB from '../components/pdf/FicheEB'

const fmt = (n: number) =>
  new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(n) + ' XAF'

interface Props {
  id: string
  onNavigate: (page: Page, id?: string) => void
}

const TABS = [
  { id: 'synthese',    label: 'Synthèse',           icon: Eye },
  { id: 'detail',      label: 'Détail du besoin',   icon: FileText },
  { id: 'budget',      label: 'Budget',             icon: DollarSign },
  { id: 'pap',         label: 'PAP',                icon: Target },
  { id: 'pieces',      label: 'Pièces jointes',     icon: Paperclip },
  { id: 'workflow',    label: 'Workflow',            icon: GitBranch },
  { id: 'historique',  label: 'Historique',         icon: History },
  { id: 'documents',   label: 'Documents générés',  icon: Printer },
  { id: 'commentaires',label: 'Commentaires',       icon: MessageSquare },
]

const WF_STEPS = [
  { label: 'Initiation', status: 'done' as const, acteur: 'M. Jean-Baptiste ONDO', role: 'Expert DTIC', date: '12/08/2026' },
  { label: 'Validation Directeur', status: 'done' as const, acteur: 'Mme. Claire BONGO', role: 'Directrice DTIC', date: '14/08/2026' },
  { label: 'Validation DGA', status: 'current' as const, acteur: 'M. Richard NKOGHE', role: 'Directeur Général Adjoint', date: undefined },
  { label: 'Approbation SG', status: 'pending' as const, acteur: undefined, role: undefined, date: undefined },
  { label: 'Approbation Ordonnateur', status: 'pending' as const, acteur: undefined, role: undefined, date: undefined },
]

const HISTORY = [
  { date: '02/09/2026 14:32', action: 'Envoi au DGA pour validation', acteur: 'Mme. Claire BONGO', role: 'Directrice DTIC', type: 'VALIDATION', motif: '' },
  { date: '14/08/2026 09:15', action: 'Validation hiérarchique niveau 1', acteur: 'Mme. Claire BONGO', role: 'Directrice DTIC', type: 'VALIDATION', motif: 'Besoin urgent de mise à niveau du parc informatique' },
  { date: '13/08/2026 16:45', action: 'Soumission pour validation', acteur: 'M. Jean-Baptiste ONDO', role: 'Expert DTIC', type: 'SOUMISSION', motif: '' },
  { date: '12/08/2026 11:20', action: 'Création en brouillon', acteur: 'M. Jean-Baptiste ONDO', role: 'Expert DTIC', type: 'CREATION', motif: '' },
]

const OBSERVATIONS = [
  {
    date: '14/08/2026 09:20', acteur: 'Mme. Claire BONGO', role: 'Directrice DTIC', type: 'VALIDATION',
    texte: "Dossier complet et bien justifié. Le parc informatique de la DTIC est effectivement vétuste. Je valide et transmets au DGA pour approbation finale.",
  },
  {
    date: '13/08/2026 17:05', acteur: 'M. Jean-Baptiste ONDO', role: 'Expert DTIC', type: 'INFO',
    texte: "Deux devis comparatifs joints (DELL et HP). Le choix final sera arrêté après approbation selon les prix les plus avantageux. Délai de livraison estimé à 21 jours.",
  },
  {
    date: '12/08/2026 11:35', acteur: 'Service Budget DTIC', role: 'Assistant budgétaire', type: 'INFO',
    texte: "Vérification préalable : crédit disponible suffisant sur la ligne 310101 (272 000 000 XAF > 125 000 000 XAF demandés). Dossier transmis au responsable.",
  },
]

const SUB_LINES = [
  { designation: 'Ordinateurs portables Dell Latitude 5540 (i7/16Go/512SSD)', qte: 10, unite: 'unité', pu: 5_250_000, montant: 52_500_000 },
  { designation: 'Ordinateurs portables HP EliteBook 840 G10', qte: 5, unite: 'unité', pu: 4_800_000, montant: 24_000_000 },
  { designation: 'Sacoche de transport et accessoires', qte: 15, unite: 'lot', pu: 150_000, montant: 2_250_000 },
  { designation: "Logiciels bureautiques (licences Microsoft 365)", qte: 15, unite: 'licence', pu: 350_000, montant: 5_250_000 },
  { designation: 'Frais de livraison et installation', qte: 1, unite: 'forfait', pu: 1_000_000, montant: 1_000_000 },
]

const DOCS_JOINTES = [
  { nom: 'Devis DELL Technologies — DTIC-2026.pdf', taille: '342 Ko', type: 'DEVIS', date: '12/08/2026', uploaded: 'M. Jean-Baptiste ONDO' },
  { nom: 'Devis HP Inc Cameroun — DTIC-2026.pdf', taille: '289 Ko', type: 'DEVIS', date: '12/08/2026', uploaded: 'M. Jean-Baptiste ONDO' },
  { nom: 'Note de justification — renouvellement parc.docx', taille: '124 Ko', type: 'JUSTIFICATION', date: '12/08/2026', uploaded: 'M. Jean-Baptiste ONDO' },
  { nom: 'Inventaire parc informatique existant.xlsx', taille: '98 Ko', type: 'ANNEXE', date: '13/08/2026', uploaded: 'Service IT DTIC' },
]

const DOCS_GENERES = [
  { nom: 'Fiche EB — EB-2026-004521.pdf', type: 'PDF', date: '02/09/2026 14:45', taille: '87 Ko', statut: 'Disponible' },
  { nom: 'Rapport de synthèse EB.docx', type: 'WORD', date: '02/09/2026 14:45', taille: '64 Ko', statut: 'Disponible' },
  { nom: "Bon de commande (après approbation)", type: 'PDF', date: '—', taille: '—', statut: 'En attente' },
]

const HISTORIQUE_CREDIT = {
  dotationInitiale: 380_000_000,
  dotationActuelle: 380_000_000,
  engage: 82_000_000,
  liquide: 26_000_000,
  ordonnance: 0,
  paye: 0,
  disponibleAvant: 272_000_000,
  montantEB: 125_000_000,
  disponibleApres: 147_000_000,
}

const TYPE_COLORS: Record<string, string> = {
  VALIDATION: 'text-green-600 bg-green-50',
  SOUMISSION: 'text-blue-600 bg-blue-50',
  CREATION: 'text-slate-600 bg-slate-100',
  RETOUR: 'text-orange-600 bg-orange-50',
  REJET: 'text-red-600 bg-red-50',
  INFO: 'text-purple-600 bg-purple-50',
}

export default function EBDetail({ id, onNavigate }: Props) {
  const eb = EB_LIST.find(e => e.id === id) ?? EB_LIST[0]
  const [activeTab, setActiveTab] = useState('synthese')
  const [showAction, setShowAction] = useState(false)
  const [actionType, setActionType] = useState<'VALIDER' | 'RETOURNER' | 'REJETER' | null>(null)
  const [actionMotif, setActionMotif] = useState('')
  const [commentText, setCommentText] = useState('')
  const [showPDF, setShowPDF] = useState(false)
  const [piecesJointes, setPiecesJointes] = useState([...DOCS_JOINTES])
  const [showDocModal, setShowDocModal] = useState(false)
  const [selectedDoc, setSelectedDoc] = useState<typeof DOCS_JOINTES[0] | null>(null)
  const [localComments, setLocalComments] = useState([...OBSERVATIONS])

  const totalSubLines = SUB_LINES.reduce((s, l) => s + l.montant, 0)

  const openAction = (type: 'VALIDER' | 'RETOURNER' | 'REJETER') => {
    setActionType(type); setShowAction(true)
  }

  const handleAjouterPiece = () => {
    const now = new Date()
    const dateStr = now.toLocaleDateString('fr-FR')
    setPiecesJointes(prev => [...prev, {
      nom: `Document-annexe-${prev.length + 1}.pdf`,
      taille: '128 Ko',
      type: 'ANNEXE',
      date: dateStr,
      uploaded: 'Utilisateur courant',
    }])
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

  return (
    <div className="flex flex-col min-h-screen bg-[#F4F7FC]">
      {/* Bandeau de suivi du dossier */}
      <div className="bg-[#0B1C3E] text-white px-6 py-3">
        <div className="flex items-center justify-between max-w-[1200px] mx-auto">
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate('eb-list')} className="text-white/60 hover:text-white transition-colors">
              <ChevronLeft size={18} />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold">{eb.reference}</span>
                <StatusBadge status={eb.status} />
                <PriorityBadge priority={eb.priorite} />
              </div>
              <p className="text-white/60 text-xs mt-0.5 truncate max-w-[300px]">{eb.objet}</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-6 text-xs">
            <div>
              <p className="text-white/50">Étape actuelle</p>
              <p className="font-semibold">Validation DGA</p>
            </div>
            <div>
              <p className="text-white/50">Acteur attendu</p>
              <p className="font-semibold">{eb.acteurAttendu ?? 'M. Richard NKOGHE'}</p>
            </div>
            <div>
              <p className="text-white/50">Prochaine étape</p>
              <p className="font-semibold">Approbation SG</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowPDF(true)} className="btn btn-sm bg-white/10 hover:bg-white/20 text-white border-0 gap-1.5">
              <Printer size={13} /> PDF
            </button>
            {showPDF && (
              <PDFPreviewModal
                title="Fiche d'Expression de Besoin"
                subtitle={eb.objet}
                reference={eb.reference}
                docCode="RPT-FICHE-EB-001"
                onClose={() => setShowPDF(false)}
              >
                <FicheEB item={eb} />
              </PDFPreviewModal>
            )}
            {eb.status === 'EN_VALIDATION' && (
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
            {eb.status === 'APPROUVE' && (
              <button onClick={() => onNavigate('eng-list')} className="btn btn-sm bg-purple-500/80 hover:bg-purple-500 text-white border-0 gap-1.5">
                <ArrowRight size={13} /> Créer engagement
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Workflow progress bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-3">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-center gap-2 overflow-x-auto">
            {WF_STEPS.map((s, i) => (
              <div key={i} className="flex items-center flex-shrink-0">
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
                  s.status === 'done' ? 'bg-green-100 text-green-700' :
                  s.status === 'current' ? 'bg-[#0B1C3E] text-white' :
                  'bg-slate-100 text-slate-400'
                }`}>
                  {s.status === 'done' && <CheckCircle size={11} />}
                  {s.status === 'current' && <Clock size={11} />}
                  {s.label}
                  {s.acteur && <span className="opacity-70">· {s.acteur.split(' ').slice(-1)[0]}</span>}
                </div>
                {i < WF_STEPS.length - 1 && (
                  <ChevronRight size={13} className={`mx-1 flex-shrink-0 ${s.status === 'done' ? 'text-green-400' : 'text-slate-300'}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RETOURNE banner */}
      {eb.status === 'RETOURNE' && eb.motifRetour && (
        <div className="bg-orange-50 border-b border-orange-200 px-6 py-4">
          <div className="max-w-[1200px] mx-auto">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <RotateCcw size={15} className="text-orange-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-orange-800 text-sm">Dossier retourné pour complément</span>
                  <span className="text-xs text-orange-500">par {eb.acteurRetour} · le {eb.dateRetour}</span>
                </div>
                <p className="text-sm text-orange-700 leading-relaxed mb-3">{eb.motifRetour}</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onNavigate('eb-form', eb.id)}
                    className="btn btn-sm gap-1.5 bg-orange-600 text-white border-0 hover:bg-orange-700"
                  >
                    <FileText size={13} /> Modifier et corriger le dossier
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REJETE banner */}
      {eb.status === 'REJETE' && eb.motifRejet && (
        <div className="bg-red-50 border-b border-red-200 px-6 py-4">
          <div className="max-w-[1200px] mx-auto">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <XCircle size={15} className="text-red-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-red-800 text-sm">Dossier rejeté définitivement</span>
                  <span className="text-xs text-red-500">par {eb.acteurRejet} · le {eb.dateRejet}</span>
                </div>
                <p className="text-sm text-red-700 leading-relaxed">{eb.motifRejet}</p>
                <p className="text-xs text-red-500 mt-2 font-medium">Ce dossier ne peut plus être modifié ni resoumis. Une nouvelle Expression de Besoin devra être initiée si le besoin persiste.</p>
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
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 p-6 max-w-[1200px] mx-auto w-full">

        {/* SYNTHÈSE */}
        {activeTab === 'synthese' && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="card sm:col-span-2 space-y-3">
                <h3 className="section-title">Identification</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><p className="text-[10px] text-slate-400 uppercase mb-1">Référence</p><p className="font-mono font-bold text-[#0B1C3E]">{eb.reference}</p></div>
                  <div><p className="text-[10px] text-slate-400 uppercase mb-1">Date de création</p><p className="text-slate-700">{eb.dateCreation}</p></div>
                  <div><p className="text-[10px] text-slate-400 uppercase mb-1">Initiateur</p><p className="text-slate-700">{eb.initiateur}</p></div>
                  <div><p className="text-[10px] text-slate-400 uppercase mb-1">Structure</p><p className="text-slate-700">{eb.structure}</p></div>
                  <div><p className="text-[10px] text-slate-400 uppercase mb-1">Ligne budgétaire</p><p className="font-mono text-[#0B1C3E]">{eb.ligneBudgetaire}</p></div>
                  <div><p className="text-[10px] text-slate-400 uppercase mb-1">Type</p>
                    <span className={`badge text-[10px] ${eb.isPAP ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'}`}>
                      {eb.isPAP ? 'PAP — Budget programme' : 'HORS PAP — Budget ordinaire'}
                    </span>
                  </div>
                </div>
                <div className="pt-3 border-t border-slate-100">
                  <p className="text-[10px] text-slate-400 uppercase mb-1">Objet</p>
                  <p className="text-slate-800 font-medium">{eb.objet}</p>
                </div>
              </div>
              <div className="card space-y-3">
                <h3 className="section-title">Montant</h3>
                <p className="text-3xl font-bold text-[#0B1C3E] amount">{fmt(eb.montant)}</p>
                <p className="text-xs text-slate-400">XAF · {SUB_LINES.length} sous-lignes</p>
                <div className="pt-3 border-t border-slate-100">
                  <p className="text-[10px] text-slate-400 uppercase mb-2">Priorité</p>
                  <PriorityBadge priority={eb.priorite} />
                </div>
                {eb.pilier && (
                  <div className="pt-3 border-t border-slate-100">
                    <p className="text-[10px] text-slate-400 uppercase mb-1">Pilier PAP</p>
                    <p className="text-xs font-medium text-purple-700">{eb.pilier}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Disponibilité crédit résumé */}
            <div className="card">
              <h3 className="section-title mb-3">Disponibilité budgétaire</h3>
              <div className="flex flex-wrap gap-3 items-center text-xs">
                {[
                  { label: 'Dotation initiale', value: HISTORIQUE_CREDIT.dotationInitiale, color: 'text-slate-700' },
                  { label: '/', value: null, color: '' },
                  { label: 'Engagé', value: HISTORIQUE_CREDIT.engage, color: 'text-orange-600' },
                  { label: '/', value: null, color: '' },
                  { label: 'Liquidé', value: HISTORIQUE_CREDIT.liquide, color: 'text-purple-600' },
                  { label: '=', value: null, color: '' },
                  { label: 'Disponible avant EB', value: HISTORIQUE_CREDIT.disponibleAvant, color: 'text-slate-700 font-bold' },
                  { label: '−', value: null, color: '' },
                  { label: "Montant de l'EB", value: HISTORIQUE_CREDIT.montantEB, color: 'text-red-600 font-bold' },
                  { label: '=', value: null, color: '' },
                  { label: 'Disponible après EB', value: HISTORIQUE_CREDIT.disponibleApres, color: 'text-green-700 font-bold text-sm' },
                ].map((item, i) =>
                  item.value === null ? (
                    <span key={i} className="text-slate-300 font-light text-lg">{item.label}</span>
                  ) : (
                    <div key={i} className={`text-right ${item.color}`}>
                      <p className="text-[10px] text-slate-400">{item.label}</p>
                      <p className={item.color}>{fmt(item.value)}</p>
                    </div>
                  )
                )}
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
                    <div className="flex-1 bg-slate-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs font-semibold text-slate-800">{obs.acteur} <span className="text-slate-400 font-normal">· {obs.role}</span></p>
                        <p className="text-[10px] text-slate-400">{obs.date}</p>
                      </div>
                      <p className="text-xs text-slate-700">{obs.texte}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* DÉTAIL DU BESOIN */}
        {activeTab === 'detail' && (
          <div className="space-y-5">
            <div className="card space-y-4">
              <h3 className="section-title">Description</h3>
              <div>
                <p className="text-[10px] uppercase text-slate-400 mb-1">Objet</p>
                <p className="text-slate-800 font-medium">{eb.objet}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase text-slate-400 mb-1">Justification</p>
                <p className="text-slate-700 text-sm leading-relaxed">
                  Le parc informatique de la Direction des Technologies de l'Information (DTIC) est composé en grande majorité d'équipements acquis entre 2016 et 2018,
                  dont la durée de vie utile est largement dépassée. Les performances actuelles pénalisent fortement la productivité des agents et la qualité des services
                  fournis aux autres directions. Ce renouvellement partiel permettra de doter les agents-clés d'outils conformes aux standards actuels.
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100">
                <div>
                  <p className="text-[10px] uppercase text-slate-400 mb-1">Priorité</p>
                  <PriorityBadge priority={eb.priorite} />
                </div>
                <div>
                  <p className="text-[10px] uppercase text-slate-400 mb-1">Mode de passation</p>
                  <p className="text-sm text-slate-700">Demande de cotation</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-slate-400 mb-1">Lieu d'exécution</p>
                  <p className="text-sm text-slate-700">Siège CEEAC, Libreville</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-slate-400 mb-1">Date de besoin</p>
                  <p className="text-sm text-slate-700">15/10/2026</p>
                </div>
              </div>
            </div>
            <div className="card p-0 overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100">
                <h3 className="section-title">Sous-lignes de dépense</h3>
              </div>
              <table className="data-table w-full text-xs">
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
                    <td className="text-right font-mono text-[#0B1C3E] font-bold py-3">{new Intl.NumberFormat('fr-FR').format(totalSubLines)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {/* BUDGET */}
        {activeTab === 'budget' && (
          <div className="space-y-5">
            <div className="card">
              <h3 className="section-title mb-4">Disponibilité des crédits — Ligne {eb.ligneBudgetaire}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { label: 'Dotation initiale', value: HISTORIQUE_CREDIT.dotationInitiale, color: '#0B1C3E', sub: 'Budget voté 2026' },
                  { label: 'Dotation actuelle', value: HISTORIQUE_CREDIT.dotationActuelle, color: '#0B1C3E', sub: 'Après virements' },
                  { label: 'Engagé', value: HISTORIQUE_CREDIT.engage, color: '#D97706', sub: `${Math.round(HISTORIQUE_CREDIT.engage / HISTORIQUE_CREDIT.dotationInitiale * 100)}% de la dotation` },
                  { label: 'Liquidé', value: HISTORIQUE_CREDIT.liquide, color: '#7C3AED', sub: `${Math.round(HISTORIQUE_CREDIT.liquide / HISTORIQUE_CREDIT.dotationInitiale * 100)}% de la dotation` },
                  { label: 'Disponible avant EB', value: HISTORIQUE_CREDIT.disponibleAvant, color: '#1A6B3A', sub: 'Crédit disponible actuel' },
                  { label: "Montant de l'EB", value: HISTORIQUE_CREDIT.montantEB, color: '#DC2626', sub: `${Math.round(HISTORIQUE_CREDIT.montantEB / HISTORIQUE_CREDIT.disponibleAvant * 100)}% du disponible` },
                ].map(item => (
                  <div key={item.label} className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                    <p className="text-[10px] uppercase tracking-wide text-slate-400 mb-1">{item.label}</p>
                    <p className="text-base font-bold" style={{ color: item.color }}>{fmt(item.value)}</p>
                    <p className="text-[10px] text-slate-400 mt-1">{item.sub}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-green-700">Disponible après réservation EB</p>
                    <p className="text-xs text-green-600 mt-0.5">Solde si cette demande est approuvée</p>
                  </div>
                  <p className="text-2xl font-bold text-green-700">{fmt(HISTORIQUE_CREDIT.disponibleApres)}</p>
                </div>
                <div className="mt-3 h-2 bg-white rounded-full overflow-hidden">
                  <div className="h-full bg-green-400 rounded-full" style={{ width: `${(HISTORIQUE_CREDIT.disponibleApres / HISTORIQUE_CREDIT.dotationInitiale) * 100}%` }} />
                </div>
                <p className="text-[10px] text-green-600 mt-1">
                  {Math.round((HISTORIQUE_CREDIT.disponibleApres / HISTORIQUE_CREDIT.dotationInitiale) * 100)}% de la dotation initiale
                </p>
              </div>
            </div>
            <div className="card">
              <h3 className="section-title mb-3">Imputation budgétaire</h3>
              <div className="overflow-x-auto">
                <table className="data-table text-xs w-full">
                  <thead>
                    <tr>
                      <th className="text-left">Ligne budgétaire</th>
                      <th className="text-left">Libellé</th>
                      <th className="text-right">Montant imputé</th>
                      <th className="text-right">% du total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="font-mono font-semibold text-[#0B1C3E]">{eb.ligneBudgetaire}</td>
                      <td>{eb.objet.split('—')[0].trim()}</td>
                      <td className="text-right font-mono font-bold">{fmt(eb.montant)}</td>
                      <td className="text-right font-mono">100%</td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr className="font-bold">
                      <td colSpan={2} className="text-right pr-3">Total</td>
                      <td className="text-right font-mono">{fmt(eb.montant)}</td>
                      <td className="text-right font-mono">100%</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* PAP */}
        {activeTab === 'pap' && (
          <div className="space-y-5">
            {eb.isPAP ? (
              <>
                <div className="card space-y-4">
                  <h3 className="section-title">Référentiel programmatique PAP</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Pilier', value: eb.pilier ?? 'Pilier 2 — Intégration Économique', color: '#0B1C3E', bg: '#EFF6FF' },
                      { label: 'Axe stratégique', value: 'Axe 2.1 — Commerce régional', color: '#1A6B3A', bg: '#F0FDF4' },
                      { label: 'Produit attendu', value: 'Prod. 2.1.3 — Promotion des exportations', color: '#2563EB', bg: '#EFF6FF' },
                      { label: 'Activité', value: eb.activite ?? 'Act. 2.1.3.2 — Missions de promotion', color: '#7C3AED', bg: '#F5F3FF' },
                    ].map(item => (
                      <div key={item.label} className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: item.bg }}>
                        <div className="w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0" style={{ backgroundColor: item.color }} />
                        <div>
                          <p className="text-[10px] uppercase tracking-wide text-slate-400">{item.label}</p>
                          <p className="text-sm font-medium mt-0.5" style={{ color: item.color }}>{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="card">
                  <h3 className="section-title mb-3">Performance — Indicateur associé</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <p className="text-[10px] uppercase text-slate-400 mb-1">Indicateur</p>
                      <p className="text-sm font-medium text-slate-800">Taux de croissance des échanges intra-CEEAC</p>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="text-center p-3 bg-slate-50 rounded-lg">
                        <p className="text-[10px] text-slate-400">Baseline</p>
                        <p className="font-bold text-slate-700">6%</p>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <p className="text-[10px] text-purple-400">Cible</p>
                        <p className="font-bold text-purple-700">12%</p>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <p className="text-[10px] text-green-400">Réalisé</p>
                        <p className="font-bold text-green-700">8%</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                      <span>Progression vers la cible</span>
                      <span>67%</span>
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-400 rounded-full" style={{ width: '67%' }} />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="card text-center py-12 text-slate-400">
                <Target size={32} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">Cette expression de besoin relève du budget ordinaire (Hors PAP).</p>
                <p className="text-xs mt-1">Aucun référentiel de performance PAP n'est associé.</p>
              </div>
            )}
          </div>
        )}

        {/* PIÈCES JOINTES */}
        {activeTab === 'pieces' && (
          <div className="space-y-4">
            <div className="card p-0 overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                <h3 className="section-title">Pièces jointes ({piecesJointes.length})</h3>
                <button onClick={handleAjouterPiece} className="btn btn-outline btn-sm gap-1.5"><Paperclip size={12} /> Ajouter</button>
              </div>
              <table className="data-table text-xs w-full">
                <thead>
                  <tr>
                    <th className="text-left">Document</th>
                    <th className="text-left">Type</th>
                    <th className="text-left">Uploadé par</th>
                    <th className="text-left">Date</th>
                    <th className="text-right">Taille</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {piecesJointes.map((doc, i) => (
                    <tr key={i}>
                      <td className="flex items-center gap-2">
                        <FileText size={14} className="text-red-500 flex-shrink-0" />
                        <span className="font-medium text-slate-800">{doc.nom}</span>
                      </td>
                      <td><span className="badge bg-blue-50 text-blue-700">{doc.type}</span></td>
                      <td className="text-slate-600">{doc.uploaded}</td>
                      <td className="text-slate-500">{doc.date}</td>
                      <td className="text-right text-slate-500">{doc.taille}</td>
                      <td className="text-center">
                        <button
                          onClick={() => { setSelectedDoc(doc); setShowDocModal(true) }}
                          className="btn btn-sm btn-outline gap-1"
                        ><Eye size={11} /> Voir</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
                    <div className="flex-1 pb-1">
                      <div className="flex items-center justify-between">
                        <p className={`text-sm font-semibold ${s.status === 'pending' ? 'text-slate-400' : 'text-slate-800'}`}>{s.label}</p>
                        {s.date && <p className="text-xs text-slate-400">{s.date}</p>}
                        {s.status === 'current' && <span className="badge bg-orange-100 text-orange-700 text-[10px]">En attente</span>}
                      </div>
                      {s.acteur && (
                        <p className="text-xs text-slate-500 mt-0.5">
                          <span className="font-medium">{s.acteur}</span> · {s.role}
                        </p>
                      )}
                      {s.status === 'done' && (
                        <div className="mt-2 p-2 bg-green-50 rounded text-xs text-green-700 border border-green-100">
                          Validé — Dossier conforme aux exigences réglementaires
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action panel */}
            {eb.status === 'EN_VALIDATION' && (
              <div className="card border-l-4 border-l-[#D4A017]">
                <h3 className="section-title mb-3">Action requise</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Vous êtes l'acteur attendu pour ce dossier. Veuillez valider, retourner ou rejeter cette expression de besoin.
                </p>
                <div className="flex gap-3">
                  <button onClick={() => openAction('RETOURNER')} className="btn btn-outline gap-1.5 text-orange-600 border-orange-300 hover:bg-orange-50">
                    <RotateCcw size={14} /> Retourner
                  </button>
                  <button onClick={() => openAction('REJETER')} className="btn btn-outline gap-1.5 text-red-600 border-red-300 hover:bg-red-50">
                    <XCircle size={14} /> Rejeter
                  </button>
                  <button onClick={() => openAction('VALIDER')} className="btn btn-primary gap-1.5">
                    <CheckCircle size={14} /> Valider et transmettre
                  </button>
                </div>
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
                <div key={i} className="flex gap-3 p-3 rounded-lg border border-slate-100 hover:border-slate-200 transition-colors">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold ${TYPE_COLORS[evt.type] ?? 'text-slate-600 bg-slate-100'}`}>
                    {evt.type === 'VALIDATION' && <CheckCircle size={13} />}
                    {evt.type === 'SOUMISSION' && <Send size={13} />}
                    {evt.type === 'CREATION' && <FileText size={13} />}
                    {evt.type === 'INFO' && <MessageSquare size={13} />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-slate-800">{evt.action}</p>
                      <p className="text-[10px] text-slate-400 flex-shrink-0 ml-2">{evt.date}</p>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{evt.acteur} · {evt.role}</p>
                    {evt.motif && <p className="text-xs text-slate-600 mt-1 italic">"{evt.motif}"</p>}
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
              <h3 className="section-title">Documents générés</h3>
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
                  <tr key={i} className={doc.statut === 'En attente' ? 'opacity-50' : ''}>
                    <td className="flex items-center gap-2">
                      <FileText size={14} className={doc.type === 'PDF' ? 'text-red-500' : 'text-blue-500'} />
                      <span className="font-medium text-slate-800">{doc.nom}</span>
                    </td>
                    <td><span className={`badge ${doc.type === 'PDF' ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'}`}>{doc.type}</span></td>
                    <td className="text-slate-500">{doc.date}</td>
                    <td className="text-right text-slate-500">{doc.taille}</td>
                    <td>
                      <span className={`badge ${doc.statut === 'Disponible' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
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
                  <div className="flex-1">
                    <div className={`rounded-lg p-3 ${obs.type === 'VALIDATION' ? 'bg-green-50 border border-green-100' : obs.type === 'INFO' ? 'bg-blue-50 border border-blue-100' : 'bg-slate-50 border border-slate-100'}`}>
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="text-xs font-semibold text-slate-800">
                          {obs.acteur} <span className="text-slate-400 font-normal">· {obs.role}</span>
                        </p>
                        <div className="flex items-center gap-2">
                          <span className={`badge text-[10px] ${obs.type === 'VALIDATION' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{obs.type}</span>
                          <p className="text-[10px] text-slate-400">{obs.date}</p>
                        </div>
                      </div>
                      <p className="text-xs text-slate-700">{obs.texte}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="card">
              <p className="text-sm font-semibold text-slate-700 mb-3">Ajouter un commentaire</p>
              <textarea
                className="form-input min-h-[80px] resize-none text-sm"
                placeholder="Votre observation, remarque ou question..."
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
                  <span><span className="font-medium">Uploadé par :</span> {selectedDoc.uploaded}</span>
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

      {/* Action Modal */}
      {showAction && actionType && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="card max-w-md w-full space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[#0B1C3E]">
                {actionType === 'VALIDER' ? 'Valider le dossier' : actionType === 'RETOURNER' ? 'Retourner au demandeur' : 'Rejeter la demande'}
              </h3>
              <button onClick={() => setShowAction(false)} className="text-slate-400 hover:text-slate-700">
                <XCircle size={20} />
              </button>
            </div>
            <div className={`flex gap-2 p-3 rounded-lg ${actionType === 'VALIDER' ? 'bg-green-50 border border-green-200' : actionType === 'RETOURNER' ? 'bg-orange-50 border border-orange-200' : 'bg-red-50 border border-red-200'}`}>
              {actionType === 'VALIDER' && <CheckCircle size={16} className="text-green-600 flex-shrink-0" />}
              {actionType === 'RETOURNER' && <AlertTriangle size={16} className="text-orange-600 flex-shrink-0" />}
              {actionType === 'REJETER' && <XCircle size={16} className="text-red-600 flex-shrink-0" />}
              <p className="text-xs text-slate-700">
                {actionType === 'VALIDER' && 'Le dossier sera transmis à l\'étape suivante du circuit de validation.'}
                {actionType === 'RETOURNER' && 'Le dossier sera retourné au demandeur avec votre motif pour correction.'}
                {actionType === 'REJETER' && 'Le dossier sera définitivement rejeté. Cette action est irréversible.'}
              </p>
            </div>
            <div>
              <label className="form-label">{actionType === 'VALIDER' ? 'Observation (optionnel)' : 'Motif *'}</label>
              <textarea
                className="form-input min-h-[80px] resize-none"
                placeholder={actionType === 'VALIDER' ? 'Votre observation...' : 'Expliquez le motif de votre décision...'}
                value={actionMotif}
                onChange={e => setActionMotif(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowAction(false)} className="btn btn-outline flex-1">Annuler</button>
              <button
                onClick={() => setShowAction(false)}
                disabled={actionType !== 'VALIDER' && !actionMotif.trim()}
                className={`btn flex-1 gap-1.5 disabled:opacity-40 ${
                  actionType === 'VALIDER' ? 'btn-primary' :
                  actionType === 'RETOURNER' ? 'bg-orange-500 text-white hover:bg-orange-600' :
                  'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                {actionType === 'VALIDER' && <><CheckCircle size={14} /> Valider</>}
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
