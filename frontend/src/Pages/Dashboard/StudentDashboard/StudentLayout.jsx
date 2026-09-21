import React, { useEffect, useState } from 'react';
import { Outlet, NavLink, useParams, useNavigate } from 'react-router-dom';
import { FaBookOpen, FaCalendarAlt, FaSearch, FaUserEdit, FaSignOutAlt, FaMoon, FaSun, FaGraduationCap } from 'react-icons/fa';
import './StudentLayout.css';

import { useAuth } from '../../../context/AuthContext';

function StudentLayout() {
  const { ID } = useParams();
  const navigate = useNavigate();
  const { user: authUser, logoutUser } = useAuth();
  const [data, setData] = useState({});
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return document.documentElement.getAttribute('data-theme') === 'dark';
  });

  const toggleTheme = () => {
    const nextTheme = isDarkMode ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('edupulse-theme', nextTheme);
    setIsDarkMode(!isDarkMode);
  };

  const handleLogout = async () => {
    await logoutUser();
    navigate('/login');
  };

  const getData = async () => {
    try {
      const response = await fetch(`/api/Student/StudentDocument/${ID}`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.status === 401 || response.status === 403) {
        await logoutUser();
        navigate('/login');
        return;
      }
      if (!response.ok) throw new Error('Failed to fetch student');
      const user = await response.json();
      setData(user.data || {});
    } catch (err) {
      console.error('Fetch student error:', err);
    }
  };

  useEffect(() => {
    // Kiểm tra tính chính chủ của ID
    if (authUser && authUser.id && String(ID) !== String(authUser.id)) {
      navigate(`/Student/Dashboard/${authUser.id}/Courses`, { replace: true });
      return;
    }
    if (ID) getData();
  }, [ID, authUser]);

  const studentFullName = data.Lastname ? `${data.Lastname} ${data.Firstname}` : (data.Firstname || 'Học Viên');
  const avatarUrl = data.Avatar || 'https://res.cloudinary.com/elearning-platform-vn/image/upload/v1789924694/edupulse/students/student_nguyen_van_bao.jpg';

  return (
    <div className="sp-shell">
      {/* ─── TOPBAR ─── */}
      <header className="sp-topbar">
        <div className="sp-brand-group">
          <NavLink to={`/Student/Dashboard/${ID}/Courses`} className="sp-brand-link" title="Về trang khóa học của bạn">
            <img
              src="https://res.cloudinary.com/elearning-platform-vn/image/upload/v1789924695/edupulse/branding/edupulse_logo.jpg"
              alt="EduPulse"
              className="sp-brand-logo"
            />
            <span className="sp-brand-text">EduPulse</span>
          </NavLink>
          <span className="sp-portal-badge">Cổng Học Viên</span>
        </div>

        <div className="sp-topbar-right">
          <button
            className="sp-theme-btn"
            onClick={toggleTheme}
            title={isDarkMode ? 'Chuyển sang chế độ Sáng' : 'Chuyển sang chế độ Tối'}
          >
            {isDarkMode ? <FaSun className="text-amber-400" /> : <FaMoon />}
          </button>

          <div className="sp-student-pill">
            <img src={avatarUrl} alt={studentFullName} className="sp-student-pill-img" />
            <span className="sp-student-pill-name">{studentFullName}</span>
          </div>

          <button className="sp-btn-logout" onClick={handleLogout} title="Đăng xuất khỏi hệ thống">
            <FaSignOutAlt />
            <span>Đăng xuất</span>
          </button>
        </div>
      </header>

      {/* ─── BODY (SIDEBAR + MAIN) ─── */}
      <div className="sp-body">
        {/* Sidebar */}
        <aside className="sp-sidebar">
          <div className="sp-sidebar-profile">
            <div className="sp-sidebar-avatar-frame">
              <img src={avatarUrl} alt={studentFullName} className="sp-sidebar-avatar" />
            </div>
            <h3 className="sp-sidebar-name">{studentFullName}</h3>
            <span className="sp-sidebar-tag">Học Viên EduPulse</span>
          </div>

          <nav className="sp-sidebar-menu">
            <NavLink
              to={`/Student/Dashboard/${ID}/Courses`}
              className={({ isActive }) => `sp-menu-item ${isActive ? 'active' : ''}`}
            >
              <FaBookOpen className="sp-menu-icon" />
              <span>Khóa Học Của Tôi</span>
            </NavLink>

            <NavLink
              to={`/Student/Dashboard/${ID}/Classes`}
              className={({ isActive }) => `sp-menu-item ${isActive ? 'active' : ''}`}
            >
              <FaCalendarAlt className="sp-menu-icon" />
              <span>Lịch Học Trực Tuyến</span>
            </NavLink>

            <NavLink
              to={`/Student/Dashboard/${ID}/Search`}
              className={({ isActive }) => `sp-menu-item ${isActive ? 'active' : ''}`}
            >
              <FaSearch className="sp-menu-icon" />
              <span>Khám Phá Khóa Học</span>
            </NavLink>

            <NavLink
              to={`/Student/Dashboard/${ID}/Profile`}
              className={({ isActive }) => `sp-menu-item ${isActive ? 'active' : ''}`}
            >
              <FaUserEdit className="sp-menu-icon" />
              <span>Hồ Sơ Cá Nhân</span>
            </NavLink>
          </nav>

          {/* Public Catalog Card */}
          <div className="sp-sidebar-footer">
            <a
              href="/courses"
              target="_blank"
              rel="noopener noreferrer"
              className="sp-public-preview-card"
              title="Xem danh mục tất cả khóa học trên EduPulse"
            >
              <div className="sp-preview-header">
                <span>📚 Thư Viện Khóa Học</span>
              </div>
              <p className="sp-preview-hint">Khám phá các khóa ôn thi, chuyên đề nâng cao và môn học đại học mở mới.</p>
            </a>
          </div>
        </aside>

        {/* Main Viewport */}
        <main className="sp-main-viewport">
          <Outlet context={{ student: data, reloadStudent: getData, ID }} />
        </main>
      </div>
    </div>
  );
}

export default StudentLayout;