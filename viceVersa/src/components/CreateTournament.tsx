import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "react-toastify";
import { useApi } from "../hooks/useApi";
import type { UserDto, TeamDto, TournamentDto } from "../types";

interface TournamentParticipant {
  id: string;
  name: string;
  avatar?: string;
}

export function CreateTournament() {
  const { user, isAuthenticated } = useAuth0();
  const { callApi } = useApi();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [game, setGame] = useState("");
  const [format, setFormat] = useState("single-elimination");
  const [entryType, setEntryType] = useState<'solo' | 'team'>('solo');

  const [participants, setParticipants] = useState<TournamentParticipant[]>([]);
  const [selectedEntityId, setSelectedEntityId] = useState<string>("");

  const { data: users = [], isLoading: loadingUsers } = useQuery<UserDto[]>({
    queryKey: ["users"],
    queryFn: () => callApi("/users"),
  });

  const { data: teams = [], isLoading: loadingTeams } = useQuery<TeamDto[]>({
    queryKey: ["teams"],
    queryFn: () => callApi("/teams"),
  });

  useEffect(() => {
    if (isAuthenticated && user?.sub && entryType === 'solo' && participants.length === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setParticipants([{
        id: user.sub,
        name: user.name || "Creator",
        avatar: user.picture,
      }]);
    }
  }, [isAuthenticated, user, entryType, participants.length]);

  const { mutate: launchTournament, isPending: isSubmitting } = useMutation({
    mutationFn: async () => {
      const newTournament: TournamentDto = await callApi("/tournaments", {
        method: "POST",
        body: JSON.stringify({ name, game, format, entryType }),
      });

      const participantIds = participants.map(p => p.id);

      const startedTournament: TournamentDto = await callApi(`/tournaments/${newTournament.id}/start`, {
        method: "POST",
        body: JSON.stringify(participantIds),
      });

      return startedTournament;
    },
    onSuccess: (data) => {
      toast.success(`Tournament "${data.name}" is officially LIVE!`);
      queryClient.invalidateQueries({ queryKey: ["tournaments"] });
      navigate({ to: `/tournament/${data.id}` }); // Assuming you have a bracket view
    },
    onError: (err: Error) => {
      toast.error(`Initialization Failed: ${err.message}`);
    }
  });

  const handleEntryTypeSwitch = (type: 'solo' | 'team') => {
    setEntryType(type);
    setParticipants([]);
    setSelectedEntityId("");
  };

  const handleAddParticipant = () => {
    if (!selectedEntityId) return;

    let entityToAdd: TournamentParticipant | undefined;

    if (entryType === 'solo') {
      const u = users.find(user => user.id === selectedEntityId);
      if (u) entityToAdd = { id: u.id, name: u.name, avatar: u.avatar };
    } else {
      const t = teams.find(team => team.id === selectedEntityId);
      if (t) entityToAdd = { id: t.id, name: t.name };
    }

    if (!entityToAdd) return;

    if (participants.some(p => p.id === entityToAdd!.id)) {
      return toast.warn("Already registered in the bracket!");
    }

    setParticipants([...participants, entityToAdd]);
    setSelectedEntityId("");
  };

  const removeParticipant = (idToRemove: string) => {
    setParticipants(participants.filter(p => p.id !== idToRemove));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return toast.warn("Tournament requires a title.");
    if (!game.trim()) return toast.warn("Specify the game being played.");
    if (participants.length < 2) return toast.warn("Need at least 2 participants to start a bracket.");

    launchTournament();
  };

  const isLoadingData = loadingUsers || loadingTeams;

  const availableOptions = entryType === 'solo'
    ? users.filter(u => !participants.some(p => p.id === u.id))
    : teams.filter(t => !participants.some(p => p.id === t.id));

  return (
    <form onSubmit={handleFormSubmit} className="bg-[#0f1115] text-white p-8 rounded-2xl w-full max-w-md mx-auto space-y-8 font-sans border border-[#1a1d24] shadow-2xl">

      <div className="text-center space-y-1">
        <h2 className="text-2xl font-black uppercase tracking-tight">Host Tournament</h2>
        <p className="text-[10px] text-pink-500 font-bold tracking-[0.2em] uppercase">Configure Bracket Rules</p>
      </div>

      <div className="flex bg-[#1a1d24] rounded-lg p-1 border border-gray-800">
        <button
          type="button"
          onClick={() => handleEntryTypeSwitch('solo')}
          className={`flex-1 py-2 rounded-md text-xs font-black tracking-widest uppercase transition-all ${
            entryType === 'solo' ? 'bg-pink-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'
          }`}
        >
          1v1 Singles
        </button>
        <button
          type="button"
          onClick={() => handleEntryTypeSwitch('team')}
          className={`flex-1 py-2 rounded-md text-xs font-black tracking-widest uppercase transition-all ${
            entryType === 'team' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'
          }`}
        >
          Team Bracket
        </button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-pink-500 text-[10px] font-black tracking-widest uppercase">Event Title</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Summer Showdown"
            className="w-full bg-[#1a1d24] border border-gray-800 rounded-lg p-3 text-white outline-none focus:border-pink-500 transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label className="text-pink-500 text-[10px] font-black tracking-widest uppercase">Game</label>
          <input
            value={game}
            onChange={(e) => setGame(e.target.value)}
            placeholder="e.g. Super Smash Bros"
            className="w-full bg-[#1a1d24] border border-gray-800 rounded-lg p-3 text-white outline-none focus:border-pink-500 transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label className="text-pink-500 text-[10px] font-black tracking-widest uppercase">Bracket Format</label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className="w-full bg-[#1a1d24] border border-gray-800 rounded-lg p-3 text-white outline-none focus:border-pink-500 appearance-none cursor-pointer"
          >
            <option value="single-elimination">Single Elimination</option>
            <option value="double-elimination">Double Elimination</option>
            <option value="round-robin">Round Robin</option>
          </select>
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-gray-800/50">
        <label className="text-pink-500 text-[10px] font-black tracking-widest uppercase flex justify-between items-center">
          <span>{entryType === 'team' ? 'Registered Teams' : 'Registered Players'}</span>
          <span className="text-gray-500">{participants.length} Entries</span>
        </label>

        <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
          {participants.length === 0 && (
            <p className="text-xs text-gray-600 italic text-center py-4 bg-[#1a1d24] rounded-lg border border-gray-800">Bracket is empty.</p>
          )}
          {participants.map((p) => (
            <div key={p.id} className="flex items-center justify-between bg-[#1a1d24] p-3 rounded-lg group border border-gray-800 hover:border-pink-500/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 flex items-center justify-center overflow-hidden bg-gray-800 border border-gray-700 ${entryType === 'team' ? 'rounded-md' : 'rounded-full'}`}>
                  {p.avatar ? (
                    <img src={p.avatar} alt="" className="w-full h-full object-cover"/>
                  ) : (
                    <span className="text-[10px] font-black text-white uppercase">{p.name.charAt(0)}</span>
                  )}
                </div>
                <span className="font-bold text-sm text-white">{p.name}</span>
              </div>
              <button type="button" onClick={() => removeParticipant(p.id)} className="text-gray-600 hover:text-red-500 transition-colors px-2">✕</button>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <select
            value={selectedEntityId}
            onChange={(e) => setSelectedEntityId(e.target.value)}
            disabled={isLoadingData}
            className="flex-1 bg-[#1a1d24] border border-gray-800 rounded-lg p-3 text-white outline-none focus:border-gray-500 text-sm appearance-none cursor-pointer disabled:opacity-50"
          >
            <option value="">
              {isLoadingData ? "Syncing DB..." : `Select ${entryType === 'solo' ? 'Player' : 'Team'}...`}
            </option>
            {availableOptions.map(opt => (
              <option key={opt.id} value={opt.id}>{opt.name}</option>
            ))}
          </select>

          <button
            type="button"
            onClick={handleAddParticipant}
            disabled={!selectedEntityId}
            className="bg-gray-800 px-4 rounded-lg font-black text-[10px] uppercase hover:bg-gray-700 transition-colors disabled:opacity-30"
          >
            ADD
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !name || !game || participants.length < 2}
        className="w-full bg-pink-600 text-white font-black text-lg py-4 rounded-xl mt-8 hover:bg-pink-500 transition-all shadow-[0_0_20px_rgba(219,39,119,0.3)] disabled:opacity-50 disabled:grayscale"
      >
        {isSubmitting ? 'GENERATING BRACKET...' : 'INITIALIZE TOURNAMENT'}
      </button>
    </form>
  );
}