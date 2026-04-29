import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useApi } from "../hooks/useApi";
import type { TeamDto, TournamentDto } from "../types.ts";

export function AdminControlCenter() {
  const queryClient = useQueryClient();
  const { callApi } = useApi();

  const { data: teams = [], isLoading: isLoadingTeams } = useQuery<TeamDto[]>({
    queryKey: ["teams", "admin"],
    queryFn: () => callApi('/teams'),
  });

  const { data: tournaments = [], isLoading: isLoadingTournaments } = useQuery<TournamentDto[]>({
    queryKey: ["tournaments", "admin"],
    queryFn: () => callApi('/tournaments'),
  });

  const deleteTeamMutation = useMutation({
    mutationFn: (id: string) => callApi(`/teams/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      toast.success("Team disbanded successfully.");
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
    onError: (err: Error) => {
      toast.error(`Access Denied: ${err.message}`);
    }
  });

  const deleteTournamentMutation = useMutation({
    mutationFn: (id: string) => callApi(`/tournaments/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      toast.success("Tournament record purged.");
      queryClient.invalidateQueries({ queryKey: ['tournaments'] });
    },
    onError: (err: Error) => toast.error(`Action Failed: ${err.message}`)
  });

  const handleDeleteTeam = (id: string) => {
    if (window.confirm("Are you sure? This will disband the team and remove all members.")) {
      deleteTeamMutation.mutate(id);
    }
  };

  const handleDeleteTournament = (id: string) => {
    if (window.confirm("Delete this historical record forever?")) {
      deleteTournamentMutation.mutate(id);
    }
  };

  if (isLoadingTeams || isLoadingTournaments) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-pink-500 font-black animate-pulse tracking-widest uppercase">
          Accessing Encrypted Admin Data...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20 max-w-6xl mx-auto px-4">
      {/* --- TEAMS MANAGEMENT --- */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black uppercase tracking-widest text-pink-500 flex items-center gap-3">
            <span className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></span>
            Manage Teams
          </h2>
          <span className="text-[10px] text-gray-500 font-bold uppercase bg-[#1a1d24] px-2 py-1 rounded">
            {teams.length} Registered
          </span>
        </div>

        <div className="bg-[#0f1115] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-[#1a1d24] text-gray-400 font-black uppercase text-[10px] tracking-[0.2em] border-b border-gray-800">
            <tr>
              <th className="px-6 py-5">Team Name</th>
              <th className="px-6 py-5">System ID</th>
              <th className="px-6 py-5 text-right">Authority</th>
            </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
            {teams.map(team => (
              <tr key={team.id} className="hover:bg-white/5 transition-colors group">
                <td className="px-6 py-4 font-bold text-white tracking-tight">{team.name}</td>
                <td className="px-6 py-4 text-gray-600 font-mono text-[10px] uppercase">{team.id}</td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleDeleteTeam(team.id)}
                    className="text-red-500/70 hover:text-white hover:bg-red-600 border border-red-500/20 hover:border-red-600 px-4 py-1.5 rounded text-[10px] font-black uppercase transition-all"
                  >
                    Disband
                  </button>
                </td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black uppercase tracking-widest text-blue-500 flex items-center gap-3">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            Manage Tournaments
          </h2>
          <span className="text-[10px] text-gray-500 font-bold uppercase bg-[#1a1d24] px-2 py-1 rounded">
            {tournaments.length} Records
          </span>
        </div>

        <div className="bg-[#0f1115] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-[#1a1d24] text-gray-400 font-black uppercase text-[10px] tracking-[0.2em] border-b border-gray-800">
            <tr>
              <th className="px-6 py-5">Event Name</th>
              <th className="px-6 py-5">Victor ID</th>
              <th className="px-6 py-5 text-right">Authority</th>
            </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
            {tournaments.map(item => (
              <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                <td className="px-6 py-4 font-bold text-white tracking-tight">{item.name}</td>
                <td className="px-6 py-4 text-gray-500 font-mono text-[10px] uppercase">
                  {item.winnerId || '---'}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleDeleteTournament(item.id)}
                    className="text-red-500/70 hover:text-white hover:bg-red-600 border border-red-500/20 hover:border-red-600 px-4 py-1.5 rounded text-[10px] font-black uppercase transition-all"
                  >
                    Purge
                  </button>
                </td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}