import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema({
  classroom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Classroom",
    required: true,
    index: true
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "senderType"
  },
  senderType: {
    type: String,
    enum: ["student", "teacher"],
    required: true
  },
  senderName: {
    type: String,
    required: true,
    trim: true
  },
  senderAvatar: {
    type: String,
    default: ""
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  attachments: [{
    name: String,
    url: String,
    fileType: String
  }]
}, { timestamps: true });

const ChatMessage = mongoose.model("ChatMessage", chatMessageSchema);

export { ChatMessage };
