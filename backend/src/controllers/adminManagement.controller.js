import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { course } from "../models/course.model.js";
import { Teacher } from "../models/teacher.model.js";
import { student } from "../models/student.model.js";
import { payment } from "../models/payment.model.js";
import { CourseCompletionFeedback } from "../models/courseCompletionFeedback.model.js";
import { CourseReview } from "../models/courseReview.model.js";
import { WithdrawalRequest } from "../models/withdrawalRequest.model.js";
import { Notification } from "../models/notification.model.js";
import { Sendmail } from "../utils/Nodemailer.js";

// =========================================================================
// 1. QUẢN LÝ DOANH THU & TÀI CHÍNH (REVENUE MANAGEMENT)
// =========================================================================

/**
 * Lấy tổng quan doanh thu nền tảng, số tiền ký quỹ, hoa hồng và giao dịch
 */
export const getRevenueOverview = asyncHandler(async (req, res) => {
  // 1. Lấy tất cả các giao dịch thanh toán thành công
  const payments = await payment
    .find()
    .populate("studentID", "Firstname Lastname Email Avatar")
    .populate("courseID", "coursename subject fees enrolledteacher status completionRequest")
    .sort({ createdAt: -1 });

  // 2. Lấy tất cả khóa học để tính doanh thu theo trạng thái
  const allCourses = await course.find().populate("enrolledteacher", "Firstname Lastname Email");

  let totalGross = 0; // Tổng doanh thu bán khóa học (GMV)
  let totalEscrow = 0; // Tiền đang ký quỹ (các khóa chưa được admin duyệt hoàn thành)
  let totalUnlocked = 0; // Tiền của các khóa đã hoàn thành

  // Tính toán theo từng thanh toán
  for (const p of payments) {
    const courseFee = p.courseID?.fees || 0;
    totalGross += courseFee;

    const isApprovedCompleted = p.courseID?.completionRequest?.adminApproved === true;
    if (isApprovedCompleted) {
      totalUnlocked += courseFee;
    } else {
      totalEscrow += courseFee;
    }
  }

  // Tỷ lệ hoa hồng nền tảng (ví dụ sàn giữ 15%)
  const PLATFORM_COMMISSION_RATE = 0.15;
  const platformRevenue = Math.round(totalGross * PLATFORM_COMMISSION_RATE);
  const teacherShare = totalGross - platformRevenue;

  // 3. Tổng tiền đã giải ngân hoàn tất cho giáo viên
  const completedWithdrawals = await WithdrawalRequest.aggregate([
    { $match: { status: "completed" } },
    { $group: { _id: null, totalWithdrawn: { $sum: "$amount" } } },
  ]);
  const totalWithdrawn = completedWithdrawals[0]?.totalWithdrawn || 0;

  // Lệnh rút tiền đang chờ xử lý
  const pendingWithdrawalCount = await WithdrawalRequest.countDocuments({ status: "pending" });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        summary: {
          totalGross,
          platformRevenue,
          teacherShare,
          totalEscrow,
          totalUnlocked,
          totalWithdrawn,
          pendingWithdrawalCount,
          totalTransactions: payments.length,
        },
        recentTransactions: payments.slice(0, 30),
      },
      "Revenue overview fetched successfully"
    )
  );
});

/**
 * Lấy danh sách tất cả các yêu cầu rút tiền của giảng viên
 */
export const getAllWithdrawalRequests = asyncHandler(async (req, res) => {
  const requests = await WithdrawalRequest.find()
    .populate("teacherId", "Firstname Lastname Email Balance")
    .populate("courseId", "coursename subject fees completionRequest")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, requests, "Withdrawal requests fetched successfully"));
});

/**
 * Admin duyệt hoặc từ chối lệnh rút tiền của giảng viên
 */
