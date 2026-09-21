import React, { useState, useEffect } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import Popup from './Popup';
import AddClass from './AddClass';
import { EDUCATION_LEVELS, SUBJECTS_BY_LEVEL, getCourseSubjectLabel, getCourseLevelLabel, DAYS_VI, formatTime } from '../../../data/subjectTaxonomy';
import { FaPlus, FaBook, FaUsers, FaCalendarAlt, FaMoneyBillWave, FaExternalLinkAlt, FaTimes, FaVideo } from 'react-icons/fa';
import './TeacherCourses.css';

function TeacherCourses() {
  const { ID } = useParams();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Stepper tạo khóa
  const [showStepper, setShowStepper] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [showAddClass, setShowAddClass] = useState(false);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/course/Teacher/${ID}/enrolled`, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      setCourses(data.data || []);
    } catch (err) {
      console.error('Fetch teacher courses error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ID) fetchCourses();
  }, [ID]);

  const currentLevel = EDUCATION_LEVELS.find(l => l.key === selectedLevel);
  const availableGrades = currentLevel?.grades || [];
  const availableSubjects = selectedLevel ? (SUBJECTS_BY_LEVEL[selectedLevel] || []) : [];
  const selectedSubjectObj = availableSubjects.find(s => s.key === selectedSubject);

  const handleLevelSelect = (key) => {
    setSelectedLevel(key);
    setSelectedGrade('');
    setSelectedSubject('');
  };

  const handleGradeSelect = (key) => {
    setSelectedGrade(prev => prev === key ? '' : key);
    setSelectedSubject('');
  };

  const handleSubjectSelect = (key) => {
    setSelectedSubject(key);
  };

  const handleOpenForm = () => {
    if (!selectedLevel || !selectedSubject) return;
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setShowStepper(false);
    fetchCourses();
  };

  return (
    <div className="tc-container">
      {/* ─── HEADER ROW ─── */}
      <div className="tc-header-row">
        <div>
          <h1 className="tc-title">Quản Lý Khóa Học Của Tôi</h1>
          <p className="tc-subtitle">
            Danh sách toàn bộ các khóa học bạn phụ trách giảng dạy trên nền tảng EduPulse.
          </p>
        </div>

        <button
          className="tc-btn-create"
          onClick={() => setShowStepper(!showStepper)}
        >
          {showStepper ? <FaTimes /> : <FaPlus />}
          <span>{showStepper ? 'Đóng Bộ Chọn' : 'Tạo Khóa Học Mới'}</span>
        </button>
      </div>

      {/* ─── STEPPER TẠO KHÓA MỚI (CHỈ HIỆN KHI BẤM TẠO) ─── */}
      {showStepper && (
        <div className="tc-stepper-box">
          <div className="tc-stepper-header">
            <h2 className="tc-stepper-title">
              <FaBook style={{ color: 'var(--primary)' }} />
              <span>Bước 1: Phân Loại Khóa Học Chuẩn Mực</span>
            </h2>
            <button
              onClick={() => setShowStepper(false)}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <FaTimes size={16} />
            </button>
          </div>

          {/* Cấp học */}
          <div className="tc-step-block">
            <div className="tc-step-label">
              <span className="tc-step-num">1</span>
              <span>Chọn Cấp Học:</span>
              {selectedLevel && <strong style={{ color: 'var(--primary)' }}>{currentLevel?.label}</strong>}
            </div>
            <div className="tc-pill-wrap">
              {EDUCATION_LEVELS.map(level => (
                <button
                  key={level.key}
                  type="button"
                  className={`tc-pill-btn ${selectedLevel === level.key ? 'active' : ''}`}
                  onClick={() => handleLevelSelect(level.key)}
                >
                  {level.label}
                </button>
              ))}
            </div>
          </div>

          {/* Lớp */}
          {selectedLevel && availableGrades.length > 0 && (
            <div className="tc-step-block">
              <div className="tc-step-label">
                <span className="tc-step-num">2</span>
                <span>Chọn Khối Lớp (Tùy chọn):</span>
                {selectedGrade && <strong style={{ color: 'var(--primary)' }}>Lớp {selectedGrade}</strong>}
              </div>
              <div className="tc-pill-wrap">
                {availableGrades.map(grade => (
                  <button
                    key={grade.key}
                    type="button"
                    className={`tc-pill-btn ${selectedGrade === grade.key ? 'active' : ''}`}
                    onClick={() => handleGradeSelect(grade.key)}
                  >
                    {grade.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Môn học */}
          {selectedLevel && availableSubjects.length > 0 && (
            <div className="tc-step-block">
              <div className="tc-step-label">
                <span className="tc-step-num">3</span>
                <span>Chọn Môn Học Cụ Thể:</span>
                {selectedSubject && <strong style={{ color: 'var(--primary)' }}>{selectedSubjectObj?.label}</strong>}
              </div>
              <div className="tc-pill-wrap">
                {availableSubjects.map(sub => (
                  <button
                    key={sub.key}
                    type="button"
                    className={`tc-pill-btn ${selectedSubject === sub.key ? 'active' : ''}`}
                    onClick={() => handleSubjectSelect(sub.key)}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedLevel && selectedSubject && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '10px' }}>
              <button
                type="button"
                className="tc-btn-create"
                onClick={handleOpenForm}
              >
                <span>Tiếp Tục Điền Thông Tin Khóa Học →</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ─── DANH SÁCH CÁC KHÓA HỌC HIỆN CÓ ─── */}
      {loading ? (
        <div className="tc-empty-state">Đang tải danh sách khóa học của bạn...</div>
      ) : courses.length === 0 ? (
        <div className="tc-empty-state">
          <p style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
            Bạn chưa tạo khóa học nào
          </p>
          <p style={{ marginBottom: '20px' }}>
            Hãy bắt đầu tạo khóa học đầu tiên để học sinh có thể tìm thấy và đăng ký học cùng bạn.
          </p>
          <button className="tc-btn-create" onClick={() => setShowStepper(true)}>
            <FaPlus />
            <span>Tạo Khóa Học Ngay</span>
          </button>
        </div>
      ) : (
        <div className="tc-courses-grid">
          {courses.map((course) => {
            const subjectLabel = getCourseSubjectLabel(course.coursename);
            const levelLabel = getCourseLevelLabel(course.educationLevel);
            const enrolledCount = course.enrolledStudent?.length || 0;
            const maxCount = course.maxStudents || 25;

            return (
              <div key={course._id} className="tc-course-card">
                <div>
                  <div className="tc-card-top-row">
                    <span className="tc-badge-subject">{subjectLabel}</span>
                    <span className="tc-badge-level">{levelLabel} {course.grade ? `· Lớp ${course.grade}` : ''}</span>
                    <span className={`dt-badge-status ${course.isapproved ? 'dt-badge-status--approved' : 'dt-badge-status--pending'}`}>
                      {course.isapproved ? 'Đã duyệt' : 'Chờ duyệt'}
                    </span>
                  </div>

                  <h3 className="tc-course-name">{course.subject || course.description}</h3>
                  <p className="tc-course-desc">{course.description}</p>
                </div>

                <div className="tc-card-meta-list">
                  <div className="tc-card-meta-item">
                    <FaMoneyBillWave style={{ color: 'var(--success)' }} />
                    <span>Học phí: {course.fees > 0 ? `${course.fees.toLocaleString('vi-VN')}đ` : 'Miễn phí (0đ)'}</span>
                  </div>
                  <div className="tc-card-meta-item">
                    <FaUsers style={{ color: 'var(--primary)' }} />
                    <span>Học viên: {enrolledCount} / {maxCount} học sinh</span>
                  </div>
                  {course.schedule && course.schedule.length > 0 && (
                    <div className="tc-card-meta-item">
                      <FaCalendarAlt style={{ color: 'var(--warning)' }} />
                      <span>Lịch: {course.schedule.map(s => `${DAYS_VI[s.day]} ${formatTime(s.starttime)}`).join(', ')}</span>
                    </div>
                  )}
                </div>

                <div className="tc-card-footer">
                  <NavLink
                    to={`/courses/${course._id}`}
                    target="_blank"
                    className="tc-btn-view-public"
                    title="Xem trang hiển thị cho học sinh"
                  >
                    <span>Xem trang học sinh</span>
                    <FaExternalLinkAlt size={10} />
                  </NavLink>

                  <button
                    onClick={() => setShowAddClass(true)}
                    style={{
                      padding: '7px 12px',
                      background: 'var(--primary-light)',
                      border: '1px solid rgba(2, 132, 199, 0.2)',
                      borderRadius: '8px',
                      color: 'var(--primary)',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <FaVideo size={10} />
                    <span>+ Lên lịch Meet</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Form Popup tạo khóa học chi tiết */}
      {showPopup && (
        <Popup
          onClose={handleClosePopup}
          subject={selectedSubject}
          subjectLabel={selectedSubjectObj?.label || selectedSubject}
          educationLevel={selectedLevel}
          grade={selectedGrade}
        />
      )}

      {/* Modal lên lịch buổi dạy */}
      {showAddClass && (
        <AddClass onClose={() => setShowAddClass(false)} />
      )}
    </div>
  );
}

export default TeacherCourses;