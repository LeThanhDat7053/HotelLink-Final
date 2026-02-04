/**
 * SEOMeta Component
 * Component để quản lý meta tags cho SEO và social sharing
 * Hỗ trợ: Open Graph, Twitter Cards, Zalo sharing, Alternate Links (hreflang)
 */

import { useEffect, type FC } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { getLocalizedPath } from '../../constants/routes';
import { useLocation } from 'react-router-dom';

export const SEOMeta: FC = () => {
  const { logoUrl, faviconUrl, seo } = useTheme();
  const { locale } = useLanguage();
  const location = useLocation();
  
  // Force reload favicon khi API trả về data
  useEffect(() => {
    if (faviconUrl) {
      // Remove old favicon links
      const oldLinks = document.querySelectorAll('link[rel*="icon"]');
      oldLinks.forEach(link => link.remove());
      
      // Add new favicon with cache buster
      const link = document.createElement('link');
      link.rel = 'icon';
      link.href = `${faviconUrl}?v=${Date.now()}`;
      document.head.appendChild(link);
    }
  }, [faviconUrl]);
  
  // Lấy SEO data từ API theo locale hiện tại
  const seoData = seo?.[locale];
  
  // Fallback: nếu locale hiện tại không có data, thử dùng 'vi', sau đó 'en', cuối cùng là locale đầu tiên có data
  const fallbackSeoData = seoData || seo?.['vi'] || seo?.['en'] || (seo ? seo[Object.keys(seo)[0]] : null);
  
  // SEO data từ API với fallback
  const finalTitle = fallbackSeoData?.meta_title || '';
  const finalDescription = fallbackSeoData?.meta_description || '';
  const finalKeywords = fallbackSeoData?.meta_keywords || '';
  
  // Tạo full title với branding (nếu có title)
  const fullTitle = finalTitle ? (finalTitle.length > 50 ? finalTitle : `${finalTitle} | HotelLink`) : 'HotelLink';
  
  // Chỉ dùng logo từ API
  const ogImage = logoUrl || '';
  
  // Thêm image dimensions cho better social sharing
  const ogImageWidth = '1200';
  const ogImageHeight = '630';
  
  const url = window.location.href;
  const type = 'website';
  
  // ===== TẠO ALTERNATE LINKS CHO TẤT CẢ NGÔN NGỮ TỪ API =====
  // Extract clean path (không có language prefix)
  const extractCleanPath = (pathname: string): string => {
    const langMatch = pathname.match(/^\/([a-zA-Z]{2,3}(?:-[a-zA-Z]{2})?)(?:\/(.*))?$/);
    const validLocales = ['ar', 'de', 'en', 'es', 'fr', 'hi', 'id', 'it', 'ja', 'ko', 'ms', 'pt', 'ru', 'ta', 'th', 'tl', 'vi', 'yue', 'zh', 'zh-TW'];
    if (langMatch && validLocales.includes(langMatch[1])) {
      return langMatch[2] ? `/${langMatch[2]}` : '/';
    }
    return pathname;
  };
  
  const cleanPath = extractCleanPath(location.pathname);
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  
  // Lấy tất cả locale codes có trong SEO data từ API
  const availableLocales = seo ? Object.keys(seo) : [];
  
  // Tạo alternate links cho từng locale
  const alternateLinks = availableLocales.map(localeCode => {
    const localizedPath = getLocalizedPath(cleanPath, localeCode);
    const fullUrl = `${baseUrl}${localizedPath}`;
    return {
      locale: localeCode,
      url: fullUrl
    };
  });

  return (
    <Helmet>
      {/* Favicon được handle bởi useEffect để force reload */}
      
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      {finalDescription && <meta name="description" content={finalDescription} />}
      {finalKeywords && <meta name="keywords" content={finalKeywords} />}
      <meta name="author" content="HotelLink" />
      
      {/* Open Graph Meta Tags - CHỈ RENDER KHI CÓ DATA */}
      {logoUrl && finalTitle && (
        <>
          <meta property="og:type" content={type} />
          <meta property="og:title" content={fullTitle} />
          {finalDescription && <meta property="og:description" content={finalDescription} />}
          <meta property="og:image" content={ogImage} />
          <meta property="og:image:secure_url" content={ogImage} />
          <meta property="og:image:width" content={ogImageWidth} />
          <meta property="og:image:height" content={ogImageHeight} />
          <meta property="og:image:alt" content={fullTitle} />
          <meta property="og:url" content={url} />
          <meta property="og:site_name" content="HotelLink" />
          <meta property="og:locale" content="vi_VN" />
        </>
      )}
      
      {/* Twitter Card Meta Tags - CHỈ RENDER KHI CÓ DATA */}
      {logoUrl && finalTitle && (
        <>
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={fullTitle} />
          {finalDescription && <meta name="twitter:description" content={finalDescription} />}
          <meta name="twitter:image" content={ogImage} />
          <meta name="twitter:image:alt" content={fullTitle} />
        </>
      )}
      
      {/* Zalo specific (uses Open Graph) - CHỈ RENDER KHI CÓ IMAGE */}
      {logoUrl && <meta property="zalo:image" content={ogImage} />}
      
      {/* Mobile Web App Meta Tags */}
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content="HotelLink" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      
      {/* ===== ALTERNATE LINKS (HREFLANG) CHO TẤT CẢ NGÔN NGỮ ===== */}
      {/* Luôn hiển thị alternate links từ API, bất kể locale nào đang được chọn */}
      {alternateLinks.map(({ locale: linkLocale, url: linkUrl }) => (
        <link 
          key={linkLocale}
          rel="alternate" 
          hrefLang={linkLocale} 
          href={linkUrl} 
        />
      ))}
      
      {/* x-default alternate link (fallback cho search engines) */}
      {alternateLinks.length > 0 && (
        <link 
          rel="alternate" 
          hrefLang="x-default" 
          href={alternateLinks.find(link => link.locale === 'vi')?.url || alternateLinks[0].url} 
        />
      )}
    </Helmet>
  );
};

export default SEOMeta;
