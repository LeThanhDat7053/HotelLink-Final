# Backend API Reference

**Base URL:** `https://travel.link360.vn/api/v1`  
**Tenant:** `fusion` (Fusion Suites Vũng Tàu)  
**Auth:** Bearer Token (auto-login qua api.ts)

## 📋 Tóm tắt

Backend **KHÔNG CÓ VR360 endpoints**. Các endpoints thực tế:

### ✅ Đã có endpoints:
1. **Auth** - Đăng nhập, logout
2. **Properties** - Quản lý khách sạn
3. **Features** - Tiện ích (hồ bơi, gym, spa...)
4. **Categories** - Danh mục features
5. **Posts** - Bài viết/nội dung
6. **Media** - Upload ảnh, video
7. **Analytics** - Tracking, thống kê
8. **Translations** - Đa ngôn ngữ
9. **Settings** - Cấu hình

### ❌ Chưa có:
- VR360 endpoints
- Room types
- Facilities

---

## 🔐 Authentication

### POST /auth/login
```typescript
// Request
{
  "username": "fusion@admin.com",
  "password": "Fusion@Admin"
}

// Response
{
  "access_token": "eyJ...",
  "token_type": "bearer"
}
```

**Note:** api.ts tự động xử lý login + token refresh!

---

## 🏨 Properties

### GET /properties/
Lấy danh sách properties

```typescript
// Request
GET /properties/?skip=0&limit=100

// Response
[
  {
    "id": 1,
    "tenant_id": 1,
    "property_name": "Fusion Suites Vũng Tàu",
    "code": "fusion-suites-vung-tau",
    "vr360_url": "https://...", // có thể có
    "address": "...",
    "city": "Vũng Tàu",
    "default_locale": "vi",
    ...
  }
]
```

### GET /properties/{property_id}
Chi tiết property

### GET /properties/by-code/{property_code}
Lấy property theo code

---

## 🎯 Features & Categories

### GET /features/categories
Lấy danh sách categories (Hồ bơi, Nhà hàng, Gym...)

```typescript
// Response
[
  {
    "id": 1,
    "slug": "pool",
    "icon_key": "swimming-pool",
    "priority": 10,
    "is_system": true
  }
]
```

### GET /features/
Lấy danh sách features (các tiện ích cụ thể)

```typescript
// Query params
{
  "category_id": 1,  // filter theo category
  "skip": 0,
  "limit": 100,
  "include_system": true
}

// Response
[
  {
    "id": 1,
    "slug": "infinity-pool",
    "category_id": 1,
    "icon_key": "pool-icon",
    "translations": {
      "vi": { "title": "Hồ bơi vô cực" },
      "en": { "title": "Infinity Pool" }
    }
  }
]
```

### POST /features/
Tạo feature mới

```typescript
{
  "slug": "rooftop-bar",
  "category_id": 3,
  "icon_key": "bar-icon"
}
```

---

## 📝 Posts

### GET /posts/
Lấy danh sách posts (bài viết về features)

```typescript
// Query params
{
  "property_id": 1,
  "feature_id": 5,
  "status": "PUBLISHED",  // DRAFT | PUBLISHED | ARCHIVED
  "skip": 0,
  "limit": 100
}

// Response
[
  {
    "id": 1,
    "slug": "infinity-pool-experience",
    "property_id": 1,
    "feature_id": 5,
    "status": "PUBLISHED",
    "vr360_url": "https://...",  // có thể có!
    "title": "Trải nghiệm hồ bơi vô cực",
    "content_html": "<p>...</p>"
  }
]
```

### POST /posts/
Tạo post mới

```typescript
{
  "slug": "unique-slug",
  "property_id": 1,
  "feature_id": 5,
  "title": "Tiêu đề",
  "content_html": "<p>Nội dung</p>",
  "vr360_url": "https://vr360.link",  // optional
  "status": "PUBLISHED"
}
```

### POST /posts/{post_id}/publish
Publish post

### POST /posts/{post_id}/archive
Archive post

---

## 🖼️ Media

### POST /media/upload
Upload file (ảnh, video)

```typescript
// FormData
const formData = new FormData();
formData.append('file', fileBlob);

// Query params
?kind=image&alt_text=Mô tả ảnh

// Response
{
  "id": 123,
  "file_key": "abc123.jpg",
  "mime_type": "image/jpeg",
  "width": 1920,
  "height": 1080,
  "size_bytes": 204800
}
```

### GET /media/
Lấy danh sách media files

### GET /media/{media_id}/view
Xem ảnh (public endpoint)

### GET /media/{media_id}/download
Download file (requires auth)

---

## 📊 Analytics (Tracking)

### POST /analytics/track (PUBLIC - no auth)
Track events từ frontend

```typescript
{
  "tracking_key": "fusion-suites-vung-tau",
  "event_type": "page_view",  // page_view | click | share
  "device": "desktop",  // desktop | tablet | mobile
  "url": "/features/pool",
  "page_title": "Infinity Pool",
  "session_id": "abc123"
}
```

### GET /analytics/dashboard-stats (requires auth)
Thống kê dashboard

```typescript
// Query: ?days=30
// Response
{
  "total_page_views": 1500,
  "page_views_growth": 12.5,
  "unique_visitors": 450,
  "categories_this_month": 8,
  "features_this_month": 24,
  "period_days": 30
}
```

---

## 🌍 Translations

### POST /translations/translate (PUBLIC)
Dịch text tự động (DeepL/Google)

```typescript
{
  "texts": ["Hồ bơi vô cực", "Nhà hàng sang trọng"],
  "target": "en",
  "source": "vi",
  "is_html": false,
  "prefer_deepl": true
}

// Response
{
  "translations": [
    "Infinity Pool",
    "Luxury Restaurant"
  ]
}
```

---

## 🎨 Cách dùng trong Frontend

### 1. Import service
```typescript
import { propertyService } from '@/services/propertyService';
import { featureService } from '@/services/featureService';
import { postService } from '@/services/postService';
```

### 2. Gọi API
```typescript
// Lấy property
const property = await propertyService.getPropertyByCode('fusion-suites-vung-tau');

// Lấy features theo category
const features = await featureService.getFeatures({ category_id: 1 });

// Lấy posts có VR360
const posts = await postService.getPosts({ 
  property_id: property.id,
  status: 'PUBLISHED' 
});

// Posts có vr360_url là các link VR360!
const vr360Posts = posts.filter(p => p.vr360_url);
```

### 3. Track analytics
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

## 💡 Lưu ý quan trọng

1. **VR360 URLs nằm trong Posts:**
   - Backend không có `/vr360` endpoint riêng
   - VR360 links được lưu trong `posts.vr360_url`
   - Mỗi feature có thể có nhiều posts, mỗi post có thể có VR360

2. **Cấu trúc dữ liệu:**
   ```
   Property (Khách sạn)
   ├── Features (Tiện ích: pool, gym, spa...)
   │   └── Posts (Bài viết)
   │       └── vr360_url (Link VR360)
   ```

3. **Authentication:**
   - api.ts tự động login + refresh token
   - Chỉ cần gọi service, không cần lo về auth

4. **Public endpoints:**
   - `/analytics/track` - tracking (no auth)
   - `/media/{media_id}/view` - xem ảnh (no auth)
   - `/translations/translate` - dịch (no auth)

---

## 📚 Tài liệu đầy đủ

Xem Swagger UI: https://travel.link360.vn/api/v1/docs
