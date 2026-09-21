import { Classroom } from "../models/classroom.model.js";
import { course } from "../models/course.model.js";
import { Teacher } from "../models/teacher.model.js";
import { Student } from "../models/student.model.js";
import { Notification } from "../models/notification.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

/**
 * Giảng viên tạo lớp học mới cho một khóa học của mình
 */
const createClassroom = asyncHandler(async (req, res) => {
  const teacher = req.teacher;
  const {
    courseId,
    className,
    classType = "group",
    maxStudents = 20,
    description = "",
    weeklySchedule = [],
    startDate,
    endDate,
    defaultRoomLink = "https://meet.google.com/edu-vietnam-live"
  } = req.body;

  if (!courseId || !className?.trim()) {
    throw new ApiError(400, "Vui lòng chọn khóa học và nhập tên lớp học");
  }

  // Xác thực khóa học thuộc quyền sở hữu của giảng viên
  const foundCourse = await course.findOne({
    _id: courseId,
    enrolledteacher: teacher._id
  });

  if (!foundCourse) {
    throw new ApiError(403, "Khóa học không tồn tại hoặc bạn không có quyền mở lớp cho khóa học này");
  }

  // Khởi tạo các buổi học ban đầu dựa trên weeklySchedule (4 tuần tới)
  const initialSessions = [];
  if (Array.isArray(weeklySchedule) && weeklySchedule.length > 0) {
    const start = startDate ? new Date(startDate) : new Date();
    // Tạo lịch cho 4 tuần kế tiếp
    for (let week = 0; week < 4; week++) {
      for (const item of weeklySchedule) {
        const targetDay = parseInt(item.dayOfWeek);
        const sessionDate = new Date(start);
        const currentDay = sessionDate.getDay();
        let distance = (targetDay + 7 - currentDay) % 7;
        if (distance === 0 && week === 0) distance = 0;
        sessionDate.setDate(sessionDate.getDate() + distance + (week * 7));

        initialSessions.push({
          title: `Buổi học: ${className} (Tuần ${week + 1})`,
          date: sessionDate,
          startTime: item.startTime || "19:30",
          endTime: item.endTime || "21:00",
          timing: 90,
          roomLink: item.roomLink || defaultRoomLink,
          status: "upcoming"
        });
      }
    }
  }

  const newClassroom = await Classroom.create({
    course: courseId,
    teacher: teacher._id,
    className: className.trim(),
    classType: classType === "one-on-one" ? "one-on-one" : "group",
    maxStudents: classType === "one-on-one" ? 1 : Number(maxStudents) || 20,
    description,
    weeklySchedule,
    sessions: initialSessions,
    startDate: startDate || new Date(),
    endDate: endDate || null
  });

  // Tạo thông báo cho giảng viên
  await Notification.create({
    recipient: teacher._id,
    recipientType: "teacher",
    title: "Mở lớp học thành công",
    message: `Bạn đã mở thành công lớp "${className}" (${classType === "one-on-one" ? "Lớp 1 kèm 1" : "Lớp nhóm"}).`,
    type: "system",
    relatedClass: newClassroom._id,
    link: `/Teacher/Dashboard/${teacher._id}/Classrooms`
  });

  return res.status(201).json(
    new ApiResponse(201, newClassroom, "Tạo lớp học thành công")
  );
});

/**
 * Lấy danh sách lớp học do Giảng viên phụ trách
 */
const getTeacherClassrooms = asyncHandler(async (req, res) => {
  const teacher = req.teacher;
  const { teacherId } = req.params;
  const { courseId, classType, status } = req.query;

  if (teacherId && String(teacherId) !== String(teacher._id)) {
    throw new ApiError(403, "Không có quyền xem lớp học của giảng viên khác");
  }

  const filter = { teacher: teacher._id };
  if (courseId) filter.course = courseId;
  if (classType) filter.classType = classType;
  if (status) filter.status = status;

  const classrooms = await Classroom.find(filter)
    .populate("course", "coursename subject educationLevel fees")
    .populate("students", "Firstname Lastname Email Avatar")
    .sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse(200, classrooms, "Lấy danh sách lớp học thành công")
  );
});

/**
 * Lấy danh sách lớp học mà Học viên đang tham gia
 */
const getStudentClassrooms = asyncHandler(async (req, res) => {
  const student = req.Student;
  const { studentId } = req.params;

  if (studentId && String(studentId) !== String(student._id)) {
    throw new ApiError(403, "Không có quyền xem lớp học của học viên khác");
  }

  const classrooms = await Classroom.find({
    students: student._id
  })
    .populate("course", "coursename subject educationLevel fees")
    .populate("teacher", "Firstname Lastname Email Avatar bio")
    .sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse(200, classrooms, "Lấy danh sách lớp học tham gia thành công")
  );
});

