/**
 * Custom Hook: useSettings
 * Hook để fetch và quản lý VR Hotel Settings
 * Bao gồm logo, favicon, primary_color, seo, pages settings
 */

import { useState, useEffect, useCallback } from 'react';
import { settingsService } from '../services/settingsService';
import type { VRHotelSettingsResponse } from '../types/settings';

// Cache keys
const SETTINGS_CACHE_KEY = 'vr_hotel_settings';
const SETTINGS_CACHE_TIMESTAMP_KEY = 'vr_hotel_settings_timestamp';
const LOGO_BASE64_CACHE_KEY = 'vr_hotel_logo_base64';
const FAVICON_BASE64_CACHE_KEY = 'vr_hotel_favicon_base64';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Helper function to convert image URL to base64
const imageUrlToBase64 = async (url: string): Promise<string> => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Failed to convert image to base64:', error);
    throw error;
  }
};

interface UseSettingsReturn {
  settings: VRHotelSettingsResponse | null;
  logoUrl: string | null;
  faviconUrl: string | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook để lấy VR Hotel settings và logo/favicon URLs
 * 
 * @returns {UseSettingsReturn}
 * 
 * @example
 * ```tsx
 * const { settings, logoUrl, faviconUrl, loading } = useSettings();
 * 
 * if (loading) return <Spin />;
 * if (logoUrl) return <img src={logoUrl} alt="Logo" />;
 * ```
 */
export const useSettings = (): UseSettingsReturn => {
  const [settings, setSettings] = useState<VRHotelSettingsResponse | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [faviconUrl, setFaviconUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check cache trước
      const cachedSettings = localStorage.getItem(SETTINGS_CACHE_KEY);
      const cachedTimestamp = localStorage.getItem(SETTINGS_CACHE_TIMESTAMP_KEY);
      const cachedLogoBase64 = localStorage.getItem(LOGO_BASE64_CACHE_KEY);
      const cachedFaviconBase64 = localStorage.getItem(FAVICON_BASE64_CACHE_KEY);
      
      if (cachedSettings && cachedTimestamp && cachedLogoBase64 && cachedFaviconBase64) {
        const age = Date.now() - parseInt(cachedTimestamp);
        if (age < CACHE_DURATION) {
          // console.log('[useSettings] Loading settings and images from cache');
          const parsedSettings = JSON.parse(cachedSettings);
          setSettings(parsedSettings);
          setLogoUrl(cachedLogoBase64);
          setFaviconUrl(cachedFaviconBase64);
          
          setLoading(false);
          return;
        }
      }
      
      // console.log('[useSettings] Fetching settings from API');
      
      // Fetch settings từ API
      const settingsData = await settingsService.getVRHotelSettings();
      setSettings(settingsData);

      // Cache settings
      try {
        localStorage.setItem(SETTINGS_CACHE_KEY, JSON.stringify(settingsData));
        localStorage.setItem(SETTINGS_CACHE_TIMESTAMP_KEY, Date.now().toString());
        // console.log('[useSettings] Cached settings to localStorage');
      } catch (err) {
        console.error('[useSettings] Failed to cache settings:', err);
      }

      // Fetch và convert logo to base64 nếu có logo_media_id
      if (settingsData.logo_media_id) {
        const logoUrl = await settingsService.getLogoUrl(settingsData.logo_media_id);
        if (logoUrl) {
          try {
            const logoBase64 = await imageUrlToBase64(logoUrl);
            setLogoUrl(logoBase64);
            localStorage.setItem(LOGO_BASE64_CACHE_KEY, logoBase64);
            // console.log('[useSettings] Cached logo base64 to localStorage');
          } catch (err) {
            console.error('[useSettings] Failed to convert logo to base64:', err);
            setLogoUrl(logoUrl); // fallback to URL
          }
        }
      }

      // Fetch và convert favicon to base64 nếu có favicon_media_id
      if (settingsData.favicon_media_id) {
        const faviconUrl = await settingsService.getLogoUrl(settingsData.favicon_media_id);
        if (faviconUrl) {
          try {
            const faviconBase64 = await imageUrlToBase64(faviconUrl);
            setFaviconUrl(faviconBase64);
            localStorage.setItem(FAVICON_BASE64_CACHE_KEY, faviconBase64);
            // console.log('[useSettings] Cached favicon base64 to localStorage');
          } catch (err) {
            console.error('[useSettings] Failed to convert favicon to base64:', err);
            setFaviconUrl(faviconUrl); // fallback to URL
          }
        }
      }
    } catch (err) {
      console.error('Failed to fetch VR Hotel settings:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return {
    settings,
    logoUrl,
    faviconUrl,
    loading,
    error,
    refetch: fetchSettings,
  };
};

/**
 * Hook đơn giản chỉ lấy logo URL
 * Tối ưu cho trường hợp chỉ cần logo
 * Cache vào localStorage để load nhanh hơn
 * 
 * @returns {{ logoUrl: string | null; loading: boolean }}
 */
export const useLogo = () => {
  const CACHE_KEY = 'vr_hotel_logo_url';
  const CACHE_TIMESTAMP_KEY = 'vr_hotel_logo_timestamp';
  const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
  
  // Khởi tạo với giá trị từ cache ngay lập tức
  const getCachedLogo = () => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
      
      if (cached && timestamp) {
        const age = Date.now() - parseInt(timestamp);
        if (age < CACHE_DURATION) {
          // console.log('[useLogo] Using cached logo URL:', cached);
          return cached;
        }
      }
    } catch (err) {
      console.error('[useLogo] Failed to read cache:', err);
    }
    return null;
  };
  
  const [logoUrl, setLogoUrl] = useState<string | null>(getCachedLogo());
  const [loading, setLoading] = useState(!getCachedLogo()); // Không loading nếu có cache

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        // Nếu đã có cache, không cần set loading
        if (!logoUrl) {
          setLoading(true);
        }
        
        const { logoUrl: url } = await settingsService.getSettingsWithLogoUrl();
        // console.log('[useLogo] Fetched logo URL:', url);
        
        if (url) {
          setLogoUrl(url);
          
          // Cache vào localStorage
          try {
            localStorage.setItem(CACHE_KEY, url);
            localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
            // console.log('[useLogo] Cached logo URL to localStorage');
          } catch (err) {
            console.error('[useLogo] Failed to cache logo:', err);
          }
        }
      } catch (err) {
        console.error('[useLogo] Failed to fetch logo:', err);
      } finally {
        setLoading(false);
      }
    };

    // Luôn fetch để cập nhật, nhưng nếu có cache thì không block UI
    fetchLogo();
  }, []);

  return { logoUrl, loading };
};
