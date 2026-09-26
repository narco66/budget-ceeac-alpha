import { PDFShell, SectionHeader, InfoGrid, FinancialTable, PDFBadge, SignatureRow } from './PDFShell'

const fmt = (n: number) => new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(n)
const pct = (v: number) => `${v}%`

const perfColor = (v: number) => v >= 80 ? '#16A34A' : v >= 60 ? '#D97706' : '#DC2626'
const perfLabel = (v: number) => v >= 80 ? 'Satisfaisant' : v >= 60 ? 'À renforcer' : 'Insuffisant'

interface ActivityRow {
  code: string
  label: string
  structure: string
  avanPhysique: number
  budget: number
  engage: number
  liquide: number
  statut: string
}

interface IndicateurRow {
  code: string
  libelle: string
  cible: number
  valeur: number
  unite: string
  statut: 'ATTEINT' | 'EN_COURS' | 'NON_ATTEINT'
}

interface RisqueRow {
  id: string
  libelle: string
  categorie: string
  probabilite: number
  impact: number
  statut: string
}

interface Props {
  type: string
  periode: string
  version?: string
  auteur?: string
  activities?: ActivityRow[]
  indicateurs?: IndicateurRow[]
  risques?: RisqueRow[]
  synthese?: string
}

const STATUT_COLORS: Record<string, string> = {
  EN_COURS: '#059669', EN_RETARD: '#C2410C', REALISEE: '#16A34A',
  NON_DEMARREE: '#475569', SUSPENDUE: '#7C3AED',
}

const STATUT_LABELS: Record<string, string> = {
  EN_COURS: 'En cours', EN_RETARD: 'En retard', REALISEE: 'Réalisée',
  NON_DEMARREE: 'Non démarrée', SUSPENDUE: 'Suspendue',
}

const DEFAULT_ACTIVITIES: ActivityRow[] = [
  { code: 'P01-A02-PR01-SP01-ACT01', label: 'Forums et concertations régionales pour l\'intégration commerciale', structure: 'DEPIEC', avanPhysique: 65, budget: 1_190_000_000, engage: 875_000_000, liquide: 712_000_000, statut: 'EN_COURS' },
  { code: 'P02-A01-PR01-SP01-ACT01', label: 'Évaluation des programmes de maintien de la paix', structure: 'DEPPS', avanPhysique: 48, budget: 890_000_000, engage: 620_000_000, liquide: 380_000_000, statut: 'EN_RETARD' },
  { code: 'P03-A01-PR01-SP01-ACT01', label: 'Renforcement des capacités institutionnelles des États membres', structure: 'DEPDHS', avanPhysique: 32, budget: 567_000_000, engage: 245_000_000, liquide: 180_000_000, statut: 'EN_RETARD' },
  { code: 'P04-A01-PR01-SP01-ACT01', label: 'Mise en place du système d\'information intégré', structure: 'DSI', avanPhysique: 100, budget: 820_000_000, engage: 820_000_000, liquide: 820_000_000, statut: 'REALISEE' },
  { code: 'P01-A01-PR01-SP01-ACT01', label: 'Étude comparative des taux douaniers des États membres', structure: 'DEPIEC', avanPhysique: 72, budget: 185_000_000, engage: 145_000_000, liquide: 98_000_000, statut: 'EN_COURS' },
]

const DEFAULT_INDICATEURS: IndicateurRow[] = [
  { code: 'IND-01', libelle: 'Taux moyen des droits de douane intrarégionaux', cible: 2.5, valeur: 4.2, unite: '%', statut: 'EN_COURS' },
  { code: 'IND-02', libelle: 'Nombre de textes harmonisés', cible: 8, valeur: 5, unite: 'textes', statut: 'EN_COURS' },
  { code: 'IND-03', libelle: 'Nombre de forums organisés', cible: 4, valeur: 2, unite: 'forums', statut: 'EN_COURS' },
  { code: 'IND-04', libelle: 'Délai moyen de réponse aux alertes sécuritaires', cible: 48, valeur: 72, unite: 'heures', statut: 'NON_ATTEINT' },
  { code: 'IND-05', libelle: 'Nombre de bénéficiaires formés', cible: 300, valeur: 45, unite: 'agents', statut: 'NON_ATTEINT' },
  { code: 'IND-06', libelle: 'Taux de digitalisation des processus institutionnels', cible: 80, valeur: 78, unite: '%', statut: 'ATTEINT' },
]

