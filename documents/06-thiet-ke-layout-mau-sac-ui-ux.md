# HỆ THỐNG THIẾT KẾ GIAO DIỆN (DESIGN SYSTEM), MÀU SẮC & BỐ CỤC EDUPULSE
**Dự án:** EduPulse - Nền tảng Giáo dục Trực tuyến & Cố vấn Chuyên gia  
**Trụ sở chính:** 99 Tô Hiến Thành, Phước Mỹ, Sơn Trà, TP. Đà Nẵng  
**Định vị:** Modern Academic Elegance (Học thuật hiện đại & Trang nhã)

---

## 1. TRIẾT LÝ THIẾT KẾ & BẢNG MÀU (COLOR PALETTE)

### 1.1. Câu trả lời về màu sắc: Đơn sắc hay Neon?
Website EduPulse **HOÀN TOÀN KHÔNG DÙNG MÀU NEON CHÓI LÓA** và cũng **KHÔNG DÙNG MÀU ĐƠN SẮC PHẲNG LÌ (FLAT SOLID)**:
- **Lý do không dùng Neon:** Màu neon rực rỡ, phát quang mạnh thường chỉ phù hợp với game, sòng bạc hoặc giải trí về đêm. Trong môi trường học thuật, neon gây chói lóa, mỏi mắt khi học viên đọc tài liệu lâu và làm giảm sự tin cậy, trang nghiêm của một cơ sở giáo dục.
- **Lý do không dùng Đơn sắc thô (Flat solid):** Các khối màu đơn điệu khiến trang web trông lỗi thời như giao diện web những năm 2010.
- **Giải pháp của EduPulse - Bảng màu Academic University Palette kết hợp Duotone Gradient:**
  - Lấy cảm hứng từ các trường đại học danh tiếng thế giới (Oxford, Cambridge, MIT), EduPulse sử dụng gam màu **Xanh hoàng gia (Royal Blue)** và **Xanh dương đại học (University Sky)** phối hợp trên nền giấy ngà hiện đại.
  - Sử dụng hiệu ứng chuyển màu êm dịu (**Subtle Brand Gradient**) từ `#0284c7` sang `#2563eb` để tạo điểm nhấn thị giác tinh tế, mang lại cảm giác tri thức, tin cậy và chuyên nghiệp.

### 1.2. Bảng mã màu chi tiết giữa 2 chế độ (Light Mode & Dark Mode)

| Thành Phần Giao Diện | Chế Độ Sáng (Light Mode - MẶC ĐỊNH) | Chế Độ Tối (Dark Mode) | Ý Nghĩa / Cảm Xúc Thiết Kế |
| :--- | :--- | :--- | :--- |
| **Màu Nền Chính (Canvas)** | `#f8fafc` (Trắng sứ ngà) | `#060c1c` (Xanh đêm Midnight) | Tạo nền êm dịu cho mắt, không bị trắng gắt 100% gây chói. |
| **Màu Nền Thẻ Thùng (Surface)**| `#ffffff` (Trắng tinh khiết) | `#0a1329` (Xanh hải quân đậm) | Nổi bật thông tin trên nền chính, phân cấp thị giác rõ ràng. |
| **Màu Chữ Chính (Heading)** | `#0f172a` (Slate 900 - Đen than) | `#f8fafc` (Trắng sáng) | Đạt độ tương phản chuẩn quốc tế WCAG AAA, đọc văn bản rõ nét. |
| **Màu Chữ Phụ (Body/Desc)** | `#475569` (Slate 600) | `#94a3b8` (Slate 400) | Giảm mỏi mắt khi đọc các đoạn mô tả dài. |
| **Màu Chủ Đạo (Primary Accent)**| `#0284c7` (Xanh tri thức) | `#38bdf8` (Xanh cyan dịu) | Nhấn mạnh liên kết, nút hành động, huy hiệu chính thức. |
| **Dải Chuyển Màu (Brand Gradient)**| `linear-gradient(135deg, #0284c7 0%, #2563eb 100%)` | `linear-gradient(135deg, #00d2ff 0%, #3a86ff 100%)` | Dành cho nút CTA chính (Đăng ký, Đăng nhập) và chữ nghệ thuật. |
| **Màu Viền Khối (Borders)** | `#e2e8f0` (Xám tro siêu mảnh 1px) | `rgba(255, 255, 255, 0.08)` | Tách bạch các khối nội dung một cách tự nhiên, tinh tế. |
| **Đổ Bóng (Elevation Shadows)**| `0 4px 20px -2px rgba(0, 0, 0, 0.05)` | `0 10px 30px -10px rgba(0, 0, 0, 0.5)` | Tạo chiều sâu 3D đa tầng mềm mại mà không cần viền đen đậm. |

