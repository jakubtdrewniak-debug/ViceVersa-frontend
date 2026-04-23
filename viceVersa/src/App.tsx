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
  const {
    isLoading,
    isAuthenticated,
    error,
    loginWithRedirect: login,
  } = useAuth0();

  const signup = () =>
    login({authorizationParams: {screen_hint: "signup"}});

  const logInUser = () => login();

  if (isLoading) return <div className="h-screen flex items-center justify-center">Loading ViceVersus</div>;

  if (error) return <div>Error: {error.message}</div>

  if (!isAuthenticated) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-gray-50">
        <h1 className="text-4xl font-bold">ViceVersus</h1>
        <button
          onClick={logInUser}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Log In
        </button>
        <button
          onClick={signup}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Sign Up
        </button>
      </div>
    )
  }
  return <RouterProvider router={router}/>
}

export default App
