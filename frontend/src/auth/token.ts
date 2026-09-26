const KEY = 'gesbudep.token'

export function readToken(): string | null {
  return sessionStorage.getItem(KEY) ?? localStorage.getItem(KEY)
}

export function writeToken(token: string, remember: boolean): void {
  sessionStorage.removeItem(KEY)
  localStorage.removeItem(KEY)
  const store = remember ? localStorage : sessionStorage
  store.setItem(KEY, token)
}

export function clearToken(): void {
  sessionStorage.removeItem(KEY)
  localStorage.removeItem(KEY)
}
