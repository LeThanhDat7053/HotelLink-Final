/**
 * API Cache Helper
 * Cache API responses để giảm số lần gọi API và tăng performance
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresIn: number;
}

class APICache {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private defaultExpiry = 5 * 60 * 1000; // 5 minutes

  /**
   * Lưu data vào cache
   */
  set<T>(key: string, data: T, expiresIn?: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiresIn: expiresIn || this.defaultExpiry,
    });
  }

  /**
   * Lấy data từ cache
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) return null;
    
    // Kiểm tra xem cache đã hết hạn chưa
    const now = Date.now();
    const isExpired = now - entry.timestamp > entry.expiresIn;
    
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data as T;
  }

  /**
   * Xóa cache theo key
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Xóa toàn bộ cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Xóa cache hết hạn
   */
  cleanup(): void {
    const now = Date.now();
    
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.expiresIn) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Lấy số lượng cache entries
   */
  size(): number {
    return this.cache.size;
  }
}

// Export singleton instance
export const apiCache = new APICache();

// Cleanup cache mỗi 10 phút
setInterval(() => {
  apiCache.cleanup();
}, 10 * 60 * 1000);

export default apiCache;
