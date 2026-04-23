import {useEffect, useState} from "react";
import {useAuth0} from "@auth0/auth0-react";

export interface Player {
  id: string
  name: string
  avatar?: string
}

export interface TournamentFormData {
  name: string
  game: string
  format: string
  players: Player[]
}

interface Props {
  onSubmit: (data: TournamentFormData) => void
  isSubmitting?: boolean
}

export function CreateTournament({onSubmit, isSubmitting}: Props) {
  const {user, isAuthenticated} = useAuth0()
  const [name, setName] = useState("")
  const [game, setGame] = useState("")
  const [format, setFormat] = useState("single-elimination")
  const [players, setPlayers] = useState<Player[]>([])
  const [newPlayerName, setNewPlayerName] = useState("")

  useEffect(() => {
    if (isAuthenticated && user?.name && user.sub && players.length === 0) {
      setPlayers([{id: user.sub, name: user.name, avatar: user.picture}])
    }
  }, [isAuthenticated, user, players.length])

  const handleAddPlayer = () => {
    if (!newPlayerName.trim()) return;
    setPlayers([
      ...players,
      {id: Date.now().toString(), name: newPlayerName.trim()}
    ]);
    setNewPlayerName("");
  };

  const handleKeyDown = (e: React.KeyboardEvent)=> {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddPlayer();
    }
  };

  const removePlayer = (idToRemove: string) => {
    setPlayers(players.filter(p => p.id !== idToRemove))
  };

  const handleSubmitClick = () => {
    if (!name || !game || players.length < 2) return;
    onSubmit({name, game, format, players});
  };

  return (
    <div className="bg-[#0f1115] text-white p-8 rounded-2xl w-full max-w-md mx-auto space-y-6 font-sans">

      {/* Tournament Title */}
      <div className="space-y-2">
        <label className="text-pink-500 text-sm font-semibold tracking-wider uppercase">
          Tournament Title
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Tekken 8 Locals"
          className="w-full bg-[#1a1d24] border-none rounded-lg p-4 text-white outline-none focus:ring-2 focus:ring-pink-500 transition-all placeholder-gray-500"
        />
      </div>

      {/* Game Selection */}
      <div className="space-y-2">
        <label className="text-pink-500 text-sm font-semibold tracking-wider uppercase">
          Game
        </label>
        <input
          value={game}
          onChange={(e) => setGame(e.target.value)}
          placeholder="e.g. Super Smash Bros"
          className="w-full bg-[#1a1d24] border-none rounded-lg p-4 text-white outline-none focus:ring-2 focus:ring-pink-500 transition-all placeholder-gray-500"
        />
      </div>

      <div className="space-y-2">
        <label className="text-pink-500 text-sm font-semibold tracking-wider uppercase">
          Format
        </label>
        <select
          value={format}
          onChange={(e) => setFormat(e.target.value)}
          className="w-full bg-[#1a1d24] border-none rounded-lg p-4 text-white outline-none focus:ring-2 focus:ring-pink-500 transition-all appearance-none cursor-pointer"
        >
          <option value="single-elimination">Single Elimination</option>
          <option value="double-elimination">Double Elimination</option>
          <option value="round-robin">Round Robin</option>
        </select>
      </div>

      <div className="space-y-4 pt-2">
        <label
          className="text-pink-500 text-sm font-semibold tracking-wider uppercase flex justify-between items-center">
          <span>Players</span>
          <span className="text-gray-400 text-xs">{players.length} Added</span>
        </label>

        <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
          {players.map((p) => (
            <div key={p.id} className="flex items-center justify-between bg-[#1a1d24] p-3 rounded-lg group">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-700 overflow-hidden flex items-center justify-center">
                  {p.avatar ? (
                    <img src={p.avatar} alt={p.name} className="w-full h-full object-cover"/>
                  ) : (
                    <span className="text-xs font-bold">{p.name.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <span className="font-medium">{p.name}</span>
              </div>
              <button
                onClick={() => removePlayer(p.id)}
                className="text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add Player..."
            className="flex-1 bg-[#1a1d24] border-none rounded-lg p-3 text-white outline-none focus:ring-1 focus:ring-gray-500 text-sm placeholder-gray-500"
          />
          <button
            onClick={handleAddPlayer}
            disabled={!newPlayerName.trim()}
            className="bg-[#2a2d35] px-4 rounded-lg font-bold text-sm hover:bg-gray-600 transition-colors disabled:opacity-50"
          >
            ADD
          </button>
        </div>
      </div>

      <button
        onClick={handleSubmitClick}
        disabled={isSubmitting || !name || !game || players.length < 2}
        className="w-full bg-white text-black font-black text-xl py-4 rounded-lg mt-8 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'CREATING...' : 'START'}
      </button>
    </div>
  );
}