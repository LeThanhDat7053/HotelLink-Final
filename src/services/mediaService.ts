import api from '../api';
import type { MediaFileResponse } from '../types/api';

/**
 * Media Service - Quản lý media files (upload ảnh, video)
 * Backend: POST /api/v1/media/upload
 */

export const mediaService = {
  /**
   * Upload file
   */
  async uploadFile(
    file: File,
    options?: { kind?: string; alt_text?: string }
  ): Promise<MediaFileResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const params = new URLSearchParams();
    if (options?.kind) params.append('kind', options.kind);
    if (options?.alt_text) params.append('alt_text', options.alt_text);

    const { data } = await api.post(`/media/upload?${params.toString()}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },

  /**
   * Lấy danh sách media files
   */
  async getMediaFiles(params?: { skip?: number; limit?: number }): Promise<MediaFileResponse[]> {
    const { data } = await api.get('/media/', { params });
    return data;
  },

  /**
   * Download media file
   */
  async downloadMedia(mediaId: number): Promise<Blob> {
    const { data } = await api.get(`/media/${mediaId}/download`, {
      responseType: 'blob',
    });
    return data;
  },

  /**
   * Update media info
   */
  async updateMedia(
    mediaId: number,
    updates: { original_filename?: string; alt_text?: string; kind?: string }
  ): Promise<MediaFileResponse> {
    const params = new URLSearchParams();
    if (updates.original_filename) params.append('original_filename', updates.original_filename);
    if (updates.alt_text) params.append('alt_text', updates.alt_text);
    if (updates.kind) params.append('kind', updates.kind);

    const { data } = await api.put(`/media/${mediaId}?${params.toString()}`);
    return data;
  },

  /**
   * Xóa media file
   */
  async deleteMedia(mediaId: number): Promise<void> {
    await api.delete(`/media/${mediaId}`);
  },

  /**
   * Get media URL for display
   */
  getMediaUrl(fileKey: string): string {
    return `${import.meta.env.VITE_API_BASE_URL}/media/${fileKey}`;
  },

  /**
   * Get media view URL (public endpoint)
   */
  getMediaViewUrl(mediaId: number): string {
    return `${import.meta.env.VITE_API_BASE_URL}/media/${mediaId}/view`;
  },
};
