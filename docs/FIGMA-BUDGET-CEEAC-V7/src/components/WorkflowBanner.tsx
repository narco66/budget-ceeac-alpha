import { Clock, CheckCircle2, AlertTriangle, RotateCcw, XCircle, ArrowRight, User } from 'lucide-react'
import StatusBadge from './StatusBadge'

interface WFStep {
  label: string
  status: 'done' | 'current' | 'pending' | 'rejected' | 'returned'
  acteur?: string
  date?: string
}

interface Props {
  reference: string
  currentStatus: string
  derniereAction: string
  auteur: string
  dateAction: string
  etapeCourante: string
  acteurAttendu?: string
  delai?: string
  enRetard?: boolean
  steps: WFStep[]
}

const stepColor = {
  done: { bg: '#DCFCE7', border: '#16A34A', text: '#166534', icon: '✓' },
  current: { bg: '#FEF3C7', border: '#D97706', text: '#92400E', icon: '●' },
  pending: { bg: '#F1F5F9', border: '#CBD5E1', text: '#94A3B8', icon: '○' },
  rejected: { bg: '#FEE2E2', border: '#DC2626', text: '#991B1B', icon: '✕' },
  returned: { bg: '#FFEDD5', border: '#EA580C', text: '#9A3412', icon: '↩' },
}

export default function WorkflowBanner({
  reference,
  currentStatus,
  derniereAction,
  auteur,
  dateAction,
  etapeCourante,
  acteurAttendu,
  delai,
  enRetard,
  steps,
}: Props) {
  return (
    <div className="card mb-5">
      {/* Top strip */}
      <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Dossier</span>
          <span className="font-mono text-sm font-semibold text-navy-900">{reference}</span>
          <StatusBadge status={currentStatus} />
          {enRetard && (
            <span className="badge px-2 py-0.5 text-[10.5px]" style={{ background: '#FEE2E2', color: '#991B1B' }}>
              <Clock size={10} className="inline mr-1" />
              En retard
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <User size={12} />
          <span className="font-medium text-gray-600">{auteur}</span>
          <span>·</span>
          <span>{dateAction}</span>
        </div>
      </div>

      {/* Workflow steps */}
      <div className="px-5 py-4">
        <div className="flex items-center gap-1">
          {steps.map((step, i) => {
            const c = stepColor[step.status]
            const isLast = i === steps.length - 1
            return (
              <div key={i} className="flex items-center gap-1 flex-1">
                <div className="flex flex-col items-center gap-1 min-w-0">
                  <div
                    className="flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold border-2 flex-shrink-0"
                    style={{ background: c.bg, borderColor: c.border, color: c.text }}
                  >
                    {c.icon}
                  </div>
                  <div className="text-center" style={{ minWidth: '80px', maxWidth: '110px' }}>
                    <div className="text-[10.5px] font-semibold leading-tight" style={{ color: c.text }}>
                      {step.label}
                    </div>
                    {step.acteur && (
                      <div className="text-[9.5px] text-gray-400 leading-tight mt-0.5 truncate">{step.acteur}</div>
                    )}
                    {step.date && (
                      <div className="text-[9px] text-gray-400 mt-0.5">{step.date}</div>
                    )}
                  </div>
                </div>
                {!isLast && (
                  <div className="flex-1 flex items-center justify-center mb-4">
                    <ArrowRight size={12} className="text-gray-300 flex-shrink-0" />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Status bar */}
      <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 rounded-b-[10px] flex items-center gap-6">
        <div>
          <div className="text-[10px] uppercase font-semibold tracking-wider text-gray-400">Étape courante</div>
          <div className="text-sm font-semibold text-navy-900 mt-0.5">{etapeCourante}</div>
        </div>
        {acteurAttendu && (
          <>
            <div className="w-px h-8 bg-gray-200" />
            <div>
              <div className="text-[10px] uppercase font-semibold tracking-wider text-gray-400">Acteur attendu</div>
              <div className="text-sm font-semibold text-amber-700 mt-0.5">{acteurAttendu}</div>
            </div>
          </>
        )}
        {delai && (
          <>
            <div className="w-px h-8 bg-gray-200" />
            <div>
              <div className="text-[10px] uppercase font-semibold tracking-wider text-gray-400">Délai cible</div>
              <div className={`text-sm font-semibold mt-0.5 ${enRetard ? 'text-red-600' : 'text-gray-700'}`}>{delai}</div>
            </div>
          </>
        )}
        <div className="ml-auto">
          <div className="text-[10px] uppercase font-semibold tracking-wider text-gray-400">Dernière action</div>
          <div className="text-sm text-gray-600 mt-0.5">{derniereAction}</div>
        </div>
      </div>
    </div>
  )
}
