import {createFileRoute, Link} from '@tanstack/react-router'
import {TournamentHistory} from "../components/TournamentHistory.tsx";

export const Route = createFileRoute('/history')({
  component: TournamentHistoryRoute,
})

// eslint-disable-next-line react-refresh/only-export-components
function TournamentHistoryRoute() {
  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between border-b border-[#1a1d24] pb-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight">Tournament History</h1>
            <p className="text-gray-400 mt-1">Review past brackets and results</p>
          </div>
          <Link
            to="/"
            className="text-gray-400 hover:text-white bg-[#0f1115] hover:bg-[#1a1d24] border border-[#1a1d24] px-5 py-2.5 rounded-lg font-bold transition-all">
            Back to active
          </Link>
        </div>
        <TournamentHistory
          tournaments={[]}/>
      </div>
    </div>
  )
}
