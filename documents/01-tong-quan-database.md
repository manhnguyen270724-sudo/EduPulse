# 01. Tổng Quan Kiến Trúc Cơ Sở Dữ Liệu

## 1. Công nghệ sử dụng
- **Database Engine:** MongoDB (Hệ quản trị cơ sở dữ liệu phi quan hệ NoSQL, định dạng Document JSON/BSON).
- **ODM (Object Data Modeling):** [Mongoose](https://mongoosejs.com/) (v8.1.2) - Thư viện định nghĩa Schema, Data Validation và Hooks trên nền Node.js.
- **Tên Database mặc định:** `eLearning` (được cấu hình tự động trong [db.js](file:///c:/Project/e-Learning-Platform/backend/src/database/db.js)).
- **Cơ chế phân tán:** MongoDB Atlas Cloud Cluster với khả năng Auto Scaling và Replica Set đảm bảo tính sẵn sàng cao.

---

## 2. Danh sách các Collections (Bảng) trong Hệ thống

Hệ thống E-Learning gồm **8 Schemas chính** tương ứng với 6 Collections thực tế trong cơ sở dữ liệu:

| STT | Tên Collection | Model Export | Mục đích lưu trữ |
| :--- | :--- | :--- | :--- |
| 1 | `admins` | `admin` | Tài khoản quản trị viên tối cao (xét duyệt giáo viên, học sinh, khóa học). |
| 2 | `students` | `student` | Thông tin tài khoản học sinh, trạng thái KYC, token xác thực. |
| 3 | `studentdocs` | `studentdocs` | Hồ sơ chi tiết học vấn, bảng điểm, căn cước công dân của học sinh. |
| 4 | `teachers` | `Teacher` | Thông tin tài khoản giảng viên, số dư ví, lịch sử rút tiền. |
| 5 | `teacherdocs` | `Teacherdocs` | Hồ sơ bằng cấp (Đại học/Thạc sĩ), kinh nghiệm, căn cước của giảng viên. |
| 6 | `courses` | `course` | Thông tin khóa học, lịch học, danh sách bài học và link lớp học online. |
| 7 | `payments` | `payment` | Nhật ký giao dịch thanh toán mua khóa học qua cổng Razorpay. |
| 8 | `contacts` | `contact` | Tin nhắn hỗ trợ và phản hồi từ người dùng gửi tới hệ thống. |

---

## 3. Đặc điểm thiết kế dữ liệu của hệ thống

1. **Tách biệt Thông tin cơ bản và Hồ sơ KYC (Document Normalization):**
   - Tài khoản `students` được tách riêng với `studentdocs`.
   - Tài khoản `teachers` được tách riêng với `teacherdocs`.
   - **Lợi ích:** Giúp truy vấn đăng nhập nhanh nhẹn, chỉ nạp dữ liệu hồ sơ nặng (ảnh chứng chỉ, bằng cấp) khi Admin cần duyệt hồ sơ.

2. **Cấu trúc nhúng (Embedded Sub-documents):**
   - `liveClasses` và `schedule` được nhúng trực tiếp bên trong `courses`.
   - `WithdrawalHistory` và `enrolledStudent` được nhúng trực tiếp trong `teachers`.
   - **Lợi ích:** Giảm thiểu phép `JOIN` / `$lookup`, tăng tốc độ đọc dữ liệu lịch học và số dư ví.

3. **Bảo mật nhiều lớp:**
   - Mật khẩu được băm tự động bằng thuật toán **Bcrypt (Salt round = 10)** thông qua pre-save hook của Mongoose.
   - Quản lý phiên bằng cặp mã thông báo **JWT Access Token (1 ngày)** và **Refresh Token (10 ngày)**.
