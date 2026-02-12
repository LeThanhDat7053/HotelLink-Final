/**
 * VR360Viewer Component
 * 
 * Component để hiển thị VR360 viewer
 * Hỗ trợ:
 * - Iframe embed
 * - Modal fullscreen
 * - Thumbnail preview
 * - Loading states
 * - Image display với cover style
 */

import React, { useState, useMemo } from 'react';
import type { VR360Link } from '../../types/api';
import { getMediaType, getYouTubeEmbedUrl } from '../../utils/mediaHelper';

interface VR360ViewerProps {
  link: VR360Link;
  autoLoad?: boolean; // Tự động load VR ngay hay chờ user click
  className?: string;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

export const VR360Viewer: React.FC<VR360ViewerProps> = ({
  link,
  autoLoad = false,
  className = '',
  onLoad,
  onError,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [showViewer, setShowViewer] = useState(autoLoad);

  // Xác định loại media (image hay vr360)
  const mediaType = useMemo(() => getMediaType(link.vrUrl || ''), [link.vrUrl]);

  const handleLoadComplete = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    onError?.(new Error('Failed to load VR360 viewer'));
  };

  const handleThumbnailClick = () => {
    setShowViewer(true);
  };

  // Nếu chưa show viewer, hiển thị thumbnail với play button
  if (!showViewer && link.thumbnailUrl) {
    return (
      <div className={`relative cursor-pointer group ${className}`}>
        <img
          src={link.thumbnailUrl}
          alt={link.title}
          className="w-full h-full object-cover rounded-lg"
        />
        
        {/* Play overlay */}
        <div 
          className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-lg group-hover:bg-opacity-50 transition-all"
          onClick={handleThumbnailClick}
        >
          <div className="w-20 h-20 rounded-full bg-white bg-opacity-90 flex items-center justify-center group-hover:scale-110 transition-transform">
            <svg 
              className="w-10 h-10 text-blue-600 ml-1" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
        
        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 rounded-b-lg">
          <h3 className="text-white font-semibold text-lg">{link.title}</h3>
          {link.description && (
            <p className="text-white text-sm opacity-90 whitespace-pre-wrap">{link.description}</p>
          )}
        </div>
      </div>
    );
  }

  // Hiển thị VR360 iframe hoặc image viewer
  return (
    <div className={`relative ${className}`}>
      {/* Loading spinner */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10 rounded-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Đang tải...</span>
        </div>
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 bg-red-50 flex flex-col items-center justify-center z-10 rounded-lg p-4">
          <svg className="w-16 h-16 text-red-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-600 font-semibold mb-2">Không thể tải nội dung</p>
          <p className="text-red-500 text-sm mb-3">Vui lòng thử lại sau</p>
          <button 
            onClick={() => {
              setHasError(false);
              setShowViewer(true);
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Thử lại
          </button>
        </div>
      )}

      {/* Content: Image hoặc YouTube hoặc VR360 iframe */}
      {mediaType === 'image' ? (
        // Hiển thị ảnh với object-fit cover
        <img
          src={link.vrUrl}
          alt={link.title}
          className="w-full h-full min-h-[400px] object-cover object-center rounded-lg"
          onLoad={handleLoadComplete}
          onError={handleError}
        />
      ) : mediaType === 'youtube' ? (
        // Hiển thị YouTube video iframe
        <iframe
          src={getYouTubeEmbedUrl(link.vrUrl || '')}
          title={link.title}
          className="w-full h-full min-h-[400px] border-0 rounded-lg"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          onLoad={handleLoadComplete}
          onError={handleError}
        />
      ) : (
        // Hiển thị VR360 iframe
        <iframe
          src={link.vrUrl || ''}
          title={link.title}
          className="w-full h-full min-h-[400px] border-0 rounded-lg"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen; xr-spatial-tracking"
          allowFullScreen
          onLoad={handleLoadComplete}
          onError={handleError}
        />
      )}
      
      {/* Info bar */}
      <div className="absolute top-4 left-4 right-4 bg-white bg-opacity-90 rounded-lg p-3 shadow-lg">
        <h3 className="font-semibold text-gray-800">{link.title}</h3>
        {link.description && (
          <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">{link.description}</p>
        )}
      </div>
    </div>
  );
};

// ===== VR360 MODAL COMPONENT =====

interface VR360ModalProps {
  link: VR360Link | null;
  isOpen: boolean;
  onClose: () => void;
}

export const VR360Modal: React.FC<VR360ModalProps> = ({ link, isOpen, onClose }) => {
  if (!isOpen || !link) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-90"
        onClick={onClose}
      />
      
      {/* Modal content */}
      <div className="relative w-full h-full p-4 md:p-8">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 md:top-8 md:right-8 z-10 w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors shadow-lg"
          aria-label="Close VR viewer"
        >
          <svg className="w-6 h-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        {/* VR Viewer */}
        <div className="w-full h-full">
          <VR360Viewer 
            link={link} 
            autoLoad={true}
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  );
};

// ===== VR360 GALLERY COMPONENT =====

interface VR360GalleryProps {
  links: VR360Link[];
  className?: string;
  columns?: 1 | 2 | 3 | 4;
}

export const VR360Gallery: React.FC<VR360GalleryProps> = ({ 
  links, 
  className = '',
  columns = 3 
}) => {
  const [selectedLink, setSelectedLink] = useState<VR360Link | null>(null);

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  if (links.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <svg className="w-16 h-16 mx-auto mb-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        <p className="text-lg font-medium">Chưa có VR360 tour</p>
        <p className="text-sm mt-1">Vui lòng quay lại sau</p>
      </div>
    );
  }

  return (
    <>
      <div className={`grid ${gridCols[columns]} gap-6 ${className}`}>
        {links.map((link) => (
          <div 
            key={link.id}
            className="cursor-pointer"
            onClick={() => setSelectedLink(link)}
          >
            <VR360Viewer 
              link={link} 
              autoLoad={false}
              className="h-64 md:h-80"
            />
          </div>
        ))}
      </div>

      {/* Modal for fullscreen viewing */}
      <VR360Modal 
        link={selectedLink}
        isOpen={selectedLink !== null}
        onClose={() => setSelectedLink(null)}
      />
    </>
  );
};

export default VR360Viewer;
