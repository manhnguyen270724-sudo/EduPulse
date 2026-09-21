import React, { useState } from "react";
import "../Login/Login.css";
import { NavLink, useNavigate } from "react-router-dom";
import Images from "../Images/Grammar-correction.svg";
import Header from "../Home/Header/Header";

const Signup = () => {
  const [Firstname, setFirstName] = useState("");
  const [Lastname, setLastName] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [userType, setUserType] = useState("student");
  const [err, setErr] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!Firstname.trim()) {
      newErrors.firstname = "Họ đệm là bắt buộc";
    }

    if (!Lastname.trim()) {
      newErrors.lastname = "Tên là bắt buộc";
    }

    if (!Email.trim()) {
      newErrors.email = "Email là bắt buộc";
    } else if (!/\S+@\S+\.\S+/.test(Email)) {
      newErrors.email = "Định dạng email không hợp lệ";
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(Password)) {
      newErrors.password =
        "Mật khẩu phải tối thiểu 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt (@$!%*?&)";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const data = {
      Firstname,
      Lastname,
      Email,
      Password,
    };

    try {
      const response = await fetch(`/api/${userType}/signup`, {
        method: "POST",
        mode: "cors",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      setErr(responseData.message);

      if (response.ok) {
        navigate("/varifyEmail");
      } else if (response.status === 400) {
        setErrors(responseData.errors || {});
      } else {
        console.error("Registration failed with status code:", response.status);
      }
    } catch (error) {
      setErrors({ general: error.message });
    }
  };

  return (
    <div className="auth-page-wrapper">
      <Header />
      <div className="auth-container">
        {/* Signup Card */}
        <div className="auth-card">
          <div className="auth-card-header">
            <div className="auth-badge">TẠO TÀI KHOẢN MỚI</div>
            <h2 className="auth-title">Gia Nhập EduPulse</h2>
            <p className="auth-subtitle">Bắt đầu trải nghiệm học tập và tương tác với các giảng viên hàng đầu</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {/* Role Tabs */}
            <div className="role-selector-container">
              <button
                type="button"
                className={`role-tab ${userType === "student" ? "active" : ""}`}
                onClick={() => setUserType("student")}
              >
                🎓 Tôi Là Học Sinh
              </button>
              <button
                type="button"
                className={`role-tab ${userType === "teacher" ? "active" : ""}`}
                onClick={() => setUserType("teacher")}
              >
                👨‍🏫 Tôi Là Giảng Viên
              </button>
            </div>

            {/* Name Fields Row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div className="form-group">
                <label className="form-label">Họ & Đệm</label>
                <input
                  type="text"
                  className="auth-input"
                  placeholder="Nguyễn Văn"
                  value={Firstname}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                {errors.firstname && <div className="error-text">{errors.firstname}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Tên</label>
                <input
                  type="text"
                  className="auth-input"
                  placeholder="An"
                  value={Lastname}
                  onChange={(e) => setLastName(e.target.value)}
                />
                {errors.lastname && <div className="error-text">{errors.lastname}</div>}
              </div>
            </div>

            {/* Email Field */}
            <div className="form-group">
              <label className="form-label">Địa Chỉ Email</label>
              <input
                type="email"
                className="auth-input"
                placeholder="name@example.com"
                value={Email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <div className="error-text">{errors.email}</div>}
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label className="form-label">Mật Khẩu</label>
              <input
                type="password"
                className="auth-input"
                placeholder="Tối thiểu 8 ký tự (hoa, thường, số, ký tự đặc biệt)"
                value={Password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && <div className="error-text">{errors.password}</div>}
            </div>

            {/* Error alerts */}
            {err && <div className="error-text text-center font-semibold">{err}</div>}
            {errors.general && <div className="error-text text-center font-semibold">{errors.general}</div>}

            {/* Submit Button */}
            <button type="submit" className="auth-submit-btn">
              Đăng Ký Tài Khoản
            </button>

            {/* Footer */}
            <div className="auth-footer-prompt">
              <span>Đã có tài khoản?</span>
              <NavLink to="/login">Đăng nhập</NavLink>
            </div>
          </form>
        </div>

        {/* Visual Illustration */}
        <div className="auth-visual-col">
          <img src={Images} alt="EduPulse Registration" className="auth-visual-img" />
          <div className="auth-visual-caption">
            <h3 className="auth-visual-title">Cộng Đồng Học Thuật Ưu Tú</h3>
            <p className="auth-visual-desc">
              Tham gia ngay hôm nay để nhận chứng nhận hoàn thành khóa học và tài liệu độc quyền từ đội ngũ Giảng viên.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
