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
      callApi('/matches/exhibitions', {
        method: 'POST',
        body: JSON.stringify(payload)
      }),
    onSuccess: (data: MatchDto) => {
      queryClient.invalidateQueries({ queryKey: ['matches'] })
      navigate({ to: `/match/${data.id}` })
    },
    onError: (err: Error) => alert(`Deployment failed: ${err.message}`),
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    deployMatch({
      type: entryType,
      player1Id,
      player2Id
    })
  }

  if (loadingUsers || loadingTeams) return (
    <div className="p-10 text-pink-500 font-black animate-pulse uppercase tracking-widest text-center">
      Syncing Roster Data...
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="bg-[#1a1d24] p-8 rounded-2xl border border-gray-800 space-y-8 shadow-2xl max-w-2xl mx-auto">
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Format</label>
        <div className="flex bg-[#0f1115] p-1 rounded-lg border border-gray-800 w-fit">
          {(['SOLO', 'TEAM'] as EntryType[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                setEntryType(t)
                setPlayer1Id("")
                setPlayer2Id("")
              }}
              className={`px-8 py-2 rounded text-[10px] font-black uppercase tracking-widest transition-all ${
                entryType === t ? 'bg-pink-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Competitor 1</label>
          <select
            value={player1Id}
            onChange={(e) => setPlayer1Id(e.target.value)}
            className="w-full bg-[#0f1115] border border-gray-700 p-4 rounded-xl text-white font-bold focus:border-pink-500 outline-none transition-colors appearance-none"
          >
            <option value="">Select Participant</option>
            {entryType === 'SOLO'
              ? users?.map(u => <option key={u.id} value={u.id}>{u.name}</option>)
              : teams?.map(t => <option key={t.id} value={t.id}>{t.name}</option>)
            }
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Competitor 2</label>
          <select
            value={player2Id}
            onChange={(e) => setPlayer2Id(e.target.value)}
            className="w-full bg-[#0f1115] border border-gray-700 p-4 rounded-xl text-white font-bold focus:border-pink-500 outline-none transition-colors appearance-none"
          >
            <option value="">Select Participant</option>
            {entryType === 'SOLO'
              ? users?.map(u => <option key={u.id} value={u.id}>{u.name}</option>)
              : teams?.map(t => <option key={t.id} value={t.id}>{t.name}</option>)
            }
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !player1Id || !player2Id || player1Id === player2Id}
        className="w-full bg-pink-600 py-4 rounded-xl font-black uppercase tracking-[0.2em] text-sm hover:bg-pink-500 disabled:opacity-30 disabled:grayscale transition-all shadow-[0_0_20px_rgba(219,39,119,0.2)]"
      >
        {isSubmitting ? "Generating Match..." : "Initialize Match"}
      </button>

      {player1Id && player2Id && player1Id === player2Id && (
        <p className="text-red-500 text-[10px] font-bold uppercase text-center tracking-widest">
          A participant cannot battle themselves
        </p>
      )}
    </form>
  )
}