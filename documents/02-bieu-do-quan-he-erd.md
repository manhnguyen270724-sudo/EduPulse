# 02. Biểu Đồ Quan Hệ Thực Thể (ERD - Entity Relationship Diagram)

Tài liệu này mô hình hóa toàn bộ cấu trúc và các mối quan hệ giữa các Collections trong cơ sở dữ liệu `eLearning`.

---

## 1. Biểu đồ ERD Chi tiết (Mermaid Diagram)

```mermaid
erDiagram
    ADMIN {
        ObjectId _id PK
        String username "Tên đăng nhập admin"
        String password "Mật khẩu băm bcrypt"
        String Refreshtoken "JWT Refresh Token"
    }

    STUDENT {
        ObjectId _id PK
        String Email "Email duy nhất (Unique, Indexed)"
        String Firstname "Họ đệm (Chuẩn hóa TitleCase)"
        String Lastname "Tên (Chuẩn hóa TitleCase)"
        String Password "Mật khẩu băm bcrypt"
        Boolean Isverified "Đã xác thực email"
        String Isapproved "Trạng thái: pending|approved|rejected|reupload"
        String Remarks "Nhận xét/Lý do từ Admin"
        String Refreshtoken "JWT Refresh Token"
        ObjectId Studentdetails FK "Tham chiếu sang bảng studentdocs"
        String forgetPasswordToken "Token quên mật khẩu"
        Date forgetPasswordExpiry "Hạn dùng token quên MK"
        Date createdAt "Thời gian tạo"
        Date updatedAt "Thời gian cập nhật"
    }

    STUDENTDOCS {
        ObjectId _id PK
        Number Phone "Số điện thoại duy nhất"
        String Address "Địa chỉ cư trú"
        String Highesteducation "Trình độ học vấn cao nhất"
        String SecondarySchool "Trường cấp 2"
        String HigherSchool "Trường cấp 3"
        Number SecondaryMarks "Điểm thi cấp 2"
        Number HigherMarks "Điểm thi cấp 3"
        String Aadhaar "Ảnh/Số định danh CCCD"
        String Secondary "Ảnh học bạ/Bằng cấp 2"
        String Higher "Ảnh học bạ/Bằng cấp 3"
        Date createdAt
        Date updatedAt
    }

    TEACHER {
        ObjectId _id PK
        String Email "Email duy nhất (Unique, Indexed)"
        String Firstname "Họ đệm"
        String Lastname "Tên"
        String Password "Mật khẩu băm bcrypt"
        Boolean Isverified "Đã xác thực email"
        String Isapproved "Trạng thái: pending|approved|rejected|reupload"
        String Remarks "Nhận xét duyệt hồ sơ"
        String Refreshtoken "JWT Refresh Token"
        ObjectId Teacherdetails FK "Tham chiếu sang bảng teacherdocs"
        Number Balance "Số dư ví hiện tại"
        Array WithdrawalHistory "Lịch sử các lần rút tiền"
        Array enrolledStudent "Danh sách học sinh kèm trạng thái isNewEnrolled"
        String forgetPasswordToken "Token quên MK"
        Date forgetPasswordExpiry "Hạn dùng token"
        Date createdAt
        Date updatedAt
    }

    TEACHERDOCS {
        ObjectId _id PK
        Number Phone "Số điện thoại duy nhất"
        String Address "Địa chỉ giảng viên"
        Number Experience "Số năm kinh nghiệm giảng dạy"
        String SecondarySchool "Trường cấp 2"
        String HigherSchool "Trường cấp 3"
        String UGcollege "Trường đại học (Undergraduate)"
        String PGcollege "Trường cao học (Postgraduate)"
        Number SecondaryMarks "Điểm cấp 2"
        Number HigherMarks "Điểm cấp 3"
        Number UGmarks "Điểm tốt nghiệp Đại học"
        Number PGmarks "Điểm tốt nghiệp Cao học"
        String Aadhaar "Ảnh định danh CCCD"
        String Secondary "Ảnh bằng cấp 2"
        String Higher "Ảnh bằng cấp 3"
        String UG "Ảnh bằng cử nhân ĐH"
        String PG "Ảnh bằng Thạc sĩ"
        Date createdAt
        Date updatedAt
    }

    COURSE {
        ObjectId _id PK
        String coursename "Tên khóa học"
        String description "Mô tả nội dung khóa học"
        Boolean isapproved "Trạng thái admin đã phê duyệt"
        ObjectId enrolledteacher FK "Giảng viên phụ trách (ref: teacher)"
        ObjectId[] enrolledStudent FK "Mảng các học sinh đã mua (ref: student)"
        Array liveClasses "Danh sách buổi học online: link, date, status"
        Array schedule "Lịch học định kỳ trong tuần"
        Date createdAt
        Date updatedAt
    }

    PAYMENT {
        ObjectId _id PK
        String razorpay_order_id "Mã đơn hàng tạo từ Razorpay"
        String razorpay_payment_id "Mã giao dịch Razorpay trả về"
        String razorpay_signature "Chữ ký mã hóa xác thực HMAC SHA256"
        ObjectId courseID FK "Khóa học được mua (ref: course)"
        ObjectId studentID FK "Học sinh thực hiện thanh toán (ref: student)"
    }

    CONTACT {
        ObjectId _id PK
        String name "Họ tên người gửi"
        String email "Email liên hệ"
        String message "Nội dung phản hồi/hỗ trợ"
        Boolean status "Đã xem/xử lý (mặc định: false)"
    }

    %% Relationships
    STUDENT ||--|| STUDENTDOCS : "sở hữu hồ sơ chi tiết (1 - 1)"
    TEACHER ||--|| TEACHERDOCS : "sở hữu hồ sơ bằng cấp (1 - 1)"
    TEACHER ||--o{ COURSE : "tạo và giảng dạy (1 - N)"
    COURSE }o--o{ STUDENT : "học sinh tham gia (N - N)"
    STUDENT ||--o{ PAYMENT : "thực hiện giao dịch (1 - N)"
    COURSE ||--o{ PAYMENT : "được mua qua (1 - N)"
    TEACHER ||--o{ STUDENT : "theo dõi học sinh đăng ký (1 - N)"
```

