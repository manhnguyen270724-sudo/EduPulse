import React, { useState, useEffect, useRef } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import { 
  FaUserEdit, FaGraduationCap, FaCertificate, FaSave, FaExternalLinkAlt, 
  FaInfoCircle, FaTrash, FaPlus, FaCamera, FaTimes, FaSearchPlus, FaAward
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useAuth } from '../../../context/AuthContext';
import './TeacherPersonalProfile.css';

function TeacherPersonalProfile() {
  const { ID } = useParams();
  const outlet = useOutletContext() || {};
  const { updateUser } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form states
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [avatar, setAvatar] = useState('');
  const [bio, setBio] = useState('');
  const [ugCollege, setUgCollege] = useState('');
  const [ugDoc, setUgDoc] = useState('');
  const [pgCollege, setPgCollege] = useState('');
  const [pgDoc, setPgDoc] = useState('');
  const [experience, setExperience] = useState('');
  const [slug, setSlug] = useState('');
  
  // Certificates: array of { title, issuer, year, image } or string
  const [certificates, setCertificates] = useState([]);

  // Lightbox modal for viewing certificate image in high-res
  const [lightboxImg, setLightboxImg] = useState(null);

  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/Teacher/TeacherDocument/${ID}`, {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        });
        if (!res.ok) throw new Error('Không thể tải thông tin giảng viên');
        const json = await res.json();
        const t = json.data || {};

        setFirstname(t.Firstname || '');
        setLastname(t.Lastname || '');
        setEmail(t.Email || '');
        setAvatar(t.Avatar || '');
        setBio(t.bio || '');
        setSlug(t.slug || '');

        // Normalize certificates
        const rawCerts = t.certificates || [];
        const normalized = rawCerts.map(c => {
          if (typeof c === 'object' && c !== null) {
            return {
              title: c.title || c.name || '',
              issuer: c.issuer || 'Hội đồng Giáo dục EduPulse',
              year: c.year || '2023',
              image: c.image || '/certificates/certificate_award.jpg'
            };
          }
          return {
            title: String(c),
            issuer: 'Hội đồng Giáo dục EduPulse',
            year: '2023',
            image: '/certificates/certificate_award.jpg'
          };
        });

        if (normalized.length === 0) {
          // Gợi ý chứng chỉ mẫu
          normalized.push({
            title: 'Chứng Nhận Giảng Viên Dạy Giỏi Toàn Quốc',
            issuer: 'Bộ GD&ĐT / EduPulse Academic Board',
            year: '2023',
            image: '/certificates/certificate_award.jpg'
          });
        }
        setCertificates(normalized);

        // Fetch docs
        if (t.Teacherdetails) {
          const docRes = await fetch('/api/teacher/teacherdocuments', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ teacherID: t.Teacherdetails })
          });
          const docJson = await docRes.json();
          const d = docJson.data || {};
          setPhone(d.Phone || '');
          setAddress(d.Address || '');
          setExperience(d.Experience || '');
          setUgCollege(d.UGcollege || '');
          setUgDoc(d.UG || '/certificates/diploma_master.jpg');
          setPgCollege(d.PGcollege || '');
          setPgDoc(d.PG || '/certificates/diploma_master.jpg');
        }
      } catch (err) {
        console.error('Fetch teacher error:', err);
      } finally {
        setLoading(false);
      }
    };
    if (ID) fetchTeacher();
  }, [ID]);

  // Handle avatar upload via file reader
  const handleAvatarFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn file hình ảnh (PNG, JPG, WebP)!');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Kích thước ảnh tối đa là 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setAvatar(reader.result);
      toast.success('Đã tải ảnh đại diện lên thành công! Nhớ nhấn Lưu Thay Đổi.');
    };
    reader.readAsDataURL(file);
  };

  // Handle Certificate Image File Upload
  const handleCertImageFile = (index, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const next = [...certificates];
      next[index] = { ...next[index], image: reader.result };
      setCertificates(next);
      toast.success('Đã cập nhật ảnh minh họa chứng chỉ!');
    };
    reader.readAsDataURL(file);
  };

  const handleAddCert = () => {
    setCertificates([
      ...certificates,
      {
        title: '',
        issuer: 'Tổ chức Giáo dục & Khảo thí',
        year: '2024',
        image: '/certificates/certificate_award.jpg'
      }
    ]);
  };

  const handleCertFieldChange = (index, field, value) => {
    const next = [...certificates];
    next[index] = { ...next[index], [field]: value };
    setCertificates(next);
  };

  const handleRemoveCert = (index) => {
    setCertificates(certificates.filter((_, i) => i !== index));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        bio,
        certificates: certificates.filter(c => c.title && c.title.trim()),
        Phone: phone,
        Address: address,
        Experience: experience,
        UGcollege: ugCollege,
        UG: ugDoc,
        PGcollege: pgCollege,
        PG: pgDoc,
        Avatar: avatar
      };

      const res = await fetch(`/api/teacher/profile/${ID}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const resData = await res.json();
      if (res.ok) {
        toast.success('Cập nhật hồ sơ chuyên môn thành công!');
        updateUser({
          name: `${lastname.trim()} ${firstname.trim()}`,
          avatar: avatar
        });
        if (outlet.reloadTeacher) outlet.reloadTeacher();
      } else {
        toast.error(resData.message || 'Cập nhật thất bại');
      }
    } catch (err) {
      toast.error('Lỗi kết nối khi lưu hồ sơ');
    } finally {
      setSaving(false);
    }
  };

  const publicUrl = `/teacher/${slug || ID}`;

  return (
    <div className="tprof-container">
      {/* Header */}
      <div className="tprof-header">
        <div>
          <h1 className="tprof-title">Hồ Sơ Cá Nhân &amp; Học Thuật Giảng Viên</h1>
          <p className="tprof-subtitle">Quản lý các thông tin và minh chứng bằng cấp hiển thị trên cổng công chúng EduPulse.</p>
        </div>

        <a
          href={publicUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="tprof-btn-public"
          title="Mở hồ sơ công khai xem góc nhìn của học viên"
        >
          <span>👁️ Xem Hồ Sơ Công Khai</span>
          <FaExternalLinkAlt size={10} />
        </a>
      </div>

      {/* Notice Banner */}
      <div className="tprof-notice">
        <FaInfoCircle className="tprof-notice-icon" />
        <div>
          <strong>Bảo chứng chất lượng học thuật:</strong> Thông tin bằng cấp và chứng chỉ được hội đồng chuyên môn EduPulse xác thực và hiển thị huy hiệu <em>Đã Thẩm Định</em> trên toàn hệ thống.
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          Đang tải thông tin hồ sơ...
        </div>
      ) : (
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* 1. Thông tin cơ bản & Avatar Upload */}
          <div className="tprof-card">
            <h2 className="tprof-card-title">
              <FaUserEdit style={{ color: 'var(--primary)' }} />
              <span>1. Thông Tin Cơ Bản &amp; Ảnh Đại Diện</span>
            </h2>

            {/* Avatar Upload Thực Tế */}
            <div className="tprof-avatar-box">
              <img
                src={avatar || "https://res.cloudinary.com/elearning-platform-vn/image/upload/v1789924688/edupulse/teachers/teacher_nguyen_van_an.jpg"}
                alt="Avatar"
                className="tprof-avatar-img"
              />
              <div className="tprof-avatar-controls">
                <span className="tprof-label">Ảnh đại diện Giảng viên (Tải trực tiếp từ máy)</span>
                
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarFileChange}
                  accept="image/*"
                  style={{ display: 'none' }}
                />

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="tprof-btn-file-upload"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <FaCamera size={13} />
                    <span>Chọn Ảnh Từ Thiết Bị</span>
                  </button>

                  <button
                    type="button"
                    style={{
                      padding: '8px 16px',
                      borderRadius: '9999px',
                      border: '1px solid var(--card-border)',
                      background: 'var(--bg-surface)',
                      color: 'var(--text-muted)',
                      fontSize: '0.82rem',
                      cursor: 'pointer'
                    }}
                    onClick={() => setAvatar('https://res.cloudinary.com/elearning-platform-vn/image/upload/v1789924688/edupulse/teachers/teacher_nguyen_van_an.jpg')}
                  >
                    Dùng Ảnh Mặc Định
                  </button>
                </div>
                <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                  Hỗ trợ định dạng PNG, JPG, JPEG, WEBP dung lượng tối đa 5MB. Ảnh sẽ được tự động tối ưu hiển thị.
                </span>
              </div>
            </div>

            <div className="tprof-form-grid">
              <div className="tprof-field">
                <label className="tprof-label">Họ và tên đệm</label>
                <input
                  type="text"
                  className="tprof-input"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  placeholder="Nguyễn Văn"
                  required
                />
              </div>

              <div className="tprof-field">
                <label className="tprof-label">Tên chính</label>
                <input
                  type="text"
                  className="tprof-input"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  placeholder="An"
                  required
                />
              </div>

              <div className="tprof-field">
                <label className="tprof-label">Địa chỉ Email (Cố định theo tài khoản)</label>
                <input
                  type="email"
                  className="tprof-input"
                  value={email}
                  disabled
                  title="Email không thể thay đổi sau khi đăng ký"
                />
              </div>

              <div className="tprof-field">
                <label className="tprof-label">Số điện thoại liên hệ</label>
                <input
                  type="text"
                  className="tprof-input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0901 234 567"
                />
              </div>

              <div className="tprof-field--full tprof-field">
                <label className="tprof-label">Địa chỉ công tác / Nơi làm việc</label>
                <input
                  type="text"
                  className="tprof-input"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Trường Đại học Sư Phạm Hà Nội, Cầu Giấy, TP. Hà Nội"
                />
              </div>
            </div>
          </div>

          {/* 2. Tiểu sử chuyên môn */}
          <div className="tprof-card">
            <h2 className="tprof-card-title">
              <FaInfoCircle style={{ color: 'var(--primary)' }} />
              <span>2. Tiểu Sử Chuyên Môn &amp; Triết Lý Giảng Dạy (Bio)</span>
            </h2>

            <div className="tprof-field">
              <label className="tprof-label">Giới thiệu về phương pháp sư phạm, thành tích giảng dạy</label>
              <textarea
                className="tprof-textarea"
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Chia sẻ về số năm kinh nghiệm, các chuyên đề ôn thi tâm đắc, phương pháp đồng hành cùng học sinh..."
              />
            </div>
          </div>

          {/* 3. Học vấn & Minh chứng Bằng cấp */}
          <div className="tprof-card">
            <h2 className="tprof-card-title">
              <FaGraduationCap style={{ color: 'var(--primary)' }} />
              <span>3. Trình Độ Học Vấn &amp; Minh Chứng Bằng Cấp</span>
            </h2>

            <div className="tprof-form-grid">
              {/* Đại học */}
              <div className="tprof-field">
                <label className="tprof-label">Trường Đại Học &amp; Chuyên Ngành</label>
                <input
                  type="text"
                  className="tprof-input"
                  value={ugCollege}
                  onChange={(e) => setUgCollege(e.target.value)}
                  placeholder="Đại học Sư Phạm Hà Nội (Khoa Toán - Tin)"
                />
                
                {/* Minh chứng bằng cử nhân */}
                <div className="tprof-doc-attach-box">
                  <img
                    src={ugDoc || '/certificates/diploma_master.jpg'}
                    alt="Bằng cử nhân"
                    className="tprof-doc-thumb"
                    onClick={() => setLightboxImg(ugDoc || '/certificates/diploma_master.jpg')}
                    title="Bấm để phóng to xem bằng"
                  />
                  <div className="tprof-doc-meta">
                    <span className="tprof-doc-name">Bằng Tốt Nghiệp Cử Nhân</span>
                    <span className="tprof-doc-hint">Click ảnh để phóng to bản thẩm định</span>
                    <label style={{ fontSize: '0.78rem', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}>
                      Đổi ảnh bằng cấp
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (!f) return;
                          const r = new FileReader();
                          r.onload = () => setUgDoc(r.result);
                          r.readAsDataURL(f);
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Sau đại học */}
              <div className="tprof-field">
                <label className="tprof-label">Trình Độ Sau Đại Học (Thạc sĩ / Tiến sĩ)</label>
                <input
                  type="text"
                  className="tprof-input"
                  value={pgCollege}
                  onChange={(e) => setPgCollege(e.target.value)}
                  placeholder="Đại học Quốc gia Hà Nội (Tiến sĩ Toán học)"
                />

                {/* Minh chứng bằng thạc sĩ / tiến sĩ */}
                <div className="tprof-doc-attach-box">
                  <img
                    src={pgDoc || '/certificates/diploma_master.jpg'}
                    alt="Bằng Sau ĐH"
                    className="tprof-doc-thumb"
                    onClick={() => setLightboxImg(pgDoc || '/certificates/diploma_master.jpg')}
                    title="Bấm để phóng to xem bằng"
                  />
                  <div className="tprof-doc-meta">
                    <span className="tprof-doc-name">Bằng Thạc Sĩ / Tiến Sĩ</span>
                    <span className="tprof-doc-hint">Click ảnh để phóng to bản thẩm định</span>
                    <label style={{ fontSize: '0.78rem', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}>
                      Đổi ảnh bằng cấp
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (!f) return;
                          const r = new FileReader();
                          r.onload = () => setPgDoc(r.result);
                          r.readAsDataURL(f);
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="tprof-field">
                <label className="tprof-label">Số năm kinh nghiệm giảng dạy</label>
                <input
                  type="number"
                  className="tprof-input"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  placeholder="15"
                />
              </div>
            </div>
          </div>

          {/* 4. Chứng chỉ & Thành tích nổi bật (Kèm ảnh minh họa) */}
          <div className="tprof-card">
            <h2 className="tprof-card-title">
              <FaCertificate style={{ color: 'var(--primary)' }} />
              <span>4. Chứng Chỉ Chuyên Môn &amp; Thành Tích Nổi Bật (Có Ảnh Minh Họa)</span>
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Thêm các văn bằng, chứng chỉ sư phạm, giải thưởng giáo viên dạy giỏi. Hình ảnh chứng chỉ sẽ được trưng bày trang trọng tại hồ sơ công khai của thầy/cô.
            </p>

            <div className="tprof-cert-list">
              {certificates.map((cert, index) => (
                <div key={index} className="tprof-cert-card-row">
                  {/* Thumbnail ảnh chứng chỉ */}
                  <img
                    src={cert.image || '/certificates/certificate_award.jpg'}
                    alt={cert.title || 'Chứng chỉ'}
                    className="tprof-cert-img-thumb"
                    onClick={() => setLightboxImg(cert.image || '/certificates/certificate_award.jpg')}
                    title="Bấm để xem ảnh phóng to"
                  />

                  <div className="tprof-cert-inputs">
                    <input
                      type="text"
                      className="tprof-input"
                      value={cert.title}
                      onChange={(e) => handleCertFieldChange(index, 'title', e.target.value)}
                      placeholder="Tên chứng chỉ: VD: Giáo viên dạy giỏi cấp Quốc gia / TESOL Quốc Tế"
                      required
                    />

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <input
                        type="text"
                        className="tprof-input"
                        value={cert.issuer}
                        onChange={(e) => handleCertFieldChange(index, 'issuer', e.target.value)}
                        placeholder="Cơ quan cấp (VD: Bộ GD&ĐT)"
                        style={{ flex: 2 }}
                      />
                      <input
                        type="text"
                        className="tprof-input"
                        value={cert.year}
                        onChange={(e) => handleCertFieldChange(index, 'year', e.target.value)}
                        placeholder="Năm cấp (VD: 2023)"
                        style={{ flex: 1 }}
                      />
                    </div>

                    <label style={{ fontSize: '0.8rem', color: 'var(--primary)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <FaCamera size={11} />
                      <span>Tải ảnh chứng chỉ này từ máy tính</span>
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={(e) => handleCertImageFile(index, e.target.files?.[0])}
                      />
                    </label>
                  </div>

                  <button
                    type="button"
                    className="tprof-btn-remove"
                    onClick={() => handleRemoveCert(index)}
                    title="Xóa chứng chỉ này"
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
              ))}

              <button
                type="button"
                className="tprof-btn-add-cert"
                onClick={handleAddCert}
              >
                <FaPlus size={11} />
                <span>+ Thêm Chứng Chỉ / Khen Thưởng Mới</span>
              </button>
            </div>
          </div>

          {/* Nút lưu */}
          <div className="tprof-actions">
            <button
              type="submit"
              className="tprof-btn-save"
              disabled={saving}
            >
              <FaSave />
              <span>{saving ? 'Đang Lưu...' : 'Lưu Thay Đổi Hồ Sơ & Bằng Cấp'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Lightbox Phóng To Bằng Cấp / Chứng Chỉ */}
      {lightboxImg && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: 20
          }}
          onClick={() => setLightboxImg(null)}
        >
          <div
            style={{
              position: 'relative',
              maxWidth: '90vw',
              maxHeight: '90vh',
              background: '#fff',
              padding: '12px',
              borderRadius: '16px',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              style={{
                position: 'absolute',
                top: -16,
                right: -16,
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: '#ef4444',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
              }}
              onClick={() => setLightboxImg(null)}
            >
              <FaTimes />
            </button>
            <img
              src={lightboxImg}
              alt="Bản gốc thẩm định"
              style={{
                maxWidth: '100%',
                maxHeight: '80vh',
                borderRadius: '10px',
                objectFit: 'contain'
              }}
            />
            <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '0.85rem', color: '#475569' }}>
              Bản sao tài liệu văn bằng &amp; chứng chỉ đã được thẩm định học thuật trên EduPulse
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeacherPersonalProfile;
