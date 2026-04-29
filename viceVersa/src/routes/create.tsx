import { createFileRoute } from '@tanstack/react-router'
import { CreateTournament } from '../components/CreateTournament'

export const Route = createFileRoute('/create')({
  component: CreateTournamentRoute,
})

// eslint-disable-next-line react-refresh/only-export-components
function CreateTournamentRoute() {
  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6">
      <CreateTournament />
    </div>
  )
}