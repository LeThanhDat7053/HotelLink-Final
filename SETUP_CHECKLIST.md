# 🏨 SETUP CHECKLIST - Khách Sạn Mới

Hướng dẫn chi tiết để deploy template này cho khách sạn mới.  
Chỉ cần thay đổi **2 files**: `.env` và `index.html`

---

## ✅ Checklist Setup

### 1. File `.env` (BẮT BUỘC)

Copy từ `.env.example` và điền thông tin:

```bash
cp .env.example .env
```

| Biến | Mô tả | Ví dụ |
|------|-------|-------|
| `VITE_API_BASE_URL` | API endpoint | `https://travel.link360.vn/api/v1` |
| `VITE_API_USERNAME` | Email đăng nhập | `admin@yourhotel.vn` |
| `VITE_API_PASSWORD` | Mật khẩu | `YourSecretPass123` |
| `VITE_TENANT_CODE` | Mã tenant | `yourhotel` |
| `VITE_PROPERTY_ID` | ID property | `16` |
| `VITE_TENANT_ID` | ID tenant | `7` |
| `VITE_SITE_BASE_URL` | Domain website | `https://yourhotel.com` |
| `VITE_APP_NAME` | Tên khách sạn | `Your Hotel Name` |
| `VITE_LOGO_MEDIA_ID` | ID logo (optional) | `185` hoặc để trống |
| `VITE_VR360_CDN_URL` | CDN cho VR360 | `https://travel.link360.vn` |

---

### 2. File `index.html` (CHO SEO)

Cập nhật các thẻ meta SEO cho khách sạn mới:

```html
<!-- Line 14: Title -->
<title>Tên Khách Sạn | Slogan ngắn gọn</title>

<!-- Line 15: Description -->
<meta name="description" content="Mô tả khách sạn 150-160 ký tự...">

<!-- Line 16: Keywords -->
<meta name="keywords" content="tên khách sạn, khách sạn địa điểm, loại khách sạn...">

<!-- Line 18: Canonical URL -->
<link rel="canonical" href="https://yourhotel.com/">

<!-- Line 22-29: Open Graph -->
<meta property="og:title" content="Tên Khách Sạn | Slogan">
<meta property="og:description" content="Mô tả khách sạn...">
<meta property="og:url" content="https://yourhotel.com/">
<meta property="og:site_name" content="Tên Khách Sạn">

<!-- Line 33-35: Twitter Card -->
<meta name="twitter:title" content="Tên Khách Sạn | Slogan">
<meta name="twitter:description" content="Mô tả khách sạn...">
```

---

## 🚀 Cách Lấy Thông Tin Từ Backend

### Property ID & Tenant Code
1. Đăng nhập Admin Panel: `https://travel.link360.vn/admin`
2. Vào **Quản lý Properties**
3. Tìm property của bạn → Copy **ID** và **Code**

### API Credentials
1. Vào **Quản lý Users**
2. Tạo user mới hoặc lấy credentials đã có
3. Copy **Email** và **Password**

### Logo Media ID (Optional)
1. Vào **Media Library**
2. Upload logo nếu chưa có
3. Copy **Media ID** từ URL hoặc chi tiết

---

## 📦 Commands

```bash
# Cài đặt dependencies
npm install --legacy-peer-deps

# Chạy development
npm run dev

# Build production
npm run build

# Inject SEO từ API (chạy sau build)
npm run inject-seo
```

---

## 🔄 Sau Khi Deploy

Script `inject-seo.js` sẽ tự động:
- Fetch SEO data từ API
- Update `dist/index.html` với meta tags đúng
- Inject favicon và og:image từ API

---

## 📁 Files Cần Thay Đổi

| File | Mục đích | Bắt buộc |
|------|----------|----------|
| `.env` | Cấu hình API, credentials | ✅ |
| `index.html` | SEO meta tags (fallback) | ✅ |

**Không cần sửa bất kỳ file code nào khác!**

---

## ❓ Troubleshooting

### Lỗi 403 Forbidden
- Kiểm tra `VITE_PROPERTY_ID` và `VITE_TENANT_CODE` đúng chưa
- Kiểm tra credentials (username/password)

### Logo không hiển thị
- Điền `VITE_LOGO_MEDIA_ID` nếu muốn logo loading screen
- Hoặc để trống, app sẽ fetch từ API settings

### CORS Error
- Đảm bảo domain được whitelist ở backend

### Env vars không load
- Restart dev server sau khi sửa `.env`
- Clear browser cache
- Đảm bảo biến bắt đầu bằng `VITE_`
