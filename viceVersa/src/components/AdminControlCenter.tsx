import { useState } from 'react'
import { MOCK_TEAMS, MOCK_HISTORY } from '../lib/mockData'

export function AdminControlCenter() {
  // Local state for all entities so we can "delete" them visually
  const [teams, setTeams] = useState(MOCK_TEAMS);
  const [history, setHistory] = useState(MOCK_HISTORY);
  const handleDeleteTeam = (id: string) => {
    if (confirm("Are you sure? This will disband the team and remove all members.")) {
      setTeams(prev => prev.filter(t => t.id !== id));
    }
  };

  const handleDeleteHistory = (id: string) => {
    if (confirm("Delete this historical record forever?")) {
      setHistory(prev => prev.filter(h => h.id !== id));
    }
  };

  return (
    <div className="space-y-12 pb-20">
      {/* 1. Teams Management */}
      <section className="space-y-4">
        <h2 className="text-xl font-black uppercase tracking-widest text-pink-500 flex items-center gap-2">
          <span className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></span>
          Manage Teams
        </h2>
        <div className="bg-[#0f1115] border border-gray-800 rounded-2xl overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#1a1d24] text-gray-400 font-bold uppercase text-[10px] tracking-widest">
            <tr>
              <th className="px-6 py-4">Team Name</th>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
            {teams.map(team => (
              <tr key={team.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-bold text-white">{team.name}</td>
                <td className="px-6 py-4 text-gray-500 font-mono text-xs">{team.id}</td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleDeleteTeam(team.id)}
                    className="text-red-500 hover:text-white hover:bg-red-600 px-3 py-1 rounded-md transition-all font-bold"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 2. Tournament & Match Management */}
      <section className="space-y-4">
        <h2 className="text-xl font-black uppercase tracking-widest text-blue-500 flex items-center gap-2">
          <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
          Manage Tournaments
        </h2>
        <div className="bg-[#0f1115] border border-gray-800 rounded-2xl overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#1a1d24] text-gray-400 font-bold uppercase text-[10px] tracking-widest">
            <tr>
              <th className="px-6 py-4">Event</th>
              <th className="px-6 py-4">Winner</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
            {history.map(item => (
              <tr key={item.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-bold text-white">{item.name}</td>
                <td className="px-6 py-4 text-gray-400">{item.winner.name}</td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleDeleteHistory(item.id)}
                    className="text-red-500 hover:text-white hover:bg-red-600 px-3 py-1 rounded-md transition-all font-bold"
                  >
                    Purge
                  </button>
                </td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}