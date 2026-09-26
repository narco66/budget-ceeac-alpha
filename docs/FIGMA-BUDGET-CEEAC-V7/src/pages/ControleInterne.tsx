import { useState } from 'react'
import { Shield, AlertTriangle, CheckCircle, XCircle, Clock, BarChart2, ChevronRight, Activity, Download } from 'lucide-react'

type Niveau = 'FAIBLE' | 'MODERE' | 'ELEVE' | 'CRITIQUE'
type StatutRisque = 'MAITRISE' | 'RESIDUEL' | 'NON_MAITRISE'
type StatutControle = 'CONFORME' | 'PARTIELLEMENT' | 'NON_CONFORME' | 'EN_COURS'

interface Risque {
  id: string
  processus: string
  description: string
  probabilite: Niveau
  impact: Niveau
  exposition: Niveau
  controle: string
  statut: StatutRisque
  responsable: string
  echeance: string
}

interface PointControle {
  id: string
  domaine: string
  libelle: string
  frequence: string
  dernierControle: string
  resultat: StatutControle
  ecarts: number
  responsable: string
}

interface Constatation {
  id: string
  source: string
  libelle: string
  niveau: Niveau
  domaine: string
  recommandation: string
  responsable: string
  echeance: string
  avancement: number
  statut: 'EN_COURS' | 'RESOLUE' | 'EN_RETARD'
}

const RISQUES: Risque[] = [
  {
    id: 'R-001', processus: 'Engagement budgétaire', description: 'Engagement de dépenses sans crédits disponibles suffisants',
    probabilite: 'FAIBLE', impact: 'CRITIQUE', exposition: 'ELEVE',
    controle: 'Contrôle automatique disponibilité crédit avant visa CF', statut: 'MAITRISE',
    responsable: 'Contrôleur Financier', echeance: 'Permanent'
  },
  {
    id: 'R-002', processus: 'Paiement', description: 'Paiement sans service fait constaté',
    probabilite: 'FAIBLE', impact: 'CRITIQUE', exposition: 'ELEVE',
    controle: 'Constatation service fait obligatoire avant liquidation', statut: 'MAITRISE',
    responsable: 'Chef de service', echeance: 'Permanent'
  },
  {
    id: 'R-003', processus: 'Séparation des fonctions', description: 'Cumul des fonctions ordonnateur / comptable',
    probabilite: 'FAIBLE', impact: 'ELEVE', exposition: 'MODERE',
    controle: 'Paramétrage workflows — rôles exclusifs', statut: 'MAITRISE',
    responsable: 'Administrateur', echeance: 'Permanent'
  },
  {
    id: 'R-004', processus: 'Gestion des accès', description: 'Accès non révoqués des utilisateurs inactifs',
    probabilite: 'MODERE', impact: 'ELEVE', exposition: 'ELEVE',
    controle: 'Revue trimestrielle des accès utilisateurs', statut: 'RESIDUEL',
    responsable: 'Administrateur', echeance: '30/09/2026'
  },
  {
    id: 'R-005', processus: 'Reporting', description: 'Données de performance non fiabilisées avant publication',
    probabilite: 'MODERE', impact: 'MODERE', exposition: 'MODERE',
    controle: 'Double validation DEPIEC + DGA avant publication RAP', statut: 'RESIDUEL',
    responsable: 'DEPIEC', echeance: '31/10/2026'
  },
  {
    id: 'R-006', processus: 'Trésorerie', description: 'Délais de paiement dépassant les SLA contractuels',
    probabilite: 'ELEVE', impact: 'MODERE', exposition: 'ELEVE',
    controle: 'Tableau de bord délais hebdomadaire + alerte automatique', statut: 'RESIDUEL',
    responsable: 'Agent Comptable', echeance: 'Permanent'
  },
  {
    id: 'R-007', processus: 'Marchés publics', description: 'Non-respect des seuils de consultation selon règlement',
    probabilite: 'FAIBLE', impact: 'CRITIQUE', exposition: 'ELEVE',
    controle: 'Contrôle automatique seuils à la saisie EB', statut: 'NON_MAITRISE',
    responsable: 'Direction Juridique', echeance: '15/09/2026'
  },
]

