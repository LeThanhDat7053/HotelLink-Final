import type { FC, ReactNode } from 'react';
import { Children, memo, useState, useRef, useEffect, useCallback } from 'react';
import { Card, Typography, Divider, Grid, Skeleton } from 'antd';
import { usePropertyData } from '../../context/PropertyContext';
import { useTheme } from '../../context/ThemeContext';

const { Title } = Typography;
const { useBreakpoint } = Grid;

interface InfoBoxProps {
  className?: string;
  title?: string;
  content?: string;
  children?: ReactNode;
  isVisible?: boolean;
  onClose?: () => void; // Callback để đóng InfoBox (cho mobile)
  isListPage?: boolean; // Có phải trang có danh sách (rooms, dining, services, facilities) không
}

export const InfoBox: FC<InfoBoxProps> = memo(({ 
  className = '',
  title,
  content,
  children,
  isVisible = true,
  onClose,
  isListPage = false,
}) => {
  const { primaryColor } = useTheme();
  const screens = useBreakpoint();
  const { propertyName, description, loading } = usePropertyData();
  
  // State cho expand/collapse
  const [isExpanded, setIsExpanded] = useState(false);
  const [needsExpand, setNeedsExpand] = useState(false); // Có cần hiển thị nút expand không
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Chỉ hiển thị nút close trên mobile
  const isMobile = !screens.md;
  
  // Chiều cao mặc định (khi chưa expand)
  const defaultMaxHeight = screens.md ? 318 : 250;
  
  // Khoảng cách tối thiểu từ top khi expand (header height + padding)
  // Mobile: cách header khoảng 90px, Desktop: 100px
  const minTopOffset = screens.md ? 100 : 90;
  
  // Chiều cao tối đa của content khi expand = window - top offset - bottom bar - title/divider area (~85px)
  const bottomOffset = screens.md ? 65 : 55;
  const titleAreaHeight = screens.md ? 85 : 75;
  const expandedMaxHeight = typeof window !== 'undefined' 
    ? window.innerHeight - minTopOffset - bottomOffset - titleAreaHeight
    : 400;
  
  // Check xem content có overflow không (cần cuộn) → hiển thị nút expand
  const checkOverflow = useCallback(() => {
    if (!contentRef.current || !isListPage) {
      setNeedsExpand(false);
      return;
    }
    
    // Check overflow: scrollHeight > clientHeight nghĩa là có nội dung bị ẩn
    const { scrollHeight, clientHeight } = contentRef.current;
    let hasOverflow = scrollHeight > clientHeight + 5;
    
    // Nếu InfoBox không overflow, check các child scroll containers
    if (!hasOverflow) {
      const childScrollContainers = contentRef.current.querySelectorAll('[style*="overflow"]');
      childScrollContainers.forEach((child) => {
        const el = child as HTMLElement;
        if (el.scrollHeight > el.clientHeight + 5) {
          hasOverflow = true;
        }
      });
    }
    
    setNeedsExpand(hasOverflow);
  }, [isListPage]);
  
  // Check overflow khi children thay đổi hoặc sau khi render
  useEffect(() => {
    // Đợi DOM render xong
    const timer = setTimeout(checkOverflow, 100);
    // Re-check sau 500ms nữa để đảm bảo content đã load xong (API data)
    const timer2 = setTimeout(checkOverflow, 500);
    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
    };
  }, [children, checkOverflow, isVisible, isListPage, title]);
  
  // Re-check khi window resize
  useEffect(() => {
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [checkOverflow]);
  
  // Reset expanded state khi chuyển trang (title thay đổi) hoặc ẩn InfoBox
  useEffect(() => {
    setIsExpanded(false);
  }, [title, isListPage]);
  
  useEffect(() => {
    if (!isVisible) {
      setIsExpanded(false);
    }
  }, [isVisible]);
  
  // Handler cho nút đóng
  const handleCloseClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onClose) {
      onClose();
    }
  };
  
  // Handler cho nút expand/collapse
  const handleExpandClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded(prev => !prev);
  };
  
  // Use props if provided, otherwise use API data
  const displayTitle = title || propertyName;
  const displayContent = content || description;

  // Check if children has actual content (not just false values)
  const hasChildren = Children.toArray(children).filter(Boolean).length > 0;

  return (
    <Card
      className={className}
      variant="borderless"
      style={{
        position: 'fixed',
        left: screens.md ? 15 : 10,
        bottom: screens.md ? 65 : 55,
        // Không set top - để Card tự co giãn theo nội dung từ bottom lên
        width: screens.md ? 522 : screens.sm ? '90%' : 'calc(100% - 20px)',
        maxWidth: screens.md ? 522 : 450,
        zIndex: 1999,
        background: 'rgba(0, 0, 0, 0.68)',
        borderBottomLeftRadius: 22,
        borderBottomRightRadius: 22,
        borderTopRightRadius: 22,
        borderTopLeftRadius: 0,
        overflow: 'hidden',
        cursor: 'default',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateX(0) scale(1)' : 'translateX(-30px) scale(0.95)',
        transition: 'all 400ms cubic-bezier(0.4, 0, 0.2, 1)',
        pointerEvents: isVisible ? 'auto' : 'none',
      }}
      styles={{
        body: { 
          padding: 0,
        }
      }}
    >
      {/* Page Title với nút đóng */}
      <div style={{ 
        padding: screens.md ? '25px 30px 16px 30px' : '20px 20px 12px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        {loading ? (
          <Skeleton.Input active size="small" style={{ width: 200 }} />
        ) : (
          <Title
            level={2}
            style={{
              color: primaryColor,
              fontSize: screens.md ? 21 : screens.sm ? 19 : 17,
              fontFamily: "'UTMCafeta', 'UTMNeoSansIntel', Arial, sans-serif",
              textTransform: 'uppercase',
              letterSpacing: 1,
              margin: 0,
              fontWeight: 'normal',
              flex: 1,
            }}
          >
            {displayTitle}
          </Title>
        )}
        
        {/* Nhóm nút: Expand (nếu cần) + Đóng (mobile) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          {/* Nút expand/collapse - chỉ hiển thị khi là list page và cần expand */}
          {isListPage && needsExpand && (
            <a
              className="expand-info-btn"
              title={isExpanded ? 'Thu gọn danh sách' : 'Mở rộng danh sách'}
              onClick={handleExpandClick}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 36,
                height: 36,
                background: 'rgba(255, 255, 255, 0.12)',
                color: primaryColor,
                borderRadius: 36,
                transition: 'all 200ms ease',
                cursor: 'pointer',
                textDecoration: 'none',
              }}
            >
              {/* Icon: Mũi tên đơn giản - ^ khi thu gọn (click để mở), v khi mở rộng (click để đóng) */}
              <svg 
                width="18" 
                height="18" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                style={{
                  transform: isExpanded ? 'rotate(0deg)' : 'rotate(180deg)',
                  transition: 'transform 250ms ease',
                }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </a>
          )}
          
          {/* Nút đóng - chỉ hiển thị trên mobile */}
          {isMobile && onClose && (
            <a
              className="close-info-btn"
              title="Ẩn thông tin"
              onClick={handleCloseClick}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 36,
                height: 36,
                background: primaryColor,
                color: '#fff',
                borderRadius: 28,
                transition: 'all 160ms linear',
                cursor: 'pointer',
                textDecoration: 'none',
                fontSize: 16,
                fontWeight: 'bold',
              }}
          >
            ✕
          </a>
        )}
        </div>
      </div>
      
      <Divider style={{ 
        margin: 0, 
        borderColor: 'rgba(255, 255, 255, 0.28)', 
        marginLeft: screens.md ? 30 : 20, 
        marginRight: screens.md ? 30 : 20,
      }} />

      {/* Page Content */}
      <div 
        ref={contentRef}
        className={`info-box-content ${isExpanded ? 'info-box-expanded' : ''}`}
        style={{ 
          padding: screens.md ? '18px 15px 30px 30px' : '15px 10px 20px 20px', 
          // Khi expand: tăng maxHeight lên giới hạn tối đa (cách header), content tự co giãn theo nội dung
          // Nếu nội dung nhiều hơn maxHeight thì scroll
          // Khi không expand: giới hạn maxHeight nhỏ hơn
          maxHeight: isExpanded ? expandedMaxHeight : defaultMaxHeight,
          overflowY: 'auto', // Chỉ hiển thị scrollbar khi cần
          transition: 'max-height 300ms ease-in-out',
          // CSS variable để child components có thể dùng
          '--info-box-expanded-height': `${expandedMaxHeight - 50}px`,
          '--info-box-default-height': `${defaultMaxHeight - 50}px`,
        } as React.CSSProperties}>
        {loading ? (
          <Skeleton active paragraph={{ rows: 4 }} />
        ) : hasChildren ? (
          // Custom content (VD: RoomList)
          children
        ) : (
          // Default text content - Parse HTML if present
          <div
            style={{
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: screens.md ? 14 : screens.sm ? 13 : 12,
              lineHeight: screens.md ? '22px' : '20px',
              textAlign: 'justify',
            }}
            dangerouslySetInnerHTML={{ __html: displayContent || '' }}
          />
        )}
      </div>
    </Card>
  );
});

InfoBox.displayName = 'InfoBox';
