import type { FC, CSSProperties } from 'react';
import { memo, useMemo } from 'react';
import { Image, Typography, Grid, Spin, Alert } from 'antd';
import { useRooms } from '../../hooks/useRooms';
import { useProperty } from '../../context/PropertyContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import type { RoomUIData } from '../../types/room';

const { Title } = Typography;
const { useBreakpoint } = Grid;

interface RoomListProps {
  onRoomClick?: (room: RoomUIData) => void;
  className?: string;
  limit?: number;
  roomType?: string;
  status?: string;
}

export const RoomList: FC<RoomListProps> = memo(({ 
  onRoomClick,
  className = '',
  limit = 100,
  roomType,
  status = 'available',
}) => {
  const screens = useBreakpoint();
  const { propertyId } = useProperty();
  const { locale } = useLanguage();
  const { primaryColor } = useTheme();

  // Memoize params để tránh re-render vô hạn
  const params = useMemo(() => ({
    limit,
    room_type: roomType,
    status,
  }), [limit, roomType, status]);

  // Fetch rooms từ API
  const { rooms, loading, error } = useRooms({
    propertyId,
    locale,
    params,
  });

  // Wrapper styles - bọc tất cả các phòng
  const wrapperStyle: CSSProperties = {
    float: 'left' as const,
    width: '100%',
    overflow: 'hidden',
  };

  // Post/Item styles - từng phòng
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
      <div className={`room-list ${className}`} style={wrapperStyle}>
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Spin size="large" />
          <p style={{ color: 'rgba(255, 255, 255, 0.6)', marginTop: 16, fontSize: 13 }}>
            Đang tải danh sách phòng...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`room-list ${className}`} style={wrapperStyle}>
        <Alert
          type="error"
          title="Lỗi tải dữ liệu"
          message={error.message || 'Không thể tải danh sách phòng. Vui lòng thử lại sau.'}
          style={{ marginBottom: 16 }}
        />
      </div>
    );
  }

  // Empty state - để trống khi không có dữ liệu
  if (rooms.length === 0) {
    return null;
  }

  return (
    <div className={`room-list ${className}`} style={wrapperStyle}>
      {rooms.map((room, index) => {
        // Generate dynamic fallback SVG with primaryColor
        const fallbackSvg = `data:image/svg+xml;base64,${btoa(`<svg width="100" height="70" viewBox="0 0 100 70" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="70" fill="#1a1a2e"/><text x="50" y="40" fill="${primaryColor}" text-anchor="middle" font-size="10">Room</text></svg>`)}`;
        
        return (
          <article 
          key={room.id} 
          className="room-item"
          style={{
            ...postStyle,
            borderBottom: index === rooms.length - 1 ? 'none' : postStyle.borderBottom,
            cursor: onRoomClick ? 'pointer' : 'default',
          }}
          onClick={() => onRoomClick?.(room)}
        >
          {/* Thumbnail - Bên trái (ảnh với is_primary=true) */}
          <div className="room-thumbnail" style={thumbnailStyle}>
            <Image
              src={room.primaryImage || undefined}
              alt={room.name}
              width="100%"
              height="100%"
              style={{ objectFit: 'cover' }}
              preview={false}
              fallback={fallbackSvg}
            />
          </div>

          {/* Content - Bên phải */}
          <div className="room-content" style={contentStyle}>
            <header className="room-header">
              <Title 
                level={4} 
                style={titleStyle}
                className="room-title"
              >
                {room.name}
              </Title>
            </header>
            <p style={descriptionStyle} className="room-description list-item-description">
              {room.description}
            </p>
          </div>
        </article>
        );
      })}
    </div>
  );
});

RoomList.displayName = 'RoomList';
