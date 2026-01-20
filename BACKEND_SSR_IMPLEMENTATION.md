# Backend FastAPI - Server-Side Rendering cho Social Sharing
## 🎯 Mục tiêu
Backend FastAPI trả HTML động với meta tags sẵn → Crawlers thấy ngay → Share link hoạt động → Không cần build lại khi đổi data!

---

## 📋 BƯỚC 1: Cài đặt dependencies

```bash
pip install jinja2
```

---

## 📋 BƯỚC 2: Tạo HTML template

Tạo folder `templates/` trong backend:

```bash
backend/
  templates/
    index.html     # ← Tạo file này
  main.py
```

**File `templates/index.html`:**
```html
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- Dynamic SEO Meta Tags -->
    <title>{{ meta.title }}</title>
    <meta name="description" content="{{ meta.description }}">
    {% if meta.keywords %}
    <meta name="keywords" content="{{ meta.keywords }}">
    {% endif %}
    
    <!-- Open Graph (Facebook, Zalo) -->
    <meta property="og:type" content="website">
    <meta property="og:title" content="{{ meta.title }}">
    <meta property="og:description" content="{{ meta.description }}">
    <meta property="og:url" content="{{ meta.url }}">
    <meta property="og:image" content="{{ meta.image }}">
    <meta property="og:image:secure_url" content="{{ meta.image }}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:site_name" content="HotelLink">
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{{ meta.title }}">
    <meta name="twitter:description" content="{{ meta.description }}">
    <meta name="twitter:image" content="{{ meta.image }}">
    
    <!-- Favicon -->
    <link rel="icon" href="{{ meta.favicon }}">
    <link rel="shortcut icon" href="{{ meta.favicon }}">
    <link rel="apple-touch-icon" href="{{ meta.favicon }}">
    
    <!-- Frontend Assets -->
    <script type="module" crossorigin src="/assets/index-{{ hash }}.js"></script>
    <link rel="stylesheet" crossorigin href="/assets/index-{{ hash }}.css">
</head>
<body>
    <div id="root"></div>
</body>
</html>
```

---

## 📋 BƯỚC 3: Backend Code (FastAPI)

**File `main.py`:**

```python
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import httpx
import os
from typing import Optional

app = FastAPI()

# Mount static files (frontend build)
app.mount("/assets", StaticFiles(directory="dist/assets"), name="assets")

# Templates
templates = Jinja2Templates(directory="templates")

# Config
API_BASE_URL = "https://travel.link360.vn/api/v1"
MEDIA_BASE_URL = f"{API_BASE_URL}/media"
TENANT_CODE = "fusion"

# Crawlers User-Agent list
CRAWLER_AGENTS = [
    'facebookexternalhit',
    'Facebot',
    'Twitterbot',
    'LinkedInBot',
    'Slackbot',
    'WhatsApp',
    'TelegramBot',
    'Discordbot',
    'ia_archiver',
    'ZaloBot',
]

def is_crawler(user_agent: str) -> bool:
    """Detect if request is from social crawler"""
    return any(bot.lower() in user_agent.lower() for bot in CRAWLER_AGENTS)

def extract_property_id(request: Request) -> Optional[str]:
    """
    Extract property_id from:
    1. Query param: ?property_id=10 OR ?=10
    2. Subdomain: property10.hotellink.vn
    3. Default: 10
    """
    # Method 1: Query param
    property_id = request.query_params.get("property_id")
    if property_id:
        return property_id
    
    # Method 2: Short query ?=10
    property_id = request.query_params.get("")
    if property_id:
        return property_id
    
    # Method 3: Subdomain (nếu dùng)
    host = request.headers.get("host", "")
    if "property" in host:
        # property10.hotellink.vn → 10
        property_id = host.split("property")[1].split(".")[0]
        return property_id
    
    # Default
    return "10"

async def fetch_seo_data(property_id: str) -> dict:
    """Fetch SEO settings from VR Hotel API"""
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(
                f"{API_BASE_URL}/vr-hotel/settings",
                headers={
                    "Accept": "application/json",
                    "X-Tenant-Code": TENANT_CODE,
                    "X-Property-Id": property_id,
                },
                timeout=5.0
            )
            
            if response.status_code == 200:
                data = response.json()
                seo_vi = data.get("seo", {}).get("vi", {})
                
                return {
                    "title": seo_vi.get("meta_title", "HotelLink"),
                    "description": seo_vi.get("meta_description", ""),
                    "keywords": seo_vi.get("meta_keywords", ""),
                    "image": f"{MEDIA_BASE_URL}/{data.get('logo_media_id', 132)}/view",
                    "favicon": f"{MEDIA_BASE_URL}/{data.get('favicon_media_id', 135)}/view",
                }
        except Exception as e:
            print(f"Error fetching SEO data: {e}")
    
    # Fallback data
    return {
        "title": "HotelLink - Khám phá không gian nghỉ dưỡng",
        "description": "Trải nghiệm du lịch và nghỉ dưỡng đẳng cấp",
        "keywords": "khách sạn, hotel, resort",
        "image": f"{MEDIA_BASE_URL}/132/view",
        "favicon": f"{MEDIA_BASE_URL}/135/view",
    }

@app.get("/{full_path:path}", response_class=HTMLResponse)
async def serve_spa(request: Request, full_path: str):
    """
    Serve SPA with dynamic meta tags for crawlers
    """
    user_agent = request.headers.get("user-agent", "")
    
    # Extract property_id
    property_id = extract_property_id(request)
    
    # Fetch SEO data (luôn fetch để có data mới nhất)
    seo = await fetch_seo_data(property_id)
    seo["url"] = str(request.url)
    
    # Get build hash (từ dist/assets/index-*.js)
    hash_value = get_build_hash()
    
    # Render với Jinja2
    return templates.TemplateResponse("index.html", {
        "request": request,
        "meta": seo,
        "hash": hash_value,
    })

def get_build_hash() -> str:
    """Get hash from built JS file"""
    assets_dir = "dist/assets"
    if os.path.exists(assets_dir):
        for filename in os.listdir(assets_dir):
            if filename.startswith("index-") and filename.endswith(".js"):
                # index-BzR3kLQp.js → BzR3kLQp
                return filename.replace("index-", "").replace(".js", "")
    return "latest"

# Health check
@app.get("/api/health")
async def health():
    return {"status": "ok"}
```

