/**
 * Dining Service - API calls và data transformation
 */

import api from '../api';
import type { DiningResponse, DiningUIData, GetDiningsParams } from '../types/dining';
import { mediaService } from './mediaService';

/**
 * Transform dining API response thành UI data
 */
export function transformDiningForUI(
  dining: DiningResponse,
  locale: string
): DiningUIData {
  // Lấy translation theo locale, fallback về 'vi' nếu không có
  const translation = dining.translations[locale] || dining.translations['vi'] || dining.translations[Object.keys(dining.translations)[0]];
  
  // Lấy primary image (is_primary: true)
  const primaryMedia = dining.media.find(m => m.is_primary);
  const primaryImage = primaryMedia 
    ? mediaService.getMediaViewUrl(primaryMedia.media_id)
    : null;
  
  // Lấy gallery images (tất cả media không phải primary, sắp xếp theo sort_order)
  const galleryMediaItems = dining.media
    .filter(m => !m.is_primary)
    .sort((a, b) => a.sort_order - b.sort_order);
  
  const galleryImages = galleryMediaItems.map(m => 
    mediaService.getMediaViewUrl(m.media_id)
  );

  return {
    id: dining.id,
    code: dining.code,
    dining_type: dining.dining_type,
    status: dining.status,
    
    // Localized
    name: translation?.name || 'Unnamed Dining',
    description: translation?.description || '',
    
    // Media
    primaryImage,
    galleryImages,
    
    // VR360
    vrLink: dining.vr_link,
    
    // Meta
    display_order: dining.display_order,
    created_at: dining.created_at,
    updated_at: dining.updated_at,
  };
}

/**
 * Lấy danh sách dining venues từ API
 */
export async function getDinings(
  propertyId: number,
  params?: GetDiningsParams
): Promise<DiningResponse[]> {
  const response = await api.get<DiningResponse[]>('/vr-hotel/dining', {
    params: {
      skip: params?.skip || 0,
      limit: params?.limit || 100,
      dining_type: params?.dining_type,
    },
    headers: {
      'x-property-id': propertyId,
    },
  });
  
  return response.data;
}

/**
 * Lấy dining với UI data đã transform (sorted by display_order)
 */
export function getDiningsForUI(
  propertyId: number,
  locale: string,
  params?: GetDiningsParams
): Promise<DiningUIData[]> {
  return getDinings(propertyId, params).then(dinings => {
    // Transform từng dining thành UI data
    const uiData = dinings.map(dining => transformDiningForUI(dining, locale));
    
    // Sort theo display_order
    return uiData.sort((a, b) => a.display_order - b.display_order);
  });
}

export const diningService = {
  getDinings,
  getDiningsForUI,
  transformDiningForUI,
};
