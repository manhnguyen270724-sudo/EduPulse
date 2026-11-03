import React from "react";
import pendingImg from "../Images/pending.svg";
import { NavLink } from "react-router-dom";
import Header from "../Home/Header/Header";
import { FaClock, FaArrowLeft, FaShieldAlt } from "react-icons/fa";

function Pending() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-page, #0b1120)", color: "var(--text-main, #f8fafc)" }}>
      <Header />
      <div className="max-w-2xl mx-auto px-4 py-16 text-center flex flex-col items-center">
        <div className="relative mb-6">
          <img src={pendingImg} alt="Chờ duyệt" className="w-64 sm:w-80 object-contain drop-shadow-2xl" />
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-bold mb-4 uppercase tracking-wider">
          <FaClock /> Hồ Sơ Đang Trong Hàng Đợi Xét Duyệt
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-main,#f8fafc)] mb-3">
          Hồ Sơ Đã Được Ghi Nhận
        </h1>

        <p className="text-sm text-[var(--text-muted,#94a3b8)] leading-relaxed max-w-lg mb-8">
          Cảm ơn bạn đã nộp hồ sơ xác minh trên nền tảng <strong>EduPulse</strong>. Quản trị viên hệ thống đang tiến hành đối soát thông tin văn bằng và chứng chỉ của bạn. Kết quả sẽ được thông báo sớm nhất qua email đăng ký.
        </p>

        <NavLink
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-lg shadow-sky-500/25 hover:from-sky-600 hover:to-indigo-700 transition"
        >
          <FaArrowLeft />
          <span>Về Trang Chủ EduPulse</span>
        </NavLink>
      </div>
    </div>
  );
}

export default Pending;
