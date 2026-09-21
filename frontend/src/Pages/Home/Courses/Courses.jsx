import React, { useState, useEffect, useMemo } from 'react';
import './Courses.css';
import Footer from '../../Footer/Footer';
import Header from '../Header/Header';
import { FaCheckCircle, FaVideo, FaSearch, FaTimes, FaUsers, FaClock, FaCalendarAlt } from 'react-icons/fa';
import { MdVerified } from 'react-icons/md';
import { NavLink } from 'react-router-dom';
import {
  EDUCATION_LEVELS,
  SUBJECTS_BY_LEVEL,
  getCourseSubjectLabel,
  getCourseLevelLabel,
  DAYS_VI,
  formatTime
} from '../../../data/subjectTaxonomy';

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Bộ lọc 3 tầng
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');

  // Lấy danh sách lớp và môn dựa vào cấp đã chọn
  const currentLevel = EDUCATION_LEVELS.find(l => l.key === selectedLevel);
  const availableGrades = currentLevel?.grades || [];
  const availableSubjects = selectedLevel !== 'all' ? (SUBJECTS_BY_LEVEL[selectedLevel] || []) : [];

  // Load courses từ API mới (public endpoint với filter)
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedLevel !== 'all') params.append('level', selectedLevel);
        if (selectedGrade) params.append('grade', selectedGrade);
        if (selectedSubject) params.append('subject', selectedSubject);
        if (searchQuery.trim()) params.append('search', searchQuery.trim());

        const response = await fetch(`/api/public/courses?${params.toString()}`, {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        });
        const resData = await response.json();
        if (resData.data && Array.isArray(resData.data)) {
          setCourses(resData.data);
        } else {
          setCourses([]);
        }
      } catch (err) {
        console.error("Lỗi khi tải khóa học:", err);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search
    const timer = setTimeout(fetchCourses, 300);
    return () => clearTimeout(timer);
  }, [selectedLevel, selectedGrade, selectedSubject, searchQuery]);

  const handleLevelChange = (levelKey) => {
    setSelectedLevel(levelKey);
    setSelectedGrade('');
    setSelectedSubject('');
  };

  const handleGradeChange = (gradeKey) => {
    setSelectedGrade(prev => prev === gradeKey ? '' : gradeKey);
    setSelectedSubject('');
  };

  const handleSubjectChange = (subjectKey) => {
    setSelectedSubject(prev => prev === subjectKey ? '' : subjectKey);
  };

  const resetFilters = () => {
    setSelectedLevel('all');
    setSelectedGrade('');
    setSelectedSubject('');
    setSearchQuery('');
  };

  const hasActiveFilter = selectedLevel !== 'all' || selectedGrade || selectedSubject || searchQuery;

  return (
    <div className="courses-page">
      <Header />

      {/* ═══ HERO BANNER ═══ */}
      <section className="courses-hero-banner">
        <div className="courses-hero-glow"></div>
        <div className="courses-hero-container">
          <div className="courses-hero-tag">CHƯƠNG TRÌNH ĐÀO TẠO CHUẨN MỰC</div>
          <h1 className="courses-hero-title">
            Hệ Thống Khóa Học &amp; <span className="gradient-text">Cố Vấn Học Thuật</span>
          </h1>
          <p className="courses-hero-desc">
            Khám phá các khóa học tương tác thời gian thực từ Tiểu Học đến Đại Học.
            Học trực tiếp qua Google Meet cùng các giảng viên đã được EduPulse thẩm định.
          </p>

          {/* Search Bar */}
          <div className="courses-search-bar-wrap">
            <div className="courses-search-bar">
              <FaSearch className="search-input-icon" />
              <input
                type="text"
                className="courses-search-input"
                placeholder="Tìm khóa học, tên giảng viên hoặc môn học..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="clear-search-btn"
                  onClick={() => setSearchQuery('')}
                  title="Xóa tìm kiếm"
                >
                  <FaTimes />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ BỘ LỌC 3 TẦNG ═══ */}
      <section className="courses-filter-section">
        <div className="courses-filter-container">

          {/* Tầng 1: Cấp học */}
          <div className="filter-tier">
            <span className="filter-tier-label">Cấp học</span>
            <div className="filter-pills-row">
              <button
                className={`filter-pill ${selectedLevel === 'all' ? 'active' : ''}`}
                onClick={() => handleLevelChange('all')}
              >
                Tất Cả
              </button>
              {EDUCATION_LEVELS.map(level => (
                <button
                  key={level.key}
                  className={`filter-pill ${selectedLevel === level.key ? 'active' : ''}`}
                  onClick={() => handleLevelChange(level.key)}
                >
                  {level.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tầng 2: Lớp (chỉ hiện khi cấp học có phân lớp) */}
          {availableGrades.length > 0 && (
            <div className="filter-tier filter-tier--secondary">
              <span className="filter-tier-label">Lớp</span>
              <div className="filter-pills-row">
                {availableGrades.map(grade => (
                  <button
                    key={grade.key}
                    className={`filter-pill filter-pill--sm ${selectedGrade === grade.key ? 'active' : ''}`}
                    onClick={() => handleGradeChange(grade.key)}
                  >
                    {grade.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tầng 3: Môn học */}
          {availableSubjects.length > 0 && (
            <div className="filter-tier filter-tier--secondary">
              <span className="filter-tier-label">Môn học</span>
              <div className="filter-pills-row">
                {availableSubjects.map(subject => (
                  <button
                    key={subject.key}
                    className={`filter-pill filter-pill--sm ${selectedSubject === subject.key ? 'active' : ''}`}
                    onClick={() => handleSubjectChange(subject.key)}
                  >
                    {subject.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ═══ STATUS BAR ═══ */}
      <div className="courses-status-row">
        <span>
          Hiển thị <span className="courses-count-highlight">{courses.length}</span> khóa học
          {selectedLevel !== 'all' && <> · {currentLevel?.label}</>}
          {selectedGrade && <> · {availableGrades.find(g => g.key === selectedGrade)?.label}</>}
          {selectedSubject && <> · {availableSubjects.find(s => s.key === selectedSubject)?.label}</>}
        </span>
        {hasActiveFilter && (
          <button className="clear-search-btn" onClick={resetFilters}>
            <FaTimes style={{ fontSize: '0.75rem' }} /> Xóa bộ lọc
          </button>
        )}
      </div>

      {/* ═══ COURSES GRID ═══ */}
      <main className="courses-main-section">
        {loading ? (
          <div className="courses-cards-grid">
            {[1, 2, 3, 4, 5, 6].map(sk => (
              <div key={sk} className="edu-skeleton-card" style={{ height: '360px' }}>
                <div style={{ padding: '20px' }}>
                  <div className="edu-skeleton-line" style={{ width: '40%', height: '14px', marginBottom: '12px' }}></div>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '20px' }}>
                    <div className="edu-skeleton-circle" style={{ width: '52px', height: '52px' }}></div>
                    <div style={{ flex: 1 }}>
                      <div className="edu-skeleton-line" style={{ width: '70%', height: '16px', marginBottom: '8px' }}></div>
                      <div className="edu-skeleton-line" style={{ width: '45%', height: '12px' }}></div>
                    </div>
                  </div>
                  <div className="edu-skeleton-line" style={{ width: '90%', height: '18px', marginBottom: '10px' }}></div>
                  <div className="edu-skeleton-line" style={{ width: '100%', height: '12px', marginBottom: '6px' }}></div>
                  <div className="edu-skeleton-line" style={{ width: '80%', height: '12px', marginBottom: '20px' }}></div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <div className="edu-skeleton-pill" style={{ width: '70px', height: '24px' }}></div>
                    <div className="edu-skeleton-pill" style={{ width: '90px', height: '24px' }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : courses.length > 0 ? (
          <div className="courses-cards-grid" key={`${selectedLevel}-${selectedGrade}-${selectedSubject}`}>
            {courses.map((item, idx) => {
              const teacherAvatar = item.enrolledteacher?.Avatar
                || 'https://res.cloudinary.com/elearning-platform-vn/image/upload/v1789924688/edupulse/teachers/teacher_nguyen_van_an.jpg';
              const teacherFullName = `${item.enrolledteacher?.Lastname || ''} ${item.enrolledteacher?.Firstname || ''}`.trim();
              const subjectLabel = getCourseSubjectLabel(item);
              const levelLabel = getCourseLevelLabel(item);
              const spotsLeft = (item.maxStudents || 20) - (item.enrolledStudent?.length || 0);
              const isVerified = item.enrolledteacher?.Isapproved === 'approved';

              // So le 30ms mỗi hàng (tối đa 8 hàng = 240ms)
              const staggerDelay = `${Math.min(idx, 7) * 30}ms`;

              return (
                <article
                  key={item._id}
                  className="course-card-v2 edu-filter-stagger"
                  style={{ animationDelay: staggerDelay }}
                >
                  {/* Card Header */}
                  <div className="card-header-top">
                    <div className="card-header-badges">
                      <span className="course-level-badge">{levelLabel}</span>
                      <span className="subject-badge-pill">{subjectLabel}</span>
                    </div>
                    <span className="course-format-pill">
                      <span className="live-dot"></span>
                      Google Meet
                    </span>
                  </div>

                  {/* Teacher Profile Box */}
                  <NavLink to={`/teacher/${item.enrolledteacher?._id}`} className="card-teacher-profile">
                    <div className="teacher-avatar-frame">
                      <img
                        src={teacherAvatar}
                        alt={teacherFullName}
                        className="teacher-avatar-img"
                        loading="lazy"
                      />
                      {isVerified && (
                        <span className="teacher-verified-icon" title="Giảng viên đã thẩm định">
                          <MdVerified />
                        </span>
                      )}
                    </div>
                    <div className="teacher-meta-details">
                      <h3 className="teacher-fullname">{teacherFullName}</h3>
                      <div className="teacher-academic-role">Giảng viên Chuyên môn</div>
                      {item.enrolledteacher?.Teacherdetails?.Experience && (
                        <div className="teacher-experience">
                          {item.enrolledteacher.Teacherdetails.Experience} năm kinh nghiệm
                        </div>
                      )}
                    </div>
                  </NavLink>

                  {/* Card Body */}
                  <div className="card-body-content">
                    <h4 className="course-headline">
                      {item.liveClasses?.[0]?.title?.split(' - ')[0] || subjectLabel}
                    </h4>
                    <p className="course-synopsis">
                      {item.description?.slice(0, 120)}{item.description?.length > 120 ? '...' : ''}
                    </p>

                    {/* Schedule */}
                    {item.schedule && item.schedule.length > 0 && (
                      <div className="card-schedule-row">
                        <FaCalendarAlt style={{ fontSize: '0.75rem', color: 'var(--primary)', flexShrink: 0 }} />
                        <span>
                          {item.schedule.map(s => `${DAYS_VI[s.day]} ${formatTime(s.starttime)}`).join(' · ')}
                        </span>
                      </div>
                    )}

                    {/* Stats row */}
                    <div className="card-stats-row">
                      <span className="card-stat">
                        <FaUsers style={{ fontSize: '0.7rem' }} />
                        {spotsLeft <= 0 ? 'Hết chỗ' : `Còn ${spotsLeft} chỗ`}
                      </span>
                      {item.liveClasses?.[0]?.timing && (
                        <span className="card-stat">
                          <FaClock style={{ fontSize: '0.7rem' }} />
                          {item.liveClasses[0].timing} phút/buổi
                        </span>
                      )}
                      <span className="card-stat card-stat--free">Miễn phí</span>
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="card-footer-actions">
                    <NavLink
                      to={`/courses/${item._id}`}
                      className="btn-enroll-course"
                    >
                      <span>Xem & Đăng Ký</span>
                      <span className="card-arrow">→</span>
                    </NavLink>
                    <NavLink
                      to={`/teacher/${item.enrolledteacher?._id}`}
                      className="btn-view-doc"
                    >
                      Hồ Sơ GV
                    </NavLink>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="courses-empty-state">
            <div className="empty-state-icon">
              <FaSearch />
            </div>
            <h3>Không tìm thấy khóa học nào</h3>
            <p>Hãy thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác.</p>
            <button className="btn-primary" onClick={resetFilters} style={{ marginTop: 20 }}>
              Xóa bộ lọc và xem tất cả
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default Courses;