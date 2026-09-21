import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaVideo, FaTimes, FaCalendarAlt, FaLink, FaHeading, FaClock } from 'react-icons/fa';
import toast from 'react-hot-toast';
import DateTime from './DateTime';
import { getCourseSubjectLabel, DAYS_VI } from '../../../data/subjectTaxonomy';
import './AddClass.css';

function AddClass({ onClose }) {
  const { ID } = useParams();
  const [courses, setCourses] = useState([]);
  const [date, setDate] = useState('');
  const [link, setLink] = useState('');
  const [note, setNote] = useState('');
  const [CourseId, setCourseId] = useState('');
  const [allowedDays, setCurrData] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  function setToMidnight(dateTimeString) {
    let d = new Date(dateTimeString);
    let hours = d.getUTCHours();
    let minutes = d.getUTCMinutes();
    let totalMinutes = hours * 60 + minutes;
    d.setUTCHours(0, 0, 0, 0);
    return [totalMinutes, d.toISOString()];
  }

  useEffect(() => {
    const getCourses = async () => {
      try {
        const response = await fetch(`/api/course/Teacher/${ID}/enrolled`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) throw new Error('Không thể lấy danh sách khóa học');
        const res = await response.json();
        const list = (res.data || []).filter(c => c.isapproved);
        setCourses(list);
        if (list.length > 0) {
          setCourseId(list[0]._id);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };
    if (ID) getCourses();
  }, [ID]);

  useEffect(() => {
    const selected = courses.find(c => c._id === CourseId);
    setCurrData(selected?.schedule || []);
  }, [CourseId, courses]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!CourseId) {
      toast.error('Vui lòng chọn khóa học.');
      return;
    }
    if (!note.trim()) {
      toast.error('Vui lòng nhập chủ đề / tiêu đề buổi học.');
      return;
    }
    if (!date) {
      toast.error('Vui lòng chọn ngày và giờ dạy phù hợp.');
      return;
    }
    if (!link.trim()) {
      toast.error('Vui lòng dán link Google Meet hoặc phòng học trực tuyến.');
      return;
    }

    const currentDate = new Date();
    const givenDate = new Date(date);
    if (currentDate > givenDate) {
      toast.error('Ngày giờ học phải ở tương lai!');
      return;
    }

    const modifyDate = setToMidnight(date);
    const data = {
      title: note.trim(),
      timing: modifyDate[0],
      date: modifyDate[1],
      link: link.trim(),
      status: 'upcoming',
    };

    setSubmitting(true);
    try {
      const response = await fetch(`/api/course/${CourseId}/teacher/${ID}/add-class`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const res = await response.json();
      if (response.ok && res.statusCode === 200) {
        toast.success('Lên lịch buổi học thành công!');
        onClose();
      } else {
        toast.error(res.message || 'Lên lịch thất bại.');
      }
    } catch (error) {
      toast.error(error.message || 'Lỗi kết nối máy chủ.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="ac-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="ac-modal">
        {/* Header */}
        <div className="ac-header">
          <div className="ac-title-wrap">
            <div className="ac-header-icon">
              <FaVideo />
            </div>
            <div>
              <h2 className="ac-title">Lên Lịch Buổi Học Trực Tuyến</h2>
              <p className="ac-subtitle">Thiết lập phòng học Google Meet theo thời khóa biểu đã đăng ký</p>
            </div>
          </div>
          <button className="ac-btn-close" onClick={onClose} type="button">
            <FaTimes />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="ac-body">
            {/* Khóa học */}
            <div className="ac-field">
              <label className="ac-label">
                <FaCalendarAlt size={13} className="text-sky-500" />
                <span>Khóa học phụ trách</span>
              </label>
              {courses.length === 0 ? (
                <div className="text-sm text-amber-500 p-2 border border-amber-500/20 rounded-lg">
                  Bạn chưa có khóa học nào được duyệt để lên lịch.
                </div>
              ) : (
                <select
                  value={CourseId}
                  onChange={(e) => setCourseId(e.target.value)}
                  className="ac-select"
                >
                  {courses.map((c) => {
                    const daysStr = (c.schedule || [])
                      .map(d => DAYS_VI[d.day] || `Thứ ${d.day}`)
                      .join(', ');
                    return (
                      <option key={c._id} value={c._id}>
                        {getCourseSubjectLabel(c.coursename)} {c.grade ? `(Lớp ${c.grade})` : ''} - Lịch: [{daysStr || 'Chưa định'}]
                      </option>
                    );
                  })}
                </select>
              )}
            </div>

            {/* Tiêu đề buổi học */}
            <div className="ac-field">
              <label className="ac-label">
                <FaHeading size={13} className="text-sky-500" />
                <span>Chủ đề / Bài học</span>
              </label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ví dụ: Buổi 3: Luyện giải hệ phương trình nâng cao"
                className="ac-input"
              />
            </div>

            {/* Ngày và Giờ */}
            <div className="ac-field">
              <label className="ac-label">
                <FaClock size={13} className="text-sky-500" />
                <span>Ngày & Giờ Bắt Đầu (Theo khung giờ khóa học)</span>
              </label>
              <div className="ac-datepicker-wrap">
                <DateTime setDate={setDate} allowedDays={allowedDays} />
              </div>
              <span className="ac-hint">Hệ thống chỉ cho phép chọn đúng thứ và khung giờ bạn đã cam kết với lớp.</span>
            </div>

            {/* Link Google Meet */}
            <div className="ac-field">
              <label className="ac-label">
                <FaLink size={13} className="text-sky-500" />
                <span>Đường link Google Meet</span>
              </label>
              <input
                type="url"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://meet.google.com/abc-defg-hij"
                className="ac-input"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="ac-footer">
            <button type="button" className="ac-btn-cancel" onClick={onClose} disabled={submitting}>
              Hủy
            </button>
            <button type="submit" className="ac-btn-submit" disabled={submitting || courses.length === 0}>
              {submitting ? 'Đang lưu...' : 'Xác Nhận & Tạo Buổi Học'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddClass;
