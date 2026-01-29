/**
 * PageLoadingSpinner Component
 * 
 * Component hiển thị loading khi chuyển trang
 * Sử dụng logo từ API VR Hotel Settings
 * Sử dụng React Portal để render fullscreen overlay
 * 
 * Features:
 * - Hiển thị logo với animation pulse/fade
 * - Spinner xung quanh logo
 * - Fullscreen overlay với backdrop blur
 * - Responsive design
 * - React Portal để render ngoài DOM tree
 */

import type { FC } from 'react';
import { createPortal } from 'react-dom';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

interface PageLoadingSpinnerProps {
  /**
   * Hiển thị text loading
   */
  showText?: boolean;
  
  /**
   * Custom loading text
   */
  text?: string;
  
  /**
   * Size của spinner (small, default, large)
   */
  size?: 'small' | 'default' | 'large';
  
  /**
   * Logo URL từ bên ngoài (preloaded)
   */
  logoUrl?: string | null;
}

/**
 * PageLoadingSpinner - Loading indicator với logo
 * Hiển thị NGAY LẬP TỨC với spinner, sau đó load logo nếu có
 * Dùng Portal để render fullscreen overlay
 */
export const PageLoadingSpinner: FC<PageLoadingSpinnerProps> = ({
  showText = true,
  text = 'Đang tải...',
  size = 'large',
  logoUrl = null,
}) => {
  // Custom spinner icon
  const antIcon = <LoadingOutlined style={{ fontSize: size === 'large' ? 48 : size === 'small' ? 24 : 32 }} spin />;

  const loadingContent = (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 999999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
        {/* Logo với animation pulse */}
        {logoUrl ? (
          // Logo với animation - hiển thị ngay nếu có
          <div style={{ position: 'relative', animation: 'fadeIn 0.3s ease-out' }}>
            <img
              src={logoUrl}
              alt="Logo"
              style={{
                width: '128px',
                height: '128px',
                objectFit: 'contain',
                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
              }}
            />
            
            {/* Spinner ring xung quanh logo */}
            <div 
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: -1,
              }}
            >
              <div 
                style={{
                  width: '160px',
                  height: '160px',
                  borderRadius: '50%',
                  border: '4px solid rgba(0,0,0,0.1)',
                  borderTopColor: 'var(--primary-color, #c2b07f)',
                  animation: 'spin 1s linear infinite',
                }}
              />
            </div>
          </div>
        ) : (
          // Fallback spinner nếu chưa có logo - HIỂN THỊ NGAY
          <div style={{ position: 'relative' }}>
            <div 
              style={{
                width: '128px',
                height: '128px',
                backgroundColor: '#f3f4f6',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Spin indicator={antIcon} size={size} />
            </div>
          </div>
        )}

        {/* Loading text */}
        {showText && (
          <p 
            style={{
              fontSize: '16px',
              color: '#4b5563',
              fontWeight: 500,
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
              margin: 0,
            }}
          >
            {text}
          </p>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
      `}</style>
    </div>
  );

  // Render qua Portal vào document.body
  return typeof document !== 'undefined' ? createPortal(loadingContent, document.body) : null;
};

/**
 * SimpleLoadingSpinner - Loading đơn giản không dùng logo
 */
export const SimpleLoadingSpinner: FC<{ text?: string }> = ({ text = 'Đang tải...' }) => {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <Spin tip={text} size="large" />
    </div>
  );
};

export default PageLoadingSpinner;
