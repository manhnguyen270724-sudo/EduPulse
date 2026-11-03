import React, { useState, useEffect } from "react";
import Input from "../DocumentVerification/InputComponent/Input.jsx";
import InputUpload from "../DocumentVerification/Inputupload/InputUpload.jsx";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { RotatingLines } from "react-loader-spinner";
import { FaChalkboardTeacher, FaGraduationCap, FaArrowLeft, FaCheckCircle } from "react-icons/fa";
import toast from "react-hot-toast";

const TeacherDocument = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const { Data } = useParams();
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(`/api/teacher/TeacherDocument/${Data}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Không thể tải thông tin giảng viên");
        }

        const user = await response.json();
        setData(user.data);
      } catch (error) {
        setError(error.message);
      }
    };

    getData();
  }, [Data]);

  const [formData, setFormData] = useState({
    Phone: data.Phone || "",
    Address: data.Address || "",
    Experience: data.Experience || "",
    SecondarySchool: data.SecondarySchool || "",
    SecondaryMarks: data.SecondaryMarks || "",
    HigherSchool: data.HigherSchool || "",
    HigherMarks: data.HigherMarks || "",
    UGcollege: data.UGcollege || "",
    UGmarks: data.UGmarks || "",
    PGcollege: data.PGcollege || "",
    PGmarks: data.PGmarks || "",
    Aadhaar: null,
    Secondary: null,
    Higher: null,
    UG: null,
    PG: null,
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
      const response = await fetch(`/api/teacher/verification/${Data}`, {
        method: "POST",
        body: formDataObj,
      });

      const responseData = await response.json();
      setLoader(false);

      if (!response.ok) {
        setError(responseData.message || "Tải lên tài liệu thất bại");
        toast.error(responseData.message || "Tải lên tài liệu thất bại");
      } else {
        toast.success("Nộp hồ sơ năng lực thành công!");
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
          <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/25 ml-2">
            Hồ Sơ Năng Lực Giảng Viên
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
            <span className="text-white text-lg font-bold mt-4">Đang xử lý hồ sơ giảng viên...</span>
          </div>
        )}

        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-main,#f8fafc)]">
            Thẩm Định Năng Lực Giảng Dạy (KYC)
          </h1>
          <p className="text-sm text-[var(--text-muted,#94a3b8)] mt-1">
            Vui lòng cung cấp văn bằng, chứng chỉ sư phạm và căn cước công dân để Quản trị viên kích hoạt quyền mở lớp
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 1. Thông tin cá nhân */}
          <div className="bg-[var(--card-bg,#0f172a)] border border-[var(--card-border,#1e293b)] rounded-2xl p-6 sm:p-8 shadow-xl">
            <h3 className="text-base font-bold text-sky-400 mb-6 flex items-center gap-2 border-b border-[var(--card-border,#1e293b)] pb-3">
              <FaChalkboardTeacher /> 1. Thông Tin Giảng Viên & Kinh Nghiệm
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
                label={"Địa chỉ công tác / Cư trú"}
                placeholder={"Quận / Huyện, Tỉnh / Thành phố"}
                value={formData.Address}
                onChange={(e) => handleInputChange("Address", e.target.value)}
              />
              <Input
                label={"Số năm kinh nghiệm giảng dạy"}
                placeholder={"Ví dụ: 5"}
                value={formData.Experience}
                onChange={(e) => handleInputChange("Experience", e.target.value)}
              />
              <div>
                <InputUpload
                  label={"Ảnh Căn cước công dân (CCCD)"}
                  placeholder={"Tải lên ảnh CCCD"}
                  value={formData.Aadhaar}
                  onChange={(e) => handleFileChange("Aadhaar", e)}
                />
              </div>
            </div>
          </div>

          {/* 2. Thông tin học vấn & bằng cấp */}
          <div className="bg-[var(--card-bg,#0f172a)] border border-[var(--card-border,#1e293b)] rounded-2xl p-6 sm:p-8 shadow-xl">
            <h3 className="text-base font-bold text-indigo-400 mb-6 flex items-center gap-2 border-b border-[var(--card-border,#1e293b)] pb-3">
              <FaGraduationCap /> 2. Văn Bằng & Học Vị Chuyên Môn
            </h3>

            {/* Bằng Đại học (UG) */}
            <div className="p-4 sm:p-5 rounded-xl bg-[var(--bg-surface-secondary,#1e293b)] border border-[var(--card-border,#334155)] mb-6">
              <div className="font-bold text-sm text-[var(--text-main,#f8fafc)] mb-4">
                Bằng Tốt Nghiệp Đại Học (Cử Nhân / Kỹ Sư) *
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label={"Trường Đại Học tốt nghiệp"}
                  placeholder={"Ví dụ: ĐH Sư Phạm Hà Nội..."}
                  value={formData.UGcollege}
                  onChange={(e) => handleInputChange("UGcollege", e.target.value)}
                />
                <Input
                  label={"Điểm TB / Xếp loại tốt nghiệp"}
                  placeholder={"Ví dụ: 8.5 / Giỏi"}
                  value={formData.UGmarks}
                  onChange={(e) => handleInputChange("UGmarks", e.target.value)}
                />
                <div>
                  <InputUpload
                    label={"Ảnh Bằng Cử Nhân / Bảng điểm"}
                    placeholder={"Tải lên bằng Đại học"}
                    value={formData.UG}
                    onChange={(e) => handleFileChange("UG", e)}
                  />
                </div>
              </div>
            </div>

            {/* Bằng Sau đại học (PG) */}
            <div className="p-4 sm:p-5 rounded-xl bg-[var(--bg-surface-secondary,#1e293b)] border border-[var(--card-border,#334155)] mb-6">
              <div className="font-bold text-sm text-[var(--text-main,#f8fafc)] mb-4">
                Bằng Sau Đại Học (Thạc Sĩ / Tiến Sĩ - nếu có)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label={"Trường đào tạo Sau Đại Học"}
                  placeholder={"Tên trường hoặc viện nghiên cứu..."}
                  value={formData.PGcollege}
                  onChange={(e) => handleInputChange("PGcollege", e.target.value)}
                />
                <Input
                  label={"Điểm / Xếp loại"}
                  placeholder={"Ví dụ: 9.0"}
                  value={formData.PGmarks}
                  onChange={(e) => handleInputChange("PGmarks", e.target.value)}
                />
                <div>
                  <InputUpload
                    label={"Ảnh Bằng Thạc Sĩ / Tiến Sĩ"}
                    placeholder={"Tải lên bằng Sau ĐH"}
                    value={formData.PG}
                    onChange={(e) => handleFileChange("PG", e)}
                  />
                </div>
              </div>
            </div>

            {/* THPT */}
            <div className="p-4 sm:p-5 rounded-xl bg-[var(--bg-surface-secondary,#1e293b)] border border-[var(--card-border,#334155)]">
              <div className="font-bold text-sm text-[var(--text-main,#f8fafc)] mb-4">
                Bằng Tốt Nghiệp THPT
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label={"Trường THPT"}
                  placeholder={"Trường THPT đã học..."}
                  value={formData.HigherSchool}
                  onChange={(e) => handleInputChange("HigherSchool", e.target.value)}
                />
                <Input
                  label={"Điểm TB"}
                  placeholder={"Điểm tốt nghiệp..."}
                  value={formData.HigherMarks}
                  onChange={(e) => handleInputChange("HigherMarks", e.target.value)}
                />
                <div>
                  <InputUpload
                    label={"Ảnh bằng THPT"}
                    placeholder={"Tải lên bằng THPT"}
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
              <span>Gửi Hồ Sơ Xét Duyệt</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default TeacherDocument;
