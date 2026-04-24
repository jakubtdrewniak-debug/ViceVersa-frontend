import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './App.css'
import App from './App.tsx'
import {Auth0Provider} from "@auth0/auth0-react";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <Auth0Provider
      domain="viceversus.eu.auth0.com"
      clientId="DusEyIMRSEgOpQjGQ5jM8exZ9FAHV4Oq"
      authorizationParams={{ redirect_uri: window.location.origin}}
      cacheLocation="localstorage">
          <App />
      </Auth0Provider>
  </StrictMode>,
)
