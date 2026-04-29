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

  const getWinnerId = (m: MatchDto): string | null | undefined => {
    if (m.winner?.id) return m.winner.id;
    if (!m.score) return null;
    const p1Score = Number(m.score.p1) || 0;
    const p2Score = Number(m.score.p2) || 0;
    if (p1Score > p2Score) return m.player1?.id;
    if (p2Score > p1Score) return m.player2?.id;
    return null;
  }

  const maxMatchesInOneRound = Math.max(1, ...Object.values(matchesByRound).map(arr => arr.length));

  const matchCardHeight = 110;

  const totalBracketHeight = Math.max(300, maxMatchesInOneRound * 150);

  const colWidth = 280;
  const horizontalGap = 80;

  return (
    <div className="w-full overflow-x-auto custom-scrollbar bg-[#0f1115] p-6 md:p-12 rounded-3xl border border-[#1a1d24] shadow-2xl">

      <div className="min-w-max flex justify-center">
        <div className="flex items-stretch" style={{ gap: `${horizontalGap}px`, minHeight: `${totalBracketHeight}px` }}>

          {rounds.map((roundNum) => {
            const isFinal = roundNum === finalRound;
            const displayRound = maxRound - roundNum + 1;

            return (
              <div key={roundNum} style={{ width: `${colWidth}px` }} className="flex flex-col h-full">

                <div className="h-10 text-center mb-6 shrink-0 flex items-center justify-center border-b border-gray-800/50">
                  <span className={`text-[11px] font-black tracking-widest uppercase ${isFinal ? 'text-green-500 shadow-green-500/20' : 'text-gray-500'}`}>
                    {isFinal ? '🏆 Final Phase' : `Round ${displayRound}`}
                  </span>
                </div>

                <div className={`flex-grow flex flex-col relative ${matchesByRound[roundNum].length === 1 ? 'justify-center' : 'justify-around'}`}>
                  {matchesByRound[roundNum].map((match, matchIndex) => {

                    const actualWinnerId = getWinnerId(match);

                    return (
                      <div key={match.id} className="relative w-full flex items-center shrink-0">

                        <Link
                          to="/match/$matchId"
                          params={{ matchId: match.id }}
                          className={`relative z-10 w-full bg-[#161920] border ${isFinal ? 'border-green-500/30 shadow-[0_0_20px_rgba(34,197,94,0.1)] hover:border-green-500' : 'border-gray-800 hover:border-pink-500'} rounded-xl shadow-lg overflow-hidden group transition-all`}
                          style={{ height: `${matchCardHeight}px` }}
                        >
                          <div className="flex justify-between items-center h-1/2 px-4 border-b border-gray-800/40 bg-[#1a1d24]/50 group-hover:bg-[#1a1d24] transition-colors">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className={`w-8 h-8 bg-gray-900 border border-gray-700 flex items-center justify-center overflow-hidden shrink-0 relative ${match.player1?.isTeam ? 'rounded-md' : 'rounded-full'}`}>
                                {match.player1?.avatar ? (
                                  <img src={match.player1.avatar} className="w-full h-full object-cover relative z-10" alt="" referrerPolicy="no-referrer" onError={(e) => (e.currentTarget.style.display = 'none')} />
                                ) : null}
                                <span className="absolute text-[10px] text-gray-600 font-black z-0">?</span>
                              </div>
                              <span className={`text-sm truncate uppercase tracking-tighter ${actualWinnerId === match.player1?.id ? 'text-white font-black' : 'text-gray-500 font-bold'}`}>
                                {match.player1?.name || 'TBD'}
                              </span>
                            </div>
                            <span className={`text-lg font-mono font-black ${actualWinnerId === match.player1?.id ? 'text-green-500' : 'text-gray-600'}`}>
                               {match.score?.p1 ?? 0}
                            </span>
                          </div>

                          <div className="flex justify-between items-center h-1/2 px-4 bg-[#1a1d24]/50 group-hover:bg-[#1a1d24] transition-colors">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className={`w-8 h-8 bg-gray-900 border border-gray-700 flex items-center justify-center overflow-hidden shrink-0 relative ${match.player2?.isTeam ? 'rounded-md' : 'rounded-full'}`}>
                                {match.player2?.avatar ? (
                                  <img src={match.player2.avatar} className="w-full h-full object-cover relative z-10" alt="" referrerPolicy="no-referrer" onError={(e) => (e.currentTarget.style.display = 'none')} />
                                ) : null}
                                <span className="absolute text-[10px] text-gray-600 font-black z-0">?</span>
                              </div>
                              <span className={`text-sm truncate uppercase tracking-tighter ${actualWinnerId === match.player2?.id ? 'text-white font-black' : 'text-gray-500 font-bold'}`}>
                                {match.player2?.name || 'TBD'}
                              </span>
                            </div>
                            <span className={`text-lg font-mono font-black ${actualWinnerId === match.player2?.id ? 'text-green-500' : 'text-gray-600'}`}>
                               {match.score?.p2 ?? 0}
                            </span>
                          </div>
                        </Link>

                        {!isFinal && (
                          matchesByRound[roundNum].length === 1 ? (
                            <div className="absolute pointer-events-none bg-gray-700 transition-all group-hover:bg-pink-500/50"
                                 style={{ left: "100%", width: `${horizontalGap}px`, height: '2px', top: '50%' }} />
                          ) : (
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
                              <div className="absolute bg-gray-700 transition-all group-hover:bg-pink-500/50" style={{ width: "50%", height: '2px', left: 0, top: matchIndex % 2 === 0 ? 0 : '100%' }} />
                              <div className="absolute bg-gray-700 transition-all group-hover:bg-pink-500/50" style={{ width: '2px', height: '100%', left: '50%', top: 0 }} />
                              {matchIndex % 2 === 0 && (
                                <div className="absolute bg-gray-700 transition-all group-hover:bg-pink-500/50" style={{ width: '50%', height: '2px', right: 0, top: '100%' }} />
                              )}
                            </div>
                          )
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
    </div>
  )
}