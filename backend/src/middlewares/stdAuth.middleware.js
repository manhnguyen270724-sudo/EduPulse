import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {student} from "../models/student.model.js";
import jwt from "jsonwebtoken";

const authSTD = asyncHandler(async(req,_,next) =>{

    const accToken = req.cookies?.Accesstoken

    if(!accToken) {
        throw new ApiError(401, "unauthorized req")
    }

    const decodedAccToken = jwt.verify(accToken,
        process.env.ACCESS_TOKEN_SECRET)

    const Student = await student.findById(decodedAccToken?._id).select("-Password -Refreshtoken")

    if(!Student){
        throw new ApiError(401, "invalid access token")
    }

    if (Student.accountStatus === 'suspended') {
        throw new ApiError(403, `Tài khoản của bạn đang bị tạm khóa. Lý do: ${Student.statusReason || "Vi phạm chính sách nền tảng"}`);
    }

    if (Student.accountStatus === 'banned') {
        throw new ApiError(403, `Tài khoản của bạn đã bị cấm vĩnh viễn khỏi hệ thống. Lý do: ${Student.statusReason || "Vi phạm nghiêm trọng điều khoản dịch vụ"}`);
    }

    req.Student = Student
    next()

    
})

export { authSTD }