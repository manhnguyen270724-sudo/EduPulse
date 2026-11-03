import { Router } from "express";
import { addClass, addCourseStudent, addCourseTeacher, canStudentEnroll, enrolledcourseSTD, enrolledcourseTeacher, getCourse, getcourseTeacher, stdEnrolledCoursesClasses, teacherEnrolledCoursesClasses } from "../controllers/course.controller.js";
import {
  submitCourseCompletionFeedback,
  checkStudentFeedbackStatus,
  getCourseCompletionStats,
  requestCourseCompletionByTeacher,
  submitCourseReview,
  getCourseReviews,
} from "../controllers/courseFeedback.controller.js";
import { authSTD } from "../middlewares/stdAuth.middleware.js";
import { authTeacher } from "../middlewares/teacherAuth.middleware.js";

const router = Router();

router.route("/all").get(getCourse);
router.route("/:coursename").get(getcourseTeacher);
router.route("/:coursename/create/:id").post(authTeacher, addCourseTeacher);
router.route("/:coursename/:courseID/add/student/:id").post(authSTD, addCourseStudent);
router.route("/:coursename/:courseID/verify/student/:id").post(authSTD, canStudentEnroll);
router.route("/student/:id/enrolled").get(authSTD, enrolledcourseSTD);
router.route("/teacher/:id/enrolled").get(authTeacher, enrolledcourseTeacher);
router.route("/:courseId/teacher/:teacherId/add-class").post(authTeacher, addClass);
router.route("/classes/student/:studentId").get(authSTD, stdEnrolledCoursesClasses);
router.route("/classes/teacher/:teacherId").get(authTeacher, teacherEnrolledCoursesClasses);

// === FORM XÁC NHẬN KẾT THÚC KHÓA HỌC (HỌC VIÊN) ===
router.route("/:courseId/completion-feedback").post(authSTD, submitCourseCompletionFeedback);
router.route("/:courseId/completion-feedback/status").get(authSTD, checkStudentFeedbackStatus);

// === TIẾN ĐỘ HOÀN THÀNH & YÊU CẦU NGHIỆM THU (GIẢNG VIÊN) ===
router.route("/:courseId/completion-stats").get(getCourseCompletionStats);
router.route("/:courseId/request-completion").post(authTeacher, requestCourseCompletionByTeacher);

// === ĐÁNH GIÁ & NHẬN XÉT KHÓA HỌC (REVIEW & RATING) ===
router.route("/:courseId/reviews").get(getCourseReviews).post(authSTD, submitCourseReview);

export default router;