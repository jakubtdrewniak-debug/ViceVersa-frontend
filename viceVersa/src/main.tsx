import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './App.css'
import App from './App.tsx'
import {Auth0Provider} from "@auth0/auth0-react";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ToastContainer} from "react-toastify";

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <Auth0Provider
      domain="viceversus.eu.auth0.com"
      clientId="DusEyIMRSEgOpQjGQ5jM8exZ9FAHV4Oq"
      authorizationParams={{
        redirect_uri: window.location.origin,
        scope: "openid profile email",
        audience: "https://viceversa.dev",
        }}
      cacheLocation="localstorage">
        <QueryClientProvider client={queryClient}>
          <App />
          <ToastContainer
            position="bottom-right"
            theme="dark"
            autoClose={3000}
            />
        </QueryClientProvider>
      </Auth0Provider>
  </StrictMode>,
)
