import React from "react";
import rejectedImg from "../Images/rejected.svg";
import { NavLink, useParams } from "react-router-dom";
import Header from "../Home/Header/Header";
import { FaExclamationTriangle, FaRedo, FaArrowLeft } from "react-icons/fa";

function Rejected() {
  const { ID, user } = useParams();
  const type = user === 'student' ? 'StudentDocument' : 'TeacherDocument';

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-page, #0b1120)", color: "var(--text-main, #f8fafc)" }}>
      <Header />
      <div className="max-w-2xl mx-auto px-4 py-16 text-center flex flex-col items-center">
        <div className="relative mb-6">
          <img src={rejectedImg} alt="Hồ sơ bị từ chối" className="w-64 sm:w-80 object-contain drop-shadow-2xl" />
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 text-xs font-bold mb-4 uppercase tracking-wider">
          <FaExclamationTriangle /> Hồ Sơ Cần Bổ Sung / Chỉnh Sửa
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-main,#f8fafc)] mb-3">
          Yêu Cầu Nộp Lại Hồ Sơ Xác Minh
        </h1>

        <p className="text-sm text-[var(--text-muted,#94a3b8)] leading-relaxed max-w-lg mb-8">
          Hình ảnh giấy tờ tùy thân (Căn cước công dân) hoặc văn bằng chứng chỉ chưa đủ độ rõ nét hoặc cần bổ sung thông tin chính xác. Vui lòng kiểm tra lại phản hồi chi tiết trong email và cập nhật lại hồ sơ của bạn.
        </p>

        <div className="flex items-center gap-4 flex-wrap justify-center">
          <NavLink
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-[var(--bg-surface-secondary,#1e293b)] text-[var(--text-muted,#94a3b8)] border border-[var(--card-border,#334155)] hover:text-white transition"
          >
            <FaArrowLeft />
            <span>Về Trang Chủ</span>
          </NavLink>

          <NavLink
            to={`/${type}/${ID}`}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-rose-500 to-amber-600 text-white shadow-lg shadow-rose-500/25 hover:opacity-90 transition"
          >
            <FaRedo />
            <span>Nộp Lại Hồ Sơ Ngay</span>
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default Rejected;
