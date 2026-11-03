import { Router } from "express";
import { adminLogin, adminLogout, adminSignUp, approveStudent, approveTeacher, checkStudentDocuments, checkTeacherDocuments, forApproval, sendmessage, allmessages, readMessage, toapproveCourse, approveCourse } from "../controllers/admin.controller.js";
import {
  getRevenueOverview,
  getAllWithdrawalRequests,
  handleWithdrawalRequest,
  getAllUsers,
  toggleUserStatus,
  getCompletionPendingCourses,
  approveCourseCompletion,
  getBadReviewsAlerts,
  suspendCourseWithWarning,
  liftCourseSuspension,
} from "../controllers/adminManagement.controller.js";
import { authAdmin } from "../middlewares/adminAuth.middleware.js";

const router = Router();

router.route("/signup").post(adminSignUp);
router.route("/login").post(adminLogin);
router.route("/logout").post(authAdmin, adminLogout);

// Phê duyệt tài liệu hồ sơ lúc đăng ký
router.route("/:adminID/approve").post(authAdmin, forApproval);
router.route("/:adminID/approve/student/:studentID").post(authAdmin, approveStudent);
router.route("/:adminID/approve/teacher/:teacherID").post(authAdmin, approveTeacher);
router.route("/:adminID/documents/student/:studentID").get(authAdmin, checkStudentDocuments);
router.route("/:adminID/documents/teacher/:teacherID").get(authAdmin, checkTeacherDocuments);

// Tin nhắn liên hệ
router.route("/contact-us").post(sendmessage);
router.route("/messages/all").get(authAdmin, allmessages);
router.route("/message/read").patch(authAdmin, readMessage);

// Duyệt phát hành khóa học ban đầu
router.route("/:adminID/approve/course").get(authAdmin, toapproveCourse);
router.route("/:adminID/approve/course/:courseID").post(authAdmin, approveCourse);

// =========================================================================
// CÁC TÍNH NĂNG ADMIN MỞ RỘNG (REVENUE, USER MGMT, COMPLETION, BAD REVIEWS)
// =========================================================================

// 1. Quản lý Doanh thu & Lệnh rút tiền
router.route("/revenue/overview").get(authAdmin, getRevenueOverview);
router.route("/withdrawals/all").get(authAdmin, getAllWithdrawalRequests);
router.route("/withdrawals/:requestId/process").post(authAdmin, handleWithdrawalRequest);

// 2. Quản lý Tài khoản người dùng (Học viên & Giảng viên)
router.route("/users/all").get(authAdmin, getAllUsers);
router.route("/users/:role/:userId/status").patch(authAdmin, toggleUserStatus);

// 3. Quản lý Nghiệm thu Hoàn thành khóa học (Để mở khóa rút tiền cho GV)
router.route("/course-completion/pending").get(authAdmin, getCompletionPendingCourses);
router.route("/course-completion/:courseId/approve").post(authAdmin, approveCourseCompletion);

// 4. Cảnh báo Đánh giá xấu & Tạm dừng khóa học
router.route("/reviews/bad-alerts").get(authAdmin, getBadReviewsAlerts);
router.route("/course/:courseId/suspend-warning").post(authAdmin, suspendCourseWithWarning);
router.route("/course/:courseId/unsuspend").post(authAdmin, liftCourseSuspension);

export default router;