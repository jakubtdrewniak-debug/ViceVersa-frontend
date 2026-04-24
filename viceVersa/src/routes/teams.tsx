import { createFileRoute } from '@tanstack/react-router'
import { TeamList } from '../components/TeamList'

type TeamSearch = {
  filter?: 'all' | 'myTeams'
}

export const Route = createFileRoute('/teams')({
  component: TeamsRoute,
  validateSearch: (search: Record<string, unknown>): TeamSearch => {
    return {
      filter: search.filter === 'myTeams' ? 'myTeams' : 'all',
    }
  }
})

// eslint-disable-next-line react-refresh/only-export-components
function TeamsRoute() {
  const { filter } = Route.useSearch()
  const activeFilter = filter || 'all'

  return (
    <div className="min-h-screen bg-[#050505] p-6 md:p-12 font-sans">
      <TeamList filter={activeFilter} />
    </div>
  )
}