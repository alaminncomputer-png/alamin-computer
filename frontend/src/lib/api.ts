import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  timeout: 15000,
});

// Attach JWT from localStorage
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    try {
      const authStr = localStorage.getItem('alamin-auth');
      if (authStr) {
        const { state } = JSON.parse(authStr);
        if (state?.token) {
          config.headers.Authorization = `Bearer ${state.token}`;
        }
      }
    } catch {}
  }
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('alamin-auth');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// ── Helpers ───────────────────────────────────────
export const formatPrice = (price: number) =>
  new Intl.NumberFormat('en-ET', { style: 'currency', currency: 'ETB', minimumFractionDigits: 0 }).format(price);

export const formatDate = (date: string) =>
  new Intl.DateTimeFormat('en-ET', { dateStyle: 'medium' }).format(new Date(date));

export const getWhatsAppLink = (message?: string) =>
  `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${encodeURIComponent(message || 'Hello, I am interested in your laptops.')}`;

export const getTelegramLink = () =>
  `https://t.me/${process.env.NEXT_PUBLIC_TELEGRAM_USERNAME}`;
