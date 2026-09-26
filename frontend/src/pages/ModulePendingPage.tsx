import { useParams } from 'react-router-dom'
import { MODULE_TITLES } from '../app/navigation'
import { EmptyState } from '../components/States'

export function ModulePendingPage() {
  const { moduleId = '' } = useParams()
  const title = MODULE_TITLES[moduleId] ?? 'Module'
  return (
    <div className="space-y-4">
      <h1 className="font-serif text-3xl text-navy-900">{title}</h1>
      <EmptyState
        title="Module non encore ouvert"
        description="L’écran est prévu dans la maquette. Il sera branché lorsque le service métier, les habilitations et les tests correspondants seront en place. Aucune donnée fictive n’est affichée."
      />
    </div>
  )
}
