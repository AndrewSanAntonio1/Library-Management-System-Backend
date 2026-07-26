import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      role: null,
      
      setAuth: (data) => set({
        user: data.username,
        token: data.accessToken,
        refreshToken: data.refreshToken,
        role: data.role,
      }),
      
      clearAuth: () => set({
        user: null,
        token: null,
        refreshToken: null,
        role: null,
      }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
