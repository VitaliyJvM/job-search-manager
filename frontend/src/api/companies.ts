import { apiClient } from './client.ts';
import type { Company, CompanyRequest } from '../types/index.ts';

export const companiesApi = {
  getAll: () => apiClient.get<Company[]>('/companies').then((r) => r.data),
  getById: (id: number) => apiClient.get<Company>(`/companies/${id}`).then((r) => r.data),
  create: (data: CompanyRequest) => apiClient.post<Company>('/companies', data).then((r) => r.data),
  update: (id: number, data: CompanyRequest) => apiClient.put<Company>(`/companies/${id}`, data).then((r) => r.data),
  delete: (id: number) => apiClient.delete(`/companies/${id}`),
};
