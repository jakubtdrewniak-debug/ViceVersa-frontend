import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useApi } from "../hooks/useApi";
import type { MatchDto, TournamentDto } from "../types.ts";

export function RecentActivity() {
  const { callApi } = useApi();


  const {
    data: matches = [],
    isLoading: matchesLoading,
    isError: matchesError,
    error: matchErrorData
  } = useQuery<MatchDto[]>({
    queryKey: ["matches", "recent"],
    queryFn: () => callApi('/matches'),
  });

  const {
    data: tournaments = [],
    isLoading: tournamentsLoading,
    isError: tournamentsError,
    error: tournamentsErrorData
  } = useQuery<TournamentDto[]>({
    queryKey: ["tournaments", "live"],
    queryFn: () => callApi('/tournaments'),
  });

  useEffect(() => {
    if (matchesError) toast.error(`Matches Error: ${matchErrorData instanceof Error ? matchErrorData.message : 'Fetch failed'}`);
    if (tournamentsError) toast.error(`Tournaments Error: ${tournamentsErrorData instanceof Error ? tournamentsErrorData.message : 'Fetch failed'}`);
  }, [matchesError, tournamentsError, matchErrorData, tournamentsErrorData]);

  if (matchesLoading || tournamentsLoading) {
    return (
      <div className="container mx-auto p-8 mt-10 text-center text-pink-500 font-black animate-pulse">
        SYNCING WITH VICE VERSA CLOUD...
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 grid grid-cols-1 md:grid-cols-2 gap-12 mt-10 font-sans">
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white tracking-tight">Recent Matches</h2>
          <div className="h-1 flex-grow mx-4 bg-gradient-to-r from-pink-500/20 to-transparent rounded"></div>
        </div>

        <div className="space-y-4">
          {matches.length === 0 ? (
            <p className="text-gray-500 italic bg-[#1a1d24] p-4 rounded-xl border border-gray-800">No activity in the arena yet.</p>
          ) : (
            matches.map((match) => (
              <div key={match.id}
                   className="bg-[#1a1d24] p-4 rounded-xl flex justify-between items-center border border-gray-800 hover:border-pink-500/50 transition-all group shadow-lg">
                <div className="flex items-center gap-3 text-white">
                  <span className={`font-bold ${match.winner?.id === match.player1?.id ? 'text-pink-500' : ''}`}>
                    {match.player1?.name || 'TBD'}
                  </span>
                  <span className="text-gray-600 text-[10px] font-black uppercase tracking-widest">VS</span>
                  <span className={`font-bold ${match.winner?.id === match.player2?.id ? 'text-pink-500' : ''}`}>
                    {match.player2?.name || 'TBD'}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="bg-[#0f1115] px-3 py-1 rounded border border-gray-800 font-mono text-sm text-pink-500">
                    {match.score.scoreP1} - {match.score.scoreP2}
                  </div>
                  <Link
                    to="/match/$matchId"
                    params={{ matchId: match.id }}
                    className="bg-gray-800 hover:bg-pink-600 text-white px-3 py-1.5 rounded text-xs font-black uppercase transition-colors"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white tracking-tight">Live Tournaments</h2>
          <div className="h-1 flex-grow mx-4 bg-gradient-to-r from-blue-500/20 to-transparent rounded"></div>
        </div>

        <div className="space-y-4">
          {tournaments.length === 0 ? (
            <p className="text-gray-500 italic bg-[#1a1d24] p-4 rounded-xl border border-gray-800">The brackets are empty for now.</p>
          ) : (
            tournaments.map((t) => (
              <div key={t.id}
                   className="bg-[#1a1d24] p-4 rounded-xl flex justify-between items-center border border-gray-800 hover:border-blue-500/50 transition-all shadow-lg">
                <div className="flex flex-col">
                  <span className="font-black text-white text-lg leading-tight uppercase">{t.name}</span>
                  <span className="text-[10px] text-pink-500 font-black tracking-[0.2em] uppercase">{t.game}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-1 rounded text-[10px] font-black uppercase">
                    {t.status}
                  </span>
                  <Link
                    to="/tournament/$tournamentId"
                    params={{ tournamentId: t.id }}
                    className="bg-gray-800 hover:bg-blue-600 text-white px-3 py-1.5 rounded text-xs font-black uppercase transition-colors"
                  >
                    Bracket
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}