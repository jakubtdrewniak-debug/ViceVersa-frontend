import { useState } from 'react'
import {MOCK_CAPTAIN, MOCK_SOLOS} from '../lib/mockData'
import type { Participant, User } from '../types'

interface TeamViewProps {
  team: Participant
}

export function TeamView({ team }: TeamViewProps) {
  const MY_MOCK_ID = MOCK_CAPTAIN.id;
  const isCaptain = team.captain?.id === MY_MOCK_ID;

  const [roster, setRoster] = useState<User[]>(team.members || []);
  const [isAdding, setIsAdding] = useState(false);

  const handleRemoveMember = (userId: string) => {
    if (userId === team.captain?.id) {
      alert("You are the captain! You can't remove yourself. You must transfer captaincy first.");
      return;
    }
    setRoster(prev => prev.filter(m => m.id !== userId));
  };

  const handleAddMember = (user: User) => {
    if (roster.some(m => m.id === user.id)) return;
    setRoster(prev => [...prev, user]);
    setIsAdding(false);
  };

  const availablePlayers = MOCK_SOLOS.filter(
    solo => !roster.some(member => member.id === solo.id)
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-white font-sans">

      <div className="bg-[#1a1d24] rounded-2xl border border-gray-800 p-8 shadow-2xl flex flex-col md:flex-row items-center md:items-start gap-8">
        <div className="w-32 h-32 md:w-40 md:h-40 bg-[#0f1115] border-4 border-gray-800 rounded-2xl flex items-center justify-center shadow-xl shrink-0 overflow-hidden">
          {team.avatar ? (
            <img src={team.avatar} alt={team.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-5xl font-black text-gray-500">{team.name.charAt(0)}</span>
          )}
        </div>

        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">{team.name}</h1>

          <div className="flex items-center justify-center md:justify-start gap-2 mb-6">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Captain:</span>
            <div className="flex items-center gap-2 bg-pink-600/10 border border-pink-500/20 px-3 py-1 rounded-full">
              <span className="text-sm font-bold text-pink-500">{team.captain?.name}</span>
              <span className="text-yellow-500 text-xs">👑</span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <div className="bg-[#0f1115] border border-gray-800 px-6 py-3 rounded-xl flex flex-col items-center">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Roster Size</span>
              <span className="text-xl font-black">{roster.length}</span>
            </div>

            {isCaptain && (
              <button
                onClick={() => setIsAdding(!isAdding)}
                className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest transition-colors text-sm shadow-[0_0_15px_rgba(37,99,235,0.3)]"
              >
                {isAdding ? 'Cancel' : '+ Add Member'}
              </button>
            )}
          </div>
        </div>
      </div>

      {isCaptain && isAdding && (
        <div className="bg-[#1a1d24] p-6 rounded-2xl border-2 border-blue-500/30 animate-in fade-in slide-in-from-top-4 duration-300">
          <h3 className="text-sm font-bold text-blue-400 uppercase tracking-widest mb-4">Recruit New Member</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {availablePlayers.map(player => (
              <button
                key={player.id}
                onClick={() => handleAddMember(player)}
                className="flex items-center gap-3 p-3 bg-[#0f1115] rounded-xl border border-gray-800 hover:border-blue-500 transition-all text-left"
              >
                <div className="w-8 h-8 rounded-full bg-gray-700 overflow-hidden">
                  {player.avatar && <img src={player.avatar} alt={player.name} />}
                </div>
                <span className="font-bold text-sm">{player.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-2xl font-black tracking-tight">Active Members</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {roster.map((member) => {
            const isMemberCaptain = member.id === team.captain?.id;

            return (
              <div
                key={member.id}
                className={`p-4 rounded-xl border transition-all flex items-center gap-4 group ${
                  isMemberCaptain
                    ? 'bg-pink-600/5 border-pink-500/30 shadow-[0_0_15px_rgba(219,39,119,0.1)]'
                    : 'bg-[#1a1d24] border-gray-800 hover:border-gray-700'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-gray-800 overflow-hidden shrink-0 border border-gray-700">
                  {member.avatar ? (
                    <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="flex items-center justify-center h-full text-xs font-bold">{member.name[0]}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-bold truncate ${isMemberCaptain ? 'text-pink-400' : 'text-white'}`}>
                    {member.name}
                  </p>
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">
                    {isMemberCaptain ? 'Team Captain' : 'Member'}
                  </p>
                </div>

                {isCaptain && !isMemberCaptain && (
                  <button
                    onClick={() => handleRemoveMember(member.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-gray-500 hover:text-red-500 transition-all"
                    title="Remove Member"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}

                {isMemberCaptain && <span className="text-lg">👑</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}