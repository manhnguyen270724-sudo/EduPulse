import { Router } from "express";
import {
  getUserNotifications,
  markNotificationAsRead,
  markAllAsRead,
  checkUpcomingClassReminders
} from "../controllers/notification.controller.js";
import { authAny } from "../middlewares/anyAuth.middleware.js";

const router = Router();

// Lấy danh sách thông báo & unreadCount
router.route("/").get(authAny, getUserNotifications);

// Đánh dấu 1 thông báo đã đọc
router.route("/:id/read").patch(authAny, markNotificationAsRead);

// Đánh dấu tất cả đã đọc
router.route("/read-all").patch(authAny, markAllAsRead);

// Quét các buổi học sắp tới để tự động sinh thông báo nhắc nhở
router.route("/check-reminders").post(checkUpcomingClassReminders);

export default router;
