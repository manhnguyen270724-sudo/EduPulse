import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { course } from "../models/course.model.js";
import { Teacher, Teacherdocs } from "../models/teacher.model.js";
import { student } from "../models/student.model.js";
import { admin } from "../models/admin.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// GET /api/public/courses?level=&grade=&subject=&search=
const getPublicCourses = asyncHandler(async (req, res) => {
  const { level, grade, subject, search } = req.query;

  const filter = { isapproved: true };

  if (level && level !== 'all') {
    filter.educationLevel = level;
  }
  if (grade) {
    filter.grade = grade;
  }
  if (subject) {
    filter.subject = { $regex: subject, $options: 'i' };
  }

  let courses = await course.find(filter).populate('enrolledteacher', '-Password -Refreshtoken -forgetPasswordToken -forgetPasswordExpiry');

  // Filter theo search text
  if (search && search.trim()) {
    const q = search.toLowerCase().trim();
    courses = courses.filter(c => {
      const teacherName = `${c.enrolledteacher?.Lastname || ''} ${c.enrolledteacher?.Firstname || ''}`.toLowerCase();
      const desc = (c.description || '').toLowerCase();
      const sub = (c.subject || c.coursename || '').toLowerCase();
      const courseTitle = (c.liveClasses?.[0]?.title || '').toLowerCase();
      return teacherName.includes(q) || desc.includes(q) || sub.includes(q) || courseTitle.includes(q);
    });
  }

  return res.status(200).json(new ApiResponse(200, courses, "Public courses fetched"));
});

// GET /api/public/course/:courseId
const getCourseDetail = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  if (!courseId) {
    throw new ApiError(400, "Course ID is required");
  }

  const courseData = await course.findOne({ _id: courseId, isapproved: true })
    .populate('enrolledteacher', '-Password -Refreshtoken -forgetPasswordToken -forgetPasswordExpiry')
    .populate('enrolledStudent', 'Firstname Lastname Avatar');

  if (!courseData) {
    throw new ApiError(404, "Khóa học không tồn tại hoặc chưa được phê duyệt");
  }

  return res.status(200).json(new ApiResponse(200, courseData, "Course detail fetched"));
});

// GET /api/public/teacher/:teacherId
const getTeacherProfile = asyncHandler(async (req, res) => {
  const { teacherId } = req.params;

  if (!teacherId) {
    throw new ApiError(400, "Teacher ID is required");
  }

  let query = {};
  if (mongoose.Types.ObjectId.isValid(teacherId)) {
    query._id = teacherId;
  } else {
    query = { $or: [{ slug: teacherId }, { Email: teacherId }] };
  }

  let teacher = await Teacher.findOne(query)
    .populate('Teacherdetails')
    .select('-Password -Refreshtoken -forgetPasswordToken -forgetPasswordExpiry -Aadhaar');

  if (!teacher) {
    throw new ApiError(404, "Giảng viên không tồn tại trên hệ thống");
  }

  // Lấy danh sách khóa học đang mở của giảng viên
  const courses = await course.find({
    enrolledteacher: teacher._id,
    isapproved: true
  }).select('-enrolledStudent -liveClasses');

  // Thống kê thực từ DB
  const totalStudents = await course.aggregate([
    { $match: { enrolledteacher: teacher._id, isapproved: true } },
    { $project: { count: { $size: { $ifNull: ["$enrolledStudent", []] } } } },
    { $group: { _id: null, total: { $sum: "$count" } } }
  ]);

  const stats = {
    totalCourses: courses.length,
    totalStudents: totalStudents[0]?.total || 0
  };

  return res.status(200).json(new ApiResponse(200, { teacher, courses, stats }, "Teacher profile fetched"));
});

