import { createFileRoute } from '@tanstack/react-router'
import { CreateMatch } from '../components/CreateMatch' // Adjust path if needed

export const Route = createFileRoute('/create-match')({
  component: CreateMatchRoute,
})

// eslint-disable-next-line react-refresh/only-export-components
function CreateMatchRoute() {
  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12 font-sans flex justify-center">
      <div className="w-full max-w-2xl space-y-8">

        <div>
          <button
            onClick={() => window.history.back()}
            className="text-gray-500 hover:text-white font-bold text-sm mb-4 transition-colors"
          >
            ← Cancel & Go Back
          </button>
          <h1 className="text-3xl font-black tracking-tight text-white">Create Exhibition Match</h1>
          <p className="text-gray-400 mt-1">Set up a quick standalone match outside of a tournament.</p>
        </div>

        <CreateMatch />

      </div>
    </div>
  )
}