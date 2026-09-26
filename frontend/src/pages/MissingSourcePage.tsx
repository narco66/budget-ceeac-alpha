import { EmptyState } from '../components/States'

export function MissingSourcePage({ title, description }: { title: string; description: string }) {
  return (
    <div className="space-y-4">
      <h1 className="font-serif text-3xl text-navy-900">{title}</h1>
      <EmptyState title="Source institutionnelle absente" description={description} />
    </div>
  )
}
