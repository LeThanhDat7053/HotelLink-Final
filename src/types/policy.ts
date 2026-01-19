/**
 * Policy Types - API Response và UI Data
 */

// ===== API RESPONSE TYPES =====

export interface PolicyContentByLocale {
  title: string;
  shortDescription: string;
  detailedContent: string;
}

export interface PolicyResponse {
  isDisplaying: boolean;
  content: Record<string, PolicyContentByLocale>; // { en: {...}, vi: {...}, zh: {...} }
  vr360Link: string | null;
  vrTitle: string | null;
}

// ===== UI DATA TYPES =====

export interface PolicyUIData {
  title: string;
  shortDescription: string;
  detailedContent: string;
  vr360Link: string | null;
  vrTitle: string | null;
  isDisplaying: boolean;
}
