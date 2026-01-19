import type { FC, CSSProperties } from 'react';
import { memo, useState, useCallback } from 'react';
import { Typography, Grid } from 'antd';
import { ImageGalleryViewer } from './ImageGalleryViewer';

const { Title } = Typography;
const { useBreakpoint } = Grid;

// Gallery categories data
interface GalleryCategory {
  id: string;
  title: string;
  thumbnail: string;
  images: string[];
}

// Mock data - sẽ được thay bằng API sau
const GALLERY_CATEGORIES: GalleryCategory[] = [
  {
    id: 'maris-hotel',
    title: 'Maris Hotel',
    thumbnail: 'https://marishotel.vn/wp-content/uploads/2023/04/02-300x146.jpg',
    images: [
      'https://marishotel.vn/wp-content/uploads/2023/04/02.jpg',
      'https://marishotel.vn/wp-content/uploads/2023/04/01.jpg',
      'https://marishotel.vn/wp-content/uploads/2023/04/03-5.jpg',
      'https://marishotel.vn/wp-content/uploads/2023/04/09-6.jpg',
      'https://marishotel.vn/wp-content/uploads/2023/04/02-2.jpg',
      'https://marishotel.vn/wp-content/uploads/2023/04/03-3.jpg',
      'https://marishotel.vn/wp-content/uploads/2023/04/01-1.jpg',
      'https://marishotel.vn/wp-content/uploads/2023/04/08-2.jpg',
    ],
  },
  {
    id: 'meeting-room',
    title: 'Phòng họp',
    thumbnail: 'https://marishotel.vn/wp-content/uploads/2023/04/01-1-300x146.jpg',
    images: [
      'https://marishotel.vn/wp-content/uploads/2023/04/01-1.jpg',
      'https://marishotel.vn/wp-content/uploads/2023/04/02-1.jpg',
      'https://marishotel.vn/wp-content/uploads/2023/04/03-1.jpg',
      'https://marishotel.vn/wp-content/uploads/2023/04/08.jpg',
      'https://marishotel.vn/wp-content/uploads/2023/04/07.jpg',
      'https://marishotel.vn/wp-content/uploads/2023/04/06.jpg',
    ],
  },
  {
    id: 'cuisine',
    title: 'Ẩm thực',
    thumbnail: 'https://marishotel.vn/wp-content/uploads/2023/04/02-2-300x146.jpg',
    images: [
      'https://marishotel.vn/wp-content/uploads/2023/04/02-2.jpg',
      'https://marishotel.vn/wp-content/uploads/2023/04/03-2.jpg',
      'https://marishotel.vn/wp-content/uploads/2023/04/04-2.jpg',
      'https://marishotel.vn/wp-content/uploads/2023/04/01-2.jpg',
      'https://marishotel.vn/wp-content/uploads/2023/04/05-1.jpg',
      'https://marishotel.vn/wp-content/uploads/2023/04/06-1.jpg',
      'https://marishotel.vn/wp-content/uploads/2023/04/14.jpg',
      'https://marishotel.vn/wp-content/uploads/2023/04/12.jpg',
    ],
  },
  {
    id: 'pool',
    title: 'Hồ bơi',
    thumbnail: 'https://marishotel.vn/wp-content/uploads/2023/04/12-1-300x146.jpg',
    images: [
      'https://marishotel.vn/wp-content/uploads/2023/04/12-1.jpg',
      'https://marishotel.vn/wp-content/uploads/2023/04/11-1.jpg',
      'https://marishotel.vn/wp-content/uploads/2023/04/13-1.jpg',
      'https://marishotel.vn/wp-content/uploads/2023/04/10-1.jpg',
      'https://marishotel.vn/wp-content/uploads/2023/04/01-4.jpg',
      'https://marishotel.vn/wp-content/uploads/2023/04/08-2.jpg',
    ],
  },
];

interface GalleryItemProps {
  category: GalleryCategory;
  onClick: () => void;
}

