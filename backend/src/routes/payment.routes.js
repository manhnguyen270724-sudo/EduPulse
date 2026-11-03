import { Router } from "express";
import { authSTD } from "../middlewares/stdAuth.middleware.js";
import { coursePayment, coursePaymentConfirmation, getkey, teacherAmount, withdrawAmount, getTeacherEarningsOverview } from "../controllers/payment.controller.js";
import { authTeacher } from "../middlewares/teacherAuth.middleware.js";

const router = Router();

router.route("/course/:courseID/:coursename").post(authSTD, coursePayment);
router.route("/razorkey").get(authSTD, getkey);
router.route("/confirmation/course/:courseID").post(authSTD, coursePaymentConfirmation);

// Giảng viên: Số dư & Rút tiền
router.route("/teacher/:teacherID/balance").post(authTeacher, teacherAmount);
router.route("/teacher/:teacherID/withdraw").post(authTeacher, withdrawAmount);
router.route("/teacher/:teacherID/earnings-overview").get(authTeacher, getTeacherEarningsOverview);

export default router;