---

## 2. Diễn giải các Mối quan hệ chính (Relationships)

### 1. Quan hệ 1 - 1: Tài khoản người dùng và Hồ sơ pháp lý KYC
- **Student $\leftrightarrow$ Studentdocs:** Mỗi học sinh có một bản ghi chi tiết hồ sơ `studentdocs` liên kết qua trường `Studentdetails`.
- **Teacher $\leftrightarrow$ Teacherdocs:** Mỗi giáo viên có một bản ghi bằng cấp `teacherdocs` liên kết qua trường `Teacherdetails`.
- *Mục đích:* Phục vụ quy trình kiểm duyệt tài liệu (Admin vào duyệt bằng cấp/CCCD trước khi cho phép giảng viên mở bán khóa học hoặc học sinh tham gia học).

### 2. Quan hệ 1 - N: Giảng viên và Khóa học (Teacher $\rightarrow$ Course)
- Một giáo viên (`enrolledteacher`) có thể xuất bản nhiều khóa học khác nhau.
- Mỗi khóa học tại một thời điểm thuộc quyền sở hữu của một giảng viên phụ trách.

### 3. Quan hệ N - N: Học sinh và Khóa học (Student $\leftrightarrow$ Course)
- Một học sinh có thể ghi danh vào nhiều khóa học khác nhau.
- Một khóa học có một danh sách mảng chứa nhiều học sinh tham gia (`enrolledStudent: [ObjectId]`).

### 4. Quan hệ 1 - N: Giao dịch thanh toán (Student $\rightarrow$ Payment $\leftarrow$ Course)
- Bảng trung gian `payments` lưu vết mỗi khi học sinh thanh toán thành công qua Razorpay.
- Liên kết đồng thời với `studentID` (ai mua) và `courseID` (mua khóa học nào) cùng chữ ký mật mã `razorpay_signature` để bảo đảm tính toàn vẹn tài chính.
