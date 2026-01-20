# 🔍 Hướng Dẫn Debug SEO & Favicon

## ✅ Đã Làm Gì:

### 1. **Thêm SEO Debug Panel**
   - Component hiển thị ở góc phải màn hình (chỉ trong dev mode)
   - Kiểm tra:
     - ✅ Favicon URL từ API
     - ✅ Logo URL (dùng cho OG image)
     - ✅ SEO data (title, description, keywords)
     - ✅ Raw API data

### 2. **Cải Thiện OG Meta Tags**
   - Thêm `og:image:secure_url`
   - Thêm `og:image:width` và `og:image:height`
   - Thêm `og:image:alt`
   - Thêm `twitter:image:alt`

---

## 🚀 Cách Test:

### 1. **Chạy Dev Server:**
```bash
npm run dev
```

### 2. **Mở Browser:**
- Vào http://localhost:5173
- **Góc phải màn hình** sẽ thấy **SEO Debug Panel**

### 3. **Kiểm Tra Debug Panel:**

#### ✅ Nếu thấy:
```
✅ Có URL
https://travel.link360.vn/media/134/view
[Favicon preview image]
```
→ **API đã kết nối đúng!**

#### ❌ Nếu thấy:
```
❌ Không có favicon URL
```
→ **API chưa trả dữ liệu** hoặc **property ID sai**

---

## 🔧 Nếu Vẫn Không Thấy Data:

### Bước 1: Check Property ID
```typescript
// Trong console browser (F12)
// Kiểm tra property đang dùng
localStorage.getItem('selectedPropertyId')
```

### Bước 2: Check API Request
1. Mở **DevTools** (F12)
2. Tab **Network**
3. Filter: `vr-hotel/settings`
4. Xem request có gọi đúng không:
   ```
   Headers:
   - x-tenant-code: fusion
   - x-property-id: 10
   ```

### Bước 3: Check Response
Response phải có:
```json
{
  "primary_color": "#ecc56d",
  "logo_media_id": 132,
  "favicon_media_id": 134,
  "seo": {
    "vi": {
      "meta_title": "...",
      "meta_description": "...",
      "meta_keywords": "..."
    }
  }
}
```

---

## 📱 Test Favicon:

### 1. **Trong Browser Tab:**
   - Xem icon trên tab có hiển thị không
   - **Hard refresh**: Ctrl+Shift+R (Windows) hoặc Cmd+Shift+R (Mac)
   - Hoặc mở **Incognito mode**

### 2. **Nếu Vẫn Không Thấy:**
   - Clear browser cache
   - Check URL trong debug panel
   - Mở URL trực tiếp: `https://travel.link360.vn/media/134/view`
   - Nếu lỗi 404 → file không tồn tại trong database

---

## 📲 Test Share Lên Zalo:

### 1. **Chuẩn Bị:**
   - Website phải **public** (không phải localhost)
   - Deploy lên server test hoặc production

### 2. **Test Share:**
   - Copy link website
   - Share vào Zalo
   - Xem preview có hiển thị:
     - ✅ Tiêu đề
     - ✅ Mô tả
     - ✅ Ảnh

### 3. **Nếu Không Hiển thị Đúng:**

#### a) Clear Zalo Cache:
Dùng **Facebook Debugger**:
1. Vào: https://developers.facebook.com/tools/debug/
2. Nhập URL website
3. Click **"Scrape Again"**
4. Zalo sẽ refresh cache sau đó

#### b) Check OG Image:
- Logo có đủ lớn không? (tối thiểu 200x200px)
- Khuyến nghị: 1200x630px
- Backend nên thêm field `og_image_media_id` riêng

---

## 🐛 Common Issues:

### Issue 1: "API trả về nhưng meta tags không đổi"
**Nguyên nhân:** Browser cache hoặc Zalo cache

**Fix:**
- Hard refresh (Ctrl+Shift+R)
- Clear cache
- Dùng Incognito
- Dùng FB Debugger để clear Zalo cache

---

### Issue 2: "Favicon không hiển thị"
**Nguyên nhân:** 
- URL media không public
- File không tồn tại (404)
- Browser cache

**Fix:**
1. Check URL trong debug panel
2. Mở URL trực tiếp trong browser
3. Nếu lỗi → check backend media service
4. Hard refresh browser

---

### Issue 3: "Share lên Zalo không có ảnh"
**Nguyên nhân:**
- Logo quá nhỏ (< 200px)
- Zalo cache cũ
- OG image không đúng format

**Fix:**
1. Check logo size trong debug panel
2. Dùng FB Debugger clear cache
3. Nếu logo nhỏ → upload ảnh lớn hơn (1200x630px)
4. Backend nên thêm `og_image_media_id` riêng

---

## 📊 Debug Panel Features:

Khi chạy dev mode, bạn sẽ thấy:

```
🔍 SEO Debug Panel
─────────────────────────

Favicon: ✅ Có URL
[Preview Image]
https://travel.link360.vn/media/134/view

Logo (OG Image): ✅ Có URL
[Preview Image]  
https://travel.link360.vn/media/132/view

SEO Data (locale: vi):
Title: ✅ Khách Sạn Cao Cấp - Trải Nghiệm...
Description: ✅ Khám phá không gian nghỉ dưỡng...
Keywords: ✅ khách sạn, hotel, phòng nghỉ...

Raw API Data:
{ ... }
```

---

## 💡 Tips:

1. **Luôn check Debug Panel trước** - Nó sẽ cho biết API có trả data không
2. **Hard refresh** khi test favicon
3. **Dùng FB Debugger** để test OG tags
4. **Logo nên lớn** - tối thiểu 600x315px cho Zalo/Facebook
5. **Deploy để test share** - localhost không share được lên Zalo

---

## 🎯 Next Steps Nếu Logo Quá Nhỏ:

Backend nên thêm field `og_image_media_id` riêng vào API:

```json
{
  "logo_media_id": 132,        // Logo nhỏ (cho header)
  "favicon_media_id": 134,     // Icon 32x32
  "og_image_media_id": 999,    // ← THÊM NÀY (1200x630px)
  "seo": { ... }
}
```

Frontend đã sẵn sàng nhận field này!
