/**
 * VR360 Gallery Page - Example usage
 * 
 * Trang này demo cách sử dụng VR360 system với các features:
 * - Filter by category
 * - Grid display
 * - Modal fullscreen viewer
 * - Loading & error states
 */

import React, { useState } from 'react';
import { useVR360Links } from '../hooks/useVR360';
import type { VR360CategoryType } from '../types/hotel';
import { VR360Gallery } from '../components/common';

// Category options
const VR360_CATEGORIES: VR360CategoryType[] = [
  'ROOM', 'LOBBY', 'RESTAURANT', 'POOL', 'GYM', 'SPA', 'ROOFTOP', 'EXTERIOR', 'OTHER'
];

// Category labels
const categoryLabels: Record<VR360CategoryType, string> = {
  'ROOM': 'Phòng',
  'LOBBY': 'Sảnh',
  'RESTAURANT': 'Nhà hàng',
  'POOL': 'Hồ bơi',
  'GYM': 'Phòng gym',
  'SPA': 'Spa',
  'ROOFTOP': 'Rooftop',
  'EXTERIOR': 'Ngoại thất',
  'OTHER': 'Khác',
};

export const VR360GalleryPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<VR360CategoryType | undefined>();
  const [page, setPage] = useState(1);
  
  const { links, loading, error, total, hasMore, refetch } = useVR360Links({
    category: selectedCategory,
    isActive: true,
    page,
    limit: 12,
  });

  const handleCategoryChange = (category?: VR360CategoryType) => {
    setSelectedCategory(category);
    setPage(1); // Reset to page 1 when changing filter
  };

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Virtual Tours 360°
          </h1>
          <p className="text-gray-600">
            Khám phá khách sạn của chúng tôi qua các tour ảo 360 độ
          </p>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
              Danh mục:
            </span>
            
            <button
              onClick={() => handleCategoryChange()}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                !selectedCategory
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tất cả {total > 0 && `(${total})`}
            </button>

            {VR360_CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {categoryLabels[category]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Loading State */}
        {loading && page === 1 && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
            <p className="text-gray-600 font-medium">Đang tải VR360 tours...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="max-w-md mx-auto bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <svg
              className="w-16 h-16 text-red-500 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-lg font-semibold text-red-900 mb-2">
              Không thể tải dữ liệu
            </h3>
            <p className="text-red-700 mb-4">{error.message}</p>
            <button
              onClick={() => refetch()}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Thử lại
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && links.length === 0 && (
          <div className="max-w-md mx-auto text-center py-20">
            <svg
              className="w-24 h-24 text-gray-300 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Chưa có VR360 tour
            </h3>
            <p className="text-gray-500">
              {selectedCategory
                ? `Không tìm thấy tour cho danh mục "${categoryLabels[selectedCategory]}"`
                : 'Không có tour nào được tìm thấy'}
            </p>
          </div>
        )}

        {/* Gallery */}
        {!loading && !error && links.length > 0 && (
          <>
            <VR360Gallery links={links} columns={3} className="mb-8" />

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center mt-8">
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Đang tải...
                    </span>
                  ) : (
                    'Xem thêm'
                  )}
                </button>
              </div>
            )}

            {/* Results Info */}
            <div className="text-center mt-6 text-gray-500 text-sm">
              Hiển thị {links.length} trong tổng số {total} tours
            </div>
          </>
        )}
      </div>

      {/* Footer Info */}
      <div className="bg-blue-50 border-t border-blue-100 py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            💡 Mẹo sử dụng VR360
          </h3>
          <ul className="text-gray-600 space-y-1 max-w-2xl mx-auto">
            <li>🖱️ Kéo chuột để xoay camera 360 độ</li>
            <li>🔍 Phóng to/thu nhỏ bằng scroll hoặc nút +/-</li>
            <li>📱 Trên mobile: vuốt để xoay, pinch để zoom</li>
            <li>🎯 Click vào điểm hotspot để di chuyển giữa các phòng</li>
            <li>🔊 Bật âm thanh để trải nghiệm đầy đủ</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VR360GalleryPage;
