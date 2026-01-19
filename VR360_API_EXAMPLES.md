# VR360 API Examples - Fetch & Axios

## 📦 Raw API Call Examples

Các ví dụ dưới đây cho thấy cách gọi API trực tiếp mà không dùng service layer.

---

## 🔹 Using Fetch API

### 1. Get All VR360 Links

```typescript
// Lấy danh sách VR360 links
const fetchVR360Links = async () => {
  try {
    const token = localStorage.getItem('access_token');
    
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/vr360?is_active=true&page=1&limit=20`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('VR360 Links:', data.data);
    return data;
  } catch (error) {
    console.error('Failed to fetch VR360 links:', error);
    throw error;
  }
};
```

### 2. Get VR360 by Room

```typescript
const fetchVR360ByRoom = async (roomId: string) => {
  try {
    const token = localStorage.getItem('access_token');
    
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/vr360/room/${roomId}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Room not found');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data; // Array of VR360Link[]
  } catch (error) {
    console.error('Failed to fetch room VR360:', error);
    throw error;
  }
};
```

### 3. Create VR360 Link (Admin)

```typescript
interface CreateVR360Data {
  title: string;
  description?: string;
  vrUrl: string;
  thumbnailUrl?: string;
  category: string;
  roomId?: string;
  facilityId?: string;
  order?: number;
}

