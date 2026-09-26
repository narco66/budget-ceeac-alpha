import { PDFShell, SectionHeader, InfoGrid, FinancialTable, PDFBadge, SignatureRow } from './PDFShell'
import type { PAYItem } from '../../types'

const fmt = (n: number) => new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(n)

interface Props { item: PAYItem; dateEdition?: string }

const MODE_LABELS: Record<string, string> = {
  VIREMENT: 'Virement bancaire',
  CHEQUE: 'Chèque',
  CAISSE: 'Paiement en caisse',
  MOBILE: 'Mobile money',
}

const STATUS_MAP: Record<string, string> = {
  PAYE: 'PAYE', VALIDE: 'VALIDE', EN_ATTENTE: 'EN_ATTENTE', REJETE: 'REJETE',
}

export default function QuittancePaiement({ item, dateEdition }: Props) {
  const now = dateEdition ?? new Date().toLocaleDateString('fr-FR') + ' ' + new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  const modePaiement = item.modePaiement ?? 'VIREMENT'
  const dateExec = item.dateCreation

  return (
    <PDFShell codeRapport="RPT-QUIT-PAY-001" dateEdition={now} exercice="2026" page="1 / 1">
      <div style={{ textAlign: 'center', margin: '18px 0 20px' }}>
        <div style={{ fontSize: '18px', fontWeight: 800, color: '#0B1C3E', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          Quittance de Paiement
        </div>
        <div style={{ fontSize: '11px', fontWeight: 600, color: '#1A6B3A', marginTop: '4px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Exercice Budgétaire 2026
        </div>
      </div>

      <div style={{ border: '1.5px solid #CBD5E1', borderRadius: '6px', padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', background: '#F8FAFC' }}>
        <div>
          <div style={{ fontSize: '13px', fontWeight: 800, color: '#0B1C3E' }}>N° PAIEMENT : {item.reference}</div>
          <div style={{ fontSize: '9.5px', color: '#6B7280', marginTop: '3px' }}>Ordonnancement source : {item.ordReference}</div>
        </div>
        <PDFBadge status={STATUS_MAP[item.status] ?? 'EN_ATTENTE'} />
      </div>

      <SectionHeader>Informations du paiement</SectionHeader>
      <InfoGrid rows={[
        { label: 'Bénéficiaire', value: item.tiers },
        { label: 'Mode de règlement', value: MODE_LABELS[modePaiement] ?? modePaiement },
        { label: 'Ordonnancement source', value: item.ordReference },
        { label: 'Date de paiement', value: dateExec },
        { label: 'Référence AC', value: `AC-2026-${item.id.replace('PAY-', '').padStart(4, '0')}` },
        { label: 'Date valeur', value: dateExec },
        { label: 'Objet', value: item.objet, wide: true },
      ]} />

      <SectionHeader>Coordonnées bancaires du bénéficiaire</SectionHeader>
      <InfoGrid rows={[
        { label: 'Banque', value: (item.compteBancaire ?? '').split(' ')[0] + ' Bank' },
        { label: 'Code SWIFT', value: 'BGFIGALBXXX' },
        { label: 'N° de compte', value: item.compteBancaire ?? '—' },
        { label: 'Devise', value: 'XAF (FCFA)' },
      ]} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        <div>
          <SectionHeader>Récapitulatif financier (FCFA)</SectionHeader>
          <FinancialTable rows={[
            { label: 'Montant ordonnancé', value: `${fmt(item.montantOrdonnance)} FCFA` },
            { label: 'Retenues opérées', value: `− ${fmt(item.montantOrdonnance - item.montantPaye)} FCFA` },
            { label: 'Montant payé', value: `${fmt(item.montantPaye)} FCFA`, highlight: true },
            { label: 'Reliquat', value: `${fmt(item.reliquat ?? 0)} FCFA` },
          ]} />
        </div>
        <div>
          {/* Certification box */}
          <SectionHeader>Certification de paiement</SectionHeader>
          <div style={{ border: '1.5px solid #1A6B3A', borderRadius: '6px', padding: '12px 14px', background: '#F0FDF4', fontSize: '10px', color: '#166534', lineHeight: '1.7' }}>
            <div style={{ fontWeight: 700, fontSize: '11px', marginBottom: '6px' }}>✓ PAIEMENT EFFECTUÉ</div>
            La somme de <strong>{fmt(item.montantPaye)} FCFA</strong> a été
            réglée par {MODE_LABELS[modePaiement] ?? modePaiement} au bénéficiaire
            désigné, conformément à l&apos;ordre d&apos;ordonnancement n° {item.ordReference}.
          </div>
        </div>
      </div>

      {/* Rapprochement */}
      <SectionHeader>Rapprochement comptable</SectionHeader>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px' }}>
        <thead>
          <tr style={{ background: '#F1F5F9' }}>
            {['Référence', 'Date', 'Débit', 'Crédit', 'Libellé'].map(h => (
              <th key={h} style={{ padding: '6px 10px', textAlign: 'left', fontWeight: 700, color: '#374151' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
            <td style={{ padding: '5px 10px', fontFamily: 'monospace', fontSize: '9.5px' }}>{item.reference}</td>
            <td style={{ padding: '5px 10px' }}>{dateExec}</td>
            <td style={{ padding: '5px 10px', fontFamily: 'monospace', fontWeight: 600, color: '#991B1B' }}>{fmt(item.montantPaye)}</td>
            <td style={{ padding: '5px 10px' }}>—</td>
            <td style={{ padding: '5px 10px', color: '#374151' }}>Paiement {item.objet.substring(0, 45)}…</td>
          </tr>
          <tr>
            <td style={{ padding: '5px 10px', fontFamily: 'monospace', fontSize: '9.5px' }}>CPTE-FOURNISSEUR</td>
            <td style={{ padding: '5px 10px' }}>{dateExec}</td>
            <td style={{ padding: '5px 10px' }}>—</td>
            <td style={{ padding: '5px 10px', fontFamily: 'monospace', fontWeight: 600, color: '#166534' }}>{fmt(item.montantPaye)}</td>
            <td style={{ padding: '5px 10px', color: '#374151' }}>Compte fournisseur — {item.tiers}</td>
          </tr>
        </tbody>
      </table>

      <SignatureRow blocks={[
        { titre: 'Chef Comptable', nom: 'Agnès ENGONE', date: item.dateCreation, statut: 'VALIDE' },
        { titre: 'Agent Comptable', nom: 'Jean MBENG', date: dateExec, statut: item.status === 'EXECUTE' || item.status === 'RAPPROCHE' ? 'VALIDE' : 'EN_ATTENTE' },
        { titre: 'Trésorier / Caissier', nom: 'Pierre MOUSSAVOU', date: dateExec, statut: item.status === 'EXECUTE' ? 'VALIDE' : 'EN_ATTENTE' },
      ]} />
    </PDFShell>
  )
}
