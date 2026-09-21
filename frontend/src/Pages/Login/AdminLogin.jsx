import React, { useState } from "react";
import "./Login.css";
import Admin from "./Images/Admin.svg";
import { useNavigate } from "react-router-dom";
import Header from "../Home/Header/Header";
import { FaShieldAlt } from "react-icons/fa";

export default function AdminLogin() {
  const [User, setUser] = useState("");
  const [Password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [err, setErr] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!User.trim()) {
      newErrors.User = "Tên đăng nhập quản trị viên là bắt buộc";
    }

    if (!Password.trim()) {
      newErrors.password = "Mật khẩu là bắt buộc";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const data = {
      username: User,
      password: Password,
    };

    try {
      const response = await fetch(`/api/admin/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      setErr(responseData.message);
      const userid = responseData.data?.admin?._id;

      if (response.ok) {
        navigate(`/admin/${userid}`);
      } else if (response.status === 401) {
        setErrors({ password: responseData.message || "Mật khẩu không chính xác" });
      } else if (response.status === 403) {
        setErrors({ general: responseData.message || "Đăng nhập thất bại" });
      } else if (response.status === 400) {
        setErrors({ general: responseData.message || "Tài khoản Admin không tồn tại" });
      } else {
        setErrors({ general: "Đã xảy ra lỗi không xác định" });
      }
    } catch (error) {
      setErrors({ general: error.message });
    }
  };

  return (
    <div className="auth-page-wrapper">
      <Header />
      <div className="auth-container">
        {/* Admin Login Card */}
        <div className="auth-card">
          <div className="auth-card-header">
            <div className="auth-badge" style={{ borderColor: "rgba(245, 158, 11, 0.4)", color: "#f59e0b", background: "rgba(245, 158, 11, 0.1)" }}>
              <FaShieldAlt className="inline mr-1" /> QUẢN TRỊ VIÊN HỆ THỐNG
            </div>
            <h2 className="auth-title">Cổng Quản Trị EduPulse</h2>
            <p className="auth-subtitle">Xác thực quyền quản trị tối cao để kiểm duyệt hồ sơ và quản lý toàn sàn</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Tên Đăng Nhập Admin</label>
              <input
                type="text"
                placeholder="admin"
                className="auth-input"
                value={User}
                onChange={(e) => setUser(e.target.value)}
              />
              {errors.User && <div className="error-text">{errors.User}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Mật Khẩu Quản Trị</label>
              <input
                type="password"
                placeholder="••••••••"
                className="auth-input"
                value={Password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && <div className="error-text">{errors.password}</div>}
            </div>

            {err && <div className="error-text text-center font-semibold">{err}</div>}
            {errors.general && <div className="error-text text-center font-semibold">{errors.general}</div>}

            <button type="submit" className="auth-submit-btn" style={{ background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)", boxShadow: "0 4px 18px rgba(245, 158, 11, 0.35)" }}>
              Đăng Nhập Quản Trị
            </button>
          </form>
        </div>

        {/* Visual Illustration */}
        <div className="auth-visual-col">
          <img src={Admin} alt="Admin Portal" className="auth-visual-img" />
          <div className="auth-visual-caption">
            <h3 className="auth-visual-title">Bảng Điều Khiển Toàn Diện</h3>
            <p className="auth-visual-desc">
              Phê duyệt hồ sơ giáo viên, quản lý tài liệu thẩm định KYC và giám sát các giao dịch thanh toán thời gian thực.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
