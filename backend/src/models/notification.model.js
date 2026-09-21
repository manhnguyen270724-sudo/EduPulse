import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "recipientType"
  },
  recipientType: {
    type: String,
    enum: ["student", "teacher"],
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ["class_reminder", "chat_message", "class_enrolled", "system"],
    default: "class_reminder"
  },
  relatedClass: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Classroom"
  },
  relatedSessionId: {
    type: mongoose.Schema.Types.ObjectId
  },
  link: {
    type: String,
    default: ""
  },
  isRead: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const Notification = mongoose.model("Notification", notificationSchema);

export { Notification };
