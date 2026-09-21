import React, { useEffect, useState } from 'react';
import { Outlet, NavLink, useParams, useNavigate } from 'react-router-dom';
import { FaHome, FaBookOpen, FaChalkboardTeacher, FaUserEdit, FaSignOutAlt, FaExternalLinkAlt, FaMoon, FaSun, FaCheckCircle } from 'react-icons/fa';
import './TeacherLayout.css';

import { useAuth } from '../../../context/AuthContext';

function TeacherLayout() {
  const { ID } = useParams();
  const navigate = useNavigate();
  const { user: authUser, logoutUser } = useAuth();
  const [data, setData] = useState({});
  const [Tdec, setTeacherDetails] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return document.documentElement.getAttribute('data-theme') === 'dark';
  });

  const toggleTheme = () => {
    const nextTheme = isDarkMode ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('theme', nextTheme);
    setIsDarkMode(!isDarkMode);
  };

  const handleLogout = async () => {
    await logoutUser();
    navigate('/login');
  };

  const getData = async () => {
    try {
      const response = await fetch(`/api/Teacher/TeacherDocument/${ID}`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.status === 401 || response.status === 403) {
        await logoutUser();
        navigate('/login');
        return;
      }
      if (!response.ok) throw new Error('Failed to fetch teacher');
      const user = await response.json();
      setData(user.data || {});

      // Lấy chi tiết bằng cấp
      if (user.data?.Teacherdetails) {
        const res = await fetch('/api/teacher/teacherdocuments', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ teacherID: user.data.Teacherdetails })
        });
        const resData = await res.json();
        setTeacherDetails(resData.data);
      }
    } catch (err) {
      console.error('Fetch teacher error:', err);
    }
  };

  useEffect(() => {
    // Kiểm tra tính chính chủ của ID
    if (authUser && authUser.id && String(ID) !== String(authUser.id)) {
      navigate(`/Teacher/Dashboard/${authUser.id}/Home`, { replace: true });
      return;
    }
    if (ID) getData();
  }, [ID, authUser]);

  const teacherFullName = data.Lastname ? `${data.Lastname} ${data.Firstname}` : (data.Firstname || 'Giảng Viên');
  const avatarUrl = data.Avatar || 'https://res.cloudinary.com/elearning-platform-vn/image/upload/v1789924688/edupulse/teachers/teacher_nguyen_van_an.jpg';

  return (
    <div className="tp-shell">
      {/* ─── TOPBAR ─── */}
      <header className="tp-topbar">
        <div className="tp-brand-group">
          <NavLink to={`/Teacher/Dashboard/${ID}/Home`} className="tp-brand-link" title="Về trang tổng quan giảng viên">
            <img
              src="https://res.cloudinary.com/elearning-platform-vn/image/upload/v1789924695/edupulse/branding/edupulse_logo.jpg"
              alt="EduPulse"
              className="tp-brand-logo"
            />
            <span className="tp-brand-text">EduPulse</span>
          </NavLink>
          <span className="tp-portal-badge">Cổng Giảng Viên</span>
        </div>

        <div className="tp-topbar-right">
          <button
            className="tp-theme-btn"
            onClick={toggleTheme}
            title={isDarkMode ? 'Chuyển sang chế độ Sáng' : 'Chuyển sang chế độ Tối'}
          >
            {isDarkMode ? <FaSun className="text-amber-400" /> : <FaMoon />}
          </button>

          <div className="tp-teacher-pill">
            <img src={avatarUrl} alt={teacherFullName} className="tp-teacher-pill-img" />
            <span className="tp-teacher-pill-name">{teacherFullName}</span>
          </div>

          <button className="tp-btn-logout" onClick={handleLogout} title="Đăng xuất khỏi hệ thống">
            <FaSignOutAlt />
            <span>Đăng xuất</span>
          </button>
        </div>
      </header>

      {/* ─── BODY (SIDEBAR + MAIN) ─── */}
      <div className="tp-body">
        {/* Sidebar */}
        <aside className="tp-sidebar">
          <div className="tp-sidebar-profile">
            <div className="tp-sidebar-avatar-frame">
              <img src={avatarUrl} alt={teacherFullName} className="tp-sidebar-avatar" />
              {data.Isapproved === 'approved' && (
                <span className="tp-sidebar-verified" title="Giảng viên đã thẩm định">
                  <FaCheckCircle />
                </span>
              )}
            </div>
            <h3 className="tp-sidebar-name">{teacherFullName}</h3>
            <span className="tp-sidebar-tag">Giảng Viên Thẩm Định</span>
          </div>

          <nav className="tp-sidebar-menu">
            <NavLink
              to={`/Teacher/Dashboard/${ID}/Home`}
              className={({ isActive }) => `tp-menu-item ${isActive ? 'active' : ''}`}
            >
              <FaHome className="tp-menu-icon" />
              <span>Tổng Quan</span>
            </NavLink>

            <NavLink
              to={`/Teacher/Dashboard/${ID}/Courses`}
              className={({ isActive }) => `tp-menu-item ${isActive ? 'active' : ''}`}
            >
              <FaBookOpen className="tp-menu-icon" />
              <span>Quản Lý Khóa Học</span>
            </NavLink>

            <NavLink
              to={`/Teacher/Dashboard/${ID}/Classes`}
              className={({ isActive }) => `tp-menu-item ${isActive ? 'active' : ''}`}
            >
              <FaChalkboardTeacher className="tp-menu-icon" />
              <span>Lịch Dạy Trực Tuyến</span>
            </NavLink>

            <NavLink
              to={`/Teacher/Dashboard/${ID}/Profile`}
              className={({ isActive }) => `tp-menu-item ${isActive ? 'active' : ''}`}
            >
              <FaUserEdit className="tp-menu-icon" />
              <span>Hồ Sơ Cá Nhân</span>
            </NavLink>
          </nav>

          {/* Public Profile Preview Box */}
          <div className="tp-sidebar-footer">
            <a
              href={`/teacher/${data.slug || ID}`}
              target="_blank"
              rel="noopener noreferrer"
              className="tp-public-preview-card"
              title="Mở hồ sơ công khai trong tab mới"
            >
              <div className="tp-preview-header">
                <span>🌐 Xem Hồ Sơ Công Khai</span>
                <FaExternalLinkAlt size={11} />
              </div>
              <p className="tp-preview-hint">Xem giao diện học sinh và khách nhìn thấy khi vào trang của bạn.</p>
            </a>
          </div>
        </aside>

        {/* Main Viewport */}
        <main className="tp-main-viewport">
          <Outlet context={{ teacher: data, teacherDetails: Tdec, reloadTeacher: getData, ID }} />
        </main>
      </div>
    </div>
  );
}

export default TeacherLayout;