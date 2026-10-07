import { create } from 'zustand';
import { api } from '../../../lib/axios';

const useAuthStore = create((set) => ({
  user: JSON.parse(sessionStorage.getItem('abadesk_user')) || null,
  token: sessionStorage.getItem('abadesk_token') || null,
  isAuthenticated: !!sessionStorage.getItem('abadesk_token'),
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/login', { email, password });
      const { accessToken, user } = response.data;

      if (user && user.role === 0) user.role = 'User';
      if (user && user.role === 1) user.role = 'Attendant';
      if (user && user.role === 2) user.role = 'Admin';

      sessionStorage.setItem('abadesk_token', accessToken);
      sessionStorage.setItem('abadesk_user', JSON.stringify(user));

      set({ user, token: accessToken, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Erro ao realizar login. Verifique suas credenciais.', 
        isLoading: false 
      });
      throw error;
    }
  },

  register: async (name, email, password, role = 0, jobTitle = '', companyUnit = '') => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/register', { name, email, password, role, jobTitle, companyUnit });
      
      // Auto login after register
      const { accessToken, user } = response.data;
      if (accessToken) {
        if (user && user.role === 0) user.role = 'User';
        if (user && user.role === 1) user.role = 'Attendant';
        if (user && user.role === 2) user.role = 'Admin';

        sessionStorage.setItem('abadesk_token', accessToken);
        sessionStorage.setItem('abadesk_user', JSON.stringify(user));
        set({ user, token: accessToken, isAuthenticated: true, isLoading: false });
      } else {
        // Fallback if backend doesn't return token on register
        set({ isLoading: false });
        // Can manually redirect to login
      }
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Erro ao realizar cadastro.', 
        isLoading: false 
      });
      throw error;
    }
  },

  logout: () => {
    sessionStorage.removeItem('abadesk_token');
    sessionStorage.removeItem('abadesk_user');
    set({ user: null, token: null, isAuthenticated: false });
  },

  clearError: () => set({ error: null })
}));

// Listener para deslogar em caso de 401
window.addEventListener('auth:unauthorized', () => {
  useAuthStore.getState().logout();
});

export default useAuthStore;
