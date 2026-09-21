import { Router } from "express";
import {
  getClassroomMessages,
  sendClassroomMessage
} from "../controllers/chat.controller.js";
import { authAny } from "../middlewares/anyAuth.middleware.js";

const router = Router();

// Lấy tin nhắn trong lớp
router.route("/:classroomId/messages").get(authAny, getClassroomMessages);

// Gửi tin nhắn mới vào lớp
router.route("/:classroomId/messages").post(authAny, sendClassroomMessage);

export default router;
