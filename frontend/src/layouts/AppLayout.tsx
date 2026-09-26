import { useState } from 'react'
import { Navigate, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider'
import { LoadingState } from '../components/States'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'

export function AppLayout() {
  const { user, isLoading, logout } = useAuth()
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()

  if (isLoading) {
    return (
      <div className="p-8">
        <LoadingState label="Ouverture de la session…" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="flex h-full overflow-hidden">
      <Sidebar user={user} collapsed={collapsed} onToggle={() => setCollapsed((value) => !value)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar
          user={user}
          onLogout={() => {
            void logout().then(() => navigate('/'))
          }}
        />
        <main className="flex-1 overflow-auto bg-canvas p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
