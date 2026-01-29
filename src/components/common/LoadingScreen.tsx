/**
 * LoadingScreen Component
 * 
 * Fullscreen loading với logo từ API
 * Hiển thị khi chuyển trang với animation mượt mà
 * Background màu xám nhạt (bg-gray-50) để không gây flash đen
 */

import type { FC } from 'react';
import { createPortal } from 'react-dom';
import { useState, useEffect } from 'react';
import { useSettings } from '../../hooks/useSettings';

interface LoadingScreenProps {
  /**
   * Logo URL từ API
   */
  logoUrl?: string | null;
  
  /**
   * Trạng thái hiển thị
   */
  visible?: boolean;
}

/**
 * LoadingScreen - Logo loading từ API với animation
 * Background: rgb(249, 250, 251) - tailwind bg-gray-50
 */
export const LoadingScreen: FC<LoadingScreenProps> = ({
  logoUrl: propLogoUrl = null,
  visible = true,
}) => {
  const [isVisible, setIsVisible] = useState(visible);
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [logoError, setLogoError] = useState(false);
  
  // Hard code logo URL với media_id từ env
  const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://travel.link360.vn/api/v1';
  const logoMediaId = import.meta.env.VITE_LOGO_MEDIA_ID || '177';
  const logoUrl = propLogoUrl || `${baseURL}/media/${logoMediaId}/view`;
  
  // Fetch settings từ API để lấy primary_color
  const { settings } = useSettings();
  const primaryColor = settings?.primary_color || '#c2b07f'; // fallback
  
  // Debug: Log logo URL
  useEffect(() => {
    if (visible) {
      // console.log('[LoadingScreen] Logo URL:', logoUrl);
      
      // Preload image khi có logo URL
      if (logoUrl) {
        const img = new Image();
        img.src = logoUrl;
        img.onload = () => {
          // console.log('[LoadingScreen] Logo preloaded successfully');
          setLogoLoaded(true);
        };
        img.onerror = () => {
          console.error('[LoadingScreen] Logo preload failed');
          setLogoError(true);
        };
        // console.log('[LoadingScreen] Preloading logo image');
      }
    }
  }, [visible, logoUrl]);
  
  useEffect(() => {
    if (!visible) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 300); // Thời gian fade out
      return () => clearTimeout(timer);
    } else {
      setIsVisible(true);
    }
  }, [visible]);
  
  if (!isVisible) return null;

  const loadingContent = (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        minHeight: '100vh',
        backgroundColor: 'rgb(249, 250, 251)', // bg-gray-50
        zIndex: 999999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '2.5rem',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.3s ease-in-out',
      }}
    >
      {/* Logo Container với Spinner xoay quanh - Responsive */}
      <div style={{
        position: 'relative',
        width: 'clamp(200px, 20vw, 320px)',
        height: 'clamp(200px, 20vw, 320px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {/* Logo to nằm giữa - Responsive */}
        <div style={{
          position: 'absolute',
          width: 'clamp(140px, 16vw, 260px)',
          height: 'clamp(140px, 16vw, 260px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2,
        }}>
          {/* Skeleton shimmer effect - hiển thị khi logo đang load */}
          {!logoLoaded && !logoError && (
            <div style={{
              position: 'absolute',
              width: 'clamp(120px, 14vw, 240px)',
              height: 'clamp(120px, 14vw, 240px)',
              borderRadius: '50%',
              background: 'linear-gradient(90deg, rgb(229, 231, 235) 25%, rgb(243, 244, 246) 50%, rgb(229, 231, 235) 75%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 2s infinite, logoPulse 2s ease-in-out infinite',
            }} />
          )}
          
          {/* Logo thật - fade in khi load xong */}
          {logoUrl && (
            <img
              src={logoUrl}
              alt="Hotel Logo"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                opacity: logoLoaded ? 1 : 0,
                filter: logoLoaded ? 'blur(0px)' : 'blur(10px)',
                transform: logoLoaded ? 'scale(1)' : 'scale(0.9)',
                transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
                zIndex: 3,
              }}
              onLoad={() => {
                // console.log('[LoadingScreen] Logo loaded successfully');
                setLogoLoaded(true);
              }}
              onError={(_e) => {
                console.error('[LoadingScreen] Logo load error:', logoUrl);
                setLogoError(true);
              }}
            />
          )}
          
          {/* Fallback nếu logo error */}
          {logoError && (
            <div style={{
              width: 'clamp(90px, 12vw, 200px)',
              height: 'clamp(90px, 12vw, 200px)',
              borderRadius: '50%',
              backgroundColor: 'rgb(229, 231, 235)',
              animation: 'logoPulse 1.5s ease-in-out infinite',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 'clamp(36px, 5vw, 80px)',
              color: 'rgb(156, 163, 175)',
            }}>
              🏨
            </div>
          )}
        </div>

        {/* Spinner Ring xoay vòng quanh logo - Responsive border */}
        <div 
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            border: `clamp(3px, 0.4vw, 6px) solid ${primaryColor}33`, // 33 = 20% opacity
            borderTop: `clamp(3px, 0.4vw, 6px) solid ${primaryColor}`,
            borderRadius: '50%',
            animation: 'spinLoader 1.2s linear infinite',
            zIndex: 1,
          }}
        />
      </div>

      <style>{`
        @keyframes spinLoader {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }

        @keyframes logoScale {
          0% {
            opacity: 0;
            transform: scale(0.85);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes logoPulse {
          0%, 100% { 
            opacity: 0.6;
            transform: scale(1);
          }
          50% { 
            opacity: 0.8;
            transform: scale(1.02);
          }
        }

      `}</style>
    </div>
  );

  // Render qua Portal vào document.body để đảm bảo fullscreen
  return typeof document !== 'undefined' ? createPortal(loadingContent, document.body) : null;
};

export default LoadingScreen;