const POINTS_CONTROLE: PointControle[] = [
  { id: 'PC-01', domaine: 'Budget', libelle: 'Disponibilité des crédits avant visa', frequence: 'Transaction', dernierControle: '08/09/2026', resultat: 'CONFORME', ecarts: 0, responsable: 'CF' },
  { id: 'PC-02', domaine: 'Engagement', libelle: 'Visa CF sur tous les engagements', frequence: 'Transaction', dernierControle: '08/09/2026', resultat: 'CONFORME', ecarts: 0, responsable: 'CF' },
  { id: 'PC-03', domaine: 'Liquidation', libelle: 'Constatation service fait avant liquidation', frequence: 'Transaction', dernierControle: '07/09/2026', resultat: 'CONFORME', ecarts: 0, responsable: 'Chef service' },
  { id: 'PC-04', domaine: 'Paiement', libelle: 'Double signature ordonnancement > 5M XAF', frequence: 'Transaction', dernierControle: '05/09/2026', resultat: 'CONFORME', ecarts: 0, responsable: 'Ordonnateur' },
  { id: 'PC-05', domaine: 'Accès', libelle: 'Revue des droits utilisateurs actifs', frequence: 'Trimestriel', dernierControle: '30/06/2026', resultat: 'PARTIELLEMENT', ecarts: 3, responsable: 'Admin' },
  { id: 'PC-06', domaine: 'Séparation', libelle: 'Absence de cumul ordonnateur/comptable', frequence: 'Mensuel', dernierControle: '31/08/2026', resultat: 'CONFORME', ecarts: 0, responsable: 'Admin' },
  { id: 'PC-07', domaine: 'Marchés', libelle: 'Respect seuils consultation fournisseurs', frequence: 'Transaction', dernierControle: '01/09/2026', resultat: 'NON_CONFORME', ecarts: 2, responsable: 'DAJ' },
  { id: 'PC-08', domaine: 'Reporting', libelle: 'Validation DEPIEC données S&E avant publication', frequence: 'Trimestriel', dernierControle: '30/06/2026', resultat: 'EN_COURS', ecarts: 0, responsable: 'DEPIEC' },
]

const CONSTATATIONS: Constatation[] = [
  {
    id: 'CON-2026-001', source: 'Contrôle interne', libelle: '3 utilisateurs inactifs conservent des droits d\'accès actifs',
    niveau: 'MODERE', domaine: 'Gestion des accès',
    recommandation: 'Procéder à la révocation immédiate et mettre en place une revue mensuelle automatique',
    responsable: 'Administrateur', echeance: '30/09/2026', avancement: 40, statut: 'EN_COURS'
  },
  {
    id: 'CON-2026-002', source: 'Contrôle interne', libelle: '2 engagements inférieurs au seuil de consultation sans justificatif de dérogation',
    niveau: 'ELEVE', domaine: 'Marchés publics',
    recommandation: 'Régulariser les dossiers et mettre à jour la procédure de contrôle des seuils',
    responsable: 'Direction Juridique', echeance: '15/09/2026', avancement: 10, statut: 'EN_RETARD'
  },
  {
    id: 'CON-2026-003', source: 'Audit interne', libelle: 'Délais moyens de paiement de 18 jours vs SLA de 7 jours',
    niveau: 'ELEVE', domaine: 'Trésorerie',
    recommandation: 'Réviser la chaîne de traitement et instaurer un tableau de bord de suivi hebdomadaire',
    responsable: 'Agent Comptable', echeance: '31/10/2026', avancement: 65, statut: 'EN_COURS'
  },
  {
    id: 'CON-2026-004', source: 'Revue périodique', libelle: 'Absence de procédure formalisée de sauvegarde des données GED',
    niveau: 'MODERE', domaine: 'Systèmes d\'information',
    recommandation: 'Élaborer et valider la politique de sauvegarde et de reprise d\'activité',
    responsable: 'DSI', echeance: '15/11/2026', avancement: 0, statut: 'EN_COURS'
  },
  {
    id: 'CON-2025-008', source: 'Audit externe', libelle: 'Procédure de clôture d\'exercice non documentée',
    niveau: 'MODERE', domaine: 'Comptabilité',
    recommandation: 'Rédiger et valider le guide de clôture', responsable: 'Chef Comptable',
    echeance: '28/02/2026', avancement: 100, statut: 'RESOLUE'
  },
]

