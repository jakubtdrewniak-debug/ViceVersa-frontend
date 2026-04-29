import { useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { useApi } from '../hooks/useApi'
import type { TeamDto, UserDto } from '../types'

interface TeamViewProps {
  team: TeamDto
}

export function TeamView({ team }: TeamViewProps) {
  const { user, isAuthenticated } = useAuth0()
  const { callApi } = useApi()
  const queryClient = useQueryClient()
  const [isAdding, setIsAdding] = useState(false)

  const isCaptain = isAuthenticated && user?.sub === team.captain?.id

  const { data: allUsers = [] } = useQuery<UserDto[]>({
    queryKey: ['users'],
    queryFn: () => callApi('/users'),
    enabled: isCaptain
  })

  const addMemberMutation = useMutation({
    mutationFn: (userId: string) =>
      callApi(`/teams/${team.id}/members/${userId}`, { method: 'POST' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team', team.id] })
      toast.success("New operative recruited.")
      setIsAdding(false)
    },
    onError: (err: Error) => toast.error(err.message)
  })

  const removeMemberMutation = useMutation({
    mutationFn: (userId: string) =>
      callApi(`/teams/${team.id}/members/${userId}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team', team.id] })
      toast.warn("Operative removed from roster.")
    },
    onError: (err: Error) => toast.error(err.message)
  })

  const availablePlayers = allUsers.filter(
    u => !team.members?.some(member => member.id === u.id)
  )

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-white font-sans">
      <div className="bg-[#1a1d24] rounded-2xl border border-gray-800 p-8 shadow-2xl flex flex-col md:flex-row items-center md:items-start gap-8 relative overflow-hidden">
        <div className="w-32 h-32 md:w-40 md:h-40 bg-[#0f1115] border-4 border-gray-800 rounded-2xl flex items-center justify-center shadow-xl shrink-0 overflow-hidden group">
          {team.avatar ? (
            <img src={team.avatar} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
          ) : (
            <span className="text-5xl font-black text-gray-800 uppercase">{team.name.charAt(0)}</span>
          )}
        </div>

        <div className="flex-1 text-center md:text-left z-10">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-2 uppercase">{team.name}</h1>

          <div className="flex items-center justify-center md:justify-start gap-2 mb-6">
            <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">CO-LINK:</span>
            <div className="flex items-center gap-2 bg-pink-600/5 border border-pink-500/20 px-3 py-1 rounded-full">
              <span className="text-xs font-black text-pink-500 uppercase tracking-tight">{team.captain?.name}</span>
              <span className="text-yellow-500 text-xs">👑</span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <div className="bg-[#0f1115] border border-gray-800 px-6 py-3 rounded-xl flex flex-col items-center">
              <span className="text-[10px] text-gray-600 font-black uppercase tracking-[0.2em]">Roster</span>
              <span className="text-xl font-black">{team.members?.length || 0}</span>
            </div>

            {isCaptain && (
              <button
                onClick={() => setIsAdding(!isAdding)}
                className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest transition-all text-[10px] shadow-[0_0_20px_rgba(37,99,235,0.2)]"
              >
                {isAdding ? 'Close Recruitment' : 'Recruit Operatives'}
              </button>
            )}
          </div>
        </div>
      </div>

      {isCaptain && isAdding && (
        <div className="bg-[#1a1d24] p-6 rounded-2xl border border-blue-500/20 animate-in fade-in slide-in-from-top-4">
          <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-4">Available for Dispatch</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {availablePlayers.map(player => (
              <button
                key={player.id}
                onClick={() => addMemberMutation.mutate(player.id)}
                disabled={addMemberMutation.isPending}
                className="flex items-center gap-3 p-3 bg-[#0f1115] rounded-xl border border-gray-800 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all text-left group"
              >
                <div className="w-8 h-8 rounded-lg bg-gray-900 border border-gray-800 overflow-hidden shrink-0">
                  {player.avatar && <img src={player.avatar} alt="" referrerPolicy="no-referrer" className="object-cover" />}
                </div>
                <span className="font-bold text-xs group-hover:text-blue-400 transition-colors">{player.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600">Active Roster</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {team.members?.map((member) => {
            const isMemberCaptain = member.id === team.captain?.id;

            return (
              <div
                key={member.id}
                className={`p-4 rounded-xl border transition-all flex items-center gap-4 group relative ${
                  isMemberCaptain
                    ? 'bg-pink-600/5 border-pink-500/20 shadow-[0_0_20px_rgba(219,39,119,0.05)]'
                    : 'bg-[#1a1d24] border-gray-800 hover:border-gray-700'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-gray-900 overflow-hidden shrink-0 border border-gray-800 shadow-inner">
                  {member.avatar ? (
                    <img src={member.avatar} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  ) : (
                    <span className="flex items-center justify-center h-full text-xs font-black text-gray-700">{member.name[0]}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-black uppercase text-xs truncate tracking-tighter ${isMemberCaptain ? 'text-pink-500' : 'text-white'}`}>
                    {member.name}
                  </p>
                  <p className="text-[9px] text-gray-600 uppercase font-black tracking-widest">
                    {isMemberCaptain ? 'Captain' : 'Operative'}
                  </p>
                </div>

                {isCaptain && !isMemberCaptain && (
                  <button
                    onClick={() => removeMemberMutation.mutate(member.id)}
                    disabled={removeMemberMutation.isPending}
                    className="opacity-0 group-hover:opacity-100 p-2 text-gray-600 hover:text-red-500 transition-all absolute right-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}

                {isMemberCaptain && <span className="text-xs">👑</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}