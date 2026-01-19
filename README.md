# Hotel Link - VR360 Frontend

React + TypeScript + Vite project with **VR360 Integration** for hotel virtual tours.

## 🎉 NEW: VR360 System

Dự án đã được setup đầy đủ VR360 system để kết nối với FastAPI backend!

### ✅ Đã có sẵn:
- 📦 **Types & Interfaces** - VR360Link, VR360Category, DTOs
- 🔌 **API Service** - vr360Service với 8 methods CRUD
- 🪝 **React Hooks** - 5 custom hooks để fetch VR360 data
- 🎨 **UI Components** - VR360Viewer, VR360Modal, VR360Gallery
- 📖 **Documentation** - Complete guides & examples
- 🚀 **Ready to use** - Chỉ cần backend implement API!

### 📚 Documentation

| File | Description |
|------|-------------|
| [VR360_SETUP_SUMMARY.md](VR360_SETUP_SUMMARY.md) | ⭐ **BẮT ĐẦU TỪ ĐÂY** - Tổng quan setup |
| [VR360_INTEGRATION_GUIDE.md](VR360_INTEGRATION_GUIDE.md) | Full integration guide |
| [VR360_API_EXAMPLES.md](VR360_API_EXAMPLES.md) | Code examples (Fetch & Axios) |
| [.env.example](.env.example) | Environment variables |

### 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Setup environment
cp .env.example .env
# Edit .env với API URL của bạn

# 3. Run dev server
npm run dev
```

### 💻 Usage Example

```tsx
import { useVR360ByRoom } from './hooks/useVR360';
import { VR360Gallery } from './components/common';

function RoomPage({ roomId }) {
  const { links, loading, error } = useVR360ByRoom(roomId);
  
  if (loading) return <Spinner />;
  if (error) return <Error message={error.message} />;
  
  return <VR360Gallery links={links} columns={3} />;
}
```

### 📋 Backend API Requirements

Backend cần implement các endpoints:
- `GET /vr360` - List VR360 links
- `GET /vr360/{id}` - Detail
- `GET /vr360/room/{room_id}` - By room
- `GET /vr360/category/{category}` - By category
- `POST /vr360` - Create (Admin)
- `PATCH /vr360/{id}` - Update (Admin)
- `DELETE /vr360/{id}` - Delete (Admin)

Chi tiết xem [VR360_INTEGRATION_GUIDE.md](VR360_INTEGRATION_GUIDE.md)

---

## Original Template Info

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
