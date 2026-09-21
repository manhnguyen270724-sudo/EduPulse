import React, { useEffect, useState } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import { FaBookOpen, FaCalendarAlt, FaArrowRight, FaClock } from 'react-icons/fa';
import { getCourseSubjectLabel, DAYS_VI, formatTime } from '../../../data/subjectTaxonomy';
import './StudentCourses.css';

function StudentCourses() {
  const { ID } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(`/api/course/student/${ID}/enrolled`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const user = await response.json();
        setData(user.data || []);
      } catch (error) {
        console.error("Fetch enrolled courses error:", error);
      } finally {
        setLoading(false);
      }
    };
    if (ID) getData();
  }, [ID]);

  return (
    <div className="sc-wrapper">
      <div className="sc-header">
        <div>
          <h1 className="sc-title">Khóa Học Của Tôi</h1>
          <p className="sc-subtitle">Danh sách các lớp học bạn đang tham gia trên EduPulse</p>
        </div>
        <NavLink to="/courses" className="sc-btn-explore">
          <FaBookOpen />
          <span>Khám Phá Thêm Khóa Học</span>
        </NavLink>
      </div>

      {loading ? (
        <div className="sc-empty-state">Đang tải danh sách khóa học...</div>
      ) : data.length === 0 ? (
        <div className="sc-empty-state">
          <p style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px' }}>
            Bạn chưa đăng ký khóa học nào
          </p>
          <p style={{ marginBottom: '20px' }}>
            Khám phá hàng chục khóa học chất lượng cao từ đội ngũ giảng viên hàng đầu.
          </p>
          <NavLink to="/courses" className="sc-btn-explore">
            Xem Tất Cả Khóa Học
          </NavLink>
        </div>
      ) : (
        <div className="sc-grid">
          {data.map((sub) => {
            const subjectLabel = getCourseSubjectLabel(sub.coursename);
            const courseTitle = sub.subject || subjectLabel;

            return (
              <div key={sub._id} className="sc-card">
                <div>
                  <div className="sc-card-badge-row">
                    <span className="sc-badge-subject">{subjectLabel}</span>
                    <span className="sc-badge-enrolled">Đang theo học</span>
                  </div>

                  <h3 className="sc-card-title">{courseTitle}</h3>
                  <p className="sc-card-desc">{sub.description || 'Chưa có mô tả chi tiết cho khóa học này.'}</p>
                </div>

                {sub.schedule && sub.schedule.length > 0 && (
                  <div className="sc-schedule-box">
                    <div className="sc-schedule-title">
                      <FaCalendarAlt size={12} className="text-sky-500" />
                      <span>Thời khóa biểu:</span>
                    </div>
                    <div>
                      {sub.schedule.map((s, idx) => (
                        <span key={idx} style={{ marginRight: '8px' }}>
                          {DAYS_VI[s.day] || `Thứ ${s.day}`}: {formatTime(s.starttime)} - {formatTime(s.endtime)}
                          {idx < sub.schedule.length - 1 ? '; ' : ''}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="sc-card-footer">
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Trạng thái: Hoạt động
                  </span>
                  <NavLink to={`/courses/${sub._id}`} className="sc-btn-detail">
                    <span>Xem chi tiết khóa</span>
                    <FaArrowRight size={11} />
                  </NavLink>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default StudentCourses;