import React, { useState, useEffect } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import {
  FaChalkboardTeacher,
  FaUsers,
  FaUserGraduate,
  FaPlus,
  FaVideo,
  FaComments,
  FaCalendarAlt,
  FaClock,
  FaExternalLinkAlt,
  FaSearch,
  FaFilter
} from 'react-icons/fa';
import CreateClassroomModal from './CreateClassroomModal';
import { toast } from 'react-hot-toast';
import './TeacherClassrooms.css';

const DAYS_NAME = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];

function TeacherClassrooms() {
  const { ID } = useParams();
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all'); // all | group | one-on-one
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Modal thêm buổi học cụ thể
  const [activeClassForSession, setActiveClassForSession] = useState(null);
  const [sessionTitle, setSessionTitle] = useState('');
  const [sessionDate, setSessionDate] = useState('');
  const [sessionStartTime, setSessionStartTime] = useState('19:30');
  const [sessionEndTime, setSessionEndTime] = useState('21:00');
  const [sessionRoomLink, setSessionRoomLink] = useState('');
  const [submittingSession, setSubmittingSession] = useState(false);

  const fetchClassrooms = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/classrooms/teacher/${ID}`, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        const data = await res.json();
        setClassrooms(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching classrooms:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ID) fetchClassrooms();
  }, [ID]);

  // Thống kê nhanh
  const totalClasses = classrooms.length;
  const groupClasses = classrooms.filter((c) => c.classType === 'group').length;
  const oneOnOneClasses = classrooms.filter((c) => c.classType === 'one-on-one').length;
  const totalStudents = classrooms.reduce((sum, c) => sum + (c.students?.length || 0), 0);

  // Lọc
  const filteredClasses = classrooms.filter((c) => {
    if (filterType !== 'all' && c.classType !== filterType) return false;
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const matchName = c.className?.toLowerCase().includes(term);
      const matchCourse = c.course?.subject?.toLowerCase().includes(term) || c.course?.coursename?.toLowerCase().includes(term);
      const matchCode = c.classCode?.toLowerCase().includes(term);
      return matchName || matchCourse || matchCode;
    }
    return true;
  });

  const handleOpenAddSession = (cls) => {
    setActiveClassForSession(cls);
    setSessionTitle(`Buổi học: ${cls.className}`);
    setSessionRoomLink(cls.weeklySchedule?.[0]?.roomLink || 'https://meet.google.com/edu-vietnam-live');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setSessionDate(tomorrow.toISOString().slice(0, 10));
  };

  const handleAddSessionSubmit = async (e) => {
    e.preventDefault();
    if (!activeClassForSession || !sessionDate) return;

    setSubmittingSession(true);
    try {
      const res = await fetch(`/api/classrooms/${activeClassForSession._id}/sessions`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: sessionTitle,
          date: sessionDate,
          startTime: sessionStartTime,
          endTime: sessionEndTime,
          roomLink: sessionRoomLink
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success('Đã lên lịch buổi học mới thành công!');
        setActiveClassForSession(null);
        fetchClassrooms();
      } else {
        toast.error(data.message || 'Lỗi khi thêm buổi học');
      }
    } catch (err) {
      toast.error('Lỗi kết nối khi thêm buổi học');
    } finally {
      setSubmittingSession(false);
    }
  };

  return (
    <div className="tc-page-container">
      {/* Topbar */}
      <div className="tc-topbar">
        <div>
          <h1 className="tc-page-title">Quản Lý Lớp Học</h1>
          <p className="tc-page-subtitle">
            Quản lý các lớp nhóm và lớp 1 kèm 1 thuộc các khóa học bạn đang phụ trách
          </p>
        </div>
        <button
          className="tc-btn-create"
          onClick={() => setShowCreateModal(true)}
        >
          <FaPlus />
          <span>Mở Lớp Học Mới</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="tc-metrics-grid">
        <div className="tc-metric-card">
          <div className="tc-metric-icon-wrap bg-sky-500/10 text-sky-400">
            <FaChalkboardTeacher />
          </div>
          <div>
            <div className="tc-metric-num">{totalClasses}</div>
            <div className="tc-metric-label">Tổng Số Lớp Mở</div>
          </div>
        </div>

        <div className="tc-metric-card">
          <div className="tc-metric-icon-wrap bg-indigo-500/10 text-indigo-400">
            <FaUsers />
          </div>
          <div>
            <div className="tc-metric-num">{groupClasses}</div>
            <div className="tc-metric-label">Lớp Học Nhóm</div>
          </div>
        </div>

        <div className="tc-metric-card">
          <div className="tc-metric-icon-wrap bg-amber-500/10 text-amber-400">
            <FaUserGraduate />
          </div>
          <div>
            <div className="tc-metric-num">{oneOnOneClasses}</div>
            <div className="tc-metric-label">Lớp 1 Kèm 1 (Gia Sư)</div>
          </div>
        </div>

        <div className="tc-metric-card">
          <div className="tc-metric-icon-wrap bg-emerald-500/10 text-emerald-400">
            <FaUsers />
          </div>
          <div>
            <div className="tc-metric-num">{totalStudents}</div>
            <div className="tc-metric-label">Tổng Học Viên Theo Học</div>
          </div>
        </div>
      </div>

      {/* Controls: Tabs & Search */}
      <div className="tc-controls-row">
        <div className="tc-tabs-wrap">
          <button
            className={`tc-tab-btn ${filterType === 'all' ? 'active' : ''}`}
            onClick={() => setFilterType('all')}
          >
            Tất Cả ({totalClasses})
          </button>
          <button
            className={`tc-tab-btn ${filterType === 'group' ? 'active' : ''}`}
            onClick={() => setFilterType('group')}
          >
            👥 Lớp Nhóm ({groupClasses})
          </button>
          <button
            className={`tc-tab-btn ${filterType === 'one-on-one' ? 'active' : ''}`}
            onClick={() => setFilterType('one-on-one')}
          >
            🎯 Lớp 1 Kèm 1 ({oneOnOneClasses})
          </button>
        </div>

        <div className="tc-search-box">
          <FaSearch className="text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo tên lớp, mã lớp, môn học..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Classroom Cards Grid */}
      {loading ? (
        <div className="tc-loading-box">Đang tải danh sách lớp học...</div>
      ) : filteredClasses.length === 0 ? (
        <div className="tc-empty-box">
          <FaChalkboardTeacher className="tc-empty-icon" />
          <p>Chưa tìm thấy lớp học nào.</p>
          <button className="tc-btn-empty-add" onClick={() => setShowCreateModal(true)}>
            <FaPlus /> Mở lớp học đầu tiên ngay
          </button>
        </div>
      ) : (
        <div className="tc-class-grid">
          {filteredClasses.map((cls) => {
            const is1on1 = cls.classType === 'one-on-one';
            const studentCount = cls.students?.length || 0;
            const upcomingSessions = (cls.sessions || [])
              .filter((s) => new Date(s.date) >= new Date())
              .slice(0, 2);

            return (
              <div key={cls._id} className={`tc-card ${is1on1 ? 'border-1on1' : ''}`}>
                <div className="tc-card-header">
                  <div>
                    <span className={`tc-badge ${is1on1 ? 'badge-1on1' : 'badge-group'}`}>
                      {is1on1 ? '🎯 Lớp 1 Kèm 1' : '👥 Lớp Học Nhóm'}
                    </span>
                    <span className="tc-class-code">{cls.classCode}</span>
                  </div>
                  <span className="tc-status-tag">Đang Hoạt Động</span>
                </div>

                <h3 className="tc-card-title">{cls.className}</h3>

                <div className="tc-card-course-info">
                  Khóa học: <strong>{cls.course?.subject || cls.course?.coursename}</strong>
                </div>

                {/* Sĩ số học viên */}
                <div className="tc-card-student-bar">
                  <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
                    <span>
                      Sĩ số: <strong>{studentCount}</strong> / {cls.maxStudents} học viên
                    </span>
                    {is1on1 && studentCount >= 1 && (
                      <span className="text-amber-400 font-medium">Đã có học viên</span>
                    )}
                  </div>
                  <div className="tc-progress-bg">
                    <div
                      className={`tc-progress-fill ${is1on1 ? 'bg-amber-400' : 'bg-sky-500'}`}
                      style={{
                        width: `${Math.min(100, (studentCount / (cls.maxStudents || 1)) * 100)}%`
                      }}
                    />
                  </div>
                </div>

                {/* Lịch học hàng tuần */}
                <div className="tc-schedule-box">
                  <div className="tc-schedule-title">
                    <FaClock className="text-slate-400" /> Lịch học trong tuần:
                  </div>
                  <div className="tc-schedule-items">
                    {(cls.weeklySchedule || []).map((w, idx) => (
                      <span key={idx} className="tc-schedule-pill">
                        {DAYS_NAME[w.dayOfWeek]}: {w.startTime} - {w.endTime}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Buổi học sắp tới */}
                {upcomingSessions.length > 0 && (
                  <div className="tc-upcoming-box">
                    <div className="tc-upcoming-title">
                      <FaCalendarAlt className="text-sky-400" /> Buổi học kế tiếp:
                    </div>
                    {upcomingSessions.map((s, idx) => (
                      <div key={idx} className="tc-session-row">
                        <span className="font-medium text-slate-200">{s.title}</span>
                        <span className="text-xs text-slate-400">
                          {new Date(s.date).toLocaleDateString('vi-VN')} ({s.startTime})
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Actions: Meet, Chat, Add Session */}
                <div className="tc-card-actions">
                  <NavLink
                    to={`/Teacher/Dashboard/${ID}/Classes/${cls._id}/chat`}
                    className="tc-btn-action tc-btn-chat"
                    title="Mở phòng chat của lớp"
                  >
                    <FaComments />
                    <span>Chat Lớp</span>
                  </NavLink>

                  <button
                    className="tc-btn-action tc-btn-session"
                    onClick={() => handleOpenAddSession(cls)}
                    title="Lên lịch buổi học mới"
                  >
                    <FaCalendarAlt />
                    <span>+ Buổi Học</span>
                  </button>

                  {cls.weeklySchedule?.[0]?.roomLink && (
                    <a
                      href={cls.weeklySchedule[0].roomLink}
                      target="_blank"
                      rel="noreferrer"
                      className="tc-btn-action tc-btn-meet"
                      title="Vào phòng Google Meet"
                    >
                      <FaVideo />
                      <span>Meet</span>
                      <FaExternalLinkAlt style={{ fontSize: '0.65rem' }} />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Mở Lớp Mới */}
      {showCreateModal && (
        <CreateClassroomModal
          teacherId={ID}
          onClose={() => setShowCreateModal(false)}
          onSuccess={fetchClassrooms}
        />
      )}

      {/* Modal Thêm Buổi Học */}
      {activeClassForSession && (
        <div className="tcm-modal-overlay">
          <div className="tcm-modal-card" style={{ maxWidth: 480 }}>
            <div className="tcm-modal-header">
              <h2 className="tcm-modal-title">Thêm Buổi Học Mới</h2>
              <button
                className="tcm-modal-close-btn"
                onClick={() => setActiveClassForSession(null)}
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleAddSessionSubmit} className="tcm-modal-form">
              <div className="tcm-form-group">
                <label className="tcm-label">Lớp Học</label>
                <div className="text-sm font-semibold text-sky-400">
                  {activeClassForSession.className}
                </div>
              </div>

              <div className="tcm-form-group">
                <label className="tcm-label">Tên Buổi Học *</label>
                <input
                  type="text"
                  className="tcm-input"
                  value={sessionTitle}
                  onChange={(e) => setSessionTitle(e.target.value)}
                  required
                />
              </div>

              <div className="tcm-form-group">
                <label className="tcm-label">Ngày Diễn Ra *</label>
                <input
                  type="date"
                  className="tcm-input"
                  value={sessionDate}
                  onChange={(e) => setSessionDate(e.target.value)}
                  required
                />
              </div>

              <div className="tcm-time-row">
                <div className="tcm-time-group">
                  <label className="tcm-sublabel">Giờ Bắt Đầu</label>
                  <input
                    type="time"
                    className="tcm-input"
                    value={sessionStartTime}
                    onChange={(e) => setSessionStartTime(e.target.value)}
                    required
                  />
                </div>
                <div className="tcm-time-group">
                  <label className="tcm-sublabel">Giờ Kết Thúc</label>
                  <input
                    type="time"
                    className="tcm-input"
                    value={sessionEndTime}
                    onChange={(e) => setSessionEndTime(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="tcm-form-group">
                <label className="tcm-label">Link Google Meet</label>
                <input
                  type="url"
                  className="tcm-input"
                  value={sessionRoomLink}
                  onChange={(e) => setSessionRoomLink(e.target.value)}
                  required
                />
              </div>

              <div className="tcm-modal-footer">
                <button
                  type="button"
                  className="tcm-btn-cancel"
                  onClick={() => setActiveClassForSession(null)}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="tcm-btn-submit"
                  disabled={submittingSession}
                >
                  {submittingSession ? 'Đang Lưu...' : 'Xác Nhận Thêm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeacherClassrooms;
