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
 * @returns 'image' | 'vr360' | 'unknown'
 */
export const getMediaType = (url: string): 'image' | 'vr360' | 'unknown' => {
  if (!url) return 'unknown';
  
  if (isImageUrl(url)) return 'image';
  if (isVR360Url(url)) return 'vr360';
  
  // Mặc định coi là VR360 iframe nếu không xác định được
  return 'vr360';
};
