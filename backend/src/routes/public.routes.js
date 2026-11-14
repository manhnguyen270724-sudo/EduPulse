import { Router } from "express";
import { getPublicCourses, getCourseDetail, getTeacherProfile, enrollStudentFree, verifySession } from "../controllers/public.controller.js";
import { authSTD } from "../middlewares/stdAuth.middleware.js";

const router = Router();

// GET /api/public/verify-session (Xác thực danh tính thực sự từ Cookie HttpOnly)
router.route("/verify-session").get(verifySession);

// GET /api/public/courses?level=&grade=&subject=&search=
router.route("/courses").get(getPublicCourses);

// GET /api/public/course/:courseId
router.route("/course/:courseId").get(getCourseDetail);

// GET /api/public/teacher/:teacherId
router.route("/teacher/:teacherId").get(getTeacherProfile);

// POST /api/public/course/:courseId/enroll (yêu cầu đăng nhập student, trích xuất ID từ session)
// POST /api/public/course/:courseId/enroll/:studentId (tương thích backward)
router.route("/course/:courseId/enroll").post(authSTD, enrollStudentFree);
router.route("/course/:courseId/enroll/:studentId").post(authSTD, enrollStudentFree);

export default router;
