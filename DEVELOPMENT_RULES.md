# 🎯 QUY TẮC FRONTEND DEVELOPMENT - DASHBOARD PROJECTS

> **Áp dụng:** React + TypeScript + Vite + Tailwind + FastAPI Backend  
> **Mục đích:** Đảm bảo code quality, consistency, maintainability
> **Kết quả:** Hoàn thành dự án cho website có giao diện giống 100% website https://marishotel.vn/

---

## 📋 NGUYÊN TẮC CỐT LÕI

### 1. Kiến Trúc Phân Lớp (Layered Architecture)

```
Pages → Components → Hooks → Services → API Config
```

**✅ NÊN:**
- Tách biệt rõ ràng từng layer
- Mỗi layer chỉ giao tiếp với layer liền kề
- Components chỉ gọi Hooks, KHÔNG gọi Services
- Services chỉ gọi API Config, KHÔNG gọi trực tiếp axios

**❌ TUYỆT ĐỐI KHÔNG:**
- Gọi API trực tiếp trong Components
- Trộn lẫn business logic vào UI components
- Skip service layer và gọi axios.get() trong component
- Hard-code API URLs bất kỳ đâu

---

## 🗂️ CẤU TRÚC THƯ MỤC

### 2. Cấu Trúc Bắt Buộc

```
src/
├── api/              # HTTP client config (axios)
├── services/         # API calls, CRUD operations
├── hooks/            # Custom hooks, business logic
├── components/       # UI components (common/, forms/, {feature}/)
├── pages/            # Route-level components
├── types/            # TypeScript definitions
├── context/          # Global state (Auth, Theme)
├── utils/            # Helper functions
└── constants/        # Config, routes, enums
```

**✅ NÊN:**
- Tạo đủ các thư mục bắt buộc
- Mỗi feature có folder riêng trong components/
- Tách common components để reuse
- Đặt types riêng cho mỗi resource

**❌ TUYỆT ĐỐI KHÔNG:**
- Bỏ bất kỳ folder nào trong danh sách trên
- Để tất cả components chung 1 folder
- Trộn lẫn types của nhiều resources
- Tạo cấu trúc tự do không theo chuẩn

---

## 🔌 API INTEGRATION

### 3. Axios Configuration

**✅ NÊN:**
- Tạo axios instance với baseURL từ env vars
- Config interceptors cho request (thêm token)
- Config interceptors cho response (handle 401, 403)
- Set timeout (khuyến nghị 10 seconds)
- Set default headers (Content-Type: application/json)

**❌ TUYỆT ĐỐI KHÔNG:**
- Hard-code API URL: `axios.get('http://localhost:8000/...')`
- Dùng axios trực tiếp thay vì apiClient instance
- Bỏ qua error interceptors
- Quên thêm Authorization header

---

### 4. Service Layer

**✅ NÊN:**
- Tạo 1 service file cho mỗi resource
- Implement đủ: getAll(), getById(), create(), update(), delete()
- Thêm search() method nếu backend hỗ trợ
- Luôn async/await, KHÔNG dùng .then()
- Try-catch trong mọi method
- JSDoc comments cho public methods

**❌ TUYỆT ĐỐI KHÔNG:**
- Skip service layer
- Gộp nhiều resources vào 1 service file
- Dùng .then().catch() thay vì async/await
- Bỏ qua error handling

**Pattern bắt buộc:**
```typescript
export const {resource}Service = {
  async getAll(): Promise<Resource[]> { /* ... */ },
  async getById(id: string): Promise<Resource> { /* ... */ },
  async create(data: CreateDTO): Promise<Resource> { /* ... */ },
  async update(id: string, data: UpdateDTO): Promise<Resource> { /* ... */ },
  async delete(id: string): Promise<void> { /* ... */ },
};
```

---

### 5. Custom Hooks

**✅ NÊN:**
- Tạo hook cho mỗi resource: `use{Resources}` (list), `use{Resource}` (single)
- Return object với: data, loading, error, refetch
- Handle loading state
- Handle error state
- useEffect để auto-fetch khi component mount

**❌ TUYỆT ĐỐI KHÔNG:**
- Gọi service trực tiếp trong component (phải qua hook)
- Bỏ qua loading/error states
- Quên cleanup trong useEffect
- Tạo hook quá phức tạp (>100 lines)

**Pattern bắt buộc:**
```typescript
export const useResources = () => {
  const [data, setData] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // fetchData logic...
  
  return { data, loading, error, refetch };
};
```

