/**
 * Regulation Types - API Response và UI Data
 */

// ===== API RESPONSE TYPES =====

export interface RegulationContentByLocale {
  title: string;
  shortDescription: string;
  detailedContent: string;
}

export interface RegulationResponse {
  isDisplaying: boolean;
  content: Record<string, RegulationContentByLocale>; // { en: {...}, vi: {...}, zh: {...} }
  vr360Link: string | null;
  vrTitle: string | null;
}

// ===== UI DATA TYPES =====

export interface RegulationUIData {
  title: string;
  shortDescription: string;
  detailedContent: string;
  vr360Link: string | null;
  vrTitle: string | null;
  isDisplaying: boolean;
}
