import React, { useState, useEffect } from 'react';
import { FaTimes, FaUsers, FaUserGraduate, FaCalendarPlus, FaVideo, FaClock } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const DAYS_OF_WEEK = [
  { value: 1, label: 'Thứ Hai' },
  { value: 2, label: 'Thứ Ba' },
  { value: 3, label: 'Thứ Tư' },
  { value: 4, label: 'Thứ Năm' },
  { value: 5, label: 'Thứ Sáu' },
  { value: 6, label: 'Thứ Bảy' },
  { value: 0, label: 'Chủ Nhật' },
];

function CreateClassroomModal({ teacherId, onClose, onSuccess }) {
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [className, setClassName] = useState('');
  const [classType, setClassType] = useState('group'); // 'group' or 'one-on-one'
  const [maxStudents, setMaxStudents] = useState(25);
  const [description, setDescription] = useState('');
  const [roomLink, setRoomLink] = useState('https://meet.google.com/edu-vietnam-live');
  const [selectedDays, setSelectedDays] = useState([2, 4]); // Mặc định T3, T5
  const [startTime, setStartTime] = useState('19:30');
  const [endTime, setEndTime] = useState('21:00');

  useEffect(() => {
    const fetchTeacherCourses = async () => {
      try {
        const res = await fetch(`/api/course/teacher/${teacherId}/enrolled`, {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        });
        if (res.ok) {
          const data = await res.json();
          const list = data.data?.courses || [];
          setCourses(list);
          if (list.length > 0) {
            setSelectedCourseId(list[0]._id);
          }
        }
      } catch (err) {
        console.error('Error fetching teacher courses:', err);
      } finally {
        setLoadingCourses(false);
      }
    };
    if (teacherId) fetchTeacherCourses();
  }, [teacherId]);

  const handleDayToggle = (dayVal) => {
    setSelectedDays((prev) =>
      prev.includes(dayVal) ? prev.filter((d) => d !== dayVal) : [...prev, dayVal]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCourseId) {
      toast.error('Vui lòng chọn khóa học để mở lớp');
      return;
    }
    if (!className.trim()) {
      toast.error('Vui lòng nhập tên lớp học');
      return;
    }
    if (selectedDays.length === 0) {
      toast.error('Vui lòng chọn ít nhất 1 ngày học trong tuần');
      return;
    }

    setSubmitting(true);
    try {
      const weeklySchedule = selectedDays.map((day) => ({
        dayOfWeek: day,
        startTime,
        endTime,
        roomLink: roomLink.trim()
      }));

      const payload = {
        courseId: selectedCourseId,
        className: className.trim(),
        classType,
        maxStudents: classType === 'one-on-one' ? 1 : Number(maxStudents) || 25,
        description: description.trim(),
        weeklySchedule,
        defaultRoomLink: roomLink.trim()
      };

      const res = await fetch('/api/classrooms/create', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(`Đã tạo thành công lớp: ${className}`);
        onSuccess();
        onClose();
      } else {
        toast.error(data.message || 'Không thể tạo lớp học');
      }
    } catch (err) {
      toast.error('Lỗi kết nối khi tạo lớp học');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="tcm-modal-overlay">
      <div className="tcm-modal-card">
        <div className="tcm-modal-header">
          <div className="tcm-modal-title-wrap">
            <FaCalendarPlus className="text-sky-400" />
            <h2 className="tcm-modal-title">Mở Lớp Học Mới</h2>
          </div>
          <button className="tcm-modal-close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="tcm-modal-form">
          {/* 1. Chọn Khóa học */}
          <div className="tcm-form-group">
            <label className="tcm-label">Chọn Khóa Học Giảng Dạy *</label>
            {loadingCourses ? (
              <div className="tcm-loading-text">Đang tải danh sách khóa học...</div>
            ) : courses.length === 0 ? (
              <div className="tcm-warning-text">
                Bạn chưa có khóa học nào được duyệt để mở lớp. Vui lòng tạo khóa học trước!
              </div>
            ) : (
              <select
                className="tcm-select"
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                required
              >
                {courses.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.subject || c.coursename} - {c.coursename}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* 2. Chọn Loại Lớp Học: Nhóm vs 1-kèm-1 */}
          <div className="tcm-form-group">
            <label className="tcm-label">Hình Thức Lớp Học *</label>
            <div className="tcm-type-grid">
              <div
                className={`tcm-type-card ${classType === 'group' ? 'active' : ''}`}
                onClick={() => {
                  setClassType('group');
                  setMaxStudents(25);
                }}
              >
                <FaUsers className="tcm-type-icon" />
                <div className="tcm-type-title">Lớp Học Nhóm</div>
                <div className="tcm-type-desc">Lớp học tiêu chuẩn từ 10 - 30 học viên</div>
              </div>

              <div
                className={`tcm-type-card ${classType === 'one-on-one' ? 'active' : ''}`}
                onClick={() => {
                  setClassType('one-on-one');
                  setMaxStudents(1);
                }}
              >
                <FaUserGraduate className="tcm-type-icon text-amber-400" />
                <div className="tcm-type-title">Lớp 1 Kèm 1 (Gia Sư)</div>
                <div className="tcm-type-desc">Mentorship riêng tư dành cho 1 học viên duy nhất</div>
              </div>
            </div>
          </div>

          {/* 3. Tên lớp học */}
          <div className="tcm-form-group">
            <label className="tcm-label">Tên Lớp Học *</label>
            <input
              type="text"
              className="tcm-input"
              placeholder={
                classType === 'one-on-one'
                  ? 'Ví dụ: Toán 12 [1 Kèm 1] - Lộ Trình Cấp Tốc'
                  : 'Ví dụ: IELTS 7.5+ - Lớp Tối T3-T5 K1'
              }
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              required
            />
          </div>

          {/* 4. Sĩ số tối đa (nếu là lớp nhóm) */}
          {classType === 'group' && (
            <div className="tcm-form-group">
              <label className="tcm-label">Sĩ Số Tối Đa (Học viên)</label>
              <input
                type="number"
                className="tcm-input"
                min="2"
                max="100"
                value={maxStudents}
                onChange={(e) => setMaxStudents(e.target.value)}
              />
            </div>
          )}

          {/* 5. Lịch học cố định hàng tuần */}
          <div className="tcm-form-group">
            <label className="tcm-label">Lịch Học Hàng Tuần *</label>
            <div className="tcm-days-pills">
              {DAYS_OF_WEEK.map((d) => (
                <button
                  type="button"
                  key={d.value}
                  className={`tcm-day-pill ${selectedDays.includes(d.value) ? 'active' : ''}`}
                  onClick={() => handleDayToggle(d.value)}
                >
                  {d.label}
                </button>
              ))}
            </div>

            <div className="tcm-time-row">
              <div className="tcm-time-group">
                <label className="tcm-sublabel">
                  <FaClock /> Giờ Bắt Đầu
                </label>
                <input
                  type="time"
                  className="tcm-input"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                />
              </div>
              <div className="tcm-time-group">
                <label className="tcm-sublabel">
                  <FaClock /> Giờ Kết Thúc
                </label>
                <input
                  type="time"
                  className="tcm-input"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* 6. Link Google Meet / Phòng học */}
          <div className="tcm-form-group">
            <label className="tcm-label">
              <FaVideo className="text-sky-400" /> Link Phòng Học Trực Tuyến (Google Meet / Zoom)
            </label>
            <input
              type="url"
              className="tcm-input"
              value={roomLink}
              onChange={(e) => setRoomLink(e.target.value)}
              placeholder="https://meet.google.com/..."
              required
            />
          </div>

          {/* 7. Mô tả / Ghi chú */}
          <div className="tcm-form-group">
            <label className="tcm-label">Mô Tả / Yêu Cầu Cho Lớp Học</label>
            <textarea
              className="tcm-textarea"
              rows="3"
              placeholder="Ví dụ: Mục tiêu đạt 8.0+, yêu cầu làm bài tập đầy đủ trước mỗi buổi học..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="tcm-modal-footer">
            <button type="button" className="tcm-btn-cancel" onClick={onClose}>
              Hủy
            </button>
            <button
              type="submit"
              className="tcm-btn-submit"
              disabled={submitting || courses.length === 0}
            >
              {submitting ? 'Đang Tạo Lớp...' : 'Xác Nhận Mở Lớp'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateClassroomModal;
