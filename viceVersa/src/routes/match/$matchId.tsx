import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth0 } from '@auth0/auth0-react' // 👈 Added
import { toast } from 'react-toastify'
import { MatchView } from '../../components/MatchView'
import { useApi } from '../../hooks/useApi'
import type { MatchDto } from '../../types'

export const Route = createFileRoute('/match/$matchId')({
  component: MatchRoute,
})

// eslint-disable-next-line react-refresh/only-export-components
function MatchRoute() {
  const { matchId } = Route.useParams()
  const navigate = useNavigate()
  const { callApi } = useApi()
  const queryClient = useQueryClient()
  const { user } = useAuth0()

  const roles = (user?.['https://viceversa.dev/roles'] as string[]) || []
  const isAdmin = roles.includes('admin')

  const { data: matchData, isLoading } = useQuery<MatchDto>({
    queryKey: ['match', matchId],
    queryFn: () => callApi(`/matches/${matchId}`),
  })

  const deleteMutation = useMutation({
    mutationFn: () => callApi(`/matches/${matchId}`, { method: 'DELETE' }),
    onSuccess: () => {
      toast.success("Match purged from history.")
      queryClient.invalidateQueries({ queryKey: ['matches'] })
      navigate({ to: '/my-history' })
    },
    onError: (err: Error) => toast.error(`Purge failed: ${err.message}`)
  })

  const submitResultMutation = useMutation({
    mutationFn: (payload: { winnerId: string | null; score: { p1: number; p2: number } }) => {
      return callApi(`/matches/${matchId}/score`, {
        method: 'PUT',
        body: JSON.stringify(payload.score)
      })
    },
    onSuccess: () => {
      toast.success("Results recorded.")
      queryClient.invalidateQueries({ queryKey: ['match', matchId] })
    }
  })

  if (isLoading) return <div className="text-pink-500 p-20 animate-pulse text-center">ACCESSING...</div>

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6">
      <MatchView
        match={matchData!}
        onSubmitResult={(winnerId, score) => submitResultMutation.mutate({ winnerId, score })}
        isSubmitting={submitResultMutation.isPending}
        isAdmin={isAdmin}
        onDelete={() => {
          if (window.confirm("CRITICAL: Purge this match record forever?")) {
            deleteMutation.mutate()
          }
        }}
      />
    </div>
  )
}