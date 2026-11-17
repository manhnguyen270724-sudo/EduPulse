import { ApiError } from "../utils/ApiError.js";
import {Teacher} from "../models/teacher.model.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";

const authTeacher = asyncHandler(async(req,_,next)=>{
    const accToken = req.cookies?.Accesstoken

    if(!accToken){
        throw new ApiError(401, "unauthorized req")
    }

    const decodedAccToken = jwt.verify(accToken,
        process.env.ACCESS_TOKEN_SECRET)

    const teacher = await Teacher.findById(decodedAccToken?._id).select("-Password -Refreshtoken")

    if(!teacher){
        throw new ApiError(401, "invalid access token")
    }

    if (teacher.accountStatus === 'suspended') {
        throw new ApiError(403, `Tài khoản giảng viên của bạn đang bị tạm khóa. Lý do: ${teacher.statusReason || "Vi phạm chính sách nền tảng"}`);
    }

    if (teacher.accountStatus === 'banned') {
        throw new ApiError(403, `Tài khoản giảng viên của bạn đã bị cấm vĩnh viễn khỏi hệ thống. Lý do: ${teacher.statusReason || "Vi phạm nghiêm trọng điều khoản dịch vụ"}`);
    }

    req.teacher = teacher
    next()
})

export {authTeacher}