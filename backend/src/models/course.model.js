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