---

## 2. BỘ FONT CHỮ CỐ ĐỊNH & NGUYÊN TẮC HÌNH ẢNH

### 2.1. Bộ System Font Cố Định (Native System Font Stack)
Website sử dụng bộ font hệ thống tiêu chuẩn quốc tế:
```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
```
- **Ưu điểm vượt trội:**
  - **Tốc độ tải trang 0ms (Zero latency):** Font đã có sẵn trong mọi hệ điều hành (Windows, macOS, iOS, Android), không cần tải bất kỳ tệp font nào từ Google Fonts hay CDN bên ngoài.
  - **Hoạt động ổn định khi mạng chậm hoặc offline:** Không bao giờ xảy ra hiện tượng chữ bị giật, nháy font (FOUT/FOIT).
  - **Độ sắc nét hoàn hảo:** Tối ưu hóa với công nghệ khử răng cưa của từng màn hình máy tính và điện thoại.

### 2.2. Nguyên tắc loại bỏ Emoji / Icon AI
- Thay vì sử dụng emoji đồ họa màu sắc như 📐, ⚡, 🧪, 💻 (thường tạo cảm giác thiếu nghiêm túc và mang dấu vết của AI tạo tự động), EduPulse chuyển sang:
  - **Nhãn chữ tối giản (Minimalist Text Badges):** Ví dụ `TOÁN HỌC`, `TIẾNG ANH & IELTS`, `KHOA HỌC DỮ LIỆU`.
  - **Huy hiệu số thứ tự học thuật:** Các khối giá trị được đánh số `01`, `02`, `03`, `04` trang trọng.
  - **Icon đường nét hình học chuẩn mực (Vector Outlined Icons):** Chỉ sử dụng icon đơn sắc của thư viện React Icons cho các tác vụ cần thiết (icon kính lúp tìm kiếm, icon camera buổi học Live, icon dấu tích xác thực giảng viên).

---

## 3. BỐ CỤC (LAYOUT ARCHITECTURE) TOÀN BỘ WEBSITE

Website tuân thủ hệ thống lưới chuẩn **12-Column Responsive Grid** với chiều rộng tối đa **1280px** căn giữa, khoảng đệm an toàn `padding: 0 24px`:

