# Checklist: Kiểm tra API connection cho Favicon & SEO Meta

## Vấn đề hiện tại
- ❌ Favicon vẫn hiển thị default (chưa đổi)
- ❌ Share link vẫn hiển thị hard code cũ

## Nguyên nhân có thể
1. **API chưa được gọi** - useVrHotelSettings không fetch được data
2. **API trả về nhưng media ID không đúng** - logo_media_id/favicon_media_id sai
3. **Browser cache** - Favicon bị cache cứng
4. **Media URL không đúng** - mediaService.getMediaViewUrl() tạo sai URL

---

## BƯỚC 1: Kiểm tra API có được gọi không

### Mở DevTools Console (F12)

Refresh trang và xem logs:

```
[useVrHotelSettings] Fetching settings for propertyId: 10
[getVrHotelSettings] Calling API with propertyId: 10
[getVrHotelSettings] API response: { primary_color: ..., logo_media_id: 132, favicon_media_id: 134 }
[useVrHotelSettings] Fetched data: { ... }
```

✅ **Nếu THẤY logs trên** → API OK, đi sang BƯỚC 2  
❌ **Nếu KHÔNG THẤY logs** → API chưa được gọi, đi sang BƯỚC 1.1

### BƯỚC 1.1: Kiểm tra PropertyContext

Check xem `property.id` có giá trị không:

```tsx
// Trong ThemeContext.tsx
const { property } = usePropertyContext();
console.log('🔍 PropertyContext:', property); // Xem property có dữ liệu không
```

Nếu `property` là `null` hoặc `property.id` không có → PropertyContext chưa load

---

## BƯỚC 2: Kiểm tra SEOMeta nhận được data chưa

### Xem Console logs trong SEOMeta component

Tìm log:
```
🔍 SEOMeta Debug: {
  logoUrl: "https://travel.link360.vn/api/v1/media/132/view",
  faviconUrl: "https://travel.link360.vn/api/v1/media/134/view",
  seoData: { meta_title: "...", ... },
  locale: "vi",
  fullSeoObject: { vi: {...} }
}
```

✅ **Nếu logoUrl & faviconUrl có giá trị** → Data OK, đi sang BƯỚC 3  
❌ **Nếu logoUrl/faviconUrl là NULL** → ThemeContext chưa trả về đúng

---

## BƯỚC 3: Test Media URLs trực tiếp

### Copy URL từ console và paste vào browser

Ví dụ:
```
https://travel.link360.vn/api/v1/media/132/view  (logo)
https://travel.link360.vn/api/v1/media/134/view  (favicon)
```

✅ **Nếu ảnh load được** → Media service OK, đi sang BƯỚC 4  
❌ **Nếu 404/500** → Backend media endpoint có vấn đề

---

## BƯỚC 4: Clear Browser Cache cho Favicon

### Favicon rất hay bị cache cứng!

**Cách 1: Hard Refresh**
- Windows: `Ctrl + Shift + R` hoặc `Ctrl + F5`
- Mac: `Cmd + Shift + R`

**Cách 2: Clear Site Data**
- F12 → Application → Storage → Clear site data

**Cách 3: Force reload bằng timestamp**
Thêm query param vào favicon URL:
```tsx
<link rel="icon" href={`${faviconUrl}?v=${Date.now()}`} />
```

---

## BƯỚC 5: Kiểm tra HTML output

### View page source (Ctrl+U)

Xem `<head>` section có đúng không:

```html
<link rel="icon" type="image/x-icon" href="https://travel.link360.vn/api/v1/media/134/view" />
<meta property="og:image" content="https://travel.link360.vn/api/v1/media/132/view" />
<meta property="og:title" content="Khách Sạn Cao Cấp - Trải Nghiệm..." />
```

✅ **Nếu ĐÚNG** → HTML OK, vấn đề là cache  
❌ **Nếu SAI hoặc RỖNG** → SEOMeta component chưa render đúng

---

## BƯỚC 6: Test sharing (Facebook Debugger)

### Open Graph Debugger Tool
https://developers.facebook.com/tools/debug/

Nhập URL website và xem:
- Image có đúng không?
- Title/description có đúng không?

**Lưu ý:** Facebook cũng cache OG meta, cần bấm "Scrape Again"

---

## Solution nhanh nếu vẫn không được

### Thêm cache buster cho favicon

Sửa [SEOMeta.tsx](c:\\Users\\datth\\Downloads\\fontend-hotellink\\src\\components\\common\\SEOMeta.tsx) line 44:

```tsx
{faviconUrl && (
  <>
    <link rel="icon" type="image/x-icon" href={`${faviconUrl}?v=${Date.now()}`} />
    <link rel="shortcut icon" type="image/x-icon" href={`${faviconUrl}?v=${Date.now()}`} />
    <link rel="apple-touch-icon" href={`${faviconUrl}?v=${Date.now()}`} />
  </>
)}
```

### Thêm debug component tạm thời

Tạo file debug để xem toàn bộ data flow:

```tsx
// src/components/APIDebug.tsx
export const APIDebug = () => {
  const { property } = usePropertyContext();
  const { settings, loading } = useVrHotelSettings(property?.id || null);
  const { logoUrl, faviconUrl, seo } = useTheme();

  return (
    <div style={{ position: 'fixed', bottom: 0, left: 0, background: 'white', padding: 20, zIndex: 9999 }}>
      <h3>🔍 API Debug Panel</h3>
      <pre>{JSON.stringify({ property, settings, logoUrl, faviconUrl, seo }, null, 2)}</pre>
    </div>
  );
};
```

---

## Expected API Response (từ settings.md)

```json
{
  "primary_color": "#ecc56d",
  "logo_media_id": 132,
  "favicon_media_id": 134,
  "seo": {
    "vi": {
      "meta_title": "Khách Sạn Cao Cấp - Trải Nghiệm Lưu Trú Đẳng Cấp 5 Sao",
      "meta_description": "Khám phá không gian nghỉ dưỡng...",
      "meta_keywords": "khách sạn, hotel, phòng nghỉ..."
    }
  },
  "pages": { ... }
}
```

---

## Action Items

- [ ] Mở DevTools Console và kiểm tra logs `[useVrHotelSettings]`
- [ ] Xem log `🔍 SEOMeta Debug` có data không
- [ ] Test media URLs trực tiếp trong browser
- [ ] Hard refresh (Ctrl+Shift+R) để clear cache
- [ ] View page source kiểm tra HTML output
- [ ] Nếu vẫn không được → báo lại kết quả từng bước để debug tiếp