const NIV_CFG: Record<Niveau, { label: string; bg: string; text: string }> = {
  FAIBLE: { label: 'Faible', bg: '#DCFCE7', text: '#166534' },
  MODERE: { label: 'Modéré', bg: '#FEF9C3', text: '#713F12' },
  ELEVE: { label: 'Élevé', bg: '#FFEDD5', text: '#9A3412' },
  CRITIQUE: { label: 'Critique', bg: '#FEE2E2', text: '#991B1B' },
}

const STATUT_RSQ: Record<StatutRisque, { label: string; bg: string; text: string }> = {
  MAITRISE: { label: 'Maîtrisé', bg: '#DCFCE7', text: '#166534' },
  RESIDUEL: { label: 'Résiduel', bg: '#FEF9C3', text: '#713F12' },
  NON_MAITRISE: { label: 'Non maîtrisé', bg: '#FEE2E2', text: '#991B1B' },
}

const CTRL_CFG: Record<StatutControle, { label: string; bg: string; text: string; icon: React.ReactNode }> = {
  CONFORME: { label: 'Conforme', bg: '#DCFCE7', text: '#166534', icon: <CheckCircle size={11} /> },
  PARTIELLEMENT: { label: 'Partiel', bg: '#FEF9C3', text: '#713F12', icon: <AlertTriangle size={11} /> },
  NON_CONFORME: { label: 'Non conforme', bg: '#FEE2E2', text: '#991B1B', icon: <XCircle size={11} /> },
  EN_COURS: { label: 'En cours', bg: '#DBEAFE', text: '#1D4ED8', icon: <Clock size={11} /> },
}

