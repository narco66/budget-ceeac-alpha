import { AlertTriangle, Ban, Inbox, LoaderCircle } from 'lucide-react'

export function LoadingState({ label = 'Chargement…' }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-white px-4 py-6 text-sm text-slate-600" role="status">
      <LoaderCircle className="animate-spin text-navy-900" size={18} aria-hidden />
      {label}
    </div>
  )
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
      <Inbox className="mx-auto mb-3 text-slate-400" size={28} aria-hidden />
      <h2 className="text-base font-semibold text-navy-900">{title}</h2>
      <p className="mx-auto mt-2 max-w-lg text-sm text-slate-600">{description}</p>
    </div>
  )
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-4" role="alert">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 text-red-700" size={18} aria-hidden />
        <div>
          <p className="text-sm font-medium text-red-900">{message}</p>
          {onRetry && (
            <button type="button" className="mt-2 text-sm font-semibold text-navy-900 underline" onClick={onRetry}>
              Réessayer
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export function ForbiddenState() {
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 px-6 py-8" role="alert">
      <Ban className="mb-3 text-amber-700" size={24} aria-hidden />
      <h2 className="text-lg font-semibold text-navy-900">Accès interdit</h2>
      <p className="mt-2 max-w-xl text-sm text-slate-700">
        Votre habilitation ne couvre pas cette action. Le masquage d’un menu ne constitue pas une autorisation : le serveur a refusé la demande.
      </p>
    </div>
  )
}
