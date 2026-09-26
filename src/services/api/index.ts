import axios from 'axios';

// Base Axios instance configured for API readiness
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://api.legalmetrology.gov.in/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'X-Client-App': 'PERIMETER-SIH2026',
    'X-Portal-Version': '1.0.0-phase1',
  },
});

// Request interceptor for attaching authorization token in future
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('lmv_auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor for centralized error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.warn('API Service Notice:', error?.message || 'Network request error');
    return Promise.reject(error);
  },
);

export default apiClient;
