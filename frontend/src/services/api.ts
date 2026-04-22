import axios from 'axios';
import type { 
  Investigation, 
  Briefing, 
  SiteLayout, 
  ApiResponse,
  Finding 
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Investigation endpoints
export const investigationApi = {
  start: async (): Promise<Investigation> => {
    const response = await api.post<ApiResponse<Investigation>>('/investigation/start');
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to start investigation');
    }
    return response.data.data;
  },

  getStatus: async (investigationId: string): Promise<Investigation> => {
    const response = await api.get<ApiResponse<Investigation>>(`/investigation/${investigationId}`);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to get investigation status');
    }
    return response.data.data;
  },

  updateFinding: async (
    investigationId: string, 
    findingId: string, 
    updates: Partial<Finding>
  ): Promise<Finding> => {
    const response = await api.patch<ApiResponse<Finding>>(
      `/investigation/${investigationId}/findings/${findingId}`,
      updates
    );
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to update finding');
    }
    return response.data.data;
  },
};

// Briefing endpoints
export const briefingApi = {
  generate: async (investigationId: string): Promise<Briefing> => {
    const response = await api.post<ApiResponse<Briefing>>('/briefing/generate', {
      investigationId,
    });
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to generate briefing');
    }
    return response.data.data;
  },

  update: async (briefingId: string, updates: Partial<Briefing>): Promise<Briefing> => {
    const response = await api.patch<ApiResponse<Briefing>>(
      `/briefing/${briefingId}`,
      updates
    );
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to update briefing');
    }
    return response.data.data;
  },

  export: async (briefingId: string, format: 'pdf' | 'json'): Promise<Blob> => {
    const response = await api.get(`/briefing/${briefingId}/export`, {
      params: { format },
      responseType: 'blob',
    });
    return response.data;
  },
};

// Map/Site data endpoints
export const siteApi = {
  getLayout: async (): Promise<SiteLayout> => {
    const response = await api.get<ApiResponse<SiteLayout>>('/site/layout');
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to get site layout');
    }
    return response.data.data;
  },
};

// Drone endpoints
export const droneApi = {
  planMission: async (targetZone: string): Promise<any> => {
    const response = await api.post('/drone/plan-mission', { targetZone });
    return response.data.data;
  },

  simulateMission: async (missionId: string): Promise<any> => {
    const response = await api.post(`/drone/simulate/${missionId}`);
    return response.data.data;
  },
};

export default api;