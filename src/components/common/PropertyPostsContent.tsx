/**
 * PropertyPostsContent Component
 * Hiển thị property posts với locale-aware content
 * 
 * Logic: Parse HTML content để tách:
 * - Title: Lấy từ thẻ <h1>, <h2>, <h3> đầu tiên trong content
 * - Content: Phần còn lại sau thẻ heading
 */

import { Skeleton } from 'antd';
import { usePropertyPosts } from '../../hooks';
import { usePropertyData } from '../../context/PropertyContext';
import { useLocale } from '../../context/LanguageContext';
import type { PropertyPost, PostTranslation } from '../../types/api';

// Helper function to get translation by locale (không fallback)
const getPostTranslation = (post: PropertyPost, locale: string): PostTranslation | null => {
  if (!post || !post.translations || post.translations.length === 0) {
    return null;
  }

  // Chỉ tìm translation khớp CHÍNH XÁC với locale
  const translation = post.translations.find(t => t.locale === locale);
  
  return translation || null;
};

/**
 * Parse HTML content để tách title từ thẻ heading và content còn lại
 * @param htmlContent - HTML string từ API
 * @returns { title: string | null, content: string }
 */
const parsePostContent = (htmlContent: string): { title: string | null; content: string } => {
  if (!htmlContent) {
    return { title: null, content: '' };
  }

  // Regex để tìm thẻ <h1>, <h2>, hoặc <h3> đầu tiên
  const headingRegex = /^(\s*<h[1-3][^>]*>(.*?)<\/h[1-3]>)/i;
  const match = htmlContent.match(headingRegex);

  if (match) {
    // Lấy text bên trong thẻ heading (bỏ HTML tags)
    const titleHtml = match[2];
    const title = titleHtml.replace(/<[^>]*>/g, '').trim();
    
    // Content là phần còn lại sau thẻ heading
    const content = htmlContent.replace(match[1], '').trim();
    
    return { title, content };
  }

  // Không tìm thấy heading -> toàn bộ là content
  return { title: null, content: htmlContent };
};

export const PropertyPostsContent = () => {
  const { propertyId } = usePropertyData();
  const locale = useLocale();
  const { posts, loading, error } = usePropertyPosts(propertyId);

  if (loading) {
    return <Skeleton active paragraph={{ rows: 4 }} />;
  }

  if (error) {
    return (
      <div style={{ color: 'rgba(255, 255, 255, 0.6)', textAlign: 'center', padding: '20px 0' }}>
        Không thể tải nội dung
      </div>
    );
  }

  // Lọc posts theo locale hiện tại - chỉ hiển thị posts có translation khớp locale
  const filteredPosts = posts.filter((post) => {
    const translation = getPostTranslation(post, locale);
    // Chỉ giữ lại posts có translation khớp CHÍNH XÁC với locale hiện tại
    return translation && translation.locale === locale;
  });

  // Empty state - để trống khi không có dữ liệu
  if (filteredPosts.length === 0) {
    return null;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {filteredPosts.map((post) => {
        const translation = getPostTranslation(post, locale);
        
        if (!translation) return null;

        // Parse content để tách title và nội dung
        const { content } = parsePostContent(translation.content);

        return (
          <div key={`${post.id}-${locale}`}>
            {/* Content - HTML rendered (không có heading) */}
            <div
              style={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '14px',
                lineHeight: '22px',
              }}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default PropertyPostsContent;
