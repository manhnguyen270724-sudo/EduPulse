import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import Razorpay from "razorpay"

const app = express();

app.use(cors())

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


export const instance = new Razorpay({
    key_id: process.env.KEY_ID || 'rzp_test_placeholder',
    key_secret: process.env.KEY_SECRET || 'placeholder_secret'
})

//student routes
import studentRouter from "./routes/student.routes.js";
app.use("/api/student", studentRouter)


//teacher routes
import teacherRouter from "./routes/teacher.routes.js"
app.use("/api/teacher", teacherRouter)

//course routes
import courseRouter from "./routes/course.routes.js"
app.use("/api/course", courseRouter)

import adminRouter from "./routes/admin.routes.js"
app.use("/api/admin", adminRouter)

import paymentRouter from "./routes/payment.routes.js"
app.use("/api/payment", paymentRouter)

// public routes (không cần auth)
import publicRouter from "./routes/public.routes.js"
app.use("/api/public", publicRouter)

// classroom routes (quản lý lớp học, lớp 1-kèm-1, lịch học)
import classroomRouter from "./routes/classroom.routes.js"
app.use("/api/classrooms", classroomRouter)

// notification routes (thông báo nhắc giờ học)
import notificationRouter from "./routes/notification.routes.js"
app.use("/api/notifications", notificationRouter)

// chat routes (kênh chat theo từng lớp học)
import chatRouter from "./routes/chat.routes.js"
app.use("/api/chat", chatRouter)

export {app}