import React, { useState, useEffect, useRef } from 'react';
import './Header.css';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaSun, FaMoon, FaChevronDown, FaHome, FaBookOpen, FaCalendarAlt, FaUserEdit, FaSignOutAlt, FaSearch } from 'react-icons/fa';
import { useAuth } from '../../../context/AuthContext';

function Header() {
  const navigate = useNavigate();
  const { user, role, isLoggedIn, logoutUser } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef(null);

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('edupulse-theme') || 'light';
  });

  // Scroll listener for header shrink (76px -> 60px)
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('edupulse-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleLogout = async () => {
    setDropdownOpen(false);
    try {
      const endpoint = role === 'teacher' ? '/api/teacher/logout' : '/api/student/logout';
      await fetch(endpoint, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (e) {
      console.error(e);
    } finally {
      logoutUser();
      navigate('/');
    }
  };

  const defaultAvatar = role === 'teacher'
    ? 'https://res.cloudinary.com/elearning-platform-vn/image/upload/v1789924688/edupulse/teachers/teacher_nguyen_van_an.jpg'
    : 'https://res.cloudinary.com/elearning-platform-vn/image/upload/v1789924694/edupulse/students/student_nguyen_van_bao.jpg';

  return (
    <>
      <header className={`edupulse-header ${isScrolled ? 'header-scrolled' : ''}`}>
        <div className="edupulse-header-container">
          {/* Logo & Brand */}
          <NavLink to="/" className="edupulse-brand">
            <div className="edupulse-logo-wrapper">
              <img src="/logo.png" alt="EduPulse Logo" className="edupulse-logo-img" />
            </div>
            <div className="edupulse-brand-text">
              <span className="edupulse-brand-title">Edu<span>Pulse</span></span>
              <span className="edupulse-brand-tagline">ACADEMY</span>
            </div>
          </NavLink>

          {/* Navigation Links with left-to-right underline animation */}
          <nav className="edupulse-nav">
            <ul className="edupulse-nav-list">
              <li>
                <NavLink to="/" className={({ isActive }) => `edupulse-nav-link academic-link ${isActive ? 'active' : ''}`}>
                  Trang Chủ
                </NavLink>
              </li>
              <li>
                <NavLink to="/courses" className={({ isActive }) => `edupulse-nav-link academic-link ${isActive ? 'active' : ''}`}>
                  Khóa Học
                </NavLink>
              </li>
              <li>
                <NavLink to="/about" className={({ isActive }) => `edupulse-nav-link academic-link ${isActive ? 'active' : ''}`}>
                  Về Chúng Tôi
                </NavLink>
              </li>
              <li>
                <NavLink to="/contact" className={({ isActive }) => `edupulse-nav-link academic-link ${isActive ? 'active' : ''}`}>
                  Liên Hệ
                </NavLink>
              </li>
            </ul>
          </nav>

          {/* Auth Actions & Theme Toggle */}
          <div className="edupulse-auth-group">
            {/* Theme Toggle (Núm trượt 200ms) */}
            <button
              type="button"
              className="theme-toggle-btn"
              onClick={toggleTheme}
              title={theme === 'light' ? 'Chuyển sang chế độ Tối' : 'Chuyển sang chế độ Sáng'}
              aria-label="Đổi giao diện Sáng / Tối"
            >
              <div className="theme-toggle-track">
                <div className={`theme-toggle-thumb ${theme === 'dark' ? 'thumb-dark' : ''}`}>
                  {theme === 'light' ? <FaSun size={12} className="text-amber-500" /> : <FaMoon size={11} className="text-sky-400" />}
                </div>
              </div>
            </button>

            {/* Khi ĐÃ ĐĂNG NHẬP: Hiển thị Profile Pill + Dropdown menu */}
            {isLoggedIn && user ? (
              <div className="edupulse-user-menu-wrap" ref={dropdownRef}>
                <button
                  type="button"
                  className="edupulse-user-btn"
                  onClick={() => setDropdownOpen(prev => !prev)}
                >
                  <img
                    src={user.avatar || defaultAvatar}
                    alt={user.name}
                    className="edupulse-user-avatar"
                  />
                  <div className="edupulse-user-meta">
                    <span className="edupulse-user-name">{user.name}</span>
                    <span className={`edupulse-user-role-badge ${role === 'teacher' ? 'role-teacher' : 'role-student'}`}>
                      {role === 'teacher' ? 'Giảng Viên' : 'Học Viên'}
                    </span>
                  </div>
                  <FaChevronDown size={11} className={`edupulse-dropdown-arrow ${dropdownOpen ? 'open' : ''}`} />
                </button>

                {/* Dropdown Menu với animation scale 0.96 -> 1 + fade */}
                {dropdownOpen && (
                  <div className="edupulse-dropdown-panel account-dropdown-menu">
                    <div className="edupulse-dropdown-header">
                      <p className="edupulse-dropdown-title">{user.name}</p>
                      <p className="edupulse-dropdown-sub">{user.email || (role === 'teacher' ? 'Tài khoản Giảng viên' : 'Tài khoản Học viên')}</p>
                    </div>

                    <div className="edupulse-dropdown-body">
                      {role === 'teacher' ? (
                        <>
                          <NavLink
                            to={`/Teacher/Dashboard/${user.id}/Home`}
                            className="edupulse-dropdown-item"
                            onClick={() => setDropdownOpen(false)}
                          >
                            <FaHome className="dropdown-icon" />
                            <span>Bảng Điều Khiển Giảng Viên</span>
                          </NavLink>
                          <NavLink
                            to={`/Teacher/Dashboard/${user.id}/Courses`}
                            className="edupulse-dropdown-item"
                            onClick={() => setDropdownOpen(false)}
                          >
                            <FaBookOpen className="dropdown-icon" />
                            <span>Quản Lý Khóa Học</span>
                          </NavLink>
                          <NavLink
                            to={`/Teacher/Dashboard/${user.id}/Classes`}
                            className="edupulse-dropdown-item"
                            onClick={() => setDropdownOpen(false)}
                          >
                            <FaCalendarAlt className="dropdown-icon" />
                            <span>Lịch Dạy Trực Tuyến</span>
                          </NavLink>
                          <NavLink
                            to={`/Teacher/Dashboard/${user.id}/Profile`}
                            className="edupulse-dropdown-item"
                            onClick={() => setDropdownOpen(false)}
                          >
                            <FaUserEdit className="dropdown-icon" />
                            <span>Hồ Sơ & Bằng Cấp</span>
                          </NavLink>
                        </>
                      ) : (
                        <>
                          <NavLink
                            to={`/Student/Dashboard/${user.id}/Courses`}
                            className="edupulse-dropdown-item"
                            onClick={() => setDropdownOpen(false)}
                          >
                            <FaBookOpen className="dropdown-icon" />
                            <span>Khóa Học Của Tôi</span>
                          </NavLink>
                          <NavLink
                            to={`/Student/Dashboard/${user.id}/Classes`}
                            className="edupulse-dropdown-item"
                            onClick={() => setDropdownOpen(false)}
                          >
                            <FaCalendarAlt className="dropdown-icon" />
                            <span>Lịch Học Trực Tuyến</span>
                          </NavLink>
                          <NavLink
                            to={`/Student/Dashboard/${user.id}/Search`}
                            className="edupulse-dropdown-item"
                            onClick={() => setDropdownOpen(false)}
                          >
                            <FaSearch className="dropdown-icon" />
                            <span>Khám Phá Khóa Học</span>
                          </NavLink>
                          <NavLink
                            to={`/Student/Dashboard/${user.id}/Profile`}
                            className="edupulse-dropdown-item"
                            onClick={() => setDropdownOpen(false)}
                          >
                            <FaUserEdit className="dropdown-icon" />
                            <span>Hồ Sơ Cá Nhân</span>
                          </NavLink>
                        </>
                      )}
                    </div>

                    <div className="edupulse-dropdown-footer">
                      <button type="button" className="edupulse-dropdown-item text-red-500" onClick={handleLogout}>
                        <FaSignOutAlt className="dropdown-icon" />
                        <span>Đăng Xuất</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Khi CHƯA ĐĂNG NHẬP: 2 nút tiêu chuẩn */
              <>
                <NavLink to="/login" className="edupulse-btn-login">
                  Đăng Nhập
                </NavLink>
                <NavLink to="/signup" className="edupulse-btn-signup">
                  Đăng Ký Ngay
                </NavLink>
              </>
            )}
          </div>
        </div>
      </header>
      <div className="edupulse-header-spacer"></div>
    </>
  );
}

export default Header;
