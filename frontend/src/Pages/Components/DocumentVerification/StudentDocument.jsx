import React, { useEffect, useState } from "react";
import Input from "../DocumentVerification/InputComponent/Input.jsx";
import InputUpload from "../DocumentVerification/Inputupload/InputUpload.jsx";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { RotatingLines } from "react-loader-spinner";
import { FaGraduationCap, FaUserGraduate, FaArrowLeft, FaCheckCircle } from "react-icons/fa";
import toast from "react-hot-toast";

const StudentDocument = () => {
  const [data, setdata] = useState([]);
  const [error, setError] = useState("");
  const { Data } = useParams();
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(`/api/student/StudentDocument/${Data}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Không thể tải thông tin học viên");
        }

        const user = await response.json();
        setdata(user.data);
      } catch (error) {
        setError(error.message);
      }
    };

    getData();
  }, [Data]);

  const [formData, setFormData] = useState({
    Phone: data.Phone || "",
    Address: data.Address || "",
    Highesteducation: data.Highesteducation || "",
    SecondarySchool: data.SecondarySchool || "",
    HigherSchool: data.HigherSchool || "",
    SecondaryMarks: data.SecondaryMarks || "",
    HigherMarks: data.HigherMarks || "",
    Aadhaar: null,
    Secondary: null,
    Higher: null,
  });

  const handleFileChange = (fileType, e) => {
    setFormData({
      ...formData,
      [fileType]: e.target.files[0],
    });
  };

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);

    const formDataObj = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null) {
        formDataObj.append(key, formData[key]);
      }
    });

    try {
      const response = await fetch(`/api/student/verification/${Data}`, {
        method: "POST",
        body: formDataObj,
      });

      const responseData = await response.json();
      setLoader(false);

      if (!response.ok) {
        setError(responseData.message || "Tải lên tài liệu thất bại");
        toast.error(responseData.message || "Tải lên tài liệu thất bại");
      } else {
        toast.success("Nộp hồ sơ xác minh thành công!");
        navigate("/pending");
      }
    } catch (e) {
      setLoader(false);
      console.error("Error:", e);
      toast.error("Lỗi mạng khi tải lên hồ sơ");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--dashboard-bg, #0b1120)", color: "var(--text-main, #f8fafc)" }}>
      {/* Topbar */}
      <header className="h-16 px-6 sm:px-12 flex items-center justify-between border-b border-[var(--header-border,rgba(255,255,255,0.08))] bg-[var(--bg-header,rgba(11,17,32,0.9))] sticky top-0 z-40 backdrop-blur-md">
        <NavLink to="/" className="flex items-center gap-3">
          <img
            src="https://res.cloudinary.com/elearning-platform-vn/image/upload/v1789924695/edupulse/branding/edupulse_logo.jpg"
            alt="EduPulse Logo"
            className="w-9 h-9 rounded-lg object-cover"
          />
          <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-indigo-400">
            EduPulse
          </span>
          <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 ml-2">
            Xác Minh Hồ Sơ Học Viên
          </span>
        </NavLink>

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[var(--bg-surface-secondary,#1e293b)] text-[var(--text-main,#f8fafc)] border border-[var(--card-border,#334155)] hover:opacity-80 transition"
        >
          <FaArrowLeft />
          <span>Quay Lại</span>
        </button>
      </header>

      {/* Main Form Body */}
      <main className="max-w-5xl mx-auto px-4 sm:px-8 py-10">
        {loader && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
            <RotatingLines
              visible={true}
              height="80"
              width="80"
              color="#0284c7"
              strokeWidth="5"
              animationDuration="0.75"
              ariaLabel="rotating-lines-loading"
            />
            <span className="text-white text-lg font-bold mt-4">Đang mã hóa và tải lên máy chủ...</span>
          </div>
        )}

        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-main,#f8fafc)]">
            Hồ Sơ Xác Minh Học Viên (KYC)
          </h1>
          <p className="text-sm text-[var(--text-muted,#94a3b8)] mt-1">
            Vui lòng điền thông tin và tải lên các bản chụp giấy tờ để phục vụ việc xét duyệt tài khoản
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 1. Thông tin cá nhân */}
          <div className="bg-[var(--card-bg,#0f172a)] border border-[var(--card-border,#1e293b)] rounded-2xl p-6 sm:p-8 shadow-xl">
            <h3 className="text-base font-bold text-sky-400 mb-6 flex items-center gap-2 border-b border-[var(--card-border,#1e293b)] pb-3">
              <FaUserGraduate /> 1. Thông Tin Cá Nhân
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <Input
                label={"Họ và tên đệm"}
                placeholder={"Họ"}
                value={data.Lastname || ""}
                readonly
              />
              <Input
                label={"Tên"}
                placeholder={"Tên"}
                value={data.Firstname || ""}
                readonly
              />
              <Input
                label={"Số điện thoại liên hệ"}
                placeholder={"0912345678"}
                value={formData.Phone}
                onChange={(e) => handleInputChange("Phone", e.target.value)}
              />
              <Input
                label={"Địa chỉ cư trú"}
                placeholder={"Quận / Huyện, Tỉnh / Thành phố"}
                value={formData.Address}
                onChange={(e) => handleInputChange("Address", e.target.value)}
              />
              <Input
                label={"Trình độ học vấn cao nhất"}
                placeholder={"Ví dụ: Lớp 12, Đã tốt nghiệp THPT..."}
                value={formData.Highesteducation}
                onChange={(e) => handleInputChange("Highesteducation", e.target.value)}
              />
              <div>
                <InputUpload
                  label={"Ảnh Căn cước công dân (CCCD) / Định danh"}
                  placeholder={"Tải lên ảnh CCCD"}
                  value={formData.Aadhaar}
                  onChange={(e) => handleFileChange("Aadhaar", e)}
                />
              </div>
            </div>
          </div>

          {/* 2. Thông tin học bạ / trường học */}
          <div className="bg-[var(--card-bg,#0f172a)] border border-[var(--card-border,#1e293b)] rounded-2xl p-6 sm:p-8 shadow-xl">
            <h3 className="text-base font-bold text-indigo-400 mb-6 flex items-center gap-2 border-b border-[var(--card-border,#1e293b)] pb-3">
              <FaGraduationCap /> 2. Thông Tin Học Vấn & Bảng Điểm
            </h3>

            {/* Bậc THCS */}
            <div className="p-4 sm:p-5 rounded-xl bg-[var(--bg-surface-secondary,#1e293b)] border border-[var(--card-border,#334155)] mb-6">
              <div className="font-bold text-sm text-[var(--text-main,#f8fafc)] mb-4">
                Bậc Trung Học Cơ Sở (THCS / Lớp 9)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label={"Trường THCS"}
                  placeholder={"Tên trường THCS..."}
                  value={formData.SecondarySchool}
                  onChange={(e) => handleInputChange("SecondarySchool", e.target.value)}
                />
                <Input
                  label={"Điểm TB / Xếp loại"}
                  placeholder={"Ví dụ: 8.5 / Giỏi"}
                  value={formData.SecondaryMarks}
                  onChange={(e) => handleInputChange("SecondaryMarks", e.target.value)}
                />
                <div>
                  <InputUpload
                    label={"Ảnh học bạ THCS"}
                    placeholder={"Tải lên học bạ THCS"}
                    value={formData.Secondary}
                    onChange={(e) => handleFileChange("Secondary", e)}
                  />
                </div>
              </div>
            </div>

            {/* Bậc THPT */}
            <div className="p-4 sm:p-5 rounded-xl bg-[var(--bg-surface-secondary,#1e293b)] border border-[var(--card-border,#334155)]">
              <div className="font-bold text-sm text-[var(--text-main,#f8fafc)] mb-4">
                Bậc Trung Học Phổ Thông (THPT / Lớp 12)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label={"Trường THPT"}
                  placeholder={"Tên trường THPT..."}
                  value={formData.HigherSchool}
                  onChange={(e) => handleInputChange("HigherSchool", e.target.value)}
                />
                <Input
                  label={"Điểm TB / Tốt nghiệp"}
                  placeholder={"Ví dụ: 9.0"}
                  value={formData.HigherMarks}
                  onChange={(e) => handleInputChange("HigherMarks", e.target.value)}
                />
                <div>
                  <InputUpload
                    label={"Ảnh học bạ THPT"}
                    placeholder={"Tải lên học bạ THPT"}
                    value={formData.Higher}
                    onChange={(e) => handleFileChange("Higher", e)}
                  />
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm font-semibold text-center">
              ⚠️ {error}
            </div>
          )}

          <div className="flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 rounded-xl text-sm font-semibold bg-[var(--bg-surface-secondary,#1e293b)] text-[var(--text-muted,#94a3b8)] hover:text-white transition"
            >
              Hủy Bỏ
            </button>
            <button
              type="submit"
              className="px-8 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-lg shadow-sky-500/25 hover:from-sky-600 hover:to-indigo-700 transition flex items-center gap-2"
            >
              <FaCheckCircle />
              <span>Gửi Hồ Sơ Xác Minh</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default StudentDocument;