const createVR360Link = async (data: CreateVR360Data) => {
  try {
    const token = localStorage.getItem('access_token');
    
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/vr360`,
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      
      // Handle validation errors (422)
      if (response.status === 422 && errorData.errors) {
        const errorMessages = Object.entries(errorData.errors)
          .map(([field, messages]) => `${field}: ${(messages as string[]).join(', ')}`)
          .join('; ');
        throw new Error(`Validation Error: ${errorMessages}`);
      }
      
      throw new Error(errorData.detail || 'Failed to create VR360 link');
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Failed to create VR360 link:', error);
    throw error;
  }
};
```

### 4. Update VR360 Link (Admin)

```typescript
const updateVR360Link = async (id: string, updates: Partial<CreateVR360Data>) => {
  try {
    const token = localStorage.getItem('access_token');
    
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/vr360/${id}`,
      {
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to update VR360 link');
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Failed to update VR360 link:', error);
    throw error;
  }
};
```

### 5. Delete VR360 Link (Admin)

```typescript
const deleteVR360Link = async (id: string) => {
  try {
    const token = localStorage.getItem('access_token');
    
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/vr360/${id}`,
      {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to delete VR360 link');
    }

    return true;
  } catch (error) {
    console.error('Failed to delete VR360 link:', error);
    throw error;
  }
};
```

---

## 🔹 Using Axios (Recommended)

**Note:** Project đã có axios instance sẵn trong `api.ts` với auto-authentication!

### 1. Import API Client

```typescript
import api from './api'; // Axios instance đã config sẵn
```

### 2. Get All VR360 Links

```typescript
import api from './api';

const getVR360Links = async (params?: {
  category?: string;
  roomId?: string;
  facilityId?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}) => {
  try {
    const response = await api.get('/vr360', {
      params: {
        category: params?.category,
        room_id: params?.roomId,
        facility_id: params?.facilityId,
        is_active: params?.isActive,
        page: params?.page || 1,
        limit: params?.limit || 20,
      },
    });
    
    return response.data;
  } catch (error) {
    if (error.response) {
      // Server responded with error
      console.error('Server error:', error.response.data);
      throw new Error(error.response.data.detail || 'Server error');
    } else if (error.request) {
      // Request made but no response
      console.error('Network error:', error.request);
      throw new Error('Network error - no response from server');
    } else {
      // Something else happened
      console.error('Error:', error.message);
      throw error;
    }
  }
};
```

### 3. Get VR360 by Category

```typescript
import api from './api';

const getVR360ByCategory = async (category: string) => {
  try {
    const response = await api.get(`/vr360/category/${category}`);
    return response.data.data; // Array of VR360Link[]
  } catch (error) {
    console.error(`Failed to fetch VR360 for category ${category}:`, error);
    throw error;
  }
};

// Usage
const lobbyVRLinks = await getVR360ByCategory('LOBBY');
const roomVRLinks = await getVR360ByCategory('ROOM');
```

### 4. Get VR360 by Room ID

```typescript
import api from './api';

const getVR360ByRoom = async (roomId: string) => {
  try {
    const response = await api.get(`/vr360/room/${roomId}`);
    return response.data.data;
  } catch (error) {
    if (error.response?.status === 404) {
      console.log('No VR360 tours found for this room');
      return [];
    }
    throw error;
  }
};

// Usage
const vrLinks = await getVR360ByRoom('room-deluxe-001');
```

### 5. Get VR360 Detail

```typescript
import api from './api';

const getVR360Detail = async (id: string) => {
  try {
    const response = await api.get(`/vr360/${id}`);
    return response.data.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error('VR360 link not found');
    }
    throw error;
  }
};

// Usage
const vrLink = await getVR360Detail('vr-123');
console.log(vrLink.title, vrLink.vrUrl);
```

### 6. Create VR360 Link

```typescript
import api from './api';

interface CreateVR360Payload {
  title: string;
  description?: string;
  vrUrl: string;
  thumbnailUrl?: string;
  category: 'ROOM' | 'LOBBY' | 'RESTAURANT' | 'POOL' | 'GYM' | 'SPA' | 'ROOFTOP' | 'EXTERIOR' | 'OTHER';
  roomId?: string;
  facilityId?: string;
  order?: number;
}

const createVR360Link = async (data: CreateVR360Payload) => {
  try {
    const response = await api.post('/vr360', data);
    return response.data.data;
  } catch (error) {
    // Handle validation errors (422)
    if (error.response?.status === 422) {
      const errors = error.response.data.errors;
      const errorMessages = Object.entries(errors)
        .map(([field, messages]) => `${field}: ${(messages as string[]).join(', ')}`)
        .join('; ');
      throw new Error(`Validation Error: ${errorMessages}`);
    }
    
    // Handle other errors
    throw new Error(error.response?.data?.detail || 'Failed to create VR360 link');
  }
};

// Usage
const newVRLink = await createVR360Link({
  title: 'Deluxe Suite Virtual Tour',
  description: 'Experience our premium suite in stunning 360°',
  vrUrl: 'https://vr360.hotellink.com/deluxe-suite',
  thumbnailUrl: 'https://cdn.hotellink.com/thumbnails/deluxe-suite.jpg',
  category: 'ROOM',
  roomId: 'room-deluxe-001',
  order: 1,
});
```

### 7. Update VR360 Link

```typescript
import api from './api';

const updateVR360Link = async (
  id: string, 
  updates: Partial<CreateVR360Payload> & { isActive?: boolean }
) => {
  try {
    const response = await api.patch(`/vr360/${id}`, updates);
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to update VR360 link');
  }
};

// Usage
const updated = await updateVR360Link('vr-123', {
  title: 'Updated Title',
  isActive: false,
});
```

### 8. Delete VR360 Link

```typescript
import api from './api';

const deleteVR360Link = async (id: string) => {
  try {
    await api.delete(`/vr360/${id}`);
    return true;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error('VR360 link not found');
    }
    throw new Error(error.response?.data?.detail || 'Failed to delete VR360 link');
  }
};

// Usage
await deleteVR360Link('vr-123');
console.log('VR360 link deleted successfully');
```

---

## 🔹 React Component Examples với Direct API Calls

### Example: VR360 List Component với Axios

```tsx
import React, { useEffect, useState } from 'react';
import api from '../api';

interface VR360Link {
  id: string;
  title: string;
  vrUrl: string;
  thumbnailUrl?: string;
  category: string;
}

export const VR360List: React.FC = () => {
  const [links, setLinks] = useState<VR360Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        setLoading(true);
        const response = await api.get('/vr360', {
          params: { is_active: true, limit: 50 }
        });
        setLinks(response.data.data);
      } catch (err: any) {
        setError(err.message || 'Failed to load VR360 links');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLinks();
  }, []);

  if (loading) return <div>Loading VR360 tours...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="grid grid-cols-3 gap-4">
      {links.map(link => (
        <div key={link.id} className="border rounded-lg p-4">
          <img src={link.thumbnailUrl} alt={link.title} className="w-full h-48 object-cover" />
          <h3 className="mt-2 font-semibold">{link.title}</h3>
          <span className="text-sm text-gray-500">{link.category}</span>
        </div>
      ))}
    </div>
  );
};
```

### Example: Create VR360 Form với Fetch

```tsx
import React, { useState } from 'react';

export const CreateVR360Form: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    vrUrl: '',
    category: 'ROOM',
    roomId: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('access_token');
      
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/vr360`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create VR360 link');
      }

      const result = await response.json();
      alert('VR360 link created: ' + result.data.id);
      
      // Reset form
      setFormData({ title: '', vrUrl: '', category: 'ROOM', roomId: '' });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Create VR360 Link</h2>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="mb-4">
        <label className="block mb-2">Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={e => setFormData({ ...formData, title: e.target.value })}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">VR URL</label>
        <input
          type="url"
          value={formData.vrUrl}
          onChange={e => setFormData({ ...formData, vrUrl: e.target.value })}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">Category</label>
        <select
          value={formData.category}
          onChange={e => setFormData({ ...formData, category: e.target.value })}
          className="w-full border rounded px-3 py-2"
        >
          <option value="ROOM">Room</option>
          <option value="LOBBY">Lobby</option>
          <option value="RESTAURANT">Restaurant</option>
          <option value="POOL">Pool</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? 'Creating...' : 'Create VR360 Link'}
      </button>
    </form>
  );
};
```

---

## 🎯 Recommendation

**Nên dùng:** Service layer (`vr360Service.ts`) + Hooks (`useVR360.ts`)
- ✅ Cleaner code
- ✅ Reusable logic
- ✅ Type-safe
- ✅ Error handling tập trung
- ✅ Easy to test

**Chỉ dùng direct API calls khi:**
- ⚠️ One-off requests
- ⚠️ Prototyping
- ⚠️ Custom logic không fit vào service pattern
