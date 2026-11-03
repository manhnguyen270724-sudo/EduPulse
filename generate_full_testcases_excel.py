# -*- coding: utf-8 -*-
"""
Script to generate the complete Test Cases Excel file for 4 team members:
1. Nguyễn Mạnh (UI + điều phối): 25 Test Cases
2. ALăng Thị Thơm (API + Database): 30 Test Cases
3. Đinh Thị Mừng (Booking + Payment + Integration): 40 Test Cases
4. Nguyễn Tiến Nhựt (Security + Host/Admin): 25 Test Cases
Total: 120 Test Cases.
"""

import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

# Create workbook
wb = openpyxl.Workbook()
wb.remove(wb.active)  # Remove default sheet

# Color definitions
HEADER_FILL_OVERVIEW = PatternFill(start_color="1E3A8A", end_color="1E3A8A", fill_type="solid") # Dark Blue
HEADER_FILL_MANH = PatternFill(start_color="0F766E", end_color="0F766E", fill_type="solid") # Deep Teal
HEADER_FILL_THOM = PatternFill(start_color="1D4ED8", end_color="1D4ED8", fill_type="solid") # Royal Blue
HEADER_FILL_MUNG = PatternFill(start_color="15803D", end_color="15803D", fill_type="solid") # Emerald Green
HEADER_FILL_NHUT = PatternFill(start_color="9D174D", end_color="9D174D", fill_type="solid") # Deep Pink/Burgundy

HEADER_FONT = Font(name="Calibri", size=11, bold=True, color="FFFFFF")
TITLE_FONT = Font(name="Calibri", size=16, bold=True, color="1E3A8A")
SUBTITLE_FONT = Font(name="Calibri", size=11, italic=True, color="4B5563")
BOLD_FONT = Font(name="Calibri", size=11, bold=True, color="000000")
REGULAR_FONT = Font(name="Calibri", size=10, color="000000")

ZEBRA_FILL = PatternFill(start_color="F8FAFC", end_color="F8FAFC", fill_type="solid")
WHITE_FILL = PatternFill(start_color="FFFFFF", end_color="FFFFFF", fill_type="solid")

THIN_BORDER = Border(
    left=Side(style="thin", color="D1D5DB"),
    right=Side(style="thin", color="D1D5DB"),
    top=Side(style="thin", color="D1D5DB"),
    bottom=Side(style="thin", color="D1D5DB")
)

PRIORITY_HIGH_FILL = PatternFill(start_color="FEE2E2", end_color="FEE2E2", fill_type="solid") # Light red
PRIORITY_MED_FILL = PatternFill(start_color="FEF3C7", end_color="FEF3C7", fill_type="solid")  # Light yellow
PRIORITY_LOW_FILL = PatternFill(start_color="E0E7FF", end_color="E0E7FF", fill_type="solid")  # Light blue

STATUS_FILL = PatternFill(start_color="F3F4F6", end_color="F3F4F6", fill_type="solid")

COLUMNS = [
    ("Mã Test Case", 15),
    ("Phân hệ / Chức năng", 22),
    ("Tên / Mô tả Test Case", 34),
    ("Tiền điều kiện (Pre-conditions)", 28),
    ("Các bước thực hiện (Test Steps)", 42),
    ("Dữ liệu kiểm thử (Test Data)", 28),
    ("Kết quả mong đợi (Expected Results)", 42),
    ("Loại Test", 14),
    ("Độ ưu tiên", 14),
    ("Trạng thái", 14),
    ("Ghi chú", 22)
]

def format_sheet(ws, title, member_name, module_name, count_str, main_content, header_fill, data):
    ws.views.sheetView[0].showGridLines = True
    
    # Title Block
    ws.merge_cells("A1:K1")
    ws["A1"] = f"BẢNG ĐẶC TẢ KIỂM THỬ (TEST CASES) - {title.upper()}"
    ws["A1"].font = TITLE_FONT
    ws["A1"].alignment = Alignment(vertical="center")
    ws.row_dimensions[1].height = 32
    
    # Info Block
    ws.merge_cells("A2:K2")
    ws["A2"] = f"Thành viên phụ trách: {member_name}  |  Phân hệ: {module_name}  |  Số lượng: {count_str} test cases"
    ws["A2"].font = BOLD_FONT
    ws["A2"].alignment = Alignment(vertical="center")
    ws.row_dimensions[2].height = 22

    ws.merge_cells("A3:K3")
    ws["A3"] = f"Nội dung kiểm thử chính: {main_content}"
    ws["A3"].font = SUBTITLE_FONT
    ws["A3"].alignment = Alignment(vertical="center")
    ws.row_dimensions[3].height = 20

    ws.row_dimensions[4].height = 10 # Blank spacing row
    
    # Header Row (Row 5)
    header_row = 5
    ws.row_dimensions[header_row].height = 28
    for col_idx, (col_name, _) in enumerate(COLUMNS, 1):
        cell = ws.cell(row=header_row, column=col_idx, value=col_name)
        cell.fill = header_fill
        cell.font = HEADER_FONT
        cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
        cell.border = THIN_BORDER
        
    # Data Rows
    current_row = 6
    for idx, row_data in enumerate(data, 1):
        ws.row_dimensions[current_row].height = 54
        row_fill = ZEBRA_FILL if idx % 2 == 0 else WHITE_FILL
        
        for col_idx, val in enumerate(row_data, 1):
            cell = ws.cell(row=current_row, column=col_idx, value=val)
            cell.font = REGULAR_FONT
            cell.border = THIN_BORDER
            cell.fill = row_fill
            
            # Formatting alignments
            if col_idx in [1, 8, 9, 10]:
                cell.alignment = Alignment(horizontal="center", vertical="center")
            elif col_idx in [2]:
                cell.alignment = Alignment(horizontal="left", vertical="center")
            else:
                cell.alignment = Alignment(horizontal="left", vertical="top", wrap_text=True)
                
            # Priority color highlight
            if col_idx == 9:
                if val == "High":
                    cell.fill = PRIORITY_HIGH_FILL
                elif val == "Medium":
                    cell.fill = PRIORITY_MED_FILL
                elif val == "Low":
                    cell.fill = PRIORITY_LOW_FILL
            elif col_idx == 10:
                cell.fill = STATUS_FILL
                
        current_row += 1
        
    # Set column widths
    for col_idx, (_, width) in enumerate(COLUMNS, 1):
        col_letter = get_column_letter(col_idx)
        ws.column_dimensions[col_letter].width = width

# ----------------- DATA FOR 4 SHEETS -----------------

