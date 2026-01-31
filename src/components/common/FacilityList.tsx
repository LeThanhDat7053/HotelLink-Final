import type { FC, CSSProperties } from 'react';
import { memo, useMemo } from 'react';
import { Image, Typography, Grid, Spin, Alert } from 'antd';
import { useFacilities } from '../../hooks/useFacility';
import { useProperty } from '../../context/PropertyContext';
import { useLanguage } from '../../context/LanguageContext';import { useTheme } from '../../context/ThemeContext';import type { FacilityUIData } from '../../types/facility';

const { Title } = Typography;
const { useBreakpoint } = Grid;

interface FacilityListProps {
  onFacilityClick?: (facility: FacilityUIData) => void;
  className?: string;
  limit?: number;
  facilityType?: string;
}

export const FacilityList: FC<FacilityListProps> = memo(({ 
  onFacilityClick,
  className = '',
  limit = 100,
  facilityType,
}) => {
  const screens = useBreakpoint();
  const { propertyId } = useProperty();
  const { locale } = useLanguage();
  const { primaryColor } = useTheme();

  // Memoize params để tránh re-render vô hạn
  const params = useMemo(() => ({
    limit,
    facility_type: facilityType,
  }), [limit, facilityType]);

  // Fetch facilities từ API
  const { facilities, loading, error } = useFacilities({
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

  // Post/Item styles - từng tiện ích
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

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        title="Lỗi"
        message={error instanceof Error ? error.message : 'Có lỗi xảy ra'}
        type="error"
        showIcon
        style={{ margin: '16px 0' }}
      />
    );
  }

  // Empty state - để trống khi không có dữ liệu
  if (facilities.length === 0) {
    return null;
  }

  return (
    <div className={`facility-list ${className}`} style={wrapperStyle}>
      {facilities.map((facility, index) => {
        // Generate dynamic fallback SVG with primaryColor
        const fallbackSvg = `data:image/svg+xml;base64,${btoa(`<svg width="100" height="70" viewBox="0 0 100 70" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="70" fill="#1a1a2e"/><text x="50" y="40" fill="${primaryColor}" text-anchor="middle" font-size="8">Facility</text></svg>`)}`;
        
        return (
          <article 
          key={facility.id} 
          className="facility-item"
          style={{
            ...postStyle,
            borderBottom: index === facilities.length - 1 ? 'none' : postStyle.borderBottom,
            cursor: onFacilityClick ? 'pointer' : 'default',
          }}
          onClick={() => onFacilityClick?.(facility)}
        >
          {/* Thumbnail - Bên trái */}
          <div className="facility-thumbnail" style={thumbnailStyle}>
            <Image
              src={facility.primaryImage || undefined}
              alt={facility.name}
              width="100%"
              height="100%"
              style={{ objectFit: 'cover' }}
              preview={false}
              fallback={fallbackSvg}
            />
          </div>

          {/* Content - Bên phải */}
          <div className="facility-content" style={contentStyle}>
            <header className="facility-header">
              <Title 
                level={4} 
                style={titleStyle}
                className="facility-title"
              >
                {facility.name}
              </Title>
            </header>
            <p style={descriptionStyle} className="facility-description list-item-description">
              {facility.description}
            </p>
          </div>
        </article>
        );
      })}
    </div>
  );
});

FacilityList.displayName = 'FacilityList';