const GalleryItem: FC<GalleryItemProps> = memo(({ category, onClick }) => {
  const screens = useBreakpoint();
  const [isHovered, setIsHovered] = useState(false);

  const itemStyle: CSSProperties = {
    width: screens.md ? '50%' : '100%',
    float: 'left' as const,
    padding: screens.md ? 5 : 3,
    position: 'relative' as const,
  };

  const imageContainerStyle: CSSProperties = {
    position: 'relative' as const,
    width: '100%',
    paddingBottom: '48.75%', // Aspect ratio ~2.05:1
    overflow: 'hidden',
    cursor: 'zoom-in',
    borderRadius: 2,
  };

  const imageStyle: CSSProperties = {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
    transition: 'transform 0.3s ease, opacity 0.3s ease',
    transform: isHovered ? 'scale(1.05)' : 'scale(1)',
    opacity: isHovered ? 0.85 : 1,
  };

  const overlayStyle: CSSProperties = {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: isHovered ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
    transition: 'background 0.3s ease',
    pointerEvents: 'none' as const,
  };

  const titleStyle: CSSProperties = {
    color: '#fff',
    fontSize: screens.md ? 14 : 12,
    fontWeight: 600,
    textAlign: 'center' as const,
    marginTop: 8,
    marginBottom: 4,
    textTransform: 'none' as const,
  };

  return (
    <div style={itemStyle}>
      <div 
        style={imageContainerStyle}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img 
          src={category.thumbnail} 
          alt={category.title}
          style={imageStyle}
          loading="lazy"
        />
        <div style={overlayStyle} />
      </div>
      <Title level={5} style={titleStyle}>
        {category.title}
      </Title>
    </div>
  );
});

GalleryItem.displayName = 'GalleryItem';

interface GalleryContentProps {
  className?: string;
  categories?: GalleryCategory[];
}

export const GalleryContent: FC<GalleryContentProps> = memo(({ 
  className = '',
  categories = GALLERY_CATEGORIES 
}) => {
  const screens = useBreakpoint();
  const [selectedCategory, setSelectedCategory] = useState<GalleryCategory | null>(null);
  const [galleryVisible, setGalleryVisible] = useState(false);

  // Open gallery viewer
  const handleCategoryClick = useCallback((category: GalleryCategory) => {
    setSelectedCategory(category);
    setGalleryVisible(true);
  }, []);

  // Close gallery viewer
  const handleCloseGallery = useCallback(() => {
    setGalleryVisible(false);
    setSelectedCategory(null);
  }, []);

  // Container styles
  const containerStyle: CSSProperties = {
    float: 'left' as const,
    width: '100%',
    maxHeight: screens.md ? 272 : 220,
    paddingRight: 16,
    overflowY: 'auto' as const,
    overflowX: 'hidden' as const,
    maxWidth: '100%',
    paddingBottom: 6,
  };

  const galleryRowStyle: CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap' as const,
    margin: screens.md ? -5 : -3,
    width: screens.md ? 'calc(100% + 10px)' : 'calc(100% + 6px)',
  };

  return (
    <div className={`gallery-content ${className}`}>
      <div className="nicescroll-bg" style={containerStyle}>
        <div style={galleryRowStyle}>
          {categories.map((category) => (
            <GalleryItem
              key={category.id}
              category={category}
              onClick={() => handleCategoryClick(category)}
            />
          ))}
        </div>
      </div>

      {/* Image Gallery Viewer */}
      {selectedCategory && (
        <ImageGalleryViewer
          images={selectedCategory.images}
          visible={galleryVisible}
          onClose={handleCloseGallery}
          initialIndex={0}
        />
      )}

      {/* Custom scrollbar styles */}
      <style>{`
        .gallery-content .nicescroll-bg::-webkit-scrollbar {
          width: 2px;
        }
        .gallery-content .nicescroll-bg::-webkit-scrollbar-thumb {
          background: rgba(236, 197, 109, 0.5);
        }
        .gallery-content .nicescroll-bg::-webkit-scrollbar-track {
          background: rgba(251, 228, 150, 0);
        }
      `}</style>
    </div>
  );
});

GalleryContent.displayName = 'GalleryContent';
