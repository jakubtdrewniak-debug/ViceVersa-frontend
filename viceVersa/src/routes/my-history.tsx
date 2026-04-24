import { createFileRoute, Link } from '@tanstack/react-router'
import { useAuth0 } from '@auth0/auth0-react'
import {
  MOCK_LIVE_TOURNAMENT,
  MOCK_COMPLETED_TOURNAMENT,
  MOCK_MY_MATCHES,
  MOCK_SOLOS
} from '../lib/mockData'
import type {Match, Participant} from "../types.ts";


export const Route = createFileRoute('/my-history')({
  component: MyHistoryRoute,
})

function MyHistoryRoute() {
  const { isAuthenticated, isLoading, user } = useAuth0()

  if (isLoading) return <div className="p-8 text-center text-gray-500 bg-[#050505] min-h-screen">Loading History...</div>

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-center font-sans">
        <h2 className="text-2xl font-bold mb-2 text-white">Access Denied</h2>
        <p className="text-gray-400">Please log in to view your personal match history.</p>
      </div>
    )
  }

  const MY_MOCK_ID = MOCK_SOLOS[0].id;

  // Helper: Checks if the user is the player OR inside the team's member array
  const isUserInvolved = (participant: Participant | null | undefined, userId: string): boolean => {
    if (!participant) return false;
    if (participant.isTeam) {
      return participant.members.some((member) => member.id === userId);
    }
    return participant.id === userId;
  }

  // Gather all matches
  const allTournamentMatches: Match[] = [
    ...(MOCK_LIVE_TOURNAMENT?.matches || []),
    ...(MOCK_COMPLETED_TOURNAMENT?.matches || []),
    ...(MOCK_MY_MATCHES || [])
  ]

  // Filter to only matches involving the user
  const myMatches: Match[] = allTournamentMatches.filter(
    (match) => isUserInvolved(match.player1, MY_MOCK_ID) || isUserInvolved(match.player2, MY_MOCK_ID)
  )

  // --- THE NEW, CLEANER STATS LOGIC ---
  let wins = 0;
  let losses = 0;
  let draws = 0;

  myMatches.forEach(match => {
    if (match.status !== 'Completed') return;

    // Because winner is now a full Participant, we just ask our helper if we are inside it!
    if (!match.winner) {
      draws++;
    } else if (isUserInvolved(match.winner, MY_MOCK_ID)) {
      wins++;
    } else {
      losses++;
    }
  })

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white">
            {user?.name}'s Match History
          </h1>
          <p className="text-gray-400 mt-1">Review your past performances and results.</p>
        </div>

        {/* Dynamic Stats Summary */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-[#1a1d24] p-4 rounded-xl border border-gray-800 text-center">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Wins</p>
            <p className="text-2xl font-black text-green-500">{wins}</p>
          </div>
          <div className="bg-[#1a1d24] p-4 rounded-xl border border-gray-800 text-center">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Losses</p>
            <p className="text-2xl font-black text-red-500">{losses}</p>
          </div>
          <div className="bg-[#1a1d24] p-4 rounded-xl border border-gray-800 text-center">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Draws</p>
            <p className="text-2xl font-black text-gray-400">{draws}</p>
          </div>
        </div>

        {/* Dynamic Match List */}
        <div className="space-y-4">
          {myMatches.length === 0 ? (
            <div className="bg-[#1a1d24] p-10 rounded-xl border border-gray-800 text-center">
              <p className="text-gray-400">You haven't participated in any matches yet.</p>
            </div>
          ) : (
            myMatches.map((match) => {

              // --- THE NEW, CLEANER RESULT LOGIC ---
              let resultStatus = 'pending';
              if (match.status === 'Completed') {
                if (!match.winner) resultStatus = 'draw';
                else if (isUserInvolved(match.winner, MY_MOCK_ID)) resultStatus = 'win';
                else resultStatus = 'loss';
              }

              return (
                <Link
                  key={match.id}
                  to="/match/$matchId"
                  params={{ matchId: match.id }}
                  className="block bg-[#1a1d24] border border-gray-800 rounded-xl overflow-hidden hover:border-pink-500 transition-all group"
                >
                  <div className="flex items-center p-4 gap-6">

                    {/* Vertical Status Bar */}
                    <div className={`w-2 self-stretch ${
                      resultStatus === 'win' ? 'bg-green-500 shadow-[4px_0_15px_rgba(34,197,94,0.3)]' :
                        resultStatus === 'loss' ? 'bg-red-500' :
                          resultStatus === 'draw' ? 'bg-gray-500' : 'bg-blue-500'
                    }`} />

                    {/* Match Info */}
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-pink-500 uppercase tracking-widest">
                          {match.tournamentId ? 'Tournament' : 'Exhibition'}
                        </span>
                        <span className="text-gray-600 text-xs">•</span>
                        {/* We now use match.date directly from your new interface! */}
                        <span className="text-gray-500 text-xs font-medium">
                          {match.date}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-lg text-white">
                          {match.player1?.name || 'TBD'}
                        </span>
                        <span className="text-gray-600 font-black italic">VS</span>
                        <span className="font-bold text-lg text-white">
                          {match.player2?.name || 'TBD'}
                        </span>
                      </div>
                    </div>

                    {/* Score */}
                    {match.status === 'Completed' && match.score && (
                      <div className="flex flex-col items-end gap-2 pr-4">
                        <div className="text-2xl font-black tracking-tighter">
                          <span className={match.winner?.id === match.player1?.id ? 'text-green-500' : 'text-white'}>{match.score.p1}</span>
                          <span className="mx-1 text-gray-700">-</span>
                          <span className={match.winner?.id === match.player2?.id ? 'text-green-500' : 'text-white'}>{match.score.p2}</span>
                        </div>
                      </div>
                    )}

                  </div>
                </Link>
              )
            })
          )}
        </div>

      </div>
    </div>
  )
}