import { Link } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { useEffect } from "react"
import { toast } from "react-toastify"
import { useApi } from "../hooks/useApi"
import type { MatchDto, TournamentDto, ParticipantDto } from "../types.ts"

export function RecentActivity() {
  const { callApi } = useApi()

  const {
    data: matches = [],
    isLoading: matchesLoading,
    isError: matchesError,
    error: matchErrorData
  } = useQuery<MatchDto[]>({
    queryKey: ["matches", "recent"],
    queryFn: () => callApi('/matches'),
  })

  const {
    data: tournaments = [],
    isLoading: tournamentsLoading,
    isError: tournamentsError,
    error: tournamentsErrorData
  } = useQuery<TournamentDto[]>({
    queryKey: ["tournaments", "live"],
    queryFn: () => callApi('/tournaments'),
  })

  useEffect(() => {
    if (matchesError) toast.error(`Uplink Error: ${matchErrorData instanceof Error ? matchErrorData.message : 'Fetch failed'}`)
    if (tournamentsError) toast.error(`Archive Error: ${tournamentsErrorData instanceof Error ? tournamentsErrorData.message : 'Fetch failed'}`)
  }, [matchesError, tournamentsError, matchErrorData, tournamentsErrorData])

  const renderCompetitor = (p: ParticipantDto | null, isWinner: boolean) => {
    if (!p) return <span className="text-gray-700 italic font-black text-[10px] uppercase">TBD</span>

    return (
      <div className="flex items-center gap-2 min-w-0">
        <div className={`w-6 h-6 shrink-0 bg-gray-900 border border-gray-800 overflow-hidden flex items-center justify-center ${p.isTeam ? 'rounded-md' : 'rounded-full'}`}>
          {p.avatar ? (
            <img src={p.avatar} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
          ) : (
            <span className="text-[8px] font-black text-gray-600">{p.name.charAt(0)}</span>
          )}
        </div>
        <span className={`truncate text-xs font-black uppercase tracking-tighter ${isWinner ? 'text-pink-500' : 'text-white'}`}>
          {p.name}
        </span>
      </div>
    )
  }

  if (matchesLoading || tournamentsLoading) {
    return (
      <div className="container mx-auto p-8 mt-10 text-center">
        <span className="text-pink-500 font-black animate-pulse tracking-[0.4em] uppercase">
          Synchronizing with Vice Versa Cloud...
        </span>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-8 grid grid-cols-1 lg:grid-cols-2 gap-12 mt-10">

      <section className="space-y-6">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-black uppercase tracking-widest text-white">Recent Arena Activity</h2>
          <div className="h-[1px] flex-grow bg-gradient-to-r from-pink-500/50 to-transparent"></div>
        </div>

        <div className="space-y-3">
          {matches.length === 0 ? (
            <div className="bg-[#0f1115] border border-gray-800 p-8 rounded-2xl text-center">
              <p className="text-gray-600 font-black uppercase text-[10px] tracking-widest">No match logs detected in current sector</p>
            </div>
          ) : (
            matches.map((match) => (
              <div key={match.id} className="bg-[#0f1115] border border-gray-800 p-4 rounded-xl flex items-center justify-between hover:border-pink-500/30 transition-all group shadow-xl">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="flex-1 min-w-0 text-right">
                    {renderCompetitor(match.player1, match.winnerId === match.player1?.id)}
                  </div>
                  <span className="text-[9px] font-black text-gray-700 italic px-2">VS</span>
                  <div className="flex-1 min-w-0">
                    {renderCompetitor(match.player2, match.winnerId === match.player2?.id)}
                  </div>
                </div>

                <div className="flex items-center gap-4 ml-6">
                  <div className="bg-black/40 px-3 py-1.5 rounded-lg border border-gray-800 font-mono text-xs font-black text-pink-500 shadow-inner">
                    {match.score.p1} : {match.score.p2}
                  </div>
                  <Link
                    to="/match/$matchId"
                    params={{ matchId: match.id }}
                    className="bg-gray-800 hover:bg-pink-600 text-white p-2 rounded-lg transition-all group-hover:shadow-[0_0_15px_rgba(219,39,119,0.3)]"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-black uppercase tracking-widest text-white">Live Operations</h2>
          <div className="h-[1px] flex-grow bg-gradient-to-r from-blue-500/50 to-transparent"></div>
        </div>

        <div className="space-y-3">
          {tournaments.length === 0 ? (
            <div className="bg-[#0f1115] border border-gray-800 p-8 rounded-2xl text-center">
              <p className="text-gray-600 font-black uppercase text-[10px] tracking-widest">No active brackets found</p>
            </div>
          ) : (
            tournaments.map((t) => (
              <div key={t.id} className="bg-[#0f1115] border border-gray-800 p-5 rounded-2xl flex items-center justify-between hover:border-blue-500/30 transition-all shadow-xl relative overflow-hidden group">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600/20 group-hover:bg-blue-500 transition-colors"></div>
                <div className="flex flex-col">
                  <span className="font-black text-white text-lg tracking-tighter uppercase leading-none mb-1">{t.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
                    <span className="text-[9px] text-pink-500 font-black tracking-[0.2em] uppercase">{t.game}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-end">
                    <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest mb-1">Status</span>
                    <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-1 rounded-md text-[9px] font-black uppercase">
                      {t.status}
                    </span>
                  </div>
                  <Link
                    to="/tournament/$tournamentId"
                    params={{ tournamentId: t.id }}
                    className="bg-gray-800 hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-gray-700"
                  >
                    Enter Bracket
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  )
}