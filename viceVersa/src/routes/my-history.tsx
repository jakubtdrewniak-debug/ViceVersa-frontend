import { createFileRoute, Link } from '@tanstack/react-router'
import { useAuth0 } from '@auth0/auth0-react'
import { useQuery } from '@tanstack/react-query'
import { useApi } from '../hooks/useApi'
import type { MatchDto, ParticipantDto } from "../types.ts"

export const Route = createFileRoute('/my-history')({
  component: MyHistoryRoute,
})

// eslint-disable-next-line react-refresh/only-export-components
function MyHistoryRoute() {
  const { user } = useAuth0()
  const { callApi } = useApi()

  const { data: myMatches = [], isLoading } = useQuery<MatchDto[]>({
    queryKey: ['my-history', user?.sub],
    queryFn: () => callApi(`/matches/history/${user?.sub}`),
    enabled: !!user?.sub
  })

  const isUserInvolved = (p: ParticipantDto | null): boolean => {
    if (!p) return false
    if (p.isTeam) return p.members?.some(m => m.id === user?.sub) || false
    return p.id === user?.sub
  }

  const stats = myMatches.reduce((acc, m) => {
    if (m.status !== 'COMPLETED') return acc
    if (!m.winnerId) acc.draws++
    else if (isUserInvolved(m.player1?.id === m.winnerId ? m.player1 : m.player2)) acc.wins++
    else acc.losses++
    return acc
  }, { wins: 0, losses: 0, draws: 0 })

  if (isLoading) return <div className="p-20 text-center font-black text-pink-500 animate-pulse">RECONSTRUCTING LOGS...</div>

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-10">

        <header className="flex items-center gap-6">
          <img src={user?.picture} className="w-16 h-16 rounded-xl border-2 border-pink-500 shadow-[0_0_15px_rgba(219,39,119,0.3)]" alt="Profile" />
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter">{user?.name}</h1>
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Combat Efficiency Rating</p>
          </div>
        </header>

        <div className="grid grid-cols-3 gap-6">
          {Object.entries(stats).map(([label, value]) => (
            <div key={label} className="bg-[#0f1115] p-6 rounded-2xl border border-gray-800 text-center">
              <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1">{label}</p>
              <p className={`text-4xl font-black ${label === 'wins' ? 'text-green-500' : label === 'losses' ? 'text-red-500' : 'text-gray-400'}`}>
                {value}
              </p>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          {myMatches.map((match) => {
            const win = match.winnerId && isUserInvolved(match.player1?.id === match.winnerId ? match.player1 : match.player2)
            const draw = match.status === 'COMPLETED' && !match.winnerId

            return (
              <Link
                key={match.id}
                to="/match/$matchId"
                params={{ matchId: match.id }}
                className="block bg-[#0f1115] border border-gray-800 rounded-2xl overflow-hidden hover:border-pink-500/50 transition-all group"
              >
                <div className="flex items-center p-5 gap-6">
                  <div className={`w-1.5 self-stretch rounded-full ${win ? 'bg-green-500' : draw ? 'bg-gray-600' : match.status === 'COMPLETED' ? 'bg-red-500' : 'bg-blue-500'}`} />

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-[9px] font-black text-pink-500 uppercase tracking-widest">
                        {match.tournamentId ? 'Tournament' : 'Exhibition'}
                      </span>
                      <span className="text-gray-500 text-[9px] font-black uppercase">{match.date}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`font-black uppercase text-sm ${match.winnerId === match.player1?.id ? 'text-white' : 'text-gray-500'}`}>
                        {match.player1?.name || 'TBD'}
                      </span>
                      <span className="text-gray-800 font-black italic text-xs">VS</span>
                      <span className={`font-black uppercase text-sm ${match.winnerId === match.player2?.id ? 'text-white' : 'text-gray-500'}`}>
                        {match.player2?.name || 'TBD'}
                      </span>
                    </div>
                  </div>

                  <div className="bg-[#1a1d24] px-4 py-2 rounded-xl border border-gray-800">
                    <div className="text-lg font-black tracking-tighter">
                      <span className={match.winnerId === match.player1?.id ? 'text-green-500' : 'text-white'}>{match.score.p1}</span>
                      <span className="mx-2 text-gray-800">-</span>
                      <span className={match.winnerId === match.player2?.id ? 'text-green-500' : 'text-white'}>{match.score.p2}</span>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}