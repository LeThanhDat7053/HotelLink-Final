import type { FC, ReactNode } from 'react';
import { Children, memo } from 'react';
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
}

export const InfoBox: FC<InfoBoxProps> = memo(({ 
  className = '',
  title,
  content,
  children,
  isVisible = true,
  onClose
}) => {
  const { primaryColor } = useTheme();
  const screens = useBreakpoint();
  const { propertyName, description, loading } = usePropertyData();
  
  // Chỉ hiển thị nút close trên mobile
  const isMobile = !screens.md;
  
  // Handler cho nút đóng
  const handleCloseClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onClose) {
      onClose();
    }
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
        body: { padding: 0 }
      }}
    >
      {/* Page Title với nút đóng */}
      <div style={{ 
        padding: screens.md ? '25px 30px 16px 30px' : '20px 20px 12px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
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
              width: 22,
              height: 22,
              background: primaryColor,
              color: '#fff',
              borderRadius: 22,
              transition: 'all 160ms linear',
              cursor: 'pointer',
              textDecoration: 'none',
              fontSize: 12,
              fontWeight: 'bold',
              marginLeft: 10,
              flexShrink: 0,
            }}
          >
            ✕
          </a>
        )}
      </div>
      
      <Divider style={{ 
        margin: 0, 
        borderColor: 'rgba(255, 255, 255, 0.28)', 
        marginLeft: screens.md ? 30 : 20, 
        marginRight: screens.md ? 30 : 20 
      }} />

      {/* Page Content */}
      <div 
        className="info-box-content"
        style={{ 
          padding: screens.md ? '18px 15px 30px 30px' : '15px 10px 20px 20px', 
          maxHeight: screens.md ? 318 : 250, 
          overflowY: 'auto' 
        }}>
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
