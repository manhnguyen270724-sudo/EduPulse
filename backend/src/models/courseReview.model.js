import mongoose from "mongoose";

const courseReviewSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "course",
      required: true,
      index: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "student",
      required: true,
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "teacher",
      required: true,
      index: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
    // Đánh giá xấu (<= 2 sao) sẽ tự động bật cờ để kích hoạt cảnh báo tới Admin
    isBadReview: {
      type: Boolean,
      default: false,
      index: true,
    },
    // Trạng thái xử lý của Admin đối với đánh giá xấu
    adminActionTaken: {
      status: {
        type: String,
        enum: ["none", "warned", "suspended", "resolved"],
        default: "none",
      },
      warningMessage: {
        type: String,
        default: "",
      },
      actionDate: {
        type: Date,
      },
    },
  },
  { timestamps: true }
);

// Tự động kiểm tra đánh giá xấu trước khi lưu
courseReviewSchema.pre("save", function (next) {
  if (this.rating <= 2) {
    this.isBadReview = true;
  }
  next();
});

const CourseReview = mongoose.model("CourseReview", courseReviewSchema);

export { CourseReview };
