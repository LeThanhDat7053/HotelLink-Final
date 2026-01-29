/**
 * useRouteLoading Hook
 * 
 * Quản lý loading state khi chuyển trang với thời gian tối thiểu
 * để đảm bảo loading screen hiển thị đủ lâu và smooth
 */

import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

interface UseRouteLoadingOptions {
  /**
   * Thời gian loading tối thiểu (ms)
   * @default 1500
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
}

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
    minLoadingTime = 500, // giảm từ 1500ms xuống 500ms
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
  
  useEffect(() => {
    // Initial loading - chỉ trigger một lần
    if (isFirstRender.current && !hasInitialLoadingTriggered.current) {
      hasInitialLoadingTriggered.current = true;
      
      setIsLoading(true);
      // console.log('[useRouteLoading] Starting initial loading');
      onLoadingStart?.();
      
      loadingTimerRef.current = setTimeout(() => {
        setIsLoading(false);
        // console.log('[useRouteLoading] Ending initial loading');
        onLoadingEnd?.();
      }, minLoadingTime);
      
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
      
      // Bắt đầu loading
      setPreviousPath(previousPathRef.current);
      setIsLoading(true);
      // console.log('[useRouteLoading] Starting loading for path:', location.pathname);
      onLoadingStart?.();
      
      // Đặt timer để kết thúc loading sau minLoadingTime
      loadingTimerRef.current = setTimeout(() => {
        setIsLoading(false);
        // console.log('[useRouteLoading] Ending loading for path:', location.pathname);
        onLoadingEnd?.();
      }, minLoadingTime);
      
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
  };
};

export default useRouteLoading;
