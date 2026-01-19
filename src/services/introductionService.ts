/**
 * Introduction Service - Kết nối với API VR Hotel Introduction
 * 
 * Backend: GET /api/v1/vr-hotel/introduction
 * Headers required: x-tenant-code, x-property-id, Authorization
 * 
 * Returns:
 * - isDisplaying: Display toggle status
 * - content: Multi-language content object
 * - vr360Link: VR360 tour link
 * - vrTitle: VR360 section title
 */

import api from '../api';
import type { VRHotelIntroductionResponse } from '../types/api';

// ===== ERROR HANDLING =====
interface APIError {
  detail?: string | Array<{ loc: (string | number)[]; msg: string; type: string }>;
  message?: string;
}

const handleAPIError = (error: any): never => {
  if (error.response) {
    const apiError = error.response.data as APIError;
    
    // FastAPI validation errors (422)
    if (error.response.status === 422 && Array.isArray(apiError.detail)) {
      const errorMessages = apiError.detail
        .map((err) => `${err.loc.join('.')}: ${err.msg}`)
        .join('; ');
      throw new Error(`Validation Error: ${errorMessages}`);
    }
    
    // 401 Unauthorized
    if (error.response.status === 401) {
      throw new Error('Unauthorized: Invalid or expired token');
    }
    
    // 403 Forbidden
    if (error.response.status === 403) {
      throw new Error('Forbidden: Access denied');
    }
    
    // 404 Not Found
    if (error.response.status === 404) {
      throw new Error('Not Found: Introduction content not available');
    }
    
    // Other API errors
    const errorMessage = typeof apiError.detail === 'string' 
      ? apiError.detail 
      : apiError.message || 'API request failed';
    throw new Error(errorMessage);
  }
  
  // Network error
  if (error.request) {
    throw new Error('Network Error: Unable to connect to server');
  }
  
  throw error;
};

// ===== SERVICE METHODS =====

export const introductionService = {
  /**
   * Lấy nội dung giới thiệu VR Hotel
   * 
   * @param propertyId - ID của property (khách sạn)
   * @returns VRHotelIntroductionResponse
   * 
   * @example
   * // Gọi API với property ID
   * const intro = await introductionService.getIntroduction(10);
   * console.log(intro.content['vi'].title); // "Chào mừng đến với Link Hotel VR360"
   */
  async getIntroduction(propertyId: number): Promise<VRHotelIntroductionResponse> {
    try {
      const { data } = await api.get<VRHotelIntroductionResponse>('/vr-hotel/introduction', {
        headers: {
          'x-property-id': propertyId.toString(),
        },
      });
      return data;
    } catch (error) {
      return handleAPIError(error);
    }
  },

  /**
   * Lấy content theo locale cụ thể
   * 
   * @param propertyId - ID của property
   * @param locale - Mã ngôn ngữ ('vi', 'en', 'zh-TW')
   * @returns IntroductionContent hoặc null nếu không có
   * 
   * @example
   * const viContent = await introductionService.getIntroductionByLocale(10, 'vi');
   */
  async getIntroductionByLocale(propertyId: number, locale: string) {
    const response = await this.getIntroduction(propertyId);
    return response.content[locale] || null;
  },
};

export default introductionService;
