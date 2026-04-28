import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "react-toastify";
import type { Match, TournamentDetails } from "../types.ts";

const BASE_URL = "https://versa-backend-876198057788.europe-north2.run.app";

export function RecentActivity() {

  const fetchData = async (endpoint: string) => {
    try {
      const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: "GET",
        cache: "no-store",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        }
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        // If this fires, we are hitting a proxy or a redirect, not the API
        console.error("Non-JSON response received from:", endpoint);
        throw new Error("Backend sent HTML instead of JSON.");
      }

      return await res.json();
    } catch (err: any) {
      console.error("Fetch failure:", err);
      throw err;
    }
  };

  // 2. MATCHES QUERY
  const {
    data: matches = [],
    isLoading: matchesLoading,
    isError: matchesError,
    error: matchErrorData
  } = useQuery<Match[]>({
    queryKey: ["matches", "recent"],
    queryFn: () => fetchData('/api/matches')
  });

  // 3. TOURNAMENTS QUERY
  const {
    data: tournaments = [],
    isLoading: tournamentsLoading,
    isError: tournamentsError,
    error: tournamentsErrorData
  } = useQuery<TournamentDetails[]>({
    queryKey: ["tournaments", "live"],
    queryFn: () => fetchData('/api/tournaments')
  });

  // 4. TOASTS
  useEffect(() => {
    if (matchesError) toast.error(`Matches: ${matchErrorData?.message}`);
    if (tournamentsError) toast.error(`Tournaments: ${tournamentsErrorData?.message}`);
  }, [matchesError, tournamentsError, matchErrorData, tournamentsErrorData]);

  if (matchesLoading || tournamentsLoading) {
    return (
      <div className="container mx-auto p-8 mt-10 text-center text-gray-400 font-bold animate-pulse">
        Connecting to Vice Versus Cloud...
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 grid grid-cols-1 md:grid-cols-2 gap-12 mt-10 font-sans">
      <section>
        <h2 className="text-2xl font-bold mb-6 text-white">Recent Matches</h2>
        <div className="space-y-4">
          {matches.length === 0 ? (
            <p className="text-gray-500 italic">No recent matches found in database.</p>
          ) : (
            matches.map((match) => (
              <div key={match.id}
                   className="bg-[#1a1d24] p-4 rounded-xl shadow-sm flex justify-between items-center border border-gray-800 hover:border-pink-500 transition-colors">
                <div className="flex items-center gap-2 text-white">
                  <span className="font-medium">{match.player1?.name || 'TBD'}</span>
                  <span className="text-gray-500 text-sm mx-2 font-bold">VS</span>
                  <span className="font-medium">{match.player2?.name || 'TBD'}</span>
                </div>

                <div className="flex items-center gap-4">
                  {match.score && (
                    <span className="font-black text-white bg-[#0f1115] px-3 py-1 rounded-lg border border-gray-800">
                        {match.score.p1} - {match.score.p2}
                      </span>
                  )}
                  <Link
                    to="/match/$matchId"
                    params={{ matchId: match.id }}
                    className="bg-[#2a2d35] hover:bg-pink-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors"
                  >
                    Details
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6 text-white">Live Tournaments</h2>
        <div className="space-y-4">
          {tournaments.length === 0 ? (
            <p className="text-gray-500 italic">No tournaments found in database.</p>
          ) : (
            tournaments.map((tournament) => (
              <div key={tournament.id}
                   className="bg-[#1a1d24] p-4 rounded-xl shadow-sm flex justify-between items-center border border-gray-800 hover:border-pink-500 transition-colors">
                <div className="flex flex-col">
                  <span className="font-bold text-white text-lg">{tournament.name}</span>
                  <span className="text-xs text-pink-500 font-bold tracking-widest uppercase">{tournament.game}</span>
                </div>

                <div className="flex items-center gap-4">
                    <span
                      className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                      {tournament.status}
                    </span>
                  <Link
                    to="/tournament/$tournamentId"
                    params={{ tournamentId: tournament.id }}
                    className="bg-[#2a2d35] hover:bg-pink-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors"
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