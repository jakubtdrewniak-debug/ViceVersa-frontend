import { useAuth0 } from "@auth0/auth0-react";
import {RecentActivity} from "./RecentActivity.tsx";

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
      <RecentActivity/>
    </div>
  );
}