export const handleWithdrawalRequest = asyncHandler(async (req, res) => {
  const { requestId } = req.params;
  const { status, adminFeedback, transactionCode } = req.body;

  if (!["approved", "completed", "rejected"].includes(status)) {
    throw new ApiError(400, "Trạng thái không hợp lệ (approved, completed, rejected)");
  }

  const withdrawReq = await WithdrawalRequest.findById(requestId)
    .populate("teacherId")
    .populate("courseId");

  if (!withdrawReq) {
    throw new ApiError(404, "Không tìm thấy yêu cầu rút tiền");
  }

  if (withdrawReq.status === "completed") {
    throw new ApiError(400, "Yêu cầu rút tiền này đã hoàn tất trước đó");
  }

  const teacher = await Teacher.findById(withdrawReq.teacherId._id);
  if (!teacher) {
    throw new ApiError(404, "Không tìm thấy giảng viên");
  }

  // Nếu duyệt hoàn thành
  if (status === "completed") {
    if (teacher.Balance < withdrawReq.amount) {
      throw new ApiError(400, "Số dư khả dụng của giảng viên không đủ để giải ngân");
    }

    teacher.Balance -= withdrawReq.amount;
    teacher.WithdrawalHistory.push({
      amount: withdrawReq.amount,
      date: new Date(),
    });
    await teacher.save();

    withdrawReq.status = "completed";
    withdrawReq.transactionCode = transactionCode || `TXN-${Date.now()}`;
    withdrawReq.processedAt = new Date();
    withdrawReq.adminFeedback = adminFeedback || "Đã giải ngân chuyển khoản thành công";
    await withdrawReq.save();

    // Gửi thông báo và email
    await Notification.create({
      recipient: teacher._id,
      recipientType: "teacher",
      title: "Giải ngân thành công",
      message: `Yêu cầu rút ${withdrawReq.amount.toLocaleString(
        "vi-VN"
      )}đ của bạn đã được giải ngân thành công (Mã GD: ${withdrawReq.transactionCode}).`,
      type: "payout",
    });

    Sendmail(
      teacher.Email,
      "EduPulse - Thông Báo Giải Ngân Thành Công",
      `<h3>Xin chào Thầy/Cô ${teacher.Firstname},</h3>
       <p>Yêu cầu rút tiền cho khóa học <strong>${withdrawReq.courseId?.coursename || ""}</strong> đã được duyệt.</p>
       <p><strong>Số tiền:</strong> ${withdrawReq.amount.toLocaleString("vi-VN")} VNĐ</p>
       <p><strong>Mã giao dịch:</strong> ${withdrawReq.transactionCode}</p>
       <p>Tiền đã được chuyển vào tài khoản ngân hàng của Thầy/Cô. Chúc Thầy/Cô tiếp tục có những khóa học thành công!</p>`
    );
  } else if (status === "rejected") {
    withdrawReq.status = "rejected";
    withdrawReq.adminFeedback = adminFeedback || "Yêu cầu bị từ chối";
    withdrawReq.processedAt = new Date();
    await withdrawReq.save();

    await Notification.create({
      recipient: teacher._id,
      recipientType: "teacher",
      title: "Yêu cầu rút tiền bị từ chối",
      message: `Yêu cầu rút tiền bị từ chối với lý do: ${withdrawReq.adminFeedback}`,
      type: "payout",
    });
  } else {
    withdrawReq.status = "approved";
    withdrawReq.adminFeedback = adminFeedback || "Đang xử lý chuyển khoản";
    await withdrawReq.save();
  }

  return res
    .status(200)
    .json(new ApiResponse(200, withdrawReq, "Cập nhật trạng thái yêu cầu rút tiền thành công"));
});

// =========================================================================
// 2. QUẢN LÝ TÀI KHOẢN NGƯỜI DÙNG (USER MANAGEMENT)
// =========================================================================

/**
 * Lấy danh sách toàn bộ người dùng (Học viên & Giảng viên)
 */
export const getAllUsers = asyncHandler(async (req, res) => {
  const { role = "all", search = "", status = "all" } = req.query;

  const searchRegex = new RegExp(search, "i");

  let studentsList = [];
  let teachersList = [];

  if (role === "all" || role === "student") {
    const studentQuery = {
      $or: [
        { Firstname: searchRegex },
        { Lastname: searchRegex },
        { Email: searchRegex },
      ],
    };
    if (status !== "all") {
      studentQuery.accountStatus = status;
    }
    studentsList = await student
      .find(studentQuery)
      .select("-Password -Refreshtoken")
      .sort({ createdAt: -1 });
  }

  if (role === "all" || role === "teacher") {
    const teacherQuery = {
      $or: [
        { Firstname: searchRegex },
        { Lastname: searchRegex },
        { Email: searchRegex },
      ],
    };
    if (status !== "all") {
      teacherQuery.accountStatus = status;
    }
    teachersList = await Teacher
      .find(teacherQuery)
      .select("-Password -Refreshtoken")
      .sort({ createdAt: -1 });
  }

  const combined = [
    ...studentsList.map((s) => ({ ...s.toObject(), userRole: "student" })),
    ...teachersList.map((t) => ({ ...t.toObject(), userRole: "teacher" })),
  ];

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        total: combined.length,
        studentsCount: studentsList.length,
        teachersCount: teachersList.length,
        users: combined,
      },
      "Users fetched successfully"
    )
  );
});

