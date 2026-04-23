import {useAuth0} from "@auth0/auth0-react";
import {Link, Outlet} from "@tanstack/react-router";

export const RootLayout = () => {
  const {logout, user} = useAuth0();
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm p-4 flex justify-between items-center">
        <div className="flex gap-4 font-bold">
          <Link to="/dashboard" className="text-blue-600">Dashboard</Link>
          <Link to="/create" className="text-gray-600">New Tournament</Link>
          <Link to="/history" className="text-gray-600">History</Link>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">{user?.email}</span>
          <button
            onClick={()=> logout()}
            className="text-sm text-red-500 hover:underline"
          >
            Logout
          </button>
        </div>
      </nav>
      <main className="p-8">
        <Outlet />
      </main>
    </div>
  )
}