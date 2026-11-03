import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { course } from "../models/course.model.js";
import { CourseCompletionFeedback } from "../models/courseCompletionFeedback.model.js";
import { CourseReview } from "../models/courseReview.model.js";
import { Notification } from "../models/notification.model.js";

// =========================================================================
// 1. HỌC VIÊN: FORM XÁC NHẬN KẾT THÚC KHÓA HỌC
// =========================================================================

/**
 * Học viên nộp form xác nhận hoàn thành kết thúc khóa học
 */
export const submitCourseCompletionFeedback = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const studentId = req.Student._id;
  const {
    classroomId,
    hasCompletedAllLessons,
    attendanceSatisfaction = 5,
    teachingQualitySatisfaction = 5,
    feedbackContent = "",
    issuesReported = "",
  } = req.body;

  const targetCourse = await course.findById(courseId);
  if (!targetCourse) {
    throw new ApiError(404, "Không tìm thấy khóa học");
  }

  // Kiểm tra học viên có thuộc khóa học không
  const isEnrolled = targetCourse.enrolledStudent.some(
    (id) => id.toString() === studentId.toString()
  );
  if (!isEnrolled) {
    throw new ApiError(403, "Bạn chưa đăng ký tham gia khóa học này");
  }

  // Kiểm tra xem học viên đã từng nộp form xác nhận chưa
  const existingFeedback = await CourseCompletionFeedback.findOne({
    courseId,
    studentId,
  });

  let savedFeedback;
  if (existingFeedback) {
    existingFeedback.hasCompletedAllLessons = hasCompletedAllLessons !== false;
    existingFeedback.attendanceSatisfaction = attendanceSatisfaction;
    existingFeedback.teachingQualitySatisfaction = teachingQualitySatisfaction;
    existingFeedback.feedbackContent = feedbackContent;
    existingFeedback.issuesReported = issuesReported;
    existingFeedback.isConfirmedEndCourse = true;
    savedFeedback = await existingFeedback.save();
  } else {
    savedFeedback = await CourseCompletionFeedback.create({
      courseId,
      classroomId: classroomId || null,
      studentId,
      teacherId: targetCourse.enrolledteacher,
      hasCompletedAllLessons: hasCompletedAllLessons !== false,
      attendanceSatisfaction,
      teachingQualitySatisfaction,
      feedbackContent,
      issuesReported,
      isConfirmedEndCourse: true,
    });
  }

  // Thông báo tới Giảng viên khi có thêm học viên gửi xác nhận kết thúc
  const totalStudents = targetCourse.enrolledStudent.length;
  const totalConfirmed = await CourseCompletionFeedback.countDocuments({
    courseId,
    isConfirmedEndCourse: true,
  });

  await Notification.create({
    recipient: targetCourse.enrolledteacher,
    recipientType: "teacher",
    title: "Học viên xác nhận hoàn thành khóa học",
    message: `Học viên đã nộp form xác nhận kết thúc khóa học "${targetCourse.coursename}". Tiến độ hiện tại: ${totalConfirmed}/${totalStudents} học viên (${Math.round(
      (totalConfirmed / totalStudents) * 100
    )}%).`,
    type: "system",
  });

  return res
    .status(200)
    .json(new ApiResponse(200, savedFeedback, "Xác nhận kết thúc khóa học thành công"));
});

/**
 * Kiểm tra trạng thái nộp form kết thúc của học viên đối với 1 khóa học
 */
export const checkStudentFeedbackStatus = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const studentId = req.Student._id;

  const feedback = await CourseCompletionFeedback.findOne({ courseId, studentId });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        hasSubmitted: !!feedback,
        feedback: feedback || null,
      },
      "Feedback status checked"
    )
  );
});

// =========================================================================
// 2. GIẢNG VIÊN: YÊU CẦU NGHIỆM THU HOÀN THÀNH & THEO DÕI TIẾN ĐỘ
// =========================================================================

/**
 * Lấy chi tiết tiến độ hoàn thành khóa học (bao nhiêu học viên đã xác nhận)
 */
export const getCourseCompletionStats = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  const targetCourse = await course
    .findById(courseId)
    .populate("enrolledStudent", "Firstname Lastname Email Avatar");

  if (!targetCourse) {
    throw new ApiError(404, "Không tìm thấy khóa học");
  }

  const feedbacks = await CourseCompletionFeedback.find({ courseId }).populate(
    "studentId",
    "Firstname Lastname Email"
  );

  const totalStudents = targetCourse.enrolledStudent?.length || 0;
  const confirmedCount = feedbacks.filter((f) => f.isConfirmedEndCourse).length;
  const completionRate =
    totalStudents > 0 ? Math.round((confirmedCount / totalStudents) * 100) : 100;

  // Điều kiện để được phép gửi yêu cầu nghiệm thu lên Admin: >= 80% (hoặc 100% nếu dưới 3 học viên)
  const isEligibleForApproval = totalStudents === 0 || completionRate >= 80;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        course: {
          _id: targetCourse._id,
          coursename: targetCourse.coursename,
          status: targetCourse.status,
          fees: targetCourse.fees,
          completionRequest: targetCourse.completionRequest,
        },
        stats: {
          totalStudents,
          confirmedCount,
          completionRate,
          isEligibleForApproval,
          adminApproved: targetCourse.completionRequest?.adminApproved || false,
        },
        feedbacks,
      },
      "Course completion stats fetched"
    )
  );
});

