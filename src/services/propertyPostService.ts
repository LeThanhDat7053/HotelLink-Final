import api from '../api';
import type { PropertyPost } from '../types/api';

/**
 * Property Post Service - Quản lý posts của property
 * Backend: GET /api/v1/property-posts/
 */

export const propertyPostService = {
  /**
   * Lấy danh sách posts của property
   */
  async getPropertyPosts(params: {
    property_id: number;
    status?: 'draft' | 'published' | 'archived';
    skip?: number;
    limit?: number;
  }): Promise<PropertyPost[]> {
    const { data } = await api.get('/property-posts/', { params });
    return data;
  },

  /**
   * Lấy post theo ID
   */
  async getPostById(postId: number): Promise<PropertyPost> {
    const { data } = await api.get(`/property-posts/${postId}`);
    return data;
  },
};
