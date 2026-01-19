import api from '../api';
import type { PropertyResponse } from '../types/api';

/**
 * Property Service - Quản lý properties (khách sạn)
 * Backend: GET /api/v1/properties/
 */

export const propertyService = {
  /**
   * Lấy danh sách properties
   */
  async getProperties(params?: { skip?: number; limit?: number }): Promise<PropertyResponse[]> {
    const { data } = await api.get('/properties/', { params });
    return data;
  },

  /**
   * Lấy property theo ID
   */
  async getPropertyById(propertyId: number): Promise<PropertyResponse> {
    const { data } = await api.get(`/properties/${propertyId}`);
    return data;
  },

  /**
   * Lấy property theo code
   */
  async getPropertyByCode(propertyCode: string): Promise<PropertyResponse> {
    const { data } = await api.get(`/properties/by-code/${propertyCode}`);
    return data;
  },

  /**
   * Update property
   */
  async updateProperty(
    propertyId: number,
    updates: Partial<PropertyResponse>
  ): Promise<PropertyResponse> {
    const { data } = await api.put(`/properties/${propertyId}`, updates);
    return data;
  },
};
