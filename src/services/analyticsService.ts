import api from '../api';
import type { TrackingRequest, DashboardStatsResponse } from '../types/api';

/**
 * Analytics Service - Tracking và thống kê
 * Backend: POST /api/v1/analytics/track (public - no auth)
 */

export const analyticsService = {
  /**
   * Track event (PUBLIC - không cần auth)
   */
  async trackEvent(request: TrackingRequest): Promise<void> {
    // Note: Endpoint này PUBLIC nên không cần token
    const { data } = await api.post('/analytics/track', request);
    return data;
  },

  /**
   * Get dashboard stats (requires auth)
   */
  async getDashboardStats(days: number = 30): Promise<DashboardStatsResponse> {
    const { data } = await api.get('/analytics/dashboard-stats', {
      params: { days },
    });
    return data;
  },

  /**
   * Get property analytics
   */
  async getPropertyAnalytics(propertyId: number, days: number = 30): Promise<any> {
    const { data } = await api.get(`/analytics/properties/${propertyId}/stats`, {
      params: { days },
    });
    return data;
  },

  /**
   * Get realtime stats
   */
  async getRealtimeStats(): Promise<any> {
    const { data } = await api.get('/analytics/realtime');
    return data;
  },

  /**
   * Get analytics summary (daily/monthly)
   */
  async getAnalyticsSummary(period: 'daily' | 'monthly', days: number = 30): Promise<any> {
    const { data } = await api.get(`/analytics/summary/${period}`, {
      params: { days },
    });
    return data;
  },

  /**
   * Get public analytics stats (no auth)
   */
  async getPublicStats(tenantId: number = 4, days: number = 30): Promise<any> {
    const { data } = await api.get('/analytics/public-stats', {
      params: { tenant_id: tenantId, days },
    });
    return data;
  },
};