/**
 * Xem chi tiết 1 lớp học (kiểm tra quyền Giảng viên hoặc Học viên trong lớp)
 */
const getClassroomDetails = asyncHandler(async (req, res) => {
  const { classroomId } = req.params;
  const user = req.teacher || req.Student;

  if (!user) {
    throw new ApiError(401, "Yêu cầu đăng nhập");
  }

  const classroom = await Classroom.findById(classroomId)
    .populate("course", "coursename subject description educationLevel syllabus outcomes")
    .populate("teacher", "Firstname Lastname Email Avatar bio")
    .populate("students", "Firstname Lastname Email Avatar");

  if (!classroom) {
    throw new ApiError(404, "Không tìm thấy lớp học");
  }

  // Kiểm tra quyền truy cập
  const isTeacher = req.teacher && String(classroom.teacher._id) === String(req.teacher._id);
  const isEnrolledStudent = req.Student && classroom.students.some(
    (st) => String(st._id) === String(req.Student._id)
  );

  if (!isTeacher && !isEnrolledStudent) {
    throw new ApiError(403, "Bạn không phải thành viên của lớp học này");
  }

  return res.status(200).json(
    new ApiResponse(200, {
      classroom,
      isTeacher,
      isStudent: !isTeacher
    }, "Lấy chi tiết lớp học thành công")
  );
});

/**
 * Học viên đăng ký vào lớp học (hỗ trợ cả lớp nhóm và lớp 1 kèm 1)
 */
const enrollStudentToClassroom = asyncHandler(async (req, res) => {
  const student = req.Student;
  const { classroomId } = req.params;

  const classroom = await Classroom.findById(classroomId).populate("teacher course");
  if (!classroom) {
    throw new ApiError(404, "Không tìm thấy lớp học");
  }

  if (classroom.status === "completed" || classroom.status === "cancelled") {
    throw new ApiError(400, "Lớp học đã kết thúc hoặc bị hủy");
  }

  // Kiểm tra đã đăng ký chưa
  const alreadyEnrolled = classroom.students.some(
    (stId) => String(stId) === String(student._id)
  );
  if (alreadyEnrolled) {
    throw new ApiError(400, "Bạn đã tham gia lớp học này rồi");
  }

  // Kiểm tra sĩ số
  if (classroom.students.length >= classroom.maxStudents) {
    throw new ApiError(400, "Lớp học này đã đủ sĩ số");
  }

  // Thêm học viên vào lớp
  classroom.students.push(student._id);
  await classroom.save();

  // Đồng thời thêm học viên vào enrolledStudent của Course nếu chưa có
  await course.findByIdAndUpdate(classroom.course._id, {
    $addToSet: { enrolledStudent: student._id }
  });

  // Tạo thông báo cho học viên
  await Notification.create({
    recipient: student._id,
    recipientType: "student",
    title: "Đăng ký lớp học thành công",
    message: `Bạn đã tham gia lớp "${classroom.className}" (${classroom.classType === "one-on-one" ? "1 kèm 1" : "Lớp nhóm"}). Hãy xem lịch học để tham gia đúng giờ!`,
    type: "class_enrolled",
    relatedClass: classroom._id,
    link: `/Student/Dashboard/${student._id}/Classes`
  });

  // Tạo thông báo cho giảng viên
  await Notification.create({
    recipient: classroom.teacher._id,
    recipientType: "teacher",
    title: "Có học viên mới tham gia lớp",
    message: `Học viên ${student.Firstname} ${student.Lastname} vừa tham gia lớp "${classroom.className}".`,
    type: "class_enrolled",
    relatedClass: classroom._id,
    link: `/Teacher/Dashboard/${classroom.teacher._id}/Classrooms`
  });

  return res.status(200).json(
    new ApiResponse(200, classroom, "Đăng ký tham gia lớp học thành công")
  );
});

/**
 * Giảng viên thêm buổi học mới vào lớp
 */
