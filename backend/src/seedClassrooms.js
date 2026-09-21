import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
dns.setDefaultResultOrder("ipv4first");

import mongoose from "mongoose";
import "dotenv/config";
import { Classroom } from "./models/classroom.model.js";
import { course } from "./models/course.model.js";
import { Teacher } from "./models/teacher.model.js";
import { student } from "./models/student.model.js";
import { ChatMessage } from "./models/chatMessage.model.js";
import { Notification } from "./models/notification.model.js";

async function seed() {
  try {
    await mongoose.connect(`${process.env.MONGODB_URL}/${process.env.DB_NAME}`);
    console.log("Connected to MongoDB for seeding classrooms...");

    const teachers = await Teacher.find({});
    const courses = await course.find({});
    const students = await student.find({});

    if (!teachers.length || !courses.length) {
      console.log("No teachers or courses found to seed classrooms.");
      process.exit(0);
    }

    const st1 = students[0]; // Student Tran Van B
    const tAn = teachers.find(t => t.Email === "an.nguyen@elearning.vn") || teachers[0];
    const cMath = courses.find(c => c.coursename === "math") || courses[0];

    const tPhuong = teachers.find(t => t.Email === "phuong.vo@elearning.vn") || teachers[1] || teachers[0];
    const cIelts = courses.find(c => c.coursename === "ielts") || courses[1] || courses[0];

    const tHung = teachers.find(t => t.Email === "hung.vu@elearning.vn") || teachers[2] || teachers[0];
    const cAI = courses.find(c => c.coursename === "ai-data") || courses[2] || courses[0];

    // Xóa classrooms cũ nếu có
    await Classroom.deleteMany({});
    await ChatMessage.deleteMany({});
    await Notification.deleteMany({});
    console.log("Cleared existing classrooms, chats, notifications.");

    const now = new Date();

    // 1. Lớp Toán 12 - Lớp nhóm (Group)
    const tomorrow19h30 = new Date(now);
    tomorrow19h30.setDate(now.getDate() + 1);
    tomorrow19h30.setHours(19, 30, 0, 0);

    const in3Days = new Date(now);
    in3Days.setDate(now.getDate() + 3);
    in3Days.setHours(19, 30, 0, 0);

    const classMathGroup = await Classroom.create({
      course: cMath._id,
      teacher: tAn._id,
      className: "Toán 12 - Lớp Luyện Thi ĐGNL & THPTQG K1",
      classCode: "EP-GRP-MATH01",
      classType: "group",
      maxStudents: 25,
      students: st1 ? [st1._id] : [],
      status: "active",
      description: "Lớp học tiêu chuẩn tập trung chuyên đề Hàm số, Tích phân và Hình không gian Oxyz.",
      weeklySchedule: [
        { dayOfWeek: 2, startTime: "19:30", endTime: "21:00", roomLink: "https://meet.google.com/edu-toan12-live" },
        { dayOfWeek: 5, startTime: "19:30", endTime: "21:00", roomLink: "https://meet.google.com/edu-toan12-live" }
      ],
      sessions: [
        {
          title: "Buổi 1: Tổng ôn Hàm số & Khảo sát sự biến thiên",
          date: tomorrow19h30,
          startTime: "19:30",
          endTime: "21:00",
          timing: 90,
          roomLink: "https://meet.google.com/edu-toan12-live",
          status: "upcoming",
          notes: "Chuẩn bị trước bài tập phần 1 trong tài liệu."
        },
        {
          title: "Buổi 2: Kỹ thuật Casio & Giải nhanh Hình Oxyz",
          date: in3Days,
          startTime: "19:30",
          endTime: "21:00",
          timing: 90,
          roomLink: "https://meet.google.com/edu-toan12-live",
          status: "upcoming",
          notes: "Mang máy tính Casio 580VNX hoặc fx-880."
        }
      ]
    });

    // 2. Lớp Toán 12 - Lớp 1 kèm 1 (One-on-One Tutoring)
    const tonight20h = new Date(now);
    tonight20h.setHours(20, 0, 0, 0);
    if (tonight20h < now) {
      tonight20h.setDate(now.getDate() + 1);
    }

    const classMath1on1 = await Classroom.create({
      course: cMath._id,
      teacher: tAn._id,
      className: "Toán 12 [1 Kèm 1 Gia Sư] - Lộ Trình Cá Nhân Hóa",
      classCode: "EP-1ON1-MATH02",
      classType: "one-on-one",
      maxStudents: 1,
      students: st1 ? [st1._id] : [],
      status: "active",
      description: "Gia sư 1 kèm 1 trực tiếp với Thầy An, khắc phục điểm yếu và rèn phản xạ giải đề điểm 9+.",
      weeklySchedule: [
        { dayOfWeek: 3, startTime: "20:00", endTime: "21:30", roomLink: "https://meet.google.com/edu-toan1on1-live" }
      ],
      sessions: [
        {
          title: "Buổi kèm 1-1: Định hướng mục tiêu & Chẩn đoán lỗ hổng kiến thức",
          date: tonight20h,
          startTime: "20:00",
          endTime: "21:30",
          timing: 90,
          roomLink: "https://meet.google.com/edu-toan1on1-live",
          status: "upcoming",
          notes: "Trao đổi trực tiếp 1-1 qua Google Meet."
        }
      ]
    });

    // 3. Lớp IELTS 7.5+ - Lớp nhóm (Group)
    const dayAfterTomorrow = new Date(now);
    dayAfterTomorrow.setDate(now.getDate() + 2);
    dayAfterTomorrow.setHours(18, 30, 0, 0);

    const classIelts = await Classroom.create({
      course: cIelts._id,
      teacher: tPhuong._id,
      className: "IELTS Masterclass 7.5+ Toàn Diện - Lớp Tối T3-T5",
      classCode: "EP-GRP-IELTS01",
      classType: "group",
      maxStudents: 20,
      students: st1 ? [st1._id] : [],
      status: "active",
      description: "Rèn Writing Task 1-2 từ vựng C1-C2 và phản xạ Speaking tự nhiên theo format mới.",
      weeklySchedule: [
        { dayOfWeek: 2, startTime: "18:30", endTime: "20:00", roomLink: "https://meet.google.com/edu-ielts-live" },
        { dayOfWeek: 4, startTime: "18:30", endTime: "20:00", roomLink: "https://meet.google.com/edu-ielts-live" }
      ],
      sessions: [
        {
          title: "Session 1: Writing Task 2 - Logic triển khai và cấu trúc Idea band 8.0",
          date: dayAfterTomorrow,
          startTime: "18:30",
          endTime: "20:00",
          timing: 90,
          roomLink: "https://meet.google.com/edu-ielts-live",
          status: "upcoming",
          notes: "Nộp bài viết khởi động trước 17:00."
        }
      ]
    });

    // 4. Lớp AI & Data Science - 1 kèm 1 (One-on-One)
    const in4Days = new Date(now);
    in4Days.setDate(now.getDate() + 4);
    in4Days.setHours(19, 0, 0, 0);

    const classAI1on1 = await Classroom.create({
      course: cAI._id,
      teacher: tHung._id,
      className: "AI & Data Science [1 Kèm 1 Mentorship] - Xây dựng AI Agent",
      classCode: "EP-1ON1-AI01",
      classType: "one-on-one",
      maxStudents: 1,
      students: [],
      status: "upcoming",
      description: "Cố vấn 1-1 chuyên sâu cùng TS. Vũ Mạnh Hùng, hướng dẫn triển khai sản phẩm AI thực tế.",
      weeklySchedule: [
        { dayOfWeek: 6, startTime: "19:00", endTime: "20:30", roomLink: "https://meet.google.com/edu-ai-mentor" }
      ],
      sessions: [
        {
          title: "Mentorship Session 1: Setup môi trường PyTorch & Chọn đề tài Capstone Project",
          date: in4Days,
          startTime: "19:00",
          endTime: "20:30",
          timing: 90,
          roomLink: "https://meet.google.com/edu-ai-mentor",
          status: "upcoming"
        }
      ]
    });

    console.log("Created 4 sample classrooms (Group & 1-on-1).");

    // Thêm Chat Messages mẫu cho Lớp Toán 1-1 và Lớp Toán Nhóm
    if (st1) {
      await ChatMessage.create([
        {
          classroom: classMath1on1._id,
          senderId: tAn._id,
          senderType: "teacher",
          senderName: `${tAn.Lastname} ${tAn.Firstname}`,
          senderAvatar: tAn.Avatar,
          content: "Chào em! Thầy đã xem qua mục tiêu luyện thi của em. Buổi học tối nay thầy và em sẽ cùng trao đổi chiến lược giải đề nhé."
        },
        {
          classroom: classMath1on1._id,
          senderId: st1._id,
          senderType: "student",
          senderName: `${st1.Lastname} ${st1.Firstname}`,
          senderAvatar: st1.Avatar,
          content: "Dạ em chào Thầy! Em đã tải file đề cương và chuẩn bị sẵn một số dạng bài em hay bị phân vân rồi ạ."
        },
        {
          classroom: classMathGroup._id,
          senderId: tAn._id,
          senderType: "teacher",
          senderName: `${tAn.Lastname} ${tAn.Firstname}`,
          senderAvatar: tAn.Avatar,
          content: "Chào cả lớp! Link Google Meet buổi học ngày mai đã được cập nhật. Các em nhớ vào trước 5 phút để ổn định nhé!"
        }
      ]);
      console.log("Created sample chat messages.");

      // Thêm thông báo mẫu
      await Notification.create([
        {
          recipient: st1._id,
          recipientType: "student",
          title: "🔔 Nhắc nhở: Sắp đến giờ học Toán 12 (1 kèm 1)",
          message: `Buổi kèm 1-1 với Thầy An sẽ diễn ra lúc 20:00. Link phòng học: https://meet.google.com/edu-toan1on1-live`,
          type: "class_reminder",
          relatedClass: classMath1on1._id,
          link: `/Student/Dashboard/${st1._id}/Classes`
        },
        {
          recipient: tAn._id,
          recipientType: "teacher",
          title: "🔔 Nhắc nhở: Lịch dạy Toán 12 (1 kèm 1) hôm nay",
          message: `Thầy có lịch dạy 1 kèm 1 với học viên Trần Văn B lúc 20:00 tối nay.`,
          type: "class_reminder",
          relatedClass: classMath1on1._id,
          link: `/Teacher/Dashboard/${tAn._id}/Classes`
        }
      ]);
      console.log("Created sample notifications.");
    }

    console.log("✅ Seed completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
}

seed();
