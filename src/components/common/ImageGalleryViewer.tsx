import type { FC, CSSProperties } from 'react';
import { memo, useState, useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  CloseOutlined, 
  LeftOutlined, 
  RightOutlined,
  ZoomInOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined
} from '@ant-design/icons';

interface ImageGalleryViewerProps {
  images: string[];
  initialIndex?: number;
  visible: boolean;
  onClose: () => void;
}

export const ImageGalleryViewer: FC<ImageGalleryViewerProps> = memo(({ 
  images, 
  initialIndex = 0, 
  visible, 
  onClose 
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const thumbnailsRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset index when opening
  useEffect(() => {
    if (visible) {
      setCurrentIndex(initialIndex);
      setIsZoomed(false);
    }
  }, [visible, initialIndex]);

  // Auto scroll thumbnail into view
  useEffect(() => {
    if (thumbnailsRef.current) {
      const activeThumb = thumbnailsRef.current.children[currentIndex] as HTMLElement;
      if (activeThumb) {
        activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [currentIndex]);

  // Slideshow
  useEffect(() => {
    if (isPlaying && visible) {
      const timer = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % images.length);
      }, 3000);
      return () => clearInterval(timer);
    }
  }, [isPlaying, visible, images.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!visible) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          goToPrev();
          break;
        case 'ArrowRight':
          goToNext();
          break;
        case 'Escape':
          onClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [visible, onClose]);

  // Mouse wheel navigation
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY > 0) {
      setCurrentIndex(prev => Math.min(prev + 1, images.length - 1));
    } else {
      setCurrentIndex(prev => Math.max(prev - 1, 0));
    }
  }, [images.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex(prev => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % images.length);
  }, [images.length]);

  const toggleZoom = useCallback(() => {
    setIsZoomed(prev => !prev);
  }, []);

  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  if (!visible) return null;

  // Get high resolution image URL (remove size suffix like -300x300_c)
  const getFullSizeUrl = (url: string) => {
    return url.replace(/-\d+x\d+(_c)?\./, '.');
  };

  // Styles - Full screen overlay (giống fancybox)
  const containerStyle: CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#1a1a1a',
    zIndex: 99992,
    display: 'flex',
    overflow: 'hidden',
    // Fancybox styles
    WebkitBackfaceVisibility: 'hidden',
    backfaceVisibility: 'hidden',
    outline: 'none',
    WebkitTapHighlightColor: 'transparent',
    touchAction: 'manipulation',
    transform: 'translateZ(0)',
  };

  const mainContentStyle: CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    height: '100%',
  };

  const toolbarStyle: CSSProperties = {
    position: 'absolute',
    top: 0,
    right: 0,
    display: 'flex',
    gap: 4,
    padding: '12px 16px',
    zIndex: 10,
  };

  const buttonStyle: CSSProperties = {
    width: 44,
    height: 44,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'transparent',
    border: 'none',
    color: '#ccc',
    cursor: 'pointer',
    transition: 'color 0.2s ease',
    fontSize: 20,
  };

  const infobarStyle: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    padding: '16px 20px',
    color: '#ccc',
    fontSize: 14,
    zIndex: 10,
  };

  const stageStyle: CSSProperties = {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    padding: '20px 60px',
  };

  const imageContainerStyle: CSSProperties = {
    maxWidth: '100%',
    maxHeight: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.3s ease',
    transform: isZoomed ? 'scale(1.5)' : 'scale(1)',
    cursor: isZoomed ? 'zoom-out' : 'zoom-in',
  };

  const imageStyle: CSSProperties = {
    maxWidth: '100%',
    maxHeight: 'calc(100vh - 40px)',
    objectFit: 'contain',
    userSelect: 'none',
  };

  const navButtonStyle: CSSProperties = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    width: 50,
    height: 80,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'transparent',
    border: 'none',
    color: 'rgba(255, 255, 255, 0.7)',
    cursor: 'pointer',
    fontSize: 32,
    transition: 'color 0.2s ease',
    zIndex: 5,
  };

  const thumbnailsSidebarStyle: CSSProperties = {
    width: 140,
    height: '100%',
    backgroundColor: 'rgba(20, 20, 20, 0.95)',
    overflowY: 'auto',
    overflowX: 'hidden',
    padding: '12px 10px',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  };

  const thumbnailStyle = (isActive: boolean): CSSProperties => ({
    width: '100%',
    aspectRatio: '1',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    cursor: 'pointer',
    opacity: isActive ? 1 : 0.5,
    border: isActive ? '2px solid #ecc56d' : '2px solid transparent',
    borderRadius: 4,
    transition: 'opacity 0.2s ease, border-color 0.2s ease',
    flexShrink: 0,
  });

  const progressStyle: CSSProperties = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: 3,
    backgroundColor: '#ecc56d',
    transition: isPlaying ? 'width 3s linear' : 'none',
    width: isPlaying ? '100%' : '0%',
  };

  // Render với Portal để thoát khỏi parent container
  const galleryContent = (
    <div 
      ref={containerRef}
      style={containerStyle} 
      onWheel={handleWheel}
    >
      {/* Main Content Area */}
      <div style={mainContentStyle}>
        {/* Info Bar - Counter */}
          <div style={infobarStyle}>
            <span>{currentIndex + 1}</span>
            <span style={{ margin: '0 4px' }}>/</span>
            <span>{images.length}</span>
          </div>

          {/* Toolbar */}
          <div style={toolbarStyle}>
            <button 
              style={buttonStyle} 
              onClick={toggleZoom}
              title="Zoom"
              onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#ccc'}
            >
              <ZoomInOutlined />
            </button>
            <button 
              style={buttonStyle} 
              onClick={togglePlay}
              title={isPlaying ? 'Pause slideshow' : 'Start slideshow'}
              onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#ccc'}
            >
              {isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
            </button>
            <button 
              style={buttonStyle} 
              onClick={onClose}
              title="Close"
              onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#ccc'}
            >
              <CloseOutlined />
            </button>
          </div>

          {/* Navigation Buttons */}
          <button 
            style={{ ...navButtonStyle, left: 10 }}
            onClick={goToPrev}
            title="Previous"
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#ccc';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <LeftOutlined />
          </button>
          <button 
            style={{ ...navButtonStyle, right: 10 }}
            onClick={goToNext}
            title="Next"
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#ccc';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <RightOutlined />
          </button>

          {/* Main Image Stage */}
          <div style={stageStyle}>
            <div style={imageContainerStyle} onClick={toggleZoom}>
              <img 
                src={getFullSizeUrl(images[currentIndex])} 
                alt={`Gallery image ${currentIndex + 1}`}
                style={imageStyle}
                draggable={false}
              />
            </div>
          </div>

          {/* Progress bar for slideshow */}
          {isPlaying && <div key={currentIndex} style={progressStyle} />}
        </div>

        {/* Thumbnails Sidebar */}
        <div style={thumbnailsSidebarStyle} ref={thumbnailsRef}>
          {images.map((img, index) => (
            <div
              key={index}
              style={thumbnailStyle(index === currentIndex)}
              onClick={() => setCurrentIndex(index)}
              onMouseEnter={(e) => {
                if (index !== currentIndex) {
                  e.currentTarget.style.opacity = '0.8';
                }
              }}
              onMouseLeave={(e) => {
                if (index !== currentIndex) {
                  e.currentTarget.style.opacity = '0.5';
                }
              }}
            >
              <div 
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundImage: `url(${img})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderRadius: 4,
                }}
              />
            </div>
          ))}
        </div>
    </div>
  );

  // Dùng Portal để render ra document.body - thoát khỏi mọi container
  return createPortal(galleryContent, document.body);
});

ImageGalleryViewer.displayName = 'ImageGalleryViewer';
