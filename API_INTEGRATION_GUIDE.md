# API Integration Guide

## ✅ Đã hoàn thành

### 1. **TypeScript Types** từ OpenAPI Schema
- [src/types/api.ts](src/types/api.ts) - Tất cả types từ backend

### 2. **Services** - API wrappers
- [src/services/propertyService.ts](src/services/propertyService.ts) - Properties
- [src/services/featureService.ts](src/services/featureService.ts) - Features & Categories  
- [src/services/postService.ts](src/services/postService.ts) - Posts (chứa VR360 URLs)
- [src/services/mediaService.ts](src/services/mediaService.ts) - Upload files
- [src/services/analyticsService.ts](src/services/analyticsService.ts) - Tracking

### 3. **React Hooks** - Data fetching
- [src/hooks/useAPI.ts](src/hooks/useAPI.ts)
  - `useProperty(code)` - Lấy property theo code
  - `useFeatures(categoryId)` - Lấy features
  - `useFeatureCategories()` - Lấy categories
  - `useVR360Posts(propertyId, featureId)` - Lấy posts có VR360
  - `usePosts(params)` - Lấy tất cả posts

### 4. **Test Page**
- [src/pages/APITestPage.tsx](src/pages/APITestPage.tsx) - Test tất cả endpoints

---

## 🚀 Cách sử dụng

### 1. Test kết nối
```bash
npm run dev
```
Mở: http://localhost:5173/api-test

### 2. Sử dụng trong components

#### Ví dụ 1: Lấy property info
```typescript
import { useProperty } from '@/hooks/useAPI';

function MyComponent() {
  const { property, loading, error } = useProperty('fusion-suites-vung-tau');
  
  if (loading) return <Spin />;
  if (error) return <Alert message={error.message} />;
  
  return (
    <div>
      <h1>{property.property_name}</h1>
      <p>{property.address}</p>
      {property.vr360_url && (
        <iframe src={property.vr360_url} />
      )}
    </div>
  );
}
```

#### Ví dụ 2: Lấy features
```typescript
import { useFeatures } from '@/hooks/useAPI';

function FeaturesList() {
  const { features, loading, error } = useFeatures();
  
  return (
    <div>
      {features.map(feature => (
        <div key={feature.id}>
          {feature.slug}
        </div>
      ))}
    </div>
  );
}
```

#### Ví dụ 3: Lấy posts có VR360
```typescript
import { useProperty, useVR360Posts } from '@/hooks/useAPI';

function VR360Gallery() {
  const { property } = useProperty('fusion-suites-vung-tau');
  const { posts, loading } = useVR360Posts(property?.id);
  
  return (
    <div>
      <h2>VR360 Tours ({posts.length})</h2>
      {posts.map(post => (
        <div key={post.id}>
          <h3>{post.slug}</h3>
          <iframe src={post.vr360_url} />
        </div>
      ))}
    </div>
  );
}
```

#### Ví dụ 4: Upload ảnh
```typescript
import { mediaService } from '@/services/mediaService';

async function handleUpload(file: File) {
  try {
    const media = await mediaService.uploadFile(file, {
      kind: 'image',
      alt_text: 'Hồ bơi vô cực'
    });
    
    console.log('Uploaded:', media.file_key);
    // URL: mediaService.getMediaUrl(media.file_key)
  } catch (err) {
    console.error(err);
  }
}
```

#### Ví dụ 5: Track analytics
```typescript
import { analyticsService } from '@/services/analyticsService';

// Track page view (không cần auth)
analyticsService.trackEvent({
  tracking_key: 'fusion-suites-vung-tau',
  event_type: 'page_view',
  device: 'desktop',
  url: window.location.pathname,
  page_title: document.title
});
```

---

## 📊 Cấu trúc dữ liệu

### Property → Features → Posts → VR360

```
Property (Fusion Suites Vũng Tàu)
├── id: 1
├── code: "fusion-suites-vung-tau"
├── vr360_url: "https://..."  ← Property-level VR360 (optional)
└── Features
    ├── Feature: "Infinity Pool" (id: 5)
    │   └── Posts
    │       ├── Post: "Pool Experience"
    │       │   └── vr360_url: "https://vr.pool"  ← Feature VR360
    │       └── Post: "Sunset at Pool"
    │           └── vr360_url: "https://vr.sunset"
    │
    └── Feature: "Rooftop Bar" (id: 12)
        └── Posts
            └── Post: "Bar 360 View"
                └── vr360_url: "https://vr.bar"
```

### Lấy tất cả VR360 URLs

```typescript
// 1. Property-level VR360
const { property } = useProperty('fusion-suites-vung-tau');
const propertyVR = property?.vr360_url;

// 2. Feature-level VR360 (trong Posts)
const { posts } = useVR360Posts(property?.id);
const featureVRs = posts.map(p => p.vr360_url);

// Total VR360s = propertyVR + featureVRs
```

---

## 🔧 Environment Variables

Đảm bảo `.env.local` đúng format Vite:

```env
VITE_API_BASE_URL=https://travel.link360.vn/api/v1
VITE_TENANT_CODE=fusion
VITE_PROPERTY_CODE=fusion-suites-vung-tau
VITE_API_USERNAME=fusion@admin.com
VITE_API_PASSWORD=Fusion@Admin
```

---

## 🎯 Next Steps

### Option 1: Chuyển mockData sang real API
Update các components hiện tại:
- `HomePage` → dùng `useProperty`, `useVR360Posts`
- `Header` menu → dùng `useFeatureCategories`
- VR360 iframe → dùng `post.vr360_url` thay vì `getVR360Url(panoId)`

### Option 2: Tạo trang mới với real data
- VR360 Gallery page với real posts
- Feature detail page
- Analytics dashboard

### Option 3: Hybrid approach
- Giữ mockData cho demo/testing
- Thêm flag để switch: `USE_REAL_API=true/false`

---

## 📝 Authentication Note

**api.ts tự động xử lý tất cả:**
- ✅ Auto-login khi khởi động
- ✅ Auto-attach Bearer token vào mọi request
- ✅ Auto-refresh token khi hết hạn (401/403)
- ✅ Retry failed requests sau khi refresh

**Bạn không cần lo về authentication!** Chỉ cần gọi services/hooks.

---

## 🐛 Troubleshooting

### Lỗi 404 Not Found
→ Endpoint chưa tồn tại trên backend. Xem [BACKEND_API_REFERENCE.md](BACKEND_API_REFERENCE.md) để biết endpoints có sẵn.

### Lỗi 401/403 Unauthorized
→ api.ts sẽ tự động retry. Nếu vẫn lỗi, check `.env.local` credentials.

### Lỗi CORS
→ Backend đã config CORS. Nếu vẫn lỗi, đảm bảo đang chạy trên `localhost:5173` (Vite dev server).

### Data trống
→ Backend có thể chưa có data. Dùng Swagger UI để tạo data test: https://travel.link360.vn/api/v1/docs
