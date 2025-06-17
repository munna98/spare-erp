// apps/desktop/src/store/auth.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@shared/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean; // Add this to track initialization
  
  // Actions
  login: (data: { token: string; user: User }) => void;
  logout: () => void;
  setToken: (token: string) => void;
  setUser: (user: User) => void;
  updateUser: (userData: Partial<User>) => void;
  clearAuth: () => void;
  initialize: () => void; // Add this for proper initialization
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isInitialized: false,

      login: (data) => {
        // Let Zustand persist handle localStorage
        set({
          user: data.user,
          token: data.token,
          isAuthenticated: true,
          isInitialized: true,
        });
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isInitialized: true,
        });
      },

      setToken: (token) => {
        set({ token });
      },

      setUser: (user) => {
        set({ 
          user, 
          isAuthenticated: true,
          isInitialized: true 
        });
      },

      updateUser: (userData) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: {
              ...currentUser,
              ...userData,
              company: userData.company || currentUser.company,
            },
          });
        }
      },

      clearAuth: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isInitialized: true,
        });
      },

      initialize: () => {
        set({ isInitialized: true });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      // Add onRehydrateStorage to handle initialization
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isInitialized = true;
        }
      },
    }
  )
);