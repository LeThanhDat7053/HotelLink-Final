/**
 * Service Service - API calls và data transformation
 */

import api from '../api';
import type { ServiceResponse, ServiceUIData, GetServicesParams } from '../types/service';
import { mediaService } from './mediaService';

/**
 * Transform service API response thành UI data
 */
export function transformServiceForUI(
  service: ServiceResponse,
  locale: string
): ServiceUIData {
  // Lấy translation theo locale, fallback về 'vi' nếu không có
  const translation = service.translations[locale] || service.translations['vi'] || service.translations[Object.keys(service.translations)[0]];
  
  // Lấy primary image (is_primary: true)
  const primaryMedia = service.media.find(m => m.is_primary);
  const primaryImage = primaryMedia 
    ? mediaService.getMediaViewUrl(primaryMedia.media_id)
    : null;
  
  // Lấy gallery images (tất cả media không phải primary, sắp xếp theo sort_order)
  const galleryMediaItems = service.media
    .filter(m => !m.is_primary)
    .sort((a, b) => a.sort_order - b.sort_order);
  
  const galleryImages = galleryMediaItems.map(m => 
    mediaService.getMediaViewUrl(m.media_id)
  );

  return {
    id: service.id,
    code: service.code,
    service_type: service.service_type,
    pricing_info: service.pricing_info,
    status: service.status,
    
    // Localized
    name: translation?.name || 'Unnamed Service',
    description: translation?.description || '',
    
    // Media
    primaryImage,
    galleryImages,
    
    // VR360
    vrLink: service.vr_link,
    
    // Meta
    display_order: service.display_order,
    created_at: service.created_at,
    updated_at: service.updated_at,
  };
}

/**
 * Lấy danh sách services từ API
 */
export async function getServices(
  propertyId: number,
  params?: GetServicesParams
): Promise<ServiceResponse[]> {
  const response = await api.get<ServiceResponse[]>('/vr-hotel/services', {
    params: {
      skip: params?.skip || 0,
      limit: params?.limit || 100,
      service_type: params?.service_type,
    },
    headers: {
      'x-property-id': propertyId,
    },
  });
  
  return response.data;
}

/**
 * Lấy service với UI data đã transform (sorted by display_order)
 */
export function getServicesForUI(
  propertyId: number,
  locale: string,
  params?: GetServicesParams
): Promise<ServiceUIData[]> {
  return getServices(propertyId, params).then(services => {
    // Transform từng service thành UI data
    const uiData = services.map(service => transformServiceForUI(service, locale));
    
    // Sort theo display_order
    return uiData.sort((a, b) => a.display_order - b.display_order);
  });
}

export const serviceService = {
  getServices,
  getServicesForUI,
  transformServiceForUI,
};
