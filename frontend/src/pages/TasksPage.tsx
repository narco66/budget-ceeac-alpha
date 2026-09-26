import { useQuery } from '@tanstack/react-query'
import { api, ApiError } from '../api/client'
import type { ApiSuccess } from '../api/types'
import { EmptyState, ErrorState, ForbiddenState, LoadingState } from '../components/States'

type Task = {
  id: string
  title: string
  assignee_role_code: string
  reference: string | null
  created_at: string | null
}

type Notice = {
  id: string
  title: string
  read_at: string | null
}

export function TasksPage() {
  const query = useQuery({
    queryKey: ['tasks'],
    retry: false,
    queryFn: () => api<ApiSuccess<Task[]>>('/api/v1/tasks'),
  })
  const notices = useQuery({
    queryKey: ['notifications'],
    retry: false,
    queryFn: () => api<ApiSuccess<Notice[]>>('/api/v1/notifications'),
  })

  return (
    <div className="space-y-4">
      <h1 className="font-serif text-3xl text-navy-900">Mes tâches</h1>
      {query.isLoading && <LoadingState label="Chargement de la corbeille…" />}
      {query.error instanceof ApiError && query.error.status === 403 && <ForbiddenState />}
      {query.error instanceof ApiError && query.error.status !== 403 && (
        <ErrorState message={query.error.message} onRetry={() => void query.refetch()} />
      )}
      {query.data && query.data.data.length === 0 && (
        <EmptyState
          title="Aucune tâche affectée"
          description="La corbeille reçoit les étapes ouvertes du circuit, de la plus récente à la plus ancienne. Aucun dossier n’est en circulation."
        />
      )}
      {query.data && query.data.data.length > 0 && (
        <ul className="space-y-2">
          {query.data.data.map((task) => (
            <li key={task.id} className="rounded-xl bg-white px-4 py-3 shadow-sm">
              <p className="font-medium text-navy-900">{task.title}</p>
              <p className="text-xs text-slate-500">{task.assignee_role_code}</p>
            </li>
          ))}
        </ul>
      )}
      <h2 className="font-serif text-2xl text-navy-900">Notifications</h2>
      {notices.isLoading && <LoadingState label="Chargement des notifications…" />}
      {notices.data && notices.data.data.length === 0 && (
        <EmptyState
          title="Aucune notification"
          description="Une notification est créée lorsqu’une tâche s’ouvre pour l’une de vos fonctions. Aucun message n’est inventé."
        />
      )}
      {notices.data && notices.data.data.length > 0 && (
        <ul className="space-y-2">
          {notices.data.data.map((notice) => (
            <li key={notice.id} className="rounded-xl bg-white px-4 py-3 shadow-sm">
              <p className="font-medium text-navy-900">{notice.title}</p>
              <p className="text-xs text-slate-500">{notice.read_at ? 'Lue' : 'Non lue'}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