# 1. NGUYỄN MẠNH (25 Test Cases: UI + điều phối)
manh_testcases = [
    [
        "TC_UI_01", "Đăng ký", "Đăng ký tài khoản thành công với thông tin hợp lệ",
        "Người dùng chưa có tài khoản, đang ở trang Đăng ký (/register)",
        "1. Nhập Họ và tên hợp lệ\n2. Nhập Email chưa từng đăng ký\n3. Nhập Mật khẩu hợp lệ và Xác nhận mật khẩu\n4. Nhấn nút 'Đăng ký'",
        "Họ tên: 'Nguyễn Văn A'\nEmail: 'nguyenvana_test@gmail.com'\nPassword: 'Password@123'",
        "1. Hệ thống hiển thị Toast thông báo 'Đăng ký tài khoản thành công!' màu xanh\n2. Tự động chuyển hướng sang trang Đăng nhập hoặc Trang chủ\n3. Header hiển thị avatar người dùng",
        "Functional / UI", "High", "Chưa test", "Kiểm tra form chuẩn"
    ],
    [
        "TC_UI_02", "Đăng ký", "Kiểm tra validation khi để trống tất cả các trường trên form đăng ký",
        "Đang ở trang Đăng ký",
        "1. Không điền bất kỳ thông tin nào\n2. Nhấn nút 'Đăng ký'",
        "Tất cả các trường = Rỗng",
        "1. Form không được gửi đi\n2. Xuất hiện dòng chữ báo lỗi màu đỏ dưới từng ô nhập liệu: 'Vui lòng nhập họ tên', 'Vui lòng nhập email', 'Vui lòng nhập mật khẩu'\n3. Con trỏ chuột tự focus vào ô đầu tiên",
        "UI Validation", "High", "Chưa test", "Client-side validation"
    ],
    [
        "TC_UI_03", "Đăng ký", "Đăng ký thất bại với email sai định dạng cú pháp",
        "Đang ở trang Đăng ký",
        "1. Nhập Họ tên hợp lệ\n2. Nhập Email sai format\n3. Nhập Mật khẩu hợp lệ\n4. Nhấn 'Đăng ký'",
        "Email: 'user_gmail.com' (thiếu @) hoặc 'user@.com'",
        "Hiển thị thông báo lỗi màu đỏ tại ô email: 'Định dạng email không hợp lệ'. Nút Đăng ký không kích hoạt gửi request",
        "UI Validation", "Medium", "Chưa test", "Kiểm tra regex email client"
    ],
    [
        "TC_UI_04", "Đăng ký", "Đăng ký thất bại khi mật khẩu quá ngắn hoặc yếu",
        "Đang ở trang Đăng ký",
        "1. Nhập Họ tên và Email hợp lệ\n2. Nhập Mật khẩu chỉ có 5 ký tự\n3. Nhấn 'Đăng ký'",
        "Password: '12345'",
        "Hiển thị thông báo lỗi: 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và chữ số'. Thanh đo độ mạnh mật khẩu hiển thị màu đỏ (Yếu)",
        "UI Validation", "High", "Chưa test", "Password strength meter"
    ],
    [
        "TC_UI_05", "Đăng ký", "Đăng ký thất bại khi Nhập lại mật khẩu không khớp",
        "Đang ở trang Đăng ký",
        "1. Nhập các trường hợp lệ\n2. Nhập Mật khẩu khác với ô Xác nhận mật khẩu\n3. Nhấn 'Đăng ký'",
        "Password: 'Password@123'\nConfirm: 'Password@999'",
        "Hiển thị thông báo lỗi ngay dưới ô Xác nhận: 'Mật khẩu xác nhận không khớp'. Nút Đăng ký không thể thực hiện gửi",
        "UI Validation", "High", "Chưa test", "Confirm password match"
    ],
    [
        "TC_UI_06", "Đăng ký", "Đăng ký thất bại khi email đã tồn tại trên hệ thống",
        "Đã có tài khoản tồn tại trong hệ thống với email 'test_exist@gmail.com'",
        "1. Nhập thông tin đăng ký với email đã tồn tại\n2. Nhấn nút 'Đăng ký'",
        "Email: 'test_exist@gmail.com'",
        "Hệ thống hiển thị Toast thông báo lỗi màu đỏ: 'Email này đã được sử dụng. Vui lòng chọn email khác hoặc Đăng nhập'. Giữ nguyên dữ liệu trên form trừ ô password",
        "UI / Server", "High", "Chưa test", "Check duplicate email message"
    ],
    [
        "TC_UI_07", "Đăng nhập", "Đăng nhập thành công với thông tin tài khoản hợp lệ",
        "Tài khoản đã được tạo và kích hoạt sẵn trong DB",
        "1. Truy cập trang Đăng nhập (/login)\n2. Nhập đúng Email và Mật khẩu\n3. Nhấn 'Đăng nhập'",
        "Email: 'user_active@gmail.com'\nPassword: 'Password@123'",
        "1. Toast thông báo 'Đăng nhập thành công!' xuất hiện\n2. Điều hướng về Trang chủ hoặc trang trước đó\n3. Header hiển thị tên và avatar người dùng",
        "Functional / UI", "High", "Chưa test", "Happy path login"
    ],
    [
        "TC_UI_08", "Đăng nhập", "Đăng nhập thất bại khi nhập sai mật khẩu",
        "Tài khoản tồn tại trên hệ thống",
        "1. Nhập đúng email đã đăng ký\n2. Nhập mật khẩu không chính xác\n3. Nhấn nút 'Đăng nhập'",
        "Email: 'user_active@gmail.com'\nPassword: 'WrongPassword999'",
        "1. Hiển thị thông báo lỗi màu đỏ: 'Email hoặc mật khẩu không chính xác'\n2. Không chuyển trang\n3. Ô mật khẩu được làm trống và focus lại",
        "UI Validation", "High", "Chưa test", "Tránh tiết lộ user có tồn tại hay không"
    ],
    [
        "TC_UI_09", "Đăng nhập", "Đăng nhập thất bại khi tài khoản chưa từng tồn tại",
        "Email chưa từng được tạo tài khoản",
        "1. Nhập email chưa đăng ký\n2. Nhập mật khẩu bất kỳ\n3. Nhấn 'Đăng nhập'",
        "Email: 'not_exist_email_123456@gmail.com'",
        "Hiển thị thông báo lỗi: 'Email hoặc mật khẩu không chính xác'. Không hiển thị thông báo riêng biệt về việc email không tồn tại (để bảo mật)",
        "UI / Security", "Medium", "Chưa test", "Generic auth error message"
    ],
    [
        "TC_UI_10", "Đăng nhập", "Kiểm tra nút bật/tắt hiển thị mật khẩu (Show/Hide Password)",
        "Đang ở trang Đăng nhập, ô mật khẩu đã có ký tự",
        "1. Nhập mật khẩu vào ô\n2. Nhấp vào biểu tượng con mắt (Eye icon)\n3. Nhấp lại lần nữa",
        "Password: 'SecretPassword@123'",
        "1. Ban đầu mật khẩu ẩn dưới dạng các dấu chấm tròn (type='password')\n2. Nhấp lần 1: Ký tự hiển thị rõ ràng (type='text'), icon đổi sang gạch chéo\n3. Nhấp lần 2: Trở về dạng ẩn chấm tròn",
        "UI Interaction", "Low", "Chưa test", "Toggle password visibility"
    ],
    [
        "TC_UI_11", "Đăng nhập", "Kiểm tra liên kết và điều hướng đến trang Quên mật khẩu",
        "Đang ở form Đăng nhập",
        "1. Nhấp vào liên kết 'Quên mật khẩu?' dưới ô mật khẩu",
        "Click action",
        "Hệ thống điều hướng mượt mà sang trang /forgot-password với giao diện nhập email khôi phục mật khẩu rõ ràng",
        "UI Navigation", "Medium", "Chưa test", "Forgot password link"
    ],
    [
        "TC_UI_12", "Thông báo lỗi", "Hiển thị thông báo Toast cảnh báo khi hệ thống mất kết nối mạng",
        "Người dùng đang thao tác trên giao diện",
        "1. Ngắt kết nối mạng Internet (Offline)\n2. Thực hiện hành động click hoặc gửi form",
        "Mạng: Offline",
        "Xuất hiện thông báo dạng Banner / Toast cảnh báo màu vàng/đỏ: 'Mất kết nối Internet. Vui lòng kiểm tra lại đường truyền mạng của bạn!'",
        "UI Network UX", "Medium", "Chưa test", "Offline detector"
    ],
    [
        "TC_UI_13", "Điều hướng", "Kiểm tra thanh điều hướng Header (Navigation Bar) trên các trang",
        "Người dùng đã đăng nhập hoặc là khách",
        "1. Nhấp lần lượt vào: Logo -> 'Khám phá nơi lưu trú' -> 'Trở thành Host' -> 'Chuyến đi của tôi'",
        "Click action",
        "1. Các liên kết chuyển hướng đúng URL tương ứng\n2. Mục menu hiện tại được highlight trạng thái active\n3. Thời gian phản hồi trang nhanh, không lỗi layout",
        "UI Navigation", "High", "Chưa test", "Header navbar test"
    ],
    [
        "TC_UI_14", "Điều hướng", "Kiểm tra thanh Breadcrumb trên trang Chi tiết nơi lưu trú",
        "Đang ở trang chi tiết của một homestay tại Đà Lạt",
        "1. Quan sát dải Breadcrumb (Trang chủ > Lâm Đồng > Đà Lạt > Tên Homestay)\n2. Nhấp vào mục 'Đà Lạt'",
        "Click vào link 'Đà Lạt' trên breadcrumb",
        "Hệ thống điều hướng về trang danh sách tìm kiếm các nơi lưu trú thuộc khu vực Đà Lạt. Bộ lọc địa điểm tự động chọn Đà Lạt",
        "UI Navigation", "Low", "Chưa test", "Breadcrumbs trail"
    ],
    [
        "TC_UI_15", "Điều hướng", "Kiểm tra nút Quay lại (Browser Back button) không làm mất trạng thái bộ lọc",
        "Người dùng vừa thực hiện tìm kiếm phòng tại Đà Nẵng với khoảng giá 500k - 1tr, sau đó click vào 1 phòng xem chi tiết",
        "1. Đang ở trang Chi tiết phòng\n2. Nhấn nút Back trên trình duyệt để quay lại trang kết quả",
        "Browser Back action",
        "Quay lại trang danh sách tìm kiếm, các tiêu chí đã chọn (Đà Nẵng, giá 500k-1tr) vẫn được giữ nguyên vẹn trên URL và bộ lọc",
        "UI UX State", "Medium", "Chưa test", "Browser history state"
    ],
    [
        "TC_UI_16", "Điều hướng", "Kiểm tra hiển thị trang lỗi 404 Not Found thân thiện",
        "Người dùng truy cập vào một đường dẫn URL không tồn tại",
        "1. Gõ trên thanh địa chỉ URL: '/noi-luu-tru/khong-ton-tai-99999'\n2. Nhấn Enter",
        "URL không hợp lệ",
        "Hiển thị giao diện 404 thiết kế đẹp mắt: 'Rất tiếc! Trang bạn tìm kiếm không tồn tại', kèm theo nút 'Quay về trang chủ'",
        "UI Error Page", "Medium", "Chưa test", "Custom 404 page"
    ],
    [
        "TC_UI_17", "Giao diện", "Kiểm tra độ tương thích Responsive trên thiết bị di động (Mobile View)",
        "Truy cập website trên trình duyệt với kích thước màn hình điện thoại (375px x 667px)",
        "1. Mở DevTools chuyển sang chế độ Mobile (iPhone SE/12)\n2. Kiểm tra menu thu gọn vào Hamburger button\n3. Kiểm tra các thẻ phòng hiển thị dạng danh sách trượt mượt mà",
        "Viewport width: 375px",
        "1. Menu chuyển thành icon 3 gạch (hamburger) mở ra drawer mượt mà\n2. Không có hiện tượng vỡ layout, tràn chữ hay scroll ngang thanh cuộn",
        "Responsive UI", "High", "Chưa test", "Mobile viewport layout"
    ],
    [
        "TC_UI_18", "Tìm kiếm nơi lưu trú", "Tìm kiếm nơi lưu trú theo Từ khóa Tên thành phố / Địa điểm",
        "Đang ở Trang chủ, thanh tìm kiếm hiển thị đầy đủ",
        "1. Nhập từ khóa 'Vũng Tàu' vào ô 'Bạn muốn đến đâu?'\n2. Nhấn nút Tìm kiếm (kính lúp)",
        "Keyword: 'Vũng Tàu'",
        "Chuyển sang trang kết quả hiển thị danh sách các homestay/khách sạn tại khu vực Vũng Tàu. Tiêu đề hiển thị 'Kết quả tìm kiếm tại Vũng Tàu (X nơi lưu trú)'",
        "Functional / UI", "High", "Chưa test", "Search by location"
    ],
    [
        "TC_UI_19", "Tìm kiếm nơi lưu trú", "Tìm kiếm nơi lưu trú theo Bộ chọn khoảng ngày (Date Range Picker)",
        "Đang ở thanh tìm kiếm",
        "1. Mở lịch chọn ngày nhận phòng (Check-in)\n2. Chọn ngày trả phòng (Check-out) hợp lệ\n3. Bấm 'Tìm kiếm'",
        "Check-in: 25/11/2026\nCheck-out: 28/11/2026",
        "1. Lịch highlight khoảng ngày đã chọn trực quan\n2. Các ngày trong quá khứ bị làm mờ (disabled)\n3. Danh sách trả về chỉ bao gồm các phòng còn trống trong khoảng ngày này",
        "UI Date Picker", "High", "Chưa test", "Date picker validation"
    ],
    [
        "TC_UI_20", "Tìm kiếm nơi lưu trú", "Tìm kiếm nơi lưu trú theo Số lượng khách (Người lớn, Trẻ em)",
        "Đang ở thanh tìm kiếm",
        "1. Nhấp vào ô 'Khách'\n2. Bấm dấu '+' để tăng số người lớn lên 3, trẻ em lên 1\n3. Bấm 'Tìm kiếm'",
        "Số khách: 3 người lớn, 1 trẻ em (Tổng 4 khách)",
        "1. Dropdown hiển thị số lượng cập nhật ngay lập tức\n2. Danh sách kết quả chỉ trả về các căn hộ/homestay có sức chứa tối đa >= 4 người",
        "UI Counter", "Medium", "Chưa test", "Guest counter dropdown"
    ],
    [
        "TC_UI_21", "Bộ lọc tìm kiếm", "Lọc danh sách nơi lưu trú theo Thanh trượt khoảng giá (Price Slider)",
        "Đang ở trang kết quả tìm kiếm với nhiều phòng",
        "1. Mở modal 'Bộ lọc'\n2. Kéo thanh trượt khoảng giá từ 300.000 VNĐ đến 1.500.000 VNĐ\n3. Bấm 'Áp dụng'",
        "Giá min: 300,000 VNĐ\nGiá max: 1,500,000 VNĐ",
        "Danh sách phòng được cập nhật tự động. Tất cả các phòng hiển thị đều có giá mỗi đêm nằm trong khoảng từ 300.000 đến 1.500.000 VNĐ",
        "UI Filter", "Medium", "Chưa test", "Price range filter"
    ],
    [
        "TC_UI_22", "Bộ lọc tìm kiếm", "Lọc nơi lưu trú theo danh sách Tiện ích (Checkbox Amenities)",
        "Đang ở trang kết quả tìm kiếm",
        "1. Chọn các checkbox: 'Wifi miễn phí', 'Hồ bơi', 'Bếp nấu ăn'\n2. Bấm 'Áp dụng bộ lọc'",
        "Tiện ích chọn: Wifi, Pool, Kitchen",
        "Danh sách chỉ hiển thị các nơi lưu trú đáp ứng đồng thời cả 3 tiện ích đã chọn. Badge đếm số bộ lọc đang chọn hiển thị số 3",
        "UI Filter", "Medium", "Chưa test", "Amenities checkboxes"
    ],
    [
        "TC_UI_23", "Tìm kiếm nơi lưu trú", "Hiển thị giao diện thân thiện khi Không tìm thấy kết quả phù hợp",
        "Nhập điều kiện tìm kiếm cực đoan không có dữ liệu",
        "1. Chọn địa điểm 'Hà Giang'\n2. Lọc giá từ 10.000 đến 20.000 VNĐ\n3. Bấm Tìm kiếm",
        "Bộ lọc không có phòng nào thỏa mãn",
        "Hiển thị minh họa (Illustration) trống kèm thông báo: 'Không tìm thấy nơi lưu trú nào phù hợp với bộ lọc của bạn'. Kèm nút 'Đặt lại bộ lọc'",
        "UI Empty State", "Medium", "Chưa test", "Empty search state"
    ],
    [
        "TC_UI_24", "Chi tiết nơi lưu trú", "Xem thông tin chi tiết nơi lưu trú (Gallery ảnh, Host, Bản đồ, Đánh giá)",
        "Người dùng click vào 1 thẻ nơi lưu trú từ danh sách",
        "1. Kiểm tra bộ sưu tập ảnh (Grid / Carousel hình ảnh)\n2. Kiểm tra thông tin Host (Avatar, tên, huy hiệu Superhost)\n3. Xem bản đồ vị trí Google Maps tích hợp\n4. Xem danh sách đánh giá sao của khách trước",
        "Click vào phòng ID #101",
        "1. Slide ảnh xem mượt mà, phóng to ảnh khi click\n2. Thông tin đầy đủ, rõ ràng, layout thoáng đẹp\n3. Khối đặt phòng (Booking Widget) cố định (sticky) bên phải khi cuộn trang",
        "UI Component", "High", "Chưa test", "Listing detail page UI"
    ],
    [
        "TC_UI_25", "Điều phối luồng UI", "Kiểm tra luồng liên hoàn từ Tìm kiếm -> Xem chi tiết -> Bấm Đặt phòng chuyển sang trang Thanh toán",
        "Người dùng đã đăng nhập, tìm kiếm phòng có sẵn",
        "1. Tìm kiếm 'Nha Trang' chọn ngày 10/12 - 12/12\n2. Bấm vào căn hộ yêu thích\n3. Trên widget đặt phòng, bấm nút 'Đặt phòng ngay'",
        "Phòng trống hợp lệ",
        "1. Nút hiển thị loading spinner trong 0.5s\n2. Chuyển mượt mà sang trang Thanh toán (/checkout)\n3. Tóm tắt thông tin phòng, ngày nhận/trả và giá tiền chính xác 100% như đã chọn",
        "End-to-End UI", "High", "Chưa test", "Cross-module UI orchestration flow"
    ]
]

