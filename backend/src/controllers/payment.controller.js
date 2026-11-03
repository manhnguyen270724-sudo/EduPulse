import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {instance}  from "../app.js"
import crypto from "crypto"
import {payment} from "../models/payment.model.js"
import { Teacher } from "../models/teacher.model.js";


const coursePayment = asyncHandler(async(req,res)=>{
    const {fees, } = req.body

    if(!fees){
      throw new ApiError(400,"fees is required")
    }

    const options = {
        amount: fees,  // amount in the smallest currency unit
        currency: "INR",
        receipt: "order_rcptid_11"
      };
      const order = await instance.orders.create(options)

      return res
      .status(200)
      .json( new ApiResponse(200, order,"order fetched"))
})


const getkey = asyncHandler(async(req,res)=>{
  return res
  .status(200)
  .json(new ApiResponse(200,{key:process.env.KEY_ID}, "razor key fetched"))
})


const coursePaymentConfirmation = asyncHandler(async(req,res)=>{
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;
  
  const studentID = req.Student._id
  const courseID = req.params.courseID
  console.log(courseID)

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {

    const orderDetails = await payment.create({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      courseID, 
      studentID,
    });

    return res
    .status(200)
    .json(new ApiResponse(200,{orderDetails}, "payment confirmed" ))
  } else {
    throw new ApiError(400, "payment failed")
  }
})


const teacherAmount = asyncHandler(async(req,res)=>{
  const teacher = req.teacher

  const newEnrolledStudentCount = await Teacher.aggregate([
    {
      $match: { _id: teacher._id }
    },
    {
      $unwind: "$enrolledStudent"
    },
    {
      $match: { "enrolledStudent.isNewEnrolled": true }
    },
    {
      $group: {
        _id: null,
        count: { $sum: 1 }
      }
    }
  ]);

  const count = newEnrolledStudentCount.length > 0 ? newEnrolledStudentCount[0].count : 0;


  await Teacher.findByIdAndUpdate(
    teacher._id,
    { $inc: { Balance: count * 500 } },
   
  );

  const newTeacher = await Teacher.findOneAndUpdate(
    { _id: teacher._id, "enrolledStudent.isNewEnrolled": true },
    { $set: { "enrolledStudent.$[elem].isNewEnrolled": false } },
    { 
        new: true,
        arrayFilters: [{ "elem.isNewEnrolled": true }],
    }
  );

  if(!newTeacher){
    const newTeacher = await Teacher.findById(
      teacher._id
    )

    return res
    .status(200)
    .json(new ApiResponse(200, {newTeacher}, "balance"))
  }


  return res
  .status(200)
  .json(new ApiResponse(200, {newTeacher}, "balance"))
  
})


import { CourseCompletionFeedback } from "../models/courseCompletionFeedback.model.js";
import { WithdrawalRequest } from "../models/withdrawalRequest.model.js";
import { course } from "../models/course.model.js";

/**
 * RÀNG BUỘC RÚT TIỀN CỦA GIẢNG VIÊN:
 * 1. Admin phải xác nhận khóa học đã hoàn thành
 * 2. Học viên trong lớp học phải hoàn thành form xác nhận kết thúc khóa học (tối thiểu 80%)
 */
