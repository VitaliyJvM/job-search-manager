import { apiClient } from './client.ts';
import type { DashboardStats } from '../types/index.ts';

export const dashboardApi = {
  getStats: () => apiClient.get<DashboardStats>('/dashboard/stats').then((r) => r.data),
};
