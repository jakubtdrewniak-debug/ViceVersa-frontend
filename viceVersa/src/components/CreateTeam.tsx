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
      // eslint-disable-next-line react-hooks/set-state-in-effect
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
    onError: (err: Error) => toast.error(`Failed to build team: ${err.message}`),
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
      className="bg-[#0f1115] text-white p-8 rounded-3xl w-full max-w-md mx-auto space-y-8 font-sans border border-[#1a1d24] shadow-2xl"
    >
      <div className="space-y-1 text-center">
        <h2 className="text-3xl font-black tracking-tighter uppercase italic">Establish Team</h2>
        <p className="text-gray-500 text-[10px] font-black tracking-[0.3em] uppercase">Vice Versa Roster Management</p>
      </div>

      <div className="space-y-3">
        <label className="text-pink-500 text-[10px] font-black tracking-widest uppercase ml-1">Team Designation</label>
        <input
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          placeholder="e.g. BIKINI BOTTOM ALL-STARS"
          className="w-full bg-[#1a1d24] border border-gray-800 rounded-xl p-4 text-white font-bold outline-none focus:border-pink-500 transition-all placeholder:text-gray-700"
          required
        />
      </div>

      <div className="space-y-4 pt-4 border-t border-gray-800/50">
        <label className="text-pink-500 text-[10px] font-black tracking-widest uppercase flex justify-between ml-1">
          <span>Active Roster</span>
          <span className="text-gray-500">{members.length} Units</span>
        </label>

        <div className="space-y-2 max-h-52 overflow-y-auto pr-2 custom-scrollbar">
          {members.map((m, index) => (
            <div key={m.id} className="flex items-center justify-between bg-[#1a1d24] p-4 rounded-xl border border-gray-800 transition-colors hover:border-gray-700">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-900 border border-gray-700 flex items-center justify-center shrink-0">
                  {m.avatar ? (
                    <img src={m.avatar} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover"/>
                  ) : (
                    <span className="text-[12px] font-black text-gray-500">{m.name.charAt(0)}</span>
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="font-black text-sm uppercase tracking-tight text-white">{m.name}</span>
                  {index === 0 && <span className="text-[9px] text-yellow-500 font-black uppercase tracking-widest mt-0.5">Captain / Founder</span>}
                </div>
              </div>
              {index !== 0 && (
                <button type="button" onClick={() => removeMember(m.id)} className="text-gray-600 hover:text-red-500 transition-colors p-2 font-bold">✕</button>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-2 pt-2">
          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="flex-1 bg-[#1a1d24] border border-gray-800 rounded-xl p-4 text-white outline-none focus:border-pink-500 text-sm font-bold cursor-pointer appearance-none truncate"
            disabled={loadingUsers}
          >
            <option value="">{loadingUsers ? "SYNCING..." : "RECRUIT PLAYER..."}</option>
            {availableUsers
              .filter(u => u.id !== user?.sub)
              .map(u => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))
            }
          </select>
          <button
            type="button"
            onClick={handleAddMember}
            disabled={!selectedUserId}
            className="bg-gray-800 px-6 rounded-xl font-black text-[10px] tracking-widest uppercase hover:bg-gray-700 hover:text-pink-500 transition-all disabled:opacity-30"
          >
            Add
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !teamName || members.length < 1}
        className="w-full bg-white text-black font-black text-sm tracking-[0.2em] py-5 rounded-xl mt-6 hover:bg-pink-500 hover:text-white transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(219,39,119,0.3)] disabled:opacity-30 disabled:grayscale uppercase"
      >
        {isSubmitting ? 'UPLOADING...' : 'REGISTER TEAM'}
      </button>
    </form>
  );
}