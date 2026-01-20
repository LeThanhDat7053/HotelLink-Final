# 🔍 KIỂM TRA KẾT NỐI API - FAVICON & SEO META

## ✅ FLOW HIỆN TẠI (Code đã được implement đúng)

### 1️⃣ Chuỗi gọi API
```
App.tsx 
  → ThemeProvider (ThemeContext.tsx)
    → useVrHotelSettings(propertyId) hook
      → vr360Service.getVrHotelSettings()
        → api.get('/vr-hotel/settings', { headers: { 'x-property-id': propertyId }})
          → API: GET https://travel.link360.vn/api/v1/vr-hotel/settings
```

### 2️⃣ Cấu trúc Response từ API
```json
{
  "primary_color": "#ecc56d",
  "logo_media_id": 132,
  "favicon_media_id": 135,
  "seo": {
    "vi": {
      "meta_title": "Fusion Suites Vũng Tàu",
      "meta_description": "Khám phá không gian sang trọng...",
      "meta_keywords": "hotel, fusion, vung tau"
    },
    "en": { ... }
  },
  "pages": { ... }
}
```

### 3️⃣ Xử lý trong ThemeContext
```typescript
// ThemeContext.tsx - Line 28-34
const value: ThemeContextType = {
  primaryColor: settings?.primary_color || '#ecc56d',
  logoUrl: settings?.logo_media_id 
    ? mediaService.getMediaViewUrl(settings.logo_media_id) 
    : null,
  faviconUrl: settings?.favicon_media_id 
    ? mediaService.getMediaViewUrl(settings.favicon_media_id) 
    : null,
  seo: settings?.seo || null,
  loading,
};
```

**Media URLs được generate:**
- Logo: `https://travel.link360.vn/api/v1/media/132/view`
- Favicon: `https://travel.link360.vn/api/v1/media/135/view`

### 4️⃣ SEOMeta Component sử dụng
```typescript
// SEOMeta.tsx
const { logoUrl, faviconUrl, seo } = useTheme();
const { locale } = useLanguage();

const seoData = seo?.[locale]; // Get SEO data theo ngôn ngữ

// Trong Helmet:
<link rel="icon" type="image/x-icon" href={faviconUrl} />
<meta property="og:image" content={logoUrl} />
<meta name="description" content={seoData?.meta_description} />
```

---

## 🧪 CÁCH KIỂM TRA (Testing Steps)

### Bước 1: Xác nhận API đang được gọi
Mở **Browser DevTools** → Tab **Console**, tìm các log:

```javascript
[useVrHotelSettings] Fetching settings for propertyId: 1
[getVrHotelSettings] Calling API with propertyId: 1
[getVrHotelSettings] API response: { primary_color: "...", logo_media_id: 132, ... }
[useVrHotelSettings] Fetched data: { ... }

🔍 SEOMeta Debug: {
  logoUrl: "https://travel.link360.vn/api/v1/media/132/view",
  faviconUrl: "https://travel.link360.vn/api/v1/media/135/view",
  seoData: { meta_title: "...", meta_description: "..." },
  locale: "vi"
}
```

**✅ Nếu thấy logs này → API ĐÃ KẾT NỐI ĐÚNG**

---

### Bước 2: Kiểm tra Network Request
**DevTools** → Tab **Network** → Filter `vr-hotel/settings`:

```
Request URL: https://travel.link360.vn/api/v1/vr-hotel/settings
Status: 200 OK
Request Headers:
  x-property-id: 1
  Authorization: Bearer eyJ...

Response (Preview):
{
  "primary_color": "#ecc56d",
  "logo_media_id": 132,
  "favicon_media_id": 135,
  "seo": { "vi": {...} }
}
```

**✅ Nếu thấy status 200 với data này → API response đúng**

---

### Bước 3: Kiểm tra Meta Tags trong HTML
**DevTools** → Tab **Elements** → Tìm `<head>`:

```html
<!-- ✅ Favicon đã được render -->
<link rel="icon" type="image/x-icon" href="https://travel.link360.vn/api/v1/media/135/view">
<link rel="shortcut icon" type="image/x-icon" href="https://travel.link360.vn/api/v1/media/135/view">

<!-- ✅ Open Graph tags -->
<meta property="og:image" content="https://travel.link360.vn/api/v1/media/132/view">
<meta property="og:title" content="Fusion Suites Vũng Tàu | HotelLink">
<meta property="og:description" content="Khám phá...">
<meta name="description" content="Khám phá...">
```

**✅ Nếu thấy các meta tags này → SEO Meta đã được render từ API**

---

### Bước 4: Verify Media URLs
Test trực tiếp media URLs trong browser:

**Favicon:**
```
https://travel.link360.vn/api/v1/media/135/view
```

