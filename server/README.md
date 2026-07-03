# Cham Xanh - Backend API

API trung tam cho he sinh thai Cham Xanh (Web Admin, Web User, App Android, App iOS).
Node.js + Express + TypeScript + MongoDB (Mongoose).

## Chay local

```bash
npm install
cp .env.example .env   # roi chinh sua MONGODB_URI, JWT_SECRET,... cho phu hop
npm run seed            # tao du lieu mau (2 user, 5 plant, 2 article)
npm run dev             # chay server voi ts-node-dev, mac dinh cong 5000
```

Tai khoan mau sau khi seed:
- Admin: `admin@chamxanh.vn` / `admin123`
- User: `user@chamxanh.vn` / `user123`

Build production:
```bash
npm run build
npm start
```

## Format loi chuan (dung cho Global Popup FE/mobile)

Moi loi tra ve deu co dang:
```json
{ "error": { "message": "Mo ta loi bang tieng Viet", "code": "MA_LOI" } }
```

## Danh sach endpoint (prefix /api)

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me` (Bearer token)

### Plants (Kham pha)
- `GET /api/plants?category=&search=&isMedicinal=`
- `GET /api/plants/:id` (tang viewCount)
- `POST /api/plants` (admin)
- `PUT /api/plants/:id` (admin)
- `DELETE /api/plants/:id` (admin)

### Categories
- `GET /api/categories`

### Articles
- `GET /api/articles`
- `GET /api/articles/:id`

### User Plants (vuon ca nhan)
- `GET /api/user-plants` (auth)
- `POST /api/user-plants` (auth)
- `PUT /api/user-plants/:id` (auth)
- `PUT /api/user-plants/:id/reminder` (auth)
- `DELETE /api/user-plants/:id` (auth)

### Posts (Grid/Calendar Ho so vuon)
- `GET /api/posts?userId=`
- `POST /api/posts` (auth)

### Users / Follow
- `POST /api/users/:id/follow` (auth)
- `DELETE /api/users/:id/follow` (auth)

### Chat (mock bot, TODO tich hop LLM that trong src/routes/chat.ts)
- `GET /api/chat/messages` (auth)
- `POST /api/chat/messages` (auth)

### Uploads
- `POST /api/uploads` (multipart field `file`) -> `{ url }`, file duoc phuc vu tinh tai `/uploads/<filename>`

### Admin
- `GET /api/admin/stats` (admin)
- `GET /api/admin/users` (admin)
- `PUT /api/admin/users/:id` (admin) - khoa/mo khoa, doi role
- `DELETE /api/admin/users/:id` (admin)

## Cau truc thu muc

```
src/
  models/        Mongoose schemas (User, Plant, Article, UserPlant, Post, ChatMessage)
  routes/        Express routers theo tung resource
  middleware/    auth (JWT), upload (multer), errorHandler
  utils/         AppError, asyncHandler, categories
  app.ts         Khoi tao Express app + CORS + routes
  db.ts          Ket noi MongoDB
  index.ts       Entry point
  seed.ts        Script tao du lieu mau
```