/**
 * Khóa hoặc Mở khóa tài khoản (Ban / Suspend / Unban)
 */
export const toggleUserStatus = asyncHandler(async (req, res) => {
  const { userId, role } = req.params;
  const { status, reason } = req.body;

  if (!["active", "suspended", "banned"].includes(status)) {
    throw new ApiError(400, "Trạng thái không hợp lệ (active, suspended, banned)");
  }

  let updatedUser = null;

  if (role === "student") {
    updatedUser = await student.findByIdAndUpdate(
      userId,
      { $set: { accountStatus: status, statusReason: reason || "" } },
      { new: true }
    ).select("-Password -Refreshtoken");
  } else if (role === "teacher") {
    updatedUser = await Teacher.findByIdAndUpdate(
      userId,
      { $set: { accountStatus: status, statusReason: reason || "" } },
      { new: true }
    ).select("-Password -Refreshtoken");
  } else {
    throw new ApiError(400, "Role không hợp lệ");
  }

  if (!updatedUser) {
    throw new ApiError(404, "Không tìm thấy người dùng");
  }

  // Gửi mail thông báo nếu tài khoản bị khóa
  if (status === "suspended" || status === "banned") {
    Sendmail(
      updatedUser.Email,
      "EduPulse - Cảnh Báo Tài Khoản",
      `<h3>Kính chào ${updatedUser.Firstname} ${updatedUser.Lastname},</h3>
       <p>Tài khoản của bạn trên nền tảng EduPulse đã chuyển sang trạng thái: <strong>${status.toUpperCase()}</strong>.</p>
       <p><strong>Lý do:</strong> ${reason || "Vi phạm quy định tiêu chuẩn cộng đồng"}</p>
       <p>Vui lòng liên hệ ban quản trị để được hỗ trợ giải trình.</p>`
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, `Cập nhật trạng thái người dùng thành ${status}`));
});

// =========================================================================
// 3. XÁC NHẬN HOÀN THÀNH KHÓA HỌC (COURSE COMPLETION APPROVAL)
// =========================================================================

/**
 * Lấy danh sách các khóa học chờ Admin duyệt hoàn thành
 */
export const getCompletionPendingCourses = asyncHandler(async (req, res) => {
  // Lấy các khóa học đã được giảng viên yêu cầu hoàn thành hoặc có trạng thái completed_pending
  const coursesList = await course
    .find({
      $or: [
        { "completionRequest.isRequested": true, "completionRequest.adminApproved": false },
        { status: "completed_pending" },
      ],
    })
    .populate("enrolledteacher", "Firstname Lastname Email Balance")
    .populate("enrolledStudent", "Firstname Lastname Email");

  // Đính kèm thống kê tỷ lệ học viên nộp form xác nhận
  const detailedList = await Promise.all(
    coursesList.map(async (c) => {
      const totalEnrolled = c.enrolledStudent?.length || 0;
      const confirmedFeedbackCount = await CourseCompletionFeedback.countDocuments({
        courseId: c._id,
        isConfirmedEndCourse: true,
      });

      const completionRate =
        totalEnrolled > 0
          ? Math.round((confirmedFeedbackCount / totalEnrolled) * 100)
          : 0;

      return {
        ...c.toObject(),
        stats: {
          totalEnrolled,
          confirmedFeedbackCount,
          completionRate,
          canApprove: completionRate >= 80 || totalEnrolled === 0,
        },
      };
    })
  );

  return res
    .status(200)
    .json(new ApiResponse(200, detailedList, "Completion pending courses fetched"));
});

/**
 * Admin xác nhận khóa học đã hoàn thành -> Mở khóa doanh thu cho giáo viên rút tiền
 */
