// Application routes
export const ROUTES = {
  HOME: '/',
  ABOUT: '/gioi-thieu',
  ROOMS: '/phong-nghi',
  DINING: '/am-thuc',
  RESTAURANT: '/nha-hang',
  LOBBY_BAR: '/lobby-bar',
  AMENITIES: '/tien-ich',
  POOL: '/ho-boi',
  GYM: '/phong-gym',
  SERVICES: '/dich-vu',
  MEETING_ROOM: '/phong-hop',
  SAUNA: '/phong-tam-hoi',
  OTHER_SERVICES: '/dich-vu-khac',
  POLICIES: '/chinh-sach',
  CONTACT: '/lien-he',
  GALLERY: '/thu-vien-anh',
  NEWS: '/tin-tuc-su-kien',
  BOOKING: '/dat-phong',
} as const;

/**
 * Helper function để tạo path với language prefix
 * @param path - Original path (ví dụ: /phong-nghi)
 * @param lang - Language code (ví dụ: en, vi, zh) - nếu là 'vi' thì không thêm prefix
 * @returns Path với language prefix (ví dụ: /en/phong-nghi) hoặc original path nếu là vi
 */
export const getLocalizedPath = (path: string, lang?: string): string => {
  if (!lang || lang === 'vi') {
    return path; // Default language không cần prefix
  }
  return `/${lang}${path}`;
};

/**
 * Helper function để extract language code từ pathname
 * @param pathname - Current pathname từ location
 * @returns Language code (en, vi, zh...) hoặc 'vi' nếu không có prefix
 */
export const extractLanguageFromPath = (pathname: string): string => {
  const langMatch = pathname.match(/^\/([a-z]{2})(\/.+)?$/);
  if (langMatch) {
    return langMatch[1]; // Return language code (en, zh...)
  }
  return 'vi'; // Default to Vietnamese
};

/**
 * Helper function để extract clean path từ pathname (bỏ language prefix)
 * @param pathname - Current pathname từ location
 * @returns Clean path without language prefix (ví dụ: /phong-nghi)
 */
export const extractCleanPath = (pathname: string): string => {
  // Match only /xx (language prefix) followed by either / or end of string
  // This prevents matching /phong-nghi as /ph + ong-nghi
  const langMatch = pathname.match(/^\/([a-z]{2})(?:\/(.*))?$/);
  if (langMatch && ['en', 'vi', 'zh'].includes(langMatch[1])) {
    // Only match valid language codes
    return langMatch[2] ? `/${langMatch[2]}` : '/';
  }
  return pathname;
};

// Navigation items
export interface NavItem {
  label: string;
  path: string;
  children?: NavItem[];
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'GIỚI THIỆU', path: ROUTES.ABOUT },
  { label: 'PHÒNG NGHỈ', path: ROUTES.ROOMS },
  {
    label: 'ẨM THỰC',
    path: ROUTES.DINING,
    children: [
      { label: 'NHÀ HÀNG', path: ROUTES.RESTAURANT },
      { label: 'LOBBY BAR', path: ROUTES.LOBBY_BAR },
    ],
  },
  {
    label: 'TIỆN ÍCH',
    path: ROUTES.AMENITIES,
    children: [
      { label: 'HỒ BƠI', path: ROUTES.POOL },
      { label: 'PHÒNG GYM', path: ROUTES.GYM },
    ],
  },
  {
    label: 'DỊCH VỤ',
    path: ROUTES.SERVICES,
    children: [
      { label: 'PHÒNG HỌP', path: ROUTES.MEETING_ROOM },
      { label: 'PHÒNG TẮM HƠI', path: ROUTES.SAUNA },
      { label: 'DỊCH VỤ KHÁC', path: ROUTES.OTHER_SERVICES },
    ],
  },
  { label: 'CHÍNH SÁCH', path: ROUTES.POLICIES },
  { label: 'LIÊN HỆ', path: ROUTES.CONTACT },
];

export default ROUTES;