# 2. ALĂNG THỊ THƠM (30 Test Cases: API + Database)
thom_testcases = [
    [
        "TC_API_01", "API Validation", "API POST /api/v1/auth/register - Kiểm tra thiếu các trường bắt buộc",
        "Endpoint POST /api/v1/auth/register hoạt động",
        "1. Gửi request POST không có trường 'email' và 'password'\n2. Kiểm tra mã phản hồi và response body",
        "Body: { 'fullName': 'Nguyen Van A' }",
        "1. HTTP Status Code: 400 Bad Request\n2. Response JSON chuẩn: { 'success': false, 'message': 'Validation error', 'errors': ['email is required', 'password is required'] }",
        "API Validation", "High", "Chưa test", "Joi / Express-validator"
    ],
    [
        "TC_API_02", "API Validation", "API POST /api/v1/auth/register - Kiểm tra validation format email không hợp lệ",
        "Endpoint POST /api/v1/auth/register",
        "1. Gửi request POST với email sai cấu trúc RFC\n2. Kiểm tra mã lỗi trả về",
        "Body: { 'fullName': 'Van A', 'email': 'not-an-email', 'password': 'Password123@' }",
        "1. HTTP Status Code: 422 Unprocessable Entity (hoặc 400)\n2. Message: 'Email không đúng định dạng'",
        "API Validation", "High", "Chưa test", "Email format validation"
    ],
    [
        "TC_API_03", "API Validation", "API POST /api/v1/auth/register - Kiểm tra độ phức tạp của mật khẩu",
        "Endpoint POST /api/v1/auth/register",
        "1. Gửi request với password ít hơn 8 ký tự hoặc chỉ toàn chữ thường\n2. Kiểm tra response",
        "Body: { 'fullName': 'Van A', 'email': 'valid@gmail.com', 'password': 'abc' }",
        "1. HTTP Status: 400 Bad Request\n2. Message: 'Mật khẩu phải có tối thiểu 8 ký tự, bao gồm ít nhất 1 chữ hoa, 1 chữ thường và 1 số'",
        "API Validation", "High", "Chưa test", "Password schema regex"
    ],
    [
        "TC_API_04", "API Authentication", "API POST /api/v1/auth/login - Đăng nhập thành công trả về JWT Token",
        "User đã tồn tại trong DB với mật khẩu mã hóa bcrypt",
        "1. Gửi request POST kèm email và password hợp lệ\n2. Kiểm tra response body và headers",
        "Body: { 'email': 'user@example.com', 'password': 'CorrectPassword123!' }",
        "1. HTTP Status: 200 OK\n2. Body trả về { 'success': true, 'data': { 'accessToken': 'ey...', 'user': {...} } }\n3. Set-Cookie chứa refreshToken với cờ HttpOnly",
        "API Auth", "High", "Chưa test", "JWT access & refresh token"
    ],
    [
        "TC_API_05", "API Authentication", "API POST /api/v1/auth/login - Đăng nhập thất bại khi sai mật khẩu",
        "User đã tồn tại trong DB",
        "1. Gửi request POST với mật khẩu sai\n2. Kiểm tra response",
        "Body: { 'email': 'user@example.com', 'password': 'WrongPassword' }",
        "1. HTTP Status: 401 Unauthorized\n2. Body: { 'success': false, 'message': 'Tài khoản hoặc mật khẩu không chính xác' }",
        "API Auth", "High", "Chưa test", "Auth failure response"
    ],
    [
        "TC_API_06", "API Authentication", "API GET /api/v1/users/profile - Kiểm tra Header thiếu Bearer Authorization Token",
        "Endpoint yêu cầu xác thực JWT",
        "1. Gửi request GET không truyền Header 'Authorization'\n2. Kiểm tra mã lỗi trả về",
        "Headers: {}",
        "1. HTTP Status: 401 Unauthorized\n2. Body: { 'success': false, 'message': 'Vui lòng đăng nhập để truy cập tài nguyên này (Missing Token)' }",
        "API Security", "High", "Chưa test", "Require Auth middleware"
    ],
    [
        "TC_API_07", "API Authentication", "API GET /api/v1/users/profile - Kiểm tra Bearer Token đã hết hạn (Expired JWT)",
        "Endpoint yêu cầu xác thực JWT",
        "1. Sử dụng một Token đã hết hạn exp time\n2. Gửi request GET kèm token này",
        "Header: Authorization: Bearer <expired_token>",
        "1. HTTP Status: 401 Unauthorized\n2. Body: { 'success': false, 'code': 'TOKEN_EXPIRED', 'message': 'Phiên đăng nhập đã hết hạn' }",
        "API Security", "High", "Chưa test", "JWT expiration handling"
    ],
    [
        "TC_API_08", "API Authentication", "API GET /api/v1/users/profile - Kiểm tra Bearer Token bị giả mạo chữ ký (Tampered Signature)",
        "Endpoint yêu cầu xác thực JWT",
        "1. Thay đổi payload của token hợp lệ mà không ký lại bằng secret key\n2. Gửi request GET",
        "Header: Authorization: Bearer <tampered_token>",
        "1. HTTP Status: 401 Unauthorized\n2. Body: { 'success': false, 'code': 'INVALID_TOKEN', 'message': 'Chữ ký Token không hợp lệ' }",
        "API Security", "High", "Chưa test", "Signature verification"
    ],
    [
        "TC_API_09", "API Authentication", "API POST /api/v1/auth/refresh-token - Cấp mới Access Token khi gửi Refresh Token hợp lệ",
        "Refresh Token hợp lệ còn hạn trong Cookie hoặc Body",
        "1. Gửi request POST tới /auth/refresh-token\n2. Kiểm tra token mới nhận được",
        "Cookie: refreshToken=<valid_refresh_token>",
        "1. HTTP Status: 200 OK\n2. Body trả về accessToken mới\n3. AccessToken mới giải mã ra đúng userId",
        "API Auth", "High", "Chưa test", "Token rotation"
    ],
    [
        "TC_API_10", "API Query", "API GET /api/v1/listings - Kiểm tra phân trang (Pagination) chuẩn",
        "DB có sẵn 50 listings đang active",
        "1. Gửi request GET /listings?page=2&limit=10\n2. Kiểm tra số lượng item và metadata",
        "Query: page=2, limit=10",
        "1. HTTP Status: 200 OK\n2. data.listings có đúng 10 phần tử\n3. data.pagination = { 'currentPage': 2, 'totalPages': 5, 'totalItems': 50, 'hasNext': true }",
        "API Pagination", "Medium", "Chưa test", "Pagination standard"
    ],
    [
        "TC_API_11", "API Validation", "API GET /api/v1/listings - Xử lý tham số phân trang âm hoặc không hợp lệ",
        "Endpoint listings",
        "1. Gửi request GET với page=-1 hoặc limit=abc\n2. Kiểm tra phản hồi",
        "Query: page=-1&limit=abc",
        "1. HTTP Status: 400 Bad Request\n2. Body thông báo: 'page và limit phải là số nguyên dương hợp lệ'",
        "API Validation", "Medium", "Chưa test", "Negative/invalid query params"
    ],
    [
        "TC_API_12", "API Status Code", "API GET /api/v1/listings/:id - Truy vấn nơi lưu trú với ID không tồn tại",
        "ID 9999999 không có trong database",
        "1. Gửi request GET /api/v1/listings/9999999\n2. Kiểm tra mã trạng thái",
        "Param: id = 9999999",
        "1. HTTP Status: 404 Not Found\n2. Body: { 'success': false, 'message': 'Không tìm thấy nơi lưu trú với mã đã cung cấp' }",
        "API Status", "High", "Chưa test", "404 Resource Not Found"
    ],
    [
        "TC_API_13", "API Validation", "API POST /api/v1/listings - Validate payload tạo listing với kiểu dữ liệu không hợp lệ",
        "User có role Host đã đăng nhập",
        "1. Gửi request POST tạo listing với giá là chuỗi chữ, số khách là số âm\n2. Kiểm tra response",
        "Body: { 'title': 'Villa', 'pricePerNight': 'hai_trieu', 'maxGuests': -2 }",
        "1. HTTP Status: 422 Unprocessable Entity\n2. Body chứa danh sách lỗi chi tiết từng field",
        "API Validation", "High", "Chưa test", "Payload type safety"
    ],
    [
        "TC_API_14", "API Authorization", "API PUT /api/v1/listings/:id - Host cố gắng sửa listing của Host khác",
        "Listing #10 thuộc quyền sở hữu của Host A. Người gửi request là Host B",
        "1. Đăng nhập bằng tài khoản Host B\n2. Gửi request PUT /api/v1/listings/10 để sửa giá",
        "User: Host B, Target Listing: #10 (của Host A)",
        "1. HTTP Status: 403 Forbidden\n2. Body: { 'success': false, 'message': 'Bạn không có quyền chỉnh sửa tài nguyên này' }",
        "API Security", "High", "Chưa test", "Ownership authorization"
    ],
    [
        "TC_API_15", "API Standard", "Chuẩn hóa định dạng phản hồi (Consistent Response Envelope)",
        "Kiểm tra tất cả các API trả về trong hệ thống",
        "1. Gọi cả API thành công và API thất bại\n2. So sánh cấu trúc JSON trả về",
        "Multiple API endpoints",
        "Tất cả đều tuân thủ cấu trúc envelope: { 'success': boolean, 'statusCode': number, 'message': string, 'data': object|null, 'timestamp': ISO8601 }",
        "API Design", "Medium", "Chưa test", "Standard API response wrapper"
    ],
    [
        "TC_API_16", "Database Integrity", "Kiểm tra ràng buộc khóa ngoại (Foreign Key Constraint) giữa bookings và listings",
        "Database MySQL đã setup schema với Foreign Key",
        "1. Thực thi câu lệnh SQL INSERT trực tiếp vào bảng `bookings` với `listing_id` không tồn tại\n2. Quan sát kết quả MySQL",
        "SQL: INSERT INTO bookings (id, listing_id, user_id) VALUES (1, 999999, 1)",
        "MySQL chặn lại và ném lỗi: ER_NO_REFERENCED_ROW_2: Cannot add or update a child row: a foreign key constraint fails",
        "DB Integrity", "High", "Chưa test", "Foreign Key check"
    ],
    [
        "TC_API_17", "Database Integrity", "Kiểm tra ràng buộc khóa ngoại giữa bookings và users (ON DELETE RESTRICT)",
        "User ID #5 đã có 2 đơn đặt phòng trong bảng `bookings`",
        "1. Thực thi câu lệnh DELETE FROM users WHERE id = 5",
        "SQL DELETE User có ràng buộc booking",
        "Hệ thống không cho phép xóa user để đảm bảo lịch sử đơn hàng, ném lỗi Foreign Key constraint violation",
        "DB Integrity", "High", "Chưa test", "Restrict cascading delete on vital data"
    ],
    [
        "TC_API_18", "Database Integrity", "Kiểm tra ràng buộc Unique Index trên cột `email` của bảng `users`",
        "Bảng users đã có 1 bản ghi với email 'test@gmail.com'",
        "1. Chèn thêm 1 bản ghi mới có email trùng lặp: 'test@gmail.com'",
        "SQL: INSERT INTO users (email, ...) VALUES ('test@gmail.com', ...)",
        "MySQL ném lỗi: ER_DUP_ENTRY: Duplicate entry 'test@gmail.com' for key 'users.email_unique'",
        "DB Integrity", "High", "Chưa test", "Unique email constraint"
    ],
    [
        "TC_API_19", "Database Integrity", "Kiểm tra ràng buộc Unique Index trên cột `booking_code` của bảng `bookings`",
        "Bảng bookings đã có mã đơn 'BK-20261020-001'",
        "1. Thử tạo đơn mới cố tình gán mã trùng lặp 'BK-20261020-001'",
        "Duplicate booking_code",
        "MySQL chặn và báo lỗi trùng khóa chính / unique constraint. Backend bắt được lỗi và tự sinh mã mới",
        "DB Integrity", "High", "Chưa test", "Unique booking code"
    ],
    [
        "TC_API_20", "Database Integrity", "Kiểm tra ràng buộc NOT NULL trên các trường bắt buộc của bảng `listings`",
        "Bảng listings",
        "1. Thử INSERT một dòng vào `listings` bỏ qua các cột NOT NULL như `title`, `price_per_night`, `host_id`",
        "SQL: INSERT INTO listings (description) VALUES ('Thiếu trường')",
        "MySQL ném lỗi: Field 'title' doesn't have a default value (hoặc Column cannot be null)",
        "DB Integrity", "Medium", "Chưa test", "NOT NULL constraints"
    ],
    [
        "TC_API_21", "Database Data Type", "Kiểm tra độ chính xác kiểu dữ liệu tiền tệ `DECIMAL(12, 2)` trên cột `total_amount`",
        "Bảng bookings lưu trữ số tiền thanh toán",
        "1. Chèn số tiền có số thập phân và giá trị lớn (ví dụ: 15500000.50 VNĐ)\n2. Thực hiện tính tổng SUM()",
        "Value: 15500000.50",
        "Dữ liệu được lưu trữ chính xác tuyệt đối, không xảy ra sai số làm tròn floating-point như khi dùng kiểu FLOAT/DOUBLE",
        "DB Data Type", "High", "Chưa test", "Financial accuracy"
    ],
    [
        "TC_API_22", "Database Data Type", "Kiểm soát múi giờ UTC đồng nhất trên các cột timestamp (created_at, updated_at)",
        "Server và MySQL Database",
        "1. Chèn bản ghi mới qua API\n2. Xem giá trị lưu trong cột `created_at` trực tiếp trên DB",
        "Current Time",
        "Thời gian lưu trữ chuẩn UTC (ISO 8601), khi trả về qua API được serialize đúng định dạng có time-zone offset",
        "DB Timestamp", "Medium", "Chưa test", "UTC timezone consistency"
    ],
    [
        "TC_API_23", "Transaction & Rollback", "Kiểm tra Rollback Transaction khi tạo Booking thất bại ở bước tạo Payment Record",
        "Quy trình tạo đơn đặt phòng gồm 2 bước: Insert Booking -> Insert Payment details",
        "1. Thực hiện API Đặt phòng\n2. Cố tình gây lỗi ném Exception ở bước Insert vào bảng `payments`",
        "Mock DB error at step 2",
        "1. Transaction thực thi ROLLBACK\n2. Không có bản ghi 'rác' nào được lưu lại trong bảng `bookings`\n3. Trả về mã lỗi 500 kèm thông báo an toàn",
        "DB Transaction", "High", "Chưa test", "ACID rollback on failure"
    ],
    [
        "TC_API_24", "Transaction & Rollback", "Kiểm tra Rollback khi API thanh toán cổng thứ ba gặp Timeout",
        "Khách gọi API Checkout",
        "1. Bắt đầu DB Transaction cập nhật đơn hàng thành PENDING\n2. Gọi cổng thanh toán gặp Gateway Timeout (504)",
        "Third-party Gateway Timeout",
        "Transaction rollback an toàn, trạng thái booking không bị treo ở trạng thái không xác định, hoàn trả tài nguyên",
        "DB Transaction", "High", "Chưa test", "Timeout rollback"
    ],
    [
        "TC_API_25", "Tính toàn vẹn dữ liệu", "Đảm bảo tính Atomic khi cập nhật trạng thái phòng và lịch trống",
        "Booking được tạo thành công",
        "1. Thực hiện đơn đặt phòng hợp lệ\n2. Kiểm tra dữ liệu được ghi đồng thời ở bảng `bookings` và bảng `listing_unavailabilities`",
        "Valid booking payload",
        "Cả 2 bảng đều cập nhật dữ liệu thành công trong cùng 1 transaction duy nhất. Đảm bảo tính toàn vẹn 100%",
        "DB Integrity", "High", "Chưa test", "Multi-table atomic commit"
    ],
    [
        "TC_API_26", "Concurrency / Race Condition", "Kiểm tra Race Condition khi 2 request API đồng thời cập nhật 1 đơn hàng (Optimistic Locking)",
        "Đơn hàng có cột `version` = 1",
        "1. Gửi 2 request đồng thời (Thread A và Thread B) cập nhật trạng thái đơn hàng dựa trên version 1",
        "Concurrent UPDATE with version check",
        "1. Thread đầu tiên cập nhật thành công (version tăng lên 2)\n2. Thread thứ hai bị từ chối với lỗi Optimistic Lock Exception (Conflict 409)\n3. Dữ liệu không bị ghi đè lẫn nhau",
        "DB Concurrency", "High", "Chưa test", "Optimistic concurrency control"
    ],
    [
        "TC_API_27", "Database Deadlock", "Kiểm tra xử lý Deadlock Detection và cơ chế tự động thử lại (Retry Mechanism)",
        "Hệ thống có nhiều transaction cùng truy cập chéo khóa 2 bảng",
        "1. Mô phỏng tình huống 2 transaction khóa chéo lẫn nhau (Transaction A khóa Row 1 đợi Row 2; Transaction B khóa Row 2 đợi Row 1)",
        "Simulated Deadlock scenario",
        "1. MySQL phát hiện Deadlock và chủ động ngắt 1 transaction\n2. Backend bắt mã lỗi ER_LOCK_DEADLOCK và tự động retry tối đa 3 lần thành công",
        "DB Performance", "Medium", "Chưa test", "Deadlock recovery retry"
    ],
    [
        "TC_API_28", "Database Soft Delete", "Kiểm tra cơ chế Soft Delete (cột `deleted_at`) trên bảng `listings`",
        "Listing #20 đang có dữ liệu các đánh giá và booking cũ",
        "1. Gọi API DELETE /api/v1/listings/20\n2. Kiểm tra trực tiếp trong DB",
        "ID: 20",
        "1. Bản ghi không bị xóa vật lý (không dùng DROP/DELETE)\n2. Cột `deleted_at` được gán thời gian hiện tại\n3. Các câu query tìm kiếm thông thường tự động có mệnh đề `WHERE deleted_at IS NULL`",
        "DB Pattern", "Medium", "Chưa test", "Soft deletion audit trail"
    ],
    [
        "TC_API_29", "API Monitoring", "API GET /api/v1/health - Kiểm tra tình trạng kết nối DB MySQL và Redis",
        "Hệ thống đang chạy bình thường",
        "1. Gửi request GET /api/v1/health\n2. Kiểm tra kết quả phản hồi",
        "Request GET /health",
        "HTTP Status 200 OK. Body: { 'status': 'UP', 'database': 'CONNECTED', 'redis': 'CONNECTED', 'uptime': 12345 }",
        "API Health", "Low", "Chưa test", "Healthcheck readiness endpoint"
    ],
    [
        "TC_API_30", "API Security & Logging", "Kiểm tra API Logging không được phép in dữ liệu nhạy cảm ra file log/console",
        "Người dùng gọi API login hoặc thanh toán",
        "1. Gửi request chứa mật khẩu, token, và mã thẻ tín dụng\n2. Đọc file log máy chủ / winston log",
        "Payload chứa 'password', 'cvv', 'token'",
        "Trong file log, các trường nhạy cảm đều được mặt nạ hóa (Masked): 'password': '***', 'cvv': '***'. Không có mật khẩu thô trong log",
        "API Security", "High", "Chưa test", "Data masking in logs"
    ]
]

