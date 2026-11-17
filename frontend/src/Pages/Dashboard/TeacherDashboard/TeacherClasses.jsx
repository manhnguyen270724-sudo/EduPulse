import React, { useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import {
  FaCalendarAlt,
  FaVideo,
  FaClock,
  FaPlus,
  FaExternalLinkAlt,
  FaComments,
  FaUsers,
  FaUserGraduate,
  FaBan,
  FaThLarge,
  FaList
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import { getCourseSubjectLabel } from '../../../data/subjectTaxonomy';
import './TeacherClasses.css';

function TeacherClasses() {
  const { ID } = useParams();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'grid'

  const isSessionJoinable = (s) => {
    if (s.status === 'cancelled') return false;
    if (!s.date) return true;
    const now = new Date();
    const sessionDate = new Date(s.date);
    if (s.startTime) {
      const [h, m] = s.startTime.split(':').map(Number);
      sessionDate.setHours(h || 0, m || 0, 0, 0);
    }
    const diffMinutes = (sessionDate - now) / (1000 * 60);
    return diffMinutes <= 30 && diffMinutes >= -180;
  };

  const handleCancelSession = async (classroomId, sessionId) => {
    if (!classroomId || !sessionId) {
      toast.error("Không tìm thấy thông tin định danh của buổi học");
      return;
    }
    const reason = window.prompt("Nhập lý do hủy buổi học này (thông báo sẽ được gửi tới tất cả học viên trong lớp):");
    if (reason === null) return;

    try {
      const res = await fetch(`/api/classrooms/${classroomId}/sessions/${sessionId}/cancel`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: reason.trim() || "Giảng viên có việc bận đột xuất" })
      });
      if (res.ok) {
        toast.success("Đã hủy buổi học thành công!");
        fetchSchedule();
      } else {
        const err = await res.json();
        toast.error(err.message || "Hủy buổi học thất bại");
      }
    } catch (e) {
      toast.error("Lỗi kết nối khi hủy buổi học");
    }
  };

  const fetchSchedule = async () => {
    try {
      // 1. Thử lấy lịch từ Classroom system mới
      const res = await fetch(`/api/classrooms/schedule/teacher/${ID}`, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.data?.sessions && data.data.sessions.length > 0) {
          setSessions(data.data.sessions);
          setLoading(false);
          return;
        }
      }

      // 2. Fallback sang course liveClasses cũ nếu chưa có sessions
      const oldRes = await fetch(`/api/course/classes/teacher/${ID}`, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      if (oldRes.ok) {
        const oldData = await oldRes.json();
        const fallbackList = (oldData.data?.classes?.[0]?.liveClasses || []).map((c) => ({
          title: c.title,
          date: c.date,
          timing: c.timing,
          roomLink: c.link,
          status: c.status,
          className: c.title,
          classType: 'group',
          subject: c.coursename
        }));
        setSessions(fallbackList);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ID) fetchSchedule();
  }, [ID]);

  const upcomingSessions = sessions.filter((s) => {
    if (!s.date) return false;
    const sessionDate = new Date(s.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return sessionDate >= today;
  });

  const nextSession = upcomingSessions.length > 0 ? upcomingSessions[0] : null;

  // Countdown timer tới buổi học kế tiếp
  useEffect(() => {
    if (!nextSession?.date) return;

    const calculateCountdown = () => {
      const target = new Date(nextSession.date);
      if (nextSession.startTime) {
        const [hh, mm] = nextSession.startTime.split(':').map(Number);
        target.setHours(hh || 0, mm || 0, 0, 0);
      }
      const now = new Date();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft('Đang diễn ra hoặc đã đến giờ vào lớp!');
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);

      if (days > 0) {
        setTimeLeft(`Còn ${days} ngày ${hours} giờ nữa`);
      } else {
        setTimeLeft(`Còn ${hours} giờ ${minutes} phút nữa`);
      }
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 60000);
    return () => clearInterval(interval);
  }, [nextSession]);

  return (
    <div className="tclass-wrapper">
      <div className="tclass-topbar">
        <div>
          <h1 className="tclass-title">Lịch Dạy Trực Tuyến</h1>
          <p className="tclass-subtitle">
            Lịch giảng dạy tổng hợp các lớp nhóm và lớp 1 kèm 1 trong tuần
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700/50">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'list' ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <FaList />
              <span>Danh Sách</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'grid' ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <FaThLarge />
              <span>Lịch Tuần</span>
            </button>
          </div>
          <NavLink to={`/Teacher/Dashboard/${ID}/Classrooms`} className="tclass-btn-add">
            <FaPlus />
            <span>Quản Lý & Mở Lớp Mới</span>
          </NavLink>
        </div>
      </div>

      <div className="tclass-grid">
        {/* Schedule List */}
        <div className="tclass-card">
          <div className="tclass-card-title">
            <FaCalendarAlt className="text-sky-500" />
            <span>Lịch Dạy Sắp Tới</span>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
              Đang tải lịch giảng dạy...
            </div>
          ) : upcomingSessions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
              Chưa có buổi học nào được lên lịch trong thời gian tới.
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-1">
              {['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ Nhật'].map((dayName, dayIdx) => {
                const targetDayIndex = dayIdx === 6 ? 0 : dayIdx + 1;
                const daySessions = upcomingSessions.filter(s => s.date && new Date(s.date).getDay() === targetDayIndex);
                return (
                  <div key={dayName} className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 flex flex-col">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
                      <span className="font-bold text-xs text-sky-400">{dayName}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                        {daySessions.length} buổi
                      </span>
                    </div>
                    {daySessions.length === 0 ? (
                      <div className="text-[11px] text-slate-500 italic py-4 text-center">Không có lịch</div>
                    ) : (
                      <div className="space-y-2">
                        {daySessions.map((session, sIdx) => {
                          const isJoinable = isSessionJoinable(session);
                          return (
                            <div key={sIdx} className="bg-slate-800/90 border border-slate-700/60 rounded-lg p-2.5 text-xs space-y-1.5">
                              <div className="font-semibold text-slate-100 line-clamp-1">{session.title}</div>
                              <div className="text-[11px] text-slate-400 flex items-center gap-1">
                                <FaClock className="text-sky-400" />
                                <span>{session.startTime || '19:30'} - {session.endTime || '21:00'}</span>
                              </div>
                              <div className="flex items-center justify-between pt-1">
                                <span className={`text-[10px] px-1.5 py-0.5 rounded ${session.status === 'cancelled' ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-700 text-slate-300'}`}>
                                  {session.status === 'cancelled' ? 'Đã hủy' : session.status === 'upcoming' ? 'Sắp tới' : session.status}
                                </span>
                                {session.roomLink && session.status !== 'cancelled' && (
                                  isJoinable ? (
                                    <a
                                      href={session.roomLink}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="text-[11px] font-bold text-emerald-400 hover:underline flex items-center gap-1"
                                    >
                                      <FaVideo /> Vào Meet
                                    </a>
                                  ) : (
                                    <span className="text-[10px] text-slate-500">Chưa mở</span>
                                  )
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="tclass-list">
              {upcomingSessions.map((session, idx) => {
                const is1on1 = session.classType === 'one-on-one';
                const isJoinable = isSessionJoinable(session);

                return (
                  <div key={idx} className="tclass-item">
                    <div className="tclass-item-info">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`tclass-type-badge ${is1on1 ? 'badge-1on1' : 'badge-group'}`}>
                          {is1on1 ? <FaUserGraduate /> : <FaUsers />}
                          <span>{is1on1 ? 'Lớp 1 Kèm 1' : 'Lớp Nhóm'}</span>
                        </span>
                        <span className="text-xs text-slate-400">
                          {session.subject ? getCourseSubjectLabel(session.subject) : session.className}
                        </span>
                      </div>

                      <div className="tclass-item-title">{session.title}</div>
                      <div className="tclass-item-time">
                        <FaClock />
                        <span>
                          {session.date ? new Date(session.date).toLocaleDateString('vi-VN') : ''}
                          {' | '}
                          {session.startTime ? `${session.startTime} - ${session.endTime || ''}` : `${Math.floor((session.timing || 90) / 60)}h`}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                      <span className={`tclass-status-badge ${session.status === 'cancelled' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : ''}`}>
                        {session.status === 'cancelled' ? 'Đã hủy' : session.status === 'upcoming' ? 'Sắp diễn ra' : session.status}
                      </span>

                      <div className="flex items-center gap-2">
                        {session.classroomId && (
                          <NavLink
                            to={`/Teacher/Dashboard/${ID}/Classes/${session.classroomId}/chat`}
                            className="text-xs text-slate-300 hover:text-sky-400 flex items-center gap-1 font-medium bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700/50"
                          >
                            <FaComments />
                            <span>Chat</span>
                          </NavLink>
                        )}

                        {session.classroomId && (session.sessionId || session._id) && session.status !== 'cancelled' && (
                          <button
                            onClick={() => handleCancelSession(session.classroomId, session.sessionId || session._id)}
                            className="text-xs text-rose-400 hover:bg-rose-500/20 flex items-center gap-1 font-medium bg-rose-500/10 px-2 py-1.5 rounded-lg border border-rose-500/30 transition-all"
                            title="Hủy buổi học này"
                          >
                            <FaBan />
                            <span>Hủy</span>
                          </button>
                        )}

                        {session.roomLink && session.status !== 'cancelled' && (
                          isJoinable ? (
                            <a
                              href={session.roomLink}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs text-white bg-emerald-600 hover:bg-emerald-500 flex items-center gap-1.5 font-bold px-3 py-1.5 rounded-lg shadow-sm transition-all"
                            >
                              <FaVideo />
                              <span>Vào Meet</span>
                              <FaExternalLinkAlt style={{ fontSize: '0.65rem' }} />
                            </a>
                          ) : (
                            <span
                              className="text-xs text-slate-400 bg-slate-800/60 px-2.5 py-1.5 rounded-lg border border-slate-700/40 flex items-center gap-1 cursor-not-allowed"
                              title="Phòng học sẽ mở trước 30 phút so với giờ bắt đầu"
                            >
                              <FaVideo />
                              <span>Chưa Đến Giờ</span>
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Sidebar Info Card: Next Class Countdown */}
        <div className="tclass-card">
          <div className="tclass-card-title">
            <FaVideo className="text-emerald-500" />
            <span>Buổi Dạy Kế Tiếp</span>
          </div>

          {nextSession ? (
            <div className="tclass-next-card">
              <div className="flex items-center gap-2 mb-2">
                <span className={`tclass-type-badge ${nextSession.classType === 'one-on-one' ? 'badge-1on1' : 'badge-group'}`}>
                  {nextSession.classType === 'one-on-one' ? '🎯 Lớp 1 Kèm 1' : '👥 Lớp Nhóm'}
                </span>
                <span className="text-xs text-slate-400">{nextSession.className}</span>
              </div>

              <div className="tclass-next-title">{nextSession.title}</div>

              <div className="tclass-countdown-banner">
                <FaClock className="text-amber-400" />
                <span>{timeLeft || 'Đang chuẩn bị...'}</span>
              </div>

              <div className="tclass-next-time">
                <FaClock />
                <span>
                  {nextSession.date ? new Date(nextSession.date).toLocaleDateString('vi-VN') : ''} •{' '}
                  {nextSession.startTime || '19:30'}
                </span>
              </div>

              {nextSession.roomLink && (
                <a
                  href={nextSession.roomLink}
                  target="_blank"
                  rel="noreferrer"
                  className="tclass-btn-join"
                >
                  <FaVideo />
                  <span>Tham Gia Phòng Dạy Ngay</span>
                  <FaExternalLinkAlt style={{ fontSize: '0.75rem' }} />
                </a>
              )}

              {nextSession.classroomId && (
                <NavLink
                  to={`/Teacher/Dashboard/${ID}/Classes/${nextSession.classroomId}/chat`}
                  className="tclass-btn-join-chat"
                >
                  <FaComments />
                  <span>Nhắn Tin Trao Đổi Với Lớp</span>
                </NavLink>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-muted)' }}>
              Không có buổi học nào sắp diễn ra.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TeacherClasses;
