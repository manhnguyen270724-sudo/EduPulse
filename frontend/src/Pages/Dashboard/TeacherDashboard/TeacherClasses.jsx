import React, { useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { FaCalendarAlt, FaVideo, FaClock, FaPlus, FaExternalLinkAlt } from 'react-icons/fa';
import AddClass from './AddClass';
import { getCourseSubjectLabel } from '../../../data/subjectTaxonomy';
import './TeacherClasses.css';

function TeacherClasses() {
  const [showPopup, setShowPopup] = useState(false);
  const { ID } = useParams();
  const [data, setData] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(`/api/course/classes/teacher/${ID}`, {
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
        setData(user.data?.classes?.[0]?.liveClasses || []);
      } catch (error) {
        setError(error.message);
      }
    };
    if (ID) getData();
  }, [showPopup, ID]);

  const upcomingClasses = data.filter(clas => {
    if (!clas.date) return false;
    const classDate = new Date(clas.date.slice(0, 10));
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const oneWeekFromNow = new Date(today);
    oneWeekFromNow.setDate(today.getDate() + 14);
    return classDate >= today && classDate <= oneWeekFromNow;
  });

  const nextClass = data.length > 0 ? data[0] : null;

  return (
    <div className="tclass-wrapper">
      <div className="tclass-topbar">
        <div>
          <h1 className="tclass-title">Lịch Dạy Trực Tuyến</h1>
          <p className="tclass-subtitle">Quản lý các phòng học Google Meet và lịch giảng dạy trong 14 ngày tới</p>
        </div>
        <button className="tclass-btn-add" onClick={() => setShowPopup(true)}>
          <FaPlus />
          <span>Tạo Buổi Học Mới</span>
        </button>
      </div>

      <div className="tclass-grid">
        {/* Schedule List */}
        <div className="tclass-card">
          <div className="tclass-card-title">
            <FaCalendarAlt className="text-sky-500" />
            <span>Lịch Học Sắp Tới</span>
          </div>

          {upcomingClasses.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
              Chưa có buổi học trực tuyến nào trong 14 ngày tới.
            </div>
          ) : (
            <div className="tclass-list">
              {upcomingClasses.map((clas, idx) => (
                <div key={idx} className="tclass-item">
                  <div className="tclass-item-info">
                    <div className="tclass-item-subject">
                      <span>{getCourseSubjectLabel(clas.coursename)}</span>
                    </div>
                    <div className="tclass-item-title">{clas.title}</div>
                    <div className="tclass-item-time">
                      <FaClock />
                      <span>
                        {clas.date ? clas.date.slice(0, 10) : ''} | {Math.floor(clas.timing / 60)}:
                        {clas.timing % 60 === 0 ? "00" : clas.timing % 60}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                    <span className="tclass-status-badge">{clas.status || 'Sắp diễn ra'}</span>
                    {clas.link && (
                      <a
                        href={clas.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-sky-500 hover:underline flex items-center gap-1 font-medium"
                      >
                        <span>Vào lớp</span>
                        <FaExternalLinkAlt size={10} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Next Class Highlight */}
        {nextClass ? (
          <a
            href={nextClass.link || '#'}
            target="_blank"
            rel="noreferrer"
            className="tclass-next-card"
          >
            <div className="tclass-next-header">
              <span className="tclass-next-tag">Buổi học kế tiếp</span>
              <FaVideo size={22} />
            </div>

            <div className="tclass-next-body">
              <h2 className="tclass-next-name">{getCourseSubjectLabel(nextClass.coursename)}</h2>
              <p className="tclass-next-desc">{nextClass.title}</p>
            </div>

            <div className="tclass-next-footer">
              <div className="flex items-center gap-2">
                <FaClock />
                <span>
                  {typeof nextClass.date === 'string' ? nextClass.date.slice(0, 10) : ''} lúc{' '}
                  {typeof nextClass.timing === 'number'
                    ? `${Math.floor(nextClass.timing / 60)}:${nextClass.timing % 60 === 0 ? "00" : nextClass.timing % 60}`
                    : ''}
                </span>
              </div>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                Bấm để vào Meet <FaExternalLinkAlt size={12} />
              </span>
            </div>
          </a>
        ) : (
          <div className="tclass-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 220 }}>
            <p style={{ color: 'var(--text-muted)' }}>Chưa có buổi học nào sắp tới.</p>
          </div>
        )}
      </div>

      {showPopup && <AddClass onClose={() => setShowPopup(false)} />}
    </div>
  );
}

export default TeacherClasses;