# 3. ĐINH THỊ MỪNG (40 Test Cases: Booking + Payment + Integration)
mung_testcases = [
    [
        "TC_BP_01", "Đặt phòng", "Đặt phòng thành công với khoảng ngày hợp lệ và đầy đủ thông tin",
        "Người dùng đã đăng nhập, nơi lưu trú còn trống ngày từ 01/12 đến 05/12",
        "1. Chọn ngày nhận phòng: 01/12, trả phòng: 05/12\n2. Chọn 2 khách\n3. Nhấn nút 'Đặt phòng'\n4. Tiến hành thanh toán thành công",
        "Check-in: 01/12, Check-out: 05/12, Khách: 2",
        "1. Đơn đặt phòng được tạo thành công với trạng thái 'CONFIRMED'\n2. Sinh mã đặt phòng duy nhất dạng BK-YYYYMMDD-XXXX\n3. Lịch ngày 01/12 - 05/12 chuyển sang màu xám (Đã khóa)",
        "Functional", "High", "Chưa test", "Happy path booking"
    ],
    [
        "TC_BP_02", "Đặt phòng", "Đặt phòng thất bại khi ngày Check-out nhỏ hơn hoặc bằng ngày Check-in",
        "Đang ở widget đặt phòng",
        "1. Chọn ngày Check-in là 10/12/2026\n2. Cố tình chọn ngày Check-out là 09/12/2026 hoặc 10/12/2026",
        "Check-in: 10/12/2026, Check-out: 09/12/2026",
        "Hệ thống báo lỗi ngay trên giao diện: 'Ngày trả phòng phải sau ngày nhận phòng ít nhất 1 ngày'. Nút đặt phòng bị vô hiệu hóa",
        "Validation", "High", "Chưa test", "Date validation logic"
    ],
    [
        "TC_BP_03", "Đặt phòng", "Đặt phòng thất bại khi chọn ngày Check-in trong quá khứ",
        "Ngày hiện tại là 20/10/2026",
        "1. Chọn ngày Check-in là 15/10/2026\n2. Bấm Đặt phòng",
        "Check-in: 15/10/2026",
        "Lịch không cho phép click vào các ngày trước hôm nay (disabled). Nếu gửi API trực tiếp sẽ bị từ chối với lỗi 400 'Không thể đặt phòng ngày trong quá khứ'",
        "Validation", "High", "Chưa test", "Past date check"
    ],
    [
        "TC_BP_04", "Đặt phòng", "Đặt phòng thất bại khi số lượng khách vượt quá sức chứa tối đa của phòng",
        "Nơi lưu trú có sức chứa tối đa là 4 người",
        "1. Chọn số lượng khách là 5 người\n2. Nhấn nút Đặt phòng",
        "Số khách: 5 (Max allowed: 4)",
        "Hiển thị thông báo: 'Số lượng khách vượt quá sức chứa tối đa (tối đa 4 người)'. Không cho phép gửi yêu cầu đặt phòng",
        "Validation", "High", "Chưa test", "Max guests limit"
    ],
    [
        "TC_BP_05", "Đặt phòng", "Đặt phòng thất bại khi số đêm lưu trú nhỏ hơn số đêm tối thiểu (Minimum Stay)",
        "Nơi lưu trú có quy định đặt tối thiểu 2 đêm vào cuối tuần",
        "1. Chọn Check-in thứ 7, Check-out chủ nhật (1 đêm)\n2. Nhấn Đặt phòng",
        "Số đêm: 1 đêm (Min stay: 2 đêm)",
        "Hiển thị cảnh báo: 'Chỗ nghỉ này yêu cầu đặt tối thiểu 2 đêm vào dịp cuối tuần'.",
        "Business Rule", "Medium", "Chưa test", "Minimum stay rule"
    ],
    [
        "TC_BP_06", "Lịch trống", "Kiểm tra cập nhật lịch trống theo thời gian thực (Real-time Availability)",
        "Phòng đang mở trống ngày 15/11",
        "1. Khách A đặt và thanh toán thành công ngày 15/11\n2. Khách B đang mở trang xem phòng đó",
        "Booking ngày 15/11",
        "Lịch trên màn hình của Khách B tự động cập nhật (hoặc sau khi refresh) chuyển ngày 15/11 sang trạng thái 'Đã được đặt' (không thể click)",
        "Realtime UX", "High", "Chưa test", "Calendar state update"
    ],
    [
        "TC_BP_07", "Lịch trống", "Host chủ động khóa ngày trên lịch để bảo trì hoặc sử dụng riêng",
        "Host đang trong màn hình Quản lý Lịch",
        "1. Chọn khoảng ngày 20/11 - 22/11\n2. Chọn tùy chọn 'Khóa phòng / Chặn ngày'\n3. Lưu thay đổi",
        "Dates: 20/11 - 22/11, Action: Block",
        "1. Khoảng ngày hiển thị gạch chéo màu đỏ trên lịch của Host\n2. Khách xem trên giao diện bên ngoài thấy ngày bị khóa, không thể đặt",
        "Host Feature", "Medium", "Chưa test", "Host manual calendar block"
    ],
    [
        "TC_BP_08", "Lịch trống", "Tự động mở lại ngày trống khi đơn đặt phòng chưa thanh toán bị hủy",
        "Đơn đặt phòng đang giữ chỗ ngày 05/12",
        "1. Đơn hết hạn thời gian thanh toán (15 phút) hoặc khách bấm Hủy đơn\n2. Kiểm tra lại lịch trống",
        "Booking ID bị EXPIRED",
        "Ngày 05/12 lập tức được giải phóng và chuyển lại sang màu trắng (Available) cho người khác đặt",
        "Automation", "High", "Chưa test", "Release dates on cancel"
    ],
    [
        "TC_BP_09", "Tính giá", "Tính toán đơn giá phòng cơ bản chính xác theo số đêm",
        "Giá niêm yết: 1.000.000 VNĐ / đêm",
        "1. Chọn đặt phòng 3 đêm\n2. Kiểm tra dòng tiền 'Tiền phòng'",
        "3 đêm x 1.000.000 VNĐ",
        "Tổng tiền phòng = 3.000.000 VNĐ",
        "Calculation", "High", "Chưa test", "Base price calculation"
    ],
    [
        "TC_BP_10", "Tính giá", "Tính toán phụ thu ngày cuối tuần (Thứ 6, Thứ 7) theo cấu hình giá linh hoạt",
        "Giá ngày thường: 800.000 VNĐ, phụ thu cuối tuần: 200.000 VNĐ/đêm",
        "1. Đặt phòng từ Thứ 5 đến Chủ nhật (1 đêm thường + 2 đêm cuối tuần)\n2. Kiểm tra bảng kê chi tiết giá",
        "1 đêm thường (800k) + 2 đêm cuối tuần (1.000k/đêm)",
        "Tổng tiền phòng = 800.000 + 2.000.000 = 2.800.000 VNĐ. Có tooltip giải thích rõ giá từng đêm",
        "Calculation", "Medium", "Chưa test", "Weekend dynamic pricing"
    ],
    [
        "TC_BP_11", "Tính giá", "Cộng phí vệ sinh (Cleaning Fee) cố định vào hóa đơn",
        "Phí vệ sinh thiết lập của homestay là 150.000 VNĐ / chuyến",
        "1. Chọn đặt 2 đêm phòng\n2. Kiểm tra hóa đơn thanh toán",
        "Phí vệ sinh = 150.000 VNĐ",
        "Dòng 'Phí dọn dẹp / vệ sinh' hiển thị rõ ràng 150.000 VNĐ và được cộng vào tổng bill (chỉ tính 1 lần không nhân theo số đêm)",
        "Calculation", "High", "Chưa test", "Fixed cleaning fee"
    ],
    [
        "TC_BP_12", "Tính giá", "Tính toán phí dịch vụ sàn (Service fee) theo tỷ lệ % chính xác",
        "Phí dịch vụ sàn là 8% tính trên tổng tiền phòng",
        "1. Tiền phòng: 2.000.000 VNĐ\n2. Quan sát dòng phí dịch vụ",
        "Tiền phòng = 2.000.000 VNĐ",
        "Phí dịch vụ sàn = 2.000.000 x 8% = 160.000 VNĐ. Hiển thị tách bạch trên breakdown giá",
        "Calculation", "High", "Chưa test", "Platform commission fee"
    ],
    [
        "TC_BP_13", "Tính giá", "Áp dụng mã giảm giá / Coupon khuyến mãi hợp lệ",
        "Mã 'WELCOME2026' giảm 10% (tối đa 200.000 VNĐ), đơn hàng 2.500.000 VNĐ",
        "1. Nhập mã 'WELCOME2026' vào ô mã giảm giá\n2. Nhấn nút 'Áp dụng'",
        "Coupon: 'WELCOME2026'",
        "1. Thông báo 'Áp dụng mã giảm giá thành công!' màu xanh\n2. Dòng giảm giá hiển thị: -200.000 VNĐ (đạt trần tối đa)\n3. Tổng tiền thanh toán giảm chính xác 200.000 VNĐ",
        "Calculation", "High", "Chưa test", "Coupon application"
    ],
    [
        "TC_BP_14", "Tính giá", "Áp dụng mã giảm giá đã hết hạn hoặc hết lượt sử dụng",
        "Mã 'EXPIRED50' đã hết hạn vào ngày hôm qua",
        "1. Nhập mã 'EXPIRED50'\n2. Nhấn 'Áp dụng'",
        "Coupon: 'EXPIRED50'",
        "Hiển thị thông báo lỗi màu đỏ: 'Mã giảm giá này đã hết hạn hoặc không còn hiệu lực'. Tổng tiền thanh toán không thay đổi",
        "Validation", "Medium", "Chưa test", "Expired coupon error"
    ],
    [
        "TC_BP_15", "Tính giá", "Tính thuế VAT (10%) trên các khoản dịch vụ theo quy định",
        "Cấu hình hệ thống bật tính thuế VAT 10%",
        "1. Đặt phòng với tổng tiền dịch vụ (chưa thuế) là 3.000.000 VNĐ\n2. Xem chi tiết hóa đơn",
        "Base amount = 3.000.000 VNĐ",
        "Dòng 'Thuế giá trị gia tăng (VAT 10%)' hiển thị 300.000 VNĐ. Tổng thanh toán cuối cùng là 3.300.000 VNĐ",
        "Calculation", "Medium", "Chưa test", "VAT tax calculation"
    ],
    [
        "TC_BP_16", "Đặt trùng (Concurrency)", "Cơ chế khóa giữ chỗ tạm thời (Temporary Hold Lock) trong 15 phút khi vào trang checkout",
        "Phòng đang mở trống",
        "1. Khách A bấm 'Tiến hành đặt phòng' và bước vào trang thanh toán\n2. Kiểm tra trạng thái phòng trên hệ thống",
        "User A enters checkout",
        "Hệ thống tạo bản ghi Lock tạm thời 15 phút. Có đồng hồ đếm ngược 15:00 hiển thị cho khách A",
        "Concurrency", "High", "Chưa test", "Redis hold lock"
    ],
    [
        "TC_BP_17", "Đặt trùng (Concurrency)", "Ngăn chặn 2 khách cùng bấm thanh toán 1 phòng tại cùng 1 khoảng ngày (Double-booking Prevention)",
        "Khách A đang giữ lock thanh toán phòng X từ 10/11 - 12/11",
        "1. Khách B cũng chọn đúng phòng X vào khoảng ngày 10/11 - 12/11 và bấm Đặt phòng",
        "Khách B đặt trùng ngày Khách A",
        "Hệ thống thông báo cho Khách B: 'Rất tiếc! Nơi lưu trú này đang có người tiến hành đặt phòng. Vui lòng chọn ngày khác hoặc thử lại sau ít phút'. Không xảy ra đặt trùng dữ liệu",
        "Concurrency / Security", "High", "Chưa test", "Prevent double booking"
    ],
    [
        "TC_BP_18", "Đặt trùng (Concurrency)", "Tự động giải phóng Hold Lock sau khi hết hạn 15 phút khách không thanh toán",
        "Khách A vào trang thanh toán nhưng tắt trình duyệt hoặc không nhập thẻ",
        "1. Chờ hết thời gian đếm ngược 15 phút (Hold lock timeout)\n2. Khách B kiểm tra lại phòng",
        "Hold lock expired (>15 min)",
        "Lock tạm thời bị xóa khỏi Redis/DB. Phòng trở lại trạng thái khả dụng cho Khách B đặt bình thường",
        "Automation", "High", "Chưa test", "Auto release lock timeout"
    ],
    [
        "TC_BP_19", "Braintree Payment", "Khởi tạo Client Token thành công từ Braintree Gateway gửi về Frontend Drop-in UI",
        "Backend đã cấu hình đúng Braintree Merchant ID, Public Key, Private Key (Sandbox)",
        "1. Khách vào trang thanh toán /checkout\n2. Frontend gọi API GET /api/v1/payments/braintree/client-token",
        "API GET client-token",
        "1. HTTP Status 200 OK\n2. Body trả về clientToken hợp lệ (base64 string)\n3. Frontend Drop-in UI khởi tạo thành công các ô nhập thẻ tín dụng an toàn",
        "Integration", "High", "Chưa test", "Braintree client token"
    ],
    [
        "TC_BP_20", "Braintree Payment", "Thanh toán thành công với thẻ tín dụng Visa Test hợp lệ (Braintree Sandbox)",
        "Drop-in UI đã tải xong",
        "1. Nhập số thẻ test Braintree hợp lệ\n2. Nhập ngày hết hạn tương lai, CVV bất kỳ\n3. Bấm 'Xác nhận thanh toán'",
        "Card: 4111 1111 1111 1111, Exp: 12/28, CVV: 123",
        "1. Braintree sinh payment_method_nonce thành công\n2. Backend gọi transaction.sale() thành công (status: 'submitted_for_settlement')\n3. Chuyển hướng sang trang 'Đặt phòng thành công!'",
        "Payment Flow", "High", "Chưa test", "Successful card charge"
    ],
    [
        "TC_BP_21", "Braintree Payment", "Thanh toán thất bại khi thẻ không đủ số dư (Card Declined - Insufficient Funds)",
        "Drop-in UI sẵn sàng",
        "1. Nhập số thẻ test mô phỏng lỗi thiếu số dư của Braintree\n2. Nhập CVV, Exp date\n3. Bấm thanh toán",
        "Card: 4000 0000 0000 0002 (Insufficient Funds test card)",
        "1. Giao dịch bị từ chối\n2. Hiển thị thông báo rõ ràng cho khách: 'Giao dịch thất bại: Thẻ của bạn không đủ số dư. Vui lòng sử dụng thẻ khác!'\n3. Trạng thái đơn chưa chuyển sang thanh toán",
        "Payment Negative", "High", "Chưa test", "Braintree card decline"
    ],
    [
        "TC_BP_22", "Braintree Payment", "Thanh toán thất bại khi thẻ đã hết hạn sử dụng (Expired Card)",
        "Drop-in UI sẵn sàng",
        "1. Nhập ngày hết hạn trong quá khứ\n2. Nhấn thanh toán",
        "Card hợp lệ, Exp: 01/20 (Quá khứ)",
        "Drop-in UI báo đỏ ngay tại ô Exp Date: 'Ngày hết hạn thẻ không hợp lệ'. Không gửi request lên backend",
        "Payment Validation", "High", "Chưa test", "Expired card client check"
    ],
    [
        "TC_BP_23", "Braintree Payment", "Thanh toán thất bại khi nhập sai mã bảo mật CVV",
        "Drop-in UI sẵn sàng",
        "1. Nhập số thẻ mô phỏng lỗi sai CVV của Braintree\n2. Nhấn thanh toán",
        "Card: 4000 0000 0000 0080, CVV: 999",
        "Giao dịch bị từ chối bởi ngân hàng phát hành. Hiển thị thông báo: 'Mã CVV/CVC không chính xác. Vui lòng kiểm tra lại 3 số mặt sau thẻ'.",
        "Payment Negative", "Medium", "Chưa test", "CVV verification fail"
    ],
    [
        "TC_BP_24", "Braintree 3-D Secure", "Kích hoạt luồng xác thực 3-D Secure 2.0 (Challenge Flow) cho thẻ yêu cầu bảo mật cao",
        "Thẻ hỗ trợ 3DS",
        "1. Nhập thẻ test 3DS của Braintree\n2. Nhấn 'Thanh toán'",
        "Card: 4000 0000 0000 0002 (3DS Challenge)",
        "Một popup modal ngân hàng (iFrame/Modal) xuất hiện yêu cầu nhập mã OTP bảo mật 3-D Secure",
        "3DS Flow", "High", "Chưa test", "3DS challenge modal trigger"
    ],
    [
        "TC_BP_25", "Braintree 3-D Secure", "Xác thực 3-D Secure thành công khi nhập đúng mã OTP",
        "Modal OTP 3DS đang hiển thị",
        "1. Nhập mã OTP chính xác\n2. Nhấn 'Xác nhận / Submit'",
        "OTP: 123456",
        "1. Modal 3DS đóng lại với trạng thái 'authenticate_successful'\n2. Giao dịch được thực thi thành công, đơn đặt phòng được xác nhận",
        "3DS Flow", "High", "Chưa test", "3DS success verification"
    ],
    [
        "TC_BP_26", "Braintree 3-D Secure", "Xác thực 3-D Secure thất bại khi người dùng đóng modal hoặc nhập sai OTP",
        "Modal OTP 3DS đang hiển thị",
        "1. Người dùng bấm dấu X hủy popup hoặc nhập sai OTP 3 lần\n2. Quan sát kết quả",
        "Action: Cancel 3DS modal",
        "Giao dịch dừng lại, hiển thị thông báo: 'Xác thực 3-D Secure không thành công hoặc bị hủy bỏ. Giao dịch chưa được trừ tiền'.",
        "3DS Negative", "High", "Chưa test", "3DS cancellation"
    ],
    [
        "TC_BP_27", "Braintree 3-D Secure", "Giao dịch tự động thông qua (Frictionless Flow) đối với giao dịch rủi ro thấp",
        "Thẻ test 3DS Frictionless",
        "1. Nhập thẻ test frictionless 3DS\n2. Bấm thanh toán",
        "Card: Thẻ 3DS rủi ro thấp (không cần OTP)",
        "Giao dịch được xác thực tự động ngầm trong vài giây mà không cần bật popup hỏi mã OTP của khách hàng",
        "3DS Flow", "Medium", "Chưa test", "3DS frictionless"
    ],
    [
        "TC_BP_28", "Braintree Webhook", "Xử lý Webhook khi sự kiện `transaction_settled` được gửi từ Braintree",
        "Booking đang ở trạng thái 'SUBMITTED_FOR_SETTLEMENT'",
        "1. Braintree gửi webhook POST /api/v1/webhooks/braintree với kind: 'transaction_settled'\n2. Backend xử lý webhook",
        "Webhook payload: transaction_settled",
        "1. Backend phản hồi HTTP 200 OK cho Braintree\n2. Cập nhật trạng thái payment trong DB thành 'SETTLED' (Đã quyết toán tiền)",
        "Webhook", "High", "Chưa test", "Webhook settlement"
    ],
    [
        "TC_BP_29", "Braintree Webhook", "Xử lý Webhook khi giao dịch bị từ chối `transaction_declined` hoặc `dispute_opened`",
        "Giao dịch gặp tranh chấp hoặc bị từ chối sau",
        "1. Gửi webhook event 'transaction_declined'\n2. Backend tiếp nhận",
        "Webhook payload: transaction_declined",
        "1. Cập nhật trạng thái thanh toán thành 'DECLINED'\n2. Gửi email cảnh báo cho Admin và Host để kiểm tra",
        "Webhook", "High", "Chưa test", "Webhook dispute/declined"
    ],
    [
        "TC_BP_30", "Braintree Webhook", "Xác thực chữ ký Webhook (HMAC Signature Verification) chống giả mạo request",
        "Endpoint POST /api/v1/webhooks/braintree công khai",
        "1. Kẻ xấu tự gửi request POST giả mạo webhook mà không có chữ ký hợp lệ từ Braintree",
        "Fake request without valid bt_signature",
        "Backend xác thực chữ ký thất bại, từ chối xử lý và trả về HTTP 401 Unauthorized / 403 Forbidden. Không cập nhật bất kỳ dữ liệu nào",
        "Security", "High", "Chưa test", "Webhook signature verification"
    ],
    [
        "TC_BP_31", "Braintree Webhook", "Xử lý tính lũy thừa (Idempotency) khi Braintree gửi lại cùng 1 webhook nhiều lần",
        "Webhook sự kiện settled đã được xử lý 1 lần trước đó",
        "1. Braintree gửi lại đúng event ID đó lần thứ hai do mạng chập chờn",
        "Duplicate webhook event ID",
        "Backend nhận diện event ID đã được ghi nhận trong bảng `webhook_logs`, trả về HTTP 200 OK ngay và không cộng tiền hay gửi mail 2 lần",
        "Integration", "High", "Chưa test", "Idempotent webhook handler"
    ],
    [
        "TC_BP_32", "Email Notification", "Tự động gửi Email xác nhận đặt phòng thành công cho Khách hàng",
        "Đơn đặt phòng thanh toán thành công",
        "1. Kiểm tra hòm thư đến của email khách hàng đã đặt",
        "Email: 'khachhang@gmail.com'",
        "1. Nhận được email từ tiêu đề: 'EduPulse / Homestay - Xác nhận đặt phòng thành công mã #BK-XXXX'\n2. Nội dung chứa: Tên phòng, ngày check-in/out, số tiền đã trả, mã QR check-in, thông tin liên hệ Host",
        "Integration Email", "High", "Chưa test", "Booking confirmation email"
    ],
    [
        "TC_BP_33", "Email Notification", "Tự động gửi Email thông báo có khách đặt phòng mới cho Host",
        "Đơn đặt phòng thanh toán thành công",
        "1. Kiểm tra hòm thư của Host sở hữu phòng đó",
        "Email Host",
        "Email thông báo: 'Bạn có đơn đặt phòng mới từ [Tên khách]!'. Kèm hướng dẫn chuẩn bị phòng và nút xem chi tiết đơn trong dashboard",
        "Integration Email", "High", "Chưa test", "Host notification email"
    ],
    [
        "TC_BP_34", "Email Notification", "Gửi Email thông báo khi đơn đặt phòng bị hủy và biên lai hoàn tiền",
        "Khách thực hiện hủy đơn phòng hợp lệ theo chính sách hoàn tiền",
        "1. Đơn hủy thành công\n2. Kiểm tra email của cả Khách và Host",
        "Event Cancel Booking",
        "Email gửi về xác nhận việc hủy phòng, nêu rõ số tiền được hoàn trả lại (ví dụ 100% hoặc 50% theo chính sách) và thời gian tiền về tài khoản (3-5 ngày làm việc)",
        "Integration Email", "Medium", "Chưa test", "Cancellation & refund email"
    ],
    [
        "TC_BP_35", "Đồng bộ iCal", "Xuất đường dẫn URL .ics (iCal Export Feed) cho từng nơi lưu trú",
        "Host đang trong mục cài đặt đồng bộ lịch của phòng",
        "1. Nhấn nút 'Lấy link xuất lịch iCal (Export)'\n2. Copy link URL .ics và mở trên trình duyệt",
        "URL: /api/v1/listings/10/calendar.ics",
        "1. Trả về file text đúng chuẩn MIME 'text/calendar' (RFC 5545)\n2. Chứa đầy đủ các khối BEGIN:VEVENT với ngày bắt đầu (DTSTART) và ngày kết thúc (DTEND) của các đơn đã đặt",
        "Integration iCal", "High", "Chưa test", "iCal export feed"
    ],
    [
        "TC_BP_36", "Đồng bộ iCal", "Nhập link iCal từ bên ngoài (Airbnb/Google Calendar) và chặn ngày tự động",
        "Host có link iCal từ listing trên Airbnb",
        "1. Dán link iCal Airbnb vào ô 'Nhập lịch iCal'\n2. Đặt tên lịch 'Airbnb Calendar'\n3. Nhấn 'Đồng bộ ngay'",
        "iCal URL Airbnb hợp lệ",
        "1. Hệ thống tải và phân tích (parse) các sự kiện VEVENT trong file .ics\n2. Tự động đánh dấu chặn các khoảng ngày đó trên lịch sàn nội bộ\n3. Tránh hoàn toàn việc khách đặt trùng trên 2 nền tảng",
        "Integration iCal", "High", "Chưa test", "iCal import & block dates"
    ],
    [
        "TC_BP_37", "Đồng bộ iCal", "Tự động kích hoạt đồng bộ lịch định kỳ theo lịch trình Cron Job (mỗi 30 phút)",
        "Đã cấu hình các feed iCal bên ngoài cho các listing",
        "1. Cho Cron job chạy định kỳ\n2. Quan sát log hệ thống và sự thay đổi lịch",
        "Cron: '*/30 * * * *'",
        "1. Cron job thực thi thành công không lỗi\n2. Cập nhật các ngày mới bị đặt từ nguồn ngoài\n3. Ghi log thời gian đồng bộ cuối cùng (Last synced at)",
        "Cron / Automation", "Medium", "Chưa test", "Periodic iCal sync"
    ],
    [
        "TC_BP_38", "Đồng bộ iCal", "Xử lý khi URL feed iCal bên ngoài bị chết (HTTP 404 hoặc 500)",
        "Link iCal của bên thứ ba bị xóa hoặc máy chủ đối tác gặp sự cố",
        "1. Thực hiện đồng bộ với link chết\n2. Kiểm tra phản hồi",
        "URL trả về 404 Not Found",
        "1. Hệ thống không bị crash\n2. Báo trạng thái đồng bộ: 'Thất bại - Không thể kết nối tới máy chủ nguồn lịch'\n3. Giữ nguyên trạng thái lịch hiện có, không xóa nhầm dữ liệu cũ",
        "Error Handling", "Medium", "Chưa test", "iCal external failure handling"
    ],
    [
        "TC_BP_39", "Đồng bộ iCal", "Xử lý file iCal có cú pháp nội dung bị lỗi hoặc không đúng chuẩn RFC 5545",
        "Dán link trả về file text linh tinh, không có header VCALENDAR",
        "1. Thực hiện nhập và phân tích cú pháp (parse)",
        "Invalid iCal format content",
        "Hệ thống bắt lỗi phân tích cú pháp (Parse Error), hiển thị thông báo: 'Định dạng tệp iCal không hợp lệ. Vui lòng kiểm tra lại đường dẫn!'",
        "Error Handling", "Medium", "Chưa test", "Malformed iCal content"
    ],
    [
        "TC_BP_40", "Quy trình Hoàn tiền", "Xử lý hoàn tiền tự động qua Braintree Refund API khi hủy phòng đúng chính sách",
        "Đơn đặt phòng đủ điều kiện hoàn tiền 100% (hủy trước 7 ngày)",
        "1. Khách bấm 'Hủy đặt phòng'\n2. Backend gọi Braintree transaction.refund()",
        "Booking ID đã thanh toán",
        "1. Braintree tạo transaction hoàn tiền thành công (status: refunded)\n2. Cập nhật trạng thái đơn thành 'REFUNDED'\n3. Giải phóng ngày trên lịch ngay lập tức",
        "Payment Refund", "High", "Chưa test", "Braintree refund transaction"
    ]
]

