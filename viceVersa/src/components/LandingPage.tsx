import {RecentActivity} from "./RecentActivity.tsx";

export function LandingPage() {
  return (
    <div className="w-full flex flex-col items-center pt-16 pb-12">

      <div className="text-center mb-4 space-y-4 px-6">
        <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-white">
          Welcome to <span className="text-pink-500 drop-shadow-[0_0_15px_rgba(219,39,119,0.5)]">ViceVersus</span>
        </h2>
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto font-medium">
          The ultimate platform to organize tournaments, track matches, and crown champions. Log in to create your own hub.
        </p>
      </div>

      <div className="w-full max-w-7xl">
        <RecentActivity />
      </div>

    </div>
  );
}
