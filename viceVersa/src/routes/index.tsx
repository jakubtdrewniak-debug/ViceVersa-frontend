import {createFileRoute, Link} from '@tanstack/react-router'
import {RecentActivity} from "../components/RecentActivity.tsx";

export const Route = createFileRoute('/')({
  component: Dashboard,
})


// eslint-disable-next-line react-refresh/only-export-components
function Dashboard() {
  return <div>
    <div className="p-8">
      <div className="flex justify-center items-center mb-8">
        <Link
        to="/create"
        className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm">
          Create new tournament
        </Link>
      </div>

    </div>
    <RecentActivity/>
  </div>
}
