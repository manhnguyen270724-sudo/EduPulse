import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import path from "path";
import fs from "fs";
import mongoose from "mongoose";
import { Teacher, Teacherdocs } from "./models/teacher.model.js";
import { student, studentdocs } from "./models/student.model.js";

dotenv.config({ path: "./.env" });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

console.log(`📡 Đang kết nối tới Cloudinary Cloud: [${process.env.CLOUDINARY_NAME}]...`);

const filesToUpload = [
  {
    role: "teacher_1",
    email: "an.nguyen@elearning.vn",
    filePath: path.resolve("../frontend/public/teachers/teacher_1.jpg"),
    publicId: "edupulse/teachers/teacher_nguyen_van_an"
  },
  {
    role: "teacher_2",
    email: "mai.tran@elearning.vn",
    filePath: path.resolve("../frontend/public/teachers/teacher_2.jpg"),
    publicId: "edupulse/teachers/teacher_tran_thi_mai"
  },
  {
    role: "teacher_3",
    email: "long.le@elearning.vn",
    filePath: path.resolve("../frontend/public/teachers/teacher_3.jpg"),
    publicId: "edupulse/teachers/teacher_le_hoang_long"
  },
  {
    role: "teacher_4",
    email: "lan.pham@elearning.vn",
    filePath: path.resolve("../frontend/public/teachers/teacher_4.jpg"),
    publicId: "edupulse/teachers/teacher_pham_thi_lan"
  },
  {
    role: "teacher_5",
    email: "duc.do@elearning.vn",
    filePath: path.resolve("../frontend/public/teachers/teacher_5.jpg"),
    publicId: "edupulse/teachers/teacher_do_minh_duc"
  },
  {
    role: "student",
    email: "student@example.com",
    filePath: path.resolve("../frontend/public/students/student_1.jpg"),
    publicId: "edupulse/students/student_nguyen_van_bao"
  },
  {
    role: "logo",
    email: null,
    filePath: path.resolve("../frontend/public/logo.png"),
    publicId: "edupulse/branding/edupulse_logo"
  }
];

const runUpload = async () => {
  try {
    const uploadedUrls = {};

    for (const item of filesToUpload) {
      if (!fs.existsSync(item.filePath)) {
        console.warn(`⚠️ Không tìm thấy file: ${item.filePath}`);
        continue;
      }

      console.log(`📤 Đang tải lên Cloudinary: ${item.publicId}...`);
      const result = await cloudinary.uploader.upload(item.filePath, {
        public_id: item.publicId,
        overwrite: true,
        resource_type: "image"
      });

      console.log(`✅ Upload thành công: ${result.secure_url}`);
      uploadedUrls[item.role] = result.secure_url;
    }

    // Kết nối MongoDB Atlas và cập nhật trực tiếp vào cơ sở dữ liệu
    console.log("\n🗄️ Đang kết nối tới MongoDB Atlas để lưu đường link Cloudinary...");
    await mongoose.connect(`${process.env.MONGODB_URL}/eLearning`);

    // 1. Cập nhật ảnh cho 5 Giảng viên
    for (let i = 1; i <= 5; i++) {
      const teacherItem = filesToUpload.find(f => f.role === `teacher_${i}`);
      const cloudUrl = uploadedUrls[`teacher_${i}`];
      if (teacherItem && cloudUrl) {
        const updatedTeacher = await Teacher.findOneAndUpdate(
          { Email: teacherItem.email },
          { Avatar: cloudUrl },
          { new: true }
        );

        if (updatedTeacher && updatedTeacher.Teacherdetails) {
          await Teacherdocs.findByIdAndUpdate(updatedTeacher.Teacherdetails, {
            Aadhaar: cloudUrl,
            Secondary: cloudUrl,
            Higher: cloudUrl,
            UG: cloudUrl,
            PG: cloudUrl
          });
        }
        console.log(`✅ Đã cập nhật Avatar Cloudinary cho Giảng viên: ${teacherItem.email}`);
      }
    }

    // 2. Cập nhật ảnh cho Học sinh
    const studentUrl = uploadedUrls["student"];
    if (studentUrl) {
      await student.findOneAndUpdate(
        { Email: "student@example.com" },
        { Avatar: studentUrl },
        { new: true }
      );
      console.log(`✅ Đã cập nhật Avatar Cloudinary cho Học sinh: student@example.com`);
    }

    console.log("\n🎉 HOÀN TẤT TOÀN BỘ VIỆC LƯU TRỮ TRÊN CLOUDINARY & MONGODB ATLAS!");
    console.log(JSON.stringify(uploadedUrls, null, 2));

  } catch (error) {
    console.error("❌ Lỗi khi upload lên Cloudinary:", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

runUpload();