/**
 * Giảng viên gửi yêu cầu lên Admin xin duyệt hoàn thành khóa học
 */
export const requestCourseCompletionByTeacher = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const teacherId = req.teacher._id;

  const targetCourse = await course.findById(courseId);
  if (!targetCourse) {
    throw new ApiError(404, "Không tìm thấy khóa học");
  }

  if (targetCourse.enrolledteacher.toString() !== teacherId.toString()) {
    throw new ApiError(403, "Bạn không có quyền quản lý khóa học này");
  }

  const totalStudents = targetCourse.enrolledStudent?.length || 0;
  const confirmedCount = await CourseCompletionFeedback.countDocuments({
    courseId,
    isConfirmedEndCourse: true,
  });

  const completionRate =
    totalStudents > 0 ? (confirmedCount / totalStudents) * 100 : 100;

  if (totalStudents > 0 && completionRate < 80) {
    throw new ApiError(
      400,
      `Tỷ lệ học viên hoàn thành form xác nhận mới đạt ${Math.round(
        completionRate
      )}% (Yêu cầu tối thiểu 80%). Thầy/Cô hãy nhắc nhở học viên điền form xác nhận trước khi gửi yêu cầu.`
    );
  }

  targetCourse.status = "completed_pending";
  targetCourse.completionRequest = {
    isRequested: true,
    requestedAt: new Date(),
    adminApproved: false,
    approvedAt: null,
    adminNote: "",
  };
  await targetCourse.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      targetCourse,
      "Đã gửi yêu cầu nghiệm thu hoàn thành khóa học tới Admin thành công"
    )
  );
});

// =========================================================================
// 3. ĐÁNH GIÁ KHÓA HỌC (REVIEW & RATING)
// =========================================================================

/**
 * Học viên gửi đánh giá sao và nhận xét khóa học
 */
export const submitCourseReview = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const studentId = req.Student._id;
  const { rating, comment } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    throw new ApiError(400, "Đánh giá sao phải từ 1 đến 5");
  }

  if (!comment || comment.trim() === "") {
    throw new ApiError(400, "Vui lòng nhập nội dung đánh giá");
  }

  const targetCourse = await course.findById(courseId);
  if (!targetCourse) {
    throw new ApiError(404, "Không tìm thấy khóa học");
  }

  const isEnrolled = targetCourse.enrolledStudent.some(
    (id) => id.toString() === studentId.toString()
  );
  if (!isEnrolled) {
    throw new ApiError(403, "Chỉ học viên đã tham gia khóa học mới được đánh giá");
  }

  const isBadReview = rating <= 2;

  // Lưu hoặc cập nhật review
  const newReview = await CourseReview.findOneAndUpdate(
    { courseId, studentId },
    {
      $set: {
        teacherId: targetCourse.enrolledteacher,
        rating,
        comment,
        isBadReview,
      },
    },
    { new: true, upsert: true }
  );

  // Tính lại điểm trung bình của khóa học
  const allReviews = await CourseReview.find({ courseId });
  const totalReviews = allReviews.length;
  const avgRating =
    allReviews.reduce((sum, r) => sum + r.rating, 0) / (totalReviews || 1);
  const badReviewCount = allReviews.filter((r) => r.isBadReview).length;

  targetCourse.ratingStats = {
    averageRating: parseFloat(avgRating.toFixed(1)),
    totalReviews,
    badReviewCount,
  };
  await targetCourse.save();

  // Nếu là đánh giá xấu (<= 2 sao), gửi thông báo cảnh báo nội bộ tới Giảng viên
  if (isBadReview) {
    await Notification.create({
      recipient: targetCourse.enrolledteacher,
      recipientType: "teacher",
      title: "Khóa học nhận đánh giá tiêu cực",
      message: `Khóa học "${targetCourse.coursename}" vừa nhận 1 đánh giá ${rating} sao với nội dung: "${comment}". Admin sẽ rà soát chất lượng nếu có nhiều phản hồi tiêu cực.`,
      type: "course_warning",
    });
  }

  return res
    .status(200)
    .json(new ApiResponse(200, newReview, "Gửi đánh giá khóa học thành công"));
});

/**
 * Lấy danh sách đánh giá của một khóa học
 */
export const getCourseReviews = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  const reviews = await CourseReview.find({ courseId })
    .populate("studentId", "Firstname Lastname Avatar")
    .sort({ createdAt: -1 });

  return res.status(200).json(new ApiResponse(200, reviews, "Course reviews fetched"));
});
