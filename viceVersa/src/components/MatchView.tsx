import { useState } from 'react'
import type { MatchDto } from "../types"

interface Props {
  match: MatchDto;
  onSubmitResult: (winnerId: string | null, finalScore: { p1: number; p2: number }) => void;
  isSubmitting?: boolean;
  isAdmin?: boolean;
  onDelete?: () => void;
}

export function MatchView({ match, onSubmitResult, isSubmitting, isAdmin, onDelete }: Props) {
  const [p1, setP1] = useState(match.score?.p1 || 0)
  const [p2, setP2] = useState(match.score?.p2 || 0)

  const isCompleted = match.status === 'COMPLETED'
  const isStandalone = !match.tournamentId
  const isTie = p1 === p2

  const getWinnerId = () => {
    if (match.winner?.id) return match.winner.id;
    if (!match.score) return null;
    const p1Score = Number(match.score.p1) || 0;
    const p2Score = Number(match.score.p2) || 0;
    if (p1Score > p2Score) return match.player1?.id;
    if (p2Score > p1Score) return match.player2?.id;
    return null;
  }

  const actualWinnerId = getWinnerId();

  const renderAvatar = (player: any) => (
    <div className={`w-24 h-24 bg-gray-900 flex items-center justify-center overflow-hidden shadow-xl border border-gray-700 relative ${player?.isTeam ? 'rounded-2xl' : 'rounded-full'}`}>
      {player?.avatar ? (
        <img
          src={player.avatar}
          alt=""
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover relative z-10"
          onError={(e) => (e.currentTarget.style.display = 'none')}
        />
      ) : null}
      <span className="absolute text-3xl font-black text-gray-600 uppercase z-0">
        {player?.name ? player.name.charAt(0) : '?'}
      </span>
    </div>
  )

  return (
    <div className="bg-[#0f1115] text-white p-6 md:p-10 rounded-3xl w-full max-w-4xl mx-auto border border-[#1a1d24] shadow-2xl relative overflow-hidden">

      {isAdmin && (
        <button
          onClick={onDelete}
          className="absolute top-4 right-4 bg-red-900/20 hover:bg-red-600 text-red-500 hover:text-white border border-red-500/20 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all z-20"
        >
          Purge
        </button>
      )}

      <div className="text-center mb-10 mt-4 md:mt-0">
        <h2 className="text-pink-500 font-black tracking-widest uppercase text-sm mb-3">
          {isStandalone ? 'Exhibition Match' : `Round ${match.round} Matchup`}
        </h2>
        <span className={`px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
          isCompleted ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20 animate-pulse'
        }`}>
          {match.status}
        </span>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">

        <div className={`flex-1 w-full bg-[#1a1d24] p-8 rounded-3xl flex flex-col items-center gap-5 border-2 transition-all ${isCompleted && actualWinnerId === match.player1?.id ? 'border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.15)]' : 'border-transparent'}`}>
          {renderAvatar(match.player1)}

          <h3 className={`text-2xl font-black tracking-tight text-center ${match.player1 ? 'text-white' : 'text-gray-600'}`}>
            {match.player1?.name || 'TBD'}
          </h3>

          {!isCompleted ? (
            <div className="flex items-center gap-4 bg-[#0f1115] rounded-2xl p-2.5 border border-gray-800 shadow-inner">
              <button onClick={() => setP1(Math.max(0, p1 - 1))} disabled={!match.player1} className="w-12 h-12 bg-gray-800 rounded-xl hover:bg-gray-700 hover:text-pink-500 font-black text-xl transition-colors disabled:opacity-30 disabled:hover:text-white">-</button>
              <span className="text-4xl font-black w-14 text-center">{p1}</span>
              <button onClick={() => setP1(p1 + 1)} disabled={!match.player1} className="w-12 h-12 bg-gray-800 rounded-xl hover:bg-gray-700 hover:text-pink-500 font-black text-xl transition-colors disabled:opacity-30 disabled:hover:text-white">+</button>
            </div>
          ) : (
            <span className={`text-6xl font-black ${actualWinnerId === match.player1?.id ? 'text-green-500' : 'text-gray-600'}`}>
              {p1}
            </span>
          )}
        </div>

        <div className="shrink-0 flex items-center justify-center py-2 md:py-0">
          <span className="text-3xl font-black italic text-gray-700 uppercase tracking-widest bg-[#0f1115] p-4 rounded-full border border-[#1a1d24] shadow-xl">VS</span>
        </div>

        <div className={`flex-1 w-full bg-[#1a1d24] p-8 rounded-3xl flex flex-col items-center gap-5 border-2 transition-all ${isCompleted && actualWinnerId === match.player2?.id ? 'border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.15)]' : 'border-transparent'}`}>
          {renderAvatar(match.player2)}

          <h3 className={`text-2xl font-black tracking-tight text-center ${match.player2 ? 'text-white' : 'text-gray-600'}`}>
            {match.player2?.name || 'TBD'}
          </h3>

          {!isCompleted ? (
            <div className="flex items-center gap-4 bg-[#0f1115] rounded-2xl p-2.5 border border-gray-800 shadow-inner">
              <button onClick={() => setP2(Math.max(0, p2 - 1))} disabled={!match.player2} className="w-12 h-12 bg-gray-800 rounded-xl hover:bg-gray-700 hover:text-pink-500 font-black text-xl transition-colors disabled:opacity-30 disabled:hover:text-white">-</button>
              <span className="text-4xl font-black w-14 text-center">{p2}</span>
              <button onClick={() => setP2(p2 + 1)} disabled={!match.player2} className="w-12 h-12 bg-gray-800 rounded-xl hover:bg-gray-700 hover:text-pink-500 font-black text-xl transition-colors disabled:opacity-30 disabled:hover:text-white">+</button>
            </div>
          ) : (
            <span className={`text-6xl font-black ${actualWinnerId === match.player2?.id ? 'text-green-500' : 'text-gray-600'}`}>
              {p2}
            </span>
          )}
        </div>

      </div>

      {!isCompleted && (
        <div className="flex justify-center border-t border-[#1a1d24] pt-8">
          <button
            onClick={() => {
              let winnerId: string | null = null;
              if (p1 > p2) winnerId = match.player1?.id || null;
              else if (p2 > p1) winnerId = match.player2?.id || null;
              onSubmitResult(winnerId, { p1, p2 });
            }}
            disabled={isSubmitting || (!isStandalone && isTie) || !match.player1 || !match.player2}
            className="w-full md:w-auto px-12 py-5 bg-white text-black hover:bg-pink-500 hover:text-white rounded-xl font-black uppercase text-sm tracking-[0.2em] transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(219,39,119,0.3)] disabled:opacity-30 disabled:grayscale"
          >
            {isSubmitting ? 'TRANSMITTING LOGS...' : 'SUBMIT FINAL SCORE'}
          </button>
        </div>
      )}

    </div>
  )
}