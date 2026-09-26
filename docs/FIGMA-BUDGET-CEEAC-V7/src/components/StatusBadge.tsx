import type { EBStatus, ENGStatus, LIQStatus, ORDStatus, PAYStatus } from '../types'

type AnyStatus = EBStatus | ENGStatus | LIQStatus | ORDStatus | PAYStatus | string

const CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  BROUILLON: { label: 'Brouillon', bg: '#F1F5F9', text: '#475569' },
  SOUMIS: { label: 'Soumis', bg: '#DBEAFE', text: '#1D4ED8' },
  EN_VALIDATION: { label: 'En validation', bg: '#FEF3C7', text: '#92400E' },
  EN_PREPARATION: { label: 'En préparation', bg: '#E0F2FE', text: '#0369A1' },
  EN_VALIDATION_BUDGET: { label: 'Validation budget', bg: '#FEF3C7', text: '#92400E' },
  CONTROLE_FINANCIER: { label: 'Contrôle financier', bg: '#FDF4FF', text: '#7E22CE' },
  CONTROLE_COMPTABLE: { label: 'Contrôle comptable', bg: '#FDF4FF', text: '#7E22CE' },
  RETOURNE: { label: 'Retourné', bg: '#FFEDD5', text: '#9A3412' },
  RETOURNEE: { label: 'Retournée', bg: '#FFEDD5', text: '#9A3412' },
  REJETE: { label: 'Rejeté', bg: '#FEE2E2', text: '#991B1B' },
  REJETEE: { label: 'Rejetée', bg: '#FEE2E2', text: '#991B1B' },
  REJETE_BANQUE: { label: 'Rejet bancaire', bg: '#FEE2E2', text: '#991B1B' },
  APPROUVE: { label: 'Approuvé', bg: '#DCFCE7', text: '#166534' },
  VISE: { label: 'Visé CF', bg: '#DCFCE7', text: '#166534' },
  VALIDEE: { label: 'Validée', bg: '#DCFCE7', text: '#166534' },
  VALIDE: { label: 'Validé', bg: '#DCFCE7', text: '#166534' },
  TRANSFORME: { label: 'Transformé', bg: '#E0E7FF', text: '#3730A3' },
  TRANSFORMEE: { label: 'Transformée', bg: '#E0E7FF', text: '#3730A3' },
  ANNULE: { label: 'Annulé', bg: '#F1F5F9', text: '#475569' },
  ANNULEE: { label: 'Annulée', bg: '#F1F5F9', text: '#475569' },
  GENERE: { label: 'Généré', bg: '#E0F2FE', text: '#0369A1' },
  GENEREE: { label: 'Générée', bg: '#E0F2FE', text: '#0369A1' },
  A_CONSTATER: { label: 'À constater', bg: '#FEF3C7', text: '#92400E' },
  SERVICE_FAIT: { label: 'Service fait', bg: '#FEF9C3', text: '#713F12' },
  EN_CONTROLE: { label: 'En contrôle', bg: '#FDF4FF', text: '#7E22CE' },
  A_PREPARER: { label: 'À préparer', bg: '#E0F2FE', text: '#0369A1' },
  A_SIGNER: { label: 'À signer', bg: '#FEF3C7', text: '#92400E' },
  SIGNE: { label: 'Signé', bg: '#DCFCE7', text: '#166534' },
  TRANSMIS_AC: { label: 'Transmis AC', bg: '#E0E7FF', text: '#3730A3' },
  A_EXECUTER: { label: 'À exécuter', bg: '#FEF3C7', text: '#92400E' },
  EN_COURS_BANCAIRE: { label: 'En cours bancaire', bg: '#FDF4FF', text: '#7E22CE' },
  EXECUTE: { label: 'Exécuté', bg: '#DCFCE7', text: '#166534' },
  RAPPROCHE: { label: 'Rapproché', bg: '#E0E7FF', text: '#3730A3' },
  CLOTURE: { label: 'Clôturé', bg: '#F1F5F9', text: '#334155' },
  PRIS_EN_CHARGE: { label: 'Pris en charge', bg: '#EEF2FF', text: '#4338CA' },
  AUTORISE: { label: 'Autorisé', bg: '#D1FAE5', text: '#065F46' },
  PARTIELLEMENT_PAYE: { label: 'Partiellement payé', bg: '#FEF9C3', text: '#854D0E' },
  SUSPENDU: { label: 'Suspendu', bg: '#FEF3C7', text: '#92400E' },
  // Service fait
  CONFORME: { label: 'Conforme', bg: '#DCFCE7', text: '#166534' },
  PARTIEL: { label: 'Partiel', bg: '#FEF9C3', text: '#713F12' },
  AVEC_RESERVES: { label: 'Avec réserves', bg: '#FFEDD5', text: '#9A3412' },
  NON_CONFORME: { label: 'Non conforme', bg: '#FEE2E2', text: '#991B1B' },
  NON_FAIT: { label: 'Non fait', bg: '#FEE2E2', text: '#991B1B' },
}

interface Props {
  status: AnyStatus
  size?: 'sm' | 'md'
}

export default function StatusBadge({ status, size = 'md' }: Props) {
  const cfg = CONFIG[status] ?? { label: status, bg: '#F1F5F9', text: '#475569' }
  const pad = size === 'sm' ? 'px-2 py-0.5 text-[10.5px]' : 'px-2.5 py-0.5 text-[11.5px]'

  return (
    <span
      className={`badge ${pad}`}
      style={{ background: cfg.bg, color: cfg.text }}
    >
      {cfg.label}
    </span>
  )
}

export function PriorityBadge({ priority }: { priority?: string }) {
  const map: Record<string, { label: string; bg: string; text: string }> = {
    NORMALE:    { label: 'Normale',    bg: '#F1F5F9', text: '#475569' },
    HAUTE:      { label: 'Importante', bg: '#DBEAFE', text: '#1D4ED8' },
    IMPORTANTE: { label: 'Importante', bg: '#DBEAFE', text: '#1D4ED8' },
    URGENTE:    { label: 'Urgente',    bg: '#FEE2E2', text: '#991B1B' },
    CRITIQUE:   { label: 'Critique',   bg: '#450A0A', text: '#FEF2F2' },
  }
  const cfg = (priority ? map[priority] : null) ?? { label: priority ?? '—', bg: '#F1F5F9', text: '#475569' }
  return (
    <span className="badge px-2 py-0.5 text-[10.5px]" style={{ background: cfg.bg, color: cfg.text }}>
      {cfg.label}
    </span>
  )
}
