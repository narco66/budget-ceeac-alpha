import { useState, useMemo } from 'react'
import {
  Check, ChevronRight, ChevronLeft, AlertTriangle, Info, Search,
  Upload, FileText, X, Plus, Trash2, CheckCircle, Building2,
  Target, DollarSign, ClipboardList, Paperclip, Eye, ArrowRight,
} from 'lucide-react'
import type { Page } from '../types'

const fmt = (n: number) =>
  new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(n) + ' XAF'

const STEPS = [
  { id: 1, label: 'Ligne budgétaire', icon: Search },
  { id: 2, label: 'Contexte budgétaire', icon: DollarSign },
  { id: 3, label: 'Contexte programme', icon: Target },
  { id: 4, label: 'Description', icon: ClipboardList },
  { id: 5, label: 'Tâches & Détails', icon: ClipboardList },
  { id: 6, label: 'Imputation', icon: Building2 },
  { id: 7, label: 'Pièces jointes', icon: Paperclip },
  { id: 8, label: 'Récapitulatif', icon: Eye },
  { id: 9, label: 'Soumission', icon: CheckCircle },
]

const LINES = [
  {
    code: '310101', libelle: 'Équipements bureautiques et informatiques', chapitre: '31', nature: 'INVESTISSEMENT',
    isPAP: false, dotation: 380_000_000, engage: 82_000_000, liquide: 26_000_000, disponible: 272_000_000,
    structure: 'DTIC', source: 'Budget ordinaire',
    pilier: undefined, axe: undefined, produit: undefined, activite: undefined,
    indicateur: undefined, cible: undefined, realisation: undefined,
  },
  {
    code: '410234', libelle: 'Activités de promotion — Intégration économique', chapitre: '41', nature: 'FONCTIONNEMENT',
    isPAP: true, dotation: 600_000_000, engage: 156_000_000, liquide: 43_000_000, disponible: 401_000_000,
    structure: 'DIE', source: 'Budget programme',
    pilier: 'Pilier 2 — Intégration Économique', axe: 'Axe 2.1 — Commerce régional',
    produit: 'Prod. 2.1.3 — Promotion des exportations', activite: 'Act. 2.1.3.2 — Missions de promotion',
    indicateur: 'Taux de croissance des échanges intra-CEEAC', cible: '12%', realisation: '8%',
  },
  {
    code: '220201', libelle: 'Frais de missions et déplacements officiels', chapitre: '22', nature: 'FONCTIONNEMENT',
    isPAP: false, dotation: 300_000_000, engage: 68_000_000, liquide: 10_000_000, disponible: 222_000_000,
    structure: 'SG', source: 'Budget ordinaire',
    pilier: undefined, axe: undefined, produit: undefined, activite: undefined,
    indicateur: undefined, cible: undefined, realisation: undefined,
  },
  {
    code: '430234', libelle: 'Formation et renforcement des capacités', chapitre: '43', nature: 'FONCTIONNEMENT',
    isPAP: true, dotation: 750_000_000, engage: 142_000_000, liquide: 41_000_000, disponible: 567_000_000,
    structure: 'DRH', source: 'Budget programme',
    pilier: 'Pilier 1 — Paix et Sécurité', axe: 'Axe 1.3 — Renforcement institutionnel',
    produit: 'Prod. 1.3.1 — Capacités des agents renforcées', activite: 'Act. 1.3.1.4 — Formations certifiantes',
    indicateur: 'Nombre de personnels formés', cible: '120', realisation: '45',
  },
  {
    code: '420156', libelle: "Missions S&E — Paix et Sécurité", chapitre: '42', nature: 'FONCTIONNEMENT',
    isPAP: true, dotation: 480_000_000, engage: 91_000_000, liquide: 33_500_000, disponible: 355_500_000,
    structure: 'DPS', source: 'Budget programme',
    pilier: 'Pilier 1 — Paix et Sécurité', axe: 'Axe 1.2 — Mécanismes de prévention',
    produit: 'Prod. 1.2.2 — Suivi des menaces sécuritaires', activite: 'Act. 1.2.2.1 — Missions terrain',
    indicateur: 'Nombre de missions réalisées', cible: '24', realisation: '14',
  },
]

