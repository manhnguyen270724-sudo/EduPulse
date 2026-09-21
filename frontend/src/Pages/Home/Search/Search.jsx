import React, { useEffect, useState } from 'react';
import { NavLink, useParams, useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../../Footer/Footer';
import '../Landing/Landing.css';
import { FaSearch, FaCheckCircle, FaVideo, FaTimes, FaGraduationCap, FaCalendarAlt, FaClock } from 'react-icons/fa';

function Search() {
  const { subject } = useParams();
  const [data, setData] = useState(subject || '');
  const [course, setCourse] = useState([]);
  const [openTM, setOpenTM] = useState(false);
  const [Tdec, setTeacherDetails] = useState(null);
  const [tname, setTname] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const daysName = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];

  const teacherImages = {
    math: "https://res.cloudinary.com/elearning-platform-vn/image/upload/v1789924688/edupulse/teachers/teacher_nguyen_van_an.jpg",
    physics: "https://res.cloudinary.com/elearning-platform-vn/image/upload/v1789924689/edupulse/teachers/teacher_tran_thi_mai.jpg",
    chemistry: "https://res.cloudinary.com/elearning-platform-vn/image/upload/v1789924691/edupulse/teachers/teacher_le_hoang_long.jpg",
    biology: "https://res.cloudinary.com/elearning-platform-vn/image/upload/v1789924692/edupulse/teachers/teacher_pham_thi_lan.jpg",
    computer: "https://res.cloudinary.com/elearning-platform-vn/image/upload/v1789924693/edupulse/teachers/teacher_do_minh_duc.jpg",
    ielts: "https://res.cloudinary.com/elearning-platform-vn/image/upload/v1789924692/edupulse/teachers/teacher_pham_thi_lan.jpg",
    "ai-data": "https://res.cloudinary.com/elearning-platform-vn/image/upload/v1789924693/edupulse/teachers/teacher_do_minh_duc.jpg",
    finance: "https://res.cloudinary.com/elearning-platform-vn/image/upload/v1789924689/edupulse/teachers/teacher_tran_thi_mai.jpg"
  };

  const SearchTeacher = async (querySubject) => {
    const subToSearch = (querySubject || data || '').toLowerCase().trim();
    if (!subToSearch) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/course/${subToSearch}`);
      const response = await res.json();
      if (response.statusCode === 200 || response.data) {
        setCourse(response.data || []);
      } else {
        setCourse([]);
      }
    } catch (err) {
      console.error(err);
      setCourse([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (subject) {
      setData(subject);
      SearchTeacher(subject);
    }
  }, [subject]);

  const openTeacherDec = async (id, fname, lname, sub) => {
    setTname({ fname, lname, sub });

    try {
      const response = await fetch('/api/teacher/teacherdocuments', {
        method: 'POST',
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ teacherID: id }),
      });

      const res = await response.json();
      setTeacherDetails(res.data);
      setOpenTM(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="edupulse-landing">
      <Header />

      <section className="edupulse-hero" style={{ paddingBottom: '30px' }}>
        <div className="hero-glow-bg hero-glow-1"></div>
        <div className="hero-glow-bg hero-glow-2"></div>

        <div className="section-header text-center" style={{ marginTop: '20px' }}>
          <span className="section-tag">KẾT QUẢ TÌM KIẾM</span>
          <h1 className="hero-title" style={{ fontSize: '2.5rem' }}>
            Khóa Học Môn: <span className="gradient-text uppercase">{data || subject}</span>
          </h1>
          <p className="section-desc">Danh sách các lớp học trực tuyến và Giảng viên phụ trách môn học bạn quan tâm.</p>
        </div>

        {/* Search Bar */}
        <div className="hero-search-box" style={{ margin: '0 auto 40px' }}>
          <FaSearch className="search-icon" />
          <input 
            type="text" 
            placeholder="Tìm môn học khác (math, physics, chemistry, biology, computer)..." 
            value={data} 
            onChange={(e) => setData(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && SearchTeacher()}
          />
          <button className="hero-search-btn" onClick={() => SearchTeacher()}>
            Tìm Kiếm
          </button>
        </div>
      </section>

      {/* Courses List */}
      <section className="edupulse-courses-section" style={{ minHeight: '50vh', paddingTop: '0' }}>
        <div className="courses-grid-container">
          {loading ? (
            <div className="courses-loading">
              <div className="spinner"></div>
              <p>Đang tìm kiếm khóa học...</p>
            </div>
          ) : course && course.length > 0 ? (
            <div className="faculty-cards-grid">
              {course.map((Data) => {
                const teacherImg = Data.enrolledteacher?.Avatar || teacherImages[Data.coursename?.toLowerCase()] || "https://res.cloudinary.com/elearning-platform-vn/image/upload/v1789924688/edupulse/teachers/teacher_nguyen_van_an.jpg";
                return (
                  <div key={Data._id} className="faculty-card" style={{ width: '420px' }}>
                    <div className="faculty-card-top">
                      <div className="faculty-avatar-box">
                        <img src={teacherImg} alt={Data.enrolledteacher?.Firstname} className="faculty-avatar" />
                        <span className="status-online-dot"></span>
                      </div>
                      <div className="faculty-info">
                        <h4 
                          className="faculty-name cursor-pointer hover:text-cyan-400 transition-colors"
                          onClick={() => openTeacherDec(
                            Data.enrolledteacher?.Teacherdetails, 
                            Data.enrolledteacher?.Firstname, 
                            Data.enrolledteacher?.Lastname, 
                            Data.coursename
                          )}
                          title="Click xem chi tiết bằng cấp giảng viên"
                        >
                          {Data.enrolledteacher?.Lastname} {Data.enrolledteacher?.Firstname}
                        </h4>
                        <span className="faculty-email">{Data.enrolledteacher?.Email}</span>
                        <div className="faculty-badge-verified">
                          <FaCheckCircle className="text-cyan-400 text-xs" />
                          <span>Giảng viên thẩm định</span>
                        </div>
                      </div>
                    </div>

                    <div className="faculty-card-body">
                      <div className="course-title-tag">
                        Môn học: <span className="uppercase font-bold text-cyan-300">{Data.coursename}</span>
                        <span className="text-xs text-slate-400 ml-2">({Data.enrolledStudent?.length || 0}/20 Học viên)</span>
                      </div>
                      <p className="course-desc-text">
                        {Data.description}
                      </p>

                      {Data.schedule && Data.schedule.length > 0 && (
                        <div className="course-live-schedule" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
                          <div className="flex items-center gap-2 font-semibold text-cyan-300">
                            <FaClock className="text-xs" /> Lịch học định kỳ:
                          </div>
                          <div className="text-xs text-slate-300">
                            {Data.schedule.map((daytime, idx) => (
                              <span key={idx} className="mr-2">
                                • {daysName[daytime.day]} ({Math.floor(daytime.starttime / 60)}:00 - {Math.floor(daytime.endtime / 60)}:00)
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="faculty-card-footer" style={{ display: 'flex', gap: '10px' }}>
                      <button 
                        className="btn-join-course" 
                        style={{ flex: 1 }}
                        onClick={() => openTeacherDec(
                          Data.enrolledteacher?.Teacherdetails, 
                          Data.enrolledteacher?.Firstname, 
                          Data.enrolledteacher?.Lastname, 
                          Data.coursename
                        )}
                      >
                        Hồ Sơ Giảng Viên
                      </button>
                      <button 
                        className="hero-search-btn" 
                        style={{ flex: 1, padding: '12px' }}
                        onClick={() => navigate('/login')}
                      >
                        Đăng Ký Học
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="courses-empty">
              <p>Không tìm thấy khóa học nào cho từ khóa "{data}".</p>
              <NavLink to="/courses" className="btn-primary-glow inline-block mt-4">
                Xem Tất Cả Khóa Học
              </NavLink>
            </div>
          )}
        </div>
      </section>

      {/* Teacher Profile Modal */}
      {openTM && Tdec && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-[#0b142c] border border-cyan-500/30 w-full max-w-lg rounded-2xl p-6 relative shadow-2xl text-white">
            <button 
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              onClick={() => setOpenTM(false)}
            >
              <FaTimes />
            </button>

            <div className="text-center mb-5">
              <span className="section-tag">{tname.sub?.toUpperCase()}</span>
              <h3 className="text-2xl font-bold text-white mt-1">Hồ Sơ Giảng Viên</h3>
              <p className="text-cyan-400 font-semibold">{tname.lname} {tname.fname}</p>
            </div>

            <div className="space-y-3 text-sm text-slate-300 bg-white/5 p-4 rounded-xl border border-white/10">
              <p><span className="font-bold text-white">Học vấn:</span> Tốt nghiệp {Tdec.PGcollege} ({Tdec.PGmarks} điểm)</p>
              <p><span className="font-bold text-white">Cử nhân:</span> {Tdec.UGcollege} ({Tdec.UGmarks} điểm)</p>
              <p><span className="font-bold text-white">Kinh nghiệm:</span> {Tdec.Experience} năm giảng dạy chuyên sâu</p>
              <p><span className="font-bold text-white">Khu vực:</span> {Tdec.Address}</p>
            </div>

            <button 
              className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-lg hover:shadow-cyan-500/30 transition-all"
              onClick={() => {
                setOpenTM(false);
                navigate('/login');
              }}
            >
              Đăng Ký Tham Gia Lớp Của Giảng Viên
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default Search;