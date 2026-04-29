import { useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useApi } from "../hooks/useApi"
import type { MatchDto, UserDto, TeamDto, EntryType } from "../types"

export function CreateMatch() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { callApi } = useApi()

  const [player1Id, setPlayer1Id] = useState("")
  const [player2Id, setPlayer2Id] = useState("")
  const [entryType, setEntryType] = useState<EntryType>("SOLO")

  const { data: users, isLoading: loadingUsers } = useQuery<UserDto[]>({
    queryKey: ["users"],
    queryFn: () => callApi("/users"),
  })

  const { data: teams, isLoading: loadingTeams } = useQuery<TeamDto[]>({
    queryKey: ['teams'],
    queryFn: () => callApi('/teams'),
  })

  const { mutate: deployMatch, isPending: isSubmitting } = useMutation({
    mutationFn: (payload: any) =>
      callApi('/matches', {
        method: 'POST',
        body: JSON.stringify(payload)
      }),
    onSuccess: (data: MatchDto) => {
      queryClient.invalidateQueries({ queryKey: ['matches'] })
      navigate({ to: `/match/${data.id}` })
    },
    onError: (err: Error) => alert(err.message),
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    deployMatch({ type: entryType, player1Id, player2Id })
  }

  if (loadingUsers || loadingTeams) return <div className="p-10 text-pink-500">Syncing...</div>

  return (
    <form onSubmit={handleSubmit} className="bg-[#1a1d24] p-8 rounded-2xl border border-gray-800 space-y-8">
      <div className="flex bg-[#0f1115] p-1 rounded-lg border border-gray-800 w-fit">
        {(['SOLO', 'TEAM'] as EntryType[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setEntryType(t)}
            className={`px-4 py-2 rounded text-xs font-bold transition-all ${
              entryType === t ? 'bg-pink-600 text-white' : 'text-gray-500'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <select
          value={player1Id}
          onChange={(e) => setPlayer1Id(e.target.value)}
          className="bg-[#0f1115] border border-gray-700 p-3 rounded text-white"
        >
          <option value="">Select Player 1</option>
          {entryType === 'SOLO'
            ? users?.map(u => <option key={u.id} value={u.id}>{u.name}</option>)
            : teams?.map(t => <option key={t.id} value={t.id}>{t.name}</option>)
          }
        </select>

        <select
          value={player2Id}
          onChange={(e) => setPlayer2Id(e.target.value)}
          className="bg-[#0f1115] border border-gray-700 p-3 rounded text-white"
        >
          <option value="">Select Player 2</option>
          {entryType === 'SOLO'
            ? users?.map(u => <option key={u.id} value={u.id}>{u.name}</option>)
            : teams?.map(t => <option key={t.id} value={t.id}>{t.name}</option>)
          }
        </select>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !player1Id || !player2Id}
        className="w-full bg-blue-600 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-blue-500 disabled:opacity-50"
      >
        {isSubmitting ? "Adding match..." : "Start Match"}
      </button>
    </form>
  )
}