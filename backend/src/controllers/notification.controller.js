import { Notification } from "../models/notification.model.js";
import { Classroom } from "../models/classroom.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

/**
 * Lấy danh sách thông báo của người dùng hiện tại (Giảng viên hoặc Học viên)
 */
const getUserNotifications = asyncHandler(async (req, res) => {
  const currentUserId = req.teacher?._id || req.Student?._id;
  const currentUserType = req.teacher ? "teacher" : "student";

  if (!currentUserId) {
    throw new ApiError(401, "Yêu cầu đăng nhập");
  }

  const notifications = await Notification.find({
    recipient: currentUserId,
    recipientType: currentUserType
  })
    .populate("relatedClass", "className classCode classType")
    .sort({ createdAt: -1 })
    .limit(50);

  const unreadCount = await Notification.countDocuments({
    recipient: currentUserId,
    recipientType: currentUserType,
    isRead: false
  });

  return res.status(200).json(
    new ApiResponse(200, { notifications, unreadCount }, "Lấy thông báo thành công")
  );
});

/**
 * Đánh dấu đã đọc 1 thông báo
 */
const markNotificationAsRead = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const currentUserId = req.teacher?._id || req.Student?._id;

  const notification = await Notification.findOneAndUpdate(
    { _id: id, recipient: currentUserId },
    { isRead: true },
    { new: true }
  );

  if (!notification) {
    throw new ApiError(404, "Không tìm thấy thông báo");
  }

  return res.status(200).json(
    new ApiResponse(200, notification, "Đã đánh dấu đã đọc")
  );
});

/**
 * Đánh dấu đã đọc tất cả thông báo
 */
const markAllAsRead = asyncHandler(async (req, res) => {
  const currentUserId = req.teacher?._id || req.Student?._id;
  const currentUserType = req.teacher ? "teacher" : "student";

  await Notification.updateMany(
    { recipient: currentUserId, recipientType: currentUserType, isRead: false },
    { isRead: true }
  );

  return res.status(200).json(
    new ApiResponse(200, null, "Đã đánh dấu đọc tất cả thông báo")
  );
});

/**
 * Kiểm tra các buổi học sắp tới và tự động tạo thông báo nhắc nhở
 * Được gọi khi người dùng vào dashboard hoặc định kỳ
 */
const checkUpcomingClassReminders = asyncHandler(async (req, res) => {
  const now = new Date();
  const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  // Tìm các lớp học có sessions trong vòng 24 giờ tới
  const activeClassrooms = await Classroom.find({
    status: { $in: ["upcoming", "active"] },
    "sessions.date": { $gte: now, $lte: next24Hours }
  }).populate("course", "coursename subject");

  let createdCount = 0;

  for (const cls of activeClassrooms) {
    for (const ss of cls.sessions) {
      const sessionDate = new Date(ss.date);
      if (sessionDate >= now && sessionDate <= next24Hours && ss.status === "upcoming") {
        const diffMinutes = Math.round((sessionDate.getTime() - now.getTime()) / (1000 * 60));
        let reminderText = "";

        if (diffMinutes <= 60) {
          reminderText = `sắp bắt đầu trong ${Math.max(1, diffMinutes)} phút nữa!`;
        } else {
          reminderText = `sẽ bắt đầu vào ${ss.startTime || "hôm nay"}.`;
        }

        const notificationTitle = `🔔 Nhắc nhở: Lớp "${cls.className}" sắp đến giờ học`;
        const notificationMsg = `Buổi học "${ss.title}" (${cls.classType === "one-on-one" ? "Lớp 1 kèm 1" : "Lớp nhóm"}) ${reminderText} Chuẩn bị vào phòng học nhé!`;

        // 1. Nhắc Giảng viên (nếu chưa nhắc session này)
        const teacherNotifExists = await Notification.findOne({
          recipient: cls.teacher,
          relatedClass: cls._id,
          relatedSessionId: ss._id,
          type: "class_reminder"
        });

        if (!teacherNotifExists) {
          await Notification.create({
            recipient: cls.teacher,
            recipientType: "teacher",
            title: notificationTitle,
            message: notificationMsg,
            type: "class_reminder",
            relatedClass: cls._id,
            relatedSessionId: ss._id,
            link: `/Teacher/Dashboard/${cls.teacher}/Classes`
          });
          createdCount++;
        }

        // 2. Nhắc từng Học viên trong lớp (nếu chưa nhắc session này)
        for (const stId of cls.students) {
          const studentNotifExists = await Notification.findOne({
            recipient: stId,
            relatedClass: cls._id,
            relatedSessionId: ss._id,
            type: "class_reminder"
          });

          if (!studentNotifExists) {
            await Notification.create({
              recipient: stId,
              recipientType: "student",
              title: notificationTitle,
              message: notificationMsg,
              type: "class_reminder",
              relatedClass: cls._id,
              relatedSessionId: ss._id,
              link: `/Student/Dashboard/${stId}/Classes`
            });
            createdCount++;
          }
        }
      }
    }
  }

  return res.status(200).json(
    new ApiResponse(200, { createdCount }, `Đã kiểm tra nhắc nhở. Tạo mới: ${createdCount} thông báo`)
  );
});

export {
  getUserNotifications,
  markNotificationAsRead,
  markAllAsRead,
  checkUpcomingClassReminders
};
