import { useState } from 'react'
import { Search, ClipboardList, AlertTriangle, CheckCircle, Clock, ChevronRight, FileText, Calendar, X, Plus } from 'lucide-react'

type StatutMission = 'PLANIFIEE' | 'EN_COURS' | 'RAPPORT_PROVISOIRE' | 'CLOTUREE'
type NiveauRec = 'MAJEUR' | 'MODERE' | 'MINEUR'

interface MissionAudit {
  id: string
  titre: string
  domaine: string
  auditeur: string
  dateDebut: string
  dateFin: string
  statut: StatutMission
  avancement: number
  constatations: number
  recommandations: number
}

interface Recommandation {
  id: string
  mission: string
  libelle: string
  niveau: NiveauRec
  responsable: string
  echeance: string
  avancement: number
  statut: 'EN_COURS' | 'RESOLUE' | 'EN_RETARD' | 'REJETEE'
}

const MISSIONS: MissionAudit[] = [
  {
    id: 'AUD-2026-001', titre: 'Audit de la chaîne de dépense — Exercice 2025',
    domaine: 'Finances & Budget', auditeur: 'Cellule Audit Interne',
    dateDebut: '01/03/2026', dateFin: '30/04/2026', statut: 'CLOTUREE',
    avancement: 100, constatations: 8, recommandations: 12
  },
  {
    id: 'AUD-2026-002', titre: 'Audit de conformité des marchés 2025-2026',
    domaine: 'Marchés & Contrats', auditeur: 'Cellule Audit Interne',
    dateDebut: '01/06/2026', dateFin: '31/08/2026', statut: 'RAPPORT_PROVISOIRE',
    avancement: 90, constatations: 5, recommandations: 7
  },
  {
    id: 'AUD-2026-003', titre: 'Audit des systèmes d\'information et de la GED',
    domaine: 'Systèmes d\'information', auditeur: 'Cellule Audit Interne',
    dateDebut: '01/09/2026', dateFin: '31/10/2026', statut: 'EN_COURS',
    avancement: 35, constatations: 2, recommandations: 3
  },
  {
    id: 'AUD-2026-004', titre: 'Audit de performance du PAP 2026 — mi-exercice',
    domaine: 'Performance & S&E', auditeur: 'Cellule Audit Interne',
    dateDebut: '01/11/2026', dateFin: '31/12/2026', statut: 'PLANIFIEE',
    avancement: 0, constatations: 0, recommandations: 0
  },
]

const RECOMMANDATIONS: Recommandation[] = [
  {
    id: 'REC-001-01', mission: 'AUD-2026-001', niveau: 'MAJEUR',
    libelle: 'Formaliser la procédure de contrôle des seuils avant engagement',
    responsable: 'Direction du Budget', echeance: '30/06/2026', avancement: 75, statut: 'EN_COURS'
  },
  {
    id: 'REC-001-02', mission: 'AUD-2026-001', niveau: 'MAJEUR',
    libelle: 'Réduire le délai moyen de paiement de 18 jours à 7 jours (SLA contractuel)',
    responsable: 'Agent Comptable', echeance: '31/08/2026', avancement: 45, statut: 'EN_RETARD'
  },
  {
    id: 'REC-001-03', mission: 'AUD-2026-001', niveau: 'MODERE',
    libelle: 'Mettre en place un tableau de bord hebdomadaire des délais de traitement',
    responsable: 'Direction du Budget', echeance: '31/05/2026', avancement: 100, statut: 'RESOLUE'
  },
  {
    id: 'REC-001-04', mission: 'AUD-2026-001', niveau: 'MODERE',
    libelle: 'Documenter la procédure de clôture d\'exercice',
    responsable: 'Chef Comptable', echeance: '28/02/2026', avancement: 100, statut: 'RESOLUE'
  },
  {
    id: 'REC-001-05', mission: 'AUD-2026-001', niveau: 'MINEUR',
    libelle: 'Numériser l\'ensemble des dossiers d\'engagement antérieurs à 2024',
    responsable: 'Direction du Budget', echeance: '31/12/2026', avancement: 20, statut: 'EN_COURS'
  },
  {
    id: 'REC-002-01', mission: 'AUD-2026-002', niveau: 'MAJEUR',
    libelle: 'Régulariser les 2 engagements sans justificatif de dérogation aux seuils de consultation',
    responsable: 'Direction Juridique', echeance: '15/09/2026', avancement: 10, statut: 'EN_RETARD'
  },
  {
    id: 'REC-002-02', mission: 'AUD-2026-002', niveau: 'MODERE',
    libelle: 'Intégrer la vérification des seuils au workflow de saisie des EB',
    responsable: 'Administrateur', echeance: '31/10/2026', avancement: 0, statut: 'EN_COURS'
  },
  {
    id: 'REC-003-01', mission: 'AUD-2026-003', niveau: 'MODERE',
    libelle: 'Élaborer une politique de sauvegarde et de reprise d\'activité du système GED',
    responsable: 'DSI', echeance: '30/11/2026', avancement: 0, statut: 'EN_COURS'
  },
]

