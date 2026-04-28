import { createFileRoute } from "@tanstack/react-router"
import { useAuth0 } from "@auth0/auth0-react"
import { useState } from "react"

export const Route = createFileRoute("/profile")({
  component: ProfileRoute,
})

// eslint-disable-next-line react-refresh/only-export-components
function ProfileRoute() {
  const { user, isAuthenticated, isLoading } = useAuth0()

  const [isEditing, setIsEditing] = useState(false)
  const [username, setUsername] = useState(user?.name || "")
  const [primaryGame, setPrimaryGame] = useState("Super Smash Bros. Ultimate") // Default mock game
  const [bio, setBio] = useState("Ready to compete!")
  const [isSaving, setIsSaving] = useState(false)

  if (isLoading) {
    return <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">Loading Profile...</div>
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 text-center">
        <p className="text-gray-400">Please log in to view your profile.</p>
      </div>
    )
  }

  const handleSave = () => {
    setIsSaving(true)

    // Simulate an API call to your future backend
    setTimeout(() => {
      setIsSaving(false)
      setIsEditing(false)
    }, 800)
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12 font-sans flex justify-center">
      <div className="w-full max-w-3xl space-y-8">

        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white">Profile Settings</h1>
          <p className="text-gray-400 mt-1">Manage your account details and player information.</p>
        </div>

        {/* The Profile Card */}
        <div className="bg-[#1a1d24] rounded-2xl border border-gray-800 overflow-hidden shadow-2xl">

          {/* Banner Gradient */}
          <div className="h-32 bg-gradient-to-r from-pink-600 to-purple-600 relative"></div>

          <div className="px-8 pb-8 relative">
            {/* Avatar - Shifted up to overlap the banner */}
            <div className="absolute -top-12 border-4 border-[#1a1d24] rounded-xl bg-gray-800 w-24 h-24 overflow-hidden shadow-lg">
              {user.picture ? (
                <img src={user.picture} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl font-bold flex items-center justify-center h-full text-gray-400">
                  {user.name?.[0] || '?'}
                </span>
              )}
            </div>

            <div className="flex justify-end pt-4 pb-6">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-[#2a2d35] hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-bold text-sm transition-colors border border-gray-700"
                >
                  Edit Profile
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-gray-400 hover:text-white px-6 py-2 font-bold text-sm transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>

            <form action={handleSave} className="space-y-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Display Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-[#0f1115] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
                      required
                    />
                  ) : (
                    <p className="text-lg font-medium bg-[#0f1115]/50 border border-transparent rounded-lg px-4 py-3">{username}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Main Game</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={primaryGame}
                      onChange={(e) => setPrimaryGame(e.target.value)}
                      placeholder="e.g. Tekken 8, Smash Ultimate..."
                      className="w-full bg-[#0f1115] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
                    />
                  ) : (
                    <p className="text-lg font-medium bg-[#0f1115]/50 border border-transparent rounded-lg px-4 py-3">
                      {primaryGame || <span className="text-gray-500 italic">No game specified</span>}
                    </p>
                  )}
                </div>

              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex justify-between">
                  Email Address <span className="text-pink-500 text-[10px]">Managed by Auth0</span>
                </label>
                <p className="text-lg font-medium text-gray-400 bg-[#0f1115]/30 border border-gray-800/50 rounded-lg px-4 py-3 cursor-not-allowed">
                  {user.email}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Player Bio</label>
                {isEditing ? (
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={3}
                    className="w-full bg-[#0f1115] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all resize-none"
                  />
                ) : (
                  <p className="text-base text-gray-300 bg-[#0f1115]/50 border border-transparent rounded-lg px-4 py-3 min-h-[80px]">
                    {bio}
                  </p>
                )}
              </div>

              {isEditing && (
                <div className="pt-4 border-t border-gray-800">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="bg-pink-600 hover:bg-pink-500 text-white px-8 py-3 rounded-lg font-bold transition-colors disabled:opacity-50 flex items-center justify-center shadow-[0_0_15px_rgba(219,39,119,0.3)] w-full md:w-auto"
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </form>

          </div>
        </div>

      </div>
    </div>
  )
}