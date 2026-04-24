import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import type {User} from "./CreateTournament.tsx";

export interface TeamFormData {
  name: string;
  members: User[];
}

interface Props {
  onSubmit: (data: TeamFormData) => void;
  isSubmitting?: boolean;
}

export function CreateTeamForm({ onSubmit, isSubmitting }: Props) {
  const { user, isAuthenticated } = useAuth0();
  const [teamName, setTeamName] = useState("");
  const [members, setMembers] = useState<User[]>([]);
  const [newMemberName, setNewMemberName] = useState("");

  useEffect(() => {
    if (isAuthenticated && user?.name && user.sub && members.length === 0) {
      setMembers([{ id: user.sub, name: user.name, avatar: user.picture}]);
    }
  }, [isAuthenticated, user, members.length]);

  const handleAddMember = () => {
    if (!newMemberName.trim()) return;
    setMembers([
      ...members,
      { id: `user_${Date.now()}`, name: newMemberName.trim() } // In a real app, this would search existing DB users
    ]);
    setNewMemberName("");
  };

  const removeMember = (idToRemove: string) => {
    setMembers(members.filter(m => m.id !== idToRemove));
  };

  const handleSubmitClick = () => {
    if (!teamName || members.length < 1) return;
    onSubmit({ name: teamName, members });
  };

  return (
    <div className="bg-[#0f1115] text-white p-8 rounded-2xl w-full max-w-md mx-auto space-y-6 font-sans border border-[#1a1d24]">

      <div className="text-center mb-6">
        <h2 className="text-2xl font-black tracking-tight">Create a Team</h2>
        <p className="text-gray-400 text-sm mt-1">Build your roster to enter tournaments.</p>
      </div>

      <div className="space-y-2">
        <label className="text-pink-500 text-sm font-semibold tracking-wider uppercase">Team Name</label>
        <input
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          placeholder="e.g. Cloud9, Team Liquid"
          className="w-full bg-[#1a1d24] border-none rounded-lg p-4 text-white outline-none focus:ring-2 focus:ring-pink-500"
        />
      </div>

      <div className="space-y-4 pt-2">
        <label className="text-pink-500 text-sm font-semibold tracking-wider uppercase flex justify-between items-center">
          <span>Roster</span>
          <span className="text-gray-400 text-xs">{members.length} Members</span>
        </label>

        <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
          {members.map((m, index) => (
            <div key={m.id} className="flex items-center justify-between bg-[#1a1d24] p-3 rounded-lg group">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
                  {m.avatar ? (
                    <img src={m.avatar} alt={m.name} className="w-full h-full object-cover"/>
                  ) : (
                    <span className="text-xs font-bold text-white">{m.name.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-sm">{m.name}</span>
                  {index === 0 && <span className="text-[10px] text-yellow-500 uppercase font-bold tracking-wider">Captain</span>}
                </div>
              </div>

              {index !== 0 && (
                <button onClick={() => removeMember(m.id)} className="text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
              )}
            </div>
          ))}
        </div>

        {/* Add Member Input */}
        <div className="flex gap-2 mt-4">
          <input
            value={newMemberName}
            onChange={(e) => setNewMemberName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddMember();
              }
            }}
            placeholder="Add player by name..."
            className="flex-1 bg-[#1a1d24] border-none rounded-lg p-3 text-white outline-none focus:ring-1 focus:ring-gray-500 text-sm"
          />
          <button
            onClick={handleAddMember}
            disabled={!newMemberName.trim()}
            className="bg-[#2a2d35] px-4 rounded-lg font-bold text-sm hover:bg-gray-600 transition-colors disabled:opacity-50"
          >
            ADD
          </button>
        </div>
      </div>

      <button
        onClick={handleSubmitClick}
        disabled={isSubmitting || !teamName || members.length < 1}
        className="w-full bg-white text-black font-black text-xl py-4 rounded-lg mt-8 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'SAVING...' : 'REGISTER TEAM'}
      </button>
    </div>
  );
}