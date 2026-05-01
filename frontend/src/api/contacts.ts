import { apiClient } from './client.ts';
import type { Contact, ContactRequest } from '../types/index.ts';

export const contactsApi = {
  getAll: (companyId?: number) =>
    apiClient.get<Contact[]>('/contacts', { params: companyId ? { companyId } : {} }).then((r) => r.data),
  getById: (id: number) => apiClient.get<Contact>(`/contacts/${id}`).then((r) => r.data),
  create: (data: ContactRequest) => apiClient.post<Contact>('/contacts', data).then((r) => r.data),
  update: (id: number, data: ContactRequest) => apiClient.put<Contact>(`/contacts/${id}`, data).then((r) => r.data),
  delete: (id: number) => apiClient.delete(`/contacts/${id}`),
};
