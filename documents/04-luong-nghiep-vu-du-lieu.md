# 04. Luồng Nghiệp Vụ & Tương Tác Dữ Liệu

Tài liệu này mô tả cách thức dữ liệu di chuyển và được cập nhật giữa các bảng trong các tình huống thực tế của website.

---

## Luồng 1: Quy trình Đăng ký & Xét duyệt hồ sơ (KYC Approval)

Hệ thống yêu cầu cả Học sinh và Giảng viên phải qua bước kiểm duyệt hồ sơ để đảm bảo chất lượng và an toàn.

```mermaid
sequenceDiagram
    autonumber
    actor User as Giảng viên / Học viên
    participant FE as Frontend React
    participant BE as Backend Express
    participant Cloud as Cloudinary
    participant DB as MongoDB Atlas
    actor Admin as Quản trị viên (Admin)

    User->>FE: Điền thông tin cá nhân & Upload ảnh bằng cấp/CCCD
    FE->>BE: Gửi multipart/form-data
    BE->>Cloud: Upload ảnh hồ sơ
    Cloud-->>BE: Trả về link CDN ảnh bảo mật
    BE->>DB: Lưu hồ sơ chi tiết vào studentdocs / teacherdocs
    BE->>DB: Tạo tài khoản students / teachers với Isapproved = "pending"
    Admin->>FE: Đăng nhập Dashboard Admin
    FE->>BE: GET /api/admin/:id/approve
    BE->>DB: Query các user có Isapproved == "pending"
    DB-->>FE: Hiển thị danh sách hồ sơ cần duyệt kèm ảnh bằng cấp
    Admin->>FE: Bấm Phê duyệt (Approve) hoặc Từ chối (Reject/Reupload)
    FE->>BE: POST /api/admin/:id/approve/teacher/:teacherID
    BE->>DB: Cập nhật Isapproved = "approved" (kèm Remarks nếu từ chối)
    BE-->>User: Gửi email thông báo kết quả xét duyệt qua SMTP Gmail
```

---

## Luồng 2: Mua Khóa học & Xác minh Thanh toán (Razorpay Checkout)

Đảm bảo tính toàn vẹn tài chính, chỉ mở quyền truy cập khóa học khi chữ ký mã hóa SHA256 trùng khớp 100%.

```mermaid
sequenceDiagram
    autonumber
    actor Student as Học sinh
    participant FE as Frontend React
    participant BE as Backend Express
    participant RZP as Cổng Razorpay
    participant DB as MongoDB Atlas

    Student->>FE: Bấm nút "Mua khóa học" (Buy Course)
    FE->>BE: POST /api/payment/checkout (gửi courseID & amount)
    BE->>RZP: Khởi tạo Order (instance.orders.create)
    RZP-->>BE: Trả về razorpay_order_id
    BE-->>FE: Trả về order_id và KEY_ID công khai
    FE->>Student: Hiển thị popup thanh toán Razorpay Checkout
    Student->>RZP: Nhập thông tin thẻ test và xác nhận thanh toán
    RZP-->>FE: Trả về: razorpay_order_id, razorpay_payment_id, razorpay_signature
    FE->>BE: POST /api/payment/paymentverification
    Note over BE: Tạo mã băm crypto HMAC SHA256:<br/>HMAC(order_id + "|" + payment_id, KEY_SECRET)
    alt Chữ ký hợp lệ (Signature Verified)
        BE->>DB: Lưu bản ghi mới vào bảng `payments`
        BE->>DB: Thêm studentID vào mảng `courses.enrolledStudent`
        BE->>DB: Thêm studentId vào mảng `teachers.enrolledStudent`
        BE->>DB: Cộng tiền vào ví giảng viên (`teachers.Balance += amount`)
        BE-->>FE: Redirect sang trang Khóa học đã mua thành công!
    else Chữ ký sai lệch (Giả mạo)
        BE-->>FE: Báo lỗi thanh toán thất bại
    end
```

---

## Luồng 3: Quản lý Lớp học Trực tuyến (Live Classes)

Giảng viên lên lịch học trực tiếp tương tác 2 chiều với học sinh:

```mermaid
flowchart TD
    A[Giảng viên truy cập Teacher Dashboard] --> B[Chọn Khóa học & Tạo buổi học mới]
    B --> C[Nhập: Tiêu đề, Thời lượng, Ngày giờ & Link Google Meet]
    C --> D[Ghi vào mảng liveClasses của bảng `courses`]
    D --> E{Đến giờ học?}
    E -- Chưa đến --> F[Trạng thái: upcoming]
    E -- Đang diễn ra --> G[Trạng thái: in-progress]
    E -- Kết thúc --> H[Trạng thái: completed]
    G --> I[Học sinh đã mua khóa học vào Dashboard bấm Tham gia -> Mở trực tiếp link Google Meet]
```

---

## Luồng 4: Cơ chế Bảo mật Phiên làm việc (JWT Authentication)

1. **Khi Đăng nhập thành công:**
   - Server tạo ra 2 Token:
     - **`AccessToken`** (thời hạn 1 ngày): Kèm trong response header/cookie để xác thực mỗi request API.
     - **`RefreshToken`** (thời hạn 10 ngày): Được lưu trực tiếp vào trường `Refreshtoken` trong bảng tương ứng (`admins`, `teachers`, `students`).
2. **Middleware bảo vệ Route:**
   - [adminAuth.middleware.js](file:///c:/Project/e-Learning-Platform/backend/src/middlewares/adminAuth.middleware.js)
   - [teacherAuth.middleware.js](file:///c:/Project/e-Learning-Platform/backend/src/middlewares/teacherAuth.middleware.js)
   - [stdAuth.middleware.js](file:///c:/Project/e-Learning-Platform/backend/src/middlewares/stdAuth.middleware.js)
   - Các middleware này giải mã AccessToken, tìm `_id` trong MongoDB để xác minh danh tính và phân quyền chuẩn xác trước khi cho phép thực thi tác vụ.
