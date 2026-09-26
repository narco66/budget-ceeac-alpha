import { useQuery } from '@tanstack/react-query'
import { ChevronDown, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import logo from '../assets/logo-ceeac.jpg'
import { NAV, type NavItem } from '../app/navigation'
import { api, can } from '../api/client'
import type { ApiSuccess, FiscalYear, SessionUser } from '../api/types'

type Props = {
  user: SessionUser
  collapsed: boolean
  onToggle: () => void
}

function visible(item: NavItem, user: SessionUser): boolean {
  if (item.permission && !can(user, item.permission)) {
    return false
  }
  return true
}

export function Sidebar({ user, collapsed, onToggle }: Props) {
  const [open, setOpen] = useState<string | null>('/app/depenses')

  return (
    <aside
      className="flex h-full shrink-0 flex-col bg-navy-900 text-white transition-[width]"
      style={{ width: collapsed ? 72 : 260 }}
    >
      <div className="flex items-center gap-3 border-b border-white/10 px-3 py-4">
        <img src={logo} alt="Logo de la CEEAC" className="h-9 w-9 rounded-full bg-white object-cover" />
        {!collapsed && (
          <div className="min-w-0">
            <div className="text-[11px] font-bold tracking-wide">BUDGET-CEEAC</div>
            <div className="text-[10px] text-white/50">Commission de la CEEAC</div>
          </div>
        )}
        <button
          type="button"
          className="ml-auto rounded-md p-1 text-white/50 hover:bg-white/10 hover:text-white"
          onClick={onToggle}
          aria-label={collapsed ? 'Déplier le menu' : 'Replier le menu'}
        >
          {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
        </button>
      </div>
      {!collapsed && can(user, 'referentials.view') && <ExerciseBadge />}
      <nav className="flex-1 overflow-y-auto px-2 pb-4" aria-label="Navigation principale">
        {NAV.map((section) => {
          const items = section.items.filter((item) => visible(item, user))
          if (items.length === 0) return null
          return (
            <div key={section.category}>
              {!collapsed && (
                <div className="px-2 pt-3 pb-1 text-[9px] font-bold tracking-widest text-white/35 uppercase">
                  {section.category}
                </div>
              )}
              {items.map((item) => {
                const Icon = item.icon
                if (item.children) {
                  const children = item.children.filter((child) => !child.permission || can(user, child.permission))
                  if (children.length === 0) return null
                  const expanded = open === item.to
                  return (
                    <div key={item.to}>
                      <button
                        type="button"
                        className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-[13px] text-white/80 hover:bg-white/10"
                        aria-expanded={expanded}
                        onClick={() => setOpen(expanded ? null : item.to)}
                      >
                        {Icon && <Icon size={15} aria-hidden />}
                        {!collapsed && <span className="flex-1">{item.label}</span>}
                        {!collapsed && <ChevronDown size={14} className={expanded ? 'rotate-180' : ''} />}
                      </button>
                      {expanded && !collapsed && (
                        <div className="ml-6 border-l border-white/10 pl-2">
                          {children.map((child) => (
                            <NavLink
                              key={child.to}
                              to={child.to}
                              className={({ isActive }) =>
                                `block rounded-md px-2 py-1.5 text-[12px] ${isActive ? 'bg-ceeac-700 text-white' : 'text-white/70 hover:bg-white/10'}`
                              }
                            >
                              {child.label}
                            </NavLink>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                }
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    title={collapsed ? item.label : undefined}
                    className={({ isActive }) =>
                      `flex items-center gap-2 rounded-md px-2 py-2 text-[13px] ${isActive ? 'bg-ceeac-700 text-white' : 'text-white/75 hover:bg-white/10'}`
                    }
                  >
                    {Icon && <Icon size={15} aria-hidden />}
                    {!collapsed && item.label}
                  </NavLink>
                )
              })}
            </div>
          )
        })}
      </nav>
    </aside>
  )
}

function ExerciseBadge() {
  const query = useQuery({
    queryKey: ['fiscal-years'],
    retry: false,
    queryFn: () => api<ApiSuccess<FiscalYear[]>>('/api/v1/fiscal-years'),
  })
  const current = query.data?.data.find((year) => year.is_current)
  if (!current) {
    return null
  }

  return (
    <div className="mx-3 my-3 rounded-lg border border-ceeac-700/40 bg-ceeac-700/25 px-3 py-1.5 text-[11px] font-semibold text-green-200">
      Exercice {current.year} — {current.status_label}
    </div>
  )
}
