import { useState } from 'react'
import type {Match} from "./TournamentView.tsx";



interface Props {
  match: Match
  onSubmitResult: (winnerId: string, finalScore: { p1: number; p2: number }) => void
  isSubmitting?: boolean
}

export function MatchView({ match, onSubmitResult, isSubmitting }: Props) {
  const [scoreP1, setScoreP1] = useState(match.score?.p1 || 0)
  const [scoreP2, setScoreP2] = useState(match.score?.p2 || 0)

  if (!match.player1 || !match.player2) {
    return (
      <div className="bg-[#0f1115] p-12 rounded-2xl text-center border border-[#1a1d24]">
        <p className="text-gray-500 font-medium">Waiting for previous matches to complete.</p>
      </div>
    )
  }

  const handleReport = (winnerId: string) => {
    onSubmitResult(winnerId, { p1: scoreP1, p2: scoreP2 })
  }

  const isCompleted = match.status === 'Completed'

  return (
    <div className="bg-[#0f1115] text-white p-8 rounded-2xl w-full max-w-3xl mx-auto font-sans border border-[#1a1d24] shadow-2xl">

      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-pink-500 font-black tracking-widest uppercase text-sm mb-2">
          Round {match.round} Matchup
        </h2>
        <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
          isCompleted ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'
        }`}>
          {match.status}
        </span>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">

        <div className={`flex-1 w-full bg-[#1a1d24] p-8 rounded-2xl flex flex-col items-center gap-4 border-2 transition-all ${isCompleted && match.winnerId === match.player1.id ? 'border-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.2)]' : 'border-transparent'}`}>
          <div className={`w-24 h-24 bg-gray-800 flex items-center justify-center overflow-hidden shadow-lg ${match.player1.isTeam ? 'rounded-xl' : 'rounded-full'}`}>
            {match.player1.avatar ? <img src={match.player1.avatar} alt={match.player1.name} className="w-full h-full object-cover" /> : <span className="text-3xl font-bold">{match.player1.name[0]}</span>}
          </div>
          <div className="text-center">
            <h3 className="text-2xl font-black">{match.player1.name}</h3>
            {match.player1.isTeam && <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">{match.player1.members.length} Members</p>}
          </div>

          {!isCompleted && (
            <div className="flex items-center gap-4 bg-[#0f1115] rounded-xl p-2 mt-2">
              <button onClick={() => setScoreP1(Math.max(0, scoreP1 - 1))} className="w-10 h-10 flex items-center justify-center bg-gray-800 rounded-lg hover:bg-gray-700 text-xl font-bold transition-colors">-</button>
              <span className="text-3xl font-black w-10 text-center">{scoreP1}</span>
              <button onClick={() => setScoreP1(scoreP1 + 1)} className="w-10 h-10 flex items-center justify-center bg-gray-800 rounded-lg hover:bg-gray-700 text-xl font-bold transition-colors">+</button>
            </div>
          )}

          {isCompleted && <span className="text-5xl font-black text-gray-300 mt-2">{scoreP1}</span>}

          {!isCompleted && (
            <button onClick={() => handleReport(match.player1!.id)} disabled={isSubmitting} className="w-full mt-4 py-3 bg-[#2a2d35] hover:bg-pink-600 rounded-lg font-bold transition-colors uppercase tracking-wider text-sm">
              Declare Winner
            </button>
          )}
        </div>

        <div className="shrink-0 flex items-center justify-center py-4">
          <span className="text-5xl font-black italic text-gray-700 drop-shadow-lg">VS</span>
        </div>

        <div className={`flex-1 w-full bg-[#1a1d24] p-8 rounded-2xl flex flex-col items-center gap-4 border-2 transition-all ${isCompleted && match.winnerId === match.player2.id ? 'border-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.2)]' : 'border-transparent'}`}>
          <div className={`w-24 h-24 bg-gray-800 flex items-center justify-center overflow-hidden shadow-lg ${match.player2.isTeam ? 'rounded-xl' : 'rounded-full'}`}>
            {match.player2.avatar ? <img src={match.player2.avatar} alt={match.player2.name} className="w-full h-full object-cover" /> : <span className="text-3xl font-bold">{match.player2.name[0]}</span>}
          </div>
          <div className="text-center">
            <h3 className="text-2xl font-black">{match.player2.name}</h3>
            {match.player2.isTeam && <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">{match.player2.members.length} Members</p>}
          </div>

          {!isCompleted && (
            <div className="flex items-center gap-4 bg-[#0f1115] rounded-xl p-2 mt-2">
              <button onClick={() => setScoreP2(Math.max(0, scoreP2 - 1))} className="w-10 h-10 flex items-center justify-center bg-gray-800 rounded-lg hover:bg-gray-700 text-xl font-bold transition-colors">-</button>
              <span className="text-3xl font-black w-10 text-center">{scoreP2}</span>
              <button onClick={() => setScoreP2(scoreP2 + 1)} className="w-10 h-10 flex items-center justify-center bg-gray-800 rounded-lg hover:bg-gray-700 text-xl font-bold transition-colors">+</button>
            </div>
          )}

          {isCompleted && <span className="text-5xl font-black text-gray-300 mt-2">{scoreP2}</span>}

          {!isCompleted && (
            <button onClick={() => handleReport(match.player2!.id)} disabled={isSubmitting} className="w-full mt-4 py-3 bg-[#2a2d35] hover:bg-pink-600 rounded-lg font-bold transition-colors uppercase tracking-wider text-sm">
              Declare Winner
            </button>
          )}
        </div>

      </div>
    </div>
  )
}