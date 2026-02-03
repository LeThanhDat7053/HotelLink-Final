/**
 * LoadingScreen Component - Optimized Version
 * 
 * Fullscreen loading với logo từ API
 * Hiển thị khi chuyển trang với animation mượt mà
 * Background màu xám tối (bg-gray-800) để tối hơn
 * 
 * OPTIMIZATIONS:
 * - Giảm transition time cho faster feel
 * - Thêm will-change hints
 * - Optimized animation timing
 */

import type { FC } from 'react';
import { createPortal } from 'react-dom';
import { useState, useEffect, useRef } from 'react';
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
 * Background: rgb(31, 41, 55) - tailwind bg-gray-800
 */
export const LoadingScreen: FC<LoadingScreenProps> = ({
  logoUrl: propLogoUrl = null,
  visible = true,
}) => {
  const [isVisible, setIsVisible] = useState(visible);
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const hasPreloaded = useRef(false);
  const imgRef = useRef<HTMLImageElement | null>(null);
  
  // Logo URL từ env - không hardcode media_id
  const baseURL = import.meta.env.VITE_API_BASE_URL || '';
  const logoMediaId = import.meta.env.VITE_LOGO_MEDIA_ID || '';
  // Chỉ tạo fallback URL nếu có logoMediaId
  const fallbackLogoUrl = logoMediaId ? `${baseURL}/media/${logoMediaId}/view` : '';
  const logoUrl = propLogoUrl || fallbackLogoUrl;
  
  // Fetch settings từ API để lấy primary_color
  const { settings } = useSettings();
  const primaryColor = settings?.primary_color || '#c2b07f'; // fallback
  
  // Preload logo ngay lập tức khi component mount
  useEffect(() => {
    if (logoUrl && !hasPreloaded.current) {
      hasPreloaded.current = true;
      
      // Tạo Image object để preload
      const img = new Image();
      img.src = logoUrl;
      imgRef.current = img;
      
      // Kiểm tra nếu đã có trong cache
      if (img.complete && img.naturalHeight !== 0) {
        setLogoLoaded(true);
      } else {
        img.onload = () => setLogoLoaded(true);
        img.onerror = () => setLogoError(true);
      }
    }
  }, [logoUrl]);
  
  useEffect(() => {
    if (!visible) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 250); // Giảm fade out time từ 400ms xuống 250ms
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
        backgroundColor: 'rgb(31, 41, 55)', // bg-gray-800
        zIndex: 999999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '2.5rem',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.25s ease-out', // Nhanh hơn, ease-out cho feel tự nhiên
        willChange: 'opacity', // GPU acceleration hint
      }}
    >
      {/* Logo Container với Spinner xoay quanh - Responsive */}
      <div style={{
        position: 'relative',
        width: 'clamp(160px, 16vw, 280px)',
        height: 'clamp(160px, 16vw, 280px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {/* Logo to nằm giữa - Responsive */}
        <div style={{
          position: 'absolute',
          width: 'clamp(120px, 12vw, 200px)',
          height: 'clamp(120px, 12vw, 200px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2,
        }}>
          {/* Skeleton shimmer effect - hiển thị khi logo đang load */}
          {!logoLoaded && !logoError && (
            <div style={{
              position: 'absolute',
              width: 'clamp(100px, 10vw, 180px)',
              height: 'clamp(100px, 10vw, 180px)',
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
          
          {/* Khi logo error - chỉ hiện spinner, không hiện icon mặc định */}
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
