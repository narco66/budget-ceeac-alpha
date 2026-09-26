import { LogOut } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { SessionUser } from '../api/types'

function initials(name: string): string {
  return name.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase() ?? '').join('')
}

export function TopBar({ user, onLogout }: { user: SessionUser; onLogout: () => void }) {
  const role = user.roles?.[0]?.name ?? 'Utilisateur'
  return (
    <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4">
      <div>
        <p className="text-xs text-slate-500">GESBUDEP</p>
        <p className="text-sm font-semibold text-navy-900">Espace de travail</p>
      </div>
      <div className="flex items-center gap-3">
        <Link to="/app" className="hidden text-sm text-navy-500 sm:inline">
          {role}
        </Link>
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy-900 text-xs font-bold text-white" aria-hidden>
            {initials(user.name)}
          </span>
          <span className="text-sm">
            <span className="block font-medium text-navy-900">{user.name}</span>
            <span className="block text-xs text-slate-500">{user.email}</span>
          </span>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm text-slate-600 hover:bg-slate-100"
        >
          <LogOut size={16} aria-hidden />
          Quitter
        </button>
      </div>
    </header>
  )
}
