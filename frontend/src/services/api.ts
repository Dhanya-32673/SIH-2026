import axios from 'axios';
import { DemoScenario, DisasterMode } from '../types/health.types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  // Health
  getLatestHealth: async () => {
    const res = await apiClient.get('/api/health/latest');
    return res.data;
  },

  getHealthHistory: async (limit = 60) => {
    const res = await apiClient.get(`/api/health/history?limit=${limit}`);
    return res.data;
  },

  // Environment
  getLatestEnvironment: async () => {
    const res = await apiClient.get('/api/environment/latest');
    return res.data;
  },

  getEnvironmentHistory: async (limit = 60) => {
    const res = await apiClient.get(`/api/environment/history?limit=${limit}`);
    return res.data;
  },

  // Risk
  getCurrentRisk: async () => {
    const res = await apiClient.get('/api/risk/current');
    return res.data;
  },

  // Alerts
  getAlerts: async (limit = 30) => {
    const res = await apiClient.get(`/api/alerts?limit=${limit}`);
    return res.data;
  },

  getRecentAlerts: async () => {
    const res = await apiClient.get('/api/alerts/recent');
    return res.data;
  },

  acknowledgeAlert: async (id: string) => {
    const res = await apiClient.post(`/api/alerts/${id}/acknowledge`);
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
  getHistoricalTelemetry: async (limit = 60) => {
    const res = await apiClient.get(`/api/history?limit=${limit}`);
    return res.data;
  },
};
