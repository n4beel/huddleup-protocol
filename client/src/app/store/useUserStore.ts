import { create } from 'zustand';
import axios from 'axios';

interface User {
  address?: string;
  [key: string]: any;
}

interface UserState {
  user: User | null;
  idToken: string | null;
  setUser: (user: User) => void;
  setIdToken: (token: string) => void;
  clearUser: () => void;
  hydrate: () => void; // 👈 add this
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  idToken: null,

  setUser: (user) => {
    set({ user });
    localStorage.setItem('user', JSON.stringify(user));
  },

  setIdToken: (token) => {
    set({ idToken: token });
    localStorage.setItem('idToken', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  },

  clearUser: () => {
    set({ user: null, idToken: null });
    localStorage.removeItem('user');
    localStorage.removeItem('idToken');
    delete axios.defaults.headers.common['Authorization'];
  },

  // 👇 restores user + token on refresh
  hydrate: () => {
    if (typeof window === 'undefined') return;

    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('idToken');

    if (storedUser) set({ user: JSON.parse(storedUser) });
    if (storedToken) {
      set({ idToken: storedToken });
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
  },
}));
