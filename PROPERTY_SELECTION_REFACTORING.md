# Property Selection Refactoring - Summary

## Tổng Quan

Đã refactor toàn bộ logic property selection từ **hardcoded PROPERTY_CODE** sang **dynamic user-based property selection**.

## Vấn Đề Ban Đầu

```typescript
// ❌ BEFORE: Hardcoded property code trong .env.local
VITE_PROPERTY_CODE=fusion-suites-vung-tau

// PropertyContext fetch property bằng code cố định
const data = await propertyService.getPropertyByCode(PROPERTY_CODE);
```

**Vấn đề**: Tất cả users sẽ thấy cùng 1 property, không phụ thuộc vào quyền truy cập của họ.

## Giải Pháp

### 1. User Info API

Tạo `userService.ts` để fetch thông tin user đang đăng nhập:

```typescript
// GET /api/v1/users/me
export const getCurrentUser = async (): Promise<UserResponse> => {
  const response = await api.get<UserResponse>('/users/me');
  return response.data;
};
```

**Response**:
```json
{
  "id": 23,
  "email": "fusion@admin.com",
  "full_name": "Fusion Admin",
  "role": "ADMIN",
  "is_active": true,
  "tenant_id": 1,
  "created_at": "2025-01-15T10:00:00",
  "updated_at": null
}
```

### 2. Properties List API

Sử dụng method `getProperties()` đã có sẵn trong `propertyService.ts`:

```typescript
// GET /api/v1/properties/
async getProperties(params?: { skip?: number; limit?: number }): Promise<PropertyResponse[]> {
  const { data } = await api.get('/properties/', { params });
  return data;
}
```

**Response**: Danh sách properties mà user có quyền truy cập trong tenant.

### 3. PropertyContext Refactoring

**Logic mới**:

```typescript
const fetchData = async () => {
  // 1. Fetch user info
  const userData = await userService.getCurrentUser();
  setUser(userData);
  
  // 2. Fetch properties list
  const propertiesList = await propertyService.getProperties();
  setProperties(propertiesList);
  
  // 3. Auto-select logic
  if (propertiesList.length === 1) {
    // Chỉ có 1 property → tự động chọn
    setPropertyId(propertiesList[0].id);
    localStorage.setItem('selected_property_id', propertiesList[0].id.toString());
  } else {
    // Nhiều properties → restore from localStorage hoặc chọn first
    const savedPropertyId = localStorage.getItem('selected_property_id');
    // ... restoration logic
  }
};
```

**Context Interface**:

```typescript
interface PropertyContextType {
  user: UserResponse | null;           // ✨ NEW
  properties: PropertyResponse[];       // ✨ NEW
  property: PropertyResponse | null;    // Current selected
  propertyId: number | null;            // ✨ NEW
  selectProperty: (id: number) => void; // ✨ NEW
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}
```

### 4. PropertySelector Component

Component mới cho phép user chọn property khi có nhiều properties:

```tsx
// src/components/common/PropertySelector.tsx
export const PropertySelector: React.FC = () => {
  const { properties, propertyId, selectProperty, loading } = usePropertyContext();
  
  // Không hiển thị nếu chỉ có 1 property
  if (properties.length <= 1) return null;
  
  return (
    <Select
      value={propertyId}
      onChange={selectProperty}
      options={properties.map(p => ({
        value: p.id,
        label: p.property_name,
      }))}
    />
  );
};
```

**Tích hợp vào Header**:
- Dropdown hiển thị ngay dưới Language Selector
- Chỉ xuất hiện khi user có quyền truy cập >1 property
- Lưu lựa chọn vào localStorage

### 5. Environment Variables

**.env.local changes**:

```diff
  VITE_API_BASE_URL=https://travel.link360.vn/api/v1
  VITE_TENANT_CODE=fusion
- VITE_PROPERTY_CODE=fusion-suites-vung-tau
+ # VITE_PROPERTY_CODE - DEPRECATED: Property được lấy tự động từ user account sau khi đăng nhập
```

## Files Changed

### Created
- ✅ `src/services/userService.ts` - User info API service
- ✅ `src/components/common/PropertySelector.tsx` - Property selection dropdown

### Modified
- ✅ `src/context/PropertyContext.tsx` - Refactored to user-based property selection
- ✅ `src/types/api.ts` - Added UserResponse type
- ✅ `src/services/index.ts` - Exported userService
- ✅ `src/components/common/index.ts` - Exported PropertySelector
- ✅ `src/components/common/Header.tsx` - Added PropertySelector component
- ✅ `.env.local` - Removed VITE_PROPERTY_CODE

## Flow Diagram

```
┌─────────────────┐
│   User Login    │
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│  GET /users/me          │
│  → UserResponse         │
│  → tenant_id            │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│  GET /properties/       │
│  → PropertyResponse[]   │
│  (filtered by tenant)   │
└────────┬────────────────┘
         │
         ▼
    ┌────┴────┐
    │  Count  │
    └────┬────┘
         │
    ┌────┴────────────────┐
    │                     │
    ▼                     ▼
┌─────────┐      ┌────────────────┐
│ 1 prop  │      │  Multiple props│
│ Auto    │      │  Show selector │
│ select  │      │  Restore from  │
│         │      │  localStorage  │
└────┬────┘      └────────┬───────┘
     │                    │
     └─────────┬──────────┘
               │
               ▼
    ┌──────────────────┐
    │  Set propertyId  │
    │  Save to localStorage
    └──────────────────┘
```

