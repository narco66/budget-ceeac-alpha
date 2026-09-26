import { PDFShell, SectionHeader, InfoGrid, PDFBadge, SignatureRow } from './PDFShell'
import type { EBItem } from '../../types'

const fmt = (n: number) => new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(n)

interface Props { item: EBItem; dateEdition?: string }

const STATUS_MAP: Record<string, string> = {
  APPROUVE: 'APPROUVE', SOUMIS: 'EN_ATTENTE', EN_VALIDATION: 'EN_ATTENTE',
  BROUILLON: 'BROUILLON', REJETE: 'REJETE', TRANSFORME: 'VALIDE', RETOURNE: 'BROUILLON',
}

export default function FicheEB({ item, dateEdition }: Props) {
  const now = dateEdition ?? new Date().toLocaleDateString('fr-FR') + ' ' + new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })

  return (
    <PDFShell codeRapport="RPT-FICHE-EB-001" dateEdition={now} exercice="2026" page="1 / 1">
      <div style={{ textAlign: 'center', margin: '18px 0 20px' }}>
        <div style={{ fontSize: '18px', fontWeight: 800, color: '#0B1C3E', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          Fiche d&apos;Expression de Besoin
        </div>
        <div style={{ fontSize: '11px', fontWeight: 600, color: '#1A6B3A', marginTop: '4px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Exercice Budgétaire 2026
        </div>
      </div>

      <div style={{ border: '1.5px solid #CBD5E1', borderRadius: '6px', padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', background: '#F8FAFC' }}>
        <div>
          <div style={{ fontSize: '13px', fontWeight: 800, color: '#0B1C3E' }}>N° EB : {item.reference}</div>
          <div style={{ fontSize: '9.5px', color: '#6B7280', marginTop: '3px' }}>Initiateur : {item.initiateur ?? '—'}</div>
        </div>
        <PDFBadge status={STATUS_MAP[item.status] ?? 'EN_ATTENTE'} />
      </div>

      <SectionHeader>Identification de la demande</SectionHeader>
      <InfoGrid rows={[
        { label: 'Structure demandeuse', value: item.structure },
        { label: 'Exercice budgétaire', value: '2026' },
        { label: 'Initiateur', value: item.initiateur ?? '—' },
        { label: 'Date de création', value: item.dateCreation },
        { label: 'Date de soumission', value: item.dateSubmission ?? '—' },
        { label: 'Priorité', value: item.priorite ?? 'NORMALE' },
        { label: 'Classification', value: item.isPAP ? 'Inscrit au PAP' : 'Hors PAP' },
        { label: 'Ligne budgétaire', value: item.ligneBudgetaire ?? '—' },
      ]} />

      {item.isPAP && (
        <>
          <SectionHeader>Lien programmatique (PAP)</SectionHeader>
          <InfoGrid rows={[
            { label: 'Pilier stratégique', value: item.pilier ?? '—' },
            { label: 'Activité PAP', value: item.activite ?? '—' },
          ]} />
        </>
      )}

      <SectionHeader>Description du besoin</SectionHeader>
      <div style={{ border: '1px solid #E5E7EB', borderRadius: '4px', padding: '10px 12px', fontSize: '10px', lineHeight: '1.7', color: '#111827', background: '#FAFAFA' }}>
        {item.objet}
      </div>

      <SectionHeader>Informations financières</SectionHeader>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <InfoGrid rows={[
          { label: 'Montant estimé', value: `${fmt(item.montant)} ${item.devise}` },
          { label: 'Devise', value: item.devise },
        ]} />
        <div style={{ border: '1.5px solid #1A6B3A', borderRadius: '6px', padding: '10px 14px', background: '#F0FDF4', textAlign: 'center' }}>
          <div style={{ fontSize: '9px', color: '#166534', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>Montant total estimé</div>
          <div style={{ fontSize: '18px', fontWeight: 800, color: '#0B1C3E', fontFamily: "'JetBrains Mono', monospace", marginTop: '4px' }}>
            {fmt(item.montant)}
          </div>
          <div style={{ fontSize: '9px', color: '#166534', fontWeight: 600 }}>FCFA</div>
        </div>
      </div>

      <SectionHeader>Pièces justificatives</SectionHeader>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px' }}>
        <thead>
          <tr style={{ background: '#F1F5F9' }}>
            <th style={{ padding: '6px 10px', textAlign: 'left', fontWeight: 700, color: '#374151' }}>Document</th>
            <th style={{ padding: '6px 10px', textAlign: 'left', fontWeight: 700, color: '#374151' }}>Statut</th>
          </tr>
        </thead>
        <tbody>
          {['Note de justification du besoin', 'Devis estimatif', 'Note de présentation PAP', 'Bon de commande prévisionnel'].map((doc, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #F1F5F9' }}>
              <td style={{ padding: '5px 10px', color: '#374151' }}>{doc}</td>
              <td style={{ padding: '5px 10px', color: i < 2 ? '#166534' : '#6B7280', fontWeight: 600 }}>{i < 2 ? '✓ Fourni' : '⏳ En attente'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <SectionHeader>Circuit de validation</SectionHeader>
      <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap', margin: '6px 0 12px' }}>
        {[
          { label: 'Initiateur', done: true },
          { label: 'Chef de service', done: item.status !== 'BROUILLON' },
          { label: 'Directeur', done: ['APPROUVE', 'TRANSFORME', 'EN_VALIDATION'].includes(item.status) },
          { label: 'Budget', done: ['APPROUVE', 'TRANSFORME'].includes(item.status) },
          { label: 'Validé', done: ['APPROUVE', 'TRANSFORME'].includes(item.status) },
        ].map((step, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{
              padding: '3px 8px',
              borderRadius: '12px',
              fontSize: '9px',
              fontWeight: 600,
              background: step.done ? '#DCFCE7' : '#F3F4F6',
              color: step.done ? '#166534' : '#6B7280',
              border: `1px solid ${step.done ? '#86EFAC' : '#D1D5DB'}`,
            }}>
              {step.done ? '✓ ' : ''}{step.label}
            </div>
            {i < 4 && <span style={{ color: '#9CA3AF', fontSize: '10px' }}>→</span>}
          </div>
        ))}
      </div>

      <SignatureRow blocks={[
        { titre: 'Initiateur', nom: item.initiateur ?? '—', date: item.dateCreation, statut: 'VALIDE' },
        { titre: 'Chef de Service', nom: 'Jean-Pierre MBEGA', date: item.dateSubmission ?? '—', statut: item.status !== 'BROUILLON' ? 'VALIDE' : 'EN_ATTENTE' },
        { titre: 'Directeur Général', nom: 'Dr. Albert NZINGA', date: item.dateDerniereAction ?? '—', statut: ['APPROUVE', 'TRANSFORME'].includes(item.status) ? 'VALIDE' : 'EN_ATTENTE' },
      ]} />
    </PDFShell>
  )
}
