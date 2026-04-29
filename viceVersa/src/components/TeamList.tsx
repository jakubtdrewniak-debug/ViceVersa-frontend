import { Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useAuth0 } from '@auth0/auth0-react'
import { useApi } from '../hooks/useApi'
import type { TeamDto } from '../types'

interface TeamListProps {
  filter: 'all' | 'myTeams'
}

export function TeamList({ filter }: TeamListProps) {
  const { callApi } = useApi()
  const { user, isAuthenticated } = useAuth0()

  const { data: teams = [], isLoading, error } = useQuery<TeamDto[]>({
    queryKey: ['teams'],
    queryFn: () => callApi('/teams'),
  })

  const displayedTeams = teams.filter(team => {
    if (filter === 'all') return true
    if (!isAuthenticated || !user?.sub) return false

    return team.members?.some(member => member.id === user.sub)
  })

  if (isLoading) {
    return (
      <div className="flex justify-center p-20">
        <div className="text-pink-500 font-black animate-pulse uppercase tracking-[0.3em]">
          Scanning Roster Database...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-900/10 border border-red-500/20 p-8 rounded-xl text-center">
        <p className="text-red-500 font-bold uppercase text-xs tracking-widest">
          Failed to fetch teams.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 text-white">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white uppercase">
            {filter === 'myTeams' ? 'Personal Squads' : 'Global Directory'}
          </h1>
          <p className="text-gray-500 font-medium mt-1">
            {filter === 'myTeams'
              ? 'Tactical units where your signature is detected.'
              : 'Browse the full index of registered combat teams.'}
          </p>
        </div>

        <div className="flex bg-[#1a1d24] p-1 rounded-lg border border-gray-800 shrink-0 shadow-lg">
          <Link
            to="/teams"
            search={{ filter: 'all' }}
            className={`px-6 py-2 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${
              filter === 'all' ? 'bg-pink-600 text-white shadow-[0_0_15px_rgba(219,39,119,0.4)]' : 'text-gray-500 hover:text-white'
            }`}
          >
            All Teams
          </Link>
          <Link
            to="/teams"
            search={{ filter: 'myTeams' }}
            className={`px-6 py-2 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${
              filter === 'myTeams' ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]' : 'text-gray-500 hover:text-white'
            }`}
          >
            My Teams
          </Link>
        </div>
      </div>

      {displayedTeams.length === 0 ? (
        <div className="bg-[#0f1115] p-16 rounded-2xl border border-gray-800/50 text-center shadow-2xl">
          <p className="text-gray-600 font-bold uppercase tracking-widest text-sm">
            {filter === 'myTeams' ? 'No active team affiliations found' : 'No teams registered in this sector'}
          </p>
          {filter === 'myTeams' && (
            <Link
              to="/teams"
              search={{ filter: 'all' }}
              className="text-pink-500 hover:text-pink-400 mt-4 block text-[10px] font-black uppercase tracking-[0.2em] transition-colors"
            >
              You are not alone! Ask the captain of one of the teams to join them! ...Or make your own
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayedTeams.map(team => (
            <div
              key={team.id}
              className="bg-[#1a1d24] border border-gray-800 rounded-2xl p-6 hover:border-pink-500/50 transition-all group flex flex-col justify-between hover:shadow-[0_0_30px_rgba(0,0,0,0.4)]"
            >
              <div className="flex items-center gap-5 mb-8">
                <div className="w-20 h-20 bg-[#0f1115] rounded-2xl flex items-center justify-center overflow-hidden shrink-0 shadow-inner border border-gray-800 group-hover:border-pink-500/30 transition-colors">
                  {team.avatar ? (
                    <img src={team.avatar} alt={team.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl font-black text-gray-700 uppercase">{team.name.charAt(0)}</span>
                  )}
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white group-hover:text-pink-500 transition-colors tracking-tight">
                    {team.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                      {team.members?.length || 0} Operators Active
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-gray-800/50 pt-5">
                <div className="flex -space-x-3">
                  {team.members?.slice(0, 4).map((member, i) => (
                    <div
                      key={member.id}
                      title={member.name}
                      className="w-10 h-10 rounded-full border-2 border-[#1a1d24] bg-gray-900 flex items-center justify-center overflow-hidden shadow-lg transition-transform hover:-translate-y-1"
                      style={{ zIndex: 40 - i }}
                    >
                      {member.avatar ? (
                        <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[10px] font-black text-gray-500">{member.name.charAt(0)}</span>
                      )}
                    </div>
                  ))}
                  {(team.members?.length || 0) > 4 && (
                    <div className="w-10 h-10 rounded-full border-2 border-[#1a1d24] bg-[#0f1115] flex items-center justify-center z-0 shadow-lg">
                      <span className="text-[10px] font-black text-pink-500">+{team.members!.length - 4}</span>
                    </div>
                  )}
                </div>

                <Link
                  to="/team/$teamId"
                  params={{ teamId: team.id }}
                  className="text-[10px] font-black uppercase tracking-widest bg-[#0f1115] hover:bg-pink-600 text-gray-400 hover:text-white px-5 py-2.5 rounded-xl transition-all border border-gray-800 hover:border-pink-500 shadow-lg"
                >
                  Inspect Roster
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}