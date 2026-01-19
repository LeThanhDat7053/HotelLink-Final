import api from '../api';
import type { UserResponse } from '../types/api';

/**
 * Get current logged-in user info
 * @returns UserResponse containing user details
 */
export const getCurrentUser = async (): Promise<UserResponse> => {
  const response = await api.get<UserResponse>('/users/me');
  return response.data;
};

export default {
  getCurrentUser,
};
