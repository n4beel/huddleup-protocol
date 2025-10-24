import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface UserState {
  address: string | null
  isAuthenticated: boolean
  setUser: (address: string, isAuthenticated: boolean) => void
  clearUser: () => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      address: null,
      isAuthenticated: false,
      setUser: (address, isAuthenticated) => set({ address, isAuthenticated }),
      clearUser: () => set({ address: null, isAuthenticated: false }),
    }),
    {
      name: 'user-storage', // key for localStorage
      storage: createJSONStorage(() => localStorage), // ✅ correct pattern
    }
  )
)
