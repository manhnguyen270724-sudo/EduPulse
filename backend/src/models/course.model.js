import mongoose from "mongoose"

const courseSchema = new mongoose.Schema({

  coursename: {
    type: String,
    require: true
  },

  description: {
    type: String,
    required: true
  },

  isapproved: {
    type: Boolean,
    default: false
  },

  // === VÒNG ĐỜI KHÓA HỌC ===
  status: {
    type: String,
    enum: ['draft', 'pending_approval', 'active', 'completed_pending', 'completed', 'suspended'],
    default: 'active'
  },

  // === YÊU CẦU DUYỆT HOÀN THÀNH (ĐỂ GIẢNG VIÊN RÚT TIỀN) ===
  completionRequest: {
    isRequested: { type: Boolean, default: false },
    requestedAt: { type: Date },
    adminApproved: { type: Boolean, default: false },
    approvedAt: { type: Date },
    adminNote: { type: String, default: '' }
  },

  // === TẠM DỪNG KHÓA HỌC DO ĐÁNH GIÁ XẤU / KHIẾU NẠI ===
  suspensionInfo: {
    isSuspended: { type: Boolean, default: false },
    reason: { type: String, default: '' },
    suspendedAt: { type: Date },
    warningSentAt: { type: Date }
  },

  // === THỐNG KÊ ĐÁNH GIÁ HỌC VIÊN ===
  ratingStats: {
    averageRating: { type: Number, default: 5.0 },
    totalReviews: { type: Number, default: 0 },
    badReviewCount: { type: Number, default: 0 } // Số review <= 2 sao
  },

  // === PHÂN CẤP MÔN HỌC 3 TẦNG ===
  // Cấp học: primary | secondary | highschool | language | university
  educationLevel: {
    type: String,
    default: 'university',
    enum: ['primary', 'secondary', 'highschool', 'language', 'university']
  },
  // Lớp: '1'-'12', 'on-thi' (luyện thi), '' (không áp dụng)
  grade: {
    type: String,
    default: ''
  },
  // Môn học chi tiết (tên chuẩn hóa)
  subject: {
    type: String,
    default: ''
  },

  // === THÔNG TIN KHÓA HỌC ===
  fees: {
    type: Number,
    default: 0  // 0 = miễn phí (beta)
  },
  maxStudents: {
    type: Number,
    default: 20
  },
  startDate: {
    type: Date,
    default: null
  },

  // === NỘI DUNG GIẢNG DẠY ===
  syllabus: [{
    chapter: { type: String, default: '' },
    content: { type: String, default: '' }
  }],

  outcomes: {
    type: [String],
    default: []
  },

  prerequisites: {
    type: String,
    default: ''
  },

  // === LỚP TRỰC TUYẾN ===
  liveClasses: [{
    title: String,
    timing: Number,
    date: Date,
    link: String,
    status: {
      type: String,
      enum: ['upcoming', 'in-progress', 'completed'],
      default: 'upcoming'
    }
  }],

  enrolledteacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "teacher",
    require: true
  },

  enrolledStudent: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'student'
  }],

  schedule: [{
    day: {
      type: Number,
      enum: [0, 1, 2, 3, 4, 5, 6]
    },
    starttime: {
      type: Number,
      min: 0,
      max: 24 * 60
    },
    endtime: {
      type: Number,
      min: 0,
      max: 24 * 60
    }
  }],

}, { timestamps: true })

const course = mongoose.model('course', courseSchema)

export { course }