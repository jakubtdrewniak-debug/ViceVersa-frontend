import { createFileRoute, Link } from '@tanstack/react-router'
import { CreateTeamForm } from "../components/CreateTeam"

export const Route = createFileRoute('/create-team')({
  component: CreateTeamRoute,
})

// eslint-disable-next-line react-refresh/only-export-components
function CreateTeamRoute() {
  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md mb-6">
        <Link
          to="/teams"
          className="text-blue-500 hover:text-blue-400 font-black text-[10px] tracking-[0.2em] uppercase transition-all"
        >
          ← Back to Squad Index
        </Link>
      </div>

      <CreateTeamForm />
    </div>
  )
}