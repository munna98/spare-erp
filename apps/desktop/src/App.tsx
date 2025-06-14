// import { Routes, Route, Navigate } from 'react-router-dom'
// import { useAuthStore } from '@/store/auth'
// import { useEffect } from 'react'
// import LoginPage from '@/components/auth/LoginPage'
// import DashboardLayout from '@/components/layout/DashboardLayout'
// import Dashboard from '@/components/dashboard/Dashboard'
// import Inventory from '@/components/inventory/Inventory'
// import Sales from '@/components/sales/Sales'
// import Purchases from '@/components/purchases/Purchases'
// import Customers from '@/components/customers/Customers'
// import Suppliers from '@/components/suppliers/Suppliers'
// import Reports from '@/components/reports/Reports'
// import Settings from '@/components/settings/Settings'
// import { Toaster } from '@/components/ui/toaster'

// function App() {
//   const { isAuthenticated, user, checkAuth } = useAuthStore()

//   useEffect(() => {
//     // Check authentication status on app load
//     checkAuth()
//   }, [checkAuth])

//   // Show loading screen while checking auth
//   if (user === undefined) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-background">
//         <div className="text-center">
//           <div className="loading-spinner w-8 h-8 mx-auto mb-4"></div>
//           <p className="text-muted-foreground">Loading...</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <>
//       <Routes>
//         {/* Public routes */}
//         <Route 
//           path="/login" 
//           element={
//             isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
//           } 
//         />

//         {/* Protected routes */}
//         <Route
//           path="/*"
//           element={
//             isAuthenticated ? (
//               <DashboardLayout>
//                 <Routes>
//                   <Route index element={<Navigate to="/dashboard" replace />} />
//                   <Route path="/dashboard" element={<Dashboard />} />
//                   <Route path="/inventory" element={<Inventory />} />
//                   <Route path="/sales/*" element={<Sales />} />
//                   <Route path="/purchases/*" element={<Purchases />} />
//                   <Route path="/customers" element={<Customers />} />
//                   <Route path="/suppliers" element={<Suppliers />} />
//                   <Route path="/reports/*" element={<Reports />} />
//                   <Route path="/settings/*" element={<Settings />} />
//                 </Routes>
//               </DashboardLayout>
//             ) : (
//               <Navigate to="/login" replace />
//             )
//           }
//         />
//       </Routes>
      
//       {/* Global toast notifications */}
//       <Toaster />
//     </>
//   )
// }

// export default App

import React, { useEffect } from 'react';
import { useAuthStore } from './store/auth';
import { trpc } from './lib/trpc';
import LoginForm from './components/auth/LoginForm';
import Layout from './components/layout/Layout';
import { Toaster } from 'sonner';
import { Loader2 } from 'lucide-react';

function App() {
  const { user, isAuthenticated, setUser, clearAuth } = useAuthStore();
  const [isLoading, setIsLoading] = React.useState(true);

  // Check if user is already authenticated on app start
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth-token');
        if (token) {
          // Verify token with backend
          const response = await trpc.auth.me.query();
          if (response.user) {
            setUser(response.user);
          } else {
            clearAuth();
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        clearAuth();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [setUser, clearAuth]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm text-gray-600">Loading UAE Spare Parts ERP...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50">
      {!isAuthenticated ? (
        <div className="flex h-full items-center justify-center">
          <div className="w-full max-w-md p-6">
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-bold text-gray-900">
                UAE Spare Parts ERP
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Sign in to access your account
              </p>
            </div>
            <LoginForm />
          </div>
        </div>
      ) : (
        <Layout />
      )}
      
      {/* Global Toast Notifications */}
      <Toaster 
        position="top-right" 
        richColors 
        expand={false}
        duration={4000}
      />
    </div>
  );
}

export default App;