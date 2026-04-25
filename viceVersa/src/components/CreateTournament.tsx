import { useState} from "react";
import {useAuth0} from "@auth0/auth0-react";
import type { Participant, TournamentFormData } from "../types";

interface Props {
  onSubmit: (data: TournamentFormData) => void
  isSubmitting?: boolean
}

const MOCK_DB_TEAMS: Participant[] = [
  { id: 'team_1', name: 'Cloud9', isTeam: true, avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=C9', members: [{id: '1', name: 'Mango'}] },
  { id: 'team_2', name: 'Team Liquid', isTeam: true, avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=TL', members: [{id: '2', name: 'Hungrybox'}] },
  { id: 'team_3', name: 'FaZe Clan', isTeam: true, avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=FZ', members: [{id: '3', name: 'Sparg0'}] },
];
export function CreateTournament({ onSubmit, isSubmitting }: Props) {
  const { user, isAuthenticated } = useAuth0();
  const [name, setName] = useState("");
  const [game, setGame] = useState("");
  const [format, setFormat] = useState("single-elimination");

  const [entryType, setEntryType] = useState<'solo' | 'team'>('solo');
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [newParticipantName, setNewParticipantName] = useState("");
  const [selectedTeamId, setSelectedTeamId] = useState<string>("");


  const [hasInitializedUser, setHasInitializedUser] = useState(false);


  if (isAuthenticated && user?.sub && !hasInitializedUser) {
    setHasInitializedUser(true);
    if (entryType === 'solo' && participants.length === 0) {
      setParticipants([{
        id: user.sub,
        name: user.name || "Creator",
        avatar: user.picture,
        isTeam: false,
        members: []
      }]);
    }
  }

  const handleEntryTypeSwitch = (type: 'solo' | 'team') => {
    setEntryType(type);

    if (type === 'solo' && isAuthenticated && user?.sub) {
      setParticipants([{
        id: user.sub,
        name: user.name || "Creator",
        avatar: user.picture,
        isTeam: false,
        members: []
      }]);
    } else {
      setParticipants([]);
    }
  };

  const handleAddParticipant = () => {
    if (entryType === 'solo') {
      if (!newParticipantName.trim()) return;
      setParticipants([
        ...participants,
        {
          id: Date.now().toString(),
          name: newParticipantName.trim(),
          isTeam: false,
          members: []
        }
      ]);
      setNewParticipantName("");
    } else {
      if (!selectedTeamId) return;
      const teamToAdd = MOCK_DB_TEAMS.find(t => t.id === selectedTeamId);
      if (teamToAdd && !participants.some(p => p.id === teamToAdd.id)) {
        setParticipants([...participants, teamToAdd]);
      }
      setSelectedTeamId("");
    }
  };

  const removeParticipant = (idToRemove: string) => {
    setParticipants(participants.filter(p => p.id !== idToRemove));
  };

  const handleSubmitClick = () => {
    if (!name || !game || participants.length < 2) return;
    onSubmit({ name, game, format, entryType, participants });
  };

  const availableTeams = MOCK_DB_TEAMS.filter(t => !participants.some(p => p.id === t.id));

  return (
    <div className="bg-[#0f1115] text-white p-8 rounded-2xl w-full max-w-md mx-auto space-y-6 font-sans">

      <div className="flex bg-[#1a1d24] rounded-lg p-1">
        <button
          onClick={() => handleEntryTypeSwitch('solo')}
          className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${
            entryType === 'solo' ? 'bg-pink-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          1v1 Singles
        </button>
        <button
          onClick={() => handleEntryTypeSwitch('team')}
          className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${
            entryType === 'team' ? 'bg-pink-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          Team Bracket
        </button>
      </div>

      <div className="space-y-2">
        <label className="text-pink-500 text-sm font-semibold tracking-wider uppercase">Tournament Title</label>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Summer Showdown" className="w-full bg-[#1a1d24] border-none rounded-lg p-4 text-white outline-none focus:ring-2 focus:ring-pink-500" />
      </div>

      <div className="space-y-2">
        <label className="text-pink-500 text-sm font-semibold tracking-wider uppercase">Game</label>
        <input value={game} onChange={(e) => setGame(e.target.value)} placeholder="e.g. Super Smash Bros" className="w-full bg-[#1a1d24] border-none rounded-lg p-4 text-white outline-none focus:ring-2 focus:ring-pink-500" />
      </div>

      <div className="space-y-2">
        <label className="text-pink-500 text-sm font-semibold tracking-wider uppercase">Format</label>
        <select value={format} onChange={(e) => setFormat(e.target.value)} className="w-full bg-[#1a1d24] border-none rounded-lg p-4 text-white outline-none focus:ring-2 focus:ring-pink-500 appearance-none cursor-pointer">
          <option value="single-elimination">Single Elimination</option>
          <option value="double-elimination">Double Elimination</option>
          <option value="round-robin">Round Robin</option>
        </select>
      </div>

      <div className="space-y-4 pt-2">
        <label className="text-pink-500 text-sm font-semibold tracking-wider uppercase flex justify-between items-center">
          <span>{entryType === 'team' ? 'Teams' : 'Players'}</span>
          <span className="text-gray-400 text-xs">{participants.length} Added</span>
        </label>

        <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
          {participants.map((p) => (
            <div key={p.id} className="flex items-center justify-between bg-[#1a1d24] p-3 rounded-lg group border border-gray-800">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 flex items-center justify-center overflow-hidden bg-gray-700 ${p.isTeam ? 'rounded-md' : 'rounded-full'}`}>
                  {p.avatar ? (
                    <img src={p.avatar} alt={p.name} className="w-full h-full object-cover"/>
                  ) : (
                    <span className="text-xs font-bold text-white">{p.name.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-sm text-white">{p.name}</span>
                </div>
              </div>
              <button onClick={() => removeParticipant(p.id)} className="text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          {entryType === 'solo' ? (
            <input
              value={newParticipantName}
              onChange={(e) => setNewParticipantName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddParticipant();
                }
              }}
              placeholder="Add Player..."
              className="flex-1 bg-[#1a1d24] border-none rounded-lg p-3 text-white outline-none focus:ring-1 focus:ring-gray-500 text-sm"
            />
          ) : (
            <select
              value={selectedTeamId}
              onChange={(e) => setSelectedTeamId(e.target.value)}
              className="flex-1 bg-[#1a1d24] border-none rounded-lg p-3 text-white outline-none focus:ring-1 focus:ring-gray-500 text-sm appearance-none cursor-pointer"
            >
              <option value="" disabled>Select an existing team...</option>
              {availableTeams.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          )}

          <button
            onClick={handleAddParticipant}
            disabled={entryType === 'solo' ? !newParticipantName.trim() : !selectedTeamId}
            className="bg-[#2a2d35] px-4 rounded-lg font-bold text-sm hover:bg-gray-600 transition-colors disabled:opacity-50 text-white"
          >
            ADD
          </button>
        </div>
      </div>

      <button
        onClick={handleSubmitClick}
        disabled={isSubmitting || !name || !game || participants.length < 2}
        className="w-full bg-white text-black font-black text-xl py-4 rounded-lg mt-8 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'CREATING...' : 'START'}
      </button>
    </div>
  );
}