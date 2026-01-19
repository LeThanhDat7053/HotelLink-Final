/**
 * Locale Service - Kết nối với API Property Locales
 * 
 * Backend: GET /api/v1/properties/{property_id}/locales
 * 
 * Returns danh sách ngôn ngữ được cấu hình cho property
 */

import api from '../api';
import type { PropertyLocaleResponse, LocaleResponse } from '../types/api';

// ===== ERROR HANDLING =====
interface APIError {
  detail?: string | Array<{ loc: (string | number)[]; msg: string; type: string }>;
  message?: string;
}

const handleAPIError = (error: any): never => {
  if (error.response) {
    const apiError = error.response.data as APIError;
    
    if (error.response.status === 422 && Array.isArray(apiError.detail)) {
      const errorMessages = apiError.detail
        .map((err) => `${err.loc.join('.')}: ${err.msg}`)
        .join('; ');
      throw new Error(`Validation Error: ${errorMessages}`);
    }
    
    if (error.response.status === 404) {
      throw new Error('Not Found: Property locales not configured');
    }
    
    const errorMessage = typeof apiError.detail === 'string' 
      ? apiError.detail 
      : apiError.message || 'API request failed';
    throw new Error(errorMessage);
  }
  
  if (error.request) {
    throw new Error('Network Error: Unable to connect to server');
  }
  
  throw error;
};

// ===== SERVICE METHODS =====

export const localeService = {
  /**
   * Lấy danh sách ngôn ngữ của property
   * 
   * @param propertyId - ID của property
   * @returns PropertyLocaleResponse[]
   * 
   * @example
   * const locales = await localeService.getPropertyLocales(10);
   * // Returns: [{ locale_code: 'vi', is_default: true }, { locale_code: 'en', is_default: false }]
   */
  async getPropertyLocales(propertyId: number): Promise<PropertyLocaleResponse[]> {
    try {
      const { data } = await api.get<PropertyLocaleResponse[]>(`/properties/${propertyId}/locales`);
      // Chỉ trả về các locale active
      return data.filter(locale => locale.is_active);
    } catch (error) {
      return handleAPIError(error);
    }
  },

  /**
   * Lấy locale mặc định của property
   */
  async getDefaultLocale(propertyId: number): Promise<PropertyLocaleResponse | null> {
    const locales = await this.getPropertyLocales(propertyId);
    return locales.find(l => l.is_default) || locales[0] || null;
  },

  /**
   * Lấy tất cả ngôn ngữ hỗ trợ từ hệ thống
   * API: GET /api/v1/locales/
   * 
   * @returns LocaleResponse[] - Danh sách ngôn ngữ với code, name, native_name
   */
  async getAllLocales(): Promise<LocaleResponse[]> {
    try {
      const { data } = await api.get<LocaleResponse[]>('/locales/', {
        params: { skip: 0, limit: 100 }
      });
      return data;
    } catch (error) {
      return handleAPIError(error);
    }
  },
};

export default localeService;
