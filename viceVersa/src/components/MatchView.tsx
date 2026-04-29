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

  return (
    <div className="bg-[#0f1115] text-white p-8 rounded-2xl w-full max-w-3xl mx-auto border border-[#1a1d24] shadow-2xl relative overflow-hidden">

      {isAdmin && (
        <button
          onClick={onDelete}
          className="absolute top-4 right-4 bg-red-900/20 hover:bg-red-600 text-red-500 hover:text-white border border-red-500/20 px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest transition-all"
        >
          Purge Match
        </button>
      )}

      <div className="text-center mb-10">
        <h2 className="text-pink-500 font-black tracking-widest uppercase text-sm mb-2">
          {isStandalone ? 'Exhibition Match' : `Round ${match.round} Matchup`}
        </h2>
        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
          isCompleted ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'
        }`}>
          {match.status}
        </span>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">

        <div className={`flex-1 w-full bg-[#1a1d24] p-8 rounded-2xl flex flex-col items-center gap-4 border-2 transition-all ${isCompleted && match.winnerId === match.player1?.id ? 'border-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.2)]' : 'border-transparent'}`}>
          <div className={`w-24 h-24 bg-gray-800 flex items-center justify-center overflow-hidden shadow-lg border border-gray-700 ${match.player1?.isTeam ? 'rounded-xl' : 'rounded-full'}`}>
            {match.player1?.avatar ? <img src={match.player1.avatar} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" /> : <span className="text-3xl font-black text-gray-500">{match.player1?.name.charAt(0)}</span>}
          </div>
          <h3 className="text-2xl font-black tracking-tight">{match.player1?.name}</h3>

          {!isCompleted ? (
            <div className="flex items-center gap-4 bg-[#0f1115] rounded-xl p-2 border border-gray-800">
              <button onClick={() => setP1(Math.max(0, p1 - 1))} className="w-10 h-10 bg-gray-800 rounded-lg hover:text-pink-500 font-bold">-</button>
              <span className="text-3xl font-black w-10 text-center">{p1}</span>
              <button onClick={() => setP1(p1 + 1)} className="w-10 h-10 bg-gray-800 rounded-lg hover:text-pink-500 font-bold">+</button>
            </div>
          ) : <span className="text-5xl font-black text-gray-500">{p1}</span>}
        </div>

        <div className="shrink-0 flex items-center justify-center py-4">
          <span className="text-3xl font-black italic text-gray-700 uppercase tracking-widest">VS</span>
        </div>

        <div className={`flex-1 w-full bg-[#1a1d24] p-8 rounded-2xl flex flex-col items-center gap-4 border-2 transition-all ${isCompleted && match.winnerId === match.player2?.id ? 'border-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.2)]' : 'border-transparent'}`}>
          <div className={`w-24 h-24 bg-gray-800 flex items-center justify-center overflow-hidden shadow-lg border border-gray-700 ${match.player2?.isTeam ? 'rounded-xl' : 'rounded-full'}`}>
            {match.player2?.avatar ? <img src={match.player2.avatar} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" /> : <span className="text-3xl font-black text-gray-500">{match.player2?.name.charAt(0)}</span>}
          </div>
          <h3 className="text-2xl font-black tracking-tight">{match.player2?.name}</h3>

          {!isCompleted ? (
            <div className="flex items-center gap-4 bg-[#0f1115] rounded-xl p-2 border border-gray-800">
              <button onClick={() => setP2(Math.max(0, p2 - 1))} className="w-10 h-10 bg-gray-800 rounded-lg hover:text-pink-500 font-bold">-</button>
              <span className="text-3xl font-black w-10 text-center">{p2}</span>
              <button onClick={() => setP2(p2 + 1)} className="w-10 h-10 bg-gray-800 rounded-lg hover:text-pink-500 font-bold">+</button>
            </div>
          ) : <span className="text-5xl font-black text-gray-500">{p2}</span>}
        </div>

      </div>

      {!isCompleted && (
        <div className="flex justify-center border-t border-[#1a1d24] pt-8">
          <button
            onClick={() => {
              let winnerId: string | null = null;
              if (p1 > p2) winnerId = match.player1!.id;
              else if (p2 > p1) winnerId = match.player2!.id;
              onSubmitResult(winnerId, { p1, p2 });
            }}
            disabled={isSubmitting || (!isStandalone && isTie)}
            className="px-12 py-4 bg-pink-600 hover:bg-pink-500 rounded-xl font-black uppercase text-sm tracking-[0.2em] transition-all disabled:opacity-50"
          >
            {isSubmitting ? 'TRANSMITTING...' : 'SUBMIT FINAL SCORE'}
          </button>
        </div>
      )}
    </div>
  )
}