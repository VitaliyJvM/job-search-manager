import { apiClient } from './client.ts';
import type { ResumeDocument, ResumeTextRequest } from '../types/index.ts';

export const resumesApi = {
  getAll: () => apiClient.get<ResumeDocument[]>('/resumes').then((r) => r.data),
  getById: (id: number) => apiClient.get<ResumeDocument>(`/resumes/${id}`).then((r) => r.data),
  uploadFile: (file: File, name: string, isMaster: boolean) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);
    formData.append('isMaster', String(isMaster));
    return apiClient
      .post<ResumeDocument>('/resumes/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data);
  },
  saveText: (data: ResumeTextRequest) => apiClient.post<ResumeDocument>('/resumes/text', data).then((r) => r.data),
  delete: (id: number) => apiClient.delete(`/resumes/${id}`),
};
