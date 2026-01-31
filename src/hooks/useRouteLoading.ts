/**
 * useRouteLoading Hook - Optimized Version
 * 
 * Quản lý loading state khi chuyển trang với thời gian tối thiểu
 * để đảm bảo loading screen hiển thị đủ lâu và smooth
 * 
 * OPTIMIZATIONS:
 * - Giảm minLoadingTime để chuyển trang nhanh hơn
 * - Thêm forceComplete để dừng loading sớm khi content ready
 * - Thêm instant mode cho navigation giữa các sub-pages
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

interface UseRouteLoadingOptions {
  /**
   * Thời gian loading tối thiểu (ms)
   * @default 200 - đủ để animation smooth mà không quá chậm
   */
  minLoadingTime?: number;
  
  /**
   * Callback khi bắt đầu loading
   */
  onLoadingStart?: () => void;
  
  /**
   * Callback khi kết thúc loading
   */
  onLoadingEnd?: () => void;
}

interface UseRouteLoadingReturn {
  /**
   * Trạng thái đang loading
   */
  isLoading: boolean;
  
  /**
   * Pathname hiện tại
   */
  currentPath: string;
  
  /**
   * Pathname trước đó
   */
  previousPath: string | null;
  
  /**
   * Gọi để dừng loading ngay lập tức (khi content đã ready)
   */
  forceComplete: () => void;
}

// Helper: Check nếu 2 paths thuộc cùng section (vd: /phong-nghi/xxx và /phong-nghi/yyy)
const isSameSection = (path1: string, path2: string): boolean => {
  const getSection = (p: string) => {
    const parts = p.split('/').filter(Boolean);
    // Bỏ qua locale prefix nếu có (vi, en, etc.)
    const locale = ['vi', 'en', 'zh', 'ja', 'ko'];
    if (parts[0] && locale.includes(parts[0])) {
      return parts[1] || '';
    }
    return parts[0] || '';
  };
  return getSection(path1) === getSection(path2);
};

/**
 * Hook để quản lý loading screen khi chuyển trang
 * 
 * @param options - Các tùy chọn cấu hình
 * @returns Object chứa trạng thái loading và thông tin path
 */
export const useRouteLoading = (
  options: UseRouteLoadingOptions = {}
): UseRouteLoadingReturn => {
  const { 
    minLoadingTime = 200, // Giảm xuống 200ms - đủ smooth mà nhanh
    onLoadingStart,
    onLoadingEnd 
  } = options;
  
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [previousPath, setPreviousPath] = useState<string | null>(null);
  const previousPathRef = useRef<string>(location.pathname);
  const loadingTimerRef = useRef<number | null>(null);
  const isFirstRender = useRef(true);
  const hasInitialLoadingTriggered = useRef(false);
  
  // forceComplete - dừng loading ngay lập tức khi content đã ready
  const forceComplete = useCallback(() => {
    if (loadingTimerRef.current) {
      clearTimeout(loadingTimerRef.current);
      loadingTimerRef.current = null;
    }
    setIsLoading(false);
    onLoadingEnd?.();
  }, [onLoadingEnd]);
  
  useEffect(() => {
    // Initial loading - chỉ trigger một lần với thời gian ngắn
    if (isFirstRender.current && !hasInitialLoadingTriggered.current) {
      hasInitialLoadingTriggered.current = true;
      
      setIsLoading(true);
      onLoadingStart?.();
      
      // Initial loading ngắn hơn - 150ms
      loadingTimerRef.current = window.setTimeout(() => {
        setIsLoading(false);
        onLoadingEnd?.();
      }, 150) as unknown as number;
      
      isFirstRender.current = false;
      return;
    }
    
    // Route changes
    const currentBasePath = location.pathname.split('?')[0].split('#')[0];
    const previousBasePath = previousPathRef.current.split('?')[0].split('#')[0];
    
    if (currentBasePath !== previousBasePath) {
      // Clear timer cũ nếu có
      if (loadingTimerRef.current) {
        clearTimeout(loadingTimerRef.current);
      }
      
      // Kiểm tra nếu chuyển trong cùng section → loading rất ngắn
      const sameSectionNav = isSameSection(currentBasePath, previousBasePath);
      const actualLoadingTime = sameSectionNav ? 100 : minLoadingTime;
      
      // Bắt đầu loading
      setPreviousPath(previousPathRef.current);
      setIsLoading(true);
      onLoadingStart?.();
      
      // Đặt timer để kết thúc loading
      loadingTimerRef.current = window.setTimeout(() => {
        setIsLoading(false);
        onLoadingEnd?.();
      }, actualLoadingTime) as unknown as number;
      
      // Cập nhật previous path
      previousPathRef.current = location.pathname;
    }
    
    // Cleanup
    return () => {
      if (loadingTimerRef.current) {
        clearTimeout(loadingTimerRef.current);
      }
    };
  }, [location.pathname, minLoadingTime, onLoadingStart, onLoadingEnd]);
  
  return {
    isLoading,
    currentPath: location.pathname,
    previousPath,
    forceComplete,
  };
};

export default useRouteLoading;
