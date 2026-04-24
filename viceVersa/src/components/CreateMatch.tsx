import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { MOCK_SOLOS, MOCK_TEAMS, MOCK_MY_MATCHES } from '../lib/mockData'
import type { Match, Participant } from '../types'

export function CreateMatch() {
  const navigate = useNavigate()

  const allParticipants: Participant[] = [...MOCK_SOLOS, ...MOCK_TEAMS]

  const [player1Id, setPlayer1Id] = useState<string>('')
  const [player2Id, setPlayer2Id] = useState<string>('')
  const [matchDate, setMatchDate] = useState<string>(
    new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  )
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCreateMatch = async () => {
    if (!player1Id || !player2Id) return alert("Please select both players!")
    if (player1Id === player2Id) return alert("A player cannot fight themselves!")

    setIsSubmitting(true)

    const p1 = allParticipants.find(p => p.id === player1Id) || null
    const p2 = allParticipants.find(p => p.id === player2Id) || null

    const newMatch: Match = {
      id: `ex_${Date.now()}`,
      tournamentId: null,
      round: null,
      date: matchDate,
      status: 'Pending',
      player1: p1,
      player2: p2,
      score: { p1: 0, p2: 0 }
    }

    MOCK_MY_MATCHES.unshift(newMatch)

    await new Promise(resolve => setTimeout(resolve, 600))

    navigate({ to: `/match/${newMatch.id}` })
  }

  return (
  <form action={handleCreateMatch} className="bg-[#1a1d24] p-8 rounded-2xl border border-gray-800 shadow-2xl space-y-8">

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">

      <div className="space-y-2">
        <label className="text-xs font-bold text-pink-500 uppercase tracking-widest">Player 1 (Blue Side)</label>
        <select
          value={player1Id}
          onChange={(e) => setPlayer1Id(e.target.value)}
          className="w-full bg-[#0f1115] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all appearance-none cursor-pointer"
          required
        >
          <option value="" disabled>Select a competitor...</option>
          <optgroup label="Solo Players" className="bg-[#1a1d24] text-gray-300">
            {MOCK_SOLOS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </optgroup>
          <optgroup label="Teams" className="bg-[#1a1d24] text-gray-300">
            {MOCK_TEAMS.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </optgroup>
        </select>
      </div>

      <div className="hidden md:flex justify-center pb-2">
        <span className="text-2xl font-black italic text-gray-700">VS</span>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-red-500 uppercase tracking-widest">Player 2 (Red Side)</label>
        <select
          value={player2Id}
          onChange={(e) => setPlayer2Id(e.target.value)}
          className="w-full bg-[#0f1115] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all appearance-none cursor-pointer"
          required
        >
          <option value="" disabled>Select a competitor...</option>
          <optgroup label="Solo Players" className="bg-[#1a1d24] text-gray-300">
            {MOCK_SOLOS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </optgroup>
          <optgroup label="Teams" className="bg-[#1a1d24] text-gray-300">
            {MOCK_TEAMS.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </optgroup>
        </select>
      </div>
    </div>

    <div className="space-y-2">
      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Match Date</label>
      <input
        type="text"
        value={matchDate}
        onChange={(e) => setMatchDate(e.target.value)}
        placeholder="e.g. Oct 24, 2024"
        className="w-full bg-[#0f1115] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
        required
      />
    </div>

    <div className="pt-4 border-t border-gray-800">
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-black uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(37,99,235,0.2)]"
      >
        {isSubmitting ? 'Creating Match...' : 'Deploy Match'}
      </button>
    </div>

  </form>
)
}