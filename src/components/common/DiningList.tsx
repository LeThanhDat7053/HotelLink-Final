import type { FC, CSSProperties } from 'react';
import { memo, useMemo } from 'react';
import { Image, Typography, Grid, Spin, Alert } from 'antd';
import { useDinings } from '../../hooks/useDining';
import { useProperty } from '../../context/PropertyContext';
import { useLanguage } from '../../context/LanguageContext';
import type { DiningUIData } from '../../types/dining';

const { Title, Paragraph } = Typography;
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
    margin: '12px 0 9px 0',
    padding: '0 0 6px 0',
    height: 'auto',
    borderBottom: '1px solid rgba(153, 113, 42, 0.5)',
    display: 'flex',
    flexDirection: 'row',
    gap: screens.md ? 15 : 10,
  };

  const thumbnailStyle: CSSProperties = {
    flexShrink: 0,
    width: screens.md ? 100 : 80,
    height: screens.md ? 70 : 56,
    borderRadius: 6,
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
    color: '#ecc56d',
    fontSize: screens.md ? 15 : 13,
    fontFamily: "'UTMCafeta', 'UTMNeoSansIntel', Arial, sans-serif",
    margin: 0,
    marginBottom: 4,
    fontWeight: 'normal',
    lineHeight: 1.3,
    cursor: 'pointer',
    transition: 'color 0.3s ease',
  };

  const descriptionStyle: CSSProperties = {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: screens.md ? 13 : 11,
    lineHeight: screens.md ? '18px' : '16px',
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

  // Empty state
  if (dinings.length === 0) {
    return (
      <div className={`dining-list ${className}`}>
        <Alert
          type="info"
          title="Không có dữ liệu"
          message="Chưa có thông tin ẩm thực nào."
        />
      </div>
    );
  }

  return (
    <div className={`dining-list ${className}`} style={wrapperStyle}>
      {dinings.map((dining, index) => (
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
              src={dining.primaryImage || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjcwIiB2aWV3Qm94PSIwIDAgMTAwIDcwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iNzAiIGZpbGw9IiMxYTFhMmUiLz48dGV4dCB4PSI1MCIgeT0iNDAiIGZpbGw9IiNFQ0M1NkQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iMTAiPkRpbmluZzwvdGV4dD48L3N2Zz4='}
              alt={dining.name}
              width="100%"
              height="100%"
              style={{ objectFit: 'cover' }}
              preview={false}
              fallback="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjcwIiB2aWV3Qm94PSIwIDAgMTAwIDcwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iNzAiIGZpbGw9IiMxYTFhMmUiLz48dGV4dCB4PSI1MCIgeT0iNDAiIGZpbGw9IiNFQ0M1NkQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iMTAiPkRpbmluZzwvdGV4dD48L3N2Zz4="
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
            <Paragraph style={descriptionStyle} className="dining-description">
              {dining.description}
            </Paragraph>
          </div>
        </article>
      ))}
    </div>
  );
});

DiningList.displayName = 'DiningList';
