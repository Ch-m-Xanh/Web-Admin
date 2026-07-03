# Chạm Xanh - Web Admin (client)

Web app quản trị cho hệ sinh thái Chạm Xanh (React + Vite + TypeScript + Tailwind CSS + React Router + Axios + Recharts).

## Cài đặt và chạy

```bash
npm install
npm run dev
```

Mặc định chạy tại `http://localhost:5173`.

## Biến môi trường

Sao chép `.env.example` thành `.env` và chỉnh nếu cần:

```
VITE_API_BASE_URL=http://localhost:4000/api
```

Nếu không set, mặc định trỏ tới `http://localhost:4000/api`.

## Build / kiểm tra kiểu

```bash
npm run build      # tsc -b && vite build
npx tsc --noEmit   # chỉ kiểm tra type
```

## Deploy lên Render (Web Service)

App này là một Vite SPA (build ra file tĩnh trong `dist/`), không phải server Node. Để deploy trên Render dạng **Web Service** (thay vì Static Site), Render vẫn cần chạy được `npm start`, nên project dùng gói [`serve`](https://www.npmjs.com/package/serve) để phục vụ thư mục `dist/` như một web server nhỏ.

Cấu hình khi tạo Web Service trên Render:

- **Root Directory**: `client`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm run start` (chạy `serve -s dist -l $PORT`)
- **Environment Variables**:
  - `VITE_API_BASE_URL` — ví dụ `https://your-backend.onrender.com/api`

Lưu ý quan trọng:

- `VITE_API_BASE_URL` (và mọi biến `VITE_*` khác) được **build cứng vào bundle JS lúc build** (Vite inline chúng tại build-time), không phải đọc lúc runtime. Nếu đổi giá trị biến môi trường trên Render, phải **trigger một deploy mới** (build lại) để giá trị mới có hiệu lực — chỉ restart service sẽ không đủ.
- Cờ `serve -s` (single-page app mode) bật SPA fallback: mọi route không khớp file tĩnh sẽ trả về `index.html`, giúp React Router hoạt động đúng khi người dùng refresh hoặc truy cập trực tiếp một route con (vd `/plants`, `/articles/:id`).
- `serve` đọc cổng lắng nghe qua biến môi trường `$PORT` mà Render cấp tự động — không cần set thủ công.

## Cấu trúc thư mục

- `src/api` - axios instance + các hàm gọi API theo từng resource (auth, plants, users/admin, articles, categories, uploads)
- `src/components` - component dùng chung (ProtectedRoute, PlantFormModal, Pagination, Skeleton, ...)
- `src/context` - GlobalPopupContext (toast) và AuthContext (phiên đăng nhập)
- `src/layouts` - MainLayout (sidebar responsive + top bar)
- `src/pages` - các trang: Login, Dashboard, Plants, Users, Articles, ArticleDetail
- `src/services/socket.ts` - singleton Socket.IO client, tự nối tới host của `VITE_API_BASE_URL` (bỏ hậu tố `/api`)
- `src/types` - toàn bộ type dùng chung, khớp với API contract cố định

## Real-time (Socket.IO)

`PlantsPage` và `ArticlesPage` lắng nghe các sự kiện Socket.IO phát ra từ backend để tự cập nhật danh sách mà không cần bấm refresh, kể cả khi có 2 tab admin cùng mở:

- `plant:created`, `plant:updated` (payload là object `Plant` đầy đủ), `plant:deleted` (payload `{_id}`)
- `article:created`, `article:updated` (payload là object `Article` đầy đủ), `article:deleted` (payload `{_id}`)

Socket kết nối tới cùng host với REST API nhưng bỏ hậu tố `/api` (vd `VITE_API_BASE_URL=https://api.example.com/api` → socket connect `https://api.example.com`), vì backend gắn Socket.IO trên cùng HTTP server/port với REST API.

## Ghi chú / giả định

- `GET /api/categories` được code phòng thủ cho cả 2 dạng response: `string[]` hoặc `{value,label}[]`. Nếu API rỗng hoặc lỗi, dùng danh sách cứng fallback (`phong-ngu`, `ban-lam-viec`, `phong-bep`, `rau-cu-chua-benh`).
- Tất cả response API được giả định trả về **trực tiếp** đúng theo contract đã cho (vd `Plant[]` chứ không bọc trong `{plants: [...]}`, login trả `{token, user}` chứ không phải `{accessToken, refreshToken, user}`). Đây là điểm quan trọng cần thống nhất với backend.
- Trang Bài viết chỉ có xem danh sách/chi tiết, không có CRUD (theo yêu cầu).
- Nội dung bài viết (`content`) được hiển thị dạng plain text (`whitespace-pre-line`), không dùng `dangerouslySetInnerHTML`.
