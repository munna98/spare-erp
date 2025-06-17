// apps/desktop/src/App.tsx
import { useEffect } from 'react';
import { useAuthStore } from './store/auth';
import { trpc } from './lib/trpc';
import LoginForm from './components/auth/LoginForm';
import Layout from './components/layout/Layout';
import { Toaster } from 'sonner';
import { Loader2 } from 'lucide-react';

function App() {
  const { 
    isAuthenticated, 
    isInitialized,
    token,
    setUser, 
    clearAuth,
    initialize 
  } = useAuthStore();

  // Use the me query with proper conditions
  const meQuery = trpc.auth.me.useQuery(undefined, {
    enabled: isInitialized && !!token && !isAuthenticated, // Only run when we have token but no user
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  // Handle auth initialization
  useEffect(() => {
    const initializeAuth = async () => {
      // Wait for Zustand to rehydrate from localStorage
      if (!isInitialized) {
        initialize();
        return;
      }

      // If we have a token but no authenticated user, try to get user info
      if (token && !isAuthenticated) {
        try {
          // The query will automatically run due to enabled condition
          if (meQuery.data) {
            setUser(meQuery.data);
          } else if (meQuery.error) {
            console.error('Auth check failed:', meQuery.error);
            clearAuth();
          }
        } catch (error) {
          console.error('Auth initialization error:', error);
          clearAuth();
        }
      }
    };

    initializeAuth();
  }, [isInitialized, token, isAuthenticated, initialize]); // Stable dependencies

  // Handle query results
  useEffect(() => {
    if (meQuery.data && token && !isAuthenticated) {
      setUser(meQuery.data);
    } else if (meQuery.error && token) {
      console.error('Me query failed:', meQuery.error);
      clearAuth();
    }
  }, [meQuery.data, meQuery.error, token, isAuthenticated, setUser, clearAuth]);

  // Show loading while initializing or while checking auth
  if (!isInitialized || (token && !isAuthenticated && meQuery.isFetching)) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50">
      {!isAuthenticated ? (
        <div className="flex h-full items-center justify-center">
          <LoginForm />
        </div>
      ) : (
        <Layout />
      )}
      <Toaster position="top-right" richColors />
    </div>
  );
}

export default App;