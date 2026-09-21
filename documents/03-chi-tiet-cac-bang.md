# 03. Phân Tích Chi Tiết Từng Bảng (Collections & Fields)

---

## 1. Bảng `admins` (Quản trị viên)
Lưu trữ tài khoản quản trị viên tối cao của hệ thống.

| Tên trường | Kiểu dữ liệu | Ràng buộc | Mục đích |
| :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | Auto generated | Khóa chính duy nhất của bản ghi. |
| `username` | `String` | `required`, `lowercase`, `trim` | Tên đăng nhập của admin. |
| `password` | `String` | `required` | Mật khẩu (đã băm Bcrypt). |
| `Refreshtoken` | `String` | Tùy chọn | Chuỗi Refresh Token phiên đăng nhập. |

* **Hooks & Methods:**
  - `pre("save")`: Tự động băm `password` bằng Bcrypt (10 rounds) trước khi lưu.
  - `isPasswordCorrect()`: Đối chiếu mật khẩu đăng nhập với mật khẩu đã băm.
  - `generateAccessToken()`, `generateRefreshToken()`: Ký token JWT xác thực.

---

## 2. Bảng `students` (Tài khoản Học sinh)
Quản lý thông tin đăng nhập và trạng thái học viên.

| Tên trường | Kiểu dữ liệu | Ràng buộc | Mục đích |
| :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | Auto generated | Khóa chính học viên. |
| `Email` | `String` | `required`, `unique`, `index`, `lowercase` | Email học viên (dùng đăng nhập). |
| `Firstname` | `String` | `required`, `trim` | Họ và tên đệm. |
| `Lastname` | `String` | `required`, `trim` | Tên chính. |
| `Password` | `String` | `required` | Mật khẩu tài khoản (băm Bcrypt). |
| `Isverified` | `Boolean` | `default: false` | Trạng thái đã kích hoạt qua email chưa. |
| `Isapproved` | `String` | Enum: `['approved', 'rejected', 'pending', 'reupload']`, default: `'pending'` | Trạng thái xét duyệt hồ sơ từ Admin. |
| `Remarks` | `String` | Tùy chọn | Lời nhắn/lý do từ Admin khi từ chối hoặc yêu cầu nộp lại hồ sơ. |
| `Refreshtoken` | `String` | Tùy chọn | Refresh Token cho phiên đăng nhập lâu dài. |
| `Studentdetails` | `ObjectId` | `ref: "studentdocs"` | Khóa ngoại liên kết sang bảng hồ sơ cá nhân. |
| `forgetPasswordToken` | `String` | Tùy chọn | Token mã hóa SHA256 dùng đặt lại mật khẩu. |
| `forgetPasswordExpiry`| `Date` | Tùy chọn | Thời hạn hiệu lực của link quên mật khẩu (15 phút). |
| `createdAt`, `updatedAt` | `Date` | Tự động sinh | Dấu thời gian tạo và sửa bản ghi. |

* **Pre-save Hooks đặc biệt:**
  - Tự động chuẩn hóa chữ cái đầu thành chữ hoa: Ví dụ `"nguyen"` $\rightarrow$ `"Nguyen"`.
  - Tự động băm mật khẩu `Password` với Bcrypt nếu có thay đổi.

---

## 3. Bảng `studentdocs` (Hồ sơ giấy tờ Học sinh)
Lưu trữ thông tin học vấn và hồ sơ KYC của học sinh.

| Tên trường | Kiểu dữ liệu | Ràng buộc | Mục đích |
| :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | Auto generated | Khóa chính. |
| `Phone` | `Number` | `required`, `unique` | Số điện thoại liên hệ duy nhất. |
| `Address` | `String` | `required` | Địa chỉ cư trú của học sinh. |
| `Highesteducation` | `String` | `required` | Trình độ học vấn cao nhất hiện tại. |
| `SecondarySchool` | `String` | `required` | Tên trường THCS (Cấp 2). |
| `HigherSchool` | `String` | `required` | Tên trường THPT (Cấp 3). |
| `SecondaryMarks` | `Number` | `required` | Điểm số/học lực cấp 2. |
| `HigherMarks` | `Number` | `required` | Điểm số/học lực cấp 3. |
| `Aadhaar` | `String` | `required` | Đường dẫn ảnh Căn cước công dân (lưu trên Cloudinary). |
| `Secondary` | `String` | `required` | Đường dẫn ảnh bằng cấp/học bạ THCS. |
| `Higher` | `String` | `required` | Đường dẫn ảnh bằng cấp/học bạ THPT. |

---

## 4. Bảng `teachers` (Tài khoản Giảng viên)
Quản lý thông tin giảng viên, ví tiền và danh sách học viên trực thuộc.

| Tên trường | Kiểu dữ liệu | Ràng buộc | Mục đích |
| :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | Auto generated | Khóa chính giảng viên. |
| `Email` | `String` | `required`, `unique`, `index`, `lowercase` | Email dùng đăng nhập của giảng viên. |
| `Firstname`, `Lastname` | `String` | `required` | Họ và tên giảng viên (chuẩn hóa TitleCase). |
| `Password` | `String` | `required` | Mật khẩu (băm Bcrypt). |
| `Isverified` | `Boolean` | `default: false` | Trạng thái xác minh email. |
| `Isapproved` | `String` | Enum: `['approved', 'rejected', 'pending', 'reupload']`, default: `'pending'` | Admin phê duyệt tư cách đứng lớp. |
| `Remarks` | `String` | Tùy chọn | Ghi chú từ Admin. |
| `Teacherdetails` | `ObjectId` | `ref: "teacherdocs"` | Khóa ngoại tới hồ sơ bằng cấp chuyên môn. |
| `Balance` | `Number` | `default: 0` | Số dư tài khoản nhận được khi học sinh mua khóa học. |
| `WithdrawalHistory` | `Array` | Sub-documents | Lịch sử rút tiền: `{ amount: Number, date: Date }`. |
| `enrolledStudent` | `Array` | Sub-documents | Danh sách học sinh ghi danh: `{ studentId: ObjectId, isNewEnrolled: Boolean }`. |

