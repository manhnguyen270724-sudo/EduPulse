import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaCheckCircle, FaTimesCircle, FaRedo, FaUser, FaPhone, FaMapMarkerAlt, FaGraduationCap } from 'react-icons/fa';
import toast from 'react-hot-toast';
import "./Admin.css";

function VarifyDoc() {
  const { type, adminID, ID } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [value, setValue] = useState("");

  const handleMessage = (event) => {
    setValue(event.target.value);
  };

  const Approval = async (id, userType, approve, email) => {
    try {
      const payload = {
        Isapproved: approve,
        remarks: value,
        email: email,
      };

      const response = await fetch(`/api/admin/${adminID}/approve/${userType}/${id}`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success(`Đã cập nhật trạng thái hồ sơ: ${approve}`);
        navigate(`/admin/${adminID}`);
      } else {
        toast.error('Cập nhật trạng thái thất bại');
      }
    } catch (error) {
      console.error(error.message);
      toast.error('Lỗi kết nối khi duyệt hồ sơ');
    }
  };

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const docData = await fetch(`/api/admin/${adminID}/documents/${type}/${ID}`);
        const response = await docData.json();
        setData(response.data);
      } catch (err) {
        console.error(err.message);
        toast.error('Không thể tải chi tiết hồ sơ');
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [adminID, type, ID]);

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
          <span className="ap-portal-badge">Kiểm Duyệt Hồ Sơ</span>
        </div>

        <div className="ap-topbar-right">
          <button
            onClick={() => navigate(`/admin/${adminID}`)}
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
            <h1 className="ap-view-title">
              Chi Tiết Hồ Sơ & Chứng Chỉ {type === "teacher" ? "Giảng Viên" : "Học Viên"}
            </h1>
            <p className="ap-view-subtitle">
              Đối soát bằng cấp, căn cước công dân và xác thực tư cách người dùng
            </p>
          </div>
        </div>

        {/* Học viên */}
        {type === "student" && data && data.theStudent && (
          <div className="space-y-6">
            <div className="ap-content-card grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <span className="text-xs text-[var(--text-muted)]">Họ và tên:</span>
                <div className="font-bold text-[var(--text-main)] flex items-center gap-2 mt-1">
                  <FaUser className="text-[var(--primary)]" />
                  {data.theStudent.Firstname} {data.theStudent.Lastname}
                </div>
              </div>
              <div>
                <span className="text-xs text-[var(--text-muted)]">Số điện thoại:</span>
                <div className="font-bold text-[var(--text-main)] flex items-center gap-2 mt-1">
                  <FaPhone className="text-emerald-500" />
                  {data.studentDocs?.Phone || "Chưa cập nhật"}
                </div>
              </div>
              <div>
                <span className="text-xs text-[var(--text-muted)]">Trình độ học vấn:</span>
                <div className="font-bold text-[var(--text-main)] flex items-center gap-2 mt-1">
                  <FaGraduationCap className="text-sky-500" />
                  {data.studentDocs?.Highesteducation || "THPT"}
                </div>
              </div>
              <div>
                <span className="text-xs text-[var(--text-muted)]">Địa chỉ cư trú:</span>
                <div className="font-bold text-[var(--text-main)] flex items-center gap-2 mt-1">
                  <FaMapMarkerAlt className="text-rose-500" />
                  {data.studentDocs?.Address || "Chưa cập nhật"}
                </div>
              </div>
            </div>

            {/* Giấy tờ */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {data.studentDocs?.Secondary && (
                <div className="ap-content-card">
                  <h4 className="font-bold text-sm text-[var(--text-main)] mb-2">Học bạ / Bằng THCS</h4>
                  <img src={data.studentDocs.Secondary} alt="Học bạ THCS" className="rounded-xl w-full h-56 object-cover border border-[var(--card-border)] mb-2" />
                  <p className="text-xs text-emerald-500 font-bold">Điểm số: {data.studentDocs.SecondaryMarks}%</p>
                </div>
              )}
              {data.studentDocs?.Higher && (
                <div className="ap-content-card">
                  <h4 className="font-bold text-sm text-[var(--text-main)] mb-2">Học bạ / Bằng THPT</h4>
                  <img src={data.studentDocs.Higher} alt="Học bạ THPT" className="rounded-xl w-full h-56 object-cover border border-[var(--card-border)] mb-2" />
                  <p className="text-xs text-emerald-500 font-bold">Điểm số: {data.studentDocs.HigherMarks}%</p>
                </div>
              )}
              {data.studentDocs?.Aadhaar && (
                <div className="ap-content-card">
                  <h4 className="font-bold text-sm text-[var(--text-main)] mb-2">CCCD / Định Danh</h4>
                  <img src={data.studentDocs.Aadhaar} alt="CCCD" className="rounded-xl w-full h-56 object-cover border border-[var(--card-border)] mb-2" />
                  <p className="text-xs text-[var(--text-muted)]">Giấy tờ tùy thân hợp lệ</p>
                </div>
              )}
            </div>

            {/* Ghi chú & Thao tác */}
            <div className="ap-content-card">
              <h4 className="font-bold text-sm text-[var(--text-main)] mb-2">Ghi Chú Phản Hồi Khi Duyệt / Từ Chối</h4>
              <textarea
                value={value}
                onChange={handleMessage}
                rows={3}
                className="ap-search-input w-full mb-4"
                placeholder="Nhập lý do nếu từ chối hoặc yêu cầu tải lại hồ sơ..."
              />
              <div className="flex items-center gap-3">
                <button
                  onClick={() => Approval(data.theStudent._id, "student", "approved", data.theStudent.Email)}
                  className="ap-btn-primary"
                >
                  <FaCheckCircle /> Phê Duyệt Hồ Sơ
                </button>
                <button
                  onClick={() => Approval(data.theStudent._id, "student", "rejected", data.theStudent.Email)}
                  className="ap-btn-secondary text-rose-500"
                >
                  <FaTimesCircle /> Từ Chối
                </button>
                <button
                  onClick={() => Approval(data.theStudent._id, "student", "reupload", data.theStudent.Email)}
                  className="ap-btn-secondary text-amber-500"
                >
                  <FaRedo /> Yêu Cầu Nộp Lại
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Giảng viên */}
        {type === "teacher" && data && data.theTeacher && (
          <div className="space-y-6">
            <div className="ap-content-card grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <span className="text-xs text-[var(--text-muted)]">Họ và tên:</span>
                <div className="font-bold text-[var(--text-main)] flex items-center gap-2 mt-1">
                  <FaUser className="text-[var(--primary)]" />
                  {data.theTeacher.Firstname} {data.theTeacher.Lastname}
                </div>
              </div>
              <div>
                <span className="text-xs text-[var(--text-muted)]">Số điện thoại:</span>
                <div className="font-bold text-[var(--text-main)] flex items-center gap-2 mt-1">
                  <FaPhone className="text-emerald-500" />
                  {data.teacherDocs?.Phone || "Chưa cập nhật"}
                </div>
              </div>
              <div>
                <span className="text-xs text-[var(--text-muted)]">Kinh nghiệm:</span>
                <div className="font-bold text-[var(--text-main)] flex items-center gap-2 mt-1">
                  <FaGraduationCap className="text-sky-500" />
                  {data.teacherDocs?.Experience || 0} năm giảng dạy
                </div>
              </div>
              <div>
                <span className="text-xs text-[var(--text-muted)]">Địa chỉ cư trú:</span>
                <div className="font-bold text-[var(--text-main)] flex items-center gap-2 mt-1">
                  <FaMapMarkerAlt className="text-rose-500" />
                  {data.teacherDocs?.Address || "Chưa cập nhật"}
                </div>
              </div>
            </div>

            {/* Giấy tờ chứng chỉ */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {data.teacherDocs?.UG && (
                <div className="ap-content-card">
                  <h4 className="font-bold text-sm text-[var(--text-main)] mb-2">Bằng Cử Nhân (Đại Học)</h4>
                  <img src={data.teacherDocs.UG} alt="Bằng ĐH" className="rounded-xl w-full h-56 object-cover border border-[var(--card-border)] mb-2" />
                  <p className="text-xs text-emerald-500 font-bold">Điểm / Xếp loại: {data.teacherDocs.UGmarks}</p>
                </div>
              )}
              {data.teacherDocs?.PG && (
                <div className="ap-content-card">
                  <h4 className="font-bold text-sm text-[var(--text-main)] mb-2">Bằng Thạc Sĩ / Tiến Sĩ</h4>
                  <img src={data.teacherDocs.PG} alt="Bằng Thạc sĩ" className="rounded-xl w-full h-56 object-cover border border-[var(--card-border)] mb-2" />
                  <p className="text-xs text-emerald-500 font-bold">Điểm / Xếp loại: {data.teacherDocs.PGmarks}</p>
                </div>
              )}
              {data.teacherDocs?.Aadhaar && (
                <div className="ap-content-card">
                  <h4 className="font-bold text-sm text-[var(--text-main)] mb-2">CCCD / Định Danh</h4>
                  <img src={data.teacherDocs.Aadhaar} alt="CCCD" className="rounded-xl w-full h-56 object-cover border border-[var(--card-border)] mb-2" />
                  <p className="text-xs text-[var(--text-muted)]">Giấy tờ tùy thân hợp lệ</p>
                </div>
              )}
            </div>

            {/* Ghi chú & Thao tác */}
            <div className="ap-content-card">
              <h4 className="font-bold text-sm text-[var(--text-main)] mb-2">Ghi Chú Phản Hồi Khi Duyệt / Từ Chối</h4>
              <textarea
                value={value}
                onChange={handleMessage}
                rows={3}
                className="ap-search-input w-full mb-4"
                placeholder="Nhập lý do nếu từ chối hoặc yêu cầu bổ sung bằng cấp..."
              />
              <div className="flex items-center gap-3">
                <button
                  onClick={() => Approval(data.theTeacher._id, "teacher", "approved", data.theTeacher.Email)}
                  className="ap-btn-primary"
                >
                  <FaCheckCircle /> Phê Duyệt Hồ Sơ
                </button>
                <button
                  onClick={() => Approval(data.theTeacher._id, "teacher", "rejected", data.theTeacher.Email)}
                  className="ap-btn-secondary text-rose-500"
                >
                  <FaTimesCircle /> Từ Chối
                </button>
                <button
                  onClick={() => Approval(data.theTeacher._id, "teacher", "reupload", data.theTeacher.Email)}
                  className="ap-btn-secondary text-amber-500"
                >
                  <FaRedo /> Yêu Cầu Nộp Lại
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default VarifyDoc;
