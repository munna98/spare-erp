// store/auth.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@shared/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  
  // Actions
  login: (data: { token: string; user: User }) => void;
  logout: () => void;
  setToken: (token: string) => void;
  setUser: (user: User) => void;
  updateUser: (userData: Partial<User>) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: (data) => {
        localStorage.setItem('auth-token', data.token);
        set({
          user: data.user,
          token: data.token,
          isAuthenticated: true,
        });
      },

      logout: () => {
        localStorage.removeItem('auth-token');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      setToken: (token) => {
        localStorage.setItem('auth-token', token);
        set({ token });
      },

      setUser: (user) => set({ user }),

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
        localStorage.removeItem('auth-token');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);