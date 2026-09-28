# 📚 Tài Liệu Kiến Trúc & Thiết Kế Cơ Sở Dữ Liệu (E-Learning Platform)

Thư mục này chứa toàn bộ tài liệu phân tích chi tiết, thiết kế lược đồ quan hệ thực thể (ERD), thông tin từng trường dữ liệu và các luồng nghiệp vụ tương tác với MongoDB Atlas của dự án **E-Learning Platform**.

---

## 🗂️ Mục Lục Tài Liệu

| Mục | Tên Tài Liệu | Nội dung chính |
| :---: | :--- | :--- |
| **00A** | [🎯 Sơ đồ ngữ cảnh HTML (Trực quan)](file:///c:/Project/e-Learning-Platform/documents/so-do-ngu-canh.html) | **Sơ đồ tương tác DFD Mức 0 đồ họa tương tác**, tích hợp bộ lọc, ma trận 41 chức năng & ảnh AI (Mở bằng trình duyệt). |
| **00B** | [🖼️ Ảnh Sơ đồ ngữ cảnh AI (HD)](file:///c:/Project/e-Learning-Platform/documents/so-do-ngu-canh.jpg) | Hình ảnh đồ họa kiến trúc DFD Mức 0 kết xuất bằng AI độ phân giải cao. |
| **01** | [01. Tổng quan Database](file:///c:/Project/e-Learning-Platform/documents/01-tong-quan-database.md) | Tổng quan công nghệ NoSQL MongoDB, Mongoose ODM, danh sách 8 collections và các đặc điểm kiến trúc. |
| **02** | [02. Biểu đồ quan hệ ERD](file:///c:/Project/e-Learning-Platform/documents/02-bieu-do-quan-he-erd.md) | Biểu đồ Mermaid ERD chi tiết toàn bộ các bảng, các khóa ngoại (`ref`), quan hệ 1-1, 1-N, N-N. |
| **03** | [03. Chi tiết từng bảng](file:///c:/Project/e-Learning-Platform/documents/03-chi-tiet-cac-bang.md) | Bảng tra cứu từng trường dữ liệu, kiểu dữ liệu, ràng buộc validation, index, pre-save hooks và methods. |
| **04** | [04. Luồng nghiệp vụ dữ liệu](file:///c:/Project/e-Learning-Platform/documents/04-luong-nghiep-vu-du-lieu.md) | Biểu đồ tuần tự (Sequence diagrams) mô tả luồng Đăng ký & Duyệt hồ sơ KYC, Thanh toán Razorpay, Lớp học trực tuyến. |
| **05** | [05. Lý do, Chức năng & Ngữ cảnh](file:///c:/Project/e-Learning-Platform/documents/05-ly-do-chuc-nang-ngu-canh-du-an.md) | Phân tích bài toán giáo dục, 4 trụ cột EduPulse, phân hệ chức năng và đặc tả luồng ngữ cảnh DFD mức 0. |
| **06** | [06. Thiết kế Layout, Màu sắc & UI/UX](file:///c:/Project/e-Learning-Platform/documents/06-thiet-ke-layout-mau-sac-ui-ux.md) | Bộ nhận diện thương hiệu, Design Tokens, bảng màu Ocean & Pulse, Typography và cấu trúc các màn hình. |
| **07** | [07. Đặc tả Use Case hệ thống](file:///c:/Project/e-Learning-Platform/documents/07-dac-ta-use-case-he-thong.md) | Bảng đặc tả chi tiết toàn bộ các Use Case cho Học viên, Giảng viên và Quản trị viên. |

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
