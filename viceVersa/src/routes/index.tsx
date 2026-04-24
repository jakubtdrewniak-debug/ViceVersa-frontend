import {createFileRoute, Link} from '@tanstack/react-router'
import {RecentActivity} from "../components/RecentActivity.tsx";
import {useAuth0} from "@auth0/auth0-react";
import {LandingPage} from "../components/LandingPage.tsx";

export const Route = createFileRoute('/')({
  component: Dashboard,
})


// eslint-disable-next-line react-refresh/only-export-components
function Dashboard() {
  const {isAuthenticated, isLoading} = useAuth0();

  if (isLoading) {
    return <div className="h-screen flex items-center justify-center text-white bg-[#050505]">Loading...</div>
  }
  if (!isAuthenticated) {
    return <LandingPage />
  }
  return <>
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Your Hub</h1>
          <p className="text-gray-400 mt-1">Manage tournaments, teams, and matches.</p>
        </div>

        <div className="flex gap-3">
          <Link
            to="/create-team"
            className="bg-[#1a1d24] hover:bg-[#2a2d35] text-white border border-gray-700 px-5 py-3 rounded-lg font-bold transition-colors"
          >
            + New Team
          </Link>
          <Link
            to="/create"
            className="bg-pink-600 hover:bg-pink-500 text-white px-5 py-3 rounded-lg font-bold transition-colors shadow-[0_0_15px_rgba(219,39,119,0.3)]"
          >
            + New Tournament
          </Link>
        </div>
      </div>
    </div>
    <RecentActivity/>
  </>
}
