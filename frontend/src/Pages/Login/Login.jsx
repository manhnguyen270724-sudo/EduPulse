import React, { useState } from "react";
import HR from "../Login/Images/HR.svg";
import "./Login.css";
import { NavLink, useNavigate } from "react-router-dom";
import Radiobtn from "../Components/RadioBtn/Radiobtn";
import Header from "../Home/Header/Header";

export default function Login() {
  // State to hold user input and errors
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [userType, setUserType] = useState('');
  const [err, setErr] = useState('');


  const navigate=useNavigate()

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    const newErrors = {};

    if (!Email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(Email)) {
      newErrors.email = "Invalid email format";
    }

    if (!Password.trim()) {
      newErrors.password = "Password is required";
    }

    if (Object.keys(newErrors).length > 0) {
      // Update the errors state and prevent form submission
      setErrors(newErrors);
      return;
    }

    // Prepare data object to send to the backend
    const data = {
      Email: Email,
      Password: Password,
    };

    try {
      // Send data to backend (you need to implement this part)
      const response = await fetch(`/api/${userType}/login`, {
        method: 'POST',
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responesData = await response.json()
      if(responesData.message != 'Logged in'){
        setErr(responesData.message);
      }
      const userid = responesData.data.user._id
 
      // Handle response
      if (response.ok) {
        // Authentication successful, you can redirect or do something else
        console.log("Login successful");
        const uData = responesData.data.user;
        localStorage.setItem('edupulse_user', JSON.stringify({
          role: userType,
          id: userid,
          name: uData.Lastname ? `${uData.Lastname} ${uData.Firstname}` : (uData.Firstname || 'Người dùng'),
          avatar: uData.Avatar || '',
          email: uData.Email || ''
        }));
        window.dispatchEvent(new Event('edupulse-auth-change'));
        console.log(responesData.data.user.Isapproved);
        
        
        if(responesData.data.user.Isapproved === "pending"){
          if(responesData.data.user.Teacherdetails || responesData.data.user.Studentdetails){
            navigate('/pending')
          }else{
            if(userType === 'student'){
              navigate(`/StudentDocument/${userid}`)
            }else if(userType === 'teacher'){
              navigate(`/TeacherDocument/${userid}`)
            }
          }
        }else if(responesData.data.user.Isapproved === "approved"){
          if(userType === 'student'){
            navigate(`/Student/Dashboard/${userid}/Search`)
          }else if(userType === 'teacher'){
            navigate(`/Teacher/Dashboard/${userid}/Home`)
          }
        }else if(responesData.data.user.Isapproved === "reupload"){
          if(userType === 'teacher'){
            navigate(`/rejected/${userType}/${userid}`)
          }else{
            navigate(`/rejected/${userType}/${userid}`)
          }
        }else{
          setErr('You are ban from our platform!');
        }

      } else if (response.status === 401) {
        // Incorrect password
        setErrors({ password: responesData.message || "Incorrect password" });
      } else if (response.status === 403) {
        // Account locked, disabled, or other authentication issues

        setErrors({ general: responesData.message || "Login failed" });
      } else if (response.status === 400) {
        setErrors({ general: responesData.message || "User does not exist" });
      } else if (response.status === 422) {
        setErrors({
          general: responesData.message || '"Email" must be a valid email',
        });
      } else {
        // Other unexpected errors
        setErrors({ general: "An unexpected error occurred" });
      }
    } catch (error) {
   
      setErrors(error.message);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <Header />
      <div className="auth-container">
        {/* Login Form Card */}
        <div className="auth-card">
          <div className="auth-card-header">
            <div className="auth-badge">CỔNG ĐĂNG NHẬP</div>
            <h2 className="auth-title">Chào Mừng Trở Lại</h2>
            <p className="auth-subtitle">Đăng nhập để tiếp tục hành trình học tập và giảng dạy cùng EduPulse</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {/* Role Tabs */}
            <div className="role-selector-container">
              <button 
                type="button" 
                className={`role-tab ${userType === 'student' ? 'active' : ''}`}
                onClick={() => setUserType('student')}
              >
                🎓 Học Sinh
              </button>
              <button 
                type="button" 
                className={`role-tab ${userType === 'teacher' ? 'active' : ''}`}
                onClick={() => setUserType('teacher')}
              >
                👨‍🏫 Giảng Viên
              </button>
            </div>
            {!userType && (
              <p className="text-yellow-400 text-xs text-center">Vui lòng chọn vai trò: Học Sinh hoặc Giảng Viên</p>
            )}

            {/* Email Input */}
            <div className="form-group">
              <label className="form-label">Email Đăng Nhập</label>
              <div className="auth-input-wrapper">
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="auth-input"
                  value={Email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {errors.email && <div className="error-text">{errors.email}</div>}
            </div>

            {/* Password Input */}
            <div className="form-group">
              <label className="form-label">Mật Khẩu</label>
              <div className="auth-input-wrapper">
                <input
                  type="password"
                  placeholder="Nhập mật khẩu..."
                  className="auth-input"
                  value={Password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {errors.password && <div className="error-text">{errors.password}</div>}
            </div>

            {/* Extra links */}
            <div className="auth-extra-links">
              <span className="text-xs text-slate-400">Bảo mật SSL 256-bit</span>
              <span 
                className="forgot-password-link text-xs font-semibold"
                onClick={() => navigate('/forgetpassword')}
              >
                Quên mật khẩu?
              </span>
            </div>

            {/* Error Message */}
            {err && <div className="error-text text-center font-semibold">{err}</div>}
            {errors.general && <div className="error-text text-center font-semibold">{errors.general}</div>}

            {/* Submit Button */}
            <button type="submit" className="auth-submit-btn">
              Đăng Nhập Vào Hệ Thống
            </button>

            {/* Footer Prompt */}
            <div className="auth-footer-prompt">
              <span>Chưa có tài khoản?</span>
              <NavLink to="/signup">Đăng ký ngay</NavLink>
            </div>
          </form>
        </div>

        {/* Visual Illustration Column */}
        <div className="auth-visual-col">
          <img src={HR} alt="EduPulse Illustration" className="auth-visual-img" />
          <div className="auth-visual-caption">
            <h3 className="auth-visual-title">Học Tập Không Giới Hạn</h3>
            <p className="auth-visual-desc">
              Kết nối với hơn 50+ Giảng viên chuyên gia từ các trường đại học hàng đầu Việt Nam.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
 
}
