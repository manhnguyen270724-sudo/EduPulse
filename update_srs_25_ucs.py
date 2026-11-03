import os
import sys
sys.stdout.reconfigure(encoding='utf-8')
import re

def main():
    with open('EduPulse_SRS.docx.md', 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Cập nhật Mục lục phần 3.2 thành 25 Use Case
    old_toc_pattern = r'\[3\.2 Use Cases\t10\]\(#3\.2-use-cases\).*?\[3\.3 Entity Relationship Diagrams \(ERD\)\t20\]\(#3\.3-entity-relationship-diagrams-\(erd\)\)'
    
    new_toc = """[3.2 Use Cases\t10](#3.2-use-cases)

[3.2.1 Bảng Tổng quan 25 Use Cases & Biểu đồ Use Case Toàn hệ thống\t10](#3.2.1-bảng-tổng-quan-25-use-cases-&-biểu-đồ-use-case-toàn-hệ-thống)

[3.2.2 Đặc tả Use Case 01: Đăng ký tài khoản người dùng\t11](#3.2.2-đặc-tả-use-case-01:-đăng-ký-tài-khoản-người-dùng)

[3.2.3 Đặc tả Use Case 02: Xác thực email & Kích hoạt tài khoản\t11](#3.2.3-đặc-tả-use-case-02:-xác-thực-email-&-kích-hoạt-tài-khoản)

[3.2.4 Đặc tả Use Case 03: Đăng nhập & Quản lý phiên JWT\t12](#3.2.4-đặc-tả-use-case-03:-đăng-nhập-&-quản-lý-phiên-jwt)

[3.2.5 Đặc tả Use Case 04: Quên & Đặt lại mật khẩu tài khoản\t12](#3.2.5-đặc-tả-use-case-04:-quên-&-đặt-lại-mật-khẩu-tài-khoản)

[3.2.6 Đặc tả Use Case 05: Quản lý hồ sơ cá nhân công khai & Bio\t13](#3.2.6-đặc-tả-use-case-05:-quản-lý-hồ-sơ-cá-nhân-công-khai-&-bio)

[3.2.7 Đặc tả Use Case 06: Nộp hồ sơ minh chứng danh tính & Bằng cấp KYC\t13](#3.2.7-đặc-tả-use-case-06:-nộp-hồ-sơ-minh-chứng-danh-tính-&-bằng-cấp-kyc)

[3.2.8 Đặc tả Use Case 07: Thẩm định & Phê duyệt hồ sơ năng lực KYC\t14](#3.2.8-đặc-tả-use-case-07:-thẩm-định-&-phê-duyệt-hồ-sơ-năng-lực-kyc)

[3.2.9 Đặc tả Use Case 08: Tìm kiếm, lọc & Khám phá khóa học đa cấp\t14](#3.2.9-đặc-tả-use-case-08:-tìm-kiếm-lọc-&-khám-phá-khóa-học-đa-cấp)

[3.2.10 Đặc tả Use Case 09: Đăng ký khóa học & Thanh toán học phí Razorpay\t15](#3.2.10-đặc-tả-use-case-09:-đăng-ký-khóa-học-&-thanh-toán-học-phí-razorpay)

[3.2.11 Đặc tả Use Case 10: Khởi tạo đề cương giáo trình khóa học\t15](#3.2.11-đặc-tả-use-case-10:-khởi-tạo-đề-cương-giáo-trình-khóa-học)

[3.2.12 Đặc tả Use Case 11: Thẩm định & Phê duyệt xuất bản khóa học\t16](#3.2.12-đặc-tả-use-case-11:-thẩm-định-&-phê-duyệt-xuất-bản-khóa-học)

[3.2.13 Đặc tả Use Case 12: Khởi tạo lớp học trực tuyến mới\t16](#3.2.13-đặc-tả-use-case-12:-khởi-tạo-lớp-học-trực-tuyến-mới)

[3.2.14 Đặc tả Use Case 13: Lập lịch buổi học & Tham gia phòng học Live\t17](#3.2.14-đặc-tả-use-case-13:-lập-lịch-buổi-học-&-tham-gia-phòng-học-live)

[3.2.15 Đặc tả Use Case 14: Trao đổi tin nhắn & Chia sẻ tài liệu lớp học\t17](#3.2.15-đặc-tả-use-case-14:-trao-đổi-tin-nhắn-&-chia-sẻ-tài-liệu-lớp-học)

[3.2.16 Đặc tả Use Case 15: Nhận thông báo nhắc lịch học tự động\t18](#3.2.16-đặc-tả-use-case-15:-nhận-thông-báo-nhắc-lịch-học-tự-động)

[3.2.17 Đặc tả Use Case 16: Gửi biểu mẫu yêu cầu hỗ trợ (Contact Us)\t18](#3.2.17-đặc-tả-use-case-16:-gửi-biểu-mẫu-yêu-cầu-hỗ-trợ-(contact-us))

[3.2.18 Đặc tả Use Case 17: Tiếp nhận & Xử lý khiếu nại hỗ trợ khách hàng\t19](#3.2.18-đặc-tả-use-case-17:-tiếp-nhận-&-xử-lý-khiếu-nại-hỗ-trợ-khách-hàng)

[3.2.19 Đặc tả Use Case 18: Nộp form xác nhận kết thúc khóa học (MỚI)\t19](#3.2.19-đặc-tả-use-case-18:-nộp-form-xác-nhận-kết-thúc-khóa-học-(mới))

[3.2.20 Đặc tả Use Case 19: Theo dõi tiến độ & Gửi yêu cầu nghiệm thu (MỚI)\t20](#3.2.20-đặc-tả-use-case-19:-theo-dõi-tiến-độ-&-gửi-yêu-cầu-nghiệm-thu-(mới))

[3.2.21 Đặc tả Use Case 20: Thẩm định & Phê duyệt nghiệm thu khóa học (MỚI)\t20](#3.2.21-đặc-tả-use-case-20:-thẩm-định-&-phê-duyệt-nghiệm-thu-khóa-học-(mới))

[3.2.22 Đặc tả Use Case 21: Gửi đánh giá sao & Nhận xét khóa học (MỚI)\t21](#3.2.22-đặc-tả-use-case-21:-gửi-đánh-giá-sao-&-nhận-xét-khóa-học-(mới))

[3.2.23 Đặc tả Use Case 22: Giám sát đánh giá xấu & Tạm dừng khóa học (MỚI)\t21](#3.2.23-đặc-tả-use-case-22:-giám-sát-đánh-giá-xấu-&-tạm-dừng-khóa-học-(mới))

[3.2.24 Đặc tả Use Case 23: Quản trị tài khoản người dùng & Kỷ luật vi phạm (MỚI)\t22](#3.2.24-đặc-tả-use-case-23:-quản-trị-tài-khoản-người-dùng-&-kỷ-luật-vi-phạm-(mới))

[3.2.25 Đặc tả Use Case 24: Tạo yêu cầu rút tiền thù lao giảng dạy (MỚI)\t22](#3.2.25-đặc-tả-use-case-24:-tạo-yêu-cầu-rút-tiền-thù-lao-giảng-dạy-(mới))

[3.2.26 Đặc tả Use Case 25: Quản trị tài chính sàn GMV & Giải ngân chuyển khoản (MỚI)\t23](#3.2.26-đặc-tả-use-case-25:-quản-trị-tài-chính-sàn-gmv-&-giải-ngân-chuyển-khoản-(mới))

[3.3 Entity Relationship Diagrams (ERD)\t20](#3.3-entity-relationship-diagrams-(erd))"""

    content = re.sub(old_toc_pattern, lambda m: new_toc, content, flags=re.DOTALL)

    # 2. Xây dựng nội dung Section 3.2 mới gồm 25 Use Case
    usecases_specs = [
        # UC01
        {
            "num": "01", "sec": "3.2.2", "code": "UC01",
            "name": "Đăng ký tài khoản người dùng (User Sign-up)",
            "img": "generated_diagrams/uc_01_signup.png",
            "actor": "Khách vãng lai, Học viên mới, Giảng viên mới",
            "pre": "Người dùng chưa có tài khoản trên EduPulse, truy cập trang đăng ký.",
            "post": "Tài khoản được khởi tạo trong CSDL ở trạng thái chờ kích hoạt; mật khẩu được băm Bcrypt 10 rounds; email kích hoạt được gửi đi.",
            "main_flow": "1. Người dùng chọn 'Đăng ký' trên thanh điều hướng.<br>2. Nhập Họ, Tên, Địa chỉ Email, Mật khẩu và xác nhận Mật khẩu.<br>3. Hệ thống kiểm tra tính hợp lệ của dữ liệu đầu vào và kiểm tra trùng lặp email.<br>4. Hệ thống băm mật khẩu bằng thuật toán Bcrypt (10 rounds salting).<br>5. Bản ghi người dùng được tạo trong CSDL.<br>6. Hệ thống tạo mã token xác thực dùng một lần và gửi email kích hoạt qua dịch vụ Nodemailer.",
            "alt_flow": "- Email đã được đăng ký: Báo lỗi 'Email already exists' (HTTP 400).<br>- Mật khẩu không đủ độ mạnh: Yêu cầu tối thiểu 6 ký tự.<br>- Lỗi gửi email: Báo lỗi kết nối máy chủ thư và yêu cầu thử lại."
        },
        # UC02
        {
            "num": "02", "sec": "3.2.3", "code": "UC02",
            "name": "Xác thực email & Kích hoạt tài khoản (Verify Email)",
            "img": "generated_diagrams/uc_02_verify_email.png",
            "actor": "Người dùng mới (User)",
            "pre": "Người dùng đã nhận được thư điện tử xác thực chứa mã token hợp lệ.",
            "post": "Trạng thái tài khoản chuyển sang hợp lệ (`accountStatus: active`), người dùng có thể đăng nhập.",
            "main_flow": "1. Người dùng mở email kích hoạt và nhấp vào liên kết xác thực.<br>2. Trình duyệt gửi yêu cầu GET tới API xác thực kèm chuỗi token.<br>3. Máy chủ kiểm tra token trong CSDL và hạn sử dụng.<br>4. Nếu hợp lệ, hệ thống cập nhật trường trạng thái tài khoản thành kích hoạt thành công.<br>5. Chuyển hướng người dùng tới trang thông báo kích hoạt thành công kèm nút Đăng nhập.",
            "alt_flow": "- Token hết hạn hoặc không hợp lệ: Báo lỗi xác thực thất bại, hiển thị nút yêu cầu gửi lại email kích hoạt."
        },
        # UC03
        {
            "num": "03", "sec": "3.2.4", "code": "UC03",
            "name": "Đăng nhập & Quản lý phiên JWT (User Login & JWT Session)",
            "img": "generated_diagrams/uc_03_login.png",
            "actor": "Học viên (Student), Giảng viên (Teacher), Quản trị viên (Admin)",
            "pre": "Người dùng đã đăng ký tài khoản và có kết nối mạng Internet.",
            "post": "Hệ thống cấp cặp JWT (Access Token 15 phút, Refresh Token 7 ngày) qua HttpOnly Cookie; điều hướng về Dashboard tương ứng.",
            "main_flow": "1. Người dùng chọn 'Đăng nhập', điền Email và Mật khẩu.<br>2. Máy chủ tra cứu tài khoản theo email, đối soát mật khẩu đã băm bằng Bcrypt.<br>3. Kiểm tra trạng thái tài khoản (`accountStatus`): Nếu bình thường (`active`), tiếp tục.<br>4. Máy chủ sinh mã Access Token (15 phút) và Refresh Token (7 ngày).<br>5. Lưu mã khóa vào HttpOnly Cookie bảo mật và phản hồi thông tin định danh người dùng.<br>6. Điều hướng người dùng tới giao diện làm việc theo đúng vai trò.",
            "alt_flow": "- Nhập sai Email hoặc Mật khẩu: Báo lỗi 'Invalid credentials'.<br>- Tài khoản bị tạm khóa (`suspended`) hoặc cấm (`banned`): Chặn đăng nhập, hiển thị thông báo lý do kỷ luật (`statusReason`) và hướng dẫn hỗ trợ."
        },
        # UC04
        {
            "num": "04", "sec": "3.2.5", "code": "UC04",
            "name": "Quên & Đặt lại mật khẩu tài khoản (Forgot & Reset Password)",
            "img": "generated_diagrams/uc_04_reset_pwd.png",
            "actor": "Người dùng (User)",
            "pre": "Người dùng không nhớ mật khẩu đăng nhập, truy cập liên kết Quên mật khẩu.",
            "post": "Mật khẩu cũ được thay thế bằng mật khẩu mới băm Bcrypt; token đặt lại bị vô hiệu hóa.",
            "main_flow": "1. Người dùng nhấp vào 'Quên mật khẩu' tại trang đăng nhập.<br>2. Nhập địa chỉ Email đã đăng ký và nhấn 'Gửi yêu cầu'.<br>3. Hệ thống tạo chuỗi token ngẫu nhiên, băm SHA-256 lưu tạm trong CSDL với thời hạn 15 phút.<br>4. Gửi email chứa đường dẫn đặt lại mật khẩu tới hòm thư người dùng.<br>5. Người dùng mở link, nhập mật khẩu mới và xác nhận mật khẩu mới.<br>6. Hệ thống băm mật khẩu mới bằng Bcrypt và cập nhật CSDL, xóa token tạm.",
            "alt_flow": "- Email không tồn tại: Báo lỗi hoặc thông báo kiểm tra hòm thư.<br>- Token hết hạn sau 15 phút: Báo lỗi token hết hạn và yêu cầu thực hiện lại."
        },
        # UC05
        {
            "num": "05", "sec": "3.2.6", "code": "UC05",
            "name": "Quản lý hồ sơ cá nhân công khai & Bio (Manage Profile & Bio)",
            "img": "generated_diagrams/uc_05_profile.png",
            "actor": "Học viên (Student), Giảng viên (Teacher)",
            "pre": "Người dùng đã đăng nhập thành công vào hệ thống.",
            "post": "Thông tin cá nhân, ảnh đại diện và tiểu sử được cập nhật hiển thị.",
            "main_flow": "1. Người dùng truy cập mục Hồ sơ cá nhân (Profile).<br>2. Xem thông tin hiện tại: Họ tên, Email, Số điện thoại, Địa chỉ, Tiểu sử (Bio), Ảnh đại diện.<br>3. Thay đổi thông tin cần cập nhật.<br>4. Người dùng chọn ảnh đại diện mới từ thiết bị, tải lên bộ lưu trữ Cloudinary qua HTTPS.<br>5. Nhấn 'Lưu thay đổi'. Hệ thống cập nhật bản ghi trong CSDL và hiển thị thông báo thành công.",
            "alt_flow": "- Ảnh tải lên sai định dạng hoặc quá 5MB: Báo lỗi định dạng và yêu cầu chọn lại."
        },
        # UC06
        {
            "num": "06", "sec": "3.2.7", "code": "UC06",
            "name": "Nộp hồ sơ minh chứng danh tính & Bằng cấp KYC (Upload KYC Documents)",
            "img": "generated_diagrams/uc_06_upload_kyc.png",
            "actor": "Giảng viên (Teacher), Học viên (Student)",
            "pre": "Giảng viên đã đăng nhập và chuẩn bị tệp minh chứng bằng cấp hợp lệ.",
            "post": "Tài liệu được lưu trữ trên Cloudinary; bản ghi `TeacherDocs` được tạo/cập nhật ở trạng thái `pending`.",
            "main_flow": "1. Giảng viên truy cập mục Xác minh KYC trên Teacher Dashboard.<br>2. Nhập thông tin học vấn: Trường đại học (UG/PG), điểm số tốt nghiệp, năm kinh nghiệm.<br>3. Tải lên các tệp tài liệu: Căn cước công dân (Aadhaar/CCCD), Bằng tốt nghiệp ĐH, Bằng Thạc sĩ/Tiến sĩ, Chứng chỉ sư phạm.<br>4. Hệ thống tải tệp lên Cloudinary, nhận URL an toàn và lưu vào CSDL.<br>5. Đặt trạng thái phê duyệt `Isapproved = 'pending'`.<br>6. Hiển thị thông báo hồ sơ đã được nộp thành công và đang chờ Quản trị viên thẩm định.",
            "alt_flow": "- Thiếu tệp bắt buộc: Báo lỗi yêu cầu tải đủ tài liệu minh chứng tối thiểu.<br>- Tệp không phải PDF/JPG/PNG: Từ chối tải tệp."
        },
        # UC07
        {
            "num": "07", "sec": "3.2.8", "code": "UC07",
            "name": "Thẩm định & Phê duyệt hồ sơ năng lực KYC (Admin Review KYC)",
            "img": "generated_diagrams/uc_07_review_kyc.png",
            "actor": "Quản trị viên (Admin)",
            "pre": "Admin đăng nhập vào bảng điều khiển; có hồ sơ KYC ở trạng thái `pending`.",
            "post": "Trạng thái KYC của người dùng được cập nhật (`approved`, `reupload`, `rejected`); thông báo được gửi tới người dùng.",
            "main_flow": "1. Admin truy cập tab 'Duyệt hồ sơ KYC' trên Admin Dashboard.<br>2. Xem danh sách hồ sơ đang chờ thẩm định.<br>3. Mở xem trực tiếp các tệp minh chứng: Căn cước công dân, bằng cấp đại học, chứng chỉ trên Cloudinary.<br>4. Đối soát thông tin kê khai và tính pháp lý của văn bằng.<br>5. Chọn quyết định: Phê duyệt (`approved`), Yêu cầu nộp lại (`reupload`) hoặc Từ chối (`rejected`).<br>6. Nhập nhận xét phản hồi (Remarks) và nhấn 'Xác nhận'.<br>7. Hệ thống cập nhật CSDL và gửi thông báo in-app kết quả thẩm định cho người dùng.",
            "alt_flow": "- Bằng cấp mờ hoặc không hợp lệ: Admin chọn `reupload` kèm ghi chú yêu cầu chụp lại rõ nét."
        },
        # UC08
        {
            "num": "08", "sec": "3.2.9", "code": "UC08",
            "name": "Tìm kiếm, lọc & Khám phá khóa học đa cấp (Explore Courses)",
            "img": "generated_diagrams/uc_08_explore_course.png",
            "actor": "Học viên (Student), Khách vãng lai",
            "pre": "Người dùng truy cập vào trang danh mục khóa học `/courses`.",
            "post": "Danh sách khóa học phù hợp với bộ lọc và từ khóa được hiển thị trực quan.",
            "main_flow": "1. Người dùng vào trang Khám phá khóa học.<br>2. Nhập từ khóa tìm kiếm trên thanh tra cứu.<br>3. Sử dụng bộ lọc phân cấp 3 tầng chuẩn: Cấp học (Tiểu học, THCS, THPT, Đại học) → Khối lớp (Lớp 1-12, Năm 1-4) → Môn học.<br>4. Hệ thống truy vấn CSDL các khóa học có `isapproved: true` và `status: active` thỏa mãn điều kiện.<br>5. Hiển thị danh sách kết quả gồm ảnh bìa, tên khóa, giảng viên, điểm đánh giá sao và học phí.<br>6. Người dùng bấm vào thẻ khóa học để xem đề cương chi tiết (Syllabus) và mục tiêu kết quả đầu ra.",
            "alt_flow": "- Không tìm thấy khóa học phù hợp: Hiển thị thông báo không có kết quả và gợi ý từ khóa phổ biến."
        },
        # UC09
        {
            "num": "09", "sec": "3.2.10", "code": "UC09",
            "name": "Đăng ký khóa học & Thanh toán học phí Razorpay (Course Enrollment & Payment)",
            "img": "generated_diagrams/uc_09_payment_enroll.png",
            "actor": "Học viên (Student), Cổng thanh toán Razorpay",
            "pre": "Học viên đã đăng nhập tài khoản hợp lệ; khóa học đang mở ghi danh.",
            "post": "Giao dịch được lưu trong bảng `Payment`; tiền học phí được ký quỹ (Escrow); học viên được thêm vào danh sách lớp.",
            "main_flow": "1. Học viên nhấn 'Đăng ký ngay' (Enroll Now) tại trang chi tiết khóa học.<br>2. Máy chủ gọi API Razorpay tạo đơn hàng `order_id`.<br>3. Cửa sổ thanh toán Razorpay mở ra, học viên chọn phương thức thanh toán (Thẻ, UPI, Netbanking) và hoàn tất trả phí.<br>4. Cổng thanh toán gửi mã chữ ký xác thực `razorpay_signature`.<br>5. Máy chủ đối soát chữ ký điện tử HMAC-SHA256 để chống gian lận.<br>6. Khi đối soát thành công, hệ thống lưu bản ghi `Payment`, đưa học viên vào danh sách `enrolledStudent` của khóa học.<br>7. Học phí được chuyển vào tài khoản ký quỹ sàn (Escrow Balance).<br>8. Hiển thị thông báo đăng ký thành công và đưa học viên vào lớp học.",
            "alt_flow": "- Học viên hủy thanh toán hoặc giao dịch thất bại: Hủy bỏ ghi danh và báo lỗi.<br>- Chữ ký giả mạo: Từ chối giao dịch, ghi log cảnh báo an ninh."
        },
        # UC10
        {
            "num": "10", "sec": "3.2.11", "code": "UC10",
            "name": "Khởi tạo đề cương giáo trình khóa học (Create & Edit Course Syllabus)",
            "img": "generated_diagrams/uc_10_create_course.png",
            "actor": "Giảng viên (Teacher)",
            "pre": "Giảng viên đã được phê duyệt hồ sơ KYC (`Isapproved = 'approved'`).",
            "post": "Khóa học mới được lưu trong CSDL ở trạng thái chờ duyệt xuất bản (`isapproved = false`).",
            "main_flow": "1. Giảng viên vào Teacher Dashboard → Courses, chọn 'Thêm khóa học mới'.<br>2. Chọn phân cấp 3 tầng: Cấp học, Khối lớp, Môn học.<br>3. Nhập tên khóa học, mô tả, ảnh bìa, mức học phí (Fees).<br>4. Nhập đề cương chi tiết (Syllabus) gồm danh sách các chương mục và mục tiêu đầu ra (Outcomes).<br>5. Giảng viên nhấn 'Gửi yêu cầu xuất bản'.<br>6. Hệ thống lưu bản ghi `Course` với trạng thái `isapproved = false` và gửi thông báo lên hàng đợi của Quản trị viên.",
            "alt_flow": "- Bỏ trống các trường bắt buộc: Báo lỗi và yêu cầu điền đầy đủ giáo trình."
        },
        # UC11
        {
            "num": "11", "sec": "3.2.12", "code": "UC11",
            "name": "Thẩm định & Phê duyệt xuất bản khóa học (Admin Approve Course Publication)",
            "img": "generated_diagrams/uc_11_approve_course.png",
            "actor": "Quản trị viên (Admin)",
            "pre": "Admin đăng nhập hệ thống; có khóa học mới đang chờ phê duyệt.",
            "post": "Khóa học chuyển trạng thái `isapproved = true`, xuất hiện công khai trên trang tìm kiếm.",
            "main_flow": "1. Admin truy cập tab 'Duyệt khóa học' trên Admin Dashboard.<br>2. Xem danh sách các khóa học chờ xuất bản.<br>3. Mở xem chi tiết giáo trình, mục tiêu đầu ra và mức học phí do giảng viên đề xuất.<br>4. Admin kiểm tra chuẩn mực sư phạm và tính phù hợp của nội dung.<br>5. Nhấn 'Phê duyệt xuất bản' (`isapproved = true`).<br>6. Hệ thống cập nhật CSDL và gửi thông báo in-app chúc mừng tới Giảng viên phụ trách.",
            "alt_flow": "- Giáo trình không đạt yêu cầu: Admin từ chối duyệt kèm lý do chỉnh sửa gửi lại cho Giảng viên."
        },
        # UC12
        {
            "num": "12", "sec": "3.2.13", "code": "UC12",
            "name": "Khởi tạo lớp học trực tuyến mới (Create Classroom)",
            "img": "generated_diagrams/uc_12_create_class.png",
            "actor": "Giảng viên (Teacher)",
            "pre": "Khóa học liên kết đã được phê duyệt công khai; Giảng viên là chủ sở hữu khóa học.",
            "post": "Lớp học được khởi tạo trong CSDL kèm mã duy nhất `classCode`.",
            "main_flow": "1. Giảng viên vào Teacher Dashboard → Classrooms, chọn 'Tạo lớp học'.<br>2. Chọn khóa học tương ứng và đặt tên lớp.<br>3. Chọn hình thức tổ chức: Lớp nhóm (Group - tối đa 20 học viên) hoặc Lớp 1-kèm-1 (One-on-One - tối đa 1 học viên).<br>4. Thiết lập lịch học cố định hàng tuần (Weekly Schedule).<br>5. Hệ thống tự động sinh mã định danh duy nhất `classCode` (dạng `EP-GRP-xxxx` hoặc `EP-1ON1-xxxx`).<br>6. Lưu bản ghi `Classroom` vào CSDL và chuyển hướng tới trang quản lý lớp học.",
            "alt_flow": "- Trùng tên hoặc sai định dạng: Báo lỗi và yêu cầu điều chỉnh."
        },
        # UC13
        {
            "num": "13", "sec": "3.2.14", "code": "UC13",
            "name": "Lập lịch buổi học & Tham gia phòng học Live (Schedule & Attend Live Sessions)",
            "img": "generated_diagrams/uc_13_live_session.png",
            "actor": "Giảng viên (Teacher), Học viên (Student)",
            "pre": "Lớp học đã được tạo; Giảng viên và Học viên là thành viên của lớp.",
            "post": "Buổi học được lập lịch trong CSDL; các thành viên truy cập thành công vào phòng học trực tiếp.",
            "main_flow": "1. Giảng viên mở chi tiết lớp học, chọn 'Thêm buổi học' (Session).<br>2. Nhập tiêu đề bài học, ngày học, giờ bắt đầu, thời lượng dự kiến và đường dẫn phòng học (`roomLink` Google Meet / WebRTC).<br>3. Hệ thống lưu buổi học vào mảng `sessions` của lớp.<br>4. Học viên xem thời khóa biểu các buổi học trên Dashboard.<br>5. Khi đến giờ học, nút 'Vào phòng học Live' được kích hoạt.<br>6. Giảng viên và Học viên nhấn nút để tham gia lớp học trực tuyến theo thời gian thực.",
            "alt_flow": "- Trùng lịch dạy khác của Giảng viên: Hệ thống cảnh báo xung đột thời gian."
        },
        # UC14
        {
            "num": "14", "sec": "3.2.15", "code": "UC14",
            "name": "Trao đổi tin nhắn & Chia sẻ tài liệu lớp học (Classroom Chat & File Sharing)",
            "img": "generated_diagrams/uc_14_chat.png",
            "actor": "Học viên (Student), Giảng viên (Teacher)",
            "pre": "Người dùng là thành viên chính thức của lớp học.",
            "post": "Tin nhắn và tài liệu đính kèm được lưu trong `ChatMessage` và hiển thị trong luồng trao đổi của lớp.",
            "main_flow": "1. Người dùng truy cập phòng chat của lớp học (`/classroom/:id/chat`).<br>2. Hệ thống kiểm tra quyền thành viên theo `classCode`.<br>3. Người dùng nhập tin nhắn văn bản trao đổi bài tập hoặc thắc mắc.<br>4. Người dùng bấm chọn tệp tài liệu đính kèm (PDF, DOCX, ảnh). Hệ thống tải file lên Cloudinary và lấy đường dẫn URL an toàn.<br>5. Nhấn 'Gửi'. Tin nhắn được lưu vào CSDL và phát tới tất cả các thành viên trong lớp học.<br>6. Thành viên khác mở xem nội dung và tải tài liệu học tập.",
            "alt_flow": "- Người ngoài lớp cố truy cập: Báo lỗi 403 Forbidden.<br>- Tệp vượt quá 20MB: Báo lỗi từ chối tải tệp."
        },
        # UC15
        {
            "num": "15", "sec": "3.2.16", "code": "UC15",
            "name": "Nhận thông báo nhắc lịch học tự động (Automated Class Reminders & Notifications)",
            "img": "generated_diagrams/uc_15_notifications.png",
            "actor": "Bộ quét tự động (Scheduler), Học viên (Student), Giảng viên (Teacher)",
            "pre": "Có các buổi học sắp diễn ra theo lịch đã thiết lập.",
            "post": "Bản ghi `Notification` được tạo; hiển thị huy hiệu đỏ trên chuông thông báo; người dùng nhận được nhắc nhở.",
            "main_flow": "1. Tác vụ ngầm của máy chủ định kỳ quét các buổi học sắp bắt đầu trong 15-30 phút tới.<br>2. Hệ thống tìm danh sách Học viên và Giảng viên của buổi học đó.<br>3. Tạo bản ghi `Notification` mới với loại `class_reminder` và liên kết tới phòng học.<br>4. Khi người dùng truy cập web, component `NotificationBell` tải số lượng chưa đọc (`unreadCount`).<br>5. Người dùng nhấn chuông xem danh sách thông báo nhắc nhở.<br>6. Bấm vào thông báo để chuyển nhanh vào phòng học và tự động đánh dấu đã đọc (`isRead = true`).",
            "alt_flow": "- Buổi học bị hoãn/hủy: Hệ thống tạo thông báo thông tri dời lịch."
        },
        # UC16
        {
            "num": "16", "sec": "3.2.17", "code": "UC16",
            "name": "Gửi biểu mẫu yêu cầu hỗ trợ (Submit Contact Support)",
            "img": "generated_diagrams/uc_16_contact_us.png",
            "actor": "Khách vãng lai, Học viên, Giảng viên",
            "pre": "Người dùng có thắc mắc, khiếu nại hoặc cần liên hệ đội ngũ quản trị.",
            "post": "Bản ghi hỗ trợ được lưu vào bảng `Contact` với trạng thái chưa xử lý.",
            "main_flow": "1. Người dùng truy cập trang 'Liên hệ' tại `/contact`.<br>2. Nhập Họ và tên, Địa chỉ Email, Số điện thoại và Nội dung thông điệp chi tiết.<br>3. Nhấn nút 'Gửi liên hệ'.<br>4. Hệ thống kiểm tra dữ liệu đầu vào và lưu bản ghi vào bảng `Contact` trong CSDL.<br>5. Hiển thị thông báo cảm ơn và cam kết phản hồi trong vòng 24 giờ làm việc.",
            "alt_flow": "- Thiếu email hoặc nội dung trống: Báo lỗi yêu cầu điền đầy đủ."
        },
        # UC17
        {
            "num": "17", "sec": "3.2.18", "code": "UC17",
            "name": "Tiếp nhận & Xử lý khiếu nại hỗ trợ khách hàng (Admin Process Support Requests)",
            "img": "generated_diagrams/uc_17_admin_support.png",
            "actor": "Quản trị viên (Admin)",
            "pre": "Admin đăng nhập vào hệ thống; có thư liên hệ mới trong CSDL.",
            "post": "Thư liên hệ được xử lý phản hồi và cập nhật trạng thái 'Đã giải quyết'.",
            "main_flow": "1. Admin truy cập tab 'Hỗ trợ khách hàng' trên Admin Dashboard.<br>2. Xem danh sách các thư liên hệ mới gửi đến.<br>3. Mở xem chi tiết nội dung phản ánh hoặc khiếu nại của người dùng.<br>4. Thực hiện phản hồi người dùng qua email hoặc liên hệ trực tiếp.<br>5. Admin cập nhật trạng thái thư hỗ trợ sang 'Đã xử lý'.",
            "alt_flow": "- Thư rác/spam: Admin có thể chọn xóa hoặc đánh dấu bỏ qua."
        },
        # UC18
        {
            "num": "18", "sec": "3.2.19", "code": "UC18",
            "name": "Nộp form xác nhận kết thúc khóa học (Submit Course Completion Feedback - MỚI)",
            "img": "generated_diagrams/uc_18_student_feedback.png",
            "actor": "Học viên (Student)",
            "pre": "Học viên đã tham gia khóa học; khóa học đã bước vào giai đoạn kết thúc.",
            "post": "Bản ghi `CourseCompletionFeedback` được lưu; tỷ lệ hoàn thành khóa học được cập nhật; Giảng viên nhận thông báo.",
            "main_flow": "1. Học viên vào Student Dashboard → Courses, mở modal nghiệm thu `CourseCompletionModal`.<br>2. Học viên tích chọn xác nhận đã học đủ các buổi (`hasCompletedAllLessons`).<br>3. Đánh giá số sao về thời lượng & chuyên cần (1-5 sao).<br>4. Đánh giá chất lượng giảng dạy của giáo viên (1-5 sao).<br>5. Nhập ý kiến nhận xét và báo cáo sự cố vi phạm nếu có.<br>6. Nhấn 'Gửi xác nhận'. Hệ thống lưu bản ghi vào `CourseCompletionFeedback` với khóa duy nhất `{courseId, studentId}`.<br>7. Cập nhật tỷ lệ xác nhận nghiệm thu và gửi thông báo in-app cho Giảng viên.",
            "alt_flow": "- Học viên đã nộp trước đó: Hệ thống hiển thị dữ liệu cũ cho phép cập nhật lại."
        },
        # UC19
        {
            "num": "19", "sec": "3.2.20", "code": "UC19",
            "name": "Theo dõi tiến độ & Gửi yêu cầu nghiệm thu lên Admin (Teacher Request Completion - MỚI)",
            "img": "generated_diagrams/uc_19_request_completion.png",
            "actor": "Giảng viên (Teacher)",
            "pre": "Giảng viên phụ trách khóa học; các buổi giảng dạy đã hoàn tất.",
            "post": "Khóa học chuyển trạng thái sang `completed_pending`; Admin nhận yêu cầu thẩm định trên Dashboard.",
            "main_flow": "1. Giảng viên vào Teacher Dashboard → Courses, mở mục Thống kê nghiệm thu khóa học.<br>2. Xem tỷ lệ học viên đã xác nhận kết thúc (`completionRate`).<br>3. Kiểm tra điều kiện: Nếu tỷ lệ xác nhận đạt từ 80% trở lên (hoặc lớp không có học viên), nút 'Gửi yêu cầu nghiệm thu lên Admin' được kích hoạt.<br>4. Giảng viên nhấn nút gửi yêu cầu.<br>5. Hệ thống cập nhật trạng thái khóa học sang `completed_pending`, thiết lập `completionRequest.isRequested = true` và lưu thời điểm gửi yêu cầu.",
            "alt_flow": "- Tỷ lệ xác nhận dưới 80%: Hệ thống khóa nút gửi yêu cầu, thông báo giảng viên cần nhắc nhở học viên hoàn thành form xác nhận."
        },
        # UC20
        {
            "num": "20", "sec": "3.2.21", "code": "UC20",
            "name": "Thẩm định & Phê duyệt nghiệm thu hoàn thành khóa học (Admin Approve Completion - MỚI)",
            "img": "generated_diagrams/uc_20_admin_completion.png",
            "actor": "Quản trị viên (Admin), Giảng viên (Teacher)",
            "pre": "Khóa học ở trạng thái `completed_pending` do Giảng viên gửi lên.",
            "post": "Khóa học chuyển trạng thái `completed`; 85% học phí được mở khóa cộng vào ví khả dụng `Balance` của GV; gửi email chúc mừng.",
            "main_flow": "1. Admin vào tab 'Nghiệm thu khóa học' trên Admin Dashboard.<br>2. Xem danh sách các khóa học chờ nghiệm thu kèm tỷ lệ học viên xác nhận.<br>3. Mở xem chi tiết phản hồi của từng học viên (điểm chuyên cần, chất lượng giảng dạy, sự cố báo cáo).<br>4. Nhập ghi chú thẩm định của Admin (`adminNote`).<br>5. Nhấn 'Phê duyệt hoàn thành'.<br>6. Hệ thống cập nhật khóa học sang trạng thái `completed`, đánh dấu `adminApproved = true`.<br>7. Hệ thống tự động tính toán số tiền (85% học phí x số học viên) và cộng vào ví khả dụng `Balance` của Giảng viên.<br>8. Gửi thông báo in-app và gửi Email chúc mừng nghiệm thu thành công tới Giảng viên.",
            "alt_flow": "- Phát hiện khiếu nại vi phạm nghiêm trọng: Admin từ chối duyệt nghiệm thu và chuyển sang điều tra chất lượng."
        },
        # UC21
        {
            "num": "21", "sec": "3.2.22", "code": "UC21",
            "name": "Gửi đánh giá sao & Nhận xét khóa học (Submit Course Review - MỚI)",
            "img": "generated_diagrams/uc_21_course_review.png",
            "actor": "Học viên (Student)",
            "pre": "Học viên đã đăng ký tham gia khóa học.",
            "post": "Bản ghi `CourseReview` được lưu; điểm trung bình `averageRating` của khóa học được tính lại; tự động kích hoạt cảnh báo nếu điểm <= 2 sao.",
            "main_flow": "1. Học viên vào trang chi tiết khóa học, chọn phần Đánh giá.<br>2. Chọn số sao đánh giá (1 đến 5 sao) và nhập bình luận nhận xét chi tiết.<br>3. Nhấn 'Gửi đánh giá'.<br>4. Hệ thống lưu bản ghi vào bảng `CourseReview`.<br>5. Tính toán lại điểm trung bình và cập nhật `ratingStats` của khóa học.<br>6. Kiểm tra tự động: Nếu số sao <= 2, hệ thống tự động gán nhãn `isBadReview: true` và gửi thông báo cảnh báo tiêu cực đến Giảng viên.",
            "alt_flow": "- Bỏ trống số sao hoặc bình luận: Báo lỗi yêu cầu điền đầy đủ nội dung đánh giá."
        },
        # UC22
        {
            "num": "22", "sec": "3.2.23", "code": "UC22",
            "name": "Giám sát cảnh báo đánh giá xấu, Tạm dừng & Mở lại khóa học (Bad Review Moderation & Suspension - MỚI)",
            "img": "generated_diagrams/uc_22_review_suspension.png",
            "actor": "Quản trị viên (Admin), Giảng viên (Teacher)",
            "pre": "Hệ thống ghi nhận đánh giá xấu (<= 2 sao); Admin có quyền quản trị nội dung.",
            "post": "Khóa học bị tạm dừng (`suspended`) và ẩn khỏi sàn; gửi email cảnh báo 48h tới GV; hoặc mở lại khóa học (`active`) sau giải trình.",
            "main_flow": "1. Admin truy cập tab 'Cảnh báo Đánh giá xấu' trên Admin Dashboard.<br>2. Xem danh sách các đánh giá tiêu cực và khiếu nại của học viên.<br>3. Nếu xét thấy vi phạm nghiêm trọng, Admin nhấn 'Tạm dừng khóa học & Cảnh báo GV'.<br>4. Nhập lý do kỷ luật tạm dừng.<br>5. Hệ thống chuyển trạng thái khóa học sang `suspended`, ẩn khóa học khỏi kết quả tìm kiếm.<br>6. Tự động gửi Email Cảnh báo Vi phạm Chất lượng chính thức tới Giảng viên (yêu cầu giải trình trong vòng 48h).<br>7. Sau khi Giảng viên giải trình thỏa đáng, Admin vào lại khóa học nhấn 'Gỡ bỏ tạm dừng' (`unsuspend`) để khôi phục trạng thái `active`.",
            "alt_flow": "- Admin không nhập lý do khi tạm dừng: Hệ thống yêu cầu bắt buộc nhập biên bản lý do."
        },
        # UC23
        {
            "num": "23", "sec": "3.2.24", "code": "UC23",
            "name": "Quản trị tài khoản người dùng & Kỷ luật vi phạm (User Moderation: Active/Suspend/Ban - MỚI)",
            "img": "generated_diagrams/uc_23_user_moderation.png",
            "actor": "Quản trị viên (Admin), Người dùng bị xử lý (User)",
            "pre": "Admin đăng nhập vào hệ thống; danh sách người dùng được tải thành công.",
            "post": "Trường `accountStatus` của người dùng được cập nhật (`active`, `suspended`, `banned`); lưu `statusReason`; gửi email thông báo kỷ luật.",
            "main_flow": "1. Admin truy cập mục 'Quản lý Người dùng' trên Admin Dashboard.<br>2. Bảng quản trị tải danh sách hợp nhất tất cả Học viên và Giảng viên kèm trạng thái hiện tại.<br>3. Admin lọc theo vai trò, trạng thái hoặc tìm kiếm nhanh theo Tên, Email.<br>4. Chọn tài khoản vi phạm và nhấn 'Đổi trạng thái'.<br>5. Chọn trạng thái mới: Tạm khóa (`suspended`), Khóa vĩnh viễn (`banned`) hoặc Mở khóa lại (`active`).<br>6. Bắt buộc nhập lý do kỷ luật (`statusReason`) và nhấn 'Xác nhận'.<br>7. Hệ thống cập nhật CSDL và tự động gửi Email Thông báo Kỷ luật chính thức tới người dùng.<br>8. Khi tài khoản bị khóa/cấm, mọi nỗ lực đăng nhập sẽ bị hệ thống chặn kèm thông báo lý do chi tiết.",
            "alt_flow": "- Không nhập lý do kỷ luật: Hệ thống chặn thao tác và yêu cầu nhập lý do giải trình."
        },
        # UC24
        {
            "num": "24", "sec": "3.2.25", "code": "UC24",
            "name": "Tạo yêu cầu rút tiền thù lao giảng dạy (Teacher Submit Withdrawal - MỚI)",
            "img": "generated_diagrams/uc_24_withdrawal_request.png",
            "actor": "Giảng viên (Teacher)",
            "pre": "Khóa học đã được Admin duyệt hoàn thành (`adminApproved = true`); học viên đạt >= 80% xác nhận; ví có đủ số dư.",
            "post": "Bản ghi `WithdrawalRequest` được tạo ở trạng thái `pending`; chuyển sang Admin đối soát giải ngân.",
            "main_flow": "1. Giảng viên truy cập mục Remuneration (Thù lao / Rút tiền) trên Teacher Dashboard.<br>2. Xem tổng quan số dư khả dụng và tiền ký quỹ của từng khóa học.<br>3. Chọn khóa học đã nghiệm thu và nhập số tiền muốn rút.<br>4. Nhập thông tin tài khoản ngân hàng: Tên ngân hàng, Số tài khoản, Tên chủ tài khoản, Chi nhánh.<br>5. Nhấn 'Gửi yêu cầu rút tiền'.<br>6. Hệ thống kiểm tra đối chiếu ràng buộc nghiệm thu và số dư khả dụng.<br>7. Tạo bản ghi `WithdrawalRequest` với trạng thái `pending` và hiển thị trong danh sách chờ xử lý.",
            "alt_flow": "- Khóa học chưa được Admin duyệt nghiệm thu: Chặn rút tiền kèm thông báo chưa đủ điều kiện.<br>- Tỷ lệ xác nhận của học viên dưới 80%: Từ chối yêu cầu.<br>- Số tiền rút vượt quá số dư ví: Báo lỗi không đủ số dư."
        },
        # UC25
        {
            "num": "25", "sec": "3.2.26", "code": "UC25",
            "name": "Quản trị tài chính sàn GMV & Giải ngân chuyển khoản (Platform Revenue & Payout - MỚI)",
            "img": "generated_diagrams/uc_25_revenue_payout.png",
            "actor": "Quản trị viên (Admin), Giảng viên (Teacher)",
            "pre": "Admin đăng nhập quyền quản trị cao nhất; có yêu cầu rút tiền ở trạng thái `pending`.",
            "post": "Số dư ví GV bị trừ; lệnh rút tiền đổi sang `completed`; lưu `WithdrawalHistory`; gửi email giải ngân thành công.",
            "main_flow": "1. Admin vào tab 'Quản lý Doanh thu & Rút tiền' trên Admin Dashboard.<br>2. Xem tổng quan tài chính sàn: Tổng GMV, Hoa hồng sàn 15%, Tiền ký quỹ Escrow, Tiền đã giải ngân.<br>3. Xem danh sách các yêu cầu rút tiền đang chờ xử lý.<br>4. Mở xem chi tiết lệnh rút tiền: Số tiền, thông tin ngân hàng thụ hưởng, khóa học liên quan.<br>5. **Trường hợp Phê duyệt:** Admin thực hiện chuyển khoản ngân hàng ngoài đời thực, nhập mã giao dịch (`transactionCode`), nhận xét và nhấn 'Hoàn tất giải ngân'. Hệ thống trừ số dư ví của GV, lưu lịch sử `WithdrawalHistory`, đổi trạng thái lệnh sang `completed`, gửi thông báo in-app và gửi Email xác nhận giải ngân thành công tới Giảng viên.<br>6. **Trường hợp Từ chối:** Admin nhập lý do từ chối (`adminFeedback`) và nhấn 'Từ chối'. Lệnh chuyển sang `rejected` và gửi thông báo lý do tới Giảng viên.",
            "alt_flow": "- Số dư ví của GV không đủ tại thời điểm giải ngân: Báo lỗi 400 và hủy thao tác."
        }
    ]

    new_section_3_2 = """## **3.2 Use Cases** {#3.2-use-cases}

Hệ thống EduPulse bao gồm tổng cộng **25 Use Case chi tiết** (từ **UC01** đến **UC25**) bao quát toàn diện mọi hoạt động của 3 nhóm tác nhân chính: **Học viên (Student)**, **Giảng viên (Teacher)** và **Quản trị viên (Admin)**.

Phần dưới đây trình bày **Biểu đồ Use Case Tổng quan Toàn hệ thống**, tiếp theo là **đầy đủ 25 Use Case riêng biệt**, với thiết kế chuẩn hóa: **Ảnh biểu đồ Use Case riêng biệt đặt ở trên, Bảng đặc tả chi tiết đặt ngay ở phía dưới nó**.

---

### **3.2.1 Bảng Tổng quan 25 Use Cases & Biểu đồ Use Case Toàn hệ thống** {#3.2.1-bảng-tổng-quan-25-use-cases-&-biểu-đồ-use-case-toàn-hệ-thống}

![Biểu đồ Use Case Tổng quan Toàn hệ thống](generated_diagrams/uc_overview.png)
*Hình 3.2.1: Biểu đồ Use Case Tổng quan Toàn hệ thống EduPulse (Bao gồm đầy đủ 25 Use Case)*

**Bảng Ma trận Phân quyền & Tổng hợp 25 Use Case Toàn Hệ Thống:**

| STT | Mã UC | Tên Use Case | Phân hệ Chức năng | Student | Teacher | Admin | Ghi chú Trọng tâm |
| :---: | :---: | :--- | :--- | :---: | :---: | :---: | :--- |
| 1 | UC01 | Đăng ký tài khoản người dùng | Xác thực & Phân quyền | ✔ | ✔ | | Bcrypt Hash 10 rounds |
| 2 | UC02 | Xác thực email & Kích hoạt tài khoản | Xác thực & Phân quyền | ✔ | ✔ | | Nodemailer Token link |
| 3 | UC03 | Đăng nhập & Quản lý phiên JWT | Xác thực & Phân quyền | ✔ | ✔ | ✔ | JWT Cookie, Chặn vi phạm |
| 4 | UC04 | Quên & Đặt lại mật khẩu tài khoản | Xác thực & Phân quyền | ✔ | ✔ | | SHA-256 Token 15 phút |
| 5 | UC05 | Quản lý hồ sơ cá nhân công khai & Bio | Hồ sơ & Danh tính KYC | ✔ | ✔ | | Upload Avatar Cloudinary |
| 6 | UC06 | Nộp hồ sơ minh chứng danh tính KYC | Hồ sơ & Danh tính KYC | | ✔ | | CCCD, Bằng ĐH, Thạc sĩ |
| 7 | UC07 | Thẩm định & Phê duyệt hồ sơ KYC | Hồ sơ & Danh tính KYC | | | ✔ | Approved / Reupload / Rejected |
| 8 | UC08 | Tìm kiếm, lọc & Khám phá khóa học | Khóa học & Đề cương | ✔ | | | Bộ lọc 3 tầng chuẩn |
| 9 | UC09 | Đăng ký khóa học & Thanh toán học phí | Thanh toán & Ký quỹ | ✔ | | | Razorpay HMAC-SHA256, Escrow |
| 10 | UC10 | Khởi tạo đề cương giáo trình khóa học | Khóa học & Đề cương | | ✔ | | Syllabus, Phân cấp, Học phí |
| 11 | UC11 | Thẩm định & Phê duyệt xuất bản khóa học | Khóa học & Đề cương | | | ✔ | isapproved = true xuất bản |
| 12 | UC12 | Khởi tạo lớp học trực tuyến mới | Lớp học & Buổi học Live | | ✔ | | Nhóm (max 20) / 1-1, mã classCode |
| 13 | UC13 | Lập lịch buổi học & Tham gia học Live | Lớp học & Buổi học Live | ✔ | ✔ | | Google Meet / WebRTC Room |
| 14 | UC14 | Trao đổi tin nhắn & Chia sẻ tài liệu | Kênh trao đổi (Chat) | ✔ | ✔ | | Chat thời gian thực, Tệp đính kèm |
| 15 | UC15 | Nhận thông báo nhắc lịch học tự động | Thông báo & Lịch học | ✔ | ✔ | | Bộ quét tự động, Chuông in-app |
| 16 | UC16 | Gửi biểu mẫu yêu cầu hỗ trợ (Contact Us) | Hỗ trợ & Khách hàng | ✔ | ✔ | ✔ | Khách vãng lai & Người dùng |
| 17 | UC17 | Tiếp nhận & Xử lý khiếu nại hỗ trợ | Hỗ trợ & Khách hàng | | | ✔ | Phản hồi giải quyết khiếu nại |
| 18 | UC18 | Nộp form xác nhận kết thúc khóa học | Nghiệm thu & Hoàn thành | ✔ | | | **MỚI** (Đánh giá chuyên cần, GV) |
| 19 | UC19 | Theo dõi tiến độ & Gửi yêu cầu nghiệm thu | Nghiệm thu & Hoàn thành | | ✔ | | **MỚI** (Điều kiện đạt >= 80%) |
| 20 | UC20 | Thẩm định & Duyệt nghiệm thu khóa học | Nghiệm thu & Hoàn thành | | | ✔ | **MỚI** (Mở khóa 85% học phí ví GV) |
| 21 | UC21 | Gửi đánh giá sao & Nhận xét khóa học | Đánh giá & Giám sát | ✔ | | | **MỚI** (1-5 sao, tính điểm TB) |
| 22 | UC22 | Giám sát review xấu & Tạm dừng khóa học | Đánh giá & Giám sát | | ✔ | ✔ | **MỚI** (Cảnh báo <= 2 sao, Suspend) |
| 23 | UC23 | Quản trị tài khoản người dùng & Kỷ luật | Quản trị người dùng | | | ✔ | **MỚI** (Active / Suspend / Ban) |
| 24 | UC24 | Tạo yêu cầu rút tiền thù lao giảng dạy | Tài chính & Rút tiền | | ✔ | | **MỚI** (Ràng buộc nghiệm thu) |
| 25 | UC25 | Quản trị tài chính sàn & Giải ngân | Tài chính & Rút tiền | | | ✔ | **MỚI** (GMV, Phí 15%, Mã TXN) |

---
"""

    for uc in usecases_specs:
        uc_block = f"""
### **{uc['sec']} Đặc tả Use Case {uc['num']}: {uc['name']}** {{#{uc['sec'].replace('.', '-')}-đặc-tả-use-case-{uc['num']}:-{re.sub(r'[^a-zA-Z0-9_-]', '-', uc['name'].lower())}}}

![Biểu đồ Use Case {uc['num']}: {uc['name']}]({uc['img']})
*Hình {uc['sec']}: Biểu đồ Use Case {uc['num']} - {uc['name']}*

| Hạng mục | Nội dung chi tiết |
| :--- | :--- |
| **Mã & Tên Use Case** | **{uc['code']} – {uc['name']}** |
| **Tác nhân chính** | {uc['actor']} |
| **Tiền điều kiện** | {uc['pre']} |
| **Hậu điều kiện** | {uc['post']} |
| **Luồng sự kiện chính** | {uc['main_flow']} |
| **Luồng ngoại lệ** | {uc['alt_flow']} |

---
"""
        new_section_3_2 += uc_block

    old_section_3_2_pattern = r'## \*\*3\.2 Use Cases\*\* \{#3\.2-use-cases\}.*?(?=## \*\*3\.3 Entity Relationship Diagrams \(ERD\)\*\*)'
    content = re.sub(old_section_3_2_pattern, lambda m: new_section_3_2, content, flags=re.DOTALL)

    with open('EduPulse_SRS.docx.md', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Cập nhật EduPulse_SRS.docx.md thành công hoàn tất với đầy đủ 25 Use Cases!")

if __name__ == '__main__':
    main()
