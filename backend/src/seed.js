import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { admin } from "./models/admin.model.js";
import { Teacher, Teacherdocs } from "./models/teacher.model.js";
import { student } from "./models/student.model.js";
import { course } from "./models/course.model.js";

dotenv.config({ path: "./.env" });

const seedData = async () => {
    try {
        console.log("Connecting to MongoDB Atlas...");
        await mongoose.connect(`${process.env.MONGODB_URL}/eLearning`);
        console.log("Connected successfully to DB: eLearning");

        // 1. Reset các bảng giáo viên và khóa học cũ
        console.log("🧹 Xóa toàn bộ dữ liệu giáo viên và khóa học cũ...");
        await course.deleteMany({});
        await Teacher.deleteMany({});
        await Teacherdocs.deleteMany({});

        // 2. Tạo hoặc giữ lại tài khoản Admin
        const existingAdmin = await admin.findOne({ username: "admin" });
        if (!existingAdmin) {
            await admin.create({
                username: "admin",
                password: "adminPassword123"
            });
            console.log("✅ Đã tạo tài khoản Admin: admin / adminPassword123");
        }

        // 3. Tạo tài khoản Học sinh mẫu
        const existingStudent = await student.findOne({ Email: "student@example.com" });
        const studentAvatarUrl = "https://res.cloudinary.com/elearning-platform-vn/image/upload/v1789924694/edupulse/students/student_nguyen_van_bao.jpg";
        if (!existingStudent) {
            await student.create({
                Email: "student@example.com",
                Firstname: "Bao",
                Lastname: "Nguyen",
                Password: "password123",
                Avatar: studentAvatarUrl,
                Isverified: true,
                Isapproved: "approved"
            });
            console.log("✅ Đã tạo tài khoản Học sinh: student@example.com / password123");
        } else {
            await student.updateOne({ Email: "student@example.com" }, { Avatar: studentAvatarUrl });
        }

        // 4. Danh sách Giảng viên Việt Nam AI với đầy đủ thông tin phân loại 3 tầng
        const teachersData = [
            {
                firstname: "An",
                lastname: "Nguyen Van",
                email: "an.nguyen@elearning.vn",
                subject: "math",
                educationLevel: "highschool",
                grade: "12",
                subjectName: "Toán Học 12 & Luyện Thi THPT Quốc Gia",
                avatar: "https://res.cloudinary.com/elearning-platform-vn/image/upload/v1789924688/edupulse/teachers/teacher_nguyen_van_an.jpg",
                courseTitle: "Toán Học Cao Cấp & Luyện Thi THPT Quốc Gia",
                courseDesc: "Khóa học chuyên sâu về Giải tích, Hình học không gian và Đại số tổ hợp từ Thầy Nguyễn Văn An.",
                bio: "Tiến sĩ Toán học với hơn 15 năm kinh nghiệm giảng dạy tại ĐH Sư Phạm Hà Nội và luyện thi THPT Quốc Gia môn Toán cho hàng ngàn học sinh đạt điểm 9+.",
                certificates: ["Tiến sĩ Toán học - ĐHQGHN", "Giáo viên dạy giỏi cấp Quốc gia", "Chứng chỉ Sư phạm Quốc tế Cambridge"],
                outcomes: [
                    "Nắm vững 100% chuyên đề Hàm số, Mũ - Logarit, Hình học không gian",
                    "Làm chủ phương pháp giải nhanh trắc nghiệm 30s/câu",
                    "Tự tin đạt điểm 8.5+ trong kỳ thi tốt nghiệp THPT và ĐGNL"
                ],
                prerequisites: "Học sinh lớp 11 lên 12 hoặc thí sinh ôn thi tốt nghiệp THPT.",
                syllabus: [
                    { chapter: "Chương 1", content: "Tính đơn điệu và Cực trị của hàm số" },
                    { chapter: "Chương 2", content: "Hàm số Mũ, Lũy thừa và Logarit nâng cao" },
                    { chapter: "Chương 3", content: "Phương pháp Tọa độ hóa trong Hình học không gian" },
                    { chapter: "Chương 4", content: "Nguyên hàm, Tích phân và Ứng dụng thực tế" }
                ],
                docs: {
                    Phone: 901234501,
                    Address: "Cầu Giấy, Hà Nội",
                    Experience: 15,
                    SecondarySchool: "THCS Chu Văn An - Hà Nội",
                    HigherSchool: "THPT Chuyên Hà Nội - Amsterdam",
                    UGcollege: "Đại học Sư Phạm Hà Nội (Khoa Toán - Tin)",
                    PGcollege: "Đại học Quốc gia Hà Nội (Tiến sĩ Toán học)",
                    SecondaryMarks: 9,
                    HigherMarks: 9,
                    UGmarks: 9,
                    PGmarks: 9,
                    Aadhaar: "https://res.cloudinary.com/elearning-platform-vn/image/upload/v1789924688/edupulse/teachers/teacher_nguyen_van_an.jpg",
                    Secondary: "https://res.cloudinary.com/elearning-platform-vn/image/upload/v1789924688/edupulse/teachers/teacher_nguyen_van_an.jpg",
                    Higher: "https://res.cloudinary.com/elearning-platform-vn/image/upload/v1789924688/edupulse/teachers/teacher_nguyen_van_an.jpg",
                    UG: "https://res.cloudinary.com/elearning-platform-vn/image/upload/v1789924688/edupulse/teachers/teacher_nguyen_van_an.jpg",
                    PG: "https://res.cloudinary.com/elearning-platform-vn/image/upload/v1789924688/edupulse/teachers/teacher_nguyen_van_an.jpg"
                }
            },
            {
                firstname: "Mai",
                lastname: "Tran Thi",
                email: "mai.tran@elearning.vn",
                subject: "physics",
                educationLevel: "highschool",
                grade: "11",
                subjectName: "Vật Lý 11 Cơ Bản & Thí Nghiệm Ảo",
                avatar: "https://res.cloudinary.com/elearning-platform-vn/image/upload/v1789924689/edupulse/teachers/teacher_tran_thi_mai.jpg",
                courseTitle: "Vật Lý Ứng Dụng & Cơ Học Lượng Tử",
                courseDesc: "Khám phá thế giới vật lý thực nghiệm, sóng ánh sáng, quang học và kỹ năng giải bài tập trắc nghiệm nhanh.",
                bio: "Thạc sĩ Vật Lý - ĐHKHTN Hà Nội, hơn 10 năm kinh nghiệm bồi dưỡng học sinh giỏi và luyện thi THPT. Chuyên gia về phương pháp học Vật lý qua mô phỏng 3D trực quan.",
                certificates: ["Thạc sĩ Vật lý thực nghiệm", "Chứng chỉ giảng dạy STEM Quốc tế", "Giải Nhì Giáo viên dạy giỏi Hà Nội"],
                outcomes: [
                    "Làm chủ toàn bộ phần Điện trường, Dòng điện không đổi và Cảm ứng điện từ",
                    "Hiểu bản chất vật lý qua mô hình thực nghiệm và mô phỏng 3D",
                    "Tối ưu tốc độ bấm máy tính và kỹ thuật loại trừ đáp án nhanh"
                ],
                prerequisites: "Nắm vững kiến thức Vật lý cơ bản lớp 10.",
                syllabus: [
                    { chapter: "Chương 1", content: "Điện tích, Định luật Coulomb và Cường độ điện trường" },
                    { chapter: "Chương 2", content: "Dòng điện không đổi và Định luật Ôm cho toàn mạch" },
                    { chapter: "Chương 3", content: "Từ trường, Lực từ và Cảm ứng điện từ" },
                    { chapter: "Chương 4", content: "Khúc xạ ánh sáng và bài toán Thấu kính mỏng" }
                ],
                docs: {
                    Phone: 901234502,
                    Address: "Thanh Xuân, Hà Nội",
                    Experience: 10,
                    SecondarySchool: "THCS Lương Thế Vinh",
                    HigherSchool: "THPT Chuyên Khoa Học Tự Nhiên",
                    UGcollege: "ĐH Khoa Học Tự Nhiên - ĐHQGHN",
                    PGcollege: "Đại học Quốc gia Hà Nội (Thạc sĩ Vật Lý)",
                    SecondaryMarks: 9,
                    HigherMarks: 9,
                    UGmarks: 9,
                    PGmarks: 9,
                    Aadhaar: "https://res.cloudinary.com/elearning-platform-vn/image/upload/v1789924689/edupulse/teachers/teacher_tran_thi_mai.jpg",
                    Secondary: "https://res.cloudinary.com/elearning-platform-vn/image/upload/v1789924689/edupulse/teachers/teacher_tran_thi_mai.jpg",
                    Higher: "https://res.cloudinary.com/elearning-platform-vn/image/upload/v1789924689/edupulse/teachers/teacher_tran_thi_mai.jpg",
                    UG: "https://res.cloudinary.com/elearning-platform-vn/image/upload/v1789924689/edupulse/teachers/teacher_tran_thi_mai.jpg",
                    PG: "https://res.cloudinary.com/elearning-platform-vn/image/upload/v1789924689/edupulse/teachers/teacher_tran_thi_mai.jpg"
                }
            },
            {
                firstname: "Long",
                lastname: "Le Hoang",
                email: "long.le@elearning.vn",
                subject: "chemistry",
                educationLevel: "secondary",
                grade: "9",
                subjectName: "Hóa Học 9 Cơ Bản & Ôn Thi Vào 10",
                avatar: "https://res.cloudinary.com/elearning-platform-vn/image/upload/v1789924691/edupulse/teachers/teacher_le_hoang_long.jpg",
                courseTitle: "Hóa Học Hữu Cơ & Hóa Lý Hiện Đại",
                courseDesc: "Học Hóa không áp lực với phương pháp sơ đồ tư duy phản ứng và phân tích phổ cấu trúc phân tử.",
                bio: "Tiến sĩ Hóa học ĐH Bách Khoa TP.HCM, đam mê truyền lửa tình yêu khoa học cho học sinh với phương pháp học thông qua sơ đồ tư duy phản ứng.",
                certificates: ["Tiến sĩ Kỹ thuật Hóa học - ĐH Bách Khoa TP.HCM", "Chứng chỉ Sư phạm Tích cực", "Tác giả sách Cẩm nang Hóa học THCS"],
                outcomes: [
                    "Nắm chắc tính chất hóa học của các hợp chất vô cơ và hữu cơ lớp 9",
                    "Kỹ năng cân bằng phản ứng và tính toán nồng độ mol thành thạo",
                    "Đạt điểm tối đa phần Hóa học trong kỳ thi tuyển sinh vào lớp 10"
                ],
                prerequisites: "Học sinh lớp 8 lên lớp 9 có nguyện vọng củng cố kiến thức Hóa.",
                syllabus: [
                    { chapter: "Chương 1", content: "Các loại hợp chất vô cơ: Oxit, Axit, Bazo, Muối" },
                    { chapter: "Chương 2", content: "Kim loại và Dãy hoạt động hóa học" },
                    { chapter: "Chương 3", content: "Phi kim, Bảng tuần hoàn các nguyên tố hóa học" },
                    { chapter: "Chương 4", content: "Sơ lược về Hóa học hữu cơ: Metan, Etilen, Rượu etylic" }
                ],
                docs: {
                    Phone: 901234503,
                    Address: "Quận 1, TP. Hồ Chí Minh",
                    Experience: 8,
                    SecondarySchool: "THCS Trần Đại Nghĩa - TP.HCM",
                    HigherSchool: "THPT Chuyên Lê Hồng Phong - TP.HCM",
                    UGcollege: "Đại học Bách Khoa TP.HCM (Kỹ thuật Hóa học)",
                    PGcollege: "Đại học Bách Khoa TP.HCM (Tiến sĩ Hóa học)",
                    SecondaryMarks: 9,
                    HigherMarks: 9,
                    UGmarks: 9,
                    PGmarks: 9,
                    Aadhaar: "https://res.cloudinary.com/elearning-platform-vn/image/upload/v1789924691/edupulse/teachers/teacher_le_hoang_long.jpg",
                    Secondary: "https://res.cloudinary.com/elearning-platform-vn/image/upload/v1789924691/edupulse/teachers/teacher_le_hoang_long.jpg",
                    Higher: "https://res.cloudinary.com/elearning-platform-vn/image/upload/v1789924691/edupulse/teachers/teacher_le_hoang_long.jpg",
                    UG: "https://res.cloudinary.com/elearning-platform-vn/image/upload/v1789924691/edupulse/teachers/teacher_le_hoang_long.jpg",
                    PG: "https://res.cloudinary.com/elearning-platform-vn/image/upload/v1789924691/edupulse/teachers/teacher_le_hoang_long.jpg"
                }
            },
            {
                firstname: "Lan",
                lastname: "Pham Thi",
                email: "lan.pham@elearning.vn",
                subject: "biology",
                educationLevel: "highschool",
                grade: "10",
                subjectName: "Sinh Học 10 - Sinh Học Tế Bào",
                avatar: "https://res.cloudinary.com/elearning-platform-vn/image/upload/v1789924692/edupulse/teachers/teacher_pham_thi_lan.jpg",
                courseTitle: "Sinh Học Tế Bào & Công Nghệ Di Truyền",
                courseDesc: "Khám phá quy luật di truyền Mendel, cấu trúc DNA/RNA và ứng dụng công nghệ sinh học trong y học hiện đại.",
                bio: "Thạc sĩ Sinh học ĐH Sư Phạm TP.HCM, 12 năm kinh nghiệm giảng dạy môn Sinh học các trường chuyên, cựu giải Nhất HSG Quốc gia Sinh học.",
                certificates: ["Thạc sĩ Sinh học phân tử", "Chứng chỉ Giáo dục Sáng tạo Microsoft MIE", "Giải thưởng Nhà giáo trẻ tiêu biểu"],
                outcomes: [
                    "Hiểu sâu cấu tạo và chức năng của tế bào nhân thực & nhân sơ",
                    "Nắm vững quá trình Nguyên phân, Giảm phân và Chu kỳ tế bào",
                    "Rèn luyện tư duy logic khoa học sự sống và bài tập di truyền"
                ],
                prerequisites: "Học sinh lớp 10 THPT theo chương trình GDPT mới.",
                syllabus: [
                    { chapter: "Chương 1", content: "Thành phần hóa học của tế bào: Protein, Lipit, Axit Nucleic" },
                    { chapter: "Chương 2", content: "Cấu trúc tế bào: Màng sinh chất và các bào quan" },
                    { chapter: "Chương 3", content: "Chuyển hóa vật chất và năng lượng trong tế bào" },
                    { chapter: "Chương 4", content: "Chu kỳ tế bào, Nguyên phân và Giảm phân" }
                ],
                docs: {
                    Phone: 901234504,
                    Address: "Hải Châu, Đà Nẵng",
                    Experience: 12,
                    SecondarySchool: "THCS Trưng Vương - Đà Nẵng",
                    HigherSchool: "THPT Chuyên Lê Quý Đôn - Đà Nẵng",
                    UGcollege: "Đại học Sư Phạm TP.HCM (Sư phạm Sinh)",
                    PGcollege: "Đại học Khoa Học Tự Nhiên TP.HCM (Thạc sĩ Sinh học)",
                    SecondaryMarks: 10,
                    HigherMarks: 10,
                    UGmarks: 9,
                    PGmarks: 9,
                    Aadhaar: "https://res.cloudinary.com/elearning-platform-vn/image/upload/v1789924692/edupulse/teachers/teacher_pham_thi_lan.jpg",
                    Secondary: "https://res.cloudinary.com/elearning-platform-vn/image/upload/v1789924692/edupulse/teachers/teacher_pham_thi_lan.jpg",
                    Higher: "https://res.cloudinary.com/elearning-platform-vn/image/upload/v1789924692/edupulse/teachers/teacher_pham_thi_lan.jpg",
                    UG: "https://res.cloudinary.com/elearning-platform-vn/image/upload/v1789924692/edupulse/teachers/teacher_pham_thi_lan.jpg",
                    PG: "https://res.cloudinary.com/elearning-platform-vn/image/upload/v1789924692/edupulse/teachers/teacher_pham_thi_lan.jpg"
                }
            },
            {
                firstname: "Duc",
                lastname: "Do Minh",
                email: "duc.do@elearning.vn",
                subject: "computer",
                educationLevel: "university",
                grade: "",
                subjectName: "Lập Trình Web Fullstack & Cloud",
                avatar: "https://res.cloudinary.com/elearning-platform-vn/image/upload/v1789924693/edupulse/teachers/teacher_do_minh_duc.jpg",
                courseTitle: "Lập Trình Web Fullstack (MERN) & Kiến Trúc Cloud",
                courseDesc: "Làm chủ JavaScript hiện đại, React, Node.js, Express, MongoDB và triển khai ứng dụng trên nền tảng AWS / Vercel.",
                bio: "Senior Software Architect tại các tập đoàn công nghệ lớn, cựu giảng viên ĐHBK Hà Nội. Chuyên gia React, Node.js, Cloud Computing và Kiến trúc Microservices.",
                certificates: ["AWS Certified Solutions Architect Professional", "Google Cloud Certified Professional Cloud Architect", "Oracle Certified Professional Java SE"],
                outcomes: [
                    "Xây dựng hoàn chỉnh ứng dụng Fullstack từ frontend tới backend",
                    "Thiết kế RESTful API chuẩn mực và quản lý cơ sở dữ liệu MongoDB/PostgreSQL",
                    "Triển khai dự án lên nền tảng Cloud với Docker & CI/CD"
                ],
                prerequisites: "Hiểu biết cơ bản về HTML/CSS và Javascript.",
                syllabus: [
                    { chapter: "Module 1", content: "Kiến trúc Frontend hiện đại với React và Vite" },
                    { chapter: "Module 2", content: "RESTful API với Node.js, Express và MongoDB" },
                    { chapter: "Module 3", content: "Xác thực JWT, Bảo mật và Quản lý State" },
                    { chapter: "Module 4", content: "Container hóa Docker và Deploy hệ thống lên Cloud" }
                ],
                docs: {
                    Phone: 901234505,
                    Address: "Hoàn Kiếm, Hà Nội",
                    Experience: 9,
                    SecondarySchool: "THCS Ngô Sĩ Liên",
                    HigherSchool: "THPT Chu Văn An",
                    UGcollege: "Đại học Bách Khoa Hà Nội (CNTT)",
                    PGcollege: "Đại học Bách Khoa Hà Nội (Thạc sĩ Kỹ thuật Phần mềm)",
                    SecondaryMarks: 9,
                    HigherMarks: 9,
                    UGmarks: 9,
                    PGmarks: 9,
                    Aadhaar: "https://res.cloudinary.com/elearning-platform-vn/image/upload/v1789924693/edupulse/teachers/teacher_do_minh_duc.jpg",
                    Secondary: "https://res.cloudinary.com/elearning-platform-vn/image/upload/v1789924693/edupulse/teachers/teacher_do_minh_duc.jpg",
                    Higher: "https://res.cloudinary.com/elearning-platform-vn/image/upload/v1789924693/edupulse/teachers/teacher_do_minh_duc.jpg",
                    UG: "https://res.cloudinary.com/elearning-platform-vn/image/upload/v1789924693/edupulse/teachers/teacher_do_minh_duc.jpg",
                    PG: "https://res.cloudinary.com/elearning-platform-vn/image/upload/v1789924693/edupulse/teachers/teacher_do_minh_duc.jpg"
                }
            },
            {
                firstname: "Phuong",
                lastname: "Vo Hoang",
                email: "phuong.vo@elearning.vn",
                subject: "ielts",
                educationLevel: "language",
                grade: "",
                subjectName: "IELTS Masterclass 7.5+ Toàn Diện",
                avatar: "https://res.cloudinary.com/elearning-platform-vn/image/upload/v1789924692/edupulse/teachers/teacher_pham_thi_lan.jpg",
                courseTitle: "Luyện Thi IELTS Chuyên Sâu Band 7.5+ (4 Kỹ Năng)",
                courseDesc: "Khóa học rèn luyện tư duy phản biện học thuật, chiến thuật làm bài Reading/Listening đạt 8.0+ và cấu trúc Writing band cao.",
                bio: "Thạc sĩ Ngôn ngữ Ứng dụng từ ĐH Warwick (Anh Quốc), IELTS 8.5 Overall (Listening 9.0, Reading 9.0). 9 năm kinh nghiệm đào tạo học viên đạt mục tiêu du học và định cư.",
                certificates: ["Thạc sĩ TESOL - University of Warwick", "IELTS 8.5 Overall Certificate", "Chứng chỉ Đào tạo Giảng viên IELTS từ IDP & British Council"],
                outcomes: [
                    "Chiến thuật xử lý 14 dạng bài Reading và kỹ năng nghe bẫy điểm cao",
                    "Phương pháp triển khai ý Writing Task 1 & 2 mạch lạc, từ vựng C1-C2",
                    "Tự tin phát âm chuẩn và phản xạ tự nhiên trong Speaking"
                ],
                prerequisites: "Học viên có trình độ đầu vào tương đương IELTS 5.5 - 6.0.",
                syllabus: [
                    { chapter: "Tuần 1-3", content: "Writing Task 1 & 2: Cấu trúc logic và từ vựng band 8.0" },
                    { chapter: "Tuần 4-6", content: "Speaking Part 1, 2, 3: Phản xạ lưu loát và ngữ điệu tự nhiên" },
                    { chapter: "Tuần 7-9", content: "Listening: Bắt key, dự đoán từ và bẫy phát âm phổ biến" },
                    { chapter: "Tuần 10-12", content: "Reading: Kỹ thuật Skimming, Scanning và Matching Headings" }
                ],
                docs: {
                    Phone: 901234506,
                    Address: "Ninh Kiều, Cần Thơ",
                    Experience: 9,
                    SecondarySchool: "THCS Trưng Vương - Đà Nẵng",
                    HigherSchool: "THPT Chuyên Lê Quý Đôn - Đà Nẵng",
                    UGcollege: "Đại học Ngoại Thương Hà Nội (Kinh tế Đối ngoại)",
                    PGcollege: "University of Warwick, Anh Quốc (Thạc sĩ Ngôn ngữ Ứng dụng)",
                    SecondaryMarks: 10,
                    HigherMarks: 10,
                    UGmarks: 9,
                    PGmarks: 9,
                    Aadhaar: "https://res.cloudinary.com/elearning-platform-vn/image/upload/v1789924692/edupulse/teachers/teacher_pham_thi_lan.jpg",
                    Secondary: "https://res.cloudinary.com/elearning-platform-vn/image/upload/v1789924692/edupulse/teachers/teacher_pham_thi_lan.jpg",
                    Higher: "https://res.cloudinary.com/elearning-platform-vn/image/upload/v1789924692/edupulse/teachers/teacher_pham_thi_lan.jpg",
                    UG: "https://res.cloudinary.com/elearning-platform-vn/image/upload/v1789924692/edupulse/teachers/teacher_pham_thi_lan.jpg",
                    PG: "https://res.cloudinary.com/elearning-platform-vn/image/upload/v1789924692/edupulse/teachers/teacher_pham_thi_lan.jpg"
                }
            },
            {
                firstname: "Hung",
                lastname: "Vu Manh",
                email: "hung.vu@elearning.vn",
                subject: "ai-data",
                educationLevel: "university",
                grade: "",
                subjectName: "Khoa Học Dữ Liệu & AI Ứng Dụng",
                avatar: "https://res.cloudinary.com/elearning-platform-vn/image/upload/v1789924693/edupulse/teachers/teacher_do_minh_duc.jpg",
                courseTitle: "Khoa Học Dữ Liệu & Trí Tuệ Nhân Tạo Ứng Dụng (Data Science & AI)",
                courseDesc: "Lộ trình từ nền tảng Python, Thống kê, Machine Learning đến huấn luyện mạng nơ-ron Deep Learning và triển khai mô hình AI.",
                bio: "Tiến sĩ AI tại NUS Singapore, 11 năm nghiên cứu và triển khai các mô hình Machine Learning & Deep Learning phục vụ phân tích dữ liệu lớn và thị giác máy tính.",
                certificates: ["Tiến sĩ Khoa học Máy tính - NUS Singapore", "TensorFlow Developer Certified", "DeepLearning.AI AI Specialization"],
                outcomes: [
                    "Thành thạo Python phân tích dữ liệu với Pandas, NumPy, Scikit-Learn",
                    "Huấn luyện và tối ưu mô hình Deep Learning (CNN, RNN, Transformer)",
                    "Triển khai mô hình AI thành API phục vụ người dùng thực tế"
                ],
                prerequisites: "Có nền tảng toán đại số tuyến tính cơ bản và lập trình Python.",
                syllabus: [
                    { chapter: "Phần 1", content: "Nền tảng Python, Thống kê và Xử lý dữ liệu lớn" },
                    { chapter: "Phần 2", content: "Machine Learning truyền thống: Phân lớp, Hồi quy, Gom cụm" },
                    { chapter: "Phần 3", content: "Deep Learning với PyTorch: Xử lý ảnh và Xử lý ngôn ngữ tự nhiên" },
                    { chapter: "Phần 4", content: "Xây dựng AI Agent và triển khai mô hình lên production" }
                ],
                docs: {
                    Phone: 901234507,
                    Address: "Sơn Trà, Đà Nẵng",
                    Experience: 11,
                    SecondarySchool: "THCS Chu Văn An",
                    HigherSchool: "THPT Chuyên Khoa Học Tự Nhiên",
                    UGcollege: "Đại học Bách Khoa Hà Nội (Khoa học Máy tính)",
                    PGcollege: "Đại học Quốc gia Singapore - NUS (Tiến sĩ Trí Tuệ Nhân Tạo)",
                    SecondaryMarks: 10,
                    HigherMarks: 10,
                    UGmarks: 10,
                    PGmarks: 10,
                    Aadhaar: "https://res.cloudinary.com/elearning-platform-vn/image/upload/v1789924693/edupulse/teachers/teacher_do_minh_duc.jpg",
                    Secondary: "https://res.cloudinary.com/elearning-platform-vn/image/upload/v1789924693/edupulse/teachers/teacher_do_minh_duc.jpg",
                    Higher: "https://res.cloudinary.com/elearning-platform-vn/image/upload/v1789924693/edupulse/teachers/teacher_do_minh_duc.jpg",
                    UG: "https://res.cloudinary.com/elearning-platform-vn/image/upload/v1789924693/edupulse/teachers/teacher_do_minh_duc.jpg",
                    PG: "https://res.cloudinary.com/elearning-platform-vn/image/upload/v1789924693/edupulse/teachers/teacher_do_minh_duc.jpg"
                }
            },
            {
                firstname: "Thao",
                lastname: "Dang Thu",
                email: "thao.dang@elearning.vn",
                subject: "finance",
                educationLevel: "university",
                grade: "",
                subjectName: "Kinh Tế Lượng & Tài Chính Định Lượng",
                avatar: "https://res.cloudinary.com/elearning-platform-vn/image/upload/v1789924689/edupulse/teachers/teacher_tran_thi_mai.jpg",
                courseTitle: "Kinh Tế Lượng & Quản Trị Tài Chính Định Lượng",
                courseDesc: "Ứng dụng mô hình toán tài chính, phân tích định lượng danh mục đầu tư chứng khoán và quản trị rủi ro thanh khoản ngân hàng.",
                bio: "Thạc sĩ Tài chính Định lượng từ ĐH Melbourne (Úc), chuyên gia phân tích dữ liệu tài chính và quản trị rủi ro danh mục đầu tư tại các quỹ đầu tư lớn.",
                certificates: ["CFA Charterholder (Level III Passed)", "Thạc sĩ Tài chính - University of Melbourne", "FRM - Financial Risk Manager"],
                outcomes: [
                    "Hiểu sâu các mô hình định giá tài sản tài chính CAPM, Fama-French",
                    "Kỹ năng lập trình mô phỏng Monte Carlo trong quản lý rủi ro",
                    "Tối ưu danh mục đầu tư bằng các công cụ định lượng hiện đại"
                ],
                prerequisites: "Kiến thức kinh tế học vi mô và xác suất thống kê cơ bản.",
                syllabus: [
                    { chapter: "Chuyên đề 1", content: "Thị trường tài chính và các công cụ phái sinh" },
                    { chapter: "Chuyên đề 2", content: "Mô hình hồi quy kinh tế lượng và kiểm định giả thuyết" },
                    { chapter: "Chuyên đề 3", content: "Đo lường rủi ro VaR và kiểm tra sức chịu đựng danh mục" },
                    { chapter: "Chuyên đề 4", content: "Ứng dụng Python trong backtest chiến lược giao dịch" }
                ],
                docs: {
                    Phone: 901234508,
                    Address: "Ngũ Hành Sơn, Đà Nẵng",
                    Experience: 8,
                    SecondarySchool: "THCS Lê Thánh Tôn",
                    HigherSchool: "THPT Chuyên Lê Quý Đôn",
                    UGcollege: "Đại học Kinh Tế TP.HCM (Tài chính Doanh nghiệp)",
                    PGcollege: "University of Melbourne, Úc (Thạc sĩ Tài chính Định lượng)",
                    SecondaryMarks: 9,
                    HigherMarks: 9,
                    UGmarks: 9,
                    PGmarks: 9,
                    Aadhaar: "https://res.cloudinary.com/elearning-platform-vn/image/upload/v1789924689/edupulse/teachers/teacher_tran_thi_mai.jpg",
                    Secondary: "https://res.cloudinary.com/elearning-platform-vn/image/upload/v1789924689/edupulse/teachers/teacher_tran_thi_mai.jpg",
                    Higher: "https://res.cloudinary.com/elearning-platform-vn/image/upload/v1789924689/edupulse/teachers/teacher_tran_thi_mai.jpg",
                    UG: "https://res.cloudinary.com/elearning-platform-vn/image/upload/v1789924689/edupulse/teachers/teacher_tran_thi_mai.jpg",
                    PG: "https://res.cloudinary.com/elearning-platform-vn/image/upload/v1789924689/edupulse/teachers/teacher_tran_thi_mai.jpg"
                }
            }
        ];

        for (const t of teachersData) {
            // 4.1 Tạo Teacherdocs
            const createdDocs = await Teacherdocs.create(t.docs);

            // 4.2 Tạo Teacher (với bio và certificates mới)
            const createdTeacher = await Teacher.create({
                Email: t.email,
                Firstname: t.firstname,
                Lastname: t.lastname,
                Password: "password123",
                Avatar: t.avatar,
                Isverified: true,
                Isapproved: "approved",
                Teacherdetails: createdDocs._id,
                Balance: 1500000,
                bio: t.bio || '',
                certificates: t.certificates || [],
                slug: `${t.firstname.toLowerCase()}-${t.lastname.toLowerCase().replace(/\s+/g, '-')}`
            });

            // 4.3 Tạo Khóa học với đầy đủ thông tin phân loại
            await course.create({
                coursename: t.subject,
                description: t.courseDesc,
                isapproved: true,
                enrolledteacher: createdTeacher._id,
                educationLevel: t.educationLevel || 'university',
                grade: t.grade || '',
                subject: t.subjectName || t.subject,
                fees: 0,
                maxStudents: 25,
                startDate: new Date(Date.now() + 7 * 86400000), // 7 ngày sau
                outcomes: t.outcomes || [],
                prerequisites: t.prerequisites || '',
                syllabus: t.syllabus || [],
                liveClasses: [
                    {
                        title: `${t.courseTitle} - Buổi 1: Định hướng & Nền tảng`,
                        timing: 90,
                        date: new Date(Date.now() + 86400000),
                        link: "https://meet.google.com/edu-vietnam-live",
                        status: "upcoming"
                    }
                ],
                schedule: [
                    { day: 1, starttime: 19 * 60, endtime: 21 * 60 },
                    { day: 4, starttime: 19 * 60, endtime: 21 * 60 }
                ]
            });

            console.log(`✅ Đã nạp Giảng viên [${t.lastname} ${t.firstname}] - Cấp: ${t.educationLevel} - Môn: ${t.subjectName}`);
        }

        console.log("\n🎉 HOÀN TẤT CẬP NHẬT TOÀN BỘ ĐỘI NGŨ GIẢNG VIÊN VÀ KHÓA HỌC CHUẨN HÓA!");
    } catch (error) {
        console.error("❌ Lỗi khi nạp dữ liệu:", error);
    } finally {
        await mongoose.disconnect();
        console.log("🔌 Đã ngắt kết nối database.");
        process.exit(0);
    }
};

seedData();