const STATUT_MISSION: Record<StatutMission, { label: string; bg: string; text: string }> = {
  PLANIFIEE: { label: 'Planifiée', bg: '#EDF2FB', text: '#1B3269' },
  EN_COURS: { label: 'En cours', bg: '#FEF3C7', text: '#92400E' },
  RAPPORT_PROVISOIRE: { label: 'Rapport provisoire', bg: '#DBEAFE', text: '#1D4ED8' },
  CLOTUREE: { label: 'Clôturée', bg: '#DCFCE7', text: '#166534' },
}

const REC_NIVEAU: Record<NiveauRec, { label: string; bg: string; text: string }> = {
  MAJEUR: { label: 'Majeur', bg: '#FEE2E2', text: '#991B1B' },
  MODERE: { label: 'Modéré', bg: '#FFEDD5', text: '#9A3412' },
  MINEUR: { label: 'Mineur', bg: '#FEF9C3', text: '#713F12' },
}

const REC_STATUT: Record<string, { label: string; bg: string; text: string }> = {
  EN_COURS: { label: 'En cours', bg: '#DBEAFE', text: '#1D4ED8' },
  RESOLUE: { label: 'Résolue', bg: '#DCFCE7', text: '#166534' },
  EN_RETARD: { label: 'En retard', bg: '#FEE2E2', text: '#991B1B' },
  REJETEE: { label: 'Rejetée', bg: '#F1F5F9', text: '#475569' },
}