---

## 5. Bảng `teacherdocs` (Bằng cấp & Kinh nghiệm Giảng viên)
Lưu trữ minh chứng năng lực giảng dạy để Admin kiểm duyệt.

| Tên trường | Kiểu dữ liệu | Ràng buộc | Mục đích |
| :--- | :--- | :--- | :--- |
| `Phone` | `Number` | `required`, `unique` | Số điện thoại giảng viên. |
| `Address` | `String` | `required` | Địa chỉ giảng viên. |
| `Experience` | `Number` | `required` | Số năm kinh nghiệm làm việc/giảng dạy. |
| `SecondarySchool`, `HigherSchool` | `String` | `required` | Tên trường cấp 2 và cấp 3. |
| `UGcollege` | `String` | `required` | Tên trường Đại học (Undergraduate). |
| `PGcollege` | `String` | `required` | Tên trường Cao học/Thạc sĩ (Postgraduate). |
| `SecondaryMarks`, `HigherMarks` | `Number` | `required` | Điểm số bậc phổ thông. |
| `UGmarks`, `PGmarks` | `Number` | `required` | Điểm tốt nghiệp Đại học và Thạc sĩ. |
| `Aadhaar`, `Secondary`, `Higher` | `String` | `required` | Link ảnh CCCD và bằng cấp phổ thông (Cloudinary). |
| `UG`, `PG` | `String` | `required` | Link ảnh bằng Cử nhân Đại học và Thạc sĩ (Cloudinary). |

---

## 6. Bảng `courses` (Khóa học & Lớp học trực tuyến)
Quản lý khóa học, lịch học định kỳ và phòng học online qua Google Meet.

| Tên trường | Kiểu dữ liệu | Ràng buộc | Mục đích |
| :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | Auto generated | Mã định danh khóa học. |
| `coursename` | `String` | `required` | Tên tiêu đề khóa học. |
| `description` | `String` | `required` | Mô tả chi tiết mục tiêu khóa học. |
| `isapproved` | `Boolean` | `default: false` | Trạng thái được Admin duyệt cho hiển thị công khai. |
| `enrolledteacher` | `ObjectId` | `ref: "teacher"`, `required` | Giảng viên tạo và phụ trách khóa học này. |
| `enrolledStudent` | `[ObjectId]` | Mảng `ref: "student"` | Danh sách ID tất cả học sinh đã đăng ký/mua khóa học. |
| `liveClasses` | `Array` | Sub-documents | Các buổi học online trực tiếp: |
| $\llcorner$ `title` | `String` | Buổi học | Tên chủ đề buổi học trực tuyến. |
| $\llcorner$ `timing` | `Number` | Thời lượng | Thời lượng buổi học (tính theo phút). |
| $\llcorner$ `date` | `Date` | Ngày giờ | Thời gian diễn ra buổi học. |
| $\llcorner$ `link` | `String` | Đường dẫn | Link phòng họp online (Google Meet, Zoom...). |
| $\llcorner$ `status` | `String` | Enum | `'upcoming'` (Sắp diễn ra), `'in-progress'`, `'completed'`. |
| `schedule` | `Array` | Sub-documents | Lịch học cố định hàng tuần: |
| $\llcorner$ `day` | `Number` | Enum: `0` (CN) đến `6` (T7) | Ngày trong tuần học định kỳ. |
| $\llcorner$ `starttime`, `endtime` | `Number` | `0` đến `1440` | Khung giờ bắt đầu và kết thúc (quy đổi theo phút trong ngày). |

---

## 7. Bảng `payments` (Nhật ký Thanh toán)
Ghi nhận giao dịch mua khóa học thành công qua cổng thanh toán quốc tế Razorpay.

| Tên trường | Kiểu dữ liệu | Ràng buộc | Mục đích |
| :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | Auto generated | Mã bản ghi giao dịch. |
| `razorpay_order_id` | `String` | `required` | Mã Order do Razorpay khởi tạo ở Backend. |
| `razorpay_payment_id`| `String` | `required` | Mã Payment ID do Razorpay cấp khi thanh toán thành công. |
| `razorpay_signature` | `String` | `required` | Chữ ký điện tử HMAC SHA256 để xác thực giao dịch không bị can thiệp. |
| `courseID` | `ObjectId` | `ref: "course"`, `required` | Khóa học đã mua. |
| `studentID` | `ObjectId` | `ref: "student"`, `required`| Học sinh đã thanh toán. |

---

## 8. Bảng `contacts` (Liên hệ & Góp ý)
Lưu tin nhắn từ khách truy cập và học viên qua biểu mẫu "Contact Us".

| Tên trường | Kiểu dữ liệu | Ràng buộc | Mục đích |
| :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | Auto generated | Mã tin nhắn. |
| `name` | `String` | `required` | Họ tên người gửi. |
| `email` | `String` | `required` | Email người gửi để phản hồi lại. |
| `message` | `String` | `required` | Nội dung tin nhắn. |
| `status` | `Boolean` | `default: false` | `false`: Chưa xử lý, `true`: Admin đã đọc/phản hồi. |
