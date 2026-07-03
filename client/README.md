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

## Cấu trúc thư mục

- `src/api` - axios instance + các hàm gọi API theo từng resource (auth, plants, users/admin, articles, categories, uploads)
- `src/components` - component dùng chung (ProtectedRoute, PlantFormModal, ...)
- `src/context` - GlobalPopupContext (toast) và AuthContext (phiên đăng nhập)
- `src/layouts` - MainLayout (sidebar + top bar)
- `src/pages` - các trang: Login, Dashboard, Plants, Users, Articles, ArticleDetail
- `src/types` - toàn bộ type dùng chung, khớp với API contract cố định

## Ghi chú / giả định

- `GET /api/categories` được code phòng thủ cho cả 2 dạng response: `string[]` hoặc `{value,label}[]`. Nếu API rỗng hoặc lỗi, dùng danh sách cứng fallback (`phong-ngu`, `ban-lam-viec`, `phong-bep`, `rau-cu-chua-benh`).
- Tất cả response API được giả định trả về **trực tiếp** đúng theo contract đã cho (vd `Plant[]` chứ không bọc trong `{plants: [...]}`, login trả `{token, user}` chứ không phải `{accessToken, refreshToken, user}`). Đây là điểm quan trọng cần thống nhất với backend.
- Trang Bài viết chỉ có xem danh sách/chi tiết, không có CRUD (theo yêu cầu).
- Nội dung bài viết (`content`) được hiển thị dạng plain text (`whitespace-pre-line`), không dùng `dangerouslySetInnerHTML`.
