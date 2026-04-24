import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { MatchView } from '../../components/MatchView'
import { useState } from 'react'
import {
  MOCK_LIVE_TOURNAMENT,
  MOCK_COMPLETED_TOURNAMENT,
  MOCK_MY_MATCHES
} from '../../lib/mockData'
import type { Match, Participant, TournamentDetails } from '../../types'

export const Route = createFileRoute('/match/$matchId')({
  component: MatchRoute,
})

// eslint-disable-next-line react-refresh/only-export-components
function MatchRoute() {
  const { matchId } = Route.useParams()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const tournamentPool: (TournamentDetails | null)[] = [
    MOCK_LIVE_TOURNAMENT,
    MOCK_COMPLETED_TOURNAMENT
  ]

  let matchData: Match | undefined = undefined

  for (const tourney of tournamentPool) {
    if (tourney?.matches) {
      const found = tourney.matches.find(
        (m: Match) => m.id.toString() === matchId
      )
      if (found) {
        matchData = found
        break
      }
    }
  }

  if (!matchData) {
    matchData = MOCK_MY_MATCHES.find(
      (m: Match) => m.id.toString() === matchId
    )
  }

  const handleResultSubmit = async (winner: Participant | null, finalScore: { p1: number, p2: number }) => {
    setIsSubmitting(true)

    const allMatches = [
      ...(MOCK_LIVE_TOURNAMENT?.matches || []),
      ...(MOCK_COMPLETED_TOURNAMENT?.matches || []),
      ...(MOCK_MY_MATCHES || [])
    ]

    const targetMatch = allMatches.find((m: Match) => m.id.toString() === matchId)

    if (targetMatch) {
      targetMatch.winner = winner ?? null
      targetMatch.score = finalScore
      targetMatch.status = 'Completed'
    }

    await new Promise(resolve => setTimeout(resolve, 800))

    if (targetMatch?.tournamentId) {
      navigate({ to: `/tournament/${targetMatch.tournamentId}` })
    } else {
      navigate({ to: '/my-history' })
    }
  }

  if (!matchData) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center font-sans">
        <div className="bg-[#1a1d24] p-10 rounded-2xl border border-red-900/50 text-center">
          <h2 className="text-xl font-black text-red-500 mb-2">Match Not Found</h2>
          <p className="text-gray-500 mb-6">ID: {matchId}</p>
          <button onClick={() => window.history.back()} className="text-pink-500 font-bold hover:underline">
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6">
      <MatchView
        match={matchData}
        onSubmitResult={handleResultSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}