---

## 📝 TYPESCRIPT

### 6. Type Definitions

**✅ NÊN:**
- Tạo interface cho mỗi resource (mirror backend model)
- Tạo enum cho fixed values (Status, Role, Type, etc.)
- Tạo riêng CreateDTO và UpdateDTO
- Export tất cả types
- Dùng interface cho object shapes
- Enable strict mode trong tsconfig

**❌ TUYỆT ĐỐI KHÔNG:**
- Dùng `any` type (dùng `unknown` nếu thực sự cần)
- Dùng type thay vì interface cho objects
- Bỏ qua DTOs (dùng chung interface cho create/update)
- Để types không được export

**Pattern bắt buộc:**
```typescript
// Base interface
export interface Resource { id, name, status, created_at, updated_at }

// Enum
export enum ResourceStatus { ACTIVE, INACTIVE, PENDING }

// DTOs
export interface CreateResourceDTO { name, description }
export interface UpdateResourceDTO extends Partial<CreateResourceDTO> {}
```

---

## 🧩 COMPONENTS

### 7. Component Structure

**✅ NÊN:**
- Dùng `FC<Props>` type cho function components
- Define Props interface trước component
- Destructure props trong function params
- Có default values cho optional props
- Memoize với `memo()` nếu component re-render nhiều
- displayName cho memoized components
- Max 300 lines per component

**❌ TUYỆT ĐỐI KHÔNG:**
- Bỏ qua TypeScript types
- Props không có interface
- Component quá 300 lines (cần split)
- Business logic trong component (phải ở service/hook)
- API calls trong component

**Pattern bắt buộc:**
```typescript
interface MyComponentProps {
  data: Resource;
  onAction?: (id: string) => void;
  className?: string;
}

export const MyComponent: FC<MyComponentProps> = memo(({
  data,
  onAction,
  className = '',
}) => {
  // Component logic
});

MyComponent.displayName = 'MyComponent';
```

---

### 8. Forms

**✅ NÊN:**
- Controlled components (value + onChange)
- Local state cho form data
- Validation trước submit
- Show field-level errors
- Disable form khi isLoading
- Clear errors khi user types
- Accessible labels và ARIA attributes

**❌ TUYỆT ĐỐI KHÔNG:**
- Uncontrolled components (useRef thay vì useState)
- Submit mà không validate
- Generic error messages ("Error occurred")
- Quên disable form khi loading

---

## 🔄 STATE MANAGEMENT

### 9. Local vs Global State

**✅ NÊN:**
- **useState** cho: UI state (modals, toggles, form inputs)
- **Context API** cho: Auth, Theme, Notifications, Global settings
- Custom hooks cho: Reusable logic, API data fetching
- Keep state as local as possible

**❌ TUYỆT ĐỐI KHÔNG:**
- Dùng Context cho mọi state (over-engineering)
- Prop drilling quá 3 levels (dùng Context)
- Global state cho UI state đơn giản
- Multiple contexts không cần thiết

---

### 10. Authentication Context

**✅ NÊN:**
- Tạo AuthContext với: user, isAuthenticated, login, logout
- Check token khi app mount
- Auto logout khi token expire (401)
- Provide loading state khi check auth
- ProtectedRoute component cho private routes

**❌ TUYỆT ĐỐI KHÔNG:**
- Quên check auth khi app mount
- Bỏ qua token expiration
- Không có loading state khi init
- Protected routes không redirect về login

---

## 🚨 ERROR HANDLING

### 11. Error Strategy

**✅ NÊN:**
- ErrorBoundary component wrap toàn bộ app
- Try-catch trong mọi async operations
- User-friendly error messages
- Log errors ra console (dev) hoặc tracking service (prod)
- Fallback UI cho errors
- Retry options khi có lỗi

**❌ TUYỆT ĐỐI KHÔNG:**
- Bỏ qua error handling
- Show raw error messages cho user
- Không log errors
- App crash khi có lỗi
- Generic messages: "Error occurred"

---

### 12. Loading States

**✅ NÊN:**
- Show spinner/skeleton khi loading
- Disable actions khi loading
- Loading state cho mọi async operation
- Clear loading indicators khi done/error

**❌ TUYỆT ĐỐI KHÔNG:**
- Không show loading indicators
- Cho phép multiple submits
- Quên clear loading state
- Blocking UI không cần thiết

