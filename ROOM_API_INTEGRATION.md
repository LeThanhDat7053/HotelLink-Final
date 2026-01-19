# Room API Integration Guide

## ✅ Đã hoàn thành

Đã chuyển đổi phần **Phòng Nghỉ** từ mockdata sang API thật theo yêu cầu:

### 1. **Types & Interfaces** 
📄 [`src/types/room.ts`](src/types/room.ts)
- `RoomResponse`: Response từ API GET /api/v1/vr-hotel/rooms
- `RoomUIData`: Data đã xử lý cho UI component
- `RoomTranslations`: Hỗ trợ đa ngôn ngữ (vi, en, yue, etc.)
- `RoomMedia`: Media với is_primary flag

### 2. **Service Layer**
📄 [`src/services/roomService.ts`](src/services/roomService.ts)
- `getRooms()`: Fetch danh sách phòng từ API
- `transformRoomForUI()`: Transform API response sang UI format
- `getRoomsForUI()`: Fetch + transform trong 1 call
- `getRoomById()`: Lấy chi tiết 1 phòng

**Logic xử lý ảnh:**
- ✅ `is_primary: true` → Ảnh đại diện (hiển thị trong danh sách)
- ✅ `is_primary: false` → Ảnh chi tiết (hiển thị trong gallery)

**Logic đa ngôn ngữ:**
- ✅ Lấy translation theo `locale` từ LanguageContext
- ✅ Fallback: locale → 'vi' → first available locale

### 3. **React Hooks**
📄 [`src/hooks/useRooms.ts`](src/hooks/useRooms.ts)

#### `useRooms` - Danh sách phòng
```tsx
const { rooms, loading, error, refetch } = useRooms({
  propertyId: 10,
  locale: 'vi',
  params: {
    limit: 100,
    status: 'available',
    room_type: 'deluxe',
  }
});
```

#### `useRoomDetail` - Chi tiết 1 phòng
```tsx
const { room, loading, error, refetch } = useRoomDetail({
  propertyId: 10,
  roomId: 1,
  locale: 'vi',
});
```

### 4. **UI Components**

#### RoomList Component
📄 [`src/components/common/RoomList.tsx`](src/components/common/RoomList.tsx)

**Đã cập nhật:**
- ✅ Fetch data từ API qua `useRooms` hook
- ✅ Hiển thị ảnh đại diện (`is_primary: true`)
- ✅ Hiển thị name/description theo locale hiện tại
- ✅ Loading state với Spin
- ✅ Error state với Alert
- ✅ Empty state

**Props:**
```tsx
interface RoomListProps {
  onRoomClick?: (room: RoomUIData) => void;
  className?: string;
  limit?: number;
  roomType?: string;
  status?: string; // Default: 'available'
}
```

#### RoomDetail Component
📄 [`src/components/common/RoomDetail.tsx`](src/components/common/RoomDetail.tsx)

**Đã cập nhật:**
- ✅ Hiển thị thông tin chi tiết từ API
- ✅ Gallery ảnh (`is_primary: false`)
- ✅ Format giá tiền (VNĐ)
- ✅ Hiển thị amenities từ API
- ✅ Link VR360 (nếu có)
- ✅ Loading/Error/Empty states

**Thông tin hiển thị:**
- ✅ Tên phòng (name từ translations)
- ✅ Mô tả (description từ translations)
- ✅ Giá phòng/đêm (price_per_night)
- ✅ Sức chứa (capacity)
- ✅ Diện tích (size_sqm)
- ✅ Tầng (floor)
- ✅ Loại giường (bed_type)
- ✅ Tiện nghi (amenities_json)
- ✅ Gallery ảnh (media với is_primary=false)
- ✅ Link VR360 (attributes_json.vr_link)

#### RoomsView Component
📄 [`src/components/common/RoomsView.tsx`](src/components/common/RoomsView.tsx)

**Đã cập nhật:**
- ✅ List view: Hiển thị RoomList
- ✅ Detail view: Hiển thị RoomDetail khi click vào phòng
- ✅ Fetch room detail on-demand (chỉ khi click)
- ✅ Auto update title khi chọn phòng

---

## 🔧 API Configuration

