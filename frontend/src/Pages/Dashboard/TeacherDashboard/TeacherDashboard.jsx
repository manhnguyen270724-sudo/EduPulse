import React, { useEffect, useState } from 'react';
import { NavLink, useParams, useNavigate } from 'react-router-dom';
import { FaHome, FaChalkboardTeacher, FaBookOpen, FaSignOutAlt, FaUserTie, FaExternalLinkAlt, FaUsers } from 'react-icons/fa';
import NotificationBell from '../../Components/NotificationBell/NotificationBell';
import teachingImg from '../../Images/Teaching.svg';
import './TeacherDashboard.css';

function TeacherDashboard() {
  const { ID } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState({});

  const handleLogout = async () => {
    try {
      const response = await fetch(`/api/teacher/logout`, {
        method: 'POST',
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        }
      });
      const resData = await response.json();
      if (resData.statusCode === 200 || response.ok) {
        navigate('/');
      }
    } catch (err) {
      console.error("Logout error:", err);
      navigate('/');
    }
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(`/api/Teacher/TeacherDocument/${ID}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const user = await response.json();
        setData(user.data || {});
      } catch (error) {
        console.error("Fetch teacher data error:", error);
      }
    };
    if (ID) getData();
  }, [ID]);

  return (
    <>
      {/* Top Navbar */}
      <nav className="td-nav">
        <NavLink to="/" className="td-brand">
          <img
            src="https://res.cloudinary.com/elearning-platform-vn/image/upload/v1789924695/edupulse/branding/edupulse_logo.jpg"
            className="td-logo"
            alt="EduPulse"
          />
          <span className="td-brand-title">EduPulse</span>
        </NavLink>

        <div className="td-nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <NotificationBell role="teacher" userId={ID} />
          <button className="td-btn-logout" onClick={handleLogout} title="Đăng xuất">
            <FaSignOutAlt />
            <span>Đăng xuất</span>
          </button>
        </div>
      </nav>

      {/* Welcome Banner */}
      <div className="td-banner">
        <div>
          <div className="td-banner-greeting">Chào mừng trở lại,</div>
          <h1 className="td-banner-name">
            {data.Lastname ? `${data.Lastname} ${data.Firstname}` : (data.Firstname || 'Giảng Viên')}
          </h1>
          <span className="td-banner-role">Bảng Điều Khiển Giảng Viên</span>
        </div>
        <img src={teachingImg} alt="Teaching" className="td-banner-img" />
      </div>

      {/* Sidebar */}
      <aside className="td-sidebar">
        <div className="td-profile-summary">
          <div className="td-avatar-wrap">
            <img
              src={data.Avatar || "https://res.cloudinary.com/elearning-platform-vn/image/upload/v1789924688/edupulse/teachers/teacher_nguyen_van_an.jpg"}
              alt="Avatar"
              className="td-avatar"
            />
          </div>
          <div className="td-user-name">
            {data.Lastname ? `${data.Lastname} ${data.Firstname}` : 'Thầy/Cô'}
          </div>
          <span className="td-user-badge">Giảng Viên Thẩm Định</span>
        </div>

        <nav className="td-nav-list">
          <NavLink
            to={`/Teacher/Dashboard/${ID}/Home`}
            className={({ isActive }) => `td-nav-item ${isActive ? 'active' : ''}`}
          >
            <FaHome className="td-nav-icon" />
            <span>Tổng Quan</span>
          </NavLink>

          <NavLink
            to={`/Teacher/Dashboard/${ID}/Classrooms`}
            className={({ isActive }) => `td-nav-item ${isActive ? 'active' : ''}`}
          >
            <FaUsers className="td-nav-icon" />
            <span>Quản Lý Lớp Học</span>
          </NavLink>

          <NavLink
            to={`/Teacher/Dashboard/${ID}/Classes`}
            className={({ isActive }) => `td-nav-item ${isActive ? 'active' : ''}`}
          >
            <FaChalkboardTeacher className="td-nav-icon" />
            <span>Lịch Dạy Trực Tuyến</span>
          </NavLink>

          <NavLink
            to={`/Teacher/Dashboard/${ID}/Courses`}
            className={({ isActive }) => `td-nav-item ${isActive ? 'active' : ''}`}
          >
            <FaBookOpen className="td-nav-icon" />
            <span>Quản Lý Khóa Học</span>
          </NavLink>

          <NavLink
            to={`/teacher/${ID}`}
            target="_blank"
            className="td-nav-item"
            style={{ marginTop: 'auto', borderTop: '1px solid var(--sidebar-border)', paddingTop: '14px' }}
          >
            <FaUserTie className="td-nav-icon" style={{ color: 'var(--primary)' }} />
            <span>Xem Hồ Sơ Công Khai</span>
            <FaExternalLinkAlt style={{ fontSize: '0.7rem', marginLeft: 'auto', opacity: 0.6 }} />
          </NavLink>
        </nav>
      </aside>
    </>
  );
}

export default TeacherDashboard;