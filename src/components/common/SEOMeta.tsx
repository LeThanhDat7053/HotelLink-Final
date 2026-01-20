/**
 * SEOMeta Component
 * Component để quản lý meta tags cho SEO và social sharing
 * Hỗ trợ: Open Graph, Twitter Cards, Zalo sharing
 */

import { useEffect, type FC } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

export const SEOMeta: FC = () => {
  const { logoUrl, faviconUrl, seo } = useTheme();
  const { locale } = useLanguage();
  
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
  
  // SEO data từ API
  
  // Chỉ dùng API, không có fallback
  const finalTitle = seoData?.meta_title || '';
  const finalDescription = seoData?.meta_description || '';
  const finalKeywords = seoData?.meta_keywords || '';
  
  // Tạo full title với branding (nếu có title)
  const fullTitle = finalTitle ? (finalTitle.length > 50 ? finalTitle : `${finalTitle} | HotelLink`) : 'HotelLink';
  
  // Chỉ dùng logo từ API
  const ogImage = logoUrl || '';
  
  // Thêm image dimensions cho better social sharing
  const ogImageWidth = '1200';
  const ogImageHeight = '630';
  
  const url = window.location.href;
  const type = 'website';

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
    </Helmet>
  );
};

export default SEOMeta;