// POST /api/public/course/:courseId/enroll/:studentId
// Luồng đăng ký miễn phí (beta) - không qua payment gateway
const enrollStudentFree = asyncHandler(async (req, res) => {
  const { courseId, studentId } = req.params;
  const loggedStudent = req.Student;

  if (!loggedStudent) {
    throw new ApiError(401, "Vui lòng đăng nhập để đăng ký khóa học");
  }

  if (loggedStudent._id.toString() !== studentId) {
    throw new ApiError(403, "Không có quyền truy cập");
  }

  if (loggedStudent.Isapproved !== 'approved') {
    throw new ApiError(403, "Tài khoản chưa được phê duyệt");
  }

  const targetCourse = await course.findOne({ _id: courseId, isapproved: true });

  if (!targetCourse) {
    throw new ApiError(404, "Khóa học không tồn tại");
  }

  // Kiểm tra đã đăng ký chưa
  const alreadyEnrolled = targetCourse.enrolledStudent.includes(loggedStudent._id);
  if (alreadyEnrolled) {
    throw new ApiError(400, "Bạn đã đăng ký khóa học này rồi");
  }

  // Kiểm tra số chỗ còn lại
  const spotsLeft = (targetCourse.maxStudents || 20) - (targetCourse.enrolledStudent?.length || 0);
  if (spotsLeft <= 0) {
    throw new ApiError(400, "Khóa học đã đủ số lượng học viên");
  }

  // Kiểm tra xung đột lịch học
  const studentCourses = await course.aggregate([
    { $match: { enrolledStudent: loggedStudent._id } },
    { $unwind: '$schedule' },
    { $project: { schedule: 1, _id: 0 } }
  ]);

  let isconflict = false;
  for (const sch of targetCourse.schedule) {
    for (const existing of studentCourses) {
      if (sch.day === existing.schedule.day) {
        if (
          (sch.starttime >= existing.schedule.starttime && sch.starttime < existing.schedule.endtime) ||
          (sch.endtime > existing.schedule.starttime && sch.endtime <= existing.schedule.endtime) ||
          (sch.starttime <= existing.schedule.starttime && sch.endtime >= existing.schedule.endtime)
        ) {
          isconflict = true;
          break;
        }
      }
    }
    if (isconflict) break;
  }

  if (isconflict) {
    throw new ApiError(400, "Lịch học bị trùng với khóa học bạn đã đăng ký");
  }

  // Thêm học sinh vào khóa học
  const updatedCourse = await course.findByIdAndUpdate(
    courseId,
    { $push: { enrolledStudent: loggedStudent._id } },
    { new: true }
  );

  // Cộng balance cho giảng viên
  await Teacher.findByIdAndUpdate(
    targetCourse.enrolledteacher,
    { $inc: { Balance: 500 } }
  );

  return res.status(200).json(new ApiResponse(200, {
    courseId: updatedCourse._id,
    coursename: updatedCourse.coursename,
    spotsLeft: (updatedCourse.maxStudents || 20) - updatedCourse.enrolledStudent.length,
    message: "Đăng ký khóa học thành công! Khóa học hiện miễn phí trong giai đoạn Beta."
  }, "Đăng ký thành công"));
});

// GET /api/public/verify-session
// Xác thực danh tính & role thực sự từ HttpOnly Cookie Accesstoken, chống fake localStorage từ client
const verifySession = asyncHandler(async (req, res) => {
  const accToken = req.cookies?.Accesstoken;

  if (!accToken) {
    return res.status(200).json(new ApiResponse(200, {
      authenticated: false,
      role: null,
      user: null
    }, "Chưa đăng nhập"));
  }

  try {
    const decoded = jwt.verify(accToken, process.env.ACCESS_TOKEN_SECRET);
    const userId = decoded?._id;

    if (!userId) {
      return res.status(200).json(new ApiResponse(200, {
        authenticated: false,
        role: null,
        user: null
      }, "Token không hợp lệ"));
    }

    // 1. Thử tìm trong student
    const std = await student.findById(userId).select("-Password -Refreshtoken");
    if (std) {
      return res.status(200).json(new ApiResponse(200, {
        authenticated: true,
        role: 'student',
        user: {
          id: std._id,
          email: std.Email,
          firstname: std.Firstname,
          lastname: std.Lastname,
          avatar: std.Avatar,
          isapproved: std.Isapproved
        }
      }, "Xác thực phiên sinh viên thành công"));
    }

    // 2. Thử tìm trong Teacher
    const tchr = await Teacher.findById(userId).select("-Password -Refreshtoken");
    if (tchr) {
      return res.status(200).json(new ApiResponse(200, {
        authenticated: true,
        role: 'teacher',
        user: {
          id: tchr._id,
          email: tchr.Email,
          firstname: tchr.Firstname,
          lastname: tchr.Lastname,
          avatar: tchr.Avatar,
          isapproved: tchr.Isapproved
        }
      }, "Xác thực phiên giảng viên thành công"));
    }

    // 3. Thử tìm trong admin
    const adm = await admin.findById(userId).select("-password -Refreshtoken");
    if (adm) {
      return res.status(200).json(new ApiResponse(200, {
        authenticated: true,
        role: 'admin',
        user: {
          id: adm._id,
          username: adm.username
        }
      }, "Xác thực phiên quản trị viên thành công"));
    }

    return res.status(200).json(new ApiResponse(200, {
      authenticated: false,
      role: null,
      user: null
    }, "Tài khoản không tồn tại"));

  } catch (err) {
    return res.status(200).json(new ApiResponse(200, {
      authenticated: false,
      role: null,
      user: null
    }, "Phiên làm việc đã hết hạn"));
  }
});

export { getPublicCourses, getCourseDetail, getTeacherProfile, enrollStudentFree, verifySession };
