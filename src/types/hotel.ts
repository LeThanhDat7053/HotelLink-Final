// Hotel information types
export interface HotelInfo {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  rating: number;
  totalRooms: number;
  totalFloors: number;
  checkInTime: string;
  checkOutTime: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

// Feature types
export interface HotelFeature {
  id: string;
  title: string;
  description: string;
  icon: string;
  image?: string;
}

// Amenity types
export const AmenityCategory = {
  ROOM: 'ROOM',
  FACILITY: 'FACILITY',
  SERVICE: 'SERVICE',
  DINING: 'DINING',
} as const;

export type AmenityCategoryType = typeof AmenityCategory[keyof typeof AmenityCategory];

export interface Amenity {
  id: string;
  name: string;
  category: AmenityCategoryType;
  icon: string;
  available: boolean;
}

// About section data
export interface AboutSection {
  title: string;
  subtitle?: string;
  content: string;
  highlights: string[];
  images: string[];
}

export interface RoomType {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  capacity: number;
  size: number; // in square meters
  bedType: string;
  images: string[];
  amenities: string[];
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Facility {
  id: string;
  name: string;
  description: string;
  category: string;
  images: string[];
  isAvailable: boolean;
}

// DTOs
export interface CreateHotelInfoDTO {
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
}

export interface UpdateHotelInfoDTO extends Partial<CreateHotelInfoDTO> {}