```
┌─────────────────────────────────────────────────────────────────────────┐
│ HEADER CỐ ĐỊNH (Cao 76px, Kính mờ Blur 16px, Logo + Menu + Nút Đổi Theme + Auth)│
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│                      VÙNG NỘI DUNG CHÍNH (MAIN BODY)                    │
│                      (Max-width: 1280px, Responsive)                    │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│ FOOTER HỌC THUẬT (4 Cột: Trụ sở 99 Tô Hiến Thành ĐN + Khám phá + Chuyên môn + Cam kết)│
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 4. CHI TIẾT BỐ CỤC TỪNG TRANG TRONG HỆ THỐNG

### 4.1. Trang Chủ (Landing Page - `/`)
- **Khối 1: Header (Thanh điều hướng):**
  - Trái: Logo EduPulse xanh dương + Tên thương hiệu + Tagline `ACADEMY`.
  - Giữa: Menu liên kết (Trang Chủ, Khóa Học, Về Chúng Tôi, Liên Hệ) có gạch chân phát sáng khi active.
  - Phải: Nút công tắc chuyển đổi Sáng/Tối (Mặt trời / Mặt trăng) + Nút Đăng Nhập + Nút Đăng Ký bo góc 8px.
- **Khối 2: Hero Section (Khu vực chào đón):**
  - Bố cục 2 cột bất đối xứng (Tỉ lệ vàng 1.2fr : 0.9fr):
    - *Cột trái:* Huy hiệu vị trí trụ sở Đà Nẵng -> Tiêu đề lớn 52px ("Nâng Tầm Tri Thức, Vững Bước Tương Lai Cùng EduPulse") -> Mô tả ngắn -> Thanh tìm kiếm nhanh thời gian thực -> Nút CTA Đăng ký.
    - *Cột phải:* Hình minh họa học tập giảng đường hiện đại.
- **Khối 3: Thống Kê Năng Lực (Metrics Bar):**
  - Khối chữ nhật bo góc 16px gồm 4 ô số liệu phân tách bằng đường kẻ dọc: `15,000+` Học viên, `100%` Giảng viên thẩm định, `98%` Đạt điểm mục tiêu, `24/7` Đồng hành.
- **Khối 4: Giá Trị Vượt Trội & E-Mentor Showcase:**
  - Lưới 3 thẻ tính năng (Cố vấn chuyên môn, Lớp Live Google Meet, Hỗ trợ 24/7).
  - Khi click vào thẻ Cố vấn, mở rộng bên dưới danh sách Hội đồng Giảng viên tiêu biểu với ảnh avatar Cloudinary, bằng cấp trường đại học và số năm kinh nghiệm.
- **Khối 5: Thám Hiểm Môn Học & Giảng Viên:**
  - Hàng nút Pill lọc môn học: Toán, Lý, Hóa, Sinh, Tin, IELTS, AI, Tài chính.
  - Lưới thẻ card Giảng viên: Card bo góc 20px, viền sáng mảnh, hiển thị avatar, tên giảng viên, email, mô tả khóa học và lịch học Google Meet.
- **Khối 6: Về Chúng Tôi & 4 Trụ Cột:**
  - Hình minh họa bên trái, khối nội dung bên phải và 4 bước số thứ tự `01`, `02`, `03`, `04`.

---

### 4.2. Trang Danh Mục Khóa Học (Courses Page - `/courses`)
- **Phần 1: Hero Banner Khóa Học:**
  - Tiêu đề trung tâm: "Hệ Thống Khóa Học & Cố Vấn Học Thuật".
  - Thanh tìm kiếm lớn (Search Bar) tích hợp icon kính lúp, cho phép học viên gõ từ khóa để lọc ngay lập tức theo tên môn, giảng viên hoặc bài học.
- **Phần 2: Thanh Phân Loại Danh Mục (Categories Pill Row):**
  - Hàng nút lọc bo tròn 10px nằm ngang: `Tất Cả Môn Học`, `Toán Học`, `Vật Lý`, `Hóa Học`, `Sinh Học`, `Tin Học & Web`, `Tiếng Anh & IELTS`, `Khoa Học Dữ Liệu`, `Kinh Tế & Tài Chính`.
- **Phần 3: Lưới Khóa Học Thế Hệ Mới (Course Cards Grid):**
  - Bố cục lưới 3 cột thích ứng (`repeat(auto-fill, minmax(360px, 1fr))`).
  - Cấu trúc mỗi Card:
    - *Header Card:* Tag môn học phát sáng nhẹ bên trái, Chấm xanh phát xung `Lớp Live Google Meet` bên phải.
    - *Khối Giảng Viên:* Ảnh avatar Cloudinary sắc nét, viền xanh 2px, dấu tích xác thực xanh dương, họ tên in đậm, chức danh học thuật.
    - *Nội Dung Khóa Học:* Tiêu đề khóa học, tóm tắt lộ trình học, ô xem trước thời lượng buổi học (90 phút) và lịch học tuần.
    - *Hành Động:* Nút bấm "Đăng Ký Khóa Học" gradient xanh nổi bật + Nút "Chi Tiết" dẫn đến hồ sơ bằng cấp.

---

### 4.3. Trang Đăng Nhập & Đăng Ký (Auth Pages - `/login`, `/signup`)
- **Bố Cục Hai Cột Đối Xứng (Split Card Layout):**
  - *Bên trái:* Tranh minh họa giáo dục phong cách phẳng thanh lịch với thông điệp truyền cảm hứng.
  - *Bên phải:* Khối Form kính mờ (Glassmorphism):
    - Tab chuyển đổi vai trò: **Học Sinh** / **Giảng Viên** dạng nút chuyển đổi mượt mà.
    - Các ô nhập liệu (Input field) có icon định danh, viền xám sáng khi chưa focus, đổi sang viền xanh dương phát sáng khi focus.
    - Nút Đăng nhập/Đăng ký dạng gradient kéo dài 100% bề ngang.
    - Liên kết Quên mật khẩu và chuyển đổi qua lại giữa Đăng nhập và Đăng ký.

---

### 4.4. Trang Quản Trị Hệ Thống (Admin Login - `/adminLogin`)
- **Bố Cục Thẻ Trung Tâm (Centered Vault Card):**
  - Thẻ form căn giữa màn hình với biểu tượng khiên bảo mật màu vàng hổ phách (`Amber Shield`), biểu thị khu vực quản trị an ninh cao.
  - Thiết kế nghiêm mật, tối giản, phân định rõ ràng với giao diện học viên thông thường.

---

### 4.5. Trang Giới Thiệu (About - `/about`)
- **Bố cục Kể Chuyện (Narrative Layout):**
  - Banner giới thiệu hành trình phát triển của EduPulse.
  - Khối câu chuyện thương hiệu nhấn mạnh trung tâm đổi mới sáng tạo tại **99 Tô Hiến Thành, Đà Nẵng**.
  - 3 cột sứ mệnh: Sứ mệnh học thuật, Cam kết chất lượng 100% bằng cấp thẩm định, Tận tâm đồng hành 24/7.
  - 4 trụ cột phát triển với mã số `01`, `02`, `03`, `04`.

---

### 4.6. Trang Liên Hệ (Contact - `/contact`)
- **Bố Cục 2 Cột Độc Lập (Contact Grid):**
  - *Cột trái (Thông tin trực tiếp):* Thẻ danh bạ hiển thị Địa chỉ trụ sở tại **99 Tô Hiến Thành, Phước Mỹ, Sơn Trà, TP. Đà Nẵng**, Email học vụ `support@edupulse.vn`, Hotline `0236 7300 888`, Thời gian làm việc (08:00 - 22:00) kèm tranh minh họa.
  - *Cột phải (Form gửi tin nhắn):* Ô nhập Họ tên, Email, Nội dung tin nhắn và nút "Gửi Tin Nhắn Hỗ Trợ" gửi thẳng về database cho Admin xử lý.

---

### 4.7. Trang Bảng Điều Khiển (Dashboard Học Viên & Giảng Viên)
- **Bố Cục Sidebar + Nội Dung Chính (Dashboard Grid):**
  - *Thanh điều hướng bên trái (Sidebar 220px):* Ảnh đại diện Cloudinary tròn, họ tên, nhãn vai trò (`Học Viên` hoặc `Giảng Viên`), các nút chuyển tab (Khóa học của tôi, Lịch lớp học, Tìm kiếm giảng viên, Rút tiền).
  - *Banner trên cùng (Top Welcome Banner):* Lời chào cá nhân hóa, tên học viên/giảng viên, logo EduPulse và nút Đăng xuất an toàn.
  - *Khu vực làm việc chính:* Hiển thị danh sách lớp Live Google Meet đang diễn ra, bảng số dư thù lao giảng dạy và lịch sử giao dịch.