export default function ControleInterne() {
  const [activeTab, setActiveTab] = useState('tableau')

  const risquesNonMaitrises = RISQUES.filter(r => r.statut === 'NON_MAITRISE').length
  const risquesEleves = RISQUES.filter(r => r.exposition === 'ELEVE' || r.exposition === 'CRITIQUE').length
  const pctConformes = Math.round(POINTS_CONTROLE.filter(p => p.resultat === 'CONFORME').length / POINTS_CONTROLE.length * 100)
  const constatationsOuvertes = CONSTATATIONS.filter(c => c.statut !== 'RESOLUE').length
  const [ciToast, setCiToast] = useState(false)

  const exportRapportCI = () => {
    const lines = [
      'RAPPORT CONTRÔLE INTERNE & GESTION DES RISQUES — CEEAC 2026',
      `Édité le : ${new Date().toLocaleDateString('fr-FR')}`,
      '',
      '=== RISQUES ===',
      'ID,Processus,Description,Probabilité,Impact,Exposition,Statut,Responsable,Échéance',
      ...RISQUES.map(r => `${r.id},"${r.processus}","${r.description}",${r.probabilite},${r.impact},${r.exposition},${r.statut},${r.responsable},${r.echeance}`),
      '',
      '=== POINTS DE CONTRÔLE ===',
      'ID,Domaine,Libellé,Dernier contrôle,Résultat,Responsable',
      ...POINTS_CONTROLE.map(p => `${p.id},"${p.domaine}","${p.libelle}",${p.dernierControle},${p.resultat},${p.responsable}`),
      '',
      '=== CONSTATATIONS ===',
      'ID,Source,Libellé,Niveau,Domaine,Statut,Responsable,Échéance',
      ...CONSTATATIONS.map(c => `${c.id},"${c.source}","${c.libelle}",${c.niveau},"${c.domaine}",${c.statut},${c.responsable},${c.echeance}`),
    ]
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Rapport_ControleInterne_CEEAC_${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
    setCiToast(true)
    setTimeout(() => setCiToast(false), 3000)
  }

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="section-title text-2xl">Contrôle interne & Gestion des risques</h1>
          <p className="text-sm text-gray-500 mt-0.5">Dispositif de contrôle interne CEEAC — Exercice 2026</p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-outline btn-sm gap-1.5" onClick={exportRapportCI}><Download size={13} />Exporter rapport</button>
          <button className="btn btn-primary btn-sm"><Shield size={13} /> Nouveau risque</button>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Risques non maîtrisés', value: risquesNonMaitrises, color: '#DC2626', sub: `sur ${RISQUES.length} risques identifiés` },
          { label: 'Risques élevés / critiques', value: risquesEleves, color: '#D97706', sub: 'exposition résiduelle' },
          { label: 'Taux conformité contrôles', value: `${pctConformes}%`, color: '#16A34A', sub: `${POINTS_CONTROLE.filter(p => p.resultat === 'CONFORME').length}/${POINTS_CONTROLE.length} conformes` },
          { label: 'Constatations ouvertes', value: constatationsOuvertes, color: '#2563EB', sub: `dont ${CONSTATATIONS.filter(c => c.statut === 'EN_RETARD').length} en retard` },
        ].map((k, i) => (
          <div key={i} className="kpi-card py-3" style={{ borderLeft: `3px solid ${k.color}` }}>
            <div className="text-[10px] uppercase font-semibold tracking-wider text-gray-400">{k.label}</div>
            <div className="amount text-2xl font-bold mt-0.5" style={{ color: k.color }}>{k.value}</div>
            <div className="text-[10.5px] text-gray-400 mt-0.5">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 gap-0 -mt-2">
        {[
          { id: 'tableau', label: 'Tableau de bord', icon: <BarChart2 size={13} /> },
          { id: 'risques', label: 'Cartographie des risques', icon: <AlertTriangle size={13} /> },
          { id: 'controles', label: 'Points de contrôle', icon: <CheckCircle size={13} /> },
          { id: 'constatations', label: 'Constatations & suivi', icon: <Activity size={13} /> },
        ].map(tab => (
          <button key={tab.id} className={`tab-item flex items-center gap-1.5 ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'tableau' && (
        <div className="space-y-5">
          {/* Alertes */}
          {risquesNonMaitrises > 0 && (
            <div className="alert-banner" style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}>
              <XCircle size={14} className="text-red-500 flex-shrink-0" />
              <span className="text-[13px] text-red-800 font-medium">
                {risquesNonMaitrises} risque{risquesNonMaitrises > 1 ? 's' : ''} non maîtrisé{risquesNonMaitrises > 1 ? 's' : ''} — Action corrective urgente requise
              </span>
              <button className="btn btn-sm ml-auto text-red-700" style={{ background: '#FEE2E2', border: '1px solid #FECACA' }}>
                Voir <ChevronRight size={11} />
              </button>
            </div>
          )}

          <div className="grid grid-cols-2 gap-5">
            {/* Exposition par processus */}
            <div className="card p-5">
              <div className="text-[11px] uppercase font-semibold tracking-wider text-gray-400 mb-4">Exposition par processus</div>
              <div className="space-y-3">
                {RISQUES.map(r => {
                  const nc = NIV_CFG[r.exposition]
                  return (
                    <div key={r.id} className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="text-[12.5px] font-semibold text-gray-800">{r.processus}</div>
                        <div className="text-[11.5px] text-gray-500 line-clamp-1">{r.description}</div>
                      </div>
                      <span className="badge text-[10.5px] px-2 py-0.5 flex-shrink-0" style={{ background: nc.bg, color: nc.text }}>{nc.label}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Statut des constatations */}
            <div className="card p-5">
              <div className="text-[11px] uppercase font-semibold tracking-wider text-gray-400 mb-4">Suivi des constatations</div>
              <div className="space-y-4">
                {CONSTATATIONS.map(c => {
                  const bar = c.statut === 'RESOLUE' ? '#16A34A' : c.statut === 'EN_RETARD' ? '#DC2626' : '#2563EB'
                  return (
                    <div key={c.id}>
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[11px] text-gray-400">{c.id}</span>
                            <span className="badge text-[10px] px-1.5 py-0.5" style={NIV_CFG[c.niveau] ? { background: NIV_CFG[c.niveau].bg, color: NIV_CFG[c.niveau].text } : {}}>
                              {NIV_CFG[c.niveau]?.label}
                            </span>
                            {c.statut === 'EN_RETARD' && (
                              <span className="text-[10px] font-bold text-red-600 flex items-center gap-0.5"><Clock size={9} /> RETARD</span>
                            )}
                          </div>
                          <div className="text-[12.5px] font-medium text-gray-800 mt-0.5 line-clamp-1">{c.libelle}</div>
                        </div>
                        <span className="font-mono text-[11px] text-gray-500 flex-shrink-0">{c.avancement}%</span>
                      </div>
                      <div className="progress-bar-track">
                        <div className="progress-bar-fill" style={{ width: `${c.avancement}%`, background: bar }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'risques' && (
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="font-semibold text-[15px] text-gray-800">Registre des risques</div>
            <div className="text-[12px] text-gray-400">{RISQUES.length} risques identifiés</div>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Réf.</th>
                <th>Processus</th>
                <th>Description du risque</th>
                <th>Probabilité</th>
                <th>Impact</th>
                <th>Exposition</th>
                <th>Contrôle existant</th>
                <th>Statut</th>
                <th>Resp.</th>
              </tr>
            </thead>
            <tbody>
              {RISQUES.map(r => {
                const sc = STATUT_RSQ[r.statut]
                return (
                  <tr key={r.id}>
                    <td><span className="font-mono text-[12px] font-bold text-navy-900">{r.id}</span></td>
                    <td className="font-semibold text-[12.5px]">{r.processus}</td>
                    <td className="text-[12.5px] text-gray-700 max-w-[200px]">{r.description}</td>
                    <td><span className="badge text-[10.5px] px-2 py-0.5" style={{ background: NIV_CFG[r.probabilite].bg, color: NIV_CFG[r.probabilite].text }}>{NIV_CFG[r.probabilite].label}</span></td>
                    <td><span className="badge text-[10.5px] px-2 py-0.5" style={{ background: NIV_CFG[r.impact].bg, color: NIV_CFG[r.impact].text }}>{NIV_CFG[r.impact].label}</span></td>
                    <td><span className="badge text-[10.5px] px-2 py-0.5 font-bold" style={{ background: NIV_CFG[r.exposition].bg, color: NIV_CFG[r.exposition].text }}>{NIV_CFG[r.exposition].label}</span></td>
                    <td className="text-[12px] text-gray-600 max-w-[180px]">{r.controle}</td>
                    <td><span className="badge text-[10.5px] px-2 py-0.5" style={{ background: sc.bg, color: sc.text }}>{sc.label}</span></td>
                    <td className="text-[12px] text-gray-500">{r.responsable}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'controles' && (
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="font-semibold text-[15px] text-gray-800">Points de contrôle interne</div>
            <div className="flex gap-3 text-[12px]">
              {(['CONFORME', 'PARTIELLEMENT', 'NON_CONFORME', 'EN_COURS'] as StatutControle[]).map(s => {
                const c = CTRL_CFG[s]
                const count = POINTS_CONTROLE.filter(p => p.resultat === s).length
                return (
                  <span key={s} className="flex items-center gap-1 badge px-2 py-0.5 text-[10.5px]" style={{ background: c.bg, color: c.text }}>
                    {c.icon} {c.label} ({count})
                  </span>
                )
              })}
            </div>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Réf.</th>
                <th>Domaine</th>
                <th>Point de contrôle</th>
                <th>Fréquence</th>
                <th>Dernier contrôle</th>
                <th>Résultat</th>
                <th>Écarts</th>
                <th>Responsable</th>
              </tr>
            </thead>
            <tbody>
              {POINTS_CONTROLE.map(pc => {
                const rc = CTRL_CFG[pc.resultat]
                return (
                  <tr key={pc.id}>
                    <td><span className="font-mono text-[12px] font-bold text-navy-900">{pc.id}</span></td>
                    <td><span className="badge text-[10.5px] px-2 py-0.5" style={{ background: '#EDF2FB', color: '#1B3269' }}>{pc.domaine}</span></td>
                    <td className="text-[12.5px] font-medium text-gray-800">{pc.libelle}</td>
                    <td className="text-[12px] text-gray-500">{pc.frequence}</td>
                    <td className="font-mono text-[12px] text-gray-500">{pc.dernierControle}</td>
                    <td>
                      <span className="badge text-[10.5px] px-2 py-0.5 flex items-center gap-1 w-fit" style={{ background: rc.bg, color: rc.text }}>
                        {rc.icon} {rc.label}
                      </span>
                    </td>
                    <td>
                      {pc.ecarts > 0
                        ? <span className="font-mono font-bold text-[13px] text-red-600">{pc.ecarts}</span>
                        : <span className="text-gray-300">—</span>}
                    </td>
                    <td className="text-[12.5px] text-gray-600">{pc.responsable}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'constatations' && (
        <div className="space-y-3">
          {CONSTATATIONS.map(c => {
            const nv = NIV_CFG[c.niveau]
            const bar = c.statut === 'RESOLUE' ? '#16A34A' : c.statut === 'EN_RETARD' ? '#DC2626' : '#2563EB'
            return (
              <div key={c.id} className="card p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-mono text-[12px] font-bold text-navy-900">{c.id}</span>
                      <span className="badge text-[10.5px] px-2 py-0.5" style={{ background: nv.bg, color: nv.text }}>{nv.label}</span>
                      <span className="badge text-[10.5px] px-2 py-0.5" style={{ background: '#EDF2FB', color: '#1B3269' }}>{c.source}</span>
                      <span className="badge text-[10.5px] px-2 py-0.5" style={{ background: '#F1F5F9', color: '#64748B' }}>{c.domaine}</span>
                      {c.statut === 'EN_RETARD' && (
                        <span className="text-[11px] font-bold text-red-600 flex items-center gap-0.5"><Clock size={10} /> EN RETARD</span>
                      )}
                      {c.statut === 'RESOLUE' && (
                        <span className="text-[11px] font-bold text-green-600 flex items-center gap-0.5"><CheckCircle size={10} /> RÉSOLUE</span>
                      )}
                    </div>
                    <div className="font-semibold text-[14px] text-gray-900 mb-2">{c.libelle}</div>
                    <div className="flex items-start gap-1.5 text-[12.5px] text-gray-600 mb-3">
                      <span className="font-semibold text-gray-700 flex-shrink-0">Recommandation :</span>
                      <span>{c.recommandation}</span>
                    </div>
                    <div className="flex items-center gap-6 text-[12px]">
                      <div><span className="text-gray-400">Responsable :</span> <span className="font-semibold text-gray-700">{c.responsable}</span></div>
                      <div><span className="text-gray-400">Échéance :</span> <span className={`font-mono font-semibold ${c.statut === 'EN_RETARD' ? 'text-red-600' : 'text-gray-700'}`}>{c.echeance}</span></div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-right w-24">
                    <div className="text-[10px] uppercase font-semibold tracking-wider text-gray-400 mb-1">Avancement</div>
                    <div className="font-bold text-2xl" style={{ color: bar }}>{c.avancement}%</div>
                  </div>
                </div>
                <div className="mt-3 progress-bar-track">
                  <div className="progress-bar-fill" style={{ width: `${c.avancement}%`, background: bar }} />
                </div>
              </div>
            )
          })}
        </div>
      )}
      {ciToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-xl text-[13px] font-medium flex items-center gap-2.5">
          <CheckCircle size={15} className="text-green-400" />Rapport exporté (CSV) avec succès
        </div>
      )}
    </div>
  )
}
