import { useAuth0 } from "@auth0/auth0-react";
import { Link, Outlet } from "@tanstack/react-router";

export const RootLayout = () => {
  const { logout, loginWithRedirect, user, isAuthenticated } = useAuth0();

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans flex flex-col">

      {/* Navbar */}
      <nav className="bg-[#0f1115] border-b border-[#1a1d24] p-4 flex justify-between items-center relative z-10">

        {/* Left Side: Navigation Links (Only visible if logged in) */}
        <div className="flex gap-6 font-bold w-1/3">
          {isAuthenticated && (
            <>
              <Link
                to="/"
                className="text-gray-400 hover:text-white transition-colors [&.active]:text-pink-500"
              >
                Dashboard
              </Link>
              <Link
                to="/history"
                className="text-gray-400 hover:text-white transition-colors [&.active]:text-pink-500"
              >
                History
              </Link>
            </>
          )}
        </div>

        {/* Center: Logo (Always visible) */}
        <h1 className="absolute left-1/2 -translate-x-1/2 text-2xl font-black tracking-tighter w-1/3 text-center">
          <Link to="/">ViceVersus</Link>
        </h1>

        {/* Right Side: User Profile & Auth Buttons */}
        <div className="flex items-center justify-end gap-6 w-1/3">
          {isAuthenticated ? (
            <>
              {/* Show the user's avatar or email */}
              <div className="flex items-center gap-3">
                {user?.picture ? (
                  <img src={user.picture} alt={user.name} className="w-8 h-8 rounded-full border border-gray-700" />
                ) : (
                  <span className="text-sm font-bold text-gray-400">{user?.name || user?.email}</span>
                )}

                <button
                  onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                  className="text-sm font-bold text-gray-500 hover:text-red-500 transition-colors"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <button
              onClick={() => loginWithRedirect()}
              className="bg-white text-black px-6 py-2 rounded-lg font-bold text-sm hover:bg-gray-200 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.1)]"
            >
              Log In
            </button>
          )}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        <Outlet />
      </main>

    </div>
  )
}