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
  FaUserGraduate
} from 'react-icons/fa';
import { getCourseSubjectLabel } from '../../../data/subjectTaxonomy';
import './TeacherClasses.css';

function TeacherClasses() {
  const { ID } = useParams();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState('');

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
        <NavLink to={`/Teacher/Dashboard/${ID}/Classrooms`} className="tclass-btn-add">
          <FaPlus />
          <span>Quản Lý & Mở Lớp Mới</span>
        </NavLink>
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
          ) : (
            <div className="tclass-list">
              {upcomingSessions.map((session, idx) => {
                const is1on1 = session.classType === 'one-on-one';

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
                      <span className="tclass-status-badge">
                        {session.status === 'upcoming' ? 'Sắp diễn ra' : session.status}
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

                        {session.roomLink && (
                          <a
                            href={session.roomLink}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-sky-400 hover:underline flex items-center gap-1 font-medium bg-sky-500/10 px-2.5 py-1.5 rounded-lg border border-sky-500/20"
                          >
                            <FaVideo />
                            <span>Vào Meet</span>
                            <FaExternalLinkAlt style={{ fontSize: '0.65rem' }} />
                          </a>
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
