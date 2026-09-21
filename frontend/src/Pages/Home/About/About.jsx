import React from 'react';
import Plant from "../../Images/Plant.svg";
import Plant2 from "../../Images/Plant2.svg";
import '../Landing/Landing.css';
import Footer from "../../Footer/Footer.jsx";
import Header from '../Header/Header.jsx';
import { FaGraduationCap, FaAward, FaHeart, FaRocket, FaCheckCircle } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';

function About() {
  return (
    <div className="edupulse-landing">
      <Header />

      {/* Header Banner */}
      <section className="edupulse-hero" style={{ paddingBottom: '30px' }}>
        <div className="hero-glow-bg hero-glow-1"></div>
        <div className="hero-glow-bg hero-glow-2"></div>
        <div className="section-header text-center" style={{ marginTop: '20px' }}>
          <span className="section-tag">VỀ CHÚNG TÔI</span>
          <h1 className="hero-title" style={{ fontSize: '2.8rem' }}>
            Hành Trình Kiến Tạo <span className="gradient-text">EduPulse</span>
          </h1>
          <p className="section-desc">
            Tiên phong xây dựng chuẩn mực giáo dục trực tuyến chất lượng cao tại Việt Nam, 
            kết nối tri thức không khoảng cách giữa Giảng viên đầu ngành và thế hệ người học tương lai.
          </p>
        </div>
      </section>

      {/* Story & Mission Section */}
      <section className="edupulse-about-section" style={{ paddingTop: '0' }}>
        <div className="edupulse-about-container">
          <div className="about-visual">
            <img src={Plant2} className="about-img" alt="EduPulse Story" />
          </div>

          <div className="about-content">
            <span className="section-tag">CÂU CHUYỆN CỦA CHÚNG TÔI</span>
            <h2 className="about-title">Khát Vọng Đem Giáo Dục Đỉnh Cao Đến Mọi Miền</h2>
            
            <p className="about-lead">
              <span className="text-cyan-400 font-bold">EduPulse</span> ra đời từ niềm tin mãnh liệt: Mỗi học sinh, dù ở bất kỳ đâu, đều xứng đáng được học tập và lắng nghe sự chỉ dẫn từ những người thầy giỏi nhất.
            </p>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              Chúng tôi thấu hiểu những rào cản về địa lý và chi phí học thêm truyền thống. Đặt trụ sở chính tại <strong>99 Tô Hiến Thành, Sơn Trà, TP. Đà Nẵng</strong> — trung tâm đổi mới sáng tạo năng động của miền Trung — EduPulse kết hợp công nghệ tương tác thời gian thực Google Meet cùng giáo trình chuẩn hóa từ THPT đến Đại học, tạo nên môi trường học tập hiệu quả, minh bạch và đầy cảm hứng.
            </p>

            <div className="about-pillars">
              <div className="pillar-item">
                <div className="pillar-icon text-cyan-400">
                  <FaGraduationCap />
                </div>
                <div>
                  <h4 className="pillar-title">Sứ Mệnh Học Thuật</h4>
                  <p className="pillar-desc">Xóa bỏ rào cản tiếp cận kiến thức tinh hoa, truyền cảm hứng và giúp người học đạt điểm số tối đa trong các kỳ thi quan trọng.</p>
                </div>
              </div>

              <div className="pillar-item">
                <div className="pillar-icon text-blue-400">
                  <FaAward />
                </div>
                <div>
                  <h4 className="pillar-title">Cam Kết Chất Lượng</h4>
                  <p className="pillar-desc">100% Giảng viên có học vị Tiến sĩ, Thạc sĩ được thẩm định hồ sơ bằng cấp và kinh nghiệm sư phạm nghiêm ngặt.</p>
                </div>
              </div>

              <div className="pillar-item">
                <div className="pillar-icon text-emerald-400">
                  <FaHeart />
                </div>
                <div>
                  <h4 className="pillar-title">Tận Tâm Đồng Hành</h4>
                  <p className="pillar-desc">Không chỉ dừng lại ở bài giảng, EduPulse xây dựng hệ sinh thái hỗ trợ giải đáp 24/7 và định hướng lộ trình nghề nghiệp.</p>
                </div>
              </div>
            </div>

            <div className="about-cta">
              <NavLink to="/courses" className="btn-primary-glow">
                Khám Phá Khóa Học Ngay
              </NavLink>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="edupulse-features-section" style={{ paddingTop: '20px' }}>
        <div className="section-header text-center">
          <span className="section-tag">GIÁ TRỊ CỐT LÕI</span>
          <h2 className="section-title">4 Trụ Cột Phát Triển Của <span className="gradient-text">EduPulse</span></h2>
        </div>

        <div className="features-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
          <div className="feature-card">
            <div className="feature-step-badge">01</div>
            <h3 className="feature-card-title">Học Đi Đôi Với Hành</h3>
            <p className="feature-card-desc">Lý thuyết tinh gọn kết hợp giải quyết các dạng đề thi thực chiến và dự án ứng dụng thực tế.</p>
          </div>

          <div className="feature-card">
            <div className="feature-step-badge">02</div>
            <h3 className="feature-card-title">Tương Tác Thực Chất</h3>
            <p className="feature-card-desc">Lớp học không phải là video thu sẵn một chiều. Học sinh được bật mic phát biểu và trao đổi 1-1 cùng thầy cô.</p>
          </div>

          <div className="feature-card">
            <div className="feature-step-badge">03</div>
            <h3 className="feature-card-title">Minh Bạch & Uy Tín</h3>
            <p className="feature-card-desc">Chính sách học phí minh bạch qua cổng thanh toán bảo mật, hoàn tiền và bảo lưu quyền lợi rõ ràng.</p>
          </div>

          <div className="feature-card">
            <div className="feature-step-badge">04</div>
            <h3 className="feature-card-title">Đổi Mới Công Nghệ</h3>
            <p className="feature-card-desc">Liên tục cải tiến trải nghiệm người dùng với giao diện tối ưu tốc độ cao và thân thiện trên mọi thiết bị.</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default About;