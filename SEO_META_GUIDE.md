# Hướng Dẫn Meta Tags & Social Sharing

## Tổng Quan
Đã cấu hình đầy đủ meta tags cho SEO và social sharing (Facebook, Zalo, Twitter). Khi share link, sẽ hiển thị đẹp với title, description và hình ảnh.

## Các Thành Phần Đã Thêm

### 1. **index.html** - Meta Tags Cơ Bản
📁 `index.html`

Thêm các meta tags mặc định:
- Basic SEO: title, description, keywords, author
- Open Graph: cho Facebook, Zalo
- Twitter Cards
- Mobile Web App meta tags
- Theme color

### 2. **SEOMeta Component** 
📁 `src/components/common/SEOMeta.tsx` (MỚI)

Component React Helmet để quản lý meta tags động theo từng trang.

**Props:**
```typescript
interface SEOMetaProps {
  title?: string;           // Tiêu đề trang
  description?: string;     // Mô tả (160 ký tự)
  image?: string;           // URL hình ảnh preview
  url?: string;             // URL canonical
  type?: 'website' | 'article';
  keywords?: string;        // Keywords SEO
  author?: string;          // Tác giả
}
```

**Sử dụng:**
```tsx
<SEOMeta
  title="Phòng Deluxe"
  description="Phòng nghỉ sang trọng với đầy đủ tiện nghi"
  image="https://example.com/room.jpg"
/>
```

### 3. **App.tsx** - Tích Hợp Meta Tags Động

Thêm logic tự động cập nhật meta tags theo:
- Trang hiện tại (Home, About, Rooms, Dining, etc.)
- Nội dung từ API (title, description)
- Hình ảnh từ VR360/background

**Logic:**
```tsx
// Title động theo trang
const pageTitle = getPageTitle(); // "Giới Thiệu", "Phòng Nghỉ", etc.

// Description động theo trang
const getPageDescription = () => {
  if (isAboutPage) return introContent?.shortDescription;
  if (isRoomsPage) return 'Khám phá các phòng nghỉ...';
  // ... etc
};

// Render meta tags
<SEOMeta
  title={pageTitle || propertyName}
  description={getPageDescription()}
  image={vr360Url && mediaType === 'image' ? vr360Url : undefined}
/>
```

### 4. **main.tsx** - HelmetProvider

Wrap App với `HelmetProvider` để React Helmet hoạt động:

```tsx
import { HelmetProvider } from 'react-helmet-async';

<HelmetProvider>
  <App />
</HelmetProvider>
```

## Meta Tags Chi Tiết

### Open Graph (Facebook, Zalo)
```html
<meta property="og:type" content="website" />
<meta property="og:title" content="HotelLink - Khách sạn sang trọng" />
<meta property="og:description" content="..." />
<meta property="og:image" content="https://..." />
<meta property="og:url" content="https://..." />
<meta property="og:site_name" content="HotelLink" />
<meta property="og:locale" content="vi_VN" />
```

### Twitter Cards
```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="..." />
<meta name="twitter:description" content="..." />
<meta name="twitter:image" content="..." />
```

### Zalo Specific
```html
<meta property="zalo:image" content="https://..." />
```

## Kết Quả Khi Share

### Facebook/Zalo:
- **Title**: Tên trang + "| HotelLink"
- **Description**: Mô tả ngắn (shortDescription) hoặc description mặc định
- **Image**: Ảnh VR360 background (nếu là image), hoặc ảnh mặc định

### Ví Dụ:

**Trang Giới Thiệu:**
```
Title: Giới Thiệu | HotelLink
Description: [shortDescription từ API]
Image: [Background image nếu có]
```

**Trang Phòng Nghỉ:**
```
Title: Phòng Nghỉ | HotelLink
Description: Khám phá các phòng nghỉ sang trọng với đầy đủ tiện nghi...
Image: [Room VR360 image]
```

## Kiểm Tra Meta Tags

### 1. Facebook Debugger:
https://developers.facebook.com/tools/debug/

Paste URL và click "Debug" để xem preview.

### 2. Xem Source Code:
```bash
# View page source
Ctrl + U (Chrome)

# Tìm meta tags
Ctrl + F: "og:title"
```

### 3. Browser DevTools:
```javascript
// Console
document.querySelector('meta[property="og:title"]').content
```

## Tùy Chỉnh

### Thay đổi title theo detail:
Trong các component Detail (RoomDetail, DiningDetail, etc.), có thể thêm SEOMeta:

```tsx
// RoomDetail.tsx
import { SEOMeta } from './SEOMeta';

<SEOMeta
  title={room.name}
  description={room.description.substring(0, 160)}
  image={room.primaryImage}
  type="article"
/>
```

### Thêm hình ảnh mặc định:
Đặt file `og-image.jpg` vào folder `public/`:
```
public/
  og-image.jpg  (1200x630px recommended)
```

## Lưu Ý

✅ **Description**: Nên 150-160 ký tự để không bị cắt  
✅ **Image**: Kích thước khuyến nghị 1200x630px (Facebook/OG)  
✅ **URL**: Luôn dùng absolute URL (https://...)  
✅ **Zalo**: Sử dụng Open Graph tags (og:*), Zalo tự động đọc  
✅ **Cache**: Facebook/Zalo cache link, dùng debugger để clear cache  

## Package Đã Cài

```json
{
  "dependencies": {
    "react-helmet-async": "^2.0.5"
  }
}
```

Cài với flag: `--legacy-peer-deps` (vì React 19)

---
**Build Status:** ✅ Thành công  
**Ngày cập nhật:** 19/01/2026
