import { useState } from 'react'
import { Target, TrendingUp, TrendingDown, Minus, BarChart2, ChevronDown, ChevronRight, CheckCircle } from 'lucide-react'
import PDFPreviewModal from '../components/PDFPreviewModal'
import RapportSuivi from '../components/pdf/RapportSuivi'
import { PILIER_PERFORMANCE, INDICATORS, BUDGET_SUMMARY } from '../data/mock'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'

const fmt = (n: number) =>
  new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(n)

const fmtM = (n: number) =>
  n >= 1_000_000_000
    ? `${(n / 1_000_000_000).toFixed(2)} Mrd`
    : `${(n / 1_000_000).toFixed(0)} M`

const PAP_AXES = [
  {
    pilier: 'P1 — Intégration économique', pilierColor: '#0B1C3E',
    budget: 8_240_000_000, engage: 5_120_000_000, paye: 3_240_000_000,
    tauxPhysique: 64, tauxFinancier: 39.3,
    programmes: [
      { code: 'PRG-1.1', libelle: 'Zone de libre-échange CEEAC', budget: 3_500_000_000, engage: 2_100_000_000, tauxPhy: 70, indicateur: 'Nombre de barrières tarifaires éliminées', cible: 12, realise: 9 },
      { code: 'PRG-1.2', libelle: 'Intégration commerciale régionale', budget: 4_740_000_000, engage: 3_020_000_000, tauxPhy: 59, indicateur: 'Volume des échanges intra-CEEAC (Mrd USD)', cible: 4.2, realise: 2.9 },
    ]
  },
  {
    pilier: 'P2 — Paix & Sécurité', pilierColor: '#1A6B3A',
    budget: 6_870_000_000, engage: 4_340_000_000, paye: 2_870_000_000,
    tauxPhysique: 58, tauxFinancier: 41.8,
    programmes: [
      { code: 'PRG-2.1', libelle: 'Architecture de paix et sécurité', budget: 4_200_000_000, engage: 2_800_000_000, tauxPhy: 62, indicateur: 'Missions d\'observation déployées', cible: 4, realise: 3 },
      { code: 'PRG-2.2', libelle: 'Gouvernance et État de droit', budget: 2_670_000_000, engage: 1_540_000_000, tauxPhy: 52, indicateur: 'Taux de mise en oeuvre Plan Gouvernance', cible: 75, realise: 44 },
    ]
  },
  {
    pilier: 'P3 — Développement humain', pilierColor: '#D97706',
    budget: 5_340_000_000, engage: 3_870_000_000, paye: 2_640_000_000,
    tauxPhysique: 73, tauxFinancier: 49.4,
    programmes: [
      { code: 'PRG-3.1', libelle: 'Renforcement des capacités régionales', budget: 3_100_000_000, engage: 2_400_000_000, tauxPhy: 78, indicateur: 'Agents formés (toutes catégories)', cible: 450, realise: 387 },
      { code: 'PRG-3.2', libelle: 'Santé et protection sociale', budget: 2_240_000_000, engage: 1_470_000_000, tauxPhy: 66, indicateur: 'Projets santé financés', cible: 8, realise: 6 },
    ]
  },
  {
    pilier: 'P4 — Fonctionnement institutionnel', pilierColor: '#7E22CE',
    budget: 7_440_000_000, engage: 3_904_567_890, paye: 2_484_567_890,
    tauxPhysique: 52, tauxFinancier: 33.4,
    programmes: [
      { code: 'PRG-4.1', libelle: 'Infrastructure & systèmes d\'information', budget: 4_200_000_000, engage: 2_100_000_000, tauxPhy: 48, indicateur: 'Projets SI déployés', cible: 6, realise: 3 },
      { code: 'PRG-4.2', libelle: 'Ressources humaines & logistique', budget: 3_240_000_000, engage: 1_804_567_890, tauxPhy: 57, indicateur: 'Taux renouvellement parc logistique', cible: 30, realise: 18 },
    ]
  },
]

const CHART_DATA = PAP_AXES.map(a => ({
  name: a.pilier.split(' — ')[0],
  Budget: Math.round(a.budget / 1e6),
  Engagé: Math.round(a.engage / 1e6),
  Payé: Math.round(a.paye / 1e6),
}))

const tendanceIcon = (t: string) => {
  if (t === 'hausse') return <TrendingUp size={13} className="text-green-600" />
  if (t === 'baisse') return <TrendingDown size={13} className="text-red-500" />
  return <Minus size={13} className="text-gray-400" />
}

