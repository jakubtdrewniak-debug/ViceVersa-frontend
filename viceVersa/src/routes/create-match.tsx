import { createFileRoute, Link } from '@tanstack/react-router'
import { CreateMatch } from '../components/CreateMatch'

export const Route = createFileRoute('/create-match')({
  component: CreateMatchRoute,
})

// eslint-disable-next-line react-refresh/only-export-components
function CreateMatchRoute() {
  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12 font-sans flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl space-y-6">

        <div className="flex justify-between items-end border-b border-[#1a1d24] pb-6">
          <div>
            <h1 className="text-4xl font-black tracking-tighter uppercase">Create match</h1>
            <p className="text-[10px] text-pink-500 font-black tracking-[0.3em] uppercase mt-1">
              Standalone match
            </p>
          </div>
          <Link
            to="/"
            className="text-gray-500 hover:text-white font-black text-[10px] uppercase tracking-widest transition-colors mb-1"
          >
            Back to Dashboard
          </Link>
        </div>

        <CreateMatch />
      </div>
    </div>
  )
}