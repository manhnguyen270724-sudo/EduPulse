import mongoose from "mongoose";

const courseCompletionFeedbackSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "course",
      required: true,
      index: true,
    },
    classroomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Classroom",
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "student",
      required: true,
      index: true,
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "teacher",
      required: true,
    },
    // Học viên xác nhận đã hoàn thành đủ số buổi / chương trình học
    hasCompletedAllLessons: {
      type: Boolean,
      default: true,
      required: true,
    },
    // Đánh giá mức độ hài lòng về thời lượng và điểm danh (1-5 sao)
    attendanceSatisfaction: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
    // Đánh giá chất lượng giảng dạy của giảng viên (1-5 sao)
    teachingQualitySatisfaction: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
    // Phản hồi chi tiết
    feedbackContent: {
      type: String,
      trim: true,
      default: "",
    },
    // Báo cáo nếu có vấn đề (nghỉ học không bù, kết thúc trước thời hạn, ...)
    issuesReported: {
      type: String,
      trim: true,
      default: "",
    },
    // Cam kết xác nhận kết thúc khóa học
    isConfirmedEndCourse: {
      type: Boolean,
      default: true,
      required: true,
    },
  },
  { timestamps: true }
);

// Một học viên chỉ nộp form xác nhận 1 lần cho 1 khóa học
courseCompletionFeedbackSchema.index({ courseId: 1, studentId: 1 }, { unique: true });

const CourseCompletionFeedback = mongoose.model(
  "CourseCompletionFeedback",
  courseCompletionFeedbackSchema
);

export { CourseCompletionFeedback };
