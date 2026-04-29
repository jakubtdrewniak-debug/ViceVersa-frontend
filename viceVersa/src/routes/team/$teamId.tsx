import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useApi } from '../../hooks/useApi'
import { TeamView } from "../../components/TeamView.tsx"
import type { TeamDto } from '../../types'

export const Route = createFileRoute('/team/$teamId')({
  component: TeamProfileRoute,
})

// eslint-disable-next-line react-refresh/only-export-components
function TeamProfileRoute() {
  const { teamId } = Route.useParams()
  const { callApi } = useApi()

  const { data: team, isLoading, error } = useQuery<TeamDto>({
    queryKey: ['team', teamId],
    queryFn: () => callApi(`/teams/${teamId}`),
  })

  if (isLoading) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center font-black text-pink-500 animate-pulse tracking-widest uppercase">
      Accessing Squad Frequency...
    </div>
  )

  if (error || !team) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6">
      <div className="bg-[#1a1d24] p-12 rounded-3xl border border-red-900/30 text-center max-w-sm shadow-2xl">
        <h2 className="text-2xl font-black text-red-500 mb-2 uppercase tracking-tighter">Squad Terminated</h2>
        <p className="text-gray-500 text-sm mb-8">This team record has been purged or moved to a classified sector.</p>
        <Link to="/teams" className="text-pink-500 font-black hover:text-white transition-colors">
          ← Return to Directory
        </Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#050505] p-6 md:p-12">
      <div className="max-w-4xl mx-auto mb-8">
        <button
          onClick={() => window.history.back()}
          className="text-gray-600 hover:text-white font-black text-[10px] transition-colors uppercase tracking-[0.3em] flex items-center gap-2"
        >
          ‹ Return
        </button>
      </div>
      <TeamView team={team} />
    </div>
  )
}