# Booking URL Pre-filled Message Feature

## ✨ Tính năng

Khi user click nút "Đặt phòng" / "Đặt ngay", hệ thống sẽ:

### 🔵 **Facebook Messenger**
- Convert `m.me/PAGE_ID` → `https://www.facebook.com/messages/t/PAGE_ID?text=MESSAGE`
- Tin nhắn được soạn sẵn trong khung chat: **"Tôi muốn đặt [TÊN PHÒNG/DỊCH VỤ]"**
- Hỗ trợ 20 ngôn ngữ

### 🟢 **Zalo**
- Detect URL: `zalo.me/PHONE` hoặc `chat.zalo.me/`
- **Copy tin nhắn vào clipboard** tự động
- Hiển thị notification: **"Tin nhắn đã được sao chép! Hãy dán vào Zalo"**
- User chỉ cần paste (Ctrl+V) vào Zalo

---

## 📁 Files Changed

### 1. **bookingHelper.ts** - Core logic
```typescript
// Detect Messenger/Zalo URLs
isMessengerUrl(url: string): boolean
isZaloUrl(url: string): boolean

// Create booking message
createBookingMessage(itemName: string, wantToBookText: string): string

// Copy to clipboard
copyToClipboard(text: string): Promise<boolean>

// Get URL with pre-filled message (Messenger only)
getBookingUrlWithMessage(url, itemName, wantToBookText): string
```

**Messenger Example:**
```
Input:  m.me/632907089911332
Output: https://www.facebook.com/messages/t/632907089911332?text=T%C3%B4i%20mu%E1%BB%91n%20%C4%91%E1%BA%B7t%20PH%C3%92NG%20SUPERIOR
```

**Zalo Example:**
```
Input:  zalo.me/0123456789
Action: Copy "Tôi muốn đặt PHÒNG SUPERIOR" to clipboard
        Show notification "Tin nhắn đã được sao chép!"
Output: zalo.me/0123456789 (original URL)
```

---

### 2. **translations.ts** - Added `messageCopied`

```typescript
messageCopied: string;  // "Tin nhắn đã được sao chép! Hãy dán vào Zalo"
```

**20 ngôn ngữ:**
- ✅ vi: "Tin nhắn đã được sao chép! Hãy dán vào Zalo"
- ✅ en: "Message copied! Please paste it in Zalo"
- ✅ ar: "تم نسخ الرسالة! الرجاء لصقها في زالو"
- ✅ de: "Nachricht kopiert! Bitte in Zalo einfügen"
- ✅ es: "¡Mensaje copiado! Por favor, pégalo en Zalo"
- ✅ fr: "Message copié ! Veuillez le coller dans Zalo"
- ✅ hi: "संदेश कॉपी किया गया! कृपया इसे ज़ालो में पेस्ट करें"
- ✅ id: "Pesan telah disalin! Silakan tempel di Zalo"
- ✅ it: "Messaggio copiato! Incollalo in Zalo"
- ✅ ja: "メッセージがコピーされました！Zaloに貼り付けてください"
- ✅ ko: "메시지가 복사되었습니다! Zalo에 붙여넣으세요"
- ✅ ms: "Mesej telah disalin! Sila tampal di Zalo"
- ✅ pt: "Mensagem copiada! Por favor, cole no Zalo"
- ✅ ru: "Сообщение скопировано! Пожалуйста, вставьте в Zalo"
- ✅ ta: "செய்தி நகலெடுக்கப்பட்டது! Zaloவில் ஒட்டவும்"
- ✅ th: "คัดลอกข้อความแล้ว! กรุณาวางใน Zalo"
- ✅ tl: "Nakopya ang mensahe! Pakipaste sa Zalo"
- ✅ hk: "訊息已複製！請貼到Zalo"
- ✅ zh-CN: "消息已复制！请粘贴到Zalo"
- ✅ zh-TW: "訊息已複製！請貼到Zalo"

---

### 3. **RoomDetail.tsx / DiningDetail.tsx / ServiceDetail.tsx**

Updated `handleBooking()`:

