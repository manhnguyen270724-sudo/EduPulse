import React, { useEffect, useState } from "react";
import { useParams, NavLink, useOutletContext } from "react-router-dom";
import Withdrawal from "./Withdrawal";
import { FaGraduationCap, FaUsers, FaWallet, FaCalendarAlt, FaBook, FaPlus, FaVideo, FaUserEdit, FaExternalLinkAlt } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import { getCourseSubjectLabel, DAYS_VI, formatTime } from "../../../data/subjectTaxonomy";
import "./DashboardTeacher.css";

function DashboardTeacher() {
  const { ID } = useParams();
  const outlet = useOutletContext() || {};
  const data = outlet.teacher || {};
  const Tdec = outlet.teacherDetails || null;

  const [courses, setCourses] = useState([]);
  const [amount, setAmount] = useState(0);
  const [popup, setPopup] = useState(false);
  const [liveClasses, setLiveClasses] = useState([]);

  // Lấy số dư ví
  useEffect(() => {
    const getAmount = async () => {
      try {
        const response = await fetch(`/api/payment/teacher/${ID}/balance`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) return;
        const user = await response.json();
        setAmount(user.data?.newTeacher?.Balance || 0);
      } catch (err) {
        console.error("Fetch balance error:", err);
      }
    };
    if (ID) getAmount();
  }, [ID, popup]);

  // Lấy danh sách khóa học của giảng viên
  useEffect(() => {
    const getCourses = async () => {
      try {
        const response = await fetch(`/api/course/Teacher/${ID}/enrolled`, {
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) throw new Error("Failed to fetch courses");
        const res = await response.json();
        setCourses(res.data || []);
      } catch (error) {
        console.error("Fetch enrolled courses error:", error);
      }
    };
    if (ID) getCourses();
  }, [ID]);

  // Lấy lịch dạy
  useEffect(() => {
    const getClasses = async () => {
      try {
        const response = await fetch(`/api/course/classes/teacher/${ID}`, {
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) return;
        const res = await response.json();
        setLiveClasses(res.data?.classes?.[0]?.liveClasses || []);
      } catch (err) {
        console.error("Fetch classes error:", err);
      }
    };
    if (ID) getClasses();
  }, [ID]);

  const approvedCourses = courses.filter(c => c.isapproved);
  const totalStudents = approvedCourses.reduce((sum, c) => sum + (c.enrolledStudent?.length || 0), 0);
  const nextClass = liveClasses.length > 0 ? liveClasses[0] : null;
  const teacherFullName = data.Lastname ? `${data.Lastname} ${data.Firstname}` : (data.Firstname || 'Giảng Viên');
  const publicUrl = `/teacher/${data.slug || ID}`;

  return (
    <div className="dt-wrapper">
      {/* ─── WELCOME BANNER ─── */}
      <div className="dt-welcome-banner">
        <div>
          <div className="dt-welcome-greeting">Xin chào, Thầy/Cô 👋</div>
          <h1 className="dt-welcome-title">{teacherFullName}</h1>
          <p className="dt-welcome-desc">
            Bảng điều khiển quản trị giảng dạy học thuật tại EduPulse Academy.
          </p>
        </div>

        <div className="dt-quick-actions">
          <NavLink to={`/Teacher/Dashboard/${ID}/Courses`} className="dt-btn-action dt-btn-action--primary">
            <FaPlus size={11} />
            <span>Tạo Khóa Học</span>
          </NavLink>
          <NavLink to={`/Teacher/Dashboard/${ID}/Classes`} className="dt-btn-action">
            <FaVideo size={11} />
            <span>Lịch Dạy Trực Tuyến</span>
          </NavLink>
          <NavLink to={`/Teacher/Dashboard/${ID}/Profile`} className="dt-btn-action">
            <FaUserEdit size={11} />
            <span>Hồ Sơ Cá Nhân</span>
          </NavLink>
        </div>
      </div>

      {/* ─── STATS ROW ─── */}
      <div className="dt-stats-row">
        {/* Stat 1: Số dư */}
        <div className="dt-stat-card">
          <div className="dt-stat-icon dt-stat-icon--green">
            <FaWallet />
          </div>
          <div style={{ flex: 1 }}>
            <div className="dt-stat-value">{amount.toLocaleString('vi-VN')}đ</div>
            <div className="dt-stat-label">Số dư khả dụng</div>
          </div>
          <button
            onClick={() => setPopup(true)}
            style={{
              padding: '4px 10px',
              fontSize: '0.75rem',
              fontWeight: 700,
              background: 'var(--success-bg)',
              color: 'var(--success)',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Rút tiền
          </button>
        </div>

        {/* Stat 2: Khóa học */}
        <div className="dt-stat-card">
          <div className="dt-stat-icon dt-stat-icon--blue">
            <FaBook />
          </div>
          <div>
            <div className="dt-stat-value">{courses.length}</div>
            <div className="dt-stat-label">Khóa học phụ trách</div>
          </div>
        </div>

        {/* Stat 3: Học viên */}
        <div className="dt-stat-card">
          <div className="dt-stat-icon dt-stat-icon--purple">
            <FaUsers />
          </div>
          <div>
            <div className="dt-stat-value">{totalStudents}</div>
            <div className="dt-stat-label">Học viên ghi danh</div>
          </div>
        </div>

        {/* Stat 4: Buổi học kế tiếp */}
        <div className="dt-stat-card">
          <div className="dt-stat-icon dt-stat-icon--amber">
            <FaCalendarAlt />
          </div>
          <div>
            <div className="dt-stat-value" style={{ fontSize: '1rem' }}>
              {nextClass ? (nextClass.date ? nextClass.date.slice(0, 10) : 'Sắp tới') : 'Chưa có lịch'}
            </div>
            <div className="dt-stat-label">
              {nextClass ? `${Math.floor(nextClass.timing / 60)}:${nextClass.timing % 60 === 0 ? "00" : nextClass.timing % 60} Google Meet` : 'Buổi học kế tiếp'}
            </div>
          </div>
        </div>
      </div>

      {/* ─── MAIN 2-COLUMN GRID ─── */}
      <div className="dt-main-grid">
        {/* Col 1: Khóa học đang mở */}
        <div className="dt-panel">
          <div className="dt-panel-header">
            <h2 className="dt-panel-title">
              <FaBook style={{ color: 'var(--primary)' }} />
              <span>Khóa Học Đang Mở ({courses.length})</span>
            </h2>
            <NavLink to={`/Teacher/Dashboard/${ID}/Courses`} className="dt-panel-link">
              Quản lý toàn bộ →
            </NavLink>
          </div>

          {courses.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
              <p style={{ marginBottom: '12px' }}>Bạn chưa có khóa học nào trên hệ thống.</p>
              <NavLink to={`/Teacher/Dashboard/${ID}/Courses`} className="dt-btn-action dt-btn-action--primary">
                <FaPlus size={11} />
                <span>Tạo Khóa Học Đầu Tiên</span>
              </NavLink>
            </div>
          ) : (
            <div className="dt-course-list">
              {courses.slice(0, 4).map((c) => {
                const enrolledCount = c.enrolledStudent?.length || 0;
                const maxCount = c.maxStudents || 25;
                const percent = Math.min(100, Math.round((enrolledCount / maxCount) * 100));

                return (
                  <div key={c._id} className="dt-course-item">
                    <div className="dt-course-info">
                      <div className="dt-course-badge-row">
                        <span className="dt-course-badge">{getCourseSubjectLabel(c.coursename)}</span>
                        {c.grade && <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Lớp {c.grade}</span>}
                      </div>
                      <div className="dt-course-title">{c.subject || c.description}</div>
                      <div className="dt-course-meta">
                        Học phí: {c.fees > 0 ? `${c.fees.toLocaleString('vi-VN')}đ` : 'Miễn phí'} · Khai giảng: {c.startDate ? new Date(c.startDate).toLocaleDateString('vi-VN') : 'Đang mở'}
                      </div>
                    </div>

                    <div className="dt-course-stats">
                      <span className="dt-student-count">{enrolledCount}/{maxCount} HS</span>
                      <span className={`dt-badge-status ${c.isapproved ? 'dt-badge-status--approved' : 'dt-badge-status--pending'}`}>
                        {c.isapproved ? 'Đã duyệt' : 'Chờ duyệt'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Col 2: Hồ sơ tóm tắt & Lịch tuần */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Hồ sơ cá nhân snapshot */}
          <div className="dt-panel">
            <div className="dt-panel-header">
              <h2 className="dt-panel-title">
                <FaUserEdit style={{ color: 'var(--primary)' }} />
                <span>Hồ Sơ Chuyên Môn</span>
              </h2>
              <NavLink to={`/Teacher/Dashboard/${ID}/Profile`} className="dt-panel-link">
                Chỉnh sửa →
              </NavLink>
            </div>

            <div className="dt-profile-snapshot">
              <img
                src={data.Avatar || 'https://res.cloudinary.com/elearning-platform-vn/image/upload/v1789924688/edupulse/teachers/teacher_nguyen_van_an.jpg'}
                alt={teacherFullName}
                className="dt-profile-snap-avatar"
              />
              <div className="dt-profile-snap-info">
                <div className="dt-profile-snap-name">{teacherFullName}</div>
                <div className="dt-profile-snap-degree">
                  {Tdec?.PGcollege || Tdec?.UGcollege || 'Giảng viên chuyên môn'}
                </div>
              </div>
            </div>

            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
              {data.bio ? (data.bio.slice(0, 120) + (data.bio.length > 120 ? '...' : '')) : 'Chưa cập nhật tiểu sử chuyên môn.'}
            </p>

            <a
              href={publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: 'var(--primary)',
                textDecoration: 'none',
                paddingTop: '6px'
              }}
            >
              <span>Xem trang công khai (như khách xem)</span>
              <FaExternalLinkAlt size={10} />
            </a>
          </div>

          {/* Lịch dạy tuần */}
          <div className="dt-panel">
            <div className="dt-panel-header">
              <h2 className="dt-panel-title">
                <FaCalendarAlt style={{ color: 'var(--primary)' }} />
                <span>Lịch Dạy Trực Tuyến</span>
              </h2>
              <NavLink to={`/Teacher/Dashboard/${ID}/Classes`} className="dt-panel-link">
                Xem tất cả →
              </NavLink>
            </div>

            {liveClasses.length === 0 ? (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                Chưa có buổi học nào được lên lịch trong tuần này.
              </p>
            ) : (
              <div className="dt-schedule-list">
                {liveClasses.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="dt-schedule-item">
                    <div>
                      <div className="dt-schedule-time">
                        <FaCalendarAlt size={10} />
                        <span>{item.date ? item.date.slice(0, 10) : ''} · {Math.floor(item.timing / 60)}:{item.timing % 60 === 0 ? "00" : item.timing % 60}</span>
                      </div>
                      <div className="dt-schedule-title">{item.title}</div>
                    </div>
                    {item.link && (
                      <a href={item.link} target="_blank" rel="noreferrer" className="dt-btn-meet">
                        <FaVideo size={10} />
                        <span>Vào Meet</span>
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal rút tiền */}
      {popup && <Withdrawal onClose={() => setPopup(false)} amount={amount} />}
    </div>
  );
}

export default DashboardTeacher;