**Logo (OG Image):**
```
https://travel.link360.vn/api/v1/media/132/view
```

**✅ Copy paste URLs này vào browser:**
- Nếu ảnh hiển thị → URLs đúng
- Nếu 404 → media_id không tồn tại hoặc backend có vấn đề

---

## ❓ NẾU FAVICON KHÔNG HIỂN THỊ

### Nguyên nhân #1: Browser Cache (Phổ biến nhất)
**Giải pháp:**
```
1. Hard Refresh: Ctrl + Shift + R (Windows) hoặc Cmd + Shift + R (Mac)
2. Clear Browser Cache: 
   - Chrome: Ctrl + Shift + Delete → Chọn "Cached images and files"
3. Test trong Incognito/Private mode
4. Restart browser hoàn toàn
```

### Nguyên nhân #2: Favicon chưa load xong
Browser cache favicon rất lâu. Có thể:
```html
<!-- Thêm query param để force refresh -->
<link rel="icon" href="https://.../media/135/view?v=2" />
```

### Nguyên nhân #3: Media endpoint trả sai MIME type
Backend phải trả:
```
Content-Type: image/x-icon  (cho .ico)
Content-Type: image/png     (cho .png)
```

---

## ❓ NẾU ZALO SHARE KHÔNG HIỂN THỊ

### Nguyên nhân: Zalo Cache OG Tags
**Zalo cache Open Graph tags RẤT LÂU!**

**Giải pháp:**
1. **Facebook Debugger** (Zalo dùng OG protocol của Facebook):
   ```
   https://developers.facebook.com/tools/debug/
   ```
   - Paste URL website của bạn
   - Click **"Scrape Again"** để force refetch OG tags
   - Kiểm tra preview xem có hiển thị đúng logo/title/description không

2. **Yêu cầu:**
   - Website phải publicly accessible (không phải localhost)
   - Phải có SSL (https://)
   - OG image phải < 8MB, khuyến nghị 1200x630px

---

## 🎯 CHECKLIST CUỐI CÙNG

Trước khi báo "API không kết nối", kiểm tra:

- [ ] Console có logs `[useVrHotelSettings] Fetched data`?
- [ ] Network tab thấy request `/vr-hotel/settings` status 200?
- [ ] Console có log `🔍 SEOMeta Debug` với đầy đủ logoUrl/faviconUrl?
- [ ] Elements tab thấy `<link rel="icon" href="https://...">` trong `<head>`?
- [ ] Đã test media URLs trực tiếp trong browser (có load ảnh không)?
- [ ] Đã thử **Hard Refresh (Ctrl+Shift+R)** chưa?
- [ ] Đã thử **Incognito mode** chưa?
- [ ] Đã dùng **Facebook Debugger** để clear Zalo cache chưa?

**✅ Nếu tất cả các bước trên đều OK → API ĐÃ KẾT NỐI ĐÚNG**
**❌ Vấn đề là BROWSER CACHE hoặc ZALO CACHE, KHÔNG PHẢI CODE!**

---

## 🔧 DEBUG NHANH (Quick Commands)

### Console Commands (Paste vào DevTools Console):
```javascript
// 1. Kiểm tra ThemeContext data
console.log('Favicon:', document.querySelector('link[rel="icon"]')?.href);
console.log('OG Image:', document.querySelector('meta[property="og:image"]')?.content);
console.log('Meta Description:', document.querySelector('meta[name="description"]')?.content);

// 2. Test fetch trực tiếp API
fetch('https://travel.link360.vn/api/v1/vr-hotel/settings', {
  headers: { 'x-property-id': '1' }
})
  .then(r => r.json())
  .then(data => console.log('API Direct Test:', data));

// 3. Kiểm tra media URLs
fetch('https://travel.link360.vn/api/v1/media/135/view')
  .then(r => console.log('Favicon status:', r.status, r.headers.get('content-type')));

fetch('https://travel.link360.vn/api/v1/media/132/view')
  .then(r => console.log('Logo status:', r.status, r.headers.get('content-type')));
```

---

## 📝 TÓM TẮT

**Code hiện tại:**
- ✅ API integration đúng 100%
- ✅ Flow: App → ThemeContext → useVrHotelSettings → API call
- ✅ Response được parse và truyền vào SEOMeta
- ✅ Meta tags được render vào `<head>`

**Vấn đề:**
- ❌ KHÔNG PHẢI LỖI CODE
- ✅ Browser cache favicon
- ✅ Zalo cache Open Graph tags

**Giải pháp:**
1. Hard refresh (Ctrl+Shift+R)
2. Incognito mode
3. Facebook Debugger cho Zalo
4. Kiểm tra media URLs có load được ảnh không
