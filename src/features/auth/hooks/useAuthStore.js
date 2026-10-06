import { create } from 'zustand';
import { api } from '../../../lib/axios';

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('abadesk_user')) || null,
  token: localStorage.getItem('abadesk_token') || null,
  isAuthenticated: !!localStorage.getItem('abadesk_token'),
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/login', { email, password });
      const { accessToken, user } = response.data;

      localStorage.setItem('abadesk_token', accessToken);
      localStorage.setItem('abadesk_user', JSON.stringify(user));

      set({ user, token: accessToken, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Erro ao realizar login. Verifique suas credenciais.', 
        isLoading: false 
      });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('abadesk_token');
    localStorage.removeItem('abadesk_user');
    set({ user: null, token: null, isAuthenticated: false });
  },

  clearError: () => set({ error: null })
}));

// Listener para deslogar em caso de 401
window.addEventListener('auth:unauthorized', () => {
  useAuthStore.getState().logout();
});

export default useAuthStore;
