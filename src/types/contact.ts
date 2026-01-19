/**
 * Contact Types - API Response và UI Data
 */

// ===== API RESPONSE TYPES =====

export interface ContactContentByLocale {
  description: string;
}

export interface ContactResponse {
  isDisplaying: boolean;
  phone: string;
  email: string;
  website: string;
  address: Record<string, string>; // { vi: "...", en: "...", zh: "..." }
  socialMedia: {
    twitter?: string;
    youtube?: string;
    facebook?: string;
    instagram?: string;
  };
  mapCoordinates: string;
  workingHours: Record<string, string>; // { vi: "...", en: "...", zh: "..." }
  vr360Link: string | null;
  vrTitle: string | null;
  content: Record<string, ContactContentByLocale>; // { vi: {...}, en: {...}, zh: {...} }
}

// ===== UI DATA TYPES =====

export interface ContactUIData {
  phone: string;
  email: string;
  website: string;
  address: string; // Locale-specific
  socialMedia: {
    twitter?: string;
    youtube?: string;
    facebook?: string;
    instagram?: string;
  };
  mapCoordinates: string;
  workingHours: string; // Locale-specific
  description: string; // Locale-specific
  vr360Link: string | null;
  vrTitle: string | null;
  isDisplaying: boolean;
}
