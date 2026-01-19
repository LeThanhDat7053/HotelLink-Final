# Property Selection - Simple Logic

## Logic Đơn Giản

PropertyContext giờ fetch **tất cả properties** của tenant, sau đó **tìm property theo code** từ `.env.local`.

## Flow

```
1. Fetch /properties/ → Danh sách properties trong tenant
2. Đọc VITE_PROPERTY_CODE từ .env.local
3. Tìm property có code matching → setProperty()
```

## Thay Đổi Property

Chỉ cần sửa file `.env.local`:

```bash
# Thay đổi từ property này
VITE_PROPERTY_CODE=fusion-suites-vung-tau

# Sang property khác
VITE_PROPERTY_CODE=fusion-suites-saigon
```

Sau đó **restart dev server**:

```bash
# Ctrl+C để stop server
npm run dev
```

## Code Changes

### PropertyContext.tsx

```typescript
const fetchProperty = async () => {
  // 1. Fetch all properties
  const propertiesList = await propertyService.getProperties();
  
  // 2. Get property code from env
  const propertyCode = import.meta.env.VITE_PROPERTY_CODE;
  
  // 3. Find property by code
  const foundProperty = propertiesList.find(p => p.code === propertyCode);
  
  if (!foundProperty) {
    throw new Error(`Property "${propertyCode}" not found`);
  }
  
  setProperty(foundProperty);
};
```

### Console Logs

```
[PropertyContext] Properties loaded: [
  { id: 10, code: "fusion-suites-vung-tau", ... },
  { id: 11, code: "fusion-suites-saigon", ... }
]
[PropertyContext] Property selected: { id: 10, code: "fusion-suites-vung-tau", ... }
```

## Ưu Điểm

✅ Không hardcode property_id  
✅ Fetch data động từ API  
✅ Dễ dàng thay đổi property bằng cách sửa env  
✅ Error message rõ ràng nếu code không tồn tại  
✅ Không cần PropertySelector UI  

## Files Modified

- ✅ [.env.local](.env.local) - Restored VITE_PROPERTY_CODE
- ✅ [src/context/PropertyContext.tsx](src/context/PropertyContext.tsx) - Simplified logic
- ✅ [src/components/common/Header.tsx](src/components/common/Header.tsx) - Removed PropertySelector

## Files Created (Not Used)

- ~~src/services/userService.ts~~ - Không cần
- ~~src/components/common/PropertySelector.tsx~~ - Không cần

## Testing

1. Start dev server: `npm run dev`
2. Check console logs xem property nào được chọn
3. Để đổi property:
   - Sửa `VITE_PROPERTY_CODE` trong `.env.local`
   - Restart dev server
   - Verify console logs
