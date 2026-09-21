import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  startTime: {
    type: String, // e.g. "19:30"
    default: "19:30"
  },
  endTime: {
    type: String, // e.g. "21:00"
    default: "21:00"
  },
  timing: {
    type: Number, // duration in minutes (e.g. 90)
    default: 90
  },
  roomLink: {
    type: String,
    default: "https://meet.google.com/edu-vietnam-live"
  },
  status: {
    type: String,
    enum: ["upcoming", "ongoing", "completed", "cancelled"],
    default: "upcoming"
  },
  notes: {
    type: String,
    default: ""
  }
}, { _id: true, timestamps: true });

const classroomSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "course",
    required: true
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "teacher",
    required: true
  },
  className: {
    type: String,
    required: true,
    trim: true
  },
  classCode: {
    type: String,
    unique: true,
    uppercase: true,
    trim: true
  },
  classType: {
    type: String,
    enum: ["group", "one-on-one"],
    default: "group"
  },
  maxStudents: {
    type: Number,
    default: 20
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "student"
  }],
  status: {
    type: String,
    enum: ["upcoming", "active", "completed", "cancelled"],
    default: "active"
  },
  description: {
    type: String,
    default: ""
  },
  weeklySchedule: [{
    dayOfWeek: {
      type: Number,
      enum: [0, 1, 2, 3, 4, 5, 6], // 0: Chủ nhật, 1: T2,...
      required: true
    },
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    },
    roomLink: {
      type: String,
      default: "https://meet.google.com/edu-vietnam-live"
    }
  }],
  sessions: [sessionSchema],
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date
  }
}, { timestamps: true });

// Tự động sinh mã lớp học nếu chưa có
classroomSchema.pre("save", function(next) {
  if (!this.classCode) {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const prefix = this.classType === "one-on-one" ? "1ON1" : "GRP";
    this.classCode = `EP-${prefix}-${randomSuffix}`;
  }
  if (this.classType === "one-on-one") {
    this.maxStudents = 1;
  }
  next();
});

const Classroom = mongoose.model("Classroom", classroomSchema);

export { Classroom };
