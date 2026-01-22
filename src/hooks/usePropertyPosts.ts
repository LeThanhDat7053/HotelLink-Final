import { useState, useEffect } from 'react';
import { propertyPostService } from '../services/propertyPostService';
import type { PropertyPost, PostTranslation } from '../types/api';

/**
 * Parse HTML content để tách title từ thẻ heading
 * @param htmlContent - HTML string từ API
 * @returns title string hoặc null
 */
const extractTitleFromContent = (htmlContent: string): string | null => {
  if (!htmlContent) return null;

  // Regex để tìm thẻ <h1>, <h2>, hoặc <h3> đầu tiên
  const headingRegex = /^(\s*<h[1-3][^>]*>(.*?)<\/h[1-3]>)/i;
  const match = htmlContent.match(headingRegex);

  if (match) {
    // Lấy text bên trong thẻ heading (bỏ HTML tags)
    const titleHtml = match[2];
    return titleHtml.replace(/<[^>]*>/g, '').trim();
  }

  return null;
};

interface UsePropertyPostsReturn {
  posts: PropertyPost[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  getFirstPostTitle: (locale: string) => string | null;
}

/**
 * Hook để fetch property posts
 */
export const usePropertyPosts = (propertyId: number | null): UsePropertyPostsReturn => {
  const [posts, setPosts] = useState<PropertyPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPosts = async () => {
    if (!propertyId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await propertyPostService.getPropertyPosts({
        property_id: propertyId,
        status: 'published',
        limit: 100,
      });
      setPosts(data);
    } catch (err) {
      console.error('[usePropertyPosts] Failed to fetch posts:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch posts'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [propertyId]);

  // Helper function để lấy title của post đầu tiên theo locale
  // Title được parse từ thẻ <h1>/<h2>/<h3> trong content, không dùng field title của API
  const getFirstPostTitle = (locale: string): string | null => {
    if (posts.length === 0) return null;
    
    // Chỉ tìm post CÓ translation khớp CHÍNH XÁC với locale hiện tại
    for (const post of posts) {
      if (!post.translations || post.translations.length === 0) continue;
      
      const translation = post.translations.find(t => t.locale === locale);
      if (translation && translation.content) {
        // Parse title từ thẻ heading trong content
        const title = extractTitleFromContent(translation.content);
        if (title) return title;
      }
    }
    
    // Không có dữ liệu cho locale này -> trả về null (hiển thị trống)
    return null;
  };

  return { posts, loading, error, refetch: fetchPosts, getFirstPostTitle };
};

/**
 * Hook để lấy post content theo locale (không fallback)
 */
export const usePostContent = (post: PropertyPost | null, locale: string): PostTranslation | null => {
  if (!post || !post.translations || post.translations.length === 0) {
    return null;
  }

  // Chỉ tìm translation khớp CHÍNH XÁC với locale
  const translation = post.translations.find(t => t.locale === locale);
  
  return translation || null;
};
