# Hướng dẫn thêm ảnh OG Image

## Để có ảnh đẹp khi share link:

### 1. Tạo ảnh OG Image:
- **Kích thước khuyến nghị**: 1200x630px
- **Format**: JPG hoặc PNG
- **Nội dung**: Logo khách sạn + slogan + hình ảnh đại diện

### 2. Đặt ảnh vào folder public:
```
public/
  og-image.jpg    <- Đặt ảnh vào đây
```

### 3. Hoặc dùng link từ backend:
Nếu backend có API trả về ảnh khách sạn, sẽ tự động dùng ảnh đó.

### 4. Test:
- Share link trên Zalo/Facebook
- Hoặc dùng: https://developers.facebook.com/tools/debug/

---

**Hiện tại**: Nếu không có ảnh, sẽ dùng VR360 background image (nếu là ảnh)
