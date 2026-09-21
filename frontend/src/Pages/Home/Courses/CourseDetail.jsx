import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../../Footer/Footer';
import { FaCheckCircle, FaVideo, FaClock, FaCalendarAlt, FaUsers, FaUserGraduate, FaGraduationCap, FaChevronDown, FaChevronUp, FaTimes } from 'react-icons/fa';
import { MdSchool, MdVerified } from 'react-icons/md';
import { getCourseSubjectLabel, getCourseLevelLabel, DAYS_VI, formatTime } from '../../../data/subjectTaxonomy';
import './CourseDetail.css';

function CourseDetail() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const stickyRef = useRef(null);

  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedChapters, setExpandedChapters] = useState({ 0: true }); // Mở sẵn buổi 1
  const [enrolling, setEnrolling] = useState(false);
  const [enrollSuccess, setEnrollSuccess] = useState(false);
  const [enrollMsg, setEnrollMsg] = useState('');
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showMobileSticky, setShowMobileSticky] = useState(false);
  const [classrooms, setClassrooms] = useState([]);
  const [selectedClassroom, setSelectedClassroom] = useState(null);

  // Theo dõi cuộn trang: Vạch tiến độ đọc 2px & Sticky bar đáy trên mobile
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, progress)));
      }

      // Mobile sticky bar trượt lên khi cuộn qua hero (khoảng 350px)
      if (window.scrollY > 380) {
        setShowMobileSticky(true);
      } else {
        setShowMobileSticky(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/public/course/${courseId}`, {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        });
        const data = await res.json();
        if (data.statusCode === 200 && data.data) {
          setCourseData(data.data);
        } else {
          setError('Không tìm thấy khóa học này.');
        }

        // Fetch danh sách lớp mở của khóa học này
        const classRes = await fetch(`/api/classrooms/course/${courseId}`);
        if (classRes.ok) {
          const classData = await classRes.json();
          setClassrooms(classData.data || []);
        }
      } catch {
        setError('Lỗi kết nối. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };
    if (courseId) fetchCourse();
  }, [courseId]);

  const [guestModal, setGuestModal] = useState(false);
  const [activeStudentId, setActiveStudentId] = useState(null);

  const currentUser = (() => {
    try {
      const saved = localStorage.getItem('edupulse_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  })();

  const handleEnroll = async (specificClass = null) => {
    if (currentUser?.role === 'teacher') {
      return; // Giáo viên không đăng ký học chính khóa học
    }

    if (specificClass) {
      setSelectedClassroom(specificClass);
    } else {
      setSelectedClassroom(null);
    }

    if (currentUser?.role === 'student') {
      setActiveStudentId(currentUser.id);
      setShowEnrollModal(true);
      return;
    }

    // Nếu chưa đăng nhập hoặc không có session
    try {
      const checkRes = await fetch('/api/student/StudentDocument/me', {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      if (checkRes.ok) {
        const studentData = await checkRes.json();
        const studentId = studentData.data?._id;
        if (studentId) {
          setActiveStudentId(studentId);
          setShowEnrollModal(true);
          return;
        }
      }
    } catch {
      // Ignored
    }

    // Hiển thị modal yêu cầu đăng nhập thân thiện
    setGuestModal(true);
  };

  const confirmEnroll = async () => {
    setEnrolling(true);
    setEnrollMsg('');
    try {
      if (selectedClassroom) {
        // Đăng ký vào lớp học cụ thể
        const res = await fetch(`/api/classrooms/${selectedClassroom._id}/enroll`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        });
        const result = await res.json();
        if (res.ok && result.success) {
          setEnrollSuccess(true);
          setEnrollMsg({ type: 'success', text: `Tham gia lớp "${selectedClassroom.className}" thành công!` });
        } else {
          setEnrollMsg({ type: 'error', text: result.message || 'Đăng ký lớp học thất bại.' });
        }
      } else {
        // Đăng ký chung vào khóa học
        const checkRes = await fetch('/api/student/StudentDocument/me', {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        });
        const studentData = await checkRes.json();
        const studentId = studentData.data?._id;

        const res = await fetch(`/api/public/course/${courseId}/enroll/${studentId}`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        });
        const result = await res.json();
        if (res.ok) {
          setEnrollSuccess(true);
          setEnrollMsg({ type: 'success', text: result.data?.message || 'Đăng ký thành công!' });
          const refreshRes = await fetch(`/api/public/course/${courseId}`, { credentials: 'include' });
          const refreshData = await refreshRes.json();
          if (refreshData.data) setCourseData(refreshData.data);
        } else {
          setEnrollMsg({ type: 'error', text: result.message || 'Đăng ký thất bại.' });
        }
      }
    } catch {
      setEnrollMsg({ type: 'error', text: 'Lỗi kết nối. Vui lòng thử lại.' });
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="page-wrapper">
        <Header />
        <div className="edu-loading-state" style={{ flex: 1 }}>
          <div className="edu-spinner"></div>
          <p>Đang tải thông tin khóa học...</p>
        </div>
      </div>
    );
  }

  if (error || !courseData) {
    return (
      <div className="page-wrapper">
        <Header />
        <div className="edu-empty-state" style={{ flex: 1 }}>
          <h3>Không tìm thấy khóa học</h3>
          <p>{error}</p>
          <NavLink to="/courses" className="btn-primary" style={{ marginTop: 20, display: 'inline-flex' }}>
            Quay lại danh sách khóa học
          </NavLink>
        </div>
        <Footer />
      </div>
    );
  }

  const teacher = courseData.enrolledteacher;
  const spotsLeft = (courseData.maxStudents || 20) - (courseData.enrolledStudent?.length || 0);
  const subjectLabel = getCourseSubjectLabel(courseData);
  const levelLabel = getCourseLevelLabel(courseData);
  const isFull = spotsLeft <= 0;

  const formatDate = (date) => {
    if (!date) return 'Sắp thông báo';
    return new Date(date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div className="page-wrapper">
      {/* Vạch tiến độ đọc 2px ở đỉnh trang */}
      <div className="cd-reading-progress-bar" style={{ width: `${scrollProgress}%` }}></div>

      <Header />

      {/* ======= HERO BANNER ======= */}
      <section className="cd-hero">
        <div className="cd-hero-glow"></div>
        <div className="section-container">
          {/* Breadcrumb */}
          <nav className="cd-breadcrumb">
            <NavLink to="/">Trang Chủ</NavLink>
            <span>/</span>
            <NavLink to="/courses">Khóa Học</NavLink>
            <span>/</span>
            <span>{subjectLabel}</span>
          </nav>

          {/* Tags */}
          <div className="cd-hero-tags">
            <span className="cd-level-tag">{levelLabel}</span>
            {courseData.grade && <span className="cd-grade-tag">{courseData.grade === 'on-thi' ? 'Luyện Thi' : `Lớp ${courseData.grade}`}</span>}
            <span className="cd-subject-tag">{subjectLabel}</span>
            <span className="cd-live-tag">
              <span className="live-dot"></span>
              Google Meet Trực Tuyến
            </span>
          </div>

          {/* Course Title */}
          <h1 className="cd-hero-title">
            {courseData.liveClasses?.[0]?.title?.split(' - ')[0] || subjectLabel}
          </h1>
          <p className="cd-hero-desc">{courseData.description}</p>

          {/* Teacher Quick Info */}
          {teacher && (
            <NavLink to={`/teacher/${teacher._id}`} className="cd-teacher-quick">
              <img
                src={teacher.Avatar || 'https://res.cloudinary.com/elearning-platform-vn/image/upload/v1789924688/edupulse/teachers/teacher_nguyen_van_an.jpg'}
                alt={`${teacher.Lastname} ${teacher.Firstname}`}
                className="cd-teacher-quick-avatar"
              />
              <div className="cd-teacher-quick-info">
                <span className="cd-teacher-quick-name">{teacher.Lastname} {teacher.Firstname}</span>
                {teacher.Isapproved === 'approved' && (
                  <span className="badge-verified">
                    <MdVerified /> Đã Thẩm Định
                  </span>
                )}
              </div>
            </NavLink>
          )}
        </div>
      </section>

      {/* ======= MAIN CONTENT + STICKY SIDEBAR ======= */}
      <div className="cd-main-layout section-container">

        {/* LEFT: Course Content */}
        <div className="cd-content-col">

          {/* Mục tiêu đầu ra */}
          {courseData.outcomes && courseData.outcomes.length > 0 && (
            <section className="cd-section">
              <h2 className="cd-section-title">
                <FaGraduationCap className="cd-section-icon" />
                Học Xong Bạn Sẽ Làm Được
              </h2>
              <ul className="cd-outcomes-list">
                {courseData.outcomes.map((item, i) => (
                  <li key={i} className="cd-outcome-item">
                    <FaCheckCircle className="cd-outcome-check" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Đối tượng & Điều kiện */}
          {courseData.prerequisites && (
            <section className="cd-section">
              <h2 className="cd-section-title">
                <MdSchool className="cd-section-icon" />
                Đối Tượng & Điều Kiện Đầu Vào
              </h2>
              <div className="cd-prerequisites-box">
                <p>{courseData.prerequisites}</p>
              </div>
            </section>
          )}

          {/* Đề cương */}
          {courseData.syllabus && courseData.syllabus.length > 0 && (
            <section className="cd-section">
              <h2 className="cd-section-title">
                <span className="cd-section-icon" style={{fontSize: '1.1rem', fontWeight: 700}}>01</span>
                Đề Cương Khóa Học
              </h2>
              <div className="cd-syllabus-list">
                {courseData.syllabus.map((item, i) => (
                  <div key={i} className="cd-syllabus-item">
                    <button
                      className="cd-syllabus-header"
                      onClick={() => setExpandedChapters(prev => ({ ...prev, [i]: !prev[i] }))}
                    >
                      <span className="cd-chapter-num">{String(i + 1).padStart(2, '0')}</span>
                      <span className="cd-chapter-title">{item.chapter}</span>
                      <FaChevronDown className={`cd-chapter-arrow ${expandedChapters[i] ? 'open' : ''}`} />
                    </button>
                    {expandedChapters[i] && (
                      <div className="cd-syllabus-content">
                        <p>{item.content}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Các Lớp Học Đang Tuyển Sinh (Nhóm & 1-kèm-1) */}
          {classrooms && classrooms.length > 0 && (
            <section className="cd-section">
              <h2 className="cd-section-title">
                <FaUsers className="cd-section-icon text-sky-400" />
                Các Lớp Học Đang Mở Tuyển Sinh
              </h2>
              <p style={{ fontSize: '0.88rem', color: '#94a3b8', marginBottom: 16 }}>
                Chọn lớp học phù hợp với lịch trình của bạn (hỗ trợ cả lớp nhóm và gia sư 1 kèm 1):
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
                {classrooms.map((cls) => {
                  const is1on1 = cls.classType === 'one-on-one';
                  const isClsFull = cls.students?.length >= cls.maxStudents;
                  return (
                    <div
                      key={cls._id}
                      style={{
                        background: '#1e293b',
                        border: is1on1 ? '2px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.12)',
                        borderRadius: 16,
                        padding: 18,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                          <span
                            style={{
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              padding: '2px 8px',
                              borderRadius: 9999,
                              background: is1on1 ? 'rgba(245, 158, 11, 0.15)' : 'rgba(14, 165, 233, 0.15)',
                              color: is1on1 ? '#fbbf24' : '#38bdf8',
                              border: is1on1 ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid rgba(14, 165, 233, 0.3)'
                            }}
                          >
                            {is1on1 ? '🎯 Lớp 1 Kèm 1' : '👥 Lớp Nhóm'}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: '#64748b', fontFamily: 'monospace' }}>
                            {cls.classCode}
                          </span>
                        </div>

                        <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', marginBottom: 6 }}>
                          {cls.className}
                        </h4>

                        <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: 12 }}>
                          Sĩ số: <strong>{cls.students?.length || 0}</strong> / {cls.maxStudents} học viên
                        </div>

                        {cls.weeklySchedule && cls.weeklySchedule.length > 0 && (
                          <div style={{ fontSize: '0.78rem', color: '#cbd5e1', marginBottom: 16 }}>
                            {cls.weeklySchedule.map((w, idx) => (
                              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 6, margin: '4px 0' }}>
                                <FaClock style={{ color: '#38bdf8', fontSize: '0.72rem' }} />
                                <span>
                                  {DAYS_VI[w.dayOfWeek]}: {w.startTime} – {w.endTime}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: 10,
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          background: isClsFull ? 'rgba(255, 255, 255, 0.08)' : is1on1 ? '#d97706' : '#0284c7',
                          color: isClsFull ? '#64748b' : '#ffffff',
                          border: 'none',
                          cursor: isClsFull ? 'not-allowed' : 'pointer',
                          transition: 'all 0.2s'
                        }}
                        disabled={isClsFull}
                        onClick={() => handleEnroll(cls)}
                      >
                        {isClsFull ? 'Lớp Đã Đủ Sĩ Số' : is1on1 ? 'Đăng Ký Học 1 Kèm 1' : 'Đăng Ký Vào Lớp Này'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Lịch học */}
          {courseData.schedule && courseData.schedule.length > 0 && (
            <section className="cd-section">
              <h2 className="cd-section-title">
                <FaCalendarAlt className="cd-section-icon" />
                Lịch Học Hàng Tuần
              </h2>
              <div className="cd-schedule-grid">
                {courseData.schedule.map((s, i) => (
                  <div key={i} className="cd-schedule-item">
                    <span className="cd-schedule-day">{DAYS_VI[s.day]}</span>
                    <span className="cd-schedule-time">
                      <FaClock style={{ fontSize: '0.75rem' }} />
                      {formatTime(s.starttime)} – {formatTime(s.endtime)}
                    </span>
                  </div>
                ))}
              </div>
              {courseData.liveClasses?.[0]?.timing && (
                <p className="cd-session-duration">
                  Thời lượng mỗi buổi: <strong>{courseData.liveClasses[0].timing} phút</strong> · Học trực tiếp qua Google Meet
                </p>
              )}
            </section>
          )}

          {/* Giảng viên chi tiết */}
          {teacher && (
            <section className="cd-section">
              <h2 className="cd-section-title">
                Giảng Viên Phụ Trách
              </h2>
              <NavLink to={`/teacher/${teacher._id}`} className="cd-teacher-card">
                <img
                  src={teacher.Avatar || 'https://res.cloudinary.com/elearning-platform-vn/image/upload/v1789924688/edupulse/teachers/teacher_nguyen_van_an.jpg'}
                  alt={`${teacher.Lastname} ${teacher.Firstname}`}
                  className="cd-teacher-card-avatar"
                />
                <div className="cd-teacher-card-info">
                  <div className="cd-teacher-card-header">
                    <h3 className="cd-teacher-card-name">{teacher.Lastname} {teacher.Firstname}</h3>
                    {teacher.Isapproved === 'approved' && (
                      <span className="badge-verified">
                        <MdVerified /> Đã Thẩm Định
                      </span>
                    )}
                  </div>
                  {teacher.Teacherdetails?.Experience && (
                    <p className="cd-teacher-card-exp">
                      {teacher.Teacherdetails.Experience} năm kinh nghiệm giảng dạy
                    </p>
                  )}
                  {teacher.bio && <p className="cd-teacher-card-bio">{teacher.bio}</p>}
                  <span className="cd-teacher-card-link">Xem hồ sơ đầy đủ →</span>
                </div>
              </NavLink>
            </section>
          )}

        </div>

        {/* RIGHT: Sticky Registration Sidebar */}
        <aside className="cd-sticky-sidebar" ref={stickyRef}>
          <div className="cd-sticky-panel">
            {/* Giá */}
            <div className="cd-price-block">
              {courseData.fees > 0 ? (
                <>
                  <span className="cd-price">{courseData.fees.toLocaleString('vi-VN')}đ</span>
                  <span className="cd-price-period">/ khóa học</span>
                </>
              ) : (
                <div className="cd-price-free">
                  <span className="cd-price">Miễn Phí</span>
                  <span className="badge-beta" style={{ marginLeft: 8 }}>BETA</span>
                </div>
              )}
            </div>

            {/* Thông tin nhanh */}
            <div className="cd-quick-info">
              <div className="cd-quick-row">
                <FaCalendarAlt className="cd-quick-icon" />
                <span>Khai giảng: <strong>{formatDate(courseData.startDate)}</strong></span>
              </div>
              <div className="cd-quick-row">
                <FaUsers className="cd-quick-icon" />
                <span>Còn trống: <strong className={isFull ? 'text-red' : 'text-green'}>{isFull ? 'Hết chỗ' : `${spotsLeft} / ${courseData.maxStudents || 20} chỗ`}</strong></span>
              </div>
              <div className="cd-quick-row">
                <FaVideo className="cd-quick-icon" />
                <span>Hình thức: <strong>Google Meet Trực Tuyến</strong></span>
              </div>
              {courseData.liveClasses?.[0]?.timing && (
                <div className="cd-quick-row">
                  <FaClock className="cd-quick-icon" />
                  <span>Thời lượng: <strong>{courseData.liveClasses[0].timing} phút/buổi</strong></span>
                </div>
              )}
            </div>

            {/* Nút hành động */}
            {currentUser?.role === 'teacher' ? (
              <NavLink
                to={`/Teacher/Dashboard/${currentUser.id}/Courses`}
                className="cd-enroll-btn"
                style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}
              >
                Vào Cổng Giảng Viên →
              </NavLink>
            ) : (
              <button
                className={`cd-enroll-btn ${isFull ? 'cd-enroll-btn--disabled' : ''}`}
                onClick={handleEnroll}
                disabled={isFull}
              >
                {isFull ? 'Lớp Đã Đầy' : 'Đăng Ký Khóa Học'}
              </button>
            )}

            <p className="cd-enroll-note">
              {currentUser?.role === 'teacher' 
                ? 'Bạn đang xem môn học với tư cách Giảng viên.' 
                : 'Khóa học học trực tuyến qua Google Meet với giảng viên uy tín.'}
            </p>
          </div>
        </aside>
      </div>

      <Footer />

      {/* ======= MODAL HƯỚNG DẪN KHÁCH CHƯA ĐĂNG NHẬP ======= */}
      {guestModal && (
        <div className="cd-modal-overlay" onClick={() => setGuestModal(false)}>
          <div className="cd-modal" onClick={e => e.stopPropagation()}>
            <button className="cd-modal-close" onClick={() => setGuestModal(false)}>
              <FaTimes />
            </button>
            <div className="cd-modal-icon">
              <FaGraduationCap />
            </div>
            <h3 className="cd-modal-title">Yêu Cầu Tài Khoản Học Viên</h3>
            <p className="cd-modal-desc">
              Để đăng ký tham gia lớp học trực tuyến <strong>{subjectLabel}</strong>, bạn cần đăng nhập bằng tài khoản Học Viên trên EduPulse.
            </p>
            <div className="cd-modal-actions" style={{ flexDirection: 'column', gap: 10, marginTop: 20 }}>
              <NavLink
                to="/login"
                className="btn-primary"
                style={{ width: '100%', textAlign: 'center', textDecoration: 'none' }}
              >
                Đăng Nhập Tài Khoản Học Viên
              </NavLink>
              <NavLink
                to="/signup"
                className="btn-ghost"
                style={{ width: '100%', textAlign: 'center', textDecoration: 'none' }}
              >
                Tạo Tài Khoản Mới Miễn Phí
              </NavLink>
            </div>
          </div>
        </div>
      )}

      {/* ======= ENROLLMENT MODAL ======= */}
      {showEnrollModal && (
        <div className="cd-modal-overlay" onClick={() => setShowEnrollModal(false)}>
          <div className="cd-modal" onClick={e => e.stopPropagation()}>
            <button className="cd-modal-close" onClick={() => setShowEnrollModal(false)}>
              <FaTimes />
            </button>

            {enrollSuccess ? (
              <div className="edu-enroll-success-box text-center">
                {/* SVG Dấu tích vẽ nét trong 400ms - Chuẩn yêu cầu người dùng, không confetti */}
                <div className="edu-checkmark-wrap">
                  <svg className="edu-checkmark-svg" viewBox="0 0 52 52">
                    <circle className="edu-checkmark-circle" cx="26" cy="26" r="24" fill="none" />
                    <path className="edu-checkmark-path" fill="none" d="M14 27 l7 7 l16 -16" />
                  </svg>
                </div>
                <h3 className="cd-modal-title" style={{ marginTop: 16 }}>Đăng Ký Thành Công!</h3>
                <p className="cd-modal-desc" style={{ marginTop: 8 }}>
                  Bạn đã ghi danh thành công vào lớp <strong>{subjectLabel}</strong>. Lịch học và đường link Google Meet đã được đồng bộ vào Góc học tập của bạn.
                </p>
                <div className="cd-modal-actions" style={{ marginTop: 24 }}>
                  <NavLink
                    to={`/Student/Dashboard/${activeStudentId || currentUser?.id}/Courses`}
                    className="btn-primary"
                    style={{ width: '100%', textDecoration: 'none', textAlign: 'center', borderRadius: '9999px' }}
                  >
                    Vào Góc Học Tập Ngay →
                  </NavLink>
                </div>
              </div>
            ) : (
              <>
                <div className="cd-modal-icon">
                  <FaGraduationCap />
                </div>
                <h3 className="cd-modal-title">
                  {selectedClassroom
                    ? `Xác Nhận Đăng Ký ${selectedClassroom.classType === 'one-on-one' ? 'Lớp 1 Kèm 1' : 'Lớp Nhóm'}`
                    : 'Xác Nhận Đăng Ký Khóa Học'}
                </h3>
                <p className="cd-modal-desc">
                  {selectedClassroom ? (
                    <>Bạn đang đăng ký vào lớp <strong>{selectedClassroom.className}</strong> ({selectedClassroom.classCode})</>
                  ) : (
                    <>Bạn đang đăng ký tham gia khóa học <strong>{subjectLabel}</strong></>
                  )}
                  {teacher && <> do <strong>{teacher.Lastname} {teacher.Firstname}</strong> phụ trách</>}.
                </p>
                <div className="cd-modal-info">
                  <div className="cd-modal-info-row">
                    <span>Học phí:</span>
                    <strong className="text-success">{courseData.fees > 0 ? `${courseData.fees.toLocaleString('vi-VN')}đ` : 'Miễn Phí (Beta)'}</strong>
                  </div>
                  <div className="cd-modal-info-row">
                    <span>Hình thức:</span>
                    <strong>Google Meet Trực Tuyến</strong>
                  </div>
                  <div className="cd-modal-info-row">
                    <span>Chỗ còn lại:</span>
                    <strong>{spotsLeft} chỗ</strong>
                  </div>
                </div>

                {enrollMsg && enrollMsg.type === 'error' && (
                  <div className="cd-modal-msg cd-modal-msg--error">
                    {enrollMsg.text}
                  </div>
                )}

                <div className="cd-modal-actions">
                  <button
                    className="btn-ghost"
                    onClick={() => setShowEnrollModal(false)}
                    disabled={enrolling}
                    style={{ borderRadius: '9999px' }}
                  >
                    Hủy
                  </button>
                  <button
                    className="btn-primary edu-btn-enroll-action"
                    onClick={confirmEnroll}
                    disabled={enrolling}
                    style={{ borderRadius: '9999px', minWidth: '160px' }}
                  >
                    {enrolling ? (
                      <span className="flex items-center gap-2 justify-center">
                        <span className="edu-spinner-mini"></span>
                        <span>Đang xử lý…</span>
                      </span>
                    ) : (
                      'Xác Nhận Đăng Ký'
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ======= THANH ĐĂNG KÝ CỐ ĐỊNH TRÊN MOBILE (Bottom Bar) ======= */}
      {showMobileSticky && (
        <div className="cd-mobile-sticky-bar">
          <div className="cd-mobile-sticky-info">
            <span className="cd-mobile-sticky-price">
              {courseData.fees > 0 ? `${courseData.fees.toLocaleString('vi-VN')}đ` : 'Miễn Phí'}
            </span>
            <span className="cd-mobile-sticky-spots">Còn {spotsLeft} chỗ</span>
          </div>
          <button
            className="cd-mobile-sticky-btn"
            onClick={handleEnroll}
            disabled={isFull}
          >
            {isFull ? 'Lớp Đầy' : 'Đăng Ký'}
          </button>
        </div>
      )}
    </div>
  );
}

export default CourseDetail;
