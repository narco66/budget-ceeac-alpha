import { PDFShell, SectionHeader, InfoGrid, FinancialTable, PDFBadge, SignatureRow } from './PDFShell'
import type { LIQItem } from '../../types'

const fmt = (n: number) => new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(n)

const SF_LABELS: Record<string, string> = {
  CONFORME: 'Conforme — Service fait validé sans réserve',
  PARTIEL: 'Partiel — Service fait constaté partiellement',
  AVEC_RESERVES: 'Avec réserves — Réserves émises',
  NON_CONFORME: 'Non conforme',
  NON_FAIT: 'Service non fait',
}

interface Props { item: LIQItem; dateEdition?: string }

const STATUS_MAP: Record<string, string> = {
  VALIDEE: 'VALIDE', EN_CONTROLE: 'EN_ATTENTE', SERVICE_FAIT: 'EN_ATTENTE', BROUILLON: 'BROUILLON',
}

export default function FicheLiquidation({ item, dateEdition }: Props) {
  const now = dateEdition ?? new Date().toLocaleDateString('fr-FR') + ' ' + new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  const tauxRetenue = item.retenues ? Math.round((item.retenues / item.montantBrut) * 100) : 10

  return (
    <PDFShell codeRapport="RPT-FICHE-LIQ-001" dateEdition={now} exercice="2026" page="1 / 1">
      <div style={{ textAlign: 'center', margin: '18px 0 20px' }}>
        <div style={{ fontSize: '18px', fontWeight: 800, color: '#0B1C3E', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          Fiche de Liquidation
        </div>
        <div style={{ fontSize: '11px', fontWeight: 600, color: '#1A6B3A', marginTop: '4px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Exercice Budgétaire 2026
        </div>
      </div>

      <div style={{ border: '1.5px solid #CBD5E1', borderRadius: '6px', padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', background: '#F8FAFC' }}>
        <div>
          <div style={{ fontSize: '13px', fontWeight: 800, color: '#0B1C3E' }}>N° LIQUIDATION : {item.reference}</div>
          <div style={{ fontSize: '9.5px', color: '#6B7280', marginTop: '3px' }}>Engagement source : {item.engReference}</div>
        </div>
        <PDFBadge status={STATUS_MAP[item.status] ?? 'EN_ATTENTE'} />
      </div>

      <SectionHeader>Informations générales</SectionHeader>
      <InfoGrid rows={[
        { label: 'Structure', value: item.structure },
        { label: 'Fournisseur / Tiers', value: item.tiers },
        { label: 'Engagement source', value: item.engReference },
        { label: 'N° Facture', value: item.numFacture ?? '—' },
        { label: 'Date de création', value: item.dateCreation },
        { label: 'Date de facture', value: item.dateFacture ?? '—' },
        { label: 'Objet', value: item.objet, wide: true },
      ]} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        <div>
          <SectionHeader>Contrôle du service fait</SectionHeader>
          <div style={{
            border: `1.5px solid ${item.serviceFait === 'CONFORME' ? '#86EFAC' : item.serviceFait === 'AVEC_RESERVES' ? '#FCD34D' : '#FCA5A5'}`,
            borderRadius: '6px',
            padding: '10px 12px',
            background: item.serviceFait === 'CONFORME' ? '#F0FDF4' : item.serviceFait === 'AVEC_RESERVES' ? '#FFFBEB' : '#FEF2F2',
          }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: item.serviceFait === 'CONFORME' ? '#166534' : item.serviceFait === 'AVEC_RESERVES' ? '#92400E' : '#991B1B', marginBottom: '4px' }}>
              {item.serviceFait === 'CONFORME' ? '✓' : item.serviceFait === 'AVEC_RESERVES' ? '⚠' : '✗'} {SF_LABELS[item.serviceFait] ?? item.serviceFait}
            </div>
            <InfoGrid rows={[
              { label: 'Date de constatation', value: item.dateCreation },
              { label: 'Agent constatant', value: 'Marie NKODO' },
            ]} />
          </div>
        </div>
        <div>
          <SectionHeader>Décompte financier (FCFA)</SectionHeader>
          <FinancialTable rows={[
            { label: 'Montant brut facturé', value: `${fmt(item.montantBrut)} FCFA` },
            { label: `Retenue de garantie (${tauxRetenue}%)`, value: `− ${fmt(item.retenues ?? 0)} FCFA` },
            { label: 'Retenue caution (3%)', value: `− ${fmt(Math.round(item.montantBrut * 0.03))} FCFA` },
            { label: 'Net à payer', value: `${fmt(item.montantNet)} FCFA`, highlight: true },
          ]} />
        </div>
      </div>

      <SectionHeader>Pièces justificatives de liquidation</SectionHeader>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px' }}>
        <thead>
          <tr style={{ background: '#F1F5F9' }}>
            <th style={{ padding: '6px 10px', textAlign: 'left', fontWeight: 700, color: '#374151' }}>Document</th>
            <th style={{ padding: '6px 10px', textAlign: 'left', fontWeight: 700, color: '#374151' }}>Référence</th>
            <th style={{ padding: '6px 10px', textAlign: 'left', fontWeight: 700, color: '#374151' }}>Statut</th>
          </tr>
        </thead>
        <tbody>
          {[
            ['Facture fournisseur', item.numFacture ?? '—', true],
            ["Procès-verbal de réception", `PV-${item.reference}`, item.serviceFait !== 'NON_FAIT'],
            ["Bon de livraison / Rapport d'exécution", `BL-${item.id}`, item.serviceFait === 'CONFORME'],
            ['Certificat d\'engagement source', item.engReference, true],
          ].map(([doc, ref, ok], i) => (
            <tr key={i} style={{ borderBottom: '1px solid #F1F5F9' }}>
              <td style={{ padding: '5px 10px', color: '#374151' }}>{String(doc)}</td>
              <td style={{ padding: '5px 10px', fontFamily: 'monospace', color: '#6B7280', fontSize: '9.5px' }}>{String(ref)}</td>
              <td style={{ padding: '5px 10px', color: ok ? '#166534' : '#6B7280', fontWeight: 600 }}>{ok ? '✓ Fourni' : '⏳ En attente'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <SignatureRow blocks={[
        { titre: 'Gestionnaire Financier', nom: 'Sylvie NDOUMBE', date: item.dateCreation, statut: 'VALIDE' },
        { titre: 'Contrôleur Financier', nom: 'Marie NKODO', date: item.dateCreation, statut: item.status === 'EN_CONTROLE' ? 'EN_ATTENTE' : 'VALIDE' },
        { titre: 'Agent Comptable', nom: 'Jean MBENG', date: item.dateCreation, statut: item.status === 'VISEE' ? 'VALIDE' : 'EN_ATTENTE' },
      ]} />
    </PDFShell>
  )
}
