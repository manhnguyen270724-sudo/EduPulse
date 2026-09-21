import { Router } from "express";
import {
  createClassroom,
  getTeacherClassrooms,
  getStudentClassrooms,
  getClassroomDetails,
  enrollStudentToClassroom,
  addClassroomSession,
  getTeacherSchedule,
  getStudentSchedule,
  getCourseClassrooms
} from "../controllers/classroom.controller.js";
import { authTeacher } from "../middlewares/teacherAuth.middleware.js";
import { authSTD } from "../middlewares/stdAuth.middleware.js";
import { authAny } from "../middlewares/anyAuth.middleware.js";

const router = Router();

// Giảng viên tạo lớp học mới
router.route("/create").post(authTeacher, createClassroom);

// Lớp học do giảng viên quản lý
router.route("/teacher/:teacherId").get(authTeacher, getTeacherClassrooms);

// Lớp học mà học viên tham gia
router.route("/student/:studentId").get(authSTD, getStudentClassrooms);

// Chi tiết 1 lớp học (cả GV và HS trong lớp xem được)
router.route("/detail/:classroomId").get(authAny, getClassroomDetails);

// Học viên đăng ký vào lớp học
router.route("/:classroomId/enroll").post(authSTD, enrollStudentToClassroom);

// Giảng viên thêm buổi học mới
router.route("/:classroomId/sessions").post(authTeacher, addClassroomSession);

// Lịch dạy của giảng viên (tổng hợp các lớp)
router.route("/schedule/teacher/:teacherId").get(authTeacher, getTeacherSchedule);

// Lịch học của học viên (tổng hợp các lớp)
router.route("/schedule/student/:studentId").get(authSTD, getStudentSchedule);

// Danh sách lớp mở của 1 khóa học (public để chọn khi đăng ký)
router.route("/course/:courseId").get(getCourseClassrooms);

export default router;
