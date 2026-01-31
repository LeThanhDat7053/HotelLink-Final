import type { FC, CSSProperties } from 'react';
import { memo, useMemo } from 'react';
import { Image, Typography, Grid, Spin, Alert } from 'antd';
import { useDinings } from '../../hooks/useDining';
import { useProperty } from '../../context/PropertyContext';
import { useLanguage } from '../../context/LanguageContext';import { useTheme } from '../../context/ThemeContext';import type { DiningUIData } from '../../types/dining';

const { Title } = Typography;
const { useBreakpoint } = Grid;

interface DiningListProps {
  onDiningClick?: (dining: DiningUIData) => void;
  className?: string;
  limit?: number;
  diningType?: string;
}

export const DiningList: FC<DiningListProps> = memo(({ 
  onDiningClick,
  className = '',
  limit = 100,
  diningType,
}) => {
  const screens = useBreakpoint();
  const { propertyId } = useProperty();
  const { locale } = useLanguage();
  const { primaryColor } = useTheme();

  // Memoize params để tránh re-render vô hạn
  const params = useMemo(() => ({
    limit,
    dining_type: diningType,
  }), [limit, diningType]);

  // Fetch dinings từ API
  const { dinings, loading, error } = useDinings({
    propertyId,
    locale,
    params,
  });

  // Wrapper styles - bọc tất cả các item
  const wrapperStyle: CSSProperties = {
    float: 'left' as const,
    width: '100%',
    overflow: 'hidden',
  };

  // Post/Item styles - từng nhà hàng
  const postStyle: CSSProperties = {
    float: 'left' as const,
    width: '100%',
    margin: screens.lg ? '16px 0 14px 0' : screens.md ? '14px 0 12px 0' : '12px 0 10px 0',
    padding: screens.lg ? '0 0 14px 0' : screens.md ? '0 0 12px 0' : '0 0 10px 0',
    height: 'auto',
    borderBottom: '1px solid rgba(153, 113, 42, 0.5)',
    display: 'flex',
    flexDirection: 'row',
    gap: screens.lg ? 22 : screens.md ? 18 : screens.sm ? 16 : 14,
  };

  const thumbnailStyle: CSSProperties = {
    flexShrink: 0,
    width: screens.xl ? 150 : screens.lg ? 135 : screens.md ? 120 : screens.sm ? 110 : 100,
    height: screens.xl ? 105 : screens.lg ? 95 : screens.md ? 84 : screens.sm ? 77 : 70,
    borderRadius: screens.md ? 10 : 8,
    overflow: 'hidden',
  };

  const contentStyle: CSSProperties = {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  };

  const titleStyle: CSSProperties = {
    color: primaryColor,
    fontSize: screens.xl ? 20 : screens.lg ? 19 : screens.md ? 18 : screens.sm ? 17 : 16,
    fontFamily: "'UTMCafeta', 'UTMNeoSansIntel', Arial, sans-serif",
    margin: 0,
    marginBottom: screens.md ? 8 : 6,
    fontWeight: 'normal',
    lineHeight: 1.3,
    cursor: 'pointer',
    transition: 'color 0.3s ease',
  };

  const descriptionStyle: CSSProperties = {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: screens.xl ? 16 : screens.lg ? 15 : screens.md ? 15 : screens.sm ? 14 : 14,
    lineHeight: screens.xl ? '24px' : screens.lg ? '22px' : screens.md ? '22px' : screens.sm ? '20px' : '20px',
    margin: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical' as const,
  };

  // Loading state
  if (loading) {
    return (
      <div className={`dining-list ${className}`} style={{ textAlign: 'center', padding: '40px 0' }}>
        <Spin size="large" />
        <p style={{ color: 'rgba(255, 255, 255, 0.6)', marginTop: 16 }}>Đang tải danh sách ẩm thực...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`dining-list ${className}`}>
        <Alert
          type="error"
          title="Lỗi tải dữ liệu"
          message={error.message || 'Không thể tải danh sách ẩm thực. Vui lòng thử lại sau.'}
        />
      </div>
    );
  }

  // Empty state - để trống khi không có dữ liệu
  if (dinings.length === 0) {
    return null;
  }

  return (
    <div className={`dining-list ${className}`} style={wrapperStyle}>
      {dinings.map((dining, index) => {
        // Generate dynamic fallback SVG with primaryColor
        const fallbackSvg = `data:image/svg+xml;base64,${btoa(`<svg width="100" height="70" viewBox="0 0 100 70" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="70" fill="#1a1a2e"/><text x="50" y="40" fill="${primaryColor}" text-anchor="middle" font-size="10">Dining</text></svg>`)}`;
        
        return (
          <article 
          key={dining.id} 
          className="dining-item"
          style={{
            ...postStyle,
            borderBottom: index === dinings.length - 1 ? 'none' : postStyle.borderBottom,
            cursor: onDiningClick ? 'pointer' : 'default',
          }}
          onClick={() => onDiningClick?.(dining)}
        >
          {/* Thumbnail - Bên trái */}
          <div className="dining-thumbnail" style={thumbnailStyle}>
            <Image
              src={dining.primaryImage || undefined}
              alt={dining.name}
              width="100%"
              height="100%"
              style={{ objectFit: 'cover' }}
              preview={false}
              fallback={fallbackSvg}
            />
          </div>

          {/* Content - Bên phải */}
          <div className="dining-content" style={contentStyle}>
            <header className="dining-header">
              <Title 
                level={4} 
                style={titleStyle}
                className="dining-title"
              >
                {dining.name}
              </Title>
            </header>
            <p style={descriptionStyle} className="dining-description list-item-description">
              {dining.description}
            </p>
          </div>
        </article>
        );
      })}
    </div>
  );
});

DiningList.displayName = 'DiningList';
