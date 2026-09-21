import { ChatMessage } from "../models/chatMessage.model.js";
import { Classroom } from "../models/classroom.model.js";
import { Notification } from "../models/notification.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

/**
 * Lấy lịch sử tin nhắn của một lớp học
 */
const getClassroomMessages = asyncHandler(async (req, res) => {
  const { classroomId } = req.params;
  const currentUserId = req.teacher?._id || req.Student?._id;

  if (!currentUserId) {
    throw new ApiError(401, "Yêu cầu đăng nhập");
  }

  const classroom = await Classroom.findById(classroomId);
  if (!classroom) {
    throw new ApiError(404, "Không tìm thấy lớp học");
  }

  // Kiểm tra quyền: Phải là GV của lớp hoặc HS trong lớp
  const isTeacher = req.teacher && String(classroom.teacher) === String(req.teacher._id);
  const isStudent = req.Student && classroom.students.some(
    (stId) => String(stId) === String(req.Student._id)
  );

  if (!isTeacher && !isStudent) {
    throw new ApiError(403, "Bạn không phải thành viên của lớp học này để xem tin nhắn");
  }

  const messages = await ChatMessage.find({ classroom: classroomId })
    .sort({ createdAt: 1 })
    .limit(200);

  return res.status(200).json(
    new ApiResponse(200, messages, "Lấy tin nhắn lớp học thành công")
  );
});

/**
 * Gửi tin nhắn vào phòng chat của lớp
 */
const sendClassroomMessage = asyncHandler(async (req, res) => {
  const { classroomId } = req.params;
  const { content, attachments = [] } = req.body;
  const isTeacher = !!req.teacher;
  const currentUser = req.teacher || req.Student;

  if (!currentUser) {
    throw new ApiError(401, "Yêu cầu đăng nhập");
  }

  if (!content || !content.trim()) {
    throw new ApiError(400, "Nội dung tin nhắn không được để trống");
  }

  const classroom = await Classroom.findById(classroomId);
  if (!classroom) {
    throw new ApiError(404, "Không tìm thấy lớp học");
  }

  // Kiểm tra thành viên
  const isTeacherOfClass = isTeacher && String(classroom.teacher) === String(currentUser._id);
  const isStudentOfClass = !isTeacher && classroom.students.some(
    (stId) => String(stId) === String(currentUser._id)
  );

  if (!isTeacherOfClass && !isStudentOfClass) {
    throw new ApiError(403, "Bạn không có quyền gửi tin nhắn trong lớp này");
  }

  const senderName = `${currentUser.Lastname ? currentUser.Lastname + " " : ""}${currentUser.Firstname || "Người dùng"}`;
  const senderAvatar = currentUser.Avatar || "";

  const newMsg = await ChatMessage.create({
    classroom: classroomId,
    senderId: currentUser._id,
    senderType: isTeacher ? "teacher" : "student",
    senderName,
    senderAvatar,
    content: content.trim(),
    attachments
  });

  // Tự động tạo Notification cho các thành viên khác trong lớp
  // 1. Nếu Học viên gửi -> Báo cho Giảng viên
  if (!isTeacher) {
    await Notification.create({
      recipient: classroom.teacher,
      recipientType: "teacher",
      title: `Tin nhắn mới từ ${senderName}`,
      message: `Lớp "${classroom.className}": ${content.slice(0, 80)}${content.length > 80 ? "..." : ""}`,
      type: "chat_message",
      relatedClass: classroom._id,
      link: `/Teacher/Dashboard/${classroom.teacher}/Classes/${classroom._id}/chat`
    });
  } else {
    // 2. Nếu Giảng viên gửi -> Báo cho tất cả Học viên trong lớp
    const notifications = classroom.students.map((stId) => ({
      recipient: stId,
      recipientType: "student",
      title: `Tin nhắn mới từ Thầy/Cô ${senderName}`,
      message: `Lớp "${classroom.className}": ${content.slice(0, 80)}${content.length > 80 ? "..." : ""}`,
      type: "chat_message",
      relatedClass: classroom._id,
      link: `/Student/Dashboard/${stId}/Classes/${classroom._id}/chat`
    }));
    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }
  }

  return res.status(201).json(
    new ApiResponse(201, newMsg, "Gửi tin nhắn thành công")
  );
});

export {
  getClassroomMessages,
  sendClassroomMessage
};
