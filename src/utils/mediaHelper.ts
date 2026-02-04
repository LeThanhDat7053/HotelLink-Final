/**
 * Media Helper Utilities
 * Các hàm tiện ích để xử lý media (ảnh, video, VR360, etc.)
 */

/**
 * Kiểm tra xem URL có phải là file ảnh hay không
 * @param url - URL cần kiểm tra
 * @returns true nếu là ảnh, false nếu không phải
 */
export const isImageUrl = (url: string): boolean => {
  if (!url) return false;
  
  // Kiểm tra nếu là URL từ media API (/media/{id}/view hoặc /media/file/{file_key})
  if (url.includes('/media/') && (url.includes('/view') || url.includes('/file/'))) {
    return true;
  }
  
  // Các extension ảnh phổ biến
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg', '.ico'];
  
  try {
    // Parse URL để lấy pathname
    const urlObj = new URL(url);
    const pathname = urlObj.pathname.toLowerCase();
    
    // Kiểm tra extension
    return imageExtensions.some(ext => pathname.endsWith(ext));
  } catch {
    // Nếu không parse được URL, fallback kiểm tra string
    const lowerUrl = url.toLowerCase();
    return imageExtensions.some(ext => lowerUrl.includes(ext));
  }
};

/**
 * Kiểm tra xem URL có phải là YouTube video hay không
 * @param url - URL cần kiểm tra
 * @returns true nếu là YouTube, false nếu không phải
 */
export const isYouTubeUrl = (url: string): boolean => {
  if (!url) return false;
  
  const youtubeDomains = [
    'youtube.com',
    'youtu.be',
    'youtube-nocookie.com',
  ];
  
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    
    return youtubeDomains.some(domain => hostname.includes(domain));
  } catch {
    const lowerUrl = url.toLowerCase();
    return youtubeDomains.some(domain => lowerUrl.includes(domain));
  }
};

/**
 * Convert YouTube URL thành embed URL
 * @param url - YouTube URL (watch hoặc short link)
 * @returns Embed URL hoặc URL gốc nếu không phải YouTube
 */
export const getYouTubeEmbedUrl = (url: string): string => {
  if (!url || !isYouTubeUrl(url)) return url;
  
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    
    // Handle youtu.be short links
    if (hostname.includes('youtu.be')) {
      const videoId = urlObj.pathname.slice(1); // Remove leading '/'
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}`;
    }
    
    // Handle youtube.com/watch?v=xxx
    if (hostname.includes('youtube.com')) {
      const videoId = urlObj.searchParams.get('v');
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}`;
      }
    }
    
    // If already embed URL, return as is
    if (url.includes('/embed/')) {
      return url;
    }
    
    return url;
  } catch {
    return url;
  }
};

/**
 * Kiểm tra xem URL có phải là VR360 iframe hay không
 * @param url - URL cần kiểm tra
 * @returns true nếu là VR360 iframe, false nếu không phải
 */
export const isVR360Url = (url: string): boolean => {
  if (!url) return false;
  
  // Các domain VR360 phổ biến
  const vr360Domains = [
    'kuula.co',
    'my.matterport.com',
    'momento360.com',
    'panoraven.com',
    'roundme.com',
    '360cities.net',
    'eyespy360.com',
    'cloudpano.com',
  ];
  
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    
    // Kiểm tra nếu domain là VR360
    return vr360Domains.some(domain => hostname.includes(domain));
  } catch {
    // Fallback kiểm tra string
    const lowerUrl = url.toLowerCase();
    return vr360Domains.some(domain => lowerUrl.includes(domain));
  }
};

/**
 * Xác định loại media từ URL
 * @param url - URL cần kiểm tra
 * @returns 'image' | 'youtube' | 'vr360' | 'unknown'
 */
export const getMediaType = (url: string): 'image' | 'youtube' | 'vr360' | 'unknown' => {
  if (!url) return 'unknown';
  
  if (isImageUrl(url)) return 'image';
  if (isYouTubeUrl(url)) return 'youtube';
  if (isVR360Url(url)) return 'vr360';
  
  // Mặc định coi là VR360 iframe nếu không xác định được
  return 'vr360';
};
