/**
 * VR Hotel Settings Types
 * Backend: GET /api/v1/vr-hotel/settings
 * 
 * Response từ API settings của property (VR-specific)
 */

// SEO metadata cho từng locale
export interface SEOMetadata {
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  [key: string]: string | undefined;
}

// SEO data với các locale khác nhau
export interface SEOData {
  [locale: string]: SEOMetadata;
}

// Cấu hình cho từng page
export interface PageSettings {
  vr_title?: string;
  vr360_link?: string;
  is_displaying?: boolean;
  [key: string]: any;
}

// Tất cả pages settings
export interface PagesSettings {
  rooms?: PageSettings;
  dining?: PageSettings;
  offers?: PageSettings;
  services?: PageSettings;
  facilities?: PageSettings;
  [key: string]: PageSettings | undefined;
}

/**
 * VR Hotel Settings Response
 */
export interface VRHotelSettingsResponse {
  primary_color: string;
  background_color?: string;
  booking_url?: string;
  messenger_url?: string;
  phone_number?: string;
  logo_media_id?: number;
  favicon_media_id?: number;
  seo?: SEOData;
  pages?: PagesSettings;
}

/**
 * Validation Error Response (422)
 */
export interface ValidationErrorDetail {
  loc: (string | number)[];
  msg: string;
  type: string;
}

export interface ValidationErrorResponse {
  detail: ValidationErrorDetail[];
}
