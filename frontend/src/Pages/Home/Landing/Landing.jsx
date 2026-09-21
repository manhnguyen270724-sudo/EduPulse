import React, { useState, useEffect } from "react";
import "./Landing.css";
import Classroom from "../../Images/Classroom.svg";
import Plant from "../../Images/Plant.svg";
import Plant2 from "../../Images/Plant2.svg";
import Contact from "../Contact/Contact.jsx";
import Footer from "../../Footer/Footer.jsx";
import Header from "../Header/Header.jsx";
import { CgProfile } from "react-icons/cg";
import { IoSchoolSharp } from "react-icons/io5";
import { FaSchool, FaGraduationCap, FaVideo, FaHeadset, FaSearch, FaCheckCircle, FaStar } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";

function Landing() {
  const [LClass, setLClass] = useState(false);
  const [EMentor, setEMentor] = useState(true);
  const [subject, setSubject] = useState('');
  const [activeSubject, setActiveSubject] = useState('math');
  const [facList, setFacList] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSearch = () => {
    if (!subject.trim()) return;
    navigate(`/Search/${subject.trim().toLowerCase()}`);
  };

  const showMentor = () => {
    setEMentor(true);
    setLClass(false);
  };

  const showLiveClass = () => {
    setEMentor(false);
    setLClass(true);
  };

  const fetchTeachersBySubject = async (sub) => {
    setActiveSubject(sub);
    setLoading(true);
    try {
      const response = await fetch(`/api/course/${sub}`, {
        method: 'GET',
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        }
      });
      const data = await response.json();
      setFacList(data.data || []);
    } catch (err) {
      console.error("Lỗi khi tải giảng viên:", err);
      setFacList([]);
    } finally {
      setLoading(false);
    }
  };

  // Tự động load môn Toán đầu tiên khi vào trang
  useEffect(() => {
    fetchTeachersBySubject('math');
  }, []);

  const subjectTabs = [
    { key: 'math', label: 'Toán Học' },
    { key: 'physics', label: 'Vật Lý' },
    { key: 'chemistry', label: 'Hóa Học' },
    { key: 'biology', label: 'Sinh Học' },
    { key: 'computer', label: 'Tin Học & AI' },
    { key: 'ielts', label: 'Tiếng Anh & IELTS' },
    { key: 'ai-data', label: 'Khoa Học Dữ Liệu' },
    { key: 'finance', label: 'Tài Chính Số' }
  ];

  const teacherImages = {
    math: "https://res.cloudinary.com/elearning-platform-vn/image/upload/v1789924688/edupulse/teachers/teacher_nguyen_van_an.jpg",
    physics: "https://res.cloudinary.com/elearning-platform-vn/image/upload/v1789924689/edupulse/teachers/teacher_tran_thi_mai.jpg",
    chemistry: "https://res.cloudinary.com/elearning-platform-vn/image/upload/v1789924691/edupulse/teachers/teacher_le_hoang_long.jpg",
    biology: "https://res.cloudinary.com/elearning-platform-vn/image/upload/v1789924692/edupulse/teachers/teacher_pham_thi_lan.jpg",
    computer: "https://res.cloudinary.com/elearning-platform-vn/image/upload/v1789924693/edupulse/teachers/teacher_do_minh_duc.jpg",
    ielts: "https://res.cloudinary.com/elearning-platform-vn/image/upload/v1789924689/edupulse/teachers/teacher_tran_thi_mai.jpg",
    "ai-data": "https://res.cloudinary.com/elearning-platform-vn/image/upload/v1789924688/edupulse/teachers/teacher_nguyen_van_an.jpg",
    finance: "https://res.cloudinary.com/elearning-platform-vn/image/upload/v1789924692/edupulse/teachers/teacher_pham_thi_lan.jpg"
  };

  return (
    <div className="edupulse-landing">
      <Header />

      {/* ================= HERO SECTION ================= */}
      <section className="edupulse-hero">
        <div className="hero-glow-bg hero-glow-1"></div>
        <div className="hero-glow-bg hero-glow-2"></div>
        
        <div className="edupulse-hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-pulse"></span>
              <span className="badge-text">TRUNG TÂM ĐÀO TẠO & HỌC TRỰC TUYẾN CHẤT LƯỢNG CAO • 99 TÔ HIẾN THÀNH, ĐÀ NẴNG</span>
            </div>

            <h1 className="hero-title">
              <span className="hero-line hero-line-1">Nâng Tầm Tri Thức,</span>
              <span className="hero-line hero-line-2">Vững Bước Tương Lai Cùng <span className="gradient-text">EduPulse</span></span>
            </h1>

            <p className="hero-subtitle">
              Nền tảng giáo dục số đồng hành cùng đội ngũ Giảng viên đầu ngành. 
              Học tương tác 2 chiều qua Google Meet, giải đáp thấu đáo và xây dựng nền tảng vững chắc cho mọi kỳ thi và sự nghiệp.
            </p>

            {/* Search Bar */}
            <div className="hero-search-wrapper">
              <div className="hero-search-box">
                <FaSearch className="search-icon" />
                <input 
                  type="text" 
                  placeholder="Nhập môn học bạn muốn tìm (vd: math, physics, chemistry)..." 
                  value={subject} 
                  onChange={(e) => setSubject(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button className="hero-search-btn" onClick={handleSearch}>
                  Tìm Giảng Viên
                </button>
              </div>

              {/* Quick Tags */}
              <div className="hero-quick-tags">
                <span className="quick-tag-label">Tìm nhanh:</span>
                {subjectTabs.map(tab => (
                  <button 
                    key={tab.key} 
                    className="quick-tag-btn" 
                    onClick={() => {
                      setSubject(tab.key);
                      fetchTeachersBySubject(tab.key);
                    }}
                  >
                    {tab.icon} {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Hero CTA buttons */}
            <div className="hero-cta-group">
              <NavLink to="/courses" className="btn-primary-glow">
                Khám Phá Khóa Học
              </NavLink>
              <NavLink to="/signup" className="btn-secondary-glass">
                Đăng Ký Tài Khoản Miễn Phí
              </NavLink>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-image-wrapper">
              <img src={Classroom} alt="Lớp học trực tuyến EduPulse" className="hero-main-img" />
              
              {/* Floating Stat Card */}
              <div className="floating-stat-card stat-live">
                <div className="stat-icon-wrapper">
                  <FaVideo className="text-cyan-400 text-lg" />
                </div>
                <div>
                  <div className="stat-title font-bold text-white text-sm">Lớp Học Trực Tuyến</div>
                  <div className="stat-desc text-xs text-green-400 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-ping"></span> Đang diễn ra tương tác
                  </div>
                </div>
              </div>

              {/* Floating Mentor Card */}
              <div className="floating-stat-card stat-mentor">
                <div className="stat-icon-wrapper bg-amber-500/20 text-amber-400">
                  <FaStar className="text-sm" />
                </div>
                <div>
                  <div className="stat-title font-bold text-white text-sm">4.9 / 5.0 ⭐</div>
                  <div className="stat-desc text-xs text-slate-300">Đánh giá từ 15,000+ Học viên</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Counter Bar */}
        <div className="hero-stats-bar">
          <div className="stat-box">
            <div className="stat-number">15,000+</div>
            <div className="stat-label">Học Viên Tin Tưởng</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-box">
            <div className="stat-number">50+</div>
            <div className="stat-label">Giảng Viên Đầu Ngành</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-box">
            <div className="stat-number">98.8%</div>
            <div className="stat-label">Tỷ Lệ Đạt Mục Tiêu</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-box">
            <div className="stat-number">24/7</div>
            <div className="stat-label">Đồng Hành & Hỗ Trợ</div>
          </div>
        </div>
      </section>


      {/* ================= FEATURES SECTION ================= */}
      <section className="edupulse-features-section">
        <div className="section-header text-center">
          <span className="section-tag">GIÁ TRỊ VƯỢT TRỘI</span>
          <h2 className="section-title">Tại Sao Nên Lựa Chọn <span className="gradient-text">EduPulse</span>?</h2>
          <p className="section-desc">
            Chúng tôi xây dựng môi trường học thuật chuẩn mực, ứng dụng công nghệ hiện đại mang lại kết quả học tập tối ưu.
          </p>
        </div>

        <div className="features-grid">
          {/* Feature 1 */}
          <div className={`feature-card ${EMentor ? 'active' : ''}`} onClick={showMentor}>
            <div className="feature-icon-box cyan">
              <FaGraduationCap />
            </div>
            <h3 className="feature-card-title">Cố Vấn Chuyên Môn Đầu Ngành</h3>
            <p className="feature-card-desc">
              Đội ngũ Phó Giáo sư, Tiến sĩ, Giảng viên ưu tú từ các trường đại học danh tiếng trực tiếp giảng dạy và dẫn dắt.
            </p>
            <div className="feature-card-action">
              <span>Xem chi tiết cố vấn</span> →
            </div>
          </div>

          {/* Feature 2 */}
          <div className={`feature-card ${LClass ? 'active' : ''}`} onClick={showLiveClass}>
            <div className="feature-icon-box blue">
              <FaVideo />
            </div>
            <h3 className="feature-card-title">Lớp Live Tương Tác 2 Chiều</h3>
            <p className="feature-card-desc">
              Học trực tiếp qua Google Meet thời gian thực, hỏi đáp và trao đổi trực tiếp với giảng viên ngay trong buổi học.
            </p>
            <div className="feature-card-action">
              <span>Xem trải nghiệm lớp học</span> →
            </div>
          </div>

          {/* Feature 3 */}
          <NavLink to='/contact' className="feature-card-link">
            <div className="feature-card">
              <div className="feature-icon-box emerald">
                <FaHeadset />
              </div>
              <h3 className="feature-card-title">Hỗ Trợ Học Tập 24/7</h3>
              <p className="feature-card-desc">
                Hệ thống trợ giảng và đội ngũ kỹ thuật luôn túc trực hỗ trợ giải đáp mọi bài tập và khó khăn của học viên.
              </p>
              <div className="feature-card-action">
                <span>Liên hệ hỗ trợ ngay</span> →
              </div>
            </div>
          </NavLink>
        </div>

        {/* Feature Detail: E-Mentor Display */}
        {EMentor && (
          <div className="feature-detail-container">
            <div className="detail-header">
              <h3 className="detail-title">Hội Đồng Cố Vấn Học Thuật Tiêu Biểu</h3>
              <p className="detail-subtitle">Gặp gỡ những người thầy tận tâm đồng hành cùng thành công của bạn</p>
            </div>

            <div className="mentors-showcase-grid">
              {/* Mentor 1 */}
              <NavLink to="/teacher/an-nguyen-van" className="mentor-card-link" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="mentor-card">
                  <div className="mentor-avatar-wrapper">
                    <img src="https://res.cloudinary.com/elearning-platform-vn/image/upload/v1789924688/edupulse/teachers/teacher_nguyen_van_an.jpg" alt="GS. TS. Nguyễn Văn An" className="mentor-avatar" />
                    <span className="mentor-verified-badge" title="Đã xác thực danh tính"><FaCheckCircle /></span>
                  </div>
                  <h4 className="mentor-name">GS. TS. Nguyễn Văn An</h4>
                  <div className="mentor-meta">
                    <div className="mentor-meta-item">
                      <FaSchool className="meta-icon text-yellow-400" />
                      <span>ĐH Sư Phạm Hà Nội</span>
                    </div>
                    <div className="mentor-meta-item">
                      <IoSchoolSharp className="meta-icon text-cyan-400" />
                      <span>Tiến sĩ Toán Học & Giải Tích</span>
                    </div>
                  </div>
                  <div className="mentor-experience">15+ năm kinh nghiệm đào tạo học sinh giỏi quốc gia</div>
                  <div style={{ marginTop: '12px', fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>Xem hồ sơ giảng viên →</div>
                </div>
              </NavLink>

              {/* Mentor 2 */}
              <NavLink to="/teacher/mai-tran-thi" className="mentor-card-link" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="mentor-card">
                  <div className="mentor-avatar-wrapper">
                    <img src="https://res.cloudinary.com/elearning-platform-vn/image/upload/v1789924689/edupulse/teachers/teacher_tran_thi_mai.jpg" alt="PGS. TS. Trần Thị Mai" className="mentor-avatar" />
                    <span className="mentor-verified-badge" title="Đã xác thực danh tính"><FaCheckCircle /></span>
                  </div>
                  <h4 className="mentor-name">PGS. TS. Trần Thị Mai</h4>
                  <div className="mentor-meta">
                    <div className="mentor-meta-item">
                      <FaSchool className="meta-icon text-yellow-400" />
                      <span>Đại học Quốc Gia Hà Nội</span>
                    </div>
                    <div className="mentor-meta-item">
                      <IoSchoolSharp className="meta-icon text-cyan-400" />
                      <span>Thạc sĩ Vật Lý Lượng Tử</span>
                    </div>
                  </div>
                  <div className="mentor-experience">10+ năm kinh nghiệm giảng dạy & nghiên cứu ứng dụng</div>
                  <div style={{ marginTop: '12px', fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>Xem hồ sơ giảng viên →</div>
                </div>
              </NavLink>

              {/* Mentor 3 */}
              <NavLink to="/teacher/long-le-hoang" className="mentor-card-link" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="mentor-card">
                  <div className="mentor-avatar-wrapper">
                    <img src="https://res.cloudinary.com/elearning-platform-vn/image/upload/v1789924691/edupulse/teachers/teacher_le_hoang_long.jpg" alt="TS. Lê Hoàng Long" className="mentor-avatar" />
                    <span className="mentor-verified-badge" title="Đã xác thực danh tính"><FaCheckCircle /></span>
                  </div>
                  <h4 className="mentor-name">TS. Lê Hoàng Long</h4>
                  <div className="mentor-meta">
                    <div className="mentor-meta-item">
                      <FaSchool className="meta-icon text-yellow-400" />
                      <span>ĐH Bách Khoa TP.HCM</span>
                    </div>
                    <div className="mentor-meta-item">
                      <IoSchoolSharp className="meta-icon text-cyan-400" />
                      <span>Tiến sĩ Kỹ Thuật Hóa Học</span>
                    </div>
                  </div>
                  <div className="mentor-experience">8+ năm giảng dạy đại học & hướng dẫn nghiên cứu sinh</div>
                  <div style={{ marginTop: '12px', fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>Xem hồ sơ giảng viên →</div>
                </div>
              </NavLink>
            </div>
          </div>
        )}

        {/* Feature Detail: Live Class Display */}
        {LClass && (
          <div className="feature-detail-container live-class-detail">
            <div className="live-preview-card">
              <div className="live-preview-header">
                <span className="live-dot"></span>
                <span className="live-badge-text">PHÒNG HỌC TRỰC TUYẾN CHẤT LƯỢNG CAO</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Tích hợp Google Meet Bản Quyền</h3>
              <p className="text-slate-300 text-sm max-w-xl mx-auto mb-4">
                Hình ảnh sắc nét chuẩn Full HD, âm thanh trong trẻo, không giới hạn thời gian buổi học. 
                Giảng viên có thể ghi hình bài giảng để học viên xem lại bất cứ lúc nào.
              </p>
              <NavLink to="/courses" className="btn-primary-glow inline-block">
                Xem Lịch Lớp Học Ngay
              </NavLink>
            </div>
          </div>
        )}
      </section>


      {/* ================= FACULTY & COURSES EXPLORER ================= */}
      <section className="edupulse-courses-section">
        <div className="section-header text-center">
          <span className="section-tag">CHƯƠNG TRÌNH HỌC TẬP</span>
          <h2 className="section-title">Khám Phá Giảng Viên & Môn Học</h2>
          <p className="section-desc">Chọn môn học để xem thông tin Giảng viên phụ trách và nội dung đào tạo chuyên sâu.</p>
        </div>

        {/* Subject Filter Pills */}
        <div className="subject-pills-wrapper">
          {subjectTabs.map(tab => (
            <button 
              key={tab.key}
              className={`subject-pill ${activeSubject === tab.key ? 'active' : ''}`}
              onClick={() => fetchTeachersBySubject(tab.key)}
            >
              <span className="pill-text">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Course & Faculty Cards Grid */}
        <div className="courses-grid-container">
          {loading ? (
            <div className="courses-loading">
              <div className="spinner"></div>
              <p>Đang tải dữ liệu giảng viên...</p>
            </div>
          ) : facList.length > 0 ? (
            <div className="faculty-cards-grid">
              {facList.map(fac => {
                const teacherImg = fac.enrolledteacher?.Avatar || teacherImages[fac.coursename?.toLowerCase()] || "https://res.cloudinary.com/elearning-platform-vn/image/upload/v1789924688/edupulse/teachers/teacher_nguyen_van_an.jpg";
                return (
                  <div key={fac._id} className="faculty-card">
                    <div className="faculty-card-top">
                      <NavLink to={`/teacher/${fac.enrolledteacher?._id}`} className="faculty-avatar-box" style={{ textDecoration: 'none' }}>
                        <img src={teacherImg} alt={fac.enrolledteacher?.Firstname} className="faculty-avatar" />
                        <span className="status-online-dot"></span>
                      </NavLink>
                      <div className="faculty-info">
                        <NavLink to={`/teacher/${fac.enrolledteacher?._id}`} style={{ textDecoration: 'none' }}>
                          <h4 className="faculty-name" title="Xem hồ sơ giảng viên">
                            {fac.enrolledteacher?.Lastname} {fac.enrolledteacher?.Firstname}
                          </h4>
                        </NavLink>
                        <div className="faculty-badge-verified">
                          <FaCheckCircle className="text-cyan-400 text-xs" />
                          <span>Giảng viên chính thức</span>
                        </div>
                      </div>
                    </div>

                    <div className="faculty-card-body">
                      <div className="course-title-tag">
                        Khóa học môn: <span className="uppercase font-bold text-cyan-300">{fac.coursename}</span>
                      </div>
                      <p className="course-desc-text">
                        {fac.description}
                      </p>

                      {fac.liveClasses && fac.liveClasses.length > 0 && (
                        <div className="course-live-schedule">
                          <FaVideo className="text-cyan-400 text-xs" />
                          <span>Lớp học: {fac.liveClasses[0]?.title}</span>
                        </div>
                      )}
                    </div>

                    <div className="faculty-card-footer" style={{ display: 'flex', gap: '10px' }}>
                      <NavLink to={`/teacher/${fac.enrolledteacher?._id}`} className="btn-view-doc" style={{ flex: 1, textAlign: 'center' }}>
                        Hồ Sơ GV
                      </NavLink>
                      <NavLink to={`/courses/${fac._id}`} className="btn-join-course" style={{ flex: 2, textAlign: 'center' }}>
                        Xem & Đăng Ký
                      </NavLink>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="courses-empty">
              <p>Chưa có giảng viên nào cho môn học này.</p>
            </div>
          )}
        </div>
      </section>


      {/* ================= ABOUT US SECTION ================= */}
      <section className="edupulse-about-section">
        <div className="edupulse-about-container">
          <div className="about-visual">
            <img src={Plant2} alt="Minh họa học tập" className="about-img" />
          </div>

          <div className="about-content">
            <span className="section-tag">VỀ EDUPULSE</span>
            <h2 className="about-title">Sứ Mệnh Kiến Tạo Thế Hệ Người Học Toàn Cầu</h2>
            
            <p className="about-lead">
              Tại <span className="text-cyan-400 font-bold">EduPulse</span>, chúng tôi tin rằng giáo dục chất lượng cao phải là quyền lợi dễ dàng tiếp cận của mọi học sinh trên khắp Việt Nam.
            </p>

            <div className="about-pillars">
              <div className="pillar-item">
                <div className="pillar-icon">🎯</div>
                <div>
                  <h4 className="pillar-title">Học Đi Đôi Với Hành</h4>
                  <p className="pillar-desc">Nội dung bài học bám sát kỳ thi THPT Quốc gia và tiêu chuẩn đại học quốc tế.</p>
                </div>
              </div>

              <div className="pillar-item">
                <div className="pillar-icon">💡</div>
                <div>
                  <h4 className="pillar-title">Công Nghệ Dẫn Lối</h4>
                  <p className="pillar-desc">Áp dụng công nghệ E-Learning thời gian thực, quản lý học tập minh bạch.</p>
                </div>
              </div>

              <div className="pillar-item">
                <div className="pillar-icon">🤝</div>
                <div>
                  <h4 className="pillar-title">Tận Tâm Đồng Hành</h4>
                  <p className="pillar-desc">Đội ngũ giảng viên và trợ lý hỗ trợ trực tiếp từng khúc mắc của học viên.</p>
                </div>
              </div>
            </div>

            <div className="about-cta">
              <NavLink to="/about" className="btn-primary-glow">
                Tìm Hiểu Thêm Về Chúng Tôi
              </NavLink>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CONTACT SECTION ================= */}
      <section className="edupulse-contact-section">
        <Contact />
      </section>

      {/* ================= FOOTER ================= */}
      <Footer />
    </div>
  );
}

export default Landing;