# 4. NGUYỄN TIẾN NHỰT (25 Test Cases: Security + Host/Admin)
nhut_testcases = [
    [
        "TC_SEC_01", "Phân quyền (RBAC)", "Người dùng vai trò Khách (Guest) không có quyền truy cập vào các trang Quản trị Admin (/admin)",
        "Người dùng đăng nhập với tài khoản role 'GUEST'",
        "1. Nhập trực tiếp đường dẫn URL '/admin' hoặc '/admin/dashboard' trên thanh địa chỉ trình duyệt\n2. Nhấn Enter",
        "User Role: GUEST",
        "Hệ thống chặn truy cập, hiển thị trang lỗi 403 Forbidden 'Bạn không có quyền truy cập trang này' hoặc tự động chuyển hướng về Trang chủ",
        "Security RBAC", "High", "Chưa test", "Admin route protection"
    ],
    [
        "TC_SEC_02", "Phân quyền (RBAC)", "Khách thường không thể truy cập Dashboard của Host khi chưa đăng ký làm Host",
        "Tài khoản chưa được duyệt lên Host (role: GUEST)",
        "1. Truy cập URL '/host/listings/new' hoặc '/host/manage'",
        "User Role: GUEST",
        "Chuyển hướng người dùng sang trang giới thiệu 'Đăng ký trở thành Host' kèm thông báo yêu cầu hoàn tất xác minh",
        "Security RBAC", "High", "Chưa test", "Host route protection"
    ],
    [
        "TC_SEC_03", "Chống lỗi IDOR", "Host A không thể sửa hoặc xóa listing thuộc sở hữu của Host B qua API",
        "Listing #10 thuộc Host B. Đăng nhập bằng tài khoản Host A",
        "1. Gửi request PUT /api/v1/listings/10 với header chứa token của Host A",
        "Token: Host A, Target Listing: #10 (Host B)",
        "1. HTTP Status 403 Forbidden\n2. Body: { 'success': false, 'message': 'Bạn không có quyền thao tác trên nơi lưu trú này' }\n3. Dữ liệu của listing #10 không bị thay đổi",
        "Security IDOR", "High", "Chưa test", "Prevent IDOR on listing edit"
    ],
    [
        "TC_SEC_04", "Chống lỗi IDOR", "Khách A không thể xem chi tiết hóa đơn đặt phòng của Khách B qua URL",
        "Đơn đặt phòng #88 thuộc về Khách B. Người dùng đang đăng nhập là Khách A",
        "1. Khách A truy cập URL: '/booking-confirmation/88'",
        "User: Khách A, Target Booking: #88",
        "Hệ thống kiểm tra quyền sở hữu đơn hàng, trả về 403 Forbidden hoặc 404 Not Found. Không làm rò rỉ tên tuổi, địa chỉ, số điện thoại của Khách B",
        "Security IDOR", "High", "Chưa test", "Prevent IDOR on booking view"
    ],
    [
        "TC_SEC_05", "Quản lý Listing", "Host tạo mới nơi lưu trú thành công với đầy đủ thông tin",
        "Tài khoản có quyền Host",
        "1. Vào trang Quản lý nơi lưu trú -> 'Thêm mới'\n2. Điền đầy đủ: Tên, mô tả, địa chỉ, giá/đêm, sức chứa, chọn tiện ích, tải lên 5 ảnh\n3. Bấm 'Gửi phê duyệt'",
        "Dữ liệu listing hợp lệ",
        "1. Tạo thành công với trạng thái 'PENDING_APPROVAL' (Chờ duyệt)\n2. Xuất hiện trong danh sách quản lý của Host kèm badge màu vàng\n3. Chưa xuất hiện trên kết quả tìm kiếm công khai",
        "Functional", "High", "Chưa test", "Host create listing"
    ],
    [
        "TC_SEC_06", "Quản lý Listing", "Host chỉnh sửa thông tin giá và mô tả của listing đã duyệt",
        "Listing đang hoạt động (Active)",
        "1. Host chọn 'Chỉnh sửa listing'\n2. Thay đổi giá từ 1.200.000 thành 1.500.000 VNĐ\n3. Lưu thay đổi",
        "New price: 1.500.000 VNĐ",
        "Dữ liệu được cập nhật thành công. Khách xem chi tiết listing ngoài trang chủ thấy giá mới ngay lập tức",
        "Functional", "Medium", "Chưa test", "Host edit listing"
    ],
    [
        "TC_SEC_07", "Quản lý Listing", "Host tạm ẩn nơi lưu trú (Deactivate / Unpublish) để ngưng đón khách",
        "Listing đang ở trạng thái ACTIVE",
        "1. Gạt công tắc 'Tạm ngưng hoạt động'\n2. Xác nhận trong popup",
        "Status change: ACTIVE -> INACTIVE",
        "1. Trạng thái chuyển sang 'Tạm ẩn'\n2. Listing bị ẩn khỏi toàn bộ kết quả tìm kiếm trên sàn\n3. Các đơn hàng đã đặt trước đó vẫn được giữ nguyên",
        "Functional", "Medium", "Chưa test", "Host unpublish listing"
    ],
    [
        "TC_SEC_08", "Quản lý Listing", "Ngăn chặn Host xóa nơi lưu trú khi đang có đơn đặt phòng sắp tới (Active Bookings)",
        "Listing #15 đang có 2 đơn đặt phòng trong tuần tới",
        "1. Host nhấn nút 'Xóa vĩnh viễn nơi lưu trú'\n2. Xác nhận xóa",
        "Target listing có active bookings",
        "Hệ thống từ chối xóa và hiển thị cảnh báo đỏ: 'Không thể xóa nơi lưu trú này vì đang có 2 đơn đặt phòng chưa hoàn thành. Vui lòng hoàn thành hoặc hủy đơn trước!'",
        "Business Rule", "High", "Chưa test", "Prevent delete listing with active bookings"
    ],
    [
        "TC_SEC_09", "Duyệt Listing (Admin)", "Admin phê duyệt (Approve) nơi lưu trú mới",
        "Đăng nhập với tài khoản Admin, có 1 listing đang chờ duyệt (Pending)",
        "1. Vào mục 'Quản lý duyệt Listing'\n2. Xem chi tiết thông tin, hình ảnh\n3. Nhấn nút 'Phê duyệt'",
        "Action: Approve",
        "1. Listing chuyển trạng thái 'ACTIVE'\n2. Gửi email thông báo chúc mừng tới Host\n3. Listing chính thức xuất hiện trên trang tìm kiếm công khai",
        "Admin Feature", "High", "Chưa test", "Admin approve listing"
    ],
    [
        "TC_SEC_10", "Duyệt Listing (Admin)", "Admin từ chối (Reject) listing không đạt yêu cầu kèm lý do",
        "Listing có ảnh mờ hoặc thông tin vi phạm chính sách",
        "1. Admin chọn 'Từ chối duyệt'\n2. Nhập lý do: 'Ảnh chụp không rõ ràng, vui lòng bổ sung ảnh phòng ngủ'\n3. Nhấn 'Xác nhận'",
        "Action: Reject with reason",
        "1. Trạng thái chuyển sang 'REJECTED'\n2. Lý do từ chối được hiển thị trong bảng điều khiển của Host và gửi qua email để Host sửa lại",
        "Admin Feature", "Medium", "Chưa test", "Admin reject listing"
    ],
    [
        "TC_SEC_11", "Đình chỉ Listing (Admin)", "Admin đình chỉ (Suspend) khẩn cấp nơi lưu trú khi có khiếu nại vi phạm pháp luật / lừa đảo",
        "Listing đang Active nhận được nhiều báo cáo lừa đảo từ khách",
        "1. Admin bấm nút 'Đình chỉ khẩn cấp'\n2. Nhập lý do đình chỉ",
        "Action: Suspend listing",
        "1. Listing bị ẩn khỏi sàn ngay lập tức\n2. Hủy các quyền nhận đặt phòng mới\n3. Ghi log sự kiện thanh tra vào hệ thống audit log",
        "Admin Security", "High", "Chưa test", "Emergency suspension"
    ],
    [
        "TC_SEC_12", "Khôi phục Listing (Admin)", "Admin mở lại hoạt động (Re-activate) cho nơi lưu trú sau khi giải quyết xong tranh chấp",
        "Listing đang ở trạng thái SUSPENDED",
        "1. Admin kiểm tra lại hồ sơ đã được Host giải trình thỏa đáng\n2. Nhấn 'Mở lại hoạt động'",
        "Action: Re-activate",
        "Trạng thái chuyển về 'ACTIVE'. Listing hiển thị lại bình thường trên sàn",
        "Admin Feature", "Low", "Chưa test", "Reactivate suspended listing"
    ],
    [
        "TC_SEC_13", "Quản lý Tài khoản", "Admin thực hiện Khóa tài khoản (Ban User) người dùng vi phạm quy chế sàn",
        "Tài khoản vi phạm nghiêm trọng chính sách cộng đồng",
        "1. Admin vào 'Quản lý người dùng'\n2. Tìm người dùng cần khóa\n3. Chọn 'Khóa tài khoản' (Khóa 30 ngày hoặc vĩnh viễn)",
        "Action: Ban User",
        "Cột `is_banned` hoặc `status` trong DB chuyển thành 'BANNED'. Ghi nhận thời gian và người thực hiện khóa",
        "Admin Security", "High", "Chưa test", "Ban user account"
    ],
    [
        "TC_SEC_14", "Bảo mật Phiên", "Đăng xuất cưỡng bức (Revoke Session / Blacklist Token) ngay lập tức khi tài khoản vừa bị khóa",
        "User A đang đăng nhập trên trình duyệt và đang xem các trang",
        "1. Admin thực hiện khóa tài khoản User A trên hệ thống\n2. User A nhấn click vào bất kỳ hành động nào tiếp theo trên web",
        "Session revocation",
        "1. Token của User A lập tức bị vô hiệu hóa (kiểm tra blacklist / redis session)\n2. User A bị đăng xuất cưỡng bức về màn hình Login\n3. Thông báo: 'Tài khoản của bạn đã bị khóa'",
        "Security Session", "High", "Chưa test", "Immediate session revocation"
    ],
    [
        "TC_SEC_15", "Quản lý Tài khoản", "Người dùng bị khóa cố gắng đăng nhập lại vào hệ thống",
        "Tài khoản đã bị Admin khóa",
        "1. Nhập đúng email và mật khẩu của tài khoản bị khóa\n2. Bấm 'Đăng nhập'",
        "Banned user credentials",
        "Hệ thống từ chối đăng nhập. Hiển thị thông báo rõ ràng: 'Tài khoản của bạn đã bị khóa do vi phạm tiêu chuẩn cộng đồng. Vui lòng liên hệ ban quản trị để được hỗ trợ'",
        "Security Auth", "High", "Chưa test", "Prevent banned user login"
    ],
    [
        "TC_SEC_16", "Rate Limiting", "Giới hạn tối đa 5 lần đăng nhập sai liên tiếp trong 15 phút (Chống Brute-force mật khẩu)",
        "Endpoint POST /api/v1/auth/login",
        "1. Nhập sai mật khẩu liên tiếp 5 lần cho cùng 1 email/IP trong vòng 1 phút",
        "5 failed login attempts",
        "Sau lần thứ 5, request thứ 6 bị chặn ngay lập tức. Hệ thống tạm khóa đăng nhập trong 15 phút",
        "Security Defense", "High", "Chưa test", "Brute-force protection"
    ],
    [
        "TC_SEC_17", "Rate Limiting", "Phản hồi mã trạng thái HTTP 429 Too Many Requests khi vượt ngưỡng giới hạn",
        "Đã bị kích hoạt Rate Limit sau 5 lần sai",
        "1. Gửi tiếp request đăng nhập thứ 6\n2. Kiểm tra mã phản hồi HTTP và Headers",
        "Request 6th within window",
        "1. HTTP Status Code: 429 Too Many Requests\n2. Header chứa `Retry-After: 900` (giây)\n3. Body: { 'message': 'Bạn đã thử đăng nhập quá nhiều lần. Vui lòng thử lại sau 15 phút!' }",
        "Security HTTP", "High", "Chưa test", "HTTP 429 status code"
    ],
    [
        "TC_SEC_18", "Rate Limiting", "Giới hạn tần suất gọi API Tìm kiếm (Search Rate Limiting) để chống cào dữ liệu (Scraping)",
        "API GET /api/v1/listings/search",
        "1. Sử dụng script tự động gửi 100 request liên tục trong 5 giây từ 1 địa chỉ IP",
        "100 requests in 5s",
        "Các request vượt ngưỡng (ví dụ trên 30 req/phút) sẽ nhận mã lỗi 429. Bảo vệ tài nguyên server không bị quá tải bởi bot",
        "Security Defense", "Medium", "Chưa test", "API anti-scraping"
    ],
    [
        "TC_SEC_19", "Rate Limiting", "Kiểm tra các Headers phản hồi RateLimit chuẩn trong API",
        "Các API được cấu hình express-rate-limit",
        "1. Gửi 1 request API bình thường\n2. Đọc Response Headers",
        "Standard API request",
        "Các headers tiêu chuẩn xuất hiện đầy đủ: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`",
        "Security Header", "Low", "Chưa test", "Rate limit headers"
    ],
    [
        "TC_SEC_20", "Cookie Bảo mật", "Kiểm tra cờ `HttpOnly` trên Cookie chứa Refresh Token / Session ID",
        "Đăng nhập thành công, server trả về Set-Cookie",
        "1. Kiểm tra thuộc tính của cookie trong tab Application của DevTools\n2. Chạy thử câu lệnh JavaScript: `console.log(document.cookie)`",
        "Cookie inspection",
        "1. Cờ `HttpOnly` được bật (True)\n2. JavaScript không thể truy cập đọc được giá trị cookie này (Ngăn ngừa hoàn toàn việc đánh cắp token qua lỗ hổng XSS)",
        "Security Cookie", "High", "Chưa test", "HttpOnly flag protection"
    ],
    [
        "TC_SEC_21", "Cookie Bảo mật", "Kiểm tra cờ `Secure` đảm bảo Cookie chỉ truyền qua kết nối mã hóa HTTPS",
        "Môi trường Production (hoặc HTTPS)",
        "1. Đọc thuộc tính cookie sau khi đăng nhập",
        "Cookie inspection",
        "Cờ `Secure` được thiết lập. Trình duyệt từ chối gửi cookie này qua các liên kết HTTP không an toàn",
        "Security Cookie", "High", "Chưa test", "Secure flag check"
    ],
    [
        "TC_SEC_22", "Cookie Bảo mật", "Kiểm tra cờ `SameSite=Lax` hoặc `Strict` để phòng chống tấn công CSRF",
        "Cookie xác thực người dùng",
        "1. Kiểm tra thuộc tính SameSite trên cookie phiên\n2. Mô phỏng request gửi từ một tên miền độc hại khác",
        "Cross-site request",
        "Cookie có cờ `SameSite=Lax` (hoặc Strict). Trình duyệt không tự động gửi cookie khi có request ngầm từ trang web khác, ngăn ngừa CSRF",
        "Security Cookie", "High", "Chưa test", "CSRF defense SameSite"
    ],
    [
        "TC_SEC_23", "Phòng chống SSRF", "Chặn Host nhập URL ảnh hoặc Webhook trỏ về địa chỉ Loopback / Localhost",
        "Tính năng 'Tải ảnh từ URL' hoặc 'Nhập link iCal / Webhook'",
        "1. Nhập URL: 'http://localhost:3000/api/secret' hoặc 'http://127.0.0.1:8080/admin'\n2. Bấm xác nhận tải về",
        "URL: 'http://127.0.0.1/admin'",
        "Hệ thống phân giải DNS/IP, phát hiện địa chỉ loopback nội bộ, chặn request ngay lập tức và báo lỗi: 'Địa chỉ URL không hợp lệ hoặc bị cấm'",
        "Security SSRF", "High", "Chưa test", "Block localhost SSRF"
    ],
    [
        "TC_SEC_24", "Phòng chống SSRF", "Chặn nhập URL trỏ tới dải IP Cloud Metadata (AWS / GCP / Azure Instance Metadata)",
        "Tính năng nhập URL tài nguyên bên ngoài",
        "1. Nhập URL: 'http://169.254.169.254/latest/meta-data/' để cố tình lấy thông tin credentials của Cloud Server",
        "URL: 'http://169.254.169.254/...'",
        "Hệ thống có bộ lọc blacklist dải IP link-local 169.254.0.0/16, chặn đứng request và ghi nhận cảnh báo bảo mật về hệ thống",
        "Security SSRF", "High", "Chưa test", "Block cloud metadata SSRF"
    ],
    [
        "TC_SEC_25", "Phòng chống SSRF", "Chặn nhập các dải địa chỉ IP mạng nội bộ Private Network (RFC 1918)",
        "Tính năng fetch URL từ xa",
        "1. Nhập các URL thuộc mạng nội bộ: 'http://192.168.1.1', 'http://10.0.0.5', 'http://172.16.0.10'\n2. Gửi yêu cầu",
        "Private IPs (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16)",
        "Hệ thống từ chối kết nối, chặn không cho server nội bộ quét cổng hay gửi request vào các thiết bị nội mạng của doanh nghiệp",
        "Security SSRF", "High", "Chưa test", "Block RFC 1918 private IPs"
    ]
]

