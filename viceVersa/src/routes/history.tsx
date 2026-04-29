import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useAuth0 } from '@auth0/auth0-react'
import { TournamentHistory } from "../components/TournamentHistory"
import { useApi } from '../hooks/useApi'
import type { HistorySearch, TournamentDto } from '../types'

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
  const { callApi } = useApi()
  const { user, isAuthenticated } = useAuth0()

  const { data: tournaments = [], isLoading } = useQuery<TournamentDto[]>({
    queryKey: ['tournaments', 'history'],
    queryFn: () => callApi('/tournaments'),
  })


  const displayedTournaments = activeFilter === 'myTournaments' && isAuthenticated
    ? tournaments.filter(t => t.winnerId === user?.sub)
    : tournaments;

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-10">

        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#1a1d24] pb-8 gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tighter uppercase">Archives</h1>
            <p className="text-gray-500 font-bold text-[10px] uppercase tracking-[0.3em] mt-1">
              Historical Bracket Data & Victory Logs
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex bg-[#1a1d24] p-1 rounded-xl border border-gray-800 shadow-lg">
              <Link
                to="/history"
                search={{ filter: 'all' }}
                className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeFilter !== 'myTournaments'
                    ? 'bg-pink-600 text-white shadow-lg'
                    : 'text-gray-500 hover:text-white'
                }`}
              >
                Global Index
              </Link>
              <Link
                to="/history"
                search={{ filter: 'myTournaments' }}
                className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeFilter === 'myTournaments'
                    ? 'bg-yellow-600 text-white shadow-[0_0_15px_rgba(202,138,4,0.4)]'
                    : 'text-gray-500 hover:text-white'
                }`}
              >
                Personal Trophies
              </Link>
            </div>

            <Link
              to="/"
              className="hidden sm:block text-[10px] font-black uppercase tracking-widest bg-[#0f1115] hover:bg-[#1a1d24] border border-[#1a1d24] px-6 py-3 rounded-xl transition-all"
            >
              Return to Core
            </Link>
          </div>
        </div>

        <TournamentHistory
          tournaments={displayedTournaments}
          isLoading={isLoading}
        />

      </div>
    </div>
  )
}