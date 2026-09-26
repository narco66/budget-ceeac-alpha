import { useState } from 'react'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid,
} from 'recharts'
import {
  TrendingUp, TrendingDown, AlertTriangle, Clock, CheckCircle,
  ArrowRight, Activity, Zap, Target, ChevronRight,
} from 'lucide-react'
import type { Page } from '../types'
import {
  BUDGET_SUMMARY, MONTHLY_EXECUTION, PILIER_PERFORMANCE,
  SOURCE_FINANCEMENT, MES_TACHES, ALERTES,
} from '../data/mock'
import StatusBadge, { PriorityBadge } from '../components/StatusBadge'

const fmt = (n: number) =>
  n >= 1e9
    ? (n / 1e9).toFixed(1) + ' Mrd'
    : n >= 1e6
    ? (n / 1e6).toFixed(0) + ' M'
    : n.toLocaleString('fr-FR')

const fmtFull = (n: number) =>
  new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(n) + ' XAF'

interface KPI {
  label: string
  value: string
  sub?: string
  color: string
  bg: string
  trend?: 'up' | 'down' | 'flat'
  pct?: string
}

const PIE_COLORS = ['#1A6B3A', '#0B1C3E', '#D4A017', '#EA580C', '#7C3AED']

interface Props {
  onNavigate: (page: Page, id?: string) => void
}

