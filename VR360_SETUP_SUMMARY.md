# ✅ VR360 Setup Complete!

## 📦 Những gì đã được setup

### 1. **Type Definitions** ([src/types/hotel.ts](src/types/hotel.ts))
- ✅ `VR360Link` interface - Structure cho VR360 link
- ✅ `VR360Category` enum - Các loại VR360 (ROOM, LOBBY, POOL, etc.)
- ✅ `RoomType` & `Facility` với `vr360Links` field
- ✅ DTOs cho CRUD operations
- ✅ `VR360ListParams` cho filtering

### 2. **API Service** ([src/services/vr360Service.ts](src/services/vr360Service.ts))
- ✅ `getVR360Links()` - Lấy danh sách với filter
- ✅ `getVR360ByCategory()` - Filter theo category
- ✅ `getVR360ByRoom()` - Lấy VR360 của room
- ✅ `getVR360ByFacility()` - Lấy VR360 của facility
- ✅ `getVR360Detail()` - Chi tiết 1 VR link
- ✅ `createVR360Link()` - Tạo mới (Admin)
- ✅ `updateVR360Link()` - Cập nhật (Admin)
- ✅ `deleteVR360Link()` - Xóa (Admin)
- ✅ Error handling cho 400/401/404/422/5xx
- ✅ Auto Bearer token authentication

### 3. **React Hooks** ([src/hooks/useVR360.ts](src/hooks/useVR360.ts))
- ✅ `useVR360Links()` - Hook với filter params
- ✅ `useVR360ByCategory()` - Hook theo category
- ✅ `useVR360ByRoom()` - Hook theo room ID
- ✅ `useVR360ByFacility()` - Hook theo facility ID
- ✅ `useVR360Detail()` - Hook chi tiết
- ✅ Loading/Error states
- ✅ Auto refetch capability

### 4. **UI Components** ([src/components/common/VR360Viewer.tsx](src/components/common/VR360Viewer.tsx))
- ✅ `VR360Viewer` - Component hiển thị VR360 iframe
  - Thumbnail preview với play button
  - Auto-load hoặc on-demand loading
  - Loading spinner
  - Error handling với retry
  - Info overlay
- ✅ `VR360Modal` - Fullscreen modal viewer
  - Backdrop với click-to-close
  - Close button
  - Responsive design
- ✅ `VR360Gallery` - Grid gallery component
  - Configurable columns (1-4)
  - Empty state
  - Modal integration

### 5. **Configuration** ([src/constants/config.ts](src/constants/config.ts))
- ✅ VR360 API endpoints constants
- ✅ Ready cho FastAPI backend integration

### 6. **Example Pages**
- ✅ [VR360GalleryPage.tsx](src/pages/VR360GalleryPage.tsx) - Trang gallery đầy đủ
- ✅ [RoomDetailWithVR360Page.tsx](src/pages/RoomDetailWithVR360Page.tsx) - Room detail với VR360

### 7. **Documentation**
- ✅ [VR360_INTEGRATION_GUIDE.md](VR360_INTEGRATION_GUIDE.md) - Full guide
- ✅ [VR360_API_EXAMPLES.md](VR360_API_EXAMPLES.md) - Fetch & Axios examples
- ✅ [.env.example](.env.example) - Environment setup

---

## 🚀 Quick Start

### 1. Setup Environment Variables

```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

### 2. Import và sử dụng

```tsx
import { useVR360ByRoom } from './hooks/useVR360';
import { VR360Gallery } from './components/common';

function RoomPage({ roomId }) {
  const { links, loading, error } = useVR360ByRoom(roomId);
  
  if (loading) return <Spinner />;
  if (error) return <Error />;
  
  return <VR360Gallery links={links} columns={3} />;
}
```

---

## 📋 Backend Requirements

Để frontend hoạt động, backend FastAPI cần implement các endpoints sau:

### Core Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/vr360` | List VR360 links (with filters) |
| GET | `/vr360/{id}` | Get VR360 detail |
| GET | `/vr360/category/{category}` | Get by category |
| GET | `/vr360/room/{room_id}` | Get by room |
| GET | `/vr360/facility/{facility_id}` | Get by facility |
| POST | `/vr360` | Create VR360 link (Admin) |
| PATCH | `/vr360/{id}` | Update VR360 link (Admin) |
| DELETE | `/vr360/{id}` | Delete VR360 link (Admin) |

### Response Format Example

