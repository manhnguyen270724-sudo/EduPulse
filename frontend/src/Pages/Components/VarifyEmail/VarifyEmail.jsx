import React from 'react';
import Email from '../../Images/email.svg';
import { NavLink } from "react-router-dom";
import Header from '../../Home/Header/Header';
import { FaEnvelope, FaArrowLeft } from 'react-icons/fa';

function VarifyEmail() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-page, #0b1120)", color: "var(--text-main, #f8fafc)" }}>
      <Header />
      <div className="max-w-xl mx-auto px-4 py-16 text-center flex flex-col items-center">
        <div className="p-8 rounded-3xl bg-[var(--card-bg,#0f172a)] border border-[var(--card-border,#1e293b)] shadow-2xl flex flex-col items-center w-full">
          <div className="w-24 h-24 rounded-2xl bg-sky-500/10 border border-sky-500/25 flex items-center justify-center mb-6">
            <img src={Email} width={80} alt="Email Verification" className="object-contain" />
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/30 text-xs font-bold mb-4 uppercase tracking-wider">
            <FaEnvelope /> Kích Hoạt Tài Khoản EduPulse
          </div>

          <h2 className="text-2xl font-extrabold text-[var(--text-main,#f8fafc)] mb-3">
            Kiểm Tra Hộp Thư Email Của Bạn
          </h2>

          <p className="text-sm text-[var(--text-muted,#94a3b8)] leading-relaxed mb-6">
            Hệ thống EduPulse đã gửi một liên kết xác minh an toàn vào địa chỉ email đăng ký của bạn. Vui lòng bấm vào liên kết trong email để kích hoạt tài khoản.
            <br />
            <span className="text-xs text-amber-400 font-semibold mt-2 block">
              💡 Lưu ý: Hãy kiểm tra cả mục Spam / Thư rác nếu chưa thấy thư trong hộp thư chính.
            </span>
          </p>

          <NavLink
            to="/login"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-lg shadow-sky-500/25 hover:from-sky-600 hover:to-indigo-700 transition"
          >
            <FaArrowLeft />
            <span>Quay Lại Trang Đăng Nhập</span>
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default VarifyEmail;