export const approveCourseCompletion = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const { adminNote } = req.body;

  const targetCourse = await course
    .findById(courseId)
    .populate("enrolledteacher")
    .populate("enrolledStudent");

  if (!targetCourse) {
    throw new ApiError(404, "Không tìm thấy khóa học");
  }

  const totalEnrolled = targetCourse.enrolledStudent?.length || 0;
  const confirmedFeedbackCount = await CourseCompletionFeedback.countDocuments({
    courseId: targetCourse._id,
    isConfirmedEndCourse: true,
  });

  const completionRate =
    totalEnrolled > 0 ? (confirmedFeedbackCount / totalEnrolled) * 100 : 100;

  // Cảnh báo nếu tỷ lệ xác nhận quá thấp (< 50%) trừ khi lớp không có học viên
  if (totalEnrolled > 0 && completionRate < 50) {
    throw new ApiError(
      400,
      `Tỷ lệ học viên xác nhận kết thúc mới đạt ${Math.round(
        completionRate
      )}% (dưới 50%). Chưa đủ điều kiện nghiệm thu hoàn thành.`
    );
  }

  // Cập nhật trạng thái khóa học
  targetCourse.status = "completed";
  targetCourse.completionRequest.adminApproved = true;
  targetCourse.completionRequest.approvedAt = new Date();
  targetCourse.completionRequest.adminNote = adminNote || "Admin đã nghiệm thu hoàn thành khóa học";
  await targetCourse.save();

  // Mở khóa doanh thu: Tính doanh thu từ khóa học này và cộng vào Balance khả dụng của giáo viên
  const teacher = await Teacher.findById(targetCourse.enrolledteacher._id);
  if (teacher) {
    const courseFee = targetCourse.fees || 0;
    // Giảng viên nhận 85% học phí (sàn giữ 15%)
    const TEACHER_PERCENTAGE = 0.85;
    const earnedAmount = Math.round(courseFee * totalEnrolled * TEACHER_PERCENTAGE);

    teacher.Balance = (teacher.Balance || 0) + earnedAmount;
    await teacher.save();

    // Thông báo cho giảng viên
    await Notification.create({
      recipient: teacher._id,
      recipientType: "teacher",
      title: "Khóa học đã được duyệt hoàn thành",
      message: `Khóa học "${targetCourse.coursename}" đã được Admin nghiệm thu thành công. Số tiền ${earnedAmount.toLocaleString(
        "vi-VN"
      )}đ đã được mở khóa vào ví khả dụng để Thầy/Cô có thể tạo lệnh rút tiền.`,
      type: "course_completed",
      link: `/Teacher/Dashboard/${teacher._id}/Home`,
    });

    Sendmail(
      teacher.Email,
      "EduPulse - Xác Nhận Nghiệm Thu Khóa Học Thành Công",
      `<h3>Chúc mừng Thầy/Cô ${teacher.Firstname}!</h3>
       <p>Khóa học <strong>${targetCourse.coursename}</strong> đã được Admin phê duyệt nghiệm thu hoàn thành.</p>
       <p><strong>Tỷ lệ học viên xác nhận:</strong> ${Math.round(completionRate)}%</p>
       <p><strong>Doanh thu được mở khóa vào ví:</strong> ${earnedAmount.toLocaleString("vi-VN")} VNĐ</p>
       <p>Bây giờ Thầy/Cô có thể vào mục Remuneration để gửi yêu cầu rút tiền về tài khoản ngân hàng.</p>`
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, targetCourse, "Đã phê duyệt hoàn thành khóa học thành công"));
});

// =========================================================================
// 4. CẢNH BÁO ĐÁNH GIÁ XẤU & TẠM DỪNG KHÓA HỌC (BAD REVIEWS & SUSPEND)
// =========================================================================

/**
 * Lấy danh sách các đánh giá xấu (rating <= 2) và cảnh báo
 */
export const getBadReviewsAlerts = asyncHandler(async (req, res) => {
  const badReviews = await CourseReview.find({
    $or: [{ isBadReview: true }, { rating: { $lte: 2 } }],
  })
    .populate("studentId", "Firstname Lastname Email")
    .populate("courseId", "coursename subject status fees suspensionInfo")
    .populate("teacherId", "Firstname Lastname Email")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, badReviews, "Bad reviews alerts fetched successfully"));
});

/**
 * Admin tạm dừng khóa học và gửi mail + thông báo cảnh báo tới Giảng viên
 */