```json
{
  "data": [
    {
      "id": "vr-001",
      "title": "Deluxe Room Tour",
      "description": "360° view",
      "vrUrl": "https://vr360.example.com/room-1",
      "thumbnailUrl": "https://cdn.example.com/thumb.jpg",
      "category": "ROOM",
      "roomId": "room-123",
      "facilityId": null,
      "order": 1,
      "isActive": true,
      "createdAt": "2026-01-13T10:00:00Z",
      "updatedAt": "2026-01-13T10:00:00Z"
    }
  ],
  "total": 45,
  "page": 1,
  "limit": 20,
  "hasMore": true
}
```

---

## 🎯 Usage Examples

### Example 1: Simple VR360 Gallery

```tsx
import { useVR360ByCategory } from '../hooks/useVR360';
import { VR360Gallery } from '../components/common';
import { VR360Category } from '../types/hotel';

export const LobbyVRSection = () => {
  const { links, loading } = useVR360ByCategory(VR360Category.LOBBY);
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <section>
      <h2>Khám phá Sảnh Khách Sạn</h2>
      <VR360Gallery links={links} columns={2} />
    </section>
  );
};
```

### Example 2: Room Detail với VR360

```tsx
import { useVR360ByRoom } from '../hooks/useVR360';
import { VR360Viewer } from '../components/common';

export const RoomDetail = ({ roomId }) => {
  const { links, loading, error } = useVR360ByRoom(roomId);
  
  return (
    <div>
      <h1>Room Virtual Tour</h1>
      {loading && <Spinner />}
      {error && <ErrorMessage error={error} />}
      {links.map(link => (
        <VR360Viewer key={link.id} link={link} />
      ))}
    </div>
  );
};
```

### Example 3: Direct API Call (Axios)

```tsx
import api from '../api';

const loadVR360 = async (roomId: string) => {
  try {
    const response = await api.get(`/vr360/room/${roomId}`);
    console.log('VR360 Links:', response.data.data);
    return response.data.data;
  } catch (error) {
    console.error('Failed:', error);
  }
};
```

---

## 🔧 Development Workflow

### 1. Test với Mock Data (Không cần backend)

Tạm thời sửa hook để return mock data:

```tsx
// src/hooks/useVR360.ts
export const useVR360ByRoom = (roomId: string) => {
  const [links] = useState([
    {
      id: 'vr-001',
      title: 'Room 360° Tour',
      vrUrl: 'https://momento360.com/e/u/your-tour-id',
      category: 'ROOM',
      isActive: true,
      // ... other fields
    }
  ]);
  
  return { links, loading: false, error: null };
};
```

### 2. Test với Backend Dev Server

```bash
# Backend running on http://localhost:8000
# Frontend sẽ tự động connect qua VITE_API_BASE_URL
npm run dev
```

### 3. Test Authentication

API client (`api.ts`) đã có sẵn:
- ✅ Auto login & get token
- ✅ Auto refresh token khi expired
- ✅ Attach Bearer token vào mọi request

---

## 🐛 Troubleshooting

### CORS Error
```
Access to XMLHttpRequest has been blocked by CORS policy
```

**Fix:** Backend cần enable CORS:
```python
# FastAPI
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 401 Unauthorized
```
Failed to fetch VR360: Unauthorized
```

**Fix:** Check token trong localStorage hoặc verify API credentials

### VR360 Iframe không load
```
Refused to display in a frame because it set 'X-Frame-Options'
```

**Fix:** VR360 provider phải allow iframe embedding

---

## 📚 Documentation Files

| File | Description |
|------|-------------|
| [VR360_INTEGRATION_GUIDE.md](VR360_INTEGRATION_GUIDE.md) | Complete integration guide |
| [VR360_API_EXAMPLES.md](VR360_API_EXAMPLES.md) | Fetch & Axios code examples |
| [.env.example](.env.example) | Environment variables template |
| [VR360_SETUP_SUMMARY.md](VR360_SETUP_SUMMARY.md) | This file |

---

## 🎉 You're Ready!

Structure đã setup xong và sẵn sàng cho FastAPI backend!

### Next Steps:
1. ✅ Backend implement các endpoints
2. ✅ Test với Postman/curl
3. ✅ Connect frontend với backend
4. ✅ Test UI components
5. ✅ Deploy to production

---

## 💬 Questions?

Nếu cần support thêm về:
- Custom VR360 player integration
- Advanced filtering/pagination
- Admin dashboard để manage VR360 links
- Performance optimization
- SEO cho VR360 pages

Cứ hỏi nhé! 🚀
