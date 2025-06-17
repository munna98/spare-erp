// apps/desktop/src/lib/trpc.ts
import { createTRPCReact } from '@trpc/react-query';
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '@server/routers';

// For React Query - with explicit type annotation
export const trpc = createTRPCReact<AppRouter>();

// Create the tRPC client with proper auth headers
export const createTRPCClient = () => {
  return trpc.createClient({
    links: [
      httpBatchLink({
        url: 'http://localhost:3001/trpc',
        headers: () => {
          // Get token from Zustand persist storage
          const authStorage = localStorage.getItem('auth-storage');
          if (authStorage) {
            try {
              const parsed = JSON.parse(authStorage);
              const token = parsed?.state?.token;
              return token ? { Authorization: `Bearer ${token}` } : {};
            } catch (error) {
              console.error('Failed to parse auth storage:', error);
              return {};
            }
          }
          return {};
        },
      }),
    ],
  });
};

// Optional: for direct use in utilities (e.g., seeding scripts or non-React logic)
export const trpcClient = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3001/trpc',
      headers: () => {
        // Get token from Zustand persist storage
        const authStorage = localStorage.getItem('auth-storage');
        if (authStorage) {
          try {
            const parsed = JSON.parse(authStorage);
            const token = parsed?.state?.token;
            return token ? { Authorization: `Bearer ${token}` } : {};
          } catch (error) {
            console.error('Failed to parse auth storage:', error);
            return {};
          }
        }
        return {};
      },
    }),
  ],
});