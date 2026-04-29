import { createFileRoute } from "@tanstack/react-router"
import { useAuth0 } from "@auth0/auth0-react"

export const Route = createFileRoute("/profile")({
  component: ProfileRoute,
})

// eslint-disable-next-line react-refresh/only-export-components
function ProfileRoute() {
  const { user, isAuthenticated, isLoading } = useAuth0()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <span className="text-pink-500 font-black animate-pulse uppercase tracking-[0.4em]">
          Retrieving Personnel Data...
        </span>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 text-center text-gray-500 font-black uppercase text-[10px] tracking-widest">
        Clearance Required // Log in to view identity
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12 font-sans flex justify-center">
      <div className="w-full max-w-2xl space-y-8">

        <div className="border-b border-[#1a1d24] pb-6">
          <h1 className="text-4xl font-black tracking-tighter uppercase italic">Personnel File</h1>
          <p className="text-gray-600 font-bold text-[9px] uppercase tracking-[0.4em] mt-1">
            Verified Identity & Arena Credentials
          </p>
        </div>

        <div className="bg-[#0f1115] rounded-3xl border border-[#1a1d24] overflow-hidden shadow-2xl relative">

          <div className="h-40 bg-gradient-to-br from-pink-600/40 via-purple-900/40 to-black relative">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
          </div>

          <div className="px-10 pb-12 relative">

            <div className="absolute -top-16 border-4 border-[#0f1115] rounded-2xl bg-gray-900 w-32 h-32 overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)] flex items-center justify-center">
              {user.picture ? (
                <img
                  src={user.picture}
                  alt=""
                  className="w-full h-full object-cover"
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                />
              ) : null}
              <span className="absolute text-4xl font-black text-gray-800 uppercase">
                {user.name?.[0] || user.email?.[0]}
              </span>
            </div>

            <div className="pt-20 space-y-8">

              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <label className="text-[9px] font-black text-pink-500 uppercase tracking-[0.3em] mb-1 block">
                    Designation
                  </label>
                  <h2 className="text-4xl font-black uppercase tracking-tighter text-white">
                    {user.name || "UNREGISTERED_ENTITY"}
                  </h2>
                </div>

                <div className="text-left md:text-right">
                  <label className="text-[9px] font-black text-gray-600 uppercase tracking-[0.3em] mb-1 block">
                    Access Level
                  </label>
                  <p className="text-sm font-black text-white uppercase tracking-widest">
                    Standard Combatant
                  </p>
                </div>
              </div>

              <div className="h-px bg-gradient-to-r from-gray-800 to-transparent"></div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="text-[9px] font-black text-gray-600 uppercase tracking-[0.3em] mb-1 block">
                    Uplink Address
                  </label>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest bg-[#1a1d24]/50 p-3 rounded-lg border border-gray-800/50">
                    {user.email}
                  </p>
                </div>

                <div>
                  <label className="text-[9px] font-black text-gray-600 uppercase tracking-[0.3em] mb-1 block">
                    System ID
                  </label>
                  <p className="text-[10px] font-mono text-gray-500 break-all bg-[#1a1d24]/50 p-3 rounded-lg border border-gray-800/50">
                    {user.sub}
                  </p>
                </div>
              </div>

            </div>
          </div>

          <div className="bg-[#14161b] px-10 py-4 border-t border-gray-800/50 flex justify-between items-center">
            <span className="text-[8px] font-black text-gray-700 uppercase tracking-[0.5em]">
              Vice Versus Protocol // 2026
            </span>
            <div className="flex gap-1">
              <div className="w-1 h-1 bg-pink-500 rounded-full"></div>
              <div className="w-1 h-1 bg-gray-800 rounded-full"></div>
              <div className="w-1 h-1 bg-gray-800 rounded-full"></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}