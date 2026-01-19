/**
 * Facility Service - API calls và data transformation
 */

import api from '../api';
import type { FacilityResponse, FacilityUIData, GetFacilitiesParams } from '../types/facility';
import { mediaService } from './mediaService';

/**
 * Transform facility API response thành UI data
 */
export function transformFacilityForUI(
  facility: FacilityResponse,
  locale: string
): FacilityUIData {
  // Lấy translation theo locale, fallback về 'vi' nếu không có
  const translation = facility.translations[locale] || facility.translations['vi'] || facility.translations[Object.keys(facility.translations)[0]];
  
  // Lấy primary image (is_primary: true)
  const primaryMedia = facility.media.find(m => m.is_primary);
  const primaryImage = primaryMedia 
    ? mediaService.getMediaViewUrl(primaryMedia.media_id)
    : null;
  
  // Lấy gallery images (tất cả media không phải primary, sắp xếp theo sort_order)
  const galleryMediaItems = facility.media
    .filter(m => !m.is_primary)
    .sort((a, b) => a.sort_order - b.sort_order);
  
  const galleryImages = galleryMediaItems.map(m => 
    mediaService.getMediaViewUrl(m.media_id)
  );

  return {
    id: facility.id,
    code: facility.code,
    facility_type: facility.facility_type,
    operating_hours: facility.operating_hours,
    status: facility.status,
    
    // Localized
    name: translation?.name || 'Unnamed Facility',
    description: translation?.description || '',
    
    // Media
    primaryImage,
    galleryImages,
    
    // VR360
    vrLink: facility.vr_link,
    
    // Meta
    display_order: facility.display_order,
    created_at: facility.created_at,
    updated_at: facility.updated_at,
  };
}

/**
 * Lấy danh sách facilities từ API
 */
export async function getFacilities(
  propertyId: number,
  params?: GetFacilitiesParams
): Promise<FacilityResponse[]> {
  const response = await api.get<FacilityResponse[]>('/vr-hotel/facilities', {
    params: {
      skip: params?.skip || 0,
      limit: params?.limit || 100,
      facility_type: params?.facility_type,
    },
    headers: {
      'x-property-id': propertyId,
    },
  });
  
  return response.data;
}

/**
 * Lấy facility với UI data đã transform (sorted by display_order)
 */
export function getFacilitiesForUI(
  propertyId: number,
  locale: string,
  params?: GetFacilitiesParams
): Promise<FacilityUIData[]> {
  return getFacilities(propertyId, params).then(facilities => {
    // Transform từng facility thành UI data
    const uiData = facilities.map(facility => transformFacilityForUI(facility, locale));
    
    // Sort theo display_order
    return uiData.sort((a, b) => a.display_order - b.display_order);
  });
}

export const facilityService = {
  getFacilities,
  getFacilitiesForUI,
  transformFacilityForUI,
};
