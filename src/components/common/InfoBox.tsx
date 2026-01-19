import type { FC, ReactNode } from 'react';
import { Children } from 'react';
import { Card, Typography, Divider, Grid, Skeleton } from 'antd';
import { usePropertyData } from '../../context/PropertyContext';

const { Title } = Typography;
const { useBreakpoint } = Grid;

interface InfoBoxProps {
  className?: string;
  title?: string;
  content?: string;
  children?: ReactNode;
  isVisible?: boolean;
}

export const InfoBox: FC<InfoBoxProps> = ({ 
  className = '',
  title,
  content,
  children,
  isVisible = true
}) => {
  const screens = useBreakpoint();
  const { propertyName, description, loading } = usePropertyData();
  
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
      {/* Page Title */}
      <div style={{ padding: screens.md ? '25px 30px 16px 30px' : '20px 20px 12px 20px' }}>
        {loading ? (
          <Skeleton.Input active size="small" style={{ width: 200 }} />
        ) : (
          <Title
            level={2}
            style={{
              color: '#ecc56d',
              fontSize: screens.md ? 21 : screens.sm ? 19 : 17,
              fontFamily: "'UTMCafeta', 'UTMNeoSansIntel', Arial, sans-serif",
              textTransform: 'uppercase',
              letterSpacing: 1,
              margin: 0,
              fontWeight: 'normal',
            }}
          >
            {displayTitle}
          </Title>
        )}
      </div>
      
      <Divider style={{ 
        margin: 0, 
        borderColor: 'rgba(255, 255, 255, 0.28)', 
        marginLeft: screens.md ? 30 : 20, 
        marginRight: screens.md ? 30 : 20 
      }} />

      {/* Page Content */}
      <div style={{ 
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
};

InfoBox.displayName = 'InfoBox';
