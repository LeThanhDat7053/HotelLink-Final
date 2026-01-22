/**
 * Property Context - Quản lý dữ liệu Property từ API
 * 
 * Cung cấp property info (name, contact...) cho toàn bộ app
 * 
 * Flow:
 * 1. Lấy VITE_PROPERTY_ID từ .env
 * 2. Fetch property detail từ /properties/{id}
 * 3. Để đổi property, chỉ cần sửa VITE_PROPERTY_ID và restart dev server
 */

import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { PropertyResponse } from '../types/api';
import { propertyService } from '../services/propertyService';

interface PropertyContextType {
  property: PropertyResponse | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export const PropertyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [property, setProperty] = useState<PropertyResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get property ID from env
      const propertyId = import.meta.env.VITE_PROPERTY_ID;
      if (!propertyId) {
        throw new Error('VITE_PROPERTY_ID is not defined in .env');
      }

      // Fetch property by ID directly
      const propertyData = await propertyService.getPropertyById(Number(propertyId));
      
      setProperty(propertyData);

    } catch (err) {
      console.error('[PropertyContext] Failed to fetch property:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch property'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperty();
  }, []);

  return (
    <PropertyContext.Provider value={{ property, loading, error, refetch: fetchProperty }}>
      {children}
    </PropertyContext.Provider>
  );
};

export const usePropertyContext = (): PropertyContextType => {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error('usePropertyContext must be used within a PropertyProvider');
  }
  return context;
};

// Helper hook để lấy property data với fallback
export const usePropertyData = () => {
  const { property, loading, error } = usePropertyContext();
  
  return {
    // ID
    propertyId: property?.id || null,
    
    // Basic info
    propertyName: property?.property_name || 'Hotel Name',
    code: property?.code || '',
    slogan: property?.slogan || '',
    description: property?.description || '',
    
    // Media
    bannerImages: property?.banner_images || [],
    introVideoUrl: property?.intro_video_url,
    vr360Url: property?.vr360_url,
    
    // Contact
    address: property?.address || '',
    district: property?.district || '',
    city: property?.city || '',
    country: property?.country || '',
    phoneNumber: property?.phone_number || '',
    email: property?.email || '',
    websiteUrl: property?.website_url || '',
    
    // Social
    facebookUrl: property?.facebook_url,
    youtubeUrl: property?.youtube_url,
    instagramUrl: property?.instagram_url,
    tiktokUrl: property?.tiktok_url,
    zaloOaId: property?.zalo_oa_id,
    
    // Map
    googleMapUrl: property?.google_map_url,
    latitude: property?.latitude,
    longitude: property?.longitude,
    
    // Theme
    primaryColor: property?.primary_color || '#ECC56D',
    secondaryColor: property?.secondary_color || '#1a1a2e',
    
    // Legal
    copyrightText: property?.copyright_text,
    termsUrl: property?.terms_url,
    privacyUrl: property?.privacy_url,
    
    // State
    loading,
    error,
    isLoaded: !loading && !error && !!property,
  };
};

// Alias for usePropertyData
export const useProperty = usePropertyData;
