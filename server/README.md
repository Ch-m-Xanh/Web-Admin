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

## Co so du lieu (MongoDB) - luu tru ben vung

Co 2 cach chay MongoDB cho moi truong local:

**(a) Cai MongoDB Community Server** truc tiep tren may (https://www.mongodb.com/try/download/community),
chay nhu 1 service he thong, du lieu luu tai thu muc data mac dinh cua he dieu hanh.

**(b) Dung Docker** (khuyen nghi, khong can cai dat MongoDB thu cong):
```bash
docker compose up -d
```
File `docker-compose.yml` da khai bao service `mongo` (image `mongo:7`) voi named volume
`cham-xanh-mongo-data`, du lieu se KHONG bi mat khi container restart/stop (chi mat khi
xoa han volume bang `docker compose down -v`). Ket noi qua `MONGODB_URI=mongodb://localhost:27017/cham-xanh`.

### Production: MongoDB Atlas (free tier)

1. Tao tai khoan tai https://www.mongodb.com/cloud/atlas/register, tao 1 cluster mien phi (M0).
2. Trong **Network Access**, whitelist IP `0.0.0.0/0` (cho phep tu moi noi - don gian nhat khi deploy
   len Render vi Render khong co IP tinh co dinh) hoac dai IP cua Render neu ban dung tinh nang IP tinh.
3. Trong **Database Access**, tao 1 user/password rieng cho ung dung.
4. Lay connection string dang `mongodb+srv://<user>:<password>@<cluster>.mongodb.net/cham-xanh?retryWrites=true&w=majority`.
5. Dan chuoi nay vao bien moi truong `MONGODB_URI` tren Render (khong commit vao code/`.env`).

## Real-time (Socket.IO)

Socket.IO duoc gan chung 1 HTTP server voi Express (`http.createServer(app)` trong `src/index.ts`),
phu hop voi Render Web Service (chi expose 1 port). Khoi tao trong `src/socket.ts`.

**Ket noi tu client:**
```js
import { io } from "socket.io-client";
const socket = io("https://<your-render-domain>", {
  auth: { token: "<JWT access token, tuy chon>" },
});
```
Neu client gui `token` hop le qua `socket.handshake.auth.token`, server se tu dong join client
vao room rieng `user:<userId>` de nhan cac su kien ca nhan. Neu khong gui token (hoac token sai),
client van ket noi binh thuong va van nhan duoc cac su kien public - khong bi loi/crash.

**Su kien public** (broadcast cho tat ca client, khong can auth) - phat ngay sau khi ghi DB thanh cong:
| Event | Khi nao | Payload |
|---|---|---|
| `plant:created` | POST `/api/plants` thanh cong | object Plant day du |
| `plant:updated` | PUT `/api/plants/:id` thanh cong | object Plant day du sau update |
| `plant:deleted` | DELETE `/api/plants/:id` thanh cong | `{ _id: string }` |
| `article:created` | (chua co route tao article) | object Article day du |
| `article:updated` | (chua co route sua article) | object Article day du |
| `article:deleted` | (chua co route xoa article) | `{ _id: string }` |

**Su kien rieng theo user** (chi gui vao room `user:<userId>`, dung de dong bo vuon ca nhan
giua nhieu thiet bi cung 1 tai khoan):
| Event | Khi nao | Payload |
|---|---|---|
| `user-plant:created` | POST `/api/user-plants` thanh cong | object UserPlant day du |
| `user-plant:updated` | PUT `/api/user-plants/:id` hoac `/:id/reminder` thanh cong | object UserPlant day du |
| `user-plant:deleted` | DELETE `/api/user-plants/:id` thanh cong | `{ _id: string }` |

## Deploy len Render (Web Service)

- **Root Directory**: `server`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm run start`
- **Environment variables** can thiet lap trong Render Dashboard:
  - `MONGODB_URI` - connection string MongoDB Atlas
  - `JWT_SECRET`
  - `JWT_REFRESH_SECRET`
  - `ALLOWED_ORIGINS` - danh sach domain duoc phep goi CORS/Socket.IO, phan cach boi dau phay,
    vi du `https://admin.chamxanh.vn,https://app.chamxanh.vn`. Nho cap nhat bien nay voi domain
    THAT cua Web Admin va Web User sau khi ho deploy xong, neu khong request tu trinh duyet se bi CORS chan.
  - Render tu dong set `PORT` - code da doc `process.env.PORT` san, khong can cau hinh them.

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
