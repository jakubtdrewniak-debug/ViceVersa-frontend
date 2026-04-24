import { createFileRoute, Link } from '@tanstack/react-router'
import { TournamentHistory } from "../components/TournamentHistory"
import { MOCK_HISTORY, MOCK_SOLOS } from "../lib/mockData"
import type {HistorySearch, Participant} from '../types'


export const Route = createFileRoute('/history')({
  component: TournamentHistoryRoute,
  validateSearch: (search: Record<string, unknown>): HistorySearch => {
    return { filter: search.filter === 'myTournaments' ? 'myTournaments' : 'all' }
  }
})

// eslint-disable-next-line react-refresh/only-export-components
function TournamentHistoryRoute() {
  const { filter } = Route.useSearch()
  const activeFilter = filter || 'all'

  const MY_MOCK_ID = MOCK_SOLOS[0].id

  const didIWin = (participant: Participant | null | undefined, userId: string): boolean => {
    if (!participant) return false;
    if (participant.isTeam) {
      return participant.members.some((member) => member.id === userId);
    }
    return participant.id === userId;
  }

  const displayedTournaments = activeFilter === 'myTournaments'
    ? MOCK_HISTORY.filter(t => didIWin(t.winner, MY_MOCK_ID))
    : MOCK_HISTORY;

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">

        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#1a1d24] pb-6 gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight">Tournament History</h1>
            <p className="text-gray-400 mt-1">Review past brackets and results</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex bg-[#1a1d24] p-1 rounded-lg border border-gray-800">
              <Link
                to="/history"
                search={{ filter: 'all' }}
                className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activeFilter !== 'myTournaments' ? 'bg-pink-600 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                All History
              </Link>
              <Link
                to="/history"
                search={{ filter: 'myTournaments' }}
                className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activeFilter === 'myTournaments' ? 'bg-yellow-600 text-white shadow-[0_0_10px_rgba(202,138,4,0.3)]' : 'text-gray-400 hover:text-white'}`}
              >
                My Trophies
              </Link>
            </div>

            <Link
              to="/"
              className="text-gray-400 hover:text-white bg-[#0f1115] hover:bg-[#1a1d24] border border-[#1a1d24] px-5 py-2.5 rounded-lg font-bold transition-all hidden sm:block">
              Back to active
            </Link>
          </div>
        </div>

        <TournamentHistory tournaments={displayedTournaments} />

      </div>
    </div>
  )
}