import {createFileRoute, Link} from '@tanstack/react-router'
import {useAuth0} from '@auth0/auth0-react'
import {MOCK_MY_MATCHES} from '../lib/mockData'

export const Route = createFileRoute('/my-history')({
  component: MyHistoryRoute,
})

// eslint-disable-next-line react-refresh/only-export-components
function MyHistoryRoute() {
  const {isAuthenticated, isLoading} = useAuth0()

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading History...</div>

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold mb-2 text-white">Access Denied</h2>
        <p className="text-gray-400">Please log in to view your personal match history.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">

        <div>
          <h1 className="text-3xl font-black tracking-tight text-white">My Match History</h1>
          <p className="text-gray-400 mt-1">Review your past performances and results.</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-[#1a1d24] p-4 rounded-xl border border-gray-800 text-center">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Wins</p>
            <p className="text-2xl font-black text-green-500">1</p>
          </div>
          <div className="bg-[#1a1d24] p-4 rounded-xl border border-gray-800 text-center">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Losses</p>
            <p className="text-2xl font-black text-red-500">1</p>
          </div>
          <div className="bg-[#1a1d24] p-4 rounded-xl border border-gray-800 text-center">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Draws</p>
            <p className="text-2xl font-black text-gray-400">1</p>
          </div>
        </div>

        <div className="space-y-4">
          {MOCK_MY_MATCHES.map((match) => (
            <Link
              key={match.id}
              to="/match/$matchId"
              params={{matchId: match.id}}
              className="block bg-[#1a1d24] border border-gray-800 rounded-xl overflow-hidden hover:border-pink-500 transition-all group"
            >
              <div className="flex items-center p-4 gap-6">

                <div className={`w-2 self-stretch ${
                  match.result === 'win' ? 'bg-green-500 shadow-[4px_0_15px_rgba(34,197,94,0.3)]' :
                    match.result === 'loss' ? 'bg-red-500' : 'bg-gray-600'
                }`}/>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-pink-500 uppercase tracking-widest">
                      {match.tournamentName}
                    </span>
                    <span className="text-gray-600 text-xs">•</span>
                    <span className="text-xs text-gray-500">{match.date}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-lg text-white">{match.player1?.name}</span>
                    <span className="text-gray-600 font-black italic">VS</span>
                    <span className="font-bold text-lg text-white">{match.player2?.name}</span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 pr-4">
                  <div className="text-2xl font-black tracking-tighter">
                    <span className={match.result === 'win' ? 'text-green-500' : 'text-white'}>{match.score?.p1}</span>
                    <span className="mx-1 text-gray-700">-</span>
                    <span className={match.result === 'loss' ? 'text-red-500' : 'text-white'}>{match.score?.p2}</span>
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                    match.result === 'win' ? 'bg-green-500/10 text-green-500' :
                      match.result === 'loss' ? 'bg-red-500/10 text-red-500' : 'bg-gray-500/10 text-gray-400'
                  }`}>
                    {match.result}
                  </span>
                </div>

              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  )
}