import { apiClient } from './client.ts';
import type { PromptTemplate, PromptTemplateRequest } from '../types/index.ts';

export const promptsApi = {
  getAll: () => apiClient.get<PromptTemplate[]>('/prompts').then((r) => r.data),
  getById: (id: number) => apiClient.get<PromptTemplate>(`/prompts/${id}`).then((r) => r.data),
  create: (data: PromptTemplateRequest) => apiClient.post<PromptTemplate>('/prompts', data).then((r) => r.data),
  update: (id: number, data: PromptTemplateRequest) => apiClient.put<PromptTemplate>(`/prompts/${id}`, data).then((r) => r.data),
  setDefault: (id: number) => apiClient.put<PromptTemplate>(`/prompts/${id}/set-default`).then((r) => r.data),
  delete: (id: number) => apiClient.delete(`/prompts/${id}`),
};
