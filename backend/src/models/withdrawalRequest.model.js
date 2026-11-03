import mongoose from "mongoose";

const withdrawalRequestSchema = new mongoose.Schema(
  {
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "teacher",
      required: true,
      index: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "course",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
    bankInfo: {
      bankName: {
        type: String,
        required: true,
        trim: true,
      },
      accountNumber: {
        type: String,
        required: true,
        trim: true,
      },
      accountHolderName: {
        type: String,
        required: true,
        trim: true,
      },
      ifscOrBranch: {
        type: String,
        trim: true,
        default: "",
      },
    },
    status: {
      type: String,
      enum: ["pending", "approved", "completed", "rejected"],
      default: "pending",
      index: true,
    },
    adminFeedback: {
      type: String,
      default: "",
    },
    transactionCode: {
      type: String,
      default: "",
    },
    proofImageUrl: {
      type: String,
      default: "",
    },
    processedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

const WithdrawalRequest = mongoose.model(
  "WithdrawalRequest",
  withdrawalRequestSchema
);

export { WithdrawalRequest };
