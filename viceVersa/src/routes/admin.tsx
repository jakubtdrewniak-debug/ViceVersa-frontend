import { createFileRoute, Link } from '@tanstack/react-router'
import { useAuth0 } from '@auth0/auth0-react'
import { AdminControlCenter } from '../components/AdminControlCenter'
import { ADMIN_EMAIL } from '../lib/mockData'

export const Route = createFileRoute('/admin')({
  component: AdminRoute,
})

// eslint-disable-next-line react-refresh/only-export-components
function AdminRoute() {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) return <div className="p-12 text-white animate-pulse">Checking clearance...</div>;

  const isAdmin = isAuthenticated && user?.email === ADMIN_EMAIL;

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-4">
          <h1 className="text-6xl">⛔</h1>
          <h2 className="text-3xl font-black text-white">Sneaky...</h2>
          <p className="text-gray-500 text-sm">
            Shoo, you're not allowed to be here! Your current account {user?.email || 'Guest'} does not have "God Mode" permissions.
          </p>
          <Link to="/" className="inline-block bg-white text-black px-6 py-3 rounded-xl font-bold">
            Get me out of here
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050505] p-6 md:p-12 font-sans text-white">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between border-b border-red-900/30 pb-8 gap-4">
          <div>
            <div className="bg-red-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded w-fit mb-2 animate-bounce">
              Restricted Area
            </div>
            <h1 className="text-4xl font-black tracking-tight">Admin Terminal</h1>
            <p className="text-gray-400 mt-1">Platform-wide management and destructive actions.</p>
          </div>
          <div className="flex gap-4">
            <div className="text-right">
              <p className="text-xs font-bold text-gray-500 uppercase">Logged in as</p>
              <p className="text-sm font-bold text-red-500">{user?.email}</p>
            </div>
          </div>
        </header>

        <AdminControlCenter />
      </div>
    </div>
  )
}