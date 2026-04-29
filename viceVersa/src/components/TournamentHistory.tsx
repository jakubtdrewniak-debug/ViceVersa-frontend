import { Link } from '@tanstack/react-router'
import type { TournamentDto } from '../types'

interface Props {
  tournaments: TournamentDto[]
  isLoading?: boolean
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
      {tournaments.map((t) => (
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
              <span className={t.status === 'COMPLETED' ? 'text-yellow-500' : 'text-blue-500'}>
                {t.status}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-[#1a1d24] px-5 py-4 rounded-xl border border-gray-800 group-hover:border-yellow-500/30 transition-all min-w-[260px] mt-4 sm:mt-0">
            <div className="text-3xl grayscale group-hover:grayscale-0 transition-all">🏆</div>
            <div className="flex flex-col">
              <span className="text-[9px] text-yellow-500/70 uppercase tracking-[0.2em] font-black mb-1">
                Victor Signature
              </span>
              <span className="text-white font-mono text-[11px] font-black uppercase tracking-tighter bg-[#0f1115] px-2 py-1 rounded border border-gray-800">
                {t.winnerId || 'LOG_PENDING'}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}