import type {User} from "./CreateTournament.tsx";
import {Link} from "@tanstack/react-router";

export interface PastTournament {
  id: string
  name: string
  game: string
  dateCompleted: string
  playerCount: number
  winner: User
}

interface Props {
  tournaments: PastTournament[]
  isLoading?: boolean
}

export function TournamentHistory({tournaments, isLoading}: Props) {
  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-[#1a1d24] rounded-xl w-full"></div>
        ))}
      </div>
    )
  }

  if (tournaments.length === 0) {
    return (
      <div className="text-center py-12 bg-[#0f1115] border border-[#1a1d24] rounded-2xl">
        <p className="text-gray-500 font-medium">No completed tournaments yet.</p>
        <p className="text-gray-600 text-sm mt-1">Go play some matches!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {tournaments.map((t) => (
        // TODO add tournament route and tournament view component
        <Link
          key={t.id}
          to="/tournament/$tournamentId"
          params={{ tournamentId: t.id }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#0f1115] border border-[#1a1d24] p-5 rounded-2xl hover:border-pink-500/50 transition-all group cursor-pointer"
        >

          <div className="space-y-1 mb-4 sm:mb-0">
            <h3 className="text-lg font-bold text-white group-hover:text-pink-400 transition-colors">
              {t.name}
            </h3>
            <div className="flex gap-3 text-sm text-gray-500 font-medium">
              <span>{t.game}</span>
              <span>•</span>
              <span>{t.playerCount} Players</span>
              <span>•</span>
              <span>{t.dateCompleted}</span>
            </div>
          </div>


          <div className="flex items-center gap-3 bg-[#1a1d24] px-4 py-3 rounded-lg border border-gray-800">
            <div className="text-yellow-500 text-2xl drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]">
              🏆
            </div>

            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-1">
                Champion
              </span>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-gray-700 overflow-hidden flex items-center justify-center shrink-0">
                  {t.winner.avatar ? (
                    <img src={t.winner.avatar} alt={t.winner.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[10px] font-bold text-white">
                      {t.winner.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <span className="text-white font-bold text-sm truncate max-w-[120px]">
                  {t.winner.name}
                </span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}