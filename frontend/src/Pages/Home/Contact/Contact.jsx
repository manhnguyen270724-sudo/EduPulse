import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../../Footer/Footer';
import Mail from "../../Images/Meet-the-team.svg";
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker, HiOutlineClock } from 'react-icons/hi';
import { FaPaperPlane } from 'react-icons/fa';
import './Contact.css';

function Contact({ isStandalone = false }) {
  const location = useLocation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  // Kiểm tra xem trang có đang đứng độc lập ở route /contact hay được nhúng vào Landing
  const isPage = isStandalone || location.pathname === '/contact';

  const handlemsg = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !msg.trim()) {
      setStatusMsg({ type: 'error', text: 'Vui lòng điền đầy đủ tất cả các trường!' });
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setStatusMsg({ type: 'error', text: 'Địa chỉ email không hợp lệ!' });
      return;
    }

    setLoading(true);
    setStatusMsg({ type: '', text: '' });

    try {
      const data = await fetch('/api/admin/contact-us', {
        method: 'POST',
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, message: msg }),
      });

      const response = await data.json();
      setStatusMsg({ type: 'success', text: response.message || 'Tin nhắn của bạn đã được gửi thành công!' });
      setName('');
      setEmail('');
      setMsg('');
    } catch (err) {
      setStatusMsg({ type: 'error', text: 'Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại!' });
    } finally {
      setLoading(false);
    }
  };

  const contactContent = (
    <div className="edupulse-contact-wrapper">
      <div className="section-header text-center">
        <span className="section-tag">LIÊN HỆ & HỖ TRỢ</span>
        <h2 className="section-title">Kết Nối Với Đội Ngũ <span className="gradient-text">EduPulse</span></h2>
        <p className="section-desc">Bạn có thắc mắc về khóa học, học phí hay cần tư vấn lộ trình học? Đừng ngần ngại liên hệ với chúng tôi!</p>
      </div>

      <div className="contact-grid-container">
        {/* Left Col: Contact Info */}
        <div className="contact-info-panel">
          <div className="contact-info-header">
            <h3 className="text-xl font-bold text-white mb-2">Thông Tin Trực Tiếp</h3>
            <p className="text-slate-300 text-sm">Đội ngũ chuyên viên tư vấn luôn sẵn sàng phản hồi trong vòng 15 phút.</p>
          </div>

          <div className="contact-items-list">
            <div className="contact-card-item">
              <div className="contact-card-icon">
                <HiOutlineLocationMarker />
              </div>
              <div>
                <div className="contact-item-label">Trụ sở chính</div>
                <div className="contact-item-value">99 Tô Hiến Thành, Phước Mỹ, Sơn Trà, TP. Đà Nẵng</div>
              </div>
            </div>

            <div className="contact-card-item">
              <div className="contact-card-icon">
                <HiOutlineMail />
              </div>
              <div>
                <div className="contact-item-label">Email hỗ trợ học vụ</div>
                <div className="contact-item-value">support@edupulse.vn</div>
              </div>
            </div>

            <div className="contact-card-item">
              <div className="contact-card-icon">
                <HiOutlinePhone />
              </div>
              <div>
                <div className="contact-item-label">Hotline tư vấn 24/7</div>
                <div className="contact-item-value">+84 (0) 236 7300 888</div>
              </div>
            </div>

            <div className="contact-card-item">
              <div className="contact-card-icon">
                <HiOutlineClock />
              </div>
              <div>
                <div className="contact-item-label">Thời gian làm việc</div>
                <div className="contact-item-value">Thứ Hai - Chủ Nhật: 08:00 - 22:00</div>
              </div>
            </div>
          </div>

          <div className="contact-visual-img-box">
            <img src={Mail} alt="Contact Illustration" className="contact-illustration" />
          </div>
        </div>

        {/* Right Col: Form */}
        <div className="contact-form-panel">
          <h3 className="form-panel-title">Gửi Lời Nhắn Đến EduPulse</h3>
          <p className="form-panel-subtitle">Điền thông tin bên dưới, chúng tôi sẽ liên hệ lại ngay với bạn.</p>

          <form onSubmit={handlemsg} className="edupulse-contact-form">
            <div className="form-group">
              <label className="form-label">Họ và Tên của bạn</label>
              <input
                type="text"
                placeholder="Nguyễn Văn A"
                className="auth-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Địa Chỉ Email</label>
              <input
                type="email"
                placeholder="name@example.com"
                className="auth-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Nội dung tin nhắn / Câu hỏi cần tư vấn</label>
              <textarea
                placeholder="Nhập nội dung cần giải đáp về khóa học, lịch học, học phí..."
                className="auth-input"
                style={{ minHeight: '130px', resize: 'vertical' }}
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
              />
            </div>

            {statusMsg.text && (
              <div className={`status-alert ${statusMsg.type}`}>
                {statusMsg.text}
              </div>
            )}

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              <FaPaperPlane className="text-sm" />
              {loading ? 'Đang gửi tin nhắn...' : 'Gửi Tin Nhắn Cho Chúng Tôi'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  if (isPage) {
    return (
      <div className="edupulse-landing">
        <Header />
        <div style={{ paddingTop: '40px' }}>
          {contactContent}
        </div>
        <Footer />
      </div>
    );
  }

  return contactContent;
}

export default Contact;