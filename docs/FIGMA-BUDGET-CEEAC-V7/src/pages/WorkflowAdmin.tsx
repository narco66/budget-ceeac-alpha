import React, { useState } from 'react'
import {
  Plus, ChevronRight, ChevronDown, Settings, Copy, Trash2,
  ArrowUp, ArrowDown, Save, Check, X, AlertTriangle,
  GitBranch, Play, Archive, RotateCcw, Info, Edit2,
} from 'lucide-react'
import type { Page } from '../types'

// ─── Types ──────────────────────────────────────────────────────────────────

type StepType = 'VALIDATION' | 'INFORMATION' | 'SIGNATURE' | 'CONSTATATION'
type WFStatus = 'ACTIF' | 'BROUILLON' | 'ARCHIVE'
type WFModule = 'EB' | 'ENG' | 'LIQ' | 'ORD' | 'PAY' | 'SE' | 'GED'

interface WFStep {
  id: string
  ordre: number
  label: string
  acteur: string
  type: StepType
  delaiJours: number
  retourAutorise: boolean
  rejetAutorise: boolean
  escaladeApres: number   // jours avant escalade (0 = pas d'escalade)
  commentaireObligatoire: boolean
  conditionDepassement?: string   // ex: "> 5 000 000 XAF"
}

interface Workflow {
  id: string
  code: string
  libelle: string
  module: WFModule
  description: string
  version: string
  statut: WFStatus
  dateCreation: string
  dateModification: string
  auteur: string
  steps: WFStep[]
  nbDossiersEnCours: number
}

// ─── Data initiale ──────────────────────────────────────────────────────────

const ROLES = [
  'Initiateur', 'Directeur de département', 'DGA', 'Secrétaire Général',
  'Président de la Commission', 'Directeur du Budget', 'Contrôleur Financier',
  'Chef de service', 'Agent Comptable', 'Chef Comptable', 'Expert DEPIEC',
  'Commissaire', 'Expert Budget',
]

