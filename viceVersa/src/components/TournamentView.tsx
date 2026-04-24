import {Link} from "@tanstack/react-router";
import type {Participant} from "./CreateTournament.tsx";

export interface Match {
  id: string
  tournamentId: string | null
  round: number
  status: "Pending" | "In Progress" | "Completed"
  player1: Participant | null
  player2: Participant | null
  winnerId?: string
  score?: { p1: number; p2: number }
}

export interface TournamentDetails {
  id: string
  name: string
  game: string
  status: "Upcoming" | "Live" | "Completed"
  format: string
  entryType: "solo" | "team"
  participants: Participant[]
  matches: Match[]
}

interface Props {
  tournament: TournamentDetails
}

export function TournamentView({tournament}: Props) {
  const matchesByRound = tournament.matches.reduce((acc, match) => {
    acc[match.round] = acc[match.round] || []
    acc[match.round].push(match)
    return acc
  }, {} as Record<number, Match[]>)

  return (
    <div
      className="bg-[#0f1115] text-white p-8 rounded-2xl w-full max-w-4xl mx-auto space-y-8 font-sans border border-[#1a1d24]">

      {/* Header Info */}
      <div className="border-b border-[#1a1d24] pb-6">
        <div className="flex justify-between items-start mb-3">
          <h1 className="text-3xl font-black text-white">{tournament.name}</h1>
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
            tournament.status === 'Live' ? 'bg-green-500/20 text-green-400' :
              tournament.status === 'Completed' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-blue-500/20 text-blue-400'
          }`}>
            {tournament.status}
          </span>
        </div>
        <div className="flex gap-4 text-gray-400 text-sm font-medium">
          <span>🎮 {tournament.game}</span>
          <span>👥 {tournament.participants.length} {tournament.entryType === 'team' ? 'Teams' : 'Players'}</span>
          <span className="capitalize">🏆 {tournament.format.replace('-', ' ')}</span>
        </div>
      </div>

      {tournament.matches.length === 0 ? (
        <div className="text-center py-12 bg-[#1a1d24] rounded-xl border border-gray-800">
          <p className="text-gray-500 font-medium">Bracket has not been generated yet.</p>
          <button
            className="mt-4 bg-pink-600 hover:bg-pink-500 text-white px-6 py-2 rounded-lg font-bold transition-colors">
            Generate Bracket
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(matchesByRound).map(([round, matches]) => (
            <div key={round} className="space-y-4">
              <h3 className="text-pink-500 text-sm font-bold tracking-widest uppercase">
                Round {round}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {matches.map((match) => (
                  <Link
                    key={match.id}
                    to="/match/$matchId"
                    params={{matchId: match.id}}
                    className="bg-[#1a1d24] rounded-lg p-4 border border-gray-800 flex flex-col justify-center gap-3 hover:border-pink-500/50 transition-all group cursor-pointer"
                  >


                    <div
                      className={`flex justify-between items-center ${match.winnerId && match.winnerId !== match.player1?.id ? 'opacity-40 grayscale' : ''}`}>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-6 h-6 bg-gray-700 flex items-center justify-center overflow-hidden ${tournament.entryType === 'team' ? 'rounded-md' : 'rounded-full'}`}>
                          {match.player1?.avatar ?
                            <img src={match.player1.avatar} className="w-full h-full object-cover"/> :
                            <span className="text-[10px] font-bold">{match.player1?.name.charAt(0) || '?'}</span>}
                        </div>
                        <span className="font-medium">{match.player1?.name || 'TBD'}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        {match.winnerId === match.player1?.id && <span
                          className="text-yellow-500 text-[10px] uppercase font-bold tracking-wider">Winner</span>}
                        {match.score && <span className="font-black text-lg">{match.score.p1}</span>}
                      </div>
                    </div>

                    <div className="h-px bg-gray-800 w-full"></div>

                    {/* Participant 2 */}
                    <div
                      className={`flex justify-between items-center ${match.winnerId && match.winnerId !== match.player2?.id ? 'opacity-40 grayscale' : ''}`}>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-6 h-6 bg-gray-700 flex items-center justify-center overflow-hidden ${tournament.entryType === 'team' ? 'rounded-md' : 'rounded-full'}`}>
                          {match.player2?.avatar ?
                            <img src={match.player2.avatar} className="w-full h-full object-cover"/> :
                            <span className="text-[10px] font-bold">{match.player2?.name.charAt(0) || '?'}</span>}
                        </div>
                        <span className="font-medium">{match.player2?.name || 'TBD'}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        {match.winnerId === match.player2?.id && <span
                          className="text-yellow-500 text-[10px] uppercase font-bold tracking-wider">Winner</span>}
                        {match.score && <span className="font-black text-lg">{match.score.p2}</span>}
                      </div>
                    </div>

                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}