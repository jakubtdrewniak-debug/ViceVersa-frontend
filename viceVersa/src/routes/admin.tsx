import { createFileRoute, Link } from '@tanstack/react-router'
import { useAuth0 } from '@auth0/auth0-react'
import { AdminControlCenter } from '../components/AdminControlCenter'

export const Route = createFileRoute('/admin')({
  component: AdminRoute,
})

// eslint-disable-next-line react-refresh/only-export-components
function AdminRoute() {
  const { user, isAuthenticated, isLoading } = useAuth0();

  const rolesClaim = "https://viceversa.dev/roles"
  const isAdmin = isAuthenticated && user?.[rolesClaim]?.includes("admin");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-12 text-white">
        <div className="animate-pulse font-black uppercase tracking-[0.3em] text-red-500">
          Checking clearance...
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-4">
          <h1 className="text-6xl animate-bounce">⛔</h1>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Sneaky...</h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            Shoo, you're not allowed to be here! Your current account <span className="text-white font-bold">{user?.email || 'Guest'}</span> does not have "God Mode" permissions.
          </p>
          <Link
            to="/"
            className="inline-block bg-white hover:bg-gray-200 text-black px-8 py-3 rounded-xl font-black uppercase text-xs tracking-widest transition-all mt-4"
          >
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
            <div className="bg-red-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded w-fit mb-2">
              Restricted Area
            </div>
            <h1 className="text-4xl font-black tracking-tight uppercase">Admin Terminal</h1>
            <p className="text-gray-400 mt-1">Platform-wide management and destructive actions.</p>
          </div>

          <div className="flex items-center gap-4 bg-red-950/10 p-4 rounded-xl border border-red-500/10">
            <div className="text-right">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Logged in as</p>
              <p className="text-sm font-black text-red-500 tracking-tighter">{user?.email}</p>
            </div>

            <div className="w-10 h-10 rounded-lg overflow-hidden border border-gray-800 bg-gray-900 flex items-center justify-center">
              {user?.picture && user.picture.length > 0 ? (
                <img
                  src={user.picture}
                  alt="" referrerPolicy="no-referrer"
                  className="w-full h-full object-cover grayscale opacity-80"
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                />
              ) : null}
              <span className="absolute text-[10px] font-black text-gray-700">
                {user?.email?.[0].toUpperCase()}
              </span>
            </div>
          </div>
        </header>

        <AdminControlCenter />
      </div>
    </div>
  )
}