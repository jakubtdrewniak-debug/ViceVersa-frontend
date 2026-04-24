/* eslint-disable react-refresh/only-export-components */
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { MatchView } from '../../components/MatchView'
import { MOCK_LIVE_TOURNAMENT } from '../../lib/mockData'
import { useState } from 'react'

export const Route = createFileRoute('/match/$matchId')({
  component: MatchRoute,
})

function MatchRoute() {
  const { matchId } = Route.useParams()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const matchData = MOCK_LIVE_TOURNAMENT.matches.find(m => m.id === matchId)

  const handleResultSubmit = async (winnerId: string, finalScore: { p1: number, p2: number }) => {
    if (!matchData) return

    setIsSubmitting(true)
    console.log(`Match ${matchId} Result: Winner ${winnerId}, Score: ${finalScore.p1}-${finalScore.p2}`)

    await new Promise(resolve => setTimeout(resolve, 1000))

    navigate({ to: `/tournament/${matchData.tournamentId}` })
  }

  if (!matchData) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
        <p>Match not found.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6">

      <div className="w-full max-w-3xl mb-6">
        <Link
          to={ "/tournament/" + matchData.tournamentId}
          className="text-pink-500 hover:text-pink-400 font-bold text-sm tracking-widest uppercase inline-block transition-colors"
        >
          ← Back to Bracket
        </Link>
      </div>

      <MatchView
        match={matchData}
        onSubmitResult={handleResultSubmit}
        isSubmitting={isSubmitting}
      />

    </div>
  )
}