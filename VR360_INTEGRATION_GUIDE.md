# VR360 Integration Guide

## Tổng quan

Dự án đã được setup sẵn để tích hợp VR360 links từ FastAPI backend. Structure này cho phép bạn dễ dàng hiển thị VR360 tours cho rooms, facilities, và các khu vực khác nhau của hotel.

## 📁 Structure

```
src/
├── types/
│   └── hotel.ts              # VR360Link, VR360Category types
├── services/
│   └── vr360Service.ts       # API calls đến FastAPI backend
├── hooks/
│   └── useVR360.ts           # React hooks để fetch VR360 data
└── components/
    └── common/
        └── VR360Viewer.tsx   # UI components để hiển thị VR360
```

## 🎯 Backend API Contract

### Endpoints cần có từ FastAPI:

```
GET  /vr360                    # Lấy danh sách VR360 links (có filter)
GET  /vr360/{id}              # Lấy chi tiết 1 VR360 link
GET  /vr360/category/{cat}    # Lấy VR360 theo category
GET  /vr360/room/{roomId}     # Lấy VR360 của room
GET  /vr360/facility/{facId}  # Lấy VR360 của facility
POST /vr360                    # Tạo mới VR360 link (Admin)
PATCH /vr360/{id}             # Cập nhật VR360 link (Admin)
DELETE /vr360/{id}            # Xóa VR360 link (Admin)
```

### Request/Response Examples

#### GET /vr360 - List VR360 Links

**Query Parameters:**
```typescript
{
  category?: 'ROOM' | 'LOBBY' | 'RESTAURANT' | 'POOL' | 'GYM' | 'SPA' | 'ROOFTOP' | 'EXTERIOR' | 'OTHER'
  room_id?: string
  facility_id?: string
  is_active?: boolean
  page?: number
  limit?: number
}
```

**Response 200:**
```json
{
  "data": [
    {
      "id": "vr-001",
      "title": "Deluxe Room VR Tour",
      "description": "Experience our luxurious deluxe room in 360°",
      "vrUrl": "https://vr360.example.com/deluxe-room",
      "thumbnailUrl": "https://cdn.example.com/thumb-deluxe.jpg",
      "category": "ROOM",
      "roomId": "room-123",
      "facilityId": null,
      "order": 1,
      "isActive": true,
      "createdAt": "2026-01-10T00:00:00Z",
      "updatedAt": "2026-01-10T00:00:00Z"
    }
  ],
  "total": 45,
  "page": 1,
  "limit": 20,
  "hasMore": true
}
```

#### GET /vr360/{id} - Get VR360 Detail

**Response 200:**
```json
{
  "data": {
    "id": "vr-001",
    "title": "Deluxe Room VR Tour",
    "description": "Experience our luxurious deluxe room in 360°",
    "vrUrl": "https://vr360.example.com/deluxe-room",
    "thumbnailUrl": "https://cdn.example.com/thumb-deluxe.jpg",
    "category": "ROOM",
    "roomId": "room-123",
    "facilityId": null,
    "order": 1,
    "isActive": true,
    "createdAt": "2026-01-10T00:00:00Z",
    "updatedAt": "2026-01-10T00:00:00Z"
  }
}
```

#### POST /vr360 - Create VR360 Link

**Request Body:**
```json
{
  "title": "Rooftop Pool VR Tour",
  "description": "360° view of our stunning rooftop pool",
  "vrUrl": "https://vr360.example.com/rooftop-pool",
  "thumbnailUrl": "https://cdn.example.com/thumb-pool.jpg",
  "category": "POOL",
  "facilityId": "pool-001",
  "order": 1
}
```