const DEFAULT_RISQUES: RisqueRow[] = [
  { id: 'R-001', libelle: 'Désaccord politique entre États membres sur les taux', categorie: 'Politique', probabilite: 3, impact: 4, statut: 'ACTIF' },
  { id: 'R-002', libelle: 'Défaillance du prestataire de formation FORMAC S.A.', categorie: 'Contractuel', probabilite: 4, impact: 3, statut: 'REALISE' },
  { id: 'R-003', libelle: 'Disponibilité financière insuffisante Q3', categorie: 'Financier', probabilite: 2, impact: 4, statut: 'ACTIF' },
]

export default function RapportSuivi({ type, periode, version = '1.0', auteur = 'Équipe Suivi-Évaluation', activities = DEFAULT_ACTIVITIES, indicateurs = DEFAULT_INDICATEURS, risques = DEFAULT_RISQUES, synthese }: Props) {
  const now = new Date().toLocaleDateString('fr-FR') + ' ' + new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  const totalBudget = activities.reduce((s, a) => s + a.budget, 0)
  const totalEngage = activities.reduce((s, a) => s + a.engage, 0)
  const totalLiquide = activities.reduce((s, a) => s + a.liquide, 0)
  const avgPhysique = Math.round(activities.reduce((s, a) => s + a.avanPhysique, 0) / Math.max(activities.length, 1))
  const tauxEngage = totalBudget > 0 ? Math.round(totalEngage / totalBudget * 100) : 0
  const tauxLiquide = totalBudget > 0 ? Math.round(totalLiquide / totalBudget * 100) : 0
  const ecart = avgPhysique - tauxLiquide
  const nbRetard = activities.filter(a => a.statut === 'EN_RETARD').length
  const nbRealisee = activities.filter(a => a.statut === 'REALISEE').length
  const nbIndicAtteint = indicateurs.filter(i => i.statut === 'ATTEINT').length

  return (
    <PDFShell codeRapport={`RPT-SE-${type.substring(0, 3).toUpperCase()}-${periode.replace(/\s/g, '')}`} dateEdition={now} exercice="2026" page="1 / 2">
      {/* Title block */}
      <div style={{ textAlign: 'center', margin: '16px 0 18px', borderBottom: '2px solid #0B1C3E', paddingBottom: '14px' }}>
        <div style={{ fontSize: '17px', fontWeight: 800, color: '#0B1C3E', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{type}</div>
        <div style={{ fontSize: '12px', fontWeight: 600, color: '#1A6B3A', marginTop: '4px' }}>Période : {periode} · Exercice Budgétaire 2026</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '8px', fontSize: '10.5px', color: '#6B7280' }}>
          <span>Version : v{version}</span>
          <span>Auteur : {auteur}</span>
          <span>Édité le : {now}</span>
        </div>
      </div>

      {/* Executive summary */}
      <SectionHeader>1. Synthèse exécutive</SectionHeader>
      <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '12px 16px', fontSize: '10.5px', color: '#374151', lineHeight: '1.75', marginBottom: '8px' }}>
        {synthese ?? `Au titre de la période ${periode}, l'exécution du programme CEEAC présente un taux d'avancement physique global de ${avgPhysique}% contre un taux d'engagement financier de ${tauxEngage}%, générant un écart physique-financier de ${Math.abs(ecart)} points. ${nbRetard} activité(s) accusent un retard significatif nécessitant une attention managériale. ${nbRealisee} activité(s) ont été entièrement réalisées. Sur ${indicateurs.length} indicateurs suivis, ${nbIndicAtteint} atteignent ou dépassent leur cible.`}
      </div>

      {/* KPI summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '10px', marginBottom: '14px' }}>
        {[
          { label: 'Avancement physique', value: pct(avgPhysique), color: perfColor(avgPhysique) },
          { label: 'Taux d\'engagement', value: pct(tauxEngage), color: '#1D4ED8' },
          { label: 'Taux de liquidation', value: pct(tauxLiquide), color: '#7C3AED' },
          { label: 'Écart physique/fin.', value: `${ecart > 0 ? '+' : ''}${ecart}pts`, color: Math.abs(ecart) <= 10 ? '#16A34A' : Math.abs(ecart) <= 20 ? '#D97706' : '#DC2626' },
        ].map(k => (
          <div key={k.label} style={{ border: '1px solid #E2E8F0', borderRadius: '6px', padding: '8px 10px', textAlign: 'center' }}>
            <div style={{ fontSize: '9px', color: '#9CA3AF', textTransform: 'uppercase', fontWeight: 700 }}>{k.label}</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: k.color, margin: '4px 0 2px' }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Activities */}
      <SectionHeader>2. État d'exécution des activités</SectionHeader>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '9.5px', marginBottom: '14px' }}>
        <thead>
          <tr style={{ background: '#0B1C3E' }}>
            {['Code', 'Activité', 'Structure', 'Avanc.', 'Budget (FCFA)', 'Engagé', 'Liquidé', 'Statut'].map(h => (
              <th key={h} style={{ padding: '6px 8px', textAlign: 'left', fontWeight: 700, color: 'white', whiteSpace: 'nowrap' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {activities.map((a, i) => (
            <tr key={a.code} style={{ background: i % 2 === 0 ? '#FFFFFF' : '#F8FAFC', borderBottom: '1px solid #F1F5F9' }}>
              <td style={{ padding: '5px 8px', fontFamily: 'monospace', fontSize: '8.5px', color: '#6B7280', whiteSpace: 'nowrap' }}>{a.code.split('-').slice(-1)[0] + '…'}</td>
              <td style={{ padding: '5px 8px', maxWidth: '180px', color: '#1E293B', fontWeight: 500 }}>{a.label.substring(0, 50)}{a.label.length > 50 ? '…' : ''}</td>
              <td style={{ padding: '5px 8px', color: '#6B7280', whiteSpace: 'nowrap' }}>{a.structure}</td>
              <td style={{ padding: '5px 8px', textAlign: 'center' }}>
                <span style={{ fontWeight: 800, color: perfColor(a.avanPhysique), fontFamily: 'monospace' }}>{a.avanPhysique}%</span>
              </td>
              <td style={{ padding: '5px 8px', fontFamily: 'monospace', textAlign: 'right', whiteSpace: 'nowrap' }}>{fmt(a.budget)}</td>
              <td style={{ padding: '5px 8px', fontFamily: 'monospace', textAlign: 'right', whiteSpace: 'nowrap', color: '#1D4ED8' }}>{fmt(a.engage)}</td>
              <td style={{ padding: '5px 8px', fontFamily: 'monospace', textAlign: 'right', whiteSpace: 'nowrap', color: '#7C3AED' }}>{fmt(a.liquide)}</td>
              <td style={{ padding: '5px 8px' }}>
                <span style={{ background: STATUT_COLORS[a.statut] + '22', color: STATUT_COLORS[a.statut], fontWeight: 700, fontSize: '8px', padding: '2px 6px', borderRadius: '99px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                  {STATUT_LABELS[a.statut] ?? a.statut}
                </span>
              </td>
            </tr>
          ))}
          {/* Totals row */}
          <tr style={{ background: '#F1F5F9', borderTop: '2px solid #CBD5E1', fontWeight: 700 }}>
            <td colSpan={4} style={{ padding: '6px 8px', fontSize: '9.5px', color: '#374151' }}>TOTAL</td>
            <td style={{ padding: '6px 8px', fontFamily: 'monospace', textAlign: 'right', fontSize: '9.5px', color: '#0B1C3E' }}>{fmt(totalBudget)}</td>
            <td style={{ padding: '6px 8px', fontFamily: 'monospace', textAlign: 'right', fontSize: '9.5px', color: '#1D4ED8' }}>{fmt(totalEngage)}</td>
            <td style={{ padding: '6px 8px', fontFamily: 'monospace', textAlign: 'right', fontSize: '9.5px', color: '#7C3AED' }}>{fmt(totalLiquide)}</td>
            <td />
          </tr>
        </tbody>
      </table>

      {/* Financial summary */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
        <div>
          <SectionHeader>3. Récapitulatif financier</SectionHeader>
          <FinancialTable rows={[
            { label: 'Budget total prévu', value: `${fmt(totalBudget)} FCFA` },
            { label: 'Montant engagé', value: `${fmt(totalEngage)} FCFA (${tauxEngage}%)` },
            { label: 'Montant liquidé', value: `${fmt(totalLiquide)} FCFA (${tauxLiquide}%)`, highlight: true },
            { label: 'Reste à liquider', value: `${fmt(totalBudget - totalLiquide)} FCFA` },
          ]} />
        </div>
        <div>
          <SectionHeader>4. Indicateurs clés</SectionHeader>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '9px' }}>
            <thead>
              <tr style={{ background: '#F1F5F9' }}>
                {['Indicateur', 'Cible', 'Réalisé', 'Statut'].map(h => <th key={h} style={{ padding: '5px 7px', textAlign: 'left', color: '#374151', fontWeight: 700 }}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {indicateurs.map((ind, i) => {
                const achieved = ind.statut === 'ATTEINT'
                const pctVal = ind.cible > 0 ? Math.round(ind.valeur / ind.cible * 100) : 0
                return (
                  <tr key={ind.code} style={{ background: i % 2 === 0 ? '#FFF' : '#F8FAFC', borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '4px 7px', maxWidth: '120px' }}>{ind.libelle.substring(0, 30)}…</td>
                    <td style={{ padding: '4px 7px', fontFamily: 'monospace', textAlign: 'center' }}>{ind.cible} {ind.unite}</td>
                    <td style={{ padding: '4px 7px', fontFamily: 'monospace', textAlign: 'center', fontWeight: 700, color: perfColor(pctVal) }}>{ind.valeur} {ind.unite}</td>
                    <td style={{ padding: '4px 7px' }}>
                      <span style={{ fontSize: '8px', fontWeight: 700, color: achieved ? '#16A34A' : ind.statut === 'EN_COURS' ? '#D97706' : '#DC2626', background: achieved ? '#DCFCE7' : ind.statut === 'EN_COURS' ? '#FEF3C7' : '#FEE2E2', padding: '2px 5px', borderRadius: '99px' }}>
                        {achieved ? '✓ Atteint' : ind.statut === 'EN_COURS' ? '~ En cours' : '✗ Non atteint'}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Risks */}
      <SectionHeader>5. Tableau de bord des risques</SectionHeader>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '9px', marginBottom: '14px' }}>
        <thead>
          <tr style={{ background: '#F1F5F9' }}>
            {['Réf.', 'Risque', 'Catégorie', 'Probab.', 'Impact', 'Score', 'Statut'].map(h => (
              <th key={h} style={{ padding: '5px 8px', textAlign: 'left', color: '#374151', fontWeight: 700 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {risques.map((r, i) => {
            const score = r.probabilite * r.impact
            const scoreColor = score >= 12 ? '#DC2626' : score >= 8 ? '#D97706' : '#16A34A'
            return (
              <tr key={r.id} style={{ background: i % 2 === 0 ? '#FFF' : '#F8FAFC', borderBottom: '1px solid #F1F5F9' }}>
                <td style={{ padding: '5px 8px', fontFamily: 'monospace', fontSize: '8.5px', color: '#6B7280' }}>{r.id}</td>
                <td style={{ padding: '5px 8px', maxWidth: '160px' }}>{r.libelle.substring(0, 45)}{r.libelle.length > 45 ? '…' : ''}</td>
                <td style={{ padding: '5px 8px', color: '#6B7280' }}>{r.categorie}</td>
                <td style={{ padding: '5px 8px', textAlign: 'center', fontWeight: 700 }}>{r.probabilite}/4</td>
                <td style={{ padding: '5px 8px', textAlign: 'center', fontWeight: 700 }}>{r.impact}/4</td>
                <td style={{ padding: '5px 8px', textAlign: 'center' }}>
                  <span style={{ fontWeight: 800, color: scoreColor, fontFamily: 'monospace', fontSize: '11px' }}>{score}</span>
                </td>
                <td style={{ padding: '5px 8px' }}>
                  <span style={{ fontSize: '8px', fontWeight: 700, color: r.statut === 'REALISE' ? '#DC2626' : '#D97706', background: r.statut === 'REALISE' ? '#FEE2E2' : '#FEF3C7', padding: '2px 5px', borderRadius: '99px' }}>{r.statut}</span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      {/* Conclusion */}
      <SectionHeader>6. Points d'attention & Recommandations</SectionHeader>
      <div style={{ fontSize: '9.5px', color: '#374151', lineHeight: '1.7', marginBottom: '14px' }}>
        <div style={{ marginBottom: '6px' }}>
          <strong>Performance globale :</strong> {perfLabel(avgPhysique)} — Score composite {avgPhysique}/100 pour la période {periode}.
          L'écart physique-financier de {Math.abs(ecart)} points est {Math.abs(ecart) <= 10 ? 'dans la norme acceptable (≤10 points)' : Math.abs(ecart) <= 20 ? 'à surveiller (10–20 points)' : 'critique et nécessite des mesures correctives urgentes (>20 points)'}.
        </div>
        <div style={{ marginBottom: '6px' }}><strong>Actions prioritaires :</strong></div>
        <ol style={{ margin: '0 0 0 16px', padding: 0 }}>
          {nbRetard > 0 && <li style={{ marginBottom: '3px' }}>Traiter en urgence les {nbRetard} activité(s) en retard avec un plan de rattrapage daté.</li>}
          {risques.some(r => r.probabilite * r.impact >= 12) && <li style={{ marginBottom: '3px' }}>Activer les plans de mitigation pour les risques critiques (score ≥ 12).</li>}
          {indicateurs.filter(i => i.statut === 'NON_ATTEINT').length > 0 && <li style={{ marginBottom: '3px' }}>Réviser les stratégies pour {indicateurs.filter(i => i.statut === 'NON_ATTEINT').length} indicateur(s) non atteint(s).</li>}
          <li>Assurer le taux d'engagement ≥ {Math.min(tauxLiquide + 15, 95)}% avant la prochaine période de revue.</li>
        </ol>
      </div>

      <SignatureRow blocks={[
        { titre: 'Responsable S&E', nom: auteur.split(' ').slice(-2).join(' '), date: new Date().toLocaleDateString('fr-FR'), statut: 'VALIDE' },
        { titre: 'Directeur de Programme', nom: 'M. NGUESSO-BILAMBA', date: '', statut: 'EN_ATTENTE' },
        { titre: 'Secrétaire Général', nom: 'S.E.M. Gilberto DA PIEDADE VERISSIMO', date: '', statut: 'EN_ATTENTE' },
      ]} />
    </PDFShell>
  )
}