export default function Dashboard({ onNavigate }: Props) {
  const b = BUDGET_SUMMARY
  const [activeTab, setActiveTab] = useState<'financier' | 'physique'>('financier')

  const kpis: KPI[] = [
    {
      label: 'Budget révisé',
      value: fmt(b.budgetRevise),
      sub: 'XAF — Exercice 2026',
      color: '#0B1C3E',
      bg: '#EDF2FB',
    },
    {
      label: 'Crédits engagés',
      value: fmt(b.engage),
      sub: `${b.tauxExecution}% du budget révisé`,
      color: '#1A6B3A',
      bg: '#F0FDF6',
      trend: 'up',
      pct: '+4.2%',
    },
    {
      label: 'Crédits liquidés',
      value: fmt(b.liquide),
      sub: `${((b.liquide / b.budgetRevise) * 100).toFixed(1)}% du budget révisé`,
      color: '#1B3269',
      bg: '#EDF2FB',
    },
    {
      label: 'Crédits ordonnancés',
      value: fmt(b.ordonnance),
      sub: `${((b.ordonnance / b.budgetRevise) * 100).toFixed(1)}% du budget révisé`,
      color: '#7E22CE',
      bg: '#FDF4FF',
    },
    {
      label: 'Crédits payés',
      value: fmt(b.paye),
      sub: `${b.tauxPaiement}% du budget révisé`,
      color: '#166534',
      bg: '#DCFCE7',
      trend: 'up',
      pct: '+2.8%',
    },
    {
      label: 'Taux exécution',
      value: `${b.tauxExecution}%`,
      sub: 'Engagement / Budget révisé',
      color: b.tauxExecution >= 70 ? '#166534' : b.tauxExecution >= 50 ? '#92400E' : '#991B1B',
      bg: b.tauxExecution >= 70 ? '#DCFCE7' : b.tauxExecution >= 50 ? '#FEF3C7' : '#FEE2E2',
    },
    {
      label: 'Réalisation physique',
      value: `${b.tauxRealisationPhysique}%`,
      sub: 'Avancement moyen PAP',
      color: '#92400E',
      bg: '#FEF3C7',
      trend: 'down',
      pct: '-1.3%',
    },
    {
      label: 'Performance PAP',
      value: `${b.performancePAP}%`,
      sub: 'Score global de performance',
      color: '#991B1B',
      bg: '#FEE2E2',
    },
  ]

  const chartData = MONTHLY_EXECUTION.map(d => ({
    ...d,
    budgetLine: Math.floor(b.budgetRevise / 9 / 1e6),
  }))

  const pieData = [
    { name: 'Payé', value: Math.round((b.paye / b.budgetRevise) * 100) },
    { name: 'Ordonnancé (reste)', value: Math.round(((b.ordonnance - b.paye) / b.budgetRevise) * 100) },
    { name: 'Liquidé (reste)', value: Math.round(((b.liquide - b.ordonnance) / b.budgetRevise) * 100) },
    { name: 'Engagé (reste)', value: Math.round(((b.engage - b.liquide) / b.budgetRevise) * 100) },
    { name: 'Disponible', value: Math.round(((b.budgetRevise - b.engage) / b.budgetRevise) * 100) },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="section-title text-3xl">Tableau de bord exécutif</h1>
          <p className="text-sm text-gray-500 mt-1">Commission de la CEEAC — Budget 2026 — Situation au 8 septembre 2026</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-outline btn-sm" onClick={() => onNavigate('reporting')}>
            Exporter PDF
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => onNavigate('eb-form')}>
            + Nouvelle demande
          </button>
        </div>
      </div>

      {/* Alertes */}
      {ALERTES.map((a, i) => (
        <div
          key={i}
          className="alert-banner"
          style={{
            background: a.type === 'DANGER' ? '#FEF2F2' : a.type === 'WARNING' ? '#FFFBEB' : '#EFF6FF',
            border: `1px solid ${a.type === 'DANGER' ? '#FECACA' : a.type === 'WARNING' ? '#FDE68A' : '#BFDBFE'}`,
          }}
        >
          <AlertTriangle
            size={15}
            style={{ color: a.type === 'DANGER' ? '#DC2626' : a.type === 'WARNING' ? '#D97706' : '#2563EB', flexShrink: 0 }}
          />
          <span className="flex-1 text-[13px]" style={{ color: a.type === 'DANGER' ? '#991B1B' : a.type === 'WARNING' ? '#92400E' : '#1D4ED8' }}>
            {a.message}
          </span>
          <button
            className="text-[12px] font-semibold flex-shrink-0 hover:underline"
            style={{ color: a.type === 'DANGER' ? '#DC2626' : a.type === 'WARNING' ? '#D97706' : '#2563EB' }}
            onClick={() => onNavigate(a.page)}
          >
            {a.action} →
          </button>
        </div>
      ))}

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k, i) => (
          <div key={i} className="kpi-card" style={{ borderTop: `3px solid ${k.color}` }}>
            <div className="flex items-start justify-between">
              <div className="text-[11px] uppercase font-semibold tracking-wider text-gray-400">{k.label}</div>
              {k.trend && (
                <div className={`flex items-center gap-0.5 text-[11px] font-semibold ${k.trend === 'up' ? 'text-green-600' : 'text-red-500'}`}>
                  {k.trend === 'up' ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                  {k.pct}
                </div>
              )}
            </div>
            <div className="mt-2 amount text-2xl font-bold" style={{ color: k.color }}>
              {k.value}
            </div>
            <div className="text-[11.5px] text-gray-400 mt-1">{k.sub}</div>
            {/* Execution bar for certain KPIs */}
            {(i === 1 || i === 4 || i === 5) && (
              <div className="mt-2 progress-bar-track">
                <div
                  className="progress-bar-fill"
                  style={{
                    width: i === 1 ? `${b.tauxExecution}%` : i === 4 ? `${b.tauxPaiement}%` : `${b.tauxExecution}%`,
                    background: k.color,
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-3 gap-5">
        {/* Monthly execution area chart */}
        <div className="col-span-2 card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="font-semibold text-gray-800 text-[15px]">Exécution budgétaire mensuelle</div>
              <div className="text-[11.5px] text-gray-400 mt-0.5">Engagement, Liquidation, Paiement — en millions XAF</div>
            </div>
            <div className="flex gap-1">
              {['financier', 'physique'].map(t => (
                <button
                  key={t}
                  className={`tab-item ${activeTab === t ? 'active' : ''}`}
                  onClick={() => setActiveTab(t as any)}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="cEngage" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0B1C3E" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#0B1C3E" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="cLiquide" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1A6B3A" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#1A6B3A" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="cPaye" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D4A017" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#D4A017" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="mois" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} width={40} />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                formatter={(v: any) => [`${v} M XAF`]}
              />
              <Area type="monotone" dataKey="engage" name="Engagé" stroke="#0B1C3E" strokeWidth={2} fill="url(#cEngage)" />
              <Area type="monotone" dataKey="liquide" name="Liquidé" stroke="#1A6B3A" strokeWidth={2} fill="url(#cLiquide)" />
              <Area type="monotone" dataKey="paye" name="Payé" stroke="#D4A017" strokeWidth={2} fill="url(#cPaye)" />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div className="card p-5">
          <div className="font-semibold text-gray-800 text-[15px] mb-1">Ventilation du budget</div>
          <div className="text-[11.5px] text-gray-400 mb-4">En % du budget révisé</div>
          <ResponsiveContainer width="100%" height={170}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={75}
                dataKey="value"
                strokeWidth={0}
              >
                {pieData.map((_, index) => (
                  <Cell key={index} fill={PIE_COLORS[index]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E2E8F0' }}
                formatter={(v: any) => [`${v}%`]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {pieData.map((d, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: PIE_COLORS[i] }} />
                <span className="text-[11px] text-gray-600 flex-1 truncate">{d.name}</span>
                <span className="text-[11px] font-semibold text-gray-700 font-mono">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Piliers + Tasks */}
      <div className="grid grid-cols-3 gap-5">
        {/* Piliers performance */}
        <div className="col-span-2 card">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="font-semibold text-gray-800 text-[15px]">Performance par Pilier</div>
            <button className="text-[12px] text-ceeac-700 hover:underline" onClick={() => onNavigate('se')}>
              Voir S&E →
            </button>
          </div>
          <div className="p-5 space-y-4">
            {PILIER_PERFORMANCE.map(p => (
              <div key={p.id}>
                <div className="flex items-start justify-between mb-1.5">
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold text-gray-800 leading-snug">{p.libelle}</div>
                    <div className="flex items-center gap-4 mt-0.5">
                      <span className="text-[11px] text-gray-400">Budget: <span className="font-mono font-medium text-gray-600">{fmt(p.budget)} XAF</span></span>
                      <span className="text-[11px] text-gray-400">Payé: <span className="font-mono font-medium text-gray-600">{fmt(p.paye)} XAF</span></span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{
                        background: p.statut === 'VERT' ? '#16A34A' : p.statut === 'ORANGE' ? '#D97706' : '#DC2626',
                      }}
                    />
                    <span
                      className="text-[12px] font-bold"
                      style={{
                        color: p.statut === 'VERT' ? '#16A34A' : p.statut === 'ORANGE' ? '#D97706' : '#DC2626',
                      }}
                    >
                      {p.tauxPhysique}%
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-400 w-16 flex-shrink-0">Financier</span>
                      <div className="flex-1 progress-bar-track">
                        <div className="progress-bar-fill" style={{ width: `${p.tauxFinancier}%`, background: '#0B1C3E' }} />
                      </div>
                      <span className="text-[10px] font-semibold font-mono text-gray-600 w-8 text-right">{p.tauxFinancier}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-400 w-16 flex-shrink-0">Physique</span>
                      <div className="flex-1 progress-bar-track">
                        <div className="progress-bar-fill" style={{ width: `${p.tauxPhysique}%`, background: '#1A6B3A' }} />
                      </div>
                      <span className="text-[10px] font-semibold font-mono text-gray-600 w-8 text-right">{p.tauxPhysique}%</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mes tâches */}
        <div className="card">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="font-semibold text-gray-800 text-[15px]">Mes tâches</div>
              <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold flex items-center justify-center">
                {MES_TACHES.length}
              </span>
            </div>
            <button className="text-[12px] text-ceeac-700 hover:underline" onClick={() => onNavigate('mes-taches')}>
              Voir tout →
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {MES_TACHES.slice(0, 4).map(t => (
              <div
                key={t.id}
                className="px-5 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => {
                  if (t.module === 'ENGAGEMENT') onNavigate('eng-detail', 'ENG-002')
                  else if (t.module === 'EXPRESSION DE BESOIN') onNavigate('eb-detail', 'EB-001')
                  else if (t.module === 'LIQUIDATION') onNavigate('liq-detail', 'LIQ-001')
                  else if (t.module === 'ORDONNANCEMENT') onNavigate('ord-detail', 'ORD-002')
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                        style={{ background: '#EDF2FB', color: '#1B3269' }}>
                        {t.module}
                      </span>
                      {t.retard && (
                        <span className="text-[9px] font-bold text-red-500 flex items-center gap-0.5">
                          <Clock size={9} /> Retard
                        </span>
                      )}
                    </div>
                    <div className="text-[12px] font-semibold text-gray-800 leading-snug truncate">{t.objet}</div>
                    <div className="text-[11px] text-gray-400 mt-0.5">{t.reference} · {t.action}</div>
                  </div>
                  <PriorityBadge priority={t.priorite} />
                </div>
                {t.montant > 0 && (
                  <div className="text-[11px] font-mono font-medium text-gray-500 mt-1">
                    {fmtFull(t.montant)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sources de financement */}
      <div className="card">
        <div className="px-5 py-4 border-b border-gray-100">
          <div className="font-semibold text-gray-800 text-[15px]">Exécution par source de financement</div>
        </div>
        <div className="p-5">
          <table className="data-table">
            <thead>
              <tr>
                <th>Source de financement</th>
                <th className="text-right">Budget</th>
                <th className="text-right">Consommé</th>
                <th className="text-right">Taux</th>
                <th style={{ width: 200 }}>Progression</th>
              </tr>
            </thead>
            <tbody>
              {SOURCE_FINANCEMENT.map((s, i) => (
                <tr key={i}>
                  <td className="font-medium">{s.source}</td>
                  <td className="text-right font-mono text-[13px]">{fmt(s.budget)} XAF</td>
                  <td className="text-right font-mono text-[13px]">{fmt(s.consomme)} XAF</td>
                  <td className="text-right">
                    <span
                      className="font-bold font-mono text-[13px]"
                      style={{ color: s.taux >= 70 ? '#166534' : s.taux >= 50 ? '#92400E' : '#991B1B' }}
                    >
                      {s.taux}%
                    </span>
                  </td>
                  <td>
                    <div className="progress-bar-track">
                      <div
                        className="progress-bar-fill"
                        style={{
                          width: `${s.taux}%`,
                          background: s.taux >= 70 ? '#16A34A' : s.taux >= 50 ? '#D97706' : '#DC2626',
                        }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
