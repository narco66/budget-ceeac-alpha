import { PDFShell, SectionHeader, InfoGrid, FinancialTable, PDFBadge, SignatureRow } from './PDFShell'
import type { ENGItem } from '../../types'

const fmt = (n: number) => new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(n)

interface Props {
  item: ENGItem
  dateEdition?: string
}

export default function CertificatEngagement({ item, dateEdition }: Props) {
  const now = dateEdition ?? new Date().toLocaleDateString('fr-FR') + ' ' + new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  const creditInitial = (item.creditAvant ?? 0) + (item.montant ?? 0)
  const reserve = Math.round((item.montant ?? 0) * 0.95)

  return (
    <PDFShell
      codeRapport="RPT-CERT-ENG-001"
      dateEdition={now}
      exercice="2026"
      page="1 / 1"
    >
      {/* ── Document title ── */}
      <div style={{ textAlign: 'center', margin: '18px 0 20px' }}>
        <div style={{ fontSize: '18px', fontWeight: 800, color: '#0B1C3E', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          Certificat d&apos;Engagement
        </div>
        <div style={{ fontSize: '11px', fontWeight: 600, color: '#1A6B3A', marginTop: '4px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Exercice Budgétaire 2026
        </div>
      </div>

      {/* ── Reference banner ── */}
      <div style={{
        border: '1.5px solid #CBD5E1',
        borderRadius: '6px',
        padding: '10px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '4px',
        background: '#F8FAFC',
      }}>
        <div>
          <div style={{ fontSize: '13px', fontWeight: 800, color: '#0B1C3E' }}>
            N° ENGAGEMENT : {item.reference}
          </div>
          <div style={{ fontSize: '9.5px', color: '#6B7280', marginTop: '3px' }}>
            Référence EB source : {item.ebReference ?? '—'}
          </div>
        </div>
        <PDFBadge status={item.status === 'VISE' || item.status === 'TRANSFORME' ? 'VALIDE' : 'EN_ATTENTE'} />
      </div>

      <SectionHeader>Informations générales et objet</SectionHeader>
      <InfoGrid rows={[
        { label: 'Structure', value: item.structure },
        { label: 'Nature du contrat', value: 'Bon de commande' },
        { label: 'Source de financement', value: 'Ressources propres CEEAC' },
        { label: 'N° contrat / BC', value: `BC-2026-${item.id.replace('ENG-', '').padStart(4, '0')}` },
        { label: 'Exercice', value: '2026' },
        { label: 'Date du contrat', value: item.dateCreation },
        { label: 'Date d\'engagement', value: item.dateCreation },
        { label: 'Délai d\'exécution', value: '30 jours' },
        { label: 'Tiers contractant', value: item.tiers },
        { label: 'Statut', value: <span style={{ color: '#1A6B3A', fontWeight: 700 }}>Validé et certifié</span> },
        { label: 'Objet de la dépense', value: item.objet, wide: true },
      ]} />

      {/* ── Budget + Financial in two columns ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginTop: '2px' }}>
        <div>
          <SectionHeader>Imputation budgétaire et lien PAP</SectionHeader>
          <InfoGrid rows={[
            { label: 'Chapitre', value: '2 — Dépenses de fonctionnement' },
            { label: 'Article', value: '2.2 — Achats de biens et services' },
            { label: 'Paragraphe', value: '2.2.1 — Achats de fournitures' },
            { label: 'Ligne budgétaire', value: '2.2.1.2 — Matériel informatique' },
            { label: 'Activité PAP', value: item.isPAP ? 'A2.1 — Programme institutionnel' : 'Hors PAP' },
            { label: 'Tâche PAP', value: item.isPAP ? 'A2.1.1 — Acquisition équipements' : '—' },
          ]} />
        </div>
        <div>
          <SectionHeader>Situation financière (FCFA)</SectionHeader>
          <FinancialTable rows={[
            { label: 'Crédit initial', value: `${fmt(creditInitial)} FCFA` },
            { label: 'Disponible avant réservation', value: `${fmt(item.creditAvant ?? 0)} FCFA` },
            { label: 'Montant réservé', value: `${fmt(reserve)} FCFA` },
            { label: 'Montant engagé', value: `${fmt(item.montant)} FCFA`, highlight: true },
            { label: 'Disponible après engagement', value: `${fmt(item.creditApres ?? 0)} FCFA`, highlight: true },
          ]} />
        </div>
      </div>

      {/* ── Certification text ── */}
      <SectionHeader>Certification</SectionHeader>
      <div style={{
        background: '#F0FDF4',
        border: '1px solid #BBF7D0',
        borderRadius: '6px',
        padding: '12px 14px',
        fontSize: '10px',
        color: '#166534',
        lineHeight: '1.7',
      }}>
        Le présent certificat atteste que la dépense décrite ci-dessus a fait l&apos;objet d&apos;une réservation budgétaire,
        d&apos;un engagement juridique et d&apos;un engagement comptable régulièrement validés. Le montant engagé est de{' '}
        <strong>{fmt(item.montant)} FCFA</strong> ({numberToWords(item.montant)} francs CFA).
        Les crédits correspondants sont définitivement affectés sur la ligne budgétaire indiquée, sous réserve de la
        constatation du service fait et des contrôles ultérieurs de liquidation.
      </div>

      {/* ── Signatures ── */}
      <SignatureRow blocks={[
        { titre: 'Contrôle Financier', nom: 'Marie NKODO', date: item.dateCreation, heure: '11:40', statut: item.status === 'VISE' || item.status === 'TRANSFORME' ? 'VALIDE' : 'EN_ATTENTE' },
        { titre: 'Agent Comptable', nom: 'Jean MBENG', date: item.dateCreation, heure: '11:25', statut: item.status === 'TRANSFORME' ? 'VALIDE' : 'EN_ATTENTE' },
        { titre: 'Ordonnateur Principal', nom: 'Pierre NTAMA', date: item.dateCreation, heure: '12:05', statut: item.status === 'TRANSFORME' ? 'VALIDE' : 'EN_ATTENTE' },
      ]} />
    </PDFShell>
  )
}

function numberToWords(n: number): string {
  if (n >= 1_000_000_000) return `${Math.floor(n / 1_000_000_000)} milliard(s) ${Math.floor((n % 1_000_000_000) / 1_000_000) > 0 ? Math.floor((n % 1_000_000_000) / 1_000_000) + ' million(s)' : ''}`
  if (n >= 1_000_000) return `${Math.floor(n / 1_000_000)} million(s) ${Math.floor((n % 1_000_000) / 1_000) > 0 ? Math.floor((n % 1_000_000) / 1_000) + ' mille' : ''}`
  if (n >= 1_000) return `${Math.floor(n / 1_000)} mille`
  return `${n}`
}
