import { Link } from '@tanstack/react-router'
import type { Match } from '../types'

interface Props {
  matches: Match[]
}

export function BracketTree({ matches }: Props) {
  const matchesByRound = matches.reduce((acc, match) => {
    acc[match.round] = acc[match.round] || []
    acc[match.round].push(match)
    return acc
  }, {} as Record<number, Match[]>)

  const rounds = Object.keys(matchesByRound).map(Number).sort((a, b) => a - b)

  return (
    <div className="w-full overflow-x-auto custom-scrollbar pb-8">
      <div className="flex items-stretch gap-12 min-w-max min-h-[500px] px-4 pb-4 pt-12">
        {rounds.map((roundNum, roundIndex) => (
          <div key={roundNum} className="flex flex-col justify-around gap-6 w-64 relative">

            <div className="absolute -top-8 left-0 w-full text-center">
              <span className="text-pink-500 text-xs font-bold tracking-widest uppercase bg-[#0f1115] px-2">
                Round {roundNum}
              </span>
            </div>

            {matchesByRound[roundNum].map((match) => (
              <div key={match.id} className="relative w-full">

                {roundIndex !== rounds.length - 1 && (
                  <div className="absolute top-1/2 -right-12 w-12 h-px bg-gray-700 z-0"></div>
                )}

                <Link
                  to="/match/$matchId"
                  params={{ matchId: match.id }}
                  className="relative z-10 block bg-[#1a1d24] border border-gray-800 rounded-lg p-3 hover:border-pink-500/50 transition-all shadow-lg group cursor-pointer"
                >
                  <div className={`flex justify-between items-center mb-2 ${match.winnerId && match.winnerId !== match.player1?.id ? 'opacity-40 grayscale' : ''}`}>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gray-700 flex items-center justify-center rounded-full overflow-hidden shrink-0">
                        {match.player1?.avatar ? <img src={match.player1.avatar} alt="" className="w-full h-full object-cover" /> : <span className="text-[10px] font-bold">?</span>}
                      </div>
                      <span className="font-bold text-sm text-white truncate max-w-[100px]">{match.player1?.name || 'TBD'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {match.winnerId === match.player1?.id && <span className="text-yellow-500 text-[10px] uppercase font-bold">Win</span>}
                      <span className="font-black text-gray-300">{match.score?.p1 ?? '-'}</span>
                    </div>
                  </div>

                  <div className="h-px bg-gray-800 w-full my-2"></div>

                  <div className={`flex justify-between items-center ${match.winnerId && match.winnerId !== match.player2?.id ? 'opacity-40 grayscale' : ''}`}>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gray-700 flex items-center justify-center rounded-full overflow-hidden shrink-0">
                        {match.player2?.avatar ? <img src={match.player2.avatar} alt="" className="w-full h-full object-cover" /> : <span className="text-[10px] font-bold">?</span>}
                      </div>
                      <span className="font-bold text-sm text-white truncate max-w-[100px]">{match.player2?.name || 'TBD'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {match.winnerId === match.player2?.id && <span className="text-yellow-500 text-[10px] uppercase font-bold">Win</span>}
                      <span className="font-black text-gray-300">{match.score?.p2 ?? '-'}</span>
                    </div>
                  </div>
                </Link>

              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}