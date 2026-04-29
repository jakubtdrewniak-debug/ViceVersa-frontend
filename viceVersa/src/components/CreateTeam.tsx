import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "react-toastify";
import { useApi } from "../hooks/useApi";
import type { UserDto, TeamDto } from "../types";

export function CreateTeamForm() {
  const { user, isAuthenticated } = useAuth0();
  const { callApi } = useApi();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [teamName, setTeamName] = useState("");
  const [members, setMembers] = useState<UserDto[]>([]);
  const [selectedUserId, setSelectedUserId] = useState("");

  const { data: availableUsers = [], isLoading: loadingUsers } = useQuery<UserDto[]>({
    queryKey: ["users"],
    queryFn: () => callApi("/users"),
  });


  useEffect(() => {
    if (isAuthenticated && user?.sub && members.length === 0) {
      const captain: UserDto = {
        id: user.sub,
        name: user.name || "Unknown Warrior",
        avatar: user.picture,
        email: user.email || "",
      };
      setMembers([captain]);
    }
  }, [isAuthenticated, user, members.length]);

  const { mutate: registerTeam, isPending: isSubmitting } = useMutation({
    mutationFn: async (payload: { name: string; members: UserDto[] }) => {

      const createdTeam: TeamDto = await callApi(
        `/teams?name=${encodeURIComponent(payload.name)}`,
        { method: "POST" }
      );

      const otherMembers = payload.members.filter(m => m.id !== user?.sub);

      const addMemberPromises = otherMembers.map(member =>
        callApi(`/teams/${createdTeam.id}/members/${member.id}`, {
          method: "POST"
        })
      );

      await Promise.all(addMemberPromises);

      return createdTeam;
    },
    onSuccess: (data) => {
      toast.success(`Team "${data.name}" created with ${members.length} members!`);
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      navigate({ to: "/teams" });
    },
    onError: (err: Error) => {
      toast.error(`Failed to build team: ${err.message}`);
    },
  });

  const handleAddMember = () => {
    if (!selectedUserId) return;

    const userToAdd = availableUsers.find((u) => u.id === selectedUserId);
    if (!userToAdd) return;

    if (members.some((m) => m.id === userToAdd.id)) {
      return toast.warn("This player is already on the roster!");
    }

    setMembers([...members, userToAdd]);
    setSelectedUserId("");
    toast.info(`Added ${userToAdd.name} to the squad.`);
  };

  const removeMember = (idToRemove: string) => {
    setMembers(members.filter((m) => m.id !== idToRemove));
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!teamName.trim()) return toast.warn("Give your team a name!");
    if (members.length < 1) return toast.warn("A team needs members!");

    registerTeam({ name: teamName, members });
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className="bg-[#0f1115] text-white p-8 rounded-2xl w-full max-md mx-auto space-y-6 font-sans border border-[#1a1d24] shadow-2xl"
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-black tracking-tight uppercase italic">Establish Team</h2>
        <p className="text-gray-500 text-[10px] font-bold tracking-[0.3em] uppercase">Vice Versa Roster Management</p>
      </div>

      {/* Team Name */}
      <div className="space-y-2">
        <label className="text-pink-500 text-[10px] font-black tracking-widest uppercase">Team Name</label>
        <input
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          placeholder="e.g. BIKINI BOTTOM ALL-STARS"
          className="w-full bg-[#1a1d24] border border-gray-800 rounded-lg p-4 text-white outline-none focus:border-pink-500 transition-all placeholder:text-gray-700"
          required
        />
      </div>

      <div className="space-y-4 pt-2">
        <label className="text-pink-500 text-[10px] font-black tracking-widest uppercase flex justify-between">
          <span>Active Roster</span>
          <span className="text-gray-500">{members.length} Members</span>
        </label>

        <div className="space-y-2 max-h-52 overflow-y-auto pr-2 custom-scrollbar">
          {members.map((m, index) => (
            <div key={m.id} className="flex items-center justify-between bg-[#1a1d24] p-3 rounded border border-gray-800/50 group">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-800 border border-gray-700 flex items-center justify-center">
                  {m.avatar ? (
                    <img src={m.avatar} alt="" className="w-full h-full object-cover"/>
                  ) : (
                    <span className="text-[10px] font-bold">{m.name.charAt(0)}</span>
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-sm">{m.name}</span>
                  {index === 0 && <span className="text-[9px] text-yellow-500 font-black uppercase tracking-tighter">Captain / Founder</span>}
                </div>
              </div>
              {index !== 0 && (
                <button type="button" onClick={() => removeMember(m.id)} className="text-gray-600 hover:text-red-500 transition-colors px-2">✕</button>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-2 mt-4">
          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="flex-1 bg-[#0f1115] border border-gray-800 rounded-lg p-3 text-white outline-none focus:border-gray-600 text-sm cursor-pointer appearance-none"
            disabled={loadingUsers}
          >
            <option value="">{loadingUsers ? "Loading players..." : "Recruit Player..."}</option>
            {availableUsers
              .filter(u => u.id !== user?.sub) // Hide current user (already captain)
              .map(u => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))
            }
          </select>
          <button
            type="button"
            onClick={handleAddMember}
            disabled={!selectedUserId}
            className="bg-gray-800 px-4 rounded-lg font-black text-[10px] uppercase hover:bg-gray-700 transition-colors disabled:opacity-30"
          >
            Add
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !teamName || members.length < 1}
        className="w-full bg-white text-black font-black text-lg py-4 rounded-xl mt-8 hover:bg-pink-500 hover:text-white transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] disabled:opacity-50"
      >
        {isSubmitting ? 'UPLOADING SQUAD...' : 'REGISTER TEAM'}
      </button>
    </form>
  );
}