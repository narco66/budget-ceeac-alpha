export type Dashboard = {
  as_of: string
  scope: { mode: 'institution' | 'structures' | 'none'; unit_count: number | null }
  exercise: { year: number | null; status: string | null }
  budget: {
    has_executable: boolean
    revised_xaf: string
    reserved_xaf: string
    committed_xaf: string
    liquidated_xaf: string
    ordered_xaf: string
    paid_xaf: string
    available_xaf: string
    execution_percent: string | null
  }
  remainders: {
    to_liquidate_xaf: string
    to_order_xaf: string
    to_pay_xaf: string
  }
  segments: {
    code: string
    label: string
    revised_xaf: string
    paid_xaf: string
    execution_percent: string | null
  }[]
  structures: {
    name: string
    revised_xaf: string
    paid_xaf: string
    execution_percent: string | null
  }[]
  alerts: { kind: string; line_code: string; label: string }[]
  waiting: {
    open_tasks: number
    oldest_age_days: number | null
    by_role: { role_code: string; count: number }[]
  }
  pipeline: {
    need_requests: number
    commitments: number
    liquidations: number
    payment_orders: number
    payments: number
    returned: number
    rejected: number
  }
  physical: null
  formulas: Record<string, string>
}

export const SCOPE_LABEL: Record<Dashboard['scope']['mode'], string> = {
  institution: 'Périmètre : ensemble de la Commission, selon vos fonctions transversales.',
  structures: 'Périmètre : vos structures et les unités qui en dépendent.',
  none: 'Aucune structure n’est affectée à vos fonctions. Le tableau ne reprend pas l’ensemble de la Commission.',
}
