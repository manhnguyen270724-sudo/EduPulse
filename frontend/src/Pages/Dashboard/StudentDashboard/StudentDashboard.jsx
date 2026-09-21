import React, { useEffect, useState } from 'react';
import { NavLink, useParams, useNavigate } from 'react-router-dom';
import { FaBookOpen, FaCalendarAlt, FaChalkboardTeacher, FaSignOutAlt } from 'react-icons/fa';
import teachingImg from '../../Images/Teaching.svg';
import './StudentDashboard.css';

function StudentDashboard() {
  const { ID } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState({});

  const handleLogout = async () => {
    try {
      const response = await fetch(`/api/student/logout`, {
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
        const response = await fetch(`/api/Student/StudentDocument/${ID}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const user = await response.json();
        setData(user.data || {});
      } catch (error) {
        console.error("Fetch student data error:", error);
      }
    };
    if (ID) getData();
  }, [ID]);

  return (
    <>
      {/* Top Navbar */}
      <nav className="sd-nav">
        <NavLink to="/" className="sd-brand">
          <img
            src="https://res.cloudinary.com/elearning-platform-vn/image/upload/v1789924695/edupulse/branding/edupulse_logo.jpg"
            className="sd-logo"
            alt="EduPulse"
          />
          <span className="sd-brand-title">EduPulse</span>
        </NavLink>

        <div className="sd-nav-actions">
          <button className="sd-btn-logout" onClick={handleLogout} title="Đăng xuất">
            <FaSignOutAlt />
            <span>Đăng xuất</span>
          </button>
        </div>
      </nav>

      {/* Welcome Banner */}
      <div className="sd-banner">
        <div>
          <div className="sd-banner-greeting">Chào mừng trở lại,</div>
          <h1 className="sd-banner-name">
            {data.Lastname ? `${data.Lastname} ${data.Firstname}` : (data.Firstname || 'Học Viên')}
          </h1>
          <span className="sd-banner-role">Góc Học Tập Học Viên</span>
        </div>
        <img src={teachingImg} alt="Student" className="sd-banner-img" />
      </div>

      {/* Sidebar */}
      <aside className="sd-sidebar">
        <div className="sd-profile-summary">
          <div className="sd-avatar-wrap">
            <img
              src={data.Avatar || "https://res.cloudinary.com/elearning-platform-vn/image/upload/v1789924694/edupulse/students/student_nguyen_van_bao.jpg"}
              alt="Avatar"
              className="sd-avatar"
            />
          </div>
          <div className="sd-user-name">
            {data.Lastname ? `${data.Lastname} ${data.Firstname}` : 'Học Viên'}
          </div>
          <span className="sd-user-badge">Học Viên EduPulse</span>
        </div>

        <nav className="sd-nav-list">
          <NavLink
            to={`/Student/Dashboard/${ID}/Courses`}
            className={({ isActive }) => `sd-nav-item ${isActive ? 'active' : ''}`}
          >
            <FaBookOpen className="sd-nav-icon" />
            <span>Khóa Học Của Tôi</span>
          </NavLink>

          <NavLink
            to={`/Student/Dashboard/${ID}/Classes`}
            className={({ isActive }) => `sd-nav-item ${isActive ? 'active' : ''}`}
          >
            <FaCalendarAlt className="sd-nav-icon" />
            <span>Lịch Học Trực Tuyến</span>
          </NavLink>

          <NavLink
            to={`/Student/Dashboard/${ID}/Search`}
            className={({ isActive }) => `sd-nav-item ${isActive ? 'active' : ''}`}
          >
            <FaChalkboardTeacher className="sd-nav-icon" />
            <span>Tìm Giảng Viên</span>
          </NavLink>
        </nav>
      </aside>
    </>
  );
}

export default StudentDashboard;