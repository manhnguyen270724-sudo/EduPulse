import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaTimes, FaPlus, FaTrash } from 'react-icons/fa';
import './Popup.css';

function Popup({ onClose, subject, subjectLabel, educationLevel, grade }) {
  const [desc, setDesc] = useState('');
  const [outcomes, setOutcomes] = useState(['']);
  const [prerequisites, setPrerequisites] = useState('');
  const [maxStudents, setMaxStudents] = useState(20);
  const [startDate, setStartDate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  const { ID } = useParams();
  const dateGap = 3; // 3 giờ

  const [day, setDay] = useState({
    sun: false, mon: false, tue: false,
    wed: false, thu: false, fri: false, sat: false,
  });
  const [dayValue, setDayValue] = useState({
    sun: '', mon: '', tue: '',
    wed: '', thu: '', fri: '', sat: '',
  });

  const dayIndex = {
    sun: 0, mon: 1, tue: 2,
    wed: 3, thu: 4, fri: 5, sat: 6,
  };

  const dayLabelsVI = {
    sun: 'Chủ Nhật', mon: 'Thứ Hai', tue: 'Thứ Ba',
    wed: 'Thứ Tư', thu: 'Thứ Năm', fri: 'Thứ Sáu', sat: 'Thứ Bảy',
  };

  const convertTimeToMinutes = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const convertMinutesToTime = (minutes) => {
    const hours = String(Math.floor(minutes / 60)).padStart(2, '0');
    const mins = String(minutes % 60).padStart(2, '0');
    return `${hours}:${mins}`;
  };

  const handleCheckboxChange = (dayName) => {
    setDay(prev => ({ ...prev, [dayName]: !prev[dayName] }));
  };

  const addOutcome = () => setOutcomes(prev => [...prev, '']);
  const removeOutcome = (i) => setOutcomes(prev => prev.filter((_, idx) => idx !== i));
  const updateOutcome = (i, val) => setOutcomes(prev => prev.map((o, idx) => idx === i ? val : o));

  const addCourse = async () => {
    const selectedDays = Object.keys(day)
      .filter(d => day[d])
      .map(d => ({
        day: dayIndex[d],
        starttime: dayValue[d] ? convertTimeToMinutes(dayValue[d]) : null,
        endtime: dayValue[d] ? convertTimeToMinutes(dayValue[d]) + dateGap * 60 : null,
      }));

    // Validations
    if (selectedDays.length === 0) {
      setStatusMsg('Vui lòng chọn ít nhất một ngày học và giờ học.');
      return;
    }
    if (selectedDays.some(d => d.starttime === null)) {
      setStatusMsg('Vui lòng điền giờ bắt đầu cho tất cả các ngày đã chọn.');
      return;
    }
    if (!desc.trim()) {
      setStatusMsg('Vui lòng nhập mô tả khóa học.');
      return;
    }

    setSubmitting(true);
    setStatusMsg('');

    const data = {
      coursename: subject.toLowerCase(),
      description: desc.trim(),
      schedule: selectedDays,
      // Các field mới
      educationLevel: educationLevel || 'university',
      grade: grade || '',
      subject: subject,
      fees: 0,
      maxStudents: parseInt(maxStudents, 10),
      startDate: startDate || null,
      outcomes: outcomes.filter(o => o.trim()),
      prerequisites: prerequisites.trim(),
    };

    try {
      const response = await fetch(`/api/course/${subject}/create/${ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const responseData = await response.json();

      if (response.ok) {
        setStatusMsg('✅ Tạo khóa học thành công! Đang chờ Admin phê duyệt.');
        setTimeout(() => onClose(), 2000);
      } else {
        setStatusMsg(`❌ Lỗi: ${responseData.message || 'Tạo khóa học thất bại.'}`);
      }
    } catch (err) {
      setStatusMsg('❌ Lỗi kết nối. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="popup-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="popup-modal">
        {/* Header */}
        <div className="popup-header">
          <div>
            <h2 className="popup-title">Tạo Khóa Học Mới</h2>
            <p className="popup-subtitle">
              {subjectLabel || subject}
              {grade && <span className="popup-grade-tag"> · Lớp {grade}</span>}
            </p>
          </div>
          <button className="popup-close-btn" onClick={onClose} type="button">
            <FaTimes />
          </button>
        </div>

        {/* Body */}
        <div className="popup-body">
          {/* Mô tả */}
          <div className="popup-field">
            <label className="edu-label">Mô tả khóa học <span className="popup-required">*</span></label>
            <textarea
              className="edu-input popup-textarea"
              placeholder="Mô tả nội dung, phương pháp giảng dạy và điểm đặc biệt của khóa học..."
              value={desc}
              onChange={e => setDesc(e.target.value)}
              rows={4}
            />
          </div>

          {/* 2-column row */}
          <div className="popup-row-2">
            <div className="popup-field">
              <label className="edu-label">Số học viên tối đa</label>
              <input
                type="number"
                className="edu-input"
                value={maxStudents}
                onChange={e => setMaxStudents(e.target.value)}
                min={1}
                max={50}
              />
            </div>
            <div className="popup-field">
              <label className="edu-label">Ngày khai giảng</label>
              <input
                type="date"
                className="edu-input"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
              />
            </div>
          </div>

          {/* Điều kiện đầu vào */}
          <div className="popup-field">
            <label className="edu-label">Điều kiện & Đối tượng đầu vào</label>
            <input
              type="text"
              className="edu-input"
              placeholder="vd: Học sinh lớp 10 trở lên, đã học đại số cơ bản..."
              value={prerequisites}
              onChange={e => setPrerequisites(e.target.value)}
            />
          </div>

          {/* Mục tiêu đầu ra */}
          <div className="popup-field">
            <label className="edu-label">Mục tiêu đầu ra</label>
            {outcomes.map((outcome, i) => (
              <div key={i} className="popup-outcome-row">
                <input
                  type="text"
                  className="edu-input"
                  placeholder={`Mục tiêu ${i + 1}...`}
                  value={outcome}
                  onChange={e => updateOutcome(i, e.target.value)}
                />
                {outcomes.length > 1 && (
                  <button
                    type="button"
                    className="popup-remove-btn"
                    onClick={() => removeOutcome(i)}
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="popup-add-outcome-btn"
              onClick={addOutcome}
            >
              <FaPlus /> Thêm mục tiêu
            </button>
          </div>

          {/* Lịch học */}
          <div className="popup-field">
            <label className="edu-label">Lịch học hàng tuần <span className="popup-required">*</span></label>
            <p className="popup-field-note">Chọn ngày và giờ bắt đầu. Thời lượng mỗi buổi mặc định 3 tiếng.</p>
            <div className="popup-schedule-grid">
              {Object.keys(day).map(d => (
                <div key={d} className={`popup-day-row ${day[d] ? 'popup-day-row--active' : ''}`}>
                  <label className="popup-day-check">
                    <input
                      type="checkbox"
                      checked={day[d]}
                      onChange={() => handleCheckboxChange(d)}
                      className="popup-checkbox"
                    />
                    <span className="popup-day-name">{dayLabelsVI[d]}</span>
                  </label>
                  {day[d] && (
                    <div className="popup-time-row">
                      <div className="popup-time-col">
                        <span className="popup-time-label">Bắt đầu</span>
                        <input
                          type="time"
                          className="edu-input popup-time-input"
                          value={dayValue[d]}
                          onChange={e => setDayValue({ ...dayValue, [d]: e.target.value })}
                        />
                      </div>
                      <span className="popup-time-sep">→</span>
                      <div className="popup-time-col">
                        <span className="popup-time-label">Kết thúc</span>
                        <input
                          type="time"
                          className="edu-input popup-time-input"
                          readOnly
                          value={dayValue[d] ? convertMinutesToTime(convertTimeToMinutes(dayValue[d]) + dateGap * 60) : ''}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="popup-footer">
          {statusMsg && (
            <div className={`popup-status-msg ${statusMsg.startsWith('✅') ? 'popup-status--success' : 'popup-status--error'}`}>
              {statusMsg}
            </div>
          )}
          <div className="popup-actions">
            <button
              type="button"
              className="btn-ghost"
              onClick={onClose}
              disabled={submitting}
            >
              Hủy
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick={addCourse}
              disabled={submitting}
            >
              {submitting ? 'Đang tạo...' : 'Tạo Khóa Học'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Popup;