export default function PAP() {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['P1 — Intégration économique']))
  const [activeTab, setActiveTab] = useState('apercu')
  const [showTelechargerModal, setShowTelechargerModal] = useState(false)
  const [showRapportModal, setShowRapportModal] = useState(false)
  const [exportFormat, setExportFormat] = useState<'PDF complet' | 'PDF résumé' | 'Excel'>('PDF complet')
  const [rapportPeriode, setRapportPeriode] = useState('T3 2026')
  const [rapportIndic, setRapportIndic] = useState<Record<string, boolean>>({ physique: true, financier: true, ecart: false, commentaires: false })
  const [rapportGenere, setRapportGenere] = useState(false)
  const [downloadToast, setDownloadToast] = useState(false)
  const [showPAPPdf, setShowPAPPdf] = useState(false)
  const [papPdfType, setPapPdfType] = useState('Rapport d\'exécution PAP')

  const toggle = (id: string) => {
    setExpanded(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      return next
    })
  }

  const papBudget = PAP_AXES.reduce((s, a) => s + a.budget, 0)
  const papEngage = PAP_AXES.reduce((s, a) => s + a.engage, 0)
  const papPaye = PAP_AXES.reduce((s, a) => s + a.paye, 0)
  const moyPhysique = Math.round(PAP_AXES.reduce((s, a) => s + a.tauxPhysique, 0) / PAP_AXES.length)

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="section-title text-2xl">Plan Annuel de Performance 2026</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Segment PAP du Budget CEEAC — {fmtM(papBudget)} XAF — 4 Piliers · 8 Programmes · 6 Indicateurs
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowTelechargerModal(true)} className="btn btn-outline btn-sm">Télécharger PAP</button>
          <button onClick={() => { setRapportGenere(false); setShowRapportModal(true) }} className="btn btn-outline btn-sm">{"Rapport d'avancement"}</button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Budget PAP 2026', value: fmtM(papBudget), sub: `${Math.round(papBudget / BUDGET_SUMMARY.budgetRevise * 100)}% du budget révisé`, color: '#0B1C3E' },
          { label: 'Montant engagé PAP', value: fmtM(papEngage), sub: `${Math.round(papEngage / papBudget * 100)}% du budget PAP`, color: '#1A6B3A' },
          { label: 'Montant payé PAP', value: fmtM(papPaye), sub: `taux paiement ${Math.round(papPaye / papBudget * 100)}%`, color: '#D4A017' },
          { label: 'Réalisation physique moy.', value: `${moyPhysique}%`, sub: 'moyenne 4 piliers', color: '#7E22CE' },
        ].map((k, i) => (
          <div key={i} className="kpi-card py-3" style={{ borderLeft: `3px solid ${k.color}` }}>
            <div className="text-[10px] uppercase font-semibold tracking-wider text-gray-400">{k.label}</div>
            <div className="amount text-xl font-bold mt-0.5" style={{ color: k.color }}>{k.value}</div>
            <div className="text-[10.5px] text-gray-400 mt-0.5">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 gap-0 -mt-2">
        {[
          { id: 'apercu', label: 'Aperçu & graphiques', icon: <BarChart2 size={13} /> },
          { id: 'programmes', label: 'Programmes & activités', icon: <Target size={13} /> },
          { id: 'indicateurs', label: 'Indicateurs de performance', icon: <TrendingUp size={13} /> },
        ].map(tab => (
          <button key={tab.id} className={`tab-item flex items-center gap-1.5 ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'apercu' && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-5">
            {/* Bar chart */}
            <div className="card p-5">
              <div className="text-[11px] uppercase font-semibold tracking-wider text-gray-400 mb-4">Exécution PAP par pilier (M XAF)</div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={CHART_DATA} barSize={18}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748B' }} unit=" M" />
                  <Tooltip formatter={(v) => `${fmt(Number(v))} M XAF`} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="Budget" fill="#CBD5E1" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="Engagé" fill="#1A6B3A" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="Payé" fill="#D4A017" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pilier performance summary */}
            <div className="card p-5">
              <div className="text-[11px] uppercase font-semibold tracking-wider text-gray-400 mb-4">Performance par pilier</div>
              <div className="space-y-4">
                {PAP_AXES.map((a, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: a.pilierColor }} />
                        <span className="text-[12.5px] font-semibold text-gray-800">{a.pilier.split(' — ')[0]}</span>
                      </div>
                      <div className="flex items-center gap-3 text-[11.5px]">
                        <span className="text-purple-600 font-bold">{a.tauxPhysique}% phys.</span>
                        <span className="text-green-700 font-bold">{a.tauxFinancier}% fin.</span>
                      </div>
                    </div>
                    <div className="progress-bar-track">
                      <div className="progress-bar-fill" style={{ width: `${a.tauxPhysique}%`, background: a.pilierColor }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Ventilation budgétaire PAP */}
          <div className="card p-5">
            <div className="text-[11px] uppercase font-semibold tracking-wider text-gray-400 mb-4">Ventilation budgétaire PAP</div>
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Pilier</th>
                    <th>Budget PAP (XAF)</th>
                    <th>Engagé (XAF)</th>
                    <th>Payé (XAF)</th>
                    <th>Taux engagement</th>
                    <th>Taux physique</th>
                    <th>Écart phys./fin.</th>
                  </tr>
                </thead>
                <tbody>
                  {PAP_AXES.map((a, i) => {
                    const txEng = Math.round(a.engage / a.budget * 100)
                    const ecart = a.tauxPhysique - a.tauxFinancier
                    return (
                      <tr key={i}>
                        <td>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-sm flex-shrink-0" style={{ background: a.pilierColor }} />
                            <span className="font-semibold text-[12.5px]">{a.pilier}</span>
                          </div>
                        </td>
                        <td className="amount text-[13px]">{fmtM(a.budget)}</td>
                        <td className="amount text-[13px] text-ceeac-700">{fmtM(a.engage)}</td>
                        <td className="amount text-[13px] text-amber-700">{fmtM(a.paye)}</td>
                        <td>
                          <div className="flex items-center gap-2">
                            <div className="w-16 progress-bar-track">
                              <div className="progress-bar-fill" style={{ width: `${txEng}%`, background: '#1A6B3A' }} />
                            </div>
                            <span className="text-[12px] font-mono font-bold text-ceeac-700">{txEng}%</span>
                          </div>
                        </td>
                        <td>
                          <span className={`font-mono font-bold text-[13px] ${a.tauxPhysique >= 70 ? 'text-green-600' : a.tauxPhysique >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
                            {a.tauxPhysique}%
                          </span>
                        </td>
                        <td>
                          <span className={`font-mono font-bold text-[12px] ${ecart >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {ecart >= 0 ? '+' : ''}{ecart.toFixed(1)} pts
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                  <tr style={{ background: '#F8FAFC', fontWeight: 700 }}>
                    <td className="font-bold text-navy-900">TOTAL PAP</td>
                    <td className="amount text-[13px] font-bold">{fmtM(papBudget)}</td>
                    <td className="amount text-[13px] font-bold text-ceeac-700">{fmtM(papEngage)}</td>
                    <td className="amount text-[13px] font-bold text-amber-700">{fmtM(papPaye)}</td>
                    <td className="font-mono font-bold text-[13px] text-ceeac-700">{Math.round(papEngage / papBudget * 100)}%</td>
                    <td className="font-mono font-bold text-[13px]">{moyPhysique}%</td>
                    <td className="font-mono font-bold text-[12px] text-green-600">+{(moyPhysique - Math.round(papEngage / papBudget * 100)).toFixed(1)} pts</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'programmes' && (
        <div className="space-y-3">
          {PAP_AXES.map((a, ai) => (
            <div key={ai} className="card overflow-hidden">
              <div
                className="flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-gray-50"
                style={{ borderLeft: `4px solid ${a.pilierColor}` }}
                onClick={() => toggle(a.pilier)}
              >
                <div className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0" style={{ background: a.pilierColor }}>
                  {expanded.has(a.pilier) ? <ChevronDown size={13} className="text-white" /> : <ChevronRight size={13} className="text-white" />}
                </div>
                <span className="font-bold text-[14px] text-navy-900 flex-1">{a.pilier}</span>
                <div className="flex items-center gap-6 text-[12px]">
                  <span className="text-gray-500">Budget : <span className="font-bold text-gray-800 font-mono">{fmtM(a.budget)}</span></span>
                  <span className="text-ceeac-700 font-bold">{a.tauxPhysique}% physique</span>
                </div>
              </div>

              {expanded.has(a.pilier) && (
                <div className="divide-y divide-gray-50">
                  {a.programmes.map((prg, pi) => {
                    const txEng = Math.round(prg.engage / prg.budget * 100)
                    const txReal = Math.round(prg.realise / prg.cible * 100)
                    return (
                      <div key={pi} className="px-5 py-4 ml-9">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-mono text-[11px] font-bold" style={{ color: a.pilierColor }}>{prg.code}</span>
                              <span className="font-semibold text-[13px] text-gray-900">{prg.libelle}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 text-[12px] mb-3">
                              <div>
                                <div className="text-gray-400 text-[10px] uppercase font-semibold tracking-wider mb-0.5">Budget</div>
                                <div className="font-mono font-bold text-gray-800">{fmtM(prg.budget)}</div>
                              </div>
                              <div>
                                <div className="text-gray-400 text-[10px] uppercase font-semibold tracking-wider mb-0.5">Engagé</div>
                                <div className="font-mono font-bold text-ceeac-700">{fmtM(prg.engage)} ({txEng}%)</div>
                              </div>
                              <div>
                                <div className="text-gray-400 text-[10px] uppercase font-semibold tracking-wider mb-0.5">Indicateur clé</div>
                                <div className="text-gray-700 text-[12px]">{prg.indicateur}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="flex-1">
                                <div className="flex justify-between text-[11px] text-gray-500 mb-1">
                                  <span>Engagement</span>
                                  <span className="font-mono font-bold text-ceeac-700">{txEng}%</span>
                                </div>
                                <div className="progress-bar-track">
                                  <div className="progress-bar-fill" style={{ width: `${txEng}%`, background: '#1A6B3A' }} />
                                </div>
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between text-[11px] text-gray-500 mb-1">
                                  <span>Réalisation physique</span>
                                  <span className={`font-mono font-bold ${prg.tauxPhy >= 70 ? 'text-green-600' : 'text-amber-600'}`}>{prg.tauxPhy}%</span>
                                </div>
                                <div className="progress-bar-track">
                                  <div className="progress-bar-fill" style={{ width: `${prg.tauxPhy}%`, background: '#7E22CE' }} />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex-shrink-0 text-right">
                            <div className="text-[10px] uppercase font-semibold tracking-wider text-gray-400 mb-1">Cible / Réalisé</div>
                            <div className="font-bold text-2xl font-mono" style={{ color: txReal >= 80 ? '#16A34A' : txReal >= 60 ? '#D97706' : '#DC2626' }}>
                              {prg.realise}
                            </div>
                            <div className="text-[11.5px] text-gray-400">/ {prg.cible}</div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'indicateurs' && (
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 font-semibold text-[15px] text-gray-800">Indicateurs de performance PAP 2026</div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Indicateur</th>
                <th>Pilier</th>
                <th>Baseline</th>
                <th>Cible 2026</th>
                <th>Réalisation</th>
                <th>Taux</th>
                <th>Tendance</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {INDICATORS.map(ind => {
                const txColor = ind.tauxAtteinte >= 80 ? '#16A34A' : ind.tauxAtteinte >= 60 ? '#D97706' : '#DC2626'
                const stCfg: Record<string, { bg: string; text: string }> = {
                  VERT: { bg: '#DCFCE7', text: '#166534' },
                  ORANGE: { bg: '#FEF3C7', text: '#92400E' },
                  ROUGE: { bg: '#FEE2E2', text: '#991B1B' },
                }
                const sc = stCfg[ind.statut] ?? { bg: '#F1F5F9', text: '#64748B' }
                return (
                  <tr key={ind.id}>
                    <td><span className="font-mono text-[11.5px] font-bold text-navy-900">{ind.id}</span></td>
                    <td className="font-medium text-[13px] text-gray-800 max-w-[200px]">{ind.libelle}</td>
                    <td className="text-[12px] text-gray-500">{ind.niveau}</td>
                    <td className="font-mono text-[12.5px] text-gray-600">{ind.baseline}</td>
                    <td className="font-mono text-[12.5px] font-semibold text-gray-800">{ind.cible}</td>
                    <td className="font-mono text-[13px] font-bold" style={{ color: txColor }}>{ind.realisation}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-16 progress-bar-track">
                          <div className="progress-bar-fill" style={{ width: `${Math.min(ind.tauxAtteinte, 100)}%`, background: txColor }} />
                        </div>
                        <span className="font-mono font-bold text-[12px]" style={{ color: txColor }}>{ind.tauxAtteinte}%</span>
                      </div>
                    </td>
                    <td>{tendanceIcon(ind.tendance)}</td>
                    <td>
                      <span className="badge text-[10.5px] px-2 py-0.5" style={{ background: sc.bg, color: sc.text }}>
                        {ind.statut === 'VERT' ? 'Sur cible' : ind.statut === 'ORANGE' ? 'À risque' : 'Hors cible'}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
      {/* TOAST */}
      {downloadToast && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-[13px] font-semibold text-white" style={{ background: '#0B1C3E' }}>
          <CheckCircle size={15} className="text-green-400" />Export CSV généré ✓
        </div>
      )}
      {showPAPPdf && (
        <PDFPreviewModal title={papPdfType} reference={`PAP_${rapportPeriode.replace(/\s/g, '_')}`} docCode={`RPT-PAP-${rapportPeriode.replace(/\s/g, '')}`} onClose={() => setShowPAPPdf(false)}>
          <RapportSuivi type={papPdfType} periode={rapportPeriode} />
        </PDFPreviewModal>
      )}

      {/* MODAL TÉLÉCHARGER PAP */}
      {showTelechargerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(11,28,62,0.6)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
              <h3 className="font-bold text-gray-800">Télécharger le PAP 2026</h3>
            </div>
            <div className="p-6 space-y-3">
              <p className="text-[13px] text-gray-600">Choisissez le format :</p>
              {(['PDF complet', 'PDF résumé', 'Excel'] as const).map(fmt => (
                <label key={fmt} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${exportFormat === fmt ? 'border-navy-900 bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`} style={exportFormat === fmt ? { borderColor: '#0B1C3E' } : {}}>
                  <input type="radio" name="papFmt" checked={exportFormat === fmt} onChange={() => setExportFormat(fmt)} />
                  <span className="font-medium text-gray-700 text-[13px]">{fmt}</span>
                </label>
              ))}
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex gap-2 justify-end">
              <button onClick={() => setShowTelechargerModal(false)} className="btn btn-outline btn-sm">Annuler</button>
              <button onClick={() => {
                setShowTelechargerModal(false)
                if (exportFormat === 'Excel') {
                  const rows = ['Pilier,Programme,Budget (FCFA),Engagé (FCFA),Avancement physique', ...PAP_AXES.flatMap(ax => ax.programmes.map(p => `"${ax.pilier}","${p.libelle}",${p.budget},${p.engage},${p.tauxPhy}%`))]
                  const blob = new Blob([rows.join('\n')], { type: 'text/csv' })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url; a.download = `PAP_CEEAC_2026.csv`; a.click(); URL.revokeObjectURL(url)
                  setDownloadToast(true); setTimeout(() => setDownloadToast(false), 3000)
                } else {
                  setPapPdfType('Rapport d\'exécution PAP'); setShowPAPPdf(true)
                }
              }} className="btn btn-sm gap-1.5 text-white" style={{ background: '#0B1C3E', border: 'none' }}>
                Télécharger ({exportFormat})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL RAPPORT D'AVANCEMENT */}
      {showRapportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(11,28,62,0.6)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
              <h3 className="font-bold text-gray-800">{"Rapport d'avancement PAP"}</h3>
            </div>
            {!rapportGenere ? (
              <div className="p-6 space-y-4">
                <div>
                  <label className="form-label">Période de référence</label>
                  <select className="form-input text-[13px]" value={rapportPeriode} onChange={e => setRapportPeriode(e.target.value)}>
                    {['T1 2026', 'T2 2026', 'T3 2026', 'S1 2026', 'Annuel 2026'].map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label mb-2">Indicateurs à inclure</label>
                  <div className="space-y-2">
                    {([
                      { key: 'physique', label: 'Taux de réalisation physique' },
                      { key: 'financier', label: "Taux d'exécution financier" },
                      { key: 'ecart', label: 'Analyse des écarts' },
                      { key: 'commentaires', label: 'Commentaires et observations' },
                    ] as { key: keyof typeof rapportIndic; label: string }[]).map(item => (
                      <label key={item.key} className="flex items-center gap-2 cursor-pointer text-[13px] text-gray-700">
                        <input type="checkbox" checked={rapportIndic[item.key]} onChange={e => setRapportIndic(prev => ({ ...prev, [item.key]: e.target.checked }))} />
                        {item.label}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="px-0 pt-2 flex gap-2 justify-end">
                  <button onClick={() => setShowRapportModal(false)} className="btn btn-outline btn-sm">Annuler</button>
                  <button onClick={() => setRapportGenere(true)} className="btn btn-sm gap-1 text-white" style={{ background: '#0B1C3E', border: 'none' }}>
                    Générer le rapport
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6 space-y-4">
                <div className="p-4 rounded-xl bg-green-50 border border-green-200 flex items-center gap-3">
                  <span className="text-green-700 text-xl">✓</span>
                  <div>
                    <p className="font-bold text-green-800 text-[13px]">Rapport généré avec succès</p>
                    <p className="text-[11px] text-green-600">Rapport PAP — {rapportPeriode} · {new Date().toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <button onClick={() => setShowRapportModal(false)} className="btn btn-outline btn-sm">Fermer</button>
                  <button onClick={() => { setShowRapportModal(false); setPapPdfType('Rapport d\'avancement PAP'); setShowPAPPdf(true) }} className="btn btn-sm gap-1 text-white" style={{ background: '#0B1C3E', border: 'none' }}>
                    Aperçu &amp; Télécharger
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
