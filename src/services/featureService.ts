import api from '../api';
import type { FeatureResponse, FeatureCategoryResponse, FeatureCreate } from '../types/api';

/**
 * Feature Service - Quản lý features (tiện ích) và categories
 * Backend: GET /api/v1/features/, /api/v1/features/categories
 */

export const featureService = {
  // ============= CATEGORIES =============
  /**
   * Lấy danh sách feature categories
   */
  async getCategories(params?: {
    skip?: number;
    limit?: number;
    include_system?: boolean;
  }): Promise<FeatureCategoryResponse[]> {
    const { data } = await api.get('/features/categories', { params });
    return data;
  },

  /**
   * Lấy category theo ID
   */
  async getCategoryById(categoryId: number): Promise<FeatureCategoryResponse> {
    const { data } = await api.get(`/features/categories/${categoryId}`);
    return data;
  },

  // ============= FEATURES =============
  /**
   * Lấy danh sách features
   */
  async getFeatures(params?: {
    category_id?: number;
    skip?: number;
    limit?: number;
    include_system?: boolean;
  }): Promise<FeatureResponse[]> {
    const { data } = await api.get('/features/', { params });
    return data;
  },

  /**
   * Lấy feature theo ID
   */
  async getFeatureById(featureId: number): Promise<FeatureResponse> {
    const { data } = await api.get(`/features/${featureId}`);
    return data;
  },

  /**
   * Tạo feature mới
   */
  async createFeature(feature: FeatureCreate): Promise<FeatureResponse> {
    const { data } = await api.post('/features/', feature);
    return data;
  },

  /**
   * Update feature
   */
  async updateFeature(
    featureId: number,
    updates: Partial<FeatureCreate>
  ): Promise<FeatureResponse> {
    const { data } = await api.put(`/features/${featureId}`, updates);
    return data;
  },

  /**
   * Xóa feature
   */
  async deleteFeature(featureId: number): Promise<void> {
    await api.delete(`/features/${featureId}`);
  },
};
