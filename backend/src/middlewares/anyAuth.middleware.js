import { ApiError } from "../utils/ApiError.js";
import { Teacher } from "../models/teacher.model.js";
import { student } from "../models/student.model.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";

const authAny = asyncHandler(async (req, _, next) => {
  const accToken = req.cookies?.Accesstoken;

  if (!accToken) {
    throw new ApiError(401, "Yêu cầu đăng nhập");
  }

  let decodedAccToken;
  try {
    decodedAccToken = jwt.verify(accToken, process.env.ACCESS_TOKEN_SECRET);
  } catch (err) {
    throw new ApiError(401, "Token không hợp lệ hoặc đã hết hạn");
  }

  // 1. Thử tìm Teacher
  const foundTeacher = await Teacher.findById(decodedAccToken?._id).select("-Password -Refreshtoken");
  if (foundTeacher) {
    req.teacher = foundTeacher;
    return next();
  }

  // 2. Thử tìm Student
  const foundStudent = await student.findById(decodedAccToken?._id).select("-Password -Refreshtoken");
  if (foundStudent) {
    req.Student = foundStudent;
    return next();
  }

  throw new ApiError(401, "Không tìm thấy thông tin tài khoản");
});

export { authAny };