### Endpoint
```
GET /api/v1/vr-hotel/rooms
```

### Headers
```typescript
{
  'x-property-id': number,  // Required
  'Authorization': 'Bearer <token>'  // Auto handled by api client
}
```

### Query Params
```typescript
{
  skip?: number,      // Default: 0
  limit?: number,     // Default: 100, max: 500
  room_type?: string, // Filter by room type
  status?: string,    // Filter by status
}
```

### Response Structure
```typescript
[
  {
    id: number,
    room_code: string,
    room_type: string,
    capacity: number,
    size_sqm: number,
    price_per_night: number,
    status: string,
    amenities_json: string[],
    attributes_json: {
      vr_link?: string,
    },
    translations: {
      vi: {
        locale: 'vi',
        name: string,
        description: string,
      },
      en: { ... },
      yue: { ... },
    },
    media: [
      {
        media_id: number,
        is_vr360: boolean,
        is_primary: boolean,  // TRUE = ảnh đại diện
        sort_order: number,
      }
    ]
  }
]
```

---

## 📝 Usage Examples

### 1. Hiển thị danh sách phòng trong trang

```tsx
import { RoomList } from '@/components/common';
import type { RoomUIData } from '@/types/room';

function RoomsPage() {
  const handleRoomClick = (room: RoomUIData) => {
    console.log('Selected room:', room.name);
    // Navigate to detail or open modal
  };

  return (
    <div>
      <h1>Phòng Nghỉ</h1>
      <RoomList 
        onRoomClick={handleRoomClick}
        limit={50}
        status="available"
      />
    </div>
  );
}
```

### 2. Hiển thị chi tiết phòng với hook

```tsx
import { useRoomDetail } from '@/hooks';
import { RoomDetail } from '@/components/common';
import { useProperty } from '@/context/PropertyContext';
import { useLanguage } from '@/context/LanguageContext';

function RoomDetailPage({ roomId }: { roomId: number }) {
  const { propertyId } = useProperty();
  const { locale } = useLanguage();
  
  const { room, loading, error } = useRoomDetail({
    propertyId,
    roomId,
    locale,
  });

  return (
    <RoomDetail 
      room={room} 
      loading={loading}
      error={error}
      onBack={() => window.history.back()}
    />
  );
}
```

### 3. Lọc phòng theo room_type

```tsx
import { useRooms } from '@/hooks';

function DeluxeRooms() {
  const { propertyId } = useProperty();
  const { locale } = useLanguage();
  
  const { rooms, loading } = useRooms({
    propertyId,
    locale,
    params: {
      room_type: 'deluxe',
      status: 'available',
      limit: 20,
    }
  });

  if (loading) return <Spin />;

  return (
    <div>
      <h2>Phòng Deluxe ({rooms.length})</h2>
      {rooms.map(room => (
        <div key={room.id}>{room.name} - {room.price} VNĐ</div>
      ))}
    </div>
  );
}
```

---

## 🌐 Đa ngôn ngữ (i18n)

### Translations được xử lý tự động:
```typescript
// API trả về:
{
  translations: {
    vi: { name: "Phòng Deluxe", description: "..." },
    en: { name: "Deluxe Room", description: "..." },
    yue: { name: "豪華客房", description: "..." },
  }
}

// Service tự động chọn theo locale:
roomService.transformRoomForUI(room, 'vi')  // → "Phòng Deluxe"
roomService.transformRoomForUI(room, 'en')  // → "Deluxe Room"
roomService.transformRoomForUI(room, 'yue') // → "豪華客房"
```

### Fallback logic:
1. Ưu tiên: Locale hiện tại (từ LanguageContext)
2. Fallback 1: 'vi' (Vietnamese)
3. Fallback 2: Locale đầu tiên có trong translations

---

## 🖼️ Xử lý Media/Ảnh

### Primary Image (Ảnh đại diện)
```typescript
// Lấy ảnh có is_primary=true
const primaryMedia = room.media.find(m => m.is_primary && !m.is_vr360);
const primaryImage = primaryMedia 
  ? mediaService.getMediaViewUrl(primaryMedia.media_id) 
  : null;

// URL: https://travel.link360.vn/api/v1/media/{media_id}/view
```

