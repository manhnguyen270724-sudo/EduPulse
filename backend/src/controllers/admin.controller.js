import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { admin } from "../models/admin.model.js";
import { student, studentdocs } from "../models/student.model.js";
import { Teacher, Teacherdocs } from "../models/teacher.model.js";
import { contact } from "../models/contact.model.js";
import { course } from "../models/course.model.js";
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
    
    const messages = await contact.find({
        status:false,
    }).sort({ _id: -1 });
    
    if(!messages){
        return res
        .status(200)
        .json(new ApiResponse(200, {}, "no new messages"))
    }
    
    return res
    .status(200)
    .json(new ApiResponse(200, messages, "messages fetched"))
})

const readMessage = asyncHandler(async(req,res)=>{

    const messageID = req.body.messageID;

    console.log(messageID);

    const isdone = await contact.findByIdAndUpdate({_id: messageID}, {$set:{status:true}}, {new:true})

    if(!isdone){
        throw new ApiError(400, "error occured while updating the status")
    }

    return res
    .status(200)
    .json( new ApiResponse(200, isdone, "status updated successfully"))
})

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
            { $set: { isapproved: true, status: 'active' } },
            { new: true }
        ).populate("enrolledteacher", "Email Firstname Lastname");

        if(!theCourse){
            throw new ApiError(404, "Khóa học không tồn tại");
        }

        const teacherEmail = req.body.email || theCourse.enrolledteacher?.Email;
        const teacherName = req.body.Firstname || theCourse.enrolledteacher?.Firstname || "Giảng viên";

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
        const theCourse = await course.findByIdAndDelete(courseID).populate("enrolledteacher", "Email Firstname Lastname");
        
        if(!theCourse){
            throw new ApiError(404, "Khóa học không tồn tại");
        }

        const teacherEmail = req.body.email || theCourse.enrolledteacher?.Email;
        const teacherName = req.body.Firstname || theCourse.enrolledteacher?.Firstname || "Giảng viên";

        if (teacherEmail) {
            Sendmail(teacherEmail, `EduPulse - Thông báo về yêu cầu mở khóa học [${theCourse.coursename}]`, 
                `<html>
                    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <h1 style="color: #e11d48; text-align: center;">Thông Báo Xét Duyệt Khóa Học</h1>
                    <p style="font-size: 16px;">Kính gửi Thầy/Cô ${teacherName},</p>
                    <p style="font-size: 16px;">Sau khi xem xét kỹ lưỡng, chúng tôi rất tiếc phải thông báo khóa học <strong>${theCourse.coursename}</strong> hiện chưa đáp ứng đầy đủ tiêu chí của nền tảng tại thời điểm này.</p>
                    <p style="font-size: 16px;">Thầy/Cô có thể cập nhật thông tin và nộp lại yêu cầu mở khóa học mới.</p>
                    <p style="font-size: 16px;">Trân trọng,<br/><strong>Đội ngũ EduPulse</strong></p>
                    </body>
                </html>`
            );
        }

        return res
        .status(200)
        .json(new ApiResponse(200, {}, `Đã từ chối khóa học thành công`));
    }
    

   

})
export {adminSignUp, adminLogin, forApproval, approveStudent, approveTeacher, checkStudentDocuments, checkTeacherDocuments, adminLogout, sendmessage, allmessages,readMessage, toapproveCourse, approveCourse}
