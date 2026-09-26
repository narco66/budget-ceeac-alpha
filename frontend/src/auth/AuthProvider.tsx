import { useQuery, useQueryClient } from '@tanstack/react-query'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { api, ApiError } from '../api/client'
import type { ApiSuccess, SessionUser } from '../api/types'
import { clearToken, readToken } from './token'

type AuthState = {
  user: SessionUser | null
  isLoading: boolean
  error: ApiError | null
  setSession: (user: SessionUser) => void
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const [token, setToken] = useState<string | null>(() => readToken())

  const profile = useQuery({
    queryKey: ['me'],
    enabled: token !== null,
    retry: false,
    queryFn: async () => {
      try {
        const response = await api<ApiSuccess<SessionUser>>('/api/v1/auth/me')
        return response.data
      } catch (error) {
        if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
          clearToken()
          setToken(null)
        }
        throw error
      }
    },
  })

  const value = useMemo<AuthState>(() => ({
    user: token === null ? null : (profile.data ?? null),
    isLoading: token !== null && profile.isLoading,
    error: profile.error instanceof ApiError ? profile.error : null,
    setSession: (user) => {
      setToken(readToken())
      queryClient.setQueryData(['me'], user)
    },
    logout: async () => {
      try {
        await api('/api/v1/auth/logout', { method: 'POST' })
      } finally {
        clearToken()
        setToken(null)
        queryClient.removeQueries({ queryKey: ['me'] })
      }
    },
  }), [token, profile.data, profile.error, profile.isLoading, queryClient])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthState {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth doit être utilisé dans AuthProvider.')
  }
  return context
}
