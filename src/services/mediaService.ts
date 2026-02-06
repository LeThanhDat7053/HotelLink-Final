import api from '../api';
import type { MediaFileResponse, MediaResponse, GetMediaParams } from '../types/api';
import { appConfig } from '../config';

/**
 * Media Service - Quản lý media files (upload ảnh, video)
 * Backend: GET /api/v1/media/ - List media files
 * Backend: POST /api/v1/media/upload
 */

export const mediaService = {
  /**
   * Get media files with filtering
   * @param params - Query parameters for filtering
   * @returns Array of media files
   */
  async getMedia(params?: GetMediaParams): Promise<MediaResponse[]> {
    const { data } = await api.get<MediaResponse[]>('/media/', { 
      params: {
        skip: params?.skip || 0,
        limit: params?.limit || 100,
        source: params?.source,
        folder: params?.folder,
        entity_type: params?.entity_type,
      }
    });
    return data;
  },

  /**
   * Get media files for VR Hotel gallery (source = 'vr_hotel')
   * Automatically filters by current tenant
   */
  async getVRHotelMedia(params?: Omit<GetMediaParams, 'source'>): Promise<MediaResponse[]> {
    return this.getMedia({
      ...params,
      source: 'vr_hotel',
    });
  },

  /**
   * Get media URL for display from CDN
   * Returns the view URL for the media file (no auth required)
   */
  getMediaUrl(mediaId: number): string {
    // URL format: /media/{media_id}/view
    return `${appConfig.API_BASE_URL}/media/${mediaId}/view`;
  },

  /**
   * Get media URL from file_key
   */
  getMediaUrlByFileKey(fileKey: string): string {
    // Có thể có endpoint khác cho file_key, tạm thời dùng format này
    return `${appConfig.API_BASE_URL}/media/file/${fileKey}`;
  },

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
   * Lấy danh sách media files (legacy method)
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
   * Get media URL for display (legacy method)
   */
  getMediaUrlLegacy(fileKey: string): string {
    return `${import.meta.env.VITE_API_BASE_URL}/media/${fileKey}`;
  },

  /**
   * Get media view URL (public endpoint)
   */
  getMediaViewUrl(mediaId: number): string {
    return `${import.meta.env.VITE_API_BASE_URL}/media/${mediaId}/view`;
  },
};
