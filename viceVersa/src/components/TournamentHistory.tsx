import type { TournamentDto, UserDto, TeamDto } from '../types'
import {useApi} from "../hooks/useApi.ts";
import {useQuery} from "@tanstack/react-query";
import {Link} from "@tanstack/react-router";

interface Props {
  tournaments: TournamentDto[]
  isLoading?: boolean
}


function WinnerSignature({ winnerId, type }: { winnerId: string; type: string }) {
  const { callApi } = useApi();

  const endpoint = type === 'SOLO' ? `/users/${winnerId}` : `/teams/${winnerId}`;

  const { data, isLoading, isError } = useQuery<UserDto | TeamDto>({
    queryKey: ["winner", winnerId],
    queryFn: () => callApi(endpoint),
    enabled: !!winnerId,
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) return <span className="animate-pulse text-gray-700">SCANNING...</span>;
  if (isError || !data) return <span className="text-red-900">REDACTED</span>;

  return <>{data.name}</>;
}

export function TournamentHistory({ tournaments, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-28 bg-[#1a1d24] rounded-2xl w-full animate-pulse border border-gray-800/50" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {tournaments.map((t) => {
        const isCompleted = t.status === 'COMPLETED';

        return (
          <Link
            key={t.id}
            to="/tournament/$tournamentId"
            params={{ tournamentId: t.id }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#0f1115] border border-[#1a1d24] p-6 rounded-2xl hover:border-pink-500/50 transition-all group shadow-lg"
          >
            <div className="space-y-2">
              <h3 className="text-xl font-black text-white group-hover:text-pink-500 transition-colors uppercase tracking-tight">
                {t.name}
              </h3>
              <div className="flex flex-wrap gap-x-4 gap-y-2 text-[10px] text-gray-500 font-black uppercase tracking-[0.15em]">
                <span className="flex items-center gap-1.5 text-pink-500/80">
                  <span className="w-1 h-1 bg-pink-500 rounded-full" />
                  {t.game}
                </span>
                <span>•</span>
                <span>{t.type} FORMAT</span>
                <span>•</span>
                <span className={isCompleted ? 'text-yellow-500' : 'text-blue-500'}>
                  {t.status}
                </span>
              </div>
            </div>

            <div className={`flex items-center gap-4 bg-[#1a1d24] px-5 py-4 rounded-xl border transition-all min-w-[260px] mt-4 sm:mt-0 ${
              isCompleted ? 'border-yellow-500/20 group-hover:border-yellow-500/50' : 'border-gray-800'
            }`}>
              <div className={`text-3xl transition-all ${isCompleted ? 'grayscale-0' : 'grayscale opacity-30'}`}>
                🏆
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[9px] text-yellow-500/70 uppercase tracking-[0.2em] font-black mb-1">
                  Victor Signature
                </span>
                <span className="text-white font-black text-[11px] uppercase tracking-tighter bg-[#0f1115] px-3 py-1.5 rounded border border-gray-800 truncate">
                  {t.winnerId ? (
                    <WinnerSignature winnerId={t.winnerId} type={t.type} />
                  ) : (
                    'LOG_PENDING'
                  )}
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  )
}