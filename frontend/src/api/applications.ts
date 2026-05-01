import { apiClient } from './client.ts';
import type { JobApplication, JobApplicationRequest, ApplicationStatus } from '../types/index.ts';

export const applicationsApi = {
  getAll: (status?: ApplicationStatus) =>
    apiClient.get<JobApplication[]>('/applications', { params: status ? { status } : {} }).then((r) => r.data),
  getById: (id: number) => apiClient.get<JobApplication>(`/applications/${id}`).then((r) => r.data),
  create: (data: JobApplicationRequest) => apiClient.post<JobApplication>('/applications', data).then((r) => r.data),
  update: (id: number, data: JobApplicationRequest) => apiClient.put<JobApplication>(`/applications/${id}`, data).then((r) => r.data),
  delete: (id: number) => apiClient.delete(`/applications/${id}`),
};
