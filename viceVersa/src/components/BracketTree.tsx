import { Link } from "@tanstack/react-router"
import type { MatchDto } from "../types"

interface Props {
  matches: MatchDto[]
}

export function BracketTree({ matches }: Props) {
  const matchesByRound = matches.reduce((acc, match) => {
    if (match.round === undefined || match.round === null) return acc;
    acc[match.round] = acc[match.round] || []
    acc[match.round].push(match)
    return acc;
  }, {} as Record<number, MatchDto[]>)

  const rounds = Object.keys(matchesByRound).map(Number).sort((a, b) => b - a);

  const finalRound = rounds.length > 0 ? Math.min(...rounds) : 1;
  const maxRound = rounds.length > 0 ? Math.max(...rounds) : 1;

  const matchCardHeight = 110;
  const totalBracketHeight = 750;
  const colWidth = 280;
  const horizontalGap = 80;

  return (
    <div className="w-full overflow-x-auto custom-scrollbar bg-[#0f1115] p-10">
      <div className="flex items-start" style={{ gap: `${horizontalGap}px`, height: `${totalBracketHeight}px` }}>
        {rounds.map((roundNum) => {
          const isFinal = roundNum === finalRound;

          const displayRound = maxRound - roundNum + 1;

          return (
            <div key={roundNum} style={{ width: `${colWidth}px` }} className="flex flex-col h-full">

              <div className="h-10 text-center mb-6 shrink-0">
                <span className="text-pink-500 text-xs font-black tracking-widest uppercase opacity-80">
                  {isFinal ? '🏆 Final' : `Round ${displayRound}`}
                </span>
              </div>

              <div className="flex-grow flex flex-col justify-around relative">
                {matchesByRound[roundNum].map((match, matchIndex) => {

                  return (
                    <div key={match.id} className="relative w-full flex items-center">

                      <Link
                        to="/match/$matchId"
                        params={{ matchId: match.id }}
                        className={`relative z-10 w-full bg-[#161920] border ${isFinal ? 'border-pink-500/50 shadow-[0_0_15px_rgba(219,39,119,0.2)]' : 'border-gray-800'} rounded-lg shadow-lg overflow-hidden group hover:border-pink-500 transition-all`}
                        style={{ height: `${matchCardHeight}px` }}
                      >
                        <div className="flex justify-between items-center h-1/2 px-4 border-b border-gray-800/40">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 bg-gray-900 rounded-lg border border-gray-700 flex items-center justify-center overflow-hidden shrink-0">
                              {match.player1?.avatar ? (
                                <img src={match.player1.avatar} className="w-full h-full object-cover" alt="" onError={(e) => (e.currentTarget.style.display = 'none')} />
                              ) : null}
                              <span className="absolute text-[10px] text-gray-600 font-black">?</span>
                            </div>
                            <span className={`text-sm truncate ${match.winnerId === match.player1?.id ? 'text-white font-black' : 'text-gray-400 font-bold'}`}>
                              {match.player1?.name || 'TBD'}
                            </span>
                          </div>
                          <span className={`text-lg font-mono font-black ${match.winnerId === match.player1?.id ? 'text-pink-500' : 'text-gray-600'}`}>
                             {match.score?.p1 ?? 0}
                          </span>
                        </div>

                        <div className="flex justify-between items-center h-1/2 px-4">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 bg-gray-900 rounded-lg border border-gray-700 flex items-center justify-center overflow-hidden shrink-0">
                              {match.player2?.avatar ? (
                                <img src={match.player2.avatar} className="w-full h-full object-cover" alt="" onError={(e) => (e.currentTarget.style.display = 'none')} />
                              ) : null}
                              <span className="absolute text-[10px] text-gray-600 font-black">?</span>
                            </div>
                            <span className={`text-sm truncate ${match.winnerId === match.player2?.id ? 'text-white font-black' : 'text-gray-400 font-bold'}`}>
                              {match.player2?.name || 'TBD'}
                            </span>
                          </div>
                          <span className={`text-lg font-mono font-black ${match.winnerId === match.player2?.id ? 'text-pink-500' : 'text-gray-600'}`}>
                             {match.score?.p2 ?? 0}
                          </span>
                        </div>
                      </Link>

                      {!isFinal && (
                        <div
                          className="absolute pointer-events-none"
                          style={{
                            left: "100%",
                            width: `${horizontalGap}px`,
                            height: `${totalBracketHeight / (matchesByRound[roundNum].length * 2)}px`,
                            top: matchIndex % 2 === 0 ? '50%' : 'auto',
                            bottom: matchIndex % 2 !== 0 ? '50%' : 'auto',
                          }}
                        >
                          <div className="absolute bg-gray-700" style={{ width: "50%", height: '1px', left: 0, top: matchIndex % 2 === 0 ? 0 : '100%' }} />
                          <div className="absolute bg-gray-700" style={{ width: '1px', height: '100%', left: '50%', top: 0 }} />
                          {matchIndex % 2 === 0 && (
                            <div className="absolute bg-gray-700" style={{ width: '50%', height: '1px', right: 0, top: '100%' }} />
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}