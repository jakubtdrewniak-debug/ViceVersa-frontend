import './App.css'
import {useAuth0} from "@auth0/auth0-react";
import {createRouter, RouterProvider} from "@tanstack/react-router";
import {routeTree} from "./routeTree.gen.ts";

const router = createRouter({routeTree})

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}

function App() {
  const {isLoading, error,} = useAuth0();

  if (isLoading) return <div className="h-screen flex items-center justify-center">Loading ViceVersus</div>;
  if (error) return <div>Error: {error.message}</div>

  return <RouterProvider router={router}/>
}

export default App
