export type ApiSuccess<T> = {
  success: true
  message: string
  data: T
  meta: PaginationMeta | Record<string, never>
}

export type PaginationMeta = {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export type SessionUser = {
  id: string
  name: string
  email: string
  is_active: boolean
  mfa_enabled: boolean
  must_change_password: boolean
  roles?: { code: string; name: string }[]
  permissions?: string[]
}

export type OrganizationUnit = {
  id: string
  code: string
  name: string
  unit_type: string | null
  level: number
  parent_id: string | null
  is_active: boolean
}

export type FiscalYear = {
  id: string
  year: number
  label: string
  status: string
  status_label: string
  starts_on: string
  ends_on: string
  is_current: boolean
  note: string | null
  currency?: { code: string; name: string; minor_units: number }
  periods?: FiscalPeriod[]
}

export type FiscalPeriod = {
  id: string
  position: number
  code: string
  label: string
  starts_on: string
  ends_on: string
  status: string
  status_label: string
}

export type WorkflowStep = {
  id: string
  code: string
  label: string
  position: number
  actor_kind: string
  actor_role_code: string | null
  sla_hours: number | null
}

export type WorkflowDefinition = {
  id: string
  code: string
  version: number
  label: string
  domain: string
  variant: string | null
  status: string
  effective_on: string
  note: string | null
  steps?: WorkflowStep[]
}

export type SystemParameter = {
  id: string
  code: string
  version: number
  amount_xaf: string | null
  text_value: string | null
  status: string
  effective_on: string
  note: string | null
}

export type NumberSequence = {
  id: string
  domain: string
  last_value: number
  next_reference: string | null
}

export type NomenclatureVersion = {
  id: string
  code: string
  label: string
  status: string
  note: string | null
  items_count?: number
}

export type AuditEvent = {
  id: string
  action: string
  actor_id: string | null
  subject_type: string | null
  subject_id: string | null
  reason: string | null
  ip_address: string | null
  created_at: string | null
}
