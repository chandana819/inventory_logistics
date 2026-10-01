import { create } from 'zustand';
import { authAPI } from '../lib/services';

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('access_token') || null,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authAPI.login(email, password);
      localStorage.setItem('access_token', response.data.access_token);
      
      // Get user info
      const userRes = await authAPI.getCurrentUser();
      set({ user: userRes.data, token: response.data.access_token, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.detail || 'Login failed', isLoading: false });
      throw error;
    }
  },

  register: async (name, email, password, role = 'customer') => {
    set({ isLoading: true, error: null });
    try {
      const response = await authAPI.register(name, email, password, role);
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.detail || 'Registration failed', isLoading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('access_token');
    set({ user: null, token: null });
  },

  setUser: (user) => set({ user }),
  clearError: () => set({ error: null }),
}));
