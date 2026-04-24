import { createFileRoute, Link } from '@tanstack/react-router'

import { MOCK_TEAMS } from '../../lib/mockData'
import {TeamView} from "../../components/TeamView.tsx";

export const Route = createFileRoute('/team/$teamId')({
  component: TeamProfileRoute,
})

// eslint-disable-next-line react-refresh/only-export-components
function TeamProfileRoute() {
  const { teamId } = Route.useParams()

  const teamData = MOCK_TEAMS.find(t => t.id === teamId)

  if (!teamData) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6">
        <div className="bg-[#1a1d24] p-12 rounded-3xl border border-red-900/30 text-center max-w-sm">
          <span className="text-6xl block mb-4">🛸</span>
          <h2 className="text-2xl font-black text-white mb-2">Team Missing</h2>
          <p className="text-gray-500 text-sm mb-8">This squad has either disbanded or moved to a different galaxy.</p>
          <Link to="/teams" className="text-pink-500 font-bold hover:underline">
            ← Back to teams
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050505] p-6 md:p-12">
      <div className="max-w-4xl mx-auto mb-8">
        <button
          onClick={() => window.history.back()}
          className="text-gray-500 hover:text-white font-bold text-sm transition-colors uppercase tracking-widest flex items-center gap-2"
        >
          <span className="text-lg">‹</span> Back to teams
        </button>
      </div>

      <TeamView team={teamData} />
    </div>
  )
}