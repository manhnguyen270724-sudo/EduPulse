import os
import sys
sys.stdout.reconfigure(encoding='utf-8')
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.patches import FancyBboxPatch, Ellipse

plt.rcParams['font.sans-serif'] = ['DejaVu Sans', 'Arial', 'Segoe UI', 'sans-serif']
plt.rcParams['axes.unicode_minus'] = False

OUTPUT_DIR = "generated_diagrams"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def draw_actor(ax, x, y, name, color='#1e293b', scale=1.0):
    """Vẽ biểu tượng tác nhân (Actor stick figure) chuẩn UML"""
    head = plt.Circle((x, y + 0.35 * scale), 0.12 * scale, color=color, fill=False, linewidth=2.2)
    ax.add_patch(head)
    ax.plot([x, x], [y + 0.23 * scale, y - 0.15 * scale], color=color, linewidth=2.2)
    ax.plot([x - 0.22 * scale, x + 0.22 * scale], [y + 0.12 * scale, y + 0.12 * scale], color=color, linewidth=2.2)
    ax.plot([x, x - 0.18 * scale], [y - 0.15 * scale, y - 0.45 * scale], color=color, linewidth=2.2)
    ax.plot([x, x + 0.18 * scale], [y - 0.15 * scale, y - 0.45 * scale], color=color, linewidth=2.2)
    ax.text(x, y - 0.65 * scale, name, ha='center', va='top', fontsize=9.5 * scale, fontweight='bold', color=color)

def draw_usecase(ax, x, y, width, height, text, bg_color='#eff6ff', edge_color='#2563eb', text_color='#1e293b', fontsize=8.5):
    """Vẽ oval Use Case chuẩn UML"""
    oval = Ellipse((x, y), width, height, facecolor=bg_color, edgecolor=edge_color, linewidth=1.8, zorder=3)
    ax.add_patch(oval)
    ax.text(x, y, text, ha='center', va='center', fontsize=fontsize, color=text_color, fontweight='medium', zorder=4, multialignment='center')

def draw_system_box(ax, x, y, width, height, title, bg_color='#f8fafc', edge_color='#94a3b8'):
    """Vẽ khung ranh giới hệ thống (System boundary)"""
    box = FancyBboxPatch((x, y), width, height, boxstyle="round,pad=0.05,rounding_size=0.15",
                         facecolor=bg_color, edgecolor=edge_color, linewidth=2, linestyle='--', zorder=1)
    ax.add_patch(box)
    ax.text(x + 0.2, y + height - 0.35, title, fontsize=10.5, fontweight='bold', color='#334155', zorder=2)

def connect(ax, x1, y1, x2, y2, label="", color='#64748b', linestyle='-', zorder=2, label_offset=(0, 0)):
    """Vẽ đường liên kết association hoặc include/extend"""
    ax.plot([x1, x2], [y1, y2], color=color, linestyle=linestyle, linewidth=1.5, zorder=zorder)
    if label:
        mx, my = (x1 + x2) / 2 + label_offset[0], (y1 + y2) / 2 + label_offset[1]
        ax.text(mx, my, label, fontsize=7.5, color='#0284c7', fontweight='bold', ha='center', va='center',
                bbox=dict(boxstyle='square,pad=0.18', facecolor='white', edgecolor='none', alpha=0.9), zorder=5)

def save_fig(filename):
    plt.tight_layout()
    path = os.path.join(OUTPUT_DIR, filename)
    plt.savefig(path, bbox_inches='tight')
    plt.close()
    return path

