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

// VR360 types
export interface VR360Link {
  id: string;
  title: string;
  description?: string;
  vrUrl: string; // URL to VR360 viewer/iframe
  thumbnailUrl?: string;
  category: VR360CategoryType;
  roomId?: string; // Optional: link to specific room
  facilityId?: string; // Optional: link to facility
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type VR360CategoryType = 
  | 'ROOM' 
  | 'LOBBY' 
  | 'RESTAURANT' 
  | 'POOL' 
  | 'GYM' 
  | 'SPA' 
  | 'ROOFTOP' 
  | 'EXTERIOR' 
  | 'OTHER';

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
  vr360Links?: VR360Link[]; // VR360 links for this room
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
  vr360Links?: VR360Link[]; // VR360 links for this facility
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

// VR360 DTOs
export interface CreateVR360LinkDTO {
  title: string;
  description?: string;
  vrUrl: string;
  thumbnailUrl?: string;
  category: VR360CategoryType;
  roomId?: string;
  facilityId?: string;
  order?: number;
}

export interface UpdateVR360LinkDTO extends Partial<CreateVR360LinkDTO> {
  isActive?: boolean;
}

export interface VR360ListParams {
  category?: VR360CategoryType;
  roomId?: string;
  facilityId?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}