```typescript
const handleBooking = async () => {
  const itemName = room?.name || '';
  
  if (room?.bookingUrl) {
    // Nếu là Zalo, copy message vào clipboard
    if (isZaloUrl(room.bookingUrl)) {
      const bookingMessage = createBookingMessage(itemName, t.wantToBook);
      const copied = await copyToClipboard(bookingMessage);
      if (copied) {
        message.success(t.messageCopied); // Ant Design notification
      }
    }
    
    const url = getBookingUrlWithMessage(room.bookingUrl, itemName, t.wantToBook);
    window.open(url, '_blank', 'noopener,noreferrer');
  }
};
```

---

## 🎯 User Flow

### Messenger
1. User click "Đặt phòng" với room name "PHÒNG SUPERIOR"
2. URL được convert sang Facebook Messages với text parameter
3. Browser mở Facebook Messages
4. ✅ Tin nhắn đã soạn sẵn: "Tôi muốn đặt PHÒNG SUPERIOR"

### Zalo
1. User click "Đặt phòng" với room name "PHÒNG SUPERIOR"
2. Tin nhắn "Tôi muốn đặt PHÒNG SUPERIOR" được copy vào clipboard
3. Notification hiện: "Tin nhắn đã được sao chép! Hãy dán vào Zalo"
4. Browser mở Zalo chat
5. User paste (Ctrl+V) tin nhắn vào khung chat Zalo

---

## 🔧 API Requirements

Backend cần cung cấp `booking_url` trong response:

```json
{
  "id": 11,
  "name": "PHÒNG SUPERIOR",
  "booking_url": "m.me/632907089911332"  // hoặc "zalo.me/0123456789"
}
```

**Fallback:** Nếu item không có `booking_url`, dùng `settings.booking_url` (global)

---

## ⚙️ Technical Notes

### Browser Support
- ✅ Modern browsers: `navigator.clipboard.writeText()`
- ✅ Fallback: `document.execCommand('copy')` cho browsers cũ

### Security
- Clipboard API requires **HTTPS** hoặc **localhost**
- User phải interact (click button) trước khi copy

### Messenger API Limitations
- ❌ Messenger không support `m.me/xxx?text=` parameter
- ✅ Solution: Convert sang Facebook Messages URL format
- Desktop: Works perfectly
- Mobile: Redirects to Messenger app

### Zalo API Limitations
- ❌ Zalo không support pre-fill message qua URL
- ✅ Solution: Copy message to clipboard + show notification

---

## 🧪 Testing

### Test URLs

**Messenger:**
```
m.me/632907089911332
https://m.me/632907089911332
```

**Zalo:**
```
zalo.me/0123456789
https://zalo.me/0123456789
chat.zalo.me/xxxxx
```

### Manual Test Steps

1. **Test Messenger:**
   - Update backend: set `booking_url = "m.me/632907089911332"`
   - Click "Đặt phòng"
   - Verify Facebook Messages opens với tin nhắn soạn sẵn

2. **Test Zalo:**
   - Update backend: set `booking_url = "zalo.me/0123456789"`
   - Click "Đặt phòng"
   - Verify notification "Tin nhắn đã được sao chép!"
   - Paste vào notepad → check message content

3. **Test Multi-language:**
   - Switch language (vi → en → ja)
   - Click "Đặt phòng"
   - Verify message language matches UI language

---

## 📝 Notes

- Tin nhắn luôn theo ngôn ngữ hiện tại của user
- Format: `[wantToBook] [itemName]` → "Tôi muốn đặt PHÒNG SUPERIOR"
- Item name được lấy từ `translations` của API response (localized)

---

## 🐛 Troubleshooting

**Q: Messenger không pre-fill message?**
- Check URL format: `https://www.facebook.com/messages/t/PAGE_ID?text=...`
- Verify PAGE_ID chính xác
- Test trên desktop browser trước

**Q: Zalo không copy được message?**
- Check browser support HTTPS/localhost
- Check user đã click button (không phải auto-trigger)
- Check console errors

**Q: Notification không hiện?**
- Verify `message` imported from `antd`
- Check `t.messageCopied` đã defined trong translations

---

## 📅 Changelog

**v1.0.0 - 2026-01-28**
- ✅ Add `bookingHelper.ts` utility
- ✅ Add `messageCopied` translation for 20 languages
- ✅ Update RoomDetail, DiningDetail, ServiceDetail
- ✅ Support Messenger pre-filled message (via Facebook Messages URL)
- ✅ Support Zalo clipboard copy + notification
