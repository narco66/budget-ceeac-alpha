import { Clock, AlertTriangle, ChevronRight } from 'lucide-react'
import type { Page } from '../types'
import { MES_TACHES } from '../data/mock'
import { PriorityBadge } from '../components/StatusBadge'

const fmt = (n: number) =>
  n > 0 ? new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(n) + ' XAF' : '—'

interface Props {
  onNavigate: (page: Page, id?: string) => void
}

export default function MesTaches({ onNavigate }: Props) {
  const retards = MES_TACHES.filter(t => t.retard)

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="section-title text-2xl">Mes tâches</h1>
          <p className="text-sm text-gray-500 mt-0.5">En attente de votre action — triées par date décroissante</p>
        </div>
      </div>

      {retards.length > 0 && (
        <div className="alert-banner" style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}>
          <AlertTriangle size={15} className="text-red-500 flex-shrink-0" />
          <span className="text-[13px] text-red-800 font-medium">
            {retards.length} tâche{retards.length > 1 ? 's' : ''} en retard — Action requise immédiatement
          </span>
        </div>
      )}

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'En attente', value: MES_TACHES.length, color: '#0B1C3E' },
          { label: 'En retard', value: retards.length, color: '#DC2626' },
          { label: 'Urgentes', value: MES_TACHES.filter(t => t.priorite === 'URGENTE').length, color: '#D97706' },
          { label: 'Normales', value: MES_TACHES.filter(t => t.priorite === 'NORMALE').length, color: '#16A34A' },
        ].map((k, i) => (
          <div key={i} className="kpi-card py-3" style={{ borderLeft: `3px solid ${k.color}` }}>
            <div className="text-[10px] uppercase font-semibold tracking-wider text-gray-400">{k.label}</div>
            <div className="amount text-2xl font-bold mt-0.5" style={{ color: k.color }}>{k.value}</div>
          </div>
        ))}
      </div>

      <div className="card divide-y divide-gray-50">
        {MES_TACHES.map(t => (
          <div
            key={t.id}
            className="px-5 py-4 hover:bg-gray-50 cursor-pointer transition-colors group"
            onClick={() => {
              if (t.module === 'ENGAGEMENT') onNavigate('eng-detail', 'ENG-002')
              else if (t.module === 'EXPRESSION DE BESOIN') onNavigate('eb-detail', 'EB-001')
              else if (t.module === 'LIQUIDATION') onNavigate('liq-detail', 'LIQ-001')
              else if (t.module === 'ORDONNANCEMENT') onNavigate('ord-detail', 'ORD-002')
              else if (t.module === 'SUIVI-ÉVALUATION') onNavigate('se')
            }}
          >
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="badge text-[9px] px-2 py-0.5 font-bold" style={{ background: '#EDF2FB', color: '#1B3269' }}>
                    {t.module}
                  </span>
                  <span className="font-mono text-[12px] text-ceeac-700">{t.reference}</span>
                  {t.retard && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-red-600">
                      <Clock size={10} /> EN RETARD
                    </span>
                  )}
                </div>
                <div className="font-semibold text-[14px] text-gray-900 mb-1">{t.objet}</div>
                <div className="flex items-center gap-4">
                  <div className="text-[12px] text-gray-500">
                    <span className="font-semibold text-gray-700">Action attendue :</span>{' '}
                    {t.action}
                  </div>
                  {t.montant > 0 && (
                    <div className="font-mono text-[12px] text-gray-600">
                      {fmt(t.montant)}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="text-right">
                  <div className="text-[10px] uppercase font-semibold text-gray-400">Échéance</div>
                  <div className={`text-[13px] font-semibold font-mono ${t.retard ? 'text-red-600' : 'text-gray-700'}`}>
                    {t.echeance}
                  </div>
                </div>
                <PriorityBadge priority={t.priorite} />
                <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-600 transition-colors" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
