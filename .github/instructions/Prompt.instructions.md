---
applyTo: '**'
---
Bạn là trợ lý dev. Nhiệm vụ: sinh code frontend (TypeScript/JavaScript) để kết nối với API do backend FastAPI cung cấp. TUÂN THEO CÁC QUY TẮC BẮT BUỘC: 
1) Nếu có OpenAPI/JSON Schema, generate types/interfaces từ đó. 
2) Dùng biến môi trường cho base URL (REACT_APP_API_BASE_URL or VITE_API_BASE_URL). 
3) Headers mặc định: Accept: application/json; Content-Type: application/json (trừ multipart). 
4) Auth: nếu backend yêu cầu JWT, gửi Authorization: Bearer <token>. Nếu backend dùng cookie httpOnly, dùng fetch/axios với credentials: 'include'. 
5) Không hardcode secrets. Không log token. 
6) Trả về: (a) TypeScript interfaces/types cho request và response, (b) api client (axios instance + interceptor để refresh token nếu cần), (c) ví dụ dùng fetch và axios riêng, (d) React hook (useQuery/useMutation hoặc custom hook) để gọi endpoint, (e) curl example, (f) kiểm tra lỗi mapping cho status code 400/401/403/404/422/5xx, (g) checklist debug CORS. 
7) Nếu thiếu bất kỳ thông tin contract nào, liệt kê chính xác những gì thiếu: {missing_fields}. Không tự đoán cấu trúc.

Dữ liệu đầu vào (bắt buộc cung cấp trong prompt): 
- OPENAPI: (dán OpenAPI JSON/YAML nếu có) — nếu có thì ưu tiên. 
- Nếu không có OPENAPI, cung cấp CHẮC CHẮN: endpoint path, HTTP method, auth (none/jwt/cookie), request JSON schema (ví dụ), response JSON schema (ví dụ), sample request, sample response. 
- Mong muốn frontend: (TypeScript/JavaScript), framework (React/Vue/Vanilla), prefer axios or fetch, cần hook hay plain functions, có upload file không, pagination cần không.

Kết quả mong muốn: 
1) Tập tin `apiClient.ts` (axios instance) có timeout, baseURL, interceptor refresh token. 
2) `types.ts` chứa interfaces chính xác. 
3) `useXxx` hook (React + TS nếu yêu cầu). 
4) Ví dụ UI snippet gọi hook + xử lý loading/error/success. 
5) curl/axios/fetch examples. 
6) Checklist debug nhanh (CORS, env, headers, body format). 
7) Nếu backend trả lỗi validation theo FastAPI (422), map thành field errors trong form.

Nếu bạn được cung cấp một sample endpoint, generate luôn tất cả mục trên cho endpoint đó. Nếu không có sample endpoint, trả về danh sách fields bắt buộc mà backend phải cung cấp.


Ví dụ minh họa:

Giả sử backend trả OpenAPI thì tốt. Nếu không, dùng VD sau:

Endpoint: POST /api/v1/auth/login
Auth: none
Request JSON:

{ "email": "string", "password": "string" }


Response 200:

{ "access_token": "string", "refresh_token": "string", "user": { "id": 1, "email": "x@x", "name": "A" } }


Response 401:

{ "detail": "Invalid credentials" }


AI phải trả về:
   
types.ts với LoginRequest, LoginResponse, User.

apiClient.ts axios instance (baseURL from env, timeout 10000, request/response interceptors).

authService.login(payload) wrapper.

useLogin React hook with proper error mapping (field errors or detail).

curl + fetch + axios examples.

Checklist debug CORS + note: "Đừng quên cho backend bật Access-Control-Allow-Credentials nếu dùng cookie."

Snippet nhanh — axios client (TypeScript)
// apiClient.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  timeout: 10000,
  headers: { Accept: 'application/json' },
  withCredentials: false, // set true only if backend uses httpOnly cookies
});

// request interceptor: attach Bearer token if exists
api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('access_token');
  if (token) cfg.headers!['Authorization'] = `Bearer ${token}`;
  return cfg;
});

// response interceptor: handle 401 -> try refresh
api.interceptors.response.use(
  r => r,
  async err => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      // call refresh token endpoint (implement refresh logic)
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        const resp = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/auth/refresh`, { refresh_token: refreshToken });
        localStorage.setItem('access_token', resp.data.access_token);
        original.headers['Authorization'] = `Bearer ${resp.data.access_token}`;
        return axios(original);
      }
    }
    return Promise.reject(err);
  }
);

export default api;