import { useState } from 'react'
import { Search, Filter, Download, X, ArrowRight } from 'lucide-react'
import type { Page } from '../types'
import { BUDGET_LINES, BUDGET_SUMMARY } from '../data/mock'

const fmt = (n: number) =>
  new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(n)

interface Props {
  onNavigate: (page: Page, id?: string) => void
}

export default function Budget({ onNavigate }: Props) {
  const [activeTab, setActiveTab] = useState('lignes')
  const [search, setSearch] = useState('')
  const [xlsxToast, setXlsxToast] = useState(false)
  const [showModifModal, setShowModifModal] = useState(false)
  const [showFiltres, setShowFiltres] = useState(false)
  const [modifForm, setModifForm] = useState({ source: '', destination: '', montant: '', motif: '' })
  const b = BUDGET_SUMMARY

  const filtered = BUDGET_LINES.filter(l =>
    !search || l.code.includes(search) || l.libelle.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-6 space-y-5">
      {/* Toast XLSX */}
      {xlsxToast && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-[13px] font-semibold text-white" style={{ background: '#1A6B3A' }}>
          <Download size={15} /> Export XLSX en cours de préparation…
          <button onClick={() => setXlsxToast(false)} className="ml-2 opacity-70 hover:opacity-100"><X size={14} /></button>
        </div>
      )}

      <div className="flex items-start justify-between">
        <div>
          <h1 className="section-title text-2xl">Budget 2026</h1>
          <p className="text-sm text-gray-500 mt-0.5">Budget unique de l'exercice — Statut: Exécutoire</p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-outline btn-sm" onClick={() => { setXlsxToast(true); setTimeout(() => setXlsxToast(false), 3000) }}><Download size={13} /> Export XLSX</button>
          <button className="btn btn-navy btn-sm" onClick={() => setShowModifModal(true)}>Modification budgétaire</button>
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Budget initial', value: fmt(b.budgetInitial) + ' XAF', color: '#0B1C3E' },
          { label: 'Budget révisé (actuel)', value: fmt(b.budgetRevise) + ' XAF', color: '#1A6B3A' },
          { label: 'Budget PAP (Investissement)', value: fmt(b.budgetPAP) + ' XAF', color: '#2563EB', sub: '30.0% du budget révisé' },
          { label: 'Budget Hors PAP (Fonctionnement)', value: fmt(b.budgetHorsPAP) + ' XAF', color: '#7E22CE', sub: '70.0% du budget révisé' },
        ].map((k, i) => (
          <div key={i} className="kpi-card" style={{ borderLeft: `4px solid ${k.color}` }}>
            <div className="text-[10px] uppercase font-semibold tracking-wider text-gray-400">{k.label}</div>
            <div className="amount font-bold text-[16px] mt-1 leading-tight" style={{ color: k.color }}>{k.value}</div>
            {k.sub && <div className="text-[11px] text-gray-400 mt-0.5">{k.sub}</div>}
          </div>
        ))}
      </div>

      {/* Overall execution bar */}
      <div className="card p-5">
        <div className="text-[11px] uppercase font-semibold tracking-wider text-gray-400 mb-3">Exécution globale — {fmt(b.budgetRevise)} XAF</div>
        <div className="relative h-8 rounded-lg overflow-hidden" style={{ background: '#F1F5F9' }}>
          <div className="absolute left-0 top-0 h-full flex items-center" style={{ width: `${b.tauxPaiement}%`, background: '#1A6B3A' }}>
            <span className="text-[10px] text-white font-bold px-2">Payé {b.tauxPaiement}%</span>
          </div>
          <div className="absolute top-0 h-full flex items-center" style={{ left: `${b.tauxPaiement}%`, width: `${(b.ordonnance - b.paye) / b.budgetRevise * 100}%`, background: '#2B50A8' }}>
            <span className="text-[10px] text-white font-bold px-1">ORD</span>
          </div>
          <div className="absolute top-0 h-full flex items-center" style={{ left: `${b.ordonnance / b.budgetRevise * 100}%`, width: `${(b.liquide - b.ordonnance) / b.budgetRevise * 100}%`, background: '#4B72C8' }}>
            <span className="text-[10px] text-white font-bold px-1">LIQ</span>
          </div>
          <div className="absolute top-0 h-full flex items-center" style={{ left: `${b.liquide / b.budgetRevise * 100}%`, width: `${(b.engage - b.liquide) / b.budgetRevise * 100}%`, background: '#7EA0DC' }}>
            <span className="text-[10px] text-white font-bold px-1">ENG</span>
          </div>
        </div>
        <div className="flex items-center gap-6 mt-3">
          {[
            { color: '#1A6B3A', label: `Payé ${fmt(b.paye)} XAF` },
            { color: '#2B50A8', label: `Ordonnancé ${fmt(b.ordonnance)} XAF` },
            { color: '#4B72C8', label: `Liquidé ${fmt(b.liquide)} XAF` },
            { color: '#7EA0DC', label: `Engagé ${fmt(b.engage)} XAF` },
            { color: '#F1F5F9', label: `Disponible ${fmt(b.budgetRevise - b.engage)} XAF`, text: '#94A3B8' },
          ].map((leg, i) => (
            <div key={i} className="flex items-center gap-1.5 text-[11px]" style={{ color: leg.text ?? '#5C6B8C' }}>
              <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: leg.color, border: i === 4 ? '1px solid #CBD5E1' : 'none' }} />
              {leg.label}
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 gap-0 -mt-2">
        {[
          { id: 'lignes', label: 'Lignes budgétaires' },
          { id: 'chapitres', label: 'Par chapitre' },
          { id: 'modifications', label: 'Modifications budgétaires' },
          { id: 'sources', label: 'Par source de financement' },
        ].map(tab => (
          <button key={tab.id} className={`tab-item ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'lignes' && (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-xs">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input className="form-input pl-9 py-2 text-[13px]" placeholder="Code, libellé…" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <button className="btn btn-outline btn-sm" onClick={() => setShowFiltres(f => !f)} style={showFiltres ? { background: '#EDF2FB', borderColor: '#1B3269', color: '#1B3269' } : {}}><Filter size={13} /> Filtres{showFiltres ? ' ▲' : ''}</button>
          </div>

          {/* Panneau de filtres */}
          {showFiltres && (
            <div className="card p-4 grid grid-cols-5 gap-4 items-end">
              <div>
                <label className="form-label">Exercice</label>
                <select className="form-input text-[12.5px]">
                  <option>2026</option>
                  <option>2025</option>
                </select>
              </div>
              <div>
                <label className="form-label">Programme</label>
                <select className="form-input text-[12.5px]">
                  <option value="">Tous</option>
                  <option>PAP</option>
                  <option>Hors PAP</option>
                </select>
              </div>
              <div>
                <label className="form-label">Nature</label>
                <select className="form-input text-[12.5px]">
                  <option value="">Toutes</option>
                  <option>Personnel</option>
                  <option>Fonctionnement</option>
                  <option>Investissement</option>
                </select>
              </div>
              <div>
                <label className="form-label">Montant min (XAF)</label>
                <input type="number" className="form-input text-[12.5px]" placeholder="0" />
              </div>
              <div>
                <label className="form-label">Montant max (XAF)</label>
                <input type="number" className="form-input text-[12.5px]" placeholder="Illimité" />
              </div>
            </div>
          )}

          <div className="card overflow-hidden">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Libellé</th>
                  <th>Nature</th>
                  <th>Classif.</th>
                  <th className="text-right">Dotation initiale</th>
                  <th className="text-right">Dotation actuelle</th>
                  <th className="text-right">Engagé</th>
                  <th className="text-right">Liquidé</th>
                  <th className="text-right">Payé</th>
                  <th className="text-right">Disponible</th>
                  <th>Taux</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(line => (
                  <tr key={line.code}>
                    <td><span className="font-mono font-bold text-[12.5px] text-navy-900">{line.code}</span></td>
                    <td>
                      <div className="max-w-[240px]">
                        <div className="font-medium text-[13px] leading-snug">{line.libelle}</div>
                        <div className="text-[11px] text-gray-400 mt-0.5 truncate">{line.chapitre}</div>
                      </div>
                    </td>
                    <td className="text-[12px] text-gray-500">{line.nature}</td>
                    <td>
                      <span className="badge text-[10.5px] px-2 py-0.5"
                        style={line.isPAP ? { background: '#DCFCE7', color: '#166534' } : { background: '#F1F5F9', color: '#475569' }}>
                        {line.isPAP ? 'PAP' : 'Hors PAP'}
                      </span>
                    </td>
                    <td className="text-right font-mono text-[12.5px]">{fmt(line.dotationInitiale)}</td>
                    <td className="text-right font-mono text-[12.5px] font-semibold">{fmt(line.dotationActuelle)}</td>
                    <td className="text-right font-mono text-[12.5px]">{fmt(line.engage)}</td>
                    <td className="text-right font-mono text-[12.5px]">{fmt(line.liquide)}</td>
                    <td className="text-right font-mono text-[12.5px] font-semibold text-navy-900">{fmt(line.paye)}</td>
                    <td className="text-right font-mono text-[12.5px] font-bold text-green-700">{fmt(line.disponible)}</td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        <div className="w-14 progress-bar-track">
                          <div className="progress-bar-fill" style={{
                            width: `${Math.min((line.engage / line.dotationActuelle) * 100, 100)}%`,
                            background: (line.engage / line.dotationActuelle) > 0.9 ? '#DC2626' : '#1A6B3A',
                          }} />
                        </div>
                        <span className="font-mono text-[11px] font-semibold">
                          {((line.engage / line.dotationActuelle) * 100).toFixed(0)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'modifications' && (
        <div className="card">
          <div className="px-5 py-4 border-b border-gray-100 font-semibold text-[15px] text-gray-800">Journal des modifications budgétaires</div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Référence</th>
                <th>Type</th>
                <th>Date effet</th>
                <th>Ligne source</th>
                <th>Ligne destinataire</th>
                <th className="text-right">Montant</th>
                <th>Motif</th>
                <th>Décideur</th>
              </tr>
            </thead>
            <tbody>
              {[
                { ref: 'MOD-2026-001', type: 'Virement', date: '15/03/2026', source: '220201', dest: '310101', montant: 90_000_000, motif: 'Couverture acquisition matériel TIC', decideur: 'Président de la Commission' },
                { ref: 'MOD-2026-002', type: 'Annulation partielle', date: '01/06/2026', source: '410234', dest: '—', montant: 44_000_000, motif: 'Activité reportée en 2027', decideur: 'Président de la Commission' },
              ].map((m, i) => (
                <tr key={i}>
                  <td><span className="font-mono text-[12px] font-semibold text-navy-900">{m.ref}</span></td>
                  <td><span className="badge text-[10.5px] px-2 py-0.5" style={{ background: '#EDF2FB', color: '#1B3269' }}>{m.type}</span></td>
                  <td className="text-[12.5px]">{m.date}</td>
                  <td className="font-mono text-[12px]">{m.source}</td>
                  <td className="font-mono text-[12px]">{m.dest}</td>
                  <td className="text-right font-mono text-[13px] font-bold">{fmt(m.montant)} XAF</td>
                  <td className="text-[12.5px] text-gray-600 max-w-[200px]">{m.motif}</td>
                  <td className="text-[12px] text-gray-600">{m.decideur}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {(activeTab === 'chapitres' || activeTab === 'sources') && (
        <div className="card p-10 text-center text-gray-400">
          <div className="text-3xl mb-2">📊</div>
          <div className="text-[13px]">Vue "{activeTab}" — données disponibles, affichage en cours de chargement.</div>
        </div>
      )}

      {/* ── MODAL MODIFICATION BUDGÉTAIRE ── */}
      {showModifModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(11,28,62,0.6)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between" style={{ background: '#0B1C3E', borderRadius: '1rem 1rem 0 0' }}>
              <div className="flex items-center gap-2">
                <ArrowRight size={15} className="text-white" />
                <span className="font-bold text-white text-sm">Virement de crédits</span>
              </div>
              <button className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/10" onClick={() => setShowModifModal(false)}>
                <X size={14} className="text-white" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="p-3 rounded-xl text-[12px] text-blue-800" style={{ background: '#EFF6FF', border: '1px solid #BFDBFE' }}>
                Un virement de crédits transfère une dotation d'une ligne budgétaire vers une autre sans modifier le budget global.
              </div>
              <div>
                <label className="form-label">Ligne source (débit) *</label>
                <select className="form-input text-[13px]" value={modifForm.source} onChange={e => setModifForm(f => ({ ...f, source: e.target.value }))}>
                  <option value="">— Sélectionner une ligne —</option>
                  {BUDGET_LINES.map(l => (
                    <option key={l.code} value={l.code}>{l.code} — {l.libelle}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label">Ligne destination (crédit) *</label>
                <select className="form-input text-[13px]" value={modifForm.destination} onChange={e => setModifForm(f => ({ ...f, destination: e.target.value }))}>
                  <option value="">— Sélectionner une ligne —</option>
                  {BUDGET_LINES.map(l => (
                    <option key={l.code} value={l.code}>{l.code} — {l.libelle}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label">Montant à virer (XAF) *</label>
                <input type="number" className="form-input text-[13px] font-mono" placeholder="0" value={modifForm.montant} onChange={e => setModifForm(f => ({ ...f, montant: e.target.value }))} />
              </div>
              <div>
                <label className="form-label">Motif / Justification *</label>
                <textarea className="form-input text-[13px] h-20" placeholder="Justification de la modification budgétaire…" value={modifForm.motif} onChange={e => setModifForm(f => ({ ...f, motif: e.target.value }))} />
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <button className="btn btn-outline btn-sm" onClick={() => setShowModifModal(false)}>Annuler</button>
                <button
                  className="btn btn-sm"
                  style={{ background: '#0B1C3E', color: 'white', border: 'none' }}
                  disabled={!modifForm.source || !modifForm.destination || !modifForm.montant || !modifForm.motif}
                  onClick={() => { setShowModifModal(false); setModifForm({ source: '', destination: '', montant: '', motif: '' }) }}
                >
                  <ArrowRight size={13} /> Soumettre le virement
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
