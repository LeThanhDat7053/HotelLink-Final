/**
 * Dynamic Theme Injector
 * Inject CSS variables vào document để override màu primary
 */

import { useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

export const ThemeInjector: React.FC = () => {
  const { primaryColor, loading } = useTheme();

  // Set CSS variable ngay lập tức để tránh flash màu vàng
  if (!loading && primaryColor) {
    document.documentElement.style.setProperty('--primary-color', primaryColor);
  }

  useEffect(() => {
    // Inject CSS variables vào :root
    document.documentElement.style.setProperty('--primary-color', primaryColor);
    
    // Inject inline styles để override các màu cứng
    const styleId = 'dynamic-theme-styles';
    let styleEl = document.getElementById(styleId) as HTMLStyleElement;
    
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }
    
    // CSS để override màu primary theo API
    styleEl.textContent = `
      :root {
        --primary-color: ${primaryColor};
        --primary-color-rgb: ${hexToRgb(primaryColor)};
      }
      
      /* Chỉ title lớn mới đổi màu primary */
      h1, h2, h3 {
        color: ${primaryColor} !important;
      }
      
      /* Các h tags trong CONTENT của InfoBox (trang chủ) giữ màu trắng */
      .info-box-content h1,
      .info-box-content h2, 
      .info-box-content h3 {
        color: #fff !important;
      }
      
      /* Icons mặc định trắng, hover mới đổi màu */
      .anticon {
        color: #fff;
        transition: color 0.3s ease;
      }
      
      .anticon:hover {
        color: ${primaryColor} !important;
      }
      
      /* Menu items hover */
      .ant-menu-item:hover,
      .ant-menu-item-selected {
        color: ${primaryColor} !important;
      }
      
      /* Links hover */
      a:hover .anticon {
        color: ${primaryColor} !important;
      }
      
      /* Nút X đóng ở header */
      button:hover .anticon {
        color: ${primaryColor} !important;
      }
      
      /* Footer links hover */
      footer a:hover {
        color: ${primaryColor} !important;
      }
      
      /* Primary buttons */
      .ant-btn-primary {
        background: ${primaryColor} !important;
        border-color: ${primaryColor} !important;
      }
      
      .ant-btn-primary:hover {
        opacity: 0.8;
      }
    `;
  }, [primaryColor, loading]);

  return null;
};

// Helper: Convert hex to rgb
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '236, 197, 109'; // Fallback
  
  return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
}