export const suspendCourseWithWarning = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const { reason, reviewId } = req.body;

  if (!reason || reason.trim() === "") {
    throw new ApiError(400, "Vui lòng nhập lý do cảnh báo / tạm dừng khóa học");
  }

  const targetCourse = await course.findById(courseId).populate("enrolledteacher");
  if (!targetCourse) {
    throw new ApiError(404, "Không tìm thấy khóa học");
  }

  // Cập nhật trạng thái tạm dừng khóa học
  targetCourse.status = "suspended";
  targetCourse.suspensionInfo = {
    isSuspended: true,
    reason: reason,
    suspendedAt: new Date(),
    warningSentAt: new Date(),
  };
  await targetCourse.save();

  // Nếu có liên kết với review cụ thể
  if (reviewId) {
    await CourseReview.findByIdAndUpdate(reviewId, {
      $set: {
        adminActionTaken: {
          status: "suspended",
          warningMessage: reason,
          actionDate: new Date(),
        },
      },
    });
  }

  const teacher = targetCourse.enrolledteacher;

  // Gửi In-app Notification cho Giảng viên
  await Notification.create({
    recipient: teacher._id,
    recipientType: "teacher",
    title: "CẢNH BÁO: Khóa học bị tạm dừng do đánh giá tiêu cực",
    message: `Khóa học "${targetCourse.coursename}" đã bị tạm dừng hoạt động. Lý do: ${reason}. Vui lòng kiểm tra email để biết hướng dẫn giải trình.`,
    type: "course_warning",
    link: `/Teacher/Dashboard/${teacher._id}/Courses`,
  });

  // Gửi Email Cảnh báo chính thức
  Sendmail(
    teacher.Email,
    `[EduPulse - CẢNH BÁO QUAN TRỌNG] Tạm dừng khóa học "${targetCourse.coursename}"`,
    `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b;">
      <h2 style="color: #e11d48;">CẢNH BÁO VI PHẠM CHẤT LƯỢNG GIẢNG DẠY</h2>
      <p>Kính gửi Thầy/Cô <strong>${teacher.Firstname} ${teacher.Lastname}</strong>,</p>
      <p>Hệ thống quản trị EduPulse ghi nhận phản ánh tiêu cực / đánh giá xấu từ học viên đối với khóa học: <strong>${targetCourse.coursename}</strong>.</p>
      <div style="background: #fff1f2; border-left: 4px solid #e11d48; padding: 12px; margin: 15px 0;">
        <p style="margin: 0; color: #9f1239;"><strong>Lý do tạm dừng:</strong> ${reason}</p>
      </div>
      <p>Khóa học hiện đã được chuyển sang trạng thái <strong>TẠM DỪNG (SUSPENDED)</strong> và ẩn khỏi danh sách tìm kiếm công khai.</p>
      <p>Thầy/Cô vui lòng phản hồi và làm việc với ban quản trị EduPulse trong vòng 48 giờ để được hỗ trợ mở lại khóa học.</p>
      <p>Trân trọng,<br/><strong>Ban Quản Trị EduPulse</strong></p>
    </div>`
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      targetCourse,
      "Đã tạm dừng khóa học và gửi mail cảnh báo tới giảng viên thành công"
    )
  );
});

/**
 * Mở lại khóa học sau khi giảng viên đã giải trình
 */
export const liftCourseSuspension = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  const targetCourse = await course.findById(courseId).populate("enrolledteacher");
  if (!targetCourse) {
    throw new ApiError(404, "Không tìm thấy khóa học");
  }

  targetCourse.status = "active";
  targetCourse.suspensionInfo = {
    isSuspended: false,
    reason: "",
    suspendedAt: null,
    warningSentAt: null,
  };
  await targetCourse.save();

  const teacher = targetCourse.enrolledteacher;
  if (teacher) {
    await Notification.create({
      recipient: teacher._id,
      recipientType: "teacher",
      title: "Khóa học đã được mở lại",
      message: `Khóa học "${targetCourse.coursename}" đã được gỡ bỏ tạm dừng và hoạt động bình thường.`,
      type: "system",
      link: `/Teacher/Dashboard/${teacher._id}/Courses`,
    });
  }

  return res
    .status(200)
    .json(new ApiResponse(200, targetCourse, "Đã mở lại khóa học thành công"));
});