const INITIAL_WORKFLOWS: Workflow[] = [
  {
    id: 'WF-001', code: 'WF-EB-PAP', libelle: 'Validation EB PAP', module: 'EB',
    description: "Chaîne de validation pour les Expressions de Besoin rattachées au PAP. Nécessite l'approbation du Président pour les montants > 5 M XAF.",
    version: 'v3', statut: 'ACTIF', dateCreation: '01/01/2025', dateModification: '15/03/2026',
    auteur: 'Administrateur', nbDossiersEnCours: 3,
    steps: [
      { id: 's1', ordre: 1, label: 'Initiation', acteur: 'Initiateur', type: 'VALIDATION', delaiJours: 0, retourAutorise: false, rejetAutorise: false, escaladeApres: 0, commentaireObligatoire: false },
      { id: 's2', ordre: 2, label: 'Validation Directeur', acteur: 'Directeur de département', type: 'VALIDATION', delaiJours: 3, retourAutorise: true, rejetAutorise: true, escaladeApres: 5, commentaireObligatoire: true },
      { id: 's3', ordre: 3, label: 'Validation DGA', acteur: 'DGA', type: 'VALIDATION', delaiJours: 3, retourAutorise: true, rejetAutorise: true, escaladeApres: 5, commentaireObligatoire: true },
      { id: 's4', ordre: 4, label: 'Approbation SG', acteur: 'Secrétaire Général', type: 'SIGNATURE', delaiJours: 5, retourAutorise: true, rejetAutorise: true, escaladeApres: 7, commentaireObligatoire: false },
      { id: 's5', ordre: 5, label: 'Approbation Président', acteur: 'Président de la Commission', type: 'SIGNATURE', delaiJours: 5, retourAutorise: false, rejetAutorise: true, escaladeApres: 0, commentaireObligatoire: false, conditionDepassement: '> 5 000 000 XAF' },
    ]
  },
  {
    id: 'WF-002', code: 'WF-EB-HORS-PAP', libelle: 'Validation EB Hors PAP', module: 'EB',
    description: "Chaîne de validation simplifiée pour les EB hors PAP. Le flux s'arrête au SG.",
    version: 'v2', statut: 'ACTIF', dateCreation: '01/01/2025', dateModification: '01/01/2026',
    auteur: 'Administrateur', nbDossiersEnCours: 1,
    steps: [
      { id: 's1', ordre: 1, label: 'Initiation', acteur: 'Initiateur', type: 'VALIDATION', delaiJours: 0, retourAutorise: false, rejetAutorise: false, escaladeApres: 0, commentaireObligatoire: false },
      { id: 's2', ordre: 2, label: 'Validation Directeur', acteur: 'Directeur de département', type: 'VALIDATION', delaiJours: 3, retourAutorise: true, rejetAutorise: true, escaladeApres: 5, commentaireObligatoire: true },
      { id: 's3', ordre: 3, label: 'Approbation SG', acteur: 'Secrétaire Général', type: 'SIGNATURE', delaiJours: 5, retourAutorise: true, rejetAutorise: true, escaladeApres: 7, commentaireObligatoire: false },
    ]
  },
  {
    id: 'WF-003', code: 'WF-ENG', libelle: 'Engagement standard', module: 'ENG',
    description: 'Validation des dossiers d\'engagement budgétaire avec visa obligatoire du Contrôleur Financier.',
    version: 'v4', statut: 'ACTIF', dateCreation: '01/01/2025', dateModification: '10/04/2026',
    auteur: 'Administrateur', nbDossiersEnCours: 5,
    steps: [
      { id: 's1', ordre: 1, label: 'Constitution dossier', acteur: 'Expert Budget', type: 'VALIDATION', delaiJours: 2, retourAutorise: false, rejetAutorise: false, escaladeApres: 0, commentaireObligatoire: false },
      { id: 's2', ordre: 2, label: 'Validation Budget', acteur: 'Directeur du Budget', type: 'VALIDATION', delaiJours: 3, retourAutorise: true, rejetAutorise: true, escaladeApres: 5, commentaireObligatoire: true },
      { id: 's3', ordre: 3, label: 'Visa Contrôleur Financier', acteur: 'Contrôleur Financier', type: 'SIGNATURE', delaiJours: 5, retourAutorise: true, rejetAutorise: true, escaladeApres: 7, commentaireObligatoire: true },
      { id: 's4', ordre: 4, label: 'Notification fournisseur', acteur: 'Expert Budget', type: 'INFORMATION', delaiJours: 1, retourAutorise: false, rejetAutorise: false, escaladeApres: 0, commentaireObligatoire: false },
    ]
  },
  {
    id: 'WF-004', code: 'WF-LIQ', libelle: 'Liquidation', module: 'LIQ',
    description: 'Constatation du service fait et validation de la liquidation avant ordonnancement.',
    version: 'v2', statut: 'ACTIF', dateCreation: '01/01/2025', dateModification: '01/01/2026',
    auteur: 'Administrateur', nbDossiersEnCours: 3,
    steps: [
      { id: 's1', ordre: 1, label: 'Constatation service fait', acteur: 'Chef de service', type: 'CONSTATATION', delaiJours: 3, retourAutorise: false, rejetAutorise: false, escaladeApres: 5, commentaireObligatoire: true },
      { id: 's2', ordre: 2, label: 'Vérification montant', acteur: 'Expert Budget', type: 'VALIDATION', delaiJours: 2, retourAutorise: true, rejetAutorise: true, escaladeApres: 3, commentaireObligatoire: false },
      { id: 's3', ordre: 3, label: 'Contrôle CF', acteur: 'Contrôleur Financier', type: 'VALIDATION', delaiJours: 5, retourAutorise: true, rejetAutorise: true, escaladeApres: 7, commentaireObligatoire: false },
      { id: 's4', ordre: 4, label: 'Génération ORD', acteur: 'Contrôleur Financier', type: 'INFORMATION', delaiJours: 1, retourAutorise: false, rejetAutorise: false, escaladeApres: 0, commentaireObligatoire: false },
    ]
  },
  {
    id: 'WF-005', code: 'WF-ORD', libelle: 'Ordonnancement', module: 'ORD',
    description: 'Signature de l\'ordonnateur et transmission à l\'Agence Comptable.',
    version: 'v2', statut: 'ACTIF', dateCreation: '01/01/2025', dateModification: '01/01/2026',
    auteur: 'Administrateur', nbDossiersEnCours: 2,
    steps: [
      { id: 's1', ordre: 1, label: 'Préparation OP', acteur: 'Expert Budget', type: 'VALIDATION', delaiJours: 2, retourAutorise: false, rejetAutorise: false, escaladeApres: 0, commentaireObligatoire: false },
      { id: 's2', ordre: 2, label: 'Signature ordonnateur', acteur: 'Secrétaire Général', type: 'SIGNATURE', delaiJours: 3, retourAutorise: true, rejetAutorise: true, escaladeApres: 5, commentaireObligatoire: false, conditionDepassement: '≤ 5 000 000 XAF' },
      { id: 's3', ordre: 3, label: 'Signature Président', acteur: 'Président de la Commission', type: 'SIGNATURE', delaiJours: 5, retourAutorise: false, rejetAutorise: true, escaladeApres: 0, commentaireObligatoire: false, conditionDepassement: '> 5 000 000 XAF' },
      { id: 's4', ordre: 4, label: 'Transmission AC', acteur: 'Expert Budget', type: 'INFORMATION', delaiJours: 1, retourAutorise: false, rejetAutorise: false, escaladeApres: 0, commentaireObligatoire: false },
    ]
  },
  {
    id: 'WF-006', code: 'WF-PAY', libelle: 'Paiement Agence Comptable', module: 'PAY',
    description: 'Traitement et validation du paiement par l\'Agence Comptable jusqu\'au décaissement.',
    version: 'v3', statut: 'ACTIF', dateCreation: '01/01/2025', dateModification: '20/05/2026',
    auteur: 'Administrateur', nbDossiersEnCours: 2,
    steps: [
      { id: 's1', ordre: 1, label: 'Réception dossier AC', acteur: 'Agent Comptable', type: 'VALIDATION', delaiJours: 1, retourAutorise: false, rejetAutorise: false, escaladeApres: 0, commentaireObligatoire: false },
      { id: 's2', ordre: 2, label: 'Contrôle comptable', acteur: 'Chef Comptable', type: 'VALIDATION', delaiJours: 3, retourAutorise: true, rejetAutorise: true, escaladeApres: 5, commentaireObligatoire: true },
      { id: 's3', ordre: 3, label: 'Validation Agent Comptable', acteur: 'Agent Comptable', type: 'SIGNATURE', delaiJours: 2, retourAutorise: false, rejetAutorise: true, escaladeApres: 3, commentaireObligatoire: false },
      { id: 's4', ordre: 4, label: 'Exécution virement', acteur: 'Agent Comptable', type: 'INFORMATION', delaiJours: 2, retourAutorise: false, rejetAutorise: false, escaladeApres: 0, commentaireObligatoire: false },
      { id: 's5', ordre: 5, label: 'Rapprochement bancaire', acteur: 'Chef Comptable', type: 'VALIDATION', delaiJours: 5, retourAutorise: false, rejetAutorise: false, escaladeApres: 0, commentaireObligatoire: false },
    ]
  },
  {
    id: 'WF-007', code: 'WF-SE-COLLECTE', libelle: 'Collecte S&E — données indicateurs', module: 'SE',
    description: 'Validation des données de réalisation des indicateurs PAP avant publication trimestrielle.',
    version: 'v1', statut: 'BROUILLON', dateCreation: '01/06/2026', dateModification: '01/09/2026',
    auteur: 'mc.nkoghe', nbDossiersEnCours: 0,
    steps: [
      { id: 's1', ordre: 1, label: 'Saisie données', acteur: 'Expert DEPIEC', type: 'VALIDATION', delaiJours: 5, retourAutorise: false, rejetAutorise: false, escaladeApres: 7, commentaireObligatoire: true },
      { id: 's2', ordre: 2, label: 'Validation DEPIEC', acteur: 'Expert DEPIEC', type: 'VALIDATION', delaiJours: 3, retourAutorise: true, rejetAutorise: false, escaladeApres: 5, commentaireObligatoire: false },
    ]
  },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

const STEP_TYPE_CFG: Record<StepType, { label: string; bg: string; text: string; border: string }> = {
  VALIDATION: { label: 'Validation', bg: '#EDF2FB', text: '#1B3269', border: '#A5B4FC' },
  INFORMATION: { label: 'Information', bg: '#F0FDF4', text: '#166534', border: '#86EFAC' },
  SIGNATURE: { label: 'Signature', bg: '#FDF4FF', text: '#7E22CE', border: '#D8B4FE' },
  CONSTATATION: { label: 'Constatation', bg: '#FEF3C7', text: '#92400E', border: '#FCD34D' },
}

const WF_STATUS_CFG: Record<WFStatus, { label: string; bg: string; text: string }> = {
  ACTIF: { label: 'Actif', bg: '#DCFCE7', text: '#166534' },
  BROUILLON: { label: 'Brouillon', bg: '#FEF3C7', text: '#92400E' },
  ARCHIVE: { label: 'Archivé', bg: '#F1F5F9', text: '#64748B' },
}

const MODULE_COLORS: Record<WFModule, { bg: string; text: string }> = {
  EB: { bg: '#EDF2FB', text: '#1B3269' },
  ENG: { bg: '#DCFCE7', text: '#166534' },
  LIQ: { bg: '#FEF3C7', text: '#92400E' },
  ORD: { bg: '#EDE9FE', text: '#5B21B6' },
  PAY: { bg: '#FEE2E2', text: '#991B1B' },
  SE: { bg: '#FDF4FF', text: '#7E22CE' },
  GED: { bg: '#F0FDF4', text: '#166534' },
}

const newStepId = () => `s${Date.now()}`

const makeNewStep = (ordre: number): WFStep => ({
  id: newStepId(), ordre,
  label: `Étape ${ordre}`,
  acteur: ROLES[0],
  type: 'VALIDATION',
  delaiJours: 3,
  retourAutorise: true,
  rejetAutorise: true,
  escaladeApres: 0,
  commentaireObligatoire: false,
})

// ─── Step visual node ─────────────────────────────────────────────────────────

function StepNode({
  step, index, total, editing, onEdit, onDelete, onMoveUp, onMoveDown,
}: {
  step: WFStep
  index: number
  total: number
  editing: boolean
  onEdit: () => void
  onDelete: () => void
  onMoveUp: () => void
  onMoveDown: () => void
}) {
  const tc = STEP_TYPE_CFG[step.type]
  return (
    <div className="flex items-start gap-3">
      {/* Connector line + circle */}
      <div className="flex flex-col items-center flex-shrink-0" style={{ marginTop: 2 }}>
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-[13px] text-white flex-shrink-0 shadow-sm"
          style={{ background: step.type === 'SIGNATURE' ? '#7E22CE' : step.type === 'INFORMATION' ? '#16A34A' : step.type === 'CONSTATATION' ? '#D97706' : '#0B1C3E' }}
        >
          {index + 1}
        </div>
        {index < total - 1 && (
          <div className="w-0.5 flex-1 mt-1" style={{ background: '#E2E8F0', minHeight: 32 }} />
        )}
      </div>

      {/* Card */}
      <div
        className={`flex-1 mb-4 rounded-xl border transition-all ${editing ? 'shadow-md' : 'hover:shadow-sm'}`}
        style={{ borderColor: editing ? tc.border : '#E2E8F0', borderWidth: editing ? 2 : 1 }}
      >
        <div className="px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <span className="badge text-[10px] px-1.5 py-0.5" style={{ background: tc.bg, color: tc.text }}>{tc.label}</span>
            <span className="font-semibold text-[13.5px] text-gray-900 truncate">{step.label}</span>
            <span className="text-[12px] text-gray-400">→</span>
            <span className="text-[12.5px] text-gray-600 truncate">{step.acteur}</span>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <span className="text-[11px] text-gray-400 font-mono mr-2">{step.delaiJours}j</span>
            {step.retourAutorise && <span className="badge text-[9px] px-1 py-0.5" style={{ background: '#FFEDD5', color: '#9A3412' }}>↩ retour</span>}
            {step.rejetAutorise && <span className="badge text-[9px] px-1 py-0.5" style={{ background: '#FEE2E2', color: '#991B1B' }}>✕ rejet</span>}
            {step.conditionDepassement && <span className="badge text-[9px] px-1 py-0.5" style={{ background: '#EDE9FE', color: '#5B21B6' }}>⚡ {step.conditionDepassement}</span>}
            <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600" onClick={onMoveUp} disabled={index === 0} title="Monter">
              <ArrowUp size={12} />
            </button>
            <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600" onClick={onMoveDown} disabled={index === total - 1} title="Descendre">
              <ArrowDown size={12} />
            </button>
            <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-blue-50 text-gray-400 hover:text-blue-600" onClick={onEdit} title="Modifier">
              <Edit2 size={12} />
            </button>
            <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-red-50 text-gray-400 hover:text-red-500" onClick={onDelete} title="Supprimer">
              <Trash2 size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Step Edit Form ───────────────────────────────────────────────────────────

function StepEditForm({ step, onChange, onClose }: { step: WFStep; onChange: (s: WFStep) => void; onClose: () => void }) {
  const [local, setLocal] = useState<WFStep>({ ...step })
  const upd = (patch: Partial<WFStep>) => setLocal(prev => ({ ...prev, ...patch }))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(11,28,62,0.45)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-[520px] max-h-[85vh] flex flex-col overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <div className="font-bold text-[15px] text-navy-900">Configurer l'étape</div>
            <div className="text-[11.5px] text-gray-400 mt-0.5">Étape {local.ordre}</div>
          </div>
          <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 text-gray-400" onClick={onClose}>
            <X size={15} />
          </button>
        </div>
        <div className="px-6 py-5 overflow-y-auto space-y-4">
          <div>
            <label className="form-label">Libellé de l'étape *</label>
            <input className="form-input" value={local.label} onChange={e => upd({ label: e.target.value })} placeholder="Ex: Validation Directeur" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Acteur (rôle) *</label>
              <select className="form-input" value={local.acteur} onChange={e => upd({ acteur: e.target.value })}>
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">Type d'action *</label>
              <select className="form-input" value={local.type} onChange={e => upd({ type: e.target.value as StepType })}>
                {(Object.keys(STEP_TYPE_CFG) as StepType[]).map(t => (
                  <option key={t} value={t}>{STEP_TYPE_CFG[t].label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Délai SLA (jours ouvrés)</label>
              <input className="form-input" type="number" min={0} max={30} value={local.delaiJours}
                onChange={e => upd({ delaiJours: Number(e.target.value) })} />
            </div>
            <div>
              <label className="form-label">Escalade après (jours, 0 = désactivée)</label>
              <input className="form-input" type="number" min={0} max={30} value={local.escaladeApres}
                onChange={e => upd({ escaladeApres: Number(e.target.value) })} />
            </div>
          </div>
          <div>
            <label className="form-label">Condition d'application (optionnel)</label>
            <input className="form-input" value={local.conditionDepassement ?? ''} placeholder="Ex: > 5 000 000 XAF"
              onChange={e => upd({ conditionDepassement: e.target.value || undefined })} />
            <div className="text-[11px] text-gray-400 mt-1 flex items-center gap-1"><Info size={10} /> Laissez vide si l'étape s'applique toujours</div>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <div className="text-[11px] uppercase font-semibold tracking-wider text-gray-400">Options</div>
            {[
              { key: 'retourAutorise', label: 'Retour autorisé (l\'acteur peut renvoyer au demandeur)' },
              { key: 'rejetAutorise', label: 'Rejet autorisé (l\'acteur peut rejeter définitivement)' },
              { key: 'commentaireObligatoire', label: 'Commentaire obligatoire lors d\'un retour ou rejet' },
            ].map(opt => (
              <label key={opt.key} className="flex items-center gap-3 cursor-pointer group">
                <div
                  className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-colors ${local[opt.key as keyof WFStep] ? 'bg-navy-900' : 'border border-gray-300 bg-white'}`}
                  style={local[opt.key as keyof WFStep] ? { background: '#0B1C3E' } : {}}
                  onClick={() => upd({ [opt.key]: !local[opt.key as keyof WFStep] } as Partial<WFStep>)}
                >
                  {local[opt.key as keyof WFStep] && <Check size={11} className="text-white" />}
                </div>
                <span className="text-[12.5px] text-gray-700">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
          <button className="btn btn-outline" onClick={onClose}>Annuler</button>
          <button
            className="btn btn-primary gap-1.5"
            onClick={() => { onChange(local); onClose() }}
          >
            <Check size={13} /> Appliquer
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Workflow Detail / Edit ───────────────────────────────────────────────────

function WorkflowDetail({
  wf: initial,
  onSave,
  onBack,
  onDelete,
  onDuplicate,
}: {
  wf: Workflow
  onSave: (wf: Workflow) => void
  onBack: () => void
  onDelete: (id: string) => void
  onDuplicate: (wf: Workflow) => void
}) {
  const [wf, setWf] = useState<Workflow>({ ...initial, steps: initial.steps.map(s => ({ ...s })) })
  const [editingStep, setEditingStep] = useState<WFStep | null>(null)
  const [dirty, setDirty] = useState(false)
  const [saved, setSaved] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [activeTab, setActiveTab] = useState<'config' | 'simulation' | 'history'>('config')
  const [restoreVersion, setRestoreVersion] = useState<{ v: string; date: string } | null>(null)

  const upd = (patch: Partial<Workflow>) => { setWf(p => ({ ...p, ...patch })); setDirty(true); setSaved(false) }

  const reorderSteps = (steps: WFStep[]) =>
    steps.map((s, i) => ({ ...s, ordre: i + 1 }))

  const addStep = () => {
    const steps = reorderSteps([...wf.steps, makeNewStep(wf.steps.length + 1)])
    upd({ steps })
    setEditingStep(steps[steps.length - 1])
  }

  const deleteStep = (id: string) => {
    upd({ steps: reorderSteps(wf.steps.filter(s => s.id !== id)) })
  }

  const moveStep = (id: string, dir: 'up' | 'down') => {
    const arr = [...wf.steps]
    const idx = arr.findIndex(s => s.id === id)
    if (dir === 'up' && idx > 0) [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]]
    if (dir === 'down' && idx < arr.length - 1) [arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]]
    upd({ steps: reorderSteps(arr) })
  }

  const applyStepEdit = (updated: WFStep) => {
    upd({ steps: wf.steps.map(s => s.id === updated.id ? updated : s) })
    setEditingStep(null)
  }

  const handleSave = () => {
    const now = new Date().toLocaleDateString('fr-FR')
    const saved_ = { ...wf, dateModification: now }
    onSave(saved_)
    setDirty(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const totalDelai = wf.steps.reduce((s, step) => s + step.delaiJours, 0)

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-start gap-3">
        <button className="mt-0.5 btn btn-outline btn-sm gap-1" onClick={onBack}>
          <ChevronRight size={13} className="rotate-180" /> Retour
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="section-title text-xl">{wf.libelle}</h1>
            <span className="font-mono text-[12px] text-gray-400">{wf.code}</span>
            <span className="badge text-[10.5px] px-2 py-0.5" style={{ background: WF_STATUS_CFG[wf.statut].bg, color: WF_STATUS_CFG[wf.statut].text }}>
              {WF_STATUS_CFG[wf.statut].label}
            </span>
            <span className="badge text-[10.5px] px-2 py-0.5" style={{ background: MODULE_COLORS[wf.module].bg, color: MODULE_COLORS[wf.module].text }}>{wf.module}</span>
            <span className="badge text-[10.5px] px-2 py-0.5" style={{ background: '#F1F5F9', color: '#64748B' }}>{wf.version}</span>
            {dirty && <span className="text-[11.5px] text-amber-600 font-medium flex items-center gap-1"><AlertTriangle size={10} /> Modifications non enregistrées</span>}
            {saved && <span className="text-[11.5px] text-green-600 font-medium flex items-center gap-1"><Check size={10} /> Enregistré</span>}
          </div>
          <div className="text-[12.5px] text-gray-500 mt-1">{wf.description}</div>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button className="btn btn-outline btn-sm gap-1" title="Dupliquer" onClick={() => onDuplicate(wf)}><Copy size={12} /> Dupliquer</button>
          <button className="btn btn-outline btn-sm gap-1 text-red-600 hover:bg-red-50" onClick={() => setConfirmDelete(true)}><Trash2 size={12} /> Supprimer</button>
          <button
            className="btn btn-primary btn-sm gap-1.5"
            disabled={!dirty}
            style={{ opacity: dirty ? 1 : 0.5 }}
            onClick={handleSave}
          >
            <Save size={13} /> Enregistrer
          </button>
        </div>
      </div>

      {/* Meta info strip */}
      <div className="card px-5 py-3 flex items-center gap-8 flex-wrap">
        {[
          { label: 'Module', value: wf.module },
          { label: 'Étapes', value: `${wf.steps.length} étapes` },
          { label: 'Délai total estimé', value: `${totalDelai} jours ouvrés` },
          { label: 'Dossiers en cours', value: `${wf.nbDossiersEnCours} dossier${wf.nbDossiersEnCours > 1 ? 's' : ''}` },
          { label: 'Dernière modification', value: wf.dateModification },
          { label: 'Par', value: wf.auteur },
        ].map((m, i) => (
          <div key={i}>
            <div className="text-[10px] uppercase font-semibold tracking-wider text-gray-400">{m.label}</div>
            <div className="font-semibold text-[13px] text-gray-800 mt-0.5">{m.value}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 gap-0 -mt-2">
        {([['config', 'Configuration des étapes', <Settings size={13} />], ['simulation', 'Simulation', <Play size={13} />], ['history', 'Historique versions', <RotateCcw size={13} />]] as const).map(([id, label, icon]) => (
          <button key={id} className={`tab-item flex items-center gap-1.5 ${activeTab === id ? 'active' : ''}`} onClick={() => setActiveTab(id)}>
            {icon} {label}
          </button>
        ))}
      </div>

      {activeTab === 'config' && (
        <div className="grid grid-cols-3 gap-5">
          {/* Step pipeline */}
          <div className="col-span-2 space-y-0">
            <div className="flex items-center justify-between mb-4">
              <div className="text-[11px] uppercase font-semibold tracking-wider text-gray-400">Chaîne de validation</div>
              <button className="btn btn-outline btn-sm gap-1.5" onClick={addStep}>
                <Plus size={12} /> Ajouter une étape
              </button>
            </div>
            {wf.steps.length === 0 ? (
              <div className="card p-8 text-center text-gray-400">
                <GitBranch size={28} className="mx-auto mb-2 opacity-30" />
                <div className="text-[13px]">Aucune étape configurée</div>
                <button className="btn btn-primary btn-sm gap-1 mt-3" onClick={addStep}><Plus size={12} /> Ajouter la première étape</button>
              </div>
            ) : (
              <div>
                {wf.steps.map((step, idx) => (
                  <StepNode
                    key={step.id}
                    step={step}
                    index={idx}
                    total={wf.steps.length}
                    editing={editingStep?.id === step.id}
                    onEdit={() => setEditingStep(step)}
                    onDelete={() => deleteStep(step.id)}
                    onMoveUp={() => moveStep(step.id, 'up')}
                    onMoveDown={() => moveStep(step.id, 'down')}
                  />
                ))}
                <button className="btn btn-outline btn-sm gap-1.5 mt-1" onClick={addStep}>
                  <Plus size={12} /> Ajouter une étape
                </button>
              </div>
            )}
          </div>

          {/* Right panel — metadata edit */}
          <div className="space-y-4">
            <div className="card p-4 space-y-4">
              <div className="text-[11px] uppercase font-semibold tracking-wider text-gray-400">Métadonnées</div>
              <div>
                <label className="form-label">Libellé *</label>
                <input className="form-input text-[13px]" value={wf.libelle} onChange={e => upd({ libelle: e.target.value })} />
              </div>
              <div>
                <label className="form-label">Code *</label>
                <input className="form-input text-[13px] font-mono" value={wf.code} onChange={e => upd({ code: e.target.value })} />
              </div>
              <div>
                <label className="form-label">Module</label>
                <select className="form-input text-[13px]" value={wf.module} onChange={e => upd({ module: e.target.value as WFModule })}>
                  {(['EB', 'ENG', 'LIQ', 'ORD', 'PAY', 'SE', 'GED'] as WFModule[]).map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Description</label>
                <textarea className="form-input text-[13px] resize-none" rows={3} value={wf.description} onChange={e => upd({ description: e.target.value })} />
              </div>
              <div>
                <label className="form-label">Statut</label>
                <select className="form-input text-[13px]" value={wf.statut} onChange={e => upd({ statut: e.target.value as WFStatus })}>
                  {(['ACTIF', 'BROUILLON', 'ARCHIVE'] as WFStatus[]).map(s => (
                    <option key={s} value={s}>{WF_STATUS_CFG[s].label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Stats */}
            <div className="card p-4 space-y-3">
              <div className="text-[11px] uppercase font-semibold tracking-wider text-gray-400">Statistiques étapes</div>
              {(Object.keys(STEP_TYPE_CFG) as StepType[]).map(type => {
                const count = wf.steps.filter(s => s.type === type).length
                if (count === 0) return null
                const tc = STEP_TYPE_CFG[type]
                return (
                  <div key={type} className="flex items-center justify-between">
                    <span className="badge text-[10.5px] px-2 py-0.5" style={{ background: tc.bg, color: tc.text }}>{tc.label}</span>
                    <span className="font-mono font-bold text-[13px] text-gray-700">{count}</span>
                  </div>
                )
              })}
              <div className="border-t border-gray-100 pt-2 flex items-center justify-between">
                <span className="text-[12.5px] text-gray-600">Délai total SLA</span>
                <span className="font-mono font-bold text-[13px] text-navy-900">{totalDelai}j</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12.5px] text-gray-600">Étapes avec retour</span>
                <span className="font-mono font-bold text-[13px] text-amber-700">{wf.steps.filter(s => s.retourAutorise).length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12.5px] text-gray-600">Étapes avec rejet</span>
                <span className="font-mono font-bold text-[13px] text-red-600">{wf.steps.filter(s => s.rejetAutorise).length}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'simulation' && (
        <div className="card p-6">
          <div className="text-[11px] uppercase font-semibold tracking-wider text-gray-400 mb-5">Simulation du parcours de validation</div>
          <div className="relative">
            {/* horizontal pipeline */}
            <div className="flex items-start gap-0 overflow-x-auto pb-4">
              {wf.steps.map((step, idx) => {
                const tc = STEP_TYPE_CFG[step.type]
                return (
                  <React.Fragment key={step.id}>
                    <div className="flex flex-col items-center min-w-[140px] max-w-[160px]">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-[13px] shadow mb-2"
                        style={{ background: step.type === 'SIGNATURE' ? '#7E22CE' : step.type === 'INFORMATION' ? '#16A34A' : step.type === 'CONSTATATION' ? '#D97706' : '#0B1C3E' }}
                      >
                        {idx + 1}
                      </div>
                      <div className="text-center px-2">
                        <div className="font-semibold text-[12px] text-gray-900 leading-tight">{step.label}</div>
                        <div className="text-[10.5px] text-gray-500 mt-0.5">{step.acteur}</div>
                        <span className="badge text-[9px] px-1.5 py-0.5 mt-1" style={{ background: tc.bg, color: tc.text }}>{tc.label}</span>
                        <div className="text-[10px] text-gray-400 mt-1 font-mono">{step.delaiJours === 0 ? 'Immédiat' : `${step.delaiJours}j`}</div>
                      </div>
                      {(step.retourAutorise || step.rejetAutorise) && (
                        <div className="flex gap-1 mt-1.5 flex-wrap justify-center">
                          {step.retourAutorise && <span className="text-[9px] text-amber-700">↩</span>}
                          {step.rejetAutorise && <span className="text-[9px] text-red-600">✕</span>}
                        </div>
                      )}
                    </div>
                    {idx < wf.steps.length - 1 && (
                      <div className="flex items-center" style={{ marginTop: 16, marginLeft: -4, marginRight: -4 }}>
                        <div className="h-0.5 w-8 bg-gray-300" />
                        <ChevronRight size={12} className="text-gray-300 flex-shrink-0" />
                      </div>
                    )}
                  </React.Fragment>
                )
              })}
            </div>
          </div>
          <div className="mt-4 p-4 rounded-xl bg-blue-50 border border-blue-100 text-[12.5px] text-blue-800">
            <strong>Délai total estimé :</strong> {totalDelai} jours ouvrés — {wf.steps.filter(s => s.retourAutorise).length} étape(s) avec retour possible — {wf.steps.filter(s => s.rejetAutorise).length} avec rejet
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 font-semibold text-[15px] text-gray-800">Historique des versions</div>
          <table className="data-table">
            <thead>
              <tr><th>Version</th><th>Date</th><th>Auteur</th><th>Modifications</th><th>Statut</th><th></th></tr>
            </thead>
            <tbody>
              {[
                { v: wf.version, date: wf.dateModification, auteur: wf.auteur, note: 'Version courante', statut: wf.statut, current: true },
                { v: 'v2', date: '01/01/2026', auteur: 'Administrateur', note: 'Ajout étape Validation DGA', statut: 'ARCHIVE' as WFStatus, current: false },
                { v: 'v1', date: '01/01/2025', auteur: 'Administrateur', note: 'Version initiale', statut: 'ARCHIVE' as WFStatus, current: false },
              ].map((row, i) => (
                <tr key={i}>
                  <td><span className="font-mono font-bold text-[12px] text-navy-900">{row.v}</span></td>
                  <td className="font-mono text-[12px] text-gray-500">{row.date}</td>
                  <td className="text-[12.5px] text-gray-600">{row.auteur}</td>
                  <td className="text-[12.5px] text-gray-700">{row.note}</td>
                  <td><span className="badge text-[10.5px] px-2 py-0.5" style={{ background: WF_STATUS_CFG[row.statut].bg, color: WF_STATUS_CFG[row.statut].text }}>{WF_STATUS_CFG[row.statut].label}</span></td>
                  <td>{!row.current && <button className="btn btn-outline btn-sm gap-1" onClick={() => setRestoreVersion({ v: row.v, date: row.date })}><RotateCcw size={10} /> Restaurer</button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Step edit modal */}
      {editingStep && (
        <StepEditForm
          step={editingStep}
          onChange={applyStepEdit}
          onClose={() => setEditingStep(null)}
        />
      )}

      {/* Confirm restore */}
      {restoreVersion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(11,28,62,0.45)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-[460px] p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <RotateCcw size={16} className="text-blue-600" />
              </div>
              <div>
                <div className="font-bold text-[15px] text-gray-900">Restaurer cette version ?</div>
                <div className="text-[12.5px] text-gray-500 mt-0.5">{restoreVersion.v} — {restoreVersion.date}</div>
              </div>
            </div>
            <p className="text-[13px] text-gray-600 mb-4">
              Vous allez restaurer la version du <strong>{restoreVersion.date}</strong>. Cette action remplacera la version actuelle ({wf.version}). La version courante sera archivée.
            </p>
            <div className="flex justify-end gap-2">
              <button className="btn btn-outline" onClick={() => setRestoreVersion(null)}>Annuler</button>
              <button className="btn btn-primary gap-1" onClick={() => { setRestoreVersion(null); setSaved(true); setDirty(false) }}>
                <RotateCcw size={12} /> Confirmer la restauration
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm delete */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(11,28,62,0.45)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-[420px] p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <Trash2 size={16} className="text-red-600" />
              </div>
              <div>
                <div className="font-bold text-[15px] text-gray-900">Supprimer ce workflow ?</div>
                <div className="text-[12.5px] text-gray-500 mt-0.5">{wf.libelle} ({wf.code})</div>
              </div>
            </div>
            {wf.nbDossiersEnCours > 0 && (
              <div className="alert-banner mb-3" style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}>
                <AlertTriangle size={13} className="text-red-500 flex-shrink-0" />
                <span className="text-[12.5px] text-red-800">{wf.nbDossiersEnCours} dossier(s) en cours utilisent ce workflow. La suppression est irréversible.</span>
              </div>
            )}
            <div className="flex justify-end gap-2 mt-4">
              <button className="btn btn-outline" onClick={() => setConfirmDelete(false)}>Annuler</button>
              <button className="btn btn-danger gap-1" onClick={() => { onDelete(wf.id); onBack() }}>
                <Trash2 size={12} /> Confirmer la suppression
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Workflow List ────────────────────────────────────────────────────────────

interface Props {
  onNavigate: (page: Page, id?: string) => void
}

export default function WorkflowAdmin({ onNavigate: _navigate }: Props) {
  const [workflows, setWorkflows] = useState<Workflow[]>(INITIAL_WORKFLOWS)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [filter, setFilter] = useState<WFStatus | 'ALL'>('ALL')
  const [moduleFilter, setModuleFilter] = useState<WFModule | 'ALL'>('ALL')
  const [search, setSearch] = useState('')
  const [creating, setCreating] = useState(false)

  const selected = workflows.find(w => w.id === selectedId) ?? null

  const filtered = workflows.filter(w => {
    if (filter !== 'ALL' && w.statut !== filter) return false
    if (moduleFilter !== 'ALL' && w.module !== moduleFilter) return false
    if (search && !w.libelle.toLowerCase().includes(search.toLowerCase()) && !w.code.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const handleSave = (updated: Workflow) => {
    setWorkflows(ws => ws.map(w => w.id === updated.id ? updated : w))
  }

  const handleDelete = (id: string) => {
    setWorkflows(ws => ws.filter(w => w.id !== id))
    setSelectedId(null)
  }

  const handleDuplicate = (wf: Workflow) => {
    const copy: Workflow = {
      ...wf,
      id: `WF-${String(workflows.length + 1).padStart(3, '0')}`,
      code: `${wf.code}-COPIE`,
      libelle: `Copie de ${wf.libelle}`,
      statut: 'BROUILLON',
      dateCreation: new Date().toLocaleDateString('fr-FR'),
      dateModification: new Date().toLocaleDateString('fr-FR'),
      nbDossiersEnCours: 0,
      steps: wf.steps.map(s => ({ ...s })),
    }
    setWorkflows(ws => [...ws, copy])
    setSelectedId(copy.id)
  }

  const handleCreate = () => {
    const newWf: Workflow = {
      id: `WF-${String(workflows.length + 1).padStart(3, '0')}`,
      code: `WF-NOUVEAU-${workflows.length + 1}`,
      libelle: 'Nouveau workflow',
      module: 'EB',
      description: '',
      version: 'v1',
      statut: 'BROUILLON',
      dateCreation: new Date().toLocaleDateString('fr-FR'),
      dateModification: new Date().toLocaleDateString('fr-FR'),
      auteur: 'a.mbongo',
      steps: [],
      nbDossiersEnCours: 0,
    }
    setWorkflows(ws => [...ws, newWf])
    setSelectedId(newWf.id)
    setCreating(false)
  }

  if (selected) {
    return (
      <WorkflowDetail
        wf={selected}
        onSave={handleSave}
        onBack={() => setSelectedId(null)}
        onDelete={handleDelete}
        onDuplicate={handleDuplicate}
      />
    )
  }

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="section-title text-2xl">Gestion des Workflows</h1>
          <p className="text-sm text-gray-500 mt-0.5">Configuration des chaînes de validation — {workflows.filter(w => w.statut === 'ACTIF').length} workflows actifs</p>
        </div>
        <button className="btn btn-primary btn-sm gap-1.5" onClick={handleCreate}>
          <Plus size={13} /> Nouveau workflow
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Workflows actifs', value: workflows.filter(w => w.statut === 'ACTIF').length, color: '#16A34A' },
          { label: 'En brouillon', value: workflows.filter(w => w.statut === 'BROUILLON').length, color: '#D97706' },
          { label: 'Archivés', value: workflows.filter(w => w.statut === 'ARCHIVE').length, color: '#64748B' },
          { label: 'Dossiers en cours', value: workflows.reduce((s, w) => s + w.nbDossiersEnCours, 0), color: '#0B1C3E' },
        ].map((k, i) => (
          <div key={i} className="kpi-card py-3" style={{ borderLeft: `3px solid ${k.color}` }}>
            <div className="text-[10px] uppercase font-semibold tracking-wider text-gray-400">{k.label}</div>
            <div className="amount text-2xl font-bold mt-0.5" style={{ color: k.color }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative">
          <input className="form-input pl-8 py-2 text-[13px] w-56" placeholder="Code, libellé…" value={search} onChange={e => setSearch(e.target.value)} />
          <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
        </div>
        <div className="flex gap-1">
          {(['ALL', 'ACTIF', 'BROUILLON', 'ARCHIVE'] as const).map(s => (
            <button key={s} className={`btn btn-sm text-[11.5px] ${filter === s ? 'btn-navy' : 'btn-outline'}`} onClick={() => setFilter(s)}>
              {s === 'ALL' ? 'Tous' : WF_STATUS_CFG[s].label}
            </button>
          ))}
        </div>
        <div className="flex gap-1">
          {(['ALL', 'EB', 'ENG', 'LIQ', 'ORD', 'PAY', 'SE', 'GED'] as const).map(m => (
            <button key={m} className={`btn btn-sm text-[11px] ${moduleFilter === m ? 'btn-navy' : 'btn-outline'}`} onClick={() => setModuleFilter(m)}>
              {m === 'ALL' ? 'Modules' : m}
            </button>
          ))}
        </div>
        <span className="text-[12px] text-gray-400 ml-auto">{filtered.length} workflow{filtered.length > 1 ? 's' : ''}</span>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <table className="data-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Libellé</th>
              <th>Module</th>
              <th>Étapes</th>
              <th>Délai total</th>
              <th>Dossiers en cours</th>
              <th>Version</th>
              <th>Statut</th>
              <th>Modifié le</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(wf => {
              const sc = WF_STATUS_CFG[wf.statut]
              const mc = MODULE_COLORS[wf.module]
              const delai = wf.steps.reduce((s, step) => s + step.delaiJours, 0)
              return (
                <tr key={wf.id} className="cursor-pointer hover:bg-gray-50/80" onClick={() => setSelectedId(wf.id)}>
                  <td><span className="font-mono text-[12px] font-bold text-navy-900">{wf.code}</span></td>
                  <td>
                    <div className="font-semibold text-[13px] text-gray-900">{wf.libelle}</div>
                    <div className="text-[11.5px] text-gray-400 line-clamp-1 max-w-[220px]">{wf.description}</div>
                  </td>
                  <td><span className="badge text-[10.5px] px-2 py-0.5" style={{ background: mc.bg, color: mc.text }}>{wf.module}</span></td>
                  <td>
                    <div className="flex items-center gap-1.5">
                      <div className="flex gap-0.5">
                        {wf.steps.map((s, i) => (
                          <div
                            key={i}
                            className="w-3 h-3 rounded-sm"
                            title={s.label}
                            style={{ background: s.type === 'SIGNATURE' ? '#7E22CE' : s.type === 'INFORMATION' ? '#16A34A' : s.type === 'CONSTATATION' ? '#D97706' : '#0B1C3E', opacity: 0.7 }}
                          />
                        ))}
                      </div>
                      <span className="text-[12px] font-mono font-bold text-gray-700">{wf.steps.length}</span>
                    </div>
                  </td>
                  <td className="font-mono text-[12.5px] text-gray-700">{delai}j</td>
                  <td>
                    {wf.nbDossiersEnCours > 0
                      ? <span className="font-mono font-bold text-[13px] text-amber-600">{wf.nbDossiersEnCours}</span>
                      : <span className="text-gray-300">—</span>}
                  </td>
                  <td><span className="badge text-[10.5px] px-2 py-0.5" style={{ background: '#F1F5F9', color: '#64748B' }}>{wf.version}</span></td>
                  <td><span className="badge text-[10.5px] px-2 py-0.5" style={{ background: sc.bg, color: sc.text }}>{sc.label}</span></td>
                  <td className="font-mono text-[11.5px] text-gray-400">{wf.dateModification}</td>
                  <td>
                    <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                      <button className="btn btn-outline btn-sm gap-1" onClick={() => setSelectedId(wf.id)}>
                        <Edit2 size={11} /> Modifier
                      </button>
                      {wf.statut === 'ACTIF'
                        ? <button className="btn btn-sm gap-1" style={{ background: '#FEF3C7', color: '#92400E', border: '1px solid #FCD34D' }}
                            onClick={() => setWorkflows(ws => ws.map(w => w.id === wf.id ? { ...w, statut: 'ARCHIVE' } : w))}>
                            <Archive size={11} />
                          </button>
                        : <button className="btn btn-sm gap-1" style={{ background: '#DCFCE7', color: '#166534', border: '1px solid #86EFAC' }}
                            onClick={() => setWorkflows(ws => ws.map(w => w.id === wf.id ? { ...w, statut: 'ACTIF' } : w))}>
                            <Play size={11} />
                          </button>}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
