/**
 * Mock Data for Hotel Website
 * Dữ liệu giả để test UI, sau này sẽ kết nối FastAPI
 */

// ===========================================
// TYPES
// ===========================================

export interface Language {
  code: string;
  name: string;
  flag: string;
}

export interface MenuItem {
  path: string;
  label: string;
  children?: MenuItem[];
}

export interface FooterLink {
  path: string;
  label: string;
}

export interface HotelPageInfo {
  title: string;
  content: string;
}

export interface CopyrightInfo {
  year: number;
  hotelName: string;
  siteBy: string;
}

export interface ContactInfo {
  phone: string;
  phoneDisplay: string;
  email: string;
  address: string;
  facebook: string;
  website: string;
}

export interface WeatherInfo {
  temperature: string;
  location: string;
}

export interface PageMetadata {
  title: string;
  content: string;
  panoId: string;
}

// ===========================================
// MOCK DATA
// ===========================================

/**
 * Danh sách ngôn ngữ hỗ trợ
 */
export const LANGUAGES: Language[] = [
  { 
    code: 'vi', 
    name: 'TIẾNG VIỆT', 
    flag: 'https://marishotel.vn/wp-content/plugins/translatepress-multilingual/assets/images/flags/vi.png' 
  },
  { 
    code: 'en', 
    name: 'ENGLISH (UK)', 
    flag: 'https://marishotel.vn/wp-content/plugins/translatepress-multilingual/assets/images/flags/en_GB.png' 
  },
  { 
    code: 'zh', 
    name: '简体中文', 
    flag: 'https://marishotel.vn/wp-content/plugins/translatepress-multilingual/assets/images/flags/zh_CN.png' 
  },
  { 
    code: 'ru', 
    name: 'РУССКИЙ', 
    flag: 'https://marishotel.vn/wp-content/plugins/translatepress-multilingual/assets/images/flags/ru_RU.png' 
  },
  { 
    code: 'ko', 
    name: '한국어', 
    flag: 'https://marishotel.vn/wp-content/plugins/translatepress-multilingual/assets/images/flags/ko_KR.png' 
  },
];

/**
 * Ngôn ngữ mặc định
 */
export const DEFAULT_LANGUAGE: Language = LANGUAGES[0];

/**
 * Menu chính
 */
export const MENU_ITEMS: MenuItem[] = [
  { path: '/gioi-thieu', label: 'GIỚI THIỆU' },
  { path: '/phong-nghi', label: 'PHÒNG NGHỈ' },
  { 
    path: '/am-thuc', 
    label: 'ẨM THỰC',
  },
  { 
    path: '/tien-ich', 
    label: 'TIỆN ÍCH',
  },
  { 
    path: '/dich-vu', 
    label: 'DỊCH VỤ',
  },
  { path: '/chinh-sach', label: 'CHÍNH SÁCH' },
  { path: '/lien-he', label: 'LIÊN HỆ' },
];

/**
 * Footer links
 */
export const FOOTER_LINKS: FooterLink[] = [
  { path: '/thu-vien-anh', label: 'Thư viện ảnh' },
  { path: '/noi-quy-khach-san', label: 'Nội quy khách sạn' },
  { path: '/tin-tuc-su-kien', label: 'Tin tức & Sự kiện' },
];

/**
 * Thông tin trang chủ (InfoBox)
 */
export const HOME_PAGE_INFO: HotelPageInfo = {
  title: 'Khách sạn Maris Nha Trang',
  content: 'Tọa lạc tại vị trí đắc địa thuộc một trong những con đường vàng của trung tâm thành phố biển Nha Trang, khách sạn Maris với lối kiến trúc hiện đại hứa hẹn sẽ là một điểm đến thu hút du khách trong và ngoài nước. Với quy mô 21 tầng bao gồm 124 phòng nghỉ đạt tiêu chuẩn quốc tế với trang thiết bị hiện đại để tối ưu hóa nhu cầu của khách hàng. Đặc biệt, thiết kế tất cả các phòng đều có cửa sổ hoặc ban công hướng ra thành phố hoặc biển tạo nên sự thoải mái trong tâm hồn của quý khách khi được hòa mình trong khung cảnh thanh bình của thành phố biển xinh đẹp. Maris tin rằng tất cả các dịch vụ của chúng tôi mang đến sẽ tạo cho quý khách 1 chuyến đi ý nghĩa và trọn vẹn.',
};

/**
 * Thông tin copyright
 */
export const COPYRIGHT_INFO: CopyrightInfo = {
  year: 2023,
  hotelName: 'Maris Hotel',
  siteBy: 'Tour 360 VN',
};

/**
 * Thông tin liên hệ
 */
export const CONTACT_INFO: ContactInfo = {
  phone: '+842583908899',
  phoneDisplay: '+84 258 3908 899',
  email: 'info@marishotel.vn',
  address: '86-88 Trần Phú, Lộc Thọ, Nha Trang, Khánh Hòa',
  facebook: 'https://www.facebook.com/marishotelnhatrang',
  website: 'https://marishotel.vn',
};

/**
 * Thông tin thời tiết (mock)
 */
