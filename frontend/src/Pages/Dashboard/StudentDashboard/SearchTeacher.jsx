import React, { useState, useEffect } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import { FaSearch, FaVideo, FaCalendarAlt, FaCheckCircle, FaExternalLinkAlt, FaGraduationCap } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { getCourseSubjectLabel, getCourseLevelLabel, DAYS_VI, formatTime } from '../../../data/subjectTaxonomy';
import './SearchTeacher.css';

function SearchTeacher() {
  const { ID } = useParams();
  const [courses, setCourses] = useState([]);
  const [enrolledIds, setEnrolledIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [enrollingId, setEnrollingId] = useState(null);

  // 1. Lấy danh sách khóa học sinh viên đã tham gia
  const fetchEnrolled = async () => {
    try {
      const res = await fetch(`/api/course/student/${ID}/enrolled`, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        const d = await res.json();
        setEnrolledIds((d.data || []).map(c => c._id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  // 2. Lấy tất cả khóa học công khai từ API
  const fetchAllCourses = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/public/courses', {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        const d = await res.json();
        setCourses(d.data || []);
      }
    } catch (e) {
      console.error(e);
      toast.error('Không thể tải danh mục khóa học');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ID) {
      fetchEnrolled();
      fetchAllCourses();
    }
  }, [ID]);

  // Đăng ký trực tiếp cho học viên đã đăng nhập
  const handleEnroll = async (courseId, courseTitle) => {
    setEnrollingId(courseId);
    try {
      const res = await fetch(`/api/public/course/${courseId}/enroll/${ID}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`Đăng ký khóa "${courseTitle}" thành công! Đã thêm vào Khóa Học Của Tôi.`);
        setEnrolledIds(prev => [...prev, courseId]);
        fetchAllCourses();
      } else {
        toast.error(data.message || 'Đăng ký thất bại.');
      }
    } catch (err) {
      toast.error('Lỗi kết nối máy chủ.');
    } finally {
      setEnrollingId(null);
    }
  };

  // Bộ lọc
  const filteredCourses = courses.filter(c => {
    const subjectLabel = getCourseSubjectLabel(c).toLowerCase();
    const desc = (c.description || '').toLowerCase();
    const teacherName = c.enrolledteacher ? `${c.enrolledteacher.Lastname} ${c.enrolledteacher.Firstname}`.toLowerCase() : '';
    const q = searchKeyword.toLowerCase().trim();

    const matchesQuery = !q || subjectLabel.includes(q) || desc.includes(q) || teacherName.includes(q);
    const matchesLevel = selectedLevel === 'all' || c.educationLevel === selectedLevel;

    return matchesQuery && matchesLevel;
  });

  return (
    <div className="st-wrapper">
      <div className="st-header">
        <h1 className="st-title">Khám Phá Khóa Học & Giảng Viên</h1>
        <p className="st-subtitle">
          Tìm kiếm và đăng ký tham gia các lớp học trực tuyến qua Google Meet do đội ngũ giảng viên EduPulse trực tiếp giảng dạy.
        </p>
      </div>

      {/* Control Box */}
      <div className="st-controls">
        <div className="st-search-box">
          <FaSearch className="st-search-icon" />
          <input
            type="text"
            placeholder="Tìm theo môn học (Toán, Lý, Hóa, Python...), tên giảng viên..."
            value={searchKeyword}
            onChange={e => setSearchKeyword(e.target.value)}
            className="st-search-input"
          />
        </div>

        {/* Level Filter Pills */}
        <div className="st-pills">
          <button
            type="button"
            className={`st-pill-btn ${selectedLevel === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedLevel('all')}
          >
            Tất Cả Cấp Học
          </button>
          <button
            type="button"
            className={`st-pill-btn ${selectedLevel === 'university' ? 'active' : ''}`}
            onClick={() => setSelectedLevel('university')}
          >
            Đại Học
          </button>
          <button
            type="button"
            className={`st-pill-btn ${selectedLevel === 'high-school' ? 'active' : ''}`}
            onClick={() => setSelectedLevel('high-school')}
          >
            THPT (Lớp 10 - 12)
          </button>
          <button
            type="button"
            className={`st-pill-btn ${selectedLevel === 'middle-school' ? 'active' : ''}`}
            onClick={() => setSelectedLevel('middle-school')}
          >
            THCS (Lớp 6 - 9)
          </button>
          <button
            type="button"
            className={`st-pill-btn ${selectedLevel === 'primary-school' ? 'active' : ''}`}
            onClick={() => setSelectedLevel('primary-school')}
          >
            Tiểu Học (Lớp 1 - 5)
          </button>
        </div>
      </div>

      {/* Course Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          Đang tải danh sách khóa học...
        </div>
      ) : filteredCourses.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          <p style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: 6 }}>
            Không tìm thấy khóa học phù hợp
          </p>
          <p>Hãy thử tìm kiếm với từ khóa khác hoặc chuyển sang cấp học khác.</p>
        </div>
      ) : (
        <div className="st-grid">
          {filteredCourses.map(course => {
            const subjectLabel = getCourseSubjectLabel(course);
            const levelLabel = getCourseLevelLabel(course);
            const isEnrolled = enrolledIds.includes(course._id);
            const spotsLeft = (course.maxStudents || 20) - (course.enrolledStudent?.length || 0);
            const isFull = spotsLeft <= 0;
            const teacher = course.enrolledteacher;

            return (
              <div key={course._id} className="st-card">
                <div>
                  <div className="st-card-top">
                    <span className="st-badge-subject">{subjectLabel}</span>
                    <span className="st-badge-live">
                      <span className="live-dot"></span>
                      Google Meet
                    </span>
                  </div>

                  <h3 className="st-card-title">
                    {course.liveClasses?.[0]?.title?.split(' - ')[0] || subjectLabel}
                    {course.grade && <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}> · Lớp {course.grade}</span>}
                  </h3>

                  <p className="st-card-desc">{course.description || 'Chưa có mô tả.'}</p>
                </div>

                {/* Teacher Info */}
                {teacher && (
                  <NavLink
                    to={`/teacher/${teacher._id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="st-teacher-bar"
                    title="Bấm để xem hồ sơ giảng viên trong tab mới"
                  >
                    <img
                      src={teacher.Avatar || 'https://res.cloudinary.com/elearning-platform-vn/image/upload/v1789924688/edupulse/teachers/teacher_nguyen_van_an.jpg'}
                      alt={teacher.Firstname}
                      className="st-teacher-avatar"
                    />
                    <div style={{ flex: 1 }}>
                      <div className="st-teacher-name">{teacher.Lastname} {teacher.Firstname}</div>
                      <div className="st-teacher-role">Giảng viên phụ trách · Xem hồ sơ ↗</div>
                    </div>
                  </NavLink>
                )}

                {/* Schedule */}
                {course.schedule && course.schedule.length > 0 && (
                  <div className="st-schedule-box">
                    <FaCalendarAlt size={12} className="text-sky-500" />
                    <span>
                      {course.schedule.map(s => `${DAYS_VI[s.day] || `Thứ ${s.day}`} (${formatTime(s.starttime)} - ${formatTime(s.endtime)})`).join('; ')}
                    </span>
                  </div>
                )}

                {/* Footer Actions */}
                <div className="st-card-footer">
                  <span className={`st-spots ${isFull ? 'full' : spotsLeft <= 3 ? 'low' : ''}`}>
                    {isFull ? 'Đã hết chỗ' : `Còn ${spotsLeft} chỗ`}
                  </span>

                  {isEnrolled ? (
                    <span className="st-btn-enrolled">
                      <FaCheckCircle />
                      <span>Đã Tham Gia</span>
                    </span>
                  ) : isFull ? (
                    <button className="st-btn-enroll" disabled>
                      Đã Đầy Chỗ
                    </button>
                  ) : (
                    <button
                      className="st-btn-enroll"
                      onClick={() => handleEnroll(course._id, subjectLabel)}
                      disabled={enrollingId === course._id}
                    >
                      {enrollingId === course._id ? 'Đang đăng ký...' : 'Đăng Ký Ngay'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SearchTeacher;