**Response 201:**
```json
{
  "data": {
    "id": "vr-002",
    "title": "Rooftop Pool VR Tour",
    "description": "360° view of our stunning rooftop pool",
    "vrUrl": "https://vr360.example.com/rooftop-pool",
    "thumbnailUrl": "https://cdn.example.com/thumb-pool.jpg",
    "category": "POOL",
    "roomId": null,
    "facilityId": "pool-001",
    "order": 1,
    "isActive": true,
    "createdAt": "2026-01-13T10:30:00Z",
    "updatedAt": "2026-01-13T10:30:00Z"
  },
  "message": "VR360 link created successfully"
}
```

#### Error Responses

**400 Bad Request:**
```json
{
  "detail": "Invalid category"
}
```

**401 Unauthorized:**
```json
{
  "detail": "Not authenticated"
}
```

**404 Not Found:**
```json
{
  "detail": "VR360 link not found"
}
```

**422 Validation Error:**
```json
{
  "detail": "Validation failed",
  "errors": {
    "vrUrl": ["Invalid URL format"],
    "category": ["Invalid category value"]
  }
}
```

## 💻 Usage Examples

### Example 1: Hiển thị VR360 cho Room

```tsx
// pages/RoomDetailPage.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { useVR360ByRoom } from '../hooks/useVR360';
import { VR360Gallery } from '../components/common';

export const RoomDetailPage: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const { links, loading, error } = useVR360ByRoom(roomId);

  if (loading) {
    return <div className="flex justify-center p-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>;
  }

  if (error) {
    return <div className="text-red-600 p-4">
      Không thể tải VR360: {error.message}
    </div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Virtual Room Tour</h1>
      
      {links.length > 0 ? (
        <VR360Gallery links={links} columns={2} />
      ) : (
        <p className="text-gray-500">Phòng này chưa có VR tour</p>
      )}
    </div>
  );
};
```

### Example 2: Hiển thị VR360 theo Category (Lobby)

```tsx
// components/LobbyVRSection.tsx
import React, { useState } from 'react';
import { useVR360ByCategory } from '../hooks/useVR360';
import { VR360Category } from '../types/hotel';
import { VR360Viewer, VR360Modal } from '../components/common';

export const LobbyVRSection: React.FC = () => {
  const { links, loading } = useVR360ByCategory(VR360Category.LOBBY);
  const [selectedLink, setSelectedLink] = useState(null);

  if (loading) return <div>Loading...</div>;
  if (links.length === 0) return null;

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">
          Khám phá Sảnh Khách Sạn 360°
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {links.map(link => (
            <div key={link.id} onClick={() => setSelectedLink(link)}>
              <VR360Viewer link={link} autoLoad={false} className="h-96" />
            </div>
          ))}
        </div>
      </div>

      <VR360Modal 
        link={selectedLink}
        isOpen={!!selectedLink}
        onClose={() => setSelectedLink(null)}
      />
    </section>
  );
};
```

### Example 3: Single VR360 Viewer với Auto-load

```tsx
// components/FeaturedVRTour.tsx
import React from 'react';
import { useVR360Detail } from '../hooks/useVR360';
import VR360Viewer from '../components/common/VR360Viewer';

interface Props {
  vrLinkId: string;
}

export const FeaturedVRTour: React.FC<Props> = ({ vrLinkId }) => {
  const { link, loading, error } = useVR360Detail(vrLinkId);

  if (loading) return <div>Đang tải VR tour...</div>;
  if (error || !link) return null;

  return (
    <div className="w-full h-screen">
      <VR360Viewer 
        link={link} 
        autoLoad={true}
        className="w-full h-full"
      />
    </div>
  );
};
```

### Example 4: List tất cả VR360 với Filter

