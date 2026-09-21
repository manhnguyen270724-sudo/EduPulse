import React, { useState, useEffect } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaGraduationCap, FaSave, FaCheckCircle, FaCamera } from 'react-icons/fa';
import toast from 'react-hot-toast';
import './StudentPersonalProfile.css';

function StudentPersonalProfile() {
  const { ID } = useParams();
  const { student, reloadStudent } = useOutletContext() || {};

  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [avatar, setAvatar] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [highestEducation, setHighestEducation] = useState('Đại học');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (student) {
      setFirstname(student.Firstname || '');
      setLastname(student.Lastname || '');
      setAvatar(student.Avatar || '');
      // If studentdocs populated
      if (student.Studentdetails && typeof student.Studentdetails === 'object') {
        setPhone(student.Studentdetails.Phone || '');
        setAddress(student.Studentdetails.Address || '');
        setHighestEducation(student.Studentdetails.Highesteducation || 'Đại học');
      }
    }
  }, [student]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!firstname.trim() || !lastname.trim()) {
      toast.error('Vui lòng nhập đầy đủ Họ và Tên.');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`/api/student/profile/${ID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Firstname: firstname.trim(),
          Lastname: lastname.trim(),
          Avatar: avatar.trim(),
          Phone: phone.trim(),
          Address: address.trim(),
          Highesteducation: highestEducation,
        }),
      });

      const res = await response.json();
      if (response.ok) {
        toast.success('Cập nhật hồ sơ học viên thành công!');
        if (reloadStudent) reloadStudent();

        // Cập nhật localStorage
        try {
          const userStr = localStorage.getItem('edupulse_user');
          if (userStr) {
            const u = JSON.parse(userStr);
            u.name = `${lastname.trim()} ${firstname.trim()}`;
            if (avatar.trim()) u.avatar = avatar.trim();
            localStorage.setItem('edupulse_user', JSON.stringify(u));
            window.dispatchEvent(new Event('edupulse-auth-change'));
          }
        } catch (e) {
          console.error(e);
        }
      } else {
        toast.error(res.message || 'Cập nhật thất bại.');
      }
    } catch (err) {
      toast.error('Lỗi kết nối máy chủ.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="spp-wrapper">
      <div className="spp-header">
        <div>
          <h1 className="spp-title">Hồ Sơ Cá Nhân Học Viên</h1>
          <p className="spp-subtitle">Quản lý thông tin tài khoản, liên lạc và thông tin học tập của bạn trên EduPulse</p>
        </div>
        <div className="spp-badge-role">
          <FaCheckCircle />
          <span>Tài Khoản Học Viên Hoạt Động</span>
        </div>
      </div>

      <form onSubmit={handleSave} className="spp-card">
        <h2 className="spp-card-title">
          <FaUser className="text-emerald-500" />
          <span>Thông Tin Cơ Bản</span>
        </h2>

        {/* Avatar Upload */}
        <div className="spp-avatar-section">
          <div className="relative group">
            <img
              src={avatar || "https://res.cloudinary.com/elearning-platform-vn/image/upload/v1789924694/edupulse/students/student_nguyen_van_bao.jpg"}
              alt="Avatar"
              className="spp-avatar-preview"
              onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"; }}
            />
            <label
              htmlFor="student-avatar-file"
              className="spp-avatar-upload-badge"
              title="Nhấn để đổi ảnh đại diện từ thiết bị"
            >
              <FaCamera size={14} />
            </label>
            <input
              type="file"
              id="student-avatar-file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  if (file.size > 5 * 1024 * 1024) {
                    toast.error('Kích thước ảnh tối đa là 5MB.');
                    return;
                  }
                  const reader = new FileReader();
                  reader.onload = (uploadEvent) => {
                    setAvatar(uploadEvent.target.result);
                    toast.success('Đã tải ảnh lên xem trước! Nhấn "Lưu Thay Đổi" để lưu vào hồ sơ.');
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
          </div>

          <div className="spp-avatar-input-box">
            <div className="flex items-center gap-3 flex-wrap">
              <label htmlFor="student-avatar-file" className="spp-upload-btn cursor-pointer">
                <FaCamera size={14} />
                <span>Tải ảnh từ máy tính...</span>
              </label>
              <button
                type="button"
                onClick={() => setAvatar("https://res.cloudinary.com/elearning-platform-vn/image/upload/v1789924694/edupulse/students/student_nguyen_van_bao.jpg")}
                className="spp-reset-btn"
              >
                Đặt lại ảnh mặc định
              </button>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
              Hỗ trợ file ảnh JPG, PNG, WEBP (tối đa 5MB). Ảnh vuông tỉ lệ 1:1 cho độ sắc nét tối ưu.
            </p>
          </div>
        </div>

        {/* Họ và Tên */}
        <div className="spp-grid-2">
          <div className="spp-field">
            <label className="spp-label">Họ & Tên Đệm *</label>
            <input
              type="text"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              required
              className="spp-input"
              placeholder="Nguyễn Văn"
            />
          </div>

          <div className="spp-field">
            <label className="spp-label">Tên *</label>
            <input
              type="text"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              required
              className="spp-input"
              placeholder="Bảo"
            />
          </div>
        </div>

        {/* Email & Phone */}
        <div className="spp-grid-2">
          <div className="spp-field">
            <label className="spp-label flex items-center gap-2">
              <FaEnvelope size={13} className="text-emerald-500" />
              <span>Email Tài Khoản</span>
            </label>
            <input
              type="email"
              value={student?.Email || ''}
              disabled
              className="spp-input"
              title="Email đăng nhập không thể thay đổi"
            />
          </div>

          <div className="spp-field">
            <label className="spp-label flex items-center gap-2">
              <FaPhone size={13} className="text-emerald-500" />
              <span>Số Điện Thoại</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0912 345 678"
              className="spp-input"
            />
          </div>
        </div>

        {/* Địa chỉ & Trình độ học vấn */}
        <div className="spp-grid-2">
          <div className="spp-field">
            <label className="spp-label flex items-center gap-2">
              <FaMapMarkerAlt size={13} className="text-emerald-500" />
              <span>Địa Chỉ / Khu Vực</span>
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Hà Nội, Việt Nam"
              className="spp-input"
            />
          </div>

          <div className="spp-field">
            <label className="spp-label flex items-center gap-2">
              <FaGraduationCap size={13} className="text-emerald-500" />
              <span>Trình Độ Học Vấn Hiện Tại</span>
            </label>
            <select
              value={highestEducation}
              onChange={(e) => setHighestEducation(e.target.value)}
              className="spp-input"
            >
              <option value="Tiểu học">Tiểu học (Lớp 1 - 5)</option>
              <option value="THCS">THCS (Lớp 6 - 9)</option>
              <option value="THPT">THPT (Lớp 10 - 12)</option>
              <option value="Đại học">Đại học / Cao đẳng</option>
              <option value="Người đi làm">Người đi làm / Tự học</option>
            </select>
          </div>
        </div>

        <div className="spp-footer">
          <button type="submit" className="spp-btn-save" disabled={saving}>
            <FaSave />
            <span>{saving ? 'Đang lưu...' : 'Lưu Thay Đổi Hồ Sơ'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default StudentPersonalProfile;