const addClassroomSession = asyncHandler(async (req, res) => {
  const teacher = req.teacher;
  const { classroomId } = req.params;
  const { title, date, startTime, endTime, timing = 90, roomLink, notes } = req.body;

  if (!title?.trim() || !date) {
    throw new ApiError(400, "Vui lòng nhập tên buổi học và ngày diễn ra");
  }

  const classroom = await Classroom.findOne({
    _id: classroomId,
    teacher: teacher._id
  });

  if (!classroom) {
    throw new ApiError(403, "Lớp học không tồn tại hoặc bạn không có quyền chỉnh sửa");
  }

  const newSession = {
    title: title.trim(),
    date: new Date(date),
    startTime: startTime || "19:30",
    endTime: endTime || "21:00",
    timing: Number(timing) || 90,
    roomLink: roomLink || "https://meet.google.com/edu-vietnam-live",
    notes: notes || "",
    status: "upcoming"
  };

  classroom.sessions.push(newSession);
  // Sắp xếp lại sessions theo ngày
  classroom.sessions.sort((a, b) => new Date(a.date) - new Date(b.date));
  await classroom.save();

  // Bắn thông báo cho tất cả học viên trong lớp
  if (classroom.students.length > 0) {
    const notifications = classroom.students.map((stId) => ({
      recipient: stId,
      recipientType: "student",
      title: "Buổi học mới được lên lịch",
      message: `Buổi học "${title}" của lớp "${classroom.className}" đã được lên lịch vào ngày ${new Date(date).toLocaleDateString("vi-VN")}.`,
      type: "class_reminder",
      relatedClass: classroom._id,
      link: `/Student/Dashboard/${stId}/Classes`
    }));
    await Notification.insertMany(notifications);
  }

  return res.status(201).json(
    new ApiResponse(201, classroom, "Thêm buổi học thành công")
  );
});

/**
 * Lịch dạy tổng hợp của tất cả các lớp của Giảng viên
 */
const getTeacherSchedule = asyncHandler(async (req, res) => {
  const teacher = req.teacher;
  const { teacherId } = req.params;

  if (teacherId && String(teacherId) !== String(teacher._id)) {
    throw new ApiError(403, "Không có quyền xem lịch của giảng viên khác");
  }

  const classrooms = await Classroom.find({ teacher: teacher._id })
    .populate("course", "coursename subject educationLevel")
    .populate("students", "Firstname Lastname Avatar");

  const allSessions = [];
  classrooms.forEach((cls) => {
    (cls.sessions || []).forEach((ss) => {
      allSessions.push({
        sessionId: ss._id,
        classroomId: cls._id,
        className: cls.className,
        classCode: cls.classCode,
        classType: cls.classType,
        courseName: cls.course?.coursename,
        subject: cls.course?.subject,
        studentCount: cls.students?.length || 0,
        students: cls.students,
        title: ss.title,
        date: ss.date,
        startTime: ss.startTime,
        endTime: ss.endTime,
        timing: ss.timing,
        roomLink: ss.roomLink,
        status: ss.status,
        notes: ss.notes
      });
    });
  });

  // Sắp xếp theo ngày tăng dần
  allSessions.sort((a, b) => new Date(a.date) - new Date(b.date));

  return res.status(200).json(
    new ApiResponse(200, {
      totalClasses: classrooms.length,
      sessions: allSessions
    }, "Lấy lịch dạy thành công")
  );
});

/**
 * Lịch học tổng hợp của tất cả các lớp Học viên tham gia
 */
const getStudentSchedule = asyncHandler(async (req, res) => {
  const student = req.Student;
  const { studentId } = req.params;

  if (studentId && String(studentId) !== String(student._id)) {
    throw new ApiError(403, "Không có quyền xem lịch của học viên khác");
  }

  const classrooms = await Classroom.find({ students: student._id })
    .populate("course", "coursename subject educationLevel")
    .populate("teacher", "Firstname Lastname Avatar Email");

  const allSessions = [];
  classrooms.forEach((cls) => {
    (cls.sessions || []).forEach((ss) => {
      allSessions.push({
        sessionId: ss._id,
        classroomId: cls._id,
        className: cls.className,
        classCode: cls.classCode,
        classType: cls.classType,
        courseName: cls.course?.coursename,
        subject: cls.course?.subject,
        teacher: cls.teacher,
        title: ss.title,
        date: ss.date,
        startTime: ss.startTime,
        endTime: ss.endTime,
        timing: ss.timing,
        roomLink: ss.roomLink,
        status: ss.status,
        notes: ss.notes
      });
    });
  });

  allSessions.sort((a, b) => new Date(a.date) - new Date(b.date));

  return res.status(200).json(
    new ApiResponse(200, {
      totalClasses: classrooms.length,
      sessions: allSessions
    }, "Lấy lịch học thành công")
  );
});

/**
 * Lấy danh sách các lớp mở công khai của 1 khóa học (để học viên đăng ký)
 */
const getCourseClassrooms = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  const classrooms = await Classroom.find({
    course: courseId,
    status: { $in: ["upcoming", "active"] }
  })
    .populate("teacher", "Firstname Lastname Avatar bio")
    .select("-sessions.notes");

  return res.status(200).json(
    new ApiResponse(200, classrooms, "Lấy danh sách lớp của khóa học thành công")
  );
});

export {
  createClassroom,
  getTeacherClassrooms,
  getStudentClassrooms,
  getClassroomDetails,
  enrollStudentToClassroom,
  addClassroomSession,
  getTeacherSchedule,
  getStudentSchedule,
  getCourseClassrooms
};