# Create Sheets for 4 members
ws_manh = wb.create_sheet(title="Nguyễn Mạnh - UI")
format_sheet(
    ws_manh,
    "Phân hệ UI + Điều phối",
    "Nguyễn Mạnh",
    "UI + điều phối",
    "25",
    "Đăng ký/đăng nhập trên giao diện; thông báo lỗi; điều hướng; tìm kiếm và xem thông tin nơi lưu trú; tổng hợp và rà soát test case.",
    HEADER_FILL_MANH,
    manh_testcases
)

ws_thom = wb.create_sheet(title="ALăng Thị Thơm - API_DB")
format_sheet(
    ws_thom,
    "Phân hệ API + Database",
    "ALăng Thị Thơm",
    "API + Database",
    "30",
    "Validation; mã phản hồi API; xác thực; dữ liệu MySQL; transaction, rollback và tính toàn vẹn dữ liệu.",
    HEADER_FILL_THOM,
    thom_testcases
)

ws_mung = wb.create_sheet(title="Đinh Thị Mừng - Booking_Pay")
format_sheet(
    ws_mung,
    "Phân hệ Booking + Payment + Integration",
    "Đinh Thị Mừng",
    "Booking + Payment + Integration",
    "40",
    "Đặt phòng; lịch trống; tính giá; đặt trùng; Braintree; 3-D Secure; webhook; email và iCal.",
    HEADER_FILL_MUNG,
    mung_testcases
)

