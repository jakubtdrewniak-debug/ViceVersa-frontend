import { createFileRoute, Link } from '@tanstack/react-router'
import { TournamentView } from '../../components/TournamentView'

export const Route = createFileRoute('/tournament/$tournamentId')({
  component: TournamentDetailRoute,
})

// eslint-disable-next-line react-refresh/only-export-components
function TournamentDetailRoute() {
  const { tournamentId } = Route.useParams()

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">

        <Link
          to="/"
          className="text-pink-500 hover:text-pink-400 font-bold text-sm tracking-widest uppercase inline-block mb-4 transition-colors"
        >
          ← Back to Dashboard
        </Link>

        <TournamentView tournamentId={tournamentId} />

      </div>
    </div>
  )
}