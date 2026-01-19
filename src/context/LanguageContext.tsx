/**
 * Language Context - Quản lý ngôn ngữ toàn cục cho app
 * 
 * Cung cấp:
 * - currentLang: Ngôn ngữ hiện tại
 * - locale: Mã ngôn ngữ (vi, en, zh...)
 * - availableLocales: Danh sách ngôn ngữ từ API
 * - setLanguage: Function để đổi ngôn ngữ
 * - loading: Trạng thái loading locales
 */

import React, { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { localeService } from '../services/localeService';
import type { PropertyLocaleResponse, LocaleResponse } from '../types/api';
import { extractLanguageFromPath } from '../constants/routes';

export interface Language {
  code: string;
  name: string;        // native_name từ API
  isDefault?: boolean;
}

interface LanguageContextType {
  currentLang: Language;
  locale: string;
  availableLocales: Language[];
  loading: boolean;
  setLanguage: (lang: Language) => void;
  setLocale: (code: string) => void;
}

const DEFAULT_LANGUAGE: Language = {
  code: 'vi',
  name: 'Tiếng Việt',
  isDefault: true,
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
  propertyId?: number | null;
}

// Cache cho all locales từ API /api/v1/locales/
let cachedAllLocales: LocaleResponse[] | null = null;

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children, propertyId }) => {
  const [currentLang, setCurrentLang] = useState<Language>(DEFAULT_LANGUAGE);
  const [availableLocales, setAvailableLocales] = useState<Language[]>([DEFAULT_LANGUAGE]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // Extract language từ current URL path
  const urlLanguage = extractLanguageFromPath(location.pathname);

  // Fetch locales từ API khi có propertyId
  useEffect(() => {
    const fetchLocales = async () => {
      if (!propertyId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Fetch all locales từ /api/v1/locales/ (cache lại)
        if (!cachedAllLocales) {
          cachedAllLocales = await localeService.getAllLocales();
        }
        
        // Fetch property locales từ /api/v1/properties/{id}/locales
        const propertyLocales = await localeService.getPropertyLocales(propertyId);
        
        // Map property locales với all locales để lấy native_name
        const languages: Language[] = propertyLocales.map((propLocale: PropertyLocaleResponse) => {
          // Tìm locale info từ all locales API
          const localeInfo = cachedAllLocales?.find(l => l.code === propLocale.locale_code);
          
          return {
            code: propLocale.locale_code,
            name: localeInfo?.native_name || propLocale.locale_code.toUpperCase(),
            isDefault: propLocale.is_default,
          };
        });

        if (languages.length > 0) {
          setAvailableLocales(languages);
          
          // Find language based on URL, or use default
          const urlLang = languages.find(l => l.code === urlLanguage);
          
          if (urlLang) {
            // URL has language info - use it
            setCurrentLang(urlLang);
          } else {
            // No language in URL - check localStorage or use default
            const savedLocale = localStorage.getItem('preferred_language');
            const savedLang = savedLocale ? languages.find(l => l.code === savedLocale) : null;
            const defaultLang = languages.find(l => l.isDefault) || languages[0];
            setCurrentLang(savedLang || defaultLang);
          }
        }
      } catch (error) {
        console.error('[LanguageContext] Failed to fetch locales:', error);
        // Keep default locale on error
      } finally {
        setLoading(false);
      }
    };

    fetchLocales();
  }, [propertyId]);

  const setLanguage = useCallback((lang: Language) => {
    setCurrentLang(lang);
    localStorage.setItem('preferred_language', lang.code);
    // Note: Navigation được handle bởi Header component khi user chọn language
  }, []);

  const setLocale = useCallback((code: string) => {
    const lang = availableLocales.find(l => l.code === code);
    if (lang) {
      setLanguage(lang);
    }
  }, [availableLocales, setLanguage]);

  return (
    <LanguageContext.Provider value={{ 
      currentLang, 
      locale: currentLang.code,
      availableLocales,
      loading,
      setLanguage,
      setLocale 
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Helper hook để chỉ lấy locale code
export const useLocale = (): string => {
  const { locale } = useLanguage();
  return locale;
};

export default LanguageContext;