---

## 📋 BƯỚC 4: Deploy

### Option A: FastAPI serve toàn bộ
```bash
# Build frontend
cd frontend
npm run build

# Copy dist/ vào backend
cp -r dist ../backend/

# Run backend
cd ../backend
uvicorn main:app --host 0.0.0.0 --port 8000
```

### Option B: Nginx reverse proxy
```nginx
server {
    listen 80;
    server_name hotellink.trip360.vn;

    location / {
        # Detect crawlers
        if ($http_user_agent ~* "facebookexternalhit|Twitterbot|LinkedInBot") {
            proxy_pass http://localhost:8000;
            break;
        }
        
        # Normal users → static files
        root /var/www/hotellink/dist;
        try_files $uri $uri/ /index.html;
    }
    
    location /api/ {
        proxy_pass http://localhost:8000;
    }
}
```

---

## 🧪 BƯỚC 5: Test

### Test crawlers:
```bash
# Test với Facebook crawler
curl -A "facebookexternalhit/1.1" http://localhost:8000/?property_id=10

# Phải thấy HTML với meta tags đầy đủ:
# <meta property="og:title" content="Khách Sạn Cao Cấp..." />
```

### Test Facebook Sharing Debugger:
1. Vào: https://developers.facebook.com/tools/debug/
2. Paste URL production
3. Click "Scrape Again"
4. → Phải thấy preview đúng!

---

## ✅ Kết quả

- ✅ Admin đổi SEO settings → Áp dụng NGAY (không cần build frontend)
- ✅ Crawlers thấy meta tags ngay lập tức
- ✅ Users thường vẫn dùng React SPA bình thường
- ✅ Share link lên Facebook/Zalo/Twitter → Preview đúng!

---

## 📝 Checklist Backend Dev

```
[ ] Cài Jinja2: pip install jinja2
[ ] Tạo templates/index.html
[ ] Copy dist/ folder từ frontend build
[ ] Implement serve_spa() với crawler detection
[ ] Implement fetch_seo_data() gọi /vr-hotel/settings
[ ] Test với curl -A "facebookexternalhit/1.1"
[ ] Deploy backend serve static files hoặc dùng Nginx
[ ] Test Facebook Sharing Debugger
```
