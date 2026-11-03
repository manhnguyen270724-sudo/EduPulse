import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaCheckCircle, FaTimesCircle, FaCalendarAlt, FaClock, FaChalkboardTeacher } from "react-icons/fa";
import toast from "react-hot-toast";
import "./Admin.css";

const Course = () => {
  const [courseReq, setCourseReq] = useState([]);
  const [loading, setLoading] = useState(false);
  const { data } = useParams();
  const navigate = useNavigate();

  const daysOfWeek = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];

  const formatDay = (day) => {
    return daysOfWeek[day] || `Thứ ${day}`;
  };

  const formatTime = (time) => {
    const hours = Math.floor(time / 60);
    const minutes = time % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const fetchCourseRequests = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/admin/${data}/approve/course`);
      setCourseReq(response.data?.data || []);
    } catch (error) {
      console.error('Lỗi tải danh sách yêu cầu mở khóa học:', error);
      toast.error('Không thể tải danh sách khóa học');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseRequests();
  }, [data]);

  const handleAccept = async (id, info) => {
    try {
      const response = await axios.post(`/api/admin/${data}/approve/course/${id}`, {
        Isapproved: true,
        email: info.Email,
        Firstname: info.enrolledteacher,
      }, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200) {
        setCourseReq(prev => prev.filter(req => req._id !== id));
        toast.success(response.data.message || "Đã phê duyệt khóa học thành công!");
      }
    } catch (error) {
      console.error('Lỗi duyệt khóa học:', error);
      toast.error(error.response?.data?.message || 'Phê duyệt thất bại');
    }
  };

  const handleReject = async (id, info) => {
    try {
      const response = await axios.post(`/api/admin/${data}/approve/course/${id}`, {
        Isapproved: false,
        email: info.Email,
        Firstname: info.enrolledteacher,
      }, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200) {
        setCourseReq(prev => prev.filter(req => req._id !== id));
        toast.success(response.data.message || "Đã từ chối khóa học!");
      }
    } catch (error) {
      console.error('Lỗi từ chối khóa học:', error);
      toast.error(error.response?.data?.message || 'Từ chối thất bại');
    }
  };

  return (
    <div className="ap-shell">
      {/* Topbar */}
      <header className="ap-topbar">
        <div className="ap-brand-group">
          <NavLink to="/" className="ap-brand-link">
            <img
              src="https://res.cloudinary.com/elearning-platform-vn/image/upload/v1789924695/edupulse/branding/edupulse_logo.jpg"
              alt="EduPulse Logo"
              className="ap-brand-logo"
            />
            <span className="ap-brand-text">EduPulse</span>
          </NavLink>
          <span className="ap-portal-badge">Quản Trị Khóa Học</span>
        </div>

        <div className="ap-topbar-right">
          <button
            onClick={() => navigate(`/admin/${data}`)}
            className="ap-btn-secondary"
          >
            <FaArrowLeft />
            <span>Về Bảng Điều Khiển</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="ap-main-viewport" style={{ maxWidth: 1200, margin: "0 auto", width: "100%" }}>
        <div className="ap-view-header">
          <div>
            <h1 className="ap-view-title">Yêu Cầu Phê Duyệt Khóa Học Mới</h1>
            <p className="ap-view-subtitle">
              Xem xét lịch trình, nội dung giảng dạy và phê duyệt khóa học trước khi mở bán công khai
            </p>
          </div>
        </div>

        {courseReq.length === 0 ? (
          <div className="ap-content-card text-center py-16 text-[var(--text-muted)]">
            <FaCheckCircle className="text-4xl text-emerald-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-[var(--text-main)]">Không có yêu cầu mở khóa học nào</h3>
            <p className="text-xs text-[var(--text-muted)] mt-1">Tất cả các khóa học mới đã được xem xét và xử lý.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courseReq.map((req) => (
              <div key={req._id} className="ap-content-card flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-bold text-base text-[var(--text-main)]">
                      {req.coursename}
                    </h3>
                    <span className={`ap-badge ${req.isapproved ? 'ap-badge-success' : 'ap-badge-warning'}`}>
                      {req.isapproved ? 'Đã duyệt' : 'Chờ duyệt'}
                    </span>
                  </div>

                  <p className="text-xs text-[var(--text-muted)] line-clamp-3 mb-4">
                    {req.description}
                  </p>

                  <div className="p-3 rounded-xl bg-[var(--bg-surface-secondary)] border border-[var(--card-border)] mb-4 text-xs space-y-2">
                    <div className="flex items-center gap-2">
                      <FaChalkboardTeacher className="text-[var(--primary)]" />
                      <span className="text-[var(--text-muted)]">Giảng viên:</span>
                      <strong className="text-[var(--text-main)]">
                        {req.enrolledteacher?.Firstname} {req.enrolledteacher?.Lastname}
                      </strong>
                    </div>

                    <div className="space-y-1 pt-1 border-t border-[var(--card-border)]">
                      <div className="flex items-center gap-1 font-semibold text-[var(--text-muted)]">
                        <FaCalendarAlt /> Lịch học trong tuần:
                      </div>
                      {req.schedule?.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-[11px] text-[var(--text-main)] pl-4">
                          <span>{formatDay(item.day)}</span>
                          <span className="font-mono text-[var(--primary)]">
                            {formatTime(item.starttime)} - {formatTime(item.endtime)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-[var(--card-border)]">
                  <button
                    onClick={() => handleAccept(req._id, {
                      Email: req.enrolledteacher?.Email,
                      enrolledteacher: req.enrolledteacher?.Firstname
                    })}
                    className="ap-btn-primary flex-1 justify-center"
                    style={{ padding: "8px 12px", fontSize: "0.8rem" }}
                  >
                    <FaCheckCircle /> Duyệt
                  </button>
                  <button
                    onClick={() => handleReject(req._id, {
                      Email: req.enrolledteacher?.Email,
                      enrolledteacher: req.enrolledteacher?.Firstname
                    })}
                    className="ap-btn-secondary flex-1 justify-center text-rose-500"
                    style={{ padding: "8px 12px", fontSize: "0.8rem" }}
                  >
                    <FaTimesCircle /> Từ chối
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Course;
