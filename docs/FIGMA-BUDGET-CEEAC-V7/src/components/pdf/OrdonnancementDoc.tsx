import { PDFShell, SectionHeader, InfoGrid, FinancialTable, PDFBadge, SignatureRow } from './PDFShell'
import type { ORDItem } from '../../types'

const fmt = (n: number) => new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(n)

interface Props { item: ORDItem; dateEdition?: string }

const STATUS_MAP: Record<string, string> = {
  SIGNE: 'SIGNE', TRANSMIS_AC: 'VALIDE', A_SIGNER: 'EN_ATTENTE',
}

export default function OrdonnancementDoc({ item, dateEdition }: Props) {
  const now = dateEdition ?? new Date().toLocaleDateString('fr-FR') + ' ' + new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  const isSG = item.ordonnateur?.includes('Secrétaire')
  const tva = Math.round(item.montant * 0.18)

  return (
    <PDFShell codeRapport="RPT-ORD-001" dateEdition={now} exercice="2026" page="1 / 1">
      <div style={{ textAlign: 'center', margin: '18px 0 20px' }}>
        <div style={{ fontSize: '18px', fontWeight: 800, color: '#0B1C3E', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          Ordre de Paiement
        </div>
        <div style={{ fontSize: '11px', fontWeight: 600, color: '#1A6B3A', marginTop: '4px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Exercice Budgétaire 2026
        </div>
      </div>

      <div style={{ border: '1.5px solid #CBD5E1', borderRadius: '6px', padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', background: '#F8FAFC' }}>
        <div>
          <div style={{ fontSize: '13px', fontWeight: 800, color: '#0B1C3E' }}>N° ORDONNANCEMENT : {item.reference}</div>
          <div style={{ fontSize: '9.5px', color: '#6B7280', marginTop: '3px' }}>Liquidation source : {item.liqReference} · Date : {item.dateCreation}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
          <PDFBadge status={STATUS_MAP[item.status] ?? 'EN_ATTENTE'} />
          {isSG && <span style={{ fontSize: '8.5px', color: '#6B7280', fontStyle: 'italic' }}>Délégation SG — montant ≤ 5 M FCFA</span>}
        </div>
      </div>

      <SectionHeader>Identification de l&apos;ordonnancement</SectionHeader>
      <InfoGrid rows={[
        { label: 'Ordonnateur', value: item.ordonnateur ?? '—' },
        { label: 'Date ordonnancement', value: item.dateCreation },
        { label: 'Liquidation source', value: item.liqReference },
        { label: 'Date de signature', value: item.dateSIgnature ?? '—' },
        { label: 'Objet', value: item.objet, wide: true },
      ]} />

      <SectionHeader>Bénéficiaire / Créancier</SectionHeader>
      <InfoGrid rows={[
        { label: 'Raison sociale', value: item.tiers },
        { label: 'NIF', value: 'GA-2026-0456123' },
        { label: 'Forme juridique', value: 'SARL' },
        { label: 'Pays', value: 'Gabon' },
        { label: 'Banque domiciliataire', value: 'BGFI Bank Gabon' },
        { label: 'N° compte IBAN', value: `GA64 4001 0000 0123 4567 8901 42` },
        { label: 'Code SWIFT / BIC', value: 'BGFIGALBXXX' },
        { label: 'Devise du compte', value: 'XAF (FCFA)' },
      ]} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        <div>
          <SectionHeader>Imputation comptable</SectionHeader>
          <InfoGrid rows={[
            { label: 'Chapitre', value: '2 — Fonctionnement' },
            { label: 'Article', value: '2.2 — Achats de biens et services' },
            { label: 'Compte budgétaire', value: `2.2.1.2` },
            { label: 'Journal comptable', value: 'JR-2026-ORD' },
          ]} />
        </div>
        <div>
          <SectionHeader>Montant à régler (FCFA)</SectionHeader>
          <FinancialTable rows={[
            { label: 'Montant HT', value: `${fmt(item.montant - tva)} FCFA` },
            { label: 'TVA (18%)', value: `${fmt(tva)} FCFA` },
            { label: 'Montant TTC ordonnancé', value: `${fmt(item.montant)} FCFA`, highlight: true },
            { label: 'Retenues déduites', value: '−' },
            { label: 'Net à décaisser', value: `${fmt(item.montant)} FCFA`, highlight: true },
          ]} />
        </div>
      </div>

      {/* Watermark for signed docs */}
      {(item.status === 'SIGNE' || item.status === 'TRANSMIS_AC') && (
        <div style={{ textAlign: 'center', margin: '14px 0 8px' }}>
          <div style={{ display: 'inline-block', border: '2.5px solid #1A6B3A', borderRadius: '50%', padding: '8px 18px', transform: 'rotate(-12deg)', opacity: 0.7 }}>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#1A6B3A', letterSpacing: '0.1em' }}>SIGNÉ</div>
            <div style={{ fontSize: '8px', color: '#1A6B3A', textAlign: 'center' }}>{item.dateSIgnature ?? item.dateCreation}</div>
          </div>
        </div>
      )}

      <SignatureRow blocks={[
        { titre: 'Expert Budget', nom: 'Marie-Claire NKOGHE', date: item.dateCreation, statut: 'VALIDE' },
        { titre: isSG ? 'Secrétaire Général' : 'Président de la Commission', nom: isSG ? 'Jean-Paul OBIANG' : 'Dr. Gilberto DA PIEDADE VERÍSSIMO', date: item.dateSIgnature ?? item.dateCreation, statut: item.status === 'A_SIGNER' ? 'EN_ATTENTE' : 'VALIDE' },
        { titre: 'Agent Comptable', nom: 'Jean MBENG', date: item.dateSIgnature ?? '—', statut: item.status === 'TRANSMIS_AC' ? 'VALIDE' : 'EN_ATTENTE' },
      ]} />
    </PDFShell>
  )
}
