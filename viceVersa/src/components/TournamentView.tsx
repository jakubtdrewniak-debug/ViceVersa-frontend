import { useState } from "react";
import type { Participant } from "./CreateTournament.tsx";
import { BracketTree } from "./BracketTree.tsx"; // Make sure this path is correct!

export interface Match {
  id: string
  tournamentId: string | null
  round: number
  status: "Pending" | "In Progress" | "Completed"
  player1: Participant | null
  player2: Participant | null
  winnerId?: string
  score?: { p1: number; p2: number }
}

export interface TournamentDetails {
  id: string
  name: string
  game: string
  status: "Upcoming" | "Live" | "Completed"
  format: string
  entryType: "solo" | "team"
  participants: Participant[]
  matches: Match[]
}

interface Props {
  tournament: TournamentDetails
}

export function TournamentView({ tournament }: Props) {
  const [activeTab, setActiveTab] = useState<'bracket' | 'participants'>('bracket')

  return (
    <div className="bg-[#0f1115] text-white p-8 rounded-2xl w-full max-w-4xl mx-auto space-y-6 font-sans border border-[#1a1d24]">

      <div className="border-b border-[#1a1d24] pb-6">
        <div className="flex justify-between items-start mb-3">
          <h1 className="text-3xl font-black text-white">{tournament.name}</h1>
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
            tournament.status === 'Live' ? 'bg-green-500/20 text-green-400' :
              tournament.status === 'Completed' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-blue-500/20 text-blue-400'
          }`}>
            {tournament.status}
          </span>
        </div>
        <div className="flex gap-4 text-gray-400 text-sm font-medium">
          <span>🎮 {tournament.game}</span>
          <span>👥 {tournament.participants.length} {tournament.entryType === 'team' ? 'Teams' : 'Players'}</span>
          <span className="capitalize">🏆 {tournament.format.replace('-', ' ')}</span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-2 bg-[#1a1d24] p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('bracket')}
          className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${
            activeTab === 'bracket' ? 'bg-[#2a2d35] text-white shadow' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          Bracket
        </button>
        <button
          onClick={() => setActiveTab('participants')}
          className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${
            activeTab === 'participants' ? 'bg-[#2a2d35] text-white shadow' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          Roster
        </button>
      </div>

      {/* ========================================= */}
      {/* TAB CONTENT: BRACKET */}
      {/* ========================================= */}
      {activeTab === 'bracket' && (
        <div className="pt-4">
          {tournament.matches.length === 0 ? (
            <div className="text-center py-16 bg-[#1a1d24] rounded-xl border border-gray-800 flex flex-col items-center justify-center">
              <div className="text-4xl mb-3">⏳</div>
              <p className="text-gray-300 font-bold text-lg">Bracket is pending.</p>
              <p className="text-gray-500 text-sm mt-1 max-w-sm">
                Matches will appear here once the tournament organizer officially starts the event and generates the bracket.
              </p>
            </div>
          ) : (
            // Hand off the matches to our new horizontally scrolling BracketTree component!
            <BracketTree matches={tournament.matches} />
          )}
        </div>
      )}

      {/* ========================================= */}
      {/* TAB CONTENT: PARTICIPANTS ROSTER */}
      {/* ========================================= */}
      {activeTab === 'participants' && (
        <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {tournament.participants.map((p) => (
            <div key={p.id} className="bg-[#1a1d24] p-5 rounded-xl border border-gray-800 flex flex-col items-center text-center gap-3 hover:border-gray-600 transition-colors">

              <div className={`w-16 h-16 bg-gray-800 flex items-center justify-center overflow-hidden shadow-md ${p.isTeam ? 'rounded-xl' : 'rounded-full'}`}>
                {p.avatar ? (
                  <img src={p.avatar} alt={p.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xl font-bold">{p.name.charAt(0)}</span>
                )}
              </div>

              <div>
                <h3 className="font-bold text-sm text-white line-clamp-1">{p.name}</h3>
                {p.isTeam ? (
                  <p className="text-[10px] text-pink-500 uppercase font-bold tracking-wider mt-0.5">
                    {p.members?.length || 0} Members
                  </p>
                ) : (
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mt-0.5">
                    Solo Player
                  </p>
                )}
              </div>

              {p.isTeam && p.members && p.members.length > 0 && (
                <div className="flex -space-x-2 mt-1">
                  {p.members.map((m) => (
                    <div
                      key={m.id}
                      title={m.name}
                      className="w-6 h-6 rounded-full border-2 border-[#1a1d24] bg-gray-700 overflow-hidden shrink-0"
                    >
                      {m.avatar ? (
                        <img src={m.avatar} alt={m.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[8px] flex items-center justify-center h-full font-bold text-white">
                          {m.name.charAt(0)}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}