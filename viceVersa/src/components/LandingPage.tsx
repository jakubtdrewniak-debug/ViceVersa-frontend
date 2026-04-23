import { useAuth0 } from "@auth0/auth0-react";

export function LandingPage() {
  const { loginWithRedirect: login } = useAuth0();

  return (
    <div className="min-h-screen bg-gray-50">

      <nav className="relative flex items-center justify-between p-6 bg-white border-b">
        <div />

        <h1 className="absolute left-1/2 -translate-x-1/2 text-xl font-bold">ViceVersus</h1>
        <button
          onClick={() => login()}
          className="bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800"
        >
          Log In
        </button>
      </nav>

      <main className="container mx-auto p-8 grid grid-cols-1 md:grid-cols-2 gap-12 mt-10">


        <section>
          <h2 className="text-2xl font-bold mb-6">Recent Matches</h2>
          <div className="space-y-4">
            {/* Dummy Item 1 */}
            <div className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center border">
              <span>Player A vs Player B</span>
              <span className="font-bold text-green-600">2-1</span>
              <button className="bg-gray-100 px-3 py-1 rounded text-sm">View Details</button>
            </div>

          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6">Recent Tournaments</h2>
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center border">
              <span>Spring Championship</span>
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">Live</span>
              <button className="bg-gray-100 px-3 py-1 rounded text-sm">View Bracket</button>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