const UNITS = ['unité', 'lot', 'forfait', 'mois', 'jour', 'heure', 'kg', 'm²', 'km']
const PASSATION_MODES = ["Appel d'offres ouvert", "Appel d'offres restreint", 'Demande de cotation', 'Entente directe', 'Accord-cadre']
const PRIORITES = ['NORMALE', 'IMPORTANTE', 'URGENTE', 'CRITIQUE']

type SubLine = { id: string; designation: string; qte: number; unite: string; pu: number; montant: number }
type ImputLine = { ligneCode: string; libelle: string; montant: number }
type DocItem = { type: string; required: boolean; uploaded: boolean; name?: string; size?: string }

const DOCS_REQUIRED: DocItem[] = [
  { type: "Devis ou expression des besoins *", required: true, uploaded: false },
  { type: 'Note de justification *', required: true, uploaded: false },
  { type: "Plan de passation (si applicable)", required: false, uploaded: false },
  { type: "Référence contractuelle (si applicable)", required: false, uploaded: false },
  { type: "Rapport technique (si investissement)", required: false, uploaded: false },
]

const CHECKLIST = [
  "J'ai vérifié que toutes les informations sont exactes et complètes.",
  "Les pièces justificatives obligatoires ont été jointes au dossier.",
  "Le montant demandé est cohérent avec le crédit disponible sur la ligne budgétaire.",
  "J'ai pris connaissance des règles de passation applicables à cette demande.",
  "Je certifie que ce besoin est réel, justifié et conforme aux objectifs institutionnels de la CEEAC.",
]

interface Props {
  onNavigate: (page: Page, id?: string) => void
}

let subLineCounter = 1

