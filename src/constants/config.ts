// API endpoints
export const API_ENDPOINTS = {
  HOTEL_INFO: '/hotel-info',
  ROOMS: '/rooms',
  AMENITIES: '/amenities',
  SERVICES: '/services',
  BOOKINGS: '/bookings',
  CONTACT: '/contact',
  GALLERY: '/gallery',
  NEWS: '/news',
  VR360: '/vr360',
  VR360_BY_CATEGORY: '/vr360/category',
  VR360_BY_ROOM: '/vr360/room',
  VR360_BY_FACILITY: '/vr360/facility',
} as const;

// App configuration
export const APP_CONFIG = {
  APP_NAME: 'Maris Hotel',
  APP_DESCRIPTION: 'Khách sạn Maris Nha Trang',
  DEFAULT_LANGUAGE: 'vi',
  SUPPORTED_LANGUAGES: ['vi', 'en', 'zh', 'ru', 'ko'],
  PHONE: '+842583908899',
  EMAIL: 'info@marishotel.vn',
  ADDRESS: 'Nha Trang, Khánh Hòa',
} as const;

export default API_ENDPOINTS;
