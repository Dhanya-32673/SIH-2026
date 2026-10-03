import axios from 'axios';
import { DemoScenario, DisasterMode } from '../types/health.types';

// Sanitize base URL (strip trailing slashes)
const rawBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
export const API_BASE_URL = rawBaseUrl.replace(/\/+$/, '');

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor: attach JWT token to Authorization header
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sih_health_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor: handle 401 Unauthorized cleanly without redirect loops
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and auth state
      localStorage.removeItem('sih_health_token');
      localStorage.removeItem('sih_health_auth');
      localStorage.removeItem('sih_health_user');

      // Only redirect if currently on a protected route
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

export const apiService = {
  // Health Check
  getHealthCheck: async () => {
    const res = await apiClient.get('/api/health-check');
    return res.data;
  },

  // Auth & Session
  verifySession: async () => {
    const res = await apiClient.get('/api/auth/me');
    return res.data;
  },

  // Health Vitals
  getLatestHealth: async () => {
    const res = await apiClient.get('/api/health/latest');
    return res.data;
  },

  getHealthHistory: async (limit = 60, cnt?: number) => {
    const query = cnt !== undefined ? `cnt=${cnt}` : `limit=${limit}`;
    const res = await apiClient.get(`/api/health/history?${query}`);
    return res.data;
  },

  // Environment
  getLatestEnvironment: async () => {
    const res = await apiClient.get('/api/environment/latest');
    return res.data;
  },

  getEnvironmentHistory: async (limit = 60, cnt?: number) => {
    const query = cnt !== undefined ? `cnt=${cnt}` : `limit=${limit}`;
    const res = await apiClient.get(`/api/environment/history?${query}`);
    return res.data;
  },

  // Risk
  getCurrentRisk: async () => {
    const res = await apiClient.get('/api/risk/current');
    return res.data;
  },

  // Alerts & Incident Log
  getAlerts: async (limit = 30, cnt?: number) => {
    const query = cnt !== undefined ? `cnt=${cnt}` : `limit=${limit}`;
    const res = await apiClient.get(`/api/alerts?${query}`);
    return res.data;
  },

  getRecentAlerts: async (limit = 5, cnt?: number) => {
    const query = cnt !== undefined ? `cnt=${cnt}` : `limit=${limit}`;
    const res = await apiClient.get(`/api/alerts/recent?${query}`);
    return res.data;
  },

  getAlertsCount: async () => {
    const res = await apiClient.get('/api/alerts/count');
    return res.data;
  },

  createAlert: async (alertData: any) => {
    const res = await apiClient.post('/api/alerts', alertData);
    return res.data;
  },

  acknowledgeAlert: async (id: string) => {
    const res = await apiClient.post(`/api/alerts/${id}/acknowledge`);
    return res.data;
  },

  deleteAlert: async (id: string) => {
    const res = await apiClient.delete(`/api/alerts/${id}`);
    return res.data;
  },

  // Emergency
  getEmergencyStatus: async () => {
    const res = await apiClient.get('/api/emergency/status');
    return res.data;
  },

  respondEmergency: async (action: 'SAFE' | 'NEED_HELP') => {
    const res = await apiClient.post('/api/emergency/respond', { action });
    return res.data;
  },

  clearEmergency: async () => {
    const res = await apiClient.post('/api/emergency/clear');
    return res.data;
  },

  // Demo Control
  getDemoStatus: async () => {
    const res = await apiClient.get('/api/demo/current');
    return res.data;
  },

  setDemoScenario: async (scenario: DemoScenario) => {
    const res = await apiClient.post('/api/demo/scenario', { scenario });
    return res.data;
  },

  setDisasterMode: async (mode: DisasterMode) => {
    const res = await apiClient.post('/api/demo/disaster-mode', { mode });
    return res.data;
  },

  // History & Export
  getHistoricalTelemetry: async (limit = 60, cnt?: number) => {
    const query = cnt !== undefined ? `cnt=${cnt}` : `limit=${limit}`;
    const res = await apiClient.get(`/api/history?${query}`);
    return res.data;
  },

  getHistoryCount: async () => {
    const res = await apiClient.get('/api/history/count');
    return res.data;
  },

  // CNT API (Aggregate Count Endpoint)
  getCnt: async () => {
    const res = await apiClient.get('/api/cnt');
    return res.data;
  },
};
