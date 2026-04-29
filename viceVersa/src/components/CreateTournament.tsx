import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "react-toastify";
import { useApi } from "../hooks/useApi";
import type { UserDto, TeamDto, TournamentDto, EntryType } from "../types";

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
  const [entryType, setEntryType] = useState<EntryType>('SOLO'); // 🚀 Synced with Backend Enum Case

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
    if (isAuthenticated && user?.sub && entryType === 'SOLO' && participants.length === 0) {
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
        body: JSON.stringify({
          name,
          game,
          format,
          type: entryType
        }),
      });

      const participantIds = participants.map(p => p.id);
      return await callApi(`/tournaments/${newTournament.id}/start`, {
        method: "POST",
        body: JSON.stringify(participantIds),
      });
    },
    onSuccess: (data: TournamentDto) => {
      toast.success(`Operational: "${data.name}" is now LIVE.`);
      queryClient.invalidateQueries({ queryKey: ["tournaments"] });
      navigate({ to: `/tournament/${data.id}` });
    },
    onError: (err: Error) => {
      toast.error(`System Failure: ${err.message}`);
    }
  });

  const handleEntryTypeSwitch = (type: EntryType) => {
    setEntryType(type);
    setParticipants([]);
    setSelectedEntityId("");
  };

  const handleAddParticipant = () => {
    if (!selectedEntityId) return;
    let entityToAdd: TournamentParticipant | undefined;

    if (entryType === 'SOLO') {
      const u = users.find(user => user.id === selectedEntityId);
      if (u) entityToAdd = { id: u.id, name: u.name, avatar: u.avatar };
    } else {
      const t = teams.find(team => team.id === selectedEntityId);
      if (t) entityToAdd = { id: t.id, name: t.name, avatar: t.avatar };
    }

    if (!entityToAdd) return;
    if (participants.some(p => p.id === entityToAdd!.id)) {
      return toast.warn("Signature already detected in bracket.");
    }

    setParticipants([...participants, entityToAdd]);
    setSelectedEntityId("");
  };

  const removeParticipant = (idToRemove: string) => {
    setParticipants(participants.filter(p => p.id !== idToRemove));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return toast.warn("Designate a title for the operation.");
    if (participants.length < 2) return toast.warn("Insufficient participants for bracket generation.");
    launchTournament();
  };

  const isLoadingData = loadingUsers || loadingTeams;

  const availableOptions = entryType === 'SOLO'
    ? users.filter(u => !participants.some(p => p.id === u.id))
    : teams.filter(t => !participants.some(p => p.id === t.id));

  return (
    <form onSubmit={handleFormSubmit} className="bg-[#0f1115] text-white p-8 rounded-2xl w-full max-w-md mx-auto space-y-8 font-sans border border-[#1a1d24] shadow-2xl">

      <div className="text-center space-y-1">
        <h2 className="text-2xl font-black uppercase tracking-tighter">Host Operation</h2>
        <p className="text-[10px] text-pink-500 font-black tracking-[0.3em] uppercase">Bracket Configuration Utility</p>
      </div>

      <div className="flex bg-[#1a1d24] rounded-xl p-1 border border-gray-800 shadow-inner">
        {(['SOLO', 'TEAM'] as EntryType[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => handleEntryTypeSwitch(t)}
            className={`flex-1 py-2.5 rounded-lg text-[10px] font-black tracking-widest uppercase transition-all ${
              entryType === t
                ? (t === 'SOLO' ? 'bg-pink-600 text-white shadow-lg' : 'bg-blue-600 text-white shadow-lg')
                : 'text-gray-600 hover:text-white'
            }`}
          >
            {t === 'SOLO' ? '1v1 Singles' : 'Squad Brackets'}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-gray-500 text-[9px] font-black tracking-widest uppercase ml-1">Operation Title</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="E.G. NEON OPEN 2026"
            className="w-full bg-[#1a1d24] border border-gray-800 rounded-xl p-4 text-sm text-white font-bold outline-none focus:border-pink-500 transition-all placeholder:text-gray-700"
          />
        </div>

        <div className="space-y-2">
          <label className="text-gray-500 text-[9px] font-black tracking-widest uppercase ml-1">Simulated Game</label>
          <input
            value={game}
            onChange={(e) => setGame(e.target.value)}
            placeholder="E.G. VIRTUA FIGHTER"
            className="w-full bg-[#1a1d24] border border-gray-800 rounded-xl p-4 text-sm text-white font-bold outline-none focus:border-pink-500 transition-all placeholder:text-gray-700"
          />
        </div>

        <div className="space-y-2">
          <label className="text-gray-500 text-[9px] font-black tracking-widest uppercase ml-1">Elimination Logic</label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className="w-full bg-[#1a1d24] border border-gray-800 rounded-xl p-4 text-sm text-white font-bold outline-none focus:border-pink-500 appearance-none cursor-pointer"
          >
            <option value="single-elimination">SINGLE ELIMINATION</option>
            <option value="double-elimination" disabled>DOUBLE ELIMINATION (LOCKED)</option>
            <option value="round-robin" disabled>ROUND ROBIN (LOCKED)</option>
          </select>
        </div>
      </div>

      <div className="space-y-4 pt-6 border-t border-gray-800/30">
        <label className="text-[10px] font-black tracking-widest uppercase flex justify-between items-center">
          <span className="text-gray-500">{entryType === 'TEAM' ? 'Combat Squads' : 'Ranked Solos'}</span>
          <span className="text-pink-500">{participants.length} Manifested</span>
        </label>

        <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
          {participants.length === 0 && (
            <div className="text-[10px] text-gray-700 font-black uppercase text-center py-6 bg-[#0c0e12] rounded-xl border border-gray-800/50 italic">
              Manifest Empty.
            </div>
          )}
          {participants.map((p) => (
            <div key={p.id} className="flex items-center justify-between bg-[#1a1d24] p-3 rounded-xl group border border-gray-800 hover:border-pink-500/30 transition-all">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 flex items-center justify-center overflow-hidden bg-gray-900 border border-gray-800 ${entryType === 'TEAM' ? 'rounded-lg' : 'rounded-full'}`}>
                  {p.avatar ? (
                    <img src={p.avatar} alt={p.name} className="w-full h-full object-cover"/>
                  ) : (
                    <span className="text-[10px] font-black text-gray-700 uppercase">{p.name.charAt(0)}</span>
                  )}
                </div>
                <span className="font-black uppercase text-[11px] text-white tracking-tighter">{p.name}</span>
              </div>
              <button
                type="button"
                onClick={() => removeParticipant(p.id)}
                className="text-gray-700 hover:text-red-500 transition-colors p-2 font-black"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <select
            value={selectedEntityId}
            onChange={(e) => setSelectedEntityId(e.target.value)}
            disabled={isLoadingData}
            className="flex-1 bg-[#1a1d24] border border-gray-800 rounded-xl p-3 text-white font-bold outline-none focus:border-gray-600 text-xs appearance-none cursor-pointer disabled:opacity-30"
          >
            <option value="">
              {isLoadingData ? "SYNCING..." : `ADD ${entryType}...`}
            </option>
            {availableOptions.map(opt => (
              <option key={opt.id} value={opt.id}>{opt.name}</option>
            ))}
          </select>

          <button
            type="button"
            onClick={handleAddParticipant}
            disabled={!selectedEntityId}
            className="bg-gray-800 px-6 rounded-xl font-black text-[10px] uppercase hover:bg-gray-700 transition-all disabled:opacity-20 border border-gray-700"
          >
            ADD
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !name || participants.length < 2}
        className="w-full bg-pink-600 text-white font-black text-sm tracking-[0.2em] py-5 rounded-2xl mt-8 hover:bg-pink-500 transition-all shadow-[0_0_30px_rgba(219,39,119,0.2)] disabled:opacity-30 disabled:grayscale uppercase"
      >
        {isSubmitting ? 'GENERATING BRACKET...' : 'INITIALIZE OPERATION'}
      </button>
    </form>
  );
}