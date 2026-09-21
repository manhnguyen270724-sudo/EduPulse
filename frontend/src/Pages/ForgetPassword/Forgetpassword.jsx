import React, { useState } from 'react';
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Header from '../Home/Header/Header';
import Footer from '../Footer/Footer';
import '../Login/Login.css';

const Forgetpassword = () => {
  const [userType, setUserType] = useState('student');
  const [data, setData] = useState({ email: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value
    });
  };

  const onFormSubmit = async (e) => {
    e.preventDefault();

    if (!data.email.trim()) {
      toast.error('Vui lòng nhập địa chỉ email của bạn!');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      toast.error('Định dạng email không hợp lệ!');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`/api/${userType}/forgetpassword`, { Email: data.email });
      console.log(response.data);
      toast.success('Đã gửi link đặt lại mật khẩu về email của bạn!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi gửi email khôi phục');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <Header />
      <div className="auth-container" style={{ margin: '60px auto' }}>
        <div className="auth-card">
          <div className="auth-card-header">
            <div className="auth-badge">KHÔI PHỤC TÀI KHOẢN</div>
            <h2 className="auth-title">Quên Mật Khẩu?</h2>
            <p className="auth-subtitle">
              Nhập email liên kết với tài khoản EduPulse của bạn để nhận hướng dẫn thiết lập lại mật khẩu an toàn.
            </p>
          </div>

          <form onSubmit={onFormSubmit} className="auth-form">
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

            <div className="form-group">
              <label className="form-label">Địa Chỉ Email Cần Khôi Phục</label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="name@example.com"
                value={data.email}
                onChange={handleChange}
                className="auth-input"
              />
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? 'Đang gửi email...' : 'Gửi Yêu Cầu Khôi Phục'}
            </button>

            <div className="flex items-center justify-center gap-2 mt-4 cursor-pointer text-cyan-400 hover:text-cyan-300 font-semibold text-sm transition-colors" onClick={() => navigate(-1)}>
              <IoArrowBack /> Quay Lại Trang Đăng Nhập
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Forgetpassword;