ws_nhut = wb.create_sheet(title="Nguyễn Tiến Nhựt - Sec_Admin")
format_sheet(
    ws_nhut,
    "Phân hệ Security + Host_Admin",
    "Nguyễn Tiến Nhựt",
    "Security + Host/Admin",
    "25",
    "Phân quyền; quản lý listing; duyệt/đình chỉ listing; khóa tài khoản; rate limit; cookie bảo mật và SSRF.",
    HEADER_FILL_NHUT,
    nhut_testcases
)

# Create an Overview Sheet at the front
ws_overview = wb.create_sheet(title="Tổng quan - Overview", index=0)
ws_overview.views.sheetView[0].showGridLines = True

# Title
ws_overview.merge_cells("B2:J2")
ws_overview["B2"] = "DỰ ÁN HỆ THỐNG NỀN TẢNG NƠI LƯU TRÚ & DU LỊCH TRỰC TUYẾN"
ws_overview["B2"].font = Font(name="Calibri", size=18, bold=True, color="1E3A8A")
ws_overview["B2"].alignment = Alignment(horizontal="center", vertical="center")
ws_overview.row_dimensions[2].height = 35

ws_overview.merge_cells("B3:J3")
ws_overview["B3"] = "BẢNG KẾ HOẠCH & TỔNG HỢP PHÂN CÔNG KIỂM THỬ (TEST PLAN & EXECUTION TRACKER)"
ws_overview["B3"].font = Font(name="Calibri", size=13, bold=True, color="374151")
ws_overview["B3"].alignment = Alignment(horizontal="center", vertical="center")
ws_overview.row_dimensions[3].height = 25

