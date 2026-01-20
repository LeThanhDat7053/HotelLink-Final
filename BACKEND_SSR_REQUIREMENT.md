# Yêu cầu Backend: Server-Side Rendering cho Social Sharing

## Vấn đề hiện tại
- Frontend React là SPA (Single Page App) → chỉ có HTML rỗng ban đầu
- Social crawlers (Facebook, Twitter, Zalo) **KHÔNG CHẠY JavaScript**
- Crawlers fetch HTML → thấy rỗng → không có title/description/image

## Giải pháp: Backend FastAPI trả HTML động

### 1. Detect Social Crawlers
Backend check User-Agent header:

```python
CRAWLER_USER_AGENTS = [
    'facebookexternalhit',
    'Twitterbot',
    'LinkedInBot',
    'Slackbot',
    'WhatsApp',
    'TelegramBot',
    'ZaloBot',
    'ia_archiver',
]

def is_crawler(user_agent: str) -> bool:
    return any(bot in user_agent for bot in CRAWLER_USER_AGENTS)
```

### 2. Endpoint trả HTML động
Khi detect crawler → trả HTML với meta tags đầy đủ:

```python
from fastapi import Request
from fastapi.responses import HTMLResponse
import os

@app.get("/{path:path}", response_class=HTMLResponse)
async def serve_spa(request: Request, path: str):
    user_agent = request.headers.get("user-agent", "")
    
    # Nếu là crawler → generate HTML động
    if is_crawler(user_agent):
        property_id = request.query_params.get("property_id")
        
        # Fetch SEO data từ database
        seo_data = await get_property_seo(property_id)
        
        html = f"""<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- Dynamic Meta Tags -->
    <title>{seo_data.meta_title} | HotelLink</title>
    <meta name="description" content="{seo_data.meta_description}">
    
    <!-- Open Graph -->
    <meta property="og:title" content="{seo_data.meta_title}">
    <meta property="og:description" content="{seo_data.meta_description}">
    <meta property="og:image" content="{seo_data.logo_url}">
    <meta property="og:url" content="{request.url}">
    <meta property="og:type" content="website">
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{seo_data.meta_title}">
    <meta name="twitter:description" content="{seo_data.meta_description}">
    <meta name="twitter:image" content="{seo_data.logo_url}">
    
    <!-- Favicon -->
    <link rel="icon" href="{seo_data.favicon_url}">
</head>
<body>
    <div id="root"></div>
    <script type="module" src="/assets/index.js"></script>
</body>
</html>"""
        return HTMLResponse(content=html)
    
    # Nếu là user thường → trả file index.html
    with open("dist/index.html", "r", encoding="utf-8") as f:
        return HTMLResponse(content=f.read())
```

### 3. Cấu trúc API cần có
Backend cần endpoint để lấy SEO data theo property:

```python
GET /api/v1/properties/{property_id}/seo
Headers:
  X-Tenant-Code: fusion
  X-Property-Id: 10

Response:
{
  "meta_title": "Khách sạn ABC - Địa điểm nghỉ dưỡng sang trọng",
  "meta_description": "Khám phá không gian nghỉ dưỡng...",
  "meta_keywords": "khách sạn, resort, nghỉ dưỡng",
  "logo_url": "https://travel.link360.vn/api/v1/media/132/view",
  "favicon_url": "https://travel.link360.vn/api/v1/media/135/view"
}
```

### 4. Deploy
- Backend phải serve cả static files (dist folder của frontend)
- Hoặc dùng nginx reverse proxy:
  - Detect crawler → forward to FastAPI
  - User thường → serve static files

## Test
```bash
# Test với Facebook crawler
curl -A "facebookexternalhit/1.1" https://hotellink.trip360.vn/?property_id=10

# Phải trả về HTML với meta tags đầy đủ
```

## Alternatives nếu không sửa backend

### Option A: Prerender.io (Service trả phí)
- Middleware detect crawler → forward to Prerender
- Prerender chạy browser headless → render HTML → cache
- Trả về HTML đã render cho crawler

### Option B: Static Pre-rendering (Không linh hoạt)
- Build thời điểm deploy → generate HTML tĩnh
- Không cập nhật real-time khi data thay đổi

### Option C: Meta tags mặc định trong index.html (Workaround tạm thời)
- Thêm meta tags generic vào index.html
- React Helmet override khi user truy cập
- Crawlers vẫn thấy meta tags mặc định
- **NHƯỢC ĐIỂM:** Không đúng với từng property, luôn hiển thị 1 title/image cố định
