import { readToken } from '../auth/token'

export class ApiError extends Error {
  status: number
  code: string
  errors: Record<string, string[]>

  constructor(message: string, status: number, code: string, errors: Record<string, string[]> = {}) {
    super(message)
    this.status = status
    this.code = code
    this.errors = errors
  }
}

type ErrorBody = {
  success?: boolean
  message?: string
  code?: string
  errors?: Record<string, string[]> | unknown[]
}

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers)
  headers.set('Accept', 'application/json')
  if (options.body) {
    headers.set('Content-Type', 'application/json')
  }
  const token = readToken()
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  let response: Response
  try {
    response = await fetch(path, { ...options, headers })
  } catch {
    throw new ApiError('La connexion au serveur a été perdue.', 0, 'NETWORK')
  }

  const payload = (await response.json().catch(() => null)) as ErrorBody | T | null

  if (!response.ok) {
    const body = (payload ?? {}) as ErrorBody
    const errors = body.errors && !Array.isArray(body.errors) ? body.errors : {}
    throw new ApiError(body.message ?? 'La requête a échoué.', response.status, body.code ?? 'HTTP_ERROR', errors)
  }

  return payload as T
}

export function can(user: { permissions?: string[] } | null, permission: string): boolean {
  return user?.permissions?.includes(permission) ?? false
}