# ------------------------------------------------------------------------------
# 0. USE CASE TỔNG QUAN
# ------------------------------------------------------------------------------
def gen_uc_overview():
    fig, ax = plt.subplots(figsize=(15, 10), dpi=250)
    ax.set_xlim(-2.5, 14.5)
    ax.set_ylim(-0.5, 11.5)
    ax.axis('off')
    draw_system_box(ax, 1.2, 0, 10.2, 11.2, "HỆ THỐNG EDUPULSE - USE CASE TỔNG QUAN (25 USE CASES)")

    draw_actor(ax, -1.0, 8.5, "Học viên\n(Student)", color='#059669', scale=1.0)
    draw_actor(ax, -1.0, 3.0, "Giảng viên\n(Teacher)", color='#2563eb', scale=1.0)
    draw_actor(ax, 13.0, 5.5, "Quản trị viên\n(Admin)", color='#e11d48', scale=1.0)

    draw_usecase(ax, 3.8, 10.2, 3.2, 0.85, "Đăng ký & Mua khóa học\n(UC09: Razorpay)", bg_color='#ecfdf5', edge_color='#10b981')
    draw_usecase(ax, 3.8, 8.8, 3.2, 0.85, "Học trực tuyến Live\n(UC13: Google Meet)", bg_color='#ecfdf5', edge_color='#10b981')
    draw_usecase(ax, 3.8, 7.4, 3.2, 0.85, "Chat & Chia sẻ tài liệu\n(UC14: Classroom Chat)", bg_color='#ecfdf5', edge_color='#10b981')
    draw_usecase(ax, 3.8, 6.0, 3.4, 0.9, "Nộp form nghiệm thu\nkết thúc khóa học (UC18)", bg_color='#eff6ff', edge_color='#3b82f6')
    draw_usecase(ax, 3.8, 4.5, 3.4, 0.85, "Đánh giá sao & Nhận xét\n(UC21: Course Review)", bg_color='#fefce8', edge_color='#eab308')

    draw_usecase(ax, 3.8, 3.0, 3.2, 0.85, "Biên soạn khóa học\n(UC10: Syllabus)", bg_color='#eff6ff', edge_color='#2563eb')
    draw_usecase(ax, 3.8, 1.7, 3.2, 0.85, "Tạo lớp học & Buổi học\n(UC12 & UC13)", bg_color='#eff6ff', edge_color='#2563eb')
    draw_usecase(ax, 3.8, 0.4, 3.4, 0.85, "Tạo yêu cầu rút tiền\n(UC24: Ràng buộc nghiệm thu)", bg_color='#f5f3ff', edge_color='#8b5cf6')

    draw_usecase(ax, 8.4, 8.8, 3.4, 0.85, "Duyệt hồ sơ KYC & Khóa học\n(UC07 & UC11)", bg_color='#fee2e2', edge_color='#dc2626')
    draw_usecase(ax, 8.4, 7.2, 3.5, 0.9, "Gửi yêu cầu nghiệm thu lên Admin\n(UC19: Điều kiện >= 80%)", bg_color='#eff6ff', edge_color='#3b82f6')
    draw_usecase(ax, 8.4, 5.6, 3.5, 0.9, "Duyệt nghiệm thu khóa học\n(UC20: Mở khóa 85% ví GV)", bg_color='#fff1f2', edge_color='#ef4444')
    draw_usecase(ax, 8.4, 4.0, 3.4, 0.85, "Cảnh báo review xấu & Tạm dừng\n(UC22: Moderation & Suspend)", bg_color='#fff1f2', edge_color='#e11d48')
    draw_usecase(ax, 8.4, 2.4, 3.4, 0.85, "Quản lý tài khoản User\n(UC23: Active / Suspend / Ban)", bg_color='#fee2e2', edge_color='#dc2626')
    draw_usecase(ax, 8.4, 0.8, 3.4, 0.85, "Quản trị tài chính sàn GMV\n(UC25: Giải ngân chuyển khoản)", bg_color='#fdf2f8', edge_color='#db2777')

    connect(ax, -0.5, 8.5, 2.2, 10.2, color='#059669')
    connect(ax, -0.5, 8.5, 2.2, 8.8, color='#059669')
    connect(ax, -0.5, 8.5, 2.2, 7.4, color='#059669')
    connect(ax, -0.5, 8.5, 2.1, 6.0, color='#059669')
    connect(ax, -0.5, 8.5, 2.1, 4.5, color='#059669')

    connect(ax, -0.5, 3.0, 2.2, 8.8, color='#2563eb')
    connect(ax, -0.5, 3.0, 2.2, 7.4, color='#2563eb')
    connect(ax, -0.5, 3.0, 2.2, 3.0, color='#2563eb')
    connect(ax, -0.5, 3.0, 2.2, 1.7, color='#2563eb')
    connect(ax, -0.5, 3.0, 2.1, 0.4, color='#2563eb')
    connect(ax, -0.5, 3.0, 6.6, 7.2, color='#2563eb')

    connect(ax, 12.3, 5.5, 10.1, 8.8, color='#e11d48')
    connect(ax, 12.3, 5.5, 10.1, 5.6, color='#e11d48')
    connect(ax, 12.3, 5.5, 10.1, 4.0, color='#e11d48')
    connect(ax, 12.3, 5.5, 10.1, 2.4, color='#e11d48')
    connect(ax, 12.3, 5.5, 10.1, 0.8, color='#e11d48')

    save_fig("uc_overview.png")

# ------------------------------------------------------------------------------
# HÀM TẠO SƠ ĐỒ USE CASE CHUẨN ĐƠN LẺ CHO 25 USE CASE
# ------------------------------------------------------------------------------
def create_single_uc(filename, title, actor_left, actor_right, main_uc, sub_ucs=None, relations=None):
    """Hàm tạo sơ đồ cho một Use Case cụ thể kèm các liên kết include / extend / secondary actor"""
    fig, ax = plt.subplots(figsize=(10, 5.0), dpi=250)
    ax.set_xlim(-2, 10)
    ax.set_ylim(0, 5.5)
    ax.axis('off')
    draw_system_box(ax, 1.2, 0.4, 6.6, 4.7, title)

    # Actor trái
    if actor_left:
        draw_actor(ax, -0.8, 2.7, actor_left['name'], color=actor_left.get('color', '#059669'))
    # Actor phải
    if actor_right:
        draw_actor(ax, 8.8, 2.7, actor_right['name'], color=actor_right.get('color', '#e11d48'))

    # Main Use Case
    draw_usecase(ax, 4.5, 2.7, main_uc.get('w', 3.6), main_uc.get('h', 0.9), main_uc['text'],
                 bg_color=main_uc.get('bg', '#eff6ff'), edge_color=main_uc.get('edge', '#2563eb'))

    if actor_left:
        connect(ax, -0.2, 2.7, 4.5 - main_uc.get('w', 3.6)/2, 2.7, color=actor_left.get('color', '#059669'))
    if actor_right:
        connect(ax, 8.2, 2.7, 4.5 + main_uc.get('w', 3.6)/2, 2.7, color=actor_right.get('color', '#e11d48'))

    # Sub Use Cases (include / extend)
    if sub_ucs:
        for sub in sub_ucs:
            draw_usecase(ax, sub['x'], sub['y'], sub.get('w', 3.2), sub.get('h', 0.8), sub['text'],
                         bg_color=sub.get('bg', '#f8fafc'), edge_color=sub.get('edge', '#64748b'))
            connect(ax, sub['from_x'], sub['from_y'], sub['to_x'], sub['to_y'],
                    label=sub.get('label', ''), linestyle=sub.get('linestyle', ':'), color=sub.get('color', '#0284c7'))

    save_fig(filename)