### Gallery Images (Ảnh chi tiết)
```typescript
// Lấy tất cả ảnh có is_primary=false, sort theo sort_order
const galleryMedia = room.media
  .filter(m => !m.is_primary && !m.is_vr360)
  .sort((a, b) => a.sort_order - b.sort_order);

const galleryImages = galleryMedia.map(m => 
  mediaService.getMediaViewUrl(m.media_id)
);
```

---

## ⚙️ Environment Variables

Cần có trong `.env.local`:
```env
VITE_API_BASE_URL=https://travel.link360.vn/api/v1
VITE_PROPERTY_CODE=YOUR_PROPERTY_CODE
VITE_API_USERNAME=your_username
VITE_API_PASSWORD=your_password
VITE_TENANT_CODE=your_tenant_code
```

---

## 🐛 Debug & Troubleshooting

### 1. Không có dữ liệu phòng
- ✅ Kiểm tra `propertyId` có đúng không
- ✅ Kiểm tra `x-property-id` header trong Network tab
- ✅ Kiểm tra filter params (status, room_type)

### 2. Ảnh không hiển thị
- ✅ Kiểm tra `media_id` có tồn tại không
- ✅ Kiểm tra URL: `/api/v1/media/{id}/view`
- ✅ Kiểm tra `is_primary` flag

### 3. Translations không đúng
- ✅ Kiểm tra `locale` từ LanguageContext
- ✅ Kiểm tra translations object trong API response
- ✅ Kiểm tra fallback logic

### 4. Loading state không đúng
- ✅ Kiểm tra `propertyId` có null không (nếu null, hook disabled)
- ✅ Kiểm tra API response time
- ✅ Kiểm tra error trong console

---

## 📚 Related Files

### Types
- [`src/types/room.ts`](src/types/room.ts) - Room types
- [`src/types/api.ts`](src/types/api.ts) - API types
- [`src/types/index.ts`](src/types/index.ts) - Export all types

### Services
- [`src/services/roomService.ts`](src/services/roomService.ts) - Room API service
- [`src/services/mediaService.ts`](src/services/mediaService.ts) - Media service
- [`src/services/index.ts`](src/services/index.ts) - Export all services

### Hooks
- [`src/hooks/useRooms.ts`](src/hooks/useRooms.ts) - Room hooks
- [`src/hooks/index.ts`](src/hooks/index.ts) - Export all hooks

### Components
- [`src/components/common/RoomList.tsx`](src/components/common/RoomList.tsx)
- [`src/components/common/RoomDetail.tsx`](src/components/common/RoomDetail.tsx)
- [`src/components/common/RoomsView.tsx`](src/components/common/RoomsView.tsx)

### Context
- [`src/context/PropertyContext.tsx`](src/context/PropertyContext.tsx) - Property context
- [`src/context/LanguageContext.tsx`](src/context/LanguageContext.tsx) - Language context

---

## ✨ Features

- ✅ Fetch data từ API thật (không dùng mockdata)
- ✅ Đa ngôn ngữ (vi/en/yue/etc.) với fallback
- ✅ Phân loại ảnh: is_primary=true (đại diện) vs false (gallery)
- ✅ Loading/Error/Empty states
- ✅ TypeScript type-safe
- ✅ Auto format giá tiền (VNĐ)
- ✅ Filter theo room_type và status
- ✅ Pagination support (skip/limit)
- ✅ Media URL generation từ media_id
- ✅ VR360 link integration
- ✅ Responsive UI (mobile/desktop)

---

## 🎯 Next Steps (Optional)

### Nếu cần thêm features:

1. **Search/Filter UI**
   - Thêm search bar trong RoomList
   - Filter dropdown (room_type, price range)

2. **Room Booking Integration**
   - Connect với booking API
   - Add availability calendar

3. **Room Comparison**
   - So sánh 2-3 phòng cùng lúc
   - Compare table view

4. **Favorites/Wishlist**
   - Save favorite rooms
   - LocalStorage persistence

5. **Reviews & Ratings**
   - Integrate room reviews
   - Rating display

---

**✅ Migration Complete!** Phần Phòng Nghỉ đã chuyển từ mockdata sang API thành công.