---

## 🔐 SECURITY

### 13. Environment Variables

**✅ NÊN:**
- Tất cả configs qua environment variables
- .env.example commit vào repo
- .env trong .gitignore
- Prefix: VITE_ cho Vite projects
- Validate env vars khi app start

**❌ TUYỆT ĐỐI KHÔNG:**
- Hard-code URLs, API keys, secrets
- Commit .env file
- Để secrets trong code
- Quên prefix VITE_ (Vite sẽ không expose)

---

### 14. Input Validation

**✅ NÊN:**
- Validate phía client trước khi submit
- Sanitize user inputs
- Email/phone/URL validation
- XSS prevention (không dùng dangerouslySetInnerHTML)
- CSRF tokens nếu backend yêu cầu

**❌ TUYỆT ĐỐI KHÔNG:**
- Tin tưởng user input
- Skip client-side validation
- Dùng dangerouslySetInnerHTML
- Render raw HTML từ user

---

### 15. Token Management

**✅ NÊN:**
- Store tokens trong localStorage (hoặc httpOnly cookies tốt hơn)
- Add token vào headers qua interceptor
- Remove token khi logout
- Refresh token khi expire (nếu có refresh token)

**❌ TUYỆT ĐỐI KHÔNG:**
- Manually add token vào mỗi request
- Quên remove token khi logout
- Expose token trong URL
- Store sensitive data trong localStorage

---

## 📂 CODE ORGANIZATION

### 16. Naming Conventions

**✅ NÊN:**
- **Components:** PascalCase (`UserCard.tsx`)
- **Hooks:** camelCase with 'use' prefix (`useAuth.ts`)
- **Services:** camelCase (`userService.ts`)
- **Types:** PascalCase (`user.ts` exports `interface User`)
- **Utils:** camelCase (`formatDate.ts`)
- **Constants:** UPPER_SNAKE_CASE (`API_ROUTES.ts`)

**❌ TUYỆT ĐỐI KHÔNG:**
- kebab-case: `user-card.tsx`
- snake_case: `user_service.ts`
- Inconsistent naming
- Generic names: `Utils.ts`, `Helpers.ts`

---

### 17. Import Order

**✅ NÊN (theo thứ tự):**
1. External libraries (React, axios, etc.)
2. Internal absolute imports (@/components, @/hooks)
3. Relative imports (./Component, ../types)
4. Styles & assets

**❌ TUYỆT ĐỐI KHÔNG:**
- Random import order
- Mix relative và absolute imports
- Import unused modules

---

### 18. File Size

**✅ NÊN:**
- Components: Max 300 lines
- Hooks: Max 150 lines
- Services: Max 200 lines
- Utils: Max 100 lines per function

**❌ TUYỆT ĐỐI KHÔNG:**
- Giant files (500+ lines)
- God components
- Monolithic services
- Multiple responsibilities in 1 file

---

## 🎨 STYLING

### 19. Tailwind CSS

**✅ NÊN:**
- Utility-first approach
- Organize classes theo groups (layout, typography, colors, effects)
- @apply cho repeated patterns
- Mobile-first responsive design
- Custom components cho complex patterns

**❌ TUYỆT ĐỐI KHÔNG:**
- Inline styles (trừ dynamic values)
- Messy class order
- Duplicate style patterns (dùng @apply)
- Desktop-first design

---

### 20. Accessibility

**✅ NÊN:**
- Semantic HTML
- ARIA labels và attributes
- Keyboard navigation support
- Focus states visible
- Alt text cho images
- Proper heading hierarchy

**❌ TUYỆT ĐỐI KHÔNG:**
- Div soup (div thay vì semantic tags)
- Missing labels
- Keyboard navigation bị break
- No focus indicators
- Images không có alt

---

## ⚡ PERFORMANCE

### 21. Optimization Techniques

**✅ NÊN:**
- Lazy load routes với React.lazy()
- Memoize với useMemo() cho expensive calculations
- Memoize callbacks với useCallback()
- Memo components với memo() khi cần
- Debounce search inputs
- Virtual scrolling cho long lists (>100 items)
- Image lazy loading

**❌ TUYỆT ĐỐI KHÔNG:**
- Load tất cả routes upfront
- Re-calculate expensive values mọi render
- Create functions mỗi render
- Render 1000+ items cùng lúc
- Uncontrolled image loading

---

### 22. Bundle Size

