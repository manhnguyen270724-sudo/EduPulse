# 📚 Tài Liệu Kiến Trúc & Thiết Kế Cơ Sở Dữ Liệu (E-Learning Platform)

Thư mục này chứa toàn bộ tài liệu phân tích chi tiết, thiết kế lược đồ quan hệ thực thể (ERD), thông tin từng trường dữ liệu và các luồng nghiệp vụ tương tác với MongoDB Atlas của dự án **E-Learning Platform**.

---

## 🗂️ Mục Lục Tài Liệu

| Mục | Tên Tài Liệu | Nội dung chính |
| :---: | :--- | :--- |
| **01** | [01. Tổng quan Database](file:///c:/Project/e-Learning-Platform/documents/01-tong-quan-database.md) | Tổng quan công nghệ NoSQL MongoDB, Mongoose ODM, danh sách 8 collections và các đặc điểm kiến trúc. |
| **02** | [02. Biểu đồ quan hệ ERD](file:///c:/Project/e-Learning-Platform/documents/02-bieu-do-quan-he-erd.md) | Biểu đồ Mermaid ERD chi tiết toàn bộ các bảng, các khóa ngoại (`ref`), quan hệ 1-1, 1-N, N-N. |
| **03** | [03. Chi tiết từng bảng](file:///c:/Project/e-Learning-Platform/documents/03-chi-tiet-cac-bang.md) | Bảng tra cứu từng trường dữ liệu, kiểu dữ liệu, ràng buộc validation, index, pre-save hooks và methods. |
| **04** | [04. Luồng nghiệp vụ dữ liệu](file:///c:/Project/e-Learning-Platform/documents/04-luong-nghiep-vu-du-lieu.md) | Biểu đồ tuần tự (Sequence diagrams) mô tả luồng Đăng ký & Duyệt hồ sơ KYC, Thanh toán Razorpay, Lớp học trực tuyến. |

---

## 🚀 Tóm tắt Nhanh Cấu trúc Thực thể

```text
[Quản trị viên]  (admins)
      │
      ├──> Xét duyệt (Isapproved) ──> [Giảng viên] (teachers) ──(1-1)──> [Hồ sơ bằng cấp] (teacherdocs)
      │                                      │
      │                                      ├──> Xuất bản (1-N) ──> [Khóa học & Lớp Live] (courses)
      │                                      │                               ▲
      │                                      │                               │ (Mua khóa học)
      │                                      ▼                               │
      └──> Xét duyệt (Isapproved) ──> [Học viên] (students)  ────(Giao dịch)───┴──> [Nhật ký Thanh toán] (payments)
                                             │
                                             └──(1-1)──> [Hồ sơ cá nhân / CCCD] (studentdocs)
```

---

> [!TIP]
> Bạn có thể mở trực tiếp các file `.md` trong thư mục [documents/](file:///c:/Project/e-Learning-Platform/documents) bằng VS Code và nhấn tổ hợp phím `Ctrl + Shift + V` để xem bản vẽ biểu đồ trực quan dưới dạng đồ họa đẹp mắt!