const withdrawAmount = asyncHandler(async(req,res)=>{
  const teacherId = req.teacher._id;
  const { amount, courseId, bankName, accountNumber, accountHolderName, ifscOrBranch } = req.body;

  if (!amount || Number(amount) <= 0) {
    throw new ApiError(400, "Vui lòng nhập số tiền rút hợp lệ (lớn hơn 0)");
  }

  const teacher = await Teacher.findById(teacherId);
  if (!teacher) {
    throw new ApiError(404, "Không tìm thấy giảng viên");
  }

  // Nếu giáo viên chỉ định rút theo khóa học cụ thể, kiểm tra điều kiện nghiêm ngặt
  if (courseId) {
    const targetCourse = await course.findById(courseId);
    if (!targetCourse) {
      throw new ApiError(404, "Không tìm thấy khóa học cần rút tiền");
    }

    if (targetCourse.enrolledteacher.toString() !== teacherId.toString()) {
      throw new ApiError(403, "Bạn không phải là giảng viên của khóa học này");
    }

    // Điều kiện 1: Admin phải duyệt hoàn thành khóa học
    if (!targetCourse.completionRequest?.adminApproved) {
      throw new ApiError(
        400,
        "ĐIỀU KIỆN RÚT TIỀN CHƯA THỎA MÃN: Khóa học này chưa được Admin phê duyệt nghiệm thu hoàn thành. Vui lòng gửi yêu cầu nghiệm thu và đợi Admin xác nhận."
      );
    }

    // Điều kiện 2: Học viên phải hoàn thành form xác nhận kết thúc khóa học
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
        `ĐIỀU KIỆN RÚT TIỀN CHƯA THỎA MÃN: Mới có ${confirmedCount}/${totalStudents} (${Math.round(
          completionRate
        )}%) học viên hoàn thành form xác nhận kết thúc khóa học. Yêu cầu tối thiểu đạt 80% học viên xác nhận mới được phép rút tiền.`
      );
    }
  }

  if (teacher.Balance < amount) {
    throw new ApiError(400, `Số dư khả dụng không đủ. Số dư hiện tại: ${teacher.Balance.toLocaleString('vi-VN')}đ`);
  }

  // Tạo yêu cầu rút tiền minh bạch để Admin đối soát giải ngân
  const newWithdrawalReq = await WithdrawalRequest.create({
    teacherId,
    courseId: courseId || null,
    amount: Number(amount),
    bankInfo: {
      bankName: bankName || "Ngân hàng",
      accountNumber: accountNumber || "STK",
      accountHolderName: accountHolderName || `${teacher.Firstname} ${teacher.Lastname}`,
      ifscOrBranch: ifscOrBranch || "",
    },
    status: "pending",
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        withdrawalRequest: newWithdrawalReq,
        currentBalance: teacher.Balance,
      },
      "Đã tạo yêu cầu rút tiền thành công. Tiền sẽ được Admin giải ngân sau khi đối soát."
    )
  );
});

/**
 * Lấy chi tiết thu nhập, tiền ký quỹ, trạng thái khóa học của giảng viên
 */
const getTeacherEarningsOverview = asyncHandler(async(req, res) => {
  const teacherId = req.teacher._id;

  const teacher = await Teacher.findById(teacherId);
  const teacherCourses = await course.find({ enrolledteacher: teacherId });

  // Phân tích trạng thái từng khóa học
  const coursesBreakdown = await Promise.all(
    teacherCourses.map(async (c) => {
      const totalStudents = c.enrolledStudent?.length || 0;
      const confirmedCount = await CourseCompletionFeedback.countDocuments({
        courseId: c._id,
        isConfirmedEndCourse: true,
      });

      const completionRate =
        totalStudents > 0 ? Math.round((confirmedCount / totalStudents) * 100) : 100;

      const adminApproved = c.completionRequest?.adminApproved || false;
      const isEligibleToWithdraw = adminApproved && (completionRate >= 80 || totalStudents === 0);

      const courseGross = (c.fees || 0) * totalStudents;
      const courseEarned = Math.round(courseGross * 0.85); // 85% cho GV

      return {
        _id: c._id,
        coursename: c.coursename,
        fees: c.fees,
        status: c.status,
        totalStudents,
        confirmedCount,
        completionRate,
        adminApproved,
        isEligibleToWithdraw,
        courseEarned,
        isSuspended: c.suspensionInfo?.isSuspended || false,
        suspensionReason: c.suspensionInfo?.reason || "",
      };
    })
  );

  // Lịch sử các lệnh rút tiền
  const withdrawalHistory = await WithdrawalRequest.find({ teacherId })
    .populate("courseId", "coursename")
    .sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        balance: teacher.Balance || 0,
        coursesBreakdown,
        withdrawalHistory,
      },
      "Teacher earnings overview fetched"
    )
  );
});

export { coursePayment, getkey, coursePaymentConfirmation, teacherAmount, withdrawAmount, getTeacherEarningsOverview };