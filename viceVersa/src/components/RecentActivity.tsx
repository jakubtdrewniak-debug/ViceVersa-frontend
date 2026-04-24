import { Link } from "@tanstack/react-router";
// ⚠️ IMPORTANT: Verify this path!
// If your mockData is in a different folder, update this line.
import { MOCK_LIVE_TOURNAMENT, MOCK_HISTORY } from "../lib/mockData";

export function RecentActivity() {
  // 1. SAFE DATA EXTRACTION
  const recentMatches = MOCK_LIVE_TOURNAMENT?.matches?.slice(0, 3) || [];
  const recentTournaments = MOCK_HISTORY?.slice(0, 3) || [];

  // 2. DIAGNOSTIC FALLBACK
  // If the import fails, show this instead of crashing to a white screen
  if (!MOCK_LIVE_TOURNAMENT || !MOCK_HISTORY) {
    return (
      <div className="container mx-auto p-8 mt-10">
        <div className="bg-red-900/50 border border-red-500 p-6 rounded-xl text-red-200 shadow-sm">
          <h3 className="font-black text-xl mb-2 text-red-400">⚠️ Data Import Failed</h3>
          <p className="font-medium">RecentActivity loaded, but it can't find your mock data.</p>
          <p className="mt-2 text-sm text-red-300">Check the import path at the top of <code>RecentActivity.tsx</code>. Make sure it points exactly to where your <code>mockData.ts</code> file lives.</p>
        </div>
      </div>
    );
  }

  // 3. THE INTERACTABLE UI
  return (
    <div className="container mx-auto p-8 grid grid-cols-1 md:grid-cols-2 gap-12 mt-10 font-sans">

      {/* Matches Section */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-white">Recent Matches</h2>
        <div className="space-y-4">
          {recentMatches.length === 0 ? (
            <p className="text-gray-500 italic">No recent matches found.</p>
          ) : (
            recentMatches.map((match) => (
              <div key={match.id} className="bg-[#1a1d24] p-4 rounded-xl shadow-sm flex justify-between items-center border border-gray-800 hover:border-pink-500 transition-colors">
                <div className="flex items-center gap-2 text-white">
                  <span className="font-medium">{match?.player1?.name || 'TBD'}</span>
                  <span className="text-gray-500 text-sm mx-2 font-bold">VS</span>
                  <span className="font-medium">{match?.player2?.name || 'TBD'}</span>
                </div>

                <div className="flex items-center gap-4">
                  {match?.score && (
                    <span className="font-black text-white bg-[#0f1115] px-3 py-1 rounded-lg border border-gray-800">
                      {match.score.p1} - {match.score.p2}
                    </span>
                  )}
                  {/* 👇 This is what makes it interactable! */}
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

      {/* Tournaments Section */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-white">Completed Tournaments</h2>
        <div className="space-y-4">
          {recentTournaments.length === 0 ? (
            <p className="text-gray-500 italic">No completed tournaments found.</p>
          ) : (
            recentTournaments.map((tournament) => (
              <div key={tournament.id} className="bg-[#1a1d24] p-4 rounded-xl shadow-sm flex justify-between items-center border border-gray-800 hover:border-pink-500 transition-colors">
                <div className="flex flex-col">
                  <span className="font-bold text-white text-lg">{tournament?.name || 'Unknown'}</span>
                  <span className="text-xs text-pink-500 font-bold tracking-widest uppercase">{tournament?.game || 'Unknown Game'}</span>
                </div>

                <div className="flex items-center gap-4">
                  <span className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                    🏆 {tournament?.winner?.name || 'TBD'}
                  </span>
                  {/* 👇 This is what makes it interactable! */}
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