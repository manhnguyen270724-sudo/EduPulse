import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { admin } from "../models/admin.model.js";
import { student, studentdocs } from "../models/student.model.js";
import { Teacher, Teacherdocs } from "../models/teacher.model.js";
import { contact } from "../models/contact.model.js";
import { course } from "../models/course.model.js";
import { Notification } from "../models/notification.model.js";
import {Sendmail} from "../utils/Nodemailer.js"


const adminSignUp = asyncHandler(async(req,res)=>{
    const {username, password} = req.body

    if([username, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const existedAdmin = await admin.findOne({ username})

    if(existedAdmin){
        throw new ApiError(400, "admin already exist")
    }

    const newAdmin = await admin.create({
        username,
        password,
    })

    if(!newAdmin){
        throw new ApiError(400, "failed to add admin")
    }

    return res 
    .status(200)
    .json(new ApiResponse(400,{}, "admin added successfully"))

})

const generateAccessAndRefreshTokens = async (admindID) =>{ 
    try {
        
        const Admin = await admin.findById(admindID)
        
        const Accesstoken = Admin.generateAccessToken()
        const Refreshtoken = Admin.generateRefreshToken()

        Admin.Refreshtoken = Refreshtoken
        await Admin.save({validateBeforeSave:false})

        return{Accesstoken, Refreshtoken}

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

const adminLogin = asyncHandler(async(req,res)=>{

    const {username, password} = req.body

    if([username, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const loggedAdmin = await admin.findOne({username})

    if(!loggedAdmin){
        throw new ApiError(400, "admin does not exist")
    }

    const passwordCheck = await loggedAdmin.isPasswordCorrect(password)

    if(!passwordCheck){
        throw new ApiError(400, "Password is incorrect")
    }

    const temp_admin = loggedAdmin._id

    const {Accesstoken, Refreshtoken} =  await generateAccessAndRefreshTokens(temp_admin)

    const loggedadmin = await admin.findById(temp_admin).select("-password -Refreshtoken")

    const options = {
        httpOnly:true,
        secure:true,
    }

    return res 
    .status(200)
    .cookie("Accesstoken", Accesstoken, options)
    .cookie("Refreshtoken", Refreshtoken, options)
    .json(new ApiResponse(200,{admin:loggedadmin}, "logged in successfully"))
})

const adminLogout = asyncHandler(async(req,res)=>{

    await admin.findByIdAndUpdate(
        req.Admin._id,
        {
            $set:{
                Refreshtoken:undefined,
            }
        },
        {
            new:true
        }
    )
    const options ={
        httpOnly:true,
        secure:true,
    }

    return res
    .status(200)
    .clearCookie("Accesstoken", options)
    .clearCookie("Refreshtoken",  options)
    .json(new ApiResponse(200, {}, "admin logged out"))
})

const forApproval = asyncHandler(async(req,res)=>{

    const adminID = req.params.adminID

    if(!adminID || String(req.Admin._id) !== String(adminID)){
        throw new ApiError(403, "Không có quyền quản trị viên")
    }

    const loggedAdmin = await admin.findById(adminID)

    if(!loggedAdmin){
        throw new ApiError(403, "admin not found")
    }


    const studentsforApproval = await student.find({
        Isverified: true
    })

    const teachersforApproval = await Teacher.find({
        Isverified: true
    })

    if(!studentsforApproval && !teachersforApproval){
        return res
        .status(200)
        .json(new ApiResponse(200, loggedAdmin, "No pending student or teacher"))
    }

    return res
    .status(200)
    .json(new ApiResponse(200,{admin:loggedAdmin, studentsforApproval
    , teachersforApproval}, "fetched successfully"))
})

const approveStudent = asyncHandler(async(req,res)=>{

    const adminID = req.params.adminID

    if(!adminID || String(req.Admin._id) !== String(adminID)){
        throw new ApiError(403, "Không có quyền quản trị viên")
    }

    const loggedAdmin = await admin.findById(adminID)

    if(!loggedAdmin){
        throw new ApiError(403, "admin not found")
    }


    const studentID = req.params.studentID


    if(!studentID){
        throw new ApiError(400, "student id is required")
    }

    const toApprove = req.body.Isapproved

    const email = req.body.email

    const remarks = req.body.remarks || null

    if (!toApprove || (toApprove != "approved" && toApprove != "rejected" && toApprove !== "reupload")) {
        throw new ApiError(400, "Please choose 'approve' or 'reject' or 'reupload'");
    }

    const theStudent = await student.findOneAndUpdate({_id: studentID}, {$set: {Isapproved:toApprove, Remarks: remarks}},  { new: true })
    
    if(!theStudent){
        throw new ApiError(400,"faild to approve or reject || student not found")
    }

    
    console.log("email", email);

    await Sendmail(email, `Document Verification Status`, 
        `<html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h1 style="color: #4CAF50; text-align: center;">Document Verification Status!</h1>
            <p style="font-size: 16px; text-align: center;">We have completed the verification process for the documents you submitted. Your document verification status is: ${toApprove}</p>
            <p style="font-size: 16px;">Remarks: ${remarks}</p>
            <p style="font-size: 16px;">Best regards,</p>
            <p style="font-size: 16px;"><strong>The EduPulse Team</strong></p>
            <p style="font-size: 14px;">&copy; 2024 EduPulse. All rights reserved.</p>
            </body>
        </html>`
    )

    return res
    .status(200)
    .json(new ApiResponse(200, theStudent, `task done successfully`))

})

const approveTeacher = asyncHandler(async(req,res)=>{

    const adminID = req.params.adminID

    if(!adminID){
        throw new ApiError(400, "not authorized")
    }

    const loggedAdmin = await admin.findById(adminID)

    if(!loggedAdmin){
        throw new ApiError(400, "admin not found")
    }


    const teacherID = req.params.teacherID

    if(!teacherID){
        throw new ApiError(400, "student id is required")
    }

    const toApprove = req.body.Isapproved
    const email = req.body.email
    const remarks = req.body.remarks || null

    if (!toApprove || (toApprove !== "approved" && toApprove !== "rejected" && toApprove !== "reupload")) {
        throw new ApiError(400, "Please choose 'approve' or 'reject' or 'reupload'");
    }

    const theTeacher = await Teacher.findOneAndUpdate({_id: teacherID}, {$set: {Isapproved:toApprove, Remarks: remarks}},  { new: true })
    
    if(!theTeacher){
        throw new ApiError(400,"faild to approve or reject || student not found")
    }

    await Sendmail(email, `Document Verification Status`, 
        `<html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h1 style="color: #4CAF50; text-align: center;">Document Verification Status!</h1>
            <p style="font-size: 16px; text-align: center;">We have completed the verification process for the documents you submitted. Your document verification status is: ${toApprove}</p>
            <p style="font-size: 16px;">Remarks: ${remarks}</p>
            <p style="font-size: 16px;">Best regards,</p>
            <p style="font-size: 16px;"><strong>The EduPulse Team</strong></p>
            <p style="font-size: 14px;">&copy; 2024 EduPulse. All rights reserved.</p>
            </body>
        </html>`
    )

    return res
    .status(200)
    .json(new ApiResponse(200, theTeacher, `task done successfully`))

})

const checkStudentDocuments = asyncHandler(async(req,res)=>{
    const adminID = req.params.adminID

    if(!adminID){
        throw new ApiError(400, "not authorized")
    }
    
    const loggedAdmin = await admin.findById(adminID)

    if(!loggedAdmin){
        throw new ApiError(400, "admin not found")
    }
    
    const studentID = req.params.studentID

    if(!studentID){
        throw new ApiError(400, "no student ID")
    }

    const theStudent = await student.findById(studentID)

    if(!theStudent){
        throw new ApiError(400, "student not found")
    }

    const docID = theStudent.Studentdetails

    if(!docID){
        throw new ApiError(400, "Documents not found, please update")
    }

    const studentDocs = await studentdocs.findById(docID)
    
    if(!studentDocs){
        throw new ApiError(400, "failed to retrieve documents")
    }
    
    return res
    .status(200)
    .json(new ApiResponse(200, {loggedAdmin, theStudent, studentDocs}, "documents retrieved successfully"))


})

const checkTeacherDocuments = asyncHandler(async(req,res)=>{
    const adminID = req.params.adminID

    if(!adminID){
        throw new ApiError(400, "not authorized")
    }

    const loggedAdmin = await admin.findById(adminID)

    if(!loggedAdmin){
        throw new ApiError(400, "admin not found")
    }

    const teacherID = req.params.teacherID

    if(!teacherID){
        throw new ApiError(400, "no Teacher ID")
    }

    const theTeacher = await Teacher.findById(teacherID)

    if(!theTeacher){
        throw new ApiError(400, "Teacher not found")
    }

    const docID = theTeacher.Teacherdetails

    if(!docID){
        throw new ApiError(400, "Documents not found, please update")
    }

    const teacherDocs = await Teacherdocs.findById(docID)
    
    if(!teacherDocs){
        throw new ApiError(400, "failed to retrieve documents")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, {loggedAdmin, theTeacher, teacherDocs}, "documents retrieved successfully"))


})


const sendmessage = asyncHandler(async(req,res)=>{
    const {name, message, email} = req.body;

    if([name, message, email].some((field)=> field?.trim() === "")){
        throw new ApiError(400, "All fields are required")
    }

    const contactUs = await contact.create({
        name,
        email,
        message
    })

    const createdContactUs = await contact.findById(contactUs._id)

    if(!contactUs){
        throw new ApiError(400, "failed to send message")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, {contactUs: createdContactUs}, "message sent successfully"))
})

const allmessages = asyncHandler(async(req,res)=>{
    const messages = await contact.find({}).sort({ _id: -1 });
    
    return res
    .status(200)
    .json(new ApiResponse(200, messages || [], "messages fetched"))
})

const readMessage = asyncHandler(async(req,res)=>{
    const messageID = req.body.messageID || req.params.id;

    const isdone = await contact.findByIdAndUpdate({_id: messageID}, {$set:{status:true}}, {new:true})

    if(!isdone){
        throw new ApiError(400, "error occured while updating the status")
    }

    return res
    .status(200)
    .json( new ApiResponse(200, isdone, "status updated successfully"))
})

const deleteMessage = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const deleted = await contact.findByIdAndDelete(id);
    if (!deleted) {
        throw new ApiError(404, "Không tìm thấy tin nhắn hoặc đã bị xóa");
    }
    return res.status(200).json(new ApiResponse(200, deleted, "Xóa tin nhắn thành công"));
});

const replySupportMessage = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { replyContent, email, name } = req.body;

    if (!replyContent || !replyContent.trim()) {
        throw new ApiError(400, "Nội dung phản hồi không được để trống");
    }

    const msg = await contact.findByIdAndUpdate(id, { $set: { status: true } }, { new: true });
    if (!msg) {
        throw new ApiError(404, "Không tìm thấy tin nhắn");
    }

    const recipientEmail = email || msg.email;
    const recipientName = name || msg.name || "Quý khách";

    if (recipientEmail) {
        Sendmail(
            recipientEmail,
            "EduPulse - Phản hồi yêu cầu hỗ trợ",
            `<html>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <h2 style="color: #0284c7;">Xin chào ${recipientName},</h2>
                    <p>Cảm ơn bạn đã liên hệ với Ban Quản Trị EduPulse. Chúng tôi xin phản hồi nội dung yêu cầu hỗ trợ của bạn như sau:</p>
                    <div style="background-color: #f1f5f9; padding: 16px; border-left: 4px solid #0284c7; margin: 16px 0; border-radius: 4px;">
                        <p style="margin: 0; font-weight: bold; color: #334155;">Nội dung phản hồi:</p>
                        <p style="margin-top: 8px;">${replyContent.replace(/\n/g, '<br/>')}</p>
                    </div>
                    <p>Nếu bạn có thêm câu hỏi, vui lòng gửi phản hồi trực tiếp tới email này hoặc qua trang Liên hệ EduPulse.</p>
                    <p>Trân trọng,<br/><strong>Đội ngũ Chăm sóc Học viên & Giảng viên EduPulse</strong></p>
                </body>
            </html>`
        );
    }

    return res.status(200).json(new ApiResponse(200, msg, "Đã gửi email phản hồi thành công"));
});

