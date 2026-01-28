/**
 * Booking URL Helper
 * Xử lý URL đặt phòng, đặc biệt cho Messenger và Zalo
 */

/**
 * Kiểm tra URL có phải Messenger không
 */
export const isMessengerUrl = (url: string): boolean => {
  if (!url) return false;
  const lowerUrl = url.toLowerCase();
  return lowerUrl.includes('m.me/') || lowerUrl.includes('messenger.com');
};

/**
 * Kiểm tra URL có phải Zalo không
 */
export const isZaloUrl = (url: string): boolean => {
  if (!url) return false;
  const lowerUrl = url.toLowerCase();
  return lowerUrl.includes('zalo.me/') || lowerUrl.includes('chat.zalo.me');
};

/**
 * Extract page ID từ m.me URL
 * @param url - m.me/xxx hoặc m.me/xxx?param=value
 * @returns page ID hoặc null
 */
const extractPageIdFromMeUrl = (url: string): string | null => {
  try {
    const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
    const pathParts = urlObj.pathname.split('/').filter(p => p);
    return pathParts.length > 0 ? pathParts[0] : null;
  } catch {
    return null;
  }
};

/**
 * Copy text vào clipboard
 * @param text - Text cần copy
 * @returns Promise<boolean> - true nếu copy thành công
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback cho browser cũ hoặc không secure context
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const result = document.execCommand('copy');
      textArea.remove();
      return result;
    }
  } catch (err) {
    console.error('Failed to copy text:', err);
    return false;
  }
};

/**
 * Tạo URL booking với tin nhắn soạn sẵn
 * @param url - URL gốc (m.me/xxx hoặc zalo.me/xxx)
 * @param itemName - Tên item (phòng, dịch vụ, ẩm thực, tiện ích)
 * @param wantToBookText - Text "Tôi muốn đặt" theo ngôn ngữ hiện tại
 * @returns URL với message được encode
 */
export const getBookingUrlWithMessage = (
  url: string,
  itemName: string,
  wantToBookText: string
): string => {
  if (!url) return url;
  
  const message = `${wantToBookText} ${itemName}`;
  const encodedMessage = encodeURIComponent(message);
  
  // Messenger: Convert m.me/xxx sang facebook.com/messages/t/xxx?text=xxx
  if (isMessengerUrl(url)) {
    // Nếu là m.me URL, extract page ID và convert
    if (url.includes('m.me/')) {
      const pageId = extractPageIdFromMeUrl(url);
      if (pageId) {
        // Format: https://www.facebook.com/messages/t/PAGE_ID?text=MESSAGE
        return `https://www.facebook.com/messages/t/${pageId}?text=${encodedMessage}`;
      }
    }
    
    // Nếu đã là messenger.com, thêm text parameter
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}text=${encodedMessage}`;
  }
  
  // Zalo: KHÔNG hỗ trợ pre-fill message qua URL
  // Đã test tất cả format có thể, không có cái nào work
  // Component sẽ handle clipboard copy và show notification
  // Ref: https://developers.zalo.me không có document về pre-fill message via URL
  if (isZaloUrl(url)) {
    // Trả về URL gốc, logic clipboard copy sẽ handle ở component
    return url;
  }
  
  // Các URL khác, trả về nguyên bản
  return url;
};

/**
 * Tạo tin nhắn booking
 * @param itemName - Tên item
 * @param wantToBookText - Text "Tôi muốn đặt"
 * @returns Message string
 */
export const createBookingMessage = (
  itemName: string,
  wantToBookText: string
): string => {
  return `${wantToBookText} ${itemName}`;
};
