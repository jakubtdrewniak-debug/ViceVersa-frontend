import { Link } from '@tanstack/react-router'
import { MOCK_TEAMS, MOCK_SOLOS } from '../lib/mockData'
import type { Participant } from '../types'

interface TeamListProps {
  filter: 'all' | 'myTeams'
}

export function TeamList({ filter }: TeamListProps) {
  const MY_MOCK_ID = MOCK_SOLOS[0].id

  const displayedTeams: Participant[] = filter === 'myTeams'
    ? MOCK_TEAMS.filter(team => team.members?.some(member => member.id === MY_MOCK_ID))
    : MOCK_TEAMS

  return (
    <div className="max-w-5xl mx-auto space-y-8 text-white">

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white">
            {filter === 'myTeams' ? 'My Teams' : 'Team Directory'}
          </h1>
          <p className="text-gray-400 mt-1">
            {filter === 'myTeams' ? 'The squads you are currently a part of.' : 'Browse all registered teams and rosters.'}
          </p>
        </div>

        <div className="flex bg-[#1a1d24] p-1 rounded-lg border border-gray-800 shrink-0">
          <Link
            to="/teams"
            search={{ filter: 'all' }}
            className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${filter === 'all' ? 'bg-pink-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
          >
            All Teams
          </Link>
          <Link
            to="/teams"
            search={{ filter: 'myTeams' }}
            className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${filter === 'myTeams' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
          >
            My Teams
          </Link>
        </div>
      </div>

      {displayedTeams.length === 0 ? (
        <div className="bg-[#1a1d24] p-12 rounded-xl border border-gray-800 text-center shadow-xl">
          <p className="text-gray-500 font-medium">No teams found.</p>
          {filter === 'myTeams' && (
            <Link to="/teams" search={{ filter: 'all' }} className="text-blue-500 hover:underline mt-2 block text-sm font-bold">
              Browse all teams to join one
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayedTeams.map(team => (
            <div
              key={team.id}
              className="bg-[#1a1d24] border border-gray-800 rounded-xl p-6 hover:border-pink-500/50 transition-all group flex flex-col justify-between"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gray-800 rounded-xl flex items-center justify-center overflow-hidden shrink-0 shadow-lg group-hover:scale-105 transition-transform">
                  {team.avatar ? (
                    <img src={team.avatar} alt={team.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-black text-gray-400">{team.name.charAt(0)}</span>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-black text-white group-hover:text-pink-400 transition-colors">
                    {team.name}
                  </h3>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">
                    {team.members.length} Members
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-gray-800 pt-4">
                <div className="flex -space-x-2">
                  {team.members.slice(0, 4).map((member, i) => (
                    <div key={member.id} className={`w-8 h-8 rounded-full border-2 border-[#1a1d24] bg-gray-700 flex items-center justify-center overflow-hidden z-[${4-i}]`}>
                      {member.avatar ? (
                        <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[10px] font-bold text-white">{member.name.charAt(0)}</span>
                      )}
                    </div>
                  ))}
                  {team.members.length > 4 && (
                    <div className="w-8 h-8 rounded-full border-2 border-[#1a1d24] bg-gray-800 flex items-center justify-center z-0">
                      <span className="text-[10px] font-bold text-gray-400">+{team.members.length - 4}</span>
                    </div>
                  )}
                </div>

                <Link
                  to="/team/$teamId"
                  params={{ teamId: team.id }}
                  className="text-xs font-bold bg-[#0f1115] hover:bg-gray-800 text-gray-300 px-4 py-2 rounded-lg transition-colors border border-gray-800 hover:border-pink-500/50"
                >
                  View Team
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}