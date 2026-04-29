import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useApi } from './useApi'; // Your smart fetcher
import { useQueryClient } from '@tanstack/react-query';

export function useUserSync() {
  const { isAuthenticated, isLoading, user } = useAuth0();
  const { callApi } = useApi();
  const queryClient = useQueryClient();

  useEffect(() => {
    const sync = async () => {

      if (isAuthenticated && user) {
        try {
          console.log("🔄 Syncing user with backend...");
          await callApi('/users/sync', { method: 'POST' });

          queryClient.invalidateQueries({ queryKey: ['users'] });
        } catch (err) {
          console.error("User sync failed:", err);
        }
      }
    };

    if (!isLoading) {
      sync();
    }
  }, [isAuthenticated, isLoading, user, callApi, queryClient]);
}