**✅ NÊN:**
- Code splitting per route
- Tree shaking (import specific functions)
- Analyze bundle với vite-bundle-visualizer
- Lazy load heavy libraries

**❌ TUYỆT ĐỐI KHÔNG:**
- Import entire library (`import _ from 'lodash'`)
- No code splitting
- Ignore bundle size
- Bloated dependencies

---

## 🧪 TESTING & QUALITY

### 23. Code Quality

**✅ NÊN:**
- No TypeScript errors
- No unused imports/variables
- No console.log trong production
- Meaningful variable names
- Comments cho complex logic
- JSDoc cho public APIs

**❌ TUYỆT ĐỐI KHÔNG:**
- Ignore TypeScript errors
- Debug console.log ở khắp nơi
- Variables: a, b, x, temp, data
- Zero comments
- Magic numbers

---

### 24. Testing

**✅ NÊN:**
- Test critical user flows
- Test authentication
- Test form validation
- Test error states
- Mock API calls
- Test responsive design

**❌ TUYỆT ĐỐI KHÔNG:**
- Zero tests
- Test implementation details
- Skip edge cases
- No mobile testing

---

## 📋 WORKFLOW

### 25. Feature Development Flow

**Thứ tự BẮT BUỘC khi tạo feature mới:**

1. **Types** (`types/{resource}.ts`)
   - Interface, Enums, DTOs

2. **Service** (`services/{resource}Service.ts`)
   - CRUD methods

3. **Hook** (`hooks/use{Resource}.ts`)
   - Data fetching logic

4. **Components** (`components/{feature}/`)
   - Card, Form, List, Filters

5. **Page** (`pages/{Resource}Page.tsx`)
   - Orchestrate components

6. **Route** (Update `App.tsx`)
   - Add route definition

**❌ TUYỆT ĐỐI KHÔNG:**
- Làm lung tung không theo thứ tự
- Skip bất kỳ bước nào
- Start từ UI trước khi có types/services

---

## ✅ PRE-COMMIT CHECKLIST

### Code Quality
- [ ] No TypeScript errors
- [ ] No console.log
- [ ] Imports organized
- [ ] All types defined
- [ ] No `any` types
- [ ] No unused code

### Functionality
- [ ] Features work
- [ ] Forms validate
- [ ] API integration works
- [ ] Auth works
- [ ] Responsive design
- [ ] Error handling works

### Best Practices
- [ ] Naming conventions followed
- [ ] Service layer used
- [ ] No hardcoded values
- [ ] Env vars used
- [ ] Performance optimized
- [ ] Security measures applied

### Files
- [ ] No secrets committed
- [ ] .env in .gitignore
- [ ] README updated if needed

---

## 🚨 TOP 10 CRITICAL RULES

### TUYỆT ĐỐI KHÔNG:

1. ❌ Gọi API trực tiếp trong components
2. ❌ Hard-code API URLs, keys, secrets
3. ❌ Dùng `any` type trong TypeScript
4. ❌ Skip service layer
5. ❌ Bỏ qua error handling
6. ❌ Bỏ qua loading states
7. ❌ Commit .env file hoặc secrets
8. ❌ Components > 300 lines
9. ❌ Business logic trong UI components
10. ❌ Skip validation (client & server)

### LUÔN LUÔN:

1. ✅ TypeScript strict mode
2. ✅ Service layer cho API calls
3. ✅ Custom hooks cho data fetching
4. ✅ Error boundaries
5. ✅ Loading indicators
6. ✅ Input validation & sanitization
7. ✅ Environment variables
8. ✅ Responsive design
9. ✅ Accessibility
10. ✅ Follow workflow: Types → Service → Hook → Component → Page → Route

---

## 🎯 TÓM TẮT

**5 Principles:**
1. **Separation of Concerns** - Mỗi layer có trách nhiệm riêng
2. **Type Safety** - TypeScript cho mọi thứ
3. **API Abstraction** - Không bao giờ gọi API trực tiếp
4. **Error Resilience** - Handle mọi errors
5. **User First** - UX, performance, accessibility

**3 Must-Haves:**
1. Service Layer (API abstraction)
2. Custom Hooks (Business logic)
3. Type System (TypeScript strict)

**1 Golden Rule:**
> "Khi nghi ngờ, HỎI TRƯỚC KHI CODE!"

---

**Version:** 3.0 - Rules Only  
**Last Updated:** January 2026