ws_overview.merge_cells("B4:J4")
ws_overview["B4"] = "Tổng số: 120 Test Cases | 04 Thành viên phụ trách | Phân chia độc lập theo 4 Sheet chuyên biệt"
ws_overview["B4"].font = Font(name="Calibri", size=11, italic=True, color="6B7280")
ws_overview["B4"].alignment = Alignment(horizontal="center", vertical="center")
ws_overview.row_dimensions[4].height = 22

# Overview Table Header
headers_ov = [
    ("STT", 8),
    ("Thành viên", 22),
    ("Module phụ trách", 26),
    ("Số lượng test case", 18),
    ("Tên Sheet trong file", 25),
    ("Nội dung kiểm thử chính", 45),
    ("Độ ưu tiên chính", 18),
    ("Tiến độ hiện tại", 16)
]

ov_row = 6
ws_overview.row_dimensions[ov_row].height = 30
for col_idx, (h_name, _) in enumerate(headers_ov, 2):
    cell = ws_overview.cell(row=ov_row, column=col_idx, value=h_name)
    cell.fill = HEADER_FILL_OVERVIEW
    cell.font = HEADER_FONT
    cell.alignment = Alignment(horizontal="center", vertical="center")
    cell.border = THIN_BORDER

ov_data = [
    (1, "Nguyễn Mạnh", "UI + điều phối", 25, "Nguyễn Mạnh - UI", "Đăng ký/đăng nhập trên giao diện; thông báo lỗi; điều hướng; tìm kiếm và xem thông tin nơi lưu trú; tổng hợp và rà soát test case.", "High (15), Med (8), Low (2)", "Sẵn sàng test"),
    (2, "ALăng Thị Thơm", "API + Database", 30, "ALăng Thị Thơm - API_DB", "Validation; mã phản hồi API; xác thực; dữ liệu MySQL; transaction, rollback và tính toàn vẹn dữ liệu.", "High (24), Med (5), Low (1)", "Sẵn sàng test"),
    (3, "Đinh Thị Mừng", "Booking + Payment + Integration", 40, "Đinh Thị Mừng - Booking_Pay", "Đặt phòng; lịch trống; tính giá; đặt trùng; Braintree; 3-D Secure; webhook; email và iCal.", "High (31), Med (9)", "Sẵn sàng test"),
    (4, "Nguyễn Tiến Nhựt", "Security + Host/Admin", 25, "Nguyễn Tiến Nhựt - Sec_Admin", "Phân quyền; quản lý listing; duyệt/đình chỉ listing; khóa tài khoản; rate limit; cookie bảo mật và SSRF.", "High (20), Med (4), Low (1)", "Sẵn sàng test"),
]

for row_i, r_val in enumerate(ov_data, 7):
    ws_overview.row_dimensions[row_i].height = 42
    r_fill = ZEBRA_FILL if row_i % 2 == 0 else WHITE_FILL
    for col_i, val in enumerate(r_val, 2):
        cell = ws_overview.cell(row=row_i, column=col_i, value=val)
        cell.font = REGULAR_FONT
        cell.border = THIN_BORDER
        cell.fill = r_fill
        if col_i in [2, 5, 8, 9]:
            cell.alignment = Alignment(horizontal="center", vertical="center")
        elif col_i == 6:
            cell.alignment = Alignment(horizontal="center", vertical="center")
            cell.font = Font(name="Calibri", size=10, bold=True, color="1E3A8A")
        elif col_i == 7:
            cell.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
        else:
            cell.alignment = Alignment(horizontal="left", vertical="center")

# Summary Total Row
total_row = 11
ws_overview.row_dimensions[total_row].height = 28
ws_overview.merge_cells("B11:D11")
ws_overview["B11"] = "TỔNG CỘNG TOÀN BỘ DỰ ÁN"
ws_overview["B11"].font = Font(name="Calibri", size=11, bold=True, color="FFFFFF")
ws_overview["B11"].fill = PatternFill(start_color="1E3A8A", end_color="1E3A8A", fill_type="solid")
ws_overview["B11"].alignment = Alignment(horizontal="center", vertical="center")
ws_overview["B11"].border = THIN_BORDER
ws_overview["C11"].border = THIN_BORDER
ws_overview["D11"].border = THIN_BORDER

ws_overview["E11"] = 120
ws_overview["E11"].font = Font(name="Calibri", size=11, bold=True, color="FFFFFF")
ws_overview["E11"].fill = PatternFill(start_color="1E3A8A", end_color="1E3A8A", fill_type="solid")
ws_overview["E11"].alignment = Alignment(horizontal="center", vertical="center")
ws_overview["E11"].border = THIN_BORDER

ws_overview.merge_cells("F11:I11")
ws_overview["F11"] = "Bao phủ 100% các chức năng cốt lõi theo phân công trong SRS"
ws_overview["F11"].font = Font(name="Calibri", size=10, italic=True, color="FFFFFF")
ws_overview["F11"].fill = PatternFill(start_color="1E3A8A", end_color="1E3A8A", fill_type="solid")
ws_overview["F11"].alignment = Alignment(horizontal="left", vertical="center")
for col_letter in ["F", "G", "H", "I"]:
    ws_overview[f"{col_letter}11"].border = THIN_BORDER

# Legend / Instructions Block
note_row = 13
ws_overview.merge_cells("B13:I13")
ws_overview["B13"] = "HƯỚNG DẪN SỬ DỤNG VÀ THỰC HIỆN KIỂM THỬ DÀNH CHO CÁC THÀNH VIÊN:"
ws_overview["B13"].font = Font(name="Calibri", size=11, bold=True, color="1E3A8A")

instructions = [
    "1. Mỗi bạn thành viên phụ trách mở đúng Sheet mang tên mình ở phía dưới để thực hiện kiểm thử theo danh sách đã phân công.",
    "2. Trong quá trình test, cập nhật cột 'Trạng thái' thành: 'Passed' (Đạt), 'Failed' (Lỗi), hoặc 'Blocked' (Bị nghẽn).",
    "3. Nếu phát hiện lỗi (Failed), ghi rõ mã lỗi, ảnh chụp màn hình hoặc log response vào cột 'Ghi chú' để Dev dễ dàng tái hiện.",
    "4. Các test case có độ ưu tiên 'High' bắt buộc phải hoàn thành và đạt 100% trước khi nghiệm thu bàn giao dự án."
]

for idx, inst in enumerate(instructions, 14):
    ws_overview.merge_cells(f"B{idx}:I{idx}")
    ws_overview[f"B{idx}"] = inst
    ws_overview[f"B{idx}"].font = Font(name="Calibri", size=10, color="374151")
    ws_overview.row_dimensions[idx].height = 20

# Set column widths for overview
ws_overview.column_dimensions["A"].width = 4
for col_idx, (_, w) in enumerate(headers_ov, 2):
    ws_overview.column_dimensions[get_column_letter(col_idx)].width = w

# Save file
output_path = r"c:\Project\e-Learning-Platform\Danh_Sach_Test_Cases_4_Thanh_Vien.xlsx"
wb.save(output_path)
print(f"Successfully generated {output_path}")
