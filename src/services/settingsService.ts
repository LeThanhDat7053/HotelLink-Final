/**
 * Settings Service - Quản lý VR Hotel Settings
 * Backend: GET /api/v1/vr-hotel/settings
 * 
 * API này yêu cầu headers:
 * - X-Tenant-Code: Tenant code
 * - X-Property-Id: Property ID
 * 
 * Note: API client (src/api.ts) đã tự động inject các headers này
 */

import api from '../api';
import type { VRHotelSettingsResponse } from '../types/settings';

export const settingsService = {
  /**
   * Lấy VR Hotel settings cho property
   * Response chứa: primary_color, booking_url, messenger_url, phone_number,
   * logo_media_id, favicon_media_id, seo, pages
   * 
   * @returns Promise<VRHotelSettingsResponse>
   */
  async getVRHotelSettings(): Promise<VRHotelSettingsResponse> {
    const { data } = await api.get<VRHotelSettingsResponse>('/vr-hotel/settings');
    return data;
  },

  /**
   * Lấy URL của logo từ media_id
   * Sử dụng media service để convert media_id thành URL
   * 
   * @param logoMediaId - ID của logo media
   * @returns Promise<string | null> - URL của logo hoặc null nếu không có
   */
  async getLogoUrl(logoMediaId?: number): Promise<string | null> {
    if (!logoMediaId) return null;
    
    try {
      // Trả về direct URL để xem media
      // Format: https://travel.link360.vn/api/v1/media/{id}/view
      const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://travel.link360.vn/api/v1';
      return `${baseURL}/media/${logoMediaId}/view`;
    } catch (error) {
      console.error('Failed to fetch logo URL:', error);
      return null;
    }
  },

  /**
   * Lấy logo URL trực tiếp từ settings
   * Kết hợp getVRHotelSettings và getLogoUrl
   * 
   * @returns Promise<{ logoUrl: string | null; settings: VRHotelSettingsResponse }>
   */
  async getSettingsWithLogoUrl(): Promise<{
    logoUrl: string | null;
    settings: VRHotelSettingsResponse;
  }> {
    const settings = await this.getVRHotelSettings();
    const logoUrl = await this.getLogoUrl(settings.logo_media_id);
    
    return { logoUrl, settings };
  },
};