export default function Audit() {
  const [activeTab, setActiveTab] = useState('missions')
  const [selectedMission, setSelectedMission] = useState<string | null>(null)
  const [showAnnualPlan, setShowAnnualPlan] = useState(false)
  const [showNewMission, setShowNewMission] = useState(false)
  const [missionDetail, setMissionDetail] = useState<MissionAudit | null>(null)
  const [newMissionForm, setNewMissionForm] = useState({ titre: '', type: '', perimetre: '', auditeurs: '', dateDebut: '', dateFin: '' })

  const resolues = RECOMMANDATIONS.filter(r => r.statut === 'RESOLUE').length
  const enRetard = RECOMMANDATIONS.filter(r => r.statut === 'EN_RETARD').length
  const majeurs = RECOMMANDATIONS.filter(r => r.niveau === 'MAJEUR').length

  const recs = selectedMission
    ? RECOMMANDATIONS.filter(r => r.mission === selectedMission)
    : RECOMMANDATIONS

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="section-title text-2xl">Audit interne</h1>
          <p className="text-sm text-gray-500 mt-0.5">Cellule d'Audit Interne CEEAC — Plan d'audit 2026</p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-outline btn-sm" onClick={() => setShowAnnualPlan(true)}><Calendar size={13} /> Plan d'audit annuel</button>
          <button className="btn btn-primary btn-sm" onClick={() => setShowNewMission(true)}><ClipboardList size={13} /> Nouvelle mission</button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Missions au plan 2026', value: MISSIONS.length, color: '#0B1C3E', sub: `${MISSIONS.filter(m => m.statut === 'CLOTUREE').length} clôturées` },
          { label: 'Recommandations totales', value: RECOMMANDATIONS.length, color: '#2563EB', sub: `${majeurs} majeures` },
          { label: 'Taux de résolution', value: `${Math.round(resolues / RECOMMANDATIONS.length * 100)}%`, color: '#16A34A', sub: `${resolues} résolues sur ${RECOMMANDATIONS.length}` },
          { label: 'En retard', value: enRetard, color: '#DC2626', sub: 'action urgente requise' },
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
          { id: 'missions', label: 'Missions d\'audit', icon: <ClipboardList size={13} /> },
          { id: 'recommandations', label: 'Recommandations & suivi', icon: <CheckCircle size={13} /> },
          { id: 'journal', label: 'Journal des actions sensibles', icon: <FileText size={13} /> },
        ].map(tab => (
          <button key={tab.id} className={`tab-item flex items-center gap-1.5 ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'missions' && (
        <div className="space-y-4">
          {MISSIONS.map(m => {
            const sc = STATUT_MISSION[m.statut]
            const barColor = m.statut === 'CLOTUREE' ? '#16A34A' : m.statut === 'EN_COURS' ? '#2563EB' : m.statut === 'RAPPORT_PROVISOIRE' ? '#D97706' : '#94A3B8'
            return (
              <div
                key={m.id}
                className={`card p-5 cursor-pointer transition-shadow ${selectedMission === m.id ? 'ring-2' : 'hover:shadow-md'}`}
                style={selectedMission === m.id ? { outline: '2px solid #0B1C3E' } : {}}
                onClick={() => setSelectedMission(selectedMission === m.id ? null : m.id)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-mono text-[12px] font-bold text-navy-900">{m.id}</span>
                      <span className="badge text-[10.5px] px-2 py-0.5" style={{ background: sc.bg, color: sc.text }}>{sc.label}</span>
                      <span className="badge text-[10.5px] px-2 py-0.5" style={{ background: '#F1F5F9', color: '#475569' }}>{m.domaine}</span>
                    </div>
                    <div className="font-semibold text-[15px] text-gray-900 mb-3">{m.titre}</div>
                    <div className="flex items-center gap-6 text-[12px] text-gray-500 mb-3">
                      <div><span className="font-semibold text-gray-700">Auditeur :</span> {m.auditeur}</div>
                      <div><span className="font-semibold text-gray-700">Période :</span> <span className="font-mono">{m.dateDebut} → {m.dateFin}</span></div>
                      {m.constatations > 0 && (
                        <div><span className="font-semibold text-gray-700">Constatations :</span> {m.constatations}</div>
                      )}
                      {m.recommandations > 0 && (
                        <div><span className="font-semibold text-gray-700">Recommandations :</span> {m.recommandations}</div>
                      )}
                    </div>
                    <div className="progress-bar-track">
                      <div className="progress-bar-fill" style={{ width: `${m.avancement}%`, background: barColor }} />
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <div className="text-[10px] uppercase font-semibold tracking-wider text-gray-400 mb-1">Avancement</div>
                    <div className="font-bold text-3xl" style={{ color: barColor }}>{m.avancement}%</div>
                    {m.statut !== 'PLANIFIEE' && (
                      <button
                        className="btn btn-outline btn-sm mt-2 gap-1"
                        onClick={e => { e.stopPropagation(); setMissionDetail(m) }}
                      >
                        Voir <ChevronRight size={11} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {activeTab === 'recommandations' && (
        <div className="space-y-3">
          {enRetard > 0 && (
            <div className="alert-banner" style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}>
              <AlertTriangle size={14} className="text-red-500 flex-shrink-0" />
              <span className="text-[13px] text-red-800 font-medium">
                {enRetard} recommandation{enRetard > 1 ? 's' : ''} en retard — Escalade requise
              </span>
            </div>
          )}

          <div className="flex items-center gap-3 mb-2">
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input className="form-input pl-9 py-2 text-[13px] w-64" placeholder="Rechercher…" />
            </div>
            <div className="flex gap-1">
              {[null, ...MISSIONS.filter(m => m.recommandations > 0).map(m => m.id)].map(mid => (
                <button
                  key={mid ?? 'all'}
                  className={`btn btn-sm text-[11px] ${selectedMission === mid ? 'btn-navy' : 'btn-outline'}`}
                  onClick={() => setSelectedMission(mid)}
                >
                  {mid ?? 'Toutes'}
                </button>
              ))}
            </div>
          </div>

          <div className="card overflow-hidden">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Réf.</th>
                  <th>Mission</th>
                  <th>Recommandation</th>
                  <th>Niveau</th>
                  <th>Responsable</th>
                  <th>Échéance</th>
                  <th>Avancement</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {recs.map(r => {
                  const nv = REC_NIVEAU[r.niveau]
                  const sc = REC_STATUT[r.statut]
                  const barColor = r.statut === 'RESOLUE' ? '#16A34A' : r.statut === 'EN_RETARD' ? '#DC2626' : '#2563EB'
                  return (
                    <tr key={r.id}>
                      <td><span className="font-mono text-[11.5px] font-bold text-navy-900">{r.id}</span></td>
                      <td><span className="font-mono text-[11px] text-gray-500">{r.mission}</span></td>
                      <td className="text-[12.5px] font-medium text-gray-800 max-w-[220px]">{r.libelle}</td>
                      <td><span className="badge text-[10.5px] px-2 py-0.5" style={{ background: nv.bg, color: nv.text }}>{nv.label}</span></td>
                      <td className="text-[12.5px] text-gray-600">{r.responsable}</td>
                      <td className={`font-mono text-[12px] ${r.statut === 'EN_RETARD' ? 'text-red-600 font-bold' : 'text-gray-500'}`}>{r.echeance}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="w-20 progress-bar-track flex-shrink-0">
                            <div className="progress-bar-fill" style={{ width: `${r.avancement}%`, background: barColor }} />
                          </div>
                          <span className="font-mono text-[12px] font-semibold" style={{ color: barColor }}>{r.avancement}%</span>
                        </div>
                      </td>
                      <td><span className="badge text-[10.5px] px-2 py-0.5" style={{ background: sc.bg, color: sc.text }}>{sc.label}</span></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── MODAL PLAN D'AUDIT ANNUEL ── */}
      {showAnnualPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(11,28,62,0.6)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between" style={{ background: '#0B1C3E', borderRadius: '1rem 1rem 0 0' }}>
              <div className="flex items-center gap-2">
                <Calendar size={15} className="text-white" />
                <span className="font-bold text-white text-sm">Plan d'audit annuel — Exercice 2026</span>
              </div>
              <button className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/10" onClick={() => setShowAnnualPlan(false)}>
                <X size={14} className="text-white" />
              </button>
            </div>
            <div className="p-6">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    {['Référence', 'Titre de la mission', 'Domaine', 'Période', 'Statut', 'Avancement'].map(h => (
                      <th key={h} className="text-left px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {MISSIONS.map((m, i) => {
                    const sc = STATUT_MISSION[m.statut]
                    return (
                      <tr key={i} className="border-b border-gray-50">
                        <td className="px-3 py-2.5 font-mono text-[12px] font-bold text-navy-900">{m.id}</td>
                        <td className="px-3 py-2.5 font-medium text-gray-800 max-w-[220px]">{m.titre}</td>
                        <td className="px-3 py-2.5 text-gray-500">{m.domaine}</td>
                        <td className="px-3 py-2.5 font-mono text-[11.5px] text-gray-500">{m.dateDebut} → {m.dateFin}</td>
                        <td className="px-3 py-2.5">
                          <span className="badge text-[10.5px] px-2 py-0.5" style={{ background: sc.bg, color: sc.text }}>{sc.label}</span>
                        </td>
                        <td className="px-3 py-2.5">
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-1.5 rounded-full bg-gray-100">
                              <div className="h-1.5 rounded-full" style={{ width: `${m.avancement}%`, background: m.statut === 'CLOTUREE' ? '#16A34A' : '#2563EB' }} />
                            </div>
                            <span className="font-mono text-[12px] font-semibold text-gray-700">{m.avancement}%</span>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              <div className="flex justify-end mt-4">
                <button className="btn btn-outline btn-sm" onClick={() => setShowAnnualPlan(false)}>Fermer</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL NOUVELLE MISSION ── */}
      {showNewMission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(11,28,62,0.6)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between" style={{ background: '#0B1C3E', borderRadius: '1rem 1rem 0 0' }}>
              <div className="flex items-center gap-2">
                <Plus size={15} className="text-white" />
                <span className="font-bold text-white text-sm">Nouvelle mission d'audit</span>
              </div>
              <button className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/10" onClick={() => setShowNewMission(false)}>
                <X size={14} className="text-white" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="form-label">Titre de la mission *</label>
                <input className="form-input text-[13px]" placeholder="Ex: Audit de la chaîne de dépense…" value={newMissionForm.titre} onChange={e => setNewMissionForm(f => ({ ...f, titre: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Type de mission *</label>
                  <select className="form-input text-[13px]" value={newMissionForm.type} onChange={e => setNewMissionForm(f => ({ ...f, type: e.target.value }))}>
                    <option value="">— Sélectionner —</option>
                    <option>Audit de conformité</option>
                    <option>Audit de performance</option>
                    <option>Audit financier</option>
                    <option>Audit des systèmes</option>
                    <option>Audit organisationnel</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Périmètre / Domaine *</label>
                  <input className="form-input text-[13px]" placeholder="Ex: Finances & Budget" value={newMissionForm.perimetre} onChange={e => setNewMissionForm(f => ({ ...f, perimetre: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="form-label">Auditeurs assignés</label>
                <input className="form-input text-[13px]" placeholder="Ex: Cellule Audit Interne" value={newMissionForm.auditeurs} onChange={e => setNewMissionForm(f => ({ ...f, auditeurs: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Date de début *</label>
                  <input type="date" className="form-input text-[13px]" value={newMissionForm.dateDebut} onChange={e => setNewMissionForm(f => ({ ...f, dateDebut: e.target.value }))} />
                </div>
                <div>
                  <label className="form-label">Date de fin prévue *</label>
                  <input type="date" className="form-input text-[13px]" value={newMissionForm.dateFin} onChange={e => setNewMissionForm(f => ({ ...f, dateFin: e.target.value }))} />
                </div>
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <button className="btn btn-outline btn-sm" onClick={() => setShowNewMission(false)}>Annuler</button>
                <button
                  className="btn btn-primary btn-sm"
                  style={{ background: '#0B1C3E', border: 'none' }}
                  disabled={!newMissionForm.titre || !newMissionForm.type}
                  onClick={() => { setShowNewMission(false); setNewMissionForm({ titre: '', type: '', perimetre: '', auditeurs: '', dateDebut: '', dateFin: '' }) }}
                >
                  <CheckCircle size={13} /> Créer la mission
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL DÉTAIL MISSION ── */}
      {missionDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(11,28,62,0.6)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between" style={{ background: '#0B1C3E', borderRadius: '1rem 1rem 0 0' }}>
              <div>
                <span className="font-bold text-white text-sm">{missionDetail.titre}</span>
                <div className="text-[10px] text-white/50 mt-0.5">{missionDetail.id} · {missionDetail.domaine}</div>
              </div>
              <button className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/10" onClick={() => setMissionDetail(null)}>
                <X size={14} className="text-white" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="flex items-center gap-3">
                <span className="badge text-[10.5px] px-2 py-0.5" style={{ background: STATUT_MISSION[missionDetail.statut].bg, color: STATUT_MISSION[missionDetail.statut].text }}>
                  {STATUT_MISSION[missionDetail.statut].label}
                </span>
                <span className="text-[12px] text-gray-500">Auditeur : <strong>{missionDetail.auditeur}</strong></span>
                <span className="font-mono text-[12px] text-gray-500">{missionDetail.dateDebut} → {missionDetail.dateFin}</span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Avancement", value: `${missionDetail.avancement}%`, color: missionDetail.avancement === 100 ? '#16A34A' : '#2563EB' },
                  { label: "Constatations", value: missionDetail.constatations, color: '#D97706' },
                  { label: "Recommandations", value: missionDetail.recommandations, color: '#7C3AED' },
                ].map((k, i) => (
                  <div key={i} className="card p-4 text-center">
                    <div className="text-[10px] uppercase font-semibold tracking-wider text-gray-400">{k.label}</div>
                    <div className="text-[28px] font-bold mt-1" style={{ color: k.color }}>{k.value}</div>
                  </div>
                ))}
              </div>
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">Recommandations liées</div>
                {RECOMMANDATIONS.filter(r => r.mission === missionDetail.id).length === 0
                  ? <div className="text-[13px] text-gray-400 italic">Aucune recommandation enregistrée</div>
                  : RECOMMANDATIONS.filter(r => r.mission === missionDetail.id).map(r => (
                    <div key={r.id} className="flex items-center justify-between py-2 border-b border-gray-50">
                      <div>
                        <span className="font-mono text-[11px] text-gray-400 mr-2">{r.id}</span>
                        <span className="text-[12.5px] text-gray-800">{r.libelle}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="badge text-[10.5px] px-2 py-0.5" style={{ background: REC_NIVEAU[r.niveau].bg, color: REC_NIVEAU[r.niveau].text }}>{REC_NIVEAU[r.niveau].label}</span>
                        <span className="font-mono text-[12px] font-semibold" style={{ color: r.statut === 'RESOLUE' ? '#16A34A' : r.statut === 'EN_RETARD' ? '#DC2626' : '#2563EB' }}>{r.avancement}%</span>
                      </div>
                    </div>
                  ))
                }
              </div>
              <div className="flex justify-end">
                <button className="btn btn-outline btn-sm" onClick={() => setMissionDetail(null)}>Fermer</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'journal' && (
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 font-semibold text-[15px] text-gray-800">Journal des actions sensibles</div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Date / Heure</th>
                <th>Utilisateur</th>
                <th>Action</th>
                <th>Module</th>
                <th>Référence</th>
                <th>Adresse IP</th>
                <th>Résultat</th>
              </tr>
            </thead>
            <tbody>
              {[
                { dt: '08/09/2026 09:14', user: 'a.mbongo', action: 'VISA_CF', module: 'Engagement', ref: 'ENG-2026-002', ip: '10.0.1.23', ok: true },
                { dt: '08/09/2026 08:47', user: 'h.bongo', action: 'VALIDATION_BUDGET', module: 'Engagement', ref: 'ENG-2026-002', ip: '10.0.1.15', ok: true },
                { dt: '07/09/2026 17:22', user: 's.nkomo', action: 'SIGNATURE_ORD', module: 'Ordonnancement', ref: 'ORD-2026-002', ip: '10.0.2.8', ok: true },
                { dt: '07/09/2026 16:55', user: 'a.engone', action: 'VALIDATION_PAIEMENT', module: 'Paiement', ref: 'PAY-2026-002', ip: '10.0.1.31', ok: true },
                { dt: '05/09/2026 11:03', user: 'e.biyoghe', action: 'TENTATIVE_CONNEXION', module: 'Système', ref: '—', ip: '10.0.3.44', ok: false },
                { dt: '04/09/2026 14:28', user: 'mc.nkoghe', action: 'MODIFICATION_IMPUTATION', module: 'Budget', ref: 'BL-2026-003', ip: '10.0.1.12', ok: true },
                { dt: '03/09/2026 09:15', user: 'h.bongo', action: 'REJET_EB', module: 'Expression de Besoin', ref: 'EB-2026-007', ip: '10.0.1.15', ok: true },
              ].map((row, i) => (
                <tr key={i}>
                  <td className="font-mono text-[11.5px] text-gray-500">{row.dt}</td>
                  <td className="font-mono text-[12px] text-navy-900">{row.user}</td>
                  <td><span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded" style={{ background: '#EDF2FB', color: '#1B3269' }}>{row.action}</span></td>
                  <td className="text-[12.5px] text-gray-600">{row.module}</td>
                  <td><span className="font-mono text-[11.5px] text-gray-600">{row.ref}</span></td>
                  <td className="font-mono text-[11.5px] text-gray-400">{row.ip}</td>
                  <td>
                    <span className="badge text-[10.5px] px-2 py-0.5 flex items-center gap-1 w-fit"
                      style={row.ok ? { background: '#DCFCE7', color: '#166534' } : { background: '#FEE2E2', color: '#991B1B' }}>
                      {row.ok ? <CheckCircle size={10} /> : <AlertTriangle size={10} />}
                      {row.ok ? 'Succès' : 'Échec'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
