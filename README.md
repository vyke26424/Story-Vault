# 📚 Nền Tảng Thương Mại Điện Tử Manga / Truyện Tranh

Dự án này là một nền tảng thương mại điện tử chuyên cung cấp và bán lẻ truyện tranh, manga, và các loại sách. Dự án được xây dựng với kiến trúc Fullstack, kết hợp giữa backend mạnh mẽ và frontend hiện đại, mượt mà.

## 🌟 Tính Năng Nổi Bật

- **Giao diện thân thiện và mượt mà**: Frontend sử dụng React và Vite, mang lại trải nghiệm người dùng tối ưu, nhanh chóng.
- **Quản lý sản phẩm & Phân trang**: Admin có thể quản lý các series truyện, tập truyện, và phân trang dễ dàng.
- **Giỏ hàng & Đơn hàng**: Hỗ trợ giỏ hàng, hiển thị rõ giá gốc và giá khuyến mãi.
- **Xác thực bảo mật cao cấp (JWT với HttpOnly Cookies)**:
  - Loại bỏ hoàn toàn việc lưu trữ `refreshToken` trong LocalStorage hoặc Zustand.
  - Sử dụng cơ chế Backend tự đọc/ghi `refreshToken` thông qua **HttpOnly Cookie**, ngăn chặn hoàn toàn các cuộc tấn công XSS (Hacker không thể dùng Javascript để đánh cắp token).
  - Quản lý đa tài khoản mượt mà: Xử lý đăng xuất/đăng nhập lại an toàn mà không để lại token cũ.
- **Trang Admin đa chức năng**: Quản lý kho hàng, nhập kho, quản lý sản phẩm, danh mục, và theo dõi đơn hàng.
- **Trang 404 Custom**: Trang báo lỗi không tìm thấy đường dẫn được thiết kế riêng.
- **Responsive Design**: Đảm bảo hiển thị hoàn hảo trên các thiết bị di động, tablet, và desktop.

## 🛠 Tech Stack

### Frontend (Client)
- **Framework**: React 19, Vite
- **Styling**: Tailwind CSS, Framer Motion
- **State Management**: Zustand
- **Routing**: React Router DOM
- **Data Fetching**: Axios
- **Khác**: Swiper, Recharts, Leaflet, Lucide React

### Backend (Server)
- **Framework**: NestJS (Node.js)
- **ORM / Database**: Prisma
- **Security**: JWT, Passport, Bcrypt, Argon2, Throttler (Rate Limiting)
- **Upload Image**: Cloudinary
- **Khác**: Class-validator, Class-transformer

## 📁 Cấu Trúc Thư Mục

```
.
├── backend/       # NestJS Server & Prisma Database Schema
├── frontend/      # React Client & Tailwind CSS
├── data/          # Các file dữ liệu/tài nguyên tĩnh (nếu có)
└── README.md      # Tài liệu dự án
```

## 🚀 Hướng Dẫn Cài Đặt Và Khởi Chạy

### 1. Yêu cầu hệ thống
- **Node.js** (Khuyến nghị phiên bản 18+ hoặc 20+)
- **NPM** hoặc **Yarn**
- Hệ quản trị CSDL (ví dụ: PostgreSQL hoặc MySQL, tùy cấu hình trong file Prisma)

### 2. Cài đặt và chạy Backend

```bash
cd backend
npm install
```

- Tạo file `.env` dựa trên `.env.example` (cần thiết lập chuỗi kết nối DATABASE_URL, cấu hình JWT, Cloudinary,...).
- Chạy migrate database:
```bash
npx prisma migrate dev
```
- Seed dữ liệu Admin (nếu cần):
```bash
npm run db:seed:admin
```
- Khởi chạy server:
```bash
npm run start:dev
```

### 3. Cài đặt và chạy Frontend

```bash
cd frontend
npm install
```

- Tạo file `.env` cho frontend và cấu hình URL API Backend (ví dụ: `VITE_API_URL=http://localhost:3000`).
- Khởi chạy ứng dụng:
```bash
npm run dev
```

## 🛡️ Bảo Mật & Lưu Ý

Dự án này áp dụng phương pháp bảo mật tốt nhất cho việc xác thực (Authentication). Thay vì để frontend tự quản lý Refresh Token, hệ thống backend sẽ tự động thiết lập thẻ **HttpOnly Cookie** mỗi khi người dùng đăng nhập. Phương pháp này giúp hệ thống miễn nhiễm với các đoạn mã Javascript độc hại cố gắng lấy cắp thông tin xác thực từ phía Client.

## 📞 Liên Hệ & Góp Ý
Mọi thắc mắc và đóng góp xin vui lòng để lại Issue trong kho lưu trữ hoặc gửi thông qua form **Liên Hệ Feedback** trên website. Cửa hàng chính của chúng tôi tọa lạc tại Bình Thạnh, TP.HCM.

---
*Cảm ơn bạn đã quan tâm đến dự án. Chúc bạn một ngày tốt lành!*