export default function EBForm({ onNavigate }: Props) {
  const [step, setStep] = useState(1)
  const [lineSearch, setLineSearch] = useState('')
  const [selectedLine, setSelectedLine] = useState<typeof LINES[0] | null>(null)

  const [formData, setFormData] = useState({
    objet: '',
    description: '',
    justification: '',
    priorite: 'NORMALE',
    modePassation: '',
    delaiExecution: '',
    lieuExecution: '',
    fournisseurPressenti: '',
    dateBesoins: '',
  })

  const [subLines, setSubLines] = useState<SubLine[]>([
    { id: 'sl-1', designation: '', qte: 1, unite: 'unité', pu: 0, montant: 0 },
  ])

  const [imputLines, setImputLines] = useState<ImputLine[]>([])
  const [docs, setDocs] = useState<DocItem[]>(DOCS_REQUIRED)
  const [checklist, setChecklist] = useState<boolean[]>(CHECKLIST.map(() => false))
  const [submitted, setSubmitted] = useState(false)
  const [sendToWorkflow, setSendToWorkflow] = useState(true)

  const filteredLines = useMemo(() =>
    LINES.filter(l =>
      l.code.includes(lineSearch) ||
      l.libelle.toLowerCase().includes(lineSearch.toLowerCase()) ||
      l.structure.toLowerCase().includes(lineSearch.toLowerCase())
    ), [lineSearch])

  const totalSubLines = useMemo(() =>
    subLines.reduce((s, l) => s + l.montant, 0), [subLines])

  const totalImput = useMemo(() =>
    imputLines.reduce((s, l) => s + l.montant, 0), [imputLines])

  const imputGap = totalSubLines - totalImput

  const addSubLine = () => {
    subLineCounter++
    setSubLines(prev => [...prev, { id: `sl-${subLineCounter}`, designation: '', qte: 1, unite: 'unité', pu: 0, montant: 0 }])
  }

  const updateSubLine = (id: string, field: keyof SubLine, value: string | number) => {
    setSubLines(prev => prev.map(l => {
      if (l.id !== id) return l
      const updated = { ...l, [field]: value }
      if (field === 'qte' || field === 'pu') {
        updated.montant = Number(updated.qte) * Number(updated.pu)
      }
      return updated
    }))
  }

  const removeSubLine = (id: string) => {
    if (subLines.length === 1) return
    setSubLines(prev => prev.filter(l => l.id !== id))
  }

  const canProceed = () => {
    if (step === 1) return selectedLine !== null
    if (step === 4) return formData.objet.trim().length > 0 && formData.justification.trim().length > 0
    if (step === 5) return subLines.every(l => l.designation.trim() && l.montant > 0) && totalSubLines > 0
    if (step === 8) return checklist.every(Boolean)
    return true
  }

  const handleNext = () => {
    if (step === 1 && selectedLine) {
      setImputLines([{ ligneCode: selectedLine.code, libelle: selectedLine.libelle, montant: 0 }])
    }
    if (step < 9) setStep(s => s + 1)
  }

  if (submitted) {
    const ref = `EB-2026-${String(Math.floor(Math.random() * 8000) + 1000)}`
    return (
      <div className="min-h-screen bg-[#F4F7FC] flex items-center justify-center p-8">
        <div className="card max-w-lg w-full text-center space-y-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#0B1C3E]">Expression de besoin soumise</h2>
            <p className="text-sm text-slate-500 mt-1">Référence : <span className="font-mono font-semibold text-[#0B1C3E]">{ref}</span></p>
          </div>
          <div className="bg-slate-50 rounded-lg p-4 text-left space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Objet</span>
              <span className="font-medium text-[#0B1C3E] text-right max-w-[200px]">{formData.objet || '—'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Montant</span>
              <span className="font-semibold text-[#1A6B3A]">{fmt(totalSubLines)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Statut</span>
              <span className="text-slate-700">{sendToWorkflow ? 'Envoyé en validation' : 'Brouillon enregistré'}</span>
            </div>
          </div>
          <p className="text-xs text-slate-400">
            {sendToWorkflow
              ? 'Votre demande a été transmise au responsable hiérarchique pour validation.'
              : 'Votre demande est enregistrée en brouillon. Vous pouvez la soumettre ultérieurement.'}
          </p>
          <div className="flex gap-3">
            <button className="btn btn-outline flex-1" onClick={() => onNavigate('eb-list')}>
              Retour à la liste
            </button>
            <button className="btn btn-primary flex-1" onClick={() => onNavigate('eb-detail', ref)}>
              Voir la demande
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F4F7FC]">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => onNavigate('eb-list')} className="text-slate-400 hover:text-slate-700">
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="font-bold text-[#0B1C3E]">Nouvelle expression de besoin</h1>
            <p className="text-xs text-slate-500">Exercice 2026 · Assistant de création</p>
          </div>
        </div>
        <span className="text-xs text-slate-400">Étape {step} / 9</span>
      </div>

      {/* Stepper */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 overflow-x-auto">
        <div className="flex items-center gap-1 min-w-max">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <button
                onClick={() => step > s.id && setStep(s.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  step === s.id
                    ? 'bg-[#0B1C3E] text-white'
                    : step > s.id
                    ? 'bg-green-100 text-green-700 cursor-pointer hover:bg-green-200'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                {step > s.id ? <Check size={11} /> : <span className="w-3.5 text-center">{s.id}</span>}
                <span className="hidden sm:inline">{s.label}</span>
              </button>
              {i < STEPS.length - 1 && (
                <div className={`w-6 h-px mx-0.5 ${step > s.id ? 'bg-green-300' : 'bg-slate-200'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-6 space-y-6">

        {/* STEP 1 */}
        {step === 1 && (
          <div className="card space-y-4">
            <div>
              <h2 className="text-base font-bold text-[#0B1C3E]">Sélection de la ligne budgétaire</h2>
              <p className="text-xs text-slate-500 mt-0.5">Recherchez et sélectionnez la ligne budgétaire correspondant à votre besoin</p>
            </div>
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                className="form-input pl-9"
                placeholder="Code, libellé, structure..."
                value={lineSearch}
                onChange={e => setLineSearch(e.target.value)}
              />
            </div>
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {filteredLines.map(line => (
                <button
                  key={line.code}
                  onClick={() => setSelectedLine(line)}
                  className={`w-full text-left p-3.5 rounded-lg border-2 transition-all ${
                    selectedLine?.code === line.code
                      ? 'border-[#0B1C3E] bg-[#0B1C3E]/5'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-semibold text-[#0B1C3E]">{line.code}</span>
                        <span className={`badge text-[10px] ${line.isPAP ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'}`}>
                          {line.isPAP ? 'PAP' : 'HORS PAP'}
                        </span>
                        <span className="badge bg-blue-50 text-blue-700 text-[10px]">{line.nature}</span>
                      </div>
                      <p className="text-sm text-slate-700">{line.libelle}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{line.structure} · {line.source}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs text-slate-500">Disponible</p>
                      <p className={`text-sm font-bold ${line.disponible > 50_000_000 ? 'text-[#1A6B3A]' : 'text-orange-600'}`}>
                        {fmt(line.disponible)}
                      </p>
                      <div className="w-20 h-1.5 bg-slate-200 rounded-full mt-1">
                        <div
                          className="h-1.5 bg-[#1A6B3A] rounded-full"
                          style={{ width: `${Math.round((line.disponible / line.dotation) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            {!filteredLines.length && (
              <div className="text-center py-8 text-slate-400 text-sm">Aucune ligne trouvée</div>
            )}
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && selectedLine && (
          <div className="space-y-4">
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-bold text-[#0B1C3E]">Contexte budgétaire</h2>
                  <p className="text-xs text-slate-500">Ligne <span className="font-mono">{selectedLine.code}</span> — {selectedLine.libelle}</p>
                </div>
                <span className={`badge text-xs ${selectedLine.isPAP ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'}`}>
                  {selectedLine.isPAP ? 'PAP' : 'HORS PAP'}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Dotation initiale', value: selectedLine.dotation, color: '#0B1C3E' },
                  { label: 'Engagé', value: selectedLine.engage, color: '#D97706' },
                  { label: 'Liquidé', value: selectedLine.liquide, color: '#7C3AED' },
                  { label: 'Disponible', value: selectedLine.disponible, color: '#1A6B3A' },
                ].map(item => (
                  <div key={item.label} className="bg-slate-50 rounded-lg p-3">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-1">{item.label}</p>
                    <p className="text-sm font-bold" style={{ color: item.color }}>{fmt(item.value)}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>Taux d'utilisation</span>
                  <span>{Math.round(((selectedLine.dotation - selectedLine.disponible) / selectedLine.dotation) * 100)}%</span>
                </div>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden flex">
                  <div className="h-full bg-orange-400" style={{ width: `${(selectedLine.engage / selectedLine.dotation) * 100}%` }} />
                  <div className="h-full bg-purple-400" style={{ width: `${(selectedLine.liquide / selectedLine.dotation) * 100}%` }} />
                </div>
                <div className="flex gap-4 mt-1.5 text-[10px] text-slate-400">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-400 inline-block" />Engagé</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-400 inline-block" />Liquidé</span>
                </div>
              </div>
            </div>
            {selectedLine.disponible < 50_000_000 && (
              <div className="flex gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <AlertTriangle size={16} className="text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-orange-700">Crédit disponible limité</p>
                  <p className="text-xs text-orange-600 mt-0.5">
                    Le crédit disponible est inférieur à 50 000 000 XAF. Vérifiez que votre demande est compatible avec le solde.
                  </p>
                </div>
              </div>
            )}
            <div className="card bg-blue-50 border border-blue-100">
              <div className="flex gap-2">
                <Info size={15} className="text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-700">
                  Structure : <strong>{selectedLine.structure}</strong> · Source : {selectedLine.source} · Nature : {selectedLine.nature}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && selectedLine && (
          <div className="card space-y-4">
            {selectedLine.isPAP ? (
              <>
                <div>
                  <h2 className="text-base font-bold text-[#0B1C3E]">Contexte programmatique (PAP)</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Référentiel de performance associé à cette ligne budgétaire</p>
                </div>
                <div className="space-y-3">
                  {[
                    { label: 'Pilier', value: selectedLine.pilier, color: '#0B1C3E' },
                    { label: 'Axe stratégique', value: selectedLine.axe, color: '#1A6B3A' },
                    { label: 'Produit attendu', value: selectedLine.produit, color: '#2563EB' },
                    { label: 'Activité', value: selectedLine.activite, color: '#7C3AED' },
                  ].map(item => (
                    <div key={item.label} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                      <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: item.color }} />
                      <div>
                        <p className="text-[10px] uppercase tracking-wide text-slate-400">{item.label}</p>
                        <p className="text-sm font-medium text-slate-800 mt-0.5">{item.value || '—'}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {selectedLine.indicateur && (
                  <div className="p-3 bg-purple-50 border border-purple-100 rounded-lg">
                    <p className="text-[10px] uppercase tracking-wide text-purple-500 mb-2">Indicateur de performance</p>
                    <p className="text-sm font-medium text-purple-800">{selectedLine.indicateur}</p>
                    <div className="flex gap-4 mt-2">
                      <div><p className="text-[10px] text-purple-400">Cible</p><p className="text-sm font-bold text-purple-700">{selectedLine.cible}</p></div>
                      <div><p className="text-[10px] text-purple-400">Réalisation</p><p className="text-sm font-bold text-purple-700">{selectedLine.realisation}</p></div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                <div>
                  <h2 className="text-base font-bold text-[#0B1C3E]">Contexte fonctionnel</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Cette ligne relève du budget ordinaire (Hors PAP)</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Objectif fonctionnel</label>
                    <input className="form-input" placeholder="Ex: Renouvellement du parc informatique" />
                  </div>
                  <div>
                    <label className="form-label">Programme concerné</label>
                    <input className="form-input" placeholder="Ex: Programme de modernisation SI" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="form-label">Résultat attendu</label>
                    <input className="form-input" placeholder="Ex: Amélioration de la capacité opérationnelle" />
                  </div>
                </div>
                <div className="flex gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <Info size={14} className="text-slate-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-600">
                    Ligne hors budget-programme. Le suivi sera effectué par la direction budgétaire.
                  </p>
                </div>
              </>
            )}
          </div>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <div className="card space-y-4">
            <div>
              <h2 className="text-base font-bold text-[#0B1C3E]">Description du besoin</h2>
              <p className="text-xs text-slate-500 mt-0.5">Décrivez précisément votre besoin</p>
            </div>
            <div>
              <label className="form-label">Objet de la demande *</label>
              <input
                className="form-input"
                placeholder="Ex: Acquisition de 15 ordinateurs portables pour la DTIC"
                value={formData.objet}
                onChange={e => setFormData(f => ({ ...f, objet: e.target.value }))}
              />
            </div>
            <div>
              <label className="form-label">Description détaillée</label>
              <textarea
                className="form-input min-h-[80px] resize-none"
                placeholder="Contexte, spécifications techniques, références..."
                value={formData.description}
                onChange={e => setFormData(f => ({ ...f, description: e.target.value }))}
              />
            </div>
            <div>
              <label className="form-label">Justification *</label>
              <textarea
                className="form-input min-h-[80px] resize-none"
                placeholder="Pourquoi ce besoin est nécessaire et urgent..."
                value={formData.justification}
                onChange={e => setFormData(f => ({ ...f, justification: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="form-label">Priorité</label>
                <select className="form-input" value={formData.priorite} onChange={e => setFormData(f => ({ ...f, priorite: e.target.value }))}>
                  {PRIORITES.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Mode de passation</label>
                <select className="form-input" value={formData.modePassation} onChange={e => setFormData(f => ({ ...f, modePassation: e.target.value }))}>
                  <option value="">Sélectionner...</option>
                  {PASSATION_MODES.map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Date de besoin</label>
                <input type="date" className="form-input" value={formData.dateBesoins} onChange={e => setFormData(f => ({ ...f, dateBesoins: e.target.value }))} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Lieu d'exécution</label>
                <input className="form-input" placeholder="Ex: Siège CEEAC, Libreville" value={formData.lieuExecution} onChange={e => setFormData(f => ({ ...f, lieuExecution: e.target.value }))} />
              </div>
              <div>
                <label className="form-label">Fournisseur pressenti</label>
                <input className="form-input" placeholder="Optionnel" value={formData.fournisseurPressenti} onChange={e => setFormData(f => ({ ...f, fournisseurPressenti: e.target.value }))} />
              </div>
            </div>
          </div>
        )}

        {/* STEP 5 */}
        {step === 5 && (
          <div className="card space-y-4">
            <div>
              <h2 className="text-base font-bold text-[#0B1C3E]">Tâches et sous-lignes de dépense</h2>
              <p className="text-xs text-slate-500 mt-0.5">Détaillez chaque poste de dépense</p>
            </div>
            <div className="overflow-x-auto">
              <table className="data-table text-xs w-full">
                <thead>
                  <tr>
                    <th className="text-left min-w-[180px]">Désignation *</th>
                    <th className="text-center w-16">Qté</th>
                    <th className="text-center w-24">Unité</th>
                    <th className="text-right w-36">Prix unitaire</th>
                    <th className="text-right w-36">Montant XAF</th>
                    <th className="w-8"></th>
                  </tr>
                </thead>
                <tbody>
                  {subLines.map((line, idx) => (
                    <tr key={line.id}>
                      <td>
                        <input
                          className="form-input text-xs py-1"
                          placeholder={`Poste ${idx + 1}`}
                          value={line.designation}
                          onChange={e => updateSubLine(line.id, 'designation', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="number" min={1}
                          className="form-input text-xs py-1 text-center"
                          value={line.qte}
                          onChange={e => updateSubLine(line.id, 'qte', Number(e.target.value))}
                        />
                      </td>
                      <td>
                        <select className="form-input text-xs py-1" value={line.unite} onChange={e => updateSubLine(line.id, 'unite', e.target.value)}>
                          {UNITS.map(u => <option key={u}>{u}</option>)}
                        </select>
                      </td>
                      <td>
                        <input
                          type="number" min={0}
                          className="form-input text-xs py-1 text-right"
                          value={line.pu || ''}
                          placeholder="0"
                          onChange={e => updateSubLine(line.id, 'pu', Number(e.target.value))}
                        />
                      </td>
                      <td className="text-right font-mono text-[#0B1C3E] font-semibold pr-3">
                        {new Intl.NumberFormat('fr-FR').format(line.montant)}
                      </td>
                      <td className="text-center">
                        <button
                          onClick={() => removeSubLine(line.id)}
                          disabled={subLines.length === 1}
                          className="text-slate-300 hover:text-red-500 disabled:opacity-30 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-[#0B1C3E]/5 font-bold">
                    <td colSpan={4} className="text-right text-sm pr-3 py-2">Total</td>
                    <td className="text-right font-mono text-sm text-[#0B1C3E] font-bold pr-3 py-2">
                      {new Intl.NumberFormat('fr-FR').format(totalSubLines)}
                    </td>
                    <td />
                  </tr>
                </tfoot>
              </table>
            </div>
            <button onClick={addSubLine} className="btn btn-outline btn-sm gap-1.5">
              <Plus size={13} /> Ajouter une sous-ligne
            </button>
            {selectedLine && totalSubLines > selectedLine.disponible && (
              <div className="flex gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertTriangle size={15} className="text-red-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-red-700">Montant supérieur au crédit disponible</p>
                  <p className="text-xs text-red-600">
                    {fmt(totalSubLines)} demandé vs {fmt(selectedLine.disponible)} disponible.
                    La demande sera bloquée lors du contrôle budgétaire.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 6 */}
        {step === 6 && (
          <div className="card space-y-4">
            <div>
              <h2 className="text-base font-bold text-[#0B1C3E]">Imputation budgétaire</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Montant à imputer : <span className="font-bold text-[#0B1C3E]">{fmt(totalSubLines)}</span>.
                Répartissez sur une ou plusieurs lignes budgétaires.
              </p>
            </div>
            <div className="space-y-3">
              {imputLines.map((line, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="flex-1">
                    <p className="text-xs font-mono font-semibold text-[#0B1C3E]">{line.ligneCode || 'Ligne...'}</p>
                    <p className="text-xs text-slate-600">{line.libelle || 'Sélectionner une ligne'}</p>
                  </div>
                  <div className="w-44">
                    <input
                      type="number" className="form-input text-right text-sm"
                      placeholder="0" value={line.montant || ''}
                      onChange={e => {
                        const val = Number(e.target.value)
                        setImputLines(prev => prev.map((l, i) => i === idx ? { ...l, montant: val } : l))
                      }}
                    />
                  </div>
                  {imputLines.length > 1 && (
                    <button onClick={() => setImputLines(prev => prev.filter((_, i) => i !== idx))} className="text-slate-300 hover:text-red-500">
                      <X size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={() => setImputLines(prev => [...prev, { ligneCode: '', libelle: 'Autre ligne', montant: 0 }])}
              className="btn btn-outline btn-sm gap-1.5"
            >
              <Plus size={13} /> Ajouter une ligne d'imputation
            </button>
            <div className={`p-3 rounded-lg border ${imputGap === 0 ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'}`}>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-700">Total imputé</span>
                <span className={`text-sm font-bold ${imputGap === 0 ? 'text-green-700' : 'text-orange-700'}`}>{fmt(totalImput)}</span>
              </div>
              {imputGap !== 0 && (
                <p className="text-xs text-orange-600 mt-1">
                  {imputGap > 0 ? `Écart non imputé : ${fmt(imputGap)}` : `Sur-imputation : ${fmt(-imputGap)}`}
                </p>
              )}
            </div>
          </div>
        )}

        {/* STEP 7 */}
        {step === 7 && (
          <div className="card space-y-4">
            <div>
              <h2 className="text-base font-bold text-[#0B1C3E]">Pièces justificatives</h2>
              <p className="text-xs text-slate-500 mt-0.5">Les pièces (*) sont obligatoires pour la soumission</p>
            </div>
            <div className="space-y-2">
              {docs.map((doc, idx) => (
                <div key={idx} className={`flex items-center gap-3 p-3 rounded-lg border ${doc.uploaded ? 'bg-green-50 border-green-200' : 'bg-white border-slate-200'}`}>
                  <FileText size={16} className={doc.uploaded ? 'text-green-600' : 'text-slate-400'} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700">{doc.type}</p>
                    {doc.uploaded && doc.name && <p className="text-xs text-green-600 mt-0.5">{doc.name} · {doc.size}</p>}
                  </div>
                  {doc.uploaded ? (
                    <div className="flex items-center gap-2">
                      <Check size={14} className="text-green-600" />
                      <button onClick={() => setDocs(prev => prev.map((d, i) => i === idx ? { ...d, uploaded: false, name: undefined, size: undefined } : d))} className="text-slate-400 hover:text-red-500">
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDocs(prev => prev.map((d, i) => i === idx ? { ...d, uploaded: true, name: `document-${idx + 1}.pdf`, size: `${Math.floor(Math.random() * 400) + 50} Ko` } : d))}
                      className="btn btn-outline btn-sm gap-1"
                    >
                      <Upload size={12} /> Joindre
                    </button>
                  )}
                </div>
              ))}
            </div>
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
              <Upload size={24} className="mx-auto text-slate-300 mb-2" />
              <p className="text-sm text-slate-500">Glisser-déposer d'autres fichiers ici</p>
              <p className="text-xs text-slate-400 mt-1">PDF, Word, Excel — 10 Mo max</p>
            </div>
          </div>
        )}

        {/* STEP 8 */}
        {step === 8 && selectedLine && (
          <div className="space-y-4">
            <div className="card space-y-4">
              <h2 className="text-base font-bold text-[#0B1C3E]">Récapitulatif de la demande</h2>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wide mb-1">Ligne budgétaire</p>
                  <p className="font-mono font-semibold text-[#0B1C3E]">{selectedLine.code}</p>
                  <p className="text-slate-600 text-xs">{selectedLine.libelle}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wide mb-1">Montant total</p>
                  <p className="text-xl font-bold text-[#1A6B3A]">{fmt(totalSubLines)}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wide mb-1">Objet</p>
                  <p className="text-slate-700">{formData.objet || '—'}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wide mb-1">Priorité</p>
                  <span className={`badge ${formData.priorite === 'CRITIQUE' ? 'bg-red-900 text-red-100' : formData.priorite === 'URGENTE' ? 'bg-red-100 text-red-700' : formData.priorite === 'IMPORTANTE' ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-600'}`}>
                    {formData.priorite}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wide mb-2">Sous-lignes ({subLines.length})</p>
                <table className="data-table text-xs w-full">
                  <thead>
                    <tr>
                      <th className="text-left">Désignation</th>
                      <th className="text-center">Qté</th>
                      <th className="text-center">Unité</th>
                      <th className="text-right">Montant XAF</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subLines.map(l => (
                      <tr key={l.id}>
                        <td>{l.designation}</td>
                        <td className="text-center">{l.qte}</td>
                        <td className="text-center">{l.unite}</td>
                        <td className="text-right font-mono">{new Intl.NumberFormat('fr-FR').format(l.montant)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="font-bold">
                      <td colSpan={3} className="text-right text-xs py-2">Total</td>
                      <td className="text-right font-mono text-[#0B1C3E]">{new Intl.NumberFormat('fr-FR').format(totalSubLines)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
            <div className="card space-y-3">
              <p className="text-sm font-semibold text-[#0B1C3E]">Déclaration sur l'honneur</p>
              {CHECKLIST.map((item, idx) => (
                <label key={idx} className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox" className="mt-0.5 accent-[#0B1C3E]"
                    checked={checklist[idx]}
                    onChange={e => setChecklist(prev => prev.map((v, i) => i === idx ? e.target.checked : v))}
                  />
                  <span className="text-sm text-slate-700">{item}</span>
                </label>
              ))}
              {!checklist.every(Boolean) && (
                <p className="text-xs text-orange-600">Veuillez cocher toutes les cases pour continuer</p>
              )}
            </div>
          </div>
        )}

        {/* STEP 9 */}
        {step === 9 && (
          <div className="card space-y-5">
            <div>
              <h2 className="text-base font-bold text-[#0B1C3E]">Mode de soumission</h2>
              <p className="text-xs text-slate-500 mt-0.5">Choisissez comment soumettre votre demande</p>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => setSendToWorkflow(true)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${sendToWorkflow ? 'border-[#0B1C3E] bg-[#0B1C3E]/5' : 'border-slate-200 hover:border-slate-300'}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-4 h-4 rounded-full border-2 mt-0.5 flex items-center justify-center flex-shrink-0 ${sendToWorkflow ? 'border-[#0B1C3E]' : 'border-slate-300'}`}>
                    {sendToWorkflow && <div className="w-2 h-2 bg-[#0B1C3E] rounded-full" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#0B1C3E]">Soumettre pour validation</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      L'EB sera transmis immédiatement à votre responsable. Le circuit de validation démarrera.
                    </p>
                  </div>
                </div>
              </button>
              <button
                onClick={() => setSendToWorkflow(false)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${!sendToWorkflow ? 'border-slate-600 bg-slate-50' : 'border-slate-200 hover:border-slate-300'}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-4 h-4 rounded-full border-2 mt-0.5 flex items-center justify-center flex-shrink-0 ${!sendToWorkflow ? 'border-slate-600' : 'border-slate-300'}`}>
                    {!sendToWorkflow && <div className="w-2 h-2 bg-slate-600 rounded-full" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700">Sauvegarder en brouillon</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      L'EB sera sauvegardé sans être soumis. Vous pourrez le compléter ultérieurement.
                    </p>
                  </div>
                </div>
              </button>
            </div>
            {sendToWorkflow && (
              <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
                <p className="text-xs font-semibold text-blue-700 mb-2">Circuit de validation prévu :</p>
                <div className="flex items-center gap-2 flex-wrap">
                  {['Initiation', 'Validation Directeur', selectedLine?.isPAP ? 'Validation DGA' : 'Validation SG', 'Approbation Ordonnateur'].map((s, i, arr) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-xs text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">{s}</span>
                      {i < arr.length - 1 && <ArrowRight size={10} className="text-blue-400" />}
                    </div>
                  ))}
                </div>
              </div>
            )}
            <button onClick={() => setSubmitted(true)} className="btn btn-primary w-full gap-2">
              {sendToWorkflow ? <><CheckCircle size={15} /> Soumettre la demande</> : <><FileText size={15} /> Enregistrer en brouillon</>}
            </button>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => step > 1 ? setStep(s => s - 1) : onNavigate('eb-list')}
            className="btn btn-outline gap-1.5"
          >
            <ChevronLeft size={15} /> {step > 1 ? 'Précédent' : 'Annuler'}
          </button>
          {step < 9 && (
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="btn btn-primary gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {step === 8 ? 'Passer à la soumission' : 'Suivant'} <ChevronRight size={15} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