# ------------------------------------------------------------------------------
# 25 HÀM SINH BIỂU ĐỒ TỪNG USE CASE
# ------------------------------------------------------------------------------
def gen_all_25_ucs():
    # UC01: Đăng ký tài khoản
    create_single_uc("uc_01_signup.png", "USE CASE 01: ĐĂNG KÝ TÀI KHOẢN (SIGN-UP)",
        actor_left={'name': 'Người dùng mới\n(Guest User)', 'color': '#059669'}, actor_right=None,
        main_uc={'text': 'UC01: Đăng ký tài khoản mới\n(Sign-up)', 'w': 3.6, 'h': 0.9, 'bg': '#ecfdf5', 'edge': '#10b981'},
        sub_ucs=[
            {'x': 4.5, 'y': 4.2, 'text': '<<include>>\nMã hóa Bcrypt 10 rounds', 'w': 3.2, 'h': 0.75,
             'from_x': 4.5, 'from_y': 3.15, 'to_x': 4.5, 'to_y': 3.8, 'label': '<<include>>'},
            {'x': 4.5, 'y': 1.2, 'text': '<<include>>\nGửi email kích hoạt (Nodemailer)', 'w': 3.4, 'h': 0.75,
             'from_x': 4.5, 'from_y': 2.25, 'to_x': 4.5, 'to_y': 1.6, 'label': '<<include>>'}
        ]
    )

    # UC02: Xác thực email
    create_single_uc("uc_02_verify_email.png", "USE CASE 02: XÁC THỰC EMAIL & KÍCH HOẠT TÀI KHOẢN",
        actor_left={'name': 'Người dùng\n(User)', 'color': '#059669'}, actor_right=None,
        main_uc={'text': 'UC02: Xác thực email tài khoản\n(Verify Email Token)', 'w': 3.6, 'h': 0.9, 'bg': '#ecfdf5', 'edge': '#10b981'},
        sub_ucs=[
            {'x': 4.5, 'y': 1.4, 'text': 'Kích hoạt tài khoản hợp lệ\n(accountStatus: active)', 'w': 3.4, 'h': 0.8,
             'from_x': 4.5, 'from_y': 2.25, 'to_x': 4.5, 'to_y': 1.8, 'label': '<<cập nhật>>'}
        ]
    )

    # UC03: Đăng nhập & Cấp phiên JWT
    create_single_uc("uc_03_login.png", "USE CASE 03: ĐĂNG NHẬP & QUẢN LÝ PHIÊN JWT",
        actor_left={'name': 'Học viên /\nGiảng viên', 'color': '#2563eb'}, actor_right={'name': 'Quản trị viên\n(Admin)', 'color': '#e11d48'},
        main_uc={'text': 'UC03: Đăng nhập hệ thống\n(Login & JWT Session)', 'w': 3.6, 'h': 0.9, 'bg': '#eff6ff', 'edge': '#2563eb'},
        sub_ucs=[
            {'x': 4.5, 'y': 4.2, 'text': 'Kiểm tra trạng thái tài khoản\n(Chặn nếu suspended / banned)', 'w': 3.6, 'h': 0.8,
             'from_x': 4.5, 'from_y': 3.15, 'to_x': 4.5, 'to_y': 3.8, 'label': '<<kiểm tra>>'},
            {'x': 4.5, 'y': 1.2, 'text': 'Cấp cặp JWT HttpOnly Cookie\n(Access 15m & Refresh 7d)', 'w': 3.6, 'h': 0.8,
             'from_x': 4.5, 'from_y': 2.25, 'to_x': 4.5, 'to_y': 1.6, 'label': '<<cấp token>>'}
        ]
    )

    # UC04: Quên & Đặt lại mật khẩu
    create_single_uc("uc_04_reset_pwd.png", "USE CASE 04: QUÊN & ĐẶT LẠI MẬT KHẨU",
        actor_left={'name': 'Người dùng\n(User)', 'color': '#059669'}, actor_right=None,
        main_uc={'text': 'UC04: Quên & Đặt lại mật khẩu\n(Forgot & Reset Password)', 'w': 3.8, 'h': 0.9, 'bg': '#f8fafc', 'edge': '#64748b'},
        sub_ucs=[
            {'x': 4.5, 'y': 4.2, 'text': 'Sinh token bảo mật SHA-256\n(Thời hạn 15 phút)', 'w': 3.4, 'h': 0.8,
             'from_x': 4.5, 'from_y': 3.15, 'to_x': 4.5, 'to_y': 3.8, 'label': '<<tạo token>>'},
            {'x': 4.5, 'y': 1.2, 'text': 'Cập nhật mật khẩu băm mới\n(Bcrypt Hash 10 rounds)', 'w': 3.4, 'h': 0.8,
             'from_x': 4.5, 'from_y': 2.25, 'to_x': 4.5, 'to_y': 1.6, 'label': '<<đổi mật khẩu>>'}
        ]
    )

    # UC05: Quản lý hồ sơ & Bio
    create_single_uc("uc_05_profile.png", "USE CASE 05: QUẢN LÝ HỒ SƠ CÁ NHÂN & BIO",
        actor_left={'name': 'Người dùng\n(HV / GV)', 'color': '#2563eb'}, actor_right=None,
        main_uc={'text': 'UC05: Quản lý hồ sơ công khai & Bio\n(Update Profile, Avatar, Info)', 'w': 3.8, 'h': 0.9, 'bg': '#eff6ff', 'edge': '#2563eb'},
        sub_ucs=[
            {'x': 4.5, 'y': 1.3, 'text': 'Upload ảnh đại diện Avatar\n(Lưu trữ Cloudinary)', 'w': 3.4, 'h': 0.8,
             'from_x': 4.5, 'from_y': 2.25, 'to_x': 4.5, 'to_y': 1.7, 'label': '<<include>>'}
        ]
    )

    # UC06: Nộp hồ sơ KYC
    create_single_uc("uc_06_upload_kyc.png", "USE CASE 06: NỘP HỒ SƠ MINH CHỨNG KYC",
        actor_left={'name': 'Giảng viên\n(Teacher)', 'color': '#2563eb'}, actor_right=None,
        main_uc={'text': 'UC06: Nộp hồ sơ pháp lý & Bằng cấp\n(CCCD, Bằng ĐH, Thạc sĩ, Chứng chỉ)', 'w': 4.0, 'h': 1.0, 'bg': '#eff6ff', 'edge': '#2563eb'},
        sub_ucs=[
            {'x': 4.5, 'y': 4.3, 'text': 'Upload tệp PDF/JPG lên Cloudinary\n(Lưu TeacherDocs / StudentDocs)', 'w': 3.8, 'h': 0.8,
             'from_x': 4.5, 'from_y': 3.2, 'to_x': 4.5, 'to_y': 3.9, 'label': '<<lưu trữ>>'},
            {'x': 4.5, 'y': 1.2, 'text': 'Chuyển trạng thái sang pending\n(Chờ Admin thẩm định)', 'w': 3.6, 'h': 0.8,
             'from_x': 4.5, 'from_y': 2.2, 'to_x': 4.5, 'to_y': 1.6, 'label': '<<cập nhật>>'}
        ]
    )

    # UC07: Admin duyệt KYC
    create_single_uc("uc_07_review_kyc.png", "USE CASE 07: THẨM ĐỊNH & PHÊ DUYỆT HỒ SƠ KYC",
        actor_left={'name': 'Quản trị viên\n(Admin)', 'color': '#e11d48'}, actor_right={'name': 'Giảng viên\n(Teacher)', 'color': '#2563eb'},
        main_uc={'text': 'UC07: Thẩm định hồ sơ năng lực KYC\n(Xem tài liệu Cloudinary & Ra quyết định)', 'w': 4.0, 'h': 1.0, 'bg': '#fee2e2', 'edge': '#dc2626'},
        sub_ucs=[
            {'x': 4.5, 'y': 4.3, 'text': 'Quyết định: Approved / Reupload / Rejected', 'w': 3.8, 'h': 0.8,
             'from_x': 4.5, 'from_y': 3.2, 'to_x': 4.5, 'to_y': 3.9, 'label': '<<lựa chọn>>'},
            {'x': 4.5, 'y': 1.2, 'text': 'Gửi nhận xét Remarks & Thông báo kết quả', 'w': 3.8, 'h': 0.8,
             'from_x': 4.5, 'from_y': 2.2, 'to_x': 4.5, 'to_y': 1.6, 'label': '<<thông báo>>'}
        ]
    )

    # UC08: Khám phá & Tìm kiếm khóa học
    create_single_uc("uc_08_explore_course.png", "USE CASE 08: TÌM KIẾM & KHÁM PHÁ KHÓA HỌC",
        actor_left={'name': 'Học viên\n(Student)', 'color': '#059669'}, actor_right=None,
        main_uc={'text': 'UC08: Khám phá & Tìm kiếm khóa học\n(Explore & Filter Courses)', 'w': 3.8, 'h': 0.9, 'bg': '#ecfdf5', 'edge': '#10b981'},
        sub_ucs=[
            {'x': 4.5, 'y': 4.2, 'text': 'Bộ lọc 3 tầng: Cấp học → Lớp → Môn', 'w': 3.6, 'h': 0.8,
             'from_x': 4.5, 'from_y': 3.15, 'to_x': 4.5, 'to_y': 3.8, 'label': '<<lọc>>'},
            {'x': 4.5, 'y': 1.2, 'text': 'Xem giáo trình (Syllabus) & Thông tin GV', 'w': 3.6, 'h': 0.8,
             'from_x': 4.5, 'from_y': 2.25, 'to_x': 4.5, 'to_y': 1.6, 'label': '<<chi tiết>>'}
        ]
    )

    # UC09: Đăng ký & Thanh toán Razorpay
    create_single_uc("uc_09_payment_enroll.png", "USE CASE 09: ĐĂNG KÝ KHÓA HỌC & THANH TOÁN",
        actor_left={'name': 'Học viên\n(Student)', 'color': '#059669'}, actor_right={'name': 'Cổng Razorpay\n(Gateway)', 'color': '#ca8a04'},
        main_uc={'text': 'UC09: Đăng ký & Thanh toán học phí\n(Enroll & Razorpay Payment)', 'w': 3.8, 'h': 0.9, 'bg': '#ecfdf5', 'edge': '#10b981'},
        sub_ucs=[
            {'x': 4.5, 'y': 4.2, 'text': 'Đối soát chữ ký HMAC-SHA256\n(Lưu giao dịch bảng Payment)', 'w': 3.6, 'h': 0.8,
             'from_x': 4.5, 'from_y': 3.15, 'to_x': 4.5, 'to_y': 3.8, 'label': '<<xác thực>>'},
            {'x': 4.5, 'y': 1.2, 'text': 'Ký quỹ học phí an toàn (Escrow)\n(Ghi danh học viên vào khóa)', 'w': 3.6, 'h': 0.8,
             'from_x': 4.5, 'from_y': 2.25, 'to_x': 4.5, 'to_y': 1.6, 'label': '<<ký quỹ>>'}
        ]
    )

    # UC10: Khởi tạo đề cương khóa học
    create_single_uc("uc_10_create_course.png", "USE CASE 10: KHỞI TẠO ĐỀ CƯƠNG KHÓA HỌC",
        actor_left={'name': 'Giảng viên\n(Teacher)', 'color': '#2563eb'}, actor_right=None,
        main_uc={'text': 'UC10: Biên soạn & Quản lý khóa học\n(Syllabus, Outcomes, Phân cấp, Học phí)', 'w': 4.0, 'h': 1.0, 'bg': '#eff6ff', 'edge': '#2563eb'},
        sub_ucs=[
            {'x': 4.5, 'y': 1.3, 'text': 'Gửi yêu cầu xuất bản lên Quản trị viên\n(Chờ Admin phê duyệt isapproved)', 'w': 3.8, 'h': 0.8,
             'from_x': 4.5, 'from_y': 2.2, 'to_x': 4.5, 'to_y': 1.7, 'label': '<<gửi duyệt>>'}
        ]
    )

    # UC11: Admin duyệt phát hành khóa học
    create_single_uc("uc_11_approve_course.png", "USE CASE 11: PHÊ DUYỆT PHÁT HÀNH KHÓA HỌC",
        actor_left={'name': 'Quản trị viên\n(Admin)', 'color': '#e11d48'}, actor_right={'name': 'Giảng viên\n(Teacher)', 'color': '#2563eb'},
        main_uc={'text': 'UC11: Thẩm định & Duyệt xuất bản khóa\n(isapproved = true / false)', 'w': 3.8, 'h': 0.9, 'bg': '#fee2e2', 'edge': '#dc2626'},
        sub_ucs=[
            {'x': 4.5, 'y': 1.3, 'text': 'Xuất bản khóa học lên trang tìm kiếm\n(Gửi thông báo phê duyệt tới GV)', 'w': 3.8, 'h': 0.8,
             'from_x': 4.5, 'from_y': 2.25, 'to_x': 4.5, 'to_y': 1.7, 'label': '<<công khai>>'}
        ]
    )

    # UC12: Khởi tạo lớp học trực tuyến
    create_single_uc("uc_12_create_class.png", "USE CASE 12: KHỞI TẠO LỚP HỌC TRỰC TUYẾN",
        actor_left={'name': 'Giảng viên\n(Teacher)', 'color': '#2563eb'}, actor_right=None,
        main_uc={'text': 'UC12: Tạo lớp học trực tuyến mới\n(Nhóm tối đa 20 / 1-kèm-1 tối đa 1)', 'w': 3.8, 'h': 0.9, 'bg': '#eff6ff', 'edge': '#2563eb'},
        sub_ucs=[
            {'x': 4.5, 'y': 4.2, 'text': 'Tự động sinh mã duy nhất classCode\n(EP-GRP-xxxx / EP-1ON1-xxxx)', 'w': 3.6, 'h': 0.8,
             'from_x': 4.5, 'from_y': 3.15, 'to_x': 4.5, 'to_y': 3.8, 'label': '<<tự sinh>>'},
            {'x': 4.5, 'y': 1.2, 'text': 'Thiết lập thời khóa biểu tuần (WeeklySchedule)', 'w': 3.6, 'h': 0.8,
             'from_x': 4.5, 'from_y': 2.25, 'to_x': 4.5, 'to_y': 1.6, 'label': '<<lập lịch>>'}
        ]
    )

    # UC13: Lập lịch & Tham gia học Live
    create_single_uc("uc_13_live_session.png", "USE CASE 13: LẬP LỊCH & THAM GIA BUỔI HỌC LIVE",
        actor_left={'name': 'Giảng viên\n(Teacher)', 'color': '#2563eb'}, actor_right={'name': 'Học viên\n(Student)', 'color': '#059669'},
        main_uc={'text': 'UC13: Lập lịch & Tham gia phòng học Live\n(Google Meet / WebRTC Room Link)', 'w': 4.0, 'h': 1.0, 'bg': '#eff6ff', 'edge': '#2563eb'},
        sub_ucs=[
            {'x': 4.5, 'y': 1.3, 'text': 'Điểm danh học viên & Ghi nhận thời lượng buổi học', 'w': 3.8, 'h': 0.8,
             'from_x': 4.5, 'from_y': 2.2, 'to_x': 4.5, 'to_y': 1.7, 'label': '<<quản lý>>'}
        ]
    )

    # UC14: Chat lớp học & Chia sẻ file
    create_single_uc("uc_14_chat.png", "USE CASE 14: KÊNH TRAO ĐỔI LỚP HỌC (CHAT)",
        actor_left={'name': 'Học viên\n(Student)', 'color': '#059669'}, actor_right={'name': 'Giảng viên\n(Teacher)', 'color': '#2563eb'},
        main_uc={'text': 'UC14: Gửi tin nhắn & Chia sẻ tài liệu lớp\n(Classroom Chatroom & Attachments)', 'w': 4.0, 'h': 1.0, 'bg': '#ecfdf5', 'edge': '#10b981'},
        sub_ucs=[
            {'x': 4.5, 'y': 1.3, 'text': 'Tải tệp đính kèm học tập lên Cloudinary\n(Lưu vào bản ghi ChatMessage)', 'w': 3.8, 'h': 0.8,
             'from_x': 4.5, 'from_y': 2.2, 'to_x': 4.5, 'to_y': 1.7, 'label': '<<đính kèm>>'}
        ]
    )

    # UC15: Thông báo & Nhắc lịch học
    create_single_uc("uc_15_notifications.png", "USE CASE 15: HỆ THỐNG THÔNG BÁO & NHẮC LỊCH",
        actor_left={'name': 'Bộ quét tự động\n(Scheduler)', 'color': '#64748b'}, actor_right={'name': 'HV / GV\n(Người nhận)', 'color': '#2563eb'},
        main_uc={'text': 'UC15: Quét & Gửi thông báo nhắc lịch học\n(Notification type: class_reminder)', 'w': 4.0, 'h': 1.0, 'bg': '#eff6ff', 'edge': '#3b82f6'},
        sub_ucs=[
            {'x': 4.5, 'y': 1.3, 'text': 'Cập nhật huy hiệu NotificationBell unreadCount', 'w': 3.8, 'h': 0.8,
             'from_x': 4.5, 'from_y': 2.2, 'to_x': 4.5, 'to_y': 1.7, 'label': '<<hiển thị>>'}
        ]
    )

    # UC16: Gửi form hỗ trợ Contact Us
    create_single_uc("uc_16_contact_us.png", "USE CASE 16: GỬI BIỂU MẪU LIÊN HỆ HỖ TRỢ",
        actor_left={'name': 'Khách vãng lai /\nNgười dùng', 'color': '#059669'}, actor_right=None,
        main_uc={'text': 'UC16: Gửi thư yêu cầu hỗ trợ (Contact Us)\n(Họ tên, Email, Tiêu đề, Nội dung)', 'w': 4.0, 'h': 0.9, 'bg': '#ecfdf5', 'edge': '#10b981'},
        sub_ucs=[
            {'x': 4.5, 'y': 1.3, 'text': 'Lưu dữ liệu vào bảng Contact trong cơ sở dữ liệu', 'w': 3.8, 'h': 0.8,
             'from_x': 4.5, 'from_y': 2.25, 'to_x': 4.5, 'to_y': 1.7, 'label': '<<lưu trữ>>'}
        ]
    )

    # UC17: Xử lý hỗ trợ khách hàng
    create_single_uc("uc_17_admin_support.png", "USE CASE 17: TIẾP NHẬN & XỬ LÝ KHIẾU NẠI HỖ TRỢ",
        actor_left={'name': 'Quản trị viên\n(Admin)', 'color': '#e11d48'}, actor_right={'name': 'Người gửi\n(User/Guest)', 'color': '#059669'},
        main_uc={'text': 'UC17: Tiếp nhận & Xử lý thư hỗ trợ\n(Xem hộp thư Contact & Phản hồi)', 'w': 3.8, 'h': 0.9, 'bg': '#fee2e2', 'edge': '#dc2626'},
        sub_ucs=[
            {'x': 4.5, 'y': 1.3, 'text': 'Cập nhật trạng thái "Đã phản hồi / Đã xử lý"', 'w': 3.6, 'h': 0.8,
             'from_x': 4.5, 'from_y': 2.25, 'to_x': 4.5, 'to_y': 1.7, 'label': '<<hoàn tất>>'}
        ]
    )

    # UC18: Học viên nộp form xác nhận hoàn thành
    create_single_uc("uc_18_student_feedback.png", "USE CASE 18: NỘP FORM XÁC NHẬN KẾT THÚC KHÓA HỌC (MỚI)",
        actor_left={'name': 'Học viên\n(Student)', 'color': '#059669'}, actor_right={'name': 'Giảng viên\n(Teacher)', 'color': '#2563eb'},
        main_uc={'text': 'UC18: Nộp form nghiệm thu kết thúc khóa\n(hasCompletedAllLessons, Chuyên cần, Đánh giá GV)', 'w': 4.2, 'h': 1.0, 'bg': '#eff6ff', 'edge': '#2563eb'},
        sub_ucs=[
            {'x': 4.5, 'y': 4.3, 'text': 'Lưu bản ghi CourseCompletionFeedback & Báo cáo sự cố', 'w': 4.0, 'h': 0.8,
             'from_x': 4.5, 'from_y': 3.2, 'to_x': 4.5, 'to_y': 3.9, 'label': '<<lưu form>>'},
            {'x': 4.5, 'y': 1.2, 'text': 'Cập nhật tỷ lệ hoàn thành & Thông báo in-app cho GV', 'w': 4.0, 'h': 0.8,
             'from_x': 4.5, 'from_y': 2.2, 'to_x': 4.5, 'to_y': 1.6, 'label': '<<cập nhật tỷ lệ>>'}
        ]
    )

    # UC19: Giảng viên gửi yêu cầu nghiệm thu
    create_single_uc("uc_19_request_completion.png", "USE CASE 19: THEO DÕI TIẾN ĐỘ & GỬI YÊU CẦU NGHIỆM THU (MỚI)",
        actor_left={'name': 'Giảng viên\n(Teacher)', 'color': '#2563eb'}, actor_right={'name': 'Quản trị viên\n(Admin)', 'color': '#e11d48'},
        main_uc={'text': 'UC19: Gửi yêu cầu nghiệm thu lên Admin\n(Ràng buộc tỷ lệ xác nhận >= 80%)', 'w': 4.0, 'h': 0.9, 'bg': '#eff6ff', 'edge': '#2563eb'},
        sub_ucs=[
            {'x': 4.5, 'y': 1.3, 'text': 'Chuyển trạng thái khóa sang completed_pending', 'w': 3.8, 'h': 0.8,
             'from_x': 4.5, 'from_y': 2.25, 'to_x': 4.5, 'to_y': 1.7, 'label': '<<yêu cầu duyệt>>'}
        ]
    )

    # UC20: Admin duyệt nghiệm thu hoàn thành
    create_single_uc("uc_20_admin_completion.png", "USE CASE 20: PHÊ DUYỆT NGHIỆM THU HOÀN THÀNH KHÓA HỌC (MỚI)",
        actor_left={'name': 'Quản trị viên\n(Admin)', 'color': '#e11d48'}, actor_right={'name': 'Giảng viên\n(Teacher)', 'color': '#2563eb'},
        main_uc={'text': 'UC20: Thẩm định & Phê duyệt nghiệm thu\n(AdminApproved = true, Status: completed)', 'w': 4.0, 'h': 1.0, 'bg': '#fee2e2', 'edge': '#dc2626'},
        sub_ucs=[
            {'x': 4.5, 'y': 4.3, 'text': 'Kiểm tra tỷ lệ học viên & Xem xét phản ánh sự cố', 'w': 3.8, 'h': 0.8,
             'from_x': 4.5, 'from_y': 3.2, 'to_x': 4.5, 'to_y': 3.9, 'label': '<<đối soát>>'},
            {'x': 4.5, 'y': 1.2, 'text': 'Mở khóa 85% học phí vào ví khả dụng Balance của GV', 'w': 4.0, 'h': 0.8,
             'from_x': 4.5, 'from_y': 2.2, 'to_x': 4.5, 'to_y': 1.6, 'label': '<<mở khóa ví>>'}
        ]
    )

    # UC21: Đánh giá sao & Nhận xét
    create_single_uc("uc_21_course_review.png", "USE CASE 21: GỬI ĐÁNH GIÁ SAO & NHẬN XÉT KHÓA HỌC (MỚI)",
        actor_left={'name': 'Học viên\n(Student)', 'color': '#059669'}, actor_right=None,
        main_uc={'text': 'UC21: Gửi đánh giá sao & Nhận xét khóa học\n(Xếp hạng 1-5 sao kèm bình luận CourseReview)', 'w': 4.2, 'h': 1.0, 'bg': '#fefce8', 'edge': '#ca8a04'},
        sub_ucs=[
            {'x': 4.5, 'y': 1.3, 'text': 'Tính lại điểm đánh giá TB (averageRating) của khóa học', 'w': 4.0, 'h': 0.8,
             'from_x': 4.5, 'from_y': 2.2, 'to_x': 4.5, 'to_y': 1.7, 'label': '<<cập nhật rating>>'}
        ]
    )

    # UC22: Giám sát đánh giá xấu & Tạm dừng khóa học
    create_single_uc("uc_22_review_suspension.png", "USE CASE 22: GIÁM SÁT REVIEW XẤU & TẠM DỪNG KHÓA HỌC (MỚI)",
        actor_left={'name': 'Quản trị viên\n(Admin)', 'color': '#e11d48'}, actor_right={'name': 'Giảng viên\n(Teacher)', 'color': '#2563eb'},
        main_uc={'text': 'UC22: Giám sát đánh giá xấu & Tạm dừng / Mở lại\n(Ẩn khóa học, gửi email cảnh báo kỷ luật 48h)', 'w': 4.2, 'h': 1.0, 'bg': '#fff1f2', 'edge': '#e11d48'},
        sub_ucs=[
            {'x': 4.5, 'y': 4.3, 'text': 'Tự động gắn cờ isBadReview khi điểm đánh giá <= 2 sao', 'w': 4.0, 'h': 0.8,
             'from_x': 4.5, 'from_y': 3.2, 'to_x': 4.5, 'to_y': 3.9, 'label': '<<cảnh báo>>'},
            {'x': 4.5, 'y': 1.2, 'text': 'Mở lại khóa học (unsuspend) sau khi giải trình hợp lệ', 'w': 4.0, 'h': 0.8,
             'from_x': 4.5, 'from_y': 2.2, 'to_x': 4.5, 'to_y': 1.6, 'label': '<<khôi phục>>'}
        ]
    )

    # UC23: Quản trị tài khoản người dùng
    create_single_uc("uc_23_user_moderation.png", "USE CASE 23: QUẢN TRỊ TÀI KHOẢN NGƯỜI DÙNG & KỶ LUẬT (MỚI)",
        actor_left={'name': 'Quản trị viên\n(Admin)', 'color': '#e11d48'}, actor_right={'name': 'Người dùng\n(User)', 'color': '#475569'},
        main_uc={'text': 'UC23: Điều chỉnh trạng thái tài khoản\n(Active, Suspended, Banned)', 'w': 3.8, 'h': 0.9, 'bg': '#fee2e2', 'edge': '#dc2626'},
        sub_ucs=[
            {'x': 4.5, 'y': 1.3, 'text': 'Bắt buộc nhập lý do statusReason & Gửi email kỷ luật', 'w': 4.0, 'h': 0.8,
             'from_x': 4.5, 'from_y': 2.25, 'to_x': 4.5, 'to_y': 1.7, 'label': '<<thông báo>>'}
        ]
    )

    # UC24: Tạo yêu cầu rút tiền
    create_single_uc("uc_24_withdrawal_request.png", "USE CASE 24: TẠO YÊU CẦU RÚT TIỀN THÙ LAO (MỚI)",
        actor_left={'name': 'Giảng viên\n(Teacher)', 'color': '#2563eb'}, actor_right=None,
        main_uc={'text': 'UC24: Tạo yêu cầu rút tiền về tài khoản ngân hàng\n(Ràng buộc nghiệm thu Admin duyệt + HV >= 80%)', 'w': 4.2, 'h': 1.0, 'bg': '#eff6ff', 'edge': '#2563eb'},
        sub_ucs=[
            {'x': 4.5, 'y': 1.3, 'text': 'Nhập STK, Ngân hàng, Chủ tài khoản → Tạo WithdrawalRequest pending', 'w': 4.2, 'h': 0.8,
             'from_x': 4.5, 'from_y': 2.2, 'to_x': 4.5, 'to_y': 1.7, 'label': '<<tạo lệnh>>'}
        ]
    )

    # UC25: Quản trị tài chính sàn & Giải ngân
    create_single_uc("uc_25_revenue_payout.png", "USE CASE 25: TÀI CHÍNH SÀN & GIẢI NGÂN RÚT TIỀN (MỚI)",
        actor_left={'name': 'Quản trị viên\n(Admin)', 'color': '#e11d48'}, actor_right={'name': 'Giảng viên\n(Teacher)', 'color': '#2563eb'},
        main_uc={'text': 'UC25: Báo cáo tài chính GMV & Giải ngân chuyển khoản\n(Đối soát ngân hàng, nhập mã giao dịch TXN, trừ số dư ví)', 'w': 4.4, 'h': 1.0, 'bg': '#fdf2f8', 'edge': '#db2777'},
        sub_ucs=[
            {'x': 4.5, 'y': 1.3, 'text': 'Lưu lịch sử WithdrawalHistory & Gửi email giải ngân thành công', 'w': 4.2, 'h': 0.8,
             'from_x': 4.5, 'from_y': 2.2, 'to_x': 4.5, 'to_y': 1.7, 'label': '<<hoàn tất>>'}
        ]
    )

