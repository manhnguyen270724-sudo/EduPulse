import React from 'react';
import { NavLink } from "react-router-dom";
import Error from './Images/error.svg';
import Header from '../Home/Header/Header';
import Footer from '../Footer/Footer';
import { FaHome, FaCompass } from 'react-icons/fa';

function ErrorPage() {
  return (
    <div className="auth-page-wrapper">
      <Header />
      <div className="auth-container" style={{ flexDirection: 'column', textAlign: 'center', margin: '60px auto' }}>
        <img src={Error} alt="404 Not Found" style={{ maxWidth: '380px', filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.5))' }} />
        
        <div style={{ marginTop: '20px' }}>
          <span className="auth-badge">MÃ LỖI: 404</span>
          <h1 className="auth-title" style={{ fontSize: '2.5rem', marginTop: '10px' }}>
            Trang Không Tồn Tại
          </h1>
          <p className="auth-subtitle" style={{ maxWidth: '500px', margin: '10px auto 30px' }}>
            Đường link bạn vừa truy cập có thể đã bị xóa hoặc đổi địa chỉ. Hãy quay về trang chủ để tiếp tục khám phá các khóa học!
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <NavLink to="/" className="btn-primary-glow" style={{ textDecoration: 'none' }}>
              <FaHome className="inline mr-2" /> Về Trang Chủ
            </NavLink>
            <NavLink to="/courses" className="btn-secondary-glass" style={{ textDecoration: 'none' }}>
              <FaCompass className="inline mr-2" /> Khám Phá Khóa Học
            </NavLink>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ErrorPage;