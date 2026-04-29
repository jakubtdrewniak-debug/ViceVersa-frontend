import {useAuth0} from "@auth0/auth0-react";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import type {TeamDto, TournamentDto} from "../types.ts";

const BASE_URL = "https://versa-backend-876198057788.europe-north2.run.app" +
  ""
export function AdminControlCenter() {
  const { getAccessTokenSilently } = useAuth0();
  const queryClient = useQueryClient();

  const { data: teams = [], isLoading: isLoadingTeams} = useQuery<TeamDto[]>({
    queryKey: ["teams", "admin"],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/api/teams`);
      if (!res.ok) throw new Error("Failed to fetch teams");
      return res.json();
    }
  });

  const {data: tournaments = [], isLoading: isLoadingTournaments } = useQuery<TournamentDto[]>({
    queryKey: ["tournaments", "admin"],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/api/tournaments`);
      if (!res.ok) throw new Error("Failed to fetch tournaments")
      return res.json();
    }
  });

  const deleteTeamMutation = useMutation({
    mutationFn: async (id: string) => {
      const token = await getAccessTokenSilently();

      const res = await fetch(`${BASE_URL}/api/teams/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error(`Server Error: ${res.status}`);
    },
    onSuccess: () => {

      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
    onError: (err) => {
      console.error("Delete failed:", err);
      alert("Failed to delete team. Are you sure you're an admin?");
    }
  });

  const deleteTournamentMutation = useMutation({
    mutationFn: async (id: string) => {
      const token = await getAccessTokenSilently();

      const res = await fetch(`${BASE_URL}/api/tournaments/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error(`Server Error: ${res.status}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tournaments'] });
    }
  });


  const handleDeleteTeam = (id: string) => {
    if (confirm("Are you sure? This will disband the team and remove all members.")) {
      deleteTeamMutation.mutate(id);
    }
  };

  const handleDeleteTournament = (id: string) => {
    if (confirm("Delete this historical record forever?")) {
      deleteTournamentMutation.mutate(id);
    }
  };

  if (isLoadingTeams || isLoadingTournaments) {
    return <div className="p-10 text-white font-bold animate-pulse">Loading Admin Data...</div>;
  }

  return (
    <div className="space-y-12 pb-20">
      <section className="space-y-4">
        <h2 className="text-xl font-black uppercase tracking-widest text-pink-500 flex items-center gap-2">
          <span className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></span>
          Manage Teams
        </h2>
        <div className="bg-[#0f1115] border border-gray-800 rounded-2xl overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#1a1d24] text-gray-400 font-bold uppercase text-[10px] tracking-widest">
            <tr>
              <th className="px-6 py-4">Team Name</th>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
            {teams.map(team => (
              <tr key={team.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-bold text-white">{team.name}</td>
                <td className="px-6 py-4 text-gray-500 font-mono text-xs">{team.id}</td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleDeleteTeam(team.id)}
                    className="text-red-500 hover:text-white hover:bg-red-600 px-3 py-1 rounded-md transition-all font-bold"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-black uppercase tracking-widest text-blue-500 flex items-center gap-2">
          <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
          Manage Tournaments
        </h2>
        <div className="bg-[#0f1115] border border-gray-800 rounded-2xl overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#1a1d24] text-gray-400 font-bold uppercase text-[10px] tracking-widest">
            <tr>
              <th className="px-6 py-4">Event</th>
              <th className="px-6 py-4">Winner</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
            {tournaments.map(item => (
              <tr key={item.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-bold text-white">{item.name}</td>
                <td className="px-6 py-4 text-gray-400">{item.winnerId}</td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleDeleteTournament(item.id)}
                    className="text-red-500 hover:text-white hover:bg-red-600 px-3 py-1 rounded-md transition-all font-bold"
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
  )
}