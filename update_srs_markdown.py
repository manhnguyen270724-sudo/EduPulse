import os
import sys
sys.stdout.reconfigure(encoding='utf-8')
import re

def main():
    with open('EduPulse_SRS.docx.md', 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Cập nhật Mục lục phần 3.2
    old_toc_pattern = r'\[3\.2 Use Cases\t10\]\(#3\.2-use-cases\).*?\[3\.3 Entity Relationship Diagrams \(ERD\)\t20\]\(#3\.3-entity-relationship-diagrams-\(erd\)\)'
    
    new_toc = """[3.2 Use Cases\t10](#3.2-use-cases)

[3.2.1 Biểu đồ Use Case Tổng quan Toàn hệ thống\t10](#3.2.1-biểu-đồ-use-case-tổng-quan-toàn-hệ-thống)

[3.2.2 Use Case Chức năng 1: Xác thực người dùng và Phân quyền\t11](#3.2.2-use-case-chức-năng-1:-xác-thực-người-dùng-và-phân-quyền)

[3.2.3 Use Case Chức năng 2: Hồ sơ cá nhân và Xác minh danh tính KYC\t12](#3.2.3-use-case-chức-năng-2:-hồ-sơ-cá-nhân-và-xác-minh-danh-tính-kyc)

[3.2.4 Use Case Chức năng 3: Quản lý Khóa học đa cấp\t13](#3.2.4-use-case-chức-năng-3:-quản-lý-khóa-học-đa-cấp)

[3.2.5 Use Case Chức năng 4: Quản lý Lớp học và Buổi học trực tuyến Live\t14](#3.2.5-use-case-chức-năng-4:-quản-lý-lớp-học-và-buổi-học-trực-tuyến-live)

[3.2.6 Use Case Chức năng 5: Kênh trao đổi lớp học (Classroom Chat)\t15](#3.2.6-use-case-chức-năng-5:-kênh-trao-đổi-lớp-học-(classroom-chat))

[3.2.7 Use Case Chức năng 6: Hệ thống Thông báo và Nhắc lịch học\t16](#3.2.7-use-case-chức-năng-6:-hệ-thống-thông-báo-và-nhắc-lịch-học)

[3.2.8 Use Case Chức năng 7: Thanh toán, Ký quỹ và Rút tiền Giảng viên có Giám sát\t17](#3.2.8-use-case-chức-năng-7:-thanh-toán-ký-quỹ-và-rút-tiền-giảng-viên-có-giám-sát)

[3.2.9 Use Case Chức năng 8: Quản trị hệ thống và Hỗ trợ khách hàng (Contact Us)\t18](#3.2.9-use-case-chức-năng-8:-quản-trị-hệ-thống-và-hỗ-trợ-khách-hàng-(contact-us))

[3.2.10 Use Case Chức năng 9: Nghiệm thu & Xác nhận Hoàn thành Khóa học\t19](#3.2.10-use-case-chức-năng-9:-nghiệm-thu-&-xác-nhận-hoàn-thành-khóa-học)

[3.2.11 Use Case Chức năng 10: Đánh giá Khóa học, Giám sát Đánh giá Xấu & Tạm dừng Khóa học\t20](#3.2.11-use-case-chức-năng-10:-đánh-giá-khóa-học-giám-sát-đánh-giá-xấu-&-tạm-dừng-khóa-học)

[3.2.12 Use Case Chức năng 11: Quản trị Tài khoản Người dùng & Kiểm soát Vi phạm\t21](#3.2.12-use-case-chức-năng-11:-quản-trị-tài-khoản-người-dùng-&-kiểm-soát-vi-phạm)

[3.2.13 Use Case Chức năng 12: Bảng điều khiển Tài chính Sàn & Dòng tiền Ký quỹ\t22](#3.2.13-use-case-chức-năng-12:-bảng-điều-khiển-tài-chính-sàn-&-dòng-tiền-ký-quỹ)

[3.3 Entity Relationship Diagrams (ERD)\t20](#3.3-entity-relationship-diagrams-(erd))"""

    content = re.sub(old_toc_pattern, lambda m: new_toc, content, flags=re.DOTALL)

    # 2. Xây dựng nội dung Section 3.2 mới
    new_section_3_2 = """## **3.2 Use Cases** {#3.2-use-cases}

Hệ thống EduPulse bao gồm 12 phân hệ chức năng tương ứng trực tiếp với 12 Use Case cốt lõi. Dưới đây là Biểu đồ Use Case Tổng quan toàn hệ thống, tiếp theo là 12 Use Case chi tiết với kiến trúc trực quan: **Biểu đồ Use Case đặt ở trên và Bảng đặc tả chi tiết đặt ngay phía dưới**.

---

### **3.2.1 Biểu đồ Use Case Tổng quan Toàn hệ thống** {#3.2.1-biểu-đồ-use-case-tổng-quan-toàn-hệ-thống}

![Biểu đồ Use Case Tổng quan Toàn hệ thống](generated_diagrams/uc_overview.png)
*Hình 3.2.1: Biểu đồ Use Case Tổng quan Hệ thống EduPulse kết nối Học viên, Giảng viên và Quản trị viên*

**Bảng tổng hợp 12 Phân hệ Use Case tương ứng với 12 Chức năng Hệ thống:**

| STT | Mã Use Case | Tên Use Case Phân hệ Chức năng | Student | Teacher | Admin | Ghi chú Trọng tâm |
| :---: | :---: | :---- | :---: | :---: | :---: | :---- |
| 1 | UC-F01 | Xác thực người dùng và Phân quyền (Auth & RBAC) | ✔ | ✔ | ✔ | JWT Access & Refresh Token, Bcrypt |
| 2 | UC-F02 | Hồ sơ cá nhân và Xác minh danh tính KYC | ✔ | ✔ | ✔ | Cloudinary Upload, Thẩm định bằng cấp |
| 3 | UC-F03 | Quản lý Khóa học đa cấp (Course Management) | ✔ | ✔ | ✔ | Phân cấp 3 tầng, Duyệt xuất bản |
| 4 | UC-F04 | Quản lý Lớp học và Buổi học Live (Classroom) | ✔ | ✔ | | Lớp nhóm, 1-kèm-1, Room Link Live |
| 5 | UC-F05 | Kênh trao đổi lớp học (Classroom Chat) | ✔ | ✔ | | Chat thời gian thực, Tệp đính kèm |
| 6 | UC-F06 | Hệ thống Thông báo và Nhắc lịch học | ✔ | ✔ | | Nhắc tự động trước buổi học, Chuông |
| 7 | UC-F07 | Thanh toán, Ký quỹ và Rút tiền Giảng viên có Giám sát | ✔ | ✔ | ✔ | Razorpay, Escrow an toàn, Lệnh rút tiền |
| 8 | UC-F08 | Quản trị hệ thống và Hỗ trợ khách hàng (Contact Us) | ✔ | ✔ | ✔ | Tiếp nhận khiếu nại, Giải quyết hỗ trợ |
| 9 | UC-F09 | Nghiệm thu & Xác nhận Hoàn thành Khóa học (MỚI) | ✔ | ✔ | ✔ | **Điều kiện >= 80%**, Mở khóa ví 85% |
| 10 | UC-F10 | Đánh giá Khóa học, Giám sát Đánh giá Xấu (MỚI) | ✔ | ✔ | ✔ | **Cảnh báo <= 2 sao**, Tạm dừng khóa học |
| 11 | UC-F11 | Quản trị Tài khoản Người dùng & Kỷ luật (MỚI) | | | ✔ | **Active / Suspend / Ban**, Email kỷ luật |
| 12 | UC-F12 | Bảng điều khiển Tài chính Sàn & Dòng tiền Ký quỹ (MỚI) | | ✔ | ✔ | **GMV, Phí sàn 15%, Ký quỹ Escrow** |

---

### **3.2.2 Use Case Chức năng 1: Xác thực người dùng và Phân quyền** {#3.2.2-use-case-chức-năng-1:-xác-thực-người-dùng-và-phân-quyền}

![Biểu đồ Use Case Chức năng 1: Xác thực người dùng và Phân quyền](generated_diagrams/uc_feat1_auth.png)
*Hình 3.2.2: Biểu đồ Use Case Chức năng 1 - Xác thực người dùng và Phân quyền (Authentication & Authorization)*

| Hạng mục | Nội dung chi tiết |
| :--- | :--- |
| **Mã & Tên Use Case** | **UC-F01 – Xác thực người dùng và Phân quyền (Authentication & Authorization)** |
| **Tác nhân chính** | Học viên (Student), Giảng viên (Teacher), Quản trị viên (Admin) |
| **Tiền điều kiện** | Người dùng có kết nối Internet và truy cập vào giao diện Web EduPulse. |
| **Hậu điều kiện** | Cấp phiên đăng nhập hợp lệ với cặp token JWT (Access Token & Refresh Token) lưu tại HttpOnly Cookie; chuyển hướng người dùng về đúng trang chủ hoặc Dashboard theo vai trò. |
| **Luồng sự kiện chính** | 1. Người dùng chọn chức năng Đăng ký hoặc Đăng nhập trên thanh điều hướng.<br>2. **Đăng ký tài khoản (Sign-up):** Người dùng nhập Họ, Tên, Email và Mật khẩu. Mật khẩu được băm mã hóa một chiều bằng thư viện Bcrypt với hệ số muối 10 rounds. Hệ thống tạo tài khoản ở trạng thái chờ kích hoạt và gửi email xác thực kèm token qua Nodemailer.<br>3. **Kích hoạt tài khoản (Verify Email):** Người dùng nhấn liên kết trong email để kích hoạt trạng thái tài khoản sang hợp lệ.<br>4. **Đăng nhập (Sign-in):** Người dùng nhập Email và Mật khẩu. Máy chủ đối soát mật khẩu đã băm, kiểm tra trạng thái tài khoản trong cơ sở dữ liệu (`accountStatus`). Nếu tài khoản bình thường (`active`), hệ thống sinh cặp mã khóa JWT (Access Token 15 phút, Refresh Token 7 ngày) gửi về máy khách.<br>5. Người dùng được chuyển hướng vào giao diện tương ứng theo vai trò (Student Dashboard, Teacher Dashboard hoặc Admin Dashboard).<br>6. **Quên & Đặt lại mật khẩu (Forgot Password):** Người dùng nhập email đăng ký. Hệ thống tạo mã bảo mật dùng một lần băm SHA-256 có hạn 15 phút và gửi link đặt lại mật khẩu qua email. |
| **Luồng ngoại lệ** | - Email đăng ký đã tồn tại trong hệ thống: Báo lỗi xung đột `Email already registered` (HTTP 400).<br>- Nhập sai email hoặc mật khẩu: Báo lỗi xác thực thất bại `Invalid credentials`.<br>- Tài khoản đang bị xử lý kỷ luật (`suspended` hoặc `banned`): Chặn đăng nhập kèm thông báo nêu rõ lý do kỷ luật (`statusReason`) và hướng dẫn liên hệ bộ phận hỗ trợ. |

---

### **3.2.3 Use Case Chức năng 2: Hồ sơ cá nhân và Xác minh danh tính KYC** {#3.2.3-use-case-chức-năng-2:-hồ-sơ-cá-nhân-và-xác-minh-danh-tính-kyc}

![Biểu đồ Use Case Chức năng 2: Hồ sơ cá nhân và Xác minh danh tính KYC](generated_diagrams/uc_feat2_kyc.png)
*Hình 3.2.3: Biểu đồ Use Case Chức năng 2 - Hồ sơ cá nhân và Xác minh danh tính KYC (Profile & Document Verification)*

| Hạng mục | Nội dung chi tiết |
| :--- | :--- |
| **Mã & Tên Use Case** | **UC-F02 – Quản lý Hồ sơ cá nhân & Thẩm định minh chứng KYC (Profile & Document Verification)** |
| **Tác nhân chính** | Học viên (Student), Giảng viên (Teacher), Quản trị viên (Admin) |
| **Tiền điều kiện** | Người dùng đã đăng nhập tài khoản hợp lệ trên hệ thống. |
| **Hậu điều kiện** | Thông tin cá nhân được cập nhật; tài liệu pháp lý và bằng cấp được tải lên lưu trữ đám mây Cloudinary; trạng thái hồ sơ KYC chuyển sang chờ duyệt (`pending`); Admin phê duyệt hoặc yêu cầu nộp lại. |
| **Luồng sự kiện chính** | 1. Người dùng truy cập mục Hồ sơ cá nhân (Profile / KYC) trên Dashboard.<br>2. Cập nhật thông tin cơ bản: Ảnh đại diện (Avatar), Số điện thoại, Địa chỉ cư trú, Tiểu sử tóm tắt (Bio), Kinh nghiệm sư phạm.<br>3. **Nộp hồ sơ minh chứng KYC (Đặc biệt dành cho Giảng viên):** Tải lên các tệp tài liệu: Căn cước công dân (Aadhaar/CCCD), Bằng tốt nghiệp Đại học (UG), Bằng Thạc sĩ/Tiến sĩ (PG), bảng điểm và các chứng chỉ sư phạm liên quan.<br>4. Hệ thống tải tài liệu lên đám mây Cloudinary qua kết nối bảo mật HTTPS, lưu URL an toàn vào bảng `TeacherDocs` / `StudentDocs`, đồng thời cập nhật trạng thái `Isapproved = 'pending'`.<br>5. **Thẩm định hồ sơ KYC (Quản trị viên):** Quản trị viên truy cập tab "Duyệt hồ sơ KYC" trên Admin Dashboard, mở xem trực tiếp các tài liệu bằng cấp và căn cước.<br>6. Quản trị viên đưa ra quyết định: Phê duyệt (`approved`), Yêu cầu nộp lại (`reupload`), hoặc Từ chối (`rejected`), kèm nhận xét chi tiết (Remarks).<br>7. Hệ thống tự động gửi thông báo in-app và cập nhật quyền hạn giảng dạy cho Giảng viên ngay khi được phê duyệt. |
| **Luồng ngoại lệ** | - Tệp tải lên sai định dạng (không phải PDF, JPG, PNG) hoặc vượt quá 10MB: Hệ thống từ chối tải và yêu cầu chọn lại tệp.<br>- Tài liệu mờ hoặc có dấu hiệu giả mạo: Admin chuyển trạng thái `reupload` kèm hướng dẫn bổ sung hồ sơ rõ ràng. |

---

### **3.2.4 Use Case Chức năng 3: Quản lý Khóa học đa cấp** {#3.2.4-use-case-chức-năng-3:-quản-lý-khóa-học-đa-cấp}

![Biểu đồ Use Case Chức năng 3: Quản lý Khóa học đa cấp](generated_diagrams/uc_feat3_course.png)
*Hình 3.2.4: Biểu đồ Use Case Chức năng 3 - Quản lý Khóa học đa cấp (Multi-level Course Management)*

| Hạng mục | Nội dung chi tiết |
| :--- | :--- |
| **Mã & Tên Use Case** | **UC-F03 – Quản lý Khóa học đa cấp (Multi-level Course Management)** |
| **Tác nhân chính** | Giảng viên (Teacher), Học viên (Student), Quản trị viên (Admin) |
| **Tiền điều kiện** | Giảng viên đã hoàn thành và được duyệt hồ sơ KYC; Học viên có tài khoản hợp lệ. |
| **Hậu điều kiện** | Đề cương khóa học được tạo lập; Quản trị viên thẩm định và duyệt xuất bản (`isapproved = true`); Khóa học được hiển thị cho Học viên tìm kiếm và ghi danh. |
| **Luồng sự kiện chính** | 1. Giảng viên truy cập Teacher Dashboard → Courses, chọn "Thêm khóa học mới".<br>2. Giảng viên thiết lập thông tin khóa học theo phân cấp 3 tầng chuẩn: Cấp học (Tiểu học, THCS, THPT, Đại học) → Khối lớp (Lớp 1 đến Lớp 12, Năm 1-4) → Môn học.<br>3. Nhập tiêu đề, mô tả tóm tắt, ảnh bìa, giáo trình chi tiết (Syllabus), mục tiêu kết quả đầu ra (Outcomes) và học phí (Fees).<br>4. Giảng viên gửi yêu cầu xuất bản khóa học lên hệ thống.<br>5. **Thẩm định & Phê duyệt (Quản trị viên):** Quản trị viên truy cập tab "Duyệt khóa học", xem xét tính khoa học của giáo trình và mức học phí đề xuất. Nếu đạt chuẩn, Admin duyệt khóa học (`isapproved = true`).<br>6. **Khám phá & Tìm kiếm (Học viên):** Học viên truy cập trang `/courses`, sử dụng bộ lọc phân cấp 3 tầng để tìm khóa học theo đúng khối lớp và môn học cần tìm, xem chi tiết đề cương và giảng viên phụ trách. |
| **Luồng ngoại lệ** | - Nội dung đề cương vi phạm chuẩn mực giáo dục hoặc thông tin học phí bất hợp lý: Admin từ chối phê duyệt và gửi phản hồi chỉnh sửa cho Giảng viên.<br>- Khóa học chưa được duyệt (`isapproved = false`): Hệ thống ẩn khỏi trang tìm kiếm công khai của học viên. |

---

### **3.2.5 Use Case Chức năng 4: Quản lý Lớp học và Buổi học trực tuyến Live** {#3.2.5-use-case-chức-năng-4:-quản-lý-lớp-học-và-buổi-học-trực-tuyến-live}

![Biểu đồ Use Case Chức năng 4: Quản lý Lớp học và Buổi học trực tuyến Live](generated_diagrams/uc_feat4_class.png)
*Hình 3.2.5: Biểu đồ Use Case Chức năng 4 - Quản lý Lớp học & Buổi học trực tuyến (Classroom & Live Sessions)*

| Hạng mục | Nội dung chi tiết |
| :--- | :--- |
| **Mã & Tên Use Case** | **UC-F04 – Quản lý Lớp học và Buổi học trực tuyến Live (Classroom & Live Sessions)** |
| **Tác nhân chính** | Giảng viên (Teacher), Học viên (Student) |
| **Tiền điều kiện** | Khóa học đã được phê duyệt công khai; Giảng viên được phân công giảng dạy; Học viên đã đăng ký khóa học. |
| **Hậu điều kiện** | Lớp học được tạo kèm mã định danh duy nhất (`classCode`); các buổi học trực tuyến (Sessions) được lên lịch và mở phòng học theo thời gian thực. |
| **Luồng sự kiện chính** | 1. Giảng viên vào Teacher Dashboard → Classrooms, chọn "Tạo lớp học mới".<br>2. Chọn khóa học liên kết, đặt tên lớp học và chọn hình thức tổ chức: Lớp nhóm (Group Class, tối đa 20 học viên) hoặc Lớp 1-kèm-1 (One-on-One, tối đa 1 học viên).<br>3. Thiết lập lịch học cố định trong tuần (Weekly Schedule) và số lượng buổi học dự kiến.<br>4. Hệ thống tự động sinh mã định danh duy nhất cho lớp học (`classCode`, định dạng `EP-GRP-XXXX` hoặc `EP-1ON1-XXXX`).<br>5. Giảng viên lập lịch từng buổi học chi tiết (Session Sub-documents): Chủ đề bài học, ngày học, giờ bắt đầu, thời lượng dự kiến và đường dẫn phòng học trực tiếp (`roomLink` Google Meet / WebRTC).<br>6. Học viên truy cập Student Dashboard, xem thời khóa biểu lớp học đã ghi danh.<br>7. Khi đến giờ học, Giảng viên và Học viên nhấn nút "Vào phòng học Live" để tham gia buổi học trực tuyến. |
| **Luồng ngoại lệ** | - Lớp học đã đạt sĩ số tối đa (đủ 20 học viên đối với nhóm, đủ 1 học viên đối với 1-kèm-1): Hệ thống chặn ghi danh và yêu cầu mở lớp mới.<br>- Trùng khung giờ giữa các lớp của cùng một Giảng viên: Hệ thống cảnh báo xung đột lịch giảng dạy. |

---

### **3.2.6 Use Case Chức năng 5: Kênh trao đổi lớp học (Classroom Chat)** {#3.2.6-use-case-chức-năng-5:-kênh-trao-đổi-lớp-học-(classroom-chat)}

![Biểu đồ Use Case Chức năng 5: Kênh trao đổi lớp học](generated_diagrams/uc_feat5_chat.png)
*Hình 3.2.6: Biểu đồ Use Case Chức năng 5 - Kênh trao đổi lớp học (Classroom Chat)*

| Hạng mục | Nội dung chi tiết |
| :--- | :--- |
| **Mã & Tên Use Case** | **UC-F05 – Kênh trao đổi & Chia sẻ tài liệu lớp học (Classroom Chat)** |
| **Tác nhân chính** | Học viên (Student), Giảng viên (Teacher) |
| **Tiền điều kiện** | Người dùng đã đăng nhập và là thành viên chính thức (Giảng viên phụ trách hoặc Học viên ghi danh) của lớp học. |
| **Hậu điều kiện** | Tin nhắn văn bản và tệp đính kèm được lưu vào bảng `ChatMessage` và hiển thị trực quan theo luồng trao đổi của lớp. |
| **Luồng sự kiện chính** | 1. Thành viên lớp học truy cập phòng chat chuyên biệt của lớp qua mục "Kênh trao đổi" (Chatroom) trên giao diện lớp học.<br>2. Hệ thống kiểm tra quyền hạn thành viên dựa trên `classCode` / `classroomId`.<br>3. Người dùng nhập tin nhắn văn bản thảo luận bài giảng, dặn dò bài tập hoặc đặt câu hỏi chuyên môn.<br>4. **Chia sẻ tài liệu học tập:** Người dùng chọn nút đính kèm tệp (PDF, hình ảnh, slide bài giảng). Hệ thống tải tệp lên Cloudinary và tạo tin nhắn chứa đường dẫn xem/tải tài liệu an toàn.<br>5. Tin nhắn được gửi đi, lưu trữ trong cơ sở dữ liệu và hiển thị ngay lập tức tới tất cả các thành viên trong lớp học.<br>6. Người dùng xem lịch sử trao đổi của lớp học theo trình tự thời gian. |
| **Luồng ngoại lệ** | - Người dùng bên ngoài lớp học cố tình truy cập vào URL chat: Hệ thống phát hiện và chặn truy cập bằng mã lỗi 403 Forbidden.<br>- Tệp đính kèm vượt kích thước cho phép: Hệ thống thông báo từ chối tải tệp. |

---

### **3.2.7 Use Case Chức năng 6: Hệ thống Thông báo và Nhắc lịch học** {#3.2.7-use-case-chức-năng-6:-hệ-thống-thông-báo-và-nhắc-lịch-học}

![Biểu đồ Use Case Chức năng 6: Hệ thống Thông báo và Nhắc lịch học](generated_diagrams/uc_feat6_notification.png)
*Hình 3.2.7: Biểu đồ Use Case Chức năng 6 - Hệ thống Thông báo và Nhắc lịch học (Notification System)*

| Hạng mục | Nội dung chi tiết |
| :--- | :--- |
| **Mã & Tên Use Case** | **UC-F06 – Hệ thống Thông báo và Nhắc lịch học tự động (Notification System)** |
| **Tác nhân chính** | Học viên (Student), Giảng viên (Teacher), Bộ quét tự động (Scheduler) |
| **Tiền điều kiện** | Người dùng có tài khoản trên EduPulse và có lịch học đã được khởi tạo trong hệ thống. |
| **Hậu điều kiện** | Bản ghi `Notification` được tạo; số lượng thông báo chưa đọc hiển thị trên chuông thông báo; gửi nhắc nhở kịp thời trước giờ học. |
| **Luồng sự kiện chính** | 1. Định kỳ mỗi 15-30 phút, bộ lập lịch tự động của máy chủ chạy tác vụ quét `checkUpcomingClassReminders`.<br>2. Hệ thống tìm kiếm các buổi học sắp diễn ra trong ngày có trạng thái hợp lệ.<br>3. Hệ thống tự động tạo bản ghi `Notification` mới với phân loại `class_reminder` cho tất cả Giảng viên và Học viên thuộc buổi học đó.<br>4. Khi người dùng truy cập bất kỳ trang nào, component `NotificationBell` gửi yêu cầu API lấy số lượng thông báo chưa đọc (`unreadCount`) và hiển thị huy hiệu đỏ nổi bật.<br>5. Người dùng nhấn vào biểu tượng chuông để mở danh sách thông báo, xem chi tiết giờ học, tên lớp và bấm liên kết tham gia nhanh.<br>6. Người dùng nhấn "Đánh dấu tất cả đã đọc" hoặc nhấn vào từng thông báo để cập nhật trạng thái `isRead = true`. |
| **Luồng ngoại lệ** | - Buổi học bị hoãn hoặc dời lịch: Hệ thống gửi thông báo cập nhật lịch học mới tới các thành viên có liên quan. |

---

### **3.2.8 Use Case Chức năng 7: Thanh toán, Ký quỹ và Rút tiền Giảng viên có Giám sát** {#3.2.8-use-case-chức-năng-7:-thanh-toán-ký-quỹ-và-rút-tiền-giảng-viên-có-giám-sát}

![Biểu đồ Use Case Chức năng 7: Thanh toán, Ký quỹ và Rút tiền Giảng viên có Giám sát](generated_diagrams/uc_feat7_payment_withdrawal.png)
*Hình 3.2.8: Biểu đồ Use Case Chức năng 7 - Thanh toán, Ký quỹ và Rút tiền Giảng viên có Giám sát (Payment, Escrow & Strict Withdrawal)*

| Hạng mục | Nội dung chi tiết |
| :--- | :--- |
| **Mã & Tên Use Case** | **UC-F07 – Thanh toán học phí, Ký quỹ an toàn & Rút tiền Giảng viên có Giám sát (Payment, Escrow & Strict Withdrawal)** |
| **Tác nhân chính** | Học viên (Student), Giảng viên (Teacher), Quản trị viên (Admin) |
| **Tiền điều kiện** | Khóa học có thiết lập học phí; Học viên có phương thức thanh toán hợp lệ; Giảng viên có tài khoản ngân hàng và hoàn tất giảng dạy. |
| **Hậu điều kiện** | Giao dịch thanh toán được lưu trữ trong bảng `Payment`; học phí được giữ an toàn tại tài khoản ký quỹ sàn; sau nghiệm thu mở khóa 85% vào ví GV; Admin đối soát và giải ngân lệnh rút tiền. |
| **Luồng sự kiện chính** | 1. **Thanh toán học phí (Học viên):** Học viên nhấn "Đăng ký ngay" tại trang khóa học. Hệ thống khởi tạo đơn hàng qua cổng Razorpay SDK (hỗ trợ Thẻ ngân hàng, UPI, Netbanking).<br>2. Học viên hoàn tất thanh toán. Máy chủ EduPulse đối soát chữ ký điện tử HMAC-SHA256 (`razorpay_signature`), ghi nhận giao dịch thành công vào bảng `Payment` và thêm học viên vào khóa học.<br>3. **Ký quỹ bảo vệ (Escrow):** Toàn bộ học phí được giữ nguyên tại tài khoản ký quỹ sàn để đảm bảo quyền lợi của học viên trong suốt thời gian diễn ra khóa học.<br>4. **Mở khóa số dư (Sau nghiệm thu):** Khi khóa học hoàn thành và được Admin phê duyệt nghiệm thu, 85% học phí được tự động chuyển từ trạng thái ký quỹ sang số dư ví khả dụng (`Balance`) của Giảng viên (sàn giữ lại 15% hoa hồng).<br>5. **Tạo lệnh rút tiền (Giảng viên):** Giảng viên vào tab Remuneration, chọn khóa học đã nghiệm thu, nhập số tiền cần rút và điền thông tin ngân hàng (Tên ngân hàng, Số tài khoản, Tên chủ thẻ, Chi nhánh). Bản ghi `WithdrawalRequest` được tạo ở trạng thái `pending`.<br>6. **Đối soát & Giải ngân (Quản trị viên):** Admin vào tab Quản lý Rút tiền, kiểm tra đối soát thông tin ngân hàng và khóa học. Admin thực hiện chuyển khoản ngân hàng ngoài đời thực, nhập mã giao dịch xác nhận (`transactionCode`) và nhấn "Hoàn tất giải ngân". Hệ thống trừ số dư ví của GV, lưu `WithdrawalHistory` và gửi email xác nhận. |
| **Luồng ngoại lệ** | - Chữ ký thanh toán Razorpay không hợp lệ: Hệ thống hủy bỏ giao dịch và ghi log bảo mật.<br>- Giảng viên rút tiền khi khóa học chưa hoàn thành hoặc chưa được Admin phê duyệt nghiệm thu: Hệ thống chặn tạo lệnh và báo lỗi vi phạm điều kiện ràng buộc. |

---

### **3.2.9 Use Case Chức năng 8: Quản trị hệ thống và Hỗ trợ khách hàng (Contact Us)** {#3.2.9-use-case-chức-năng-8:-quản-trị-hệ-thống-và-hỗ-trợ-khách-hàng-(contact-us)}

![Biểu đồ Use Case Chức năng 8: Quản trị hệ thống và Hỗ trợ khách hàng](generated_diagrams/uc_feat8_support.png)
*Hình 3.2.9: Biểu đồ Use Case Chức năng 8 - Quản trị hệ thống và Hỗ trợ khách hàng (Admin & Support Management - Contact Us)*

| Hạng mục | Nội dung chi tiết |
| :--- | :--- |
| **Mã & Tên Use Case** | **UC-F08 – Tiếp nhận & Xử lý Yêu cầu hỗ trợ khách hàng (Admin & Support Management - Contact Us)** |
| **Tác nhân chính** | Người dùng vãng lai, Học viên (Student), Giảng viên (Teacher), Quản trị viên (Admin) |
| **Tiền điều kiện** | Người dùng có nhu cầu phản ánh sự cố, thắc mắc về khóa học hoặc liên hệ hợp tác. |
| **Hậu điều kiện** | Bản ghi `Contact` được lưu vào cơ sở dữ liệu; Admin nhận được thông tin và tiến hành xử lý phản hồi. |
| **Luồng sự kiện chính** | 1. Người dùng truy cập trang "Liên hệ" (Contact Us) tại đường dẫn `/contact`.<br>2. Người dùng điền biểu mẫu liên hệ: Họ và tên, Địa chỉ Email, Số điện thoại (tùy chọn) và Nội dung thông điệp chi tiết.<br>3. Người dùng nhấn nút "Gửi tin nhắn" (Submit).<br>4. Hệ thống kiểm tra dữ liệu đầu vào và lưu bản ghi vào bảng `Contact` với trạng thái chưa xử lý.<br>5. Quản trị viên truy cập mục "Hỗ trợ khách hàng" trên Admin Dashboard để xem danh sách các yêu cầu liên hệ mới.<br>6. Admin mở xem chi tiết phản ánh, liên hệ phản hồi người dùng qua email hoặc số điện thoại, sau đó đánh dấu cập nhật trạng thái "Đã xử lý / Đã phản hồi". |
| **Luồng ngoại lệ** | - Email sai định dạng hoặc nội dung để trống: Hệ thống hiển thị cảnh báo lỗi và yêu cầu điền đầy đủ thông tin. |

---

### **3.2.10 Use Case Chức năng 9: Nghiệm thu & Xác nhận Hoàn thành Khóa học** {#3.2.10-use-case-chức-năng-9:-nghiệm-thu-&-xác-nhận-hoàn-thành-khóa-học}

![Biểu đồ Use Case Chức năng 9: Nghiệm thu & Hoàn thành Khóa học](generated_diagrams/uc_feat9_completion.png)
*Hình 3.2.10: Biểu đồ Use Case Chức năng 9 - Nghiệm thu & Xác nhận Hoàn thành Khóa học (Course Completion & Acceptance Workflow)*

| Hạng mục | Nội dung chi tiết |
| :--- | :--- |
| **Mã & Tên Use Case** | **UC-F09 – Nghiệm thu & Xác nhận Hoàn thành Khóa học (Course Completion & Acceptance)** |
| **Tác nhân chính** | Học viên (Student), Giảng viên (Teacher), Quản trị viên (Admin) |
| **Tiền điều kiện** | Khóa học đã hoàn tất các buổi học trong chương trình giảng dạy. |
| **Hậu điều kiện** | Học viên gửi biểu mẫu nghiệm thu vào `CourseCompletionFeedback`; tỷ lệ xác nhận đạt chuẩn $\ge 80\%$; Admin duyệt chuyển trạng thái sang `completed` và mở khóa 85% học phí vào ví Giảng viên. |
| **Luồng sự kiện chính** | 1. **Nộp Form nghiệm thu (Học viên):** Khi khóa học kết thúc, Học viên vào Student Dashboard → Courses, mở modal nghiệm thu `CourseCompletionModal`.<br>2. Học viên tích chọn xác nhận đã học đủ số buổi (`hasCompletedAllLessons`), đánh giá mức độ chuyên cần (1-5 sao), đánh giá chất lượng sư phạm của giáo viên (1-5 sao) và ghi nhận sự cố vi phạm nếu có.<br>3. Học viên nhấn "Gửi xác nhận". Hệ thống lưu bản ghi vào `CourseCompletionFeedback` và phát thông báo in-app cho Giảng viên.<br>4. **Theo dõi tiến độ & Gửi yêu cầu (Giảng viên):** Giảng viên vào Teacher Dashboard, kiểm tra tỷ lệ học viên đã xác nhận kết thúc (`completionRate`). Khi tỷ lệ đạt từ 80% trở lên (hoặc lớp không có học viên), nút "Gửi yêu cầu nghiệm thu lên Admin" được kích hoạt.<br>5. Giảng viên nhấn nút gửi yêu cầu. Khóa học chuyển trạng thái sang `completed_pending`.<br>6. **Thẩm định & Phê duyệt (Quản trị viên):** Admin vào tab "Nghiệm thu khóa học" trên Admin Dashboard, kiểm tra tỷ lệ xác nhận và các phản hồi của học viên. Admin nhập ghi chú thẩm định (`adminNote`) và nhấn "Phê duyệt hoàn thành".<br>7. Hệ thống chuyển trạng thái khóa học sang `completed`, đánh dấu `adminApproved = true`, tự động tính toán và cộng 85% học phí vào số dư ví khả dụng (`Balance`) của Giảng viên, đồng thời gửi email chúc mừng. |
| **Luồng ngoại lệ** | - Tỷ lệ học viên xác nhận dưới 80%: Hệ thống khóa nút gửi yêu cầu của Giảng viên và yêu cầu nhắc nhở học viên hoàn thành form.<br>- Có báo cáo vi phạm nghiêm trọng từ học viên: Admin từ chối duyệt nghiệm thu và chuyển sang quy trình điều tra chất lượng giảng dạy. |

---

### **3.2.11 Use Case Chức năng 10: Đánh giá Khóa học, Giám sát Đánh giá Xấu & Tạm dừng Khóa học** {#3.2.11-use-case-chức-năng-10:-đánh-giá-khóa-học-giám-sát-đánh-giá-xấu-&-tạm-dừng-khóa-học}

![Biểu đồ Use Case Chức năng 10: Đánh giá Khóa học & Giám sát Đánh giá Xấu](generated_diagrams/uc_feat10_review.png)
*Hình 3.2.11: Biểu đồ Use Case Chức năng 10 - Đánh giá Khóa học, Giám sát Đánh giá Xấu & Tạm dừng Khóa học (Course Review & Moderation)*

| Hạng mục | Nội dung chi tiết |
| :--- | :--- |
| **Mã & Tên Use Case** | **UC-F10 – Đánh giá Khóa học, Giám sát Đánh giá Xấu & Xử lý Kỷ luật (Course Review & Moderation)** |
| **Tác nhân chính** | Học viên (Student), Giảng viên (Teacher), Quản trị viên (Admin) |
| **Tiền điều kiện** | Học viên đã tham gia khóa học; Quản trị viên có quyền kiểm soát chất lượng đào tạo. |
| **Hậu điều kiện** | Đánh giá được lưu vào `CourseReview`; tính lại điểm trung bình khóa học; tự động cảnh báo khi có đánh giá $\le 2$ sao; khóa học bị tạm dừng (`suspended`) nếu vi phạm chất lượng nghiêm trọng. |
| **Luồng sự kiện chính** | 1. **Gửi đánh giá (Học viên):** Học viên truy cập trang chi tiết khóa học, chọn số sao đánh giá (1 đến 5 sao) và nhập nhận xét chi tiết.<br>2. Hệ thống lưu đánh giá, tính toán lại điểm đánh giá trung bình (`averageRating`) và cập nhật `ratingStats` của khóa học.<br>3. **Cơ chế tự động phát hiện đánh giá tiêu cực:** Nếu đánh giá $\le 2$ sao, hệ thống tự động gán nhãn `isBadReview: true` và gửi thông báo cảnh báo tiêu cực đến Giảng viên.<br>4. Đồng thời, đánh giá xấu được đồng bộ hiển thị lên tab "Cảnh báo Đánh giá xấu" trên Admin Dashboard.<br>5. **Xử lý kỷ luật Tạm dừng Khóa học (Quản trị viên):** Nếu xét thấy phản ánh của học viên là xác đáng và khóa học kém chất lượng, Admin nhấn "Tạm dừng khóa học & Cảnh báo GV", nhập lý do vi phạm.<br>6. Hệ thống chuyển trạng thái khóa học sang `suspended`, ẩn khóa học khỏi kết quả tìm kiếm và gửi Email Cảnh báo Vi phạm Chất lượng chính thức tới Giảng viên, yêu cầu giải trình trong vòng 48 giờ.<br>7. **Mở lại khóa học:** Sau khi Giảng viên giải trình thỏa đáng và khắc phục sự cố, Admin nhấn "Gỡ bỏ tạm dừng", khôi phục khóa học về trạng thái `active`. |
| **Luồng ngoại lệ** | - Học viên chưa nhập bình luận hoặc chưa chọn số sao: Hệ thống báo lỗi và yêu cầu điền đầy đủ.<br>- Admin bỏ trống lý do khi tạm dừng: Hệ thống yêu cầu bắt buộc nhập nội dung biên bản giải trình. |

---

### **3.2.12 Use Case Chức năng 11: Quản trị Tài khoản Người dùng & Kiểm soát Vi phạm** {#3.2.12-use-case-chức-năng-11:-quản-trị-tài-khoản-người-dùng-&-kiểm-soát-vi-phạm}

![Biểu đồ Use Case Chức năng 11: Quản trị Tài khoản Người dùng & Kiểm soát Vi phạm](generated_diagrams/uc_feat11_user_mgmt.png)
*Hình 3.2.12: Biểu đồ Use Case Chức năng 11 - Quản trị Tài khoản Người dùng & Kiểm soát Vi phạm (User Account Moderation)*

| Hạng mục | Nội dung chi tiết |
| :--- | :--- |
| **Mã & Tên Use Case** | **UC-F11 – Quản trị Tài khoản Người dùng & Kiểm soát Trạng thái Vi phạm (User Account Moderation)** |
| **Tác nhân chính** | Quản trị viên (Admin), Người dùng bị xử lý (Học viên / Giảng viên) |
| **Tiền điều kiện** | Quản trị viên đăng nhập thành công vào bảng điều khiển Admin. |
| **Hậu điều kiện** | Trường `accountStatus` của người dùng được cập nhật (`active`, `suspended`, `banned`); lưu lý do kỷ luật `statusReason`; gửi email thông báo kỷ luật tới người dùng. |
| **Luồng sự kiện chính** | 1. Quản trị viên truy cập mục "Quản lý Người dùng" trên Admin Dashboard.<br>2. Hệ thống tải danh sách hợp nhất tất cả Học viên và Giảng viên, hiển thị rõ họ tên, email, vai trò, trạng thái tài khoản hiện tại và ngày khởi tạo.<br>3. Admin sử dụng bộ lọc vai trò, lọc trạng thái hoặc tìm kiếm nhanh theo Tên, Email.<br>4. Khi phát hiện người dùng vi phạm quy chế hoặc gian lận, Admin chọn tài khoản và mở modal đổi trạng thái.<br>5. Admin chọn trạng thái kỷ luật mới: Tạm khóa (`suspended`), Khóa vĩnh viễn (`banned`), hoặc Mở khóa lại (`active`), đồng thời bắt buộc nhập lý do kỷ luật (`statusReason`).<br>6. Admin nhấn xác nhận. Hệ thống cập nhật cơ sở dữ liệu và tự động kích hoạt gửi Email Thông báo Kỷ luật chính thức tới hòm thư người dùng.<br>7. Khi tài khoản ở trạng thái `suspended` hoặc `banned`, mọi nỗ lực đăng nhập của người dùng sẽ bị hệ thống chặn lại và hiển thị thông báo lý do chi tiết. |
| **Luồng ngoại lệ** | - Admin không nhập lý do kỷ luật: Hệ thống yêu cầu bắt buộc nhập lý do trước khi thực hiện đổi trạng thái.<br>- Người dùng không tồn tại trong hệ thống: Báo lỗi 404 Not Found. |

---

### **3.2.13 Use Case Chức năng 12: Bảng điều khiển Tài chính Sàn & Dòng tiền Ký quỹ** {#3.2.13-use-case-chức-năng-12:-bảng-điều-khiển-tài-chính-sàn-&-dòng-tiền-ký-quỹ}

![Biểu đồ Use Case Chức năng 12: Bảng điều khiển Tài chính Sàn & Dòng tiền Ký quỹ](generated_diagrams/uc_feat12_revenue.png)
*Hình 3.2.13: Biểu đồ Use Case Chức năng 12 - Bảng điều khiển Tài chính Sàn & Dòng tiền Ký quỹ (Platform Revenue & Escrow Overview)*

| Hạng mục | Nội dung chi tiết |
| :--- | :--- |
| **Mã & Tên Use Case** | **UC-F12 – Bảng điều khiển Tài chính Sàn & Giám sát Dòng tiền Ký quỹ (Platform Revenue & Escrow Overview)** |
| **Tác nhân chính** | Quản trị viên (Admin), Giảng viên (Teacher) |
| **Tiền điều kiện** | Quản trị viên đăng nhập quyền quản trị cao nhất; Giảng viên đăng nhập tài khoản giảng dạy. |
| **Hậu điều kiện** | Các chỉ số tài chính sàn (GMV, doanh thu hoa hồng sàn 15%, tiền ký quỹ Escrow, tiền đã mở khóa, tiền đã giải ngân) được tổng hợp và hiển thị trực quan theo thời gian thực. |
| **Luồng sự kiện chính** | 1. **Báo cáo Tài chính Toàn sàn (Quản trị viên):** Quản trị viên truy cập mục "Bảng điều khiển Tài chính & Doanh thu" trên Admin Dashboard.<br>2. Hệ thống tổng hợp theo thời gian thực các chỉ số tài chính trọng yếu:<br>   - Tổng giá trị giao dịch toàn sàn (Gross Merchandise Value - GMV).<br>   - Doanh thu hoa hồng ròng của nền tảng (Platform Net Revenue, 15% tổng GMV).<br>   - Tổng dòng tiền đang tạm khóa ký quỹ (Total Escrow Balance, tiền học phí của các khóa học chưa hoàn thành).<br>   - Tổng tiền đã mở khóa vào ví thù lao của Giảng viên (Unlocked Teacher Balance).<br>   - Tổng tiền đã giải ngân chuyển khoản thành công (Total Disbursed Amount).<br>3. Admin xem biểu đồ tăng trưởng doanh thu theo các tháng và bảng đối soát chi tiết 30 giao dịch gần nhất (kèm thông tin học viên, khóa học, mã giao dịch Razorpay).<br>4. **Báo cáo Thu nhập Cá nhân (Giảng viên):** Giảng viên vào mục Remuneration trên Teacher Dashboard để theo dõi doanh thu từng khóa học, số dư đang được ký quỹ, số dư khả dụng có thể rút tiền và lịch sử giải ngân các lệnh rút tiền đã hoàn tất. |
| **Luồng ngoại lệ** | - Chưa có dữ liệu giao dịch: Hệ thống hiển thị biểu đồ rỗng và các chỉ số mặc định là 0 VNĐ mà không gây lỗi giao diện. |

---
"""

    old_section_3_2_pattern = r'## \*\*3\.2 Use Cases\*\* \{#3\.2-use-cases\}.*?(?=## \*\*3\.3 Entity Relationship Diagrams \(ERD\)\*\*)'
    content = re.sub(old_section_3_2_pattern, lambda m: new_section_3_2, content, flags=re.DOTALL)

    with open('EduPulse_SRS.docx.md', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Cập nhật EduPulse_SRS.docx.md thành công hoàn tất!")

if __name__ == '__main__':
    main()
