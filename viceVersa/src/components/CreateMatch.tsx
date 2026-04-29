import { useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useApi } from "../hooks/useApi"
import type { MatchDto, UserDto, TeamDto, EntryType } from "../types"
import {toast} from "react-toastify";

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
    // Changed to standard toast/alert styling to match your other components
    onError: (err: Error) => toast.error(`Deployment failed: ${err.message}`),
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    deployMatch({
      type: entryType,
      player1Id,
      player2Id
    })
  }

  const isLoading = loadingUsers || loadingTeams;

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#0f1115] text-white p-8 rounded-3xl w-full space-y-8 font-sans border border-[#1a1d24] shadow-2xl"
    >

      <div className="space-y-3">
        <label className="text-pink-500 text-[10px] font-black tracking-widest uppercase ml-1">Format Setup</label>
        <div className="flex bg-[#1a1d24] p-1.5 rounded-xl border border-gray-800 w-full">
          {(['SOLO', 'TEAM'] as EntryType[]).map((t) => (
            <button
              key={t}
              type="button"
              disabled={isLoading}
              onClick={() => {
                setEntryType(t)
                setPlayer1Id("")
                setPlayer2Id("")
              }}
              className={`flex-1 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50 ${
                entryType === t
                  ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/20'
                  : 'text-gray-500 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-gray-800/50 relative">

        <div className="space-y-3">
          <label className="text-gray-500 text-[10px] font-black tracking-widest uppercase ml-1">Competitor 1</label>
          <select
            value={player1Id}
            onChange={(e) => setPlayer1Id(e.target.value)}
            disabled={isLoading}
            className="w-full bg-[#1a1d24] border border-gray-800 rounded-xl p-4 text-white font-bold outline-none focus:border-pink-500 transition-all appearance-none truncate cursor-pointer disabled:opacity-50"
          >
            <option value="">{isLoading ? "SYNCING ROSTER..." : "SELECT COMBATANT..."}</option>
            {entryType === 'SOLO'
              ? users?.map(u => <option key={u.id} value={u.id}>{u.name}</option>)
              : teams?.map(t => <option key={t.id} value={t.id}>{t.name}</option>)
            }
          </select>
        </div>

        <div className="flex justify-center -my-1 relative z-10 pointer-events-none">
           <span className="bg-[#0f1115] text-pink-500 text-[10px] font-black italic tracking-[0.4em] px-4 py-1.5 border border-gray-800 rounded-full shadow-lg">
             VS
           </span>
        </div>

        {/* PLAYER 2 */}
        <div className="space-y-3">
          <label className="text-gray-500 text-[10px] font-black tracking-widest uppercase ml-1">Competitor 2</label>
          <select
            value={player2Id}
            onChange={(e) => setPlayer2Id(e.target.value)}
            disabled={isLoading}
            className="w-full bg-[#1a1d24] border border-gray-800 rounded-xl p-4 text-white font-bold outline-none focus:border-pink-500 transition-all appearance-none truncate cursor-pointer disabled:opacity-50"
          >
            <option value="">{isLoading ? "SYNCING ROSTER..." : "SELECT COMBATANT..."}</option>
            {entryType === 'SOLO'
              ? users?.map(u => <option key={u.id} value={u.id}>{u.name}</option>)
              : teams?.map(t => <option key={t.id} value={t.id}>{t.name}</option>)
            }
          </select>
        </div>

      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting || !player1Id || !player2Id || player1Id === player2Id}
          className="w-full bg-white text-black font-black text-sm tracking-[0.2em] py-5 rounded-xl hover:bg-pink-500 hover:text-white transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(219,39,119,0.3)] disabled:opacity-30 disabled:grayscale uppercase"
        >
          {isSubmitting ? "UPLOADING PARAMETERS..." : "INITIALIZE MATCH"}
        </button>

        {player1Id && player2Id && player1Id === player2Id && (
          <p className="text-red-500 text-[9px] font-black uppercase text-center tracking-[0.2em] mt-4 animate-pulse">
            Error: Combatant cannot target themselves
          </p>
        )}
      </div>

    </form>
  )
}