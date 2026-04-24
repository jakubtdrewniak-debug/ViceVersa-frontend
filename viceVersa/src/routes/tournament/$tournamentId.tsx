/* eslint-disable react-refresh/only-export-components */
import { createFileRoute, Link } from '@tanstack/react-router'
import { TournamentView } from '../../components/TournamentView'
import { MOCK_LIVE_TOURNAMENT, MOCK_UPCOMING_TOURNAMENT } from '../../lib/mockData'

export const Route = createFileRoute('/tournament/$tournamentId')({
  component: TournamentDetailRoute,
})

function TournamentDetailRoute() {
  const { tournamentId } = Route.useParams()

  const data = tournamentId === MOCK_LIVE_TOURNAMENT.id
    ? MOCK_LIVE_TOURNAMENT
    : MOCK_UPCOMING_TOURNAMENT

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">

        <Link
          to="/"
          className="text-pink-500 hover:text-pink-400 font-bold text-sm tracking-widest uppercase inline-block mb-4"
        >
          ← Back to Dashboard
        </Link>

        <TournamentView tournament={data} />

      </div>
    </div>
  )
}