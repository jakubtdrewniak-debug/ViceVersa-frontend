import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useApi } from "../hooks/useApi";
import { BracketTree } from "./BracketTree";
import type { TournamentDto, ParticipantDto } from "../types";

interface Props {
  tournamentId: string;
}

export function TournamentView({ tournamentId }: Props) {
  const { callApi } = useApi();
  const [activeTab, setActiveTab] = useState<'bracket' | 'participants'>('bracket');


  const { data: tournament, isLoading: loadingTourney, error: tourneyError } = useQuery<TournamentDto>({
    queryKey: ["tournament", tournamentId],
    queryFn: () => callApi(`/tournaments/${tournamentId}`),
  });


  const { data: participants = [], isLoading: loadingParts, error: partsError } = useQuery<ParticipantDto[]>({
    queryKey: ["tournament", tournamentId, "participants"],
    queryFn: () => callApi(`/tournaments/${tournamentId}/participants`),
  });

  if (loadingTourney || loadingParts) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-pink-500 font-black animate-pulse tracking-widest uppercase">
          SYNCING BRACKET DATA...
        </div>
      </div>
    );
  }


  if (tourneyError || partsError) {
    return (
      <div className="text-center p-10 text-red-500 font-bold bg-[#1a1d24] rounded-2xl border border-red-500/20 max-w-2xl mx-auto mt-10">
        <p className="text-2xl mb-4">🚨 Connection Failed</p>
        <div className="text-sm text-gray-400 space-y-2 text-left bg-[#0f1115] p-4 rounded-lg font-mono">
          <p><strong>Target ID:</strong> {tournamentId || "UNDEFINED (Routing Issue!)"}</p>
          <p><strong>Tournament Error:</strong> {tourneyError ? tourneyError.message : "None"}</p>
          <p><strong>Participants Error:</strong> {partsError ? partsError.message : "None"}</p>
        </div>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="text-center p-10 text-red-500 font-bold bg-[#1a1d24] rounded-2xl">
        Tournament data could not be found.
      </div>
    );
  }

  const matches = tournament.matches || [];

  return (
    <div className="bg-[#0f1115] text-white p-8 rounded-2xl w-full max-w-5xl mx-auto space-y-6 font-sans border border-[#1a1d24] shadow-2xl">


      <div className="border-b border-gray-800 pb-6">
        <div className="flex justify-between items-start mb-3">
          <h1 className="text-3xl font-black text-white tracking-tight uppercase">{tournament.name}</h1>
          <span className={`px-3 py-1 rounded text-[10px] font-black uppercase tracking-[0.2em] border ${
            tournament.status === 'LIVE' ? 'bg-pink-500/10 text-pink-500 border-pink-500/20' :
              tournament.status === 'COMPLETED' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                'bg-blue-500/10 text-blue-400 border-blue-500/20'
          }`}>
            {tournament.status || 'PENDING'}
          </span>
        </div>

        <div className="flex gap-6 text-gray-400 text-xs font-black tracking-widest uppercase">
          <span className="flex items-center gap-2"><span className="text-pink-500">🎮</span> {tournament.game}</span>
          <span className="flex items-center gap-2"><span className="text-blue-500">👥</span> {participants.length} Entries</span>
          {tournament.format && (
            <span className="flex items-center gap-2 text-yellow-500">🏆 {tournament.format.replace('-', ' ')}</span>
          )}
        </div>
      </div>


      <div className="flex gap-2 bg-[#1a1d24] p-1 rounded-lg w-fit border border-gray-800">
        <button
          onClick={() => setActiveTab('bracket')}
          className={`px-8 py-2 rounded text-xs font-black uppercase tracking-widest transition-all ${
            activeTab === 'bracket' ? 'bg-pink-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'
          }`}
        >
          Bracket
        </button>
        <button
          onClick={() => setActiveTab('participants')}
          className={`px-8 py-2 rounded text-xs font-black uppercase tracking-widest transition-all ${
            activeTab === 'participants' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'
          }`}
        >
          Roster
        </button>
      </div>

      {activeTab === 'bracket' && (
        <div className="pt-4 min-h-[400px]">
          {matches.length === 0 ? (
            <div className="text-center py-20 bg-[#1a1d24] rounded-xl border border-gray-800 flex flex-col items-center justify-center">
              <div className="text-4xl mb-4 animate-bounce">⏳</div>
              <p className="text-white font-black text-lg uppercase tracking-widest">Bracket is Pending</p>
              <p className="text-gray-500 text-xs mt-2 max-w-sm tracking-wide leading-relaxed">
                Matches will appear here once the tournament organizer officially starts the event.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto custom-scrollbar pb-4">
              <BracketTree matches={matches} />
            </div>
          )}
        </div>
      )}

      {activeTab === 'participants' && (
        <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {participants.length === 0 && (
            <div className="col-span-full text-center text-gray-500 italic py-10">
              No participants registered yet.
            </div>
          )}

          {participants.map((p) => (
            <div key={p.id} className="bg-[#1a1d24] p-5 rounded-xl border border-gray-800 flex flex-col items-center text-center gap-3 hover:border-pink-500/50 transition-colors group shadow-lg">

              <div className={`w-16 h-16 bg-gray-800 border border-gray-700 flex items-center justify-center overflow-hidden shadow-inner group-hover:scale-105 transition-transform ${p.isTeam ? 'rounded-xl' : 'rounded-full'}`}>
                {p.avatar ? (
                  <img src={p.avatar} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl font-black text-gray-400 uppercase">{p.name.charAt(0)}</span>
                )}
              </div>

              <div>
                <h3 className="font-bold text-sm text-white line-clamp-1 group-hover:text-pink-500 transition-colors">
                  {p.name}
                </h3>

                {p.isTeam ? (
                  <span className="inline-block bg-pink-500/10 text-pink-500 border border-pink-500/20 px-2 py-0.5 rounded text-[8px] uppercase font-black tracking-widest mt-2">
                    Squad
                  </span>
                ) : (
                  <span className="inline-block bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded text-[8px] uppercase font-black tracking-widest mt-2">
                    Solo
                  </span>
                )}
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}