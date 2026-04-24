import {useState, useRef, useEffect} from "react";
import {useAuth0} from "@auth0/auth0-react";
import {Link, Outlet} from "@tanstack/react-router";

export const RootLayout = () => {
  const {logout, loginWithRedirect, user, isAuthenticated} = useAuth0();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans flex flex-col">

      <nav className="bg-[#0f1115] border-b border-[#1a1d24] p-4 flex justify-between items-center relative z-50">

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

        <h1 className="absolute left-1/2 -translate-x-1/2 text-2xl font-black tracking-tighter w-1/3 text-center">
          <Link to="/">ViceVersus</Link>
        </h1>

        <div className="flex items-center justify-end gap-6 w-1/3">
          {isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>

              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center justify-center hover:opacity-80 transition-opacity focus:outline-none"
              >
                {user?.picture ? (
                  <img src={user.picture} alt={user.name}
                       className="w-10 h-10 rounded-lg border-2 border-gray-700 hover:border-pink-500 transition-colors object-cover"/>
                ) : (
                  <div
                    className="w-10 h-10 rounded-lg bg-gray-800 border-2 border-gray-700 hover:border-pink-500 transition-colors flex items-center justify-center">
                    <span className="text-sm font-bold text-gray-400">
                      {user?.name?.[0] || user?.email?.[0] || '?'}
                    </span>
                  </div>
                )}
              </button>

              {isDropdownOpen && (
                <div
                  className="absolute right-0 top-full mt-3 w-56 bg-[#1a1d24] border border-gray-800 rounded-xl shadow-2xl py-2 flex flex-col overflow-hidden origin-top-right animate-in fade-in slide-in-from-top-2">

                  <div className="px-4 py-3 border-b border-gray-800 mb-2 bg-[#0f1115]/50">
                    <p className="text-sm text-white font-bold truncate">{user?.name || 'Player'}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>

                  <Link
                    to="/teams"
                    onClick={() => setIsDropdownOpen(false)}
                    className="px-4 py-2.5 text-sm font-medium text-gray-300 hover:bg-[#2a2d35] hover:text-white transition-colors flex items-center gap-3"
                  >
                    👥 My Teams
                  </Link>
                  <Link
                    to="/games"
                    onClick={() => setIsDropdownOpen(false)}
                    className="px-4 py-2.5 text-sm font-medium text-gray-300 hover:bg-[#2a2d35] hover:text-white transition-colors flex items-center gap-3"
                  >
                    🎮 My Games
                  </Link>
                  <Link
                    to="/my-history"
                    onClick={() => setIsDropdownOpen(false)}
                    className="px-4 py-2.5 text-sm font-medium text-gray-300 hover:bg-[#2a2d35] hover:text-white transition-colors flex items-center gap-3"
                  >
                    📜 My Match History
                  </Link>

                  <Link
                    to="/profile"
                    onClick={() => setIsDropdownOpen(false)}
                    className="px-4 py-2.5 text-sm font-medium text-gray-300 hover:bg-[#2a2d35] hover:text-white transition-colors flex items-center gap-3"
                  >
                    ⚙️ Profile Settings
                  </Link>

                  <div className="h-px bg-gray-800 my-2 w-full"></div>

                  <button
                    onClick={() => logout({logoutParams: {returnTo: window.location.origin}})}
                    className="w-full text-left px-4 py-2.5 text-sm font-bold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors flex items-center gap-3"
                  >
                    🚪 Sign Out
                  </button>
                </div>
              )}

            </div>
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

      <main className="flex-1 w-full">
        <Outlet/>
      </main>

    </div>
  );
};