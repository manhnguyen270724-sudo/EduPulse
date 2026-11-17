import { Router } from "express";
import {
  getClassroomMessages,
  sendClassroomMessage,
  uploadChatAttachment
} from "../controllers/chat.controller.js";
import { authAny } from "../middlewares/anyAuth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// Lấy tin nhắn trong lớp
router.route("/:classroomId/messages").get(authAny, getClassroomMessages);

// Gửi tin nhắn mới vào lớp
router.route("/:classroomId/messages").post(authAny, sendClassroomMessage);

// Tải tệp đính kèm trong chat (tối đa 25MB)
router.route("/:classroomId/upload").post(authAny, upload.single("attachment"), uploadChatAttachment);

export default router;
