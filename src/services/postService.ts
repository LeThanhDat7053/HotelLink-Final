import api from '../api';
import type { PostResponse, PostCreate, PostStatus } from '../types/api';

/**
 * Post Service - Quản lý posts (bài viết/nội dung)
 * Backend: GET /api/v1/posts/
 */

export const postService = {
  /**
   * Lấy danh sách posts
   */
  async getPosts(params?: {
    property_id?: number;
    feature_id?: number;
    status?: PostStatus;
    skip?: number;
    limit?: number;
    include_translations?: boolean;
  }): Promise<PostResponse[]> {
    const { data } = await api.get('/posts/', { params });
    return data;
  },

  /**
   * Lấy post theo ID
   */
  async getPostById(postId: number): Promise<PostResponse> {
    const { data } = await api.get(`/posts/${postId}`);
    return data;
  },

  /**
   * Tạo post mới
   */
  async createPost(post: PostCreate): Promise<PostResponse> {
    const { data } = await api.post('/posts/', post);
    return data;
  },

  /**
   * Update post
   */
  async updatePost(postId: number, updates: Partial<PostCreate>): Promise<PostResponse> {
    const { data } = await api.put(`/posts/${postId}`, updates);
    return data;
  },

  /**
   * Xóa post
   */
  async deletePost(postId: number): Promise<void> {
    await api.delete(`/posts/${postId}`);
  },

  /**
   * Publish post
   */
  async publishPost(postId: number): Promise<PostResponse> {
    const { data } = await api.post(`/posts/${postId}/publish`);
    return data;
  },

  /**
   * Archive post
   */
  async archivePost(postId: number): Promise<PostResponse> {
    const { data } = await api.post(`/posts/${postId}/archive`);
    return data;
  },
};
