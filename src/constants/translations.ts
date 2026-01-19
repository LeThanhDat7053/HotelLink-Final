/**
 * Multi-language translations for Header Menu
 * 
 * Hỗ trợ 20 ngôn ngữ theo yêu cầu:
 * ar, de, en, es, fr, hi, id, it, ja, ko, ms, pt, ru, ta, th, tl, vi, hk, zh-CN, zh-TW
 */

export interface MenuTranslations {
  about: string;           // Giới thiệu
  rooms: string;           // Phòng nghỉ
  dining: string;          // Ẩm thực
  facilities: string;      // Tiện ích
  services: string;        // Dịch vụ
  policy: string;          // Chính sách
  contact: string;         // Liên hệ
  booking: string;         // Đặt phòng
  gallery: string;         // Thư viện ảnh
  regulation: string;      // Nội quy khách sạn
  news: string;            // Tin tức & Sự kiện
}

// Translations cho 20 ngôn ngữ
export const MENU_TRANSLATIONS: Record<string, MenuTranslations> = {
  // Vietnamese - Tiếng Việt
  vi: {
    about: 'GIỚI THIỆU',
    rooms: 'PHÒNG NGHỈ',
    dining: 'ẨM THỰC',
    facilities: 'TIỆN ÍCH',
    services: 'DỊCH VỤ',
    policy: 'CHÍNH SÁCH',
    contact: 'LIÊN HỆ',
    booking: 'ĐẶT PHÒNG',
    gallery: 'Thư viện ảnh',
    regulation: 'Nội quy khách sạn',
    news: 'Tin tức & Sự kiện',
  },

  // English
  en: {
    about: 'ABOUT',
    rooms: 'ROOMS',
    dining: 'DINING',
    facilities: 'FACILITIES',
    services: 'SERVICES',
    policy: 'POLICY',
    contact: 'CONTACT',
    booking: 'BOOK NOW',
    gallery: 'Gallery',
    regulation: 'Hotel Regulations',
    news: 'News & Events',
  },

  // Arabic - العربية
  ar: {
    about: 'نبذة عنا',
    rooms: 'الغرف',
    dining: 'المطاعم',
    facilities: 'المرافق',
    services: 'الخدمات',
    policy: 'السياسة',
    contact: 'اتصل بنا',
    booking: 'احجز الآن',
    gallery: 'معرض الصور',
    regulation: 'لوائح الفندق',
    news: 'الأخبار والفعاليات',
  },

  // German - Deutsch
  de: {
    about: 'ÜBER UNS',
    rooms: 'ZIMMER',
    dining: 'GASTRONOMIE',
    facilities: 'EINRICHTUNGEN',
    services: 'SERVICES',
    policy: 'RICHTLINIEN',
    contact: 'KONTAKT',
    booking: 'JETZT BUCHEN',
    gallery: 'Galerie',
    regulation: 'Hotelregeln',
    news: 'Nachrichten & Events',
  },

  // Spanish - Español
  es: {
    about: 'ACERCA DE',
    rooms: 'HABITACIONES',
    dining: 'GASTRONOMÍA',
    facilities: 'INSTALACIONES',
    services: 'SERVICIOS',
    policy: 'POLÍTICA',
    contact: 'CONTACTO',
    booking: 'RESERVAR',
    gallery: 'Galería',
    regulation: 'Normas del hotel',
    news: 'Noticias y Eventos',
  },

  // French - Français
  fr: {
    about: 'À PROPOS',
    rooms: 'CHAMBRES',
    dining: 'RESTAURATION',
    facilities: 'ÉQUIPEMENTS',
    services: 'SERVICES',
    policy: 'POLITIQUE',
    contact: 'CONTACT',
    booking: 'RÉSERVER',
    gallery: 'Galerie',
    regulation: 'Règlement de l\'hôtel',
    news: 'Actualités & Événements',
  },

  // Hindi - हिंदी
  hi: {
    about: 'परिचय',
    rooms: 'कमरे',
    dining: 'भोजन',
    facilities: 'सुविधाएं',
    services: 'सेवाएं',
    policy: 'नीति',
    contact: 'संपर्क करें',
    booking: 'बुक करें',
    gallery: 'गैलरी',
    regulation: 'होटल नियम',
    news: 'समाचार और कार्यक्रम',
  },

  // Indonesian - Bahasa Indonesia
  id: {
    about: 'TENTANG',
    rooms: 'KAMAR',
    dining: 'KULINER',
    facilities: 'FASILITAS',
    services: 'LAYANAN',
    policy: 'KEBIJAKAN',
    contact: 'KONTAK',
    booking: 'PESAN SEKARANG',
    gallery: 'Galeri',
    regulation: 'Peraturan Hotel',
    news: 'Berita & Acara',
  },

  // Italian - Italiano
  it: {
    about: 'CHI SIAMO',
    rooms: 'CAMERE',
    dining: 'RISTORAZIONE',
    facilities: 'STRUTTURE',
    services: 'SERVIZI',
    policy: 'POLITICA',
    contact: 'CONTATTI',
    booking: 'PRENOTA ORA',
    gallery: 'Galleria',
    regulation: 'Regolamento dell\'hotel',
    news: 'Notizie & Eventi',
  },

  // Japanese - 日本語
  ja: {
    about: '紹介',
    rooms: '客室',
    dining: 'ダイニング',
    facilities: '施設',
    services: 'サービス',
    policy: 'ポリシー',
    contact: 'お問い合わせ',
    booking: '予約する',
    gallery: 'ギャラリー',
    regulation: 'ホテル規則',
    news: 'ニュース＆イベント',
  },

  // Korean - 한국어
  ko: {
    about: '소개',
    rooms: '객실',
    dining: '다이닝',
    facilities: '시설',
    services: '서비스',
    policy: '정책',
    contact: '문의',
    booking: '예약하기',
    gallery: '갤러리',
    regulation: '호텔 규정',
    news: '뉴스 & 이벤트',
  },

  // Malay - Bahasa Melayu
  ms: {
    about: 'MENGENAI',
    rooms: 'BILIK',
    dining: 'MAKAN',
    facilities: 'KEMUDAHAN',
    services: 'PERKHIDMATAN',
    policy: 'POLISI',
    contact: 'HUBUNGI',
    booking: 'TEMPAH SEKARANG',
    gallery: 'Galeri',
    regulation: 'Peraturan Hotel',
    news: 'Berita & Acara',
  },

  // Portuguese - Português
  pt: {
    about: 'SOBRE',
    rooms: 'QUARTOS',
    dining: 'GASTRONOMIA',
    facilities: 'INSTALAÇÕES',
    services: 'SERVIÇOS',
    policy: 'POLÍTICA',
    contact: 'CONTATO',
    booking: 'RESERVE AGORA',
    gallery: 'Galeria',
    regulation: 'Regulamento do Hotel',
    news: 'Notícias & Eventos',
  },

  // Russian - Русский
  ru: {
    about: 'О НАС',
    rooms: 'НОМЕРА',
    dining: 'РЕСТОРАНЫ',
    facilities: 'УДОБСТВА',
    services: 'УСЛУГИ',
    policy: 'ПОЛИТИКА',
    contact: 'КОНТАКТЫ',
    booking: 'ЗАБРОНИРОВАТЬ',
    gallery: 'Галерея',
    regulation: 'Правила отеля',
    news: 'Новости и события',
  },

  // Tamil - தமிழ்
  ta: {
    about: 'பற்றி',
    rooms: 'அறைகள்',
    dining: 'உணவகம்',
    facilities: 'வசதிகள்',
    services: 'சேவைகள்',
    policy: 'கொள்கை',
    contact: 'தொடர்பு',
    booking: 'முன்பதிவு செய்க',
    gallery: 'படத்தொகுப்பு',
    regulation: 'ஹோட்டல் விதிகள்',
    news: 'செய்திகள் & நிகழ்வுகள்',
  },

  // Thai - ภาษาไทย
  th: {
    about: 'เกี่ยวกับเรา',
    rooms: 'ห้องพัก',
    dining: 'ร้านอาหาร',
    facilities: 'สิ่งอำนวยความสะดวก',
    services: 'บริการ',
    policy: 'นโยบาย',
    contact: 'ติดต่อ',
    booking: 'จองเลย',
    gallery: 'แกลเลอรี่',
    regulation: 'กฎของโรงแรม',
    news: 'ข่าว & กิจกรรม',
  },

  // Filipino/Tagalog
  tl: {
    about: 'TUNGKOL',
    rooms: 'MGA SILID',
    dining: 'KAINAN',
    facilities: 'PASILIDAD',
    services: 'SERBISYO',
    policy: 'PATAKARAN',
    contact: 'KONTAK',
    booking: 'MAG-BOOK NGAYON',
    gallery: 'Galeria',
    regulation: 'Mga Patakaran ng Hotel',
    news: 'Balita at Kaganapan',
  },

  // Cantonese - 廣語 (Hong Kong) - hk code
  hk: {
    about: '關於我們',
    rooms: '客房',
    dining: '餐飲',
    facilities: '設施',
    services: '服務',
    policy: '政策',
    contact: '聯繫我們',
    booking: '立即預訂',
    gallery: '圖片庫',
    regulation: '酒店規則',
    news: '新聞與活動',
  },

  // Cantonese - 粵語 - yue code (API code)
  yue: {
    about: '關於我們',
    rooms: '客房',
    dining: '餐飲',
    facilities: '設施',
    services: '服務',
    policy: '政策',
    contact: '聯繫我們',
    booking: '立即預訂',
    gallery: '圖片庫',
    regulation: '酒店規則',
    news: '新聞與活動',
  },

  // Chinese Simplified - 简体中文
  'zh-CN': {
    about: '关于我们',
    rooms: '客房',
    dining: '餐饮',
    facilities: '设施',
    services: '服务',
    policy: '政策',
    contact: '联系我们',
    booking: '立即预订',
    gallery: '图片库',
    regulation: '酒店规则',
    news: '新闻与活动',
  },
  
  // Alias for zh-CN
  zh: {
    about: '关于我们',
    rooms: '客房',
    dining: '餐饮',
    facilities: '设施',
    services: '服务',
    policy: '政策',
    contact: '联系我们',
    booking: '立即预订',
    gallery: '图片库',
    regulation: '酒店规则',
    news: '新闻与活动',
  },

  // Chinese Traditional - 中文（繁體）
  'zh-TW': {
    about: '關於我們',
    rooms: '客房',
    dining: '餐飲',
    facilities: '設施',
    services: '服務',
    policy: '政策',
    contact: '聯繫我們',
    booking: '立即預訂',
    gallery: '圖片庫',
    regulation: '酒店規則',
    news: '新聞與活動',
  },
};

/**
 * Helper function để lấy translations theo locale
 * Fallback: locale -> vi -> en
 */
export const getMenuTranslations = (locale: string): MenuTranslations => {
  return MENU_TRANSLATIONS[locale] || MENU_TRANSLATIONS['vi'] || MENU_TRANSLATIONS['en'];
};

/**
 * Mapping path -> translation key
 */
export const PATH_TO_TRANSLATION_KEY: Record<string, keyof MenuTranslations> = {
  '/gioi-thieu': 'about',
  '/phong-nghi': 'rooms',
  '/am-thuc': 'dining',
  '/tien-ich': 'facilities',
  '/dich-vu': 'services',
  '/chinh-sach': 'policy',
  '/lien-he': 'contact',
  '/dat-phong': 'booking',
  '/thu-vien-anh': 'gallery',
  '/noi-quy-khach-san': 'regulation',
  '/tin-tuc-su-kien': 'news',
};

export default MENU_TRANSLATIONS;
