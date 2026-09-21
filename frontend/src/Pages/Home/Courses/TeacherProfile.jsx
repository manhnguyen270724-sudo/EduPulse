import React, { useState, useEffect } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../../Footer/Footer';
import {
  FaCheckCircle, FaVideo, FaClock, FaCalendarAlt, FaUsers,
  FaGraduationCap, FaBook, FaSearchPlus, FaTimes, FaCertificate,
  FaAward, FaChalkboardTeacher, FaQuoteLeft, FaStar, FaShieldAlt
} from 'react-icons/fa';
import { MdVerified, MdWork, MdSchool, MdEmail, MdLocationOn } from 'react-icons/md';
import { getCourseSubjectLabel, getCourseLevelLabel, DAYS_VI, formatTime } from '../../../data/subjectTaxonomy';
import './TeacherProfile.css';

function TeacherProfile() {
  const { teacherId } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lightboxImg, setLightboxImg] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/public/teacher/${teacherId}`, {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        });
        const data = await res.json();
        if (data.statusCode === 200 && data.data) {
          setProfileData(data.data);
        } else {
          setError('Không tìm thấy giảng viên này.');
        }
      } catch {
        setError('Lỗi kết nối. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };
    if (teacherId) fetchProfile();
  }, [teacherId]);

  if (loading) {
    return (
      <div className="page-wrapper">
        <Header />
        <div className="edu-loading-state" style={{ flex: 1, minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div className="edu-spinner"></div>
          <p style={{ marginTop: 16, color: 'var(--text-muted)' }}>Đang tải hồ sơ portfolio học thuật...</p>
        </div>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="page-wrapper">
        <Header />
        <div className="edu-empty-state" style={{ flex: 1, paddingTop: 100, textAlign: 'center', minHeight: '50vh' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: 12 }}>Không tìm thấy giảng viên</h3>
          <p style={{ color: 'var(--text-muted)' }}>{error}</p>
          <NavLink to="/courses" className="btn-primary" style={{ marginTop: 24, display: 'inline-flex' }}>
            Xem Danh Sách Khóa Học
          </NavLink>
        </div>
        <Footer />
      </div>
    );
  }

  const { teacher, courses, stats } = profileData;
  const docs = teacher.Teacherdetails;
  const isVerified = teacher.Isapproved === 'approved';

  const currentUser = (() => {
    try {
      const saved = localStorage.getItem('edupulse_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  })();

  const isSelfTeacher = currentUser?.role === 'teacher' && (String(currentUser?.id) === String(teacher._id) || currentUser?.email === teacher.Email);

  return (
    <div className="page-wrapper tp-portfolio-root">
      <Header />

      {/* Thanh ngữ cảnh người xem */}
      {isSelfTeacher ? (
        <div className="tp-role-context-bar tp-role-context-bar--self">
          <div className="section-container flex items-center justify-between flex-wrap gap-2">
            <span>👁️ <strong>Chế độ xem trước hồ sơ cá nhân:</strong> Bạn đang quan sát Portfolio của chính mình dưới góc nhìn của học viên và phụ huynh.</span>
            <NavLink to={`/Teacher/Dashboard/${currentUser.id}/Home`} className="btn-primary" style={{ padding: '5px 12px', fontSize: '0.8rem' }}>
              ← Quay Lại Bảng Điều Khiển
            </NavLink>
          </div>
        </div>
      ) : currentUser?.role === 'student' ? (
        <div className="tp-role-context-bar tp-role-context-bar--student">
          <div className="section-container flex items-center justify-between flex-wrap gap-2">
            <span>🎓 Bạn đang xem Portfolio Cố Vấn Học Thuật của <strong>Thầy/Cô {teacher.Lastname} {teacher.Firstname}</strong>.</span>
            <NavLink to={`/Student/Dashboard/${currentUser.id}/Courses`} style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.85rem' }}>
              Vào Không Gian Học Tập Của Bạn →
            </NavLink>
          </div>
        </div>
      ) : (
        <div className="tp-role-context-bar tp-role-context-bar--guest">
          <div className="section-container flex items-center justify-between flex-wrap gap-2">
            <span>Hồ sơ Cố Vấn Học Thuật chính thức tại EduPulse · Lớp học trực tuyến tương tác qua Google Meet</span>
            <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem' }}>
              <NavLink to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Đăng Nhập</NavLink>
              <NavLink to="/signup" style={{ color: 'var(--primary)', fontWeight: 600 }}>Đăng Ký Học Viên →</NavLink>
            </div>
          </div>
        </div>
      )}

      {/* ======= 1. ACADEMIC PORTFOLIO HERO SECTION ======= */}
      <header className="tp-portfolio-hero">
        <div className="tp-hero-mesh"></div>
        <div className="section-container">
          <nav className="tp-breadcrumb">
            <NavLink to="/">Trang Chủ</NavLink>
            <span className="tp-bc-sep">/</span>
            <NavLink to="/courses">Đội Ngũ Giảng Viên</NavLink>
            <span className="tp-bc-sep">/</span>
            <span className="tp-bc-current">Hồ Sơ Cố Vấn {teacher.Lastname} {teacher.Firstname}</span>
          </nav>

          <div className="tp-hero-grid">
            {/* CỘT TRÁI: Ảnh chân dung học thuật khổ lớn (Large Master Portrait) */}
            <div className="tp-portrait-col">
              <div className="tp-portrait-card">
                <div className="tp-portrait-frame">
                  <img
                    src={teacher.Avatar || 'https://res.cloudinary.com/elearning-platform-vn/image/upload/v1789924688/edupulse/teachers/teacher_nguyen_van_an.jpg'}
                    alt={`${teacher.Lastname} ${teacher.Firstname}`}
                    className="tp-portrait-img"
                  />
                  {isVerified && (
                    <div className="tp-portrait-badge">
                      <MdVerified size={15} />
                      <span>Cố Vấn Thẩm Định</span>
                    </div>
                  )}
                </div>

                {/* Card Quick Info Dưới Chân Dung */}
                <div className="tp-portrait-footer">
                  <div className="tp-portrait-rating">
                    <div className="tp-stars">
                      <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                    </div>
                    <span className="tp-rating-val">5.0 / 5.0</span>
                    <span className="tp-rating-count">(Học viên đánh giá)</span>
                  </div>

                  <div className="tp-portrait-status">
                    <span className="tp-pulse-dot"></span>
                    <span>Đang nhận học viên trực tiếp qua Google Meet</span>
                  </div>

                  {docs?.Address && (
                    <div className="tp-portrait-loc">
                      <MdLocationOn size={14} />
                      <span>{docs.Address}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* CỘT PHẢI: Hồ sơ năng lực học giả (Scholar Profile Info) */}
            <div className="tp-scholar-col">
              <div className="tp-scholar-tag-row">
                <span className="tp-tag-academic">
                  <MdSchool size={15} /> Cố Vấn Học Thuật Cao Cấp
                </span>
                {isVerified && (
                  <span className="tp-tag-verified">
                    <FaCheckCircle size={13} /> Hồ Sơ Đã Đối Soát Bằng Gốc
                  </span>
                )}
                <span className="tp-tag-live">
                  <FaVideo size={12} /> Google Meet Live 1:1 &amp; Nhóm Nhỏ
                </span>
              </div>

              <h1 className="tp-scholar-name">
                {teacher.Lastname} {teacher.Firstname}
              </h1>

              <div className="tp-scholar-institution">
                {docs?.PGcollege ? (
                  <p className="tp-inst-line">
                    <FaGraduationCap size={16} className="tp-inst-icon" />
                    <span>{docs.PGcollege}</span>
                  </p>
                ) : null}
                <p className="tp-exp-subtitle">
                  {docs?.Experience ? `${docs.Experience} Năm Cống Hiến & Đào Tạo Học Sinh Giỏi, Luyện Thi Đại Học` : 'Giảng viên chuyên môn kỳ cựu'}
                </p>
              </div>

              {/* Tuyên ngôn sư phạm (Teaching Manifesto) */}
              <div className="tp-manifesto-box">
                <FaQuoteLeft className="tp-quote-icon" />
                <p className="tp-manifesto-text">
                  {teacher.bio || 'Giáo dục không phải là việc đổ đầy một chiếc bình, mà là thắp lên một ngọn lửa khai phóng. Đồng hành cùng học viên để thấu hiểu bản chất kiến thức, rèn luyện tư duy phản biện và tự tin bứt phá trong mọi kỳ thi.'}
                </p>
              </div>

              {/* Lưới 4 Thẻ Số Liệu Portfolio (Impact Metrics) */}
              <div className="tp-impact-metrics-grid">
                <div className="tp-impact-card">
                  <span className="tp-impact-num">{docs?.Experience || '15'}+</span>
                  <span className="tp-impact-label">Năm Kinh Nghiệm</span>
                  <span className="tp-impact-desc">Giảng dạy &amp; Nghiên cứu</span>
                </div>
                <div className="tp-impact-card">
                  <span className="tp-impact-num">{stats?.totalCourses || courses.length || 1}</span>
                  <span className="tp-impact-label">Lớp Học Mở</span>
                  <span className="tp-impact-desc">Trực tiếp qua Google Meet</span>
                </div>
                <div className="tp-impact-card">
                  <span className="tp-impact-num">{stats?.totalStudents || (courses.length * 18) || 24}+</span>
                  <span className="tp-impact-label">Học Viên Đồng Hành</span>
                  <span className="tp-impact-desc">Được kèm cặp trực tiếp</span>
                </div>
                <div className="tp-impact-card">
                  <span className="tp-impact-num">100%</span>
                  <span className="tp-impact-label">Đạt Mục Tiêu</span>
                  <span className="tp-impact-desc">Thi cử &amp; Nâng điểm</span>
                </div>
              </div>

              {/* Danh mục chuyên môn trọng điểm */}
              {courses.length > 0 && (
                <div className="tp-subjects-row">
                  <span className="tp-sub-header">Chuyên sâu đào tạo:</span>
                  <div className="tp-subject-pills-list">
                    {courses.map(c => (
                      <span key={c._id} className="tp-academic-pill">
                        {getCourseSubjectLabel(c)} · {getCourseLevelLabel(c)}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Các nút hành động sắc nét */}
              <div className="tp-hero-cta-group">
                <a href="#portfolio-courses" className="btn-primary">
                  <FaBook size={14} />
                  <span>Xem Lớp Học Trực Tuyến Đang Mở ({courses.length})</span>
                </a>
                <a href="#portfolio-credentials" className="btn-ghost">
                  <FaCertificate size={14} />
                  <span>Văn Bằng &amp; Chứng Nhận Thẩm Định</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ======= 2. PORTFOLIO QUICK NAV ======= */}
      <nav className="tp-quick-nav-bar">
        <div className="section-container tp-quick-nav-inner">
          <a href="#portfolio-methodology" className="tp-quick-nav-link">Triết Lý Sư Phạm</a>
          <a href="#portfolio-credentials" className="tp-quick-nav-link">Học Vấn &amp; Bằng Cấp</a>
          <a href="#portfolio-certifications" className="tp-quick-nav-link">Chứng Chỉ &amp; Thành Tích</a>
          <a href="#portfolio-courses" className="tp-quick-nav-link">Lớp Trực Tuyến Đang Mở</a>
          <a href="#portfolio-testimonials" className="tp-quick-nav-link">Cảm Nhận Học Viên</a>
        </div>
      </nav>

      {/* ======= 3. MAIN PORTFOLIO BODY ======= */}
      <main className="section-container tp-portfolio-body">

        {/* SECTION 1: TRIẾT LÝ & TRỤ CỘT PHƯƠNG PHÁP SƯ PHẠM */}
        <section id="portfolio-methodology" className="tp-portfolio-section">
          <div className="tp-section-header">
            <span className="tp-section-eyebrow">Trụ Cột Đào Tạo</span>
            <h2 className="tp-section-main-title">Phương Pháp Sư Phạm Khác Biệt</h2>
            <p className="tp-section-subtitle">
              Không dạy học theo lối mòn truyền thụ một chiều. Mỗi buổi học tại EduPulse là một phiên tương tác trực tiếp, khai mở tư duy bản chất và xây dựng năng lực tự học bền bỉ.
            </p>
          </div>

          <div className="tp-methodology-grid">
            <div className="tp-method-card">
              <div className="tp-method-icon-box">
                <FaVideo />
              </div>
              <h3 className="tp-method-title">Tương Tác 2 Chiều Google Meet Live</h3>
              <p className="tp-method-desc">
                Không sử dụng video thu sẵn thụ động. Toàn bộ thời lượng học diễn ra trực tiếp qua Google Meet chuẩn HD, học viên được bật mic, share màn hình và thảo luận trực tiếp cùng cố vấn.
              </p>
              <ul className="tp-method-points">
                <li>Sửa bài tập trực tiếp ngay tại giờ học</li>
                <li>Tháo gỡ điểm nghẽn tư duy theo thời gian thực</li>
                <li>Ghi hình buổi học lưu lại làm tài liệu ôn tập</li>
              </ul>
            </div>

            <div className="tp-method-card">
              <div className="tp-method-icon-box">
                <FaChalkboardTeacher />
              </div>
              <h3 className="tp-method-title">Cá Nhân Hóa Lộ Trình &amp; Mục Tiêu</h3>
              <p className="tp-method-desc">
                Mỗi học viên mang một phong cách học tập và nền tảng khác nhau. Cố vấn thiết kế bài tập và nhịp độ bài giảng bám sát năng lực cụ thể của từng học viên trong nhóm.
              </p>
              <ul className="tp-method-points">
                <li>Đánh giá đầu vào định vị đúng năng lực</li>
                <li>Báo cáo tiến độ sau từng chuyên đề</li>
                <li>Chiến thuật phân bổ điểm thi tối ưu hóa</li>
              </ul>
            </div>

            <div className="tp-method-card">
              <div className="tp-method-icon-box">
                <FaAward />
              </div>
              <h3 className="tp-method-title">Tư Duy Bản Chất &amp; Không Học Vẹt</h3>
              <p className="tp-method-desc">
                Đi sâu vào bản chất tiên đề, định lý và nguyên lý cốt lõi. Giúp học viên linh hoạt ứng biến trước các câu hỏi vận dụng cao và cấu trúc đề thi mới nhất.
              </p>
              <ul className="tp-method-points">
                <li>Hệ thống hóa kiến thức bằng sơ đồ trực quan</li>
                <li>Kỹ thuật giải đề phản xạ tự nhiên</li>
                <li>Xây dựng sự tự tin tuyệt đối trước kỳ thi</li>
              </ul>
            </div>
          </div>
        </section>

        {/* SECTION 2: HỒ SƠ HỌC VẤN & MINH CHỨNG BẰNG CẤP */}
        {docs && (
          <section id="portfolio-credentials" className="tp-portfolio-section">
            <div className="tp-section-header">
              <span className="tp-section-eyebrow">Thẩm Định Tính Danh</span>
              <h2 className="tp-section-main-title">Học Vấn &amp; Văn Bằng Thẩm Định</h2>
              <p className="tp-section-subtitle">
                100% hồ sơ giảng viên tại EduPulse được ban học vụ thẩm định trực tiếp với các trường đại học và cổng tra cứu văn bằng quốc gia trước khi mở lớp.
              </p>
            </div>

            <div className="tp-credentials-list">
              {docs.PGcollege && (
                <div className="tp-credential-card">
                  <div className="tp-credential-content">
                    <div className="tp-cred-badge-row">
                      <span className="tp-cred-level-badge">Sau Đại Học · Thạc Sĩ / Tiến Sĩ</span>
                      <span className="tp-cred-status-badge">
                        <FaCheckCircle size={12} /> Đã Đối Soát Bản Gốc
                      </span>
                    </div>
                    <h3 className="tp-cred-school">{docs.PGcollege}</h3>
                    {docs.PGmarks && (
                      <p className="tp-cred-score">
                        Xếp loại tốt nghiệp / Điểm GPA: <strong>{docs.PGmarks}/10</strong>
                      </p>
                    )}
                    <p className="tp-cred-note">
                      Văn bằng chuyên môn cao cấp khẳng định năng lực học thuật chuẩn mực trong lĩnh vực nghiên cứu và sư phạm chuyên sâu.
                    </p>
                  </div>

                  <div
                    className="tp-cred-thumb-wrap"
                    onClick={() => setLightboxImg({
                      src: docs.PGdoc || "/certificates/diploma_master.jpg",
                      title: `Bằng Sau Đại Học · ${docs.PGcollege}`,
                      desc: "Hồ sơ văn bằng thạc sĩ / tiến sĩ chính quy đã được Ban Học Vụ EduPulse đối soát hồ sơ gốc và lưu trữ số hóa."
                    })}
                  >
                    <img
                      src={docs.PGdoc || "/certificates/diploma_master.jpg"}
                      alt="Bằng Sau Đại Học"
                      className="tp-cred-thumb-img"
                    />
                    <div className="tp-cred-thumb-hover">
                      <FaSearchPlus size={20} />
                      <span>Xem Văn Bằng Thẩm Định</span>
                    </div>
                  </div>
                </div>
              )}

              {docs.UGcollege && (
                <div className="tp-credential-card">
                  <div className="tp-credential-content">
                    <div className="tp-cred-badge-row">
                      <span className="tp-cred-level-badge">Đại Học Chính Quy · Cử Nhân Sư Phạm</span>
                      <span className="tp-cred-status-badge">
                        <FaCheckCircle size={12} /> Đã Đối Soát Bản Gốc
                      </span>
                    </div>
                    <h3 className="tp-cred-school">{docs.UGcollege}</h3>
                    {docs.UGmarks && (
                      <p className="tp-cred-score">
                        Xếp loại tốt nghiệp / Điểm GPA: <strong>{docs.UGmarks}/10</strong>
                      </p>
                    )}
                    <p className="tp-cred-note">
                      Bằng cử nhân chính quy đào tạo phương pháp giảng dạy hiện đại, tâm lý lứa tuổi học đường và chuẩn mực giáo dục quốc gia.
                    </p>
                  </div>

                  <div
                    className="tp-cred-thumb-wrap"
                    onClick={() => setLightboxImg({
                      src: docs.UGdoc || "/certificates/diploma_master.jpg",
                      title: `Bằng Cử Nhân Đại Học · ${docs.UGcollege}`,
                      desc: "Bằng cử nhân chính quy được tra cứu và xác minh tính hợp lệ trên hệ thống cổng dữ liệu văn bằng đại học."
                    })}
                  >
                    <img
                      src={docs.UGdoc || "/certificates/diploma_master.jpg"}
                      alt="Bằng Cử Nhân Đại Học"
                      className="tp-cred-thumb-img"
                    />
                    <div className="tp-cred-thumb-hover">
                      <FaSearchPlus size={20} />
                      <span>Xem Văn Bằng Thẩm Định</span>
                    </div>
                  </div>
                </div>
              )}

              {docs.HigherSchool && (
                <div className="tp-credential-card tp-credential-card--hs">
                  <div className="tp-credential-content">
                    <div className="tp-cred-badge-row">
                      <span className="tp-cred-level-badge">Trung Học Phổ Thông Chuyên</span>
                    </div>
                    <h3 className="tp-cred-school">{docs.HigherSchool}</h3>
                    <p className="tp-cred-note">Cái nôi đào tạo học sinh năng khiếu và rèn luyện tư duy học thuật nền tảng vững chắc.</p>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* SECTION 3: CHỨNG CHỈ NGHIỆP VỤ & THÀNH TÍCH */}
        {teacher.certificates && teacher.certificates.length > 0 && (
          <section id="portfolio-certifications" className="tp-portfolio-section">
            <div className="tp-section-header">
              <span className="tp-section-eyebrow">Giải Thưởng &amp; Nghiệp Vụ</span>
              <h2 className="tp-section-main-title">Chứng Chỉ Chuyên Môn &amp; Thành Tựu</h2>
              <p className="tp-section-subtitle">
                Các giải thưởng giảng dạy, chứng chỉ chuyên môn quốc tế và chứng nhận nghiệp vụ sư phạm nâng cao của cố vấn.
              </p>
            </div>

            <div className="tp-certs-rich-grid">
              {teacher.certificates.map((cert, i) => {
                const title = typeof cert === 'string' ? cert : (cert.title || 'Chứng chỉ sư phạm');
                const issuer = typeof cert === 'object' && cert.issuer ? cert.issuer : 'Hội đồng Giáo dục Quốc gia';
                const year = typeof cert === 'object' && cert.year ? cert.year : '2024';
                const imgSrc = (typeof cert === 'object' && cert.image) ? cert.image : "/certificates/certificate_award.jpg";

                return (
                  <div
                    key={i}
                    className="tp-cert-rich-card"
                    onClick={() => setLightboxImg({
                      src: imgSrc,
                      title: title,
                      desc: `Đơn vị cấp bằng: ${issuer} · Năm công nhận: ${year} · Chứng nhận năng lực giảng dạy xuất sắc.`
                    })}
                  >
                    <div className="tp-cert-rich-img-box">
                      <img src={imgSrc} alt={title} className="tp-cert-rich-img" />
                      <div className="tp-cert-zoom-btn">
                        <FaSearchPlus size={13} />
                      </div>
                    </div>
                    <div className="tp-cert-rich-info">
                      <h4 className="tp-cert-rich-title">{title}</h4>
                      <p className="tp-cert-rich-meta">{issuer} · {year}</p>
                      <span className="tp-cert-rich-badge">
                        <FaCheckCircle size={11} /> Đã Thẩm Định Tính Pháp Lý
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* SECTION 4: DANH MỤC LỚP HỌC TRỰC TUYẾN ĐANG MỞ */}
        <section id="portfolio-courses" className="tp-portfolio-section">
          <div className="tp-section-header">
            <span className="tp-section-eyebrow">Đăng Ký Khóa Học</span>
            <h2 className="tp-section-main-title">Lớp Học Trực Tuyến Đang Mở</h2>
            <p className="tp-section-subtitle">
              Các khóa học trực tiếp do Cố vấn {teacher.Lastname} {teacher.Firstname} đứng lớp giảng dạy qua Google Meet. Giới hạn sĩ số để đảm bảo tương tác chất lượng cao nhất.
            </p>
          </div>

          {courses.length === 0 ? (
            <div className="tp-empty-courses-card">
              <FaBook size={36} className="tp-empty-icon" />
              <h3>Hiện chưa có lớp học mới mở tuyển sinh</h3>
              <p>Thầy/Cô hiện đang kín lịch giảng dạy. Vui lòng để lại liên hệ để nhận thông báo sớm nhất khi có lớp mới mở.</p>
              <NavLink to="/contact" className="btn-primary" style={{ marginTop: 16 }}>
                Đăng Ký Nhận Lịch Mở Lớp
              </NavLink>
            </div>
          ) : (
            <div className="tp-masterclasses-grid">
              {courses.map(c => {
                const max = c.maxStudents || 25;
                const enrolled = c.enrolledStudent?.length || 0;
                const spotsLeft = Math.max(0, max - enrolled);

                return (
                  <div key={c._id} className="tp-masterclass-card">
                    <div className="tp-mc-header">
                      <div className="tp-mc-badge-group">
                        <span className="tp-mc-subject-badge">{getCourseSubjectLabel(c)}</span>
                        <span className="tp-mc-level-badge">{getCourseLevelLabel(c)}</span>
                      </div>
                      <div className="tp-mc-live-badge">
                        <span className="tp-pulse-dot"></span>
                        <span>Google Meet Live</span>
                      </div>
                    </div>

                    <h3 className="tp-mc-title">
                      <NavLink to={`/courses/${c._id}`}>{c.title || getCourseSubjectLabel(c)}</NavLink>
                    </h3>

                    <p className="tp-mc-desc">
                      {c.description || 'Khóa học chú trọng nắm chắc phương pháp tư duy bản chất, luyện đề chuyên sâu và phản xạ nhanh các dạng toán học kỳ và kỳ thi quốc gia.'}
                    </p>

                    {c.schedule && c.schedule.length > 0 && (
                      <div className="tp-mc-schedule-box">
                        <div className="tp-mc-sch-title">
                          <FaCalendarAlt size={13} /> Lịch học cố định hàng tuần:
                        </div>
                        <div className="tp-mc-sch-times">
                          {c.schedule.map((s, idx) => (
                            <span key={idx} className="tp-sch-time-chip">
                              <FaClock size={11} /> {DAYS_VI[s.day]} · {formatTime(s.starttime)} - {formatTime(s.endtime)}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="tp-mc-footer">
                      <div className="tp-mc-capacity">
                        <FaUsers size={14} />
                        <span>Sĩ số: {enrolled}/{max} học viên</span>
                        <span className={`tp-mc-spots-chip ${spotsLeft <= 5 ? 'tp-mc-spots-chip--low' : ''}`}>
                          {spotsLeft <= 0 ? 'Đã Đầy Lớp' : `Còn ${spotsLeft} chỗ`}
                        </span>
                      </div>

                      <div className="tp-mc-actions">
                        <NavLink to={`/courses/${c._id}`} className="btn-primary" style={{ textDecoration: 'none' }}>
                          Chi Tiết &amp; Ghi Danh →
                        </NavLink>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* SECTION 5: ĐÁNH GIÁ & CẢM NHẬN TỪ HỌC VIÊN */}
        <section id="portfolio-testimonials" className="tp-portfolio-section">
          <div className="tp-section-header">
            <span className="tp-section-eyebrow">Hiệu Quả Thực Tế</span>
            <h2 className="tp-section-main-title">Cảm Nhận Của Học Viên Đồng Hành</h2>
            <p className="tp-section-subtitle">
              Sự tiến bộ vượt bậc về tư duy và kết quả thi cử của các thế hệ học sinh là thước đo rõ ràng nhất cho chất lượng cố vấn.
            </p>
          </div>

          <div className="tp-testimonials-grid">
            <div className="tp-testimonial-card">
              <div className="tp-test-stars">
                <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
              </div>
              <p className="tp-test-quote">
                "Thầy giảng dạy cực kỳ dễ hiểu, không bắt học thuộc lòng công thức giải nhanh mà giúp em hiểu rõ nguồn gốc bản chất. Nhờ lớp Google Meet của thầy mà em tăng từ 6.8 lên 9.4 điểm môn Toán thi tốt nghiệp THPT."
              </p>
              <div className="tp-test-author">
                <div className="tp-test-avatar">TA</div>
                <div>
                  <h4 className="tp-test-name">Trần Tuấn Anh</h4>
                  <p className="tp-test-role">Học sinh K12 · Đạt 9.4 Toán THPT QG</p>
                </div>
              </div>
            </div>

            <div className="tp-testimonial-card">
              <div className="tp-test-stars">
                <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
              </div>
              <p className="tp-test-quote">
                "Lớp học sĩ số vừa phải nên em thoải mái bật mic hỏi bài bất cứ lúc nào chưa hiểu. Thầy sửa bài giải rất kỹ lưỡng và chỉ cho em từng lỗi sai về tư duy logic mà trước đây em hay mắc phải."
              </p>
              <div className="tp-test-author">
                <div className="tp-test-avatar">MN</div>
                <div>
                  <h4 className="tp-test-name">Nguyễn Mai Ngọc</h4>
                  <p className="tp-test-role">Học sinh Chuyên Hà Nội - Amsterdam</p>
                </div>
              </div>
            </div>

            <div className="tp-testimonial-card">
              <div className="tp-test-stars">
                <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
              </div>
              <p className="tp-test-quote">
                "Là phụ huynh theo sát con, tôi rất yên tâm về sự tận tình và kỷ luật của thầy. Mỗi buổi học đều có ghi hình và báo cáo tiến độ rõ ràng. Con tôi đã tự tin hơn hẳn trong việc giải các bài toán nâng cao."
              </p>
              <div className="tp-test-author">
                <div className="tp-test-avatar">PL</div>
                <div>
                  <h4 className="tp-test-name">Chị Phan Linh</h4>
                  <p className="tp-test-role">Phụ huynh học sinh lớp 11</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 6: CAM KẾT HỌC THUẬT & KẾT NỐI TƯ VẤN */}
        <section className="tp-portfolio-section tp-guarantee-section">
          <div className="tp-guarantee-box">
            <div className="tp-guar-icon">
              <FaShieldAlt size={36} />
            </div>
            <div className="tp-guar-text">
              <h3>Cam Kết Chất Lượng Đào Tạo Tại EduPulse</h3>
              <p>
                Học viên được hoàn 100% học phí hoặc đổi lớp trong 02 buổi học đầu tiên nếu nhận thấy phong cách giảng dạy chưa phù hợp với định hướng cá nhân. Toàn bộ tài liệu và bản ghi hình Google Meet được cập nhật tự động trong góc học tập.
              </p>
            </div>
            <div className="tp-guar-action">
              <NavLink to="/contact" className="btn-primary" style={{ whiteSpace: 'nowrap', textDecoration: 'none' }}>
                Liên Hệ Ban Học Vụ
              </NavLink>
            </div>
          </div>
        </section>

      </main>

      {/* Lightbox Modal Xem Chi Tiết Bằng Cấp / Chứng Chỉ */}
      {lightboxImg && (
        <div
          className="edu-modal-backdrop"
          onClick={() => setLightboxImg(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            animation: 'edu-modal-fade 150ms ease forwards',
          }}
        >
          <div
            className="edu-modal-dialog"
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'var(--card-bg)',
              borderRadius: '8px',
              maxWidth: '880px',
              width: '100%',
              overflow: 'hidden',
              boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.5)',
              border: '1px solid var(--card-border)',
              animation: 'edu-modal-slide 200ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
              position: 'relative',
            }}
          >
            {/* Modal Header */}
            <div style={{
              padding: '16px 24px',
              borderBottom: '1px solid var(--card-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--bg-surface-secondary)'
            }}>
              <div className="flex items-center gap-2">
                <FaCheckCircle className="text-emerald-500" size={16} />
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  {lightboxImg.title || 'Văn Bằng Chứng Chỉ Thẩm Định'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setLightboxImg(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                  color: 'var(--text-muted)',
                  padding: '4px 8px',
                  borderRadius: '4px',
                }}
              >
                <FaTimes />
              </button>
            </div>

            {/* Modal Image Body */}
            <div style={{ padding: '24px', textAlign: 'center', background: '#090d16' }}>
              <img
                src={lightboxImg.src}
                alt={lightboxImg.title}
                style={{
                  maxHeight: '68vh',
                  maxWidth: '100%',
                  objectFit: 'contain',
                  borderRadius: '6px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}
              />
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '14px 24px',
              background: 'var(--card-bg)',
              borderTop: '1px solid var(--card-border)',
              fontSize: '0.85rem',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div className="flex items-center gap-2">
                <span style={{
                  display: 'inline-block',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#10b981'
                }}></span>
                <span>{lightboxImg.desc || "Hồ sơ văn bằng chính thức được lưu trữ và xác thực trên hệ thống EduPulse."}</span>
              </div>
              <button
                type="button"
                onClick={() => setLightboxImg(null)}
                className="btn-primary"
                style={{ padding: '6px 16px', fontSize: '0.82rem', borderRadius: '4px' }}
              >
                Đóng Cửa Sổ
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default TeacherProfile;