```tsx
// pages/VRGalleryPage.tsx
import React, { useState } from 'react';
import { useVR360Links } from '../hooks/useVR360';
import { VR360Category } from '../types/hotel';
import { VR360Gallery } from '../components/common';

export const VRGalleryPage: React.FC = () => {
  const [category, setCategory] = useState<VR360Category | undefined>();
  const { links, loading, total } = useVR360Links({ 
    category, 
    isActive: true 
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Virtual Tours</h1>
      
      {/* Filter buttons */}
      <div className="flex gap-2 mb-8 overflow-x-auto">
        <button 
          onClick={() => setCategory(undefined)}
          className={`px-4 py-2 rounded-lg ${!category ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Tất cả ({total})
        </button>
        {Object.values(VR360Category).map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap ${category === cat ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <VR360Gallery links={links} columns={3} />
      )}
    </div>
  );
};
```

## 🔧 API Client Configuration

API client đã được config sẵn trong `api.ts`:
- ✅ Auto authentication với Bearer token
- ✅ Auto refresh token khi expired
- ✅ Timeout 15s
- ✅ Error handling với retry logic

## 🎨 Component Props

### VR360Viewer

```typescript
interface VR360ViewerProps {
  link: VR360Link;        // VR360 link object (required)
  autoLoad?: boolean;     // Auto load VR ngay (default: false)
  className?: string;     // Custom CSS classes
  onLoad?: () => void;    // Callback khi load xong
  onError?: (error: Error) => void; // Callback khi có lỗi
}
```

### VR360Modal

```typescript
interface VR360ModalProps {
  link: VR360Link | null; // VR360 link to display
  isOpen: boolean;        // Modal open state
  onClose: () => void;    // Close callback
}
```

### VR360Gallery

```typescript
interface VR360GalleryProps {
  links: VR360Link[];     // Array of VR360 links
  className?: string;     // Custom CSS classes
  columns?: 1 | 2 | 3 | 4; // Number of columns (default: 3)
}
```

## 📝 CURL Examples

### Lấy tất cả VR360 links

```bash
curl -X GET "http://localhost:8000/api/v1/vr360?is_active=true&page=1&limit=20" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Accept: application/json"
```

### Lấy VR360 của room cụ thể

```bash
curl -X GET "http://localhost:8000/api/v1/vr360/room/room-123" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Accept: application/json"
```

### Tạo VR360 link mới

```bash
curl -X POST "http://localhost:8000/api/v1/vr360" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "title": "Deluxe Room Virtual Tour",
    "description": "Experience luxury in 360°",
    "vrUrl": "https://vr360.example.com/deluxe",
    "thumbnailUrl": "https://cdn.example.com/thumb.jpg",
    "category": "ROOM",
    "roomId": "room-123",
    "order": 1
  }'
```

## 🐛 Debugging Checklist

### CORS Issues
- [ ] Backend có enable CORS cho frontend origin
- [ ] Backend có `Access-Control-Allow-Credentials: true` (nếu dùng cookies)
- [ ] Frontend có set `withCredentials: true` trong axios (nếu cần)

### Authentication Issues
- [ ] Check `VITE_API_BASE_URL` trong `.env`
- [ ] Check token có được lưu và gửi đúng không
- [ ] Check token có expired không
- [ ] Check refresh token logic

### VR360 Loading Issues
- [ ] Check vrUrl có valid không
- [ ] Check CORS của VR360 provider
- [ ] Check iframe allow attributes
- [ ] Check network tab trong DevTools

### Data Not Showing
- [ ] Check API response format có match với types không
- [ ] Check loading/error states trong hooks
- [ ] Check console errors
- [ ] Check network requests trong DevTools

## 🚀 Next Steps

1. **Backend Implementation:**
   - Implement các endpoints theo contract trên
   - Setup database models cho VR360Link
   - Implement authentication & authorization
   - Test với Postman/curl

2. **Frontend Testing:**
   - Test với mock data trước
   - Test với real API sau khi backend ready
   - Test responsive design
   - Test error states

3. **Production:**
   - Setup CDN cho VR360 assets
   - Optimize loading performance
   - Add analytics tracking
   - Add SEO meta tags

## 📞 Support

Nếu cần thêm tính năng hoặc có vấn đề gì, hãy liên hệ team dev!