export const WEATHER_INFO: WeatherInfo = {
  temperature: '28°C',
  location: 'Nha Trang',
};

/**
 * Background images
 */
export const BACKGROUND_IMAGES = {
  home: 'https://marishotel.vn/wp-content/uploads/2023/01/home-bg.jpg',
  rooms: 'https://marishotel.vn/wp-content/uploads/2023/01/rooms-bg.jpg',
  dining: 'https://marishotel.vn/wp-content/uploads/2023/01/dining-bg.jpg',
};

/**
 * VR360 Tour base URL
 */
export const VR360_BASE_URL = 'https://marishotel.vn/Tour360/';

/**
 * Page metadata cho từng trang (title, content, panoId)
 */
export const PAGE_METADATA: Record<string, PageMetadata> = {
  '/': {
    title: 'Khách sạn Maris Nha Trang',
    content: 'Tọa lạc tại vị trí đắc địa thuộc một trong những con đường vàng của trung tâm thành phố biển Nha Trang, khách sạn Maris với lối kiến trúc hiện đại hứa hẹn sẽ là một điểm đến thu hút du khách trong và ngoài nước. Với quy mô 21 tầng bao gồm 124 phòng nghỉ đạt tiêu chuẩn quốc tế với trang thiết bị hiện đại để tối ưu hóa nhu cầu của khách hàng. Đặc biệt, thiết kế tất cả các phòng đều có cửa sổ hoặc ban công hướng ra thành phố hoặc biển tạo nên sự thoải mái trong tâm hồn của quý khách khi được hòa mình trong khung cảnh thanh bình của thành phố biển xinh đẹp. Maris tin rằng tất cả các dịch vụ của chúng tôi mang đến sẽ tạo cho quý khách 1 chuyến đi ý nghĩa và trọn vẹn.',
    panoId: 'pano17'
  },
  '/gioi-thieu': {
    title: 'Giới Thiệu',
    content: 'Khách sạn Maris Nha Trang là một trong những khách sạn hàng đầu tại thành phố biển xinh đẹp. Chúng tôi cung cấp các dịch vụ chất lượng cao và tiện nghi sang trọng để đáp ứng nhu cầu của khách hàng.',
    panoId: 'pano17'
  },
  '/phong-nghi': {
    title: 'Phòng Nghỉ',
    content: 'Các phòng nghỉ tại Maris Hotel được thiết kế hiện đại với đầy đủ tiện nghi, tất cả đều có view thành phố hoặc biển, mang đến trải nghiệm lưu trú thoải mái và sang trọng.',
    panoId: 'pano17'
  },
  '/am-thuc': {
    title: 'Ẩm Thực',
    content: 'Khám phá hương vị ẩm thực đa dạng tại Maris Hotel với nhà hàng và Lobby Bar sang trọng, phục vụ các món ăn Á - Âu tinh tế.',
    panoId: 'pano17'
  },
  '/tien-ich': {
    title: 'Tiện Ích',
    content: 'Tận hưởng các tiện ích cao cấp tại Maris Hotel: hồ bơi ngoài trời, phòng gym hiện đại và nhiều dịch vụ giải trí khác.',
    panoId: 'pano17'
  },
  '/dich-vu': {
    title: 'Dịch Vụ',
    content: 'Maris Hotel cung cấp đa dạng các dịch vụ: phòng họp, phòng tắm hơi, và nhiều dịch vụ tiện ích khác để phục vụ quý khách.',
    panoId: 'pano17'
  },
  '/chinh-sach': {
    title: 'Chính Sách',
    content: 'Chính sách đặt phòng, hủy phòng và các quy định khác của Maris Hotel.',
    panoId: 'pano17'
  },
  '/lien-he': {
    title: 'Liên Hệ',
    content: 'Liên hệ với Maris Hotel để được hỗ trợ đặt phòng và tư vấn dịch vụ.',
    panoId: 'pano17'
  },
};

// ===========================================
// HELPER FUNCTIONS
// ===========================================

/**
 * Format copyright text
 */
export const getCopyrightText = (): string => {
  return `©${COPYRIGHT_INFO.year} ${COPYRIGHT_INFO.hotelName}. Site by: ${COPYRIGHT_INFO.siteBy}`;
};

/**
 * Get language by code
 */
export const getLanguageByCode = (code: string): Language | undefined => {
  return LANGUAGES.find(lang => lang.code === code);
};

/**
 * Get menu item by path
 */
export const getMenuItemByPath = (path: string): MenuItem | undefined => {
  for (const item of MENU_ITEMS) {
    if (item.path === path) return item;
    if (item.children) {
      const child = item.children.find(c => c.path === path);
      if (child) return child;
    }
  }
  return undefined;
};

/**
 * Get page metadata by path
 */
export const getPageMetadata = (path: string): PageMetadata => {
  return PAGE_METADATA[path] || PAGE_METADATA['/'];
};

/**
 * Get VR360 iframe URL
 */
export const getVR360Url = (panoId: string, lang: string = 'vi'): string => {
  return `${VR360_BASE_URL}?lang=${lang}&s=${panoId}`;
};