const toapproveCourse = asyncHandler(async(req,res)=>{
    const loggedAdmin = req.Admin || (req.params.adminID ? await admin.findById(req.params.adminID) : null);

    if(!loggedAdmin){
        throw new ApiError(401, "Admin not authorized");
    }
    
    const courseForApproval = await course.find({isapproved:false}).populate("enrolledteacher", "-Password -Refreshtoken").sort({ createdAt: -1 });

    return res.status(200).json(new ApiResponse(200, courseForApproval, "fetched successfully"));
});

const approveCourse = asyncHandler(async(req,res)=>{
    const loggedAdmin = req.Admin || (req.params.adminID ? await admin.findById(req.params.adminID) : null);

    if(!loggedAdmin){
        throw new ApiError(401, "Admin not authorized");
    }

    const courseID = req.params.courseID;

    if(!courseID){
        throw new ApiError(400, "course id is required");
    }

    const toApprove = req.body.Isapproved !== undefined ? req.body.Isapproved : req.body.isapproved;

    if(toApprove === true || toApprove === 'true' || toApprove === 'approved'){
        const theCourse = await course.findByIdAndUpdate(
            courseID,
            { $set: { isapproved: true, status: 'active', adminNote: req.body.adminNote || 'Khóa học được phê duyệt xuất bản' } },
            { new: true }
        ).populate("enrolledteacher", "Email Firstname Lastname");

        if(!theCourse){
            throw new ApiError(404, "Khóa học không tồn tại");
        }

        const teacherEmail = req.body.email || theCourse.enrolledteacher?.Email;
        const teacherName = req.body.Firstname || theCourse.enrolledteacher?.Firstname || "Giảng viên";

        if (theCourse.enrolledteacher?._id) {
            try {
                await Notification.create({
                    recipient: theCourse.enrolledteacher._id,
                    recipientType: "teacher",
                    title: "Khóa học đã được phê duyệt!",
                    message: `Khóa học "${theCourse.coursename}" của Thầy/Cô đã được Admin phê duyệt và xuất bản công khai.`,
                    type: "course_approval",
                    link: `/courses`
                });
            } catch (notifErr) {
                console.warn("Could not create notification for teacher:", notifErr.message);
            }
        }

        if (teacherEmail) {
            Sendmail(teacherEmail, `EduPulse - Khóa học [${theCourse.coursename}] đã được phê duyệt`, 
                `<html>
                    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <h1 style="color: #4CAF50; text-align: center;">Chúc Mừng!</h1>
                    <p style="font-size: 16px;">Kính gửi Thầy/Cô ${teacherName},</p>
                    <p style="font-size: 16px;">Khóa học <strong>${theCourse.coursename}</strong> của Thầy/Cô đã được Ban Quản Trị EduPulse xem xét và phê duyệt thành công.</p>
                    <p style="font-size: 16px;">Khóa học hiện đã được công khai trên nền tảng để học viên có thể đăng ký tham gia.</p>
                    <p style="font-size: 16px;">Trân trọng,<br/><strong>Đội ngũ EduPulse</strong></p>
                    </body>
                </html>`
            );
        }

        return res
        .status(200)
        .json(new ApiResponse(200, theCourse, `Phê duyệt khóa học thành công`));
    }
    else{
        const rejectReason = req.body.remarks || req.body.adminNote || "Chưa đạt tiêu chuẩn kiểm duyệt nội dung của EduPulse";

        const theCourse = await course.findByIdAndUpdate(
            courseID,
            {
                $set: {
                    isapproved: false,
                    status: 'draft',
                    adminNote: rejectReason
                }
            },
            { new: true }
        ).populate("enrolledteacher", "Email Firstname Lastname");
        
        if(!theCourse){
            throw new ApiError(404, "Khóa học không tồn tại");
        }

        const teacherEmail = req.body.email || theCourse.enrolledteacher?.Email;
        const teacherName = req.body.Firstname || theCourse.enrolledteacher?.Firstname || "Giảng viên";

        if (theCourse.enrolledteacher?._id) {
            try {
                await Notification.create({
                    recipient: theCourse.enrolledteacher._id,
                    recipientType: "teacher",
                    title: "Yêu cầu mở khóa học chưa được phê duyệt",
                    message: `Khóa học "${theCourse.coursename}" đã bị từ chối phê duyệt. Lý do: ${rejectReason}. Khóa học đã chuyển về bản nháp để Thầy/Cô có thể chỉnh sửa và nộp lại.`,
                    type: "course_approval",
                    link: `/Teacher/Dashboard/${theCourse.enrolledteacher._id}/Courses`
                });
            } catch (notifErr) {
                console.warn("Could not create notification for teacher:", notifErr.message);
            }
        }

        if (teacherEmail) {
            Sendmail(teacherEmail, `EduPulse - Thông báo về yêu cầu mở khóa học [${theCourse.coursename}]`, 
                `<html>
                    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <h1 style="color: #e11d48; text-align: center;">Thông Báo Xét Duyệt Khóa Học</h1>
                    <p style="font-size: 16px;">Kính gửi Thầy/Cô ${teacherName},</p>
                    <p style="font-size: 16px;">Sau khi xem xét kỹ lưỡng, chúng tôi rất tiếc phải thông báo khóa học <strong>${theCourse.coursename}</strong> hiện chưa đáp ứng đầy đủ tiêu chí của nền tảng tại thời điểm này.</p>
                    <p style="font-size: 16px;"><strong>Lý do từ chối:</strong> ${rejectReason}</p>
                    <p style="font-size: 16px;">Khóa học đã được chuyển về trạng thái bản nháp. Thầy/Cô có thể cập nhật thông tin và nộp lại yêu cầu mở khóa học mới.</p>
                    <p style="font-size: 16px;">Trân trọng,<br/><strong>Đội ngũ EduPulse</strong></p>
                    </body>
                </html>`
            );
        }

        return res
        .status(200)
        .json(new ApiResponse(200, theCourse, `Đã từ chối khóa học và lưu thành bản nháp`));
    }
    

   

})
export {
    adminSignUp,
    adminLogin,
    forApproval,
    approveStudent,
    approveTeacher,
    checkStudentDocuments,
    checkTeacherDocuments,
    adminLogout,
    sendmessage,
    allmessages,
    readMessage,
    deleteMessage,
    replySupportMessage,
    toapproveCourse,
    approveCourse
}
