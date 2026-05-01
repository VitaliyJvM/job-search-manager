import { apiClient } from './client.ts';
import type { Conversation, ConversationRequest } from '../types/index.ts';

export const conversationsApi = {
  getAll: (contactId?: number) =>
    apiClient.get<Conversation[]>('/conversations', { params: contactId ? { contactId } : {} }).then((r) => r.data),
  getById: (id: number) => apiClient.get<Conversation>(`/conversations/${id}`).then((r) => r.data),
  create: (data: ConversationRequest) => apiClient.post<Conversation>('/conversations', data).then((r) => r.data),
  update: (id: number, data: ConversationRequest) => apiClient.put<Conversation>(`/conversations/${id}`, data).then((r) => r.data),
  delete: (id: number) => apiClient.delete(`/conversations/${id}`),
};
