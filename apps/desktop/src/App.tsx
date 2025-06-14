import React, { useEffect } from 'react';
import { useAuthStore } from './store/auth';
import { trpc } from './lib/trpc';
import LoginForm from './components/auth/LoginForm';
import Layout from './components/layout/Layout';
import { Toaster } from 'sonner';
import { Loader2 } from 'lucide-react';

function App() {
  const { isAuthenticated, setUser, clearAuth } = useAuthStore();
  const [isLoading, setIsLoading] = React.useState(true);

  const meQuery = trpc.auth.me.useQuery(undefined, {
    enabled: false,
    retry: false,
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth-token');
        if (token) {
          const response = await meQuery.refetch();
          if (response.data) {
            setUser(response.data);
          } else {
            clearAuth();
          }
        } else {
          clearAuth();
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        clearAuth();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [setUser, clearAuth, meQuery]);

  if (isLoading) {
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