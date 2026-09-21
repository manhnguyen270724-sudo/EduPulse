import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaFacebook, FaLinkedin, FaGithub, FaYoutube } from 'react-icons/fa';
import { HiOutlineAcademicCap, HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker } from 'react-icons/hi';
import './Footer.css';

function Footer() {
  return (
    <footer className="edupulse-footer">
      <div className="edupulse-footer-top">
        <div className="edupulse-footer-col brand-col">
          <div className="footer-logo">
            <img src="/logo.png" alt="EduPulse Logo" className="footer-logo-img" />
            <span className="footer-logo-text">Edu<span>Pulse</span></span>
          </div>
          <p className="footer-desc">
            Nền tảng học trực tuyến hàng đầu kết nối học viên với đội ngũ giảng viên tinh hoa Việt Nam. Nâng tầm tri thức, kiến tạo tương lai.
          </p>
          <div className="footer-contact-info">
            <div className="contact-item">
              <HiOutlineLocationMarker className="contact-icon text-cyan-400" />
              <span>99 Tô Hiến Thành, Phước Mỹ, Sơn Trà, TP. Đà Nẵng</span>
            </div>
            <div className="contact-item">
              <HiOutlineMail className="contact-icon text-cyan-400" />
              <span>contact@edupulse.vn</span>
            </div>
            <div className="contact-item">
              <HiOutlinePhone className="contact-icon text-cyan-400" />
              <span>+84 (0) 236 7300 888</span>
            </div>
          </div>
        </div>

        <div className="edupulse-footer-col">
          <h4 className="footer-col-title">Khám Phá</h4>
          <ul className="footer-links">
            <li><NavLink to="/">Trang Chủ</NavLink></li>
            <li><NavLink to="/courses">Tất Cả Khóa Học</NavLink></li>
            <li><NavLink to="/about">Về Chúng Tôi</NavLink></li>
            <li><NavLink to="/contact">Liên Hệ Hỗ Trợ</NavLink></li>
          </ul>
        </div>

        <div className="edupulse-footer-col">
          <h4 className="footer-col-title">Chuyên Môn</h4>
          <ul className="footer-links">
            <li><NavLink to="/courses">Toán Học Cao Cấp</NavLink></li>
            <li><NavLink to="/courses">Vật Lý Ứng Dụng</NavLink></li>
            <li><NavLink to="/courses">Hóa Học & Hóa Lý</NavLink></li>
            <li><NavLink to="/courses">Sinh Học Phân Tử</NavLink></li>
            <li><NavLink to="/courses">Lập Trình Web & AI</NavLink></li>
          </ul>
        </div>

        <div className="edupulse-footer-col">
          <h4 className="footer-col-title">Cam Kết Chất Lượng</h4>
          <p className="footer-commitment">
            100% Giảng viên được thẩm định hồ sơ bằng cấp và kinh nghiệm giảng dạy bởi hội đồng chuyên môn EduPulse.
          </p>
          <div className="footer-socials">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook"><FaFacebook /></a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn"><FaLinkedin /></a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube"><FaYoutube /></a>
            <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub"><FaGithub /></a>
          </div>
        </div>
      </div>

      <div className="edupulse-footer-bottom">
        <p>© 2026 EduPulse Academy. Bản quyền thuộc về EduPulse Platform. All rights reserved.</p>
        <div className="footer-bottom-links">
          <span>Điều khoản dịch vụ</span>
          <span>•</span>
          <span>Chính sách bảo mật</span>
          <span>•</span>
          <span>Quy chế hoạt động</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;