# ------------------------------------------------------------------------------
# BIỂU ĐỒ ERD
# ------------------------------------------------------------------------------
def gen_erd():
    fig, ax = plt.subplots(figsize=(16, 12), dpi=250)
    ax.set_xlim(0, 16)
    ax.set_ylim(0, 12)
    ax.axis('off')

    def draw_entity(x, y, w, h, name, fields, bg='#eff6ff', border='#3b82f6'):
        box = FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.02,rounding_size=0.1",
                             facecolor=bg, edgecolor=border, linewidth=1.8, zorder=2)
        ax.add_patch(box)
        header = FancyBboxPatch((x, y + h - 0.5), w, 0.5, boxstyle="round,pad=0.02,rounding_size=0.1",
                                facecolor=border, edgecolor=border, linewidth=1.8, zorder=3)
        ax.add_patch(header)
        ax.text(x + w/2, y + h - 0.25, name, ha='center', va='center', fontsize=10, fontweight='bold', color='white', zorder=4)
        field_str = "\n".join(fields)
        ax.text(x + 0.15, y + h - 0.7, field_str, ha='left', va='top', fontsize=8, color='#1e293b', zorder=4, family='monospace')

    draw_entity(0.5, 8.5, 3.2, 3.0, "STUDENT", [
        "PK  _id: ObjectId",
        "UK  Email: String",
        "    Firstname, Lastname",
        "    Password: Hash",
        "    accountStatus: Enum (MỚI)",
        "    statusReason: String (MỚI)",
        "FK  Studentdetails -> Docs",
        "    Isapproved, Avatar"
    ], bg='#ecfdf5', border='#10b981')

    draw_entity(0.5, 5.0, 3.2, 2.8, "STUDENT_DOCS", [
        "PK  _id: ObjectId",
        "    Phone, Address",
        "    Highesteducation",
        "    SecondaryMarks, HigherMarks",
        "    Aadhaar, Secondary (Cloud)",
        "    Higher (Cloudinary)"
    ], bg='#f0fdf4', border='#22c55e')

    draw_entity(12.2, 8.5, 3.3, 3.2, "TEACHER", [
        "PK  _id: ObjectId",
        "UK  Email: String",
        "    Firstname, Lastname",
        "    accountStatus: Enum (MỚI)",
        "    statusReason: String (MỚI)",
        "    Balance: Number (Ví khả dụng)",
        "FK  Teacherdetails -> Docs",
        "    WithdrawalHistory: Array"
    ], bg='#eff6ff', border='#3b82f6')

    draw_entity(12.2, 5.0, 3.3, 2.8, "TEACHER_DOCS", [
        "PK  _id: ObjectId",
        "    Phone, Address, Exp",
        "    UGcollege, PGcollege",
        "    UGmarks, PGmarks",
        "    Aadhaar, UG, PG (Cloud)"
    ], bg='#f8fafc', border='#64748b')

    draw_entity(6.0, 8.0, 4.0, 3.7, "COURSE", [
        "PK  _id: ObjectId",
        "    coursename, fees",
        "    status: Enum (Vòng đời - MỚI)",
        "    completionRequest: Object (MỚI)",
        "    suspensionInfo: Object (MỚI)",
        "    ratingStats: Object (MỚI)",
        "FK  enrolledteacher -> Teacher",
        "FK  enrolledStudent -> [Student]",
        "    syllabus, outcomes"
    ], bg='#fefce8', border='#ca8a04')

    draw_entity(6.0, 4.0, 4.0, 3.2, "CLASSROOM", [
        "PK  _id: ObjectId",
        "FK  course -> Course",
        "FK  teacher -> Teacher",
        "FK  students -> [Student]",
        "    className, classCode (UK)",
        "    classType, weeklySchedule",
        "    sessions: [Embedded Sub-doc]"
    ], bg='#fdf2f8', border='#db2777')

    draw_entity(0.5, 0.8, 3.8, 3.3, "COURSE_COMPLETION_FEEDBACK (MỚI)", [
        "PK  _id: ObjectId",
        "FK  courseId -> Course",
        "FK  studentId -> Student",
        "FK  teacherId -> Teacher",
        "    hasCompletedAllLessons: Bool",
        "    attendanceSatisfaction: 1-5",
        "    teachingQualitySatisfaction: 1-5",
        "    issuesReported: String",
        "UK  {courseId, studentId}"
    ], bg='#eff6ff', border='#2563eb')

    draw_entity(4.8, 0.8, 3.4, 2.6, "COURSE_REVIEW (MỚI)", [
        "PK  _id: ObjectId",
        "FK  courseId -> Course",
        "FK  studentId -> Student",
        "FK  teacherId -> Teacher",
        "    rating: 1-5 sao",
        "    comment: String",
        "    isBadReview: Bool (<= 2 sao)",
        "    adminActionTaken: Object"
    ], bg='#fff1f2', border='#e11d48')

    draw_entity(8.7, 0.8, 3.6, 2.6, "WITHDRAWAL_REQUEST (MỚI)", [
        "PK  _id: ObjectId",
        "FK  teacherId -> Teacher",
        "FK  courseId -> Course",
        "    amount: Number (VNĐ)",
        "    bankInfo: {bank, accNo, name}",
        "    status: pending/approved/done",
        "    transactionCode, adminFeedback"
    ], bg='#f5f3ff', border='#8b5cf6')

    draw_entity(12.5, 0.8, 3.0, 2.4, "PAYMENT", [
        "PK  _id: ObjectId",
        "FK  courseID -> Course",
        "FK  studentID -> Student",
        "    razorpay_order_id",
        "    razorpay_payment_id",
        "    razorpay_signature"
    ], bg='#ecfdf5', border='#059669')

    def draw_rel(x1, y1, x2, y2, label=""):
        ax.plot([x1, x2], [y1, y2], color='#475569', linewidth=1.5, linestyle='-')
        if label:
            mx, my = (x1 + x2)/2, (y1 + y2)/2
            ax.text(mx, my, label, fontsize=7, color='#0284c7', fontweight='bold',
                    bbox=dict(boxstyle='square,pad=0.15', facecolor='white', edgecolor='none'))

    draw_rel(2.1, 8.5, 2.1, 7.8, "1 : 1")
    draw_rel(13.8, 8.5, 13.8, 7.8, "1 : 1")
    draw_rel(3.7, 10.0, 6.0, 10.0, "N : N")
    draw_rel(10.0, 10.0, 12.2, 10.0, "1 : N")
    draw_rel(8.0, 8.0, 8.0, 7.2, "1 : N")

    draw_rel(2.4, 4.1, 2.4, 8.5, "1 : N")
    draw_rel(6.0, 9.0, 3.0, 4.1, "1 : N")
    draw_rel(6.5, 3.4, 6.5, 8.0, "1 : N")
    draw_rel(10.5, 3.4, 13.0, 8.5, "1 : N")

    save_fig("erd_diagram.png")

if __name__ == '__main__':
    print("Bắt đầu sinh 27 biểu đồ (1 Tổng quan + 25 Use Case chi tiết + 1 ERD)...")
    gen_uc_overview()
    gen_all_25_ucs()
    gen_erd()
    print("Đã hoàn tất sinh toàn bộ 27 biểu đồ chất lượng cao!")
