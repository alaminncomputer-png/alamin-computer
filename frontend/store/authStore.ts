import { create } from 'zustand';
import api from '@/lib/api';

interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'user' | 'admin';
  avatar?: string;
  wishlist?: string[];
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, phone: string, password: string) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('ac_token') : null,
  isLoading: false,

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('ac_token', data.token);
      localStorage.setItem('ac_user', JSON.stringify(data));
      set({ user: data, token: data.token, isLoading: false });
    } catch (err: any) {
      set({ isLoading: false });
      throw new Error(err.response?.data?.message || 'Login failed');
    }
  },

  register: async (name, email, phone, password) => {
    set({ isLoading: true });
    try {
      const { data } = await api.post('/auth/register', { name, email, phone, password });
      localStorage.setItem('ac_token', data.token);
      localStorage.setItem('ac_user', JSON.stringify(data));
      set({ user: data, token: data.token, isLoading: false });
    } catch (err: any) {
      set({ isLoading: false });
      throw new Error(err.response?.data?.message || 'Registration failed');
    }
  },

  logout: () => {
    localStorage.removeItem('ac_token');
    localStorage.removeItem('ac_user');
    set({ user: null, token: null });
  },

  loadUser: async () => {
    const token = localStorage.getItem('ac_token');
    if (!token) return;
    try {
      const { data } = await api.get('/auth/me');
      set({ user: data });
    } catch {
      localStorage.removeItem('ac_token');
      localStorage.removeItem('ac_user');
      set({ user: null, token: null });
    }
  },

  updateProfile: async (profileData) => {
    const { data } = await api.put('/auth/me', profileData);
    set({ user: data.user });
  },
}));
