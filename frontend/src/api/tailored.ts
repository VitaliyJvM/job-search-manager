import { apiClient } from './client.ts';
import type { TailoredResume, TailoringRequest } from '../types/index.ts';

export const tailoredApi = {
  getAll: (jobApplicationId?: number) =>
    apiClient.get<TailoredResume[]>('/tailored-resumes', { params: jobApplicationId ? { jobApplicationId } : {} }).then((r) => r.data),
  getById: (id: number) => apiClient.get<TailoredResume>(`/tailored-resumes/${id}`).then((r) => r.data),
  generate: (data: TailoringRequest) => apiClient.post<TailoredResume>('/tailored-resumes/generate', data).then((r) => r.data),
};
