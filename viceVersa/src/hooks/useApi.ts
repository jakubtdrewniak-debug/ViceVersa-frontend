import {useAuth0} from '@auth0/auth0-react';

export function useApi() {
  const {getAccessTokenSilently, isAuthenticated} = useAuth0();

  const callApi = async (endpoint: string, options: RequestInit = {}) => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (isAuthenticated) {

      try {
        const token = await getAccessTokenSilently();
        headers['Authorization'] = `Bearer ${token}`;
      } catch (error) {
        console.error("Auth0 token fetch failed:", error);
        throw new Error("Authentication required");
      }
    }



    const response = await fetch(`https://versa-backend-876198057788.europe-north2.run.app/api${endpoint}`, {
      ...options,
      headers,
    });

    if (response.status === 204) return null;

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'API call failed');
    }

    return response.json();
  };

  return {callApi};
}