## User Scenarios

### Scenario 1: User có 1 property
1. User đăng nhập
2. System fetch user info → tenant_id
3. Fetch properties list → 1 property
4. **Auto-select** property đó
5. **Không hiển thị** PropertySelector
6. User thấy ngay property của mình

### Scenario 2: User có nhiều properties
1. User đăng nhập
2. System fetch user info → tenant_id
3. Fetch properties list → 3 properties
4. **Restore** từ localStorage (nếu có)
5. **Hiển thị** PropertySelector dropdown ở Header
6. User có thể **chuyển đổi** giữa các properties
7. Lựa chọn được **lưu** vào localStorage

### Scenario 3: User đăng nhập lần đầu (nhiều properties)
1. User đăng nhập
2. System fetch → 2 properties
3. Không có localStorage
4. **Auto-select property đầu tiên**
5. Hiển thị PropertySelector
6. User có thể chọn property khác

## API Endpoints Used

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/users/me` | Get current user info |
| GET | `/properties/` | Get list of properties for tenant |
| GET | `/properties/{id}` | Get specific property (unchanged) |
| GET | `/properties/by-code/{code}` | Get by code (deprecated for main flow) |

## LocalStorage

**Key**: `selected_property_id`

**Value**: `number` (property ID)

**Usage**:
- Lưu khi user chọn property
- Restore khi reload page
- Clear khi logout (cần implement)

## TypeScript Types

```typescript
// User
export interface UserResponse {
  id: number;
  email: string;
  full_name: string;
  role: UserRole;
  is_active: boolean;
  tenant_id: number;
  created_at: string;
  updated_at: string | null;
}

export type UserRole = 'OWNER' | 'ADMIN' | 'EDITOR' | 'VIEWER';

// PropertyContext
interface PropertyContextType {
  user: UserResponse | null;
  properties: PropertyResponse[];
  property: PropertyResponse | null;
  propertyId: number | null;
  selectProperty: (propertyId: number) => void;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}
```

## Migration Guide

### Nếu bạn đang dùng code cũ:

```typescript
// ❌ OLD
const PROPERTY_CODE = import.meta.env.VITE_PROPERTY_CODE;
const data = await propertyService.getPropertyByCode(PROPERTY_CODE);

// ✅ NEW
const { property, propertyId, loading } = usePropertyContext();
// property và propertyId được auto-fetch based on user
```

### Nếu cần access propertyId trong component:

```typescript
// ✅ Use usePropertyData hook
const { propertyId, propertyName, isLoaded } = usePropertyData();

// ✅ Or use PropertyContext directly
const { propertyId, property } = usePropertyContext();
```

## Testing Checklist

- ✅ User với 1 property → auto-select
- ✅ User với nhiều properties → show selector
- ✅ Switch property → data updates
- ✅ Reload page → property selection persists (localStorage)
- ✅ No PROPERTY_CODE in .env → still works
- ⏳ Logout → clear localStorage (TODO)
- ⏳ Permission changes → re-fetch properties (TODO)

## Next Steps (Optional)

1. **Logout handler**: Clear localStorage khi logout
2. **Permission sync**: Re-fetch properties khi permissions change
3. **Error handling**: Better error message khi user không có properties
4. **Loading state**: Skeleton cho property selector
5. **Analytics**: Track property switches

## Debug Console Logs

Khi chạy app, bạn sẽ thấy console logs:

```
[PropertyContext] User loaded: { id: 23, email: "fusion@admin.com", ... }
[PropertyContext] Properties loaded: [{ id: 10, property_name: "Fusion Suites Vung Tau" }]
[PropertyContext] Auto-selected single property: 10
```

Hoặc nếu nhiều properties:

```
[PropertyContext] User loaded: { id: 23, ... }
[PropertyContext] Properties loaded: [{ id: 10, ... }, { id: 11, ... }]
[PropertyContext] Multiple properties, selected first: 10
```

Khi user chọn property khác:

```
[PropertyContext] Property selected: 11
```

## Breaking Changes

⚠️ **PropertyContext interface changed**:
- Added `user`, `properties`, `propertyId`, `selectProperty`
- `property` is now derived from `properties[propertyId]`
- No longer depends on `VITE_PROPERTY_CODE`

⚠️ **Environment variable deprecated**:
- `VITE_PROPERTY_CODE` is now ignored
- Remove it from your `.env.local` (already done)

## Rollback Instructions

Nếu cần rollback về version cũ:

1. Restore `.env.local`:
   ```bash
   VITE_PROPERTY_CODE=fusion-suites-vung-tau
   ```

2. Revert [PropertyContext.tsx](src/context/PropertyContext.tsx) to use `getPropertyByCode`

3. Remove PropertySelector from Header

## Support

Nếu gặp vấn đề:
1. Check console logs (filter by `[PropertyContext]`)
2. Verify `/users/me` returns user data
3. Verify `/properties/` returns properties list
4. Check localStorage for `selected_property_id`
5. Clear localStorage và refresh nếu có vấn đề
