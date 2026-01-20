# Test Social Sharing - Cách Test Đúng

## ⚠️ QUAN TRỌNG
Social crawlers (Facebook, Twitter, Zalo) KHÔNG CHẠY JAVASCRIPT!
→ Không thể dùng React + API để tạo meta tags cho crawlers.

## 🧪 Cách Test

### 1. Test Meta Tags Trong Browser (✅ Sẽ hoạt động)
```bash
# Mở DevTools → Console → gõ:
document.querySelectorAll('meta[property^="og:"]')
```
→ Sau vài giây (khi API trả về) sẽ thấy meta tags

### 2. Test Social Sharing THỰC TẾ (❌ Sẽ TRỐNG)

**Facebook Debugger:**
1. Vào: https://developers.facebook.com/tools/debug/
2. Paste: `https://hotellink.trip360.vn/?=9`
3. Click "Fetch new information"
4. → Sẽ thấy: **KHÔNG CÓ** og:image, og:title, og:description

**Tại sao?** Vì Facebook crawler chỉ fetch HTML, không chạy React!

---

## ✅ Giải Pháp Duy Nhất

### Option A: Backend FastAPI Trả HTML Động (Khuyên Dùng)
Backend phải:
1. Đọc headers `X-Property-Id` từ query param `?=9` → property_id = 9
2. Gọi `/api/v1/vr-hotel/settings` với property_id
3. Render HTML với meta tags sẵn:
```html
<meta property="og:title" content="Khách Sạn Cao Cấp..." />
<meta property="og:image" content="https://travel.link360.vn/api/v1/media/132/view" />
```

**Ví dụ FastAPI:**
```python
from fastapi import Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates

templates = Jinja2Templates(directory="templates")

@app.get("/{path:path}", response_class=HTMLResponse)
async def serve_spa(request: Request, path: str):
    # Lấy property_id từ query
    property_id = request.query_params.get("", None)  # ?=9
    
    # Default meta tags
    meta = {
        "title": "HotelLink",
        "description": "",
        "image": ""
    }
    
    # Nếu có property_id → fetch settings
    if property_id:
        settings = await get_vr_hotel_settings(property_id)
        meta = {
            "title": settings["seo"]["vi"]["meta_title"],
            "description": settings["seo"]["vi"]["meta_description"],
            "image": f"https://travel.link360.vn/api/v1/media/{settings['logo_media_id']}/view"
        }
    
    # Render HTML với meta tags
    return templates.TemplateResponse("index.html", {
        "request": request,
        "meta": meta
    })
```

**Template `index.html`:**
```html
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <!-- Meta tags từ backend -->
  <title>{{ meta.title }}</title>
  <meta property="og:title" content="{{ meta.title }}" />
  <meta property="og:description" content="{{ meta.description }}" />
  <meta property="og:image" content="{{ meta.image }}" />
  
  <script type="module" src="/src/main.tsx"></script>
</head>
<body>
  <div id="root"></div>
</body>
</html>
```

### Option B: Prerender Service
Dùng service như:
- https://prerender.io
- https://rendertron.io
- Self-hosted prerender-spa

### Option C: Static Site Generation (SSG)
Chuyển sang Next.js/Remix với SSG cho từng property.

---

## 🚫 KHÔNG THỂ FIX CHỈ BẰNG FRONTEND

❌ Không có cách nào làm React "chạy nhanh hơn" để crawlers thấy
❌ API đã nhanh rồi nhưng crawlers không đợi API
❌ Prefetch/Preconnect không giúp được vì crawlers không chạy JS

✅ Phải có server trả HTML với meta tags sẵn
